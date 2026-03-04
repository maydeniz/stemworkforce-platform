-- CareerNet Career Q&A Data
-- Expert-annotated Q&A from CareerVillage.org (CC BY 4.0)
-- Stores high-quality (correctness >= 3) career guidance Q&A

CREATE TABLE IF NOT EXISTS career_qa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Source identification
    answer_id BIGINT NOT NULL UNIQUE,
    question_id BIGINT NOT NULL,
    source_dataset VARCHAR(20) NOT NULL CHECK (source_dataset IN ('general', 'technology', 'health')),

    -- Question content
    question_title TEXT NOT NULL,
    question_body TEXT NOT NULL,
    question_score INTEGER DEFAULT 0,
    question_views INTEGER DEFAULT 0,
    question_added_at TIMESTAMPTZ,

    -- Answer content
    answer_body TEXT NOT NULL,
    answer_score INTEGER DEFAULT 0,
    answer_added_at TIMESTAMPTZ,

    -- Quality metrics (1-4 scale)
    correctness SMALLINT NOT NULL CHECK (correctness BETWEEN 1 AND 4),
    completeness SMALLINT NOT NULL CHECK (completeness BETWEEN 1 AND 4),
    coherency SMALLINT NOT NULL CHECK (coherency BETWEEN 1 AND 4),

    -- Composite quality score (derived, for sorting)
    quality_score DECIMAL(3,1) GENERATED ALWAYS AS (
        (correctness * 0.5 + completeness * 0.3 + coherency * 0.2)
    ) STORED,

    -- Scenario classification
    scenario_labels TEXT[] DEFAULT '{}',

    -- CareerNet function labels
    explore_options BOOLEAN DEFAULT FALSE,
    take_action BOOLEAN DEFAULT FALSE,
    understanding_purpose BOOLEAN DEFAULT FALSE,
    validation_support BOOLEAN DEFAULT FALSE,
    find_resources BOOLEAN DEFAULT FALSE,
    navigate_constraints BOOLEAN DEFAULT FALSE,
    compare_options BOOLEAN DEFAULT FALSE,
    unclear_goal BOOLEAN DEFAULT FALSE,

    -- Tags and classification
    question_tags TEXT[] DEFAULT '{}',
    industries TEXT[] DEFAULT '{}',

    -- Location data
    asker_location TEXT,
    answerer_location TEXT,

    -- Full-text search
    searchable_content TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', COALESCE(question_title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(question_body, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(answer_body, '')), 'C')
    ) STORED,

    -- Metadata
    content_checksum VARCHAR(64),
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_career_qa_industries ON career_qa USING GIN (industries);
CREATE INDEX IF NOT EXISTS idx_career_qa_tags ON career_qa USING GIN (question_tags);
CREATE INDEX IF NOT EXISTS idx_career_qa_scenario ON career_qa USING GIN (scenario_labels);
CREATE INDEX IF NOT EXISTS idx_career_qa_quality ON career_qa (quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_career_qa_correctness ON career_qa (correctness DESC);
CREATE INDEX IF NOT EXISTS idx_career_qa_search ON career_qa USING GIN (searchable_content);
CREATE INDEX IF NOT EXISTS idx_career_qa_source ON career_qa (source_dataset);
CREATE INDEX IF NOT EXISTS idx_career_qa_question_id ON career_qa (question_id);

-- Sync tracking table
CREATE TABLE IF NOT EXISTS career_qa_sync_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dataset VARCHAR(20) NOT NULL UNIQUE,
    last_synced_at TIMESTAMPTZ,
    rows_total INTEGER DEFAULT 0,
    rows_imported INTEGER DEFAULT 0,
    rows_filtered INTEGER DEFAULT 0,
    checksum VARCHAR(64),
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO career_qa_sync_status (dataset) VALUES
    ('general'), ('technology'), ('health')
ON CONFLICT (dataset) DO NOTHING;

-- RLS Policies (public read, service_role write)
ALTER TABLE career_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_qa_sync_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to career Q&A"
    ON career_qa FOR SELECT TO public USING (true);

CREATE POLICY "Allow service role to manage career Q&A"
    ON career_qa FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to sync status"
    ON career_qa_sync_status FOR SELECT TO public USING (true);

CREATE POLICY "Allow service role to manage sync status"
    ON career_qa_sync_status FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE career_qa IS 'Expert-annotated career Q&A from CareerVillage.org via CareerNet (CC BY 4.0). Quality filtered: correctness >= 3.';
COMMENT ON TABLE career_qa_sync_status IS 'Tracks sync status for each CareerNet dataset (general, technology, health).';
