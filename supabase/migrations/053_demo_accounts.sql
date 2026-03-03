-- ============================================
-- DEMO ACCOUNTS FOR INVESTOR PRESENTATIONS
-- ============================================
-- These accounts power the /demo landing page
-- Password is stored as a Supabase secret (DEMO_PASSWORD)
--
-- IMPORTANT: Run this in the Supabase SQL Editor
-- Password hash below is bcrypt — actual password managed via env secrets
-- ============================================

-- Step 1: Add new role enum values if needed
DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employer';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'education_provider';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'event_organizer';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'highschool_student';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'college_student';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Step 2: Create demo organization
INSERT INTO public.organizations (id, name, type, website, slug, is_verified, created_at)
VALUES
    ('dddddddd-demo-demo-demo-000000000001', 'Nexus Technologies', 'private', 'https://nexustech.demo', 'nexus-tech-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000002', 'Pacific STEM University', 'academic', 'https://pacificstem.demo', 'pacific-stem-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000003', 'Oak Ridge National Laboratory', 'national_lab', 'https://ornl.demo', 'ornl-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000004', 'U.S. Department of Energy', 'federal', 'https://energy.demo', 'doe-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000005', 'TechBridge Industries', 'private', 'https://techbridge.demo', 'techbridge-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000006', 'ProCareer Services', 'private', 'https://procareer.demo', 'procareer-demo', true, NOW()),
    ('dddddddd-demo-demo-demo-000000000007', 'TechConnect Events', 'private', 'https://techconnect.demo', 'techconnect-demo', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Step 3: Create auth users
-- Password managed via DEMO_PASSWORD env secret
-- ============================================

-- 1. Employer Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'demo.employer@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "employer"}'::jsonb,
    '{"first_name": "Jennifer", "last_name": "Walsh"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000001',
    'dddddddd-aaaa-aaaa-aaaa-000000000001',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000001", "email": "demo.employer@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000001', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 2. Education Partner Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'demo.education@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "education_provider"}'::jsonb,
    '{"first_name": "Dr. Maria", "last_name": "Santos"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000002',
    'dddddddd-aaaa-aaaa-aaaa-000000000002',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000002", "email": "demo.education@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000002', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 3. National Labs Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'demo.labs@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "partner_lab"}'::jsonb,
    '{"first_name": "Dr. Robert", "last_name": "Chen"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000003',
    'dddddddd-aaaa-aaaa-aaaa-000000000003',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000003", "email": "demo.labs@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000003', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 4. Federal Agency Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'demo.federal@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "partner_federal"}'::jsonb,
    '{"first_name": "Amanda", "last_name": "Torres"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000004',
    'dddddddd-aaaa-aaaa-aaaa-000000000004',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000004", "email": "demo.federal@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000004', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 5. Industry/Nonprofit Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'demo.industry@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "partner_industry"}'::jsonb,
    '{"first_name": "Marcus", "last_name": "Johnson"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000005',
    'dddddddd-aaaa-aaaa-aaaa-000000000005',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000005", "email": "demo.industry@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000005', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 6. High School Student Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'demo.highschool@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "highschool_student"}'::jsonb,
    '{"first_name": "Alex", "last_name": "Rivera"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000006',
    'dddddddd-aaaa-aaaa-aaaa-000000000006',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000006", "email": "demo.highschool@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000006', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 7. College Student Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'demo.college@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "college_student"}'::jsonb,
    '{"first_name": "Maya", "last_name": "Chen"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000007',
    'dddddddd-aaaa-aaaa-aaaa-000000000007',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000007", "email": "demo.college@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000007', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 8. Service Provider Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'demo.provider@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "service_provider"}'::jsonb,
    '{"first_name": "David", "last_name": "Park"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000008',
    'dddddddd-aaaa-aaaa-aaaa-000000000008',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000008", "email": "demo.provider@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000008', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- 9. Event Organizer Demo Account
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000009',
    '00000000-0000-0000-0000-000000000000',
    'demo.organizer@stemworkforce.org',
    '$2a$10$PJMfNGJBe1E3KJ1QFKxTfOj0MjZNlqS.V5K9q6v8n0TxJhqZL1FpO',
    NOW(),
    '{"provider": "email", "providers": ["email"], "role": "event_organizer"}'::jsonb,
    '{"first_name": "Lisa", "last_name": "Thompson"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    'dddddddd-aaaa-aaaa-aaaa-000000000009',
    'dddddddd-aaaa-aaaa-aaaa-000000000009',
    '{"sub": "dddddddd-aaaa-aaaa-aaaa-000000000009", "email": "demo.organizer@stemworkforce.org"}'::jsonb,
    'email', 'dddddddd-aaaa-aaaa-aaaa-000000000009', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- ============================================
-- Step 4: Create matching public.users records
-- ============================================

INSERT INTO public.users (id, email, first_name, last_name, role, citizenship, clearance_level, clearance_status, veteran_status, profile_complete, created_at, updated_at)
VALUES
    ('dddddddd-aaaa-aaaa-aaaa-000000000001', 'demo.employer@stemworkforce.org', 'Jennifer', 'Walsh', 'employer', 'us_citizen', 'secret', 'active', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000002', 'demo.education@stemworkforce.org', 'Maria', 'Santos', 'educator', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000003', 'demo.labs@stemworkforce.org', 'Robert', 'Chen', 'partner', 'us_citizen', 'top_secret', 'active', 'veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000004', 'demo.federal@stemworkforce.org', 'Amanda', 'Torres', 'partner', 'us_citizen', 'top_secret_sci', 'active', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000005', 'demo.industry@stemworkforce.org', 'Marcus', 'Johnson', 'partner', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000006', 'demo.highschool@stemworkforce.org', 'Alex', 'Rivera', 'job_seeker', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000007', 'demo.college@stemworkforce.org', 'Maya', 'Chen', 'job_seeker', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000008', 'demo.provider@stemworkforce.org', 'David', 'Park', 'job_seeker', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW()),
    ('dddddddd-aaaa-aaaa-aaaa-000000000009', 'demo.organizer@stemworkforce.org', 'Lisa', 'Thompson', 'job_seeker', 'us_citizen', 'none', 'none', 'not_veteran', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
