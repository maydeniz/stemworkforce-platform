-- =====================================================
-- STEMWorkforce Platform - Page Status Tracking
-- Migration: 025_page_status_tracking.sql
-- =====================================================

-- =====================================================
-- PART 1: ENHANCE PLATFORM_CONTENT TABLE
-- =====================================================

-- Add enhanced status tracking columns to platform_content
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS status_reason VARCHAR(255);
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ;
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS status_changed_by UUID;
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS maintenance_message TEXT;
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS redirect_url VARCHAR(500);
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE platform_content ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ;

-- Update status constraint to include 'maintenance'
-- First drop if exists, then add
DO $$
BEGIN
    ALTER TABLE platform_content DROP CONSTRAINT IF EXISTS platform_content_status_check;
    ALTER TABLE platform_content ADD CONSTRAINT platform_content_status_check
        CHECK (status IN ('draft', 'published', 'maintenance', 'archived'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- =====================================================
-- PART 2: PAGE STATUS CHANGE HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS page_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference to the page
    page_id UUID NOT NULL,
    page_key VARCHAR(100) NOT NULL,

    -- Status change details
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    reason VARCHAR(255),
    notes TEXT,

    -- Maintenance mode details (if applicable)
    maintenance_message TEXT,
    redirect_url VARCHAR(500),

    -- Scheduling details
    scheduled_publish_at TIMESTAMPTZ,
    scheduled_unpublish_at TIMESTAMPTZ,

    -- Actor information
    changed_by UUID,
    changed_by_email VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- IP and user agent for audit
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_page_status_history_page_id ON page_status_history(page_id);
CREATE INDEX IF NOT EXISTS idx_page_status_history_page_key ON page_status_history(page_key);
CREATE INDEX IF NOT EXISTS idx_page_status_history_changed_by ON page_status_history(changed_by);
CREATE INDEX IF NOT EXISTS idx_page_status_history_created_at ON page_status_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_status_history_status ON page_status_history(new_status);

-- =====================================================
-- PART 3: SCHEDULED STATUS CHANGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS scheduled_page_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference to the page
    page_id UUID NOT NULL,
    page_key VARCHAR(100) NOT NULL,

    -- Scheduled action
    action_type VARCHAR(50) NOT NULL, -- 'publish', 'unpublish', 'maintenance', 'archive'
    target_status VARCHAR(50) NOT NULL,

    -- Schedule timing
    scheduled_at TIMESTAMPTZ NOT NULL,

    -- Optional settings for the change
    maintenance_message TEXT,
    redirect_url VARCHAR(500),
    reason VARCHAR(255),

    -- Execution status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'executed', 'cancelled', 'failed'
    executed_at TIMESTAMPTZ,
    error_message TEXT,

    -- Creator information
    created_by UUID,
    cancelled_by UUID,
    cancelled_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for scheduled changes
CREATE INDEX IF NOT EXISTS idx_scheduled_page_changes_page_id ON scheduled_page_changes(page_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_page_changes_scheduled_at ON scheduled_page_changes(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_page_changes_status ON scheduled_page_changes(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_page_changes_pending ON scheduled_page_changes(scheduled_at)
    WHERE status = 'pending';

-- =====================================================
-- PART 4: MAINTENANCE PAGE TEMPLATES
-- =====================================================

CREATE TABLE IF NOT EXISTS maintenance_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Template details
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Message content
    title VARCHAR(255) NOT NULL DEFAULT 'Page Under Maintenance',
    message TEXT NOT NULL,

    -- Display settings
    show_countdown BOOLEAN DEFAULT false,
    show_progress BOOLEAN DEFAULT false,
    estimated_duration_minutes INTEGER,

    -- Styling
    background_color VARCHAR(50) DEFAULT '#1e293b',
    text_color VARCHAR(50) DEFAULT '#ffffff',
    accent_color VARCHAR(50) DEFAULT '#f97316',

    -- Default behavior
    redirect_url VARCHAR(500),
    redirect_delay_seconds INTEGER DEFAULT 0,

    -- Status
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    -- Audit
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default maintenance templates
INSERT INTO maintenance_templates (name, description, title, message, is_default, is_active)
VALUES
    ('Standard Maintenance', 'Default maintenance page for general updates',
     'Page Under Maintenance',
     'We are currently performing scheduled maintenance on this page. Please check back soon.',
     true, true),
    ('Quick Update', 'For brief maintenance windows',
     'Quick Update in Progress',
     'We are making some quick updates. This page will be back in just a few minutes.',
     false, true),
    ('Extended Maintenance', 'For longer maintenance periods',
     'Extended Maintenance',
     'This page is undergoing extended maintenance. We appreciate your patience and apologize for any inconvenience.',
     false, true),
    ('Content Review', 'When content is being reviewed',
     'Content Under Review',
     'This page is currently under review and temporarily unavailable. Thank you for your understanding.',
     false, true),
    ('Security Update', 'For security-related maintenance',
     'Security Update',
     'We are implementing important security updates to protect your data. This page will be available again shortly.',
     false, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 5: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE page_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_page_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_templates ENABLE ROW LEVEL SECURITY;

-- Page status history - readable by content admins
CREATE POLICY page_status_history_read ON page_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
            AND ura.is_active = true
        )
    );

-- Page status history - insertable by content admins
CREATE POLICY page_status_history_insert ON page_status_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
            AND ura.is_active = true
        )
    );

-- Scheduled changes - full access for content admins
CREATE POLICY scheduled_page_changes_access ON scheduled_page_changes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'CONTENT_ADMIN')
            AND ura.is_active = true
        )
    );

-- Maintenance templates - readable by all admins, modifiable by platform admins
CREATE POLICY maintenance_templates_read ON maintenance_templates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = true
        )
    );

CREATE POLICY maintenance_templates_modify ON maintenance_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN admin_roles ar ON ura.role_id = ar.id
            WHERE ura.user_id = auth.uid()
            AND ar.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN')
            AND ura.is_active = true
        )
    );

-- =====================================================
-- PART 6: TRIGGER FUNCTION FOR STATUS CHANGE LOGGING
-- =====================================================

CREATE OR REPLACE FUNCTION log_page_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO page_status_history (
            page_id,
            page_key,
            previous_status,
            new_status,
            reason,
            maintenance_message,
            redirect_url,
            scheduled_publish_at,
            scheduled_unpublish_at,
            changed_by,
            changed_by_email
        ) VALUES (
            NEW.id,
            NEW.page_key,
            OLD.status,
            NEW.status,
            NEW.status_reason,
            NEW.maintenance_message,
            NEW.redirect_url,
            NEW.scheduled_publish_at,
            NEW.scheduled_unpublish_at,
            auth.uid(),
            (SELECT email FROM users WHERE id = auth.uid())
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for status change logging
DROP TRIGGER IF EXISTS trigger_log_page_status_change ON platform_content;
CREATE TRIGGER trigger_log_page_status_change
    AFTER UPDATE ON platform_content
    FOR EACH ROW
    EXECUTE FUNCTION log_page_status_change();

-- =====================================================
-- PART 7: FUNCTION TO PROCESS SCHEDULED CHANGES
-- =====================================================

CREATE OR REPLACE FUNCTION process_scheduled_page_changes()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    scheduled_change RECORD;
BEGIN
    -- Process all pending scheduled changes that are due
    FOR scheduled_change IN
        SELECT * FROM scheduled_page_changes
        WHERE status = 'pending'
        AND scheduled_at <= NOW()
        ORDER BY scheduled_at ASC
    LOOP
        BEGIN
            -- Update the page status
            UPDATE platform_content
            SET
                status = scheduled_change.target_status,
                status_reason = scheduled_change.reason,
                status_changed_at = NOW(),
                maintenance_message = scheduled_change.maintenance_message,
                redirect_url = scheduled_change.redirect_url,
                last_modified_at = NOW()
            WHERE id = scheduled_change.page_id;

            -- Mark scheduled change as executed
            UPDATE scheduled_page_changes
            SET
                status = 'executed',
                executed_at = NOW(),
                updated_at = NOW()
            WHERE id = scheduled_change.id;

            processed_count := processed_count + 1;

        EXCEPTION WHEN OTHERS THEN
            -- Mark as failed if error occurs
            UPDATE scheduled_page_changes
            SET
                status = 'failed',
                error_message = SQLERRM,
                updated_at = NOW()
            WHERE id = scheduled_change.id;
        END;
    END LOOP;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- New Tables Created:
--   - page_status_history (tracks all status changes)
--   - scheduled_page_changes (manages scheduled status updates)
--   - maintenance_templates (pre-built maintenance page templates)
--
-- Enhanced Tables:
--   - platform_content (added status tracking and scheduling columns)
--
-- New Functions:
--   - log_page_status_change() - Auto-logs status changes
--   - process_scheduled_page_changes() - Processes due scheduled changes
-- =====================================================
