-- =====================================================
-- STEMWorkforce Platform - Staff Invitations & Enhancements
-- Migration: 024_staff_invitations.sql
-- =====================================================

-- =====================================================
-- PART 1: STAFF INVITATIONS TABLE
-- =====================================================

-- Staff invitations for pending admin invites
CREATE TABLE IF NOT EXISTS staff_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Invitation target
    email VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
    organization_id UUID, -- NULL = platform-wide access

    -- Invitation metadata
    invited_by_user_id UUID,
    message TEXT,

    -- Token for acceptance (hashed)
    invitation_token_hash VARCHAR(255),

    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'revoked'

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,

    -- Constraints
    UNIQUE(email, role_id, organization_id)
);

-- Indexes for staff invitations
CREATE INDEX IF NOT EXISTS idx_staff_invitations_email ON staff_invitations(email);
CREATE INDEX IF NOT EXISTS idx_staff_invitations_status ON staff_invitations(status);
CREATE INDEX IF NOT EXISTS idx_staff_invitations_expires ON staff_invitations(expires_at);

-- =====================================================
-- PART 2: ADD LAST LOGIN TRACKING TO USERS
-- =====================================================

-- Add last_login_at column to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Function to update last login time
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET last_login_at = NOW() WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 3: STAFF ACTIVITY LOGGING
-- =====================================================

-- Staff-specific audit events
-- These will use the existing audit_logs table with specific event categories

-- =====================================================
-- PART 4: ADMIN TEAMS (For Future Team Management)
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Team lead
    lead_user_id UUID,

    -- Organization scope (NULL = platform team)
    organization_id UUID,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team memberships
CREATE TABLE IF NOT EXISTS admin_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES admin_teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,

    -- Role within team
    team_role VARCHAR(50) DEFAULT 'member', -- 'lead', 'member'

    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,

    UNIQUE(team_id, user_id)
);

-- =====================================================
-- PART 5: ENHANCED USER ROLE ASSIGNMENTS
-- =====================================================

-- Add notes and metadata to role assignments
ALTER TABLE user_role_assignments
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deactivated_by UUID,
ADD COLUMN IF NOT EXISTS deactivation_reason TEXT;

-- =====================================================
-- PART 6: PERMISSION AUDIT TRAIL
-- =====================================================

CREATE TABLE IF NOT EXISTS permission_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Target
    target_type VARCHAR(50) NOT NULL, -- 'role', 'user'
    target_id UUID NOT NULL,

    -- Change details
    permission_id UUID REFERENCES admin_permissions(id),
    action VARCHAR(50) NOT NULL, -- 'granted', 'revoked'

    -- Actor
    changed_by UUID,
    reason TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permission_changes_target ON permission_changes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_permission_changes_permission ON permission_changes(permission_id);

-- =====================================================
-- PART 7: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_changes ENABLE ROW LEVEL SECURITY;

-- Staff invitations - only admins can manage
CREATE POLICY staff_invitations_admin_access ON staff_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
    );

-- Admin teams - accessible by team members and platform admins
CREATE POLICY admin_teams_access ON admin_teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM admin_team_members atm
            WHERE atm.team_id = admin_teams.id
            AND atm.user_id = auth.uid()
            AND atm.left_at IS NULL
        )
    );

-- Permission changes - only super admins
CREATE POLICY permission_changes_admin_only ON permission_changes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name = 'SUPER_ADMIN'
            AND ura.is_active = true
        )
    );

-- =====================================================
-- PART 8: SAMPLE DATA FOR ADMIN ROLES (if not exists)
-- =====================================================

-- Ensure role_permissions mappings exist for default roles
-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- PLATFORM_ADMIN gets most permissions except role management
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'PLATFORM_ADMIN'
AND ap.name NOT IN ('users.impersonate')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- SECURITY_ADMIN gets security-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'SECURITY_ADMIN'
AND ap.category IN ('system', 'compliance')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- BILLING_ADMIN gets billing permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'BILLING_ADMIN'
AND ap.category = 'billing'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- CONTENT_ADMIN gets job and application permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'CONTENT_ADMIN'
AND ap.category IN ('job_management', 'application_management')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- SUPPORT_ADMIN gets user read and application permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'SUPPORT_ADMIN'
AND ap.name IN ('users.read', 'applications.read', 'applications.update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- COMPLIANCE_ADMIN gets compliance permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    ar.id as role_id,
    ap.id as permission_id
FROM admin_roles ar
CROSS JOIN admin_permissions ap
WHERE ar.name = 'COMPLIANCE_ADMIN'
AND ap.category = 'compliance'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- New Tables Created:
--   - staff_invitations
--   - admin_teams
--   - admin_team_members
--   - permission_changes
--
-- Enhanced Tables:
--   - users (added last_login_at)
--   - user_role_assignments (added notes, metadata, deactivation fields)
-- =====================================================
