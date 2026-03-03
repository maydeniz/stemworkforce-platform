-- ===========================================
-- Industry Partners System
-- Talent pipeline, internships, recruiting
-- ===========================================

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Industry Partners (Employers)
CREATE TABLE IF NOT EXISTS industry_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Company info
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT, -- '1-50', '51-200', '201-1000', '1001-5000', '5000+'
  headquarters TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,

  -- Partnership details
  partnership_types TEXT[] DEFAULT '{}', -- talent_pipeline, corporate_sponsor, apprenticeship_host, curriculum_advisor
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'growth', 'enterprise')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),

  -- Contact info
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_title TEXT,

  -- Billing
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'past_due', 'cancelled', 'trialing')),

  -- Timestamps
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for lookups
CREATE INDEX IF NOT EXISTS idx_industry_partners_user ON industry_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_industry_partners_status ON industry_partners(status);

-- ===========================================
-- JOB POSTINGS
-- ===========================================

CREATE TABLE IF NOT EXISTS employer_job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES industry_partners(id) ON DELETE CASCADE,

  -- Job details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',

  -- Classification
  job_type TEXT DEFAULT 'full_time' CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'apprenticeship', 'co_op')),
  experience_level TEXT DEFAULT 'entry' CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
  work_location TEXT DEFAULT 'onsite' CHECK (work_location IN ('onsite', 'remote', 'hybrid')),
  department TEXT,

  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'USA',
  remote_allowed BOOLEAN DEFAULT false,

  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT DEFAULT 'annual' CHECK (salary_type IN ('hourly', 'annual')),
  show_salary BOOLEAN DEFAULT true,
  benefits TEXT[] DEFAULT '{}',

  -- Skills & requirements
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  education_requirement TEXT,
  clearance_required TEXT,

  -- Posting details
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'filled')),
  featured BOOLEAN DEFAULT false,
  application_url TEXT,
  application_email TEXT,

  -- Stats
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,

  -- Timestamps
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_postings_partner ON employer_job_postings(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON employer_job_postings(status);

-- ===========================================
-- CANDIDATES / TALENT PIPELINE
-- ===========================================

CREATE TABLE IF NOT EXISTS employer_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES industry_partners(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES employer_job_postings(id) ON DELETE SET NULL,

  -- Basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,

  -- Background
  education JSONB DEFAULT '[]', -- array of education records
  current_title TEXT,
  current_company TEXT,
  years_of_experience INTEGER DEFAULT 0,

  -- Skills
  skills TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',

  -- Pipeline tracking
  stage TEXT DEFAULT 'new' CHECK (stage IN ('new', 'reviewed', 'screened', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  source TEXT DEFAULT 'platform' CHECK (source IN ('platform', 'career_fair', 'university', 'referral', 'direct', 'other')),
  source_detail TEXT,
  fit_score INTEGER,

  -- Notes & activity
  notes TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_partner ON employer_candidates(partner_id);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON employer_candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_job ON employer_candidates(job_posting_id);

-- Candidate Activity Log
CREATE TABLE IF NOT EXISTS candidate_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES employer_candidates(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('stage_change', 'note_added', 'interview_scheduled', 'offer_sent', 'email_sent', 'call_logged')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  performed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidate_activities ON candidate_activities(candidate_id);

-- ===========================================
-- INTERNSHIP / APPRENTICESHIP PROGRAMS
-- ===========================================

CREATE TABLE IF NOT EXISTS work_based_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES industry_partners(id) ON DELETE CASCADE,

  -- Program info
  name TEXT NOT NULL,
  program_type TEXT DEFAULT 'internship' CHECK (program_type IN ('internship', 'apprenticeship', 'co_op', 'fellowship')),
  description TEXT,

  -- Details
  department TEXT,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  duration TEXT, -- '12 weeks', '6 months'
  hours_per_week INTEGER DEFAULT 40,
  is_paid BOOLEAN DEFAULT true,
  compensation INTEGER,
  compensation_type TEXT CHECK (compensation_type IN ('hourly', 'stipend', 'salary')),

  -- Dates
  start_date DATE,
  end_date DATE,
  application_deadline DATE,

  -- Requirements
  required_majors TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  minimum_gpa DECIMAL(3,2),
  eligibility_requirements TEXT[] DEFAULT '{}',

  -- Capacity
  total_positions INTEGER DEFAULT 1,
  filled_positions INTEGER DEFAULT 0,

  -- DOL Compliance (apprenticeships)
  dol_registered BOOLEAN DEFAULT false,
  dol_registration_number TEXT,
  related_technical_instruction TEXT,

  -- Status
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'recruiting', 'active', 'completed', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_partner ON work_based_programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON work_based_programs(status);

-- Program Participants
CREATE TABLE IF NOT EXISTS program_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES work_based_programs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES employer_candidates(id) ON DELETE CASCADE,

  -- Assignment
  mentor_id TEXT,
  mentor_name TEXT,
  supervisor_id TEXT,
  supervisor_name TEXT,

  -- Progress
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'terminated', 'converted')),

  -- Evaluation
  midpoint_evaluation JSONB,
  final_evaluation JSONB,

  -- Conversion
  converted_to_full_time BOOLEAN DEFAULT false,
  conversion_date DATE,
  conversion_role TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_participants_program ON program_participants(program_id);

-- ===========================================
-- RECRUITING EVENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS recruiting_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES industry_partners(id) ON DELETE CASCADE,

  -- Event info
  name TEXT NOT NULL,
  event_type TEXT DEFAULT 'career_fair' CHECK (event_type IN ('career_fair', 'info_session', 'workshop', 'hackathon', 'campus_visit', 'webinar')),
  description TEXT,

  -- Location/format
  format TEXT DEFAULT 'virtual' CHECK (format IN ('virtual', 'in_person', 'hybrid')),
  venue TEXT,
  city TEXT,
  state TEXT,
  virtual_link TEXT,

  -- Timing
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/New_York',

  -- Registration
  max_registrations INTEGER,
  current_registrations INTEGER DEFAULT 0,
  registration_deadline TIMESTAMPTZ,

  -- Sponsorship
  is_sponsor BOOLEAN DEFAULT false,
  sponsorship_tier TEXT,
  sponsorship_cost INTEGER,

  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),

  -- Stats
  attendee_count INTEGER,
  leads_generated INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_partner ON recruiting_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON recruiting_events(status);

-- ===========================================
-- UNIVERSITY RELATIONSHIPS
-- ===========================================

CREATE TABLE IF NOT EXISTS university_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES industry_partners(id) ON DELETE CASCADE,
  institution_id UUID,
  institution_name TEXT NOT NULL,

  -- Relationship
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'outreach', 'engaged', 'partner', 'inactive')),
  partnership_type TEXT DEFAULT 'recruiting' CHECK (partnership_type IN ('recruiting', 'curriculum_advisory', 'research', 'sponsorship', 'general')),

  -- Contacts
  primary_contact JSONB,

  -- Programs of interest
  target_programs TEXT[] DEFAULT '{}',
  target_majors TEXT[] DEFAULT '{}',

  -- Activity
  last_contact_date DATE,
  next_follow_up_date DATE,
  notes TEXT,

  -- Metrics
  hires_from_institution INTEGER DEFAULT 0,
  interns_from_institution INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_university_rel_partner ON university_relationships(partner_id);

-- ===========================================
-- COMPANY PROFILE / EMPLOYER BRANDING
-- ===========================================

CREATE TABLE IF NOT EXISTS company_profiles (
  partner_id UUID PRIMARY KEY REFERENCES industry_partners(id) ON DELETE CASCADE,

  -- Basic
  tagline TEXT,
  about_us TEXT,
  mission_statement TEXT,

  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  video_url TEXT,
  photos TEXT[] DEFAULT '{}',

  -- Culture
  culture_highlights TEXT[] DEFAULT '{}',
  perks TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',

  -- Social proof
  awards JSONB DEFAULT '[]',
  press_features JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',

  -- DEI
  dei_statement TEXT,
  employee_resource_groups TEXT[] DEFAULT '{}',
  diversity_stats JSONB DEFAULT '[]',

  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE industry_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_based_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiting_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

-- Industry Partners policies
CREATE POLICY "Users can view their own partner profile" ON industry_partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own partner profile" ON industry_partners
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own partner profile" ON industry_partners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Job Postings - partners can manage their own
CREATE POLICY "Partners can manage their job postings" ON employer_job_postings
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- Active jobs are publicly viewable
CREATE POLICY "Public can view active job postings" ON employer_job_postings
  FOR SELECT USING (status = 'active');

-- Candidates - partners can manage their own
CREATE POLICY "Partners can manage their candidates" ON employer_candidates
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- Candidate activities
CREATE POLICY "Partners can manage candidate activities" ON candidate_activities
  FOR ALL USING (
    candidate_id IN (
      SELECT id FROM employer_candidates WHERE partner_id IN (
        SELECT id FROM industry_partners WHERE user_id = auth.uid()
      )
    )
  );

-- Work-based programs - partners can manage their own
CREATE POLICY "Partners can manage their programs" ON work_based_programs
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- Program participants
CREATE POLICY "Partners can manage participants" ON program_participants
  FOR ALL USING (
    program_id IN (
      SELECT id FROM work_based_programs WHERE partner_id IN (
        SELECT id FROM industry_partners WHERE user_id = auth.uid()
      )
    )
  );

-- Recruiting events - partners can manage their own
CREATE POLICY "Partners can manage their events" ON recruiting_events
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- University relationships - partners can manage their own
CREATE POLICY "Partners can manage university relationships" ON university_relationships
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- Company profiles - partners can manage their own
CREATE POLICY "Partners can manage their company profile" ON company_profiles
  FOR ALL USING (
    partner_id IN (SELECT id FROM industry_partners WHERE user_id = auth.uid())
  );

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_industry_partner_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_industry_partners_timestamp
  BEFORE UPDATE ON industry_partners
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_job_postings_timestamp
  BEFORE UPDATE ON employer_job_postings
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_candidates_timestamp
  BEFORE UPDATE ON employer_candidates
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_programs_timestamp
  BEFORE UPDATE ON work_based_programs
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_participants_timestamp
  BEFORE UPDATE ON program_participants
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_events_timestamp
  BEFORE UPDATE ON recruiting_events
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_university_rel_timestamp
  BEFORE UPDATE ON university_relationships
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();

CREATE TRIGGER update_company_profile_timestamp
  BEFORE UPDATE ON company_profiles
  FOR EACH ROW EXECUTE FUNCTION update_industry_partner_timestamp();
