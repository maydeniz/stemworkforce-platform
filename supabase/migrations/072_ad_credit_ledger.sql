-- ============================================================================
-- Migration 072: Ad Credit Ledger + Stripe Integration Hooks
-- Double-entry ledger for audit compliance.
-- Replaces simple credit_balance column with an immutable audit trail.
-- balance_after is denormalized for O(1) current-balance reads.
-- ============================================================================

-- ============================================================================
-- TABLE: ad_credit_ledger
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_credit_ledger (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id            UUID         NOT NULL REFERENCES advertisers(id),
  amount                   DECIMAL(12,4) NOT NULL,
  -- positive = credit added, negative = debit charged
  balance_after            DECIMAL(12,4) NOT NULL,
  -- running balance snapshot for O(1) current balance lookup
  transaction_type         VARCHAR(50)  NOT NULL
    CHECK (transaction_type IN (
      'purchase',
      'impression_debit',
      'click_debit',
      'flat_debit',
      'refund',
      'admin_credit',
      'budget_reserve',
      'budget_release'
    )),
  campaign_id              UUID         REFERENCES ad_campaigns(id),
  stripe_payment_intent_id VARCHAR(255),
  admin_user_id            UUID         REFERENCES auth.users(id),
  description              TEXT,
  metadata                 JSONB        DEFAULT '{}',
  created_at               TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_credit_ledger_advertiser_date
  ON ad_credit_ledger (advertiser_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ad_credit_ledger_campaign_id
  ON ad_credit_ledger (campaign_id);

CREATE INDEX IF NOT EXISTS idx_ad_credit_ledger_stripe_pi
  ON ad_credit_ledger (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- ============================================================================
-- RLS: advertisers see own ledger rows; admins see all
-- ============================================================================
ALTER TABLE ad_credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ad_credit_ledger_select_own" ON ad_credit_ledger;
CREATE POLICY "ad_credit_ledger_select_own"
  ON ad_credit_ledger
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      -- Admin sees all
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      -- Advertiser sees own ledger
      OR advertiser_id IN (
        SELECT a.id FROM advertisers a
        JOIN public.users u ON u.id = auth.uid()
        WHERE a.contact_email = u.email
           OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

-- Ledger rows are immutable after insert — no UPDATE or DELETE for non-admins
DROP POLICY IF EXISTS "ad_credit_ledger_insert_system" ON ad_credit_ledger;
CREATE POLICY "ad_credit_ledger_insert_system"
  ON ad_credit_ledger
  FOR INSERT
  WITH CHECK (
    -- Only server-side functions (SECURITY DEFINER) or admins insert ledger rows
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );

-- ============================================================================
-- TABLE: ad_credit_packages
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_credit_packages (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100)   NOT NULL,
  amount_usd      DECIMAL(10,2)  NOT NULL,
  credits_granted DECIMAL(12,4)  NOT NULL,
  -- May exceed amount_usd when bonus_pct > 0
  bonus_pct       DECIMAL(5,2)   DEFAULT 0,
  stripe_price_id VARCHAR(255),
  is_active       BOOLEAN        DEFAULT true,
  created_at      TIMESTAMPTZ    DEFAULT NOW()
);

-- ============================================================================
-- SEED: credit packages
-- ============================================================================
INSERT INTO ad_credit_packages (name, amount_usd, credits_granted, bonus_pct, is_active)
VALUES
  ('$250 Starter',      250.00,    250.0000,  0.00,  true),
  ('$500 Standard',     500.00,    500.0000,  0.00,  true),
  ('$1,000 Pro',       1000.00,   1000.0000,  0.00,  true),
  ('$2,500 Growth',    2500.00,   2750.0000, 10.00,  true),
  ('$5,000 Scale',     5000.00,   5750.0000, 15.00,  true),
  ('$10,000 Enterprise',10000.00, 12000.0000, 20.00, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEW: advertiser_credit_balance
-- Current balance = SUM(amount) per advertiser from the ledger.
-- This is the authoritative balance source; advertisers.credit_balance is
-- a denormalized cache updated by trigger in migration 071.
-- ============================================================================
CREATE OR REPLACE VIEW advertiser_credit_balance AS
SELECT
  advertiser_id,
  COALESCE(SUM(amount), 0)::DECIMAL(12,4) AS current_balance,
  COUNT(*)                                 AS transaction_count,
  MAX(created_at)                          AS last_transaction_at
FROM ad_credit_ledger
GROUP BY advertiser_id;

-- ============================================================================
-- TABLE: ad_attribution
-- Post-impression conversion tracking with multi-touch attribution models.
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_attribution (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID         REFERENCES auth.users(id),
  campaign_id       UUID         REFERENCES ad_campaigns(id),
  impression_id     UUID,
  -- Soft FK to ad_impressions(id) — not enforced to avoid cascade issues
  -- across potential future partitioned table
  conversion_event  VARCHAR(100),
  -- 'job_application','profile_view','event_registration','challenge_submission'
  converted_at      TIMESTAMPTZ  NOT NULL,
  days_since_impression INTEGER,
  attribution_model VARCHAR(50)  DEFAULT 'last_touch',
  -- 'last_touch','first_touch','linear','time_decay','view_through'
  created_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_attribution_campaign_id
  ON ad_attribution (campaign_id);

CREATE INDEX IF NOT EXISTS idx_ad_attribution_user_id
  ON ad_attribution (user_id);

CREATE INDEX IF NOT EXISTS idx_ad_attribution_converted_at
  ON ad_attribution (converted_at DESC);

-- ============================================================================
-- RLS: ad_attribution — admins and own advertiser_id can see data
-- ============================================================================
ALTER TABLE ad_attribution ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ad_attribution_select" ON ad_attribution;
CREATE POLICY "ad_attribution_select"
  ON ad_attribution
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
      )
      OR campaign_id IN (
        SELECT c.id
          FROM ad_campaigns c
          JOIN advertisers a ON a.id = c.advertiser_id
          JOIN public.users u ON u.id = auth.uid()
         WHERE a.contact_email = u.email
            OR a.organization_id::TEXT = (u.raw_user_meta_data->>'organization_id')
      )
    )
  );

DROP POLICY IF EXISTS "ad_attribution_insert_system" ON ad_attribution;
CREATE POLICY "ad_attribution_insert_system"
  ON ad_attribution
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );
