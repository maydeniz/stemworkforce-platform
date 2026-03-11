-- ============================================
-- DEMO ACCOUNTS FOR INVESTOR PRESENTATIONS
-- ============================================
-- Run this in the Supabase SQL Editor.
-- Creates 12 demo accounts (one per persona group).
-- Password is generated at execution time via pgcrypto.
--
-- CHANGE THE PASSWORD BELOW before running:
-- ============================================

-- Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  -- *** CHANGE THIS PASSWORD before running ***
  demo_pw TEXT := 'DemoAccount2025!';
  pw_hash TEXT;
BEGIN
  pw_hash := crypt(demo_pw, gen_salt('bf'));

  -- ================================================
  -- 1. HIGH SCHOOL STUDENT
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0001-0001-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'demo.highschool@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"student_hs","is_demo":true}'::jsonb,
    '{"first_name":"Alex","last_name":"Rivera","role":"student_hs","is_demo":true,"graduation_year":2026,"state":"CA","gpa":3.8,"interests":["Robotics","Computer Science","Mathematics"]}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0001-0001-000000000001',
    'dddddddd-demo-0001-0001-000000000001',
    '{"sub":"dddddddd-demo-0001-0001-000000000001","email":"demo.highschool@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0001-0001-000000000001', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 2. COLLEGE STUDENT
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0002-0002-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'demo.college@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"student_college","is_demo":true}'::jsonb,
    '{"first_name":"Jordan","last_name":"Chen","role":"student_college","is_demo":true,"university":"MIT","major":"Computer Science","graduation_year":2027,"gpa":3.9}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0002-0002-000000000002',
    'dddddddd-demo-0002-0002-000000000002',
    '{"sub":"dddddddd-demo-0002-0002-000000000002","email":"demo.college@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0002-0002-000000000002', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 3. JOB SEEKER
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0003-0003-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'demo.jobseeker@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"jobseeker","is_demo":true}'::jsonb,
    '{"first_name":"Morgan","last_name":"Williams","role":"jobseeker","is_demo":true,"experience_years":5,"clearance":"Secret","skills":["Python","AWS","Data Engineering","TensorFlow"]}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0003-0003-000000000003',
    'dddddddd-demo-0003-0003-000000000003',
    '{"sub":"dddddddd-demo-0003-0003-000000000003","email":"demo.jobseeker@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0003-0003-000000000003', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 4. EMPLOYER
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0004-0004-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'demo.employer@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"employer","is_demo":true}'::jsonb,
    '{"first_name":"Taylor","last_name":"Mitchell","role":"employer","is_demo":true,"company":"Quantum Dynamics Inc.","title":"VP of Engineering","company_size":"500-1000"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0004-0004-000000000004',
    'dddddddd-demo-0004-0004-000000000004',
    '{"sub":"dddddddd-demo-0004-0004-000000000004","email":"demo.employer@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0004-0004-000000000004', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 5. EDUCATION PARTNER
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0005-0005-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'demo.education@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"educator","is_demo":true}'::jsonb,
    '{"first_name":"Dr. Sarah","last_name":"Thompson","role":"educator","is_demo":true,"institution":"Georgia Institute of Technology","department":"College of Computing","title":"Department Chair"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0005-0005-000000000005',
    'dddddddd-demo-0005-0005-000000000005',
    '{"sub":"dddddddd-demo-0005-0005-000000000005","email":"demo.education@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0005-0005-000000000005', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 6. FEDERAL AGENCY
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0006-0006-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'demo.federal@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"partner_federal","is_demo":true}'::jsonb,
    '{"first_name":"James","last_name":"Carter","role":"partner_federal","is_demo":true,"agency":"Department of Energy","division":"Office of Science","title":"Workforce Development Director"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0006-0006-000000000006',
    'dddddddd-demo-0006-0006-000000000006',
    '{"sub":"dddddddd-demo-0006-0006-000000000006","email":"demo.federal@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0006-0006-000000000006', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 7. STATE & LOCAL AGENCY
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0007-0007-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'demo.state@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"partner_state","is_demo":true}'::jsonb,
    '{"first_name":"Maria","last_name":"Gonzalez","role":"partner_state","is_demo":true,"agency":"Texas Workforce Commission","title":"STEM Initiative Director","state":"TX"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0007-0007-000000000007',
    'dddddddd-demo-0007-0007-000000000007',
    '{"sub":"dddddddd-demo-0007-0007-000000000007","email":"demo.state@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0007-0007-000000000007', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 8. NATIONAL LABORATORY
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0008-0008-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'demo.labs@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"partner_lab","is_demo":true}'::jsonb,
    '{"first_name":"Dr. Robert","last_name":"Kim","role":"partner_lab","is_demo":true,"lab":"Oak Ridge National Laboratory","division":"Computing & Computational Sciences","clearance":"Q Clearance"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0008-0008-000000000008',
    'dddddddd-demo-0008-0008-000000000008',
    '{"sub":"dddddddd-demo-0008-0008-000000000008","email":"demo.labs@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0008-0008-000000000008', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 9. INDUSTRY PARTNER
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0009-0009-000000000009',
    '00000000-0000-0000-0000-000000000000',
    'demo.industry@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"partner_industry","is_demo":true}'::jsonb,
    '{"first_name":"Patricia","last_name":"Davis","role":"partner_industry","is_demo":true,"company":"Lockheed Martin","division":"Space Systems","title":"Talent Acquisition Director"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0009-0009-000000000009',
    'dddddddd-demo-0009-0009-000000000009',
    '{"sub":"dddddddd-demo-0009-0009-000000000009","email":"demo.industry@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0009-0009-000000000009', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 10. NONPROFIT ORGANIZATION
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0010-0010-000000000010',
    '00000000-0000-0000-0000-000000000000',
    'demo.nonprofit@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"partner_nonprofit","is_demo":true}'::jsonb,
    '{"first_name":"David","last_name":"Okonkwo","role":"partner_nonprofit","is_demo":true,"organization":"Code.org","title":"Programs Director","mission":"K-12 Computer Science Education"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0010-0010-000000000010',
    'dddddddd-demo-0010-0010-000000000010',
    '{"sub":"dddddddd-demo-0010-0010-000000000010","email":"demo.nonprofit@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0010-0010-000000000010', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 11. SERVICE PROVIDER
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0011-0011-000000000011',
    '00000000-0000-0000-0000-000000000000',
    'demo.provider@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"service_provider","is_demo":true}'::jsonb,
    '{"first_name":"Lisa","last_name":"Park","role":"service_provider","is_demo":true,"company":"STEM Career Consulting","services":["Resume Review","Interview Prep","Career Coaching"],"title":"Founder & Lead Coach"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0011-0011-000000000011',
    'dddddddd-demo-0011-0011-000000000011',
    '{"sub":"dddddddd-demo-0011-0011-000000000011","email":"demo.provider@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0011-0011-000000000011', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- ================================================
  -- 12. PLATFORM ADMIN
  -- ================================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at, confirmation_token, recovery_token
  ) VALUES (
    'dddddddd-demo-0012-0012-000000000012',
    '00000000-0000-0000-0000-000000000000',
    'demo.admin@stemworkforce.demo',
    pw_hash, NOW(),
    '{"provider":"email","providers":["email"],"role":"admin","is_demo":true,"admin_level":"SUPPORT_ADMIN"}'::jsonb,
    '{"first_name":"Admin","last_name":"Demo","role":"admin","is_demo":true,"department":"Platform Operations"}'::jsonb,
    'authenticated', 'authenticated', NOW(), NOW(), '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    'dddddddd-demo-0012-0012-000000000012',
    'dddddddd-demo-0012-0012-000000000012',
    '{"sub":"dddddddd-demo-0012-0012-000000000012","email":"demo.admin@stemworkforce.demo"}'::jsonb,
    'email', 'dddddddd-demo-0012-0012-000000000012', NOW(), NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Created 12 demo auth accounts with password: %', demo_pw;
END $$;

-- ============================================
-- PUBLIC.USERS RECORDS (profile data)
-- ============================================
INSERT INTO public.users (id, email, role, profile_complete, citizenship, clearance_level, clearance_status, veteran_status, created_at, updated_at)
VALUES
  -- Students
  ('dddddddd-demo-0001-0001-000000000001', 'demo.highschool@stemworkforce.demo', 'job_seeker', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  ('dddddddd-demo-0002-0002-000000000002', 'demo.college@stemworkforce.demo', 'job_seeker', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- Job Seeker
  ('dddddddd-demo-0003-0003-000000000003', 'demo.jobseeker@stemworkforce.demo', 'job_seeker', true, 'us_citizen', 'secret', 'active', 'not_veteran', NOW(), NOW()),
  -- Employer
  ('dddddddd-demo-0004-0004-000000000004', 'demo.employer@stemworkforce.demo', 'employer', true, 'us_citizen', 'secret', 'active', 'not_veteran', NOW(), NOW()),
  -- Education Partner
  ('dddddddd-demo-0005-0005-000000000005', 'demo.education@stemworkforce.demo', 'educator', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- Federal Agency
  ('dddddddd-demo-0006-0006-000000000006', 'demo.federal@stemworkforce.demo', 'partner', true, 'us_citizen', 'top_secret_sci', 'active', 'not_veteran', NOW(), NOW()),
  -- State Agency
  ('dddddddd-demo-0007-0007-000000000007', 'demo.state@stemworkforce.demo', 'partner', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- National Labs
  ('dddddddd-demo-0008-0008-000000000008', 'demo.labs@stemworkforce.demo', 'partner', true, 'us_citizen', 'top_secret', 'active', 'veteran', NOW(), NOW()),
  -- Industry Partner
  ('dddddddd-demo-0009-0009-000000000009', 'demo.industry@stemworkforce.demo', 'partner', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- Nonprofit
  ('dddddddd-demo-0010-0010-000000000010', 'demo.nonprofit@stemworkforce.demo', 'partner', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- Service Provider
  ('dddddddd-demo-0011-0011-000000000011', 'demo.provider@stemworkforce.demo', 'service_provider', true, 'us_citizen', 'none', 'none', 'not_veteran', NOW(), NOW()),
  -- Admin
  ('dddddddd-demo-0012-0012-000000000012', 'demo.admin@stemworkforce.demo', 'admin', true, 'us_citizen', 'top_secret_sci', 'active', 'not_veteran', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
DECLARE
  cnt INT;
BEGIN
  SELECT COUNT(*) INTO cnt FROM auth.users WHERE email LIKE '%@stemworkforce.demo';
  RAISE NOTICE 'Demo accounts in auth.users: %', cnt;
  SELECT COUNT(*) INTO cnt FROM public.users WHERE email LIKE '%@stemworkforce.demo';
  RAISE NOTICE 'Demo accounts in public.users: %', cnt;
END $$;
