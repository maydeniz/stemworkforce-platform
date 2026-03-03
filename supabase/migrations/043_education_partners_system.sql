-- ============================================
-- Education Partners System Database Migration
-- Provides backend storage for education partner applications,
-- programs, outcomes tracking, and employer connections
-- ============================================

-- ============================================
-- 1. ENUM TYPES FOR EDUCATION PARTNERS
-- ============================================

DO $$
BEGIN
    CREATE TYPE education_partner_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE education_partner_tier AS ENUM ('starter', 'growth', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE education_partner_category AS ENUM (
        'university', 'college', 'community_college', 'bootcamp', 'vocational',
        'corporate_training', 'online', 'national_lab', 'ffrdc', 'science_museum',
        'stem_camp', 'afterschool', 'makerspace', 'nonprofit', 'government', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE program_format AS ENUM ('in_person', 'online', 'hybrid', 'self_paced', 'cohort_based');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE program_status AS ENUM ('draft', 'active', 'inactive', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 2. EDUCATION PARTNER APPLICATIONS TABLE
-- Stores applications from institutions wanting to partner
-- ============================================

CREATE TABLE IF NOT EXISTS public.education_partner_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Institution Information
    institution_name TEXT NOT NULL,
    institution_type TEXT NOT NULL, -- Using education_partner_category enum values
    website TEXT,
    year_established TEXT,
    accreditation_body TEXT,
    tax_id TEXT,

    -- Contact Information
    contact_first_name TEXT NOT NULL,
    contact_last_name TEXT NOT NULL,
    contact_title TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',

    -- Programs (stored as JSONB for flexibility)
    programs JSONB DEFAULT '[]'::jsonb,
    focus_areas TEXT[] DEFAULT '{}',
    industries TEXT[] DEFAULT '{}',

    -- Outcomes
    total_enrollment TEXT,
    graduation_rate TEXT,
    placement_rate TEXT,
    average_salary TEXT,
    employer_partners TEXT,

    -- Goals
    partnership_goals TEXT[] DEFAULT '{}',
    desired_services TEXT[] DEFAULT '{}',
    timeline TEXT,
    additional_info TEXT,

    -- National Labs / Research Specific
    clearance_levels TEXT[] DEFAULT '{}',
    research_areas TEXT[] DEFAULT '{}',
    funding_agencies TEXT[] DEFAULT '{}',
    internships_per_year TEXT,

    -- Informal Education Specific
    age_groups TEXT[] DEFAULT '{}',
    participants_per_year TEXT,
    parent_engagement BOOLEAN DEFAULT FALSE,
    grant_funded BOOLEAN DEFAULT FALSE,
    stem_ecosystem BOOLEAN DEFAULT FALSE,

    -- Application Metadata
    status TEXT DEFAULT 'pending', -- Using education_partner_status enum values
    requested_tier TEXT DEFAULT 'starter', -- Using education_partner_tier enum values
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    review_notes TEXT,

    -- Tracking
    ip_address INET,
    user_agent TEXT,
    referral_source TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_edu_partner_apps_status ON public.education_partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_edu_partner_apps_email ON public.education_partner_applications(contact_email);
CREATE INDEX IF NOT EXISTS idx_edu_partner_apps_submitted ON public.education_partner_applications(submitted_at DESC);

-- ============================================
-- 3. EDUCATION PARTNERS TABLE
-- Approved/active education partners
-- ============================================

CREATE TABLE IF NOT EXISTS public.education_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Link to original application
    application_id UUID REFERENCES public.education_partner_applications(id),

    -- Institution Information (copied from approved application)
    institution_name TEXT NOT NULL,
    institution_type TEXT NOT NULL,
    category TEXT, -- Higher-ed, training, research, informal, nonprofit, government
    website TEXT,
    year_established TEXT,
    accreditation_body TEXT,
    tax_id TEXT,
    logo_url TEXT,
    description TEXT,

    -- Location
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Primary Contact (becomes partner admin)
    primary_contact_user_id UUID REFERENCES auth.users(id),
    contact_email TEXT NOT NULL,
    contact_phone TEXT,

    -- Partnership Details
    tier TEXT DEFAULT 'starter', -- starter, growth, enterprise
    status TEXT DEFAULT 'active', -- active, suspended, inactive
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),

    -- Subscription/Billing (for paid tiers)
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'free', -- free, active, past_due, cancelled
    subscription_ends_at TIMESTAMP WITH TIME ZONE,

    -- Stats (calculated/updated periodically)
    total_programs INTEGER DEFAULT 0,
    total_students_reached INTEGER DEFAULT 0,
    total_employer_connections INTEGER DEFAULT 0,
    average_placement_rate DECIMAL(5, 2),

    -- Feature Flags
    can_list_programs BOOLEAN DEFAULT TRUE,
    can_host_events BOOLEAN DEFAULT FALSE,
    can_access_employer_network BOOLEAN DEFAULT TRUE,
    can_track_outcomes BOOLEAN DEFAULT FALSE,
    max_program_listings INTEGER DEFAULT 5,
    max_events_per_year INTEGER DEFAULT 0,

    -- National Labs / Research Specific
    clearance_levels TEXT[] DEFAULT '{}',
    research_areas TEXT[] DEFAULT '{}',
    funding_agencies TEXT[] DEFAULT '{}',

    -- Informal Education Specific
    age_groups TEXT[] DEFAULT '{}',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_edu_partners_status ON public.education_partners(status);
CREATE INDEX IF NOT EXISTS idx_edu_partners_type ON public.education_partners(institution_type);
CREATE INDEX IF NOT EXISTS idx_edu_partners_tier ON public.education_partners(tier);
CREATE INDEX IF NOT EXISTS idx_edu_partners_state ON public.education_partners(state);
CREATE UNIQUE INDEX IF NOT EXISTS idx_edu_partners_email ON public.education_partners(contact_email);

-- ============================================
-- 4. EDUCATION PARTNER PROGRAMS TABLE
-- Programs listed by education partners
-- ============================================

CREATE TABLE IF NOT EXISTS public.education_partner_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.education_partners(id) ON DELETE CASCADE,

    -- Program Details
    name TEXT NOT NULL,
    program_type TEXT NOT NULL, -- Bachelor's, Master's, Certificate, Bootcamp, etc.
    description TEXT,
    duration TEXT,
    format TEXT, -- in_person, online, hybrid, self_paced, cohort_based
    accreditation TEXT,
    enrollment_size TEXT,

    -- Focus Areas
    focus_areas TEXT[] DEFAULT '{}',
    industries TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',

    -- Outcomes
    graduation_rate DECIMAL(5, 2),
    placement_rate DECIMAL(5, 2),
    average_starting_salary DECIMAL(10, 2),
    employer_partners INTEGER DEFAULT 0,

    -- Pricing
    tuition_cost DECIMAL(10, 2),
    tuition_currency TEXT DEFAULT 'USD',
    financial_aid_available BOOLEAN DEFAULT FALSE,

    -- Status & Visibility
    status TEXT DEFAULT 'draft', -- draft, active, inactive, archived
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    external_url TEXT,
    application_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_edu_programs_partner ON public.education_partner_programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_edu_programs_status ON public.education_partner_programs(status);
CREATE INDEX IF NOT EXISTS idx_edu_programs_type ON public.education_partner_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_edu_programs_industries ON public.education_partner_programs USING GIN(industries);

-- ============================================
-- 5. PARTNER EMPLOYER CONNECTIONS TABLE
-- Track connections between education partners and employers
-- ============================================

CREATE TABLE IF NOT EXISTS public.partner_employer_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.education_partners(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES public.organizations(id),
    employer_name TEXT, -- For employers not yet in system

    -- Connection Details
    connection_type TEXT NOT NULL, -- hiring_partner, internship_provider, advisory_board, sponsor, guest_speaker
    status TEXT DEFAULT 'active', -- pending, active, inactive

    -- Relationship Metrics
    students_placed INTEGER DEFAULT 0,
    internships_provided INTEGER DEFAULT 0,
    events_hosted INTEGER DEFAULT 0,

    -- Dates
    established_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_employers_partner ON public.partner_employer_connections(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_employers_employer ON public.partner_employer_connections(employer_id);
CREATE INDEX IF NOT EXISTS idx_partner_employers_type ON public.partner_employer_connections(connection_type);

-- ============================================
-- 6. GRADUATE OUTCOMES TABLE
-- Track graduate placement outcomes for accreditation
-- ============================================

CREATE TABLE IF NOT EXISTS public.graduate_outcomes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.education_partners(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.education_partner_programs(id) ON DELETE SET NULL,

    -- Cohort Information
    graduation_year INTEGER NOT NULL,
    graduation_term TEXT, -- Spring, Summer, Fall
    cohort_size INTEGER,

    -- Employment Outcomes
    employed_count INTEGER DEFAULT 0,
    employed_in_field_count INTEGER DEFAULT 0,
    continuing_education_count INTEGER DEFAULT 0,
    not_seeking_count INTEGER DEFAULT 0,
    unknown_count INTEGER DEFAULT 0,

    -- Salary Data (aggregated/anonymized)
    average_salary DECIMAL(10, 2),
    median_salary DECIMAL(10, 2),
    salary_range_min DECIMAL(10, 2),
    salary_range_max DECIMAL(10, 2),

    -- Calculated Rates
    placement_rate DECIMAL(5, 2),
    field_placement_rate DECIMAL(5, 2),

    -- Verification
    data_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    verification_method TEXT, -- self_reported, employer_verified, third_party

    -- Top Employers
    top_employers JSONB DEFAULT '[]'::jsonb, -- [{name, count, industry}]

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grad_outcomes_partner ON public.graduate_outcomes(partner_id);
CREATE INDEX IF NOT EXISTS idx_grad_outcomes_program ON public.graduate_outcomes(program_id);
CREATE INDEX IF NOT EXISTS idx_grad_outcomes_year ON public.graduate_outcomes(graduation_year DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_grad_outcomes_unique ON public.graduate_outcomes(partner_id, program_id, graduation_year, graduation_term);

-- ============================================
-- 7. PARTNER EVENTS TABLE
-- Events hosted by education partners
-- ============================================

CREATE TABLE IF NOT EXISTS public.partner_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.education_partners(id) ON DELETE CASCADE,

    -- Event Details
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL, -- career_fair, info_session, workshop, networking, panel
    format TEXT NOT NULL, -- virtual, in_person, hybrid

    -- Schedule
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone TEXT DEFAULT 'America/New_York',

    -- Location (for in-person/hybrid)
    venue_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,

    -- Virtual (for virtual/hybrid)
    virtual_platform TEXT, -- zoom, teams, webex, custom
    virtual_link TEXT,

    -- Registration
    registration_required BOOLEAN DEFAULT TRUE,
    max_attendees INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    current_registrations INTEGER DEFAULT 0,

    -- Status
    status TEXT DEFAULT 'draft', -- draft, published, cancelled, completed
    published_at TIMESTAMP WITH TIME ZONE,

    -- Employers Participating
    participating_employers JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_events_partner ON public.partner_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_events_start ON public.partner_events(start_time);
CREATE INDEX IF NOT EXISTS idx_partner_events_status ON public.partner_events(status);
CREATE INDEX IF NOT EXISTS idx_partner_events_type ON public.partner_events(event_type);

-- ============================================
-- 8. PARTNER ACTIVITY LOG TABLE
-- Track partner actions for analytics
-- ============================================

CREATE TABLE IF NOT EXISTS public.partner_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.education_partners(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),

    -- Activity Details
    action TEXT NOT NULL, -- program_created, program_updated, event_created, employer_connected, outcome_reported
    entity_type TEXT, -- program, event, employer, outcome
    entity_id UUID,

    -- Context
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_partner_activity_partner ON public.partner_activity_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_activity_created ON public.partner_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_activity_action ON public.partner_activity_log(action);

-- ============================================
-- 9. RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.education_partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_partner_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_employer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graduate_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_activity_log ENABLE ROW LEVEL SECURITY;

-- Applications: Anyone can insert, only admins can view all
CREATE POLICY "Anyone can submit education partner applications"
    ON public.education_partner_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
    ON public.education_partner_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update applications"
    ON public.education_partner_applications
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Partners: Public can view active, partners can edit own
CREATE POLICY "Public can view active education partners"
    ON public.education_partners
    FOR SELECT
    TO public
    USING (status = 'active');

CREATE POLICY "Partners can view own record"
    ON public.education_partners
    FOR SELECT
    TO authenticated
    USING (primary_contact_user_id = auth.uid());

CREATE POLICY "Partners can update own record"
    ON public.education_partners
    FOR UPDATE
    TO authenticated
    USING (primary_contact_user_id = auth.uid());

CREATE POLICY "Admins can manage all partners"
    ON public.education_partners
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Programs: Public can view active, partners can manage own
CREATE POLICY "Public can view active programs"
    ON public.education_partner_programs
    FOR SELECT
    TO public
    USING (
        status = 'active'
        AND EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id AND status = 'active'
        )
    );

CREATE POLICY "Partners can manage own programs"
    ON public.education_partner_programs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

-- Employer Connections: Partners can manage own
CREATE POLICY "Partners can view own employer connections"
    ON public.partner_employer_connections
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can manage own employer connections"
    ON public.partner_employer_connections
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

-- Outcomes: Partners can manage own
CREATE POLICY "Partners can manage own outcomes"
    ON public.graduate_outcomes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

-- Events: Public can view published, partners can manage own
CREATE POLICY "Public can view published events"
    ON public.partner_events
    FOR SELECT
    TO public
    USING (status = 'published' AND start_time > NOW());

CREATE POLICY "Partners can manage own events"
    ON public.partner_events
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

-- Activity Log: Partners can view own
CREATE POLICY "Partners can view own activity"
    ON public.partner_activity_log
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.education_partners
            WHERE id = partner_id
            AND primary_contact_user_id = auth.uid()
        )
    );

-- ============================================
-- 10. TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_education_partner_applications_updated_at ON public.education_partner_applications;
CREATE TRIGGER update_education_partner_applications_updated_at
    BEFORE UPDATE ON public.education_partner_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_partners_updated_at ON public.education_partners;
CREATE TRIGGER update_education_partners_updated_at
    BEFORE UPDATE ON public.education_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_partner_programs_updated_at ON public.education_partner_programs;
CREATE TRIGGER update_education_partner_programs_updated_at
    BEFORE UPDATE ON public.education_partner_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_employer_connections_updated_at ON public.partner_employer_connections;
CREATE TRIGGER update_partner_employer_connections_updated_at
    BEFORE UPDATE ON public.partner_employer_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_graduate_outcomes_updated_at ON public.graduate_outcomes;
CREATE TRIGGER update_graduate_outcomes_updated_at
    BEFORE UPDATE ON public.graduate_outcomes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_events_updated_at ON public.partner_events;
CREATE TRIGGER update_partner_events_updated_at
    BEFORE UPDATE ON public.partner_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. HELPER FUNCTIONS
-- ============================================

-- Function to approve an education partner application
CREATE OR REPLACE FUNCTION approve_education_partner_application(
    p_application_id UUID,
    p_reviewer_id UUID,
    p_tier TEXT DEFAULT 'starter',
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_partner_id UUID;
    v_app RECORD;
BEGIN
    -- Get application details
    SELECT * INTO v_app
    FROM public.education_partner_applications
    WHERE id = p_application_id AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or already processed';
    END IF;

    -- Create partner record
    INSERT INTO public.education_partners (
        application_id,
        institution_name,
        institution_type,
        website,
        year_established,
        accreditation_body,
        tax_id,
        address,
        city,
        state,
        zip_code,
        country,
        contact_email,
        contact_phone,
        tier,
        status,
        approved_at,
        approved_by,
        clearance_levels,
        research_areas,
        funding_agencies,
        age_groups,
        can_list_programs,
        can_host_events,
        can_access_employer_network,
        can_track_outcomes,
        max_program_listings,
        max_events_per_year
    )
    VALUES (
        p_application_id,
        v_app.institution_name,
        v_app.institution_type,
        v_app.website,
        v_app.year_established,
        v_app.accreditation_body,
        v_app.tax_id,
        v_app.address,
        v_app.city,
        v_app.state,
        v_app.zip_code,
        v_app.country,
        v_app.contact_email,
        v_app.contact_phone,
        p_tier,
        'active',
        NOW(),
        p_reviewer_id,
        v_app.clearance_levels,
        v_app.research_areas,
        v_app.funding_agencies,
        v_app.age_groups,
        TRUE, -- can_list_programs (all tiers)
        CASE WHEN p_tier IN ('growth', 'enterprise') THEN TRUE ELSE FALSE END,
        TRUE, -- can_access_employer_network (all tiers)
        CASE WHEN p_tier IN ('growth', 'enterprise') THEN TRUE ELSE FALSE END,
        CASE WHEN p_tier = 'starter' THEN 5 WHEN p_tier = 'growth' THEN -1 ELSE -1 END, -- -1 = unlimited
        CASE WHEN p_tier = 'growth' THEN 2 WHEN p_tier = 'enterprise' THEN -1 ELSE 0 END
    )
    RETURNING id INTO v_partner_id;

    -- Update application status
    UPDATE public.education_partner_applications
    SET
        status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = p_reviewer_id,
        review_notes = p_notes
    WHERE id = p_application_id;

    RETURN v_partner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get partner dashboard stats
CREATE OR REPLACE FUNCTION get_partner_dashboard_stats(p_partner_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_programs', (SELECT COUNT(*) FROM public.education_partner_programs WHERE partner_id = p_partner_id AND status = 'active'),
        'total_events', (SELECT COUNT(*) FROM public.partner_events WHERE partner_id = p_partner_id),
        'upcoming_events', (SELECT COUNT(*) FROM public.partner_events WHERE partner_id = p_partner_id AND start_time > NOW() AND status = 'published'),
        'employer_connections', (SELECT COUNT(*) FROM public.partner_employer_connections WHERE partner_id = p_partner_id AND status = 'active'),
        'students_placed', (SELECT COALESCE(SUM(employed_in_field_count), 0) FROM public.graduate_outcomes WHERE partner_id = p_partner_id),
        'recent_activity', (
            SELECT json_agg(a ORDER BY a.created_at DESC)
            FROM (
                SELECT action, entity_type, details, created_at
                FROM public.partner_activity_log
                WHERE partner_id = p_partner_id
                ORDER BY created_at DESC
                LIMIT 10
            ) a
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT ON public.education_partner_applications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.education_partner_applications TO authenticated;

GRANT SELECT ON public.education_partners TO anon;
GRANT SELECT, INSERT, UPDATE ON public.education_partners TO authenticated;

GRANT SELECT ON public.education_partner_programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education_partner_programs TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_employer_connections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.graduate_outcomes TO authenticated;

GRANT SELECT ON public.partner_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_events TO authenticated;

GRANT SELECT, INSERT ON public.partner_activity_log TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION approve_education_partner_application TO authenticated;
GRANT EXECUTE ON FUNCTION get_partner_dashboard_stats TO authenticated;
