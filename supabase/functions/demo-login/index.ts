// ===========================================
// Demo Login Edge Function
// Server-side demo authentication — keeps passwords
// out of the frontend JavaScript bundle
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo account email mapping (public info — no passwords)
const DEMO_EMAILS: Record<string, string> = {
  employer: 'demo.employer@stemworkforce.org',
  education_partner: 'demo.education@stemworkforce.org',
  national_labs: 'demo.labs@stemworkforce.org',
  federal_agency: 'demo.federal@stemworkforce.org',
  industry_nonprofit: 'demo.industry@stemworkforce.org',
  high_school: 'demo.highschool@stemworkforce.org',
  college_student: 'demo.college@stemworkforce.org',
  service_provider: 'demo.provider@stemworkforce.org',
  event_organizer: 'demo.organizer@stemworkforce.org',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { role } = await req.json();

    if (!role || !DEMO_EMAILS[role]) {
      return new Response(
        JSON.stringify({ error: 'Invalid demo role. Valid roles: ' + Object.keys(DEMO_EMAILS).join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = DEMO_EMAILS[role];
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
      return new Response(
        JSON.stringify({ error: 'Demo login failed: ' + error.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        session: data.session,
        user: data.user,
        role,
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
