-- ============================================
-- FIX: GDPR Deletion - Cover Student Tables
-- The original process_deletion_request() misses
-- 7 student-specific tables from migration 030
-- ============================================

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

  -- ========== ORIGINAL TABLES ==========

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

  -- ========== STUDENT TABLES (migration 030) ==========

  -- Anonymize student profiles (keep structure for aggregate reporting)
  UPDATE student_profiles
  SET
    first_name = 'Deleted',
    last_name = 'User',
    email = 'deleted@redacted.invalid',
    phone = NULL,
    address = NULL,
    parent_email = NULL,
    parent_phone = NULL,
    gpa = NULL,
    sat_score = NULL,
    act_score = NULL,
    ethnicity = NULL,
    disability_status = NULL,
    household_income = NULL,
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Delete saved scholarships
  DELETE FROM saved_scholarships WHERE user_id = v_user_id;

  -- Delete saved colleges
  DELETE FROM saved_colleges WHERE user_id = v_user_id;

  -- Delete award letters (FERPA-protected financial aid documents)
  DELETE FROM award_letters WHERE user_id = v_user_id;

  -- Delete student loans
  DELETE FROM student_loans WHERE user_id = v_user_id;

  -- Delete college applications (may contain portal credentials)
  DELETE FROM college_applications WHERE user_id = v_user_id;

  -- Delete scholarship matches
  DELETE FROM scholarship_matches WHERE user_id = v_user_id;

  -- ========== MARK COMPLETE ==========

  UPDATE dsr_requests
  SET
    status = 'completed',
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = request_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
