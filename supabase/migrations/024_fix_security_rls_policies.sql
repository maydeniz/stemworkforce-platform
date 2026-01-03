-- =====================================================
-- SECURITY FIX: Replace overly permissive RLS policies
-- Migration: 024_fix_security_rls_policies.sql
-- Date: 2026-01-03
--
-- CRITICAL: The original policies in migration 016 used
-- USING (true) which allows ANY authenticated user to
-- access sensitive security and compliance data.
-- This migration fixes those policies to use proper
-- role-based access control.
-- =====================================================

-- Drop the insecure policies first
DROP POLICY IF EXISTS admin_sessions_policy ON user_sessions;
DROP POLICY IF EXISTS admin_failed_logins_policy ON failed_login_attempts;
DROP POLICY IF EXISTS admin_lockouts_policy ON account_lockouts;
DROP POLICY IF EXISTS admin_ip_rules_policy ON ip_access_rules;
DROP POLICY IF EXISTS admin_rate_limits_policy ON rate_limit_configs;
DROP POLICY IF EXISTS admin_security_headers_policy ON security_headers_config;
DROP POLICY IF EXISTS admin_dsr_policy ON data_subject_requests;
DROP POLICY IF EXISTS admin_dsr_activity_policy ON dsr_activity_log;
DROP POLICY IF EXISTS admin_ccpa_policy ON ccpa_consumer_rights;
DROP POLICY IF EXISTS admin_retention_policy ON data_retention_policies;
DROP POLICY IF EXISTS admin_consent_categories_policy ON consent_categories;
DROP POLICY IF EXISTS admin_user_consents_policy ON user_consents;
DROP POLICY IF EXISTS admin_dpa_policy ON data_processing_agreements;
DROP POLICY IF EXISTS admin_phi_roles_policy ON phi_access_roles;
DROP POLICY IF EXISTS admin_phi_overrides_policy ON phi_access_overrides;
DROP POLICY IF EXISTS admin_breach_policy ON hipaa_breach_incidents;
DROP POLICY IF EXISTS admin_training_policy ON hipaa_training_records;
DROP POLICY IF EXISTS admin_review_campaigns_policy ON access_review_campaigns;
DROP POLICY IF EXISTS admin_review_items_policy ON access_review_items;
DROP POLICY IF EXISTS admin_changes_policy ON change_requests;
DROP POLICY IF EXISTS admin_incidents_policy ON security_incidents;
DROP POLICY IF EXISTS admin_vendors_policy ON vendors;
DROP POLICY IF EXISTS admin_vendor_assessments_policy ON vendor_risk_assessments;
DROP POLICY IF EXISTS admin_announcements_policy ON platform_announcements;
DROP POLICY IF EXISTS admin_announcement_interactions_policy ON announcement_interactions;
DROP POLICY IF EXISTS admin_partner_comms_policy ON partner_communications;
DROP POLICY IF EXISTS admin_content_policy ON platform_content;
DROP POLICY IF EXISTS admin_content_versions_policy ON platform_content_versions;
DROP POLICY IF EXISTS admin_banners_policy ON site_banners;

-- =====================================================
-- SECURITY CENTER POLICIES
-- Only SUPER_ADMIN and SECURITY_ADMIN can access
-- =====================================================

-- User sessions - highly sensitive
CREATE POLICY secure_sessions_policy ON user_sessions
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- Failed login attempts - security data
CREATE POLICY secure_failed_logins_policy ON failed_login_attempts
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- Account lockouts
CREATE POLICY secure_lockouts_policy ON account_lockouts
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- IP access rules
CREATE POLICY secure_ip_rules_policy ON ip_access_rules
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- Rate limit configurations
CREATE POLICY secure_rate_limits_policy ON rate_limit_configs
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- Security headers configuration
CREATE POLICY secure_security_headers_policy ON security_headers_config
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN']));

-- =====================================================
-- PRIVACY & COMPLIANCE POLICIES
-- SUPER_ADMIN, COMPLIANCE_ADMIN, PRIVACY_OFFICER
-- =====================================================

-- Data subject requests (GDPR) - highly sensitive PII
CREATE POLICY secure_dsr_policy ON data_subject_requests
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'PRIVACY_OFFICER']));

-- DSR activity log
CREATE POLICY secure_dsr_activity_policy ON dsr_activity_log
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'PRIVACY_OFFICER']));

-- CCPA consumer rights
CREATE POLICY secure_ccpa_policy ON ccpa_consumer_rights
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'PRIVACY_OFFICER']));

-- Data retention policies
CREATE POLICY secure_retention_policy ON data_retention_policies
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN']));

-- Consent categories - can be viewed by more roles
CREATE POLICY secure_consent_categories_policy ON consent_categories
    FOR SELECT TO authenticated
    USING (true);  -- Read-only for all authenticated users

CREATE POLICY secure_consent_categories_admin_policy ON consent_categories
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN']));

-- User consents - users can view/manage their own
CREATE POLICY secure_user_consents_own_policy ON user_consents
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY secure_user_consents_admin_policy ON user_consents
    FOR SELECT TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'PRIVACY_OFFICER']));

-- Data processing agreements
CREATE POLICY secure_dpa_policy ON data_processing_agreements
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'LEGAL_ADMIN']));

-- =====================================================
-- HIPAA POLICIES
-- Restricted to HIPAA-trained personnel only
-- =====================================================

-- PHI access roles
CREATE POLICY secure_phi_roles_policy ON phi_access_roles
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'HIPAA_OFFICER']));

-- PHI access overrides - very sensitive
CREATE POLICY secure_phi_overrides_policy ON phi_access_overrides
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'HIPAA_OFFICER']));

-- HIPAA breach incidents - critical security data
CREATE POLICY secure_breach_policy ON hipaa_breach_incidents
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'HIPAA_OFFICER', 'SECURITY_ADMIN']));

-- HIPAA training records - users can view their own
CREATE POLICY secure_training_own_policy ON hipaa_training_records
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY secure_training_admin_policy ON hipaa_training_records
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'HR_ADMIN']));

-- =====================================================
-- SOC 2 / AUDIT POLICIES
-- =====================================================

-- Access review campaigns
CREATE POLICY secure_review_campaigns_policy ON access_review_campaigns
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN', 'COMPLIANCE_ADMIN']));

-- Access review items
CREATE POLICY secure_review_items_policy ON access_review_items
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN', 'COMPLIANCE_ADMIN']));

-- Change requests - broader access for viewing
CREATE POLICY secure_changes_view_policy ON change_requests
    FOR SELECT TO authenticated
    USING (
        requested_by = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'SECURITY_ADMIN'])
    );

CREATE POLICY secure_changes_manage_policy ON change_requests
    FOR INSERT TO authenticated
    USING (true);  -- Any authenticated user can create change requests

CREATE POLICY secure_changes_admin_policy ON change_requests
    FOR UPDATE TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN']));

-- Security incidents
CREATE POLICY secure_incidents_policy ON security_incidents
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN', 'INCIDENT_MANAGER']));

-- Vendors
CREATE POLICY secure_vendors_policy ON vendors
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'PROCUREMENT_ADMIN']));

-- Vendor risk assessments
CREATE POLICY secure_vendor_assessments_policy ON vendor_risk_assessments
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SECURITY_ADMIN']));

-- =====================================================
-- COMMUNICATIONS & CONTENT POLICIES
-- More permissive for viewing, restricted for editing
-- =====================================================

-- Platform announcements - viewable by all, editable by admins
CREATE POLICY secure_announcements_view_policy ON platform_announcements
    FOR SELECT TO authenticated
    USING (
        status = 'published'
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN'])
    );

CREATE POLICY secure_announcements_manage_policy ON platform_announcements
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN']));

-- Announcement interactions - users can manage their own
CREATE POLICY secure_announcement_interactions_own_policy ON announcement_interactions
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY secure_announcement_interactions_admin_policy ON announcement_interactions
    FOR SELECT TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN']));

-- Partner communications
CREATE POLICY secure_partner_comms_policy ON partner_communications
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'COMMUNICATIONS_ADMIN', 'PARTNER_MANAGER']));

-- Platform content - viewable by all when published
CREATE POLICY secure_content_view_policy ON platform_content
    FOR SELECT TO authenticated
    USING (
        status = 'published'
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

CREATE POLICY secure_content_manage_policy ON platform_content
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN']));

-- Platform content versions
CREATE POLICY secure_content_versions_policy ON platform_content_versions
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN']));

-- Site banners - viewable by all when active
CREATE POLICY secure_banners_view_policy ON site_banners
    FOR SELECT TO authenticated
    USING (
        is_active = true
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

CREATE POLICY secure_banners_manage_policy ON site_banners
    FOR ALL TO authenticated
    USING (has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN']));

-- =====================================================
-- COMPLETION
-- =====================================================
-- All 28+ overly permissive policies have been replaced
-- with proper role-based access control policies.
--
-- Key changes:
-- 1. Security data: Only SUPER_ADMIN and SECURITY_ADMIN
-- 2. Compliance data: SUPER_ADMIN, COMPLIANCE_ADMIN, PRIVACY_OFFICER
-- 3. HIPAA data: SUPER_ADMIN, HIPAA_OFFICER (very restricted)
-- 4. Content: Viewable by all when published, editable by admins
-- 5. User data: Users can access their own records
-- =====================================================
