-- ===========================================
-- National Labs Partners System
-- DOE Labs, FFRDCs, University Research Centers
-- Migration: 046_national_labs_partners_system.sql
-- ===========================================

-- ===========================================
-- CORE PARTNER TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS national_labs_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  lab_type TEXT NOT NULL CHECK (lab_type IN ('doe_national_lab', 'ffrdc', 'university_research', 'industry_rd', 'other')),
  lab_code TEXT, -- e.g., ORNL, LANL, SNL

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  facility TEXT,

  -- Partnership details
  tier TEXT NOT NULL DEFAULT 'research' CHECK (tier IN ('research', 'lab', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),

  -- Contact info
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_title TEXT,

  -- Organization details
  employee_count INTEGER,
  clearance_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  research_areas TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Billing
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'past_due', 'cancelled', 'trialing')),

  -- Timestamps
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id)
);

-- ===========================================
-- CLEARANCE POSITIONS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS clearance_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  division TEXT,

  -- Clearance requirements
  required_clearance TEXT NOT NULL CHECK (required_clearance IN ('public_trust', 'l_clearance', 'q_clearance', 'ts', 'ts_sci', 'none')),
  polygraph_required BOOLEAN DEFAULT FALSE,
  citizenship_required BOOLEAN DEFAULT TRUE,
  export_controlled BOOLEAN DEFAULT FALSE,

  -- Position details
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT NOT NULL,
  remote BOOLEAN DEFAULT FALSE,
  salary_min INTEGER,
  salary_max INTEGER,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'filled', 'closed')),
  openings INTEGER DEFAULT 1,
  filled_count INTEGER DEFAULT 0,

  -- Pipeline metrics
  candidates_total INTEGER DEFAULT 0,
  candidates_screened INTEGER DEFAULT 0,
  candidates_eligible INTEGER DEFAULT 0,
  candidates_in_process INTEGER DEFAULT 0,

  -- Metrics
  average_time_to_fill INTEGER, -- days
  average_time_to_screen INTEGER, -- days

  -- Dates
  posted_date TIMESTAMPTZ,
  closed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CLEARANCE CANDIDATES TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS clearance_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  position_id UUID REFERENCES clearance_positions(id) ON DELETE SET NULL,

  -- Candidate info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Clearance eligibility factors
  citizenship_status TEXT NOT NULL CHECK (citizenship_status IN ('us_citizen', 'permanent_resident', 'visa_holder', 'non_us', 'unknown')),
  birth_country TEXT,
  dual_citizenship BOOLEAN DEFAULT FALSE,
  foreign_contacts BOOLEAN DEFAULT FALSE,
  foreign_travel BOOLEAN DEFAULT FALSE,
  financial_issues BOOLEAN DEFAULT FALSE,
  criminal_history BOOLEAN DEFAULT FALSE,
  drug_use BOOLEAN DEFAULT FALSE,

  -- Pre-screening results
  sf86_readiness_score INTEGER DEFAULT 0 CHECK (sf86_readiness_score >= 0 AND sf86_readiness_score <= 100),
  eligibility_assessment TEXT CHECK (eligibility_assessment IN ('eligible', 'conditional', 'high_risk', 'ineligible')),
  risk_factors TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Clearance tracking
  target_clearance_type TEXT NOT NULL CHECK (target_clearance_type IN ('public_trust', 'l_clearance', 'q_clearance', 'ts', 'ts_sci', 'none')),
  current_clearance_status TEXT DEFAULT 'not_started' CHECK (current_clearance_status IN ('not_started', 'sf86_submitted', 'investigation', 'adjudication', 'granted', 'denied', 'revoked', 'expired')),
  sf86_submitted_date TIMESTAMPTZ,
  investigation_start_date TIMESTAMPTZ,
  adjudication_date TIMESTAMPTZ,
  clearance_granted_date TIMESTAMPTZ,
  clearance_expiration_date TIMESTAMPTZ,

  -- Timestamps
  screened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- FELLOWSHIP PROGRAMS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS fellowship_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  program_type TEXT NOT NULL CHECK (program_type IN ('suli', 'scgsr', 'cci', 'nsf_grfp', 'doe_nnsa', 'postdoc', 'internship', 'lab_specific', 'other')),
  description TEXT NOT NULL,

  -- Program details
  duration TEXT NOT NULL, -- e.g., "10 weeks", "12 months"
  is_paid BOOLEAN DEFAULT TRUE,
  stipend_amount INTEGER,
  housing_provided BOOLEAN DEFAULT FALSE,
  relocation_assistance BOOLEAN DEFAULT FALSE,

  -- Eligibility
  citizenship_required BOOLEAN DEFAULT TRUE,
  clearance_required TEXT CHECK (clearance_required IN ('public_trust', 'l_clearance', 'q_clearance', 'ts', 'ts_sci', 'none')),
  education_levels TEXT[] DEFAULT ARRAY[]::TEXT[],
  majors_preferred TEXT[] DEFAULT ARRAY[]::TEXT[],
  gpa_minimum DECIMAL(3,2),

  -- Dates
  application_deadline TIMESTAMPTZ,
  program_start_date TIMESTAMPTZ,
  program_end_date TIMESTAMPTZ,

  -- Capacity
  total_slots INTEGER DEFAULT 10,
  filled_slots INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,

  -- Conversion tracking
  conversion_target INTEGER, -- percentage
  historical_conversion_rate DECIMAL(5,2),

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'accepting', 'closed', 'completed', 'archived')),
  featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- FELLOWS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS fellows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES fellowship_programs(id) ON DELETE CASCADE,

  -- Fellow info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Background
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  degree TEXT NOT NULL, -- e.g., 'BS', 'MS', 'PhD'
  graduation_date TIMESTAMPTZ,
  gpa DECIMAL(3,2),

  -- Assignment
  mentor_id UUID,
  mentor_name TEXT,
  department TEXT,
  project_title TEXT,
  project_description TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'accepted', 'active', 'completed', 'converted', 'withdrawn', 'terminated')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,

  -- Evaluation
  midterm_evaluation INTEGER CHECK (midterm_evaluation >= 1 AND midterm_evaluation <= 5),
  final_evaluation INTEGER CHECK (final_evaluation >= 1 AND final_evaluation <= 5),
  mentor_feedback TEXT,

  -- Conversion
  received_offer BOOLEAN DEFAULT FALSE,
  accepted_offer BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMPTZ,
  conversion_position_id UUID REFERENCES clearance_positions(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PRINCIPAL INVESTIGATORS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS principal_investigators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- PI info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  division TEXT,

  -- Research profile
  research_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  publications INTEGER DEFAULT 0,
  h_index INTEGER,
  orcid_id TEXT,
  google_scholar_id TEXT,

  -- Looking for
  seeking_collaborations BOOLEAN DEFAULT TRUE,
  collaboration_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  seeking_students BOOLEAN DEFAULT TRUE,
  available_projects INTEGER DEFAULT 0,

  -- Bio
  biography TEXT,
  photo_url TEXT,
  website TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- RESEARCH COLLABORATIONS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS research_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  pi_id UUID NOT NULL REFERENCES principal_investigators(id) ON DELETE CASCADE,

  -- Collaboration details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  collaboration_type TEXT NOT NULL CHECK (collaboration_type IN ('joint_research', 'consulting', 'licensing', 'crada', 'user_facility', 'subcontract', 'other')),

  -- External partner
  external_organization TEXT NOT NULL,
  external_organization_type TEXT NOT NULL CHECK (external_organization_type IN ('university', 'industry', 'government', 'nonprofit', 'other')),
  external_contact_name TEXT NOT NULL,
  external_contact_email TEXT NOT NULL,

  -- Dates
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  contract_number TEXT,

  -- Funding
  funding_source TEXT,
  funding_amount INTEGER,

  -- Status
  status TEXT NOT NULL DEFAULT 'prospecting' CHECK (status IN ('prospecting', 'negotiating', 'active', 'completed', 'terminated')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- COMPLIANCE RECORDS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('candidate', 'position', 'project', 'collaboration')),
  record_id UUID NOT NULL,

  -- Export control
  export_control_type TEXT DEFAULT 'none' CHECK (export_control_type IN ('itar', 'ear', 'none', 'pending_review')),
  itar_controlled BOOLEAN DEFAULT FALSE,
  ear_controlled BOOLEAN DEFAULT FALSE,
  eccn TEXT, -- Export Control Classification Number

  -- Citizenship verification
  citizenship_verified BOOLEAN DEFAULT FALSE,
  citizenship_verification_date TIMESTAMPTZ,
  citizenship_verification_method TEXT,

  -- Compliance assessment
  compliance_status TEXT DEFAULT 'pending_review' CHECK (compliance_status IN ('compliant', 'non_compliant', 'pending_review', 'exception_granted')),
  compliance_notes TEXT,
  exception_reason TEXT,
  exception_approved_by TEXT,
  exception_approved_date TIMESTAMPTZ,

  -- Audit trail
  last_review_date TIMESTAMPTZ,
  next_review_date TIMESTAMPTZ,
  reviewed_by TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- COMPLIANCE AUDIT LOG TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS compliance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES national_labs_partners(id) ON DELETE CASCADE,
  compliance_record_id UUID REFERENCES compliance_records(id) ON DELETE SET NULL,

  -- Action details
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'review', 'approve', 'reject', 'exception')),
  performed_by TEXT NOT NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Details
  previous_value TEXT,
  new_value TEXT,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_national_labs_partners_user_id ON national_labs_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_national_labs_partners_status ON national_labs_partners(status);
CREATE INDEX IF NOT EXISTS idx_national_labs_partners_tier ON national_labs_partners(tier);

CREATE INDEX IF NOT EXISTS idx_clearance_positions_partner_id ON clearance_positions(partner_id);
CREATE INDEX IF NOT EXISTS idx_clearance_positions_status ON clearance_positions(status);
CREATE INDEX IF NOT EXISTS idx_clearance_positions_required_clearance ON clearance_positions(required_clearance);

CREATE INDEX IF NOT EXISTS idx_clearance_candidates_partner_id ON clearance_candidates(partner_id);
CREATE INDEX IF NOT EXISTS idx_clearance_candidates_position_id ON clearance_candidates(position_id);
CREATE INDEX IF NOT EXISTS idx_clearance_candidates_status ON clearance_candidates(current_clearance_status);
CREATE INDEX IF NOT EXISTS idx_clearance_candidates_eligibility ON clearance_candidates(eligibility_assessment);

CREATE INDEX IF NOT EXISTS idx_fellowship_programs_partner_id ON fellowship_programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_fellowship_programs_status ON fellowship_programs(status);
CREATE INDEX IF NOT EXISTS idx_fellowship_programs_type ON fellowship_programs(program_type);

CREATE INDEX IF NOT EXISTS idx_fellows_partner_id ON fellows(partner_id);
CREATE INDEX IF NOT EXISTS idx_fellows_program_id ON fellows(program_id);
CREATE INDEX IF NOT EXISTS idx_fellows_status ON fellows(status);

CREATE INDEX IF NOT EXISTS idx_principal_investigators_partner_id ON principal_investigators(partner_id);
CREATE INDEX IF NOT EXISTS idx_principal_investigators_seeking ON principal_investigators(seeking_collaborations);

CREATE INDEX IF NOT EXISTS idx_research_collaborations_partner_id ON research_collaborations(partner_id);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_pi_id ON research_collaborations(pi_id);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_status ON research_collaborations(status);

CREATE INDEX IF NOT EXISTS idx_compliance_records_partner_id ON compliance_records(partner_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_record ON compliance_records(record_type, record_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(compliance_status);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_logs_partner_id ON compliance_audit_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_logs_record ON compliance_audit_logs(compliance_record_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE national_labs_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellows ENABLE ROW LEVEL SECURITY;
ALTER TABLE principal_investigators ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Partner policies
CREATE POLICY "Users can view own lab partner profile" ON national_labs_partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lab partner profile" ON national_labs_partners
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab partner profile" ON national_labs_partners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Position policies
CREATE POLICY "Lab partners can view own positions" ON clearance_positions
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own positions" ON clearance_positions
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Candidate policies
CREATE POLICY "Lab partners can view own candidates" ON clearance_candidates
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own candidates" ON clearance_candidates
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Fellowship program policies
CREATE POLICY "Lab partners can view own programs" ON fellowship_programs
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own programs" ON fellowship_programs
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Fellows policies
CREATE POLICY "Lab partners can view own fellows" ON fellows
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own fellows" ON fellows
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- PI policies
CREATE POLICY "Lab partners can view own PIs" ON principal_investigators
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own PIs" ON principal_investigators
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Research collaboration policies
CREATE POLICY "Lab partners can view own collaborations" ON research_collaborations
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own collaborations" ON research_collaborations
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Compliance record policies
CREATE POLICY "Lab partners can view own compliance records" ON compliance_records
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can manage own compliance records" ON compliance_records
  FOR ALL USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- Audit log policies
CREATE POLICY "Lab partners can view own audit logs" ON compliance_audit_logs
  FOR SELECT USING (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Lab partners can insert audit logs" ON compliance_audit_logs
  FOR INSERT WITH CHECK (
    partner_id IN (SELECT id FROM national_labs_partners WHERE user_id = auth.uid())
  );

-- ===========================================
-- TRIGGERS FOR updated_at
-- ===========================================

CREATE OR REPLACE FUNCTION update_national_labs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_national_labs_partners_timestamp
  BEFORE UPDATE ON national_labs_partners
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_clearance_positions_timestamp
  BEFORE UPDATE ON clearance_positions
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_clearance_candidates_timestamp
  BEFORE UPDATE ON clearance_candidates
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_fellowship_programs_timestamp
  BEFORE UPDATE ON fellowship_programs
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_fellows_timestamp
  BEFORE UPDATE ON fellows
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_principal_investigators_timestamp
  BEFORE UPDATE ON principal_investigators
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_research_collaborations_timestamp
  BEFORE UPDATE ON research_collaborations
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

CREATE TRIGGER update_compliance_records_timestamp
  BEFORE UPDATE ON compliance_records
  FOR EACH ROW EXECUTE FUNCTION update_national_labs_timestamp();

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Get clearance pipeline metrics
CREATE OR REPLACE FUNCTION get_clearance_pipeline_metrics(p_partner_id UUID)
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  percentage DECIMAL(5,2)
) AS $$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_count FROM clearance_candidates WHERE partner_id = p_partner_id;

  RETURN QUERY
  SELECT
    cc.current_clearance_status::TEXT as stage,
    COUNT(*)::BIGINT as count,
    CASE WHEN total_count > 0
      THEN ROUND((COUNT(*)::DECIMAL / total_count * 100), 2)
      ELSE 0
    END as percentage
  FROM clearance_candidates cc
  WHERE cc.partner_id = p_partner_id
  GROUP BY cc.current_clearance_status
  ORDER BY
    CASE cc.current_clearance_status
      WHEN 'not_started' THEN 1
      WHEN 'sf86_submitted' THEN 2
      WHEN 'investigation' THEN 3
      WHEN 'adjudication' THEN 4
      WHEN 'granted' THEN 5
      WHEN 'denied' THEN 6
      ELSE 7
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get fellowship conversion metrics
CREATE OR REPLACE FUNCTION get_fellowship_conversion_metrics(p_partner_id UUID)
RETURNS TABLE (
  program_name TEXT,
  total_fellows BIGINT,
  completed_fellows BIGINT,
  converted_fellows BIGINT,
  conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fp.name as program_name,
    COUNT(f.id)::BIGINT as total_fellows,
    COUNT(f.id) FILTER (WHERE f.status = 'completed' OR f.status = 'converted')::BIGINT as completed_fellows,
    COUNT(f.id) FILTER (WHERE f.status = 'converted')::BIGINT as converted_fellows,
    CASE WHEN COUNT(f.id) FILTER (WHERE f.status = 'completed' OR f.status = 'converted') > 0
      THEN ROUND(
        COUNT(f.id) FILTER (WHERE f.status = 'converted')::DECIMAL /
        COUNT(f.id) FILTER (WHERE f.status = 'completed' OR f.status = 'converted') * 100, 2
      )
      ELSE 0
    END as conversion_rate
  FROM fellowship_programs fp
  LEFT JOIN fellows f ON f.program_id = fp.id
  WHERE fp.partner_id = p_partner_id
  GROUP BY fp.id, fp.name
  ORDER BY fp.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
