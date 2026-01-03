-- =====================================================
-- STEMWorkforce Platform - Admin Security & Compliance
-- Comprehensive migration for all 6 phases
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PHASE 1: SECURITY CENTER TABLES
-- =====================================================

-- User sessions tracking (OWASP Session Management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_token_hash VARCHAR(64) NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    geo_location JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    revoke_reason VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token_hash);

-- Failed login attempts (Brute Force Protection)
CREATE TABLE IF NOT EXISTS failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    user_id UUID,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    failure_reason VARCHAR(50),
    geo_location JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failed_login_email ON failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_ip ON failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_time ON failed_login_attempts(created_at);

-- Account lockouts
CREATE TABLE IF NOT EXISTS account_lockouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email VARCHAR(255) NOT NULL,
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    unlock_at TIMESTAMPTZ,
    unlock_reason VARCHAR(100),
    unlocked_by UUID,
    unlocked_at TIMESTAMPTZ,
    lockout_count INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_lockouts_email ON account_lockouts(email);
CREATE INDEX IF NOT EXISTS idx_lockouts_active ON account_lockouts(email) WHERE unlocked_at IS NULL;

-- IP access rules (Allowlist/Blocklist)
CREATE TABLE IF NOT EXISTS ip_access_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('allow', 'block')),
    ip_pattern VARCHAR(50) NOT NULL,
    description TEXT,
    applies_to VARCHAR(50) DEFAULT 'all' CHECK (applies_to IN ('all', 'admin', 'api', 'public')),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_ip_rules_active ON ip_access_rules(is_active) WHERE is_active = true;

-- Rate limit configurations
CREATE TABLE IF NOT EXISTS rate_limit_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint_pattern VARCHAR(255) NOT NULL,
    user_tier VARCHAR(50) DEFAULT 'default',
    requests_per_minute INTEGER DEFAULT 60,
    requests_per_hour INTEGER DEFAULT 1000,
    requests_per_day INTEGER DEFAULT 10000,
    burst_limit INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limit events log
CREATE TABLE IF NOT EXISTS rate_limit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    ip_address VARCHAR(45),
    endpoint VARCHAR(255),
    limit_type VARCHAR(20),
    blocked_at TIMESTAMPTZ DEFAULT NOW(),
    request_count INTEGER
);

CREATE INDEX IF NOT EXISTS idx_rate_events_time ON rate_limit_events(blocked_at);

-- Security headers configuration
CREATE TABLE IF NOT EXISTS security_headers_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    header_name VARCHAR(100) NOT NULL,
    header_value TEXT NOT NULL,
    environment VARCHAR(20) DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
    is_active BOOLEAN DEFAULT true,
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(header_name, environment)
);

-- =====================================================
-- PHASE 2: PRIVACY & COMPLIANCE TABLES
-- =====================================================

-- Data subject requests (GDPR Art. 15-22)
CREATE TABLE IF NOT EXISTS data_subject_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE,
    user_id UUID,
    requester_email VARCHAR(255) NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('access', 'deletion', 'rectification', 'portability', 'restriction', 'objection')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'verification_required', 'completed', 'denied', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    received_at TIMESTAMPTZ DEFAULT NOW(),
    deadline_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    extended_deadline_at TIMESTAMPTZ,
    extension_reason TEXT,
    identity_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(100),
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    completed_by UUID,
    response_type VARCHAR(50) CHECK (response_type IN ('fulfilled', 'partially_fulfilled', 'denied')),
    denial_reason TEXT,
    response_data_path TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsr_status ON data_subject_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsr_deadline ON data_subject_requests(deadline_at) WHERE status IN ('pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_dsr_email ON data_subject_requests(requester_email);

-- DSR activity log
CREATE TABLE IF NOT EXISTS dsr_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES data_subject_requests(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    performed_by UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsr_activity_request ON dsr_activity_log(request_id);

-- CCPA consumer rights
CREATE TABLE IF NOT EXISTS ccpa_consumer_rights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email VARCHAR(255) NOT NULL,
    do_not_sell BOOLEAN DEFAULT false,
    do_not_sell_at TIMESTAMPTZ,
    right_to_know_exercised BOOLEAN DEFAULT false,
    right_to_know_at TIMESTAMPTZ,
    right_to_delete_exercised BOOLEAN DEFAULT false,
    right_to_delete_at TIMESTAMPTZ,
    right_to_correct_exercised BOOLEAN DEFAULT false,
    right_to_correct_at TIMESTAMPTZ,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ccpa_email ON ccpa_consumer_rights(email);
CREATE INDEX IF NOT EXISTS idx_ccpa_do_not_sell ON ccpa_consumer_rights(do_not_sell) WHERE do_not_sell = true;

-- Data retention policies
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_type VARCHAR(100) NOT NULL,
    retention_period_days INTEGER NOT NULL,
    retention_action VARCHAR(50) NOT NULL CHECK (retention_action IN ('delete', 'anonymize', 'archive')),
    legal_basis TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    last_purge_at TIMESTAMPTZ,
    next_purge_at TIMESTAMPTZ,
    records_purged INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data purge log
CREATE TABLE IF NOT EXISTS data_purge_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES data_retention_policies(id),
    records_affected INTEGER,
    data_type VARCHAR(100),
    purge_action VARCHAR(50),
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    executed_by VARCHAR(50),
    details JSONB DEFAULT '{}'
);

-- Consent categories
CREATE TABLE IF NOT EXISTS consent_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    default_value BOOLEAN DEFAULT false,
    legal_basis VARCHAR(100) CHECK (legal_basis IN ('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interest')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User consents
CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_id UUID REFERENCES consent_categories(id) ON DELETE CASCADE,
    granted BOOLEAN NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ,
    consent_version VARCHAR(50),
    collection_point VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    UNIQUE(user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_user_consents_user ON user_consents(user_id);

-- Data processing agreements
CREATE TABLE IF NOT EXISTS data_processing_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_name VARCHAR(255) NOT NULL,
    vendor_contact_email VARCHAR(255),
    vendor_contact_name VARCHAR(255),
    agreement_type VARCHAR(50) CHECK (agreement_type IN ('dpa', 'sccs', 'binding_corporate_rules', 'adequacy_decision')),
    effective_date DATE NOT NULL,
    expiration_date DATE,
    auto_renew BOOLEAN DEFAULT false,
    document_path TEXT,
    document_version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'pending_signature', 'active', 'expired', 'terminated')),
    last_review_date DATE,
    next_review_date DATE,
    reviewed_by UUID,
    data_categories_processed JSONB DEFAULT '[]',
    transfer_mechanisms JSONB DEFAULT '[]',
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dpa_status ON data_processing_agreements(status);
CREATE INDEX IF NOT EXISTS idx_dpa_expiration ON data_processing_agreements(expiration_date);

-- =====================================================
-- PHASE 3: HIPAA ENHANCEMENT TABLES
-- =====================================================

-- PHI access roles (Minimum Necessary Principle)
CREATE TABLE IF NOT EXISTS phi_access_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL UNIQUE,
    access_level VARCHAR(50) NOT NULL CHECK (access_level IN ('none', 'limited', 'treatment', 'operations', 'full')),
    accessible_phi_types JSONB DEFAULT '[]',
    requires_justification BOOLEAN DEFAULT false,
    justification_retention_days INTEGER DEFAULT 365,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PHI access overrides (temporary elevated access)
CREATE TABLE IF NOT EXISTS phi_access_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    phi_type VARCHAR(100),
    justification TEXT NOT NULL,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    denied_by UUID,
    denied_at TIMESTAMPTZ,
    denial_reason TEXT,
    expires_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phi_override_user ON phi_access_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_phi_override_status ON phi_access_overrides(status);

-- HIPAA breach incidents
CREATE TABLE IF NOT EXISTS hipaa_breach_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_number VARCHAR(50) UNIQUE,
    discovered_at TIMESTAMPTZ NOT NULL,
    discovered_by UUID,
    discovery_method VARCHAR(100),
    breach_type VARCHAR(100) CHECK (breach_type IN ('unauthorized_access', 'theft', 'loss', 'improper_disclosure', 'hacking', 'other')),
    description TEXT NOT NULL,
    phi_types_affected JSONB DEFAULT '[]',
    individuals_affected INTEGER DEFAULT 0,
    risk_level VARCHAR(50) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_assessment_details JSONB DEFAULT '{}',
    low_probability_of_compromise BOOLEAN DEFAULT false,
    notification_required BOOLEAN,
    individuals_notified_at TIMESTAMPTZ,
    individuals_notification_method VARCHAR(100),
    hhs_notified_at TIMESTAMPTZ,
    media_notified_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'contained', 'resolved', 'closed')),
    containment_actions TEXT,
    remediation_actions TEXT,
    resolved_at TIMESTAMPTZ,
    documentation_path TEXT,
    lessons_learned TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_breach_status ON hipaa_breach_incidents(status);
CREATE INDEX IF NOT EXISTS idx_breach_date ON hipaa_breach_incidents(discovered_at);

-- HIPAA training records
CREATE TABLE IF NOT EXISTS hipaa_training_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    training_type VARCHAR(100) NOT NULL CHECK (training_type IN ('initial', 'annual_refresh', 'specialized', 'remedial')),
    training_name VARCHAR(255),
    provider VARCHAR(255),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    score DECIMAL(5,2),
    passing_score DECIMAL(5,2) DEFAULT 80.00,
    passed BOOLEAN DEFAULT false,
    certificate_path TEXT,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hipaa_training_user ON hipaa_training_records(user_id);
CREATE INDEX IF NOT EXISTS idx_hipaa_training_expiry ON hipaa_training_records(expires_at);

-- =====================================================
-- PHASE 4: SOC 2 & AUDIT TABLES
-- =====================================================

-- Access review campaigns
CREATE TABLE IF NOT EXISTS access_review_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('user_access', 'role_permissions', 'admin_access', 'third_party', 'privileged_access')),
    scope_filter JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    total_items INTEGER DEFAULT 0,
    reviewed_items INTEGER DEFAULT 0,
    approved_items INTEGER DEFAULT 0,
    revoked_items INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_campaign_status ON access_review_campaigns(status);

-- Access review items
CREATE TABLE IF NOT EXISTS access_review_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES access_review_campaigns(id) ON DELETE CASCADE,
    subject_type VARCHAR(50) CHECK (subject_type IN ('user', 'service_account', 'api_key', 'role')),
    subject_id UUID,
    subject_name VARCHAR(255),
    access_type VARCHAR(100),
    access_details JSONB DEFAULT '{}',
    reviewer_id UUID,
    assigned_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    decision VARCHAR(50) CHECK (decision IN ('approve', 'revoke', 'modify', 'escalate')),
    decision_reason TEXT,
    action_taken VARCHAR(100),
    action_taken_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_item_campaign ON access_review_items(campaign_id);
CREATE INDEX IF NOT EXISTS idx_review_item_reviewer ON access_review_items(reviewer_id);

-- Change requests (Change Management)
CREATE TABLE IF NOT EXISTS change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    change_number VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    change_type VARCHAR(50) CHECK (change_type IN ('standard', 'normal', 'emergency', 'expedited')),
    risk_level VARCHAR(50) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    category VARCHAR(100),
    affected_systems JSONB DEFAULT '[]',
    requested_by UUID,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    planned_start TIMESTAMPTZ,
    planned_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'denied', 'withdrawn')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    approval_notes TEXT,
    implemented_by UUID,
    implemented_at TIMESTAMPTZ,
    implementation_notes TEXT,
    rollback_plan TEXT,
    rolled_back BOOLEAN DEFAULT false,
    rollback_at TIMESTAMPTZ,
    rollback_reason TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled', 'rolled_back')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_status ON change_requests(status);
CREATE INDEX IF NOT EXISTS idx_change_approval ON change_requests(approval_status);

-- Security incidents
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_number VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('P1', 'P2', 'P3', 'P4')),
    category VARCHAR(100) CHECK (category IN ('data_breach', 'unauthorized_access', 'malware', 'dos', 'phishing', 'insider_threat', 'policy_violation', 'other')),
    detected_at TIMESTAMPTZ NOT NULL,
    detected_by UUID,
    detection_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'contained', 'eradicated', 'recovered', 'closed')),
    assigned_to UUID,
    acknowledged_at TIMESTAMPTZ,
    contained_at TIMESTAMPTZ,
    eradicated_at TIMESTAMPTZ,
    recovered_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    impact_assessment TEXT,
    affected_systems JSONB DEFAULT '[]',
    affected_users INTEGER DEFAULT 0,
    root_cause TEXT,
    lessons_learned TEXT,
    preventive_measures JSONB DEFAULT '[]',
    post_mortem_completed_at TIMESTAMPTZ,
    post_mortem_document_path TEXT,
    escalated BOOLEAN DEFAULT false,
    escalated_to UUID,
    escalated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incident_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incident_date ON security_incidents(detected_at);

-- Vendors (Third-Party Risk Management)
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(100) CHECK (vendor_type IN ('saas', 'infrastructure', 'professional_services', 'data_processor', 'subprocessor', 'other')),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    criticality VARCHAR(50) CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    data_access_level VARCHAR(50) CHECK (data_access_level IN ('none', 'limited', 'significant', 'full')),
    data_types_accessed JSONB DEFAULT '[]',
    soc2_certified BOOLEAN DEFAULT false,
    soc2_report_date DATE,
    iso27001_certified BOOLEAN DEFAULT false,
    iso27001_cert_date DATE,
    gdpr_compliant BOOLEAN DEFAULT false,
    hipaa_compliant BOOLEAN DEFAULT false,
    pci_dss_compliant BOOLEAN DEFAULT false,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    last_assessment_date DATE,
    next_assessment_date DATE,
    contract_start_date DATE,
    contract_end_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive', 'terminated')),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendor_criticality ON vendors(criticality);

-- Vendor risk assessments
CREATE TABLE IF NOT EXISTS vendor_risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) CHECK (assessment_type IN ('initial', 'annual', 'incident_triggered', 'contract_renewal')),
    assessment_date DATE NOT NULL,
    questionnaire_responses JSONB DEFAULT '{}',
    findings JSONB DEFAULT '[]',
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(50),
    remediation_required BOOLEAN DEFAULT false,
    remediation_deadline DATE,
    remediation_completed_at TIMESTAMPTZ,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    next_assessment_date DATE,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_assessment ON vendor_risk_assessments(vendor_id);

-- =====================================================
-- PHASE 5: COMMUNICATIONS TABLES
-- =====================================================

-- Platform announcements
CREATE TABLE IF NOT EXISTS platform_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) CHECK (announcement_type IN ('info', 'warning', 'maintenance', 'feature', 'promotion', 'urgent')),
    target_audience JSONB DEFAULT '{"all": true}',
    display_type VARCHAR(50) CHECK (display_type IN ('banner', 'modal', 'notification', 'email', 'toast')),
    priority INTEGER DEFAULT 0,
    dismissible BOOLEAN DEFAULT true,
    action_text VARCHAR(100),
    action_url VARCHAR(255),
    publish_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'expired', 'archived')),
    published_by UUID,
    published_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    dismiss_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcement_status ON platform_announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcement_publish ON platform_announcements(publish_at);

-- Announcement interactions
CREATE TABLE IF NOT EXISTS announcement_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES platform_announcements(id) ON DELETE CASCADE,
    user_id UUID,
    interaction_type VARCHAR(50) CHECK (interaction_type IN ('view', 'click', 'dismiss')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcement_interaction ON announcement_interactions(announcement_id);

-- Partner communications
CREATE TABLE IF NOT EXISTS partner_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID,
    partner_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    communication_type VARCHAR(50) CHECK (communication_type IN ('email', 'in_app', 'phone', 'meeting')),
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'replied')),
    sent_by UUID,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_comm ON partner_communications(partner_id);

-- =====================================================
-- PHASE 6: CONTENT MANAGEMENT TABLES
-- =====================================================

-- Platform content pages
CREATE TABLE IF NOT EXISTS platform_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'markdown' CHECK (content_type IN ('markdown', 'html', 'rich_text')),
    version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    published_by UUID,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform content versions (history)
CREATE TABLE IF NOT EXISTS platform_content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES platform_content(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    change_notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_version ON platform_content_versions(content_id);

-- Site banners
CREATE TABLE IF NOT EXISTS site_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_type VARCHAR(50) CHECK (banner_type IN ('info', 'warning', 'success', 'promo', 'maintenance')),
    message TEXT NOT NULL,
    action_text VARCHAR(100),
    action_url VARCHAR(255),
    position VARCHAR(50) DEFAULT 'top' CHECK (position IN ('top', 'bottom', 'floating')),
    background_color VARCHAR(20),
    text_color VARCHAR(20),
    is_dismissible BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    target_pages JSONB DEFAULT '{"all": true}',
    target_roles JSONB DEFAULT '[]',
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    dismiss_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banner_active ON site_banners(is_active) WHERE is_active = true;

-- =====================================================
-- NEW ADMIN ROLES & PERMISSIONS
-- =====================================================

-- Insert new admin roles
INSERT INTO admin_roles (name, display_name, description, hierarchy_level, is_system_role)
VALUES
    ('SECURITY_ADMIN', 'Security Administrator', 'Manages security settings, sessions, and access reviews', 2, true),
    ('PRIVACY_OFFICER', 'Privacy Officer', 'Handles GDPR/CCPA compliance and data subject requests', 2, true),
    ('INCIDENT_MANAGER', 'Incident Response Manager', 'Manages security incidents and breach response', 3, true),
    ('COMMUNICATIONS_ADMIN', 'Communications Administrator', 'Manages platform announcements and partner communications', 4, true),
    ('COMPLIANCE_AUDITOR', 'Compliance Auditor', 'Read-only access to audit logs and compliance reports', 5, true)
ON CONFLICT (name) DO NOTHING;

-- Insert new permissions
INSERT INTO admin_permissions (name, display_name, description, category, resource_type, action, is_sensitive)
VALUES
    -- Security permissions
    ('security.view_sessions', 'View User Sessions', 'View active user sessions across the platform', 'security', 'sessions', 'view', true),
    ('security.manage_sessions', 'Manage Sessions', 'Force logout users and revoke sessions', 'security', 'sessions', 'manage', true),
    ('security.view_failed_logins', 'View Failed Logins', 'Monitor failed login attempts and lockouts', 'security', 'auth', 'view', true),
    ('security.manage_lockouts', 'Manage Lockouts', 'Unlock locked accounts', 'security', 'auth', 'manage', true),
    ('security.manage_ip_rules', 'Manage IP Rules', 'Configure IP allowlist and blocklist', 'security', 'network', 'manage', true),
    ('security.manage_rate_limits', 'Manage Rate Limits', 'Configure API rate limiting', 'security', 'api', 'manage', true),
    ('security.manage_headers', 'Manage Security Headers', 'Configure CSP and security headers', 'security', 'headers', 'manage', true),

    -- Privacy permissions
    ('privacy.view_dsr', 'View Data Subject Requests', 'View GDPR/CCPA data subject requests', 'privacy', 'dsr', 'view', true),
    ('privacy.manage_dsr', 'Manage Data Subject Requests', 'Process and respond to data subject requests', 'privacy', 'dsr', 'manage', true),
    ('privacy.view_consents', 'View Consent Records', 'View user consent records', 'privacy', 'consent', 'view', true),
    ('privacy.manage_consents', 'Manage Consent Categories', 'Configure consent categories and policies', 'privacy', 'consent', 'manage', true),
    ('privacy.manage_retention', 'Manage Data Retention', 'Configure data retention policies', 'privacy', 'retention', 'manage', true),
    ('privacy.manage_dpa', 'Manage DPAs', 'Manage data processing agreements', 'privacy', 'dpa', 'manage', true),

    -- HIPAA permissions
    ('hipaa.view_phi_logs', 'View PHI Access Logs', 'View PHI access audit logs', 'compliance', 'phi', 'view', true),
    ('hipaa.manage_phi_access', 'Manage PHI Access', 'Configure PHI access roles and overrides', 'compliance', 'phi', 'manage', true),
    ('hipaa.view_breaches', 'View Breach Incidents', 'View HIPAA breach incidents', 'compliance', 'breach', 'view', true),
    ('hipaa.manage_breaches', 'Manage Breach Response', 'Manage breach investigation and notification', 'compliance', 'breach', 'manage', true),
    ('hipaa.view_training', 'View Training Records', 'View HIPAA training compliance', 'compliance', 'training', 'view', false),
    ('hipaa.manage_training', 'Manage Training', 'Manage HIPAA training requirements', 'compliance', 'training', 'manage', false),

    -- SOC 2 / Audit permissions
    ('audit.view_reviews', 'View Access Reviews', 'View access review campaigns', 'audit', 'reviews', 'view', false),
    ('audit.manage_reviews', 'Manage Access Reviews', 'Create and manage access review campaigns', 'audit', 'reviews', 'manage', true),
    ('audit.view_changes', 'View Change Requests', 'View change management requests', 'audit', 'changes', 'view', false),
    ('audit.manage_changes', 'Manage Change Requests', 'Approve and manage change requests', 'audit', 'changes', 'manage', true),
    ('audit.view_incidents', 'View Security Incidents', 'View security incident reports', 'audit', 'incidents', 'view', true),
    ('audit.manage_incidents', 'Manage Incidents', 'Manage security incident response', 'audit', 'incidents', 'manage', true),
    ('audit.view_vendors', 'View Vendor Risk', 'View vendor risk assessments', 'audit', 'vendors', 'view', false),
    ('audit.manage_vendors', 'Manage Vendors', 'Manage vendor risk assessments', 'audit', 'vendors', 'manage', true),

    -- Communications permissions
    ('communications.view', 'View Communications', 'View platform communications', 'communications', 'messages', 'view', false),
    ('communications.send', 'Send Communications', 'Send messages to users and partners', 'communications', 'messages', 'send', false),
    ('communications.view_announcements', 'View Announcements', 'View platform announcements', 'communications', 'announcements', 'view', false),
    ('communications.manage_announcements', 'Manage Announcements', 'Create and publish announcements', 'communications', 'announcements', 'manage', false),

    -- Content permissions
    ('content.view_pages', 'View Content Pages', 'View platform content pages', 'content', 'pages', 'view', false),
    ('content.manage_pages', 'Manage Content Pages', 'Edit platform content pages', 'content', 'pages', 'manage', false),
    ('content.view_banners', 'View Banners', 'View site banners', 'content', 'banners', 'view', false),
    ('content.manage_banners', 'Manage Banners', 'Create and manage site banners', 'content', 'banners', 'manage', false)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SAMPLE DATA FOR DEMONSTRATION
-- =====================================================

-- Sample user sessions
INSERT INTO user_sessions (user_id, session_token_hash, device_info, ip_address, geo_location, expires_at, last_active_at)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'abc123def456', '{"browser": "Chrome 120", "os": "Windows 11", "device_type": "desktop"}', '192.168.1.100', '{"country": "United States", "city": "New York", "region": "NY"}', NOW() + INTERVAL '8 hours', NOW() - INTERVAL '5 minutes'),
    ('00000000-0000-0000-0000-000000000002', 'xyz789ghi012', '{"browser": "Safari 17", "os": "macOS Sonoma", "device_type": "desktop"}', '10.0.0.50', '{"country": "United States", "city": "San Francisco", "region": "CA"}', NOW() + INTERVAL '8 hours', NOW() - INTERVAL '15 minutes'),
    ('00000000-0000-0000-0000-000000000003', 'mno345pqr678', '{"browser": "Firefox 121", "os": "Ubuntu 22.04", "device_type": "desktop"}', '172.16.0.25', '{"country": "United States", "city": "Austin", "region": "TX"}', NOW() + INTERVAL '8 hours', NOW() - INTERVAL '2 hours'),
    ('00000000-0000-0000-0000-000000000001', 'stu901vwx234', '{"browser": "Chrome Mobile", "os": "iOS 17", "device_type": "mobile"}', '192.168.1.150', '{"country": "United States", "city": "New York", "region": "NY"}', NOW() + INTERVAL '8 hours', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- Sample failed login attempts
INSERT INTO failed_login_attempts (email, ip_address, user_agent, failure_reason, geo_location)
VALUES
    ('attacker@example.com', '203.0.113.50', 'Python/3.9 requests/2.28.0', 'invalid_credentials', '{"country": "Unknown", "city": "Unknown"}'),
    ('john.doe@company.com', '192.168.1.100', 'Mozilla/5.0 Chrome/120', 'wrong_password', '{"country": "United States", "city": "New York"}'),
    ('admin@stemworkforce.gov', '198.51.100.25', 'curl/7.88.1', 'account_locked', '{"country": "Russia", "city": "Moscow"}'),
    ('test@test.com', '203.0.113.100', 'Python/3.9 requests/2.28.0', 'invalid_credentials', '{"country": "China", "city": "Beijing"}'),
    ('admin@stemworkforce.gov', '203.0.113.101', 'Python/3.9 requests/2.28.0', 'invalid_credentials', '{"country": "China", "city": "Shanghai"}')
ON CONFLICT DO NOTHING;

-- Sample IP access rules
INSERT INTO ip_access_rules (rule_type, ip_pattern, description, applies_to, is_active)
VALUES
    ('allow', '10.0.0.0/8', 'Internal corporate network', 'admin', true),
    ('allow', '192.168.0.0/16', 'VPN network range', 'admin', true),
    ('block', '203.0.113.0/24', 'Known malicious network - blocked after attack', 'all', true),
    ('allow', '172.16.0.0/12', 'Partner network range', 'api', true)
ON CONFLICT DO NOTHING;

-- Sample rate limit configs
INSERT INTO rate_limit_configs (endpoint_pattern, user_tier, requests_per_minute, requests_per_hour, burst_limit)
VALUES
    ('/api/v1/jobs/*', 'default', 60, 1000, 10),
    ('/api/v1/jobs/*', 'premium', 120, 2000, 20),
    ('/api/v1/applications/*', 'default', 30, 500, 5),
    ('/api/v1/auth/*', 'default', 10, 100, 3),
    ('/api/v1/admin/*', 'admin', 200, 5000, 50)
ON CONFLICT DO NOTHING;

-- Sample security headers
INSERT INTO security_headers_config (header_name, header_value, environment, is_active)
VALUES
    ('Content-Security-Policy', 'default-src ''self''; script-src ''self'' ''unsafe-inline'' https://cdn.jsdelivr.net; style-src ''self'' ''unsafe-inline'' https://fonts.googleapis.com; font-src ''self'' https://fonts.gstatic.com; img-src ''self'' data: https:; connect-src ''self'' https://*.supabase.co', 'production', true),
    ('X-Frame-Options', 'DENY', 'production', true),
    ('X-Content-Type-Options', 'nosniff', 'production', true),
    ('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload', 'production', true),
    ('X-XSS-Protection', '1; mode=block', 'production', true),
    ('Referrer-Policy', 'strict-origin-when-cross-origin', 'production', true),
    ('Permissions-Policy', 'geolocation=(), microphone=(), camera=()', 'production', true)
ON CONFLICT DO NOTHING;

-- Sample data subject requests
INSERT INTO data_subject_requests (request_number, requester_email, request_type, status, priority, identity_verified)
VALUES
    ('DSR-2024-001', 'jane.smith@email.com', 'access', 'pending', 'normal', false),
    ('DSR-2024-002', 'john.doe@company.com', 'deletion', 'in_progress', 'high', true),
    ('DSR-2024-003', 'maria.garcia@email.com', 'portability', 'completed', 'normal', true),
    ('DSR-2024-004', 'alex.johnson@email.com', 'rectification', 'pending', 'low', false),
    ('DSR-2024-005', 'privacy@competitor.com', 'access', 'verification_required', 'urgent', false)
ON CONFLICT DO NOTHING;

-- Sample consent categories
INSERT INTO consent_categories (category_key, name, description, is_required, legal_basis, display_order)
VALUES
    ('essential', 'Essential Cookies', 'Required for the platform to function properly', true, 'contract', 1),
    ('analytics', 'Analytics & Performance', 'Help us understand how you use our platform', false, 'consent', 2),
    ('marketing', 'Marketing Communications', 'Receive updates about jobs and training programs', false, 'consent', 3),
    ('personalization', 'Personalized Recommendations', 'Get job and training recommendations based on your profile', false, 'legitimate_interest', 4),
    ('third_party', 'Third-Party Sharing', 'Share your profile with potential employers', false, 'consent', 5)
ON CONFLICT DO NOTHING;

-- Sample data retention policies
INSERT INTO data_retention_policies (data_type, retention_period_days, retention_action, legal_basis, description, is_active)
VALUES
    ('audit_logs', 365, 'archive', 'SOC 2 requires minimum 12 months retention', 'Audit logs for compliance', true),
    ('user_sessions', 90, 'delete', 'No legal requirement beyond operational need', 'Session data cleanup', true),
    ('failed_login_attempts', 180, 'delete', 'Security monitoring purposes', 'Failed login tracking', true),
    ('job_applications', 730, 'anonymize', 'EEOC requires 2 year retention', 'Application records', true),
    ('inactive_accounts', 1095, 'delete', 'GDPR data minimization principle', 'Accounts inactive for 3 years', true)
ON CONFLICT DO NOTHING;

-- Sample DPAs
INSERT INTO data_processing_agreements (vendor_name, vendor_contact_email, agreement_type, effective_date, expiration_date, status, data_categories_processed)
VALUES
    ('Supabase Inc.', 'legal@supabase.io', 'dpa', '2024-01-01', '2025-12-31', 'active', '["user_data", "authentication", "application_data"]'),
    ('SendGrid', 'privacy@sendgrid.com', 'dpa', '2024-03-15', '2025-03-14', 'active', '["email_addresses", "names"]'),
    ('Stripe Inc.', 'privacy@stripe.com', 'dpa', '2024-02-01', '2025-01-31', 'active', '["payment_data", "billing_info"]'),
    ('Google Analytics', 'privacy@google.com', 'sccs', '2024-01-01', '2024-12-31', 'active', '["usage_analytics", "anonymized_data"]')
ON CONFLICT DO NOTHING;

-- Sample PHI access roles
INSERT INTO phi_access_roles (role_name, access_level, accessible_phi_types, requires_justification, description)
VALUES
    ('Healthcare Admin', 'full', '["demographics", "medical_history", "treatment_records", "billing"]', false, 'Full PHI access for healthcare administrators'),
    ('Clinical Staff', 'treatment', '["demographics", "medical_history", "treatment_records"]', false, 'Treatment-related PHI access'),
    ('Billing Staff', 'operations', '["demographics", "billing"]', false, 'Billing-related PHI access only'),
    ('IT Support', 'limited', '["demographics"]', true, 'Limited access with justification required'),
    ('External Auditor', 'none', '[]', true, 'No direct PHI access - anonymized data only')
ON CONFLICT DO NOTHING;

-- Sample HIPAA training records
INSERT INTO hipaa_training_records (user_id, training_type, training_name, provider, completed_at, expires_at, score, passed)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'initial', 'HIPAA Privacy & Security Fundamentals', 'Compliancy Group', NOW() - INTERVAL '6 months', NOW() + INTERVAL '6 months', 92.5, true),
    ('00000000-0000-0000-0000-000000000002', 'annual_refresh', 'HIPAA Annual Refresher 2024', 'Compliancy Group', NOW() - INTERVAL '2 months', NOW() + INTERVAL '10 months', 88.0, true),
    ('00000000-0000-0000-0000-000000000003', 'specialized', 'PHI Handling for IT Staff', 'HIPAA Academy', NOW() - INTERVAL '3 months', NOW() + INTERVAL '9 months', 95.0, true),
    ('00000000-0000-0000-0000-000000000004', 'initial', 'HIPAA Privacy & Security Fundamentals', 'Compliancy Group', NULL, NOW() - INTERVAL '30 days', NULL, false)
ON CONFLICT DO NOTHING;

-- Sample access review campaign
INSERT INTO access_review_campaigns (name, description, campaign_type, status, start_date, end_date, total_items, reviewed_items)
VALUES
    ('Q4 2024 Admin Access Review', 'Quarterly review of all admin role assignments', 'admin_access', 'active', '2024-10-01', '2024-10-31', 45, 12),
    ('Annual Third-Party Access Review', 'Annual review of all vendor and partner access', 'third_party', 'draft', '2024-11-01', '2024-11-30', 0, 0)
ON CONFLICT DO NOTHING;

-- Sample change requests
INSERT INTO change_requests (change_number, title, description, change_type, risk_level, status, approval_status)
VALUES
    ('CHG-2024-001', 'Database Schema Update for Healthcare Module', 'Add new tables for HIPAA compliance tracking', 'normal', 'medium', 'completed', 'approved'),
    ('CHG-2024-002', 'Security Headers Update', 'Implement stricter CSP policy', 'standard', 'low', 'in_progress', 'approved'),
    ('CHG-2024-003', 'Emergency Patch for Auth Vulnerability', 'Critical security patch for authentication bypass', 'emergency', 'critical', 'completed', 'approved'),
    ('CHG-2024-004', 'New Admin Dashboard Features', 'Add security center and privacy compliance tabs', 'normal', 'medium', 'pending_approval', 'pending')
ON CONFLICT DO NOTHING;

-- Sample security incidents
INSERT INTO security_incidents (incident_number, title, description, severity, category, detected_at, status)
VALUES
    ('INC-2024-001', 'Brute Force Attack Detected', 'Multiple failed login attempts from IP range 203.0.113.0/24', 'P3', 'unauthorized_access', NOW() - INTERVAL '5 days', 'closed'),
    ('INC-2024-002', 'Suspicious API Activity', 'Unusual API call patterns detected from partner integration', 'P4', 'policy_violation', NOW() - INTERVAL '2 days', 'investigating'),
    ('INC-2024-003', 'Phishing Email Campaign', 'Users reported receiving phishing emails impersonating platform', 'P2', 'phishing', NOW() - INTERVAL '1 day', 'contained')
ON CONFLICT DO NOTHING;

-- Sample vendors
INSERT INTO vendors (name, vendor_type, criticality, data_access_level, soc2_certified, hipaa_compliant, risk_score, status)
VALUES
    ('Supabase', 'infrastructure', 'critical', 'full', true, true, 15, 'active'),
    ('SendGrid', 'saas', 'high', 'limited', true, false, 25, 'active'),
    ('Stripe', 'saas', 'critical', 'significant', true, true, 10, 'active'),
    ('Google Cloud', 'infrastructure', 'critical', 'full', true, true, 12, 'active'),
    ('Mixpanel', 'saas', 'medium', 'limited', true, false, 30, 'active')
ON CONFLICT DO NOTHING;

-- Sample platform announcements
INSERT INTO platform_announcements (title, content, announcement_type, display_type, status, priority)
VALUES
    ('Platform Maintenance Scheduled', 'The platform will undergo scheduled maintenance on Sunday, January 5th from 2:00 AM - 6:00 AM EST. Some features may be unavailable during this time.', 'maintenance', 'banner', 'published', 10),
    ('New Healthcare Industry Features', 'We are excited to announce new features for healthcare technology careers including HIPAA compliance tracking and medical technology job categories.', 'feature', 'notification', 'draft', 5),
    ('Holiday Schedule Notice', 'Our support team will have limited availability December 24-26 and December 31 - January 1.', 'info', 'banner', 'scheduled', 3)
ON CONFLICT DO NOTHING;

-- Sample platform content
INSERT INTO platform_content (page_key, title, content, status, version)
VALUES
    ('about', 'About STEMWorkforce', '# About STEMWorkforce\n\nSTEMWorkforce is the premier platform connecting talented professionals with opportunities in emerging technology sectors critical to national security and economic growth.', 'published', 1),
    ('privacy', 'Privacy Policy', '# Privacy Policy\n\nLast updated: January 2024\n\nThis privacy policy describes how STEMWorkforce collects, uses, and protects your personal information.', 'published', 3),
    ('terms', 'Terms of Service', '# Terms of Service\n\nBy using STEMWorkforce, you agree to these terms of service.', 'published', 2),
    ('hipaa-notice', 'HIPAA Notice of Privacy Practices', '# Notice of Privacy Practices\n\nThis notice describes how medical information about you may be used and disclosed.', 'draft', 1)
ON CONFLICT DO NOTHING;

-- Sample site banners
INSERT INTO site_banners (banner_type, message, action_text, action_url, position, is_active, priority)
VALUES
    ('info', 'Healthcare & Medical Technology industry is now available! Explore new opportunities in health IT, clinical informatics, and medical devices.', 'Explore Healthcare Jobs', '/jobs?industry=healthcare', 'top', true, 10),
    ('maintenance', 'Scheduled maintenance: January 5th, 2:00-6:00 AM EST', NULL, NULL, 'top', false, 100)
ON CONFLICT DO NOTHING;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_access_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_headers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsr_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccpa_consumer_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE phi_access_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE phi_access_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hipaa_breach_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hipaa_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_review_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_review_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies (simplified - in production, use role-based policies)
CREATE POLICY admin_sessions_policy ON user_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY admin_failed_logins_policy ON failed_login_attempts FOR ALL TO authenticated USING (true);
CREATE POLICY admin_lockouts_policy ON account_lockouts FOR ALL TO authenticated USING (true);
CREATE POLICY admin_ip_rules_policy ON ip_access_rules FOR ALL TO authenticated USING (true);
CREATE POLICY admin_rate_limits_policy ON rate_limit_configs FOR ALL TO authenticated USING (true);
CREATE POLICY admin_security_headers_policy ON security_headers_config FOR ALL TO authenticated USING (true);
CREATE POLICY admin_dsr_policy ON data_subject_requests FOR ALL TO authenticated USING (true);
CREATE POLICY admin_dsr_activity_policy ON dsr_activity_log FOR ALL TO authenticated USING (true);
CREATE POLICY admin_ccpa_policy ON ccpa_consumer_rights FOR ALL TO authenticated USING (true);
CREATE POLICY admin_retention_policy ON data_retention_policies FOR ALL TO authenticated USING (true);
CREATE POLICY admin_consent_categories_policy ON consent_categories FOR ALL TO authenticated USING (true);
CREATE POLICY admin_user_consents_policy ON user_consents FOR ALL TO authenticated USING (true);
CREATE POLICY admin_dpa_policy ON data_processing_agreements FOR ALL TO authenticated USING (true);
CREATE POLICY admin_phi_roles_policy ON phi_access_roles FOR ALL TO authenticated USING (true);
CREATE POLICY admin_phi_overrides_policy ON phi_access_overrides FOR ALL TO authenticated USING (true);
CREATE POLICY admin_breach_policy ON hipaa_breach_incidents FOR ALL TO authenticated USING (true);
CREATE POLICY admin_training_policy ON hipaa_training_records FOR ALL TO authenticated USING (true);
CREATE POLICY admin_review_campaigns_policy ON access_review_campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY admin_review_items_policy ON access_review_items FOR ALL TO authenticated USING (true);
CREATE POLICY admin_changes_policy ON change_requests FOR ALL TO authenticated USING (true);
CREATE POLICY admin_incidents_policy ON security_incidents FOR ALL TO authenticated USING (true);
CREATE POLICY admin_vendors_policy ON vendors FOR ALL TO authenticated USING (true);
CREATE POLICY admin_vendor_assessments_policy ON vendor_risk_assessments FOR ALL TO authenticated USING (true);
CREATE POLICY admin_announcements_policy ON platform_announcements FOR ALL TO authenticated USING (true);
CREATE POLICY admin_announcement_interactions_policy ON announcement_interactions FOR ALL TO authenticated USING (true);
CREATE POLICY admin_partner_comms_policy ON partner_communications FOR ALL TO authenticated USING (true);
CREATE POLICY admin_content_policy ON platform_content FOR ALL TO authenticated USING (true);
CREATE POLICY admin_content_versions_policy ON platform_content_versions FOR ALL TO authenticated USING (true);
CREATE POLICY admin_banners_policy ON site_banners FOR ALL TO authenticated USING (true);

-- =====================================================
-- COMPLETION
-- =====================================================
-- Migration complete: All 6 phases with sample data
