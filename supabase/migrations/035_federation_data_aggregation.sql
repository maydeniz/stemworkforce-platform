-- ===========================================
-- FEDERATION & DATA AGGREGATION SCHEMA
-- Multi-source job, internship, challenge integration
-- ===========================================

-- ===========================================
-- FEDERATED SOURCES
-- Configuration for external data sources
-- ===========================================

CREATE TABLE IF NOT EXISTS federated_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('national_lab', 'federal_agency', 'industry_partner', 'university', 'nonprofit', 'challenge_platform')),
    description TEXT,

    -- Organization details
    website TEXT NOT NULL,
    logo_url TEXT,
    contact_email TEXT,
    contact_name TEXT,

    -- Integration configuration
    integration_method TEXT NOT NULL CHECK (integration_method IN ('api', 'rss', 'sitemap', 'ical', 'manual', 'partner_portal')),
    sync_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),

    -- API/RSS configuration stored as JSONB
    api_config JSONB,
    rss_config JSONB,

    -- Content types this source provides
    provides_jobs BOOLEAN DEFAULT true,
    provides_internships BOOLEAN DEFAULT false,
    provides_challenges BOOLEAN DEFAULT false,
    provides_events BOOLEAN DEFAULT false,
    provides_scholarships BOOLEAN DEFAULT false,

    -- Filtering and categorization
    industries TEXT[] DEFAULT '{}',
    default_clearance_level TEXT,
    geographic_focus TEXT[] DEFAULT '{}',

    -- Partnership status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'inactive')),
    partnership_tier TEXT NOT NULL DEFAULT 'basic' CHECK (partnership_tier IN ('basic', 'verified', 'premium', 'strategic')),
    is_official_partner BOOLEAN DEFAULT false,
    can_direct_post BOOLEAN DEFAULT false,

    -- Legal & compliance
    terms_accepted BOOLEAN DEFAULT false,
    attribution_required BOOLEAN DEFAULT true,
    attribution_text TEXT,
    data_usage_permission TEXT NOT NULL DEFAULT 'public_data' CHECK (data_usage_permission IN ('public_data', 'explicit_permission', 'partnership_agreement')),

    -- Sync metadata
    last_sync_at TIMESTAMPTZ,
    last_successful_sync_at TIMESTAMPTZ,
    sync_error_count INTEGER DEFAULT 0,
    total_items_synced INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for federated_sources
CREATE INDEX idx_federated_sources_type ON federated_sources(type);
CREATE INDEX idx_federated_sources_status ON federated_sources(status);
CREATE INDEX idx_federated_sources_integration ON federated_sources(integration_method);
CREATE INDEX idx_federated_sources_industries ON federated_sources USING GIN(industries);

-- ===========================================
-- FEDERATED LISTINGS
-- Aggregated content from all sources
-- ===========================================

CREATE TABLE IF NOT EXISTS federated_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES federated_sources(id) ON DELETE CASCADE,
    external_id TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('job', 'internship', 'challenge', 'event', 'scholarship')),

    -- Core content
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,

    -- Source attribution (CRITICAL for legal compliance)
    source_url TEXT NOT NULL,     -- Users click through to apply
    source_name TEXT NOT NULL,
    source_logo_url TEXT,
    attribution_html TEXT,

    -- Organization
    organization_name TEXT NOT NULL,
    organization_logo_url TEXT,
    organization_type TEXT,

    -- Location
    location TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'USA',
    is_remote BOOLEAN DEFAULT false,

    -- Categorization
    industries TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    clearance_required TEXT,

    -- Job-specific fields
    job_type TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT DEFAULT 'USD',
    salary_period TEXT CHECK (salary_period IN ('hourly', 'monthly', 'yearly')),
    experience_level TEXT,
    education_required TEXT,

    -- Challenge-specific fields
    prize_amount NUMERIC,
    registration_deadline TIMESTAMPTZ,
    submission_deadline TIMESTAMPTZ,
    challenge_type TEXT,

    -- Event-specific fields
    event_date TIMESTAMPTZ,
    event_end_date TIMESTAMPTZ,
    event_type TEXT,
    is_virtual BOOLEAN DEFAULT false,
    event_registration_url TEXT,

    -- Dates
    posted_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,

    -- Sync metadata
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    checksum TEXT,

    -- Platform metadata
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'removed', 'pending_review')),
    view_count INTEGER DEFAULT 0,
    click_through_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    quality_score NUMERIC,
    relevance_boost NUMERIC DEFAULT 0,

    -- Search optimization
    searchable_content TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint per source
    UNIQUE(source_id, external_id)
);

-- Full-text search index
CREATE INDEX idx_federated_listings_search ON federated_listings
    USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(organization_name, '')));

-- Other indexes
CREATE INDEX idx_federated_listings_source ON federated_listings(source_id);
CREATE INDEX idx_federated_listings_type ON federated_listings(content_type);
CREATE INDEX idx_federated_listings_status ON federated_listings(status);
CREATE INDEX idx_federated_listings_posted ON federated_listings(posted_at DESC);
CREATE INDEX idx_federated_listings_expires ON federated_listings(expires_at);
CREATE INDEX idx_federated_listings_industries ON federated_listings USING GIN(industries);
CREATE INDEX idx_federated_listings_skills ON federated_listings USING GIN(skills);
CREATE INDEX idx_federated_listings_location ON federated_listings(state, city);
CREATE INDEX idx_federated_listings_clearance ON federated_listings(clearance_required) WHERE clearance_required IS NOT NULL;
CREATE INDEX idx_federated_listings_salary ON federated_listings(salary_min, salary_max) WHERE salary_min IS NOT NULL;
CREATE INDEX idx_federated_listings_featured ON federated_listings(is_featured, quality_score DESC) WHERE is_featured = true;

-- ===========================================
-- SYNC JOBS
-- Track synchronization operations
-- ===========================================

CREATE TABLE IF NOT EXISTS sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES federated_sources(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),

    -- Timing
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Results
    items_fetched INTEGER DEFAULT 0,
    items_created INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_removed INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,

    -- Errors
    errors JSONB DEFAULT '[]',

    -- Metadata
    triggered_by TEXT NOT NULL CHECK (triggered_by IN ('schedule', 'manual', 'webhook')),
    triggered_by_user_id UUID REFERENCES auth.users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_source ON sync_jobs(source_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX idx_sync_jobs_scheduled ON sync_jobs(scheduled_at DESC);

-- ===========================================
-- PARTNER PORTAL ACCESS
-- Allow partners to post directly
-- ===========================================

CREATE TABLE IF NOT EXISTS partner_portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES federated_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Permissions
    can_view_listings BOOLEAN DEFAULT true,
    can_create_listings BOOLEAN DEFAULT false,
    can_edit_listings BOOLEAN DEFAULT false,
    can_delete_listings BOOLEAN DEFAULT false,
    can_view_analytics BOOLEAN DEFAULT false,
    can_manage_settings BOOLEAN DEFAULT false,
    can_invite_users BOOLEAN DEFAULT false,

    -- Limits
    max_active_listings INTEGER,
    max_featured_listings INTEGER DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending')),

    -- Tracking
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    last_access_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_id, user_id)
);

CREATE INDEX idx_partner_access_source ON partner_portal_access(source_id);
CREATE INDEX idx_partner_access_user ON partner_portal_access(user_id);
CREATE INDEX idx_partner_access_status ON partner_portal_access(status);

-- ===========================================
-- CONTENT QUALITY CHECKS
-- Automated quality assessment
-- ===========================================

CREATE TABLE IF NOT EXISTS listing_quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES federated_listings(id) ON DELETE CASCADE,
    checked_at TIMESTAMPTZ DEFAULT NOW(),

    -- Automated checks
    has_title BOOLEAN DEFAULT false,
    has_description BOOLEAN DEFAULT false,
    has_valid_url BOOLEAN DEFAULT false,
    has_clear_deadline BOOLEAN DEFAULT false,
    has_location BOOLEAN DEFAULT false,
    has_organization BOOLEAN DEFAULT false,

    -- Quality scores (0-100)
    description_quality NUMERIC,
    relevance_score NUMERIC,
    uniqueness_score NUMERIC,

    -- Issues found
    issues JSONB DEFAULT '[]',

    -- Final assessment
    overall_score NUMERIC,
    approved BOOLEAN DEFAULT false,
    requires_review BOOLEAN DEFAULT false,
    review_reason TEXT,

    UNIQUE(listing_id)
);

CREATE INDEX idx_quality_checks_listing ON listing_quality_checks(listing_id);
CREATE INDEX idx_quality_checks_score ON listing_quality_checks(overall_score DESC);
CREATE INDEX idx_quality_checks_review ON listing_quality_checks(requires_review) WHERE requires_review = true;

-- ===========================================
-- MODERATION ACTIONS
-- Track admin/moderator actions
-- ===========================================

CREATE TABLE IF NOT EXISTS listing_moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES federated_listings(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'edit', 'flag', 'remove', 'feature')),
    reason TEXT,
    moderator_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- For edits
    previous_values JSONB,
    new_values JSONB
);

CREATE INDEX idx_moderation_listing ON listing_moderation_actions(listing_id);
CREATE INDEX idx_moderation_moderator ON listing_moderation_actions(moderator_id);
CREATE INDEX idx_moderation_action ON listing_moderation_actions(action);

-- ===========================================
-- USER INTERACTIONS WITH FEDERATED LISTINGS
-- ===========================================

CREATE TABLE IF NOT EXISTS federated_listing_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES federated_listings(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,

    UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_fed_saves_user ON federated_listing_saves(user_id);
CREATE INDEX idx_fed_saves_listing ON federated_listing_saves(listing_id);

-- Track click-throughs (for analytics)
CREATE TABLE IF NOT EXISTS federated_listing_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES federated_listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    referrer TEXT,
    user_agent TEXT
);

CREATE INDEX idx_fed_clicks_listing ON federated_listing_clicks(listing_id);
CREATE INDEX idx_fed_clicks_time ON federated_listing_clicks(clicked_at DESC);

-- ===========================================
-- ANALYTICS AGGREGATES
-- Pre-computed analytics for performance
-- ===========================================

CREATE TABLE IF NOT EXISTS source_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES federated_sources(id) ON DELETE CASCADE,
    period TEXT NOT NULL CHECK (period IN ('day', 'week', 'month', 'year', 'all_time')),
    period_start DATE NOT NULL,

    -- Sync metrics
    total_syncs INTEGER DEFAULT 0,
    successful_syncs INTEGER DEFAULT 0,
    failed_syncs INTEGER DEFAULT 0,

    -- Content metrics
    total_items_synced INTEGER DEFAULT 0,
    total_items_active INTEGER DEFAULT 0,
    total_items_expired INTEGER DEFAULT 0,

    -- Performance
    avg_sync_duration_seconds NUMERIC,

    -- Engagement
    total_views INTEGER DEFAULT 0,
    total_click_throughs INTEGER DEFAULT 0,
    click_through_rate NUMERIC,

    -- Quality
    avg_quality_score NUMERIC,
    items_with_issues INTEGER DEFAULT 0,

    computed_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_id, period, period_start)
);

CREATE INDEX idx_source_analytics_source ON source_analytics(source_id);
CREATE INDEX idx_source_analytics_period ON source_analytics(period, period_start DESC);

-- ===========================================
-- VIEWS FOR EASY QUERYING
-- ===========================================

-- Active federated listings with source info
CREATE OR REPLACE VIEW active_federated_listings AS
SELECT
    fl.*,
    fs.name AS source_full_name,
    fs.type AS source_type,
    fs.partnership_tier,
    fs.is_official_partner,
    fs.attribution_required AS source_attribution_required
FROM federated_listings fl
JOIN federated_sources fs ON fl.source_id = fs.id
WHERE fl.status = 'active'
  AND fs.status = 'active'
  AND (fl.expires_at IS NULL OR fl.expires_at > NOW());

-- ===========================================
-- RLS POLICIES
-- ===========================================

-- Enable RLS
ALTER TABLE federated_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_listing_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE federated_listing_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_analytics ENABLE ROW LEVEL SECURITY;

-- Public can view active listings
CREATE POLICY "Public can view active federated listings"
    ON federated_listings FOR SELECT
    USING (status = 'active');

-- Public can view active sources
CREATE POLICY "Public can view active federated sources"
    ON federated_sources FOR SELECT
    USING (status = 'active');

-- Users can manage their own saves
CREATE POLICY "Users can manage their own listing saves"
    ON federated_listing_saves FOR ALL
    USING (auth.uid() = user_id);

-- Anyone can log clicks (for analytics)
CREATE POLICY "Anyone can log listing clicks"
    ON federated_listing_clicks FOR INSERT
    WITH CHECK (true);

-- Partner portal users can manage their source's listings
CREATE POLICY "Partner users can manage their listings"
    ON federated_listings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM partner_portal_access ppa
            WHERE ppa.source_id = federated_listings.source_id
              AND ppa.user_id = auth.uid()
              AND ppa.status = 'active'
              AND ppa.can_edit_listings = true
        )
    );

-- Partner portal users can view their own access
CREATE POLICY "Users can view their own partner access"
    ON partner_portal_access FOR SELECT
    USING (user_id = auth.uid());

-- Partner users can view their source analytics
CREATE POLICY "Partners can view their source analytics"
    ON source_analytics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM partner_portal_access ppa
            WHERE ppa.source_id = source_analytics.source_id
              AND ppa.user_id = auth.uid()
              AND ppa.status = 'active'
              AND ppa.can_view_analytics = true
        )
    );

-- Admins can do everything
CREATE POLICY "Admins have full access to federated sources"
    ON federated_sources FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to sync jobs"
    ON sync_jobs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to partner access"
    ON partner_portal_access FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to quality checks"
    ON listing_quality_checks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins have full access to moderation actions"
    ON listing_moderation_actions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE federated_listings
    SET view_count = view_count + 1
    WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record and count click-throughs
CREATE OR REPLACE FUNCTION record_listing_click(
    p_listing_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Record the click
    INSERT INTO federated_listing_clicks (listing_id, user_id, session_id, referrer, user_agent)
    VALUES (p_listing_id, p_user_id, p_session_id, p_referrer, p_user_agent);

    -- Increment the counter
    UPDATE federated_listings
    SET click_through_count = click_through_count + 1
    WHERE id = p_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update source sync stats
CREATE OR REPLACE FUNCTION update_source_sync_stats(p_source_id UUID)
RETURNS void AS $$
DECLARE
    v_total_items INTEGER;
    v_active_items INTEGER;
BEGIN
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'active')
    INTO v_total_items, v_active_items
    FROM federated_listings
    WHERE source_id = p_source_id;

    UPDATE federated_sources
    SET
        total_items_synced = v_total_items,
        updated_at = NOW()
    WHERE id = p_source_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update searchable_content
CREATE OR REPLACE FUNCTION update_listing_searchable_content()
RETURNS TRIGGER AS $$
BEGIN
    NEW.searchable_content := COALESCE(NEW.title, '') || ' ' ||
                              COALESCE(NEW.description, '') || ' ' ||
                              COALESCE(NEW.organization_name, '') || ' ' ||
                              COALESCE(NEW.location, '') || ' ' ||
                              COALESCE(array_to_string(NEW.skills, ' '), '') || ' ' ||
                              COALESCE(array_to_string(NEW.tags, ' '), '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_listing_searchable
    BEFORE INSERT OR UPDATE ON federated_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_searchable_content();

-- Trigger to auto-expire listings
CREATE OR REPLACE FUNCTION auto_expire_listings()
RETURNS void AS $$
BEGIN
    UPDATE federated_listings
    SET status = 'expired'
    WHERE status = 'active'
      AND expires_at IS NOT NULL
      AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- SEED DATA: Pre-configured sources
-- ===========================================

INSERT INTO federated_sources (
    name, short_name, type, description, website,
    integration_method, sync_frequency,
    provides_jobs, provides_internships, provides_challenges, provides_events, provides_scholarships,
    industries, attribution_required, attribution_text, data_usage_permission, status
) VALUES
-- Federal API Sources
(
    'USAJobs',
    'USAJOBS',
    'federal_agency',
    'Official job site of the United States Federal Government',
    'https://www.usajobs.gov',
    'api',
    'daily',
    true, true, false, false, false,
    ARRAY['cybersecurity', 'aerospace', 'nuclear', 'ai', 'healthcare']::TEXT[],
    true,
    'Jobs data provided by USAJobs.gov',
    'public_data',
    'pending'
),
(
    'Challenge.gov',
    'Challenge.gov',
    'federal_agency',
    'Official hub for federal prize competitions and challenges',
    'https://www.challenge.gov',
    'rss',
    'daily',
    false, false, true, true, false,
    ARRAY['ai', 'clean-energy', 'healthcare', 'aerospace', 'cybersecurity']::TEXT[],
    true,
    'Federal challenges provided by Challenge.gov, GSA',
    'public_data',
    'pending'
),

-- National Labs
(
    'Oak Ridge National Laboratory',
    'ORNL',
    'national_lab',
    'DOE''s largest science and energy national laboratory',
    'https://jobs.ornl.gov',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['nuclear', 'clean-energy', 'ai', 'quantum', 'manufacturing']::TEXT[],
    true,
    'Opportunities provided by Oak Ridge National Laboratory',
    'public_data',
    'pending'
),
(
    'Sandia National Laboratories',
    'Sandia',
    'national_lab',
    'Developing technologies to support national security',
    'https://www.sandia.gov/careers/',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['nuclear', 'cybersecurity', 'aerospace', 'ai']::TEXT[],
    true,
    'Opportunities provided by Sandia National Laboratories',
    'public_data',
    'pending'
),
(
    'Lawrence Livermore National Laboratory',
    'LLNL',
    'national_lab',
    'Science and technology applied to national security',
    'https://careers.llnl.gov',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['nuclear', 'ai', 'cybersecurity', 'quantum']::TEXT[],
    true,
    'Opportunities provided by Lawrence Livermore National Laboratory',
    'public_data',
    'pending'
),
(
    'Los Alamos National Laboratory',
    'LANL',
    'national_lab',
    'Solving national security challenges through science',
    'https://lanl.jobs',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['nuclear', 'quantum', 'ai', 'cybersecurity']::TEXT[],
    true,
    'Opportunities provided by Los Alamos National Laboratory',
    'public_data',
    'pending'
),
(
    'Argonne National Laboratory',
    'ANL',
    'national_lab',
    'Multidisciplinary science and engineering research center',
    'https://www.anl.gov/hr/careers',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['clean-energy', 'ai', 'quantum', 'manufacturing']::TEXT[],
    true,
    'Opportunities provided by Argonne National Laboratory',
    'public_data',
    'pending'
),
(
    'National Renewable Energy Laboratory',
    'NREL',
    'national_lab',
    'Advancing energy efficiency and renewable energy technologies',
    'https://www.nrel.gov/careers/',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['clean-energy', 'manufacturing']::TEXT[],
    true,
    'Opportunities provided by National Renewable Energy Laboratory',
    'public_data',
    'pending'
),
(
    'Pacific Northwest National Laboratory',
    'PNNL',
    'national_lab',
    'Advancing scientific discovery and addressing national challenges',
    'https://careers.pnnl.gov',
    'rss',
    'daily',
    true, true, false, false, false,
    ARRAY['clean-energy', 'cybersecurity', 'ai', 'nuclear']::TEXT[],
    true,
    'Opportunities provided by Pacific Northwest National Laboratory',
    'public_data',
    'pending'
),

-- Federal Agencies
(
    'NASA Internships',
    'NASA OSSI',
    'federal_agency',
    'NASA Office of STEM Engagement Internship Programs',
    'https://intern.nasa.gov',
    'rss',
    'daily',
    false, true, false, false, true,
    ARRAY['aerospace', 'ai', 'robotics']::TEXT[],
    true,
    'Internships provided by NASA',
    'public_data',
    'pending'
),
(
    'National Science Foundation',
    'NSF',
    'federal_agency',
    'Supporting fundamental research and education',
    'https://www.nsf.gov/careers/',
    'rss',
    'daily',
    true, true, false, false, true,
    ARRAY['ai', 'quantum', 'biotech', 'clean-energy']::TEXT[],
    true,
    'Opportunities provided by the National Science Foundation',
    'public_data',
    'pending'
),
(
    'National Institutes of Health',
    'NIH',
    'federal_agency',
    'Nation''s medical research agency',
    'https://www.training.nih.gov',
    'rss',
    'daily',
    true, true, false, false, true,
    ARRAY['biotech', 'healthcare', 'ai']::TEXT[],
    true,
    'Opportunities provided by the National Institutes of Health',
    'public_data',
    'pending'
),
(
    'Department of Defense STEM',
    'DoD STEM',
    'federal_agency',
    'DoD STEM education and workforce programs',
    'https://dodstem.us',
    'rss',
    'daily',
    true, true, false, false, true,
    ARRAY['cybersecurity', 'aerospace', 'ai', 'nuclear']::TEXT[],
    true,
    'STEM opportunities provided by the Department of Defense',
    'public_data',
    'pending'
)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE federated_sources IS 'Configuration for external data sources (national labs, federal agencies, universities, etc.)';
COMMENT ON TABLE federated_listings IS 'Aggregated job, internship, challenge listings from external sources';
COMMENT ON TABLE sync_jobs IS 'Track synchronization operations with external sources';
COMMENT ON TABLE partner_portal_access IS 'Access control for partner organizations to post directly';
