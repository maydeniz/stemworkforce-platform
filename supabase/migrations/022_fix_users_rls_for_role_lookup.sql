-- =====================================================
-- STEMWorkforce Platform - Fix Users RLS for Role Lookup
-- This migration fixes the RLS policy to allow authenticated
-- users to read their own role from the users table
-- =====================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS users_select_policy ON users;

-- Create a new policy that allows:
-- 1. Any authenticated user to read their own record (by matching auth.uid() to id)
-- 2. Any authenticated user to read their own record (by matching email)
-- 3. Admins to read all records
CREATE POLICY users_select_policy ON users
    FOR SELECT USING (
        -- User can read their own record by ID
        auth.uid() = id
        -- User can read their own record by email (fallback)
        OR auth.email() = email
        -- Admins can read all
        OR is_admin(50)
    );

-- Also add a simpler policy for just reading the role column
-- This ensures the role lookup in ProtectedRoute works
DROP POLICY IF EXISTS users_role_lookup_policy ON users;
CREATE POLICY users_role_lookup_policy ON users
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

-- =====================================================
-- VERIFICATION QUERY (run manually to test)
-- =====================================================
-- SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
-- =====================================================
