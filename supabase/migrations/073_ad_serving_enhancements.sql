-- ============================================================================
-- Migration 073: Ad Serving Infrastructure Enhancements
-- Extends impressions/clicks with geo + consent + viewability columns.
-- Adds campaign cache table + materialized daily stats view.
-- pg_cron jobs: hourly stats refresh + midnight spent_today reset.
-- ============================================================================

-- ============================================================================
-- EXTEND: ad_impressions — geo, consent, viewability, fraud columns
-- ============================================================================
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS geo_zone_id         UUID         REFERENCES geo_zones(id);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS user_zip_code       VARCHAR(5);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS user_state          VARCHAR(2);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS user_metro_cbsa     VARCHAR(10);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS audience_segment_id UUID         REFERENCES audience_segments(id);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS frequency_seq       INTEGER      DEFAULT 1;
-- Which impression in the frequency window this is (1=first, 2=second, etc.)
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS consent_granted     BOOLEAN      DEFAULT false;
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS ad_disclosed_as     VARCHAR(50)  DEFAULT 'Sponsored';
-- FTC-required disclosure label rendered alongside the ad
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS is_viewable         BOOLEAN;
-- IAB viewability standard: ≥50% in viewport for ≥1 second
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS viewable_seconds    DECIMAL(6,2);
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS is_fraud_flagged    BOOLEAN      DEFAULT false;
ALTER TABLE ad_impressions ADD COLUMN IF NOT EXISTS fraud_reason        VARCHAR(100);

-- ============================================================================
-- EXTEND: ad_clicks — geo, fraud, uniqueness, consent columns
-- ============================================================================
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS geo_zone_id         UUID         REFERENCES geo_zones(id);
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS user_zip_code       VARCHAR(5);
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS user_state          VARCHAR(2);
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS is_unique_click     BOOLEAN      DEFAULT true;
-- FALSE if same user already clicked this campaign (deduped conversion metric)
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS is_fraud_flagged    BOOLEAN      DEFAULT false;
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS fraud_reason        VARCHAR(100);
ALTER TABLE ad_clicks ADD COLUMN IF NOT EXISTS consent_granted     BOOLEAN      DEFAULT false;

-- ============================================================================
-- TABLE: ad_campaign_cache
-- Singleton row refreshed every 5 minutes by the ad-serving Edge Function.
-- Avoids per-request DB round-trips during high-volume serving windows.
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_campaign_cache (
  id              INTEGER      PRIMARY KEY DEFAULT 1,
  -- Enforced as singleton: only row with id=1 is ever inserted
  cache_json      JSONB        NOT NULL DEFAULT '[]',
  cached_at       TIMESTAMPTZ  DEFAULT NOW(),
  campaign_count  INTEGER      DEFAULT 0
);

-- Ensure only one row can exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_campaign_cache_singleton
  ON ad_campaign_cache (id);

-- RLS: ad_campaign_cache is read-only for authenticated users; only admins can update.
ALTER TABLE ad_campaign_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ad_campaign_cache_select_authenticated" ON ad_campaign_cache;
CREATE POLICY "ad_campaign_cache_select_authenticated"
  ON ad_campaign_cache
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "ad_campaign_cache_update_admin" ON ad_campaign_cache;
CREATE POLICY "ad_campaign_cache_update_admin"
  ON ad_campaign_cache
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );

DROP POLICY IF EXISTS "ad_campaign_cache_insert_admin" ON ad_campaign_cache;
CREATE POLICY "ad_campaign_cache_insert_admin"
  ON ad_campaign_cache
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );

-- Seed the singleton row so Edge Function can do UPDATE instead of UPSERT
INSERT INTO ad_campaign_cache (id, cache_json, cached_at, campaign_count)
VALUES (1, '[]', NOW(), 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MATERIALIZED VIEW: campaign_daily_stats
-- Aggregated per campaign / date / state / CBSA for advertiser reporting.
-- Refreshed hourly by pg_cron.
-- ============================================================================
DROP MATERIALIZED VIEW IF EXISTS campaign_daily_stats;
CREATE MATERIALIZED VIEW campaign_daily_stats AS
SELECT
  i.campaign_id,
  DATE(i.impression_date)                                              AS stat_date,
  i.user_state,
  i.user_metro_cbsa,
  COUNT(i.id)                                                          AS impressions,
  COUNT(DISTINCT i.user_id)                                            AS unique_users,
  COALESCE(SUM(i.cost), 0)                                             AS impression_cost,
  COUNT(c.id)                                                          AS clicks,
  COALESCE(SUM(c.cost), 0)                                             AS click_cost,
  ROUND(
    CASE
      WHEN COUNT(i.id) > 0
        THEN COUNT(c.id)::DECIMAL / COUNT(i.id) * 100
      ELSE 0
    END, 4
  )                                                                    AS ctr_pct,
  COUNT(CASE WHEN i.is_fraud_flagged THEN 1 END)                       AS fraud_impressions
FROM ad_impressions i
LEFT JOIN ad_clicks c
       ON c.impression_id = i.id
      AND COALESCE(c.is_fraud_flagged, false) = false
GROUP BY
  i.campaign_id,
  DATE(i.impression_date),
  i.user_state,
  i.user_metro_cbsa
WITH DATA;

-- Unique index required for REFRESH CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS idx_campaign_daily_stats_unique
  ON campaign_daily_stats (
    campaign_id,
    stat_date,
    COALESCE(user_state,      ''),
    COALESCE(user_metro_cbsa, '')
  );

-- Additional lookup indexes on the materialized view
CREATE INDEX IF NOT EXISTS idx_campaign_daily_stats_campaign_date
  ON campaign_daily_stats (campaign_id, stat_date DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_daily_stats_stat_date
  ON campaign_daily_stats (stat_date DESC);

-- ============================================================================
-- FUNCTION: refresh_campaign_daily_stats
-- Called by pg_cron hourly and available for on-demand refresh.
-- ============================================================================
CREATE OR REPLACE FUNCTION refresh_campaign_daily_stats()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY campaign_daily_stats;
END;
$$;

-- ============================================================================
-- pg_cron: hourly stats refresh
-- Wrapped in exception handler — silently no-ops if pg_cron is not installed.
-- ============================================================================
DO $$
BEGIN
  -- Remove existing job if it exists (idempotent)
  PERFORM cron.unschedule('refresh-campaign-stats')
    FROM cron.job
   WHERE jobname = 'refresh-campaign-stats';
EXCEPTION
  WHEN undefined_function THEN
    NULL; -- pg_cron not available; skip
  WHEN OTHERS THEN
    NULL;
END;
$$;

DO $$
BEGIN
  PERFORM cron.schedule(
    'refresh-campaign-stats',
    '0 * * * *',
    'SELECT refresh_campaign_daily_stats()'
  );
EXCEPTION
  WHEN undefined_function THEN
    NULL; -- pg_cron not available; skip
  WHEN OTHERS THEN
    NULL;
END;
$$;

-- ============================================================================
-- pg_cron: midnight reset of spent_today for active campaigns
-- ============================================================================
DO $$
BEGIN
  PERFORM cron.unschedule('reset-daily-ad-spend')
    FROM cron.job
   WHERE jobname = 'reset-daily-ad-spend';
EXCEPTION
  WHEN undefined_function THEN
    NULL;
  WHEN OTHERS THEN
    NULL;
END;
$$;

DO $$
BEGIN
  PERFORM cron.schedule(
    'reset-daily-ad-spend',
    '0 0 * * *',
    $$UPDATE ad_campaigns SET spent_today = 0 WHERE status = 'active'$$
  );
EXCEPTION
  WHEN undefined_function THEN
    NULL;
  WHEN OTHERS THEN
    NULL;
END;
$$;
