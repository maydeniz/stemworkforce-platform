-- ============================================================================
-- Migration 054: Usage Events Audit Log
-- ============================================================================
-- Append-only audit log that records every usage increment event.
-- Complements the usage_tracking counter table for billing disputes,
-- analytics, and compliance auditing.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. usage_events (append-only audit log)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL,
  subscriber_type VARCHAR(50) NOT NULL,    -- 'user', 'organization', 'partner'
  persona VARCHAR(50),                     -- matches PersonaType from pricing.ts
  metric_key VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) DEFAULT 'increment',  -- 'increment', 'reset', 'adjustment'
  delta INTEGER DEFAULT 1,                 -- amount changed (positive or negative)
  new_count INTEGER,                       -- count after this event
  plan_limit INTEGER,                      -- limit at time of event (-1 = unlimited)
  exceeded BOOLEAN DEFAULT FALSE,          -- true if this event caused an overage
  metadata JSONB DEFAULT '{}',             -- extra context (e.g., job_id, tool_name)
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE usage_events IS
  'Append-only audit log of all usage events. Supports billing disputes and analytics.';

-- --------------------------------------------------------------------------
-- 2. Indexes
-- --------------------------------------------------------------------------

-- Primary lookup: subscriber + metric + time range
CREATE INDEX IF NOT EXISTS idx_usage_events_subscriber_metric
  ON usage_events(subscriber_id, metric_key, created_at DESC);

-- Analytics: aggregate by persona/metric over time
CREATE INDEX IF NOT EXISTS idx_usage_events_persona_metric
  ON usage_events(persona, metric_key, created_at DESC);

-- Overage audit: find all exceeded events
CREATE INDEX IF NOT EXISTS idx_usage_events_exceeded
  ON usage_events(exceeded) WHERE exceeded = TRUE;

-- --------------------------------------------------------------------------
-- 3. Row Level Security
-- --------------------------------------------------------------------------
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users can read own usage events"
  ON usage_events
  FOR SELECT
  TO authenticated
  USING (subscriber_id = auth.uid());

-- Service role has full access
CREATE POLICY "Service role manages usage events"
  ON usage_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 4. Subscriptions table (core subscription state for all personas)
--    Only created if it doesn't already exist.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES auth.users(id),
  persona VARCHAR(50) NOT NULL,            -- matches PersonaType
  tier_key VARCHAR(50) NOT NULL,           -- matches PricingTier.tierKey
  tier_id VARCHAR(100) NOT NULL,           -- matches PricingTier.id
  billing_interval VARCHAR(10) DEFAULT 'month',  -- 'month' or 'year'
  status VARCHAR(50) DEFAULT 'active',     -- 'active','trialing','past_due','canceled','incomplete'
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  -- Government procurement fields
  po_number VARCHAR(100),
  cage_code VARCHAR(20),
  sam_uei VARCHAR(20),
  payment_terms VARCHAR(20),               -- 'net_30', 'net_60', 'net_90'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscriber_id)
);

COMMENT ON TABLE subscriptions IS
  'Core subscription state for all personas. One active subscription per user.';

-- --------------------------------------------------------------------------
-- 5. RLS for subscriptions
-- --------------------------------------------------------------------------
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (subscriber_id = auth.uid());

CREATE POLICY "Service role manages subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 6. Index on subscriptions
-- --------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber
  ON subscriptions(subscriber_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
