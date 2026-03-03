// ===========================================
// SUBMIT PARTNER APPLICATION EDGE FUNCTION
// Processes and stores education partner applications
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ===========================================
// TYPES
// ===========================================

interface ProgramInfo {
  name: string;
  type: string;
  duration: string;
  format: string;
  accreditation: string;
  enrollmentSize: string;
}

interface PartnerApplicationData {
  // Institution Info
  institutionName: string;
  institutionType: string;
  website?: string;
  yearEstablished?: string;
  accreditationBody?: string;
  taxId?: string;

  // Contact Info
  contactFirstName: string;
  contactLastName: string;
  contactTitle?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Programs
  programs?: ProgramInfo[];
  focusAreas?: string[];
  industries?: string[];

  // Outcomes
  totalEnrollment?: string;
  graduationRate?: string;
  placementRate?: string;
  averageSalary?: string;
  employerPartners?: string;

  // Goals
  partnershipGoals?: string[];
  desiredServices?: string[];
  timeline?: string;
  additionalInfo?: string;

  // National Labs / Research Specific
  clearanceLevels?: string[];
  researchAreas?: string[];
  fundingAgencies?: string[];
  internshipsPerYear?: string;

  // Informal Education Specific
  ageGroups?: string[];
  participantsPerYear?: string;
  parentEngagement?: boolean;
  grantFunded?: boolean;
  stemEcosystem?: boolean;

  // Metadata
  requestedTier?: string;
  referralSource?: string;
}

// ===========================================
// VALIDATION
// ===========================================

function validateApplication(data: PartnerApplicationData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.institutionName?.trim()) {
    errors.push('Institution name is required');
  }
  if (!data.institutionType?.trim()) {
    errors.push('Institution type is required');
  }
  if (!data.contactFirstName?.trim()) {
    errors.push('Contact first name is required');
  }
  if (!data.contactLastName?.trim()) {
    errors.push('Contact last name is required');
  }
  if (!data.contactEmail?.trim()) {
    errors.push('Contact email is required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contactEmail && !emailRegex.test(data.contactEmail)) {
    errors.push('Invalid email format');
  }

  // Website validation (if provided)
  if (data.website) {
    try {
      new URL(data.website.startsWith('http') ? data.website : `https://${data.website}`);
    } catch {
      errors.push('Invalid website URL format');
    }
  }

  // Tax ID format validation (if provided) - basic check for US EIN
  if (data.taxId && !/^\d{2}-?\d{7}$/.test(data.taxId.replace(/\s/g, ''))) {
    errors.push('Tax ID should be in format XX-XXXXXXX');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ===========================================
// SANITIZATION
// ===========================================

function sanitizeString(value: string | undefined): string | null {
  if (!value) return null;
  // Remove HTML tags, trim whitespace, limit length
  return value
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 1000);
}

function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function sanitizeUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Add https if no protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // SECURITY: Validate user authentication
    const authSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const { data: { user: authUser }, error: authError } = await authSupabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get request data
    const requestData = await req.json() as PartnerApplicationData;

    // Validate the application
    const validation = validateApplication(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: validation.errors
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate applications (same email within last 24 hours)
    const { data: existingApps } = await supabase
      .from('education_partner_applications')
      .select('id, submitted_at')
      .eq('contact_email', sanitizeEmail(requestData.contactEmail))
      .gte('submitted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingApps && existingApps.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: ['An application with this email was submitted recently. Please wait 24 hours before resubmitting.']
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get client IP from headers (Supabase edge functions receive this)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = req.headers.get('user-agent') || null;

    // Prepare the application record
    const applicationRecord = {
      // Institution Info
      institution_name: sanitizeString(requestData.institutionName)!,
      institution_type: requestData.institutionType,
      website: sanitizeUrl(requestData.website),
      year_established: sanitizeString(requestData.yearEstablished),
      accreditation_body: sanitizeString(requestData.accreditationBody),
      tax_id: sanitizeString(requestData.taxId),

      // Contact Info
      contact_first_name: sanitizeString(requestData.contactFirstName)!,
      contact_last_name: sanitizeString(requestData.contactLastName)!,
      contact_title: sanitizeString(requestData.contactTitle),
      contact_email: sanitizeEmail(requestData.contactEmail),
      contact_phone: sanitizeString(requestData.contactPhone),
      address: sanitizeString(requestData.address),
      city: sanitizeString(requestData.city),
      state: sanitizeString(requestData.state),
      zip_code: sanitizeString(requestData.zipCode),
      country: sanitizeString(requestData.country) || 'USA',

      // Programs (as JSONB)
      programs: requestData.programs || [],
      focus_areas: requestData.focusAreas || [],
      industries: requestData.industries || [],

      // Outcomes
      total_enrollment: sanitizeString(requestData.totalEnrollment),
      graduation_rate: sanitizeString(requestData.graduationRate),
      placement_rate: sanitizeString(requestData.placementRate),
      average_salary: sanitizeString(requestData.averageSalary),
      employer_partners: sanitizeString(requestData.employerPartners),

      // Goals
      partnership_goals: requestData.partnershipGoals || [],
      desired_services: requestData.desiredServices || [],
      timeline: sanitizeString(requestData.timeline),
      additional_info: sanitizeString(requestData.additionalInfo),

      // National Labs / Research Specific
      clearance_levels: requestData.clearanceLevels || [],
      research_areas: requestData.researchAreas || [],
      funding_agencies: requestData.fundingAgencies || [],
      internships_per_year: sanitizeString(requestData.internshipsPerYear),

      // Informal Education Specific
      age_groups: requestData.ageGroups || [],
      participants_per_year: sanitizeString(requestData.participantsPerYear),
      parent_engagement: requestData.parentEngagement || false,
      grant_funded: requestData.grantFunded || false,
      stem_ecosystem: requestData.stemEcosystem || false,

      // Application Metadata
      status: 'pending',
      requested_tier: requestData.requestedTier || 'starter',
      referral_source: sanitizeString(requestData.referralSource),
      ip_address: clientIP,
      user_agent: userAgent?.slice(0, 500),
    };

    // Insert the application
    const { data: application, error: insertError } = await supabase
      .from('education_partner_applications')
      .insert(applicationRecord)
      .select('id, submitted_at')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          errors: ['Failed to submit application. Please try again later.']
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // TODO: Send confirmation email
    // This would integrate with a mail service like Resend, SendGrid, etc.
    // await sendConfirmationEmail({
    //   to: requestData.contactEmail,
    //   institutionName: requestData.institutionName,
    //   applicationId: application.id
    // });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
        submittedAt: application.submitted_at,
        nextSteps: [
          'You will receive a confirmation email shortly.',
          'Our team will review your application within 48 hours.',
          'Once approved, you will receive login credentials to access your partner dashboard.'
        ]
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        errors: ['An unexpected error occurred. Please try again later.']
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
