-- ===========================================
-- Nonprofit Partners System
-- Workforce Development, STEM Education, DEI Organizations
-- ===========================================

-- ===========================================
-- NONPROFIT PARTNERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Organization info
  organization_name TEXT NOT NULL,
  nonprofit_type TEXT NOT NULL CHECK (nonprofit_type IN ('workforce_development', 'stem_education', 'professional_association', 'dei_organization', 'other')),
  ein TEXT, -- Employer Identification Number
  mission TEXT,
  website TEXT,
  logo_url TEXT,

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  service_area TEXT[] DEFAULT '{}',

  -- Partnership details
  tier TEXT NOT NULL DEFAULT 'community' CHECK (tier IN ('community', 'impact', 'coalition')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),

  -- Contact info
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_title TEXT,

  -- Organization size
  annual_budget TEXT,
  staff_count INTEGER,
  volunteers_count INTEGER,

  -- Billing
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'past_due', 'cancelled', 'trialing')),
  subscription_ends_at TIMESTAMPTZ,

  -- Tier-based limits
  max_programs INTEGER DEFAULT 3,
  can_access_grant_reporting BOOLEAN DEFAULT false,
  can_access_employer_network BOOLEAN DEFAULT true,
  can_access_coalition_tools BOOLEAN DEFAULT false,

  -- Timestamps
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROGRAMS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,

  -- Program info
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL CHECK (program_type IN ('job_training', 'career_services', 'stem_education', 'mentorship', 'apprenticeship', 'internship', 'bootcamp', 'other')),

  -- Program details
  target_population TEXT[] DEFAULT '{}',
  eligibility_criteria TEXT,
  duration TEXT,
  format TEXT CHECK (format IN ('in_person', 'virtual', 'hybrid')),
  location TEXT,

  -- Capacity
  capacity INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,

  -- Dates
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  is_rolling_admission BOOLEAN DEFAULT false,

  -- Funding
  funding_sources TEXT[] DEFAULT '{}',
  grant_ids UUID[] DEFAULT '{}',

  -- Outcomes
  completion_rate DECIMAL(5,2),
  placement_rate DECIMAL(5,2),
  average_wage_increase DECIMAL(10,2),

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  featured BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PARTICIPANTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,
  program_id UUID REFERENCES nonprofit_programs(id) ON DELETE SET NULL,

  -- Basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,

  -- Demographics (for grant reporting)
  gender TEXT,
  ethnicity TEXT,
  veteran_status BOOLEAN,
  disability_status BOOLEAN,

  -- Background
  education_level TEXT,
  prior_wage_hourly DECIMAL(10,2),
  employment_status_at_intake TEXT,

  -- Barriers
  barriers TEXT[] DEFAULT '{}',
  barrier_notes TEXT,

  -- Journey tracking
  status TEXT NOT NULL DEFAULT 'intake' CHECK (status IN ('intake', 'enrolled', 'active', 'completed', 'placed', 'retained', 'exited', 'withdrawn')),
  intake_date DATE NOT NULL,
  enrollment_date DATE,
  completion_date DATE,
  placement_date DATE,

  -- Placement info
  placed_employer_id UUID,
  placed_employer_name TEXT,
  placed_job_title TEXT,
  placed_wage_hourly DECIMAL(10,2),

  -- Retention tracking
  retention_30_day BOOLEAN,
  retention_60_day BOOLEAN,
  retention_90_day BOOLEAN,
  retention_180_day BOOLEAN,

  -- Notes
  case_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PARTICIPANT MILESTONES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS participant_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES nonprofit_participants(id) ON DELETE CASCADE,

  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('intake_complete', 'training_started', 'training_completed', 'credential_earned', 'interview', 'job_offer', 'placement', 'retention_check', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  achieved_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- GRANTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,

  -- Grant info
  name TEXT NOT NULL,
  funder_name TEXT NOT NULL,
  funder_type TEXT CHECK (funder_type IN ('federal', 'state', 'foundation', 'corporate')),
  grant_number TEXT,

  -- Financials
  award_amount DECIMAL(12,2),
  disbursed_amount DECIMAL(12,2) DEFAULT 0,
  remaining_amount DECIMAL(12,2),

  -- Dates
  application_date DATE,
  award_date DATE,
  start_date DATE,
  end_date DATE,
  reporting_deadlines DATE[] DEFAULT '{}',

  -- Requirements (targets)
  target_enrollment INTEGER,
  target_placements INTEGER,
  target_wage_goal DECIMAL(10,2),
  target_retention_rate DECIMAL(5,2),

  -- Actuals
  actual_enrollment INTEGER DEFAULT 0,
  actual_placements INTEGER DEFAULT 0,
  actual_average_wage DECIMAL(10,2),
  actual_retention_rate DECIMAL(5,2),

  -- Status
  status TEXT NOT NULL DEFAULT 'prospecting' CHECK (status IN ('prospecting', 'applied', 'awarded', 'active', 'reporting', 'closed', 'denied')),

  -- Programs linked
  program_ids UUID[] DEFAULT '{}',

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- GRANT REPORTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS grant_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID NOT NULL REFERENCES nonprofit_grants(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,

  -- Report details
  report_type TEXT NOT NULL CHECK (report_type IN ('quarterly', 'annual', 'final', 'interim', 'custom')),
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  submitted_date DATE,

  -- Data
  enrollment_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  placement_count INTEGER DEFAULT 0,
  average_wage DECIMAL(10,2),
  retention_rate DECIMAL(5,2),

  -- Narrative sections
  narrative_summary TEXT,
  challenges_encountered TEXT,
  success_stories TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'submitted', 'accepted', 'revision_requested')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- EMPLOYER CONNECTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_employer_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,

  -- Employer info
  employer_name TEXT NOT NULL,
  employer_id UUID, -- Link to employers table if exists
  industry TEXT,
  company_size TEXT,
  location TEXT,

  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_title TEXT,

  -- Relationship
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'outreach', 'engaged', 'partner', 'inactive')),
  partnership_type TEXT CHECK (partnership_type IN ('hiring', 'mentorship', 'sponsorship', 'advisory', 'multiple')),

  -- Activity
  last_contact_date DATE,
  next_follow_up_date DATE,
  notes TEXT,

  -- Metrics
  participants_placed INTEGER DEFAULT 0,
  participants_interviewed INTEGER DEFAULT 0,
  average_wage_placed DECIMAL(10,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- COALITIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_coalitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  description TEXT,
  region TEXT NOT NULL,

  -- Focus areas
  focus_areas TEXT[] DEFAULT '{}',
  target_populations TEXT[] DEFAULT '{}',

  -- Lead organization
  lead_organization_id UUID REFERENCES nonprofit_partners(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 1,

  -- Activity
  active_grants TEXT[] DEFAULT '{}',
  shared_programs TEXT[] DEFAULT '{}',

  -- Status
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'dormant', 'dissolved')),

  -- Timestamps
  formed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- COALITION MEMBERSHIPS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS coalition_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coalition_id UUID NOT NULL REFERENCES nonprofit_coalitions(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,

  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member', 'observer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  data_share_consent BOOLEAN DEFAULT false,
  consent_date DATE,

  UNIQUE(coalition_id, partner_id)
);

-- ===========================================
-- SUCCESS STORIES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS nonprofit_success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofit_partners(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES nonprofit_participants(id) ON DELETE SET NULL,

  -- Story content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_story TEXT,

  -- Metrics highlighted
  wage_increase DECIMAL(10,2),
  outcome_type TEXT CHECK (outcome_type IN ('placement', 'credential', 'promotion', 'entrepreneurship', 'other')),

  -- Media
  photo_url TEXT,
  video_url TEXT,

  -- Permissions
  has_consent BOOLEAN DEFAULT false,
  consent_date DATE,
  can_use_externally BOOLEAN DEFAULT false,

  -- Usage tracking
  used_in_reports TEXT[] DEFAULT '{}',
  used_in_marketing BOOLEAN DEFAULT false,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_nonprofit_partners_user_id ON nonprofit_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_partners_status ON nonprofit_partners(status);
CREATE INDEX IF NOT EXISTS idx_nonprofit_partners_tier ON nonprofit_partners(tier);

CREATE INDEX IF NOT EXISTS idx_nonprofit_programs_partner_id ON nonprofit_programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_programs_status ON nonprofit_programs(status);

CREATE INDEX IF NOT EXISTS idx_nonprofit_participants_partner_id ON nonprofit_participants(partner_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_participants_program_id ON nonprofit_participants(program_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_participants_status ON nonprofit_participants(status);

CREATE INDEX IF NOT EXISTS idx_participant_milestones_participant_id ON participant_milestones(participant_id);

CREATE INDEX IF NOT EXISTS idx_nonprofit_grants_partner_id ON nonprofit_grants(partner_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_grants_status ON nonprofit_grants(status);

CREATE INDEX IF NOT EXISTS idx_grant_reports_grant_id ON grant_reports(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_reports_partner_id ON grant_reports(partner_id);

CREATE INDEX IF NOT EXISTS idx_nonprofit_employer_connections_partner_id ON nonprofit_employer_connections(partner_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_employer_connections_status ON nonprofit_employer_connections(status);

CREATE INDEX IF NOT EXISTS idx_coalition_memberships_coalition_id ON coalition_memberships(coalition_id);
CREATE INDEX IF NOT EXISTS idx_coalition_memberships_partner_id ON coalition_memberships(partner_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================
ALTER TABLE nonprofit_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_employer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_coalitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coalition_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_success_stories ENABLE ROW LEVEL SECURITY;

-- Partners can manage their own data
CREATE POLICY "Partners can view own profile" ON nonprofit_partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own profile" ON nonprofit_partners
  FOR UPDATE USING (auth.uid() = user_id);

-- Programs policies
CREATE POLICY "Partners can manage own programs" ON nonprofit_programs
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can view active programs" ON nonprofit_programs
  FOR SELECT USING (status = 'active');

-- Participants policies (sensitive - only partner access)
CREATE POLICY "Partners can manage own participants" ON nonprofit_participants
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

-- Milestones policies
CREATE POLICY "Partners can manage participant milestones" ON participant_milestones
  FOR ALL USING (
    participant_id IN (
      SELECT p.id FROM nonprofit_participants p
      JOIN nonprofit_partners np ON p.partner_id = np.id
      WHERE np.user_id = auth.uid()
    )
  );

-- Grants policies
CREATE POLICY "Partners can manage own grants" ON nonprofit_grants
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

-- Grant reports policies
CREATE POLICY "Partners can manage own grant reports" ON grant_reports
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

-- Employer connections policies
CREATE POLICY "Partners can manage own employer connections" ON nonprofit_employer_connections
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

-- Coalition policies
CREATE POLICY "Anyone can view active coalitions" ON nonprofit_coalitions
  FOR SELECT USING (status = 'active');

CREATE POLICY "Lead org can manage coalition" ON nonprofit_coalitions
  FOR ALL USING (
    lead_organization_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

-- Coalition membership policies
CREATE POLICY "Partners can view memberships" ON coalition_memberships
  FOR SELECT USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
    OR coalition_id IN (
      SELECT id FROM nonprofit_coalitions
      WHERE lead_organization_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
    )
  );

-- Success stories policies
CREATE POLICY "Partners can manage own success stories" ON nonprofit_success_stories
  FOR ALL USING (
    partner_id IN (SELECT id FROM nonprofit_partners WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can view published stories" ON nonprofit_success_stories
  FOR SELECT USING (status = 'published' AND can_use_externally = true);

-- ===========================================
-- TRIGGERS
-- ===========================================
CREATE OR REPLACE FUNCTION update_nonprofit_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nonprofit_partners_updated_at
  BEFORE UPDATE ON nonprofit_partners
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_programs_updated_at
  BEFORE UPDATE ON nonprofit_programs
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_participants_updated_at
  BEFORE UPDATE ON nonprofit_participants
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_grants_updated_at
  BEFORE UPDATE ON nonprofit_grants
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER grant_reports_updated_at
  BEFORE UPDATE ON grant_reports
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_employer_connections_updated_at
  BEFORE UPDATE ON nonprofit_employer_connections
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_coalitions_updated_at
  BEFORE UPDATE ON nonprofit_coalitions
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

CREATE TRIGGER nonprofit_success_stories_updated_at
  BEFORE UPDATE ON nonprofit_success_stories
  FOR EACH ROW EXECUTE FUNCTION update_nonprofit_updated_at();

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Calculate participant journey metrics for a partner
CREATE OR REPLACE FUNCTION get_nonprofit_participant_metrics(p_partner_id UUID)
RETURNS TABLE (
  total_participants BIGINT,
  active_participants BIGINT,
  completed_count BIGINT,
  placed_count BIGINT,
  retained_count BIGINT,
  completion_rate DECIMAL,
  placement_rate DECIMAL,
  avg_wage_increase DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_participants,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_participants,
    COUNT(*) FILTER (WHERE status IN ('completed', 'placed', 'retained'))::BIGINT as completed_count,
    COUNT(*) FILTER (WHERE status IN ('placed', 'retained'))::BIGINT as placed_count,
    COUNT(*) FILTER (WHERE status = 'retained')::BIGINT as retained_count,
    CASE WHEN COUNT(*) > 0
      THEN (COUNT(*) FILTER (WHERE status IN ('completed', 'placed', 'retained'))::DECIMAL / COUNT(*)::DECIMAL * 100)
      ELSE 0
    END as completion_rate,
    CASE WHEN COUNT(*) FILTER (WHERE status IN ('completed', 'placed', 'retained')) > 0
      THEN (COUNT(*) FILTER (WHERE status IN ('placed', 'retained'))::DECIMAL / COUNT(*) FILTER (WHERE status IN ('completed', 'placed', 'retained'))::DECIMAL * 100)
      ELSE 0
    END as placement_rate,
    COALESCE(AVG(placed_wage_hourly - prior_wage_hourly) FILTER (WHERE placed_wage_hourly IS NOT NULL AND prior_wage_hourly IS NOT NULL), 0) as avg_wage_increase
  FROM nonprofit_participants
  WHERE partner_id = p_partner_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate grant progress
CREATE OR REPLACE FUNCTION get_grant_progress(p_grant_id UUID)
RETURNS TABLE (
  enrollment_progress DECIMAL,
  placement_progress DECIMAL,
  days_remaining INTEGER,
  spending_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE WHEN target_enrollment > 0
      THEN (actual_enrollment::DECIMAL / target_enrollment::DECIMAL * 100)
      ELSE 0
    END as enrollment_progress,
    CASE WHEN target_placements > 0
      THEN (actual_placements::DECIMAL / target_placements::DECIMAL * 100)
      ELSE 0
    END as placement_progress,
    CASE WHEN end_date IS NOT NULL
      THEN EXTRACT(DAY FROM (end_date - CURRENT_DATE))::INTEGER
      ELSE NULL
    END as days_remaining,
    CASE WHEN award_amount > 0
      THEN (disbursed_amount / award_amount * 100)
      ELSE 0
    END as spending_rate
  FROM nonprofit_grants
  WHERE id = p_grant_id;
END;
$$ LANGUAGE plpgsql;
