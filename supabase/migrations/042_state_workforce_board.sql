-- ===========================================
-- State Workforce Board Dashboard Migration
-- ===========================================
-- Complete database schema for WIOA program management,
-- participant tracking, AJC operations, and workforce development
-- ===========================================

-- ===========================================
-- LOCAL WORKFORCE DEVELOPMENT BOARDS
-- ===========================================
CREATE TABLE IF NOT EXISTS local_workforce_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lwdb_number TEXT UNIQUE,

  -- Geographic
  counties_served TEXT[] DEFAULT '{}',
  region_name TEXT,

  -- Contact
  address_street TEXT,
  address_city TEXT,
  address_state TEXT DEFAULT 'IL',
  address_zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Leadership
  director_name TEXT,
  director_email TEXT,
  board_chair_name TEXT,

  -- Budget
  current_fiscal_year_budget DECIMAL(12,2),

  -- Performance
  meeting_performance_goals BOOLEAN DEFAULT false,

  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AMERICAN JOB CENTERS
-- ===========================================
CREATE TABLE IF NOT EXISTS american_job_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  center_type TEXT DEFAULT 'COMPREHENSIVE' CHECK (center_type IN ('COMPREHENSIVE', 'AFFILIATE', 'SPECIALIZED')),
  lwdb_id UUID REFERENCES local_workforce_boards(id),

  -- Location
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT DEFAULT 'IL',
  address_zip TEXT NOT NULL,
  county TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),

  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Hours (JSON for flexibility)
  hours JSONB DEFAULT '{}',

  -- Services & Programs (stored as arrays)
  services_offered TEXT[] DEFAULT '{}',
  programs_offered TEXT[] DEFAULT '{}',
  partner_agencies TEXT[] DEFAULT '{}',

  -- Accessibility
  wheelchair_accessible BOOLEAN DEFAULT true,
  hearing_assistance BOOLEAN DEFAULT false,
  vision_assistance BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT '{"English"}',

  -- Staff
  director_name TEXT,
  director_email TEXT,
  total_staff INTEGER DEFAULT 0,

  -- Capacity
  resource_room_computers INTEGER DEFAULT 0,
  workshop_room_capacity INTEGER DEFAULT 0,

  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TEMPORARILY_CLOSED')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PARTICIPANTS
-- ===========================================
CREATE TABLE IF NOT EXISTS workforce_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (SSN stored encrypted, only last 4 shown)
  ssn_encrypted TEXT,
  ssn_last_four TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  date_of_birth DATE NOT NULL,

  -- Contact
  email TEXT,
  phone TEXT,

  -- Address
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  county TEXT,

  -- Demographics
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY')),
  race TEXT[] DEFAULT '{}',
  ethnicity TEXT CHECK (ethnicity IN ('HISPANIC_LATINO', 'NOT_HISPANIC_LATINO')),
  veteran_status BOOLEAN DEFAULT false,
  disability_status BOOLEAN DEFAULT false,
  highest_education TEXT,

  -- Employment status
  employment_status TEXT DEFAULT 'UNEMPLOYED' CHECK (employment_status IN ('EMPLOYED', 'UNEMPLOYED', 'UNDEREMPLOYED', 'NOT_IN_LABOR_FORCE')),
  ui_claimant BOOLEAN DEFAULT false,
  tanf_recipient BOOLEAN DEFAULT false,
  snap_recipient BOOLEAN DEFAULT false,
  low_income BOOLEAN DEFAULT false,

  -- Barriers to employment
  barriers TEXT[] DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'REGISTERED' CHECK (status IN (
    'REGISTERED', 'PENDING_ELIGIBILITY', 'ELIGIBLE', 'ENROLLED',
    'ACTIVE', 'TRAINING', 'EMPLOYED', 'EXITED',
    'FOLLOW_UP_Q1', 'FOLLOW_UP_Q2', 'FOLLOW_UP_Q3', 'FOLLOW_UP_Q4', 'CLOSED'
  )),

  -- Assignments
  assigned_case_manager_id UUID REFERENCES users(id),
  assigned_ajc_id UUID REFERENCES american_job_centers(id),
  lwdb_id UUID REFERENCES local_workforce_boards(id),

  -- Key dates
  registration_date DATE DEFAULT CURRENT_DATE,
  enrollment_date DATE,
  exit_date DATE,
  exit_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROGRAM ENROLLMENTS
-- ===========================================
CREATE TABLE IF NOT EXISTS program_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,

  program TEXT NOT NULL CHECK (program IN (
    'TITLE_I_ADULT', 'TITLE_I_DISLOCATED_WORKER', 'TITLE_I_YOUTH',
    'TITLE_II_ADULT_EDUCATION', 'TITLE_III_WAGNER_PEYSER', 'TITLE_IV_VOCATIONAL_REHAB',
    'TAA', 'RESEA', 'SNAP_ET', 'TANF', 'VETERAN_SERVICES'
  )),

  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  exit_date DATE,
  status TEXT DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'ACTIVE', 'EXITED', 'CLOSED')),

  funding_stream TEXT,
  co_enrolled_programs TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(participant_id, program)
);

-- ===========================================
-- INDIVIDUAL EMPLOYMENT PLANS
-- ===========================================
CREATE TABLE IF NOT EXISTS individual_employment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),

  -- Goals
  short_term_goal TEXT,
  long_term_goal TEXT,
  target_occupation TEXT,
  target_soc_code TEXT,
  target_wage DECIMAL(10,2),

  -- Assessments
  skills_assessment TEXT,
  interests_assessment TEXT,
  aptitude_assessment TEXT,
  barriers_identified TEXT[] DEFAULT '{}',

  -- Action steps and services (JSON for flexibility)
  action_steps JSONB DEFAULT '[]',
  services_planned JSONB DEFAULT '[]',

  -- Signatures
  participant_signature_date DATE,
  counselor_signature_date DATE,

  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'REVISED')),
  review_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SERVICE TRANSACTIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS service_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,

  service_type TEXT NOT NULL,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,

  provider_id UUID,
  provider_name TEXT,
  staff_id UUID REFERENCES users(id),
  ajc_id UUID REFERENCES american_job_centers(id),

  duration_minutes INTEGER,
  cost DECIMAL(10,2),
  funding_source TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_service_transactions_participant ON service_transactions(participant_id);
CREATE INDEX IF NOT EXISTS idx_service_transactions_date ON service_transactions(service_date);
CREATE INDEX IF NOT EXISTS idx_service_transactions_type ON service_transactions(service_type);

-- ===========================================
-- CASE NOTES
-- ===========================================
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id),
  staff_name TEXT,

  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note_type TEXT DEFAULT 'GENERAL' CHECK (note_type IN (
    'GENERAL', 'ASSESSMENT', 'SERVICE', 'REFERRAL', 'FOLLOW_UP', 'OUTCOME', 'BARRIER', 'GOAL_PROGRESS'
  )),

  content TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  attachments TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_notes_participant ON case_notes(participant_id);

-- ===========================================
-- TRAINING PROVIDERS (ETPL)
-- ===========================================
CREATE TABLE IF NOT EXISTS etpl_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dba_name TEXT,
  provider_type TEXT CHECK (provider_type IN (
    'COMMUNITY_COLLEGE', 'UNIVERSITY', 'TECHNICAL_SCHOOL',
    'APPRENTICESHIP_SPONSOR', 'ONLINE', 'EMPLOYER', 'NONPROFIT'
  )),

  -- Contact
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Status
  etpl_status TEXT DEFAULT 'PENDING' CHECK (etpl_status IN ('APPROVED', 'PENDING', 'PROBATION', 'REMOVED')),
  approval_date DATE,
  renewal_date DATE,

  -- Performance
  total_enrollments INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  employment_rate DECIMAL(5,2),
  median_wage DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TRAINING PROGRAMS
-- ===========================================
CREATE TABLE IF NOT EXISTS training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES etpl_providers(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,

  cip_code TEXT,
  soc_code TEXT,

  credential_type TEXT,
  duration_hours INTEGER,
  duration_weeks INTEGER,
  delivery_method TEXT CHECK (delivery_method IN ('IN_PERSON', 'ONLINE', 'HYBRID')),
  cost DECIMAL(10,2),
  ita_eligible BOOLEAN DEFAULT true,

  etpl_status TEXT DEFAULT 'PENDING' CHECK (etpl_status IN ('APPROVED', 'PENDING', 'REMOVED')),
  in_demand_occupation BOOLEAN DEFAULT false,

  completion_rate DECIMAL(5,2),
  employment_rate DECIMAL(5,2),
  median_wage DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDIVIDUAL TRAINING ACCOUNTS
-- ===========================================
CREATE TABLE IF NOT EXISTS individual_training_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,
  program_id UUID REFERENCES training_programs(id),
  provider_id UUID REFERENCES etpl_providers(id),
  provider_name TEXT,
  program_name TEXT,
  credential_type TEXT,

  -- Funding
  approved_amount DECIMAL(10,2) NOT NULL,
  obligated_amount DECIMAL(10,2) DEFAULT 0,
  expended_amount DECIMAL(10,2) DEFAULT 0,
  funding_source TEXT,

  -- Dates
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,

  -- Status
  status TEXT DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'ACTIVE', 'COMPLETED', 'WITHDRAWN', 'CANCELLED')),
  completion_status TEXT CHECK (completion_status IN ('COMPLETED', 'DID_NOT_COMPLETE')),

  -- Outcomes
  credential_earned BOOLEAN,
  credential_date DATE,
  employed_after_training BOOLEAN,
  wage_at_placement DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- EMPLOYERS
-- ===========================================
CREATE TABLE IF NOT EXISTS workforce_employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  dba_name TEXT,
  fein TEXT,

  -- Industry
  naics_code TEXT,
  industry_description TEXT,
  company_size TEXT CHECK (company_size IN ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')),
  employee_count INTEGER,

  -- Location
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,

  -- Primary contact
  primary_contact_name TEXT,
  primary_contact_title TEXT,
  primary_contact_phone TEXT,
  primary_contact_email TEXT,

  -- Services
  registered_apprenticeship_sponsor BOOLEAN DEFAULT false,
  ojt_partner BOOLEAN DEFAULT false,
  wotc_registered BOOLEAN DEFAULT false,

  -- Assigned staff
  assigned_bsr_id UUID REFERENCES users(id),

  -- Status
  status TEXT DEFAULT 'PROSPECT' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PROSPECT')),
  engagement_level TEXT DEFAULT 'NEW' CHECK (engagement_level IN ('HIGH', 'MEDIUM', 'LOW', 'NEW')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- JOB ORDERS
-- ===========================================
CREATE TABLE IF NOT EXISTS job_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES workforce_employers(id),
  employer_name TEXT,

  -- Job details
  job_title TEXT NOT NULL,
  soc_code TEXT,
  job_description TEXT,
  requirements TEXT,
  wage_min DECIMAL(10,2),
  wage_max DECIMAL(10,2),
  wage_type TEXT CHECK (wage_type IN ('HOURLY', 'SALARY', 'COMMISSION')),

  -- Position
  openings INTEGER DEFAULT 1,
  openings_filled INTEGER DEFAULT 0,
  employment_type TEXT CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'TEMPORARY', 'SEASONAL', 'INTERNSHIP')),

  -- Location
  work_location_city TEXT,
  work_location_state TEXT,
  remote_eligible BOOLEAN DEFAULT false,

  -- Dates
  date_posted DATE DEFAULT CURRENT_DATE,
  date_needed DATE,
  expiration_date DATE,

  -- Status
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FILLED', 'CANCELLED', 'ON_HOLD', 'EXPIRED')),

  -- Staff
  posted_by_staff_id UUID REFERENCES users(id),
  ajc_id UUID REFERENCES american_job_centers(id),

  -- Metrics
  referrals_count INTEGER DEFAULT 0,
  interviews_count INTEGER DEFAULT 0,
  placements_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- OJT AGREEMENTS
-- ===========================================
CREATE TABLE IF NOT EXISTS ojt_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES workforce_employers(id),
  employer_name TEXT,
  participant_id UUID REFERENCES workforce_participants(id),
  participant_name TEXT,

  -- Job details
  job_title TEXT NOT NULL,
  soc_code TEXT,
  starting_wage DECIMAL(10,2),
  target_wage DECIMAL(10,2),

  -- Training
  training_hours INTEGER,
  training_weeks INTEGER,
  skills_to_learn TEXT[] DEFAULT '{}',

  -- Reimbursement
  reimbursement_rate DECIMAL(5,2),
  estimated_reimbursement DECIMAL(10,2),
  actual_reimbursement DECIMAL(10,2),

  -- Dates
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,

  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'TERMINATED')),
  completion_status TEXT CHECK (completion_status IN ('SUCCESSFUL', 'UNSUCCESSFUL')),
  retained_after_training BOOLEAN,

  -- Staff
  case_manager_id UUID REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- WARN NOTICES (LAYOFF NOTIFICATIONS)
-- ===========================================
CREATE TABLE IF NOT EXISTS warn_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES workforce_employers(id),
  company_name TEXT NOT NULL,

  -- Event details
  event_type TEXT CHECK (event_type IN ('LAYOFF', 'PLANT_CLOSURE', 'RELOCATION')),
  affected_workers INTEGER NOT NULL,

  -- Location
  facility_address TEXT,
  facility_city TEXT,
  facility_state TEXT,
  facility_zip TEXT,

  -- Dates
  notice_date DATE NOT NULL,
  effective_date DATE NOT NULL,

  -- Status
  status TEXT DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'ASSIGNED', 'RESPONSE_SCHEDULED', 'RESPONSE_COMPLETED', 'CLOSED')),

  -- Response
  assigned_coordinator_id UUID REFERENCES users(id),
  response_date DATE,
  workers_served INTEGER,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- RAPID RESPONSE EVENTS
-- ===========================================
CREATE TABLE IF NOT EXISTS rapid_response_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warn_notice_id UUID REFERENCES warn_notices(id),
  employer_id UUID REFERENCES workforce_employers(id),
  company_name TEXT,

  -- Event details
  event_type TEXT CHECK (event_type IN ('INFO_SESSION', 'ENROLLMENT_EVENT', 'JOB_FAIR', 'WORKSHOP')),
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,

  -- Attendance
  expected_attendees INTEGER,
  actual_attendees INTEGER,

  -- Services
  services_provided TEXT[] DEFAULT '{}',
  registrations INTEGER DEFAULT 0,
  referrals INTEGER DEFAULT 0,

  -- Staff
  coordinator_id UUID REFERENCES users(id),
  staff_attending TEXT[] DEFAULT '{}',

  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- GRANT ALLOCATIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS grant_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year TEXT NOT NULL,
  program TEXT NOT NULL,

  lwdb_id UUID REFERENCES local_workforce_boards(id),
  lwdb_name TEXT,
  statewide BOOLEAN DEFAULT false,

  -- Funding
  allocation_amount DECIMAL(12,2) NOT NULL,
  carryover_amount DECIMAL(12,2) DEFAULT 0,
  total_available DECIMAL(12,2) GENERATED ALWAYS AS (allocation_amount + COALESCE(carryover_amount, 0)) STORED,

  -- Spending
  obligated_amount DECIMAL(12,2) DEFAULT 0,
  expended_amount DECIMAL(12,2) DEFAULT 0,
  remaining_amount DECIMAL(12,2) GENERATED ALWAYS AS (allocation_amount + COALESCE(carryover_amount, 0) - COALESCE(obligated_amount, 0)) STORED,

  -- Dates
  period_start DATE,
  period_end DATE,

  -- Match
  match_required DECIMAL(12,2),
  match_provided DECIMAL(12,2),

  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'PENDING')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- EXPENDITURES
-- ===========================================
CREATE TABLE IF NOT EXISTS expenditures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_allocation_id UUID REFERENCES grant_allocations(id),

  cost_category TEXT CHECK (cost_category IN (
    'STAFF_SALARIES', 'STAFF_BENEFITS', 'STAFF_TRAINING',
    'PARTICIPANT_TRAINING', 'PARTICIPANT_SUPPORTIVE', 'PARTICIPANT_ITA',
    'OPERATIONS', 'EQUIPMENT', 'INDIRECT', 'OTHER'
  )),
  description TEXT,

  amount DECIMAL(10,2) NOT NULL,

  vendor_name TEXT,
  invoice_number TEXT,

  expenditure_date DATE NOT NULL,
  period_start DATE,
  period_end DATE,

  participant_id UUID REFERENCES workforce_participants(id),
  ajc_id UUID REFERENCES american_job_centers(id),

  approved_by UUID REFERENCES users(id),
  approval_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenditures_grant ON expenditures(grant_allocation_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_date ON expenditures(expenditure_date);

-- ===========================================
-- WIOA PERFORMANCE GOALS
-- ===========================================
CREATE TABLE IF NOT EXISTS wioa_performance_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year TEXT NOT NULL,
  program TEXT NOT NULL,
  lwdb_id UUID REFERENCES local_workforce_boards(id),

  -- Six Primary Indicators - Goals
  employment_rate_q2_goal DECIMAL(5,2),
  employment_rate_q4_goal DECIMAL(5,2),
  median_earnings_goal DECIMAL(10,2),
  credential_attainment_goal DECIMAL(5,2),
  measurable_skill_gains_goal DECIMAL(5,2),
  effectiveness_retention_goal DECIMAL(5,2),

  -- Actual performance
  employment_rate_q2_actual DECIMAL(5,2),
  employment_rate_q4_actual DECIMAL(5,2),
  median_earnings_actual DECIMAL(10,2),
  credential_attainment_actual DECIMAL(5,2),
  measurable_skill_gains_actual DECIMAL(5,2),
  effectiveness_retention_actual DECIMAL(5,2),

  status TEXT DEFAULT 'NEGOTIATING' CHECK (status IN ('NEGOTIATING', 'APPROVED', 'FINAL')),
  negotiation_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(fiscal_year, program, lwdb_id)
);

-- ===========================================
-- PARTICIPANT OUTCOMES (FOLLOW-UP)
-- ===========================================
CREATE TABLE IF NOT EXISTS participant_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES workforce_participants(id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  exit_date DATE NOT NULL,

  -- Quarter 2 outcomes
  employed_q2 BOOLEAN,
  q2_employer_name TEXT,
  q2_wage DECIMAL(10,2),
  q2_data_source TEXT CHECK (q2_data_source IN ('WAGE_RECORD', 'SUPPLEMENTAL', 'CASE_MANAGEMENT')),

  -- Quarter 4 outcomes
  employed_q4 BOOLEAN,
  q4_employer_name TEXT,
  q4_wage DECIMAL(10,2),
  q4_data_source TEXT CHECK (q4_data_source IN ('WAGE_RECORD', 'SUPPLEMENTAL', 'CASE_MANAGEMENT')),

  -- Credentials
  credential_earned BOOLEAN,
  credential_type TEXT,
  credential_date DATE,

  -- Skills
  measurable_skill_gain BOOLEAN,
  msg_type TEXT CHECK (msg_type IN ('EDUCATIONAL_GAIN', 'CREDENTIAL', 'PROGRESS_REPORT', 'SKILLS_PROGRESSION')),

  -- Retention
  same_employer_q2_to_q4 BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AJC DAILY TRAFFIC
-- ===========================================
CREATE TABLE IF NOT EXISTS ajc_daily_traffic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ajc_id UUID NOT NULL REFERENCES american_job_centers(id),
  date DATE NOT NULL,

  -- Traffic
  walk_ins INTEGER DEFAULT 0,
  appointments INTEGER DEFAULT 0,
  virtual_visits INTEGER DEFAULT 0,
  phone_calls INTEGER DEFAULT 0,

  -- Services
  registrations INTEGER DEFAULT 0,
  assessments INTEGER DEFAULT 0,
  job_referrals INTEGER DEFAULT 0,
  workshop_attendees INTEGER DEFAULT 0,
  resource_room_users INTEGER DEFAULT 0,

  staff_on_duty INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(ajc_id, date)
);

-- ===========================================
-- REPORT REQUESTS
-- ===========================================
CREATE TABLE IF NOT EXISTS report_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('ETA_9169', 'PIRL', 'QUARTERLY_NARRATIVE', 'ANNUAL_REPORT', 'CUSTOM')),
  fiscal_year TEXT,
  quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)),

  -- Filters
  programs TEXT[] DEFAULT '{}',
  lwdb_ids UUID[] DEFAULT '{}',
  ajc_ids UUID[] DEFAULT '{}',
  date_range_start DATE,
  date_range_end DATE,

  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'ERROR')),
  requested_by UUID REFERENCES users(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Output
  file_url TEXT,
  file_format TEXT CHECK (file_format IN ('CSV', 'XLSX', 'PDF', 'JSON')),
  record_count INTEGER,

  error_message TEXT
);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE local_workforce_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE american_job_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_employment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE etpl_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_training_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ojt_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE warn_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapid_response_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenditures ENABLE ROW LEVEL SECURITY;
ALTER TABLE wioa_performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ajc_daily_traffic ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_requests ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access for state admins)
CREATE POLICY "State admins have full access to workforce boards" ON local_workforce_boards
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'SUPER_ADMIN', 'STATE_WORKFORCE_DIRECTOR')
  );

CREATE POLICY "State admins have full access to AJCs" ON american_job_centers
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'SUPER_ADMIN', 'STATE_WORKFORCE_DIRECTOR', 'LWDB_DIRECTOR', 'AJC_DIRECTOR')
  );

CREATE POLICY "Case managers can view assigned participants" ON workforce_participants
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'SUPER_ADMIN', 'STATE_WORKFORCE_DIRECTOR', 'LWDB_DIRECTOR', 'AJC_DIRECTOR', 'CASE_MANAGER', 'CAREER_COUNSELOR')
    OR assigned_case_manager_id = auth.uid()
  );

-- Public read for ETPL providers
CREATE POLICY "Anyone can view approved training providers" ON etpl_providers
  FOR SELECT USING (etpl_status = 'APPROVED');

CREATE POLICY "Anyone can view approved training programs" ON training_programs
  FOR SELECT USING (etpl_status = 'APPROVED');

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_participants_status ON workforce_participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_lwdb ON workforce_participants(lwdb_id);
CREATE INDEX IF NOT EXISTS idx_participants_ajc ON workforce_participants(assigned_ajc_id);
CREATE INDEX IF NOT EXISTS idx_participants_case_manager ON workforce_participants(assigned_case_manager_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_participant ON program_enrollments(participant_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON program_enrollments(program);

CREATE INDEX IF NOT EXISTS idx_job_orders_employer ON job_orders(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_status ON job_orders(status);

CREATE INDEX IF NOT EXISTS idx_ajc_lwdb ON american_job_centers(lwdb_id);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_workforce_participants_updated_at
  BEFORE UPDATE ON workforce_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_individual_employment_plans_updated_at
  BEFORE UPDATE ON individual_employment_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_notes_updated_at
  BEFORE UPDATE ON case_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ===========================================

-- Insert sample LWDB
INSERT INTO local_workforce_boards (name, lwdb_number, counties_served, region_name, address_city, address_state, status)
VALUES
  ('Central Illinois Workforce Board', 'LWDB-01', ARRAY['Sangamon', 'Menard', 'Logan', 'Christian'], 'Central', 'Springfield', 'IL', 'ACTIVE'),
  ('Northern Illinois Workforce Board', 'LWDB-02', ARRAY['Cook', 'DuPage', 'Lake', 'Kane'], 'Chicagoland', 'Chicago', 'IL', 'ACTIVE'),
  ('Southern Illinois Workforce Board', 'LWDB-03', ARRAY['Jackson', 'Williamson', 'Union', 'Johnson'], 'Southern', 'Carbondale', 'IL', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Insert sample AJCs (linked to LWDBs)
INSERT INTO american_job_centers (name, center_type, address_street, address_city, address_state, address_zip, phone, status, lwdb_id)
SELECT
  'Downtown Career Center',
  'COMPREHENSIVE',
  '100 Main Street',
  'Springfield',
  'IL',
  '62701',
  '(217) 555-0100',
  'ACTIVE',
  id
FROM local_workforce_boards WHERE lwdb_number = 'LWDB-01'
ON CONFLICT DO NOTHING;

COMMIT;
