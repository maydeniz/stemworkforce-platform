// ===========================================
// FEDERATION SYNC EDGE FUNCTION
// Synchronizes data from external sources
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ===========================================
// TYPES
// ===========================================

interface FederatedSource {
  id: string;
  name: string;
  short_name: string;
  type: string;
  website: string;
  integration_method: string;
  api_config: APIConfig | null;
  rss_config: RSSConfig | null;
  provides_jobs: boolean;
  provides_internships: boolean;
  provides_challenges: boolean;
  provides_events: boolean;
  provides_scholarships: boolean;
  industries: string[];
  attribution_required: boolean;
  attribution_text: string | null;
}

interface STEMFilterConfig {
  occupationSeriesCodes?: string[];
  titleKeywords?: {
    required?: string[];
    mustContainAll?: string[];
    exclude?: string[];
  };
  descriptionKeywords?: {
    required?: string[];
    mustContainAll?: string[];
    exclude?: string[];
  };
  allowedIndustries?: string[];
  minSalary?: number;
  requireClearance?: boolean;
  educationLevels?: string[];
}

interface APIConfig {
  baseUrl: string;
  authType: string;
  authConfig?: {
    apiKeyHeader?: string;
    apiKeyValue?: string;
    apiKeyEnvVar?: string;
  };
  endpoints: Record<string, string>;
  rateLimitPerMinute?: number;
  responseMapping: Record<string, unknown>;
  paginationConfig?: {
    type: string;
    limitParam: string;
    pageParam?: string;
    maxItemsPerPage: number;
    maxPages?: number;
  };
  stemFilters?: STEMFilterConfig;
  organizationFilter?: string;
  keyword?: string;
}

interface RSSConfig {
  feedUrl: string;
  feedType: string;
  fieldMapping: Record<string, string>;
  maxItems?: number;
  stemFilters?: STEMFilterConfig;
}

interface SyncResult {
  itemsFetched: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsRemoved: number;
  itemsFailed: number;
  errors: Array<{
    timestamp: string;
    type: string;
    message: string;
    itemId?: string;
  }>;
}

interface FetchedItem {
  externalId: string;
  title: string;
  description?: string;
  shortDescription?: string;
  sourceUrl: string;
  organizationName: string;
  organizationLogoUrl?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  isRemote?: boolean;
  industries?: string[];
  skills?: string[];
  tags?: string[];
  clearanceRequired?: string;
  contentType: 'job' | 'internship' | 'challenge' | 'event' | 'scholarship';
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  prizeAmount?: number;
  registrationDeadline?: string;
  submissionDeadline?: string;
  eventDate?: string;
  eventEndDate?: string;
  postedAt: string;
  expiresAt?: string;
  occupationCode?: string; // For USAJobs - used for STEM filtering
}

// ===========================================
// STEM OCCUPATION CODES (OPM/USAJobs)
// Only jobs in these series will be fetched
// ===========================================

const STEM_OCCUPATION_CODES = [
  // ENGINEERING (0800 Series)
  '0801', '0802', '0803', '0804', '0806', '0808', '0810', '0819',
  '0830', '0840', '0850', '0854', '0855', '0856', '0858', '0861',
  '0871', '0880', '0881', '0890', '0893', '0894', '0895', '0896',

  // PHYSICAL SCIENCES (1300 Series)
  '1301', '1306', '1310', '1311', '1313', '1315', '1316', '1320',
  '1321', '1330', '1340', '1341', '1350', '1360', '1370', '1372',
  '1373', '1380', '1382', '1384',

  // MATHEMATICS & STATISTICS (1500 Series)
  '1501', '1510', '1515', '1520', '1521', '1529', '1530', '1531',
  '1540', '1541', '1550', '1560',

  // INFORMATION TECHNOLOGY (2200 Series)
  '2210',

  // BIOLOGICAL SCIENCES (0400 Series)
  '0401', '0403', '0404', '0405', '0408', '0410', '0413', '0414',
  '0415', '0420', '0430', '0434', '0435', '0436', '0437', '0440',
  '0454', '0455', '0457', '0458', '0459', '0460', '0462', '0470',
  '0471', '0480', '0482', '0485', '0486', '0487',

  // MEDICAL STEM (0600 Series - select)
  '0601', '0602', '0630', '0633', '0640', '0642', '0644', '0645',
  '0646', '0647', '0648', '0649', '0650', '0651', '0660', '0665',
  '0685', '0688', '0690', '0696',

  // CYBERSECURITY / INTEL
  '0132', '0080', '1811',

  // AEROSPACE
  '2181', '2183', '2185',
];

// ===========================================
// US STATE PARSING
// Extracts state code from free-text location strings
// e.g. "San Francisco, CA" -> "CA"
// ===========================================

const US_STATE_CODES: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
};

const VALID_STATE_CODES = new Set(Object.values(US_STATE_CODES));

// Zip code prefix -> state (first 3 digits)
const ZIP_PREFIX_TO_STATE: Record<string, string> = {
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY',
  '900': 'CA', '901': 'CA', '902': 'CA', '903': 'CA', '904': 'CA',
  '941': 'CA', '940': 'CA', '943': 'CA', '945': 'CA', '946': 'CA', '947': 'CA', '948': 'CA', '949': 'CA', '950': 'CA', '951': 'CA',
  '770': 'TX', '771': 'TX', '772': 'TX', '773': 'TX', '750': 'TX', '751': 'TX', '752': 'TX',
  '600': 'IL', '601': 'IL', '602': 'IL', '603': 'IL', '604': 'IL', '606': 'IL',
  '200': 'DC', '201': 'MD', '202': 'DC', '203': 'DC', '204': 'VA', '205': 'WV',
  '980': 'WA', '981': 'WA', '982': 'WA', '983': 'WA', '984': 'WA', '985': 'WA',
  '802': 'CO', '803': 'CO', '804': 'CO', '805': 'CO', '806': 'CO', '807': 'CO', '808': 'CO', '809': 'CO', '800': 'CO', '801': 'CO',
};

function parseLocation(location: string | undefined): { state?: string; city?: string; isRemote: boolean } {
  if (!location) return { isRemote: false };

  const loc = location.trim();
  const lowerLoc = loc.toLowerCase();

  // Check for remote
  const isRemote = /\bremote\b/i.test(loc);

  // Pattern 1: "City, ST" or "City, ST 12345"
  const cityStateMatch = loc.match(/([^,]+),\s*([A-Z]{2})(?:\s+\d{5})?/);
  if (cityStateMatch) {
    const code = cityStateMatch[2];
    if (VALID_STATE_CODES.has(code)) {
      return { state: code, city: cityStateMatch[1].trim(), isRemote };
    }
  }

  // Pattern 2: "City, State Name" (full state name)
  const cityFullStateMatch = loc.match(/([^,]+),\s*(.+)/);
  if (cityFullStateMatch) {
    const stateName = cityFullStateMatch[2].trim().toLowerCase()
      .replace(/\s*\d{5}.*$/, '') // strip zip
      .replace(/,?\s*(us|usa|united states)$/i, ''); // strip country
    if (US_STATE_CODES[stateName]) {
      return { state: US_STATE_CODES[stateName], city: cityFullStateMatch[1].trim(), isRemote };
    }
  }

  // Pattern 3: standalone 2-letter state code
  const stateOnly = loc.match(/^([A-Z]{2})$/);
  if (stateOnly && VALID_STATE_CODES.has(stateOnly[1])) {
    return { state: stateOnly[1], isRemote };
  }

  // Pattern 4: zip code anywhere in string
  const zipMatch = loc.match(/\b(\d{5})\b/);
  if (zipMatch) {
    const prefix = zipMatch[1].substring(0, 3);
    if (ZIP_PREFIX_TO_STATE[prefix]) {
      return { state: ZIP_PREFIX_TO_STATE[prefix], isRemote };
    }
  }

  // Pattern 5: state name anywhere in string (for locations like "Remote - California")
  for (const [name, code] of Object.entries(US_STATE_CODES)) {
    if (lowerLoc.includes(name)) {
      return { state: code, isRemote };
    }
  }

  return { isRemote };
}

/**
 * Strip HTML tags from a string (for Greenhouse job descriptions)
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// STEM Keywords for title matching
const STEM_TITLE_KEYWORDS = [
  'engineer', 'scientist', 'developer', 'analyst', 'researcher',
  'technician', 'architect', 'physicist', 'chemist', 'biologist',
  'mathematician', 'statistician', 'data', 'software', 'hardware',
  'cyber', 'security', 'nuclear', 'quantum', 'machine learning',
  'robotics', 'aerospace', 'semiconductor', 'biotech', 'computational',
  'laboratory', 'research', 'science', 'technology', 'programming',
  'cloud', 'devops', 'network', 'systems', 'database', 'electrical',
  'mechanical', 'chemical', 'materials', 'manufacturing', 'automation',
  'cryptograph', 'intelligence', 'physics', 'biology', 'chemistry',
];

// Keywords to EXCLUDE (non-STEM roles)
const EXCLUDE_TITLE_KEYWORDS = [
  'administrative assistant', 'secretary', 'receptionist', 'clerk',
  'custodian', 'janitor', 'food service', 'cook', 'cashier',
  'retail', 'sales representative', 'customer service representative',
  'human resources specialist', 'recruiter', 'paralegal',
  'legal assistant', 'accounting clerk', 'budget analyst',
  'contract specialist', 'procurement clerk', 'supply technician',
  'mail clerk', 'file clerk', 'office automation clerk',
  'transportation assistant', 'motor vehicle operator',
];

// ===========================================
// STEM FILTERING FUNCTIONS
// ===========================================

function isSTEMOccupationCode(code: string | undefined): boolean {
  if (!code) return false;
  // Extract first 4 digits of occupation code
  const seriesCode = code.substring(0, 4);
  return STEM_OCCUPATION_CODES.includes(seriesCode);
}

function passesSTEMTitleFilter(title: string): boolean {
  const lowerTitle = title.toLowerCase();

  // Check for excluded keywords first
  for (const exclude of EXCLUDE_TITLE_KEYWORDS) {
    if (lowerTitle.includes(exclude.toLowerCase())) {
      console.log(`STEM Filter: Rejected "${title}" - contains excluded keyword "${exclude}"`);
      return false;
    }
  }

  // Check for required STEM keywords
  for (const keyword of STEM_TITLE_KEYWORDS) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  // If no STEM keyword found, reject
  console.log(`STEM Filter: Rejected "${title}" - no STEM keywords found`);
  return false;
}

function passesSTEMFilter(item: FetchedItem, stemFilters?: STEMFilterConfig): boolean {
  // If no filters configured, use default STEM filtering
  if (!stemFilters) {
    // Default: must pass title keyword filter
    return passesSTEMTitleFilter(item.title);
  }

  // Check occupation code filter (for USAJobs)
  if (stemFilters.occupationSeriesCodes && stemFilters.occupationSeriesCodes.length > 0) {
    if (!item.occupationCode) {
      // No occupation code available, fall back to title filter
      if (!passesSTEMTitleFilter(item.title)) return false;
    } else {
      const seriesCode = item.occupationCode.substring(0, 4);
      if (!stemFilters.occupationSeriesCodes.includes(seriesCode)) {
        console.log(`STEM Filter: Rejected "${item.title}" - occupation code ${seriesCode} not in allowed list`);
        return false;
      }
    }
  }

  // Check title keywords
  if (stemFilters.titleKeywords) {
    const lowerTitle = item.title.toLowerCase();

    // Check excluded keywords
    if (stemFilters.titleKeywords.exclude) {
      for (const exclude of stemFilters.titleKeywords.exclude) {
        if (lowerTitle.includes(exclude.toLowerCase())) {
          console.log(`STEM Filter: Rejected "${item.title}" - contains excluded keyword "${exclude}"`);
          return false;
        }
      }
    }

    // Check required keywords (OR logic - must have at least one)
    if (stemFilters.titleKeywords.required && stemFilters.titleKeywords.required.length > 0) {
      const hasRequired = stemFilters.titleKeywords.required.some(
        keyword => lowerTitle.includes(keyword.toLowerCase())
      );
      if (!hasRequired) {
        console.log(`STEM Filter: Rejected "${item.title}" - missing required keywords`);
        return false;
      }
    }

    // Check mustContainAll keywords (AND logic)
    if (stemFilters.titleKeywords.mustContainAll) {
      for (const keyword of stemFilters.titleKeywords.mustContainAll) {
        if (!lowerTitle.includes(keyword.toLowerCase())) {
          console.log(`STEM Filter: Rejected "${item.title}" - missing required keyword "${keyword}"`);
          return false;
        }
      }
    }
  }

  // Check description keywords if configured
  if (stemFilters.descriptionKeywords && item.description) {
    const lowerDesc = item.description.toLowerCase();

    if (stemFilters.descriptionKeywords.exclude) {
      for (const exclude of stemFilters.descriptionKeywords.exclude) {
        if (lowerDesc.includes(exclude.toLowerCase())) {
          return false;
        }
      }
    }
  }

  // Check minimum salary if configured
  if (stemFilters.minSalary && item.salaryMin) {
    if (item.salaryMin < stemFilters.minSalary) {
      return false;
    }
  }

  // Check clearance requirement if configured
  if (stemFilters.requireClearance && !item.clearanceRequired) {
    return false;
  }

  return true;
}

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate: only allow service_role or a matching secret
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!token || token !== serviceRoleKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    const body = await req.json();
    const { source_id, sync_job_id, action } = body;

    if (action === 'sync_all') {
      // Sync active sources in batches to avoid Deno Deploy timeout (150s).
      // Accepts optional `batch_size` (default 5) and `offset` (default 0)
      // so callers can page through all sources across multiple invocations.
      const batchSize = body.batch_size ?? 5;
      const offset = body.offset ?? 0;

      const { data: sources, error, count } = await supabase
        .from('federated_sources')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('last_sync_at', { ascending: true, nullsFirst: true })
        .range(offset, offset + batchSize - 1);

      if (error) throw error;

      const results = [];
      for (const source of sources || []) {
        try {
          const result = await syncSource(supabase, source);

          // Update source metadata inline (avoids the separate update that crashed before)
          const now = new Date().toISOString();
          const updatePayload: Record<string, unknown> = {
            last_sync_at: now,
            sync_error_count: result.errors.length,
            total_items_synced: result.itemsFetched,
            updated_at: now,
          };
          // Only set last_successful_sync_at on success (avoid undefined overwriting a real value)
          if (result.errors.length === 0) {
            updatePayload.last_successful_sync_at = now;
          }
          await supabase
            .from('federated_sources')
            .update(updatePayload)
            .eq('id', source.id);

          results.push({ sourceId: source.id, sourceName: source.name, ...result });
        } catch (err) {
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            error: err.message,
          });
        }
      }

      const totalSources = count ?? 0;
      const nextOffset = offset + batchSize;
      const hasMore = nextOffset < totalSources;

      return new Response(
        JSON.stringify({
          success: true,
          results,
          pagination: { offset, batchSize, totalSources, hasMore, nextOffset: hasMore ? nextOffset : null },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!source_id) {
      throw new Error('source_id is required');
    }

    // Get source configuration
    const { data: source, error: sourceError } = await supabase
      .from('federated_sources')
      .select('*')
      .eq('id', source_id)
      .single();

    if (sourceError) throw sourceError;
    if (!source) throw new Error('Source not found');

    // Update sync job status
    if (sync_job_id) {
      await supabase
        .from('sync_jobs')
        .update({ status: 'running', started_at: new Date().toISOString() })
        .eq('id', sync_job_id);
    }

    // Perform sync
    const result = await syncSource(supabase, source);

    // Update sync job with results
    if (sync_job_id) {
      await supabase
        .from('sync_jobs')
        .update({
          status: result.errors.length > 0 ? 'completed_with_errors' : 'completed',
          completed_at: new Date().toISOString(),
          items_fetched: result.itemsFetched,
          items_created: result.itemsCreated,
          items_updated: result.itemsUpdated,
          items_removed: result.itemsRemoved,
          items_failed: result.itemsFailed,
          errors: result.errors,
        })
        .eq('id', sync_job_id);
    }

    // Update source metadata
    const now = new Date().toISOString();
    const sourceUpdate: Record<string, unknown> = {
      last_sync_at: now,
      sync_error_count: result.errors.length,
      total_items_synced: result.itemsFetched,
      updated_at: now,
    };
    if (result.errors.length === 0) {
      sourceUpdate.last_successful_sync_at = now;
    }
    await supabase
      .from('federated_sources')
      .update(sourceUpdate)
      .eq('id', source_id);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync error:', error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

// ===========================================
// SYNC SOURCE
// ===========================================

async function syncSource(supabase: ReturnType<typeof createClient>, source: FederatedSource): Promise<SyncResult> {
  const result: SyncResult = {
    itemsFetched: 0,
    itemsCreated: 0,
    itemsUpdated: 0,
    itemsRemoved: 0,
    itemsFailed: 0,
    errors: [],
  };

  let items: FetchedItem[] = [];

  try {
    switch (source.integration_method) {
      case 'api':
        items = await fetchFromAPI(source);
        break;
      case 'rss':
        items = await fetchFromRSS(source);
        break;
      case 'greenhouse_api':
        items = await fetchFromGreenhouse(source);
        break;
      case 'lever_api':
        items = await fetchFromLever(source);
        break;
      default:
        throw new Error(`Unsupported integration method: ${source.integration_method}`);
    }

    result.itemsFetched = items.length;
    console.log(`Fetched ${items.length} items from ${source.name}`);

    // ===========================================
    // STEM FILTERING - Critical step to prevent non-STEM jobs
    // Greenhouse/Lever core-industry sources skip this (all roles relevant)
    // ===========================================
    const skipSTEM = source.api_config?.skipSTEMFilter === true;
    const stemFilters = source.api_config?.stemFilters || source.rss_config?.stemFilters;
    const filteredItems = skipSTEM ? items : items.filter(item => {
      const passes = passesSTEMFilter(item, stemFilters);
      if (!passes) {
        result.itemsFailed++; // Count filtered items as "failed" for stats
      }
      return passes;
    });
    if (skipSTEM) {
      console.log(`STEM Filter: Skipped for ${source.name} (core-industry company, all roles relevant)`);
    }

    const rejectedCount = items.length - filteredItems.length;
    if (rejectedCount > 0) {
      console.log(`STEM Filter: Rejected ${rejectedCount} non-STEM items from ${source.name}`);
      result.errors.push({
        timestamp: new Date().toISOString(),
        type: 'filter',
        message: `Filtered out ${rejectedCount} non-STEM items`,
      });
    }
    console.log(`Processing ${filteredItems.length} STEM-relevant items from ${source.name}`);

    // Batch upsert: build all payloads, then send in one DB call per chunk.
    // Supabase/PostgREST handles bulk upsert natively.
    const UPSERT_CHUNK = 200; // rows per upsert call — safe for PostgREST
    const payloads = filteredItems.map(item => buildUpsertPayload(item, source));

    for (let i = 0; i < payloads.length; i += UPSERT_CHUNK) {
      const chunk = payloads.slice(i, i + UPSERT_CHUNK);
      try {
        const { error } = await supabase
          .from('federated_listings')
          .upsert(chunk, { onConflict: 'source_id,external_id' });

        if (error) throw error;
        result.itemsCreated += chunk.length; // can't distinguish create vs update cheaply
      } catch (err) {
        // If the bulk fails, fall back to one-by-one so we know which items fail
        for (const payload of chunk) {
          try {
            const { error } = await supabase
              .from('federated_listings')
              .upsert(payload, { onConflict: 'source_id,external_id' });
            if (error) throw error;
            result.itemsCreated++;
          } catch (innerErr) {
            result.itemsFailed++;
            result.errors.push({
              timestamp: new Date().toISOString(),
              type: 'save',
              message: innerErr.message,
              itemId: payload.external_id,
            });
          }
        }
      }
    }

    // Mark expired items — only if we fetched items successfully
    // Use parameterized filter to prevent SQL injection via external IDs
    const fetchedIds = filteredItems.map(i => i.externalId);
    if (fetchedIds.length > 0) {
      // Sanitize IDs: strip any characters that aren't alphanumeric, dash, or underscore
      const safeIds = fetchedIds
        .filter(id => typeof id === 'string' && id.length > 0)
        .map(id => id.replace(/[^a-zA-Z0-9_\-\.]/g, ''));

      if (safeIds.length > 0) {
        const { count } = await supabase
          .from('federated_listings')
          .update({ status: 'removed' })
          .eq('source_id', source.id)
          .eq('status', 'active')
          .not('external_id', 'in', `(${safeIds.join(',')})`)
          .select('*', { count: 'exact', head: true });

        result.itemsRemoved = count || 0;
      }
    }
  } catch (err) {
    result.errors.push({
      timestamp: new Date().toISOString(),
      type: 'fetch',
      message: err.message,
    });
  }

  return result;
}

// ===========================================
// API FETCHER
// ===========================================

async function fetchFromAPI(source: FederatedSource): Promise<FetchedItem[]> {
  if (!source.api_config) {
    throw new Error('API config not found');
  }

  const config = source.api_config;
  const items: FetchedItem[] = [];

  // Build request headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': Deno.env.get('USAJOBS_USER_AGENT') || 'STEMWorkforce/1.0 (contact@stemworkforce.com)',
  };

  // USAJobs requires explicit Host header
  if (config.baseUrl.includes('usajobs.gov')) {
    headers['Host'] = 'data.usajobs.gov';
  }

  if (config.authType === 'api_key' && config.authConfig?.apiKeyHeader) {
    // SECURITY: Read API key from environment variable, never from database
    const apiKeyEnvVar = config.authConfig.apiKeyEnvVar || 'USAJOBS_API_KEY';
    const apiKey = Deno.env.get(apiKeyEnvVar) || config.authConfig.apiKeyValue;
    if (apiKey) {
      headers[config.authConfig.apiKeyHeader] = apiKey;
    } else {
      throw new Error(`API key not found. Set the ${apiKeyEnvVar} environment variable.`);
    }
  }

  // Determine which endpoints to fetch
  const endpoints: { type: string; url: string }[] = [];
  if (source.provides_jobs && config.endpoints.jobs) {
    endpoints.push({ type: 'job', url: config.endpoints.jobs });
  }
  if (source.provides_internships && config.endpoints.internships) {
    endpoints.push({ type: 'internship', url: config.endpoints.internships });
  }
  if (source.provides_challenges && config.endpoints.challenges) {
    endpoints.push({ type: 'challenge', url: config.endpoints.challenges });
  }
  if (source.provides_events && config.endpoints.events) {
    endpoints.push({ type: 'event', url: config.endpoints.events });
  }

  // Fetch from each endpoint
  for (const endpoint of endpoints) {
    try {
      let page = 1;
      let hasMore = true;
      const maxPages = config.paginationConfig?.maxPages || 10;

      while (hasMore && page <= maxPages) {
        // Build URL with STEM occupation filters for USAJobs
        const url = buildAPIUrl(
          config.baseUrl,
          endpoint.url,
          config.paginationConfig,
          page,
          config.stemFilters,
          config.organizationFilter,
          config.keyword
        );
        console.log(`Fetching: ${url}`);

        const response = await fetch(url, { headers });

        if (!response.ok) {
          const body = await response.text().catch(() => '');
          throw new Error(`API returned ${response.status}: ${response.statusText} - ${body.substring(0, 200)}`);
        }

        const data = await response.json();
        console.log(`Response keys: ${Object.keys(data).join(', ')}`);

        const results = extractResults(data, config.responseMapping);
        console.log(`Extracted ${results.length} results from page ${page}`);

        for (const result of results) {
          const item = transformAPIResult(result, source, endpoint.type as FetchedItem['contentType'], config.responseMapping);
          if (!item.externalId) {
            console.warn(`Skipping item with no externalId: "${item.title}"`);
            continue;
          }
          items.push(item);
        }

        // Check if more pages
        hasMore = results.length >= (config.paginationConfig?.maxItemsPerPage || 50);
        page++;

        // Rate limiting
        if (config.rateLimitPerMinute) {
          const delay = 60000 / config.rateLimitPerMinute;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (err) {
      // Surface fetch errors instead of silently swallowing them
      console.error(`Error fetching from ${source.name} ${endpoint.url}:`, err);
      throw new Error(`Failed to fetch ${endpoint.type}s from ${source.name}: ${err.message}`);
    }
  }

  return items;
}

function buildAPIUrl(
  baseUrl: string,
  endpoint: string,
  pagination: APIConfig['paginationConfig'],
  page: number,
  stemFilters?: STEMFilterConfig,
  organizationFilter?: string,
  keyword?: string
): string {
  // Fix URL construction: ensure baseUrl path is preserved
  // new URL('/Search', 'https://data.usajobs.gov/api') would drop /api
  // Instead, concatenate properly
  const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = new URL(base + cleanEndpoint);

  if (pagination) {
    if (pagination.type === 'page' && pagination.pageParam) {
      url.searchParams.set(pagination.pageParam, String(page));
      url.searchParams.set(pagination.limitParam, String(pagination.maxItemsPerPage));
    } else if (pagination.type === 'offset') {
      const offset = (page - 1) * pagination.maxItemsPerPage;
      url.searchParams.set('offset', String(offset));
      url.searchParams.set(pagination.limitParam, String(pagination.maxItemsPerPage));
    }
  }

  if (baseUrl.includes('usajobs.gov')) {
    // Organization name filter (for lab/agency-specific sources)
    if (organizationFilter) {
      url.searchParams.set('Organization', organizationFilter);
      console.log(`USAJobs: Filtering by organization "${organizationFilter}"`);
    }

    // Keyword filter (for lab-specific searches, e.g. "Oak Ridge National Laboratory")
    if (keyword) {
      url.searchParams.set('Keyword', keyword);
      console.log(`USAJobs: Filtering by keyword "${keyword}"`);
    }

    // STEM occupation code filter (for the main USAJOBS source)
    if (stemFilters?.occupationSeriesCodes) {
      const codes = stemFilters.occupationSeriesCodes.join(';');
      url.searchParams.set('JobCategoryCode', codes);
      console.log(`USAJobs: Filtering by ${stemFilters.occupationSeriesCodes.length} occupation codes`);
    }
  }

  return url.toString();
}

function extractResults(data: unknown, mapping: Record<string, unknown>): unknown[] {
  // For USAJobs-style responses
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.SearchResult && Array.isArray((obj.SearchResult as Record<string, unknown>).SearchResultItems)) {
      return (obj.SearchResult as Record<string, unknown>).SearchResultItems as unknown[];
    }
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(data)) return data;
  }
  return [];
}

function transformAPIResult(
  result: unknown,
  source: FederatedSource,
  contentType: FetchedItem['contentType'],
  mapping: Record<string, unknown>
): FetchedItem {
  const obj = result as Record<string, unknown>;

  // Helper to extract nested values
  const getValue = (path: string): unknown => {
    return path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  // Extract occupation code for USAJobs (used in STEM filtering)
  let occupationCode: string | undefined;
  if (source.website.includes('usajobs.gov')) {
    // USAJobs stores job category in MatchedObjectDescriptor.JobCategory
    const jobCategory = getValue('MatchedObjectDescriptor.JobCategory') as Array<{ Code: string }> | undefined;
    if (jobCategory && jobCategory.length > 0) {
      occupationCode = jobCategory[0].Code;
    }
  }

  return {
    externalId: String(getValue(mapping.id as string) || ''),
    title: String(getValue(mapping.title as string) || 'Untitled'),
    description: getValue(mapping.description as string) as string | undefined,
    sourceUrl: String(getValue(mapping.url as string) || source.website),
    organizationName: String(getValue(mapping.organization as string) || source.name),
    location: getValue(mapping.location as string) as string | undefined,
    postedAt: String(getValue(mapping.postedDate as string) || new Date().toISOString()),
    expiresAt: getValue(mapping.deadline as string) as string | undefined,
    contentType,
    industries: source.industries || [],
    occupationCode, // For STEM filtering verification
  };
}

// ===========================================
// GREENHOUSE FETCHER
// Official public API: https://developers.greenhouse.io/job-board.html
// GET /v1/boards/{token}/jobs?content=true — no auth, returns all jobs
// ===========================================

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  content: string; // HTML
  updated_at: string;
  departments: Array<{ name: string }>;
  pay_input_ranges?: Array<{
    min_cents: string;
    max_cents: string;
    currency_type: string;
    title: string; // e.g. "USD per Year"
  }>;
}

async function fetchFromGreenhouse(source: FederatedSource): Promise<FetchedItem[]> {
  const boardToken = (source.api_config as Record<string, unknown>)?.boardToken as string;
  if (!boardToken) {
    throw new Error(`Greenhouse board token not configured for ${source.name}`);
  }

  // Omit content=true to avoid oversized responses (SpaceX alone is >10MB with content).
  // We get title, location, departments, pay ranges, and URL without it.
  const url = `https://api.greenhouse.io/v1/boards/${boardToken}/jobs`;
  console.log(`Greenhouse: Fetching from ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'STEMWorkforce/1.0 (federation-sync)',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Greenhouse API returned ${response.status} for ${source.name}`);
  }

  const data = await response.json();
  const jobs: GreenhouseJob[] = data.jobs || [];
  console.log(`Greenhouse: Got ${jobs.length} jobs from ${source.name}`);

  const items: FetchedItem[] = [];

  for (const job of jobs) {
    const location = parseLocation(job.location?.name);

    // Only include US-based or remote positions
    if (!location.state && !location.isRemote) {
      // Check if location contains non-US indicators
      const locName = (job.location?.name || '').toLowerCase();
      if (locName && !locName.includes('united states') && !locName.includes('usa') &&
          !locName.includes('remote') && locName.match(/\b(uk|london|berlin|tokyo|paris|sydney|toronto|vancouver|dublin|amsterdam|singapore|bangalore|mumbai|shanghai|hong kong|munich|zurich|tel aviv)\b/i)) {
        continue; // Skip non-US locations
      }
    }

    // Extract salary from pay_input_ranges
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    let salaryPeriod: string | undefined;
    if (job.pay_input_ranges && job.pay_input_ranges.length > 0) {
      const range = job.pay_input_ranges[0];
      salaryMin = Math.round(parseInt(range.min_cents, 10) / 100);
      salaryMax = Math.round(parseInt(range.max_cents, 10) / 100);
      salaryPeriod = range.title?.toLowerCase().includes('hour') ? 'hourly' : 'yearly';
    }

    // Detect internships from title
    const isInternship = /\b(intern|internship|co-op|coop)\b/i.test(job.title);

    // Extract departments as tags
    const departments = (job.departments || []).map(d => d.name);

    // Content is omitted from the API call to avoid oversized responses.
    // Use departments + title as a brief description fallback.
    const description = job.content
      ? stripHtml(job.content).substring(0, 2000)
      : departments.length > 0
        ? `${job.title} — ${departments.join(', ')} at ${source.name}`
        : `${job.title} at ${source.name}`;

    items.push({
      externalId: String(job.id),
      title: job.title,
      description,
      shortDescription: description.substring(0, 200),
      sourceUrl: job.absolute_url,
      organizationName: source.name,
      location: job.location?.name,
      city: location.city,
      state: location.state,
      country: 'USA',
      isRemote: location.isRemote,
      industries: source.industries || [],
      tags: departments,
      contentType: isInternship ? 'internship' : 'job',
      salaryMin,
      salaryMax,
      salaryCurrency: 'USD',
      salaryPeriod,
      postedAt: job.updated_at || new Date().toISOString(),
    });
  }

  console.log(`Greenhouse: ${items.length} US-based items from ${source.name} (filtered ${jobs.length - items.length} non-US)`);
  return items;
}

// ===========================================
// LEVER FETCHER
// Official public API: https://github.com/lever/postings-api
// GET /v0/postings/{slug}?mode=json — no auth, returns all postings
// ===========================================

interface LeverPosting {
  id: string;
  text: string; // title
  hostedUrl: string;
  categories: {
    location?: string;
    team?: string;
    department?: string;
    commitment?: string; // Full-time, Part-time, Intern, etc.
    allLocations?: string[];
  };
  descriptionPlain?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    interval: string; // "per-year-salary", "per-hour-wage"
  };
  workplaceType?: string; // "unspecified", "on-site", "remote", "hybrid"
  createdAt: number; // epoch ms
}

async function fetchFromLever(source: FederatedSource): Promise<FetchedItem[]> {
  const companySlug = (source.api_config as Record<string, unknown>)?.companySlug as string;
  if (!companySlug) {
    throw new Error(`Lever company slug not configured for ${source.name}`);
  }

  const url = `https://api.lever.co/v0/postings/${companySlug}?mode=json`;
  console.log(`Lever: Fetching from ${url}`);

  // Respect Lever robots.txt crawl delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'STEMWorkforce/1.0 (federation-sync)',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Lever API returned ${response.status} for ${source.name}`);
  }

  const postings: LeverPosting[] = await response.json();
  console.log(`Lever: Got ${postings.length} postings from ${source.name}`);

  const items: FetchedItem[] = [];

  for (const posting of postings) {
    // Parse primary location
    const location = parseLocation(posting.categories?.location);
    const isRemote = location.isRemote || posting.workplaceType === 'remote';

    // Only include US-based or remote positions
    if (!location.state && !isRemote) {
      const locName = (posting.categories?.location || '').toLowerCase();
      if (locName && locName.match(/\b(uk|london|berlin|tokyo|paris|sydney|toronto|vancouver|dublin|amsterdam|singapore|bangalore|mumbai|shanghai|hong kong|munich|zurich|tel aviv)\b/i)) {
        continue;
      }
    }

    // Extract salary
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    let salaryPeriod: string | undefined;
    if (posting.salaryRange) {
      salaryMin = posting.salaryRange.min;
      salaryMax = posting.salaryRange.max;
      salaryPeriod = posting.salaryRange.interval?.includes('hour') ? 'hourly' : 'yearly';
    }

    // Detect internships
    const commitment = posting.categories?.commitment || '';
    const isInternship = /\b(intern|internship|co-op)\b/i.test(posting.text) ||
                         /\b(intern)\b/i.test(commitment);

    const description = posting.descriptionPlain?.substring(0, 2000);

    items.push({
      externalId: posting.id,
      title: posting.text,
      description,
      shortDescription: description ? description.substring(0, 200) : undefined,
      sourceUrl: posting.hostedUrl,
      organizationName: source.name,
      location: posting.categories?.location,
      city: location.city,
      state: location.state,
      country: 'USA',
      isRemote,
      industries: source.industries || [],
      tags: [posting.categories?.team, posting.categories?.department, commitment].filter(Boolean) as string[],
      contentType: isInternship ? 'internship' : 'job',
      jobType: commitment || undefined,
      salaryMin,
      salaryMax,
      salaryCurrency: posting.salaryRange?.currency || 'USD',
      salaryPeriod,
      postedAt: posting.createdAt ? new Date(posting.createdAt).toISOString() : new Date().toISOString(),
    });
  }

  console.log(`Lever: ${items.length} US-based items from ${source.name} (filtered ${postings.length - items.length} non-US)`);
  return items;
}

// ===========================================
// RSS FETCHER
// ===========================================

async function fetchFromRSS(source: FederatedSource): Promise<FetchedItem[]> {
  if (!source.rss_config) {
    throw new Error('RSS config not found');
  }

  const config = source.rss_config;
  const items: FetchedItem[] = [];

  try {
    const response = await fetch(config.feedUrl, {
      headers: {
        'User-Agent': 'STEMWorkforce/1.0 (Data Aggregation)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    if (!doc) {
      throw new Error('Failed to parse RSS feed');
    }

    // Handle different feed types
    const feedItems = doc.querySelectorAll('item') || doc.querySelectorAll('entry');

    for (let i = 0; i < Math.min(feedItems.length, config.maxItems || 100); i++) {
      const feedItem = feedItems[i];
      const item = transformRSSItem(feedItem, source, config);
      if (!item.externalId) {
        console.warn(`Skipping RSS item with no ID: "${item.title}"`);
        continue;
      }
      items.push(item);
    }
  } catch (err) {
    console.error(`Error fetching RSS from ${config.feedUrl}:`, err);
    throw err;
  }

  return items;
}

function transformRSSItem(
  feedItem: Element,
  source: FederatedSource,
  config: RSSConfig
): FetchedItem {
  const getElementText = (selector: string): string | undefined => {
    const el = feedItem.querySelector(selector);
    return el?.textContent?.trim() || undefined;
  };

  // Determine content type based on source configuration
  let contentType: FetchedItem['contentType'] = 'job';
  if (source.provides_challenges && !source.provides_jobs) {
    contentType = 'challenge';
  } else if (source.provides_internships && !source.provides_jobs) {
    contentType = 'internship';
  } else if (source.provides_events && !source.provides_jobs) {
    contentType = 'event';
  }

  // Extract guid/id
  const guid = getElementText('guid') || getElementText('id') || '';

  // Extract link
  let link = getElementText('link');
  if (!link) {
    const linkEl = feedItem.querySelector('link');
    link = linkEl?.getAttribute('href') || source.website;
  }

  // Extract date
  const pubDate = getElementText('pubDate') || getElementText('published') || getElementText('dc:date');

  return {
    externalId: guid,
    title: getElementText('title') || 'Untitled',
    description: getElementText('description') || getElementText('content') || getElementText('summary'),
    sourceUrl: link || source.website,
    organizationName: source.name,
    location: getElementText('location'),
    postedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    contentType,
    industries: source.industries || [],
  };
}

// ===========================================
// DATABASE OPERATIONS
// ===========================================

/**
 * Build the upsert payload for a single listing.
 * Pure function — no DB calls. Used by the batch upsert loop.
 */
function buildUpsertPayload(item: FetchedItem, source: FederatedSource) {
  return {
    source_id: source.id,
    external_id: item.externalId,
    content_type: item.contentType,
    title: item.title,
    description: item.description,
    short_description: item.shortDescription || (item.description ? item.description.substring(0, 200) : null),
    source_url: item.sourceUrl,
    source_name: source.name,
    attribution_html: source.attribution_required ? source.attribution_text : null,
    organization_name: item.organizationName,
    organization_logo_url: item.organizationLogoUrl,
    organization_type: source.type,
    location: item.location,
    city: item.city,
    state: item.state,
    country: item.country || 'USA',
    is_remote: item.isRemote || false,
    industries: item.industries || source.industries || [],
    skills: item.skills || [],
    tags: item.tags || [],
    clearance_required: item.clearanceRequired,
    job_type: item.jobType,
    salary_min: item.salaryMin,
    salary_max: item.salaryMax,
    salary_currency: item.salaryCurrency || 'USD',
    salary_period: item.salaryPeriod,
    prize_amount: item.prizeAmount,
    registration_deadline: item.registrationDeadline,
    submission_deadline: item.submissionDeadline,
    event_date: item.eventDate,
    event_end_date: item.eventEndDate,
    posted_at: item.postedAt,
    expires_at: item.expiresAt,
    status: 'active',
    last_updated_at: new Date().toISOString(),
  };
}

async function checkExistingItem(
  supabase: ReturnType<typeof createClient>,
  sourceId: string,
  externalId: string
): Promise<{ id: string } | null> {
  const { data } = await supabase
    .from('federated_listings')
    .select('id')
    .eq('source_id', sourceId)
    .eq('external_id', externalId)
    .single();

  return data;
}

async function createListing(
  supabase: ReturnType<typeof createClient>,
  item: FetchedItem,
  source: FederatedSource
): Promise<void> {
  const { error } = await supabase
    .from('federated_listings')
    .insert({
      source_id: source.id,
      external_id: item.externalId,
      content_type: item.contentType,
      title: item.title,
      description: item.description,
      short_description: item.shortDescription || (item.description ? item.description.substring(0, 200) : null),
      source_url: item.sourceUrl,
      source_name: source.name,
      source_logo_url: null, // Would need to be added to source config
      attribution_html: source.attribution_required ? source.attribution_text : null,
      organization_name: item.organizationName,
      organization_logo_url: item.organizationLogoUrl,
      organization_type: source.type,
      location: item.location,
      city: item.city,
      state: item.state,
      country: item.country || 'USA',
      is_remote: item.isRemote || false,
      industries: item.industries || source.industries || [],
      skills: item.skills || [],
      tags: item.tags || [],
      clearance_required: item.clearanceRequired,
      job_type: item.jobType,
      salary_min: item.salaryMin,
      salary_max: item.salaryMax,
      salary_currency: item.salaryCurrency || 'USD',
      salary_period: item.salaryPeriod,
      prize_amount: item.prizeAmount,
      registration_deadline: item.registrationDeadline,
      submission_deadline: item.submissionDeadline,
      event_date: item.eventDate,
      event_end_date: item.eventEndDate,
      posted_at: item.postedAt,
      expires_at: item.expiresAt,
      status: 'active',
    });

  if (error) throw error;
}

async function updateListing(
  supabase: ReturnType<typeof createClient>,
  id: string,
  item: FetchedItem,
  source: FederatedSource
): Promise<void> {
  const { error } = await supabase
    .from('federated_listings')
    .update({
      title: item.title,
      description: item.description,
      short_description: item.shortDescription || (item.description ? item.description.substring(0, 200) : null),
      source_url: item.sourceUrl,
      location: item.location,
      city: item.city,
      state: item.state,
      is_remote: item.isRemote,
      industries: item.industries || source.industries,
      skills: item.skills,
      tags: item.tags,
      clearance_required: item.clearanceRequired,
      salary_min: item.salaryMin,
      salary_max: item.salaryMax,
      expires_at: item.expiresAt,
      last_updated_at: new Date().toISOString(),
      status: 'active',
    })
    .eq('id', id);

  if (error) throw error;
}
