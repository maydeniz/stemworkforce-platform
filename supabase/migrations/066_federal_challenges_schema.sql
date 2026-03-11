-- ===========================================
-- Federal Challenges Portal Schema
-- Migration: 066_federal_challenges_schema.sql
-- DOD/federal challenge posting and eligibility tracking
-- ===========================================

-- ─────────────────────────────────────────────
-- FEDERAL CHALLENGES (posted by agencies/MIIs)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS federal_challenges (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                        TEXT UNIQUE NOT NULL,

    -- Agency
    agency_name                 TEXT NOT NULL,
    sub_agency                  TEXT NOT NULL DEFAULT '',
    contact_name                TEXT NOT NULL DEFAULT '',
    contact_email               TEXT NOT NULL,
    prize_authority             TEXT NOT NULL,   -- '15 USC 3719' | '10 USC 4025' | etc.
    authority_number            TEXT DEFAULT '',

    -- Challenge config
    title                       TEXT NOT NULL,
    short_description           TEXT NOT NULL DEFAULT '',
    problem_statement           TEXT NOT NULL DEFAULT '',
    classification              TEXT NOT NULL DEFAULT 'unclassified'
                                    CHECK (classification IN ('unclassified','cui','secret')),
    award_mechanism             TEXT NOT NULL DEFAULT 'prize'
                                    CHECK (award_mechanism IN ('prize','subaward','ota','sbir-phase2','contract')),
    award_min                   BIGINT DEFAULT 0,
    award_max                   BIGINT NOT NULL DEFAULT 0,
    tech_domains                TEXT[] DEFAULT '{}',
    phases                      INTEGER DEFAULT 1,

    -- Eligibility gates (configurable)
    require_sam_gov             BOOLEAN DEFAULT TRUE,
    require_foci_disclosure     BOOLEAN DEFAULT TRUE,
    require_clearance           TEXT DEFAULT 'none'
                                    CHECK (require_clearance IN ('none','public-trust','secret','top-secret','ts-sci')),
    excluded_countries          BOOLEAN DEFAULT TRUE,   -- ITAR §126.1 list
    allow_individuals           BOOLEAN DEFAULT FALSE,
    allow_small_business        BOOLEAN DEFAULT TRUE,
    allow_universities          BOOLEAN DEFAULT TRUE,
    allow_large_companies       BOOLEAN DEFAULT TRUE,

    -- IP & Legal
    ip_assignment               TEXT DEFAULT 'solver-retains'
                                    CHECK (ip_assignment IN ('solver-retains','negotiated-license','shared','government-unlimited')),
    nda_required                BOOLEAN DEFAULT FALSE,
    ota_track                   BOOLEAN DEFAULT FALSE,
    sbir                        BOOLEAN DEFAULT FALSE,
    congressional_notice_req    BOOLEAN DEFAULT FALSE,
    funding_confirmed           BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timeline
    registration_open           DATE,
    submission_deadline         DATE NOT NULL,
    judging_period_end          DATE,
    announcement_date           DATE,
    submission_format           TEXT[] DEFAULT '{}',
    cui_content                 BOOLEAN DEFAULT FALSE,

    -- Platform fields
    status                      TEXT NOT NULL DEFAULT 'pending_review'
                                    CHECK (status IN ('pending_review','approved','active','rejected','closed')),
    submitted_by                UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_by                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    review_notes                TEXT DEFAULT '',
    featured                    BOOLEAN DEFAULT FALSE,

    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug from title if not provided
CREATE OR REPLACE FUNCTION federal_challenge_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'))
                    || '-' || to_char(NOW(), 'YYYY');
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS federal_challenge_slug_trigger ON federal_challenges;
CREATE TRIGGER federal_challenge_slug_trigger
    BEFORE INSERT OR UPDATE ON federal_challenges
    FOR EACH ROW EXECUTE FUNCTION federal_challenge_slug();

-- ─────────────────────────────────────────────
-- ELIGIBILITY GATE RESULTS (per user per challenge)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS federal_challenge_eligibility (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id    UUID NOT NULL REFERENCES federal_challenges(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Gate answers stored as JSONB: { gate_id: 'pass' | 'fail' | 'pending' }
    gate_results    JSONB NOT NULL DEFAULT '{}',
    overall_status  TEXT NOT NULL DEFAULT 'incomplete'
                        CHECK (overall_status IN ('incomplete','eligible','ineligible')),

    -- Attestations
    fraud_warning_acknowledged  BOOLEAN DEFAULT FALSE,
    acknowledged_at             TIMESTAMPTZ,

    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(challenge_id, user_id)
);

CREATE OR REPLACE FUNCTION federal_eligibility_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS federal_eligibility_updated_at_trigger ON federal_challenge_eligibility;
CREATE TRIGGER federal_eligibility_updated_at_trigger
    BEFORE UPDATE ON federal_challenge_eligibility
    FOR EACH ROW EXECUTE FUNCTION federal_eligibility_updated_at();

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_federal_challenges_status
    ON federal_challenges(status);
CREATE INDEX IF NOT EXISTS idx_federal_challenges_classification
    ON federal_challenges(classification);
CREATE INDEX IF NOT EXISTS idx_federal_challenges_deadline
    ON federal_challenges(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_federal_challenges_submitted_by
    ON federal_challenges(submitted_by);
CREATE INDEX IF NOT EXISTS idx_federal_eligibility_user
    ON federal_challenge_eligibility(user_id);
CREATE INDEX IF NOT EXISTS idx_federal_eligibility_challenge
    ON federal_challenge_eligibility(challenge_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

ALTER TABLE federal_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE federal_challenge_eligibility ENABLE ROW LEVEL SECURITY;

-- federal_challenges policies:
-- Anyone can read approved/active challenges
DROP POLICY IF EXISTS "Public can view active federal challenges" ON federal_challenges;
CREATE POLICY "Public can view active federal challenges"
    ON federal_challenges FOR SELECT
    USING (status IN ('approved', 'active'));

-- Authenticated users can submit new challenges (pending_review)
DROP POLICY IF EXISTS "Authenticated users can submit federal challenges" ON federal_challenges;
CREATE POLICY "Authenticated users can submit federal challenges"
    ON federal_challenges FOR INSERT
    TO authenticated
    WITH CHECK (status = 'pending_review' AND submitted_by = auth.uid());

-- Submitters can update their own pending challenges
DROP POLICY IF EXISTS "Submitters can update their pending challenges" ON federal_challenges;
CREATE POLICY "Submitters can update their pending challenges"
    ON federal_challenges FOR UPDATE
    TO authenticated
    USING (submitted_by = auth.uid() AND status = 'pending_review')
    WITH CHECK (submitted_by = auth.uid());

-- Admins can do everything
DROP POLICY IF EXISTS "Admins have full access to federal challenges" ON federal_challenges;
CREATE POLICY "Admins have full access to federal challenges"
    ON federal_challenges FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- federal_challenge_eligibility policies:
-- Users can only see their own eligibility records
DROP POLICY IF EXISTS "Users can view their own eligibility" ON federal_challenge_eligibility;
CREATE POLICY "Users can view their own eligibility"
    ON federal_challenge_eligibility FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own eligibility" ON federal_challenge_eligibility;
CREATE POLICY "Users can insert their own eligibility"
    ON federal_challenge_eligibility FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own eligibility" ON federal_challenge_eligibility;
CREATE POLICY "Users can update their own eligibility"
    ON federal_challenge_eligibility FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admins can view all eligibility records
DROP POLICY IF EXISTS "Admins can view all eligibility records" ON federal_challenge_eligibility;
CREATE POLICY "Admins can view all eligibility records"
    ON federal_challenge_eligibility FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────────

COMMENT ON TABLE federal_challenges IS
    'Federal/DOD challenge postings. Authorized under 15 USC 3719, 10 USC 4025, 10 USC 4022, 15 USC 638.';
COMMENT ON COLUMN federal_challenges.funding_confirmed IS
    'Required: 15 USC 3719 — prizes must be fully funded before public announcement.';
COMMENT ON COLUMN federal_challenges.classification IS
    'Information classification level. CUI challenges gate problem statement behind eligibility verification.';
COMMENT ON TABLE federal_challenge_eligibility IS
    'Per-user eligibility gate results. gate_results JSONB stores pass/fail per gate ID. Mirrors localStorage state server-side.';
