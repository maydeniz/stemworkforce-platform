-- ===========================================
-- WORKFORCE MAP RPC FUNCTIONS
-- Server-side aggregation for the workforce intelligence map
-- Joins BLS cache + federated listings + partner postings
-- ===========================================

-- 1. Performance indexes for state-level queries
CREATE INDEX IF NOT EXISTS idx_federated_listings_state_active
  ON federated_listings(state) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_employer_postings_state_active
  ON employer_job_postings(state) WHERE status = 'active';

-- 2. Summary function: one row per state with aggregated counts
-- Used on page load to color the map and populate stats bar
CREATE OR REPLACE FUNCTION get_workforce_map_summary(p_industry TEXT DEFAULT NULL)
RETURNS TABLE(
  state_code TEXT,
  state_name TEXT,
  bls_total_jobs BIGINT,
  bls_avg_salary BIGINT,
  bls_growth_rate NUMERIC,
  active_listing_count BIGINT,
  partner_posting_count BIGINT,
  top_industry TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH bls_data AS (
    SELECT
      wdc.state_code AS sc,
      -- If industry filter, extract that industry's data; otherwise sum all
      CASE
        WHEN p_industry IS NOT NULL THEN
          (SELECT COALESCE((ind->>'totalJobs')::bigint, 0)
           FROM jsonb_array_elements(wdc.industries) AS ind
           WHERE ind->>'industry' = p_industry
           LIMIT 1)
        ELSE
          (SELECT COALESCE(SUM((ind->>'totalJobs')::bigint), 0)
           FROM jsonb_array_elements(wdc.industries) AS ind)
      END AS total_jobs,
      CASE
        WHEN p_industry IS NOT NULL THEN
          (SELECT COALESCE((ind->>'averageSalary')::bigint, 0)
           FROM jsonb_array_elements(wdc.industries) AS ind
           WHERE ind->>'industry' = p_industry
           LIMIT 1)
        ELSE
          (SELECT COALESCE(AVG((ind->>'averageSalary')::bigint), 0)::bigint
           FROM jsonb_array_elements(wdc.industries) AS ind)
      END AS avg_salary,
      CASE
        WHEN p_industry IS NOT NULL THEN
          (SELECT COALESCE((ind->>'jobGrowthRate')::numeric, 0)
           FROM jsonb_array_elements(wdc.industries) AS ind
           WHERE ind->>'industry' = p_industry
           LIMIT 1)
        ELSE
          (SELECT COALESCE(AVG((ind->>'jobGrowthRate')::numeric), 0)
           FROM jsonb_array_elements(wdc.industries) AS ind)
      END AS growth_rate,
      -- Top industry by total jobs
      (SELECT ind->>'industry'
       FROM jsonb_array_elements(wdc.industries) AS ind
       ORDER BY (ind->>'totalJobs')::bigint DESC
       LIMIT 1) AS top_ind
    FROM workforce_data_cache wdc
    WHERE wdc.data_source IN ('live', 'cached')
  ),
  listing_counts AS (
    SELECT
      fl.state AS sc,
      COUNT(*) AS cnt
    FROM federated_listings fl
    WHERE fl.status = 'active'
    GROUP BY fl.state
  ),
  partner_counts AS (
    SELECT
      ejp.state AS sc,
      COUNT(*) AS cnt
    FROM employer_job_postings ejp
    WHERE ejp.status = 'active'
    GROUP BY ejp.state
  ),
  -- All 50 state codes
  all_states(sc, sname) AS (
    VALUES
      ('AL','Alabama'),('AK','Alaska'),('AZ','Arizona'),('AR','Arkansas'),('CA','California'),
      ('CO','Colorado'),('CT','Connecticut'),('DE','Delaware'),('FL','Florida'),('GA','Georgia'),
      ('HI','Hawaii'),('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('IA','Iowa'),
      ('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('ME','Maine'),('MD','Maryland'),
      ('MA','Massachusetts'),('MI','Michigan'),('MN','Minnesota'),('MS','Mississippi'),('MO','Missouri'),
      ('MT','Montana'),('NE','Nebraska'),('NV','Nevada'),('NH','New Hampshire'),('NJ','New Jersey'),
      ('NM','New Mexico'),('NY','New York'),('NC','North Carolina'),('ND','North Dakota'),('OH','Ohio'),
      ('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('RI','Rhode Island'),('SC','South Carolina'),
      ('SD','South Dakota'),('TN','Tennessee'),('TX','Texas'),('UT','Utah'),('VT','Vermont'),
      ('VA','Virginia'),('WA','Washington'),('WV','West Virginia'),('WI','Wisconsin'),('WY','Wyoming')
  )
  SELECT
    s.sc,
    s.sname,
    COALESCE(b.total_jobs, 0),
    COALESCE(b.avg_salary, 0),
    COALESCE(b.growth_rate, 0),
    COALESCE(lc.cnt, 0),
    COALESCE(pc.cnt, 0),
    COALESCE(b.top_ind, 'N/A')
  FROM all_states s
  LEFT JOIN bls_data b ON b.sc = s.sc
  LEFT JOIN listing_counts lc ON lc.sc = s.sc
  LEFT JOIN partner_counts pc ON pc.sc = s.sc
  ORDER BY s.sc;
END;
$$;

-- 3. State detail function: full data for a single state
-- Called when user clicks a state on the map
CREATE OR REPLACE FUNCTION get_state_workforce_detail(p_state_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'stateCode', p_state_code,
    'blsIndustries', COALESCE(
      (SELECT wdc.industries
       FROM workforce_data_cache wdc
       WHERE wdc.state_code = p_state_code
         AND wdc.data_source IN ('live', 'cached')
       LIMIT 1),
      '[]'::jsonb
    ),
    'listings', COALESCE(
      (SELECT json_agg(json_build_object(
        'id', fl.id,
        'title', fl.title,
        'organization', fl.organization_name,
        'location', fl.location,
        'city', fl.city,
        'salaryMin', fl.salary_min,
        'salaryMax', fl.salary_max,
        'salaryPeriod', fl.salary_period,
        'industries', fl.industries,
        'skills', fl.skills,
        'jobType', fl.job_type,
        'postedAt', fl.posted_at,
        'expiresAt', fl.expires_at,
        'url', fl.url
      ))
       FROM federated_listings fl
       WHERE fl.state = p_state_code
         AND fl.status = 'active'
       ),
      '[]'::json
    ),
    'partnerPostings', COALESCE(
      (SELECT json_agg(json_build_object(
        'id', ejp.id,
        'title', ejp.title,
        'company', ip.company_name,
        'city', ejp.city,
        'salaryMin', ejp.salary_min,
        'salaryMax', ejp.salary_max,
        'salaryType', ejp.salary_type,
        'jobType', ejp.job_type,
        'experienceLevel', ejp.experience_level,
        'requiredSkills', ejp.required_skills,
        'publishedAt', ejp.published_at
      ))
       FROM employer_job_postings ejp
       LEFT JOIN industry_partners ip ON ip.id = ejp.partner_id
       WHERE ejp.state = p_state_code
         AND ejp.status = 'active'
       ),
      '[]'::json
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- 4. Grant access to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_workforce_map_summary(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_state_workforce_detail(TEXT) TO anon, authenticated;
