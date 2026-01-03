-- ============================================
-- HEALTHCARE INDUSTRY DATABASE MIGRATION
-- Version: 003
-- Description: Add healthcare industry support
-- ============================================

-- ============================================
-- 1. UPDATE ENUM TYPES
-- ============================================

-- Add 'healthcare' to industry type if not exists
DO $$
BEGIN
    ALTER TYPE industry_type ADD VALUE IF NOT EXISTS 'healthcare';
EXCEPTION WHEN others THEN
    NULL;
END $$;

-- Add 'healthcare' to employer type if not exists
DO $$
BEGIN
    ALTER TYPE employer_type ADD VALUE IF NOT EXISTS 'healthcare';
EXCEPTION WHEN others THEN
    NULL;
END $$;

-- Create healthcare compliance level type
DO $$
BEGIN
    CREATE TYPE healthcare_compliance_level AS ENUM (
        'none',
        'hipaa-basic',
        'hipaa-certified',
        'phi-access',
        'clinical-privileged',
        'dea-registered'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Create healthcare certification type
DO $$
BEGIN
    CREATE TYPE healthcare_certification AS ENUM (
        'rhit',
        'rhia',
        'cpc',
        'ccs',
        'chda',
        'cahims',
        'cphims',
        'epic-certified',
        'cerner-certified',
        'pmp-healthcare',
        'six-sigma-healthcare',
        'ccrc',
        'ccrp'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Create healthcare job category type
DO $$
BEGIN
    CREATE TYPE healthcare_job_category AS ENUM (
        'health-it',
        'clinical-informatics',
        'medical-devices',
        'healthcare-analytics',
        'telemedicine',
        'clinical-research',
        'revenue-cycle',
        'population-health',
        'healthcare-ai',
        'biomedical-engineering',
        'health-administration',
        'pharmacy-tech'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Create EHR system type
DO $$
BEGIN
    CREATE TYPE ehr_system AS ENUM (
        'epic',
        'cerner',
        'meditech',
        'allscripts',
        'athenahealth',
        'nextgen',
        'eclinicalworks',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================
-- 2. ADD HEALTHCARE COLUMNS TO JOBS TABLE
-- ============================================

ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS healthcare_category healthcare_job_category,
ADD COLUMN IF NOT EXISTS compliance_level healthcare_compliance_level DEFAULT 'none',
ADD COLUMN IF NOT EXISTS required_certifications healthcare_certification[],
ADD COLUMN IF NOT EXISTS clinical_experience_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ehr_system ehr_system,
ADD COLUMN IF NOT EXISTS patient_facing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hipaa_training_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS telemedicine_eligible BOOLEAN DEFAULT FALSE;

-- ============================================
-- 3. ADD HEALTHCARE COLUMNS TO USERS TABLE
-- ============================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS healthcare_certifications healthcare_certification[],
ADD COLUMN IF NOT EXISTS hipaa_certified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hipaa_certification_date DATE,
ADD COLUMN IF NOT EXISTS clinical_experience_years INTEGER,
ADD COLUMN IF NOT EXISTS ehr_experience ehr_system[],
ADD COLUMN IF NOT EXISTS state_licenses TEXT[], -- e.g., ['RN-CA', 'RN-TX']
ADD COLUMN IF NOT EXISTS npi_number TEXT; -- National Provider Identifier

-- ============================================
-- 4. ADD HEALTHCARE COLUMNS TO ORGANIZATIONS TABLE
-- ============================================

ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS healthcare_facility_type TEXT, -- hospital, clinic, health_system, etc.
ADD COLUMN IF NOT EXISTS cms_provider_number TEXT, -- Centers for Medicare & Medicaid Services
ADD COLUMN IF NOT EXISTS hipaa_compliant BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS joint_commission_accredited BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ehr_systems ehr_system[],
ADD COLUMN IF NOT EXISTS bed_count INTEGER, -- For hospitals
ADD COLUMN IF NOT EXISTS specialty_areas TEXT[]; -- Cardiology, Oncology, etc.

-- ============================================
-- 5. CREATE HEALTHCARE-SPECIFIC TABLES
-- ============================================

-- Healthcare Certifications Lookup Table
CREATE TABLE IF NOT EXISTS public.healthcare_certifications_lookup (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    category TEXT NOT NULL,
    issuing_body TEXT,
    renewal_period_years INTEGER,
    description TEXT,
    requirements TEXT[],
    exam_required BOOLEAN DEFAULT TRUE,
    ce_hours_required INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert standard certifications
INSERT INTO public.healthcare_certifications_lookup (id, name, full_name, category, issuing_body, renewal_period_years, description) VALUES
    ('rhit', 'RHIT', 'Registered Health Information Technician', 'HIM', 'AHIMA', 2, 'Health information management technician certification'),
    ('rhia', 'RHIA', 'Registered Health Information Administrator', 'HIM', 'AHIMA', 2, 'Health information management administrator certification'),
    ('cpc', 'CPC', 'Certified Professional Coder', 'Coding', 'AAPC', 2, 'Medical coding certification'),
    ('ccs', 'CCS', 'Certified Coding Specialist', 'Coding', 'AHIMA', 2, 'Hospital-based coding certification'),
    ('chda', 'CHDA', 'Certified Health Data Analyst', 'Analytics', 'AHIMA', 2, 'Healthcare data analytics certification'),
    ('cahims', 'CAHIMS', 'Certified Associate in Healthcare Information & Management Systems', 'IT', 'HIMSS', 3, 'Entry-level health IT certification'),
    ('cphims', 'CPHIMS', 'Certified Professional in Healthcare Information & Management Systems', 'IT', 'HIMSS', 3, 'Professional health IT certification'),
    ('epic-certified', 'Epic Certified', 'Epic EHR Certification', 'EHR', 'Epic Systems', 2, 'Epic electronic health record system certification'),
    ('cerner-certified', 'Cerner Certified', 'Cerner EHR Certification', 'EHR', 'Oracle Cerner', 2, 'Cerner electronic health record system certification'),
    ('ccrc', 'CCRC', 'Certified Clinical Research Coordinator', 'Research', 'ACRP', 2, 'Clinical research coordinator certification'),
    ('ccrp', 'CCRP', 'Certified Clinical Research Professional', 'Research', 'SOCRA', 3, 'Clinical research professional certification')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name;

-- Healthcare Employers/Facilities Table
CREATE TABLE IF NOT EXISTS public.healthcare_facilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    facility_name TEXT NOT NULL,
    facility_type TEXT NOT NULL, -- hospital, clinic, nursing_home, etc.
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    website TEXT,
    bed_count INTEGER,
    trauma_level TEXT, -- Level I, II, III, IV, V
    teaching_hospital BOOLEAN DEFAULT FALSE,
    magnet_status BOOLEAN DEFAULT FALSE, -- Nursing excellence designation
    ehr_system ehr_system,
    specialties TEXT[],
    cms_rating INTEGER, -- 1-5 stars
    joint_commission_accredited BOOLEAN DEFAULT FALSE,
    open_positions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Healthcare Training Programs Table
CREATE TABLE IF NOT EXISTS public.healthcare_training_programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    program_type TEXT NOT NULL, -- degree, certificate, bootcamp, employer_training
    duration TEXT,
    modality TEXT, -- online, in-person, hybrid
    cost DECIMAL(10,2),
    financial_aid_available BOOLEAN DEFAULT FALSE,
    accreditation TEXT,
    certifications_earned healthcare_certification[],
    job_placement_rate DECIMAL(5,2),
    average_starting_salary DECIMAL(10,2),
    prerequisites TEXT[],
    career_paths TEXT[],
    state TEXT,
    city TEXT,
    website TEXT,
    contact_email TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Healthcare Internship Programs Table
CREATE TABLE IF NOT EXISTS public.healthcare_internship_programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    facility_id UUID REFERENCES public.healthcare_facilities(id),
    program_name TEXT NOT NULL,
    department TEXT,
    internship_type TEXT, -- clinical, administrative, IT, research
    duration_weeks INTEGER,
    paid BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(8,2),
    stipend DECIMAL(10,2),
    clinical_hours INTEGER,
    preceptor_assigned BOOLEAN DEFAULT TRUE,
    ehr_training_included BOOLEAN DEFAULT FALSE,
    hipaa_training_included BOOLEAN DEFAULT TRUE,
    certifications_provided TEXT[],
    academic_credit_available BOOLEAN DEFAULT FALSE,
    credit_hours INTEGER,
    minimum_gpa DECIMAL(3,2),
    required_coursework TEXT[],
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    positions_available INTEGER DEFAULT 1,
    applications_received INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 6. CREATE INDEXES FOR HEALTHCARE TABLES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_jobs_healthcare_category ON public.jobs(healthcare_category);
CREATE INDEX IF NOT EXISTS idx_jobs_compliance_level ON public.jobs(compliance_level);
CREATE INDEX IF NOT EXISTS idx_jobs_ehr_system ON public.jobs(ehr_system);
CREATE INDEX IF NOT EXISTS idx_healthcare_facilities_state ON public.healthcare_facilities(state);
CREATE INDEX IF NOT EXISTS idx_healthcare_facilities_type ON public.healthcare_facilities(facility_type);
CREATE INDEX IF NOT EXISTS idx_healthcare_training_state ON public.healthcare_training_programs(state);
CREATE INDEX IF NOT EXISTS idx_users_healthcare_certs ON public.users USING GIN(healthcare_certifications);

-- ============================================
-- 7. CREATE HEALTHCARE VIEWS
-- ============================================

-- Healthcare Jobs View with full details
CREATE OR REPLACE VIEW public.healthcare_jobs_view AS
SELECT 
    j.*,
    o.name as organization_name,
    o.logo as organization_logo,
    hf.facility_type,
    hf.bed_count,
    hf.teaching_hospital,
    hf.magnet_status,
    hf.cms_rating
FROM public.jobs j
LEFT JOIN public.organizations o ON j.organization_id = o.id
LEFT JOIN public.healthcare_facilities hf ON o.id = hf.organization_id
WHERE j.industry = 'healthcare';

-- Healthcare Workforce Summary by State
CREATE OR REPLACE VIEW public.healthcare_workforce_by_state AS
SELECT 
    hf.state,
    COUNT(DISTINCT hf.id) as facility_count,
    SUM(hf.open_positions) as total_open_positions,
    SUM(hf.bed_count) as total_beds,
    COUNT(DISTINCT CASE WHEN hf.teaching_hospital THEN hf.id END) as teaching_hospitals,
    AVG(hf.cms_rating) as avg_cms_rating
FROM public.healthcare_facilities hf
GROUP BY hf.state;

-- ============================================
-- 8. INSERT SAMPLE HEALTHCARE DATA
-- ============================================

-- Note: Sample employers should be inserted via application or separate seed file
-- This ensures proper foreign key relationships

-- ============================================
-- 9. ROW LEVEL SECURITY FOR HEALTHCARE TABLES
-- ============================================

-- Enable RLS on healthcare tables
ALTER TABLE public.healthcare_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_internship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_certifications_lookup ENABLE ROW LEVEL SECURITY;

-- Public read access for lookup tables
CREATE POLICY "Public read access for certifications lookup"
ON public.healthcare_certifications_lookup FOR SELECT
TO public
USING (true);

-- Public read access for facilities
CREATE POLICY "Public read access for healthcare facilities"
ON public.healthcare_facilities FOR SELECT
TO public
USING (true);

-- Public read access for training programs
CREATE POLICY "Public read access for healthcare training"
ON public.healthcare_training_programs FOR SELECT
TO public
USING (active = true);

-- Public read access for internship programs
CREATE POLICY "Public read access for healthcare internships"
ON public.healthcare_internship_programs FOR SELECT
TO public
USING (true);

-- Partners can manage their own facilities
CREATE POLICY "Partners can manage own facilities"
ON public.healthcare_facilities FOR ALL
TO authenticated
USING (
    organization_id IN (
        SELECT id FROM public.organizations WHERE created_by = auth.uid()
    )
)
WITH CHECK (
    organization_id IN (
        SELECT id FROM public.organizations WHERE created_by = auth.uid()
    )
);

-- ============================================
-- 10. GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public.healthcare_certifications_lookup TO anon, authenticated;
GRANT SELECT ON public.healthcare_facilities TO anon, authenticated;
GRANT SELECT ON public.healthcare_training_programs TO anon, authenticated;
GRANT SELECT ON public.healthcare_internship_programs TO anon, authenticated;
GRANT SELECT ON public.healthcare_jobs_view TO anon, authenticated;
GRANT SELECT ON public.healthcare_workforce_by_state TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.healthcare_facilities TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.healthcare_training_programs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.healthcare_internship_programs TO authenticated;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
