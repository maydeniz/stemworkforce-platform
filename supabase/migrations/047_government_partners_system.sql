-- ===========================================
-- Government Partners System
-- Federal Agencies, State Workforce Boards, CHIPS Act Programs
-- ===========================================

-- ===========================================
-- GOVERNMENT PARTNERS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.government_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  agency_type TEXT NOT NULL CHECK (agency_type IN ('federal', 'state_workforce', 'economic_development', 'education', 'other')),
  agency_level TEXT NOT NULL CHECK (agency_level IN ('federal', 'state', 'regional', 'local')),
  agency_code TEXT,

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT,

  -- Partnership details
  tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'partner', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),

  -- Contact info
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_title TEXT,

  -- Organization details
  jurisdiction TEXT,
  covered_population INTEGER,
  annual_budget DECIMAL(15, 2),

  -- Billing
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'past_due', 'cancelled', 'trialing')),

  -- Timestamps
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- WORKFORCE PROGRAMS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.workforce_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  program_type TEXT NOT NULL CHECK (program_type IN ('chips_act', 'wioa', 'nsf_ate', 'dol_eta', 'state_grant', 'regional', 'cte', 'apprenticeship', 'other')),
  description TEXT,

  -- Funding details
  funding_source TEXT NOT NULL CHECK (funding_source IN ('federal', 'state', 'regional', 'local', 'mixed', 'private')),
  grant_number TEXT,
  total_budget DECIMAL(15, 2) NOT NULL DEFAULT 0,
  spent_to_date DECIMAL(15, 2) NOT NULL DEFAULT 0,
  budget_remaining DECIMAL(15, 2) GENERATED ALWAYS AS (total_budget - spent_to_date) STORED,

  -- Timeline
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reporting_deadlines DATE[],

  -- Targets
  enrollment_target INTEGER NOT NULL DEFAULT 0,
  placement_target DECIMAL(5, 2) NOT NULL DEFAULT 0, -- percentage
  wage_gain_target DECIMAL(10, 2),

  -- Current metrics
  current_enrollment INTEGER NOT NULL DEFAULT 0,
  completed_count INTEGER NOT NULL DEFAULT 0,
  placed_count INTEGER NOT NULL DEFAULT 0,
  average_wage_gain DECIMAL(10, 2),

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'planning', 'active', 'reporting', 'completed', 'archived')),
  milestone_progress INTEGER NOT NULL DEFAULT 0 CHECK (milestone_progress >= 0 AND milestone_progress <= 100),
  compliance_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (compliance_status IN ('compliant', 'at_risk', 'non_compliant', 'pending_review')),
  last_report_date DATE,
  next_report_due DATE,

  -- Industry focus
  industry_focus TEXT[],
  occupation_codes TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- PROGRAM PARTICIPANTS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.program_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.workforce_programs(id) ON DELETE CASCADE,

  -- Participant info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,

  -- Demographics
  zip_code TEXT,
  county TEXT,
  veteran_status BOOLEAN NOT NULL DEFAULT FALSE,
  disability_status BOOLEAN NOT NULL DEFAULT FALSE,
  barriers TEXT[] NOT NULL DEFAULT '{}',

  -- Education
  education_level TEXT,
  prior_credentials TEXT[],

  -- Employment at enrollment
  employed_at_enrollment BOOLEAN NOT NULL DEFAULT FALSE,
  prior_wage DECIMAL(10, 2),
  prior_occupation TEXT,
  unemployment_duration INTEGER, -- weeks

  -- Program tracking
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'active', 'completed', 'placed', 'exited', 'withdrawn')),
  enrollment_date DATE NOT NULL,
  exit_date DATE,
  completion_date DATE,

  -- Training
  training_hours_completed INTEGER NOT NULL DEFAULT 0,
  credentials_earned TEXT[] NOT NULL DEFAULT '{}',
  skills_gained TEXT[] NOT NULL DEFAULT '{}',

  -- Placement
  placed BOOLEAN NOT NULL DEFAULT FALSE,
  placement_date DATE,
  placement_employer TEXT,
  placement_occupation TEXT,
  placement_wage DECIMAL(10, 2),
  retained_at_90_days BOOLEAN,
  retained_at_180_days BOOLEAN,

  -- Calculated metrics
  wage_gain DECIMAL(10, 2),
  wage_gain_percent DECIMAL(5, 2),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- EMPLOYER PARTNERSHIPS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.employer_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.workforce_programs(id) ON DELETE SET NULL,

  -- Employer info
  employer_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  naics_code TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,

  -- Partnership details
  commitment_types TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'prospecting' CHECK (status IN ('prospecting', 'negotiating', 'active', 'completed', 'inactive')),

  -- Hiring commitments
  hiring_pledge_count INTEGER,
  hired_to_date INTEGER NOT NULL DEFAULT 0,
  wage_commitment DECIMAL(10, 2),

  -- OJT/Apprenticeship
  ojt_slots_offered INTEGER,
  ojt_slots_used INTEGER NOT NULL DEFAULT 0,
  apprenticeship_slots INTEGER,

  -- Agreement details
  agreement_start_date DATE,
  agreement_end_date DATE,
  moa_signed_date DATE,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- COMPLIANCE REPORTS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.workforce_programs(id) ON DELETE CASCADE,

  -- Report details
  report_type TEXT NOT NULL CHECK (report_type IN ('quarterly', 'annual', 'mid_year', 'final', 'ad_hoc')),
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'pending_review', 'submitted', 'accepted', 'rejected')),
  submitted_date DATE,
  accepted_date DATE,
  rejection_reason TEXT,

  -- Data summary
  enrollment_count INTEGER NOT NULL DEFAULT 0,
  completion_count INTEGER NOT NULL DEFAULT 0,
  placement_count INTEGER NOT NULL DEFAULT 0,
  placement_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  average_wage_at_placement DECIMAL(10, 2),
  average_wage_gain DECIMAL(10, 2),
  expenditures_reported DECIMAL(15, 2) NOT NULL DEFAULT 0,

  -- Veterans tracking
  veterans_enrolled INTEGER NOT NULL DEFAULT 0,
  veterans_placed INTEGER NOT NULL DEFAULT 0,

  -- Prepared by
  prepared_by TEXT NOT NULL,
  reviewed_by TEXT,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- REGIONAL LABOR DATA TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.regional_labor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  state TEXT NOT NULL,
  data_date DATE NOT NULL,

  -- Supply metrics
  labor_force_size INTEGER NOT NULL,
  unemployment_rate DECIMAL(5, 2) NOT NULL,
  stem_workforce INTEGER,
  stem_unemployment_rate DECIMAL(5, 2),

  -- Demand metrics
  job_openings INTEGER NOT NULL DEFAULT 0,
  stem_job_openings INTEGER NOT NULL DEFAULT 0,
  hard_to_fill_positions INTEGER NOT NULL DEFAULT 0,

  -- Wage data
  median_wage DECIMAL(10, 2) NOT NULL,
  stem_median_wage DECIMAL(10, 2),
  wage_growth_yoy DECIMAL(5, 2),

  -- Industry breakdown (JSONB for flexibility)
  top_industries JSONB NOT NULL DEFAULT '[]',
  top_occupations JSONB NOT NULL DEFAULT '[]',
  top_skills TEXT[] NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint to prevent duplicate data for same region/date
  UNIQUE (partner_id, region, state, data_date)
);

-- ===========================================
-- ECONOMIC IMPACT METRICS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.economic_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.government_partners(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.workforce_programs(id) ON DELETE SET NULL,
  reporting_period TEXT NOT NULL,

  -- Direct impacts
  total_wages_generated DECIMAL(15, 2) NOT NULL DEFAULT 0,
  average_wage_gain_per_participant DECIMAL(10, 2) NOT NULL DEFAULT 0,
  jobs_created INTEGER NOT NULL DEFAULT 0,
  jobs_retained INTEGER NOT NULL DEFAULT 0,

  -- Tax impacts
  estimated_tax_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
  federal_tax_impact DECIMAL(15, 2) NOT NULL DEFAULT 0,
  state_tax_impact DECIMAL(15, 2) NOT NULL DEFAULT 0,
  local_tax_impact DECIMAL(15, 2) NOT NULL DEFAULT 0,

  -- Economic multipliers
  economic_multiplier DECIMAL(5, 2) NOT NULL DEFAULT 1,
  total_economic_impact DECIMAL(15, 2) NOT NULL DEFAULT 0,

  -- ROI
  program_costs DECIMAL(15, 2) NOT NULL DEFAULT 0,
  roi_ratio DECIMAL(5, 2) NOT NULL DEFAULT 0,
  cost_per_placement DECIMAL(10, 2),
  cost_per_credential DECIMAL(10, 2),

  -- Public assistance reduction
  public_assistance_reduction DECIMAL(15, 2),

  -- Timestamps
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Government Partners indexes
CREATE INDEX IF NOT EXISTS idx_government_partners_user_id ON public.government_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_government_partners_status ON public.government_partners(status);
CREATE INDEX IF NOT EXISTS idx_government_partners_tier ON public.government_partners(tier);
CREATE INDEX IF NOT EXISTS idx_government_partners_agency_type ON public.government_partners(agency_type);
CREATE INDEX IF NOT EXISTS idx_government_partners_state ON public.government_partners(state);

-- Workforce Programs indexes
CREATE INDEX IF NOT EXISTS idx_workforce_programs_partner_id ON public.workforce_programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_workforce_programs_status ON public.workforce_programs(status);
CREATE INDEX IF NOT EXISTS idx_workforce_programs_program_type ON public.workforce_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_workforce_programs_compliance ON public.workforce_programs(compliance_status);
CREATE INDEX IF NOT EXISTS idx_workforce_programs_next_report ON public.workforce_programs(next_report_due);

-- Program Participants indexes
CREATE INDEX IF NOT EXISTS idx_program_participants_partner_id ON public.program_participants(partner_id);
CREATE INDEX IF NOT EXISTS idx_program_participants_program_id ON public.program_participants(program_id);
CREATE INDEX IF NOT EXISTS idx_program_participants_status ON public.program_participants(status);
CREATE INDEX IF NOT EXISTS idx_program_participants_veteran ON public.program_participants(veteran_status);
CREATE INDEX IF NOT EXISTS idx_program_participants_placed ON public.program_participants(placed);
CREATE INDEX IF NOT EXISTS idx_program_participants_enrollment_date ON public.program_participants(enrollment_date);

-- Employer Partnerships indexes
CREATE INDEX IF NOT EXISTS idx_employer_partnerships_partner_id ON public.employer_partnerships(partner_id);
CREATE INDEX IF NOT EXISTS idx_employer_partnerships_program_id ON public.employer_partnerships(program_id);
CREATE INDEX IF NOT EXISTS idx_employer_partnerships_status ON public.employer_partnerships(status);
CREATE INDEX IF NOT EXISTS idx_employer_partnerships_industry ON public.employer_partnerships(industry);

-- Compliance Reports indexes
CREATE INDEX IF NOT EXISTS idx_compliance_reports_partner_id ON public.compliance_reports(partner_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_program_id ON public.compliance_reports(program_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON public.compliance_reports(status);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_due_date ON public.compliance_reports(due_date);

-- Regional Labor Data indexes
CREATE INDEX IF NOT EXISTS idx_regional_labor_data_partner_id ON public.regional_labor_data(partner_id);
CREATE INDEX IF NOT EXISTS idx_regional_labor_data_region ON public.regional_labor_data(region, state);
CREATE INDEX IF NOT EXISTS idx_regional_labor_data_date ON public.regional_labor_data(data_date);

-- Economic Impact indexes
CREATE INDEX IF NOT EXISTS idx_economic_impact_partner_id ON public.economic_impact_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_economic_impact_program_id ON public.economic_impact_metrics(program_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE public.government_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workforce_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_labor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_impact_metrics ENABLE ROW LEVEL SECURITY;

-- Government Partners policies
CREATE POLICY "Users can view own government partner profile"
  ON public.government_partners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own government partner profile"
  ON public.government_partners FOR ALL
  USING (auth.uid() = user_id);

-- Workforce Programs policies
CREATE POLICY "Partners can view own programs"
  ON public.workforce_programs FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own programs"
  ON public.workforce_programs FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- Program Participants policies
CREATE POLICY "Partners can view own participants"
  ON public.program_participants FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own participants"
  ON public.program_participants FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- Employer Partnerships policies
CREATE POLICY "Partners can view own employer partnerships"
  ON public.employer_partnerships FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own employer partnerships"
  ON public.employer_partnerships FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- Compliance Reports policies
CREATE POLICY "Partners can view own compliance reports"
  ON public.compliance_reports FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own compliance reports"
  ON public.compliance_reports FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- Regional Labor Data policies
CREATE POLICY "Partners can view own regional data"
  ON public.regional_labor_data FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own regional data"
  ON public.regional_labor_data FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- Economic Impact policies
CREATE POLICY "Partners can view own economic impact data"
  ON public.economic_impact_metrics FOR SELECT
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners can manage own economic impact data"
  ON public.economic_impact_metrics FOR ALL
  USING (partner_id IN (SELECT id FROM public.government_partners WHERE user_id = auth.uid()));

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE TRIGGER update_government_partners_updated_at
  BEFORE UPDATE ON public.government_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workforce_programs_updated_at
  BEFORE UPDATE ON public.workforce_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_participants_updated_at
  BEFORE UPDATE ON public.program_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_partnerships_updated_at
  BEFORE UPDATE ON public.employer_partnerships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_reports_updated_at
  BEFORE UPDATE ON public.compliance_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regional_labor_data_updated_at
  BEFORE UPDATE ON public.regional_labor_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_economic_impact_updated_at
  BEFORE UPDATE ON public.economic_impact_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to get program performance metrics
CREATE OR REPLACE FUNCTION get_program_performance_metrics(p_partner_id UUID)
RETURNS TABLE (
  program_id UUID,
  program_name TEXT,
  program_type TEXT,
  status TEXT,
  enrollment_progress DECIMAL,
  placement_rate DECIMAL,
  compliance_status TEXT,
  days_until_deadline INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wp.id,
    wp.name,
    wp.program_type,
    wp.status,
    CASE WHEN wp.enrollment_target > 0
      THEN ROUND((wp.current_enrollment::DECIMAL / wp.enrollment_target) * 100, 1)
      ELSE 0
    END as enrollment_progress,
    CASE WHEN wp.completed_count > 0
      THEN ROUND((wp.placed_count::DECIMAL / wp.completed_count) * 100, 1)
      ELSE 0
    END as placement_rate,
    wp.compliance_status,
    CASE WHEN wp.next_report_due IS NOT NULL
      THEN (wp.next_report_due - CURRENT_DATE)::INTEGER
      ELSE NULL
    END as days_until_deadline
  FROM public.workforce_programs wp
  WHERE wp.partner_id = p_partner_id
  ORDER BY wp.next_report_due NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard summary metrics
CREATE OR REPLACE FUNCTION get_government_dashboard_metrics(p_partner_id UUID)
RETURNS TABLE (
  active_programs INTEGER,
  total_enrolled INTEGER,
  total_placed INTEGER,
  overall_placement_rate DECIMAL,
  veterans_enrolled INTEGER,
  veterans_placed INTEGER,
  active_employers INTEGER,
  upcoming_reports INTEGER,
  overdue_reports INTEGER,
  total_economic_impact DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.workforce_programs WHERE partner_id = p_partner_id AND status = 'active'),
    (SELECT COALESCE(SUM(current_enrollment), 0)::INTEGER FROM public.workforce_programs WHERE partner_id = p_partner_id),
    (SELECT COALESCE(SUM(placed_count), 0)::INTEGER FROM public.workforce_programs WHERE partner_id = p_partner_id),
    (SELECT CASE WHEN SUM(completed_count) > 0
      THEN ROUND((SUM(placed_count)::DECIMAL / SUM(completed_count)) * 100, 1)
      ELSE 0 END
    FROM public.workforce_programs WHERE partner_id = p_partner_id),
    (SELECT COUNT(*)::INTEGER FROM public.program_participants WHERE partner_id = p_partner_id AND veteran_status = TRUE),
    (SELECT COUNT(*)::INTEGER FROM public.program_participants WHERE partner_id = p_partner_id AND veteran_status = TRUE AND placed = TRUE),
    (SELECT COUNT(*)::INTEGER FROM public.employer_partnerships WHERE partner_id = p_partner_id AND status = 'active'),
    (SELECT COUNT(*)::INTEGER FROM public.compliance_reports WHERE partner_id = p_partner_id AND due_date > CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '30 days' AND status != 'submitted' AND status != 'accepted'),
    (SELECT COUNT(*)::INTEGER FROM public.compliance_reports WHERE partner_id = p_partner_id AND due_date < CURRENT_DATE AND status != 'submitted' AND status != 'accepted'),
    (SELECT COALESCE(SUM(total_economic_impact), 0) FROM public.economic_impact_metrics WHERE partner_id = p_partner_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE public.government_partners IS 'Government agency partner accounts for workforce development programs';
COMMENT ON TABLE public.workforce_programs IS 'Workforce development programs (CHIPS Act, WIOA, etc.)';
COMMENT ON TABLE public.program_participants IS 'Participants enrolled in workforce programs';
COMMENT ON TABLE public.employer_partnerships IS 'Employer partnerships for hiring pledges and OJT';
COMMENT ON TABLE public.compliance_reports IS 'Compliance reports for federal/state grant requirements';
COMMENT ON TABLE public.regional_labor_data IS 'Regional labor market intelligence data';
COMMENT ON TABLE public.economic_impact_metrics IS 'Economic impact calculations and ROI metrics';
