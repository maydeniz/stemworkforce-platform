-- =====================================================
-- STEMWorkforce Platform - Admin RLS Policies
-- Run this AFTER the main migrations
-- =====================================================

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin(min_level INTEGER DEFAULT 50)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments ura
        JOIN admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.hierarchy_level >= min_level
        AND ura.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check specific role
CREATE OR REPLACE FUNCTION has_role(role_names TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments ura
        JOIN admin_roles ar ON ura.role_id = ar.id
        WHERE ura.user_id = auth.uid()
        AND ar.name = ANY(role_names)
        AND ura.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check permission
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_role_assignments ura
        JOIN role_permissions rp ON ura.role_id = rp.role_id
        JOIN admin_permissions ap ON rp.permission_id = ap.id
        WHERE ura.user_id = auth.uid()
        AND ap.name = permission_name
        AND ura.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USER MANAGEMENT POLICIES
-- =====================================================

-- Users table - admins can read all, users can read own
DROP POLICY IF EXISTS users_select_policy ON users;
CREATE POLICY users_select_policy ON users
    FOR SELECT USING (
        auth.uid() = id 
        OR is_admin(50)
    );

-- Users table - admins can update any, users can update own
DROP POLICY IF EXISTS users_update_policy ON users;
CREATE POLICY users_update_policy ON users
    FOR UPDATE USING (
        auth.uid() = id 
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'SUPPORT_ADMIN'])
    );

-- =====================================================
-- ORGANIZATION POLICIES
-- =====================================================

-- Organizations - anyone can read, admins can modify
DROP POLICY IF EXISTS orgs_select_policy ON organizations;
CREATE POLICY orgs_select_policy ON organizations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS orgs_update_policy ON organizations;
CREATE POLICY orgs_update_policy ON organizations
    FOR UPDATE USING (
        has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

-- =====================================================
-- JOB MANAGEMENT POLICIES
-- =====================================================

-- Jobs - anyone can read active, admins can read all
DROP POLICY IF EXISTS jobs_select_policy ON jobs;
CREATE POLICY jobs_select_policy ON jobs
    FOR SELECT USING (
        status = 'active' 
        OR organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
        OR is_admin(50)
    );

-- Jobs - org members can create, admins can approve
DROP POLICY IF EXISTS jobs_insert_policy ON jobs;
CREATE POLICY jobs_insert_policy ON jobs
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

DROP POLICY IF EXISTS jobs_update_policy ON jobs;
CREATE POLICY jobs_update_policy ON jobs
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

-- =====================================================
-- SUBSCRIPTION & BILLING POLICIES
-- =====================================================

-- Subscription plans - anyone can read
DROP POLICY IF EXISTS plans_select_policy ON subscription_plans;
CREATE POLICY plans_select_policy ON subscription_plans
    FOR SELECT USING (true);

-- Subscription plans - only billing admins can modify
DROP POLICY IF EXISTS plans_modify_policy ON subscription_plans;
CREATE POLICY plans_modify_policy ON subscription_plans
    FOR ALL USING (
        has_role(ARRAY['SUPER_ADMIN', 'BILLING_ADMIN'])
    );

-- Subscriptions - users can see own, admins can see all
DROP POLICY IF EXISTS subs_select_policy ON subscriptions;
CREATE POLICY subs_select_policy ON subscriptions
    FOR SELECT USING (
        subscriber_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'BILLING_ADMIN'])
    );

-- Subscriptions - only billing admins can modify
DROP POLICY IF EXISTS subs_modify_policy ON subscriptions;
CREATE POLICY subs_modify_policy ON subscriptions
    FOR UPDATE USING (
        has_role(ARRAY['SUPER_ADMIN', 'BILLING_ADMIN'])
    );

-- Invoices - users can see own, admins can see all
DROP POLICY IF EXISTS invoices_select_policy ON invoices;
CREATE POLICY invoices_select_policy ON invoices
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM subscriptions WHERE subscriber_id = auth.uid()
        )
        OR has_role(ARRAY['SUPER_ADMIN', 'BILLING_ADMIN'])
    );

-- =====================================================
-- MARKETPLACE POLICIES
-- =====================================================

-- Providers - anyone can see active, admins can see all
DROP POLICY IF EXISTS providers_select_policy ON marketplace_providers;
CREATE POLICY providers_select_policy ON marketplace_providers
    FOR SELECT USING (
        status = 'active'
        OR user_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

-- Providers - user can create own, admins can modify all
DROP POLICY IF EXISTS providers_insert_policy ON marketplace_providers;
CREATE POLICY providers_insert_policy ON marketplace_providers
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

DROP POLICY IF EXISTS providers_update_policy ON marketplace_providers;
CREATE POLICY providers_update_policy ON marketplace_providers
    FOR UPDATE USING (
        user_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN'])
    );

-- Services - public read for active
DROP POLICY IF EXISTS services_select_policy ON marketplace_services;
CREATE POLICY services_select_policy ON marketplace_services
    FOR SELECT USING (
        is_active = true
        OR provider_id IN (
            SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
        )
        OR is_admin(50)
    );

-- Reviews - anyone can see approved, admins can see all
DROP POLICY IF EXISTS reviews_select_policy ON marketplace_reviews;
CREATE POLICY reviews_select_policy ON marketplace_reviews
    FOR SELECT USING (
        status = 'approved'
        OR reviewer_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'CONTENT_ADMIN'])
    );

-- Reviews - admins can moderate
DROP POLICY IF EXISTS reviews_update_policy ON marketplace_reviews;
CREATE POLICY reviews_update_policy ON marketplace_reviews
    FOR UPDATE USING (
        has_role(ARRAY['SUPER_ADMIN', 'CONTENT_ADMIN'])
    );

-- =====================================================
-- ADVERTISING POLICIES
-- =====================================================

-- Campaigns - advertisers see own, admins see all
DROP POLICY IF EXISTS campaigns_select_policy ON ad_campaigns;
CREATE POLICY campaigns_select_policy ON ad_campaigns
    FOR SELECT USING (
        advertiser_id IN (
            SELECT id FROM advertisers WHERE user_id = auth.uid()
        )
        OR has_role(ARRAY['SUPER_ADMIN', 'CONTENT_ADMIN'])
    );

-- Campaigns - admins can approve/modify
DROP POLICY IF EXISTS campaigns_update_policy ON ad_campaigns;
CREATE POLICY campaigns_update_policy ON ad_campaigns
    FOR UPDATE USING (
        advertiser_id IN (
            SELECT id FROM advertisers WHERE user_id = auth.uid()
        )
        OR has_role(ARRAY['SUPER_ADMIN', 'CONTENT_ADMIN'])
    );

-- =====================================================
-- AUDIT LOG POLICIES
-- =====================================================

-- Audit logs - only admins can read
DROP POLICY IF EXISTS audit_select_policy ON audit_logs;
CREATE POLICY audit_select_policy ON audit_logs
    FOR SELECT USING (
        has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN', 'COMPLIANCE_ADMIN'])
    );

-- Audit logs - system can insert (through functions)
DROP POLICY IF EXISTS audit_insert_policy ON audit_logs;
CREATE POLICY audit_insert_policy ON audit_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- COMPLIANCE POLICIES
-- =====================================================

-- OFCCP data - compliance admins only
DROP POLICY IF EXISTS ofccp_policy ON ofccp_self_identifications;
CREATE POLICY ofccp_policy ON ofccp_self_identifications
    FOR SELECT USING (
        user_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN'])
    );

-- Clearance data - security admins only
DROP POLICY IF EXISTS clearance_select_policy ON clearance_tracking;
CREATE POLICY clearance_select_policy ON clearance_tracking
    FOR SELECT USING (
        user_id = auth.uid()
        OR has_role(ARRAY['SUPER_ADMIN', 'SECURITY_ADMIN', 'COMPLIANCE_ADMIN'])
    );

-- HIPAA logs - compliance admins only
DROP POLICY IF EXISTS hipaa_policy ON hipaa_audit_logs;
CREATE POLICY hipaa_policy ON hipaa_audit_logs
    FOR ALL USING (
        has_role(ARRAY['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SECURITY_ADMIN'])
    );

-- =====================================================
-- ADMIN ROLE MANAGEMENT POLICIES
-- =====================================================

-- Role assignments - only super admins can manage
DROP POLICY IF EXISTS role_assignments_policy ON user_role_assignments;
CREATE POLICY role_assignments_policy ON user_role_assignments
    FOR ALL USING (
        has_role(ARRAY['SUPER_ADMIN'])
    );

-- Admin roles - anyone can read, only super admin can modify
DROP POLICY IF EXISTS admin_roles_select ON admin_roles;
CREATE POLICY admin_roles_select ON admin_roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS admin_roles_modify ON admin_roles;
CREATE POLICY admin_roles_modify ON admin_roles
    FOR ALL USING (
        has_role(ARRAY['SUPER_ADMIN'])
    );

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofccp_self_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE hipaa_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- These policies ensure:
-- 1. Users can only access their own data by default
-- 2. Admins can access data based on their role level
-- 3. Audit logs are protected and admin-only
-- 4. Compliance data has strict access controls
-- =====================================================
