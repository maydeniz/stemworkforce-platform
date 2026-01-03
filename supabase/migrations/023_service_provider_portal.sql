-- =====================================================
-- STEMWorkforce Platform - Service Provider Portal
-- Migration: 023_service_provider_portal.sql
-- =====================================================
-- New Tables: 8
-- Purpose: Extended tables for provider scheduling, payouts,
--          tax documents, packages, messaging, and analytics
-- =====================================================

-- =====================================================
-- PART 1: PROVIDER AVAILABILITY & SCHEDULING
-- =====================================================

-- Provider availability slots (recurring weekly schedule)
CREATE TABLE IF NOT EXISTS provider_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    slot_duration_minutes INTEGER DEFAULT 60,
    buffer_minutes INTEGER DEFAULT 15, -- Buffer between appointments
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, day_of_week, start_time),
    CHECK (end_time > start_time)
);

-- Index for availability lookups
CREATE INDEX IF NOT EXISTS idx_provider_availability_lookup
    ON provider_availability(provider_id, day_of_week, is_available);

-- Blocked dates (vacations, holidays, one-off unavailability)
CREATE TABLE IF NOT EXISTS provider_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    blocked_start_time TIME, -- NULL = all day blocked
    blocked_end_time TIME,
    reason VARCHAR(255),
    recurring_annual BOOLEAN DEFAULT false, -- For annual holidays
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, blocked_date, blocked_start_time)
);

-- Index for blocked date lookups
CREATE INDEX IF NOT EXISTS idx_provider_blocked_dates_lookup
    ON provider_blocked_dates(provider_id, blocked_date);

-- =====================================================
-- PART 2: PROVIDER PAYOUTS & EARNINGS
-- =====================================================

-- Provider payouts tracking
CREATE TABLE IF NOT EXISTS provider_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id),
    payout_number VARCHAR(20) UNIQUE NOT NULL,

    -- Payout period
    payout_period_start DATE NOT NULL,
    payout_period_end DATE NOT NULL,

    -- Financial breakdown
    gross_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
    platform_fees DECIMAL(12,2) NOT NULL DEFAULT 0,
    processing_fees DECIMAL(12,2) NOT NULL DEFAULT 0,
    adjustments DECIMAL(12,2) DEFAULT 0, -- Refunds, chargebacks, bonuses
    net_payout DECIMAL(12,2) NOT NULL DEFAULT 0,

    -- Booking summary
    booking_count INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    cancelled_sessions INTEGER DEFAULT 0,

    -- Stripe integration
    stripe_transfer_id VARCHAR(255),
    stripe_destination_account VARCHAR(255),

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'processing', 'paid', 'failed', 'held'

    -- Timestamps
    scheduled_at TIMESTAMPTZ,
    initiated_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payout queries
CREATE INDEX IF NOT EXISTS idx_provider_payouts_provider ON provider_payouts(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_payouts_status ON provider_payouts(status);
CREATE INDEX IF NOT EXISTS idx_provider_payouts_period ON provider_payouts(payout_period_start, payout_period_end);

-- Provider earnings summary (monthly rollup for quick analytics)
CREATE TABLE IF NOT EXISTS provider_earnings_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id),

    -- Period
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),

    -- Financial summary
    gross_earnings DECIMAL(12,2) DEFAULT 0,
    platform_fees DECIMAL(12,2) DEFAULT 0,
    net_earnings DECIMAL(12,2) DEFAULT 0,
    refunds DECIMAL(12,2) DEFAULT 0,

    -- Session metrics
    booking_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    cancelled_count INTEGER DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,

    -- Rating metrics
    reviews_received INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),

    -- Time metrics
    total_session_minutes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider_id, year, month)
);

-- Index for earnings lookups
CREATE INDEX IF NOT EXISTS idx_provider_earnings_summary_provider
    ON provider_earnings_summary(provider_id, year, month);

-- =====================================================
-- PART 3: TAX DOCUMENTS
-- =====================================================

-- Tax documents management
CREATE TABLE IF NOT EXISTS provider_tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id),

    -- Document info
    document_type VARCHAR(50) NOT NULL,
    -- 'W9', '1099-NEC', '1099-K', '1042-S' (for international)
    tax_year INTEGER NOT NULL,

    -- Document storage
    document_url TEXT,
    document_hash VARCHAR(64), -- SHA-256 for integrity

    -- For W-9 submissions
    legal_name VARCHAR(255),
    business_name VARCHAR(255),
    tax_classification VARCHAR(50), -- Individual, LLC, Corporation, etc.
    tax_id_last_four VARCHAR(4),
    address_on_file TEXT,

    -- For 1099 generation
    total_payments DECIMAL(12,2),
    federal_tax_withheld DECIMAL(12,2) DEFAULT 0,
    state_tax_withheld DECIMAL(12,2) DEFAULT 0,
    state VARCHAR(2),

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'submitted', 'processing', 'verified', 'rejected', 'generated'

    -- Verification
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    rejection_reason TEXT,

    -- For generated documents
    generated_at TIMESTAMPTZ,
    filed_with_irs BOOLEAN DEFAULT false,
    filed_at TIMESTAMPTZ,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider_id, document_type, tax_year)
);

-- Index for tax document lookups
CREATE INDEX IF NOT EXISTS idx_provider_tax_documents_lookup
    ON provider_tax_documents(provider_id, tax_year, document_type);

-- =====================================================
-- PART 4: SERVICE PACKAGES & BUNDLES
-- =====================================================

-- Provider service packages (pre-built bundles with discounts)
CREATE TABLE IF NOT EXISTS provider_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id) ON DELETE CASCADE,

    -- Package details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Included services
    services JSONB NOT NULL,
    -- Format: [{"service_id": "uuid", "quantity": 1, "note": "optional"}]

    -- Pricing
    original_price DECIMAL(10,2), -- Sum of individual service prices
    package_price DECIMAL(10,2) NOT NULL,
    savings_amount DECIMAL(10,2),
    savings_percent DECIMAL(5,2),

    -- Validity
    validity_days INTEGER DEFAULT 365, -- How long the package is valid after purchase

    -- Display options
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    badge_text VARCHAR(50), -- e.g., "Best Value", "Most Popular"

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Stats
    purchase_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for package queries
CREATE INDEX IF NOT EXISTS idx_provider_packages_provider ON provider_packages(provider_id, is_active);

-- =====================================================
-- PART 5: MESSAGING SYSTEM
-- =====================================================

-- Client-provider messages
CREATE TABLE IF NOT EXISTS provider_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Conversation context
    booking_id UUID REFERENCES marketplace_bookings(id),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id),
    client_id UUID NOT NULL,

    -- Message details
    sender_id UUID NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'provider', 'system')),

    message_type VARCHAR(50) DEFAULT 'text',
    -- 'text', 'file', 'meeting_link', 'system_notification'

    message TEXT NOT NULL,

    -- Attachments
    attachments JSONB,
    -- Format: [{"url": "...", "filename": "...", "type": "application/pdf", "size": 1024}]

    -- Read status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX IF NOT EXISTS idx_provider_messages_booking ON provider_messages(booking_id, created_at);
CREATE INDEX IF NOT EXISTS idx_provider_messages_provider ON provider_messages(provider_id, client_id, created_at);
CREATE INDEX IF NOT EXISTS idx_provider_messages_unread ON provider_messages(provider_id, is_read) WHERE NOT is_read;

-- Message threads (for conversation grouping)
CREATE TABLE IF NOT EXISTS message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id),
    client_id UUID NOT NULL,
    booking_id UUID REFERENCES marketplace_bookings(id),

    -- Thread metadata
    subject VARCHAR(255),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_preview TEXT,

    -- Unread counts
    provider_unread_count INTEGER DEFAULT 0,
    client_unread_count INTEGER DEFAULT 0,

    -- Status
    is_archived BOOLEAN DEFAULT false,
    archived_at TIMESTAMPTZ,
    archived_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider_id, client_id, booking_id)
);

-- Index for thread lookups
CREATE INDEX IF NOT EXISTS idx_message_threads_provider ON message_threads(provider_id, is_archived, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_threads_client ON message_threads(client_id, is_archived, last_message_at DESC);

-- =====================================================
-- PART 6: PROVIDER SPECIALIZATIONS & TAGS
-- =====================================================

-- Provider specializations (searchable tags)
CREATE TABLE IF NOT EXISTS provider_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialization_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Categorization
    category VARCHAR(100) NOT NULL,
    -- 'industry', 'skill', 'certification', 'methodology', 'tool'

    parent_id UUID REFERENCES provider_specializations(id),

    -- Display
    icon VARCHAR(100),
    color VARCHAR(50),
    display_order INTEGER DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- Stats
    provider_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for specialization lookups
CREATE INDEX IF NOT EXISTS idx_provider_specializations_category
    ON provider_specializations(category, is_active);

-- Provider-specialization mapping
CREATE TABLE IF NOT EXISTS provider_specialization_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES marketplace_providers(id) ON DELETE CASCADE,
    specialization_id UUID NOT NULL REFERENCES provider_specializations(id) ON DELETE CASCADE,

    -- Experience level with this specialization
    experience_years INTEGER,
    proficiency_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verification_document_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(provider_id, specialization_id)
);

-- Index for mapping lookups
CREATE INDEX IF NOT EXISTS idx_provider_specialization_mapping_provider
    ON provider_specialization_mapping(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_specialization_mapping_spec
    ON provider_specialization_mapping(specialization_id);

-- =====================================================
-- PART 7: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_earnings_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_specialization_mapping ENABLE ROW LEVEL SECURITY;

-- Policies for provider_availability
CREATE POLICY "Providers can view own availability"
    ON provider_availability FOR SELECT
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Providers can manage own availability"
    ON provider_availability FOR ALL
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Public can view active provider availability"
    ON provider_availability FOR SELECT
    USING (is_available = true);

-- Policies for provider_blocked_dates
CREATE POLICY "Providers can manage own blocked dates"
    ON provider_blocked_dates FOR ALL
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Policies for provider_payouts
CREATE POLICY "Providers can view own payouts"
    ON provider_payouts FOR SELECT
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Policies for provider_earnings_summary
CREATE POLICY "Providers can view own earnings"
    ON provider_earnings_summary FOR SELECT
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Policies for provider_tax_documents
CREATE POLICY "Providers can manage own tax docs"
    ON provider_tax_documents FOR ALL
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Policies for provider_packages
CREATE POLICY "Public can view active packages"
    ON provider_packages FOR SELECT
    USING (is_active = true);

CREATE POLICY "Providers can manage own packages"
    ON provider_packages FOR ALL
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Policies for provider_messages
CREATE POLICY "Users can view own messages"
    ON provider_messages FOR SELECT
    USING (
        sender_id = auth.uid() OR
        client_id = auth.uid() OR
        provider_id IN (SELECT id FROM marketplace_providers WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can send messages"
    ON provider_messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

-- Policies for message_threads
CREATE POLICY "Users can view own threads"
    ON message_threads FOR SELECT
    USING (
        client_id = auth.uid() OR
        provider_id IN (SELECT id FROM marketplace_providers WHERE user_id = auth.uid())
    );

-- Policies for provider_specializations (public read)
CREATE POLICY "Public can view specializations"
    ON provider_specializations FOR SELECT
    USING (is_active = true);

-- Policies for provider_specialization_mapping
CREATE POLICY "Public can view provider specializations"
    ON provider_specialization_mapping FOR SELECT
    USING (true);

CREATE POLICY "Providers can manage own specializations"
    ON provider_specialization_mapping FOR ALL
    USING (provider_id IN (
        SELECT id FROM marketplace_providers WHERE user_id = auth.uid()
    ));

-- Admin policies (for all tables)
CREATE POLICY "Admins have full access to provider_availability"
    ON provider_availability FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to provider_payouts"
    ON provider_payouts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin', 'SUPER_ADMIN', 'BILLING_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to provider_tax_documents"
    ON provider_tax_documents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin', 'SUPER_ADMIN', 'BILLING_ADMIN')
        )
    );

-- =====================================================
-- PART 8: INSERT SAMPLE DATA
-- =====================================================

-- Insert provider specializations
INSERT INTO provider_specializations (specialization_key, name, category, icon, color) VALUES
-- Industry specializations
('tech_ai', 'Artificial Intelligence', 'industry', 'Cpu', 'violet'),
('tech_ml', 'Machine Learning', 'industry', 'Brain', 'purple'),
('tech_data', 'Data Science', 'industry', 'Database', 'blue'),
('tech_cloud', 'Cloud Computing', 'industry', 'Cloud', 'cyan'),
('tech_cyber', 'Cybersecurity', 'industry', 'Shield', 'red'),
('manufacturing', 'Advanced Manufacturing', 'industry', 'Factory', 'orange'),
('healthcare', 'Healthcare', 'industry', 'Heart', 'pink'),
('finance', 'Finance & Banking', 'industry', 'DollarSign', 'emerald'),
('government', 'Federal Government', 'industry', 'Building', 'slate'),
('defense', 'Defense & Aerospace', 'industry', 'Rocket', 'amber'),
('biotech', 'Biotechnology', 'industry', 'FlaskConical', 'green'),
('quantum', 'Quantum Computing', 'industry', 'Atom', 'fuchsia'),

-- Skill specializations
('leadership', 'Leadership Development', 'skill', 'Users', 'violet'),
('negotiation', 'Negotiation', 'skill', 'Handshake', 'blue'),
('communication', 'Communication', 'skill', 'MessageCircle', 'cyan'),
('strategy', 'Strategic Planning', 'skill', 'Target', 'amber'),
('project_mgmt', 'Project Management', 'skill', 'ClipboardList', 'emerald'),
('change_mgmt', 'Change Management', 'skill', 'RefreshCw', 'orange'),
('exec_presence', 'Executive Presence', 'skill', 'Crown', 'yellow'),
('public_speaking', 'Public Speaking', 'skill', 'Mic', 'red'),

-- Certification specializations
('pmp', 'PMP Certified', 'certification', 'Award', 'blue'),
('six_sigma', 'Six Sigma Black Belt', 'certification', 'Award', 'emerald'),
('icf_coach', 'ICF Certified Coach', 'certification', 'Award', 'violet'),
('shrm', 'SHRM Certified', 'certification', 'Award', 'cyan'),
('scrum', 'Scrum Master', 'certification', 'Award', 'orange'),
('aws', 'AWS Certified', 'certification', 'Award', 'amber'),

-- Methodology specializations
('agile', 'Agile Methodology', 'methodology', 'Zap', 'blue'),
('lean', 'Lean Management', 'methodology', 'TrendingUp', 'emerald'),
('design_thinking', 'Design Thinking', 'methodology', 'Lightbulb', 'amber'),
('okr', 'OKR Framework', 'methodology', 'Target', 'violet')

ON CONFLICT (specialization_key) DO NOTHING;

-- =====================================================
-- PART 9: HELPER FUNCTIONS
-- =====================================================

-- Function to generate payout number
CREATE OR REPLACE FUNCTION generate_payout_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'PO' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
           LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate payout number
CREATE OR REPLACE FUNCTION set_payout_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payout_number IS NULL THEN
        NEW.payout_number := generate_payout_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_payout_number
    BEFORE INSERT ON provider_payouts
    FOR EACH ROW
    EXECUTE FUNCTION set_payout_number();

-- Function to update provider earnings summary
CREATE OR REPLACE FUNCTION update_provider_earnings_summary()
RETURNS TRIGGER AS $$
DECLARE
    v_year INTEGER;
    v_month INTEGER;
BEGIN
    -- Extract year and month from booking completed_at
    v_year := EXTRACT(YEAR FROM COALESCE(NEW.completed_at, NOW()));
    v_month := EXTRACT(MONTH FROM COALESCE(NEW.completed_at, NOW()));

    -- Upsert earnings summary
    INSERT INTO provider_earnings_summary (
        provider_id, year, month,
        gross_earnings, platform_fees, net_earnings,
        booking_count, completed_count
    )
    VALUES (
        NEW.provider_id, v_year, v_month,
        NEW.service_price, NEW.platform_fee, NEW.provider_payout,
        1, CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END
    )
    ON CONFLICT (provider_id, year, month)
    DO UPDATE SET
        gross_earnings = provider_earnings_summary.gross_earnings + EXCLUDED.gross_earnings,
        platform_fees = provider_earnings_summary.platform_fees + EXCLUDED.platform_fees,
        net_earnings = provider_earnings_summary.net_earnings + EXCLUDED.net_earnings,
        booking_count = provider_earnings_summary.booking_count + 1,
        completed_count = provider_earnings_summary.completed_count +
            CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update earnings on booking completion
CREATE TRIGGER trigger_update_earnings_on_booking
    AFTER UPDATE OF status ON marketplace_bookings
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION update_provider_earnings_summary();

-- Function to update message thread on new message
CREATE OR REPLACE FUNCTION update_message_thread()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or create thread
    INSERT INTO message_threads (
        provider_id, client_id, booking_id,
        last_message_at, last_message_preview,
        provider_unread_count, client_unread_count
    )
    VALUES (
        NEW.provider_id, NEW.client_id, NEW.booking_id,
        NEW.created_at, LEFT(NEW.message, 100),
        CASE WHEN NEW.sender_type = 'client' THEN 1 ELSE 0 END,
        CASE WHEN NEW.sender_type = 'provider' THEN 1 ELSE 0 END
    )
    ON CONFLICT (provider_id, client_id, booking_id)
    DO UPDATE SET
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.message, 100),
        provider_unread_count = CASE
            WHEN NEW.sender_type = 'client'
            THEN message_threads.provider_unread_count + 1
            ELSE message_threads.provider_unread_count
        END,
        client_unread_count = CASE
            WHEN NEW.sender_type = 'provider'
            THEN message_threads.client_unread_count + 1
            ELSE message_threads.client_unread_count
        END,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_thread
    AFTER INSERT ON provider_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_message_thread();

-- =====================================================
-- PART 10: INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_provider_status
    ON marketplace_bookings(provider_id, status);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_client
    ON marketplace_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_bookings_scheduled
    ON marketplace_bookings(scheduled_at) WHERE status IN ('pending', 'confirmed');
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_provider
    ON marketplace_reviews(provider_id, created_at DESC);

-- Full text search index for provider search
CREATE INDEX IF NOT EXISTS idx_marketplace_providers_search
    ON marketplace_providers USING gin(
        to_tsvector('english',
            COALESCE(display_name, '') || ' ' ||
            COALESCE(headline, '') || ' ' ||
            COALESCE(bio, '')
        )
    );

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
