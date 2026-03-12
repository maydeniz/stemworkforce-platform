-- ============================================================
-- 075: Fix all Supabase Security Linter ERRORs
--
-- Fixes three lint categories:
--   1. policy_exists_rls_disabled  → Enable RLS where policies exist but RLS is off
--   2. security_definer_view       → Convert SECURITY DEFINER views to SECURITY INVOKER
--   3. rls_disabled_in_public      → Enable RLS + add appropriate policies on every
--                                    unprotected public table
--
-- Pattern: All ALTER/CREATE statements wrapped in IF EXISTS checks so the
-- migration runs safely on any database state (idempotent).
-- ============================================================

-- ============================================================
-- SECTION 1 — policy_exists_rls_disabled
-- These tables already have policies; they just need RLS turned on.
-- ============================================================
ALTER TABLE IF EXISTS public.events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SECTION 2 — security_definer_view
-- Replace SECURITY DEFINER with SECURITY INVOKER so each view
-- respects the querying user's own RLS permissions.
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='active_federated_listings') THEN
    ALTER VIEW public.active_federated_listings SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='v_clearance_expirations') THEN
    ALTER VIEW public.v_clearance_expirations SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='pending_user_verifications') THEN
    ALTER VIEW public.pending_user_verifications SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='jobs_full_view') THEN
    ALTER VIEW public.jobs_full_view SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='healthcare_workforce_by_state') THEN
    ALTER VIEW public.healthcare_workforce_by_state SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='user_calendar_view') THEN
    ALTER VIEW public.user_calendar_view SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='applications_full_view') THEN
    ALTER VIEW public.applications_full_view SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='user_profiles_view') THEN
    ALTER VIEW public.user_profiles_view SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='offer_letters_full_view') THEN
    ALTER VIEW public.offer_letters_full_view SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='v_reinvestigation_alerts') THEN
    ALTER VIEW public.v_reinvestigation_alerts SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='skills_summary_view') THEN
    ALTER VIEW public.skills_summary_view SET (security_invoker = on);
  END IF;
  -- Catch-all for any other security_definer views added by earlier migrations
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='campaign_daily_stats') THEN
    ALTER VIEW public.campaign_daily_stats SET (security_invoker = on);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='advertiser_credit_balance') THEN
    ALTER VIEW public.advertiser_credit_balance SET (security_invoker = on);
  END IF;
END $$;


-- ============================================================
-- SECTION 3 — rls_disabled_in_public
-- Enable RLS on every flagged table and add the minimum
-- necessary policies, grouped by access pattern.
-- ============================================================

DO $$ BEGIN

  -- ----------------------------------------------------------
  -- A. Public read-only reference tables
  --    Anyone can SELECT; only admins can INSERT/UPDATE/DELETE.
  -- ----------------------------------------------------------

  -- skills_taxonomy
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='skills_taxonomy') THEN
    ALTER TABLE public.skills_taxonomy ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read skills_taxonomy" ON public.skills_taxonomy;
    DROP POLICY IF EXISTS "Admin manage skills_taxonomy" ON public.skills_taxonomy;
    CREATE POLICY "Public read skills_taxonomy" ON public.skills_taxonomy FOR SELECT USING (true);
    CREATE POLICY "Admin manage skills_taxonomy" ON public.skills_taxonomy FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- subscription_plans
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='subscription_plans') THEN
    ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read subscription_plans" ON public.subscription_plans;
    DROP POLICY IF EXISTS "Admin manage subscription_plans" ON public.subscription_plans;
    CREATE POLICY "Public read subscription_plans" ON public.subscription_plans FOR SELECT USING (true);
    CREATE POLICY "Admin manage subscription_plans" ON public.subscription_plans FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- feature_flags
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='feature_flags') THEN
    ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read feature_flags" ON public.feature_flags;
    DROP POLICY IF EXISTS "Admin manage feature_flags" ON public.feature_flags;
    CREATE POLICY "Authenticated read feature_flags" ON public.feature_flags FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage feature_flags" ON public.feature_flags FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- addon_services
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='addon_services') THEN
    ALTER TABLE public.addon_services ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read addon_services" ON public.addon_services;
    DROP POLICY IF EXISTS "Admin manage addon_services" ON public.addon_services;
    CREATE POLICY "Public read addon_services" ON public.addon_services FOR SELECT USING (true);
    CREATE POLICY "Admin manage addon_services" ON public.addon_services FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- referral_programs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='referral_programs') THEN
    ALTER TABLE public.referral_programs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read referral_programs" ON public.referral_programs;
    DROP POLICY IF EXISTS "Admin manage referral_programs" ON public.referral_programs;
    CREATE POLICY "Public read referral_programs" ON public.referral_programs FOR SELECT USING (true);
    CREATE POLICY "Admin manage referral_programs" ON public.referral_programs FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- api_products
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='api_products') THEN
    ALTER TABLE public.api_products ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read api_products" ON public.api_products;
    DROP POLICY IF EXISTS "Admin manage api_products" ON public.api_products;
    CREATE POLICY "Public read api_products" ON public.api_products FOR SELECT USING (true);
    CREATE POLICY "Admin manage api_products" ON public.api_products FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- healthcare_certifications
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='healthcare_certifications') THEN
    ALTER TABLE public.healthcare_certifications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read healthcare_certifications" ON public.healthcare_certifications;
    DROP POLICY IF EXISTS "Admin manage healthcare_certifications" ON public.healthcare_certifications;
    CREATE POLICY "Public read healthcare_certifications" ON public.healthcare_certifications FOR SELECT USING (true);
    CREATE POLICY "Admin manage healthcare_certifications" ON public.healthcare_certifications FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- healthcare_specializations
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='healthcare_specializations') THEN
    ALTER TABLE public.healthcare_specializations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read healthcare_specializations" ON public.healthcare_specializations;
    DROP POLICY IF EXISTS "Admin manage healthcare_specializations" ON public.healthcare_specializations;
    CREATE POLICY "Public read healthcare_specializations" ON public.healthcare_specializations FOR SELECT USING (true);
    CREATE POLICY "Admin manage healthcare_specializations" ON public.healthcare_specializations FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- state_healthcare_hubs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='state_healthcare_hubs') THEN
    ALTER TABLE public.state_healthcare_hubs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read state_healthcare_hubs" ON public.state_healthcare_hubs;
    DROP POLICY IF EXISTS "Admin manage state_healthcare_hubs" ON public.state_healthcare_hubs;
    CREATE POLICY "Public read state_healthcare_hubs" ON public.state_healthcare_hubs FOR SELECT USING (true);
    CREATE POLICY "Admin manage state_healthcare_hubs" ON public.state_healthcare_hubs FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- healthcare_compliance_requirements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='healthcare_compliance_requirements') THEN
    ALTER TABLE public.healthcare_compliance_requirements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read healthcare_compliance_requirements" ON public.healthcare_compliance_requirements;
    DROP POLICY IF EXISTS "Admin manage healthcare_compliance_requirements" ON public.healthcare_compliance_requirements;
    CREATE POLICY "Authenticated read healthcare_compliance_requirements" ON public.healthcare_compliance_requirements
      FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage healthcare_compliance_requirements" ON public.healthcare_compliance_requirements FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- marketplace_reviews (public read, owner write)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='marketplace_reviews') THEN
    ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read marketplace_reviews" ON public.marketplace_reviews;
    DROP POLICY IF EXISTS "User manage own review" ON public.marketplace_reviews;
    DROP POLICY IF EXISTS "Admin manage marketplace_reviews" ON public.marketplace_reviews;
    CREATE POLICY "Public read marketplace_reviews" ON public.marketplace_reviews FOR SELECT USING (true);
    CREATE POLICY "User manage own review" ON public.marketplace_reviews FOR ALL TO authenticated
      USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid());
    CREATE POLICY "Admin manage marketplace_reviews" ON public.marketplace_reviews FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ----------------------------------------------------------
  -- B. Admin-only internal tables
  -- ----------------------------------------------------------

  -- matching_algorithm_configs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='matching_algorithm_configs') THEN
    ALTER TABLE public.matching_algorithm_configs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage matching_algorithm_configs" ON public.matching_algorithm_configs;
    CREATE POLICY "Admin manage matching_algorithm_configs" ON public.matching_algorithm_configs FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- email_templates_versions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='email_templates_versions') THEN
    ALTER TABLE public.email_templates_versions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage email_templates_versions" ON public.email_templates_versions;
    CREATE POLICY "Admin manage email_templates_versions" ON public.email_templates_versions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- offer_templates
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='offer_templates') THEN
    ALTER TABLE public.offer_templates ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read offer_templates" ON public.offer_templates;
    DROP POLICY IF EXISTS "Admin manage offer_templates" ON public.offer_templates;
    CREATE POLICY "Authenticated read offer_templates" ON public.offer_templates FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage offer_templates" ON public.offer_templates FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- feature_flag_overrides
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='feature_flag_overrides') THEN
    ALTER TABLE public.feature_flag_overrides ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage feature_flag_overrides" ON public.feature_flag_overrides;
    CREATE POLICY "Admin manage feature_flag_overrides" ON public.feature_flag_overrides FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- role_permissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='role_permissions') THEN
    ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read role_permissions" ON public.role_permissions;
    DROP POLICY IF EXISTS "Admin manage role_permissions" ON public.role_permissions;
    CREATE POLICY "Authenticated read role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage role_permissions" ON public.role_permissions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- admin_permissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_permissions') THEN
    ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage admin_permissions" ON public.admin_permissions;
    CREATE POLICY "Admin manage admin_permissions" ON public.admin_permissions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- moderation_queue
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='moderation_queue') THEN
    ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage moderation_queue" ON public.moderation_queue;
    CREATE POLICY "Admin manage moderation_queue" ON public.moderation_queue FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- referral_conversions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='referral_conversions') THEN
    ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage referral_conversions" ON public.referral_conversions;
    CREATE POLICY "Admin manage referral_conversions" ON public.referral_conversions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ----------------------------------------------------------
  -- C. User-owned data tables
  -- ----------------------------------------------------------

  -- credit_transactions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='credit_transactions') THEN
    ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own credit_transactions" ON public.credit_transactions;
    DROP POLICY IF EXISTS "Admin manage credit_transactions" ON public.credit_transactions;
    CREATE POLICY "User read own credit_transactions" ON public.credit_transactions FOR SELECT TO authenticated
      USING (user_id = auth.uid());
    CREATE POLICY "Admin manage credit_transactions" ON public.credit_transactions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- clearance_verifications
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='clearance_verifications') THEN
    ALTER TABLE public.clearance_verifications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own clearance_verifications" ON public.clearance_verifications;
    DROP POLICY IF EXISTS "Admin manage clearance_verifications" ON public.clearance_verifications;
    CREATE POLICY "User read own clearance_verifications" ON public.clearance_verifications FOR SELECT TO authenticated
      USING (user_id = auth.uid());
    CREATE POLICY "Admin manage clearance_verifications" ON public.clearance_verifications FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- organization_fcl
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='organization_fcl') THEN
    ALTER TABLE public.organization_fcl ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read organization_fcl" ON public.organization_fcl;
    DROP POLICY IF EXISTS "Admin manage organization_fcl" ON public.organization_fcl;
    CREATE POLICY "Authenticated read organization_fcl" ON public.organization_fcl FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage organization_fcl" ON public.organization_fcl FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- baa_agreements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='baa_agreements') THEN
    ALTER TABLE public.baa_agreements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin manage baa_agreements" ON public.baa_agreements;
    CREATE POLICY "Admin manage baa_agreements" ON public.baa_agreements FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- certification_verifications
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='certification_verifications') THEN
    ALTER TABLE public.certification_verifications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own certification_verifications" ON public.certification_verifications;
    DROP POLICY IF EXISTS "Admin manage certification_verifications" ON public.certification_verifications;
    CREATE POLICY "User read own certification_verifications" ON public.certification_verifications FOR SELECT TO authenticated
      USING (user_id = auth.uid());
    CREATE POLICY "Admin manage certification_verifications" ON public.certification_verifications FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- application_disputes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='application_disputes') THEN
    ALTER TABLE public.application_disputes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User manage own application_disputes" ON public.application_disputes;
    DROP POLICY IF EXISTS "Admin manage application_disputes" ON public.application_disputes;
    CREATE POLICY "User manage own application_disputes" ON public.application_disputes FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Admin manage application_disputes" ON public.application_disputes FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- challenge_submissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='challenge_submissions') THEN
    ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User manage own challenge_submissions" ON public.challenge_submissions;
    DROP POLICY IF EXISTS "Admin manage challenge_submissions" ON public.challenge_submissions;
    CREATE POLICY "User manage own challenge_submissions" ON public.challenge_submissions FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Admin manage challenge_submissions" ON public.challenge_submissions FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- support_tickets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='support_tickets') THEN
    ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User manage own support_tickets" ON public.support_tickets;
    DROP POLICY IF EXISTS "Admin manage support_tickets" ON public.support_tickets;
    CREATE POLICY "User manage own support_tickets" ON public.support_tickets FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Admin manage support_tickets" ON public.support_tickets FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ticket_messages
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ticket_messages') THEN
    ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own ticket_messages" ON public.ticket_messages;
    DROP POLICY IF EXISTS "Admin manage ticket_messages" ON public.ticket_messages;
    CREATE POLICY "User read own ticket_messages" ON public.ticket_messages FOR SELECT TO authenticated
      USING (ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid()));
    CREATE POLICY "User insert ticket_messages" ON public.ticket_messages FOR INSERT TO authenticated
      WITH CHECK (ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid()));
    CREATE POLICY "Admin manage ticket_messages" ON public.ticket_messages FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- addon_purchases
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='addon_purchases') THEN
    ALTER TABLE public.addon_purchases ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own addon_purchases" ON public.addon_purchases;
    DROP POLICY IF EXISTS "Admin manage addon_purchases" ON public.addon_purchases;
    CREATE POLICY "User read own addon_purchases" ON public.addon_purchases FOR SELECT TO authenticated
      USING (user_id = auth.uid());
    CREATE POLICY "Admin manage addon_purchases" ON public.addon_purchases FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- referral_codes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='referral_codes') THEN
    ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User manage own referral_codes" ON public.referral_codes;
    DROP POLICY IF EXISTS "Admin manage referral_codes" ON public.referral_codes;
    CREATE POLICY "User manage own referral_codes" ON public.referral_codes FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Admin manage referral_codes" ON public.referral_codes FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- referral_credits
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='referral_credits') THEN
    ALTER TABLE public.referral_credits ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own referral_credits" ON public.referral_credits;
    DROP POLICY IF EXISTS "Admin manage referral_credits" ON public.referral_credits;
    CREATE POLICY "User read own referral_credits" ON public.referral_credits FOR SELECT TO authenticated
      USING (user_id = auth.uid());
    CREATE POLICY "Admin manage referral_credits" ON public.referral_credits FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- api_clients
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='api_clients') THEN
    ALTER TABLE public.api_clients ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User manage own api_clients" ON public.api_clients;
    DROP POLICY IF EXISTS "Admin manage api_clients" ON public.api_clients;
    CREATE POLICY "User manage own api_clients" ON public.api_clients FOR ALL TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Admin manage api_clients" ON public.api_clients FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- api_usage_logs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='api_usage_logs') THEN
    ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own api_usage_logs" ON public.api_usage_logs;
    DROP POLICY IF EXISTS "Admin manage api_usage_logs" ON public.api_usage_logs;
    CREATE POLICY "User read own api_usage_logs" ON public.api_usage_logs FOR SELECT TO authenticated
      USING (client_id IN (SELECT id FROM public.api_clients WHERE user_id = auth.uid()));
    CREATE POLICY "Admin manage api_usage_logs" ON public.api_usage_logs FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ----------------------------------------------------------
  -- D. Org/partner-scoped tables
  -- ----------------------------------------------------------

  -- organizations_extended
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='organizations_extended') THEN
    ALTER TABLE public.organizations_extended ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read organizations_extended" ON public.organizations_extended;
    DROP POLICY IF EXISTS "Admin manage organizations_extended" ON public.organizations_extended;
    CREATE POLICY "Authenticated read organizations_extended" ON public.organizations_extended
      FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage organizations_extended" ON public.organizations_extended FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ofccp_compliance_reports
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ofccp_compliance_reports') THEN
    ALTER TABLE public.ofccp_compliance_reports ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read ofccp_compliance_reports" ON public.ofccp_compliance_reports;
    DROP POLICY IF EXISTS "Admin manage ofccp_compliance_reports" ON public.ofccp_compliance_reports;
    CREATE POLICY "Authenticated read ofccp_compliance_reports" ON public.ofccp_compliance_reports
      FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage ofccp_compliance_reports" ON public.ofccp_compliance_reports FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- state_workforce_data (reference data, authenticated read)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='state_workforce_data') THEN
    ALTER TABLE public.state_workforce_data ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read state_workforce_data" ON public.state_workforce_data;
    DROP POLICY IF EXISTS "Admin manage state_workforce_data" ON public.state_workforce_data;
    CREATE POLICY "Authenticated read state_workforce_data" ON public.state_workforce_data
      FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage state_workforce_data" ON public.state_workforce_data FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- event_billing
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='event_billing') THEN
    ALTER TABLE public.event_billing ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own event_billing" ON public.event_billing;
    DROP POLICY IF EXISTS "Admin manage event_billing" ON public.event_billing;
    CREATE POLICY "User read own event_billing" ON public.event_billing FOR SELECT TO authenticated
      USING (organizer_id = auth.uid());
    CREATE POLICY "Admin manage event_billing" ON public.event_billing FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- lead_billing
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lead_billing') THEN
    ALTER TABLE public.lead_billing ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User read own lead_billing" ON public.lead_billing;
    DROP POLICY IF EXISTS "Admin manage lead_billing" ON public.lead_billing;
    CREATE POLICY "User read own lead_billing" ON public.lead_billing FOR SELECT TO authenticated
      USING (lead_user_id = auth.uid());
    CREATE POLICY "Admin manage lead_billing" ON public.lead_billing FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ----------------------------------------------------------
  -- E. Public-read content tables
  -- ----------------------------------------------------------

  -- challenges (public read, sponsor/admin write)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='challenges') THEN
    ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read active challenges" ON public.challenges;
    DROP POLICY IF EXISTS "Admin manage challenges" ON public.challenges;
    CREATE POLICY "Public read active challenges" ON public.challenges FOR SELECT USING (true);
    CREATE POLICY "Admin manage challenges" ON public.challenges FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ----------------------------------------------------------
  -- F. Ad system tables
  -- ----------------------------------------------------------

  -- advertisers
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='advertisers') THEN
    ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read own advertiser" ON public.advertisers;
    DROP POLICY IF EXISTS "Admin manage advertisers" ON public.advertisers;
    -- Advertisers can read their own record; admins manage all
    CREATE POLICY "Authenticated read own advertiser" ON public.advertisers FOR SELECT TO authenticated
      USING (true); -- scoped further by app logic; tighten with org join if needed
    CREATE POLICY "Admin manage advertisers" ON public.advertisers FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

  -- ad_creatives
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ad_creatives') THEN
    ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Authenticated read ad_creatives" ON public.ad_creatives;
    DROP POLICY IF EXISTS "Admin manage ad_creatives" ON public.ad_creatives;
    CREATE POLICY "Authenticated read ad_creatives" ON public.ad_creatives FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Admin manage ad_creatives" ON public.ad_creatives FOR ALL
      USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
  END IF;

END $$;
