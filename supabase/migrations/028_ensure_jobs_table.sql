-- ============================================
-- ENSURE JOBS TABLE EXISTS
-- Creates the base jobs table if not present
-- ============================================

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    type TEXT DEFAULT 'full-time', -- job, internship
    status TEXT DEFAULT 'draft', -- draft, active, paused, closed, expired

    -- Core fields
    department TEXT,
    responsibilities TEXT,
    qualifications TEXT,
    employment_type TEXT DEFAULT 'full-time',
    experience_level TEXT DEFAULT 'mid',
    work_arrangement TEXT DEFAULT 'on-site',
    travel_required TEXT DEFAULT 'none',

    -- Compensation
    salary_min INTEGER,
    salary_max INTEGER,
    salary_period TEXT DEFAULT 'yearly', -- yearly, hourly
    show_salary BOOLEAN DEFAULT TRUE,
    bonus_eligible BOOLEAN DEFAULT FALSE,
    equity_offered BOOLEAN DEFAULT FALSE,
    benefits TEXT[],

    -- Clearance & Citizenship
    clearance_level TEXT DEFAULT 'none',
    clearance_status TEXT DEFAULT 'not-required',
    citizenship_required TEXT DEFAULT 'any',
    visa_sponsorship BOOLEAN DEFAULT FALSE,

    -- Education & Skills
    education_required TEXT DEFAULT 'bachelors',
    years_experience_min INTEGER DEFAULT 0,
    years_experience_max INTEGER,
    required_skills TEXT[],
    preferred_skills TEXT[],
    certifications_required TEXT[],

    -- Federal/Government specific
    pay_plan TEXT,
    grade_level TEXT,
    series_number TEXT,
    bargaining_unit TEXT,
    veterans_preference BOOLEAN DEFAULT FALSE,

    -- National Lab specific
    itar_controlled BOOLEAN DEFAULT FALSE,
    ear_controlled BOOLEAN DEFAULT FALSE,
    drug_test_required BOOLEAN DEFAULT FALSE,
    polygraph_required BOOLEAN DEFAULT FALSE,

    -- Healthcare specific
    hipaa_required BOOLEAN DEFAULT FALSE,
    clinical_experience BOOLEAN DEFAULT FALSE,
    patient_facing BOOLEAN DEFAULT FALSE,

    -- Internship specific
    is_internship BOOLEAN DEFAULT FALSE,
    internship_duration TEXT,
    internship_paid BOOLEAN DEFAULT TRUE,
    internship_stipend TEXT,
    academic_credit_available BOOLEAN DEFAULT FALSE,
    mentorship_provided BOOLEAN DEFAULT FALSE,
    conversion_possible BOOLEAN DEFAULT FALSE,

    -- Application settings
    application_method TEXT DEFAULT 'platform',
    external_url TEXT,
    application_email TEXT,
    application_deadline DATE,
    start_date DATE,
    custom_questions JSONB,

    -- Posting settings
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Metrics
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_organization ON public.jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON public.jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
ON public.jobs FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Org members can view all their org jobs" ON public.jobs;
CREATE POLICY "Org members can view all their org jobs"
ON public.jobs FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Org members can insert jobs" ON public.jobs;
CREATE POLICY "Org members can insert jobs"
ON public.jobs FOR INSERT
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        JOIN public.admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'PARTNER_ADMIN', 'PARTNER_HR_MANAGER')
    )
);

DROP POLICY IF EXISTS "Org members can update their jobs" ON public.jobs;
CREATE POLICY "Org members can update their jobs"
ON public.jobs FOR UPDATE
USING (
    organization_id IN (
        SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
    OR posted_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        JOIN public.admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
    )
);

DROP POLICY IF EXISTS "Org members can delete their jobs" ON public.jobs;
CREATE POLICY "Org members can delete their jobs"
ON public.jobs FOR DELETE
USING (
    posted_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        JOIN public.admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'PARTNER_ADMIN')
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jobs_updated_at ON public.jobs;
CREATE TRIGGER jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at();

-- Function to increment application count
CREATE OR REPLACE FUNCTION increment_job_applications()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
