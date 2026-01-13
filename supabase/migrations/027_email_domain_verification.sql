-- ============================================
-- EMAIL DOMAIN VERIFICATION
-- Allows organizations to specify allowed email domains
-- Users signing up with matching domains are auto-verified
-- ============================================

-- ============================================
-- 1. ADD ALLOWED_DOMAINS COLUMN TO ORGANIZATIONS
-- ============================================

ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS allowed_domains TEXT[] DEFAULT '{}';

-- Add verification tracking columns
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS domain_verification_method TEXT,
ADD COLUMN IF NOT EXISTS domain_verified_at TIMESTAMP WITH TIME ZONE;

-- ============================================
-- 2. ADD DOMAIN-RELATED COLUMNS TO INSTITUTIONS
-- ============================================

ALTER TABLE public.institutions
ADD COLUMN IF NOT EXISTS allowed_domains TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS domain_verification_method TEXT,
ADD COLUMN IF NOT EXISTS domain_verified_at TIMESTAMP WITH TIME ZONE;

-- ============================================
-- 3. ADD USER VERIFICATION STATUS
-- ============================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email_domain_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster domain lookups
CREATE INDEX IF NOT EXISTS idx_organizations_allowed_domains
ON public.organizations USING GIN (allowed_domains);

CREATE INDEX IF NOT EXISTS idx_institutions_allowed_domains
ON public.institutions USING GIN (allowed_domains);

-- ============================================
-- 4. FUNCTION TO EXTRACT EMAIL DOMAIN
-- ============================================

CREATE OR REPLACE FUNCTION extract_email_domain(email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF email IS NULL OR email = '' THEN
    RETURN NULL;
  END IF;
  RETURN LOWER(SPLIT_PART(email, '@', 2));
END;
$$;

-- ============================================
-- 5. FUNCTION TO CHECK IF DOMAIN IS ALLOWED
-- ============================================

CREATE OR REPLACE FUNCTION is_domain_allowed(
  user_email TEXT,
  org_id UUID DEFAULT NULL,
  inst_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_domain TEXT;
  org_domains TEXT[];
  inst_domains TEXT[];
BEGIN
  -- Extract domain from email
  email_domain := extract_email_domain(user_email);

  IF email_domain IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check organization domains if org_id provided
  IF org_id IS NOT NULL THEN
    SELECT allowed_domains INTO org_domains
    FROM public.organizations
    WHERE id = org_id;

    -- If no allowed domains set, allow any domain (for backward compatibility)
    IF org_domains IS NULL OR array_length(org_domains, 1) IS NULL THEN
      RETURN TRUE;
    END IF;

    -- Check if email domain is in allowed list
    IF email_domain = ANY(org_domains) THEN
      RETURN TRUE;
    END IF;

    RETURN FALSE;
  END IF;

  -- Check institution domains if inst_id provided
  IF inst_id IS NOT NULL THEN
    SELECT allowed_domains INTO inst_domains
    FROM public.institutions
    WHERE id = inst_id;

    -- If no allowed domains set, allow any domain
    IF inst_domains IS NULL OR array_length(inst_domains, 1) IS NULL THEN
      RETURN TRUE;
    END IF;

    -- Check if email domain is in allowed list
    IF email_domain = ANY(inst_domains) THEN
      RETURN TRUE;
    END IF;

    RETURN FALSE;
  END IF;

  -- If neither org nor institution specified, return true
  RETURN TRUE;
END;
$$;

-- ============================================
-- 6. FUNCTION TO AUTO-VERIFY USER ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION verify_user_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
  email_domain TEXT;
  is_verified BOOLEAN := FALSE;
BEGIN
  -- Get user's email
  user_email := NEW.email;
  email_domain := extract_email_domain(user_email);

  -- Check if domain matches organization
  IF NEW.organization_id IS NOT NULL THEN
    IF is_domain_allowed(user_email, NEW.organization_id, NULL) THEN
      is_verified := TRUE;
    END IF;
  END IF;

  -- Check if domain matches institution
  IF NEW.institution_id IS NOT NULL AND NOT is_verified THEN
    IF is_domain_allowed(user_email, NULL, NEW.institution_id) THEN
      is_verified := TRUE;
    END IF;
  END IF;

  -- Update verification status
  IF is_verified THEN
    NEW.email_domain_verified := TRUE;
    NEW.verification_status := 'verified';
    NEW.verified_at := NOW();
  ELSE
    NEW.email_domain_verified := FALSE;
    NEW.verification_status := 'pending';
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for auto-verification on insert/update
DROP TRIGGER IF EXISTS trigger_verify_user_email_domain ON public.users;
CREATE TRIGGER trigger_verify_user_email_domain
  BEFORE INSERT OR UPDATE OF email, organization_id, institution_id
  ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION verify_user_email_domain();

-- ============================================
-- 7. POPULATE ALLOWED DOMAINS FOR KNOWN ORGANIZATIONS
-- ============================================

-- National Labs
UPDATE public.organizations SET allowed_domains = ARRAY['anl.gov'] WHERE LOWER(name) LIKE '%argonne%';
UPDATE public.organizations SET allowed_domains = ARRAY['bnl.gov'] WHERE LOWER(name) LIKE '%brookhaven%';
UPDATE public.organizations SET allowed_domains = ARRAY['fnal.gov'] WHERE LOWER(name) LIKE '%fermi%';
UPDATE public.organizations SET allowed_domains = ARRAY['inl.gov'] WHERE LOWER(name) LIKE '%idaho national%';
UPDATE public.organizations SET allowed_domains = ARRAY['lbl.gov', 'lbnl.gov'] WHERE LOWER(name) LIKE '%berkeley%lab%';
UPDATE public.organizations SET allowed_domains = ARRAY['llnl.gov'] WHERE LOWER(name) LIKE '%livermore%';
UPDATE public.organizations SET allowed_domains = ARRAY['lanl.gov'] WHERE LOWER(name) LIKE '%los alamos%';
UPDATE public.organizations SET allowed_domains = ARRAY['nrel.gov'] WHERE LOWER(name) LIKE '%renewable energy%';
UPDATE public.organizations SET allowed_domains = ARRAY['ornl.gov'] WHERE LOWER(name) LIKE '%oak ridge%';
UPDATE public.organizations SET allowed_domains = ARRAY['pnnl.gov'] WHERE LOWER(name) LIKE '%pacific northwest%';
UPDATE public.organizations SET allowed_domains = ARRAY['sandia.gov'] WHERE LOWER(name) LIKE '%sandia%';
UPDATE public.organizations SET allowed_domains = ARRAY['slac.stanford.edu'] WHERE LOWER(name) LIKE '%slac%';
UPDATE public.organizations SET allowed_domains = ARRAY['jlab.org'] WHERE LOWER(name) LIKE '%jefferson%';
UPDATE public.organizations SET allowed_domains = ARRAY['pppl.gov'] WHERE LOWER(name) LIKE '%princeton plasma%';
UPDATE public.organizations SET allowed_domains = ARRAY['ameslab.gov'] WHERE LOWER(name) LIKE '%ames%lab%';
UPDATE public.organizations SET allowed_domains = ARRAY['netl.doe.gov'] WHERE LOWER(name) LIKE '%energy technology%';
UPDATE public.organizations SET allowed_domains = ARRAY['srnl.gov'] WHERE LOWER(name) LIKE '%savannah river%';

-- Federal Agencies
UPDATE public.organizations SET allowed_domains = ARRAY['doe.gov', 'energy.gov'] WHERE LOWER(name) LIKE '%department of energy%' AND LOWER(name) NOT LIKE '%lab%';
UPDATE public.organizations SET allowed_domains = ARRAY['nasa.gov'] WHERE LOWER(name) LIKE '%nasa%';
UPDATE public.organizations SET allowed_domains = ARRAY['nih.gov'] WHERE LOWER(name) LIKE '%national institutes of health%';
UPDATE public.organizations SET allowed_domains = ARRAY['nsf.gov'] WHERE LOWER(name) LIKE '%national science foundation%';
UPDATE public.organizations SET allowed_domains = ARRAY['noaa.gov'] WHERE LOWER(name) LIKE '%noaa%';
UPDATE public.organizations SET allowed_domains = ARRAY['usgs.gov'] WHERE LOWER(name) LIKE '%geological survey%';
UPDATE public.organizations SET allowed_domains = ARRAY['epa.gov'] WHERE LOWER(name) LIKE '%environmental protection%';
UPDATE public.organizations SET allowed_domains = ARRAY['fda.gov'] WHERE LOWER(name) LIKE '%food and drug%';
UPDATE public.organizations SET allowed_domains = ARRAY['cdc.gov'] WHERE LOWER(name) LIKE '%disease control%';
UPDATE public.organizations SET allowed_domains = ARRAY['nist.gov'] WHERE LOWER(name) LIKE '%standards and technology%';

-- Universities (common patterns)
UPDATE public.institutions SET allowed_domains = ARRAY['mit.edu'] WHERE LOWER(name) LIKE '%massachusetts institute of technology%';
UPDATE public.institutions SET allowed_domains = ARRAY['stanford.edu'] WHERE LOWER(name) LIKE '%stanford%';
UPDATE public.institutions SET allowed_domains = ARRAY['berkeley.edu'] WHERE LOWER(name) LIKE '%uc berkeley%' OR LOWER(name) LIKE '%university of california, berkeley%';
UPDATE public.institutions SET allowed_domains = ARRAY['caltech.edu'] WHERE LOWER(name) LIKE '%caltech%';
UPDATE public.institutions SET allowed_domains = ARRAY['harvard.edu'] WHERE LOWER(name) LIKE '%harvard%';
UPDATE public.institutions SET allowed_domains = ARRAY['princeton.edu'] WHERE LOWER(name) LIKE '%princeton%' AND LOWER(name) NOT LIKE '%plasma%';
UPDATE public.institutions SET allowed_domains = ARRAY['yale.edu'] WHERE LOWER(name) LIKE '%yale%';
UPDATE public.institutions SET allowed_domains = ARRAY['cornell.edu'] WHERE LOWER(name) LIKE '%cornell%';
UPDATE public.institutions SET allowed_domains = ARRAY['columbia.edu'] WHERE LOWER(name) LIKE '%columbia%';
UPDATE public.institutions SET allowed_domains = ARRAY['uchicago.edu'] WHERE LOWER(name) LIKE '%university of chicago%';
UPDATE public.institutions SET allowed_domains = ARRAY['gatech.edu'] WHERE LOWER(name) LIKE '%georgia tech%';
UPDATE public.institutions SET allowed_domains = ARRAY['umich.edu'] WHERE LOWER(name) LIKE '%university of michigan%';
UPDATE public.institutions SET allowed_domains = ARRAY['illinois.edu', 'uiuc.edu'] WHERE LOWER(name) LIKE '%university of illinois%urbana%';
UPDATE public.institutions SET allowed_domains = ARRAY['utexas.edu'] WHERE LOWER(name) LIKE '%university of texas%austin%';
UPDATE public.institutions SET allowed_domains = ARRAY['wisc.edu'] WHERE LOWER(name) LIKE '%university of wisconsin%';
UPDATE public.institutions SET allowed_domains = ARRAY['uw.edu'] WHERE LOWER(name) LIKE '%university of washington%';
UPDATE public.institutions SET allowed_domains = ARRAY['purdue.edu'] WHERE LOWER(name) LIKE '%purdue%';
UPDATE public.institutions SET allowed_domains = ARRAY['cmu.edu'] WHERE LOWER(name) LIKE '%carnegie mellon%';
UPDATE public.institutions SET allowed_domains = ARRAY['ucla.edu'] WHERE LOWER(name) LIKE '%ucla%' OR LOWER(name) LIKE '%university of california, los angeles%';
UPDATE public.institutions SET allowed_domains = ARRAY['ucdavis.edu'] WHERE LOWER(name) LIKE '%uc davis%' OR LOWER(name) LIKE '%university of california, davis%';
UPDATE public.institutions SET allowed_domains = ARRAY['ucsd.edu'] WHERE LOWER(name) LIKE '%uc san diego%' OR LOWER(name) LIKE '%university of california, san diego%';

-- ============================================
-- 8. VIEW FOR PENDING VERIFICATIONS (ADMIN USE)
-- ============================================

CREATE OR REPLACE VIEW pending_user_verifications AS
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  u.created_at,
  u.verification_status,
  extract_email_domain(u.email) as email_domain,
  o.name as organization_name,
  o.allowed_domains as org_allowed_domains,
  i.name as institution_name,
  i.allowed_domains as inst_allowed_domains
FROM public.users u
LEFT JOIN public.organizations o ON u.organization_id = o.id
LEFT JOIN public.institutions i ON u.institution_id = i.id
WHERE u.verification_status = 'pending'
ORDER BY u.created_at DESC;

-- ============================================
-- 9. FUNCTION FOR ADMIN TO MANUALLY VERIFY USER
-- ============================================

CREATE OR REPLACE FUNCTION admin_verify_user(
  user_id UUID,
  admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET
    email_domain_verified = TRUE,
    verification_status = 'manually_verified',
    verified_at = NOW()
  WHERE id = user_id;

  -- Log the verification action
  INSERT INTO public.audit_logs (
    event_type,
    action,
    actor_id,
    resource_type,
    resource_id,
    details
  ) VALUES (
    'user_verification',
    'manual_verify',
    auth.uid(),
    'user',
    user_id,
    jsonb_build_object('notes', admin_notes)
  );

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- ============================================
-- 10. FUNCTION TO ADD DOMAIN TO ORGANIZATION
-- ============================================

CREATE OR REPLACE FUNCTION add_organization_domain(
  org_id UUID,
  new_domain TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.organizations
  SET
    allowed_domains = array_append(COALESCE(allowed_domains, '{}'), LOWER(new_domain)),
    updated_at = NOW()
  WHERE id = org_id;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION extract_email_domain(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_domain_allowed(TEXT, UUID, UUID) TO authenticated;
