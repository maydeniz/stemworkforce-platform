-- ============================================================================
-- Migration 071: Audience Segments + Campaign Targeting Extensions
-- EEOC/FTC safe targeting dimensions only.
-- No age, race, sex, religion, or national origin fields — per EEOC guidelines
-- and FTC Act Section 5 (unfair/deceptive acts) enforcement.
-- Citizenship targeting limited to cleared-position-eligible filter per EO 12968.
-- ============================================================================

-- ============================================================================
-- TABLE: audience_segments
-- Stores filter criteria only — never user PII or IDs.
-- Matching performed at query time against anonymized profile data.
-- ============================================================================
CREATE TABLE IF NOT EXISTS audience_segments (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id            UUID         REFERENCES advertisers(id) ON DELETE CASCADE,
  name                     VARCHAR(255) NOT NULL,
  description              TEXT,

  -- Role targeting
  target_roles             TEXT[],
  -- ['jobseeker','student_hs','student_college','employer',
  --  'partner_federal','partner_state','partner_lab','partner_industry',
  --  'partner_nonprofit','educator']

  -- Education level targeting (job-related criterion, not age proxy)
  target_education_levels  TEXT[],
  -- ['high_school','some_college','associate','bachelor','master','doctoral','professional']

  -- Graduation year range — job-related professional experience proxy (not age per EEOC)
  grad_year_min            INTEGER,
  grad_year_max            INTEGER,

  -- Security clearance level (defense sector targeting)
  target_clearance_levels  TEXT[],
  -- ['none','public-trust','secret','top-secret','ts-sci','doe-l','doe-q','doe-q-sci']

  target_clearance_status  TEXT[],
  -- ['active','current','in_progress','expired','interim']

  -- Veteran status (38 USC 4212 compliant affirmative outreach)
  target_veteran_status    TEXT[],
  -- ['veteran','active_duty','not_veteran']

  -- Professional skills
  target_skills            TEXT[],

  -- Industry targeting
  target_industries        TEXT[],
  -- ['semiconductor','nuclear','ai','quantum','cybersecurity','aerospace',
  --  'biotech','healthcare','robotics','clean-energy','manufacturing','defense']

  -- Subscription tier
  target_subscription_tiers TEXT[],
  -- ['free','career_pro','teams','professional','enterprise']

  -- Citizenship eligibility for cleared-position targeting (EO 12968 compliant)
  target_citizenship       TEXT[],
  -- ['us_citizen','permanent_resident']

  -- WIOA program enrollment filter
  target_wioa_enrolled     BOOLEAN,   -- NULL = no filter applied

  -- Reach estimates (computed async, never real-time)
  estimated_reach          INTEGER,
  reach_computed_at        TIMESTAMPTZ,

  is_active                BOOLEAN     DEFAULT true,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE audience_segments IS
  'Stores ad targeting filter criteria only — never user PII or user IDs. '
  'Audience matching occurs at query time against anonymized profile data. '
  'All dimensions are EEOC/FTC-safe: no age, race, sex, religion, or national origin.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audience_segments_advertiser_id
  ON audience_segments (advertiser_id);

CREATE INDEX IF NOT EXISTS idx_audience_segments_active
  ON audience_segments (is_active)
  WHERE is_active = true;

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_audience_segments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audience_segments_updated_at ON audience_segments;
CREATE TRIGGER trg_audience_segments_updated_at
  BEFORE UPDATE ON audience_segments
  FOR EACH ROW EXECUTE FUNCTION set_audience_segments_updated_at();

-- ============================================================================
-- RLS: audience_segments (same pattern as geo_zones)
-- ============================================================================
ALTER TABLE audience_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audience_segments_select" ON audience_segments;
CREATE POLICY "audience_segments_select"
  ON audience_segments
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      advertiser_id IS NULL
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "audience_segments_insert" ON audience_segments;
CREATE POLICY "audience_segments_insert"
  ON audience_segments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "audience_segments_update" ON audience_segments;
CREATE POLICY "audience_segments_update"
  ON audience_segments
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "audience_segments_delete" ON audience_segments;
CREATE POLICY "audience_segments_delete"
  ON audience_segments
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

-- ============================================================================
-- EXTEND: ad_campaigns — geomarketing + serving control columns
-- ============================================================================
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS geo_zone_id             UUID         REFERENCES geo_zones(id);
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS audience_segment_id     UUID         REFERENCES audience_segments(id);
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS campaign_category        VARCHAR(50)  DEFAULT 'general';
-- 'sponsored_job','geo_banner','push_notification','email_campaign',
-- 'featured_employer','opportunities_card','general'
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS ad_disclosure_text       TEXT         DEFAULT 'Sponsored';
-- FTC .com Disclosures Guide requirement: clear and conspicuous disclosure
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS frequency_cap_per_user   INTEGER      DEFAULT 3;
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS frequency_cap_hours      INTEGER      DEFAULT 24;
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS pacing_enabled           BOOLEAN      DEFAULT true;
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS spent_today              DECIMAL(12,4) DEFAULT 0;
-- Reset daily by pg_cron (migration 073)
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS total_impressions        INTEGER      DEFAULT 0;
-- Trigger-updated (see below)
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS total_clicks             INTEGER      DEFAULT 0;
-- Trigger-updated (see below)
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS total_conversions        INTEGER      DEFAULT 0;
ALTER TABLE ad_campaigns ADD COLUMN IF NOT EXISTS fraud_impressions_flagged INTEGER     DEFAULT 0;

-- ============================================================================
-- Additional indexes for serving & fraud
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_ad_impressions_user_campaign_date
  ON ad_impressions (user_id, campaign_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ad_impressions_ip_date
  ON ad_impressions (ip_address, created_at DESC);

-- ============================================================================
-- TRIGGER: increment ad_campaigns.total_impressions + debit credit_balance
--          + increment spent_today on each ad_impressions INSERT
-- ============================================================================
CREATE OR REPLACE FUNCTION trg_fn_ad_impression_counters()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_cpm_rate   DECIMAL(10,4);
  v_impression_cost DECIMAL(12,4);
  v_advertiser_id   UUID;
BEGIN
  -- Get campaign pricing details
  SELECT c.cpm_rate, c.advertiser_id
    INTO v_cpm_rate, v_advertiser_id
    FROM ad_campaigns c
   WHERE c.id = NEW.campaign_id;

  -- Calculate cost (CPM = cost per 1000 impressions)
  v_impression_cost := COALESCE(NEW.cost, COALESCE(v_cpm_rate, 0) / 1000.0);

  -- Increment impression counter and spent_today
  UPDATE ad_campaigns
     SET total_impressions = total_impressions + 1,
         spent_today       = spent_today + v_impression_cost
   WHERE id = NEW.campaign_id;

  -- Debit advertiser credit balance
  IF v_advertiser_id IS NOT NULL AND v_impression_cost > 0 THEN
    UPDATE advertisers
       SET credit_balance = credit_balance - v_impression_cost
     WHERE id = v_advertiser_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ad_impression_counters ON ad_impressions;
CREATE TRIGGER trg_ad_impression_counters
  AFTER INSERT ON ad_impressions
  FOR EACH ROW EXECUTE FUNCTION trg_fn_ad_impression_counters();

-- ============================================================================
-- TRIGGER: increment ad_campaigns.total_clicks on each ad_clicks INSERT
-- ============================================================================
CREATE OR REPLACE FUNCTION trg_fn_ad_click_counters()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE ad_campaigns
     SET total_clicks = total_clicks + 1
   WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ad_click_counters ON ad_clicks;
CREATE TRIGGER trg_ad_click_counters
  AFTER INSERT ON ad_clicks
  FOR EACH ROW EXECUTE FUNCTION trg_fn_ad_click_counters();

-- ============================================================================
-- FUNCTION: check_click_fraud
-- Returns TRUE = legitimate click, FALSE = suspected fraud
-- ============================================================================
CREATE OR REPLACE FUNCTION check_click_fraud(
  p_ip_address  TEXT,
  p_user_id     UUID,
  p_campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_ip_clicks_60s   INTEGER;
  v_user_clicks_10m INTEGER;
BEGIN
  -- Rule 1: IP address clicked more than 3 times in last 60 seconds
  SELECT COUNT(*)
    INTO v_ip_clicks_60s
    FROM ad_clicks
   WHERE ip_address = p_ip_address
     AND created_at >= NOW() - INTERVAL '60 seconds';

  IF v_ip_clicks_60s > 3 THEN
    RETURN false;
  END IF;

  -- Rule 2: Same user clicked same campaign in last 10 minutes
  IF p_user_id IS NOT NULL THEN
    SELECT COUNT(*)
      INTO v_user_clicks_10m
      FROM ad_clicks
     WHERE user_id    = p_user_id
       AND campaign_id = p_campaign_id
       AND created_at >= NOW() - INTERVAL '10 minutes';

    IF v_user_clicks_10m > 0 THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$;

-- ============================================================================
-- FUNCTION: check_budget_pacing
-- Returns TRUE = can serve, FALSE = pacing hold
-- Uses hour-proportional pacing (Uber/Google style even delivery)
-- ============================================================================
CREATE OR REPLACE FUNCTION check_budget_pacing(p_campaign_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_budget_daily DECIMAL(10,2);
  v_spent_today  DECIMAL(12,4);
  v_allowed      DECIMAL(12,4);
BEGIN
  SELECT budget_daily, spent_today
    INTO v_budget_daily, v_spent_today
    FROM ad_campaigns
   WHERE id = p_campaign_id;

  -- No daily budget cap = always can serve
  IF v_budget_daily IS NULL THEN
    RETURN true;
  END IF;

  -- Proportional pacing: allow spending up to (current_hour+1)/24 of daily budget
  v_allowed := v_budget_daily * (EXTRACT(HOUR FROM NOW()) + 1) / 24.0;

  RETURN v_spent_today <= v_allowed;
END;
$$;

-- ============================================================================
-- FUNCTION: check_frequency_cap
-- Returns TRUE = under cap (serve), FALSE = capped (suppress)
-- ============================================================================
CREATE OR REPLACE FUNCTION check_frequency_cap(
  p_user_id     UUID,
  p_campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_cap_per_user INTEGER;
  v_cap_hours    INTEGER;
  v_count        INTEGER;
BEGIN
  SELECT frequency_cap_per_user, frequency_cap_hours
    INTO v_cap_per_user, v_cap_hours
    FROM ad_campaigns
   WHERE id = p_campaign_id;

  -- No campaign found or user is anonymous
  IF v_cap_per_user IS NULL OR p_user_id IS NULL THEN
    RETURN true;
  END IF;

  SELECT COUNT(*)
    INTO v_count
    FROM ad_impressions
   WHERE user_id     = p_user_id
     AND campaign_id  = p_campaign_id
     AND created_at  >= NOW() - (v_cap_hours || ' hours')::INTERVAL;

  RETURN v_count < v_cap_per_user;
END;
$$;
