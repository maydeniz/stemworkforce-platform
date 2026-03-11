// ===========================================
// Demo Login Edge Function
// Server-side demo authentication — keeps passwords
// out of the frontend JavaScript bundle
//
// H3 FIX: IP-based rate limiting via Deno KV (10 req/IP/minute)
// H4 FIX: CORS restricted to ALLOWED_ORIGIN env var, not wildcard *
// M5 FIX: Generic error message on auth failure (no role/label disclosure)
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// H4: Restrict CORS to the configured origin — never use * for sessions
function buildCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? 'https://stemworkforce.net';
  const requestOrigin = req.headers.get('origin') ?? '';

  // Allow the exact configured origin or any subdomain of stemworkforce.net
  const isAllowed =
    requestOrigin === allowedOrigin ||
    requestOrigin.endsWith('.stemworkforce.net') ||
    requestOrigin.endsWith('.stemworkforce.app');

  return {
    'Access-Control-Allow-Origin': isAllowed ? requestOrigin : allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  };
}

// Demo account mapping (public info — no passwords)
const DEMO_ACCOUNTS: Record<string, { email: string; label: string }> = {
  high_school:        { email: 'demo.highschool@stemworkforce.demo', label: 'High School Student' },
  college_student:    { email: 'demo.college@stemworkforce.demo', label: 'College Student' },
  jobseeker:          { email: 'demo.jobseeker@stemworkforce.demo', label: 'Job Seeker' },
  employer:           { email: 'demo.employer@stemworkforce.demo', label: 'Employer' },
  education_partner:  { email: 'demo.education@stemworkforce.demo', label: 'Education Partner' },
  federal_agency:     { email: 'demo.federal@stemworkforce.demo', label: 'Federal Agency' },
  state_agency:       { email: 'demo.state@stemworkforce.demo', label: 'State & Local Agency' },
  national_labs:      { email: 'demo.labs@stemworkforce.demo', label: 'National Laboratory' },
  industry_partner:   { email: 'demo.industry@stemworkforce.demo', label: 'Industry Partner' },
  nonprofit:          { email: 'demo.nonprofit@stemworkforce.demo', label: 'Nonprofit Organization' },
  service_provider:   { email: 'demo.provider@stemworkforce.demo', label: 'Service Provider' },
  admin:              { email: 'demo.admin@stemworkforce.demo', label: 'Platform Admin' },
}

// H3: Rate limiter constants
const RATE_LIMIT_WINDOW_MS = 60_000  // 1 minute window
const RATE_LIMIT_MAX = 10            // max requests per IP per window

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // H3: IP-based rate limiting via Deno KV
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    const kv = await Deno.openKv();
    const rlKey = ['demo_login_rl', ip];
    const now = Date.now();
    const entry = await kv.get<{ count: number; windowStart: number }>(rlKey);
    const current = entry.value ?? { count: 0, windowStart: now };

    if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
      // Start fresh window
      await kv.set(rlKey, { count: 1, windowStart: now }, { expireIn: RATE_LIMIT_WINDOW_MS });
    } else if (current.count >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    } else {
      await kv.set(
        rlKey,
        { count: current.count + 1, windowStart: current.windowStart },
        { expireIn: RATE_LIMIT_WINDOW_MS }
      );
    }
  } catch {
    // KV unavailable — allow request but log; do not block demo on KV failure
    console.warn('[demo-login] Rate limiter unavailable (Deno KV error)');
  }

  try {
    const { role } = await req.json();

    if (!role || !DEMO_ACCOUNTS[role]) {
      return new Response(
        JSON.stringify({
          error: 'Invalid demo role.',
          valid_roles: Object.entries(DEMO_ACCOUNTS).map(([key, val]) => ({
            key,
            label: val.label,
          })),
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email } = DEMO_ACCOUNTS[role];
    const password = Deno.env.get('DEMO_PASSWORD');

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Demo login is not configured. Set DEMO_PASSWORD secret.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // M5: Generic error — do not disclose which account or Supabase's internal message
      return new Response(
        JSON.stringify({ error: 'Demo login unavailable. Please try again later.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        session: data.session,
        user: data.user,
        role,
        label: DEMO_ACCOUNTS[role].label,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal error: ' + (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
