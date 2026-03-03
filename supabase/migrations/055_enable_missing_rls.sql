-- ============================================
-- FIX: Enable RLS on all unprotected tables
-- Safely skips any tables that don't exist yet
-- ============================================

-- Enable RLS (IF EXISTS handles missing tables silently)
ALTER TABLE IF EXISTS data_retention_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS succession_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS onboarding_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS compensation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pay_stubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payroll_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS direct_deposit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tax_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies — only created if table exists
-- ============================================

DO $$
DECLARE
  _tbl TEXT;
BEGIN

  -- data_retention_schedule
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='data_retention_schedule') THEN
    CREATE POLICY "Admin read retention schedule" ON data_retention_schedule
      FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR (auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- departments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='departments') THEN
    CREATE POLICY "Authenticated read departments" ON departments FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage departments" ON departments FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- staff_positions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='staff_positions') THEN
    CREATE POLICY "User read own position" ON staff_positions FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage positions" ON staff_positions FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- succession_plans
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='succession_plans') THEN
    CREATE POLICY "Admin manage succession" ON succession_plans FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- job_requisitions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='job_requisitions') THEN
    CREATE POLICY "Authenticated read requisitions" ON job_requisitions FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage requisitions" ON job_requisitions FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin','educator','partner'));
  END IF;

  -- candidates
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidates') THEN
    CREATE POLICY "User read own candidate" ON candidates FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage candidates" ON candidates FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- onboarding_programs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='onboarding_programs') THEN
    CREATE POLICY "Authenticated read onboarding" ON onboarding_programs FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage onboarding programs" ON onboarding_programs FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- staff_onboarding
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='staff_onboarding') THEN
    CREATE POLICY "User read own onboarding" ON staff_onboarding FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage staff onboarding" ON staff_onboarding FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- timesheets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='timesheets') THEN
    CREATE POLICY "User manage own timesheets" ON timesheets FOR ALL TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage all timesheets" ON timesheets FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- timesheet_entries
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='timesheet_entries') THEN
    CREATE POLICY "User manage own timesheet entries" ON timesheet_entries FOR ALL TO authenticated USING (timesheet_id IN (SELECT id FROM timesheets WHERE user_id = auth.uid()));
    CREATE POLICY "Admin manage all timesheet entries" ON timesheet_entries FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- leave_requests
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='leave_requests') THEN
    CREATE POLICY "User manage own leave" ON leave_requests FOR ALL TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage all leave" ON leave_requests FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- leave_balances
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='leave_balances') THEN
    CREATE POLICY "User read own leave balance" ON leave_balances FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage leave balances" ON leave_balances FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- attendance_records
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='attendance_records') THEN
    CREATE POLICY "User read own attendance" ON attendance_records FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage attendance" ON attendance_records FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- performance_goals
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='performance_goals') THEN
    CREATE POLICY "User manage own goals" ON performance_goals FOR ALL TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage all goals" ON performance_goals FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- review_cycles
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='review_cycles') THEN
    CREATE POLICY "Authenticated read review cycles" ON review_cycles FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage review cycles" ON review_cycles FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- performance_reviews
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='performance_reviews') THEN
    CREATE POLICY "User read own reviews" ON performance_reviews FOR SELECT TO authenticated USING (reviewee_id = auth.uid());
    CREATE POLICY "Admin manage reviews" ON performance_reviews FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- development_plans
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='development_plans') THEN
    CREATE POLICY "User manage own dev plans" ON development_plans FOR ALL TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage all dev plans" ON development_plans FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- compensation_records
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='compensation_records') THEN
    CREATE POLICY "User read own compensation" ON compensation_records FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage compensation" ON compensation_records FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- payroll_runs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='payroll_runs') THEN
    CREATE POLICY "Admin manage payroll runs" ON payroll_runs FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- pay_stubs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pay_stubs') THEN
    CREATE POLICY "User read own pay stubs" ON pay_stubs FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage pay stubs" ON pay_stubs FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- payroll_deductions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='payroll_deductions') THEN
    CREATE POLICY "User read own deductions" ON payroll_deductions FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage deductions" ON payroll_deductions FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- direct_deposit_accounts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='direct_deposit_accounts') THEN
    CREATE POLICY "User manage own bank accounts" ON direct_deposit_accounts FOR ALL TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage bank accounts" ON direct_deposit_accounts FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- tax_documents
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tax_documents') THEN
    CREATE POLICY "User read own tax docs" ON tax_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
    CREATE POLICY "Admin manage tax docs" ON tax_documents FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

END $$;
