-- =====================================================
-- STEMWorkforce Platform - Service Fees & Platform Settings
-- Migration: 026_service_fees_and_settings.sql
-- =====================================================

-- =====================================================
-- PART 1: SERVICE FEE CONFIGURATION
-- =====================================================

-- Service fee categories
CREATE TABLE IF NOT EXISTS service_fee_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default fee categories
INSERT INTO service_fee_categories (category_key, name, description, icon, color, display_order)
VALUES
    ('marketplace', 'Marketplace', 'Fees for service provider transactions', 'Store', 'violet', 1),
    ('events', 'Events', 'Event ticket and registration fees', 'Calendar', 'blue', 2),
    ('job_postings', 'Job Postings', 'Premium job listing and featured placement fees', 'Briefcase', 'emerald', 3),
    ('subscriptions', 'Subscriptions', 'Payment processing for subscription plans', 'CreditCard', 'amber', 4),
    ('advertising', 'Advertising', 'Sponsored content and advertising fees', 'Megaphone', 'pink', 5)
ON CONFLICT (category_key) DO NOTHING;

-- Service fee schedules (main configuration table)
CREATE TABLE IF NOT EXISTS service_fee_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES service_fee_categories(id),

    -- Fee type: 'percentage', 'fixed', 'tiered', 'hybrid'
    fee_type VARCHAR(50) NOT NULL DEFAULT 'percentage',

    -- Rate configuration
    percentage_rate DECIMAL(5,2),           -- e.g., 15.00 for 15%
    fixed_amount DECIMAL(10,2),             -- e.g., 0.30 for $0.30

    -- Fee limits
    min_fee DECIMAL(10,2),                  -- Minimum fee cap
    max_fee DECIMAL(10,2),                  -- Maximum fee cap

    -- Tiered rates (JSON for flexibility)
    tiered_rates JSONB,                     -- [{min: 0, max: 25, rate: 2.5}, ...]

    -- Applicability
    applies_to JSONB,                       -- Array of service types this applies to
    industry_codes VARCHAR(50)[],           -- Optional industry filtering

    -- Scheduling
    effective_date DATE NOT NULL,
    expiration_date DATE,

    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,             -- Higher priority takes precedence

    -- Audit
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee collection transactions
CREATE TABLE IF NOT EXISTS fee_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference to source transaction
    source_type VARCHAR(50) NOT NULL,       -- 'marketplace_booking', 'event_ticket', 'job_posting', etc.
    source_id UUID NOT NULL,
    source_reference VARCHAR(100),          -- External reference number

    -- Fee schedule used
    fee_schedule_id UUID REFERENCES service_fee_schedules(id),
    category_id UUID REFERENCES service_fee_categories(id),

    -- Amounts
    gross_amount DECIMAL(12,2) NOT NULL,    -- Original transaction amount
    fee_amount DECIMAL(12,2) NOT NULL,      -- Fee collected
    net_amount DECIMAL(12,2) NOT NULL,      -- Amount after fee

    -- Rate applied
    rate_type VARCHAR(50),                  -- 'percentage', 'fixed', 'tiered'
    rate_applied DECIMAL(5,2),              -- Actual rate used

    -- Parties
    payer_type VARCHAR(50),                 -- 'provider', 'employer', 'user'
    payer_id UUID,
    recipient_id UUID,

    -- Status
    status VARCHAR(50) DEFAULT 'collected', -- 'pending', 'collected', 'refunded', 'waived'

    -- Timestamps
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee waivers and discounts
CREATE TABLE IF NOT EXISTS fee_waivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Scope
    waiver_type VARCHAR(50) NOT NULL,       -- 'user', 'organization', 'category', 'global'
    target_id UUID,                         -- User or org ID if applicable
    category_id UUID REFERENCES service_fee_categories(id),

    -- Discount configuration
    discount_type VARCHAR(50) NOT NULL,     -- 'percentage', 'fixed', 'full'
    discount_value DECIMAL(10,2),

    -- Limits
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    max_discount_amount DECIMAL(10,2),

    -- Validity
    reason TEXT,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID,
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fee tables
CREATE INDEX IF NOT EXISTS idx_fee_schedules_category ON service_fee_schedules(category_id);
CREATE INDEX IF NOT EXISTS idx_fee_schedules_active ON service_fee_schedules(is_active, effective_date);
CREATE INDEX IF NOT EXISTS idx_fee_collections_source ON fee_collections(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_fee_collections_date ON fee_collections(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_fee_collections_category ON fee_collections(category_id);
CREATE INDEX IF NOT EXISTS idx_fee_waivers_target ON fee_waivers(waiver_type, target_id);

-- =====================================================
-- PART 2: PLATFORM SETTINGS
-- =====================================================

-- Platform general settings
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Setting identification
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_group VARCHAR(100) NOT NULL,    -- 'general', 'security', 'integrations', 'branding', 'developer'

    -- Value storage (JSONB for flexibility)
    value JSONB NOT NULL,
    default_value JSONB,

    -- Metadata
    display_name VARCHAR(255),
    description TEXT,
    data_type VARCHAR(50),                  -- 'string', 'boolean', 'number', 'json', 'encrypted'
    is_sensitive BOOLEAN DEFAULT false,     -- If true, value is encrypted
    is_readonly BOOLEAN DEFAULT false,

    -- Validation
    validation_rules JSONB,                 -- {min, max, pattern, options, etc.}

    -- Audit
    last_modified_by UUID,
    last_modified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_group, value, default_value, display_name, description, data_type)
VALUES
    -- General Settings
    ('platform_name', 'general', '"STEMWorkforce"', '"STEMWorkforce"', 'Platform Name', 'Name of the platform', 'string'),
    ('support_email', 'general', '"support@stemworkforce.com"', '"support@stemworkforce.com"', 'Support Email', 'Primary support email address', 'string'),
    ('default_timezone', 'general', '"America/New_York"', '"America/New_York"', 'Default Timezone', 'Platform default timezone', 'string'),
    ('default_language', 'general', '"en"', '"en"', 'Default Language', 'Platform default language', 'string'),
    ('session_timeout_minutes', 'general', '30', '30', 'Session Timeout', 'User session timeout in minutes', 'number'),

    -- Security Settings
    ('password_min_length', 'security', '12', '12', 'Minimum Password Length', 'Minimum required password length', 'number'),
    ('password_require_uppercase', 'security', 'true', 'true', 'Require Uppercase', 'Require at least one uppercase letter', 'boolean'),
    ('password_require_lowercase', 'security', 'true', 'true', 'Require Lowercase', 'Require at least one lowercase letter', 'boolean'),
    ('password_require_numbers', 'security', 'true', 'true', 'Require Numbers', 'Require at least one number', 'boolean'),
    ('password_require_special', 'security', 'true', 'true', 'Require Special Characters', 'Require at least one special character', 'boolean'),
    ('password_expiry_days', 'security', '90', '90', 'Password Expiry', 'Days until password expires', 'number'),
    ('max_failed_logins', 'security', '5', '5', 'Max Failed Logins', 'Max login attempts before lockout', 'number'),
    ('lockout_duration_minutes', 'security', '30', '30', 'Lockout Duration', 'Account lockout duration in minutes', 'number'),
    ('mfa_required_admins', 'security', 'true', 'true', 'MFA Required for Admins', 'Require MFA for admin accounts', 'boolean'),
    ('mfa_required_employers', 'security', 'false', 'false', 'MFA Required for Employers', 'Require MFA for employer accounts', 'boolean'),

    -- Feature Settings
    ('registration_enabled', 'features', 'true', 'true', 'User Registration', 'Allow new user registrations', 'boolean'),
    ('job_approval_required', 'features', 'true', 'true', 'Job Approval Required', 'Require admin approval for job postings', 'boolean'),
    ('provider_approval_required', 'features', 'true', 'true', 'Provider Approval Required', 'Require admin approval for service providers', 'boolean'),
    ('public_job_listings', 'features', 'false', 'false', 'Public Job Listings', 'Show job listings without login', 'boolean'),

    -- Notification Settings
    ('email_notifications_enabled', 'notifications', 'true', 'true', 'Email Notifications', 'Enable email notifications', 'boolean'),
    ('sms_notifications_enabled', 'notifications', 'false', 'false', 'SMS Notifications', 'Enable SMS notifications', 'boolean'),
    ('admin_digest_frequency', 'notifications', '"daily"', '"daily"', 'Admin Digest Frequency', 'Frequency of admin digest emails', 'string'),

    -- Maintenance Settings
    ('maintenance_mode', 'maintenance', 'false', 'false', 'Maintenance Mode', 'Enable platform maintenance mode', 'boolean'),
    ('maintenance_message', 'maintenance', '""', '""', 'Maintenance Message', 'Message shown during maintenance', 'string')
ON CONFLICT (setting_key) DO NOTHING;

-- Integration credentials (encrypted storage)
CREATE TABLE IF NOT EXISTS integration_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Integration identification
    integration_key VARCHAR(100) UNIQUE NOT NULL,
    integration_name VARCHAR(255) NOT NULL,
    integration_type VARCHAR(50),           -- 'payment', 'email', 'storage', 'analytics', 'auth'

    -- Credentials (encrypted)
    credentials_encrypted BYTEA,            -- Encrypted JSON of credentials

    -- Configuration
    environment VARCHAR(50) DEFAULT 'production',  -- 'production', 'test', 'development'
    config JSONB,                           -- Non-sensitive configuration

    -- Status
    status VARCHAR(50) DEFAULT 'disconnected',  -- 'connected', 'disconnected', 'error'
    last_health_check TIMESTAMPTZ,
    last_error TEXT,

    -- Audit
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default integrations
INSERT INTO integration_credentials (integration_key, integration_name, integration_type, status)
VALUES
    ('stripe', 'Stripe', 'payment', 'disconnected'),
    ('sendgrid', 'SendGrid', 'email', 'disconnected'),
    ('aws_s3', 'AWS S3', 'storage', 'disconnected'),
    ('twilio', 'Twilio', 'sms', 'disconnected'),
    ('slack', 'Slack', 'notifications', 'disconnected'),
    ('google_oauth', 'Google OAuth', 'auth', 'disconnected'),
    ('linkedin_oauth', 'LinkedIn OAuth', 'auth', 'disconnected')
ON CONFLICT (integration_key) DO NOTHING;

-- Branding settings
CREATE TABLE IF NOT EXISTS platform_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Logo/Images
    logo_url TEXT,
    logo_dark_url TEXT,
    favicon_url TEXT,
    og_image_url TEXT,

    -- Colors
    primary_color VARCHAR(50) DEFAULT '#10b981',
    secondary_color VARCHAR(50) DEFAULT '#14b8a6',
    accent_color VARCHAR(50) DEFAULT '#f97316',
    success_color VARCHAR(50) DEFAULT '#22c55e',
    warning_color VARCHAR(50) DEFAULT '#f59e0b',
    error_color VARCHAR(50) DEFAULT '#ef4444',

    -- Typography
    font_family VARCHAR(255) DEFAULT 'Inter, system-ui, sans-serif',
    heading_font_family VARCHAR(255),

    -- Custom domain
    custom_domain VARCHAR(255),
    custom_domain_verified BOOLEAN DEFAULT false,
    custom_domain_verified_at TIMESTAMPTZ,

    -- Footer/legal
    copyright_text VARCHAR(255),
    privacy_policy_url TEXT,
    terms_of_service_url TEXT,

    -- Social links
    social_links JSONB,

    -- Audit
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default branding
INSERT INTO platform_branding (id, primary_color, secondary_color, accent_color, copyright_text)
VALUES (gen_random_uuid(), '#10b981', '#14b8a6', '#f97316', '© 2025 STEMWorkforce. All rights reserved.')
ON CONFLICT DO NOTHING;

-- API keys for developers
CREATE TABLE IF NOT EXISTS developer_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Key identification
    name VARCHAR(255) NOT NULL,
    description TEXT,
    key_prefix VARCHAR(20) NOT NULL,        -- e.g., 'sk_prod_', 'sk_dev_'
    key_hash VARCHAR(255) NOT NULL,         -- Hashed API key
    key_hint VARCHAR(20),                   -- Last 4 characters for identification

    -- Scope
    organization_id UUID,                   -- NULL = platform-wide
    user_id UUID,                           -- Creator/owner
    environment VARCHAR(50) DEFAULT 'production',

    -- Permissions
    scopes JSONB,                           -- Array of permitted scopes

    -- Rate limiting
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,

    -- Usage tracking
    last_used_at TIMESTAMPTZ,
    usage_count BIGINT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    revoke_reason TEXT,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings change audit log
CREATE TABLE IF NOT EXISTS settings_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What changed
    setting_table VARCHAR(100) NOT NULL,    -- 'platform_settings', 'platform_branding', etc.
    setting_key VARCHAR(100),

    -- Change details
    old_value JSONB,
    new_value JSONB,
    change_type VARCHAR(50),                -- 'create', 'update', 'delete'

    -- Actor
    changed_by UUID,
    changed_by_email VARCHAR(255),

    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for settings tables
CREATE INDEX IF NOT EXISTS idx_platform_settings_group ON platform_settings(setting_group);
CREATE INDEX IF NOT EXISTS idx_integration_credentials_type ON integration_credentials(integration_type);
CREATE INDEX IF NOT EXISTS idx_developer_api_keys_user ON developer_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_api_keys_org ON developer_api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_table ON settings_audit_log(setting_table, created_at DESC);

-- =====================================================
-- PART 3: PROVIDER VERIFICATION WORKFLOW
-- =====================================================

-- Provider verification steps
CREATE TABLE IF NOT EXISTS provider_verification_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    step_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    verification_type VARCHAR(50),          -- 'document', 'check', 'manual_review'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default verification steps
INSERT INTO provider_verification_steps (step_key, name, description, step_order, is_required, verification_type)
VALUES
    ('identity', 'Identity Verification', 'Verify provider identity with government ID', 1, true, 'document'),
    ('credentials', 'Credential Verification', 'Verify professional credentials and certifications', 2, true, 'document'),
    ('background', 'Background Check', 'Run background check through verification partner', 3, true, 'check'),
    ('references', 'Reference Check', 'Contact and verify professional references', 4, false, 'manual_review'),
    ('interview', 'Platform Interview', 'Complete onboarding interview with platform staff', 5, false, 'manual_review'),
    ('agreement', 'Provider Agreement', 'Sign provider terms and conditions', 6, true, 'document')
ON CONFLICT (step_key) DO NOTHING;

-- Provider verification status
CREATE TABLE IF NOT EXISTS provider_verification_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    step_id UUID REFERENCES provider_verification_steps(id),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'in_progress', 'approved', 'rejected', 'waived'

    -- Documents/evidence
    document_urls JSONB,
    notes TEXT,

    -- Review
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,

    -- Timestamps
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider_id, step_id)
);

-- =====================================================
-- PART 4: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE service_fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_fee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_verification_status ENABLE ROW LEVEL SECURITY;

-- Fee categories - readable by all admins
CREATE POLICY fee_categories_read ON service_fee_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = true
        )
    );

-- Fee schedules - manageable by billing/platform admins
CREATE POLICY fee_schedules_access ON service_fee_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'BILLING_ADMIN')
            AND ura.is_active = true
        )
    );

-- Fee collections - readable by billing admins
CREATE POLICY fee_collections_read ON fee_collections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'BILLING_ADMIN')
            AND ura.is_active = true
        )
    );

-- Platform settings - readable by all admins, modifiable by platform admins
CREATE POLICY platform_settings_read ON platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = true
        )
    );

CREATE POLICY platform_settings_modify ON platform_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
    );

-- Integration credentials - only super admins
CREATE POLICY integration_credentials_access ON integration_credentials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name = 'SUPER_ADMIN'
            AND ura.is_active = true
        )
    );

-- Branding - modifiable by platform admins
CREATE POLICY platform_branding_access ON platform_branding
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
    );

-- API keys - users can manage their own, admins can see all
CREATE POLICY developer_api_keys_own ON developer_api_keys
    FOR ALL USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
    );

-- Settings audit - only super admins
CREATE POLICY settings_audit_log_read ON settings_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name = 'SUPER_ADMIN'
            AND ura.is_active = true
        )
    );

-- Provider verification - admins can manage
CREATE POLICY provider_verification_access ON provider_verification_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
            AND ura.is_active = true
        )
        OR provider_id IN (
            SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- PART 5: HELPER FUNCTIONS
-- =====================================================

-- Function to calculate fee for a transaction
CREATE OR REPLACE FUNCTION calculate_service_fee(
    p_category_key VARCHAR(50),
    p_gross_amount DECIMAL(12,2),
    p_payer_id UUID DEFAULT NULL
)
RETURNS TABLE(
    fee_schedule_id UUID,
    fee_amount DECIMAL(12,2),
    rate_type VARCHAR(50),
    rate_applied DECIMAL(5,2)
) AS $$
DECLARE
    v_schedule RECORD;
    v_fee DECIMAL(12,2);
    v_rate DECIMAL(5,2);
    v_waiver RECORD;
BEGIN
    -- Get applicable fee schedule
    SELECT sfs.* INTO v_schedule
    FROM service_fee_schedules sfs
    JOIN service_fee_categories sfc ON sfs.category_id = sfc.id
    WHERE sfc.category_key = p_category_key
    AND sfs.is_active = true
    AND sfs.effective_date <= CURRENT_DATE
    AND (sfs.expiration_date IS NULL OR sfs.expiration_date > CURRENT_DATE)
    ORDER BY sfs.priority DESC, sfs.effective_date DESC
    LIMIT 1;

    IF v_schedule IS NULL THEN
        RETURN;
    END IF;

    -- Calculate base fee
    IF v_schedule.fee_type = 'percentage' THEN
        v_fee := p_gross_amount * (v_schedule.percentage_rate / 100);
        v_rate := v_schedule.percentage_rate;
        IF v_schedule.fixed_amount IS NOT NULL THEN
            v_fee := v_fee + v_schedule.fixed_amount;
        END IF;
    ELSIF v_schedule.fee_type = 'fixed' THEN
        v_fee := v_schedule.fixed_amount;
        v_rate := NULL;
    ELSIF v_schedule.fee_type = 'tiered' AND v_schedule.tiered_rates IS NOT NULL THEN
        SELECT (tier->>'rate')::DECIMAL INTO v_rate
        FROM jsonb_array_elements(v_schedule.tiered_rates) AS tier
        WHERE p_gross_amount >= (tier->>'min')::DECIMAL
        AND p_gross_amount <= (tier->>'max')::DECIMAL
        LIMIT 1;
        v_fee := p_gross_amount * (COALESCE(v_rate, 0) / 100);
    ELSE
        v_fee := 0;
    END IF;

    -- Apply min/max caps
    IF v_schedule.min_fee IS NOT NULL AND v_fee < v_schedule.min_fee THEN
        v_fee := v_schedule.min_fee;
    END IF;
    IF v_schedule.max_fee IS NOT NULL AND v_fee > v_schedule.max_fee THEN
        v_fee := v_schedule.max_fee;
    END IF;

    -- Check for waivers
    IF p_payer_id IS NOT NULL THEN
        SELECT * INTO v_waiver
        FROM fee_waivers fw
        WHERE fw.is_active = true
        AND (fw.valid_until IS NULL OR fw.valid_until > NOW())
        AND (fw.max_uses IS NULL OR fw.uses_count < fw.max_uses)
        AND (
            (fw.waiver_type = 'user' AND fw.target_id = p_payer_id)
            OR (fw.waiver_type = 'category' AND fw.category_id = v_schedule.category_id)
            OR fw.waiver_type = 'global'
        )
        ORDER BY
            CASE fw.discount_type WHEN 'full' THEN 1 ELSE 2 END,
            fw.discount_value DESC
        LIMIT 1;

        IF v_waiver IS NOT NULL THEN
            IF v_waiver.discount_type = 'full' THEN
                v_fee := 0;
            ELSIF v_waiver.discount_type = 'percentage' THEN
                v_fee := v_fee * (1 - v_waiver.discount_value / 100);
            ELSIF v_waiver.discount_type = 'fixed' THEN
                v_fee := GREATEST(0, v_fee - v_waiver.discount_value);
            END IF;
        END IF;
    END IF;

    RETURN QUERY SELECT v_schedule.id, ROUND(v_fee, 2), v_schedule.fee_type, v_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log settings changes
CREATE OR REPLACE FUNCTION log_settings_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO settings_audit_log (
        setting_table,
        setting_key,
        old_value,
        new_value,
        change_type,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        CASE
            WHEN TG_TABLE_NAME = 'platform_settings' THEN NEW.setting_key
            ELSE NEW.id::TEXT
        END,
        CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        to_jsonb(NEW),
        TG_OP,
        auth.uid()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for settings audit
DROP TRIGGER IF EXISTS trigger_platform_settings_audit ON platform_settings;
CREATE TRIGGER trigger_platform_settings_audit
    AFTER INSERT OR UPDATE ON platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_change();

DROP TRIGGER IF EXISTS trigger_platform_branding_audit ON platform_branding;
CREATE TRIGGER trigger_platform_branding_audit
    AFTER INSERT OR UPDATE ON platform_branding
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_change();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- New Tables Created:
--   - service_fee_categories (fee category definitions)
--   - service_fee_schedules (fee rate configurations)
--   - fee_collections (fee transaction history)
--   - fee_waivers (discounts and exemptions)
--   - platform_settings (key-value settings storage)
--   - integration_credentials (encrypted integration configs)
--   - platform_branding (visual customization)
--   - developer_api_keys (API key management)
--   - settings_audit_log (change tracking)
--   - provider_verification_steps (verification workflow)
--   - provider_verification_status (provider verification progress)
--
-- New Functions:
--   - calculate_service_fee() - Calculate fee for transactions
--   - log_settings_change() - Audit trigger for settings
-- =====================================================
