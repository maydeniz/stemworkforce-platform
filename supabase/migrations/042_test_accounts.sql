-- ============================================
-- TEST ACCOUNTS SETUP
-- Comprehensive test accounts for all platform user types
-- ============================================
--
-- SECURITY NOTES:
-- * This migration creates PUBLIC user records only (no auth credentials)
-- * Auth users must be created separately via scripts/create-test-accounts.ts
-- * Use ONLY in development/staging environments
-- * Test emails use .test TLD which cannot receive real emails
-- * Change passwords immediately if deploying to any shared environment
--
-- TEST ACCOUNT CREDENTIALS:
-- Password is set via TEST_ACCOUNTS_PASSWORD env var
--
-- ROLE ACCOUNTS:
-- 1. High School Student:  test.highschool@stemworkforce.test
-- 2. College Student:      test.college@stemworkforce.test
-- 3. Intern:               test.intern@stemworkforce.test
-- 4. Jobseeker:            test.jobseeker@stemworkforce.test
-- 5. Educator:             test.educator@stemworkforce.test
-- 6. Partner/Employer:     test.partner@stemworkforce.test
-- 7. Service Provider:     test.provider@stemworkforce.test
-- 8. Admin:                test.admin@stemworkforce.test
-- ============================================

-- Add 'intern' to user_role enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'intern'
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'intern';
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ============================================
-- Create test organizations
-- ============================================

INSERT INTO public.organizations (id, name, type, website, slug, is_verified, created_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Test Partner Organization', 'private', 'https://testpartner.example.com', 'test-partner-org', true, NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Test University', 'academic', 'https://testuniversity.edu', 'test-university', true, NOW()),
    ('33333333-3333-3333-3333-333333333330', 'Test Service Provider Co', 'private', 'https://testservices.example.com', 'test-services', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Create test institutions
-- ============================================

INSERT INTO public.institutions (id, name, type, website, created_at)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Test University', 'university', 'https://testuniversity.edu', NOW()),
    ('44444444-4444-4444-4444-444444444444', 'Test High School', 'k12', 'https://testhighschool.edu', NOW()),
    ('55555555-5555-5555-5555-555555555555', 'Test Community College', 'community_college', 'https://testcc.edu', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PRE-CREATE TEST USERS IN PUBLIC.USERS
-- ============================================

-- Test High School Student Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete, institution_id,
    created_at, updated_at
)
VALUES (
    '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test.highschool@stemworkforce.test',
    'Test', 'HighSchooler',
    'job_seeker',
    'us_citizen', 'none', 'none',
    'not_veteran', true, '44444444-4444-4444-4444-444444444444',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Test College Student Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete, institution_id,
    created_at, updated_at
)
VALUES (
    '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test.college@stemworkforce.test',
    'Test', 'CollegeStudent',
    'job_seeker',
    'us_citizen', 'none', 'none',
    'not_veteran', true, '33333333-3333-3333-3333-333333333333',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Test Intern Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    created_at, updated_at
)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test.intern@stemworkforce.test',
    'Test', 'Intern',
    'job_seeker',
    'us_citizen', 'none', 'none',
    'not_veteran', true,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Test Jobseeker Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    created_at, updated_at
)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'test.jobseeker@stemworkforce.test',
    'Test', 'Jobseeker',
    'job_seeker',
    'us_citizen', 'secret', 'active',
    'veteran', true,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Test Educator Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    institution_id, department, job_title,
    created_at, updated_at
)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'test.educator@stemworkforce.test',
    'Test', 'Educator',
    'educator',
    'us_citizen', 'none', 'none',
    'not_veteran', true,
    '33333333-3333-3333-3333-333333333333', 'Computer Science', 'Professor',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'educator',
    institution_id = '33333333-3333-3333-3333-333333333333',
    updated_at = NOW();

-- Test Partner/Employer Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    organization_id, job_title,
    created_at, updated_at
)
VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'test.partner@stemworkforce.test',
    'Test', 'Partner',
    'partner',
    'us_citizen', 'top-secret', 'active',
    'veteran', true,
    '11111111-1111-1111-1111-111111111111', 'HR Director',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'partner',
    organization_id = '11111111-1111-1111-1111-111111111111',
    updated_at = NOW();

-- Test Service Provider Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    organization_id, job_title,
    created_at, updated_at
)
VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'test.provider@stemworkforce.test',
    'Test', 'ServiceProvider',
    'partner',
    'us_citizen', 'none', 'none',
    'not_veteran', true,
    '33333333-3333-3333-3333-333333333330', 'Career Coach',
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Test Admin Account
INSERT INTO public.users (
    id, email, first_name, last_name, role,
    citizenship, clearance_level, clearance_status,
    veteran_status, profile_complete,
    created_at, updated_at
)
VALUES (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'test.admin@stemworkforce.test',
    'Test', 'Admin',
    'admin',
    'us_citizen', 'top-secret-sci', 'active',
    'veteran', true,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- ============================================
-- Create student profiles for high school and college students
-- ============================================

-- High School Student Profile
INSERT INTO public.student_profiles (
    id, user_id, current_grade, gpa, interests, career_interests,
    first_generation, has_fafsa, created_at, updated_at
)
VALUES (
    '11111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11th',
    3.8,
    ARRAY['computer science', 'robotics', 'mathematics'],
    ARRAY['software engineering', 'data science'],
    true,
    false,
    NOW(), NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    current_grade = '11th',
    updated_at = NOW();

-- College Student Profile
INSERT INTO public.student_profiles (
    id, user_id, current_grade, gpa, interests, career_interests,
    first_generation, has_fafsa, created_at, updated_at
)
VALUES (
    '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'undergraduate',
    3.5,
    ARRAY['artificial intelligence', 'cybersecurity', 'quantum computing'],
    ARRAY['research scientist', 'security engineer'],
    false,
    true,
    NOW(), NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    current_grade = 'undergraduate',
    updated_at = NOW();

-- ============================================
-- Create service provider profile
-- ============================================

INSERT INTO public.marketplace_providers (
    id, user_id, display_name, bio, service_types, hourly_rate,
    specializations, career_levels, is_verified, status, created_at
)
VALUES (
    'ffffffff-0000-0000-0000-ffffffffffff',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Test Career Coach',
    'Experienced career coach specializing in STEM careers and federal job placement.',
    ARRAY['career_coaching', 'resume_review', 'interview_prep'],
    150.00,
    ARRAY['tech', 'federal'],
    ARRAY['entry', 'mid', 'senior'],
    true,
    'active',
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    display_name = 'Test Career Coach',
    status = 'active';

-- ============================================
-- SUMMARY OF TEST ACCOUNTS
-- ============================================
--
-- | Type              | Email                                  | Role in DB   | Special Features        |
-- |-------------------|----------------------------------------|--------------|-------------------------|
-- | High School       | test.highschool@stemworkforce.test     | job_seeker   | Student profile, 11th   |
-- | College Student   | test.college@stemworkforce.test        | job_seeker   | Student profile, undergrad |
-- | Intern            | test.intern@stemworkforce.test         | job_seeker   | Seeking internships     |
-- | Jobseeker         | test.jobseeker@stemworkforce.test      | job_seeker   | Has clearance, veteran  |
-- | Educator          | test.educator@stemworkforce.test       | educator     | Institution linked      |
-- | Partner/Employer  | test.partner@stemworkforce.test        | partner      | Organization linked     |
-- | Service Provider  | test.provider@stemworkforce.test       | partner      | Marketplace provider    |
-- | Admin             | test.admin@stemworkforce.test          | admin        | Full platform access    |
--
-- Password managed via TEST_ACCOUNTS_PASSWORD env var
-- ============================================
