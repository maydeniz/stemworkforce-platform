-- =====================================================
-- STEMWorkforce Platform - Complete Monetization Schema
-- All Revenue Streams Implementation
-- =====================================================
-- Migration: 008c_complete_monetization.sql
-- New Tables: 25
-- Revenue Streams: Advertising, Marketplace, Referrals, 
--                  API Licensing, Premium Content, Syndication
-- =====================================================

-- =====================================================
-- PART 1: ADVERTISING SYSTEM
-- =====================================================

-- Advertisers (companies that buy ads)
CREATE TABLE IF NOT EXISTS advertisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID, -- Link to existing org if applicable
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    billing_email VARCHAR(255),
    
    -- Account Details
    account_type VARCHAR(50) DEFAULT 'self_serve', -- 'self_serve', 'managed', 'agency'
    credit_balance DECIMAL(10,2) DEFAULT 0,
    
    -- Stripe
    stripe_customer_id VARCHAR(255),
    
    -- Status
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Campaigns
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advertiser_id UUID REFERENCES advertisers(id) NOT NULL,
    
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL,
    -- 'banner', 'sponsored_job', 'industry_spotlight', 'newsletter', 'sidebar'
    
    -- Targeting
    target_industries TEXT[], -- ['semiconductor', 'quantum', 'ai_ml', etc.]
    target_user_types TEXT[], -- ['job_seeker', 'employer', 'educator']
    target_locations TEXT[], -- States or 'national'
    target_clearance_levels TEXT[], -- For defense industry targeting
    
    -- Budget
    budget_type VARCHAR(50) NOT NULL, -- 'daily', 'total', 'unlimited'
    budget_daily DECIMAL(10,2),
    budget_total DECIMAL(10,2),
    spent_total DECIMAL(10,2) DEFAULT 0,
    
    -- Pricing Model
    pricing_model VARCHAR(50) NOT NULL, -- 'cpm', 'cpc', 'flat_rate'
    cpm_rate DECIMAL(10,2), -- Cost per 1000 impressions
    cpc_rate DECIMAL(10,2), -- Cost per click
    flat_rate DECIMAL(10,2), -- For sponsored placements
    
    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft',
    -- 'draft', 'pending_review', 'active', 'paused', 'completed', 'rejected'
    
    -- Review
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Metrics (denormalized for performance)
    total_impressions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Creatives
CREATE TABLE IF NOT EXISTS ad_creatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    
    creative_name VARCHAR(255),
    creative_type VARCHAR(50) NOT NULL, -- 'image', 'text', 'html', 'job_card'
    
    -- Content
    headline VARCHAR(255),
    description TEXT,
    image_url TEXT,
    image_alt_text VARCHAR(255),
    click_url TEXT NOT NULL,
    
    -- Dimensions (for banners)
    width INTEGER,
    height INTEGER,
    ad_size VARCHAR(50), -- 'leaderboard_728x90', 'sidebar_300x250', 'mobile_320x50'
    
    -- For Sponsored Jobs
    job_id UUID, -- Reference to promoted job
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- A/B Testing
    traffic_weight INTEGER DEFAULT 100, -- Percentage of traffic
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Placements (where ads can appear)
CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_key VARCHAR(100) UNIQUE NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    page_type VARCHAR(100) NOT NULL, -- 'homepage', 'job_search', 'industry_page', 'profile'
    position VARCHAR(100) NOT NULL, -- 'header', 'sidebar', 'inline', 'footer'
    
    -- Specifications
    ad_sizes TEXT[] NOT NULL, -- ['728x90', '300x250']
    
    -- Targeting
    industry_specific BOOLEAN DEFAULT false,
    industry VARCHAR(100), -- If industry_specific
    
    -- Pricing
    base_cpm DECIMAL(10,2) NOT NULL,
    premium_multiplier DECIMAL(3,2) DEFAULT 1.0, -- For high-value placements
    
    -- Availability
    max_ads_per_page INTEGER DEFAULT 3,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Impressions (partitioned by date for scale)
CREATE TABLE IF NOT EXISTS ad_impressions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL,
    creative_id UUID NOT NULL,
    placement_id UUID,
    
    -- Context
    user_id UUID, -- NULL for anonymous
    session_id VARCHAR(100),
    page_url TEXT,
    industry_context VARCHAR(100),
    
    -- User Attributes (for targeting verification)
    user_type VARCHAR(50),
    user_tier VARCHAR(50), -- 'free', 'premium'
    
    -- Billing
    cost DECIMAL(10,4), -- Actual cost of this impression
    
    impression_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partitions for current and next month

-- Ad Clicks
CREATE TABLE IF NOT EXISTS ad_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    impression_id UUID,
    campaign_id UUID NOT NULL,
    creative_id UUID NOT NULL,
    
    -- Context
    user_id UUID,
    click_url TEXT,
    
    -- Billing
    cost DECIMAL(10,4),
    
    -- Fraud Detection
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_valid BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Sponsorships
CREATE TABLE IF NOT EXISTS newsletter_sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advertiser_id UUID REFERENCES advertisers(id),
    
    -- Newsletter Details
    newsletter_type VARCHAR(100) NOT NULL,
    -- 'weekly_job_digest', 'industry_update', 'career_tips', 'employer_insights'
    
    target_industries TEXT[],
    target_user_types TEXT[],
    
    -- Content
    sponsor_headline VARCHAR(255),
    sponsor_description TEXT,
    sponsor_image_url TEXT,
    sponsor_click_url TEXT,
    
    -- Schedule
    scheduled_date DATE NOT NULL,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    
    -- Metrics
    emails_sent INTEGER,
    opens INTEGER,
    clicks INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'approved', 'scheduled', 'sent', 'cancelled'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industry Spotlight Sponsorships (premium placement)
CREATE TABLE IF NOT EXISTS industry_sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advertiser_id UUID REFERENCES advertisers(id),
    
    industry VARCHAR(100) NOT NULL,
    sponsorship_level VARCHAR(50) NOT NULL, -- 'presenting', 'premier', 'supporting'
    
    -- Content
    company_logo_url TEXT,
    company_description TEXT,
    featured_jobs_limit INTEGER DEFAULT 3,
    
    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Pricing
    monthly_rate DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 2: MARKETPLACE SYSTEM
-- =====================================================

-- Service Categories
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    
    -- Commission
    platform_commission_percent DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Providers
CREATE TABLE IF NOT EXISTS marketplace_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Profile
    display_name VARCHAR(255) NOT NULL,
    headline VARCHAR(500),
    bio TEXT,
    profile_image_url TEXT,
    
    -- Services
    category_id UUID REFERENCES marketplace_categories(id),
    service_types TEXT[] NOT NULL, -- ['resume_review', 'career_coaching', 'interview_prep']
    
    -- Specializations
    industries TEXT[],
    career_levels TEXT[], -- ['entry', 'mid', 'senior', 'executive']
    specializations TEXT[], -- ['tech', 'federal', 'healthcare', etc.]
    
    -- Pricing
    hourly_rate DECIMAL(10,2),
    session_rates JSONB, -- {"30min": 75, "60min": 125, "90min": 175}
    package_rates JSONB, -- {"resume_review": 149, "full_package": 499}
    
    -- Availability
    availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'busy', 'unavailable'
    timezone VARCHAR(100),
    available_hours JSONB, -- Weekly schedule
    
    -- Ratings
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verification_documents JSONB,
    
    -- Payout
    stripe_connect_id VARCHAR(255),
    payout_schedule VARCHAR(50) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Listings (specific services offered)
CREATE TABLE IF NOT EXISTS marketplace_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES marketplace_providers(id) ON DELETE CASCADE,
    
    service_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    pricing_type VARCHAR(50) NOT NULL, -- 'hourly', 'fixed', 'package'
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER, -- For time-based services
    
    -- Deliverables
    deliverables TEXT[],
    
    -- Limits
    max_revisions INTEGER,
    delivery_days INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Bookings
CREATE TABLE IF NOT EXISTS marketplace_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    
    provider_id UUID REFERENCES marketplace_providers(id),
    service_id UUID REFERENCES marketplace_services(id),
    client_id UUID NOT NULL,
    
    -- Service Details
    service_type VARCHAR(100) NOT NULL,
    service_title VARCHAR(255),
    
    -- Scheduling (for sessions)
    scheduled_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    timezone VARCHAR(100),
    meeting_url TEXT,
    
    -- Pricing
    service_price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    provider_payout DECIMAL(10,2) NOT NULL,
    
    -- Payment
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'paid', 'refunded', 'disputed'
    paid_at TIMESTAMPTZ,
    
    -- Payout
    payout_status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'processing', 'paid', 'held'
    payout_at TIMESTAMPTZ,
    stripe_transfer_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
    
    -- Completion
    completed_at TIMESTAMPTZ,
    deliverables_url TEXT,
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancelled_by VARCHAR(50), -- 'client', 'provider', 'system'
    cancellation_reason TEXT,
    refund_amount DECIMAL(10,2),
    
    -- Notes
    client_notes TEXT,
    provider_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Reviews
CREATE TABLE IF NOT EXISTS marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES marketplace_bookings(id) UNIQUE,
    
    provider_id UUID REFERENCES marketplace_providers(id),
    reviewer_id UUID NOT NULL,
    
    -- Ratings (1-5)
    rating_overall INTEGER NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
    rating_communication INTEGER CHECK (rating_communication >= 1 AND rating_communication <= 5),
    rating_expertise INTEGER CHECK (rating_expertise >= 1 AND rating_expertise <= 5),
    rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
    
    -- Review
    review_title VARCHAR(255),
    review_text TEXT,
    
    -- Response
    provider_response TEXT,
    provider_responded_at TIMESTAMPTZ,
    
    -- Moderation
    is_visible BOOLEAN DEFAULT true,
    flagged_at TIMESTAMPTZ,
    flagged_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 3: REFERRAL PROGRAMS
-- =====================================================

-- Referral Programs
CREATE TABLE IF NOT EXISTS referral_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_key VARCHAR(100) UNIQUE NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Targeting
    referrer_types TEXT[] NOT NULL, -- Who can refer: ['user', 'employer', 'partner']
    referee_types TEXT[] NOT NULL, -- Who can be referred
    
    -- Rewards
    referrer_reward_type VARCHAR(50) NOT NULL, -- 'credit', 'cash', 'subscription_discount'
    referrer_reward_amount DECIMAL(10,2),
    referrer_reward_percent DECIMAL(5,2),
    referrer_reward_months INTEGER, -- For subscription discounts
    
    referee_reward_type VARCHAR(50), -- Reward for the person being referred
    referee_reward_amount DECIMAL(10,2),
    
    -- Qualification
    qualification_event VARCHAR(100) NOT NULL,
    -- 'signup', 'profile_complete', 'first_application', 'subscription', 'first_hire'
    qualification_value DECIMAL(10,2), -- Min subscription value, etc.
    
    -- Limits
    max_referrals_per_user INTEGER,
    max_reward_per_user DECIMAL(10,2),
    budget_total DECIMAL(12,2),
    budget_used DECIMAL(12,2) DEFAULT 0,
    
    -- Schedule
    start_date DATE,
    end_date DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Codes
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES referral_programs(id),
    
    referrer_id UUID NOT NULL,
    referrer_type VARCHAR(50) NOT NULL, -- 'user', 'organization'
    
    code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Tracking
    visits INTEGER DEFAULT 0,
    signups INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    total_reward_earned DECIMAL(10,2) DEFAULT 0,
    
    -- Limits
    max_uses INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Conversions
CREATE TABLE IF NOT EXISTS referral_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id UUID REFERENCES referral_codes(id),
    program_id UUID REFERENCES referral_programs(id),
    
    -- Referrer
    referrer_id UUID NOT NULL,
    
    -- Referee
    referee_id UUID NOT NULL,
    referee_type VARCHAR(50) NOT NULL,
    
    -- Conversion Details
    conversion_event VARCHAR(100) NOT NULL,
    conversion_value DECIMAL(10,2),
    
    -- Rewards
    referrer_reward_amount DECIMAL(10,2),
    referrer_reward_status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'approved', 'paid', 'rejected'
    referrer_paid_at TIMESTAMPTZ,
    
    referee_reward_amount DECIMAL(10,2),
    referee_reward_status VARCHAR(50),
    referee_applied_at TIMESTAMPTZ,
    
    -- Validation
    is_valid BOOLEAN DEFAULT true,
    invalidation_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Referral Credits
CREATE TABLE IF NOT EXISTS referral_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    -- Balance
    credit_balance DECIMAL(10,2) DEFAULT 0,
    lifetime_earned DECIMAL(10,2) DEFAULT 0,
    lifetime_used DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Credit Transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'expire', 'refund'
    amount DECIMAL(10,2) NOT NULL,
    
    -- Source/Use
    source_type VARCHAR(100), -- 'referral', 'promotion', 'refund'
    source_id UUID,
    
    used_for_type VARCHAR(100), -- 'subscription', 'addon', 'marketplace'
    used_for_id UUID,
    
    -- Balance
    balance_before DECIMAL(10,2),
    balance_after DECIMAL(10,2),
    
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 4: API & DATA LICENSING
-- =====================================================

-- API Products/Tiers
CREATE TABLE IF NOT EXISTS api_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_key VARCHAR(100) UNIQUE NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    price_monthly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    
    -- Rate Limits
    rate_limit_per_minute INTEGER NOT NULL,
    rate_limit_per_day INTEGER NOT NULL,
    rate_limit_per_month INTEGER,
    
    -- Access
    allowed_endpoints TEXT[] NOT NULL,
    data_access_level VARCHAR(50) NOT NULL, -- 'basic', 'standard', 'premium', 'enterprise'
    
    -- Features
    features JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Clients
CREATE TABLE IF NOT EXISTS api_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    
    client_name VARCHAR(255) NOT NULL,
    client_description TEXT,
    
    -- API Product
    api_product_id UUID REFERENCES api_products(id),
    
    -- Credentials
    api_key_prefix VARCHAR(10) NOT NULL, -- First 10 chars for identification
    api_key_hash VARCHAR(255) NOT NULL UNIQUE,
    
    -- Custom Limits (override product limits)
    custom_rate_limit_minute INTEGER,
    custom_rate_limit_day INTEGER,
    custom_rate_limit_month INTEGER,
    
    -- Billing
    stripe_subscription_id VARCHAR(255),
    billing_email VARCHAR(255),
    
    -- Usage This Period
    current_period_start DATE,
    current_period_usage INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    suspended_at TIMESTAMPTZ,
    suspension_reason TEXT,
    
    -- Metadata
    allowed_ips TEXT[], -- IP whitelist
    webhook_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Logs (partitioned)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    
    -- Request Details
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    
    -- Response
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    
    -- Context
    ip_address VARCHAR(45),
    
    -- Date for partitioning
    request_date DATE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partitions

-- Data Products (Reports, Datasets)
CREATE TABLE IF NOT EXISTS data_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_key VARCHAR(100) UNIQUE NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Type
    product_type VARCHAR(50) NOT NULL, -- 'report', 'dataset', 'dashboard_access'
    
    -- Content
    industries TEXT[], -- Which industries this covers
    data_categories TEXT[], -- 'salary', 'skills', 'labor_market', 'trends'
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL, -- 'one_time', 'subscription', 'per_download'
    
    -- Access
    access_duration_days INTEGER, -- NULL for permanent
    download_limit INTEGER, -- NULL for unlimited
    
    -- Preview
    sample_url TEXT,
    preview_pages INTEGER,
    
    -- Files
    file_url TEXT,
    file_format VARCHAR(50), -- 'pdf', 'xlsx', 'csv', 'json'
    file_size_bytes BIGINT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Product Purchases
CREATE TABLE IF NOT EXISTS data_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES data_products(id),
    
    purchaser_type VARCHAR(50) NOT NULL, -- 'user', 'organization'
    purchaser_id UUID NOT NULL,
    
    -- Pricing
    price_paid DECIMAL(10,2) NOT NULL,
    
    -- Payment
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Access
    access_granted_at TIMESTAMPTZ,
    access_expires_at TIMESTAMPTZ,
    
    -- Usage
    download_count INTEGER DEFAULT 0,
    last_download_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 5: JOB SYNDICATION
-- =====================================================

-- Syndication Partners (job boards we post to)
CREATE TABLE IF NOT EXISTS syndication_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_key VARCHAR(100) UNIQUE NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    
    -- Integration
    integration_type VARCHAR(50) NOT NULL, -- 'api', 'xml_feed', 'manual'
    api_endpoint TEXT,
    api_credentials_encrypted TEXT,
    
    -- Pricing (what we charge employers)
    price_per_job DECIMAL(10,2),
    price_bundle_5 DECIMAL(10,2),
    price_bundle_10 DECIMAL(10,2),
    
    -- Our Cost
    our_cost_per_job DECIMAL(10,2),
    
    -- Categories
    job_categories TEXT[], -- What types of jobs this board accepts
    industries TEXT[], -- Industries served
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syndication Orders
CREATE TABLE IF NOT EXISTS syndication_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Customer
    organization_id UUID NOT NULL,
    ordered_by UUID NOT NULL,
    
    -- Jobs
    job_ids UUID[] NOT NULL,
    job_count INTEGER NOT NULL,
    
    -- Partners
    partner_ids UUID[] NOT NULL,
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'processing', 'completed', 'partial', 'failed'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syndication Job Posts (individual postings)
CREATE TABLE IF NOT EXISTS syndication_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES syndication_orders(id),
    
    job_id UUID NOT NULL,
    partner_id UUID REFERENCES syndication_partners(id),
    
    -- External Reference
    external_job_id VARCHAR(255),
    external_url TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'submitted', 'live', 'expired', 'failed', 'removed'
    
    -- Dates
    submitted_at TIMESTAMPTZ,
    live_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metrics
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 6: AD-FREE TIER CONFIGURATION
-- =====================================================

-- Tier Ad Settings (which tiers see ads)
CREATE TABLE IF NOT EXISTS tier_ad_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Tier identification
    stakeholder_type VARCHAR(50) NOT NULL,
    plan_key VARCHAR(100) NOT NULL,
    
    -- Ad Settings
    show_banner_ads BOOLEAN DEFAULT true,
    show_sponsored_jobs BOOLEAN DEFAULT true,
    show_sidebar_ads BOOLEAN DEFAULT true,
    show_newsletter_ads BOOLEAN DEFAULT true,
    
    -- Limits
    max_ads_per_page INTEGER DEFAULT 3,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(stakeholder_type, plan_key)
);

-- =====================================================
-- PART 7: SEED DATA
-- =====================================================

-- Marketplace Categories
INSERT INTO marketplace_categories (category_key, name, description, platform_commission_percent, display_order) VALUES
('career_coaching', 'Career Coaching', 'One-on-one career guidance and strategy sessions', 15.00, 1),
('resume_services', 'Resume Services', 'Professional resume writing and review', 15.00, 2),
('interview_prep', 'Interview Preparation', 'Mock interviews and coaching', 15.00, 3),
('linkedin_optimization', 'LinkedIn Optimization', 'Profile optimization and networking strategy', 15.00, 4),
('salary_negotiation', 'Salary Negotiation', 'Compensation negotiation coaching', 20.00, 5),
('executive_coaching', 'Executive Coaching', 'Leadership and executive career development', 20.00, 6),
('federal_career', 'Federal Career Specialist', 'USAJobs and federal hiring expertise', 15.00, 7),
('security_clearance', 'Clearance Career Coach', 'Careers requiring security clearances', 15.00, 8),
('skills_assessment', 'Skills Assessment', 'Technical and soft skills evaluation', 20.00, 9),
('career_transition', 'Career Transition', 'Industry and role change guidance', 15.00, 10);

-- Referral Programs
INSERT INTO referral_programs (program_key, name, description, referrer_types, referee_types, referrer_reward_type, referrer_reward_amount, referee_reward_type, referee_reward_amount, qualification_event, is_active) VALUES
('user_referral', 'Refer a Friend', 'Earn $25 when friends join and complete their profile', ARRAY['job_seeker'], ARRAY['job_seeker'], 'credit', 25.00, 'credit', 10.00, 'profile_complete', true),
('employer_referral', 'Employer Referral', 'Earn 10% of first month subscription when you refer employers', ARRAY['employer', 'job_seeker'], ARRAY['employer'], 'credit', NULL, NULL, NULL, 'subscription', true),
('partner_affiliate', 'Partner Affiliate', 'Earn 15% recurring commission on referrals', ARRAY['partner'], ARRAY['employer', 'training_provider'], 'cash', NULL, NULL, NULL, 'subscription', true);

-- Update referral program with percentage
UPDATE referral_programs SET referrer_reward_percent = 10.00 WHERE program_key = 'employer_referral';
UPDATE referral_programs SET referrer_reward_percent = 15.00 WHERE program_key = 'partner_affiliate';

-- API Products
INSERT INTO api_products (product_key, name, description, price_monthly, price_annual, rate_limit_per_minute, rate_limit_per_day, rate_limit_per_month, allowed_endpoints, data_access_level, display_order) VALUES
('api_basic', 'Basic API', 'Essential labor market data access', 500, 5000, 10, 1000, 25000, ARRAY['/jobs', '/skills', '/industries'], 'basic', 1),
('api_professional', 'Professional API', 'Enhanced data with salary insights', 1500, 15000, 30, 5000, 100000, ARRAY['/jobs', '/skills', '/industries', '/salaries', '/trends'], 'standard', 2),
('api_enterprise', 'Enterprise API', 'Full platform data access', 5000, 50000, 100, 25000, 500000, ARRAY['*'], 'premium', 3);

-- Data Products
INSERT INTO data_products (product_key, name, description, product_type, industries, data_categories, price, pricing_model, is_featured) VALUES
('salary_guide_semiconductor', 'Semiconductor Industry Salary Guide 2025', 'Comprehensive salary data for semiconductor roles', 'report', ARRAY['semiconductor'], ARRAY['salary'], 149.00, 'one_time', true),
('salary_guide_quantum', 'Quantum Computing Salary Guide 2025', 'Salary benchmarks for quantum computing professionals', 'report', ARRAY['quantum_computing'], ARRAY['salary'], 149.00, 'one_time', true),
('skills_demand_report', 'Emerging Tech Skills Demand Report', 'Quarterly analysis of in-demand skills', 'report', ARRAY['all'], ARRAY['skills', 'trends'], 299.00, 'one_time', true),
('workforce_analytics_dataset', 'Workforce Analytics Dataset', 'Anonymized workforce data for research', 'dataset', ARRAY['all'], ARRAY['labor_market'], 2500.00, 'subscription', false);

-- Syndication Partners
INSERT INTO syndication_partners (partner_key, name, integration_type, price_per_job, price_bundle_5, price_bundle_10, our_cost_per_job, industries, is_active) VALUES
('indeed', 'Indeed', 'api', 99.00, 449.00, 799.00, 50.00, ARRAY['all'], true),
('linkedin', 'LinkedIn', 'api', 199.00, 899.00, 1599.00, 100.00, ARRAY['all'], true),
('glassdoor', 'Glassdoor', 'api', 149.00, 649.00, 1199.00, 75.00, ARRAY['all'], true),
('dice', 'Dice', 'api', 149.00, 649.00, 1199.00, 75.00, ARRAY['technology', 'semiconductor', 'ai_ml', 'cybersecurity'], true),
('clearancejobs', 'ClearanceJobs', 'api', 199.00, 899.00, 1599.00, 100.00, ARRAY['aerospace_defense', 'cybersecurity'], true),
('usajobs', 'USAJobs', 'xml_feed', 49.00, 199.00, 349.00, 0.00, ARRAY['government'], true);

-- Ad Placements
INSERT INTO ad_placements (placement_key, name, page_type, position, ad_sizes, industry_specific, base_cpm, premium_multiplier) VALUES
('homepage_leaderboard', 'Homepage Leaderboard', 'homepage', 'header', ARRAY['728x90', '970x90'], false, 25.00, 1.5),
('homepage_sidebar', 'Homepage Sidebar', 'homepage', 'sidebar', ARRAY['300x250', '300x600'], false, 15.00, 1.0),
('job_search_top', 'Job Search Results Top', 'job_search', 'header', ARRAY['728x90'], false, 35.00, 1.0),
('job_search_sidebar', 'Job Search Sidebar', 'job_search', 'sidebar', ARRAY['300x250'], false, 20.00, 1.0),
('industry_semiconductor', 'Semiconductor Industry Page', 'industry_page', 'header', ARRAY['728x90', '970x250'], true, 45.00, 2.0),
('industry_quantum', 'Quantum Computing Industry Page', 'industry_page', 'header', ARRAY['728x90', '970x250'], true, 50.00, 2.5),
('industry_ai_ml', 'AI/ML Industry Page', 'industry_page', 'header', ARRAY['728x90', '970x250'], true, 50.00, 2.0),
('industry_healthcare', 'Healthcare Industry Page', 'industry_page', 'header', ARRAY['728x90', '970x250'], true, 40.00, 1.5);

-- Update industry-specific placements
UPDATE ad_placements SET industry = 'semiconductor' WHERE placement_key = 'industry_semiconductor';
UPDATE ad_placements SET industry = 'quantum_computing' WHERE placement_key = 'industry_quantum';
UPDATE ad_placements SET industry = 'ai_ml' WHERE placement_key = 'industry_ai_ml';
UPDATE ad_placements SET industry = 'healthcare' WHERE placement_key = 'industry_healthcare';

-- Tier Ad Settings (Free tiers see ads, paid don't)
INSERT INTO tier_ad_settings (stakeholder_type, plan_key, show_banner_ads, show_sponsored_jobs, show_sidebar_ads, show_newsletter_ads) VALUES
-- Job Seekers
('job_seeker', 'job_seeker_basic', true, true, true, true),
('job_seeker', 'job_seeker_career_pro', false, true, false, false),
('job_seeker', 'job_seeker_executive', false, false, false, false),
-- Employers
('employer', 'employer_starter', true, true, true, true),
('employer', 'employer_professional', false, false, false, false),
('employer', 'employer_enterprise', false, false, false, false),
-- Training Providers
('training_provider', 'training_basic', true, true, true, true),
('training_provider', 'training_growth', false, false, false, false),
('training_provider', 'training_institution', false, false, false, false),
-- Government (never show ads)
('government', 'gov_data_access', false, false, false, false),
('government', 'gov_regional_partner', false, false, false, false),
('government', 'gov_state_national', false, false, false, false);

-- =====================================================
-- PART 8: INDEXES
-- =====================================================

-- Advertising indexes
CREATE INDEX idx_ad_campaigns_advertiser ON ad_campaigns(advertiser_id);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status) WHERE status = 'active';
CREATE INDEX idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);
CREATE INDEX idx_ad_creatives_campaign ON ad_creatives(campaign_id);
CREATE INDEX idx_ad_impressions_campaign ON ad_impressions(campaign_id, impression_date);
CREATE INDEX idx_ad_clicks_campaign ON ad_clicks(campaign_id);

-- Marketplace indexes
CREATE INDEX idx_marketplace_providers_category ON marketplace_providers(category_id);
CREATE INDEX idx_marketplace_providers_active ON marketplace_providers(is_active) WHERE is_active = true;
CREATE INDEX idx_marketplace_providers_rating ON marketplace_providers(rating_average DESC);
CREATE INDEX idx_marketplace_bookings_provider ON marketplace_bookings(provider_id);
CREATE INDEX idx_marketplace_bookings_client ON marketplace_bookings(client_id);
CREATE INDEX idx_marketplace_bookings_status ON marketplace_bookings(status);
CREATE INDEX idx_marketplace_reviews_provider ON marketplace_reviews(provider_id);

-- Referral indexes
CREATE INDEX idx_referral_codes_referrer ON referral_codes(referrer_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_referral_conversions_referrer ON referral_conversions(referrer_id);
CREATE INDEX idx_referral_conversions_referee ON referral_conversions(referee_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);

-- API indexes
CREATE INDEX idx_api_clients_org ON api_clients(organization_id);
CREATE INDEX idx_api_usage_client ON api_usage_logs(client_id, request_date);

-- Syndication indexes
CREATE INDEX idx_syndication_orders_org ON syndication_orders(organization_id);
CREATE INDEX idx_syndication_posts_job ON syndication_posts(job_id);
CREATE INDEX idx_syndication_posts_status ON syndication_posts(status);

-- =====================================================
-- PART 9: HELPER FUNCTIONS
-- =====================================================

-- Function to check if user should see ads
CREATE OR REPLACE FUNCTION should_show_ads(
    p_user_id UUID,
    p_stakeholder_type VARCHAR,
    p_plan_key VARCHAR,
    p_ad_type VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_show_ads BOOLEAN;
BEGIN
    SELECT 
        CASE p_ad_type
            WHEN 'banner' THEN show_banner_ads
            WHEN 'sponsored_job' THEN show_sponsored_jobs
            WHEN 'sidebar' THEN show_sidebar_ads
            WHEN 'newsletter' THEN show_newsletter_ads
            ELSE false
        END
    INTO v_show_ads
    FROM tier_ad_settings
    WHERE stakeholder_type = p_stakeholder_type
    AND plan_key = p_plan_key;
    
    RETURN COALESCE(v_show_ads, true); -- Default to showing ads if no setting found
END;
$$ LANGUAGE plpgsql;

-- Function to calculate provider rating
CREATE OR REPLACE FUNCTION update_provider_rating(p_provider_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE marketplace_providers
    SET 
        rating_average = (
            SELECT COALESCE(AVG(rating_overall), 0)
            FROM marketplace_reviews
            WHERE provider_id = p_provider_id
            AND is_visible = true
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM marketplace_reviews
            WHERE provider_id = p_provider_id
            AND is_visible = true
        ),
        updated_at = NOW()
    WHERE id = p_provider_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating after review
CREATE OR REPLACE FUNCTION trigger_update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_provider_rating(NEW.provider_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
    AFTER INSERT OR UPDATE ON marketplace_reviews
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_provider_rating();

-- Function to apply referral credit
CREATE OR REPLACE FUNCTION apply_referral_credit(
    p_user_id UUID,
    p_amount DECIMAL,
    p_source_type VARCHAR,
    p_source_id UUID,
    p_description TEXT
) RETURNS VOID AS $$
DECLARE
    v_current_balance DECIMAL;
BEGIN
    -- Get or create credit balance
    INSERT INTO referral_credits (user_id, credit_balance, lifetime_earned)
    VALUES (p_user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Get current balance
    SELECT credit_balance INTO v_current_balance
    FROM referral_credits WHERE user_id = p_user_id;
    
    -- Update balance
    UPDATE referral_credits
    SET 
        credit_balance = credit_balance + p_amount,
        lifetime_earned = lifetime_earned + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO credit_transactions (
        user_id, transaction_type, amount, source_type, source_id,
        balance_before, balance_after, description
    ) VALUES (
        p_user_id, 'earn', p_amount, p_source_type, p_source_id,
        v_current_balance, v_current_balance + p_amount, p_description
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- New Tables: 25
-- Revenue Streams Added:
--   - Advertising (banner, sponsored jobs, newsletter, industry)
--   - Marketplace (coaching, resume, interview prep)
--   - Referral Programs (user, employer, partner)
--   - API Licensing (basic, professional, enterprise)
--   - Data Products (reports, datasets)
--   - Job Syndication (Indeed, LinkedIn, etc.)
-- =====================================================
