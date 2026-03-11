-- ===========================================
-- Fix Enum Mismatches Between TypeScript Types and DB CHECK Constraints
-- TypeScript types are the source of truth.
-- Each section is wrapped in a DO block so it skips gracefully if the
-- table doesn't exist yet (allows running out-of-order or on a fresh DB).
-- ===========================================

-- ===========================================
-- 1. AGENCY TYPE (government_partners.agency_type)
-- ===========================================
DO $$ BEGIN
  UPDATE public.government_partners SET agency_type = 'federal_agency' WHERE agency_type = 'federal';
  UPDATE public.government_partners SET agency_type = 'state_agency' WHERE agency_type = 'state_workforce';
  UPDATE public.government_partners SET agency_type = 'education_department' WHERE agency_type = 'education';

  ALTER TABLE public.government_partners DROP CONSTRAINT IF EXISTS government_partners_agency_type_check;
  ALTER TABLE public.government_partners ADD CONSTRAINT government_partners_agency_type_check
    CHECK (agency_type IN ('workforce_board', 'federal_agency', 'state_agency', 'economic_development', 'education_department', 'labor_department', 'chips_designated', 'other'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'government_partners does not exist yet — skipping agency_type fix';
END $$;

-- ===========================================
-- 2. PARTNER TIER (government_partners.tier)
-- ===========================================
DO $$ BEGIN
  UPDATE public.government_partners SET tier = 'basic' WHERE tier = 'starter';
  UPDATE public.government_partners SET tier = 'standard' WHERE tier = 'partner';

  ALTER TABLE public.government_partners DROP CONSTRAINT IF EXISTS government_partners_tier_check;
  ALTER TABLE public.government_partners ADD CONSTRAINT government_partners_tier_check
    CHECK (tier IN ('basic', 'standard', 'enterprise'));

  ALTER TABLE public.government_partners ALTER COLUMN tier SET DEFAULT 'basic';
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'government_partners does not exist yet — skipping tier fix';
END $$;

-- ===========================================
-- 3. AGENCY LEVEL (government_partners.agency_level)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.government_partners DROP CONSTRAINT IF EXISTS government_partners_agency_level_check;
  ALTER TABLE public.government_partners ADD CONSTRAINT government_partners_agency_level_check
    CHECK (agency_level IN ('federal', 'state', 'regional', 'county', 'city', 'local'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'government_partners does not exist yet — skipping agency_level fix';
END $$;

-- ===========================================
-- 4. PROGRAM TYPE (workforce_programs.program_type)
-- ===========================================
DO $$ BEGIN
  UPDATE public.workforce_programs SET program_type = 'wioa_title_i' WHERE program_type = 'wioa';

  ALTER TABLE public.workforce_programs DROP CONSTRAINT IF EXISTS workforce_programs_program_type_check;
  ALTER TABLE public.workforce_programs ADD CONSTRAINT workforce_programs_program_type_check
    CHECK (program_type IN ('chips_act', 'wioa_title_i', 'wioa_title_ii', 'wioa_title_iii', 'wioa_title_iv', 'nsf_ate', 'dol_eta', 'state_grant', 'federal_grant', 'regional', 'cte', 'apprenticeship', 'other'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'workforce_programs does not exist yet — skipping program_type fix';
END $$;

-- ===========================================
-- 5. FUNDING SOURCE (workforce_programs.funding_source)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.workforce_programs DROP CONSTRAINT IF EXISTS workforce_programs_funding_source_check;
  ALTER TABLE public.workforce_programs ADD CONSTRAINT workforce_programs_funding_source_check
    CHECK (funding_source IN ('federal', 'state', 'regional', 'local', 'mixed', 'private', 'chips_act', 'wioa_title_i', 'wioa_title_ii', 'wioa_title_iii', 'wioa_title_iv'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'workforce_programs does not exist yet — skipping funding_source fix';
END $$;

-- ===========================================
-- 6. EMPLOYER PARTNERSHIP STATUS (employer_partnerships.status)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.employer_partnerships DROP CONSTRAINT IF EXISTS employer_partnerships_status_check;
  ALTER TABLE public.employer_partnerships ADD CONSTRAINT employer_partnerships_status_check
    CHECK (status IN ('prospecting', 'negotiating', 'pending', 'active', 'completed', 'inactive', 'expired'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'employer_partnerships does not exist yet — skipping status fix';
END $$;

-- ===========================================
-- 7. COMPLIANCE REPORT TYPE (compliance_reports.report_type)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.compliance_reports DROP CONSTRAINT IF EXISTS compliance_reports_report_type_check;
  ALTER TABLE public.compliance_reports ADD CONSTRAINT compliance_reports_report_type_check
    CHECK (report_type IN ('quarterly', 'quarterly_progress', 'annual', 'annual_performance', 'mid_year', 'final', 'financial_report', 'chips_quarterly', 'chips_annual', 'participant_outcomes', 'employer_engagement', 'audit_response', 'ad_hoc'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'compliance_reports does not exist yet — skipping report_type fix';
END $$;

-- ===========================================
-- 8. COMPLIANCE REPORT STATUS (compliance_reports.status)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.compliance_reports DROP CONSTRAINT IF EXISTS compliance_reports_status_check;
  ALTER TABLE public.compliance_reports ADD CONSTRAINT compliance_reports_status_check
    CHECK (status IN ('draft', 'not_started', 'in_review', 'in_progress', 'pending_review', 'submitted', 'accepted', 'rejected', 'revision_requested'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'compliance_reports does not exist yet — skipping report status fix';
END $$;

-- ===========================================
-- 9. STATE WORKFORCE PARTICIPANT STATUS (workforce_participants.status)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.workforce_participants DROP CONSTRAINT IF EXISTS workforce_participants_status_check;
  ALTER TABLE public.workforce_participants ADD CONSTRAINT workforce_participants_status_check
    CHECK (status IN (
      'REGISTERED', 'PENDING_ELIGIBILITY', 'ELIGIBLE', 'ENROLLED',
      'ACTIVE', 'TRAINING', 'EMPLOYED', 'EXITED',
      'FOLLOW_UP_Q1', 'FOLLOW_UP_Q2', 'FOLLOW_UP_Q3', 'FOLLOW_UP_Q4', 'CLOSED',
      'registered', 'pending_eligibility', 'eligible', 'enrolled',
      'active', 'training', 'employed', 'exited',
      'follow_up_q1', 'follow_up_q2', 'follow_up_q3', 'follow_up_q4', 'closed'
    ));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'workforce_participants does not exist yet — skipping status fix';
END $$;

-- ===========================================
-- 10. STATE WORKFORCE PROGRAM ENROLLMENTS (program_enrollments.program)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.program_enrollments DROP CONSTRAINT IF EXISTS program_enrollments_program_check;
  ALTER TABLE public.program_enrollments ADD CONSTRAINT program_enrollments_program_check
    CHECK (program IN (
      'TITLE_I_ADULT', 'TITLE_I_DISLOCATED_WORKER', 'TITLE_I_YOUTH',
      'TITLE_II_ADULT_EDUCATION', 'TITLE_III_WAGNER_PEYSER', 'TITLE_IV_VOCATIONAL_REHAB',
      'TAA', 'RESEA', 'SNAP_ET', 'TANF', 'VETERAN_SERVICES', 'REENTRY'
    ));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'program_enrollments does not exist yet — skipping program check fix';
END $$;

-- ===========================================
-- 11. PROGRAM PARTICIPANTS STATUS (program_participants.status)
-- ===========================================
DO $$ BEGIN
  ALTER TABLE public.program_participants DROP CONSTRAINT IF EXISTS program_participants_status_check;
  ALTER TABLE public.program_participants ADD CONSTRAINT program_participants_status_check
    CHECK (status IN ('enrolled', 'active', 'completed', 'placed', 'exited', 'dropped', 'withdrawn'));
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'program_participants does not exist yet — skipping status fix';
END $$;
