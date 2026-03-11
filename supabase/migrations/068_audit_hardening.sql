-- ============================================================================
-- Migration 068: Audit & Security Hardening
-- Fixes findings from multi-team co-audit (2026-03-11)
--
-- C3/C4: Wire is_clearance_domain_accessible() into actual RLS policies
--        (Migration 064 DO blocks used wrong policy names — server-side
--        circuit breaker was completely inert)
-- H7:    Make fso_audit_log.user_id nullable for system/cron events
--        (nil-UUID FK violation broke pg_cron-triggered cleanup)
-- H9:    Add INSERT RLS policy on clearance_circuit_breakers
-- H10:   Standardize breaker table admin checks to use public.users.role
-- M6:    Exclude attorney_privileged records from admin aggregate policy
-- M9:    Recreate alert views with security_barrier
-- M11:   Add audit trigger for circuit breaker INSERT (not just UPDATE)
-- L2:    Replace fragile WITH CHECK self-reference with BEFORE UPDATE trigger
-- L3:    Change consent_to_store default to FALSE (opt-in, not opt-out)
-- ============================================================================


-- ============================================================================
-- H7: Allow NULL user_id in fso_audit_log for system/cron-triggered events
-- Previously: NOT NULL FK to auth.users caused FK violations when pg_cron
-- ran cleanup functions (auth.uid() = NULL → COALESCE to nil UUID → FK fail)
-- ============================================================================

ALTER TABLE fso_audit_log
  ALTER COLUMN user_id DROP NOT NULL;

-- Update existing nil-UUID rows to NULL (cleaner representation for system events)
UPDATE fso_audit_log
  SET user_id = NULL
  WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Update cleanup function to use NULL for system events instead of nil UUID
CREATE OR REPLACE FUNCTION cleanup_expired_readiness_assessments()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  caller_role TEXT;
BEGIN
  -- Permission check: Only admins or system (cron, auth.uid() IS NULL) can invoke
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF auth.uid() IS NOT NULL AND caller_role NOT IN ('admin', 'super_admin') THEN
    RAISE EXCEPTION 'Permission denied: only admins can trigger data retention cleanup';
  END IF;

  DELETE FROM clearance_readiness_assessments
  WHERE completed_at IS NOT NULL
    AND (
      (consent_to_store = FALSE AND completed_at < NOW() - INTERVAL '1 day')
      OR (consent_to_store = TRUE AND data_retention_days > 0
          AND created_at + LEAST(data_retention_days, 365) * INTERVAL '1 day' < NOW())
      OR (created_at + INTERVAL '365 days' < NOW())
    );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- H7: Use auth.uid() directly — NULL is allowed and represents system/cron caller
  INSERT INTO fso_audit_log (organization_id, user_id, event_type, entity_type, entity_id, change_description)
  VALUES (
    '00000000-0000-0000-0000-000000000000'::UUID,
    auth.uid(),   -- NULL for cron, real UUID for manual admin invocation
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
-- L3: consent_to_store default → FALSE (affirmative opt-in required)
-- GDPR / NIST 800-53: data retention consent must be explicit, not pre-checked
-- ============================================================================

ALTER TABLE clearance_readiness_assessments
  ALTER COLUMN consent_to_store SET DEFAULT FALSE;


-- ============================================================================
-- M6: Exclude attorney-privileged records from admin aggregate SELECT policy
-- Attorney-client privilege must be absolute — even platform admins must not
-- read privileged assessment content without the attorney's explicit access
-- ============================================================================

DROP POLICY IF EXISTS readiness_admin_aggregate ON clearance_readiness_assessments;

CREATE POLICY readiness_admin_aggregate ON clearance_readiness_assessments
  FOR SELECT USING (
    -- M6: Explicitly exclude attorney-privileged records
    attorney_privileged = FALSE
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );


-- ============================================================================
-- H9 + H10: Rebuild clearance_circuit_breakers RLS policies
-- H9: Add missing INSERT policy
-- H10: Standardize role check to public.users.role (was raw_app_meta_data)
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view breaker state" ON clearance_circuit_breakers;
DROP POLICY IF EXISTS "Admins can modify breaker state" ON clearance_circuit_breakers;

CREATE POLICY "Admins can view breaker state"
  ON clearance_circuit_breakers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- H10: UPDATE policy now uses public.users.role (consistent with rest of schema)
CREATE POLICY "Admins can modify breaker state"
  ON clearance_circuit_breakers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- H9: INSERT policy was missing — admins can add new domains
CREATE POLICY "Admins can insert breaker domains"
  ON clearance_circuit_breakers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );


-- ============================================================================
-- C3/C4: Wire is_clearance_domain_accessible() into actual RLS policies
-- Migration 064 DO blocks used wrong policy names (e.g., "Org members can
-- view their cleared employees" vs the actual name "cleared_emp_select").
-- The IF EXISTS was always false → no-op → server-side breaker inert.
-- Fix: drop the correct policies by their actual names and recreate with
-- the breaker check added.
-- ============================================================================

-- cleared_employees SELECT — add circuit breaker check
DROP POLICY IF EXISTS cleared_emp_select ON cleared_employees;

CREATE POLICY cleared_emp_select ON cleared_employees
  FOR SELECT USING (
    is_clearance_domain_accessible('cleared_employees')
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  );

-- cv_alerts ALL — add circuit breaker check
DROP POLICY IF EXISTS cv_alert_org_access ON cv_alerts;

CREATE POLICY cv_alert_org_access ON cv_alerts
  FOR ALL USING (
    is_clearance_domain_accessible('cv_alerts')
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cv_alerts.organization_id)
      )
    )
  );

-- reportable_incidents ALL — add circuit breaker check
DROP POLICY IF EXISTS incident_org_access ON reportable_incidents;

CREATE POLICY incident_org_access ON reportable_incidents
  FOR ALL USING (
    is_clearance_domain_accessible('reportable_incidents')
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = reportable_incidents.organization_id)
      )
    )
  );

-- visit_requests ALL — add circuit breaker check
DROP POLICY IF EXISTS visit_org_access ON visit_requests;

CREATE POLICY visit_org_access ON visit_requests
  FOR ALL USING (
    is_clearance_domain_accessible('visit_requests')
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = visit_requests.organization_id)
      )
    )
  );

-- clearance_readiness_assessments — add circuit breaker check to own-record policy
DROP POLICY IF EXISTS readiness_own_records ON clearance_readiness_assessments;

CREATE POLICY readiness_own_records ON clearance_readiness_assessments
  FOR ALL USING (
    is_clearance_domain_accessible('clearance_readiness_assessments')
    AND auth.uid() = user_id
  );


-- ============================================================================
-- M11: Audit circuit breaker INSERTs (new domain creation was not logged)
-- The existing trigger only fires on UPDATE. Adding an AFTER INSERT trigger.
-- ============================================================================

CREATE OR REPLACE FUNCTION log_circuit_breaker_insert()
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
    '00000000-0000-0000-0000-000000000000'::uuid,
    auth.uid(),
    'circuit_breaker_changed',
    'circuit_breaker',
    NEW.id,
    NULL,
    jsonb_build_object('state', NEW.state, 'domain', NEW.domain),
    'Circuit breaker domain ' || NEW.domain || ' created with initial state: ' || NEW.state
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_circuit_breaker_insert_audit ON clearance_circuit_breakers;

CREATE TRIGGER trg_circuit_breaker_insert_audit
  AFTER INSERT ON clearance_circuit_breakers
  FOR EACH ROW
  EXECUTE FUNCTION log_circuit_breaker_insert();


-- ============================================================================
-- L2: Replace fragile WITH CHECK self-reference with BEFORE UPDATE trigger
-- The old WITH CHECK subquery re-read the same table during UPDATE which,
-- while safe in current Postgres, is unclear and hard to maintain.
-- A trigger enforcing the same constraint is explicit and testable.
-- ============================================================================

CREATE OR REPLACE FUNCTION prevent_cleared_emp_org_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.organization_id IS DISTINCT FROM OLD.organization_id THEN
    -- Only platform admins may transfer an employee record to a different org
    IF NOT EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    ) THEN
      RAISE EXCEPTION 'Cannot change organization_id on a cleared employee record (NIST 800-53 AC-3). Contact a platform admin.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_prevent_org_change ON cleared_employees;

CREATE TRIGGER trigger_prevent_org_change
  BEFORE UPDATE ON cleared_employees
  FOR EACH ROW
  EXECUTE FUNCTION prevent_cleared_emp_org_change();

-- Simplify cleared_emp_update WITH CHECK now that the trigger handles org_id lock
DROP POLICY IF EXISTS cleared_emp_update ON cleared_employees;

CREATE POLICY cleared_emp_update ON cleared_employees
  FOR UPDATE USING (
    is_clearance_domain_accessible('cleared_employees')
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  ) WITH CHECK (
    -- organization_id lock is enforced by trigger_prevent_org_change above
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'super_admin')
        OR (organization_id IS NOT NULL AND organization_id = cleared_employees.organization_id)
      )
    )
  );


-- ============================================================================
-- M9: Recreate alert views with security_barrier
-- Prevents query planner from evaluating predicates before RLS conditions,
-- which could leak rows in some edge cases.
-- ============================================================================

DROP VIEW IF EXISTS v_reinvestigation_alerts;

CREATE VIEW v_reinvestigation_alerts
  WITH (security_barrier = true)
AS
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


DROP VIEW IF EXISTS v_clearance_expirations;

CREATE VIEW v_clearance_expirations
  WITH (security_barrier = true)
AS
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


-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN fso_audit_log.user_id IS
  'NULL for system/pg_cron-generated events. NOT NULL for user-initiated events.';

COMMENT ON COLUMN clearance_readiness_assessments.consent_to_store IS
  'Affirmative opt-in consent required (default FALSE). Per GDPR Art. 7 / NIST 800-53 IP-1.';

COMMENT ON TABLE clearance_circuit_breakers IS
  'Server-side circuit breakers for clearance data domains. '
  'Combine with frontend clearanceCircuitBreaker.ts for defense-in-depth. '
  'is_clearance_domain_accessible() is wired into all clearance table RLS policies as of migration 068.';
