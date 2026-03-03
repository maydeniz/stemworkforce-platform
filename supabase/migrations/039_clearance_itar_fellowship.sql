-- ===========================================
-- Migration 039: Clearance Pipeline, ITAR/EAR Compliance & Fellowship Management
-- Implements functional features for National Labs, FFRDCs, and Federal Agencies
--
-- Regulatory References:
--   10 CFR 710 (DOE clearances - Q/L)
--   22 CFR 120-130 (ITAR)
--   15 CFR 730-774 (EAR)
--   32 CFR 117 (NISPOM)
--
-- PRIVACY NOTE: This system tracks STATUS and DATES only.
-- No SF-86 content, classified information, or PII beyond what
-- is already in the users table is stored here.
-- ===========================================

-- ===========================================
-- SECTION 1: Clearance Pipeline Tables
-- ===========================================

-- Main clearance pipeline tracking table
CREATE TABLE IF NOT EXISTS clearance_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID,

  -- Clearance type requested
  clearance_type TEXT NOT NULL DEFAULT 'none',
  doe_clearance_type TEXT CHECK (doe_clearance_type IN (
    'l-clearance', 'q-clearance', 'sci',
    'sigma-1', 'sigma-2', 'sigma-14', 'sigma-15'
  )),
  sponsoring_agency TEXT NOT NULL DEFAULT 'DOE',
  sponsoring_facility TEXT,

  -- Pipeline status (NO actual SF-86 data stored)
  pipeline_status TEXT NOT NULL DEFAULT 'not-started' CHECK (pipeline_status IN (
    'not-started', 'sf86-preparation', 'sf86-submitted',
    'investigation-initiated', 'investigation-fieldwork', 'investigation-complete',
    'adjudication-pending', 'adjudication-review',
    'interim-granted', 'granted', 'denied',
    'appeal-pending', 'suspended', 'revoked',
    'expired', 'reinvestigation-due'
  )),

  -- Timeline tracking (dates only, never content)
  sf86_prep_started_at TIMESTAMPTZ,
  sf86_submitted_at TIMESTAMPTZ,
  investigation_opened_at TIMESTAMPTZ,
  investigation_completed_at TIMESTAMPTZ,
  adjudication_started_at TIMESTAMPTZ,
  interim_granted_at TIMESTAMPTZ,
  final_granted_at TIMESTAMPTZ,
  denied_at TIMESTAMPTZ,

  -- Expiration management (10 CFR 710: Q=5yr, L=10yr reinvestigation)
  clearance_granted_at TIMESTAMPTZ,
  clearance_expires_at TIMESTAMPTZ,
  reinvestigation_due_at TIMESTAMPTZ,
  last_periodic_reinvestigation TIMESTAMPTZ,

  -- Polygraph tracking (DOE Q/SCI often requires)
  polygraph_required BOOLEAN DEFAULT FALSE,
  polygraph_type TEXT CHECK (polygraph_type IN ('full-scope', 'counterintelligence', 'lifestyle')),
  polygraph_scheduled_at TIMESTAMPTZ,
  polygraph_completed_at TIMESTAMPTZ,
  polygraph_passed BOOLEAN,

  -- Drug test tracking
  drug_test_required BOOLEAN DEFAULT FALSE,
  drug_test_completed_at TIMESTAMPTZ,
  drug_test_passed BOOLEAN,

  -- FSO assignment
  assigned_fso_id UUID,
  fso_notes TEXT,

  -- Status metadata (general category only, not specific details)
  denial_reason_category TEXT CHECK (denial_reason_category IN (
    'criminal-conduct', 'financial', 'foreign-influence', 'foreign-preference',
    'drug-involvement', 'alcohol', 'psychological', 'sexual-behavior',
    'personal-conduct', 'information-technology', 'allegiance', 'other'
  )),
  appeal_filed BOOLEAN DEFAULT FALSE,
  appeal_filed_at TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_clearance_user ON clearance_pipelines(user_id);
CREATE INDEX IF NOT EXISTS idx_clearance_org ON clearance_pipelines(organization_id);
CREATE INDEX IF NOT EXISTS idx_clearance_status ON clearance_pipelines(pipeline_status);
CREATE INDEX IF NOT EXISTS idx_clearance_type ON clearance_pipelines(clearance_type);
CREATE INDEX IF NOT EXISTS idx_clearance_expiring ON clearance_pipelines(clearance_expires_at)
  WHERE clearance_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clearance_reinvestigation ON clearance_pipelines(reinvestigation_due_at)
  WHERE reinvestigation_due_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clearance_fso ON clearance_pipelines(assigned_fso_id)
  WHERE assigned_fso_id IS NOT NULL;

-- Clearance status history (audit trail)
CREATE TABLE IF NOT EXISTS clearance_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES clearance_pipelines(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  change_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clearance_history_pipeline ON clearance_status_history(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_clearance_history_time ON clearance_status_history(created_at);

-- ===========================================
-- SECTION 2: ITAR/EAR Export Control Tables
-- ===========================================

-- Export control assessments per job/project
CREATE TABLE IF NOT EXISTS export_control_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What is being assessed
  job_id UUID,
  organization_id UUID,
  project_name TEXT,

  -- Control type classification
  control_type TEXT NOT NULL DEFAULT 'none' CHECK (control_type IN ('itar', 'ear', 'both', 'none')),

  -- ITAR specific (22 CFR 120-130, USML Categories I-XXI)
  itar_category TEXT,
  itar_subcategory TEXT,
  itar_exemption TEXT,

  -- EAR specific (15 CFR 730-774)
  ear_eccn TEXT,
  ear_classification_reason TEXT,
  ear_license_exception TEXT,

  -- Technology Control Plan (TCP)
  tcp_required BOOLEAN DEFAULT FALSE,
  tcp_reference_number TEXT,
  tcp_approved_at TIMESTAMPTZ,
  tcp_expires_at TIMESTAMPTZ,
  tcp_reviewed_by UUID,

  -- Assessment result
  assessment_status TEXT NOT NULL DEFAULT 'not-assessed' CHECK (assessment_status IN (
    'not-assessed', 'assessment-pending', 'eligible', 'restricted',
    'denied', 'exemption-pending', 'exemption-granted', 'under-review'
  )),
  citizenship_requirement TEXT CHECK (citizenship_requirement IN (
    'us-citizen-only', 'us-person', 'us-authorized', 'any'
  )),
  foreign_national_allowed BOOLEAN DEFAULT FALSE,

  -- Compliance notes
  compliance_notes TEXT,
  special_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Audit
  assessed_by UUID,
  assessed_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  next_review_due TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ec_assessment_job ON export_control_assessments(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ec_assessment_org ON export_control_assessments(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ec_assessment_type ON export_control_assessments(control_type);
CREATE INDEX IF NOT EXISTS idx_ec_assessment_status ON export_control_assessments(assessment_status);
CREATE INDEX IF NOT EXISTS idx_ec_tcp_expiring ON export_control_assessments(tcp_expires_at) WHERE tcp_expires_at IS NOT NULL;

-- Foreign national screening records
CREATE TABLE IF NOT EXISTS foreign_national_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID,

  -- Citizenship/nationality info (self-declared)
  declared_citizenship TEXT NOT NULL,
  dual_citizenship TEXT[] DEFAULT ARRAY[]::TEXT[],
  country_of_birth TEXT,
  visa_type TEXT,
  visa_expiration DATE,
  permanent_resident BOOLEAN DEFAULT FALSE,
  green_card_date DATE,

  -- Screening result
  screening_status TEXT NOT NULL DEFAULT 'not-assessed' CHECK (screening_status IN (
    'not-assessed', 'assessment-pending', 'eligible', 'restricted',
    'denied', 'exemption-pending', 'exemption-granted', 'under-review'
  )),
  itar_eligible BOOLEAN,
  ear_eligible BOOLEAN,
  deemed_export_risk TEXT CHECK (deemed_export_risk IN ('low', 'medium', 'high')),

  -- Restricted party list screening (BIS/OFAC/DDTC)
  restricted_party_checked BOOLEAN DEFAULT FALSE,
  restricted_party_checked_at TIMESTAMPTZ,
  restricted_party_match BOOLEAN DEFAULT FALSE,
  denied_persons_list_checked BOOLEAN DEFAULT FALSE,
  entity_list_checked BOOLEAN DEFAULT FALSE,
  sdn_list_checked BOOLEAN DEFAULT FALSE,
  unverified_list_checked BOOLEAN DEFAULT FALSE,

  -- Notes and audit
  screening_notes TEXT,
  screened_by UUID,
  screened_at TIMESTAMPTZ,
  next_review_due TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fn_screening_user ON foreign_national_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_fn_screening_status ON foreign_national_screenings(screening_status);
CREATE INDEX IF NOT EXISTS idx_fn_screening_org ON foreign_national_screenings(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fn_restricted_match ON foreign_national_screenings(restricted_party_match) WHERE restricted_party_match = TRUE;

-- Export control audit log (immutable compliance trail)
CREATE TABLE IF NOT EXISTS export_control_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES export_control_assessments(id) ON DELETE SET NULL,
  screening_id UUID REFERENCES foreign_national_screenings(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'assessment_created', 'assessment_updated', 'assessment_approved',
    'screening_initiated', 'screening_completed', 'screening_flagged',
    'restricted_party_match', 'tcp_created', 'tcp_expired', 'tcp_renewed',
    'eligibility_checked', 'exemption_requested', 'exemption_granted',
    'denial_issued', 'appeal_filed', 'status_changed'
  )),
  event_details JSONB DEFAULT '{}'::JSONB,
  performed_by UUID,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ec_audit_assessment ON export_control_audit_log(assessment_id) WHERE assessment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ec_audit_screening ON export_control_audit_log(screening_id) WHERE screening_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ec_audit_type ON export_control_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_ec_audit_time ON export_control_audit_log(created_at);

-- ===========================================
-- SECTION 3: Fellowship Program Management Tables
-- ===========================================

-- Fellowship programs (DOE SULI, SCGSR, CCI, WDTS, etc.)
CREATE TABLE IF NOT EXISTS fellowship_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Program identity
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  program_type TEXT NOT NULL CHECK (program_type IN (
    'suli', 'scgsr', 'cci', 'wdts', 'visiting-faculty',
    'postdoc', 'research-associate', 'custom'
  )),
  managing_organization_id UUID,

  -- Program details
  description TEXT NOT NULL,
  eligibility_description TEXT,
  website TEXT,

  -- Timing
  term_type TEXT CHECK (term_type IN ('semester', 'summer', 'year-round', 'custom')),
  term_start_month INTEGER CHECK (term_start_month BETWEEN 1 AND 12),
  term_end_month INTEGER CHECK (term_end_month BETWEEN 1 AND 12),
  term_duration_weeks INTEGER,
  application_open_date DATE,
  application_deadline DATE,

  -- Participant limits
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,

  -- Compensation
  stipend_amount DECIMAL(10,2),
  stipend_frequency TEXT CHECK (stipend_frequency IN ('weekly', 'biweekly', 'monthly', 'total')),
  housing_provided BOOLEAN DEFAULT FALSE,
  travel_reimbursed BOOLEAN DEFAULT FALSE,
  health_insurance_provided BOOLEAN DEFAULT FALSE,

  -- Requirements
  citizenship_required TEXT[] DEFAULT ARRAY['us_citizen']::TEXT[],
  min_gpa DECIMAL(3,2),
  education_levels TEXT[] DEFAULT ARRAY[]::TEXT[],
  required_major_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  clearance_required TEXT,
  drug_test_required BOOLEAN DEFAULT FALSE,
  background_check_required BOOLEAN DEFAULT TRUE,

  -- DOE Lab specific
  participating_labs TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  academic_year TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_fellowship_prog_type ON fellowship_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_fellowship_prog_status ON fellowship_programs(status);
CREATE INDEX IF NOT EXISTS idx_fellowship_prog_deadline ON fellowship_programs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_fellowship_prog_org ON fellowship_programs(managing_organization_id) WHERE managing_organization_id IS NOT NULL;

-- Fellowship cohorts (groups per term)
CREATE TABLE IF NOT EXISTS fellowship_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES fellowship_programs(id) ON DELETE CASCADE,

  -- Cohort identity
  name TEXT NOT NULL,
  term TEXT NOT NULL,
  academic_year TEXT,

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  orientation_date DATE,

  -- Capacity
  max_participants INTEGER,
  accepted_count INTEGER DEFAULT 0,
  active_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'planning' CHECK (status IN (
    'planning', 'accepting', 'full', 'active', 'completed', 'cancelled'
  )),

  -- Lab assignments
  host_lab TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cohort_program ON fellowship_cohorts(program_id);
CREATE INDEX IF NOT EXISTS idx_cohort_status ON fellowship_cohorts(status);
CREATE INDEX IF NOT EXISTS idx_cohort_term ON fellowship_cohorts(term);

-- Fellowship applications
CREATE TABLE IF NOT EXISTS fellowship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES fellowship_programs(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES fellowship_cohorts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,

  -- Application status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'under-review', 'faculty-review',
    'mentor-assigned', 'accepted', 'waitlisted', 'declined',
    'withdrawn', 'completed', 'terminated'
  )),

  -- Academic info (snapshot at application time)
  university TEXT,
  major TEXT,
  gpa DECIMAL(3,2),
  education_level TEXT,
  expected_graduation DATE,

  -- Preferences
  preferred_labs TEXT[] DEFAULT ARRAY[]::TEXT[],
  preferred_research_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  research_statement TEXT,

  -- Mentor assignment
  assigned_mentor_id UUID,
  assigned_lab TEXT,
  assigned_division TEXT,
  assigned_project TEXT,

  -- Evaluations
  faculty_recommendation_received BOOLEAN DEFAULT FALSE,
  faculty_recommendation_score INTEGER CHECK (faculty_recommendation_score BETWEEN 1 AND 10),
  application_score INTEGER CHECK (application_score BETWEEN 1 AND 100),
  interview_score INTEGER CHECK (interview_score BETWEEN 1 AND 100),
  overall_score DECIMAL(5,2),

  -- Compliance checks
  citizenship_verified BOOLEAN DEFAULT FALSE,
  background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN (
    'pending', 'in-progress', 'passed', 'failed', 'waived'
  )),
  drug_test_status TEXT DEFAULT 'pending' CHECK (drug_test_status IN (
    'pending', 'scheduled', 'passed', 'failed', 'waived', 'not-required'
  )),
  clearance_status TEXT DEFAULT 'not-required',

  -- Completion tracking
  midterm_evaluation_score INTEGER CHECK (midterm_evaluation_score BETWEEN 1 AND 10),
  final_evaluation_score INTEGER CHECK (final_evaluation_score BETWEEN 1 AND 10),
  final_report_submitted BOOLEAN DEFAULT FALSE,
  poster_presentation_completed BOOLEAN DEFAULT FALSE,

  -- Outcomes
  completion_status TEXT CHECK (completion_status IN ('completed', 'withdrew', 'terminated', 'extended')),
  return_offer_extended BOOLEAN DEFAULT FALSE,
  converted_to_hire BOOLEAN DEFAULT FALSE,

  -- Timestamps
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fellowship_app_program ON fellowship_applications(program_id);
CREATE INDEX IF NOT EXISTS idx_fellowship_app_user ON fellowship_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_fellowship_app_status ON fellowship_applications(status);
CREATE INDEX IF NOT EXISTS idx_fellowship_app_cohort ON fellowship_applications(cohort_id) WHERE cohort_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fellowship_app_mentor ON fellowship_applications(assigned_mentor_id) WHERE assigned_mentor_id IS NOT NULL;

-- Fellowship mentors
CREATE TABLE IF NOT EXISTS fellowship_mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,

  -- Mentor info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  department TEXT,
  lab_name TEXT,
  division TEXT,

  -- Expertise
  research_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Capacity
  max_fellows INTEGER DEFAULT 3,
  current_fellows INTEGER DEFAULT 0,

  -- Track record
  total_fellows_mentored INTEGER DEFAULT 0,
  average_fellow_rating DECIMAL(3,2),
  fellows_converted_to_hire INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on-leave', 'inactive', 'retired')),
  available_for_programs TEXT[] DEFAULT ARRAY[]::TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentor_lab ON fellowship_mentors(lab_name) WHERE lab_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mentor_status ON fellowship_mentors(status);
CREATE INDEX IF NOT EXISTS idx_mentor_user ON fellowship_mentors(user_id) WHERE user_id IS NOT NULL;

-- ===========================================
-- SECTION 4: New Roles for Clearance/Compliance/Fellowship
-- ===========================================

-- Insert new admin roles (uses ON CONFLICT to be idempotent)
INSERT INTO admin_roles (name, display_name, description, permissions, is_active)
VALUES
  ('FSO', 'Facility Security Officer',
   'Manages clearance pipelines and security compliance for their facility. Responsible for NISPOM compliance, SF-86 processing coordination, and clearance status tracking.',
   ARRAY['clearance.view', 'clearance.manage', 'clearance.assign', 'itar.view', 'itar.manage', 'users.view.clearance', 'audit.view.clearance']::TEXT[],
   true),
  ('CLEARANCE_OFFICER', 'Clearance Processing Officer',
   'Processes and tracks clearance applications through the investigation and adjudication pipeline.',
   ARRAY['clearance.view', 'clearance.manage', 'clearance.adjudicate', 'users.view.clearance']::TEXT[],
   true),
  ('FELLOWSHIP_COORDINATOR', 'Fellowship Program Coordinator',
   'Manages DOE fellowship programs (SULI, SCGSR, CCI, WDTS), cohorts, applications, and mentor assignments.',
   ARRAY['fellowship.view', 'fellowship.manage', 'fellowship.applications', 'fellowship.mentors', 'fellowship.cohorts']::TEXT[],
   true),
  ('EXPORT_CONTROL_OFFICER', 'Export Control Officer',
   'Manages ITAR/EAR compliance assessments, foreign national screenings, and Technology Control Plans.',
   ARRAY['itar.view', 'itar.manage', 'itar.screen', 'itar.audit', 'itar.tcp']::TEXT[],
   true),
  ('LAB_HR', 'National Lab HR',
   'HR team at national laboratories with combined access to clearance tracking, fellowship management, and export control compliance.',
   ARRAY['clearance.view', 'fellowship.view', 'fellowship.manage', 'itar.view', 'users.view.clearance', 'users.view.fellowship']::TEXT[],
   true)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- ===========================================
-- SECTION 5: Row Level Security Policies
-- ===========================================

-- Clearance pipeline RLS
ALTER TABLE clearance_pipelines ENABLE ROW LEVEL SECURITY;

-- Users can view their own clearance records
CREATE POLICY clearance_self_read ON clearance_pipelines
  FOR SELECT USING (user_id = auth.uid());

-- FSO and clearance officers can view all clearance records
CREATE POLICY clearance_officer_read ON clearance_pipelines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FSO', 'CLEARANCE_OFFICER', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'SECURITY_ADMIN', 'LAB_HR')
    )
  );

-- FSO and clearance officers can manage clearance records
CREATE POLICY clearance_officer_manage ON clearance_pipelines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FSO', 'CLEARANCE_OFFICER', 'SUPER_ADMIN')
    )
  );

-- Clearance history RLS
ALTER TABLE clearance_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY clearance_history_read ON clearance_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clearance_pipelines cp
      WHERE cp.id = clearance_status_history.pipeline_id
      AND (cp.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM user_role_assignments ura
        JOIN admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.name IN ('FSO', 'CLEARANCE_OFFICER', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'LAB_HR')
      ))
    )
  );

-- Export control RLS
ALTER TABLE export_control_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY ec_assessment_read ON export_control_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'SECURITY_ADMIN', 'LAB_HR')
    )
  );

CREATE POLICY ec_assessment_manage ON export_control_assessments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN')
    )
  );

ALTER TABLE foreign_national_screenings ENABLE ROW LEVEL SECURITY;

-- Users can view their own screening records
CREATE POLICY fn_screening_self ON foreign_national_screenings
  FOR SELECT USING (user_id = auth.uid());

-- Officers can view all screenings
CREATE POLICY fn_screening_officer ON foreign_national_screenings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'LAB_HR')
    )
  );

CREATE POLICY fn_screening_manage ON foreign_national_screenings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN')
    )
  );

-- Export control audit log (read-only for most, insert for officers)
ALTER TABLE export_control_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY ec_audit_read ON export_control_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'SECURITY_ADMIN', 'LAB_HR')
    )
  );

CREATE POLICY ec_audit_insert ON export_control_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('EXPORT_CONTROL_OFFICER', 'FSO', 'SUPER_ADMIN')
    )
  );

-- Fellowship RLS
ALTER TABLE fellowship_programs ENABLE ROW LEVEL SECURITY;

-- Programs are readable by anyone with fellowship access
CREATE POLICY fellowship_prog_read ON fellowship_programs
  FOR SELECT USING (
    status = 'active' OR EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'LAB_HR')
    )
  );

CREATE POLICY fellowship_prog_manage ON fellowship_programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN')
    )
  );

ALTER TABLE fellowship_cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY fellowship_cohort_read ON fellowship_cohorts
  FOR SELECT USING (TRUE);

CREATE POLICY fellowship_cohort_manage ON fellowship_cohorts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN', 'LAB_HR')
    )
  );

ALTER TABLE fellowship_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY fellowship_app_self ON fellowship_applications
  FOR SELECT USING (user_id = auth.uid());

-- Coordinators can view all applications
CREATE POLICY fellowship_app_coord_read ON fellowship_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'LAB_HR')
    )
  );

CREATE POLICY fellowship_app_manage ON fellowship_applications
  FOR ALL USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN')
    )
  );

ALTER TABLE fellowship_mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY fellowship_mentor_read ON fellowship_mentors
  FOR SELECT USING (TRUE);

CREATE POLICY fellowship_mentor_manage ON fellowship_mentors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN admin_roles ar ON ura.role_id = ar.id
      WHERE ura.user_id = auth.uid()
      AND ar.name IN ('FELLOWSHIP_COORDINATOR', 'SUPER_ADMIN', 'LAB_HR')
    )
  );

-- ===========================================
-- SECTION 6: Seed Data for Fellowship Programs
-- ===========================================

INSERT INTO fellowship_programs (
  name, short_name, program_type, description, eligibility_description, website,
  term_type, term_start_month, term_end_month, term_duration_weeks,
  stipend_amount, stipend_frequency, housing_provided, travel_reimbursed,
  citizenship_required, education_levels, background_check_required,
  participating_labs, status
) VALUES
(
  'Science Undergraduate Laboratory Internships',
  'SULI', 'suli',
  'SULI provides undergraduate students with opportunities to conduct research at DOE national laboratories. Students work under the guidance of laboratory staff scientists or engineers on projects related to ongoing research programs.',
  'Must be U.S. citizens or lawful permanent residents. Must be currently enrolled as full-time undergraduate students at accredited institutions. Minimum 3.0 GPA recommended.',
  'https://science.osti.gov/wdts/suli',
  'summer', 5, 8, 10,
  650.00, 'weekly', true, true,
  ARRAY['us_citizen', 'permanent_resident']::TEXT[],
  ARRAY['undergraduate']::TEXT[], true,
  ARRAY['Argonne', 'Brookhaven', 'Fermilab', 'LBNL', 'Oak Ridge', 'PNNL', 'Sandia', 'SLAC']::TEXT[],
  'active'
),
(
  'Office of Science Graduate Student Research',
  'SCGSR', 'scgsr',
  'SCGSR provides supplemental awards to outstanding U.S. graduate students to conduct part of their thesis research at a DOE national laboratory. Awards support graduate students performing research in priority areas.',
  'Must be U.S. citizens or permanent residents. Must be currently enrolled in a PhD program at an accredited U.S. university. Must have completed preliminary/qualifying exams.',
  'https://science.osti.gov/wdts/scgsr',
  'custom', NULL, NULL, 26,
  3000.00, 'monthly', false, true,
  ARRAY['us_citizen', 'permanent_resident']::TEXT[],
  ARRAY['graduate']::TEXT[], true,
  ARRAY['Argonne', 'Brookhaven', 'Fermilab', 'LBNL', 'LLNL', 'LANL', 'Oak Ridge', 'PNNL', 'Sandia', 'SLAC']::TEXT[],
  'active'
),
(
  'Community College Internships',
  'CCI', 'cci',
  'CCI provides community college students with opportunities to participate in STEM research at DOE national laboratories. Interns gain hands-on experience in applied research and technology development.',
  'Must be U.S. citizens or lawful permanent residents. Must be currently enrolled at an accredited community college or technical institute.',
  'https://science.osti.gov/wdts/cci',
  'summer', 5, 8, 10,
  550.00, 'weekly', true, true,
  ARRAY['us_citizen', 'permanent_resident']::TEXT[],
  ARRAY['community_college']::TEXT[], true,
  ARRAY['Argonne', 'Brookhaven', 'Oak Ridge', 'PNNL', 'LBNL']::TEXT[],
  'active'
),
(
  'Visiting Faculty Program',
  'VFP', 'visiting-faculty',
  'The Visiting Faculty Program provides research opportunities for faculty and students at institutions historically underrepresented in STEM. Faculty collaborate with DOE laboratory scientists on research of mutual interest.',
  'Must be U.S. citizens or lawful permanent residents. Must be full-time faculty at accredited U.S. institutions historically underrepresented in STEM.',
  'https://science.osti.gov/wdts/vfp',
  'summer', 5, 8, 10,
  1400.00, 'weekly', true, true,
  ARRAY['us_citizen', 'permanent_resident']::TEXT[],
  ARRAY['faculty']::TEXT[], true,
  ARRAY['Argonne', 'Brookhaven', 'Fermilab', 'LBNL', 'Oak Ridge', 'PNNL']::TEXT[],
  'active'
),
(
  'DOE National Lab Postdoctoral Research Program',
  'Postdoc', 'postdoc',
  'The DOE Postdoctoral Research Program provides opportunities for recent PhD graduates to conduct research at DOE national laboratories. Fellows work under senior scientists on projects aligned with DOE mission areas.',
  'Must have completed a PhD within the last 5 years or anticipate completion by the start date. U.S. citizenship required for positions involving access to classified or sensitive information.',
  NULL,
  'year-round', NULL, NULL, 104,
  7000.00, 'monthly', false, true,
  ARRAY['us_citizen', 'permanent_resident', 'visa_holder']::TEXT[],
  ARRAY['postdoc']::TEXT[], true,
  ARRAY['Argonne', 'Brookhaven', 'Fermilab', 'LBNL', 'LLNL', 'LANL', 'Oak Ridge', 'PNNL', 'Sandia', 'SLAC', 'INL', 'NREL']::TEXT[],
  'active'
)
ON CONFLICT DO NOTHING;

-- ===========================================
-- SECTION 7: Updated timestamp triggers
-- ===========================================

CREATE OR REPLACE FUNCTION update_clearance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clearance_pipelines_updated
  BEFORE UPDATE ON clearance_pipelines
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_export_control_assessments_updated
  BEFORE UPDATE ON export_control_assessments
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_foreign_national_screenings_updated
  BEFORE UPDATE ON foreign_national_screenings
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_fellowship_programs_updated
  BEFORE UPDATE ON fellowship_programs
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_fellowship_cohorts_updated
  BEFORE UPDATE ON fellowship_cohorts
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_fellowship_applications_updated
  BEFORE UPDATE ON fellowship_applications
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

CREATE TRIGGER trg_fellowship_mentors_updated
  BEFORE UPDATE ON fellowship_mentors
  FOR EACH ROW EXECUTE FUNCTION update_clearance_timestamp();

-- ===========================================
-- Done: Migration 039 complete
-- ===========================================
