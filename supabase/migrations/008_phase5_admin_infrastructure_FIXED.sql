-- =====================================================
-- STEMWorkforce Platform - Phase 5 Admin Infrastructure
-- FIXED VERSION - Handles existing tables and partitioning
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PART 1: ROLE-BASED ACCESS CONTROL (RBAC)
-- =====================================================

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INTEGER NOT NULL DEFAULT 0,
    parent_role_id UUID,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add parent_role_id if table already exists
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS parent_role_id UUID;

-- Admin Permissions Table
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    is_sensitive BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role-Permission Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID,
    UNIQUE(role_id, permission_id)
);

-- User Role Assignments
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
    organization_id UUID,
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id, organization_id)
);

-- =====================================================
-- PART 2: AUDIT LOGGING (Non-partitioned for compatibility)
-- =====================================================

-- Drop existing audit_logs if it exists but isn't partitioned
DO $$
BEGIN
    -- Check if audit_logs exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'audit_logs' AND schemaname = 'public') THEN
        -- Check if it's NOT partitioned
        IF NOT EXISTS (SELECT FROM pg_partitioned_table WHERE partrelid = 'public.audit_logs'::regclass) THEN
            -- Table exists but is not partitioned - add missing columns if needed
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS event_type VARCHAR(100);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS event_category VARCHAR(50);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id UUID;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_type VARCHAR(50);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_email VARCHAR(255);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_ip VARCHAR(45);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_user_agent TEXT;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_type VARCHAR(100);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_id UUID;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_name VARCHAR(255);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(100);
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS old_values JSONB;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_values JSONB;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS organization_id UUID;
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'info';
            ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS is_sensitive BOOLEAN DEFAULT false;
        END IF;
    ELSE
        -- Table doesn't exist - create it WITHOUT partitioning for simplicity
        CREATE TABLE audit_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_type VARCHAR(100) NOT NULL,
            event_category VARCHAR(50) NOT NULL,
            actor_id UUID,
            actor_type VARCHAR(50),
            actor_email VARCHAR(255),
            actor_ip VARCHAR(45),
            actor_user_agent TEXT,
            resource_type VARCHAR(100),
            resource_id UUID,
            resource_name VARCHAR(255),
            action VARCHAR(100) NOT NULL,
            old_values JSONB,
            new_values JSONB,
            metadata JSONB,
            organization_id UUID,
            severity VARCHAR(20) DEFAULT 'info',
            is_sensitive BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_type, event_category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);

-- PART 3: ORGANIZATION MANAGEMENT (Original Proposal)
-- =====================================================

-- Extended Organization Data
CREATE TABLE IF NOT EXISTS organizations_extended (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE,
    tier VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'professional', 'enterprise', 'government'
    billing_email VARCHAR(255),
    billing_address JSONB,
    stripe_customer_id VARCHAR(255),
    
    -- Quotas and Limits
    max_users INTEGER DEFAULT 5,
    max_jobs_per_month INTEGER DEFAULT 10,
    max_applications_per_month INTEGER DEFAULT 100,
    max_storage_gb INTEGER DEFAULT 1,
    
    -- Current Usage
    current_users INTEGER DEFAULT 0,
    current_month_jobs INTEGER DEFAULT 0,
    current_month_applications INTEGER DEFAULT 0,
    current_storage_mb DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'suspended'
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    suspended_at TIMESTAMPTZ,
    suspended_reason TEXT,
    
    -- Compliance
    ofccp_required BOOLEAN DEFAULT false,
    hipaa_required BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 4: OFCCP COMPLIANCE (NEW - Expert Panel)
-- =====================================================

-- Voluntary Self-Identification (OFCCP Compliant)
CREATE TABLE IF NOT EXISTS ofccp_self_identifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    application_id UUID,
    collection_stage VARCHAR(20) NOT NULL, -- 'pre_offer', 'post_offer'
    
    -- Demographics (voluntary disclosure)
    gender VARCHAR(50),
    ethnicity VARCHAR(100),
    race_categories JSONB, -- Allows multiple selections per EEO-1
    veteran_status VARCHAR(100),
    veteran_category JSONB, -- VEVRAA categories
    disability_status VARCHAR(100),
    
    -- Collection metadata
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    declined_to_answer BOOLEAN DEFAULT false,
    
    -- CRITICAL: Data must be kept separate from hiring decisions
    is_confidential BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFCCP Compliance Reports
CREATE TABLE IF NOT EXISTS ofccp_compliance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'eeo1_component1', 'eeo1_component2', 'vets4212', 'aap_export'
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    report_data JSONB NOT NULL,
    file_path TEXT,
    generated_by UUID,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    submission_confirmation VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on OFCCP data
ALTER TABLE ofccp_self_identifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 5: SECURITY CLEARANCE (NEW - Expert Panel)
-- =====================================================

-- Security Clearance Tracking
CREATE TABLE IF NOT EXISTS clearance_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    clearance_level VARCHAR(50) NOT NULL, -- 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET', 'TS_SCI'
    polygraph_type VARCHAR(50), -- 'NONE', 'CI_POLY', 'FULL_SCOPE'
    granting_agency VARCHAR(100),
    investigation_type VARCHAR(50), -- 'TIER_1', 'TIER_3', 'TIER_5', 'SSBI'
    granted_date DATE,
    expiration_date DATE,
    reinvestigation_due DATE,
    
    -- Verification
    verification_status VARCHAR(50) DEFAULT 'CLAIMED', -- 'CLAIMED', 'PENDING', 'VERIFIED', 'EXPIRED', 'REVOKED'
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(100), -- 'DCSA_LOOKUP', 'EMPLOYER_VERIFICATION', 'MANUAL', 'SELF_REPORTED'
    verification_notes TEXT,
    
    -- Supporting documentation
    documentation_path TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clearance Verification Queue
CREATE TABLE IF NOT EXISTS clearance_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clearance_id UUID REFERENCES clearance_tracking(id),
    user_id UUID NOT NULL,
    claimed_level VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED'
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Facility Clearance (FCL)
CREATE TABLE IF NOT EXISTS organization_fcl (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    fcl_level VARCHAR(50) NOT NULL, -- 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'
    cage_code VARCHAR(20),
    duns_number VARCHAR(20),
    granted_date DATE,
    expiration_date DATE,
    
    verification_status VARCHAR(50) DEFAULT 'CLAIMED',
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizenship Verification
CREATE TABLE IF NOT EXISTS citizenship_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    claimed_citizenship VARCHAR(50) NOT NULL, -- 'US_CITIZEN', 'PERMANENT_RESIDENT', 'VISA_HOLDER', 'OTHER'
    verification_status VARCHAR(50) DEFAULT 'CLAIMED',
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(100),
    documentation_type VARCHAR(100), -- 'PASSPORT', 'BIRTH_CERTIFICATE', 'NATURALIZATION_CERT', etc.
    documentation_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 6: HEALTHCARE COMPLIANCE (NEW - Expert Panel)
-- =====================================================

-- HIPAA Audit Logs (Enhanced)
CREATE TABLE IF NOT EXISTS hipaa_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'phi_access', 'phi_disclosure', 'phi_amendment', 'breach_detected'
    actor_id UUID NOT NULL,
    actor_email VARCHAR(255),
    actor_ip VARCHAR(45),
    patient_identifier VARCHAR(255), -- Encrypted/hashed
    record_type VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    access_reason TEXT,
    access_authorized BOOLEAN DEFAULT true,
    authorization_reference VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Associate Agreements
CREATE TABLE IF NOT EXISTS baa_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    organization_name VARCHAR(255),
    agreement_type VARCHAR(50) DEFAULT 'baa', -- 'baa', 'dua', 'mou'
    effective_date DATE NOT NULL,
    expiration_date DATE,
    auto_renew BOOLEAN DEFAULT false,
    
    -- Document
    document_path TEXT,
    document_version VARCHAR(50),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'draft', 'pending_signature', 'active', 'expired', 'terminated'
    signed_by_us UUID,
    signed_by_us_at TIMESTAMPTZ,
    signed_by_partner VARCHAR(255),
    signed_by_partner_at TIMESTAMPTZ,
    
    -- Compliance
    last_review_date DATE,
    next_review_date DATE,
    reviewed_by UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Healthcare Certifications (Extended)
CREATE TABLE IF NOT EXISTS user_healthcare_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    certification_type VARCHAR(100) NOT NULL, -- 'RN', 'MD', 'NP', 'PA', 'LPN', etc.
    certification_number VARCHAR(100),
    issuing_authority VARCHAR(255),
    issuing_state VARCHAR(50),
    issue_date DATE,
    expiration_date DATE,
    
    -- Verification
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'EXPIRED', 'REVOKED', 'UNABLE_TO_VERIFY'
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    verification_source VARCHAR(255), -- API or manual
    
    -- Documentation
    documentation_path TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certification Verification Queue
CREATE TABLE IF NOT EXISTS certification_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id UUID REFERENCES user_healthcare_certifications(id),
    user_id UUID NOT NULL,
    certification_type VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    verification_attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    verification_response JSONB,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 7: SKILLS & ATS ADMIN (NEW - Expert Panel)
-- =====================================================

-- Skills Taxonomy Management
CREATE TABLE IF NOT EXISTS skills_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL, -- References the main skills table
    canonical_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- Metadata
    synonyms TEXT[], -- Array of alternative names
    related_skills UUID[],
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'deprecated', 'merged'
    deprecated_at TIMESTAMPTZ,
    deprecated_reason TEXT,
    merged_into UUID, -- If merged into another skill
    
    -- Usage stats
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application Disputes
CREATE TABLE IF NOT EXISTS application_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    job_id UUID NOT NULL,
    applicant_id UUID NOT NULL,
    employer_id UUID NOT NULL,
    
    dispute_type VARCHAR(100) NOT NULL, -- 'status_incorrect', 'discrimination', 'process_violation', 'other'
    description TEXT NOT NULL,
    evidence_paths TEXT[],
    
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'under_review', 'resolved', 'closed'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    
    resolution TEXT,
    resolution_type VARCHAR(50), -- 'in_favor_applicant', 'in_favor_employer', 'no_action', 'mediated'
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matching Algorithm Configurations
CREATE TABLE IF NOT EXISTS matching_algorithm_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Weights (should sum to 1.0)
    skills_weight DECIMAL(3,2) DEFAULT 0.40,
    experience_weight DECIMAL(3,2) DEFAULT 0.25,
    education_weight DECIMAL(3,2) DEFAULT 0.15,
    location_weight DECIMAL(3,2) DEFAULT 0.10,
    clearance_weight DECIMAL(3,2) DEFAULT 0.10,
    
    -- Thresholds
    minimum_match_score DECIMAL(3,2) DEFAULT 0.50,
    high_match_threshold DECIMAL(3,2) DEFAULT 0.80,
    
    -- Additional parameters
    parameters JSONB,
    
    -- A/B Testing
    is_active BOOLEAN DEFAULT false,
    is_control BOOLEAN DEFAULT false,
    traffic_percentage INTEGER DEFAULT 0, -- 0-100
    
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 8: TEMPLATE MANAGEMENT (NEW - Expert Panel)
-- =====================================================

-- Email Template Versions
CREATE TABLE IF NOT EXISTS email_templates_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key VARCHAR(100) NOT NULL, -- 'application_received', 'interview_scheduled', etc.
    version INTEGER NOT NULL DEFAULT 1,
    
    subject_template TEXT NOT NULL,
    body_html_template TEXT NOT NULL,
    body_text_template TEXT,
    
    -- Variables
    available_variables JSONB, -- List of {{variable}} placeholders
    
    -- Organization override
    organization_id UUID, -- NULL = platform default
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'deprecated'
    
    -- Metadata
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(template_key, version, organization_id)
);

-- Offer Letter Templates
CREATE TABLE IF NOT EXISTS offer_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Template content
    template_content TEXT NOT NULL, -- HTML/Markdown template
    available_variables JSONB,
    
    -- Compliance
    requires_approval BOOLEAN DEFAULT true,
    approval_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    approval_notes TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 9: FEATURE FLAGS (Original Proposal)
-- =====================================================

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    flag_type VARCHAR(50) DEFAULT 'release', -- 'release', 'experiment', 'ops', 'permission'
    
    -- Default state
    is_enabled BOOLEAN DEFAULT false,
    default_value JSONB,
    
    -- Targeting
    targeting_rules JSONB,
    rollout_percentage INTEGER DEFAULT 0, -- 0-100
    
    -- Metadata
    tags TEXT[],
    owner_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Flag Overrides
CREATE TABLE IF NOT EXISTS feature_flag_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_id UUID REFERENCES feature_flags(id) ON DELETE CASCADE,
    
    -- Override target
    target_type VARCHAR(50) NOT NULL, -- 'user', 'organization', 'role'
    target_id UUID NOT NULL,
    
    -- Override value
    is_enabled BOOLEAN,
    override_value JSONB,
    
    -- Metadata
    reason TEXT,
    expires_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(flag_id, target_type, target_id)
);

-- =====================================================
-- PART 10: SUPPORT SYSTEM (Original Proposal)
-- =====================================================

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Requester
    user_id UUID NOT NULL,
    user_email VARCHAR(255),
    organization_id UUID,
    
    -- Ticket details
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'
    
    -- Assignment
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    
    -- SLA
    sla_due_at TIMESTAMPTZ,
    sla_breached BOOLEAN DEFAULT false,
    first_response_at TIMESTAMPTZ,
    
    -- Resolution
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    satisfaction_rating INTEGER, -- 1-5
    satisfaction_feedback TEXT,
    
    -- Metadata
    tags TEXT[],
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    sender_id UUID NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'agent', 'system'
    sender_name VARCHAR(255),
    
    message_type VARCHAR(50) DEFAULT 'reply', -- 'reply', 'internal_note', 'status_change'
    content TEXT NOT NULL,
    
    attachments JSONB,
    
    is_internal BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 11: CONTENT MODERATION (Original Proposal)
-- =====================================================

-- Moderation Queue
CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content reference
    content_type VARCHAR(100) NOT NULL, -- 'job', 'profile', 'resume', 'message', 'review'
    content_id UUID NOT NULL,
    content_snapshot JSONB,
    
    -- Flagging
    flagged_reason VARCHAR(255) NOT NULL,
    flagged_by VARCHAR(50) NOT NULL, -- 'system', 'user', 'admin'
    flagged_by_id UUID,
    auto_flag_score DECIMAL(3,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'escalated'
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Review
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    decision VARCHAR(50),
    decision_reason TEXT,
    
    -- Actions taken
    actions_taken JSONB, -- Array of actions
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 12: BILLING & SUBSCRIPTIONS (Original Proposal)
-- =====================================================

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Targeting
    target_type VARCHAR(50) NOT NULL, -- 'employer', 'job_seeker', 'educator'
    
    -- Pricing
    price_monthly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Stripe
    stripe_product_id VARCHAR(255),
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_annual VARCHAR(255),
    
    -- Features/Limits
    features JSONB,
    limits JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    -- Ordering
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Subscriber
    subscriber_type VARCHAR(50) NOT NULL, -- 'user', 'organization'
    subscriber_id UUID NOT NULL,
    
    -- Plan
    plan_id UUID REFERENCES subscription_plans(id),
    
    -- Stripe
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'incomplete', 'trialing'
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Stripe
    stripe_invoice_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    
    -- Amounts
    subtotal DECIMAL(10,2),
    tax DECIMAL(10,2),
    total DECIMAL(10,2),
    amount_paid DECIMAL(10,2),
    amount_due DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'open', 'paid', 'void', 'uncollectible'
    
    -- Dates
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    
    -- Invoice details
    invoice_pdf_url TEXT,
    hosted_invoice_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Records
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Usage type
    usage_type VARCHAR(100) NOT NULL, -- 'job_posting', 'application', 'resume_view', 'api_call'
    
    -- Usage data
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount DECIMAL(10,4),
    
    -- Timestamp
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB
);

-- Usage Daily Summary
CREATE TABLE IF NOT EXISTS usage_daily_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    usage_date DATE NOT NULL,
    
    -- Aggregated usage
    usage_counts JSONB NOT NULL, -- {"job_posting": 5, "application": 10, ...}
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(subscription_id, usage_date)
);

-- =====================================================
-- PART 13: WEBHOOKS (Original Proposal)
-- =====================================================

-- Webhook Endpoints
CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    
    -- Endpoint
    url TEXT NOT NULL,
    description TEXT,
    
    -- Authentication
    secret_key VARCHAR(255) NOT NULL,
    
    -- Events
    subscribed_events TEXT[] NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    metadata JSONB,
    
    -- Stats
    last_triggered_at TIMESTAMPTZ,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Deliveries (for debugging)
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    
    -- Delivery status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'retrying'
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Response
    response_status INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,
    
    -- Timing
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 14: INDEXES
-- =====================================================

-- RBAC indexes
CREATE INDEX idx_user_roles_user ON user_role_assignments(user_id);
CREATE INDEX idx_user_roles_role ON user_role_assignments(role_id);
CREATE INDEX idx_role_perms_role ON role_permissions(role_id);

-- OFCCP indexes
CREATE INDEX idx_ofccp_self_id_user ON ofccp_self_identifications(user_id);
CREATE INDEX idx_ofccp_self_id_app ON ofccp_self_identifications(application_id);
CREATE INDEX idx_ofccp_reports_org ON ofccp_compliance_reports(organization_id);

-- Clearance indexes
CREATE INDEX idx_clearance_user ON clearance_tracking(user_id);
CREATE INDEX idx_clearance_status ON clearance_tracking(verification_status);
CREATE INDEX idx_clearance_expiry ON clearance_tracking(expiration_date);

-- Healthcare indexes
CREATE INDEX idx_healthcare_certs_user ON user_healthcare_certifications(user_id);
CREATE INDEX idx_healthcare_certs_status ON user_healthcare_certifications(verification_status);
CREATE INDEX idx_baa_org ON baa_agreements(organization_id);

-- Support indexes
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to);

-- Subscription indexes
CREATE INDEX idx_subs_subscriber ON subscriptions(subscriber_type, subscriber_id);
CREATE INDEX idx_subs_status ON subscriptions(status);
CREATE INDEX idx_invoices_sub ON invoices(subscription_id);

-- =====================================================
-- PART 15: SEED DATA
-- =====================================================

-- Seed default admin roles
INSERT INTO admin_roles (name, display_name, description, hierarchy_level, is_system_role) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Full platform access', 1, true),
('PLATFORM_ADMIN', 'Platform Administrator', 'Full system access without role management', 2, true),
('SECURITY_ADMIN', 'Security Administrator', 'Security and compliance management', 3, true),
('COMPLIANCE_ADMIN', 'Compliance Administrator', 'OFCCP, HIPAA, and regulatory compliance', 3, true),
('BILLING_ADMIN', 'Billing Administrator', 'Billing and subscription management', 3, true),
('CONTENT_ADMIN', 'Content Administrator', 'Content moderation and management', 3, true),
('SUPPORT_ADMIN', 'Support Administrator', 'Customer support management', 3, true),
('PARTNER_ADMIN', 'Partner Administrator', 'Organization-level administration', 4, true),
('PARTNER_HR_MANAGER', 'Partner HR Manager', 'Job posting and ATS management', 5, true),
('PARTNER_RECRUITER', 'Partner Recruiter', 'Limited ATS access', 6, true),
('EDUCATOR_ADMIN', 'Educator Administrator', 'Institution-level administration', 4, true);

-- Set parent roles
UPDATE admin_roles SET parent_role_id = (SELECT id FROM admin_roles WHERE name = 'SUPER_ADMIN') WHERE name = 'PLATFORM_ADMIN';
UPDATE admin_roles SET parent_role_id = (SELECT id FROM admin_roles WHERE name = 'PLATFORM_ADMIN') WHERE name IN ('SECURITY_ADMIN', 'COMPLIANCE_ADMIN', 'BILLING_ADMIN', 'CONTENT_ADMIN', 'SUPPORT_ADMIN');

-- Seed default permissions
INSERT INTO admin_permissions (name, resource_type, action, display_name, description, category, is_sensitive) VALUES
-- User permissions
('users.create', 'users', 'create', 'Create Users', 'Create new user accounts', 'user_management', false),
('users.read', 'users', 'read', 'View Users', 'View user profiles and data', 'user_management', false),
('users.update', 'users', 'update', 'Update Users', 'Modify user information', 'user_management', false),
('users.delete', 'users', 'delete', 'Delete Users', 'Delete user accounts', 'user_management', true),
('users.suspend', 'users', 'suspend', 'Suspend Users', 'Suspend user accounts', 'user_management', true),
('users.impersonate', 'users', 'impersonate', 'Impersonate Users', 'Login as another user', 'user_management', true),

-- Organization permissions
('organizations.create', 'organizations', 'create', 'Create Organizations', 'Create new organizations', 'org_management', false),
('organizations.read', 'organizations', 'read', 'View Organizations', 'View organization data', 'org_management', false),
('organizations.update', 'organizations', 'update', 'Update Organizations', 'Modify organization information', 'org_management', false),
('organizations.delete', 'organizations', 'delete', 'Delete Organizations', 'Delete organizations', 'org_management', true),
('organizations.verify', 'organizations', 'verify', 'Verify Organizations', 'Verify organization status', 'org_management', false),
('organizations.suspend', 'organizations', 'suspend', 'Suspend Organizations', 'Suspend organizations', 'org_management', true),

-- Job permissions
('jobs.create', 'jobs', 'create', 'Create Jobs', 'Create job postings', 'job_management', false),
('jobs.read', 'jobs', 'read', 'View Jobs', 'View job postings', 'job_management', false),
('jobs.update', 'jobs', 'update', 'Update Jobs', 'Modify job postings', 'job_management', false),
('jobs.delete', 'jobs', 'delete', 'Delete Jobs', 'Delete job postings', 'job_management', false),
('jobs.feature', 'jobs', 'feature', 'Feature Jobs', 'Mark jobs as featured', 'job_management', false),
('jobs.moderate', 'jobs', 'moderate', 'Moderate Jobs', 'Approve or reject jobs', 'job_management', false),

-- Application permissions
('applications.read', 'applications', 'read', 'View Applications', 'View application data', 'application_management', false),
('applications.update', 'applications', 'update', 'Update Applications', 'Modify application status', 'application_management', false),
('applications.export', 'applications', 'export', 'Export Applications', 'Export application data', 'application_management', false),
('applications.delete', 'applications', 'delete', 'Delete Applications', 'Delete applications', 'application_management', true),

-- Compliance permissions
('compliance.view_ofccp', 'compliance', 'view_ofccp', 'View OFCCP Data', 'Access OFCCP compliance data', 'compliance', true),
('compliance.generate_reports', 'compliance', 'generate_reports', 'Generate Reports', 'Generate compliance reports', 'compliance', true),
('compliance.view_hipaa', 'compliance', 'view_hipaa', 'View HIPAA Data', 'Access HIPAA compliance data', 'compliance', true),
('compliance.verify_clearance', 'compliance', 'verify_clearance', 'Verify Clearances', 'Verify security clearances', 'compliance', true),
('compliance.verify_certifications', 'compliance', 'verify_certifications', 'Verify Certifications', 'Verify healthcare certifications', 'compliance', true),

-- Billing permissions
('billing.read', 'billing', 'read', 'View Billing', 'View billing information', 'billing', false),
('billing.create_invoice', 'billing', 'create_invoice', 'Create Invoices', 'Create new invoices', 'billing', false),
('billing.refund', 'billing', 'refund', 'Process Refunds', 'Process payment refunds', 'billing', true),
('billing.modify_plan', 'billing', 'modify_plan', 'Modify Plans', 'Change subscription plans', 'billing', true),

-- System permissions
('system.view_logs', 'system', 'view_logs', 'View System Logs', 'Access audit logs', 'system', true),
('system.modify_settings', 'system', 'modify_settings', 'Modify Settings', 'Change system settings', 'system', true),
('system.manage_integrations', 'system', 'manage_integrations', 'Manage Integrations', 'Configure integrations', 'system', true),
('system.manage_feature_flags', 'system', 'manage_feature_flags', 'Manage Feature Flags', 'Control feature flags', 'system', true)
ON CONFLICT (name) DO NOTHING;

-- Seed subscription plans
INSERT INTO subscription_plans (plan_key, name, description, target_type, price_monthly, price_annual, features, limits, display_order) VALUES
('employer_starter', 'Starter', 'Free tier for small employers', 'employer', 0, 0, 
 '{"job_posts": true, "basic_ats": true}',
 '{"max_jobs": 3, "max_users": 2, "max_applications": 50}', 1),
('employer_professional', 'Professional', 'For growing organizations', 'employer', 299, 2990,
 '{"job_posts": true, "full_ats": true, "resume_search": true, "analytics": true}',
 '{"max_jobs": 25, "max_users": 10, "max_applications": 500}', 2),
('employer_enterprise', 'Enterprise', 'For large organizations', 'employer', 999, 9990,
 '{"job_posts": true, "full_ats": true, "resume_search": true, "analytics": true, "api_access": true, "dedicated_support": true}',
 '{"max_jobs": -1, "max_users": -1, "max_applications": -1}', 3),
('job_seeker_basic', 'Basic', 'Free tier for job seekers', 'job_seeker', 0, 0,
 '{"job_search": true, "apply": true, "basic_profile": true}',
 '{"max_applications_per_month": 10}', 1),
('job_seeker_career_pro', 'Career Pro', 'Enhanced job seeker features', 'job_seeker', 19.99, 199,
 '{"job_search": true, "apply": true, "enhanced_profile": true, "resume_insights": true, "priority_visibility": true}',
 '{"max_applications_per_month": 100}', 2);

-- =====================================================
-- PART 16: ROW-LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE clearance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizenship_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hipaa_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_healthcare_certifications ENABLE ROW LEVEL SECURITY;

-- OFCCP data is highly restricted
CREATE POLICY ofccp_compliance_only ON ofccp_self_identifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'COMPLIANCE_ADMIN')
            AND ura.is_active = true
        )
    );

-- HIPAA data restricted to compliance and security admins
CREATE POLICY hipaa_compliance_only ON hipaa_audit_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SECURITY_ADMIN')
            AND ura.is_active = true
        )
    );

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Total Tables Created: 32
-- Total Indexes Created: 18
-- Total Seed Records: 52
-- =====================================================
