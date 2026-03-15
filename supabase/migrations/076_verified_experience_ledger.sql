-- ============================================================
-- 076: STEM Verified Experience Ledger — Phase 1
--
-- CLR 2.0-compliant schema for verified experiences, skill
-- extraction, and employer-facing portfolio discoverability.
--
-- Standards adopted:
--   • 1EdTech CLR 2.0 data model (Achievement + Result)
--   • ESCO skill taxonomy (seeded with common STEM skills)
--   • 5-level trust hierarchy for verification
--   • Append-only verification event log (event sourcing)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SKILL TAXONOMY (ESCO subset — STEM-focused seed data)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_taxonomy (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  esco_uri      TEXT        UNIQUE,                -- e.g. http://data.europa.eu/esco/skill/S1.1.0
  label         TEXT        NOT NULL,
  alt_labels    TEXT[]      DEFAULT '{}',
  description   TEXT,
  skill_type    TEXT        CHECK (skill_type IN ('knowledge','skill','competence','attitude')),
  broader_uri   TEXT,                              -- parent ESCO URI for hierarchy
  isco_group    TEXT,                              -- ISCO-08 occupation group code
  onet_element  TEXT,                              -- O*NET crosswalk
  is_stem       BOOLEAN     DEFAULT true,
  is_active     BOOLEAN     DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ESCO STEM seed data (representative subset; full 13K taxonomy loaded via data import)
INSERT INTO public.skill_taxonomy (esco_uri, label, alt_labels, skill_type, isco_group, is_stem) VALUES
  ('http://data.europa.eu/esco/skill/c877dc6f-7fdc-4ee2-a4a0-0d7c0695e6dd', 'Python (programming language)', ARRAY['Python'], 'skill', '2512', true),
  ('http://data.europa.eu/esco/skill/28c1a5d1-0c68-4124-9b33-1f7a2ccf1a13', 'machine learning', ARRAY['ML', 'deep learning'], 'competence', '2519', true),
  ('http://data.europa.eu/esco/skill/5c7a5d98-e8d3-4a56-84d2-f17b9e0e7ca6', 'data analysis', ARRAY['data analytics', 'statistical analysis'], 'skill', '2521', true),
  ('http://data.europa.eu/esco/skill/e6a5e4c3-9c2f-4e69-8a2f-c8a6e7b1c0f2', 'cybersecurity', ARRAY['information security', 'cyber defense'], 'competence', '2529', true),
  ('http://data.europa.eu/esco/skill/a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cloud computing', ARRAY['AWS', 'Azure', 'GCP'], 'skill', '2512', true),
  ('http://data.europa.eu/esco/skill/b2c3d4e5-f6a7-8901-bcde-f12345678901', 'robotics', ARRAY['autonomous systems', 'robot programming'], 'skill', '2149', true),
  ('http://data.europa.eu/esco/skill/c3d4e5f6-a7b8-9012-cdef-123456789012', 'nuclear engineering', ARRAY['reactor physics', 'radiation safety'], 'competence', '2141', true),
  ('http://data.europa.eu/esco/skill/d4e5f6a7-b8c9-0123-defa-234567890123', 'quantum computing', ARRAY['quantum algorithms', 'quantum circuits'], 'knowledge', '2519', true),
  ('http://data.europa.eu/esco/skill/e5f6a7b8-c9d0-1234-efab-345678901234', 'bioinformatics', ARRAY['genomics', 'computational biology'], 'competence', '2131', true),
  ('http://data.europa.eu/esco/skill/f6a7b8c9-d0e1-2345-fabc-456789012345', 'electrical engineering', ARRAY['circuit design', 'embedded systems'], 'competence', '2151', true),
  ('http://data.europa.eu/esco/skill/a7b8c9d0-e1f2-3456-abcd-567890123456', 'software development', ARRAY['programming', 'software engineering'], 'skill', '2512', true),
  ('http://data.europa.eu/esco/skill/b8c9d0e1-f2a3-4567-bcde-678901234567', 'project management', ARRAY['agile', 'scrum', 'kanban'], 'competence', '1219', false),
  ('http://data.europa.eu/esco/skill/c9d0e1f2-a3b4-5678-cdef-789012345678', 'research methodology', ARRAY['scientific research', 'experimental design'], 'competence', '2111', true),
  ('http://data.europa.eu/esco/skill/d0e1f2a3-b4c5-6789-defa-890123456789', 'technical writing', ARRAY['documentation', 'scientific writing'], 'skill', '2166', false),
  ('http://data.europa.eu/esco/skill/e1f2a3b4-c5d6-7890-efab-901234567890', 'data engineering', ARRAY['ETL', 'data pipelines', 'Apache Spark'], 'skill', '2521', true),
  ('http://data.europa.eu/esco/skill/f2a3b4c5-d6e7-8901-fabc-012345678901', 'artificial intelligence', ARRAY['AI', 'neural networks', 'NLP'], 'competence', '2519', true),
  ('http://data.europa.eu/esco/skill/a3b4c5d6-e7f8-9012-abcd-123456789012', 'materials science', ARRAY['nanotechnology', 'metallurgy'], 'knowledge', '2141', true),
  ('http://data.europa.eu/esco/skill/b4c5d6e7-f8a9-0123-bcde-234567890123', 'DevOps', ARRAY['CI/CD', 'Docker', 'Kubernetes', 'infrastructure as code'], 'skill', '2512', true),
  ('http://data.europa.eu/esco/skill/c5d6e7f8-a9b0-1234-cdef-345678901234', 'GIS and geospatial analysis', ARRAY['GIS', 'remote sensing', 'mapping'], 'skill', '2166', true),
  ('http://data.europa.eu/esco/skill/d6e7f8a9-b0c1-2345-defa-456789012345', 'laboratory techniques', ARRAY['wet lab', 'sample preparation', 'instrumentation'], 'skill', '3111', true)
ON CONFLICT (esco_uri) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 2. PORTFOLIO PROFILES (one per user)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio_profiles (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Public-facing
  headline                    TEXT,
  bio                         TEXT,
  target_role                 TEXT,
  target_industries           TEXT[]      DEFAULT '{}',

  -- Computed discoverability (updated by trigger)
  is_discoverable             BOOLEAN     DEFAULT false,
  discoverability_score       INT         DEFAULT 0  CHECK (discoverability_score BETWEEN 0 AND 100),
  verified_experience_count   INT         DEFAULT 0,

  -- CLR 2.0 export
  clr_learner_id              TEXT        UNIQUE DEFAULT gen_random_uuid()::TEXT,

  -- Profile completeness fields
  github_url                  TEXT,
  linkedin_url                TEXT,
  portfolio_url               TEXT,
  location                    TEXT,
  is_open_to_opportunities    BOOLEAN     DEFAULT true,

  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. VERIFIED EXPERIENCES (CLR 2.0 Achievement Result)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.verified_experiences (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id          UUID        REFERENCES public.portfolio_profiles(id) ON DELETE SET NULL,

  -- CLR 2.0 Achievement fields
  title                 TEXT        NOT NULL,
  description           TEXT,
  experience_type       TEXT        NOT NULL CHECK (experience_type IN (
                          'internship','research','project','course',
                          'hackathon','volunteer','employment',
                          'extracurricular','certification','publication','other'
                        )),

  -- Organization
  organization_name     TEXT,
  organization_type     TEXT        CHECK (organization_type IN (
                          'employer','university','research_lab','nonprofit',
                          'government','national_lab','startup','other'
                        )),
  organization_id       UUID,                     -- Optional platform org link

  -- Dates
  start_date            DATE,
  end_date              DATE,
  is_current            BOOLEAN     DEFAULT false,

  -- Location
  location              TEXT,
  is_remote             BOOLEAN     DEFAULT false,

  -- ── TRUST HIERARCHY ─────────────────────────────────────
  -- 1: self_reported  → student added, no external verification
  -- 2: peer_attested  → another student confirmed
  -- 3: institutional  → faculty / advisor verified
  -- 4: employer_verified → hiring manager / supervisor verified
  -- 5: third_party_accredited → external accreditation body
  trust_level           INT         DEFAULT 1 CHECK (trust_level BETWEEN 1 AND 5),

  -- ── VERIFICATION STATE MACHINE ──────────────────────────
  -- draft → submitted → notified → under_review → verified | rejected | revision_requested
  verification_status   TEXT        DEFAULT 'draft' CHECK (verification_status IN (
                          'draft','submitted','notified',
                          'under_review','verified','rejected','revision_requested'
                        )),

  -- Verifier details (set when verification is requested)
  verifier_name         TEXT,
  verifier_email        TEXT,
  verifier_title        TEXT,
  verifier_type         TEXT        CHECK (verifier_type IN (
                          'faculty','supervisor','peer','hr','accreditor','advisor'
                        )),
  verifier_user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at           TIMESTAMPTZ,
  verifier_notes        TEXT,

  -- AI-extracted data (populated by skill extraction pipeline)
  extracted_skills      JSONB       DEFAULT '[]',  -- Array of {esco_uri, label, confidence, evidence_span}
  capability_tags       TEXT[]      DEFAULT '{}',  -- High-level capability labels

  -- Discoverability
  is_featured           BOOLEAN     DEFAULT false,

  -- CLR 2.0 compliance
  clr_achievement_type  TEXT        DEFAULT 'Ext:Experience',
  clr_achievement_id    TEXT,                     -- External CLR achievement ID

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. EXPERIENCE EVIDENCE (immutable attachments)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experience_evidence (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id   UUID        NOT NULL REFERENCES public.verified_experiences(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  evidence_type   TEXT        NOT NULL CHECK (evidence_type IN (
                    'file','url','github','paper','video','image','certificate','demo'
                  )),
  title           TEXT        NOT NULL,
  url             TEXT,
  file_path       TEXT,                           -- Supabase Storage path
  file_size_bytes INT,
  mime_type       TEXT,
  description     TEXT,
  is_public       BOOLEAN     DEFAULT true,

  uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 5. EXPERIENCE SKILLS (ESCO skill triples with evidence)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experience_skills (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id       UUID        NOT NULL REFERENCES public.verified_experiences(id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ESCO reference
  esco_uri            TEXT        REFERENCES public.skill_taxonomy(esco_uri) ON DELETE SET NULL,
  esco_label          TEXT        NOT NULL,
  skill_type          TEXT        CHECK (skill_type IN ('knowledge','skill','competence','attitude')),

  -- Extraction provenance
  confidence          DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
  evidence_span       TEXT,                       -- Exact text span from which skill was extracted
  extraction_method   TEXT        DEFAULT 'manual' CHECK (extraction_method IN (
                        'manual','ai_extracted','institution_mapped','employer_confirmed'
                      )),

  -- Endorsement
  is_verified         BOOLEAN     DEFAULT false,
  endorsed_by_verifier BOOLEAN    DEFAULT false,

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 6. VERIFICATION EVENTS (append-only event log)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.verification_events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id   UUID        NOT NULL REFERENCES public.verified_experiences(id) ON DELETE CASCADE,

  -- Event type
  event_type      TEXT        NOT NULL CHECK (event_type IN (
                    'created','submitted','verifier_notified','verifier_viewed',
                    'verification_started','revision_requested',
                    'verified','rejected','withdrawn','expired','skill_extracted'
                  )),

  -- Actor
  actor_type      TEXT        NOT NULL CHECK (actor_type IN ('student','verifier','system','admin')),
  actor_user_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name      TEXT,

  -- Payload (immutable snapshot)
  previous_status TEXT,
  new_status      TEXT,
  previous_trust  INT,
  new_trust       INT,
  notes           TEXT,
  metadata        JSONB       DEFAULT '{}',

  -- Immutable — no updated_at
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 7. EMPLOYER SAVED TALENT (lightweight CRM, Phase 1 seed)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employer_talent_saves (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_status TEXT        DEFAULT 'saved' CHECK (pipeline_status IN (
                    'saved','contacted','interviewing','offered','hired','archived'
                  )),
  notes           TEXT,
  tags            TEXT[]      DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employer_id, student_id)
);

-- ────────────────────────────────────────────────────────────
-- 8. INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_verified_experiences_user    ON public.verified_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_verified_experiences_status  ON public.verified_experiences(verification_status);
CREATE INDEX IF NOT EXISTS idx_verified_experiences_trust   ON public.verified_experiences(trust_level);
CREATE INDEX IF NOT EXISTS idx_verified_experiences_type    ON public.verified_experiences(experience_type);
CREATE INDEX IF NOT EXISTS idx_verified_experiences_discoverable
  ON public.verified_experiences(user_id, verification_status, trust_level)
  WHERE verification_status = 'verified';

CREATE INDEX IF NOT EXISTS idx_experience_evidence_exp      ON public.experience_evidence(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_skills_exp        ON public.experience_skills(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_skills_user       ON public.experience_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_skills_esco       ON public.experience_skills(esco_uri);
CREATE INDEX IF NOT EXISTS idx_verification_events_exp      ON public.verification_events(experience_id);
CREATE INDEX IF NOT EXISTS idx_verification_events_type     ON public.verification_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_discoverable       ON public.portfolio_profiles(is_discoverable, discoverability_score DESC);
CREATE INDEX IF NOT EXISTS idx_employer_saves_employer      ON public.employer_talent_saves(employer_id);

-- ────────────────────────────────────────────────────────────
-- 9. FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────

-- Function: compute discoverability score and gate
CREATE OR REPLACE FUNCTION public.compute_portfolio_discoverability(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_verified_count   INT;
  v_score            INT := 0;
  v_profile          public.portfolio_profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_profile FROM public.portfolio_profiles WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- Count verified experiences (trust_level >= 3, status = 'verified')
  SELECT COUNT(*) INTO v_verified_count
  FROM public.verified_experiences
  WHERE user_id = p_user_id
    AND verification_status = 'verified'
    AND trust_level >= 3;

  -- Score components (max 100)
  -- Verified experiences: 40 pts (10 per verified, max 4)
  v_score := v_score + LEAST(v_verified_count * 10, 40);

  -- Profile completeness: 60 pts
  IF v_profile.headline IS NOT NULL AND length(v_profile.headline) > 10 THEN v_score := v_score + 10; END IF;
  IF v_profile.bio IS NOT NULL AND length(v_profile.bio) > 50 THEN v_score := v_score + 10; END IF;
  IF v_profile.target_role IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_profile.github_url IS NOT NULL OR v_profile.portfolio_url IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_profile.linkedin_url IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF array_length(v_profile.target_industries, 1) > 0 THEN v_score := v_score + 10; END IF;

  UPDATE public.portfolio_profiles SET
    discoverability_score     = v_score,
    verified_experience_count = v_verified_count,
    -- Discoverability gate: ≥1 verified experience (trust 3+) AND score ≥ 80
    is_discoverable           = (v_verified_count >= 1 AND v_score >= 80),
    updated_at                = NOW()
  WHERE user_id = p_user_id;
END;
$$;

-- Trigger: auto-create portfolio profile on user creation
CREATE OR REPLACE FUNCTION public.trg_fn_create_portfolio_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.portfolio_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_portfolio_profile ON auth.users;
CREATE TRIGGER trg_create_portfolio_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_create_portfolio_profile();

-- Trigger: recompute discoverability when experience verification changes
CREATE OR REPLACE FUNCTION public.trg_fn_refresh_discoverability()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM public.compute_portfolio_discoverability(
    COALESCE(NEW.user_id, OLD.user_id)
  );
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_discoverability ON public.verified_experiences;
CREATE TRIGGER trg_refresh_discoverability
  AFTER INSERT OR UPDATE OF verification_status, trust_level ON public.verified_experiences
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_refresh_discoverability();

-- Trigger: also refresh when portfolio profile fields change
DROP TRIGGER IF EXISTS trg_refresh_discoverability_profile ON public.portfolio_profiles;
CREATE TRIGGER trg_refresh_discoverability_profile
  AFTER UPDATE OF headline, bio, target_role, github_url, linkedin_url, portfolio_url, target_industries
  ON public.portfolio_profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_refresh_discoverability();

-- Function: append verification event (enforces immutability)
CREATE OR REPLACE FUNCTION public.append_verification_event(
  p_experience_id   UUID,
  p_event_type      TEXT,
  p_actor_type      TEXT,
  p_actor_user_id   UUID DEFAULT NULL,
  p_actor_name      TEXT DEFAULT NULL,
  p_prev_status     TEXT DEFAULT NULL,
  p_new_status      TEXT DEFAULT NULL,
  p_prev_trust      INT  DEFAULT NULL,
  p_new_trust       INT  DEFAULT NULL,
  p_notes           TEXT DEFAULT NULL,
  p_metadata        JSONB DEFAULT '{}'
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO public.verification_events (
    experience_id, event_type, actor_type, actor_user_id, actor_name,
    previous_status, new_status, previous_trust, new_trust, notes, metadata
  ) VALUES (
    p_experience_id, p_event_type, p_actor_type, p_actor_user_id, p_actor_name,
    p_prev_status, p_new_status, p_prev_trust, p_new_trust, p_notes, p_metadata
  ) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Function: submit experience for verification
CREATE OR REPLACE FUNCTION public.submit_experience_for_verification(
  p_experience_id   UUID,
  p_verifier_name   TEXT,
  p_verifier_email  TEXT,
  p_verifier_title  TEXT,
  p_verifier_type   TEXT,
  p_notes           TEXT DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_exp public.verified_experiences%ROWTYPE;
BEGIN
  SELECT * INTO v_exp FROM public.verified_experiences WHERE id = p_experience_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Experience not found'; END IF;
  IF v_exp.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF v_exp.verification_status NOT IN ('draft','revision_requested') THEN
    RAISE EXCEPTION 'Experience is already submitted or verified';
  END IF;

  UPDATE public.verified_experiences SET
    verification_status = 'submitted',
    verifier_name       = p_verifier_name,
    verifier_email      = p_verifier_email,
    verifier_title      = p_verifier_title,
    verifier_type       = p_verifier_type,
    updated_at          = NOW()
  WHERE id = p_experience_id;

  PERFORM public.append_verification_event(
    p_experience_id, 'submitted', 'student', auth.uid(), NULL,
    v_exp.verification_status, 'submitted', v_exp.trust_level, v_exp.trust_level, p_notes, '{}'
  );
END;
$$;

-- ────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.portfolio_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_experiences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_evidence      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_talent_saves    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_taxonomy           ENABLE ROW LEVEL SECURITY;

-- skill_taxonomy: public read (already in 075, kept idempotent)
DROP POLICY IF EXISTS "Public read skill_taxonomy" ON public.skill_taxonomy;
CREATE POLICY "Public read skill_taxonomy" ON public.skill_taxonomy FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage skill_taxonomy_076" ON public.skill_taxonomy;
CREATE POLICY "Admin manage skill_taxonomy_076" ON public.skill_taxonomy FOR ALL
  USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- portfolio_profiles
DROP POLICY IF EXISTS "Users read own portfolio" ON public.portfolio_profiles;
DROP POLICY IF EXISTS "Users update own portfolio" ON public.portfolio_profiles;
DROP POLICY IF EXISTS "Authenticated read discoverable portfolios" ON public.portfolio_profiles;
DROP POLICY IF EXISTS "Admins manage portfolios" ON public.portfolio_profiles;
CREATE POLICY "Users read own portfolio" ON public.portfolio_profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own portfolio" ON public.portfolio_profiles
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Authenticated read discoverable portfolios" ON public.portfolio_profiles
  FOR SELECT TO authenticated USING (is_discoverable = true);
CREATE POLICY "Admins manage portfolios" ON public.portfolio_profiles
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- verified_experiences
DROP POLICY IF EXISTS "Users manage own experiences" ON public.verified_experiences;
DROP POLICY IF EXISTS "Authenticated read verified experiences" ON public.verified_experiences;
DROP POLICY IF EXISTS "Verifiers read assigned experiences" ON public.verified_experiences;
DROP POLICY IF EXISTS "Admins manage all experiences" ON public.verified_experiences;
CREATE POLICY "Users manage own experiences" ON public.verified_experiences
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authenticated read verified experiences" ON public.verified_experiences
  FOR SELECT TO authenticated
  USING (verification_status = 'verified' AND trust_level >= 3
    AND user_id IN (SELECT user_id FROM public.portfolio_profiles WHERE is_discoverable = true));
CREATE POLICY "Verifiers read assigned experiences" ON public.verified_experiences
  FOR SELECT TO authenticated USING (verifier_user_id = auth.uid());
CREATE POLICY "Admins manage all experiences" ON public.verified_experiences
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- experience_evidence
DROP POLICY IF EXISTS "Users manage own evidence" ON public.experience_evidence;
DROP POLICY IF EXISTS "Authenticated read public evidence" ON public.experience_evidence;
DROP POLICY IF EXISTS "Admins manage evidence" ON public.experience_evidence;
CREATE POLICY "Users manage own evidence" ON public.experience_evidence
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authenticated read public evidence" ON public.experience_evidence
  FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Admins manage evidence" ON public.experience_evidence
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- experience_skills
DROP POLICY IF EXISTS "Users manage own skills" ON public.experience_skills;
DROP POLICY IF EXISTS "Authenticated read skills for verified" ON public.experience_skills;
DROP POLICY IF EXISTS "Admins manage skills" ON public.experience_skills;
CREATE POLICY "Users manage own skills" ON public.experience_skills
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authenticated read skills for verified" ON public.experience_skills
  FOR SELECT TO authenticated
  USING (experience_id IN (
    SELECT id FROM public.verified_experiences
    WHERE verification_status = 'verified' AND trust_level >= 3
  ));
CREATE POLICY "Admins manage skills" ON public.experience_skills
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- verification_events (read-only for owner and verifier; inserts via function only)
DROP POLICY IF EXISTS "Users read own verification events" ON public.verification_events;
DROP POLICY IF EXISTS "Verifiers read assigned events" ON public.verification_events;
DROP POLICY IF EXISTS "Admins manage verification events" ON public.verification_events;
CREATE POLICY "Users read own verification events" ON public.verification_events
  FOR SELECT USING (
    experience_id IN (SELECT id FROM public.verified_experiences WHERE user_id = auth.uid())
  );
CREATE POLICY "Verifiers read assigned events" ON public.verification_events
  FOR SELECT TO authenticated USING (
    experience_id IN (SELECT id FROM public.verified_experiences WHERE verifier_user_id = auth.uid())
  );
CREATE POLICY "Admins manage verification events" ON public.verification_events
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));

-- employer_talent_saves
DROP POLICY IF EXISTS "Employer manages own saves" ON public.employer_talent_saves;
DROP POLICY IF EXISTS "Admins manage talent saves" ON public.employer_talent_saves;
CREATE POLICY "Employer manages own saves" ON public.employer_talent_saves
  FOR ALL USING (employer_id = auth.uid()) WITH CHECK (employer_id = auth.uid());
CREATE POLICY "Admins manage talent saves" ON public.employer_talent_saves
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin','super_admin'));
