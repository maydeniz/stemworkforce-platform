-- ============================================
-- FIX: ROLE ESCALATION VULNERABILITY
-- Prevents users from self-assigning admin role
-- via user_metadata during signup
-- ============================================

-- Allowed self-registration roles (safe subset)
-- Admin role can ONLY be granted via app_metadata
-- set server-side by an existing admin

CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
    inst_id UUID;
    user_role TEXT;
    safe_roles TEXT[] := ARRAY['jobseeker', 'intern', 'educator', 'partner'];
BEGIN
    -- SECURITY: Check app_metadata first (server-controlled, tamper-proof)
    -- Only fall back to user_metadata for safe roles
    IF NEW.raw_app_meta_data->>'role' IS NOT NULL THEN
        -- Server-assigned role (trusted) — allow any valid role including admin
        user_role := COALESCE(
            CASE LOWER(NEW.raw_app_meta_data->>'role')
                WHEN 'admin' THEN 'admin'
                WHEN 'super_admin' THEN 'admin'
                WHEN 'partner' THEN 'partner'
                WHEN 'educator' THEN 'educator'
                WHEN 'intern' THEN 'intern'
                WHEN 'jobseeker' THEN 'jobseeker'
                WHEN 'job_seeker' THEN 'jobseeker'
                ELSE 'jobseeker'
            END,
            'jobseeker'
        );
    ELSE
        -- User-provided role (untrusted) — ONLY allow safe roles
        user_role := COALESCE(
            CASE LOWER(NEW.raw_user_meta_data->>'role')
                WHEN 'job_seeker' THEN 'jobseeker'
                WHEN 'job-seeker' THEN 'jobseeker'
                WHEN 'jobseeker' THEN 'jobseeker'
                WHEN 'intern' THEN 'intern'
                WHEN 'educator' THEN 'educator'
                WHEN 'partner' THEN 'partner'
                -- REMOVED: 'admin' — users cannot self-assign admin
                ELSE 'jobseeker'
            END,
            'jobseeker'
        );

        -- Double-check: reject any role not in safe list
        IF user_role != ALL(safe_roles) THEN
            user_role := 'jobseeker';
        END IF;
    END IF;

    -- Handle organization lookup/creation
    IF NEW.raw_user_meta_data->>'organization_name' IS NOT NULL AND NEW.raw_user_meta_data->>'organization_name' != '' THEN
        SELECT id INTO org_id FROM public.organizations
        WHERE LOWER(name) = LOWER(NEW.raw_user_meta_data->>'organization_name')
        LIMIT 1;

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
    RAISE WARNING 'sync_user_metadata failed: % - %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also fix the bulk sync function
CREATE OR REPLACE FUNCTION public.sync_all_auth_users()
RETURNS INTEGER AS $$
DECLARE
    synced_count INTEGER := 0;
    auth_user RECORD;
    safe_role TEXT;
BEGIN
    FOR auth_user IN
        SELECT * FROM auth.users
        WHERE id NOT IN (SELECT id FROM public.users)
    LOOP
        -- Same safe-role logic: only allow safe roles from user_metadata
        safe_role := COALESCE(
            CASE LOWER(auth_user.raw_user_meta_data->>'role')
                WHEN 'partner' THEN 'partner'
                WHEN 'educator' THEN 'educator'
                WHEN 'intern' THEN 'intern'
                WHEN 'jobseeker' THEN 'jobseeker'
                WHEN 'job_seeker' THEN 'jobseeker'
                ELSE 'jobseeker'
            END,
            'jobseeker'
        );

        -- Check if app_metadata has a role (server-assigned, trusted)
        IF auth_user.raw_app_meta_data->>'role' IS NOT NULL THEN
            safe_role := COALESCE(
                CASE LOWER(auth_user.raw_app_meta_data->>'role')
                    WHEN 'admin' THEN 'admin'
                    WHEN 'super_admin' THEN 'admin'
                    WHEN 'partner' THEN 'partner'
                    WHEN 'educator' THEN 'educator'
                    WHEN 'intern' THEN 'intern'
                    ELSE 'jobseeker'
                END,
                'jobseeker'
            );
        END IF;

        INSERT INTO public.users (id, email, role, created_at, updated_at)
        VALUES (
            auth_user.id,
            auth_user.email,
            safe_role::user_role,
            COALESCE(auth_user.created_at, NOW()),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        synced_count := synced_count + 1;
    END LOOP;

    RETURN synced_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
