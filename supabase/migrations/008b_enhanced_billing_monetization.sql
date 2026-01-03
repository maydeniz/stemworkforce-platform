-- =====================================================
-- STEMWorkforce Platform - Enhanced Billing Schema
-- Complete Monetization Support
-- =====================================================
-- Migration: 008b_enhanced_billing_monetization.sql
-- Supports: All 6 stakeholder types, 7 revenue streams
-- =====================================================

-- =====================================================
-- PART 1: ENHANCED SUBSCRIPTION PLANS
-- =====================================================

-- Drop and recreate with full support
DROP TABLE IF EXISTS subscription_plans CASCADE;

CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Stakeholder Targeting (expanded)
    stakeholder_type VARCHAR(50) NOT NULL, 
    -- 'employer', 'training_provider', 'event_organizer', 'government', 'job_seeker', 'educator'
    
    -- Partner Type Restrictions (optional)
    allowed_partner_types TEXT[], -- ['federal', 'national_lab', 'private', etc.]
    
    -- Pricing Models
    pricing_model VARCHAR(50) NOT NULL DEFAULT 'subscription',
    -- 'subscription', 'per_event', 'per_lead', 'usage_based', 'custom'
    
    -- Subscription Pricing
    price_monthly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    price_per_event DECIMAL(10,2), -- For event organizers
    setup_fee DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Annual Discount
    annual_discount_percent INTEGER DEFAULT 17,
    
    -- Stripe Integration
    stripe_product_id VARCHAR(255),
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_annual VARCHAR(255),
    
    -- Plan Features (what's included)
    features JSONB NOT NULL DEFAULT '{}',
    /*
    Example features:
    {
        "job_postings": true,
        "ats_access": true,
        "analytics": "basic",
        "candidate_search": true,
        "api_access": false,
        "dedicated_support": false,
        "custom_branding": false
    }
    */
    
    -- Plan Limits
    limits JSONB NOT NULL DEFAULT '{}',
    /*
    Example limits:
    {
        "max_jobs_per_month": 25,
        "max_users": 10,
        "max_applications_per_month": 500,
        "max_resume_views": 50,
        "max_events_per_year": -1,  // -1 = unlimited
        "max_storage_gb": 5
    }
    */
    
    -- Trial Configuration
    trial_days INTEGER DEFAULT 0,
    trial_features JSONB, -- Features available during trial
    
    -- Status & Display
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    badge_text VARCHAR(50), -- 'POPULAR', 'BEST VALUE', 'NEW'
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 2: ADD-ON SERVICES (À LA CARTE)
-- =====================================================

CREATE TABLE addon_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    addon_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Targeting
    available_to_stakeholders TEXT[] NOT NULL, -- Which stakeholder types can purchase
    requires_plan_keys TEXT[], -- NULL = available to all, or specific plan keys required
    
    -- Pricing
    pricing_type VARCHAR(50) NOT NULL,
    -- 'one_time', 'per_unit', 'per_month', 'per_event', 'percentage'
    
    price DECIMAL(10,2) NOT NULL,
    price_unit VARCHAR(50), -- 'per job', 'per lead', 'per event', 'per month'
    percentage_rate DECIMAL(5,2), -- For commission-based (e.g., 10.00 = 10%)
    
    -- Stripe
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Limits
    max_quantity INTEGER, -- Max purchasable per period
    valid_days INTEGER, -- How long the addon is valid (NULL = permanent)
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 3: ADDON PURCHASES
-- =====================================================

CREATE TABLE addon_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    addon_id UUID REFERENCES addon_services(id),
    
    -- Purchaser
    purchaser_type VARCHAR(50) NOT NULL, -- 'user', 'organization'
    purchaser_id UUID NOT NULL,
    
    -- Purchase Details
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'paid', 'active', 'used', 'expired', 'refunded'
    
    -- Usage tracking
    quantity_used INTEGER DEFAULT 0,
    
    -- Validity
    purchased_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 4: EVENT-BASED BILLING
-- =====================================================

CREATE TABLE event_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    
    -- Event Type
    event_type VARCHAR(100), -- 'career_fair', 'conference', 'webinar', 'workshop'
    
    -- Billing Model
    billing_model VARCHAR(50) NOT NULL,
    -- 'flat_fee', 'per_attendee', 'per_booth', 'ticket_commission', 'hybrid'
    
    -- Flat Fee
    flat_fee DECIMAL(10,2),
    
    -- Per-Attendee
    per_attendee_fee DECIMAL(10,2),
    expected_attendees INTEGER,
    actual_attendees INTEGER,
    
    -- Booth Sales
    booth_fee DECIMAL(10,2),
    booths_sold INTEGER DEFAULT 0,
    
    -- Ticket Commission
    ticket_commission_percent DECIMAL(5,2),
    total_ticket_revenue DECIMAL(10,2) DEFAULT 0,
    commission_earned DECIMAL(10,2) DEFAULT 0,
    
    -- Sponsorship Revenue
    sponsorship_revenue DECIMAL(10,2) DEFAULT 0,
    platform_sponsorship_cut_percent DECIMAL(5,2) DEFAULT 10,
    
    -- Total Billing
    subtotal DECIMAL(10,2),
    platform_fee DECIMAL(10,2),
    taxes DECIMAL(10,2),
    total DECIMAL(10,2),
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    stripe_invoice_id VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 5: LEAD GENERATION BILLING
-- =====================================================

CREATE TABLE lead_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Lead Source
    lead_type VARCHAR(100) NOT NULL,
    -- 'program_inquiry', 'job_application', 'event_registration', 'contact_request'
    
    -- Provider (who receives the lead)
    provider_type VARCHAR(50) NOT NULL, -- 'training_provider', 'employer', 'event_organizer'
    provider_id UUID NOT NULL,
    
    -- Lead Details
    lead_user_id UUID,
    lead_data JSONB, -- Anonymized lead info
    
    -- Pricing
    lead_price DECIMAL(10,2) NOT NULL,
    
    -- Quality Score (optional)
    lead_quality_score INTEGER, -- 1-100
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'delivered', 'accepted', 'rejected', 'converted'
    
    -- Payment
    billed_at TIMESTAMPTZ,
    stripe_invoice_id VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 6: GOVERNMENT/ENTERPRISE CONTRACTS
-- =====================================================

CREATE TABLE enterprise_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Customer
    organization_id UUID NOT NULL,
    organization_name VARCHAR(255),
    contract_type VARCHAR(50) NOT NULL,
    -- 'government', 'enterprise', 'white_label', 'data_license', 'custom'
    
    -- Contract Details
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT false,
    
    -- Pricing
    contract_value DECIMAL(12,2) NOT NULL,
    billing_frequency VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'annual', 'one_time'
    payment_terms INTEGER DEFAULT 30, -- Net days
    
    -- Features & Access
    features JSONB,
    data_access_level VARCHAR(50), -- 'basic', 'advanced', 'full', 'custom'
    api_access BOOLEAN DEFAULT false,
    white_label BOOLEAN DEFAULT false,
    custom_domain VARCHAR(255),
    
    -- Geographic Scope
    geographic_scope TEXT[], -- ['California', 'Texas'] or ['National']
    industry_scope TEXT[], -- ['semiconductor', 'healthcare']
    
    -- Usage Limits
    limits JSONB,
    /*
    {
        "max_users": 100,
        "max_api_calls_per_month": 100000,
        "max_data_exports": 50,
        "custom_reports_included": 12
    }
    */
    
    -- Contacts
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    billing_contact_email VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft',
    -- 'draft', 'pending_approval', 'active', 'expiring', 'expired', 'terminated'
    
    -- Documents
    contract_document_path TEXT,
    signed_at TIMESTAMPTZ,
    signed_by VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract Invoices
CREATE TABLE contract_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES enterprise_contracts(id),
    
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Period
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    
    -- Amounts
    base_amount DECIMAL(10,2) NOT NULL,
    usage_charges DECIMAL(10,2) DEFAULT 0,
    adjustments DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft',
    -- 'draft', 'sent', 'paid', 'overdue', 'void'
    
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    
    -- Documents
    invoice_pdf_path TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 7: REVENUE TRACKING & ANALYTICS
-- =====================================================

CREATE TABLE revenue_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source
    revenue_type VARCHAR(50) NOT NULL,
    -- 'subscription', 'addon', 'event', 'lead', 'contract', 'sponsorship', 'ticket_commission'
    
    source_table VARCHAR(100) NOT NULL,
    source_id UUID NOT NULL,
    
    -- Customer
    customer_type VARCHAR(50) NOT NULL,
    customer_id UUID NOT NULL,
    customer_name VARCHAR(255),
    stakeholder_type VARCHAR(50),
    
    -- Amount
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    payment_processing_fee DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'completed', 'refunded', 'disputed', 'failed'
    
    -- Timing
    transaction_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    
    -- Categorization (for reporting)
    industry_sector VARCHAR(100),
    partner_type VARCHAR(50),
    geographic_region VARCHAR(100),
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly Revenue Summary (for dashboards)
CREATE TABLE revenue_monthly_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    year_month VARCHAR(7) NOT NULL, -- '2025-01'
    
    -- By Revenue Type
    subscription_revenue DECIMAL(12,2) DEFAULT 0,
    addon_revenue DECIMAL(12,2) DEFAULT 0,
    event_revenue DECIMAL(12,2) DEFAULT 0,
    lead_revenue DECIMAL(12,2) DEFAULT 0,
    contract_revenue DECIMAL(12,2) DEFAULT 0,
    sponsorship_revenue DECIMAL(12,2) DEFAULT 0,
    commission_revenue DECIMAL(12,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- By Stakeholder Type
    employer_revenue DECIMAL(12,2) DEFAULT 0,
    training_provider_revenue DECIMAL(12,2) DEFAULT 0,
    event_organizer_revenue DECIMAL(12,2) DEFAULT 0,
    government_revenue DECIMAL(12,2) DEFAULT 0,
    job_seeker_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Counts
    new_subscriptions INTEGER DEFAULT 0,
    churned_subscriptions INTEGER DEFAULT 0,
    total_active_subscriptions INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    mrr DECIMAL(12,2) DEFAULT 0, -- Monthly Recurring Revenue
    arr DECIMAL(12,2) DEFAULT 0, -- Annual Recurring Revenue
    arpu DECIMAL(10,2) DEFAULT 0, -- Average Revenue Per User
    churn_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(year_month)
);

-- =====================================================
-- PART 8: PRICING CONFIGURATION (Admin Editable)
-- =====================================================

CREATE TABLE pricing_configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    
    -- Categorization
    category VARCHAR(50) NOT NULL,
    -- 'platform_fees', 'commission_rates', 'lead_pricing', 'tax_rates'
    
    -- Value
    config_value JSONB NOT NULL,
    
    -- Description
    description TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    last_modified_by UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 9: SEED DATA - FULL MONETIZATION MODEL
-- =====================================================

-- Clear existing plans
DELETE FROM subscription_plans;

-- EMPLOYER PLANS
INSERT INTO subscription_plans (plan_key, name, description, stakeholder_type, pricing_model, price_monthly, price_annual, features, limits, trial_days, display_order, badge_text) VALUES
('employer_starter', 'Starter', 'For small businesses getting started with hiring', 'employer', 'subscription', 0, 0,
 '{"job_postings": true, "basic_profile": true, "apply_via_email": true, "job_fair_listings": true, "community_support": true, "ats_access": false, "analytics": false, "candidate_search": false}',
 '{"max_jobs_per_month": 3, "max_users": 2, "max_applications_per_month": 50}',
 0, 1, NULL),
 
('employer_professional', 'Professional', 'For growing companies with active hiring needs', 'employer', 'subscription', 499, 4990,
 '{"job_postings": true, "enhanced_profile": true, "ats_access": true, "analytics": "basic", "featured_category": 1, "email_support": true, "event_booth_credits": 5, "candidate_search": true}',
 '{"max_jobs_per_month": -1, "max_users": 10, "max_applications_per_month": 500, "max_resume_views": 50}',
 14, 2, 'POPULAR'),

('employer_enterprise', 'Enterprise', 'For large organizations with complex hiring needs', 'employer', 'subscription', 1999, 19990,
 '{"job_postings": true, "enhanced_profile": true, "ats_access": true, "analytics": "advanced", "featured_categories": -1, "dedicated_support": true, "api_access": true, "custom_branding": true, "sso": true, "candidate_search": true, "talent_pipeline": true}',
 '{"max_jobs_per_month": -1, "max_users": -1, "max_applications_per_month": -1, "max_resume_views": -1}',
 14, 3, 'BEST VALUE');

-- TRAINING PROVIDER PLANS
INSERT INTO subscription_plans (plan_key, name, description, stakeholder_type, pricing_model, price_monthly, price_annual, features, limits, trial_days, display_order) VALUES
('training_basic', 'Basic', 'Free tier for small training programs', 'training_provider', 'subscription', 0, 0,
 '{"program_listings": true, "basic_profile": true, "student_inquiries": false, "analytics": false}',
 '{"max_programs": 3, "max_users": 2}',
 0, 1),

('training_growth', 'Growth', 'For growing training institutions', 'training_provider', 'subscription', 299, 2990,
 '{"program_listings": true, "enhanced_profile": true, "student_inquiries": true, "analytics": "basic", "featured_placement": true, "email_support": true}',
 '{"max_programs": 25, "max_users": 10, "leads_per_month": 100}',
 14, 2),

('training_institution', 'Institution', 'For major universities and training centers', 'training_provider', 'subscription', 999, 9990,
 '{"program_listings": true, "enhanced_profile": true, "student_inquiries": true, "analytics": "advanced", "featured_placement": true, "dedicated_support": true, "api_access": true, "lms_integration": true}',
 '{"max_programs": -1, "max_users": -1, "leads_per_month": -1}',
 14, 3);

-- EVENT ORGANIZER PLANS
INSERT INTO subscription_plans (plan_key, name, description, stakeholder_type, pricing_model, price_monthly, price_annual, price_per_event, features, limits, display_order) VALUES
('event_community', 'Community', 'Free for non-profits and community events', 'event_organizer', 'subscription', 0, 0, NULL,
 '{"event_listings": true, "basic_registration": true, "attendee_management": true}',
 '{"max_events_per_year": 4, "max_attendees_per_event": 100}',
 1),

('event_professional', 'Professional', 'For career fairs and professional events', 'event_organizer', 'per_event', NULL, NULL, 199,
 '{"event_listings": true, "full_registration": true, "booth_management": true, "attendee_management": true, "basic_analytics": true, "email_marketing": true}',
 '{"max_attendees_per_event": 1000, "max_booths": 50}',
 2),

('event_enterprise', 'Enterprise', 'For large conferences and expo events', 'event_organizer', 'custom', NULL, NULL, NULL,
 '{"event_listings": true, "full_registration": true, "booth_management": true, "attendee_management": true, "advanced_analytics": true, "api_access": true, "custom_branding": true, "dedicated_support": true}',
 '{"max_attendees_per_event": -1, "max_booths": -1}',
 3);

-- GOVERNMENT & WORKFORCE BOARD PLANS
INSERT INTO subscription_plans (plan_key, name, description, stakeholder_type, pricing_model, price_monthly, price_annual, features, limits, display_order) VALUES
('gov_data_access', 'Data Access', 'Basic workforce analytics and reporting', 'government', 'subscription', 2500, 25000,
 '{"workforce_analytics": "basic", "labor_market_data": true, "regional_reports": true, "api_access": false}',
 '{"max_users": 5, "max_reports_per_month": 10, "data_exports": 5}',
 1),

('gov_regional_partner', 'Regional Partner', 'Full platform access for regional workforce boards', 'government', 'subscription', 7500, 75000,
 '{"workforce_analytics": "advanced", "labor_market_data": true, "regional_reports": true, "custom_reports": true, "api_access": true, "partner_portal": true}',
 '{"max_users": 25, "max_reports_per_month": -1, "data_exports": -1}',
 2),

('gov_state_national', 'State/National', 'Custom enterprise solution for state and national agencies', 'government', 'custom', NULL, NULL,
 '{"workforce_analytics": "full", "labor_market_data": true, "custom_reports": true, "api_access": true, "white_label": true, "dedicated_support": true, "sla": true}',
 '{"max_users": -1}',
 3);

-- JOB SEEKER PLANS
INSERT INTO subscription_plans (plan_key, name, description, stakeholder_type, pricing_model, price_monthly, price_annual, features, limits, trial_days, display_order) VALUES
('job_seeker_basic', 'Basic', 'Free access to job search', 'job_seeker', 'subscription', 0, 0,
 '{"job_search": true, "apply": true, "basic_profile": true, "job_alerts": true}',
 '{"max_applications_per_month": 10, "max_saved_jobs": 25}',
 0, 1),

('job_seeker_career_pro', 'Career Pro', 'Enhanced job seeking with premium features', 'job_seeker', 'subscription', 19.99, 149.99,
 '{"job_search": true, "apply": true, "enhanced_profile": true, "resume_insights": true, "priority_visibility": true, "salary_insights": true, "application_tracking": true, "interview_prep": true}',
 '{"max_applications_per_month": 100, "max_saved_jobs": -1}',
 7, 2),

('job_seeker_executive', 'Executive', 'Premium service for senior professionals', 'job_seeker', 'subscription', 49.99, 399.99,
 '{"job_search": true, "apply": true, "enhanced_profile": true, "resume_insights": true, "priority_visibility": true, "salary_insights": true, "application_tracking": true, "interview_prep": true, "career_coaching": true, "resume_review": true, "headhunter_visibility": true}',
 '{"max_applications_per_month": -1, "max_saved_jobs": -1}',
 7, 3);

-- ADD-ON SERVICES
INSERT INTO addon_services (addon_key, name, description, available_to_stakeholders, pricing_type, price, price_unit, valid_days, display_order) VALUES
('featured_job_boost', 'Featured Job Boost', 'Highlight your job posting for 30 days', ARRAY['employer'], 'one_time', 99, 'per job', 30, 1),
('urgent_hiring_badge', 'Urgent Hiring Badge', 'Show urgency with special badge', ARRAY['employer'], 'one_time', 49, 'per job', 14, 2),
('email_campaign', 'Targeted Email Campaign', 'Reach qualified candidates via email', ARRAY['employer'], 'one_time', 499, 'per campaign', NULL, 3),
('sponsored_content', 'Sponsored Content', 'Publish branded content to platform', ARRAY['employer', 'training_provider'], 'one_time', 399, 'per article', 30, 4),
('premium_analytics_report', 'Custom Analytics Report', 'Deep-dive analysis with recommendations', ARRAY['employer', 'training_provider', 'government'], 'one_time', 1500, 'per report', NULL, 5),
('additional_users', 'Additional Users', 'Add more team members to your account', ARRAY['employer', 'training_provider'], 'per_month', 25, 'per user', NULL, 6),
('resume_database_access', 'Resume Database Access', '30-day access to resume search', ARRAY['employer'], 'one_time', 299, 'per month', 30, 7),
('career_fair_booth', 'Virtual Career Fair Booth', 'Premium booth at platform career fairs', ARRAY['employer'], 'per_event', 500, 'per event', NULL, 8),
('event_sponsorship_bronze', 'Bronze Event Sponsorship', 'Basic sponsorship package', ARRAY['employer', 'training_provider'], 'per_event', 2500, 'per event', NULL, 9),
('event_sponsorship_silver', 'Silver Event Sponsorship', 'Enhanced sponsorship with speaking slot', ARRAY['employer', 'training_provider'], 'per_event', 5000, 'per event', NULL, 10),
('event_sponsorship_gold', 'Gold Event Sponsorship', 'Premium sponsorship with keynote opportunity', ARRAY['employer', 'training_provider'], 'per_event', 10000, 'per event', NULL, 11),
('api_overage', 'API Overage', 'Additional API calls beyond plan limit', ARRAY['employer', 'training_provider', 'government'], 'per_unit', 0.01, 'per 1000 calls', NULL, 12);

-- PRICING CONFIGURATION
INSERT INTO pricing_configuration (config_key, category, config_value, description) VALUES
('platform_commission_events', 'commission_rates', '{"ticket_sales": 5.0, "sponsorship": 10.0, "booth_sales": 15.0}', 'Platform commission rates for event revenue'),
('platform_commission_leads', 'commission_rates', '{"training_inquiry": 25, "job_application": 0, "event_registration": 5}', 'Lead fees by type (flat rate)'),
('payment_processing', 'platform_fees', '{"stripe_percentage": 2.9, "stripe_fixed": 0.30, "platform_markup": 0}', 'Payment processing fees'),
('lead_pricing_by_quality', 'lead_pricing', '{"low": 15, "medium": 35, "high": 75, "qualified": 100}', 'Lead pricing by quality score tier'),
('tax_rates', 'tax_rates', '{"default": 0, "CA": 7.25, "TX": 6.25, "NY": 8.0}', 'Tax rates by state');

-- =====================================================
-- PART 10: INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_plans_stakeholder ON subscription_plans(stakeholder_type);
CREATE INDEX idx_plans_active ON subscription_plans(is_active) WHERE is_active = true;

CREATE INDEX idx_addon_purchases_purchaser ON addon_purchases(purchaser_type, purchaser_id);
CREATE INDEX idx_addon_purchases_status ON addon_purchases(status);

CREATE INDEX idx_event_billing_org ON event_billing(organization_id);
CREATE INDEX idx_event_billing_status ON event_billing(payment_status);

CREATE INDEX idx_lead_billing_provider ON lead_billing(provider_type, provider_id);
CREATE INDEX idx_lead_billing_status ON lead_billing(status);

CREATE INDEX idx_contracts_org ON enterprise_contracts(organization_id);
CREATE INDEX idx_contracts_status ON enterprise_contracts(status);

CREATE INDEX idx_revenue_type ON revenue_transactions(revenue_type);
CREATE INDEX idx_revenue_date ON revenue_transactions(transaction_date);
CREATE INDEX idx_revenue_customer ON revenue_transactions(customer_type, customer_id);

-- =====================================================
-- PART 11: REVENUE CALCULATION FUNCTIONS
-- =====================================================

-- Function to calculate MRR
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS DECIMAL(12,2) AS $$
DECLARE
    total_mrr DECIMAL(12,2);
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN sp.price_annual IS NOT NULL AND sp.price_annual > 0 
            THEN sp.price_annual / 12
            ELSE sp.price_monthly
        END
    ), 0)
    INTO total_mrr
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.status = 'active';
    
    RETURN total_mrr;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate ARR
CREATE OR REPLACE FUNCTION calculate_arr()
RETURNS DECIMAL(12,2) AS $$
BEGIN
    RETURN calculate_mrr() * 12;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- New Tables: 8
-- Total Subscription Plans: 14
-- Add-on Services: 12
-- Revenue Streams Supported: 7
-- =====================================================
