-- ============================================
-- PHASE 4: Resume, Notifications, Offers Migration
-- Version: 007
-- Description: Resume storage, email notifications, offer letters, calendar
-- ============================================

-- ============================================
-- 1. CREATE ENUM TYPES
-- ============================================

DO $$
BEGIN
    CREATE TYPE offer_status AS ENUM (
        'draft',
        'pending-approval',
        'approved',
        'sent',
        'viewed',
        'accepted',
        'declined',
        'expired',
        'withdrawn'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE notification_type AS ENUM (
        'email',
        'sms',
        'push',
        'in-app'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE notification_category AS ENUM (
        'application',
        'interview',
        'offer',
        'rejection',
        'reminder',
        'welcome',
        'system'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================
-- 2. CREATE RESUMES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- File info
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    
    -- Parsed data
    parsed_data JSONB,
    parse_confidence INTEGER,
    raw_text TEXT,
    
    -- Extracted fields
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    
    -- Experience
    total_years_experience INTEGER,
    current_job_role TEXT,
    current_company TEXT,
    experience JSONB, -- Array of work experience objects
    
    -- Education
    highest_degree TEXT,
    education JSONB, -- Array of education objects
    
    -- Skills
    skills TEXT[],
    technical_skills TEXT[],
    soft_skills TEXT[],
    
    -- Certifications
    certifications JSONB,
    
    -- Clearance
    clearance_level TEXT,
    clearance_status TEXT,
    
    -- Metadata
    is_primary BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 3. CREATE OFFER LETTERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.offer_letters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    
    -- Candidate info
    candidate_id UUID NOT NULL REFERENCES public.users(id),
    candidate_name TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    
    -- Position details
    job_id UUID NOT NULL REFERENCES public.jobs(id),
    job_title TEXT NOT NULL,
    department TEXT,
    reports_to TEXT,
    employment_type TEXT NOT NULL,
    work_arrangement TEXT,
    work_location TEXT,
    
    -- Compensation
    base_salary INTEGER NOT NULL,
    salary_period TEXT DEFAULT 'annual',
    signing_bonus INTEGER,
    annual_bonus JSONB, -- { target: number, maxPayout: number }
    equity JSONB, -- { shares: number, vestingSchedule: string, cliffPeriod: string }
    relocation_assistance INTEGER,
    
    -- Benefits
    benefits JSONB,
    
    -- Dates
    start_date DATE,
    offer_expiration_date DATE NOT NULL,
    
    -- Contingencies
    contingencies JSONB,
    
    -- Additional terms
    non_compete BOOLEAN DEFAULT FALSE,
    non_compete_period TEXT,
    confidentiality_agreement BOOLEAN DEFAULT TRUE,
    arbitration_clause BOOLEAN DEFAULT FALSE,
    custom_terms TEXT,
    
    -- Document
    document_url TEXT,
    signed_document_url TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'draft',
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Approval workflow
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. CREATE EMAIL NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Recipients
    to_email TEXT NOT NULL,
    to_name TEXT,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    
    -- Content
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    
    -- Template
    template_id TEXT,
    template_variables JSONB,
    
    -- Category
    category TEXT NOT NULL DEFAULT 'system',
    
    -- Related entities
    user_id UUID REFERENCES public.users(id),
    application_id UUID REFERENCES public.applications(id),
    interview_id UUID REFERENCES public.interviews(id),
    offer_id UUID REFERENCES public.offer_letters(id),
    
    -- Attachments
    attachments JSONB, -- Array of { name: string, url: string }
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- External tracking
    external_message_id TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 5. CREATE NOTIFICATION PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Channel preferences
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    
    -- Frequency
    frequency TEXT DEFAULT 'instant', -- instant, daily, weekly
    
    -- Quiet hours
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Category preferences
    applications_enabled BOOLEAN DEFAULT TRUE,
    interviews_enabled BOOLEAN DEFAULT TRUE,
    offers_enabled BOOLEAN DEFAULT TRUE,
    reminders_enabled BOOLEAN DEFAULT TRUE,
    marketing_enabled BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 6. CREATE CALENDAR EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Owner
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Event details
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL, -- interview, deadline, reminder, meeting
    
    -- Timing
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Location
    location TEXT,
    meeting_url TEXT,
    dial_in_number TEXT,
    
    -- Related entities
    application_id UUID REFERENCES public.applications(id),
    interview_id UUID REFERENCES public.interviews(id),
    job_id UUID REFERENCES public.jobs(id),
    
    -- Attendees
    attendees JSONB, -- Array of { email, name, status }
    
    -- Reminders
    reminders JSONB, -- Array of { type: 'email'|'push', minutes: number }
    
    -- External calendar sync
    google_event_id TEXT,
    outlook_event_id TEXT,
    ical_uid TEXT,
    
    -- Status
    status TEXT DEFAULT 'confirmed', -- confirmed, tentative, cancelled
    
    -- Recurrence
    recurrence_rule TEXT,
    recurrence_id UUID REFERENCES public.calendar_events(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 7. UPDATE APPLICATIONS TABLE
-- ============================================

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES public.resumes(id),
ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offer_letters(id);

-- ============================================
-- 8. CREATE FUNCTIONS
-- ============================================

-- Auto-set primary resume (only one primary per user)
CREATE OR REPLACE FUNCTION public.ensure_single_primary_resume()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE public.resumes
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS single_primary_resume ON public.resumes;
CREATE TRIGGER single_primary_resume
    AFTER INSERT OR UPDATE ON public.resumes
    FOR EACH ROW
    WHEN (NEW.is_primary = TRUE)
    EXECUTE FUNCTION public.ensure_single_primary_resume();

-- Log offer status changes
CREATE OR REPLACE FUNCTION public.log_offer_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Update timestamp based on new status
        CASE NEW.status
            WHEN 'sent' THEN NEW.sent_at := NOW();
            WHEN 'viewed' THEN NEW.viewed_at := NOW();
            WHEN 'accepted' THEN NEW.responded_at := NOW();
            WHEN 'declined' THEN NEW.responded_at := NOW();
            ELSE NULL;
        END CASE;
        
        -- Log to application timeline
        INSERT INTO public.application_timeline (
            application_id,
            event_type,
            title,
            description,
            metadata,
            actor_type
        ) VALUES (
            NEW.application_id,
            'offer',
            CASE NEW.status
                WHEN 'sent' THEN 'Offer letter sent'
                WHEN 'viewed' THEN 'Offer letter viewed by candidate'
                WHEN 'accepted' THEN 'Offer accepted!'
                WHEN 'declined' THEN 'Offer declined'
                WHEN 'expired' THEN 'Offer expired'
                ELSE 'Offer status updated to ' || NEW.status
            END,
            NULL,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
            'system'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_offer_status ON public.offer_letters;
CREATE TRIGGER log_offer_status
    BEFORE UPDATE ON public.offer_letters
    FOR EACH ROW
    EXECUTE FUNCTION public.log_offer_status_change();

-- Create calendar event for interview
CREATE OR REPLACE FUNCTION public.create_interview_calendar_event()
RETURNS TRIGGER AS $$
DECLARE
    v_application RECORD;
    v_job RECORD;
BEGIN
    -- Get application details
    SELECT a.*, u.email as candidate_email, u.first_name, u.last_name
    INTO v_application
    FROM public.applications a
    JOIN public.users u ON a.user_id = u.id
    WHERE a.id = NEW.application_id;
    
    -- Get job details
    SELECT * INTO v_job FROM public.jobs WHERE id = v_application.job_id;
    
    -- Create calendar event
    INSERT INTO public.calendar_events (
        user_id,
        title,
        description,
        event_type,
        start_at,
        end_at,
        location,
        meeting_url,
        application_id,
        interview_id,
        job_id,
        attendees,
        reminders
    ) VALUES (
        v_application.user_id,
        NEW.type || ' Interview - ' || v_job.title,
        'Interview for ' || v_job.title || ' position',
        'interview',
        NEW.scheduled_at,
        NEW.scheduled_at + (NEW.duration_minutes || ' minutes')::INTERVAL,
        NEW.location,
        NEW.meeting_url,
        NEW.application_id,
        NEW.id,
        v_application.job_id,
        jsonb_build_array(
            jsonb_build_object(
                'email', v_application.candidate_email,
                'name', v_application.first_name || ' ' || v_application.last_name,
                'status', 'pending'
            )
        ),
        jsonb_build_array(
            jsonb_build_object('type', 'email', 'minutes', 1440), -- 24 hours
            jsonb_build_object('type', 'email', 'minutes', 60)    -- 1 hour
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_interview_event ON public.interviews;
CREATE TRIGGER create_interview_event
    AFTER INSERT ON public.interviews
    FOR EACH ROW
    EXECUTE FUNCTION public.create_interview_calendar_event();

-- ============================================
-- 9. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_resumes_user ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_primary ON public.resumes(user_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_resumes_skills ON public.resumes USING gin(skills);

CREATE INDEX IF NOT EXISTS idx_offer_letters_application ON public.offer_letters(application_id);
CREATE INDEX IF NOT EXISTS idx_offer_letters_candidate ON public.offer_letters(candidate_id);
CREATE INDEX IF NOT EXISTS idx_offer_letters_status ON public.offer_letters(status);
CREATE INDEX IF NOT EXISTS idx_offer_letters_expiration ON public.offer_letters(offer_expiration_date);

CREATE INDEX IF NOT EXISTS idx_email_notifications_user ON public.email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_scheduled ON public.email_notifications(scheduled_at) 
    WHERE scheduled_at IS NOT NULL AND status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_notifications_category ON public.email_notifications(category);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON public.calendar_events(start_at);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON public.calendar_events(event_type);

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Resumes: owner access only
CREATE POLICY "Users can manage their own resumes"
ON public.resumes FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Offer letters: candidate and org access
CREATE POLICY "Offer letter access"
ON public.offer_letters FOR SELECT TO authenticated
USING (candidate_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
));

CREATE POLICY "Org members can manage offers"
ON public.offer_letters FOR ALL TO authenticated
USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
));

-- Email notifications: recipient access
CREATE POLICY "Users can view their notifications"
ON public.email_notifications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR to_email = (SELECT email FROM public.users WHERE id = auth.uid()));

-- Notification preferences: owner only
CREATE POLICY "Users can manage their preferences"
ON public.notification_preferences FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Calendar events: owner access
CREATE POLICY "Users can manage their calendar"
ON public.calendar_events FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 11. GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.offer_letters TO authenticated;
GRANT SELECT ON public.email_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;

-- ============================================
-- 12. VIEWS
-- ============================================

-- Offer letters with details
CREATE OR REPLACE VIEW public.offer_letters_full_view AS
SELECT 
    o.*,
    j.title as job_title_current,
    j.location as job_location,
    org.name as organization_name,
    org.logo as organization_logo,
    u.first_name as candidate_first_name,
    u.last_name as candidate_last_name
FROM public.offer_letters o
JOIN public.jobs j ON o.job_id = j.id
JOIN public.organizations org ON o.organization_id = org.id
JOIN public.users u ON o.candidate_id = u.id;

GRANT SELECT ON public.offer_letters_full_view TO authenticated;

-- User calendar view
CREATE OR REPLACE VIEW public.user_calendar_view AS
SELECT 
    ce.id,
    ce.user_id,
    ce.title,
    ce.description,
    ce.event_type,
    ce.start_at,
    ce.end_at,
    ce.all_day,
    ce.timezone,
    ce.location,
    ce.meeting_url,
    ce.dial_in_number,
    ce.application_id,
    ce.interview_id,
    COALESCE(ce.job_id, a.job_id) as job_id,
    ce.attendees,
    ce.reminders,
    ce.google_event_id,
    ce.outlook_event_id,
    ce.ical_uid,
    ce.status,
    ce.recurrence_rule,
    ce.recurrence_id,
    ce.created_at,
    ce.updated_at,
    CASE 
        WHEN ce.interview_id IS NOT NULL THEN i.type
        ELSE ce.event_type
    END as event_subtype,
    j.title as job_title,
    o.name as company_name
FROM public.calendar_events ce
LEFT JOIN public.interviews i ON ce.interview_id = i.id
LEFT JOIN public.applications a ON ce.application_id = a.id
LEFT JOIN public.jobs j ON COALESCE(ce.job_id, a.job_id) = j.id
LEFT JOIN public.organizations o ON j.organization_id = o.id;

GRANT SELECT ON public.user_calendar_view TO authenticated;

-- ============================================
-- PHASE 4 MIGRATION COMPLETE
-- ============================================
