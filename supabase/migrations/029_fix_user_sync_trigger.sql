-- ============================================
-- FIX USER SYNC TRIGGER
-- Ensures users are properly created in public.users
-- when they sign up via Supabase Auth
-- ============================================

-- Drop and recreate the sync function with correct role mapping
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
    inst_id UUID;
    user_role TEXT;
BEGIN
    -- Map role to valid enum value (handle variations)
    user_role := COALESCE(
        CASE LOWER(NEW.raw_user_meta_data->>'role')
            WHEN 'job_seeker' THEN 'jobseeker'
            WHEN 'job-seeker' THEN 'jobseeker'
            WHEN 'jobseeker' THEN 'jobseeker'
            WHEN 'intern' THEN 'intern'
            WHEN 'educator' THEN 'educator'
            WHEN 'partner' THEN 'partner'
            WHEN 'admin' THEN 'admin'
            ELSE 'jobseeker'
        END,
        'jobseeker'
    );

    -- Handle organization lookup/creation
    IF NEW.raw_user_meta_data->>'organization_name' IS NOT NULL AND NEW.raw_user_meta_data->>'organization_name' != '' THEN
        -- First try to find existing organization by name
        SELECT id INTO org_id FROM public.organizations
        WHERE LOWER(name) = LOWER(NEW.raw_user_meta_data->>'organization_name')
        LIMIT 1;

        -- If not found, create new organization
        IF org_id IS NULL THEN
            INSERT INTO public.organizations (name, type, website, created_by, slug)
            VALUES (
                NEW.raw_user_meta_data->>'organization_name',
                COALESCE(NEW.raw_user_meta_data->>'organization_type', 'private')::organization_type,
                NEW.raw_user_meta_data->>'organization_website',
                NEW.id,
                LOWER(REGEXP_REPLACE(NEW.raw_user_meta_data->>'organization_name', '[^a-zA-Z0-9]+', '-', 'g'))
            )
            ON CONFLICT DO NOTHING
            RETURNING id INTO org_id;

            -- If insert failed due to conflict, get existing
            IF org_id IS NULL THEN
                SELECT id INTO org_id FROM public.organizations
                WHERE LOWER(name) = LOWER(NEW.raw_user_meta_data->>'organization_name')
                LIMIT 1;
            END IF;
        END IF;
    END IF;

    -- Handle institution lookup/creation
    IF NEW.raw_user_meta_data->>'institution_name' IS NOT NULL AND NEW.raw_user_meta_data->>'institution_name' != '' THEN
        SELECT id INTO inst_id FROM public.institutions
        WHERE LOWER(name) = LOWER(NEW.raw_user_meta_data->>'institution_name')
        LIMIT 1;

        IF inst_id IS NULL THEN
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
                WHERE LOWER(name) = LOWER(NEW.raw_user_meta_data->>'institution_name')
                LIMIT 1;
            END IF;
        END IF;
    END IF;

    -- Insert or update user in public.users
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
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.raw_user_meta_data->>'phone',
        user_role::user_role,
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
        first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
        last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        role = EXCLUDED.role,
        citizenship = COALESCE(EXCLUDED.citizenship, public.users.citizenship),
        clearance_level = COALESCE(EXCLUDED.clearance_level, public.users.clearance_level),
        clearance_status = COALESCE(EXCLUDED.clearance_status, public.users.clearance_status),
        veteran_status = COALESCE(EXCLUDED.veteran_status, public.users.veteran_status),
        military_branch = COALESCE(EXCLUDED.military_branch, public.users.military_branch),
        requires_sponsorship = EXCLUDED.requires_sponsorship,
        willing_to_relocate = EXCLUDED.willing_to_relocate,
        organization_id = COALESCE(EXCLUDED.organization_id, public.users.organization_id),
        institution_id = COALESCE(EXCLUDED.institution_id, public.users.institution_id),
        job_title = COALESCE(EXCLUDED.job_title, public.users.job_title),
        department = COALESCE(EXCLUDED.department, public.users.department),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the auth signup
    RAISE WARNING 'sync_user_metadata failed: % - %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure triggers exist
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.organizations TO authenticated;
GRANT INSERT ON public.organizations TO authenticated;

-- ============================================
-- ALSO: Create a manual function to sync existing auth users
-- Run this after the migration to fix existing users
-- ============================================
CREATE OR REPLACE FUNCTION public.sync_all_auth_users()
RETURNS INTEGER AS $$
DECLARE
    synced_count INTEGER := 0;
    auth_user RECORD;
BEGIN
    FOR auth_user IN
        SELECT * FROM auth.users
        WHERE id NOT IN (SELECT id FROM public.users)
    LOOP
        INSERT INTO public.users (id, email, role, created_at, updated_at)
        VALUES (
            auth_user.id,
            auth_user.email,
            COALESCE(
                CASE LOWER(auth_user.raw_user_meta_data->>'role')
                    WHEN 'partner' THEN 'partner'
                    WHEN 'educator' THEN 'educator'
                    WHEN 'admin' THEN 'admin'
                    WHEN 'intern' THEN 'intern'
                    ELSE 'jobseeker'
                END,
                'jobseeker'
            )::user_role,
            COALESCE(auth_user.created_at, NOW()),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        synced_count := synced_count + 1;
    END LOOP;

    RETURN synced_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the sync for existing users
SELECT public.sync_all_auth_users();
