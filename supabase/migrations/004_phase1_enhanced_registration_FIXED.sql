-- ============================================
-- PHASE 1: Enhanced Registration Database Migration
-- FIXED VERSION - Handles existing tables
-- ============================================

-- ============================================
-- 1. CREATE/UPDATE ENUM TYPES
-- ============================================

DO $$
BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'educator', 'partner', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE organization_type AS ENUM ('federal', 'national-lab', 'municipality', 'academic', 'private', 'nonprofit', 'healthcare');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE citizenship_status AS ENUM ('us_citizen', 'us_national', 'permanent_resident', 'work_visa', 'student_visa', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE veteran_status AS ENUM ('not_veteran', 'veteran', 'active_duty', 'national_guard', 'veteran_disabled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE military_branch AS ENUM ('army', 'navy', 'air_force', 'marines', 'coast_guard', 'space_force');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE clearance_status AS ENUM ('none', 'active', 'current', 'expired', 'in_progress');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE clearance_level AS ENUM ('none', 'public-trust', 'secret', 'top-secret', 'top-secret-sci');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE institution_type AS ENUM ('university', 'college', 'community_college', 'trade_school', 'k12', 'training_provider');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 2. UPDATE USERS TABLE - Add Phase 1 Fields
-- ============================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'job_seeker',
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'profile';

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS citizenship TEXT,
ADD COLUMN IF NOT EXISTS clearance_level TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS clearance_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS veteran_status TEXT DEFAULT 'not_veteran',
ADD COLUMN IF NOT EXISTS military_branch TEXT,
ADD COLUMN IF NOT EXISTS requires_sponsorship BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT FALSE;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS organization_id UUID,
ADD COLUMN IF NOT EXISTS job_title TEXT;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS institution_id UUID,
ADD COLUMN IF NOT EXISTS department TEXT;

-- ============================================
-- 3. CREATE OR UPDATE ORGANIZATIONS TABLE
-- ============================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add missing columns to existing organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_industry TEXT,
ADD COLUMN IF NOT EXISTS secondary_industries TEXT[],
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS agency_code TEXT,
ADD COLUMN IF NOT EXISTS cage_code TEXT,
ADD COLUMN IF NOT EXISTS sam_uei TEXT,
ADD COLUMN IF NOT EXISTS clearance_sponsor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS visa_sponsor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS e_verify_participant BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS federal_contractor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- ============================================
-- 4. CREATE OR UPDATE INSTITUTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add missing columns to existing institutions table
ALTER TABLE public.institutions
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS carnegie_classification TEXT,
ADD COLUMN IF NOT EXISTS accreditation_body TEXT,
ADD COLUMN IF NOT EXISTS ipeds_unit_id TEXT,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS stem_programs TEXT[],
ADD COLUMN IF NOT EXISTS total_stem_enrollment INTEGER,
ADD COLUMN IF NOT EXISTS graduation_rate DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS career_services_email TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- ============================================
-- 5. ADD FOREIGN KEY CONSTRAINTS (if not exist)
-- ============================================

DO $$
BEGIN
    ALTER TABLE public.users 
    ADD CONSTRAINT fk_users_organization 
    FOREIGN KEY (organization_id) 
    REFERENCES public.organizations(id) 
    ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.users 
    ADD CONSTRAINT fk_users_institution 
    FOREIGN KEY (institution_id) 
    REFERENCES public.institutions(id) 
    ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 6. CREATE USER PROFILES VIEW
-- ============================================

DROP VIEW IF EXISTS public.user_profiles_view;

CREATE VIEW public.user_profiles_view AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.role,
    u.profile_complete,
    u.citizenship,
    u.clearance_level,
    u.clearance_status,
    u.veteran_status,
    u.military_branch,
    u.requires_sponsorship,
    u.willing_to_relocate,
    u.organization_id,
    u.job_title,
    o.name as organization_name,
    o.type as organization_type,
    o.primary_industry,
    u.institution_id,
    u.department,
    i.name as institution_name,
    i.type as institution_type,
    u.created_at,
    u.updated_at
FROM public.users u
LEFT JOIN public.organizations o ON u.organization_id = o.id
LEFT JOIN public.institutions i ON u.institution_id = i.id;

-- ============================================
-- 7. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_citizenship ON public.users(citizenship);
CREATE INDEX IF NOT EXISTS idx_users_clearance_level ON public.users(clearance_level);
CREATE INDEX IF NOT EXISTS idx_users_veteran_status ON public.users(veteran_status);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON public.users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON public.users(institution_id);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_primary_industry ON public.organizations(primary_industry);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON public.institutions(type);
CREATE INDEX IF NOT EXISTS idx_institutions_state ON public.institutions(state);

-- ============================================
-- 8. CREATE SYNC FUNCTION AND TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
    inst_id UUID;
BEGIN
    IF NEW.raw_user_meta_data->>'organization_name' IS NOT NULL THEN
        INSERT INTO public.organizations (name, type, website, created_by)
        VALUES (
            NEW.raw_user_meta_data->>'organization_name',
            COALESCE(NEW.raw_user_meta_data->>'organization_type', 'private'),
            NEW.raw_user_meta_data->>'organization_website',
            NEW.id
        )
        ON CONFLICT DO NOTHING
        RETURNING id INTO org_id;
        
        IF org_id IS NULL THEN
            SELECT id INTO org_id FROM public.organizations 
            WHERE name = NEW.raw_user_meta_data->>'organization_name' 
            LIMIT 1;
        END IF;
    END IF;
    
    IF NEW.raw_user_meta_data->>'institution_name' IS NOT NULL THEN
        INSERT INTO public.institutions (name, type, created_by)
        VALUES (
            NEW.raw_user_meta_data->>'institution_name',
            COALESCE(NEW.raw_user_meta_data->>'institution_type', 'university'),
            NEW.id
        )
        ON CONFLICT DO NOTHING
        RETURNING id INTO inst_id;
        
        IF inst_id IS NULL THEN
            SELECT id INTO inst_id FROM public.institutions 
            WHERE name = NEW.raw_user_meta_data->>'institution_name' 
            LIMIT 1;
        END IF;
    END IF;

    INSERT INTO public.users (
        id, email, first_name, last_name, phone, role,
        citizenship, clearance_level, clearance_status,
        veteran_status, military_branch, requires_sponsorship,
        willing_to_relocate, organization_id, institution_id,
        job_title, department, created_at, updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'job_seeker'),
        NEW.raw_user_meta_data->>'citizenship',
        COALESCE(NEW.raw_user_meta_data->>'clearance_level', 'none'),
        COALESCE(NEW.raw_user_meta_data->>'clearance_status', 'none'),
        COALESCE(NEW.raw_user_meta_data->>'veteran_status', 'not_veteran'),
        NEW.raw_user_meta_data->>'military_branch',
        COALESCE((NEW.raw_user_meta_data->>'requires_sponsorship')::BOOLEAN, FALSE),
        COALESCE((NEW.raw_user_meta_data->>'willing_to_relocate')::BOOLEAN, FALSE),
        org_id,
        inst_id,
        NEW.raw_user_meta_data->>'job_title',
        NEW.raw_user_meta_data->>'department',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        citizenship = EXCLUDED.citizenship,
        clearance_level = EXCLUDED.clearance_level,
        clearance_status = EXCLUDED.clearance_status,
        veteran_status = EXCLUDED.veteran_status,
        military_branch = EXCLUDED.military_branch,
        requires_sponsorship = EXCLUDED.requires_sponsorship,
        willing_to_relocate = EXCLUDED.willing_to_relocate,
        organization_id = COALESCE(EXCLUDED.organization_id, public.users.organization_id),
        institution_id = COALESCE(EXCLUDED.institution_id, public.users.institution_id),
        job_title = EXCLUDED.job_title,
        department = EXCLUDED.department,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_user_metadata();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_user_metadata();

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organizations are viewable by everyone" ON public.organizations;
CREATE POLICY "Organizations are viewable by everyone"
ON public.organizations FOR SELECT TO public
USING (active = true OR active IS NULL);

DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Organization creators can update their own" ON public.organizations;
CREATE POLICY "Organization creators can update their own"
ON public.organizations FOR UPDATE TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL)
WITH CHECK (true);

DROP POLICY IF EXISTS "Institutions are viewable by everyone" ON public.institutions;
CREATE POLICY "Institutions are viewable by everyone"
ON public.institutions FOR SELECT TO public
USING (active = true OR active IS NULL);

DROP POLICY IF EXISTS "Authenticated users can create institutions" ON public.institutions;
CREATE POLICY "Authenticated users can create institutions"
ON public.institutions FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Institution creators can update their own" ON public.institutions;
CREATE POLICY "Institution creators can update their own"
ON public.institutions FOR UPDATE TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL)
WITH CHECK (true);

-- ============================================
-- 10. GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public.organizations TO anon, authenticated;
GRANT INSERT, UPDATE ON public.organizations TO authenticated;
GRANT SELECT ON public.institutions TO anon, authenticated;
GRANT INSERT, UPDATE ON public.institutions TO authenticated;
GRANT SELECT ON public.user_profiles_view TO authenticated;

-- ============================================
-- 11. UPDATE TIMESTAMP TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_institutions_updated_at ON public.institutions;
CREATE TRIGGER update_institutions_updated_at
    BEFORE UPDATE ON public.institutions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 1 MIGRATION COMPLETE
-- ============================================
