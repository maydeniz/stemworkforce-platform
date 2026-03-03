-- Occupation-Level Workforce Data Cache
-- Stores BLS OEWS data per SOC code per state for granular occupation queries

-- Add data vintage tracking to existing cache table
ALTER TABLE workforce_data_cache
  ADD COLUMN IF NOT EXISTS data_vintage VARCHAR(10) DEFAULT NULL;

COMMENT ON COLUMN workforce_data_cache.data_vintage IS 'BLS survey period, e.g. May 2024';

-- Create occupation-level cache table
CREATE TABLE IF NOT EXISTS workforce_occupation_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL,
    soc_code VARCHAR(7) NOT NULL,          -- e.g., '15-1252'
    occupation_title VARCHAR(200),
    employment INTEGER,
    annual_mean_wage INTEGER,
    annual_median_wage INTEGER,
    hourly_mean_wage DECIMAL(8,2),
    data_period VARCHAR(10),               -- e.g., 'May 2024'
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_occ_state_code CHECK (state_code ~ '^[A-Z]{2}$'),
    CONSTRAINT valid_soc_code CHECK (soc_code ~ '^\d{2}-\d{4}$'),
    UNIQUE(state_code, soc_code)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_occupation_cache_state
  ON workforce_occupation_cache(state_code);
CREATE INDEX IF NOT EXISTS idx_occupation_cache_soc
  ON workforce_occupation_cache(soc_code);
CREATE INDEX IF NOT EXISTS idx_occupation_cache_updated
  ON workforce_occupation_cache(last_updated);

-- Enable RLS
ALTER TABLE workforce_occupation_cache ENABLE ROW LEVEL SECURITY;

-- Public read access (anonymous users can view occupation data)
CREATE POLICY "Allow public read access to occupation cache"
    ON workforce_occupation_cache
    FOR SELECT
    TO public
    USING (true);

-- Service role full access (Edge Functions can write)
CREATE POLICY "Allow service role to manage occupation cache"
    ON workforce_occupation_cache
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE workforce_occupation_cache IS
  'Caches BLS OEWS occupation-level employment and wage data by state. Refreshed via workforce-data-sync edge function.';
