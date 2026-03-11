-- ===========================================
-- Federal Challenges: Security Hardening
-- Migration: 067_federal_challenges_hardening.sql
-- Fixes: slug collision, UPDATE RLS self-approval, submitted_by default
-- ===========================================

-- ─────────────────────────────────────────────
-- 1. Fix slug trigger: append first 8 chars of UUID to prevent collision
--    Old: title-YYYY (collides if same title posted in same year)
--    New: title-YYYY-{uuid-prefix} (guaranteed unique)
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION federal_challenge_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'))
                    || '-' || to_char(NOW(), 'YYYY')
                    || '-' || substr(NEW.id::text, 1, 8);
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────
-- 2. Fix submitted_by: use DEFAULT auth.uid() so the server populates
--    the field — client should not need to pass it explicitly.
--    Note: auth.uid() is evaluated at INSERT time by Postgres.
-- ─────────────────────────────────────────────

ALTER TABLE federal_challenges
    ALTER COLUMN submitted_by SET DEFAULT auth.uid();

-- ─────────────────────────────────────────────
-- 3. Fix UPDATE RLS WITH CHECK: lock status field to prevent self-approval.
--    Previous WITH CHECK only verified submitted_by, not status.
--    An attacker could set status='approved' via an UPDATE and bypass review.
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Submitters can update their pending challenges" ON federal_challenges;

CREATE POLICY "Submitters can update their pending challenges"
    ON federal_challenges FOR UPDATE
    TO authenticated
    USING (submitted_by = auth.uid() AND status = 'pending_review')
    WITH CHECK (submitted_by = auth.uid() AND status = 'pending_review');

-- ─────────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────────

COMMENT ON COLUMN federal_challenges.submitted_by IS
    'Set by DB via DEFAULT auth.uid(). Client does not need to pass this field.';
