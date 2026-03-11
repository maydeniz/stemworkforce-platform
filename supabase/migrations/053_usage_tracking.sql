-- ============================================================================
-- Migration 053: Usage Tracking & Stripe Webhook Events
-- ============================================================================
-- This migration adds metered usage tracking per subscriber per billing period,
-- idempotent Stripe webhook event processing, student subscription plan seed
-- data, and a helper function for atomic usage increments.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. usage_tracking
--    Tracks metered feature usage (job postings, AI calls, etc.) per
--    subscriber per billing period.  Each row represents one metric for one
--    subscriber in one period.  The UNIQUE constraint prevents double-counting
--    when the same (subscriber, metric, period) combination is inserted.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL,
  subscriber_type VARCHAR(50) NOT NULL,   -- 'user', 'organization', 'partner'
  metric_key VARCHAR(100) NOT NULL,       -- 'job_postings', 'candidate_views', 'ai_calls', 'applications', 'data_exports'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  current_count INTEGER DEFAULT 0,
  limit_value INTEGER,                    -- from plan limits; -1 = unlimited
  overage_count INTEGER DEFAULT 0,
  last_incremented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscriber_id, metric_key, period_start)
);

COMMENT ON TABLE usage_tracking IS
  'Metered feature usage per subscriber per billing period. One row per (subscriber, metric, period).';
COMMENT ON COLUMN usage_tracking.subscriber_type IS
  'Discriminator for the subscriber: user, organization, or partner.';
COMMENT ON COLUMN usage_tracking.metric_key IS
  'Identifies the metered feature, e.g. job_postings, candidate_views, ai_calls, applications, data_exports.';
COMMENT ON COLUMN usage_tracking.limit_value IS
  'Maximum allowed count from the subscription plan. -1 means unlimited.';
COMMENT ON COLUMN usage_tracking.overage_count IS
  'Number of increments that exceeded the plan limit.';

-- --------------------------------------------------------------------------
-- 2. stripe_webhook_events
--    Ensures idempotent processing of Stripe webhook deliveries.  The UNIQUE
--    constraint on stripe_event_id prevents the same event from being handled
--    twice even if Stripe retries the delivery.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending',   -- 'pending', 'processed', 'failed'
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE stripe_webhook_events IS
  'Idempotent log of Stripe webhook events. The unique stripe_event_id prevents duplicate processing.';
COMMENT ON COLUMN stripe_webhook_events.status IS
  'Processing state: pending (awaiting processing), processed (completed), or failed (error encountered).';
COMMENT ON COLUMN stripe_webhook_events.retry_count IS
  'Number of times processing has been retried after failure.';

-- --------------------------------------------------------------------------
-- 3. Indexes
-- --------------------------------------------------------------------------

-- Primary lookup for usage: find a subscriber's metric in a given period
CREATE INDEX IF NOT EXISTS idx_usage_tracking_subscriber_metric_period
  ON usage_tracking(subscriber_id, metric_key, period_start);

-- Fast lookup by Stripe event ID (already enforced by UNIQUE, but explicit
-- for clarity and to guarantee a btree index)
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_event_id
  ON stripe_webhook_events(stripe_event_id);

-- Allow efficient polling for pending/failed events that need processing
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_status
  ON stripe_webhook_events(status);

-- --------------------------------------------------------------------------
-- 4. Row Level Security — usage_tracking
-- --------------------------------------------------------------------------
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own usage rows
CREATE POLICY "Users can read their own usage"
  ON usage_tracking
  FOR SELECT
  TO authenticated
  USING (subscriber_id = auth.uid());

-- Service role (Edge Functions, backend) has full access
CREATE POLICY "Service role manages all usage"
  ON usage_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 5. Row Level Security — stripe_webhook_events
-- --------------------------------------------------------------------------
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only the service role should read/write webhook events (no direct user access)
CREATE POLICY "Service role manages webhook events"
  ON stripe_webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 6. Helper function: increment_usage
--    Atomically increments the current_count for a given subscriber + metric
--    in the current period.  If no row exists yet it creates one.  Returns
--    a boolean indicating whether the new count exceeds the plan limit.
--
--    Parameters:
--      p_subscriber_id  – UUID of the subscriber (user / org / partner)
--      p_metric_key     – the feature metric to increment
--      p_limit          – the plan limit for this metric (-1 = unlimited)
--
--    Returns: TRUE if the limit has been exceeded, FALSE otherwise.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_usage(
  p_subscriber_id UUID,
  p_metric_key VARCHAR,
  p_limit INTEGER DEFAULT -1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
  v_new_count INTEGER;
  v_exceeded BOOLEAN := FALSE;
BEGIN
  -- Determine the current monthly billing period
  v_period_start := date_trunc('month', CURRENT_DATE)::DATE;
  v_period_end   := (v_period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- Upsert: create the row if it doesn't exist, then increment atomically
  INSERT INTO usage_tracking (
    subscriber_id, subscriber_type, metric_key,
    period_start, period_end,
    current_count, limit_value, last_incremented_at,
    created_at, updated_at
  ) VALUES (
    p_subscriber_id, 'user', p_metric_key,
    v_period_start, v_period_end,
    1, p_limit, NOW(),
    NOW(), NOW()
  )
  ON CONFLICT (subscriber_id, metric_key, period_start)
  DO UPDATE SET
    current_count       = usage_tracking.current_count + 1,
    limit_value         = COALESCE(EXCLUDED.limit_value, usage_tracking.limit_value),
    last_incremented_at = NOW(),
    updated_at          = NOW()
  RETURNING current_count INTO v_new_count;

  -- Check whether the new count exceeds the limit (-1 means unlimited)
  IF p_limit >= 0 AND v_new_count > p_limit THEN
    v_exceeded := TRUE;

    -- Track the overage
    UPDATE usage_tracking
       SET overage_count = overage_count + 1,
           updated_at    = NOW()
     WHERE subscriber_id = p_subscriber_id
       AND metric_key    = p_metric_key
       AND period_start  = v_period_start;
  END IF;

  RETURN v_exceeded;
END;
$$;

COMMENT ON FUNCTION increment_usage IS
  'Atomically increments a subscriber''s usage counter for a given metric in the current billing period. Returns TRUE when the plan limit is exceeded.';

-- --------------------------------------------------------------------------
-- 7. Student subscription plan seed data
--    Only inserted when the subscription_plans table already exists (created
--    in migration 008).
-- --------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'subscription_plans'
  ) THEN
    INSERT INTO subscription_plans (plan_key, name, description, target_type, price_monthly, price_annual, features, limits, is_active, is_public, display_order)
    VALUES
      (
        'student_free',
        'Student Free',
        'Free tier for students — basic access to job board, events, and community resources.',
        'job_seeker',
        0.00,
        0.00,
        '{"job_board": true, "events_calendar": true, "community_forums": true, "basic_profile": true}'::jsonb,
        '{"applications": 10, "ai_calls": 5, "data_exports": 1}'::jsonb,
        true,
        true,
        10
      ),
      (
        'student_pro',
        'Student Pro',
        'Enhanced student plan with AI-powered resume review, interview prep, and priority applications.',
        'job_seeker',
        9.99,
        99.00,
        '{"job_board": true, "events_calendar": true, "community_forums": true, "enhanced_profile": true, "ai_resume_review": true, "interview_prep": true, "priority_applications": true, "mentorship_matching": true}'::jsonb,
        '{"applications": 50, "ai_calls": 100, "data_exports": 10}'::jsonb,
        true,
        true,
        20
      ),
      (
        'student_premium',
        'Student Premium',
        'Full-access student plan with unlimited applications, advanced analytics, and 1-on-1 career coaching.',
        'job_seeker',
        19.99,
        199.00,
        '{"job_board": true, "events_calendar": true, "community_forums": true, "premium_profile": true, "ai_resume_review": true, "interview_prep": true, "priority_applications": true, "mentorship_matching": true, "career_coaching": true, "advanced_analytics": true, "certificate_programs": true}'::jsonb,
        '{"applications": -1, "ai_calls": -1, "data_exports": 50}'::jsonb,
        true,
        true,
        30
      )
    ON CONFLICT (plan_key) DO NOTHING;
  END IF;
END;
$$;
