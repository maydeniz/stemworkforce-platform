-- ===========================================
-- School Counselor System
-- ===========================================
-- Tables for counselor portal functionality
-- Caseload management, application tracking, nudges, tasks
-- ===========================================

-- ===========================================
-- COUNSELOR PROFILES
-- ===========================================

CREATE TABLE IF NOT EXISTS counselor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  school_name TEXT NOT NULL,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT DEFAULT 'School Counselor',

  -- Caseload assignment (which grades this counselor handles)
  assigned_grades INTEGER[] DEFAULT ARRAY[9, 10, 11, 12],

  -- Notification preferences
  notification_preferences JSONB DEFAULT '{
    "emailDigest": true,
    "deadlineAlerts": true,
    "studentActivityAlerts": false
  }'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id),
  UNIQUE(email)
);

-- ===========================================
-- COUNSELOR CASELOADS
-- ===========================================

CREATE TABLE IF NOT EXISTS counselor_caseloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES counselor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL, -- References student profile
  school_year TEXT NOT NULL, -- e.g., '2025-2026'

  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Status tracking (computed in app, stored for quick queries)
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'needs_attention', 'critical')),
  status_updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(counselor_id, student_id, school_year)
);

CREATE INDEX idx_counselor_caseloads_counselor ON counselor_caseloads(counselor_id);
CREATE INDEX idx_counselor_caseloads_student ON counselor_caseloads(student_id);
CREATE INDEX idx_counselor_caseloads_status ON counselor_caseloads(status);

-- ===========================================
-- APPLICATION READINESS (Counselor Sign-off)
-- ===========================================

CREATE TABLE IF NOT EXISTS application_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  application_id UUID NOT NULL, -- References student's application
  school_name TEXT NOT NULL,
  deadline DATE,

  -- Student side
  student_marked_ready BOOLEAN DEFAULT FALSE,
  student_submitted_at TIMESTAMPTZ,

  -- Counselor side
  counselor_id UUID REFERENCES counselor_profiles(id),
  counselor_reviewed BOOLEAN DEFAULT FALSE,
  counselor_reviewed_at TIMESTAMPTZ,
  counselor_approved BOOLEAN DEFAULT FALSE,
  counselor_feedback TEXT,

  -- Checklist verification (JSON array of verified items)
  checklist_verification JSONB DEFAULT '[]'::jsonb,

  -- Final status
  ready_to_submit BOOLEAN DEFAULT FALSE,
  confirmed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(student_id, application_id)
);

CREATE INDEX idx_application_readiness_student ON application_readiness(student_id);
CREATE INDEX idx_application_readiness_counselor ON application_readiness(counselor_id);
CREATE INDEX idx_application_readiness_deadline ON application_readiness(deadline);
CREATE INDEX idx_application_readiness_status ON application_readiness(counselor_approved, ready_to_submit);

-- ===========================================
-- COUNSELOR NUDGES
-- ===========================================

CREATE TABLE IF NOT EXISTS counselor_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES counselor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,

  nudge_type TEXT NOT NULL CHECK (nudge_type IN (
    'deadline_reminder', 'missing_item', 'encouragement',
    'action_required', 'fafsa_reminder', 'meeting_request', 'general'
  )),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Delivery tracking
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,

  -- Response
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'action_taken')),
  action_taken_at TIMESTAMPTZ,
  student_response TEXT,

  -- Related items
  related_application_id UUID,
  related_deadline DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_counselor_nudges_counselor ON counselor_nudges(counselor_id);
CREATE INDEX idx_counselor_nudges_student ON counselor_nudges(student_id);
CREATE INDEX idx_counselor_nudges_status ON counselor_nudges(status);
CREATE INDEX idx_counselor_nudges_type ON counselor_nudges(nudge_type);

-- ===========================================
-- COUNSELOR TASKS
-- ===========================================

CREATE TABLE IF NOT EXISTS counselor_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES counselor_profiles(id) ON DELETE CASCADE,
  student_id UUID,

  task_type TEXT NOT NULL CHECK (task_type IN (
    'rec_letter_due', 'meeting_scheduled', 'review_application',
    'send_transcript', 'follow_up', 'deadline_check', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT,

  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),

  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Related items
  related_application_id UUID,
  related_school_name TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_counselor_tasks_counselor ON counselor_tasks(counselor_id);
CREATE INDEX idx_counselor_tasks_student ON counselor_tasks(student_id);
CREATE INDEX idx_counselor_tasks_status ON counselor_tasks(status);
CREATE INDEX idx_counselor_tasks_due_date ON counselor_tasks(due_date);
CREATE INDEX idx_counselor_tasks_priority ON counselor_tasks(priority);

-- ===========================================
-- NUDGE TEMPLATES
-- ===========================================

CREATE TABLE IF NOT EXISTS nudge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES counselor_profiles(id), -- NULL for system templates

  nudge_type TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[], -- Available merge fields

  is_system BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system templates
INSERT INTO nudge_templates (nudge_type, name, subject, body, variables, is_system) VALUES
(
  'deadline_reminder',
  'Deadline Approaching',
  'Reminder: {{schoolName}} deadline in {{daysUntil}} days',
  'Hi {{studentName}},

Just a friendly reminder that your {{applicationType}} application to {{schoolName}} is due on {{deadline}}. That''s only {{daysUntil}} days away!

Please make sure you have completed:
- All required essays
- Test score submissions
- Requested your transcript

If you have any questions or need help, please don''t hesitate to reach out.

Best,
{{counselorName}}',
  ARRAY['studentName', 'schoolName', 'applicationType', 'deadline', 'daysUntil', 'counselorName'],
  TRUE
),
(
  'missing_item',
  'Missing Application Item',
  'Action Required: Missing item for {{schoolName}} application',
  'Hi {{studentName}},

I noticed that your {{schoolName}} application is missing: {{missingItem}}.

Your deadline is {{deadline}}, so please complete this as soon as possible.

Let me know if you need any help!

Best,
{{counselorName}}',
  ARRAY['studentName', 'schoolName', 'missingItem', 'deadline', 'counselorName'],
  TRUE
),
(
  'encouragement',
  'Keep Up the Good Work',
  'Great progress on your applications!',
  'Hi {{studentName}},

I wanted to take a moment to recognize the great progress you''ve made on your college applications. You''ve submitted {{submittedCount}} applications so far!

Keep up the excellent work. You''re on track for a successful application season.

Best,
{{counselorName}}',
  ARRAY['studentName', 'submittedCount', 'counselorName'],
  TRUE
),
(
  'fafsa_reminder',
  'FAFSA Reminder',
  'Don''t forget: FAFSA deadline approaching',
  'Hi {{studentName}},

This is a reminder to complete your FAFSA (Free Application for Federal Student Aid). Many schools have priority deadlines for financial aid, so it''s important to submit early.

If you need help with the FAFSA, I''m available to assist or you can use our FAFSA Assistant tool.

Best,
{{counselorName}}',
  ARRAY['studentName', 'counselorName'],
  TRUE
),
(
  'action_required',
  'Action Required',
  'Action Required: {{actionItem}}',
  'Hi {{studentName}},

I need you to take action on the following item: {{actionItem}}

Please complete this by {{dueDate}} if possible.

Let me know if you have any questions.

Best,
{{counselorName}}',
  ARRAY['studentName', 'actionItem', 'dueDate', 'counselorName'],
  TRUE
);

-- ===========================================
-- SCHOOL CONFIGURATION
-- ===========================================

CREATE TABLE IF NOT EXISTS school_counselor_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  school_name TEXT NOT NULL,
  district TEXT,
  state TEXT NOT NULL,

  -- Deadline settings
  transcript_lead_time INTEGER DEFAULT 14, -- days before deadline to request
  rec_letter_lead_time INTEGER DEFAULT 21,

  -- Workflow settings
  require_counselor_approval BOOLEAN DEFAULT TRUE,
  auto_nudge_enabled BOOLEAN DEFAULT TRUE,
  auto_nudge_days_before INTEGER DEFAULT 7,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(school_id)
);

-- ===========================================
-- VIEWS
-- ===========================================

-- Counselor caseload summary view
CREATE OR REPLACE VIEW counselor_caseload_summary AS
SELECT
  cp.id as counselor_id,
  cp.first_name || ' ' || cp.last_name as counselor_name,
  cp.school_name,
  COUNT(cc.id) as total_students,
  COUNT(CASE WHEN cc.status = 'on_track' THEN 1 END) as on_track_count,
  COUNT(CASE WHEN cc.status = 'needs_attention' THEN 1 END) as needs_attention_count,
  COUNT(CASE WHEN cc.status = 'critical' THEN 1 END) as critical_count
FROM counselor_profiles cp
LEFT JOIN counselor_caseloads cc ON cp.id = cc.counselor_id
GROUP BY cp.id, cp.first_name, cp.last_name, cp.school_name;

-- Pending reviews view
CREATE OR REPLACE VIEW pending_application_reviews AS
SELECT
  ar.*,
  cp.first_name || ' ' || cp.last_name as counselor_name
FROM application_readiness ar
LEFT JOIN counselor_profiles cp ON ar.counselor_id = cp.id
WHERE ar.student_marked_ready = TRUE
  AND ar.counselor_approved = FALSE
ORDER BY ar.deadline ASC;

-- ===========================================
-- RLS POLICIES
-- ===========================================

ALTER TABLE counselor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselor_caseloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselor_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselor_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_counselor_config ENABLE ROW LEVEL SECURITY;

-- Counselors can see their own profile
CREATE POLICY counselor_profiles_select ON counselor_profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY counselor_profiles_update ON counselor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Counselors can manage their caseloads
CREATE POLICY counselor_caseloads_select ON counselor_caseloads
  FOR SELECT USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY counselor_caseloads_insert ON counselor_caseloads
  FOR INSERT WITH CHECK (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY counselor_caseloads_update ON counselor_caseloads
  FOR UPDATE USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
  );

-- Application readiness - counselors and students
CREATE POLICY application_readiness_select ON application_readiness
  FOR SELECT USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR student_id = auth.uid()
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY application_readiness_insert ON application_readiness
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    OR counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY application_readiness_update ON application_readiness
  FOR UPDATE USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR student_id = auth.uid()
  );

-- Counselors can manage their nudges
CREATE POLICY counselor_nudges_all ON counselor_nudges
  FOR ALL USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR student_id = auth.uid()
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Counselors can manage their tasks
CREATE POLICY counselor_tasks_all ON counselor_tasks
  FOR ALL USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Nudge templates - system templates visible to all, custom only to owner
CREATE POLICY nudge_templates_select ON nudge_templates
  FOR SELECT USING (
    is_system = TRUE
    OR counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY nudge_templates_modify ON nudge_templates
  FOR ALL USING (
    counselor_id IN (SELECT id FROM counselor_profiles WHERE user_id = auth.uid())
  );

-- School config - admins and counselors at that school
CREATE POLICY school_counselor_config_select ON school_counselor_config
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM counselor_profiles WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to auto-update status timestamp
CREATE OR REPLACE FUNCTION update_caseload_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER caseload_status_update
  BEFORE UPDATE ON counselor_caseloads
  FOR EACH ROW
  EXECUTE FUNCTION update_caseload_status_timestamp();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_counselor_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER counselor_profiles_updated
  BEFORE UPDATE ON counselor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_counselor_updated_at();

CREATE TRIGGER application_readiness_updated
  BEFORE UPDATE ON application_readiness
  FOR EACH ROW
  EXECUTE FUNCTION update_counselor_updated_at();

CREATE TRIGGER counselor_tasks_updated
  BEFORE UPDATE ON counselor_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_counselor_updated_at();

COMMENT ON TABLE counselor_profiles IS 'School counselor profiles and settings';
COMMENT ON TABLE counselor_caseloads IS 'Counselor to student assignments';
COMMENT ON TABLE application_readiness IS 'Student application readiness tracking and counselor sign-off';
COMMENT ON TABLE counselor_nudges IS 'Messages sent from counselors to students';
COMMENT ON TABLE counselor_tasks IS 'Counselor action items and to-dos';
COMMENT ON TABLE nudge_templates IS 'Reusable message templates for nudges';
COMMENT ON TABLE school_counselor_config IS 'School-level counselor workflow settings';
