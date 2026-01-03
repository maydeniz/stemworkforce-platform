-- ============================================
-- PHASE 2: Enhanced Job Posting & Skills Migration
-- Version: 005
-- Description: Add comprehensive job posting fields, skills system, salary ranges
-- ============================================

-- ============================================
-- 1. CREATE NEW ENUM TYPES
-- ============================================

-- Employment type
DO $$
BEGIN
    CREATE TYPE employment_type AS ENUM (
        'full-time',
        'part-time',
        'contract',
        'contract-to-hire',
        'internship',
        'fellowship',
        'apprenticeship',
        'residency',
        'travel'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Experience level
DO $$
BEGIN
    CREATE TYPE experience_level AS ENUM (
        'entry',
        'mid',
        'senior',
        'lead',
        'executive'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Work arrangement
DO $$
BEGIN
    CREATE TYPE work_arrangement AS ENUM (
        'on-site',
        'hybrid-3',
        'hybrid-2',
        'remote-us',
        'remote-state',
        'remote-global'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Citizenship requirement
DO $$
BEGIN
    CREATE TYPE citizenship_requirement AS ENUM (
        'any',
        'us-citizen-only',
        'us-person',
        'us-authorized'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Education level
DO $$
BEGIN
    CREATE TYPE education_level AS ENUM (
        'high-school',
        'some-college',
        'associate',
        'bachelors',
        'masters',
        'phd',
        'md',
        'equivalent'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Travel requirement
DO $$
BEGIN
    CREATE TYPE travel_requirement AS ENUM (
        'none',
        'occasional',
        'moderate',
        'frequent',
        'extensive'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Application method
DO $$
BEGIN
    CREATE TYPE application_method AS ENUM (
        'platform',
        'external',
        'email'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Federal pay plan
DO $$
BEGIN
    CREATE TYPE federal_pay_plan AS ENUM (
        'GS',
        'SES',
        'WG',
        'NH',
        'AD'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================
-- 2. UPDATE JOBS TABLE WITH PHASE 2 FIELDS
-- ============================================

-- Basic job fields
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS responsibilities TEXT,
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full-time',
ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'mid',
ADD COLUMN IF NOT EXISTS work_arrangement TEXT DEFAULT 'on-site',
ADD COLUMN IF NOT EXISTS travel_required TEXT DEFAULT 'none';

-- Compensation fields
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS salary_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_max INTEGER,
ADD COLUMN IF NOT EXISTS salary_period TEXT DEFAULT 'yearly',
ADD COLUMN IF NOT EXISTS show_salary BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS bonus_eligible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS equity_offered BOOLEAN DEFAULT FALSE;

-- Clearance & Citizenship fields
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS clearance_status TEXT DEFAULT 'not-required',
ADD COLUMN IF NOT EXISTS citizenship_required TEXT DEFAULT 'any',
ADD COLUMN IF NOT EXISTS visa_sponsorship BOOLEAN DEFAULT FALSE;

-- Education & Skills
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS education_required TEXT DEFAULT 'bachelors',
ADD COLUMN IF NOT EXISTS required_skills TEXT[],
ADD COLUMN IF NOT EXISTS preferred_skills TEXT[],
ADD COLUMN IF NOT EXISTS certifications_required TEXT[];

-- Federal/Government specific
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS pay_plan TEXT,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS series_number TEXT,
ADD COLUMN IF NOT EXISTS bargaining_unit TEXT,
ADD COLUMN IF NOT EXISTS veterans_preference BOOLEAN DEFAULT FALSE;

-- National Lab specific
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS itar_controlled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ear_controlled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS drug_test_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS polygraph_required BOOLEAN DEFAULT FALSE;

-- Healthcare specific
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS hipaa_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ehr_system TEXT,
ADD COLUMN IF NOT EXISTS clinical_experience BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS patient_facing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS healthcare_certifications TEXT[];

-- Academic specific
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS academic_level TEXT,
ADD COLUMN IF NOT EXISTS gpa_minimum DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS credit_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS credit_hours INTEGER;

-- Application settings
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS application_method TEXT DEFAULT 'platform',
ADD COLUMN IF NOT EXISTS external_url TEXT,
ADD COLUMN IF NOT EXISTS application_deadline DATE,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS custom_questions JSONB;

-- ============================================
-- 3. CREATE SKILLS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    industry TEXT,
    description TEXT,
    aliases TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. CREATE USER_SKILLS TABLE (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
    years_experience INTEGER,
    last_used_year INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    endorsement_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, skill_id)
);

-- ============================================
-- 5. CREATE JOB_SKILLS TABLE (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS public.job_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE, -- true = required, false = preferred
    min_years INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(job_id, skill_id)
);

-- ============================================
-- 6. CREATE CERTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL UNIQUE,
    issuing_body TEXT NOT NULL,
    category TEXT NOT NULL,
    industry TEXT,
    description TEXT,
    website_url TEXT,
    renewal_period_years INTEGER,
    exam_required BOOLEAN DEFAULT TRUE,
    ce_hours_required INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 7. CREATE USER_CERTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
    certification_number TEXT,
    issue_date DATE,
    expiration_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, certification_id)
);

-- ============================================
-- 8. SEED COMMON SKILLS
-- ============================================

INSERT INTO public.skills (name, category, industry, description) VALUES
-- Programming Languages
('Python', 'Programming', NULL, 'General-purpose programming language'),
('JavaScript', 'Programming', NULL, 'Web and application development language'),
('TypeScript', 'Programming', NULL, 'Typed superset of JavaScript'),
('Java', 'Programming', NULL, 'Object-oriented programming language'),
('C++', 'Programming', NULL, 'High-performance systems programming'),
('Rust', 'Programming', NULL, 'Systems programming with memory safety'),
('Go', 'Programming', NULL, 'Cloud and systems programming language'),
('SQL', 'Programming', NULL, 'Database query language'),
('R', 'Programming', NULL, 'Statistical computing and graphics'),

-- AI/ML Skills
('Machine Learning', 'AI/ML', 'ai', 'Building and training ML models'),
('Deep Learning', 'AI/ML', 'ai', 'Neural network architectures'),
('Natural Language Processing', 'AI/ML', 'ai', 'Text and language analysis'),
('Computer Vision', 'AI/ML', 'ai', 'Image and video analysis'),
('TensorFlow', 'AI/ML', 'ai', 'ML framework by Google'),
('PyTorch', 'AI/ML', 'ai', 'ML framework by Meta'),
('LLMs', 'AI/ML', 'ai', 'Large Language Models'),

-- Cloud & DevOps
('AWS', 'Cloud', NULL, 'Amazon Web Services'),
('Azure', 'Cloud', NULL, 'Microsoft Azure cloud platform'),
('GCP', 'Cloud', NULL, 'Google Cloud Platform'),
('Docker', 'DevOps', NULL, 'Container platform'),
('Kubernetes', 'DevOps', NULL, 'Container orchestration'),
('CI/CD', 'DevOps', NULL, 'Continuous integration/deployment'),
('Terraform', 'DevOps', NULL, 'Infrastructure as code'),

-- Cybersecurity
('Network Security', 'Security', 'cybersecurity', 'Securing network infrastructure'),
('Penetration Testing', 'Security', 'cybersecurity', 'Security vulnerability testing'),
('SIEM', 'Security', 'cybersecurity', 'Security information and event management'),
('Incident Response', 'Security', 'cybersecurity', 'Security incident handling'),
('Cryptography', 'Security', 'cybersecurity', 'Encryption and security protocols'),

-- Quantum Computing
('Qiskit', 'Quantum', 'quantum', 'IBM quantum computing framework'),
('Cirq', 'Quantum', 'quantum', 'Google quantum computing framework'),
('Quantum Algorithms', 'Quantum', 'quantum', 'Quantum algorithm development'),
('Quantum Error Correction', 'Quantum', 'quantum', 'Error mitigation techniques'),

-- Healthcare IT
('Epic EHR', 'Healthcare IT', 'healthcare', 'Epic electronic health records'),
('Cerner EHR', 'Healthcare IT', 'healthcare', 'Cerner electronic health records'),
('HL7 FHIR', 'Healthcare IT', 'healthcare', 'Healthcare data exchange standard'),
('HIPAA Compliance', 'Healthcare IT', 'healthcare', 'Healthcare privacy compliance'),
('Clinical Informatics', 'Healthcare IT', 'healthcare', 'Clinical data management'),

-- Nuclear/Energy
('Nuclear Engineering', 'Engineering', 'nuclear', 'Nuclear systems engineering'),
('Radiation Protection', 'Engineering', 'nuclear', 'Radiation safety and monitoring'),
('Reactor Physics', 'Engineering', 'nuclear', 'Nuclear reactor physics'),

-- Semiconductor
('VLSI Design', 'Engineering', 'semiconductor', 'Very large scale integration'),
('Verilog', 'Engineering', 'semiconductor', 'Hardware description language'),
('ASIC Design', 'Engineering', 'semiconductor', 'Application-specific IC design'),
('Cleanroom Operations', 'Manufacturing', 'semiconductor', 'Semiconductor fabrication'),

-- Aerospace
('Aerodynamics', 'Engineering', 'aerospace', 'Aerodynamic analysis and design'),
('Propulsion Systems', 'Engineering', 'aerospace', 'Aircraft and rocket propulsion'),
('Avionics', 'Engineering', 'aerospace', 'Aircraft electronic systems'),
('Flight Testing', 'Engineering', 'aerospace', 'Aircraft test and evaluation'),

-- Soft Skills
('Project Management', 'Management', NULL, 'Leading and managing projects'),
('Technical Writing', 'Communication', NULL, 'Technical documentation'),
('Team Leadership', 'Management', NULL, 'Leading technical teams'),
('Agile/Scrum', 'Management', NULL, 'Agile project methodology'),
('Public Speaking', 'Communication', NULL, 'Presentations and public speaking')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 9. SEED CERTIFICATIONS
-- ============================================

INSERT INTO public.certifications (name, short_name, issuing_body, category, industry, renewal_period_years, exam_required) VALUES
-- Security Certifications
('Certified Information Systems Security Professional', 'CISSP', 'ISC2', 'Security', 'cybersecurity', 3, TRUE),
('Certified Ethical Hacker', 'CEH', 'EC-Council', 'Security', 'cybersecurity', 3, TRUE),
('CompTIA Security+', 'Security+', 'CompTIA', 'Security', 'cybersecurity', 3, TRUE),
('Certified Information Security Manager', 'CISM', 'ISACA', 'Security', 'cybersecurity', 3, TRUE),

-- Cloud Certifications
('AWS Solutions Architect - Associate', 'AWS-SAA', 'Amazon', 'Cloud', NULL, 3, TRUE),
('AWS Solutions Architect - Professional', 'AWS-SAP', 'Amazon', 'Cloud', NULL, 3, TRUE),
('Azure Solutions Architect Expert', 'AZ-305', 'Microsoft', 'Cloud', NULL, 2, TRUE),
('Google Cloud Professional Architect', 'GCP-PCA', 'Google', 'Cloud', NULL, 2, TRUE),

-- Project Management
('Project Management Professional', 'PMP', 'PMI', 'Management', NULL, 3, TRUE),
('Certified Scrum Master', 'CSM', 'Scrum Alliance', 'Management', NULL, 2, TRUE),
('Six Sigma Green Belt', 'SSGB', 'ASQ', 'Management', NULL, NULL, TRUE),

-- Healthcare Certifications
('Registered Health Information Technician', 'RHIT', 'AHIMA', 'Healthcare', 'healthcare', 2, TRUE),
('Registered Health Information Administrator', 'RHIA', 'AHIMA', 'Healthcare', 'healthcare', 2, TRUE),
('Certified Professional Coder', 'CPC', 'AAPC', 'Healthcare', 'healthcare', 2, TRUE),
('Certified Health Data Analyst', 'CHDA', 'AHIMA', 'Healthcare', 'healthcare', 2, TRUE),
('Epic Certification', 'Epic', 'Epic Systems', 'Healthcare', 'healthcare', NULL, TRUE),
('Cerner Certification', 'Cerner', 'Oracle Cerner', 'Healthcare', 'healthcare', NULL, TRUE),

-- Nuclear/DOE
('Reactor Operator License', 'RO', 'NRC', 'Nuclear', 'nuclear', 6, TRUE),
('Senior Reactor Operator License', 'SRO', 'NRC', 'Nuclear', 'nuclear', 6, TRUE),
('Certified Health Physicist', 'CHP', 'ABHP', 'Nuclear', 'nuclear', 4, TRUE)
ON CONFLICT (short_name) DO NOTHING;

-- ============================================
-- 10. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_work_arrangement ON public.jobs(work_arrangement);
CREATE INDEX IF NOT EXISTS idx_jobs_citizenship_required ON public.jobs(citizenship_required);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON public.jobs(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_application_deadline ON public.jobs(application_deadline);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_industry ON public.skills(industry);
-- Trigram index removed (requires pg_trgm extension)
-- CREATE INDEX IF NOT EXISTS idx_skills_name_trgm ON public.skills USING gin(name gin_trgm_ops);
-- Using standard btree index instead:
CREATE INDEX IF NOT EXISTS idx_skills_name_search ON public.skills(name);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON public.user_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_job_skills_job ON public.job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_skill ON public.job_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_certifications_category ON public.certifications(category);
CREATE INDEX IF NOT EXISTS idx_certifications_industry ON public.certifications(industry);

CREATE INDEX IF NOT EXISTS idx_user_certifications_user ON public.user_certifications(user_id);

-- ============================================
-- 11. CREATE VIEWS
-- ============================================

-- Jobs with full details view (basic version - applications join added in Phase 3)
CREATE OR REPLACE VIEW public.jobs_full_view AS
SELECT 
    j.*,
    o.name as organization_name,
    o.type as organization_type,
    o.logo_url as organization_logo,
    o.website as organization_website,
    o.clearance_sponsor,
    o.visa_sponsor,
    0 as application_count  -- Placeholder until applications table exists
FROM public.jobs j
LEFT JOIN public.organizations o ON j.organization_id = o.id;

-- Skills usage summary view
CREATE OR REPLACE VIEW public.skills_summary_view AS
SELECT 
    s.id,
    s.name,
    s.category,
    s.industry,
    COUNT(DISTINCT us.user_id) as user_count,
    COUNT(DISTINCT js.job_id) as job_count
FROM public.skills s
LEFT JOIN public.user_skills us ON s.id = us.skill_id
LEFT JOIN public.job_skills js ON s.id = js.skill_id
GROUP BY s.id;

-- ============================================
-- 12. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;

-- Skills: public read
CREATE POLICY "Skills are viewable by everyone"
ON public.skills FOR SELECT TO public USING (true);

-- User Skills: owner access
CREATE POLICY "Users can view their own skills"
ON public.user_skills FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own skills"
ON public.user_skills FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Job Skills: public read
CREATE POLICY "Job skills are viewable by everyone"
ON public.job_skills FOR SELECT TO public USING (true);

-- Certifications: public read
CREATE POLICY "Certifications are viewable by everyone"
ON public.certifications FOR SELECT TO public USING (true);

-- User Certifications: owner access
CREATE POLICY "Users can view their own certifications"
ON public.user_certifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own certifications"
ON public.user_certifications FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 13. GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_skills TO authenticated;
GRANT SELECT ON public.job_skills TO anon, authenticated;
GRANT SELECT ON public.certifications TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_certifications TO authenticated;
GRANT SELECT ON public.jobs_full_view TO anon, authenticated;
GRANT SELECT ON public.skills_summary_view TO anon, authenticated;

-- ============================================
-- 14. FUNCTIONS FOR SKILL MATCHING
-- ============================================

-- Function to calculate job-candidate skill match percentage
CREATE OR REPLACE FUNCTION public.calculate_skill_match(
    p_job_id UUID,
    p_user_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    v_required_skills INTEGER;
    v_matched_skills INTEGER;
    v_match_percentage DECIMAL;
BEGIN
    -- Count required skills for the job
    SELECT COUNT(*) INTO v_required_skills
    FROM public.job_skills
    WHERE job_id = p_job_id AND is_required = TRUE;
    
    IF v_required_skills = 0 THEN
        RETURN 100.0;
    END IF;
    
    -- Count matched skills
    SELECT COUNT(*) INTO v_matched_skills
    FROM public.job_skills js
    INNER JOIN public.user_skills us ON js.skill_id = us.skill_id
    WHERE js.job_id = p_job_id 
      AND js.is_required = TRUE
      AND us.user_id = p_user_id;
    
    -- Calculate percentage
    v_match_percentage := (v_matched_skills::DECIMAL / v_required_skills::DECIMAL) * 100;
    
    RETURN ROUND(v_match_percentage, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search skills by name
CREATE OR REPLACE FUNCTION public.search_skills(
    p_query TEXT,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    industry TEXT,
    usage_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.category, s.industry, s.usage_count
    FROM public.skills s
    WHERE s.name ILIKE '%' || p_query || '%'
       OR p_query = ANY(s.aliases)
    ORDER BY s.usage_count DESC, s.name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PHASE 2 MIGRATION COMPLETE
-- ============================================
