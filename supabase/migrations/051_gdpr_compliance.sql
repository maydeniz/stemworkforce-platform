-- ===========================================
-- GDPR Compliance Tables
-- Data Subject Requests and Consent Management
-- ===========================================

-- ===========================================
-- Data Subject Requests (DSR) Table
-- Tracks export and deletion requests
-- ===========================================
CREATE TABLE IF NOT EXISTS dsr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'rectification', 'restriction')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id)
);

-- Indexes for DSR requests
CREATE INDEX IF NOT EXISTS idx_dsr_requests_user_id ON dsr_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dsr_requests_status ON dsr_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsr_requests_type_status ON dsr_requests(request_type, status);
CREATE INDEX IF NOT EXISTS idx_dsr_requests_created_at ON dsr_requests(created_at DESC);

-- ===========================================
-- User Consents Table
-- Tracks user consent for various purposes
-- ===========================================
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  version TEXT, -- Version of the consent text
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, consent_type)
);

-- Indexes for consents
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON user_consents(consent_type);

-- ===========================================
-- Consent Audit Log
-- Immutable log of consent changes
-- ===========================================
CREATE TABLE IF NOT EXISTS consent_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked', 'updated')),
  previous_value BOOLEAN,
  new_value BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_consent_audit_user_id ON consent_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_created_at ON consent_audit_log(created_at DESC);

-- ===========================================
-- User Settings Table
-- User preferences and settings
-- ===========================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "show_activity": false}',
  display_preferences JSONB DEFAULT '{"theme": "dark", "language": "en"}',
  accessibility_settings JSONB DEFAULT '{"reduced_motion": false, "high_contrast": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Data Retention Policy Tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS data_retention_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  retention_days INTEGER NOT NULL,
  legal_basis TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default retention policies
INSERT INTO data_retention_schedule (data_type, retention_days, legal_basis, description)
VALUES
  ('audit_logs', 2555, 'legal_obligation', 'Audit logs retained for 7 years for compliance'),
  ('user_data', 0, 'consent', 'User data retained while account is active'),
  ('deleted_accounts', 30, 'legitimate_interest', 'Soft-deleted data retained 30 days before permanent deletion'),
  ('session_logs', 90, 'legitimate_interest', 'Session logs for security purposes'),
  ('analytics_data', 365, 'consent', 'Anonymized analytics data')
ON CONFLICT DO NOTHING;

-- ===========================================
-- Row Level Security Policies
-- ===========================================

-- DSR Requests: Users can only see their own requests
ALTER TABLE dsr_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DSR requests"
  ON dsr_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own DSR requests"
  ON dsr_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending requests"
  ON dsr_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- User Consents: Users can manage their own consents
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents"
  ON user_consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own consents"
  ON user_consents FOR ALL
  USING (auth.uid() = user_id);

-- Consent Audit Log: Users can view their own audit history
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consent audit log"
  ON consent_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- User Settings: Users can manage their own settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

-- ===========================================
-- Trigger: Log consent changes
-- ===========================================
CREATE OR REPLACE FUNCTION log_consent_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO consent_audit_log (
    user_id,
    consent_type,
    action,
    previous_value,
    new_value,
    created_at
  )
  VALUES (
    NEW.user_id,
    NEW.consent_type,
    CASE
      WHEN TG_OP = 'INSERT' THEN
        CASE WHEN NEW.granted THEN 'granted' ELSE 'revoked' END
      WHEN OLD.granted != NEW.granted THEN
        CASE WHEN NEW.granted THEN 'granted' ELSE 'revoked' END
      ELSE 'updated'
    END,
    CASE WHEN TG_OP = 'UPDATE' THEN OLD.granted ELSE NULL END,
    NEW.granted,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_consent_audit
  AFTER INSERT OR UPDATE ON user_consents
  FOR EACH ROW
  EXECUTE FUNCTION log_consent_change();

-- ===========================================
-- Trigger: Update timestamps
-- ===========================================
CREATE OR REPLACE FUNCTION update_gdpr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dsr_updated_at
  BEFORE UPDATE ON dsr_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_gdpr_updated_at();

CREATE TRIGGER trigger_consents_updated_at
  BEFORE UPDATE ON user_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_gdpr_updated_at();

CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_gdpr_updated_at();

-- ===========================================
-- Function: Process deletion request
-- Anonymizes user data while preserving audit trail
-- ===========================================
CREATE OR REPLACE FUNCTION process_deletion_request(request_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_request_type TEXT;
BEGIN
  -- Get request details
  SELECT user_id, request_type INTO v_user_id, v_request_type
  FROM dsr_requests
  WHERE id = request_id AND status = 'pending';

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF v_request_type != 'deletion' THEN
    RETURN FALSE;
  END IF;

  -- Update request status to processing
  UPDATE dsr_requests
  SET status = 'processing', updated_at = NOW()
  WHERE id = request_id;

  -- Anonymize profile data
  UPDATE profiles
  SET
    first_name = 'Deleted',
    last_name = 'User',
    bio = NULL,
    avatar_url = NULL,
    phone = NULL,
    location = NULL,
    linkedin_url = NULL,
    github_url = NULL,
    website = NULL,
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Delete saved listings
  DELETE FROM saved_listings WHERE user_id = v_user_id;

  -- Anonymize applications (keep for reporting)
  UPDATE applications
  SET
    cover_letter = '[REDACTED]',
    resume_url = NULL
  WHERE user_id = v_user_id;

  -- Delete user consents
  DELETE FROM user_consents WHERE user_id = v_user_id;

  -- Delete user settings
  DELETE FROM user_settings WHERE user_id = v_user_id;

  -- Mark request as completed
  UPDATE dsr_requests
  SET
    status = 'completed',
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = request_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- Comments for documentation
-- ===========================================
COMMENT ON TABLE dsr_requests IS 'GDPR Data Subject Requests for export, deletion, etc.';
COMMENT ON TABLE user_consents IS 'User consent preferences for data processing';
COMMENT ON TABLE consent_audit_log IS 'Immutable audit log of consent changes';
COMMENT ON TABLE user_settings IS 'User preferences and accessibility settings';
COMMENT ON TABLE data_retention_schedule IS 'Data retention policies for compliance';
