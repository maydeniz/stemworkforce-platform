-- =============================================
-- Municipality Partners System
-- Cities, Counties, Municipal HR Departments
-- Internships, Apprenticeships, Workforce Pipeline
-- =============================================

-- =============================================
-- MUNICIPALITY PARTNERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Organization Info
    municipality_name TEXT NOT NULL,
    municipality_type TEXT NOT NULL CHECK (municipality_type IN ('city', 'county', 'town', 'village', 'township', 'borough', 'regional_authority')),
    municipality_size TEXT NOT NULL CHECK (municipality_size IN ('small', 'medium', 'large', 'major', 'metro')),
    population INTEGER NOT NULL DEFAULT 0,

    -- Location
    city TEXT NOT NULL,
    county TEXT NOT NULL,
    state TEXT NOT NULL,
    region TEXT,
    timezone TEXT NOT NULL DEFAULT 'America/New_York',

    -- Primary Contact
    primary_contact_name TEXT NOT NULL,
    primary_contact_email TEXT NOT NULL,
    primary_contact_phone TEXT,
    primary_contact_title TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'human_resources',

    -- Organization Details
    total_employees INTEGER NOT NULL DEFAULT 0,
    annual_hiring_target INTEGER DEFAULT 0,
    current_vacancies INTEGER DEFAULT 0,
    retirement_eligible INTEGER DEFAULT 0,
    hr_budget DECIMAL(15,2),

    -- Partnership
    tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'professional', 'enterprise')),
    partner_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contract_expiration TIMESTAMP WITH TIME ZONE,

    -- Civil Service
    has_civil_service BOOLEAN DEFAULT true,
    civil_service_exemptions TEXT[],
    unionized BOOLEAN DEFAULT false,
    union_names TEXT[],

    -- Program Counts (denormalized for performance)
    active_internship_programs INTEGER DEFAULT 0,
    active_apprenticeships INTEGER DEFAULT 0,
    total_participants_ytd INTEGER DEFAULT 0,
    total_placements_ytd INTEGER DEFAULT 0,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INTERNSHIP PROGRAMS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_internship_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,

    -- Program Details
    program_name TEXT NOT NULL,
    program_type TEXT NOT NULL CHECK (program_type IN (
        'summer_youth', 'college_pathways', 'high_school_cte', 'mayors_fellowship',
        'department_specific', 'year_round', 'graduate_fellowship', 'work_study'
    )),
    description TEXT,

    -- Departments
    host_departments TEXT[] NOT NULL DEFAULT '{}',

    -- Timing
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hours_per_week INTEGER DEFAULT 40,
    duration_weeks INTEGER,

    -- Eligibility
    min_age INTEGER DEFAULT 16,
    max_age INTEGER DEFAULT 24,
    education_requirement TEXT DEFAULT 'none' CHECK (education_requirement IN (
        'high_school', 'enrolled_college', 'college_graduate', 'graduate_student', 'none'
    )),
    residency_required BOOLEAN DEFAULT false,
    residency_area TEXT,
    income_eligibility BOOLEAN DEFAULT false,
    income_threshold INTEGER,

    -- Compensation
    is_paid BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2),
    stipend DECIMAL(10,2),
    total_budget DECIMAL(15,2) NOT NULL DEFAULT 0,
    funding_source TEXT NOT NULL DEFAULT 'general_fund' CHECK (funding_source IN (
        'general_fund', 'federal_wioa', 'federal_cdbg', 'federal_arpa',
        'state_grant', 'private_foundation', 'employer_sponsored', 'union_partnership', 'mixed'
    )),

    -- Capacity
    total_slots INTEGER NOT NULL DEFAULT 10,
    filled_slots INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,

    -- Status
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'planning', 'recruiting', 'active', 'on_hold', 'completed', 'archived'
    )),
    application_deadline DATE,

    -- Outcomes
    completion_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    satisfaction_score DECIMAL(3,2),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- APPRENTICESHIP PROGRAMS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_apprenticeship_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,

    -- Program Details
    program_name TEXT NOT NULL,
    apprenticeship_type TEXT NOT NULL CHECK (apprenticeship_type IN (
        'registered', 'pre_apprenticeship', 'youth_apprenticeship', 'trades',
        'utilities', 'public_safety', 'it_cyber', 'administrative'
    )),
    occupation TEXT NOT NULL,
    rapids_code TEXT,
    description TEXT,

    -- Sponsorship
    sponsor_type TEXT NOT NULL DEFAULT 'municipality' CHECK (sponsor_type IN (
        'municipality', 'joint', 'union', 'contractor'
    )),
    union_partner TEXT,
    contractor_partners TEXT[],

    -- Departments
    host_departments TEXT[] NOT NULL DEFAULT '{}',

    -- Duration & Structure
    duration_months INTEGER NOT NULL DEFAULT 12,
    total_ojt_hours INTEGER NOT NULL DEFAULT 2000,
    total_rti_hours INTEGER NOT NULL DEFAULT 144,
    progressive_wage_schedule BOOLEAN DEFAULT true,

    -- Compensation
    starting_wage DECIMAL(10,2) NOT NULL,
    journey_wage DECIMAL(10,2) NOT NULL,
    benefits BOOLEAN DEFAULT true,

    -- Capacity
    total_slots INTEGER NOT NULL DEFAULT 5,
    active_apprentices INTEGER DEFAULT 0,
    graduated_ytd INTEGER DEFAULT 0,

    -- Requirements
    min_age INTEGER DEFAULT 18,
    education_requirement TEXT DEFAULT 'High school diploma or GED',
    physical_requirements TEXT,
    background_check_required BOOLEAN DEFAULT true,
    drug_test_required BOOLEAN DEFAULT true,
    drivers_license_required BOOLEAN DEFAULT false,

    -- Credentials
    credential_awarded TEXT NOT NULL,
    industry_recognized BOOLEAN DEFAULT true,

    -- Funding
    funding_source TEXT NOT NULL DEFAULT 'general_fund',
    employer_contribution DECIMAL(15,2),
    grant_funding DECIMAL(15,2),

    -- Status
    status TEXT NOT NULL DEFAULT 'planning',

    -- Outcomes
    completion_rate DECIMAL(5,2),
    retention_rate DECIMAL(5,2),
    avg_completion_time DECIMAL(5,2),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PARTICIPANTS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,
    program_id UUID NOT NULL,
    program_type TEXT NOT NULL CHECK (program_type IN ('internship', 'apprenticeship')),

    -- Personal Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,

    -- Demographics
    city TEXT,
    zip_code TEXT,
    is_resident BOOLEAN DEFAULT true,

    -- Education
    education_level TEXT CHECK (education_level IN (
        'high_school', 'some_college', 'associates', 'bachelors', 'masters', 'other'
    )),
    current_school TEXT,
    major TEXT,
    expected_graduation DATE,
    gpa DECIMAL(3,2),

    -- Eligibility
    meets_income_requirement BOOLEAN,
    is_veteran BOOLEAN DEFAULT false,
    has_disability BOOLEAN,
    is_first_gen_college BOOLEAN,

    -- Program Details
    department TEXT NOT NULL,
    supervisor TEXT,
    start_date DATE NOT NULL,
    expected_end_date DATE NOT NULL,
    actual_end_date DATE,

    -- Status
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN (
        'applied', 'screened', 'enrolled', 'active', 'on_leave',
        'completed', 'placed', 'exited', 'withdrawn'
    )),
    hours_completed INTEGER DEFAULT 0,

    -- For Apprentices
    current_wage DECIMAL(10,2),
    ojt_hours_completed INTEGER DEFAULT 0,
    rti_hours_completed INTEGER DEFAULT 0,
    competencies_completed INTEGER DEFAULT 0,
    total_competencies INTEGER,

    -- Civil Service
    civil_service_status TEXT CHECK (civil_service_status IN (
        'not_required', 'exam_scheduled', 'exam_completed', 'on_list', 'certified', 'appointed'
    )),
    exam_score DECIMAL(5,2),
    list_position INTEGER,

    -- Placement
    placed_in_city BOOLEAN DEFAULT false,
    placement_type TEXT CHECK (placement_type IN (
        'full_time_permanent', 'full_time_temp', 'part_time_permanent',
        'part_time_temp', 'seasonal', 'contract', 'fellowship'
    )),
    placement_department TEXT,
    placement_title TEXT,
    placement_salary DECIMAL(12,2),
    placement_date DATE,

    -- Evaluations
    midpoint_evaluation DECIMAL(3,2),
    final_evaluation DECIMAL(3,2),
    supervisor_recommendation TEXT CHECK (supervisor_recommendation IN (
        'highly_recommend', 'recommend', 'neutral', 'not_recommend'
    )),

    -- Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DEPARTMENT WORKFORCE NEEDS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_department_needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,
    department TEXT NOT NULL,

    -- Current State
    authorized_positions INTEGER NOT NULL DEFAULT 0,
    filled_positions INTEGER NOT NULL DEFAULT 0,
    vacancy_rate DECIMAL(5,2),

    -- Workforce Planning
    retirement_eligible_5_years INTEGER DEFAULT 0,
    hard_to_fill_positions TEXT[],
    critical_skill_gaps TEXT[],

    -- Hiring Pipeline
    active_requisitions INTEGER DEFAULT 0,
    avg_time_to_fill INTEGER,
    avg_cost_per_hire DECIMAL(10,2),

    -- Intern/Apprentice Needs
    intern_slots_requested INTEGER DEFAULT 0,
    intern_slots_approved INTEGER DEFAULT 0,
    apprentice_slots_requested INTEGER DEFAULT 0,
    apprentice_slots_approved INTEGER DEFAULT 0,

    -- Priority Areas
    priority_job_families TEXT[],
    emerging_skill_needs TEXT[],

    -- Budget
    training_budget DECIMAL(15,2),
    projected_hiring_budget DECIMAL(15,2),

    -- Metadata
    fiscal_year TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(municipality_id, department, fiscal_year)
);

-- =============================================
-- CIVIL SERVICE EXAMS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_civil_service_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,

    exam_title TEXT NOT NULL,
    exam_number TEXT,
    job_classification TEXT NOT NULL,

    -- Schedule
    application_open_date DATE,
    application_close_date DATE,
    exam_date DATE,
    results_expected_date DATE,
    list_expiration_date DATE,

    -- Details
    exam_type TEXT NOT NULL CHECK (exam_type IN (
        'written', 'performance', 'oral', 'education_experience', 'combined'
    )),
    is_continuous BOOLEAN DEFAULT false,

    -- Stats
    applicants_count INTEGER,
    passers_count INTEGER,
    passing_score DECIMAL(5,2) DEFAULT 70.00,

    -- Intern/Apprentice Connection
    linked_program_ids UUID[],

    -- Status
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN (
        'upcoming', 'open', 'closed', 'results_pending', 'list_active', 'list_expired'
    )),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- UNION PARTNERSHIPS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_union_partnerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,

    union_name TEXT NOT NULL,
    union_local TEXT,

    -- Contact
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,

    -- Agreement
    agreement_type TEXT NOT NULL CHECK (agreement_type IN (
        'apprenticeship_mou', 'hiring_hall', 'training_partnership', 'general'
    )),
    agreement_start_date DATE,
    agreement_end_date DATE,

    -- Programs
    covered_occupations TEXT[],
    covered_departments TEXT[],
    apprenticeship_program_ids UUID[],

    -- Hiring Hall
    uses_hiring_hall BOOLEAN DEFAULT false,
    hiring_hall_procedure TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COMPLIANCE REPORTS
-- =============================================
CREATE TABLE IF NOT EXISTS municipality_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipality_partners(id) ON DELETE CASCADE,

    report_type TEXT NOT NULL CHECK (report_type IN (
        'quarterly_progress', 'annual_performance', 'grant_expenditure',
        'wioa_compliance', 'civil_service_audit', 'equal_opportunity',
        'union_compliance', 'budget_variance', 'program_outcomes', 'retention_analysis'
    )),
    report_title TEXT NOT NULL,
    report_period TEXT NOT NULL,

    -- Timeline
    due_date DATE NOT NULL,
    submitted_date DATE,

    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'in_progress', 'pending_review', 'submitted', 'accepted', 'revision_requested'
    )),

    -- Linked Programs
    program_ids UUID[],

    -- Grant Info
    grant_number TEXT,
    grantor_agency TEXT,

    -- Attachments
    attachment_urls TEXT[],

    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_municipality_partners_state ON municipality_partners(state);
CREATE INDEX IF NOT EXISTS idx_municipality_partners_tier ON municipality_partners(tier);
CREATE INDEX IF NOT EXISTS idx_municipality_partners_size ON municipality_partners(municipality_size);
CREATE INDEX IF NOT EXISTS idx_municipality_partners_active ON municipality_partners(is_active);

CREATE INDEX IF NOT EXISTS idx_internship_programs_municipality ON municipality_internship_programs(municipality_id);
CREATE INDEX IF NOT EXISTS idx_internship_programs_status ON municipality_internship_programs(status);
CREATE INDEX IF NOT EXISTS idx_internship_programs_type ON municipality_internship_programs(program_type);

CREATE INDEX IF NOT EXISTS idx_apprenticeship_programs_municipality ON municipality_apprenticeship_programs(municipality_id);
CREATE INDEX IF NOT EXISTS idx_apprenticeship_programs_status ON municipality_apprenticeship_programs(status);
CREATE INDEX IF NOT EXISTS idx_apprenticeship_programs_type ON municipality_apprenticeship_programs(apprenticeship_type);

CREATE INDEX IF NOT EXISTS idx_municipality_participants_municipality ON municipality_participants(municipality_id);
CREATE INDEX IF NOT EXISTS idx_municipality_participants_program ON municipality_participants(program_id);
CREATE INDEX IF NOT EXISTS idx_municipality_participants_status ON municipality_participants(status);
CREATE INDEX IF NOT EXISTS idx_municipality_participants_department ON municipality_participants(department);

CREATE INDEX IF NOT EXISTS idx_department_needs_municipality ON municipality_department_needs(municipality_id);
CREATE INDEX IF NOT EXISTS idx_department_needs_fiscal_year ON municipality_department_needs(fiscal_year);

CREATE INDEX IF NOT EXISTS idx_civil_service_exams_municipality ON municipality_civil_service_exams(municipality_id);
CREATE INDEX IF NOT EXISTS idx_civil_service_exams_status ON municipality_civil_service_exams(status);

CREATE INDEX IF NOT EXISTS idx_union_partnerships_municipality ON municipality_union_partnerships(municipality_id);

CREATE INDEX IF NOT EXISTS idx_municipality_reports_municipality ON municipality_reports(municipality_id);
CREATE INDEX IF NOT EXISTS idx_municipality_reports_status ON municipality_reports(status);
CREATE INDEX IF NOT EXISTS idx_municipality_reports_due_date ON municipality_reports(due_date);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_municipality_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER municipality_partners_updated_at
    BEFORE UPDATE ON municipality_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_internship_programs_updated_at
    BEFORE UPDATE ON municipality_internship_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_apprenticeship_programs_updated_at
    BEFORE UPDATE ON municipality_apprenticeship_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_participants_updated_at
    BEFORE UPDATE ON municipality_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_civil_service_exams_updated_at
    BEFORE UPDATE ON municipality_civil_service_exams
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_union_partnerships_updated_at
    BEFORE UPDATE ON municipality_union_partnerships
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

CREATE TRIGGER municipality_reports_updated_at
    BEFORE UPDATE ON municipality_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_municipality_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE municipality_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_internship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_apprenticeship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_department_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_civil_service_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_union_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_reports ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY municipality_partners_admin ON municipality_partners
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_internship_programs_admin ON municipality_internship_programs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_apprenticeship_programs_admin ON municipality_apprenticeship_programs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_participants_admin ON municipality_participants
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_department_needs_admin ON municipality_department_needs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_civil_service_exams_admin ON municipality_civil_service_exams
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_union_partnerships_admin ON municipality_union_partnerships
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

CREATE POLICY municipality_reports_admin ON municipality_reports
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('super_admin', 'admin', 'platform_admin')
        )
    );

-- Partner access to own data
CREATE POLICY municipality_partners_own ON municipality_partners
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY municipality_internship_programs_partner ON municipality_internship_programs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_internship_programs.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_apprenticeship_programs_partner ON municipality_apprenticeship_programs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_apprenticeship_programs.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_participants_partner ON municipality_participants
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_participants.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_department_needs_partner ON municipality_department_needs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_department_needs.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_civil_service_exams_partner ON municipality_civil_service_exams
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_civil_service_exams.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_union_partnerships_partner ON municipality_union_partnerships
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_union_partnerships.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

CREATE POLICY municipality_reports_partner ON municipality_reports
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM municipality_partners
            WHERE municipality_partners.id = municipality_reports.municipality_id
            AND municipality_partners.user_id = auth.uid()
        )
    );

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT ALL ON municipality_partners TO authenticated;
GRANT ALL ON municipality_internship_programs TO authenticated;
GRANT ALL ON municipality_apprenticeship_programs TO authenticated;
GRANT ALL ON municipality_participants TO authenticated;
GRANT ALL ON municipality_department_needs TO authenticated;
GRANT ALL ON municipality_civil_service_exams TO authenticated;
GRANT ALL ON municipality_union_partnerships TO authenticated;
GRANT ALL ON municipality_reports TO authenticated;
