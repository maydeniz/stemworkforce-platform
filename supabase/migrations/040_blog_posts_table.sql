-- ===========================================
-- BLOG POSTS TABLE
-- AI-curated STEM workforce news articles
-- Populated by the news-crawler edge function
-- ===========================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Core content (maps to BlogPost interface in frontend)
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('workforce', 'policy', 'education', 'technology')),
    author TEXT NOT NULL DEFAULT 'STEM Workforce Team',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_time INTEGER NOT NULL DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    image_color TEXT DEFAULT 'blue',

    -- Source tracking (for deduplication and attribution)
    source_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_feed_url TEXT,

    -- Deduplication
    content_hash TEXT,
    title_normalized TEXT,

    -- Relevance scoring (used for featuring)
    relevance_score NUMERIC DEFAULT 0,
    auto_categorized BOOLEAN DEFAULT true,
    auto_tagged BOOLEAN DEFAULT true,

    -- Status management
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived', 'rejected')),

    -- Timestamps
    crawled_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate URLs
    UNIQUE(source_url)
);

-- Performance indexes
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured, relevance_score DESC) WHERE featured = true;
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_content_hash ON blog_posts(content_hash);
CREATE INDEX idx_blog_posts_search ON blog_posts
    USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(excerpt, '')));

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY "Public can view published blog posts"
    ON blog_posts FOR SELECT
    USING (status = 'published');

-- Admins have full access
CREATE POLICY "Admins have full access to blog posts"
    ON blog_posts FOR ALL
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
-- BLOG CRAWL JOBS TABLE
-- Tracks each crawl run for observability
-- ===========================================

CREATE TABLE IF NOT EXISTS blog_crawl_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    feeds_processed INTEGER DEFAULT 0,
    articles_found INTEGER DEFAULT 0,
    articles_created INTEGER DEFAULT 0,
    articles_skipped INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_crawl_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view blog crawl jobs"
    ON blog_crawl_jobs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_role_assignments ura ON u.id = ura.user_id
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE u.id = auth.uid()
              AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Service role (edge function) can insert/update crawl jobs
CREATE POLICY "Service role manages crawl jobs"
    ON blog_crawl_jobs FOR ALL
    USING (true)
    WITH CHECK (true);
