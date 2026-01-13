-- ===========================================
-- Student Platform Database Schema
-- Migration: 030_student_platform_schema.sql
-- Comprehensive backend for all student pages
-- ===========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- For efficient indexing

-- ===========================================
-- STUDENT PROFILES
-- ===========================================

CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic Info
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,

    -- Academic Info
    current_grade TEXT CHECK (current_grade IN ('9th', '10th', '11th', '12th', 'gap_year', 'transfer', 'graduate')),
    high_school_name TEXT,
    high_school_city TEXT,
    high_school_state TEXT,
    graduation_year INTEGER,
    gpa_unweighted DECIMAL(3,2),
    gpa_weighted DECIMAL(3,2),
    gpa_scale DECIMAL(3,1) DEFAULT 4.0,
    class_rank INTEGER,
    class_size INTEGER,

    -- Test Scores
    sat_total INTEGER CHECK (sat_total BETWEEN 400 AND 1600),
    sat_reading INTEGER CHECK (sat_reading BETWEEN 200 AND 800),
    sat_math INTEGER CHECK (sat_math BETWEEN 200 AND 800),
    act_composite INTEGER CHECK (act_composite BETWEEN 1 AND 36),
    act_english INTEGER CHECK (act_english BETWEEN 1 AND 36),
    act_math INTEGER CHECK (act_math BETWEEN 1 AND 36),
    act_reading INTEGER CHECK (act_reading BETWEEN 1 AND 36),
    act_science INTEGER CHECK (act_science BETWEEN 1 AND 36),
    ap_courses JSONB DEFAULT '[]', -- [{subject, score, year}]

    -- Background & Demographics
    citizenship TEXT DEFAULT 'us_citizen',
    ethnicity TEXT[],
    first_generation BOOLEAN DEFAULT FALSE,
    military_affiliation TEXT,
    disabilities TEXT[],
    languages TEXT[],

    -- Financial Info
    household_income_range TEXT,
    household_size INTEGER,
    students_in_college INTEGER DEFAULT 1,
    efc_estimate INTEGER, -- Expected Family Contribution
    pell_eligible BOOLEAN,
    state_of_residence TEXT,

    -- Interests & Goals
    intended_majors TEXT[],
    career_interests TEXT[],
    extracurriculars JSONB DEFAULT '[]', -- [{activity, role, years, hours_per_week, description}]
    awards_honors JSONB DEFAULT '[]', -- [{title, level, year, description}]
    work_experience JSONB DEFAULT '[]',
    research_experience JSONB DEFAULT '[]',

    -- Preferences
    preferred_regions TEXT[],
    preferred_school_sizes TEXT[], -- small, medium, large
    preferred_settings TEXT[], -- urban, suburban, rural
    preferred_school_types TEXT[], -- public, private, hbcu, women's, religious
    distance_from_home TEXT,

    -- Metadata
    profile_completeness INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)
);

-- ===========================================
-- COLLEGES/SCHOOLS DATABASE
-- ===========================================

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ipeds_id TEXT UNIQUE, -- Federal IPEDS ID
    ope_id TEXT, -- OPE ID for federal aid

    -- Basic Info
    name TEXT NOT NULL,
    alias TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    region TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    website TEXT,

    -- Classification
    school_type TEXT CHECK (school_type IN ('public', 'private_nonprofit', 'private_forprofit')),
    level TEXT CHECK (level IN ('4-year', '2-year', 'less-than-2-year')),
    carnegie_classification TEXT,
    religious_affiliation TEXT,
    hbcu BOOLEAN DEFAULT FALSE,
    tribal_college BOOLEAN DEFAULT FALSE,
    womens_college BOOLEAN DEFAULT FALSE,
    men_only BOOLEAN DEFAULT FALSE,

    -- Size & Setting
    enrollment_total INTEGER,
    enrollment_undergraduate INTEGER,
    enrollment_graduate INTEGER,
    setting TEXT CHECK (setting IN ('city_large', 'city_midsize', 'city_small', 'suburb_large', 'suburb_midsize', 'suburb_small', 'town_fringe', 'town_distant', 'town_remote', 'rural_fringe', 'rural_distant', 'rural_remote')),
    campus_size_acres INTEGER,

    -- Admissions
    acceptance_rate DECIMAL(5,2),
    sat_avg INTEGER,
    sat_25th INTEGER,
    sat_75th INTEGER,
    act_avg INTEGER,
    act_25th INTEGER,
    act_75th INTEGER,
    admission_yield DECIMAL(5,2),
    early_decision_available BOOLEAN DEFAULT FALSE,
    early_action_available BOOLEAN DEFAULT FALSE,
    test_optional BOOLEAN DEFAULT FALSE,
    application_fee INTEGER,

    -- Costs (Annual)
    tuition_in_state INTEGER,
    tuition_out_state INTEGER,
    tuition_private INTEGER,
    room_board INTEGER,
    books_supplies INTEGER,
    other_expenses INTEGER,
    total_cost_in_state INTEGER,
    total_cost_out_state INTEGER,

    -- Financial Aid
    avg_net_price INTEGER,
    net_price_0_30k INTEGER,
    net_price_30_48k INTEGER,
    net_price_48_75k INTEGER,
    net_price_75_110k INTEGER,
    net_price_110k_plus INTEGER,
    pct_receiving_aid DECIMAL(5,2),
    pct_receiving_pell DECIMAL(5,2),
    avg_grant_aid INTEGER,
    avg_federal_loan INTEGER,
    median_debt_at_graduation INTEGER,
    default_rate_3yr DECIMAL(5,2),

    -- Outcomes
    graduation_rate_4yr DECIMAL(5,2),
    graduation_rate_6yr DECIMAL(5,2),
    retention_rate DECIMAL(5,2),
    transfer_rate DECIMAL(5,2),
    median_earnings_10yr INTEGER,
    employment_rate_1yr DECIMAL(5,2),

    -- Academics
    student_faculty_ratio DECIMAL(4,1),
    pct_full_time_faculty DECIMAL(5,2),
    popular_majors TEXT[],
    stem_programs TEXT[],
    special_programs TEXT[], -- honors, co-op, study abroad, etc.
    accreditation TEXT[],

    -- Campus Life
    housing_available BOOLEAN DEFAULT TRUE,
    pct_living_on_campus DECIMAL(5,2),
    greek_life BOOLEAN DEFAULT FALSE,
    ncaa_division TEXT,
    sports_offered TEXT[],

    -- Rankings (optional, updated annually)
    us_news_national_rank INTEGER,
    us_news_liberal_arts_rank INTEGER,
    forbes_rank INTEGER,
    niche_grade TEXT,

    -- Metadata
    data_year INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON colleges USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(school_type);
CREATE INDEX IF NOT EXISTS idx_colleges_acceptance ON colleges(acceptance_rate);

-- ===========================================
-- SCHOLARSHIPS DATABASE
-- ===========================================

CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_type TEXT CHECK (provider_type IN ('federal', 'state', 'institutional', 'private', 'corporate', 'nonprofit', 'community')),
    description TEXT,
    website TEXT,

    -- Award Details
    amount_min INTEGER,
    amount_max INTEGER,
    amount_type TEXT CHECK (amount_type IN ('fixed', 'variable', 'full_tuition', 'full_ride', 'percentage')),
    renewable BOOLEAN DEFAULT FALSE,
    renewable_years INTEGER,
    renewable_conditions TEXT,

    -- Deadlines
    deadline_type TEXT CHECK (deadline_type IN ('fixed', 'rolling', 'varies', 'monthly')),
    deadline_date DATE,
    deadline_month INTEGER, -- For annual deadlines
    deadline_day INTEGER,
    early_deadline DATE,
    notification_date DATE,

    -- Eligibility Criteria
    min_gpa DECIMAL(3,2),
    min_sat INTEGER,
    min_act INTEGER,
    grade_levels TEXT[], -- ['12th', 'college_freshman', etc.]
    citizenship_requirements TEXT[],
    states TEXT[], -- Empty = all states

    -- Demographics
    ethnicity_requirements TEXT[],
    gender TEXT,
    first_generation_required BOOLEAN DEFAULT FALSE,
    military_affiliation TEXT[],
    disability_types TEXT[],

    -- Academic/Career
    majors TEXT[],
    career_fields TEXT[],
    school_types TEXT[], -- What type of school they must attend
    specific_schools UUID[], -- Specific colleges (references colleges.id)

    -- Financial
    income_cap INTEGER,
    need_based BOOLEAN DEFAULT FALSE,
    merit_based BOOLEAN DEFAULT TRUE,

    -- Other Requirements
    essay_required BOOLEAN DEFAULT FALSE,
    essay_topics TEXT[],
    letters_required INTEGER DEFAULT 0,
    interview_required BOOLEAN DEFAULT FALSE,
    community_service_hours INTEGER,
    other_requirements TEXT[],

    -- STEM Specific
    is_stem BOOLEAN DEFAULT FALSE,
    stem_fields TEXT[],
    chips_act_related BOOLEAN DEFAULT FALSE,
    federal_program TEXT, -- NSF, DOE, NASA, etc.

    -- Competition
    num_awards INTEGER,
    num_applicants_est INTEGER,
    competitiveness TEXT CHECK (competitiveness IN ('low', 'medium', 'high', 'very_high')),

    -- Metadata
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    data_source TEXT,
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for scholarship search
CREATE INDEX IF NOT EXISTS idx_scholarships_name_trgm ON scholarships USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline_date);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON scholarships(amount_max);
CREATE INDEX IF NOT EXISTS idx_scholarships_stem ON scholarships(is_stem) WHERE is_stem = TRUE;
CREATE INDEX IF NOT EXISTS idx_scholarships_states ON scholarships USING gin(states);
CREATE INDEX IF NOT EXISTS idx_scholarships_majors ON scholarships USING gin(majors);

-- ===========================================
-- STEM FUNDING PROGRAMS (CHIPS Act, Federal)
-- ===========================================

CREATE TABLE IF NOT EXISTS stem_funding_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    name TEXT NOT NULL,
    agency TEXT NOT NULL, -- DOE, NSF, NASA, DOD, Commerce, etc.
    program_type TEXT CHECK (program_type IN ('scholarship', 'fellowship', 'grant', 'internship', 'workforce', 'research')),
    description TEXT,
    website TEXT,

    -- Funding
    amount_description TEXT,
    amount_min INTEGER,
    amount_max INTEGER,
    includes_tuition BOOLEAN DEFAULT FALSE,
    includes_stipend BOOLEAN DEFAULT FALSE,
    includes_housing BOOLEAN DEFAULT FALSE,
    includes_travel BOOLEAN DEFAULT FALSE,

    -- Eligibility
    education_level TEXT[], -- undergraduate, graduate, postdoc
    citizenship_required TEXT[],
    security_clearance_required BOOLEAN DEFAULT FALSE,
    service_commitment_years INTEGER,

    -- STEM Fields
    stem_fields TEXT[],
    chips_act_funded BOOLEAN DEFAULT FALSE,
    semiconductor_focus BOOLEAN DEFAULT FALSE,

    -- Application
    deadline_type TEXT,
    deadline_date DATE,
    application_url TEXT,

    -- Competition
    num_awards_annual INTEGER,
    competitiveness TEXT,

    -- Metadata
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CAREER PATHS & SALARY DATA
-- ===========================================

CREATE TABLE IF NOT EXISTS career_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    field TEXT NOT NULL,
    description TEXT,
    icon TEXT,

    -- Salary Data (BLS)
    bls_code TEXT, -- Bureau of Labor Statistics SOC code
    salary_entry INTEGER,
    salary_median INTEGER,
    salary_senior INTEGER,
    salary_75th INTEGER,
    salary_90th INTEGER,
    annual_growth_rate DECIMAL(4,2),

    -- Job Market
    total_employment INTEGER,
    job_growth_10yr DECIMAL(5,2),
    job_openings_annual INTEGER,
    demand_level TEXT CHECK (demand_level IN ('very_high', 'high', 'moderate', 'stable', 'declining')),

    -- Requirements
    typical_education TEXT,
    typical_experience TEXT,
    certifications TEXT[],
    skills TEXT[],
    time_to_senior INTEGER, -- years

    -- Related
    related_majors TEXT[],
    top_employers TEXT[],
    top_locations TEXT[],
    remote_friendly BOOLEAN DEFAULT FALSE,

    -- CHIPS Act Relevance
    chips_act_relevant BOOLEAN DEFAULT FALSE,
    semiconductor_industry BOOLEAN DEFAULT FALSE,

    -- Metadata
    data_year INTEGER,
    data_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- USER SAVED ITEMS & APPLICATIONS
-- ===========================================

-- Saved Scholarships
CREATE TABLE IF NOT EXISTS saved_scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'in_progress', 'submitted', 'awarded', 'rejected', 'declined')),
    notes TEXT,
    application_date DATE,
    award_amount INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- Saved Colleges
CREATE TABLE IF NOT EXISTS saved_colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    list_type TEXT DEFAULT 'considering' CHECK (list_type IN ('reach', 'match', 'safety', 'considering', 'applied', 'accepted', 'rejected', 'waitlisted', 'enrolled')),
    notes TEXT,
    application_deadline DATE,
    decision_date DATE,
    financial_aid_received INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, college_id)
);

-- Award Letters (User-entered)
CREATE TABLE IF NOT EXISTS award_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id),
    school_name TEXT, -- In case college not in DB
    academic_year TEXT,

    -- Cost of Attendance
    coa_tuition INTEGER,
    coa_room_board INTEGER,
    coa_fees INTEGER,
    coa_books INTEGER,
    coa_personal INTEGER,
    coa_transportation INTEGER,
    coa_total INTEGER,

    -- Aid Package (JSONB for flexibility)
    aid_items JSONB DEFAULT '[]', -- [{name, amount, type, renewable, conditions}]

    -- Calculated Fields
    total_grants INTEGER,
    total_scholarships INTEGER,
    total_loans INTEGER,
    total_work_study INTEGER,
    net_cost INTEGER,

    -- Deadlines
    acceptance_deadline DATE,

    -- Analysis
    affordability_grade TEXT,
    warnings TEXT[],
    recommendations TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan Records
CREATE TABLE IF NOT EXISTS student_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Loan Details
    loan_name TEXT NOT NULL,
    loan_type TEXT CHECK (loan_type IN ('subsidized', 'unsubsidized', 'plus', 'private', 'perkins', 'other')),
    servicer TEXT,

    -- Amounts
    principal_original INTEGER NOT NULL,
    principal_current INTEGER,
    interest_rate DECIMAL(5,3),

    -- Terms
    disbursement_date DATE,
    repayment_start_date DATE,
    term_months INTEGER,

    -- Status
    status TEXT DEFAULT 'in_school' CHECK (status IN ('in_school', 'grace', 'repayment', 'deferment', 'forbearance', 'default', 'paid_off')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application Tracker
CREATE TABLE IF NOT EXISTS college_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id),

    -- Application Info
    application_type TEXT CHECK (application_type IN ('regular', 'early_decision', 'early_action', 'early_decision_2', 'rolling')),
    application_portal TEXT,
    portal_username TEXT,

    -- Status Tracking
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'complete', 'under_review', 'accepted', 'rejected', 'waitlisted', 'deferred', 'withdrawn')),

    -- Dates
    deadline DATE,
    submitted_date DATE,
    decision_date DATE,
    deposit_deadline DATE,

    -- Components (JSONB for flexibility)
    components JSONB DEFAULT '{}', -- {common_app: true, essays: [{prompt, status}], lors: [{recommender, status}], etc.}

    -- Financials
    application_fee_paid BOOLEAN DEFAULT FALSE,
    application_fee_waived BOOLEAN DEFAULT FALSE,
    financial_aid_submitted BOOLEAN DEFAULT FALSE,
    award_letter_id UUID REFERENCES award_letters(id),

    -- Notes
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, college_id, application_type)
);

-- ===========================================
-- SCHOLARSHIP MATCH SCORES (Cached)
-- ===========================================

CREATE TABLE IF NOT EXISTS scholarship_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
    eligibility_status TEXT CHECK (eligibility_status IN ('eligible', 'likely', 'possible', 'ineligible')),
    match_factors JSONB, -- {gpa: true, location: true, major: false, etc.}
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_matches ENABLE ROW LEVEL SECURITY;

-- Public read access for reference tables
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE stem_funding_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;

-- Student Profiles: Users can only access their own
CREATE POLICY "Users can view own profile" ON student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON student_profiles FOR DELETE USING (auth.uid() = user_id);

-- Saved Scholarships: Users can only access their own
CREATE POLICY "Users can view own saved scholarships" ON saved_scholarships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved scholarships" ON saved_scholarships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved scholarships" ON saved_scholarships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved scholarships" ON saved_scholarships FOR DELETE USING (auth.uid() = user_id);

-- Saved Colleges: Users can only access their own
CREATE POLICY "Users can view own saved colleges" ON saved_colleges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved colleges" ON saved_colleges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved colleges" ON saved_colleges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved colleges" ON saved_colleges FOR DELETE USING (auth.uid() = user_id);

-- Award Letters: Users can only access their own
CREATE POLICY "Users can view own award letters" ON award_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own award letters" ON award_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own award letters" ON award_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own award letters" ON award_letters FOR DELETE USING (auth.uid() = user_id);

-- Student Loans: Users can only access their own
CREATE POLICY "Users can view own loans" ON student_loans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own loans" ON student_loans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own loans" ON student_loans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own loans" ON student_loans FOR DELETE USING (auth.uid() = user_id);

-- College Applications: Users can only access their own
CREATE POLICY "Users can view own applications" ON college_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON college_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON college_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON college_applications FOR DELETE USING (auth.uid() = user_id);

-- Scholarship Matches: Users can only access their own
CREATE POLICY "Users can view own matches" ON scholarship_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own matches" ON scholarship_matches FOR ALL USING (auth.uid() = user_id);

-- Public reference tables: Anyone can read
CREATE POLICY "Anyone can view colleges" ON colleges FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Anyone can view scholarships" ON scholarships FOR SELECT TO authenticated, anon USING (active = true);
CREATE POLICY "Anyone can view stem programs" ON stem_funding_programs FOR SELECT TO authenticated, anon USING (active = true);
CREATE POLICY "Anyone can view career paths" ON career_paths FOR SELECT TO authenticated, anon USING (true);

-- Admin policies for reference tables
CREATE POLICY "Admins can manage colleges" ON colleges FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);
CREATE POLICY "Admins can manage scholarships" ON scholarships FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);
CREATE POLICY "Admins can manage stem programs" ON stem_funding_programs FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);
CREATE POLICY "Admins can manage career paths" ON career_paths FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'SUPER_ADMIN'))
);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completeness INTEGER := 0;
    profile RECORD;
BEGIN
    SELECT * INTO profile FROM student_profiles WHERE id = profile_id;

    IF profile IS NULL THEN RETURN 0; END IF;

    -- Basic info (20%)
    IF profile.first_name IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile.last_name IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile.email IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile.date_of_birth IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Academic (25%)
    IF profile.gpa_unweighted IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF profile.sat_total IS NOT NULL OR profile.act_composite IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF profile.graduation_year IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Background (15%)
    IF profile.ethnicity IS NOT NULL AND array_length(profile.ethnicity, 1) > 0 THEN completeness := completeness + 5; END IF;
    IF profile.first_generation IS NOT NULL THEN completeness := completeness + 5; END IF;
    IF profile.citizenship IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Financial (15%)
    IF profile.household_income_range IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF profile.state_of_residence IS NOT NULL THEN completeness := completeness + 5; END IF;

    -- Interests (15%)
    IF profile.intended_majors IS NOT NULL AND array_length(profile.intended_majors, 1) > 0 THEN completeness := completeness + 10; END IF;
    IF profile.career_interests IS NOT NULL AND array_length(profile.career_interests, 1) > 0 THEN completeness := completeness + 5; END IF;

    -- Activities (10%)
    IF profile.extracurriculars IS NOT NULL AND jsonb_array_length(profile.extracurriculars) > 0 THEN completeness := completeness + 10; END IF;

    RETURN LEAST(completeness, 100);
END;
$$ LANGUAGE plpgsql;

-- Update profile completeness trigger
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_completeness := calculate_profile_completeness(NEW.id);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completeness
    BEFORE INSERT OR UPDATE ON student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_completeness();

-- Calculate net cost for award letters
CREATE OR REPLACE FUNCTION calculate_award_letter_totals()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
BEGIN
    -- Calculate COA total
    NEW.coa_total := COALESCE(NEW.coa_tuition, 0) + COALESCE(NEW.coa_room_board, 0) +
                     COALESCE(NEW.coa_fees, 0) + COALESCE(NEW.coa_books, 0) +
                     COALESCE(NEW.coa_personal, 0) + COALESCE(NEW.coa_transportation, 0);

    -- Calculate aid totals from JSONB
    NEW.total_grants := 0;
    NEW.total_scholarships := 0;
    NEW.total_loans := 0;
    NEW.total_work_study := 0;

    FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(NEW.aid_items, '[]'::JSONB))
    LOOP
        CASE item->>'type'
            WHEN 'grant' THEN NEW.total_grants := NEW.total_grants + (item->>'amount')::INTEGER;
            WHEN 'scholarship' THEN NEW.total_scholarships := NEW.total_scholarships + (item->>'amount')::INTEGER;
            WHEN 'loan' THEN NEW.total_loans := NEW.total_loans + (item->>'amount')::INTEGER;
            WHEN 'work-study' THEN NEW.total_work_study := NEW.total_work_study + (item->>'amount')::INTEGER;
        END CASE;
    END LOOP;

    -- Calculate net cost
    NEW.net_cost := NEW.coa_total - NEW.total_grants - NEW.total_scholarships - NEW.total_loans - NEW.total_work_study;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_award_totals
    BEFORE INSERT OR UPDATE ON award_letters
    FOR EACH ROW
    EXECUTE FUNCTION calculate_award_letter_totals();

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_colleges_user ON saved_colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_award_letters_user ON award_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_student_loans_user ON student_loans(user_id);
CREATE INDEX IF NOT EXISTS idx_college_applications_user ON college_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_matches_user ON scholarship_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_matches_score ON scholarship_matches(match_score DESC);
