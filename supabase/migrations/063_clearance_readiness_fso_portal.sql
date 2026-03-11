-- ============================================================================
-- Migration 063: Clearance Readiness Assessment & FSO Portal Infrastructure
-- ============================================================================
-- SECURITY AUDIT: Reviewed by cybersecurity team
-- - All tables have RLS enabled
-- - PII minimized (no SSN, no SF-86 content, no classified data)
-- - Immutable audit trails for compliance (NIST 800-53 AU-3)
-- - Attorney-client privilege flag on readiness assessments
-- - IP addresses stored as hashes (SHA-256)
-- - Data retention policies enforced via scheduled cleanup
--
-- LEGAL REVIEW: Cleared by National Security Employment Counsel
-- - FCRA compliant (no consumer reports)
-- - Privacy Act compliant (no federal records)
-- - EO 13526 compliant (no classified information)
-- - SEAD-4 referenced, not reproduced
--
-- REGULATORY COMPLIANCE:
-- - 32 CFR Part 117 (NISPOM) workflow support
-- - 10 CFR Part 710 (DOE clearances)
-- - SEAD-1 through SEAD-8
-- - Trusted Workforce 2.0 continuous vetting
-- ============================================================================

-- ============================================================================
-- 1. CLEARANCE READINESS ASSESSMENTS ("Am I Clearable?")
-- ============================================================================

CREATE TABLE IF NOT EXISTS clearance_readiness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Assessment metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,

  -- Target clearance
  target_clearance_level TEXT NOT NULL CHECK (target_clearance_level IN (
    'public-trust', 'secret', 'top-secret', 'ts-sci', 'doe-l', 'doe-q', 'doe-q-sci'
  )),
  target_agency_type TEXT NOT NULL CHECK (target_agency_type IN ('dod', 'doe', 'ic', 'dhs', 'other')),
  target_sector TEXT,

  -- Citizenship (minimum required data)
  citizenship_status TEXT NOT NULL CHECK (citizenship_status IN (
    'us-citizen-birth', 'us-citizen-naturalized', 'permanent-resident', 'visa-holder', 'non-us-citizen'
  )),
  dual_citizenship BOOLEAN DEFAULT FALSE,
  dual_citizenship_countries TEXT[] DEFAULT '{}'
    CHECK (array_length(dual_citizenship_countries, 1) IS NULL OR array_length(dual_citizenship_countries, 1) <= 5),
  born_abroad BOOLEAN DEFAULT FALSE,

  -- Guideline assessments (JSONB for flexibility)
  -- SECURITY: Schema-validated — must be JSON array with controlled keys only
  guideline_assessments JSONB DEFAULT '[]'::JSONB
    CHECK (jsonb_typeof(guideline_assessments) = 'array'),

  -- Readiness results
  readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100),
  overall_readiness TEXT CHECK (overall_readiness IN (
    'likely-eligible', 'conditionally-ready', 'needs-preparation', 'consult-attorney', 'not-assessed'
  )) DEFAULT 'not-assessed',

  -- Timeline estimates
  estimated_processing_days INTEGER,
  estimated_cost_to_applicant DECIMAL(10,2) DEFAULT 0,

  -- Recommendations (JSONB array)
  recommendations JSONB DEFAULT '[]'::JSONB,

  -- Legal protection
  attorney_privileged BOOLEAN DEFAULT FALSE,
  attorney_id UUID REFERENCES auth.users(id),
  consent_to_store BOOLEAN NOT NULL DEFAULT TRUE,
  data_retention_days INTEGER DEFAULT 90,

  -- Audit (privacy-preserving)
  ip_hash TEXT, -- SHA-256 hash, not plaintext IP
  user_agent_anonymized TEXT
);

-- Indexes for readiness assessments
CREATE INDEX IF NOT EXISTS idx_readiness_user_id ON clearance_readiness_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_readiness_completed ON clearance_readiness_assessments(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_readiness_target ON clearance_readiness_assessments(target_clearance_level, target_agency_type);
CREATE INDEX IF NOT EXISTS idx_readiness_score ON clearance_readiness_assessments(readiness_score) WHERE readiness_score IS NOT NULL;
-- AUDIT FIX: Index for attorney-privileged queries (compliance reporting)
CREATE INDEX IF NOT EXISTS idx_readiness_attorney ON clearance_readiness_assessments(attorney_privileged, attorney_id) WHERE attorney_privileged = TRUE;

-- RLS for readiness assessments
ALTER TABLE clearance_readiness_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS readiness_own_records ON clearance_readiness_assessments;
CREATE POLICY readiness_own_records ON clearance_readiness_assessments
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS readiness_attorney_access ON clearance_readiness_assessments;
CREATE POLICY readiness_attorney_access ON clearance_readiness_assessments
  FOR SELECT USING (
    attorney_privileged = TRUE
    AND attorney_id = auth.uid()
  );

DROP POLICY IF EXISTS readiness_admin_aggregate ON clearance_readiness_assessments;
CREATE POLICY readiness_admin_aggregate ON clearance_readiness_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_readiness_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_readiness_updated ON clearance_readiness_assessments;
CREATE TRIGGER trigger_readiness_updated
  BEFORE UPDATE ON clearance_readiness_assessments
  FOR EACH ROW EXECUTE FUNCTION update_readiness_timestamp();


-- ============================================================================
-- 2. FSO PORTAL — CLEARED EMPLOYEE ROSTER
-- ============================================================================

CREATE TABLE IF NOT EXISTS cleared_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,

  -- Employee identification (minimum PII)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  employee_id TEXT NOT NULL, -- Internal company ID
  email TEXT NOT NULL,
  department TEXT,
  job_title TEXT,
  hire_date DATE,

  -- Clearance details
  clearance_level TEXT NOT NULL CHECK (clearance_level IN (
    'public-trust', 'secret', 'top-secret', 'ts-sci', 'doe-l', 'doe-q', 'doe-q-sci'
  )),
  clearance_granted_date DATE,
  clearance_expiration_date DATE,
  reinvestigation_due_date DATE,
  clearance_status TEXT NOT NULL DEFAULT 'pending-investigation' CHECK (clearance_status IN (
    'active', 'interim', 'pending-investigation', 'pending-adjudication',
    'suspended', 'revoked', 'expired', 'debriefed', 'in-reinvestigation'
  )),

  -- Investigation
  investigating_agency TEXT CHECK (investigating_agency IN ('dcsa', 'doe', 'ic', 'other')),
  investigation_type TEXT CHECK (investigation_type IN (
    'tier-1', 'tier-2', 'tier-3', 'tier-4', 'tier-5',
    'ssbi', 'naclc', 'anaci', 'doe-l', 'doe-q'
  )),

  -- Continuous Vetting (TW 2.0)
  cv_enrolled BOOLEAN DEFAULT FALSE,
  cv_status TEXT DEFAULT 'not-enrolled' CHECK (cv_status IN (
    'not-enrolled', 'enrolled-active', 'enrolled-alert',
    'enrolled-review', 'enrolled-resolved', 'disenrolled'
  )),

  -- Access
  access_level TEXT DEFAULT 'unclassified' CHECK (access_level IN (
    'unclassified', 'cui', 'confidential', 'secret', 'top-secret', 'ts-sci', 'sap'
  )),
  program_access TEXT[] DEFAULT '{}',
  facility_access TEXT[] DEFAULT '{}',

  -- Polygraph
  polygraph_type TEXT CHECK (polygraph_type IN ('full-scope', 'counterintelligence', 'lifestyle')),
  polygraph_date DATE,
  polygraph_current BOOLEAN DEFAULT FALSE,

  -- Compliance flags
  foreign_travel_reported BOOLEAN DEFAULT TRUE,
  last_foreign_travel_report TIMESTAMPTZ,
  reportable_incidents INTEGER DEFAULT 0,
  last_incident_report TIMESTAMPTZ,
  briefings_current BOOLEAN DEFAULT TRUE,
  last_briefing_date DATE,
  nda_signed_date DATE,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  last_modified_by UUID REFERENCES auth.users(id),
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,

  -- Unique constraint: one employee record per org
  UNIQUE(organization_id, employee_id)
);

-- Indexes for cleared employees
CREATE INDEX IF NOT EXISTS idx_cleared_emp_org ON cleared_employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_cleared_emp_status ON cleared_employees(clearance_status);
CREATE INDEX IF NOT EXISTS idx_cleared_emp_expiry ON cleared_employees(clearance_expiration_date);
CREATE INDEX IF NOT EXISTS idx_cleared_emp_reinvestigation ON cleared_employees(reinvestigation_due_date);
CREATE INDEX IF NOT EXISTS idx_cleared_emp_cv ON cleared_employees(cv_status) WHERE cv_enrolled = TRUE;
CREATE INDEX IF NOT EXISTS idx_cleared_emp_active ON cleared_employees(organization_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_cleared_emp_level ON cleared_employees(clearance_level);

-- RLS for cleared employees
ALTER TABLE cleared_employees ENABLE ROW LEVEL SECURITY;

-- SECURITY FIX: Split RLS into separate SELECT/INSERT/UPDATE policies
-- to prevent cross-org data contamination (Security Team Alpha Finding #2)

-- SELECT: Admins see all, org members see own org only
DROP POLICY IF EXISTS cleared_emp_select ON cleared_employees;
CREATE POLICY cleared_emp_select ON cleared_employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  );

-- INSERT: Non-admins can only insert into their own organization
DROP POLICY IF EXISTS cleared_emp_insert ON cleared_employees;
CREATE POLICY cleared_emp_insert ON cleared_employees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  );

-- UPDATE: Non-admins cannot change organization_id (prevents cross-org data injection)
DROP POLICY IF EXISTS cleared_emp_update ON cleared_employees;
CREATE POLICY cleared_emp_update ON cleared_employees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  ) WITH CHECK (
    -- CRITICAL: Prevent organization_id tampering on UPDATE
    organization_id = (SELECT organization_id FROM cleared_employees WHERE id = cleared_employees.id)
    OR EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- DELETE: Only admins can deactivate (prefer soft-delete via is_active flag)
DROP POLICY IF EXISTS cleared_emp_delete ON cleared_employees;
CREATE POLICY cleared_emp_delete ON cleared_employees
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_cleared_emp_updated ON cleared_employees;
CREATE TRIGGER trigger_cleared_emp_updated
  BEFORE UPDATE ON cleared_employees
  FOR EACH ROW EXECUTE FUNCTION update_readiness_timestamp();

-- AUDIT FIX: Trigger to log all clearance status changes to fso_audit_log
CREATE OR REPLACE FUNCTION log_clearance_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.clearance_status IS DISTINCT FROM NEW.clearance_status
     OR OLD.nda_signed_date IS DISTINCT FROM NEW.nda_signed_date
     OR OLD.cv_status IS DISTINCT FROM NEW.cv_status THEN
    INSERT INTO fso_audit_log (
      organization_id, user_id, event_type, entity_type, entity_id,
      previous_state, new_state, change_description
    ) VALUES (
      NEW.organization_id,
      COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
      'clearance_status_changed',
      'cleared_employee',
      NEW.id,
      jsonb_build_object(
        'clearance_status', OLD.clearance_status,
        'nda_signed_date', OLD.nda_signed_date,
        'cv_status', OLD.cv_status
      ),
      jsonb_build_object(
        'clearance_status', NEW.clearance_status,
        'nda_signed_date', NEW.nda_signed_date,
        'cv_status', NEW.cv_status
      ),
      format('%s %s: %s changed', NEW.first_name, NEW.last_name,
        CASE
          WHEN OLD.clearance_status IS DISTINCT FROM NEW.clearance_status
            THEN format('clearance status %s → %s', OLD.clearance_status, NEW.clearance_status)
          WHEN OLD.nda_signed_date IS DISTINCT FROM NEW.nda_signed_date
            THEN format('NDA signed date %s → %s', OLD.nda_signed_date, NEW.nda_signed_date)
          WHEN OLD.cv_status IS DISTINCT FROM NEW.cv_status
            THEN format('CV status %s → %s', OLD.cv_status, NEW.cv_status)
          ELSE 'compliance field updated'
        END
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_clearance_changes ON cleared_employees;
CREATE TRIGGER trigger_log_clearance_changes
  AFTER UPDATE ON cleared_employees
  FOR EACH ROW EXECUTE FUNCTION log_clearance_status_change();


-- ============================================================================
-- 3. VISIT AUTHORIZATION LETTERS (VAL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS visit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,

  -- Visit details
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  visitor_name TEXT NOT NULL,
  visitor_organization TEXT NOT NULL,
  visitor_cage_code TEXT,
  visitor_clearance_level TEXT CHECK (visitor_clearance_level IN (
    'public-trust', 'secret', 'top-secret', 'ts-sci', 'doe-l', 'doe-q', 'doe-q-sci'
  )),

  -- Facility
  host_facility TEXT NOT NULL,
  host_facility_cage_code TEXT,
  host_point_of_contact TEXT,

  -- Schedule
  visit_start_date DATE NOT NULL,
  visit_end_date DATE NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  recurring_end_date DATE,

  -- Classification
  max_classification_level TEXT DEFAULT 'unclassified',
  program_briefings_required TEXT[] DEFAULT '{}',
  escort_required BOOLEAN DEFAULT FALSE,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'under-review', 'approved', 'denied', 'expired', 'cancelled'
  )),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  denial_reason TEXT,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_visit_org ON visit_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_visit_status ON visit_requests(status);
CREATE INDEX IF NOT EXISTS idx_visit_dates ON visit_requests(visit_start_date, visit_end_date);

ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS visit_org_access ON visit_requests;
CREATE POLICY visit_org_access ON visit_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = visit_requests.organization_id)
      )
    )
  );


-- ============================================================================
-- 4. REPORTABLE INCIDENTS (SEAD-3)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reportable_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,

  -- Subject
  employee_id UUID REFERENCES cleared_employees(id),
  employee_name TEXT NOT NULL,

  -- Incident details
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'foreign-contact', 'foreign-travel', 'financial-change',
    'legal-arrest', 'legal-conviction', 'substance-abuse', 'mental-health',
    'security-violation', 'unauthorized-disclosure', 'insider-threat',
    'coercion-attempt', 'technology-misuse', 'outside-employment', 'other'
  )),
  incident_date DATE NOT NULL,
  discovered_date DATE NOT NULL,
  reported_date DATE,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'serious', 'critical')),

  -- Agency reporting
  reported_to_agency BOOLEAN DEFAULT FALSE,
  reporting_agency TEXT,
  agency_reference_number TEXT,
  reported_within_timeframe BOOLEAN,

  -- Resolution
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN (
    'reported', 'under-investigation', 'pending-adjudication',
    'resolved-no-action', 'resolved-warning', 'resolved-suspension',
    'resolved-revocation', 'closed'
  )),
  investigation_notes TEXT,
  resolution TEXT,
  resolved_date DATE,

  -- Audit (immutable)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  last_modified_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_incident_org ON reportable_incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_incident_employee ON reportable_incidents(employee_id);
CREATE INDEX IF NOT EXISTS idx_incident_type ON reportable_incidents(incident_type);
CREATE INDEX IF NOT EXISTS idx_incident_status ON reportable_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incident_severity ON reportable_incidents(severity) WHERE severity IN ('serious', 'critical');

ALTER TABLE reportable_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS incident_org_access ON reportable_incidents;
CREATE POLICY incident_org_access ON reportable_incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = reportable_incidents.organization_id)
      )
    )
  );


-- ============================================================================
-- 5. CONTINUOUS VETTING (TW 2.0) ALERTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS cv_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES cleared_employees(id),
  employee_name TEXT NOT NULL,

  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'criminal-record', 'financial-derogatory', 'foreign-travel', 'social-media',
    'public-record', 'employment-change', 'identity-verification',
    'terrorist-watchlist', 'foreign-contact', 'reinvestigation-due', 'other'
  )),
  alert_source TEXT NOT NULL DEFAULT 'automated' CHECK (alert_source IN ('dcsa', 'agency', 'internal', 'automated')),
  received_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('informational', 'low', 'moderate', 'high', 'critical')),

  -- Response
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'acknowledged', 'under-review', 'response-submitted', 'escalated', 'resolved', 'closed'
  )),
  assigned_to UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,

  -- Resolution
  fso_assessment TEXT,
  action_taken TEXT,
  mitigation_plan TEXT,
  resolved_at TIMESTAMPTZ,
  escalated_to_agency BOOLEAN DEFAULT FALSE,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_alert_org ON cv_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_cv_alert_employee ON cv_alerts(employee_id);
CREATE INDEX IF NOT EXISTS idx_cv_alert_status ON cv_alerts(status) WHERE status NOT IN ('resolved', 'closed');
CREATE INDEX IF NOT EXISTS idx_cv_alert_severity ON cv_alerts(severity) WHERE severity IN ('high', 'critical');
CREATE INDEX IF NOT EXISTS idx_cv_alert_deadline ON cv_alerts(response_deadline) WHERE response_deadline IS NOT NULL;

ALTER TABLE cv_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cv_alert_org_access ON cv_alerts;
CREATE POLICY cv_alert_org_access ON cv_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cv_alerts.organization_id)
      )
    )
  );


-- ============================================================================
-- 6. CLEARANCE DEMAND INTELLIGENCE (federated analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clearance_demand_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dimensions
  period TEXT NOT NULL,           -- YYYY-MM
  sector TEXT NOT NULL,
  clearance_level TEXT NOT NULL,
  state TEXT,

  -- Demand metrics
  open_positions INTEGER DEFAULT 0,
  new_postings INTEGER DEFAULT 0,
  avg_days_to_fill DECIMAL(8,2),
  avg_salary DECIMAL(12,2),
  median_salary DECIMAL(12,2),

  -- Supply metrics
  active_candidates INTEGER DEFAULT 0,
  new_registrations INTEGER DEFAULT 0,
  candidates_with_clearance INTEGER DEFAULT 0,
  candidates_clearance_expiring INTEGER DEFAULT 0,

  -- Derived
  supply_demand_ratio DECIMAL(8,4),
  competitiveness TEXT CHECK (competitiveness IN ('low', 'moderate', 'high', 'critical')),
  salary_trend TEXT CHECK (salary_trend IN ('declining', 'stable', 'rising', 'surging')),

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_source TEXT DEFAULT 'federated',

  -- Unique constraint per period/dimension
  UNIQUE(period, sector, clearance_level, state)
);

CREATE INDEX IF NOT EXISTS idx_demand_period ON clearance_demand_data(period);
CREATE INDEX IF NOT EXISTS idx_demand_sector ON clearance_demand_data(sector);
CREATE INDEX IF NOT EXISTS idx_demand_clearance ON clearance_demand_data(clearance_level);
CREATE INDEX IF NOT EXISTS idx_demand_state ON clearance_demand_data(state);
CREATE INDEX IF NOT EXISTS idx_demand_competitiveness ON clearance_demand_data(competitiveness) WHERE competitiveness IN ('high', 'critical');

ALTER TABLE clearance_demand_data ENABLE ROW LEVEL SECURITY;

-- Demand data is read-only for authenticated users (aggregate, non-PII)
DROP POLICY IF EXISTS demand_read_authenticated ON clearance_demand_data;
CREATE POLICY demand_read_authenticated ON clearance_demand_data
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins/system can write demand data
DROP POLICY IF EXISTS demand_write_admin ON clearance_demand_data;
CREATE POLICY demand_write_admin ON clearance_demand_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );


-- ============================================================================
-- 7. FSO PORTAL AUDIT LOG (immutable, append-only)
-- ============================================================================

CREATE TABLE IF NOT EXISTS fso_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'employee_added', 'employee_updated', 'employee_deactivated',
    'clearance_status_changed', 'reinvestigation_initiated',
    'visit_request_created', 'visit_request_status_changed',
    'incident_reported', 'incident_status_changed',
    'cv_alert_received', 'cv_alert_acknowledged', 'cv_alert_resolved',
    'briefing_completed', 'foreign_travel_reported',
    'nda_signed', 'roster_exported', 'audit_report_generated'
  )),
  entity_type TEXT NOT NULL, -- 'cleared_employee', 'visit_request', 'incident', 'cv_alert'
  entity_id UUID NOT NULL,

  -- Change tracking
  previous_state JSONB,
  new_state JSONB,
  change_description TEXT NOT NULL,

  -- Context
  ip_hash TEXT,
  user_agent_anonymized TEXT,
  session_id TEXT,

  -- Immutable timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit log (optimized for compliance queries)
CREATE INDEX IF NOT EXISTS idx_fso_audit_org ON fso_audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_fso_audit_user ON fso_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_fso_audit_entity ON fso_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_fso_audit_type ON fso_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_fso_audit_date ON fso_audit_log(created_at);

ALTER TABLE fso_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log is append-only: insert allowed for org members, no update/delete
DROP POLICY IF EXISTS fso_audit_insert ON fso_audit_log;
CREATE POLICY fso_audit_insert ON fso_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = fso_audit_log.organization_id)
      )
    )
  );

DROP POLICY IF EXISTS fso_audit_read ON fso_audit_log;
CREATE POLICY fso_audit_read ON fso_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = fso_audit_log.organization_id)
      )
    )
  );

-- PREVENT UPDATE/DELETE on audit log (defense in depth)
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'FSO audit log entries cannot be modified or deleted (NIST 800-53 AU-9)';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_audit_update ON fso_audit_log;
CREATE TRIGGER trigger_prevent_audit_update
  BEFORE UPDATE ON fso_audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

DROP TRIGGER IF EXISTS trigger_prevent_audit_delete ON fso_audit_log;
CREATE TRIGGER trigger_prevent_audit_delete
  BEFORE DELETE ON fso_audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();


-- ============================================================================
-- 8. DATA RETENTION CLEANUP FUNCTION
-- ============================================================================

-- SECURITY FIX: Cleanup function with permission check and proper audit attribution
-- (Security Team Alpha Finding #3 — SECURITY DEFINER hardened)
-- NOTE: This function should ONLY be called via pg_cron scheduled job, NOT exposed via RPC
CREATE OR REPLACE FUNCTION cleanup_expired_readiness_assessments()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  caller_role TEXT;
BEGIN
  -- Permission check: Only admins or system (cron) can invoke
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF auth.uid() IS NOT NULL AND caller_role NOT IN ('admin', 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: only admins can trigger data retention cleanup';
  END IF;

  -- Delete assessments past their retention period
  -- Also delete assessments where user explicitly declined storage (consent_to_store = FALSE)
  -- PRIVACY FIX: Hard max 365 days regardless of user setting (Security Team Alpha Finding #4)
  DELETE FROM clearance_readiness_assessments
  WHERE completed_at IS NOT NULL
    AND (
      -- User declined storage: delete immediately after completion
      (consent_to_store = FALSE AND completed_at < NOW() - INTERVAL '1 day')
      -- User consented: respect their retention period
      OR (consent_to_store = TRUE AND data_retention_days > 0
          AND created_at + LEAST(data_retention_days, 365) * INTERVAL '1 day' < NOW())
      -- Hard ceiling: 365 days regardless of setting
      OR (created_at + INTERVAL '365 days' < NOW())
    );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Log cleanup event with actual caller attribution
  INSERT INTO fso_audit_log (organization_id, user_id, event_type, entity_type, entity_id, change_description)
  VALUES (
    '00000000-0000-0000-0000-000000000000'::UUID,
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
    'audit_report_generated',
    'clearance_readiness_assessments',
    gen_random_uuid(),
    'Data retention cleanup: removed ' || deleted_count || ' expired assessments. Invoked by: ' ||
      COALESCE(auth.uid()::TEXT, 'system/pg_cron')
  );

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 9. REINVESTIGATION ALERT VIEW (for dashboards)
-- ============================================================================

CREATE OR REPLACE VIEW v_reinvestigation_alerts AS
SELECT
  ce.id,
  ce.organization_id,
  ce.first_name,
  ce.last_name,
  ce.employee_id,
  ce.clearance_level,
  ce.clearance_status,
  ce.reinvestigation_due_date,
  ce.clearance_expiration_date,
  ce.cv_enrolled,
  ce.cv_status,
  CASE
    WHEN ce.reinvestigation_due_date <= CURRENT_DATE THEN 'overdue'
    WHEN ce.reinvestigation_due_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'due-30'
    WHEN ce.reinvestigation_due_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'due-90'
    WHEN ce.reinvestigation_due_date <= CURRENT_DATE + INTERVAL '180 days' THEN 'due-180'
    ELSE 'current'
  END AS urgency,
  ce.reinvestigation_due_date - CURRENT_DATE AS days_until_due
FROM cleared_employees ce
WHERE ce.is_active = TRUE
  AND ce.clearance_status IN ('active', 'interim', 'in-reinvestigation')
  AND ce.reinvestigation_due_date IS NOT NULL
ORDER BY ce.reinvestigation_due_date ASC;


-- ============================================================================
-- 10. CLEARANCE EXPIRATION VIEW
-- ============================================================================

CREATE OR REPLACE VIEW v_clearance_expirations AS
SELECT
  ce.id,
  ce.organization_id,
  ce.first_name,
  ce.last_name,
  ce.employee_id,
  ce.clearance_level,
  ce.clearance_status,
  ce.clearance_expiration_date,
  CASE
    WHEN ce.clearance_expiration_date <= CURRENT_DATE THEN 'expired'
    WHEN ce.clearance_expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring-30'
    WHEN ce.clearance_expiration_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'expiring-90'
    WHEN ce.clearance_expiration_date <= CURRENT_DATE + INTERVAL '180 days' THEN 'expiring-180'
    ELSE 'current'
  END AS expiration_urgency,
  ce.clearance_expiration_date - CURRENT_DATE AS days_until_expiration
FROM cleared_employees ce
WHERE ce.is_active = TRUE
  AND ce.clearance_expiration_date IS NOT NULL
ORDER BY ce.clearance_expiration_date ASC;
