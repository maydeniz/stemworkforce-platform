-- Workforce Data Cache Table
-- Caches BLS API data to reduce API calls and improve performance

-- Create the workforce data cache table
CREATE TABLE IF NOT EXISTS workforce_data_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL UNIQUE,
    industries JSONB NOT NULL DEFAULT '[]',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Data quality tracking
    data_source VARCHAR(20) DEFAULT 'demo' CHECK (data_source IN ('live', 'cached', 'demo')),
    api_success_rate DECIMAL(5,2) DEFAULT 0.00,
    last_api_call TIMESTAMPTZ,

    -- Index for quick lookups
    CONSTRAINT valid_state_code CHECK (state_code ~ '^[A-Z]{2}$')
);

-- Create index for faster state lookups
CREATE INDEX IF NOT EXISTS idx_workforce_cache_state ON workforce_data_cache(state_code);
CREATE INDEX IF NOT EXISTS idx_workforce_cache_updated ON workforce_data_cache(last_updated);

-- Create table for tracking BLS API usage and rate limits
CREATE TABLE IF NOT EXISTS bls_api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    requests_made INTEGER DEFAULT 0,
    requests_succeeded INTEGER DEFAULT 0,
    requests_failed INTEGER DEFAULT 0,
    rate_limit_hits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(date)
);

-- Create table for industry-specific national aggregates
CREATE TABLE IF NOT EXISTS workforce_national_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    industry VARCHAR(100) NOT NULL UNIQUE,
    total_jobs INTEGER DEFAULT 0,
    average_salary INTEGER DEFAULT 0,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    top_states JSONB DEFAULT '[]',
    top_skills JSONB DEFAULT '[]',
    last_calculated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial industry records
INSERT INTO workforce_national_stats (industry) VALUES
    ('Semiconductor'),
    ('Nuclear Technologies'),
    ('AI & Machine Learning'),
    ('Quantum Technologies'),
    ('Cybersecurity'),
    ('Aerospace & Defense'),
    ('Biotechnology'),
    ('Healthcare & Medical Technology'),
    ('Robotics & Automation'),
    ('Clean Energy'),
    ('Advanced Manufacturing')
ON CONFLICT (industry) DO NOTHING;

-- Enable RLS
ALTER TABLE workforce_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE bls_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_national_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for workforce data (anonymous users can view)
CREATE POLICY "Allow public read access to workforce cache"
    ON workforce_data_cache
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to national stats"
    ON workforce_national_stats
    FOR SELECT
    TO public
    USING (true);

-- Service role access for updates (Edge Functions)
CREATE POLICY "Allow service role to manage workforce cache"
    ON workforce_data_cache
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role to manage API usage"
    ON bls_api_usage
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role to manage national stats"
    ON workforce_national_stats
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update national stats from cached state data
CREATE OR REPLACE FUNCTION update_national_workforce_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    ind TEXT;
    ind_stats RECORD;
BEGIN
    FOR ind IN SELECT DISTINCT industry FROM workforce_national_stats
    LOOP
        -- Aggregate stats from all states for this industry
        SELECT
            SUM((ind_data->>'totalJobs')::integer) as total_jobs,
            AVG((ind_data->>'averageSalary')::integer) as avg_salary,
            AVG((ind_data->>'jobGrowthRate')::decimal) as avg_growth
        INTO ind_stats
        FROM workforce_data_cache,
        LATERAL jsonb_array_elements(industries) AS ind_data
        WHERE ind_data->>'industry' = ind;

        -- Update the national stats table
        UPDATE workforce_national_stats
        SET
            total_jobs = COALESCE(ind_stats.total_jobs, 0),
            average_salary = COALESCE(ind_stats.avg_salary::integer, 0),
            growth_rate = COALESCE(ind_stats.avg_growth, 0),
            last_calculated = NOW()
        WHERE industry = ind;
    END LOOP;
END;
$$;

-- Create a scheduled job to refresh national stats (if pg_cron is available)
-- SELECT cron.schedule('refresh-national-stats', '0 */6 * * *', 'SELECT update_national_workforce_stats()');

-- Add comment for documentation
COMMENT ON TABLE workforce_data_cache IS 'Caches BLS API workforce data by state to reduce API calls. Data refreshes every 24 hours.';
COMMENT ON TABLE bls_api_usage IS 'Tracks BLS API usage for rate limiting and monitoring.';
COMMENT ON TABLE workforce_national_stats IS 'Pre-calculated national aggregates for each STEM industry.';
