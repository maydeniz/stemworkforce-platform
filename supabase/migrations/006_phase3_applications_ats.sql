-- ============================================
-- PHASE 3: Applications, ATS & Matching Migration
-- Version: 006
-- Description: Application tracking, matching algorithm, interview scheduling
-- ============================================

-- ============================================
-- 1. CREATE APPLICATION STATUS ENUM
-- ============================================

DO $$
BEGIN
    CREATE TYPE application_status AS ENUM (
        'new',
        'reviewing',
        'phone-screen',
        'interview',
        'technical',
        'final-round',
        'offer-extended',
        'offer-accepted',
        'hired',
        'rejected',
        'withdrawn'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE interview_type AS ENUM (
        'phone',
        'video',
        'onsite',
        'technical',
        'panel',
        'behavioral',
        'final'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE interview_status AS ENUM (
        'scheduled',
        'confirmed',
        'completed',
        'cancelled',
        'no-show',
        'rescheduled'
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================
-- 2. CREATE APPLICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'new',
    status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status_updated_by UUID REFERENCES auth.users(id),
    
    -- Application content
    resume_url TEXT,
    resume_version TEXT,
    cover_letter TEXT,
    cover_letter_url TEXT,
    answers JSONB, -- Custom question answers
    
    -- Match scores
    match_score INTEGER DEFAULT 0,
    skills_match_score INTEGER DEFAULT 0,
    experience_match_score INTEGER DEFAULT 0,
    education_match_score INTEGER DEFAULT 0,
    clearance_eligible BOOLEAN DEFAULT TRUE,
    citizenship_eligible BOOLEAN DEFAULT TRUE,
    
    -- Matched/Missing skills
    matched_skills TEXT[],
    missing_skills TEXT[],
    
    -- Ratings (by recruiter)
    rating_skills INTEGER CHECK (rating_skills >= 1 AND rating_skills <= 5),
    rating_experience INTEGER CHECK (rating_experience >= 1 AND rating_experience <= 5),
    rating_cultural INTEGER CHECK (rating_cultural >= 1 AND rating_cultural <= 5),
    rating_overall INTEGER CHECK (rating_overall >= 1 AND rating_overall <= 5),
    
    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    viewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Ensure one application per job per user
    UNIQUE(user_id, job_id)
);

-- ============================================
-- 3. CREATE APPLICATION NOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.application_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. CREATE INTERVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    
    -- Interview details
    type TEXT NOT NULL DEFAULT 'phone',
    status TEXT NOT NULL DEFAULT 'scheduled',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Location
    location TEXT,
    meeting_url TEXT,
    dial_in_number TEXT,
    
    -- Participants
    interviewers UUID[],
    interviewer_names TEXT[],
    
    -- Preparation
    preparation_notes TEXT,
    interview_guide_url TEXT,
    
    -- Feedback (after interview)
    feedback TEXT,
    strengths TEXT[],
    concerns TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    recommendation TEXT, -- 'strong-yes', 'yes', 'neutral', 'no', 'strong-no'
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- 5. CREATE APPLICATION TIMELINE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.application_timeline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'applied', 'viewed', 'status-change', 'interview', 'note', 'offer'
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    actor_id UUID REFERENCES auth.users(id),
    actor_type TEXT, -- 'applicant', 'recruiter', 'system'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 6. CREATE SAVED JOBS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, job_id)
);

-- ============================================
-- 7. CREATE JOB ALERTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    
    -- Alert criteria
    keywords TEXT[],
    industries TEXT[],
    locations TEXT[],
    work_arrangements TEXT[],
    employment_types TEXT[],
    experience_levels TEXT[],
    clearance_levels TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    
    -- Notification settings
    frequency TEXT DEFAULT 'daily', -- 'instant', 'daily', 'weekly'
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 8. MATCHING ALGORITHM FUNCTIONS
-- ============================================

-- Calculate overall match score between a user and a job
CREATE OR REPLACE FUNCTION public.calculate_job_match(
    p_user_id UUID,
    p_job_id UUID
) RETURNS TABLE (
    overall_score INTEGER,
    skills_score INTEGER,
    experience_score INTEGER,
    education_score INTEGER,
    clearance_eligible BOOLEAN,
    citizenship_eligible BOOLEAN,
    matched_skills TEXT[],
    missing_skills TEXT[]
) AS $$
DECLARE
    v_user RECORD;
    v_job RECORD;
    v_skills_score INTEGER := 0;
    v_exp_score INTEGER := 0;
    v_edu_score INTEGER := 0;
    v_matched TEXT[];
    v_missing TEXT[];
    v_clearance_ok BOOLEAN := TRUE;
    v_citizenship_ok BOOLEAN := TRUE;
BEGIN
    -- Get user profile
    SELECT * INTO v_user FROM public.users WHERE id = p_user_id;
    
    -- Get job details
    SELECT * INTO v_job FROM public.jobs WHERE id = p_job_id;
    
    IF v_user IS NULL OR v_job IS NULL THEN
        RETURN QUERY SELECT 0, 0, 0, 0, FALSE, FALSE, ARRAY[]::TEXT[], ARRAY[]::TEXT[];
        RETURN;
    END IF;
    
    -- Calculate skills match
    IF v_job.required_skills IS NOT NULL AND array_length(v_job.required_skills, 1) > 0 THEN
        SELECT 
            COALESCE(array_agg(s), ARRAY[]::TEXT[]),
            COALESCE(
                (SELECT array_agg(rs) FROM unnest(v_job.required_skills) rs 
                 WHERE rs NOT IN (SELECT unnest(v_matched))),
                ARRAY[]::TEXT[]
            )
        INTO v_matched, v_missing
        FROM (
            SELECT unnest(v_job.required_skills) AS s
            INTERSECT
            SELECT unnest(COALESCE(v_user.skills, ARRAY[]::TEXT[]))
        ) matched_skills;
        
        v_skills_score := LEAST(100, 
            (array_length(v_matched, 1)::NUMERIC / GREATEST(1, array_length(v_job.required_skills, 1))) * 100
        )::INTEGER;
    ELSE
        v_skills_score := 100;
        v_matched := ARRAY[]::TEXT[];
        v_missing := ARRAY[]::TEXT[];
    END IF;
    
    -- Check clearance eligibility
    IF v_job.clearance IS NOT NULL AND v_job.clearance != 'none' THEN
        v_clearance_ok := v_user.clearance_level IS NOT NULL AND 
                          v_user.clearance_level != 'none' AND
                          v_user.clearance_status IN ('active', 'current');
    END IF;
    
    -- Check citizenship eligibility
    IF v_job.citizenship_required IS NOT NULL AND v_job.citizenship_required != 'any' THEN
        CASE v_job.citizenship_required
            WHEN 'us-citizen-only' THEN
                v_citizenship_ok := v_user.citizenship = 'us_citizen';
            WHEN 'us-person' THEN
                v_citizenship_ok := v_user.citizenship IN ('us_citizen', 'us_national', 'permanent_resident');
            ELSE
                v_citizenship_ok := TRUE;
        END CASE;
    END IF;
    
    -- Experience score (simplified)
    v_exp_score := 80; -- Default to 80 for now
    
    -- Education score (simplified)
    v_edu_score := 80; -- Default to 80 for now
    
    RETURN QUERY SELECT 
        ((v_skills_score * 0.4) + (v_exp_score * 0.3) + (v_edu_score * 0.3))::INTEGER,
        v_skills_score,
        v_exp_score,
        v_edu_score,
        v_clearance_ok,
        v_citizenship_ok,
        v_matched,
        v_missing;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-calculate match score on application insert
CREATE OR REPLACE FUNCTION public.auto_calculate_application_match()
RETURNS TRIGGER AS $$
DECLARE
    match_result RECORD;
BEGIN
    SELECT * INTO match_result 
    FROM public.calculate_job_match(NEW.user_id, NEW.job_id);
    
    NEW.match_score := match_result.overall_score;
    NEW.skills_match_score := match_result.skills_score;
    NEW.experience_match_score := match_result.experience_score;
    NEW.education_match_score := match_result.education_score;
    NEW.clearance_eligible := match_result.clearance_eligible;
    NEW.citizenship_eligible := match_result.citizenship_eligible;
    NEW.matched_skills := match_result.matched_skills;
    NEW.missing_skills := match_result.missing_skills;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_application_match ON public.applications;
CREATE TRIGGER calculate_application_match
    BEFORE INSERT ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_calculate_application_match();

-- ============================================
-- 9. APPLICATION STATUS CHANGE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_updated_at := NOW();
        
        INSERT INTO public.application_timeline (
            application_id,
            event_type,
            title,
            description,
            metadata,
            actor_id,
            actor_type
        ) VALUES (
            NEW.id,
            'status-change',
            'Status changed to ' || NEW.status,
            'Application status updated from ' || COALESCE(OLD.status, 'none') || ' to ' || NEW.status,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status),
            NEW.status_updated_by,
            'recruiter'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_status_change ON public.applications;
CREATE TRIGGER log_status_change
    AFTER UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.log_application_status_change();

-- ============================================
-- 10. CREATE APPLICATION INSERT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.log_application_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.application_timeline (
        application_id,
        event_type,
        title,
        description,
        actor_id,
        actor_type
    ) VALUES (
        NEW.id,
        'applied',
        'Application submitted',
        'Application was submitted for this position',
        NEW.user_id,
        'applicant'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_application_created ON public.applications;
CREATE TRIGGER log_application_created
    AFTER INSERT ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.log_application_created();

-- ============================================
-- 11. SEARCH FUNCTIONS
-- ============================================

-- Advanced job search function
CREATE OR REPLACE FUNCTION public.search_jobs(
    p_query TEXT DEFAULT NULL,
    p_industries TEXT[] DEFAULT NULL,
    p_locations TEXT[] DEFAULT NULL,
    p_employment_types TEXT[] DEFAULT NULL,
    p_experience_levels TEXT[] DEFAULT NULL,
    p_clearance_levels TEXT[] DEFAULT NULL,
    p_work_arrangements TEXT[] DEFAULT NULL,
    p_salary_min INTEGER DEFAULT NULL,
    p_salary_max INTEGER DEFAULT NULL,
    p_posted_within_days INTEGER DEFAULT NULL,
    p_visa_sponsorship BOOLEAN DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    title TEXT,
    company_name TEXT,
    location TEXT,
    industry TEXT,
    employment_type TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    clearance TEXT,
    posted_at TIMESTAMP WITH TIME ZONE,
    application_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        o.name as company_name,
        j.location,
        j.industry,
        j.employment_type,
        j.salary_min,
        j.salary_max,
        j.clearance,
        j.created_at as posted_at,
        COUNT(a.id) as application_count
    FROM public.jobs j
    LEFT JOIN public.organizations o ON j.organization_id = o.id
    LEFT JOIN public.applications a ON j.id = a.job_id
    WHERE j.status = 'active'
      AND (p_query IS NULL OR (
          j.title ILIKE '%' || p_query || '%' OR
          j.description ILIKE '%' || p_query || '%' OR
          o.name ILIKE '%' || p_query || '%' OR
          p_query = ANY(j.required_skills)
      ))
      AND (p_industries IS NULL OR j.industry = ANY(p_industries))
      AND (p_locations IS NULL OR j.location = ANY(p_locations))
      AND (p_employment_types IS NULL OR j.employment_type = ANY(p_employment_types))
      AND (p_experience_levels IS NULL OR j.experience_level = ANY(p_experience_levels))
      AND (p_clearance_levels IS NULL OR j.clearance = ANY(p_clearance_levels))
      AND (p_work_arrangements IS NULL OR j.work_arrangement = ANY(p_work_arrangements))
      AND (p_salary_min IS NULL OR j.salary_max >= p_salary_min)
      AND (p_salary_max IS NULL OR j.salary_min <= p_salary_max)
      AND (p_posted_within_days IS NULL OR j.created_at >= NOW() - (p_posted_within_days || ' days')::INTERVAL)
      AND (p_visa_sponsorship IS NULL OR j.visa_sponsorship = p_visa_sponsorship)
    GROUP BY j.id, o.name
    ORDER BY j.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_match_score ON public.applications(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_org ON public.applications(organization_id);

CREATE INDEX IF NOT EXISTS idx_application_notes_app ON public.application_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_app ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON public.interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_timeline_app ON public.application_timeline(application_id);
CREATE INDEX IF NOT EXISTS idx_timeline_created ON public.application_timeline(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON public.job_alerts(user_id);

-- Full text search on jobs
CREATE INDEX IF NOT EXISTS idx_jobs_search ON public.jobs USING gin(
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
);

-- ============================================
-- 13. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- Applications: Applicants can view their own, recruiters can view their org's
CREATE POLICY "Users can view own applications"
ON public.applications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
));

CREATE POLICY "Users can create applications"
ON public.applications FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recruiters can update applications"
ON public.applications FOR UPDATE TO authenticated
USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
));

-- Notes: Author and org members can view
CREATE POLICY "Note access"
ON public.application_notes FOR SELECT TO authenticated
USING (author_id = auth.uid() OR NOT is_private OR application_id IN (
    SELECT id FROM public.applications WHERE user_id = auth.uid()
));

CREATE POLICY "Create notes"
ON public.application_notes FOR INSERT TO authenticated
WITH CHECK (true);

-- Interviews: Applicant and org access
CREATE POLICY "Interview access"
ON public.interviews FOR SELECT TO authenticated
USING (application_id IN (
    SELECT id FROM public.applications 
    WHERE user_id = auth.uid() OR organization_id IN (
        SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
));

-- Timeline: Same as applications
CREATE POLICY "Timeline access"
ON public.application_timeline FOR SELECT TO authenticated
USING (application_id IN (
    SELECT id FROM public.applications 
    WHERE user_id = auth.uid() OR organization_id IN (
        SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
));

-- Saved jobs: Owner only
CREATE POLICY "Saved jobs owner access"
ON public.saved_jobs FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Job alerts: Owner only
CREATE POLICY "Job alerts owner access"
ON public.job_alerts FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 14. GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT ON public.applications TO authenticated;
GRANT UPDATE (status, status_updated_at, status_updated_by, viewed_at, reviewed_at, 
              rating_skills, rating_experience, rating_cultural, rating_overall) 
ON public.applications TO authenticated;

GRANT SELECT, INSERT ON public.application_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.interviews TO authenticated;
GRANT SELECT ON public.application_timeline TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_alerts TO authenticated;

-- ============================================
-- 15. VIEWS
-- ============================================

-- Applications with job and user details
CREATE OR REPLACE VIEW public.applications_full_view AS
SELECT 
    a.*,
    j.title as job_title,
    j.location as job_location,
    j.industry as job_industry,
    j.employment_type as job_type,
    j.salary_min as job_salary_min,
    j.salary_max as job_salary_max,
    o.name as company_name,
    o.logo as company_logo,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    (SELECT COUNT(*) FROM public.interviews i WHERE i.application_id = a.id) as interview_count,
    (SELECT COUNT(*) FROM public.application_notes n WHERE n.application_id = a.id) as note_count
FROM public.applications a
JOIN public.jobs j ON a.job_id = j.id
LEFT JOIN public.organizations o ON a.organization_id = o.id
JOIN public.users u ON a.user_id = u.id;

GRANT SELECT ON public.applications_full_view TO authenticated;

-- ============================================
-- PHASE 3 MIGRATION COMPLETE
-- ============================================
