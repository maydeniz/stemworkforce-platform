// ===========================================
// serve-ad Edge Function
// High-performance ad serving via in-memory campaign cache.
//
// Design principles:
//   - Single DB read (cache row) on the hot path — target < 50 ms P99
//   - Cache refreshed inline if stale (> 5 min) using service-role client
//   - Frequency cap + budget pacing checked via targeted DB calls
//   - Impression recorded fire-and-forget (no await) to keep response fast
//   - IP rate limiter (30 req/IP/min) via Deno KV
//   - CORS restricted to ALLOWED_ORIGIN env var (never wildcard)
//   - EEOC/FTC-safe targeting dimensions only
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdCreative {
  id: string
  headline: string
  body_text: string
  cta_text: string
  image_url: string | null
  click_url: string
}

interface CachedCampaign {
  id: string
  name: string
  status: string
  placement_key: string            // 'all' means any placement
  target_locations: string[] | null  // 2-letter state codes; null = no geo filter
  cpm_rate: number
  budget_daily: number | null
  budget_total: number | null
  spent_today: number
  frequency_cap_per_user: number   // default 3
  frequency_cap_hours: number      // default 24
  geo_zone_resolved_zips: string[] | null  // from geo_zones.resolved_zip_codes
  target_roles: string[] | null
  target_clearance_levels: string[] | null
  target_industries: string[] | null
  ad_disclosure_text: string
  start_date: string | null        // ISO date string
  end_date: string | null
  creative: AdCreative
}

interface RequestBody {
  placement_key: string
  user_id?: string
  context?: {
    page_type?: string
    industry?: string
    user_state?: string
    user_zip?: string
    user_metro_cbsa?: string
    user_role?: string
    user_clearance?: string
    user_education?: string
  }
}

interface AdResponse {
  ad: {
    campaign_id: string
    creative_id: string
    headline: string
    body_text: string
    cta_text: string
    image_url: string | null
    click_url: string
    disclosure_text: string
    impression_id: string
  } | null
  served: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 5 * 60 * 1000          // 5 minutes
const RATE_LIMIT_WINDOW_MS = 60_000          // 1 minute
const RATE_LIMIT_MAX = 30                    // max 30 req/IP/minute

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------

function buildCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? 'https://stemworkforce.net'
  const requestOrigin = req.headers.get('origin') ?? ''

  const isAllowed =
    requestOrigin === allowedOrigin ||
    requestOrigin.endsWith('.stemworkforce.net') ||
    requestOrigin.endsWith('.stemworkforce.app')

  return {
    'Access-Control-Allow-Origin': isAllowed ? requestOrigin : allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

// ---------------------------------------------------------------------------
// Supabase clients
// Service-role client is used for cache writes and impression inserts (bypass RLS).
// ---------------------------------------------------------------------------

function makeServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  )
}

// ---------------------------------------------------------------------------
// Campaign cache refresh
// Queries ad_campaigns JOIN ad_creatives and rebuilds the cache row.
// Called inline when the cache is missing or stale.
// ---------------------------------------------------------------------------

async function refreshCampaignCache(
  db: SupabaseClient
): Promise<CachedCampaign[]> {
  // Build a flat structure: one row per active campaign + its first active creative.
  // We use a single RPC-style query via the REST API; Supabase JS can JOIN via
  // embed syntax: `ad_creatives!inner(...)`.
  const { data, error } = await db
    .from('ad_campaigns')
    .select(`
      id,
      status,
      campaign_name,
      placement_key,
      target_locations,
      target_roles,
      target_clearance_levels,
      target_industries,
      cpm_rate,
      budget_daily,
      budget_total,
      spent_today,
      frequency_cap_per_user,
      frequency_cap_hours,
      ad_disclosure_text,
      start_date,
      end_date,
      audience_segment_id,
      geo_zone_id,
      audience_segments (
        target_roles,
        target_clearance_levels,
        target_industries,
        target_education_levels
      ),
      geo_zones (
        resolved_zip_codes
      ),
      ad_creatives (
        id,
        headline,
        description,
        cta_text,
        image_url,
        click_url,
        is_active,
        traffic_weight
      )
    `)
    .eq('status', 'active')
    .order('cpm_rate', { ascending: false })

  if (error) {
    console.error('[serve-ad] Cache refresh query error:', error.message)
    return []
  }

  // Flatten: one entry per campaign, picking first active creative
  const campaigns: CachedCampaign[] = []

  for (const row of (data ?? [])) {
    const creatives = (row.ad_creatives ?? []) as Array<{
      id: string
      headline: string | null
      description: string | null
      cta_text: string | null
      image_url: string | null
      click_url: string
      is_active: boolean
      traffic_weight: number
    }>

    const activeCreatives = creatives
      .filter(c => c.is_active)
      .sort((a, b) => (b.traffic_weight ?? 100) - (a.traffic_weight ?? 100))

    if (activeCreatives.length === 0) continue

    const creative = activeCreatives[0]

    // Merge audience_segment targeting if present
    const seg = row.audience_segments as {
      target_roles?: string[] | null
      target_clearance_levels?: string[] | null
      target_industries?: string[] | null
    } | null

    const geoZone = row.geo_zones as {
      resolved_zip_codes?: string[] | null
    } | null

    campaigns.push({
      id: row.id,
      name: row.campaign_name,
      status: row.status,
      placement_key: row.placement_key ?? 'all',
      target_locations: row.target_locations ?? null,
      cpm_rate: Number(row.cpm_rate ?? 0),
      budget_daily: row.budget_daily ? Number(row.budget_daily) : null,
      budget_total: row.budget_total ? Number(row.budget_total) : null,
      spent_today: Number(row.spent_today ?? 0),
      frequency_cap_per_user: row.frequency_cap_per_user ?? 3,
      frequency_cap_hours: row.frequency_cap_hours ?? 24,
      geo_zone_resolved_zips: geoZone?.resolved_zip_codes ?? null,
      // audience_segment overrides campaign-level if present
      target_roles: seg?.target_roles ?? row.target_roles ?? null,
      target_clearance_levels: seg?.target_clearance_levels ?? row.target_clearance_levels ?? null,
      target_industries: seg?.target_industries ?? row.target_industries ?? null,
      ad_disclosure_text: row.ad_disclosure_text ?? 'Sponsored',
      start_date: row.start_date ?? null,
      end_date: row.end_date ?? null,
      creative: {
        id: creative.id,
        headline: creative.headline ?? '',
        body_text: creative.description ?? '',
        cta_text: creative.cta_text ?? 'Learn More',
        image_url: creative.image_url ?? null,
        click_url: creative.click_url,
      },
    })
  }

  // Persist to cache table (service-role bypasses RLS)
  const { error: upsertErr } = await db
    .from('ad_campaign_cache')
    .upsert({
      id: 1,
      cache_json: campaigns,
      cached_at: new Date().toISOString(),
      campaign_count: campaigns.length,
    })

  if (upsertErr) {
    console.error('[serve-ad] Cache upsert error:', upsertErr.message)
  }

  return campaigns
}

// ---------------------------------------------------------------------------
// Fetch campaigns from cache (refresh if stale)
// ---------------------------------------------------------------------------

async function getCampaigns(db: SupabaseClient): Promise<CachedCampaign[]> {
  const { data, error } = await db
    .from('ad_campaign_cache')
    .select('cache_json, cached_at')
    .eq('id', 1)
    .single()

  if (error || !data) {
    console.warn('[serve-ad] Cache miss — refreshing inline')
    return refreshCampaignCache(db)
  }

  const cacheAge = Date.now() - new Date(data.cached_at).getTime()
  if (cacheAge > CACHE_TTL_MS) {
    console.info('[serve-ad] Cache stale — refreshing inline')
    return refreshCampaignCache(db)
  }

  const campaigns = data.cache_json as CachedCampaign[]
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
    return refreshCampaignCache(db)
  }

  return campaigns
}

// ---------------------------------------------------------------------------
// In-memory targeting filter
// ---------------------------------------------------------------------------

function matchesCampaign(
  campaign: CachedCampaign,
  placementKey: string,
  context: RequestBody['context']
): boolean {
  const now = new Date()

  // 1. Date range
  if (campaign.start_date) {
    const start = new Date(campaign.start_date)
    start.setUTCHours(0, 0, 0, 0)
    if (now < start) return false
  }
  if (campaign.end_date) {
    const end = new Date(campaign.end_date)
    end.setUTCHours(23, 59, 59, 999)
    if (now > end) return false
  }

  // 2. Placement
  if (campaign.placement_key !== 'all' && campaign.placement_key !== placementKey) {
    return false
  }

  // 3. Geo: zip code list from resolved geo_zone takes priority
  if (campaign.geo_zone_resolved_zips && campaign.geo_zone_resolved_zips.length > 0) {
    if (!context?.user_zip || !campaign.geo_zone_resolved_zips.includes(context.user_zip)) {
      return false
    }
  } else if (campaign.target_locations && campaign.target_locations.length > 0) {
    // Fall back to state-level targeting
    const hasNational = campaign.target_locations.some(
      l => l.toLowerCase() === 'national' || l === '*'
    )
    if (!hasNational) {
      if (!context?.user_state || !campaign.target_locations.includes(context.user_state)) {
        return false
      }
    }
  }
  // else: no geo filter — always matches

  // 4. Role
  if (campaign.target_roles && campaign.target_roles.length > 0) {
    if (!context?.user_role || !campaign.target_roles.includes(context.user_role)) {
      return false
    }
  }

  // 5. Clearance
  if (campaign.target_clearance_levels && campaign.target_clearance_levels.length > 0) {
    if (!context?.user_clearance || !campaign.target_clearance_levels.includes(context.user_clearance)) {
      return false
    }
  }

  // 6. Industry
  if (campaign.target_industries && campaign.target_industries.length > 0) {
    if (!context?.industry || !campaign.target_industries.includes(context.industry)) {
      return false
    }
  }

  return true
}

// ---------------------------------------------------------------------------
// Frequency cap check (DB call)
// Returns true = under cap, false = capped
// ---------------------------------------------------------------------------

async function checkFrequencyCap(
  db: SupabaseClient,
  userId: string,
  campaignId: string,
  capPerUser: number,
  capHours: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - capHours * 60 * 60 * 1000).toISOString()

  const { count, error } = await db
    .from('ad_impressions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('campaign_id', campaignId)
    .gte('created_at', windowStart)

  if (error) {
    // On error, allow serving (fail open — better to over-serve than under-serve)
    console.warn('[serve-ad] Frequency cap check error:', error.message)
    return true
  }

  return (count ?? 0) < capPerUser
}

// ---------------------------------------------------------------------------
// Budget pacing check via RPC (DB call)
// Returns true = can serve, false = pacing hold
// ---------------------------------------------------------------------------

async function checkBudgetPacing(
  db: SupabaseClient,
  campaignId: string
): Promise<boolean> {
  const { data, error } = await db.rpc('check_budget_pacing', {
    p_campaign_id: campaignId,
  })

  if (error) {
    console.warn('[serve-ad] Budget pacing RPC error:', error.message)
    return true // fail open
  }

  return Boolean(data)
}

// ---------------------------------------------------------------------------
// Click fraud check (fire-and-forget update on the impression row)
// We call the RPC and update the impression row's is_fraud_flagged asynchronously.
// ---------------------------------------------------------------------------

async function flagFraudIfDetected(
  db: SupabaseClient,
  impressionId: string,
  ipAddress: string,
  userId: string,
  campaignId: string
): Promise<void> {
  try {
    const { data: isLegitimate } = await db.rpc('check_click_fraud', {
      p_ip_address: ipAddress,
      p_user_id: userId,
      p_campaign_id: campaignId,
    })

    if (isLegitimate === false) {
      await db
        .from('ad_impressions')
        .update({
          is_fraud_flagged: true,
          fraud_reason: 'check_click_fraud_rpc',
        })
        .eq('id', impressionId)

      // Also bump the campaign counter
      await db.rpc('_ad_increment_fraud_counter', { p_campaign_id: campaignId })
        .then(() => { /* no-op if RPC doesn't exist yet */ })
    }
  } catch (err) {
    console.warn('[serve-ad] Fraud check error (non-critical):', (err as Error).message)
  }
}

// ---------------------------------------------------------------------------
// Record impression (fire-and-forget)
// ---------------------------------------------------------------------------

function recordImpressionAsync(
  db: SupabaseClient,
  impressionId: string,
  campaign: CachedCampaign,
  userId: string | null,
  ipAddress: string,
  userAgent: string,
  context: RequestBody['context']
): void {
  const cost = campaign.cpm_rate / 1000

  db.from('ad_impressions').insert({
    id: impressionId,
    campaign_id: campaign.id,
    creative_id: campaign.creative.id,
    user_id: userId ?? null,
    ip_address: ipAddress,
    user_agent: userAgent,
    industry_context: context?.industry ?? null,
    user_state: context?.user_state ?? null,
    user_zip_code: context?.user_zip ?? null,
    user_metro_cbsa: context?.user_metro_cbsa ?? null,
    user_type: context?.user_role ?? null,
    cost,
    ad_disclosed_as: campaign.ad_disclosure_text,
    consent_granted: false, // updated client-side via consent API
    impression_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  }).then(({ error }) => {
    if (error) {
      console.error('[serve-ad] Impression insert error:', error.message)
    } else if (userId) {
      // Asynchronously check for click fraud on this impression
      flagFraudIfDetected(db, impressionId, ipAddress, userId, campaign.id)
    }
  })
}

// ---------------------------------------------------------------------------
// IP rate limiter via Deno KV
// Returns true = allowed, false = rate limited
// ---------------------------------------------------------------------------

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const kv = await Deno.openKv()
    const rlKey = ['serve_ad_rl', ip]
    const now = Date.now()
    const entry = await kv.get<{ count: number; windowStart: number }>(rlKey)
    const current = entry.value ?? { count: 0, windowStart: now }

    if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
      // New window — reset
      await kv.set(rlKey, { count: 1, windowStart: now }, { expireIn: RATE_LIMIT_WINDOW_MS })
      return true
    }

    if (current.count >= RATE_LIMIT_MAX) {
      return false
    }

    await kv.set(
      rlKey,
      { count: current.count + 1, windowStart: current.windowStart },
      { expireIn: RATE_LIMIT_WINDOW_MS }
    )
    return true
  } catch {
    // KV unavailable — allow request (fail open)
    console.warn('[serve-ad] Rate limiter KV unavailable')
    return true
  }
}

// ---------------------------------------------------------------------------
// JSON response helpers
// ---------------------------------------------------------------------------

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  })
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = buildCorsHeaders(req)

  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only POST accepted
  if (req.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed' },
      405,
      corsHeaders
    )
  }

  // 2. IP rate limiter
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const allowed = await checkRateLimit(ip)
  if (!allowed) {
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
      { ...corsHeaders, 'Retry-After': '60' }
    )
  }

  // 3. Parse request body
  let body: RequestBody
  try {
    body = await req.json() as RequestBody
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, corsHeaders)
  }

  if (!body.placement_key || typeof body.placement_key !== 'string') {
    return jsonResponse({ error: 'placement_key is required' }, 400, corsHeaders)
  }

  const { placement_key, user_id, context } = body
  const userAgent = req.headers.get('user-agent') ?? ''

  // 4. Service-role DB client
  const db = makeServiceClient()

  // 5. Fetch campaigns from cache (refresh inline if stale)
  let campaigns: CachedCampaign[]
  try {
    campaigns = await getCampaigns(db)
  } catch (err) {
    console.error('[serve-ad] Fatal cache fetch error:', (err as Error).message)
    return jsonResponse({ ad: null, served: false }, 200, corsHeaders)
  }

  // 6. In-memory filtering
  const now = new Date()

  const candidates = campaigns.filter(c => {
    if (c.status !== 'active') return false
    return matchesCampaign(c, placement_key, context)
  })

  if (candidates.length === 0) {
    return jsonResponse({ ad: null, served: false }, 200, corsHeaders)
  }

  // 7. Frequency cap + budget pacing (DB calls — parallel where possible)
  const eligible: CachedCampaign[] = []

  // Run cap checks for all candidates in parallel
  const capChecks = candidates.map(async campaign => {
    // Frequency cap — only for authenticated users
    if (user_id) {
      const underCap = await checkFrequencyCap(
        db,
        user_id,
        campaign.id,
        campaign.frequency_cap_per_user,
        campaign.frequency_cap_hours
      )
      if (!underCap) return null
    }

    // Budget pacing
    const canServe = await checkBudgetPacing(db, campaign.id)
    if (!canServe) return null

    return campaign
  })

  const capResults = await Promise.all(capChecks)
  for (const result of capResults) {
    if (result !== null) eligible.push(result)
  }

  if (eligible.length === 0) {
    return jsonResponse({ ad: null, served: false }, 200, corsHeaders)
  }

  // 8. Sort by CPM descending and pick winner
  eligible.sort((a, b) => b.cpm_rate - a.cpm_rate)
  const winner = eligible[0]

  // 9. Generate impression ID
  const impressionId = crypto.randomUUID()

  // 10. Record impression asynchronously (fire-and-forget — do NOT await)
  recordImpressionAsync(db, impressionId, winner, user_id ?? null, ip, userAgent, context)

  // 11. Return ad creative data
  const response: AdResponse = {
    ad: {
      campaign_id: winner.id,
      creative_id: winner.creative.id,
      headline: winner.creative.headline,
      body_text: winner.creative.body_text,
      cta_text: winner.creative.cta_text,
      image_url: winner.creative.image_url,
      click_url: winner.creative.click_url,
      disclosure_text: winner.ad_disclosure_text || 'Sponsored',
      impression_id: impressionId,
    },
    served: true,
  }

  return jsonResponse(response, 200, corsHeaders)
})
