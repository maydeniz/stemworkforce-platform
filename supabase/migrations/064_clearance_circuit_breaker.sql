-- ============================================================================
-- CLEARANCE DATA CIRCUIT BREAKER — Server-Side Isolation
-- Migration 064: Emergency kill-switch for clearance data access
--
-- PURPOSE: Allow FSOs and admins to immediately revoke RLS access to
-- clearance data tables during a security incident, without needing
-- to modify RLS policies or restart services.
--
-- COMPLIANCE: NIST 800-53 IR-4 (Incident Handling), IR-5 (Incident Monitoring)
-- ============================================================================

-- Circuit breaker state table (admin-only)
CREATE TABLE IF NOT EXISTS clearance_circuit_breakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE CHECK (domain IN (
    'cleared_employees',
    'cv_alerts',
    'reportable_incidents',
    'clearance_readiness_assessments',
    'visit_requests',
    'clearance_demand_data'
    -- fso_audit_log is NEVER isolatable (needed for forensics)
  )),
  state TEXT NOT NULL DEFAULT 'closed' CHECK (state IN ('closed', 'open', 'half-open')),
  opened_at TIMESTAMPTZ,
  opened_by UUID REFERENCES auth.users(id),
  reason TEXT,
  resolution_notes TEXT,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize all breakers as closed
INSERT INTO clearance_circuit_breakers (domain, state)
VALUES
  ('cleared_employees', 'closed'),
  ('cv_alerts', 'closed'),
  ('reportable_incidents', 'closed'),
  ('clearance_readiness_assessments', 'closed'),
  ('visit_requests', 'closed'),
  ('clearance_demand_data', 'closed')
ON CONFLICT (domain) DO NOTHING;

-- RLS: Only admins and FSOs can read/modify breaker state
ALTER TABLE clearance_circuit_breakers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view breaker state" ON clearance_circuit_breakers;
CREATE POLICY "Admins can view breaker state"
  ON clearance_circuit_breakers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_app_meta_data->>'role' IN ('admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN')
    )
  );

DROP POLICY IF EXISTS "Admins can modify breaker state" ON clearance_circuit_breakers;
CREATE POLICY "Admins can modify breaker state"
  ON clearance_circuit_breakers FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_app_meta_data->>'role' IN ('admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN')
    )
  );

-- Function to check if a domain's breaker is open
-- Used by RLS policies on clearance tables
CREATE OR REPLACE FUNCTION is_clearance_domain_accessible(domain_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT state = 'closed' FROM clearance_circuit_breakers WHERE domain = domain_name),
    TRUE  -- If no breaker row exists, default to accessible
  );
$$;

-- Add circuit breaker check to cleared_employees RLS
-- This adds an AND condition: existing RLS + breaker must be closed
DO $$
BEGIN
  -- Drop and recreate SELECT policy with breaker check
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cleared_employees'
    AND policyname = 'Org members can view their cleared employees'
  ) THEN
    DROP POLICY "Org members can view their cleared employees" ON cleared_employees;
    CREATE POLICY "Org members can view their cleared employees"
      ON cleared_employees FOR SELECT
      USING (
        org_id = (SELECT org_id FROM user_profiles WHERE user_id = auth.uid())
        AND is_clearance_domain_accessible('cleared_employees')
      );
  END IF;
END $$;

-- Add circuit breaker check to cv_alerts RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cv_alerts'
    AND policyname = 'Org members can view their CV alerts'
  ) THEN
    DROP POLICY "Org members can view their CV alerts" ON cv_alerts;
    CREATE POLICY "Org members can view their CV alerts"
      ON cv_alerts FOR SELECT
      USING (
        org_id = (SELECT org_id FROM user_profiles WHERE user_id = auth.uid())
        AND is_clearance_domain_accessible('cv_alerts')
      );
  END IF;
END $$;

-- Add circuit breaker check to reportable_incidents RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'reportable_incidents'
    AND policyname = 'Org members can view their incidents'
  ) THEN
    DROP POLICY "Org members can view their incidents" ON reportable_incidents;
    CREATE POLICY "Org members can view their incidents"
      ON reportable_incidents FOR SELECT
      USING (
        org_id = (SELECT org_id FROM user_profiles WHERE user_id = auth.uid())
        AND is_clearance_domain_accessible('reportable_incidents')
      );
  END IF;
END $$;

-- Extend fso_audit_log event_type CHECK to include circuit breaker events
ALTER TABLE fso_audit_log DROP CONSTRAINT IF EXISTS fso_audit_log_event_type_check;
ALTER TABLE fso_audit_log ADD CONSTRAINT fso_audit_log_event_type_check CHECK (event_type IN (
  'employee_added', 'employee_updated', 'employee_deactivated',
  'clearance_status_changed', 'reinvestigation_initiated',
  'visit_request_created', 'visit_request_status_changed',
  'incident_reported', 'incident_status_changed',
  'cv_alert_received', 'cv_alert_acknowledged', 'cv_alert_resolved',
  'briefing_completed', 'foreign_travel_reported',
  'nda_signed', 'roster_exported', 'audit_report_generated',
  'circuit_breaker_tripped', 'circuit_breaker_reset', 'circuit_breaker_changed'
));

-- Log all breaker state changes to the immutable audit log
CREATE OR REPLACE FUNCTION log_circuit_breaker_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO fso_audit_log (
    organization_id,
    user_id,
    event_type,
    entity_type,
    entity_id,
    previous_state,
    new_state,
    change_description
  ) VALUES (
    COALESCE(
      (SELECT organization_id FROM cleared_employees WHERE id = NEW.id LIMIT 1),
      '00000000-0000-0000-0000-000000000000'::uuid
    ),
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
    CASE
      WHEN NEW.state = 'open' THEN 'circuit_breaker_tripped'
      WHEN NEW.state = 'closed' THEN 'circuit_breaker_reset'
      ELSE 'circuit_breaker_changed'
    END,
    'circuit_breaker',
    NEW.id,
    jsonb_build_object('state', OLD.state, 'domain', OLD.domain),
    jsonb_build_object(
      'state', NEW.state,
      'domain', NEW.domain,
      'reason', COALESCE(NEW.reason, OLD.reason),
      'resolution_notes', NEW.resolution_notes
    ),
    'Circuit breaker for ' || NEW.domain || ' changed from ' || OLD.state || ' to ' || NEW.state
      || COALESCE(' — reason: ' || NEW.reason, '')
  );

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_circuit_breaker_audit ON clearance_circuit_breakers;
CREATE TRIGGER trg_circuit_breaker_audit
  BEFORE UPDATE ON clearance_circuit_breakers
  FOR EACH ROW
  WHEN (OLD.state IS DISTINCT FROM NEW.state)
  EXECUTE FUNCTION log_circuit_breaker_change();

-- Index for fast breaker lookups
CREATE INDEX IF NOT EXISTS idx_circuit_breaker_domain_state
  ON clearance_circuit_breakers(domain, state);
