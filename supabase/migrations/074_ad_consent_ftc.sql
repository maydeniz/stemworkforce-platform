-- ============================================================================
-- Migration 074: Ad Targeting Consent + FTC Disclosure Compliance
-- Legal bases: GDPR Art. 6, CCPA Opt-Out, FTC .com Disclosures Guide
-- Consent is granular, versioned, and timestamped per GDPR Art. 7.
-- FTC disclosures are logged per impression for audit purposes.
-- ============================================================================

-- ============================================================================
-- User geo fields for fast geo-matching at serve time
-- ============================================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS zip_code   VARCHAR(5);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS metro_cbsa VARCHAR(10);

CREATE INDEX IF NOT EXISTS idx_users_zip_code
  ON public.users (zip_code)
  WHERE zip_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_metro_cbsa
  ON public.users (metro_cbsa)
  WHERE metro_cbsa IS NOT NULL;

-- ============================================================================
-- TABLE: ad_consent_types
-- Master list of consent categories.  Versioned for future consent re-capture.
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_consent_types (
  consent_type   VARCHAR(100) PRIMARY KEY,
  display_name   VARCHAR(255) NOT NULL,
  description    TEXT         NOT NULL,
  legal_basis    VARCHAR(100) NOT NULL,
  -- 'consent' | 'legitimate_interest' | 'legal_obligation'
  default_granted BOOLEAN     NOT NULL DEFAULT false,
  version        VARCHAR(20)  NOT NULL DEFAULT '1.0',
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

COMMENT ON TABLE ad_consent_types IS
  'Master registry of ad targeting consent categories. '
  'Legal basis per GDPR Art. 6. '
  'Consent re-capture required when version increments. '
  'default_granted=true only for legitimate_interest bases per GDPR Recital 47.';

-- ============================================================================
-- SEED: ad_consent_types
-- ============================================================================
INSERT INTO ad_consent_types
  (consent_type, display_name, description, legal_basis, default_granted, version)
VALUES

('ad_personalization',
 'Personalized Advertising',
 'We may show you ads based on your professional profile, skills, and career interests.',
 'consent',
 false,
 '1.0'),

('ad_geo_targeting',
 'Location-Based Opportunities',
 'We may show you job opportunities and programs near your location.',
 'legitimate_interest',
 true,
 '1.0'),

('ad_email_marketing',
 'Career Opportunity Emails',
 'We may send you emails about job opportunities, events, and programs matching your profile.',
 'consent',
 false,
 '1.0'),

('ad_push_notification',
 'In-App Notifications',
 'We may send you in-app notifications about relevant opportunities.',
 'consent',
 false,
 '1.0')

ON CONFLICT (consent_type) DO UPDATE SET
  display_name   = EXCLUDED.display_name,
  description    = EXCLUDED.description,
  legal_basis    = EXCLUDED.legal_basis,
  default_granted = EXCLUDED.default_granted;
-- Note: version is NOT updated on conflict — version bump must be explicit
-- to trigger frontend consent re-capture flow.

-- ============================================================================
-- TABLE: ad_disclosure_log
-- Per-impression FTC disclosure audit trail.
-- FTC .com Disclosures Guide (2013) requires disclosures be clear, conspicuous,
-- and unavoidable — this log proves disclosures were rendered.
-- ============================================================================
CREATE TABLE IF NOT EXISTS ad_disclosure_log (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  impression_id    UUID,
  -- Soft FK to ad_impressions(id); not hard-enforced for partition flexibility
  campaign_id      UUID         NOT NULL REFERENCES ad_campaigns(id),
  user_id          UUID         REFERENCES auth.users(id),
  disclosure_text  VARCHAR(100) NOT NULL,
  -- e.g. 'Sponsored', 'Ad', 'Promoted', 'Paid Placement'
  disclosure_visible BOOLEAN    NOT NULL,
  -- TRUE = disclosure was actually rendered in the viewport
  placement_key    VARCHAR(100),
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

COMMENT ON TABLE ad_disclosure_log IS
  'FTC .com Disclosures Guide compliance log. '
  'Records whether the required "Sponsored" / "Ad" / "Promoted" label '
  'was rendered alongside each impression. '
  'Admissible evidence of FTC Act Section 5 compliance in enforcement proceedings.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_disclosure_log_campaign_id
  ON ad_disclosure_log (campaign_id);

CREATE INDEX IF NOT EXISTS idx_ad_disclosure_log_user_id
  ON ad_disclosure_log (user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ad_disclosure_log_created_at
  ON ad_disclosure_log (created_at DESC);

-- ============================================================================
-- RLS: ad_disclosure_log
-- Admins see all; users see their own records.
-- ============================================================================
ALTER TABLE ad_disclosure_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ad_disclosure_log_select_admin" ON ad_disclosure_log;
CREATE POLICY "ad_disclosure_log_select_admin"
  ON ad_disclosure_log
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );

DROP POLICY IF EXISTS "ad_disclosure_log_select_own" ON ad_disclosure_log;
CREATE POLICY "ad_disclosure_log_select_own"
  ON ad_disclosure_log
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Only server-side code (SECURITY DEFINER functions) inserts disclosure records
DROP POLICY IF EXISTS "ad_disclosure_log_insert_system" ON ad_disclosure_log;
CREATE POLICY "ad_disclosure_log_insert_system"
  ON ad_disclosure_log
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin')
    )
  );

-- ============================================================================
-- FUNCTION: get_user_ad_consent
-- Returns JSONB map of { consent_type: boolean } for a given user.
-- Falls back to default_granted for types with no explicit consent row.
-- Reads from user_consents table (created in migration 051_gdpr_compliance).
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_ad_consent(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_result       JSONB := '{}';
  v_consent_type RECORD;
  v_granted      BOOLEAN;
  v_explicit     BOOLEAN;
BEGIN
  -- Iterate each registered ad consent type
  FOR v_consent_type IN
    SELECT consent_type, default_granted
      FROM ad_consent_types
     ORDER BY consent_type
  LOOP
    v_granted  := v_consent_type.default_granted;
    v_explicit := false;

    -- Check for explicit user consent record in user_consents (migration 051)
    BEGIN
      SELECT
        uc.granted,
        true
      INTO v_granted, v_explicit
      FROM user_consents uc
      WHERE uc.user_id     = p_user_id
        AND uc.consent_type = v_consent_type.consent_type
      ORDER BY uc.created_at DESC
      LIMIT 1;
    EXCEPTION
      WHEN undefined_table THEN
        -- user_consents table not yet present; fall back to default
        v_granted := v_consent_type.default_granted;
    END;

    -- Use default if no explicit row found
    IF NOT v_explicit THEN
      v_granted := v_consent_type.default_granted;
    END IF;

    v_result := v_result || jsonb_build_object(v_consent_type.consent_type, v_granted);
  END LOOP;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION get_user_ad_consent(UUID) IS
  'Returns JSONB { consent_type: boolean } for all ad consent types. '
  'Falls back to default_granted when no explicit user consent row exists. '
  'Called by ad-serving Edge Function before personalizing ad delivery. '
  'GDPR Art. 6 / CCPA compliant — no targeting without valid legal basis.';
