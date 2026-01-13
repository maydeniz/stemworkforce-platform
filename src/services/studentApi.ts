// ===========================================
// Student Platform API Service Layer
// Complete backend integration for all student pages
// ===========================================

import { supabase } from '@/lib/supabase';

// ===========================================
// Types
// ===========================================

export interface StudentProfile {
  id: string;
  user_id: string;
  gpa_unweighted: number | null;
  gpa_weighted: number | null;
  sat_total: number | null;
  sat_math: number | null;
  sat_reading: number | null;
  act_composite: number | null;
  act_math: number | null;
  act_english: number | null;
  act_reading: number | null;
  act_science: number | null;
  graduation_year: number | null;
  current_grade: string | null;
  high_school_name: string | null;
  high_school_type: string | null;
  citizenship: string | null;
  ethnicity: string[] | null;
  first_generation: boolean | null;
  military_affiliation: string | null;
  disability_status: boolean | null;
  household_income_range: string | null;
  household_size: number | null;
  number_in_college: number | null;
  state_of_residence: string | null;
  zip_code: string | null;
  intended_majors: string[] | null;
  career_interests: string[] | null;
  extracurriculars: string[] | null;
  preferred_college_size: string | null;
  preferred_setting: string | null;
  preferred_regions: string[] | null;
  max_distance_from_home: number | null;
  profile_completeness: number;
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  amount_min: number | null;
  amount_max: number | null;
  deadline_date: string | null;
  application_url: string | null;
  min_gpa: number | null;
  min_sat: number | null;
  min_act: number | null;
  grade_levels: string[] | null;
  citizenship_requirements: string[] | null;
  ethnicity_requirements: string[] | null;
  gender_requirements: string | null;
  states: string[] | null;
  majors: string[] | null;
  income_cap: number | null;
  need_based: boolean;
  merit_based: boolean;
  first_generation_required: boolean;
  military_affiliation: string[] | null;
  essay_required: boolean;
  recommendations_required: number;
  is_stem: boolean;
  is_renewable: boolean;
  renewable_conditions: string | null;
  competitiveness: string | null;
  tags: string[] | null;
  active: boolean;
  created_at: string;
}

export interface ScholarshipMatch {
  scholarship_id: string;
  match_score: number;
  eligibility_status: 'eligible' | 'likely' | 'possible' | 'ineligible';
  match_factors: Record<string, boolean>;
  scholarship?: Scholarship;
}

export interface College {
  id: string;
  name: string;
  ipeds_id: string | null;
  city: string;
  state: string;
  region: string;
  type: string;
  setting: string;
  size_category: string;
  total_enrollment: number | null;
  acceptance_rate: number | null;
  sat_avg: number | null;
  sat_math_avg: number | null;
  sat_reading_avg: number | null;
  act_avg: number | null;
  in_state_tuition: number;
  out_of_state_tuition: number;
  room_and_board: number;
  books_supplies: number;
  personal_expenses: number;
  transportation: number;
  avg_net_price: number | null;
  avg_net_price_0_30k: number | null;
  avg_net_price_30_48k: number | null;
  avg_net_price_48_75k: number | null;
  avg_net_price_75_110k: number | null;
  avg_net_price_110k_plus: number | null;
  graduation_rate_4yr: number | null;
  graduation_rate_6yr: number | null;
  retention_rate: number | null;
  stem_focus: boolean;
  top_majors: string[] | null;
  avg_starting_salary: number | null;
  avg_mid_career_salary: number | null;
  pct_receiving_aid: number | null;
  avg_debt_at_graduation: number | null;
  default_rate: number | null;
  ranking_national: number | null;
  ranking_stem: number | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  campus_life: Record<string, unknown> | null;
  created_at: string;
}

export interface CollegeMatch {
  college_id: string;
  fit_score: number;
  admission_chance: 'safety' | 'target' | 'reach' | 'far_reach';
  fit_factors: Record<string, number>;
  estimated_net_price: number;
  college?: College;
}

export interface SavedScholarship {
  id: string;
  user_id: string;
  scholarship_id: string;
  notes: string | null;
  status: 'saved' | 'applying' | 'submitted' | 'awarded' | 'rejected';
  deadline_reminder: boolean;
  created_at: string;
  scholarship?: Scholarship;
}

export interface SavedCollege {
  id: string;
  user_id: string;
  college_id: string;
  notes: string | null;
  interest_level: number;
  visited: boolean;
  created_at: string;
  college?: College;
}

export interface CollegeApplication {
  id: string;
  user_id: string;
  college_id: string;
  application_type: string;
  status: string;
  deadline_date: string | null;
  submitted_date: string | null;
  decision_date: string | null;
  decision: string | null;
  notes: string | null;
  created_at: string;
  college?: College;
}

export interface AwardLetter {
  id: string;
  user_id: string;
  college_name: string;
  academic_year: string;
  cost_of_attendance: number;
  grants_scholarships: number;
  loans: number;
  work_study: number;
  net_price: number;
  analysis_score: number | null;
  raw_data: Record<string, unknown> | null;
  analysis_results: Record<string, unknown> | null;
  created_at: string;
}

export interface StudentLoan {
  id: string;
  user_id: string;
  loan_name: string;
  loan_type: string;
  servicer: string | null;
  principal: number;
  current_balance: number;
  interest_rate: number;
  origination_date: string | null;
  repayment_start: string | null;
  monthly_payment: number | null;
  status: string;
  created_at: string;
}

export interface CareerPath {
  id: string;
  title: string;
  field: string;
  description: string | null;
  salary_entry: number | null;
  salary_mid: number | null;
  salary_senior: number | null;
  growth_rate: number | null;
  job_openings: number | null;
  education_required: string | null;
  certifications: string[] | null;
  skills_required: string[] | null;
  automation_risk: string | null;
  job_satisfaction: number | null;
  work_life_balance: number | null;
  remote_friendly: boolean;
  typical_employers: string[] | null;
  career_progression: string[] | null;
  related_majors: string[] | null;
  is_stem: boolean;
  created_at: string;
}

export interface STEMFundingProgram {
  id: string;
  name: string;
  agency: string;
  program_type: string;
  description: string | null;
  funding_amount_min: number | null;
  funding_amount_max: number | null;
  duration_months: number | null;
  deadline_date: string | null;
  eligibility_requirements: string | null;
  fields_supported: string[] | null;
  citizenship_required: boolean;
  security_clearance: boolean;
  application_url: string | null;
  service_commitment: string | null;
  active: boolean;
  created_at: string;
}

// ===========================================
// Student Profile API
// ===========================================

export const studentProfileApi = {
  // Get current user's profile
  async getProfile(): Promise<StudentProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  },

  // Create or update profile
  async upsertProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_profiles')
      .upsert({
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update specific profile fields
  async updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ===========================================
// Scholarships API
// ===========================================

export const scholarshipsApi = {
  // Get all active scholarships
  async list(filters?: {
    is_stem?: boolean;
    need_based?: boolean;
    merit_based?: boolean;
    min_amount?: number;
    max_amount?: number;
    deadline_after?: string;
    grade_level?: string;
    search?: string;
  }): Promise<Scholarship[]> {
    let query = supabase
      .from('scholarships')
      .select('*')
      .eq('active', true);

    if (filters?.is_stem) query = query.eq('is_stem', true);
    if (filters?.need_based) query = query.eq('need_based', true);
    if (filters?.merit_based) query = query.eq('merit_based', true);
    if (filters?.min_amount) query = query.gte('amount_max', filters.min_amount);
    if (filters?.max_amount) query = query.lte('amount_min', filters.max_amount);
    if (filters?.deadline_after) query = query.gte('deadline_date', filters.deadline_after);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query.order('deadline_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get single scholarship
  async get(id: string): Promise<Scholarship | null> {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get scholarship matches for user
  async getMatches(profileData?: Partial<StudentProfile>): Promise<ScholarshipMatch[]> {
    const { data: { user } } = await supabase.auth.getUser();

    // Call the edge function
    const { data, error } = await supabase.functions.invoke('scholarship-matcher', {
      body: {
        user_id: user?.id,
        profile_data: profileData,
      },
    });

    if (error) throw error;
    return data?.matches || [];
  },

  // Save a scholarship
  async saveScholarship(scholarshipId: string, notes?: string): Promise<SavedScholarship> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_scholarships')
      .upsert({
        user_id: user.id,
        scholarship_id: scholarshipId,
        notes,
        status: 'saved',
      })
      .select('*, scholarship:scholarships(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Get saved scholarships
  async getSavedScholarships(): Promise<SavedScholarship[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_scholarships')
      .select('*, scholarship:scholarships(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update saved scholarship status
  async updateSavedScholarship(
    id: string,
    updates: { status?: string; notes?: string }
  ): Promise<SavedScholarship> {
    const { data, error } = await supabase
      .from('saved_scholarships')
      .update(updates)
      .eq('id', id)
      .select('*, scholarship:scholarships(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Remove saved scholarship
  async removeSavedScholarship(scholarshipId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_scholarships')
      .delete()
      .eq('user_id', user.id)
      .eq('scholarship_id', scholarshipId);

    if (error) throw error;
  },
};

// ===========================================
// Colleges API
// ===========================================

export const collegesApi = {
  // Get all colleges
  async list(filters?: {
    stem_focus?: boolean;
    type?: string;
    region?: string;
    state?: string;
    min_acceptance_rate?: number;
    max_tuition?: number;
    search?: string;
  }): Promise<College[]> {
    let query = supabase.from('colleges').select('*');

    if (filters?.stem_focus) query = query.eq('stem_focus', true);
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.region) query = query.eq('region', filters.region);
    if (filters?.state) query = query.eq('state', filters.state);
    if (filters?.min_acceptance_rate) query = query.gte('acceptance_rate', filters.min_acceptance_rate);
    if (filters?.max_tuition) query = query.lte('out_of_state_tuition', filters.max_tuition);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query.order('ranking_national', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  // Get single college
  async get(id: string): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get college matches
  async getMatches(profileData?: Partial<StudentProfile>): Promise<{
    safety: CollegeMatch[];
    target: CollegeMatch[];
    reach: CollegeMatch[];
    all: CollegeMatch[];
  }> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.functions.invoke('college-matcher', {
      body: {
        user_id: user?.id,
        profile_data: profileData,
      },
    });

    if (error) throw error;
    return data?.matches || { safety: [], target: [], reach: [], all: [] };
  },

  // Save a college
  async saveCollege(collegeId: string, notes?: string): Promise<SavedCollege> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_colleges')
      .upsert({
        user_id: user.id,
        college_id: collegeId,
        notes,
        interest_level: 3,
        visited: false,
      })
      .select('*, college:colleges(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Get saved colleges
  async getSavedColleges(): Promise<SavedCollege[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_colleges')
      .select('*, college:colleges(*)')
      .eq('user_id', user.id)
      .order('interest_level', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update saved college
  async updateSavedCollege(
    id: string,
    updates: { notes?: string; interest_level?: number; visited?: boolean }
  ): Promise<SavedCollege> {
    const { data, error } = await supabase
      .from('saved_colleges')
      .update(updates)
      .eq('id', id)
      .select('*, college:colleges(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Remove saved college
  async removeSavedCollege(collegeId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_colleges')
      .delete()
      .eq('user_id', user.id)
      .eq('college_id', collegeId);

    if (error) throw error;
  },
};

// ===========================================
// Applications API
// ===========================================

export const applicationsApi = {
  // Get all applications
  async list(): Promise<CollegeApplication[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('college_applications')
      .select('*, college:colleges(*)')
      .eq('user_id', user.id)
      .order('deadline_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create application
  async create(application: {
    college_id: string;
    application_type: string;
    deadline_date?: string;
    notes?: string;
  }): Promise<CollegeApplication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('college_applications')
      .insert({
        ...application,
        user_id: user.id,
        status: 'not_started',
      })
      .select('*, college:colleges(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Update application
  async update(
    id: string,
    updates: {
      status?: string;
      submitted_date?: string;
      decision_date?: string;
      decision?: string;
      notes?: string;
    }
  ): Promise<CollegeApplication> {
    const { data, error } = await supabase
      .from('college_applications')
      .update(updates)
      .eq('id', id)
      .select('*, college:colleges(*)')
      .single();

    if (error) throw error;
    return data;
  },

  // Delete application
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('college_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Financial Aid API
// ===========================================

export const financialAidApi = {
  // Calculate net price for colleges
  async calculateNetPrice(financialProfile: {
    household_income: number;
    household_size: number;
    number_in_college: number;
    total_assets: number;
    parent_age: number;
    state_of_residence: string;
    filing_status: string;
  }, collegeIds?: string[]): Promise<{
    estimated_efc: number;
    estimates: Array<{
      college_id: string;
      college_name: string;
      cost_of_attendance: number;
      net_price: number;
      total_grants: number;
      total_loans: number;
      monthly_payment_10yr: number;
    }>;
  }> {
    const { data, error } = await supabase.functions.invoke('net-price-calculator', {
      body: {
        financial_profile: financialProfile,
        college_ids: collegeIds,
      },
    });

    if (error) throw error;
    return data;
  },

  // Analyze award letters
  async analyzeAwardLetters(awardLetters: Array<{
    college_name: string;
    academic_year: string;
    cost_of_attendance: {
      tuition: number;
      fees: number;
      room_and_board: number;
      books: number;
      personal: number;
      transportation: number;
      total: number;
    };
    awards: Array<{
      name: string;
      amount: number;
    }>;
  }>): Promise<{
    analyses: Array<{
      college_name: string;
      total_cost: number;
      total_free_money: number;
      total_loans: number;
      net_price: number;
      loan_debt_4yr: number;
      score: number;
      warnings: string[];
      recommendations: string[];
    }>;
    comparison: {
      best_value: string;
      lowest_net_price: string;
    };
  }> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.functions.invoke('award-letter-analyzer', {
      body: {
        user_id: user?.id,
        award_letters: awardLetters,
      },
    });

    if (error) throw error;
    return data;
  },

  // Get saved award letters
  async getAwardLetters(): Promise<AwardLetter[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('award_letters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Save award letter
  async saveAwardLetter(letter: Partial<AwardLetter>): Promise<AwardLetter> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('award_letters')
      .upsert({
        ...letter,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ===========================================
// Loans API
// ===========================================

export const loansApi = {
  // Get user's loans
  async list(): Promise<StudentLoan[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_loans')
      .select('*')
      .eq('user_id', user.id)
      .order('interest_rate', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add a loan
  async create(loan: Partial<StudentLoan>): Promise<StudentLoan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_loans')
      .insert({
        ...loan,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update loan
  async update(id: string, updates: Partial<StudentLoan>): Promise<StudentLoan> {
    const { data, error } = await supabase
      .from('student_loans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete loan
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_loans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Calculate repayment scenarios
  async calculateRepayment(params: {
    loans: Array<{
      name: string;
      principal: number;
      interest_rate: number;
      type: string;
    }>;
    monthly_income: number;
    monthly_payment_budget: number;
    repayment_strategy: string;
    income_driven_plan?: string;
    family_size?: number;
    compare_all?: boolean;
  }): Promise<{
    loan_summary: {
      total_principal: number;
      average_rate: number;
    };
    results: Array<{
      strategy_name: string;
      total_paid: number;
      total_interest: number;
      months_to_payoff: number;
      monthly_payment: number;
    }>;
    recommendations: {
      lowest_total_cost: string;
      fastest_payoff: string;
    };
  }> {
    const { data, error } = await supabase.functions.invoke('loan-calculator', {
      body: params,
    });

    if (error) throw error;
    return data;
  },
};

// ===========================================
// Career API
// ===========================================

export const careerApi = {
  // Get all career paths
  async list(filters?: {
    is_stem?: boolean;
    field?: string;
    min_salary?: number;
    growth_rate?: number;
    remote_friendly?: boolean;
    search?: string;
  }): Promise<CareerPath[]> {
    let query = supabase.from('career_paths').select('*');

    if (filters?.is_stem) query = query.eq('is_stem', true);
    if (filters?.field) query = query.eq('field', filters.field);
    if (filters?.min_salary) query = query.gte('salary_entry', filters.min_salary);
    if (filters?.growth_rate) query = query.gte('growth_rate', filters.growth_rate);
    if (filters?.remote_friendly) query = query.eq('remote_friendly', true);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

    const { data, error } = await query.order('salary_mid', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single career path
  async get(id: string): Promise<CareerPath | null> {
    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Calculate career ROI
  async calculateROI(inputs: Array<{
    career_path_id?: string;
    career_title?: string;
    total_education_cost: number;
    years_of_education: number;
    expected_starting_salary?: number;
    expected_mid_career_salary?: number;
    include_opportunity_cost?: boolean;
  }>): Promise<{
    results: Array<{
      career_title: string;
      total_investment: number;
      lifetime_earnings_30yr: number;
      net_lifetime_gain: number;
      roi_percentage: number;
      payback_period_years: number;
      monthly_loan_payment: number;
      debt_to_income_ratio: number;
      metrics: {
        roi_score: number;
        affordability_score: number;
        stability_score: number;
        overall_score: number;
      };
      recommendation: string;
    }>;
    comparison?: {
      best_roi: string;
      fastest_payback: string;
    };
  }> {
    const { data, error } = await supabase.functions.invoke('career-roi-calculator', {
      body: { inputs },
    });

    if (error) throw error;
    return data;
  },
};

// ===========================================
// STEM Funding API
// ===========================================

export const stemFundingApi = {
  // Get all funding programs
  async list(filters?: {
    agency?: string;
    program_type?: string;
    citizenship_required?: boolean;
    security_clearance?: boolean;
    min_amount?: number;
    search?: string;
  }): Promise<STEMFundingProgram[]> {
    let query = supabase
      .from('stem_funding_programs')
      .select('*')
      .eq('active', true);

    if (filters?.agency) query = query.eq('agency', filters.agency);
    if (filters?.program_type) query = query.eq('program_type', filters.program_type);
    if (filters?.citizenship_required !== undefined) query = query.eq('citizenship_required', filters.citizenship_required);
    if (filters?.security_clearance !== undefined) query = query.eq('security_clearance', filters.security_clearance);
    if (filters?.min_amount) query = query.gte('funding_amount_max', filters.min_amount);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query.order('funding_amount_max', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  // Get single program
  async get(id: string): Promise<STEMFundingProgram | null> {
    const { data, error } = await supabase
      .from('stem_funding_programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get funding by agency
  async getByAgency(): Promise<Record<string, STEMFundingProgram[]>> {
    const { data, error } = await supabase
      .from('stem_funding_programs')
      .select('*')
      .eq('active', true)
      .order('agency', { ascending: true });

    if (error) throw error;

    // Group by agency
    const byAgency: Record<string, STEMFundingProgram[]> = {};
    for (const program of data || []) {
      if (!byAgency[program.agency]) {
        byAgency[program.agency] = [];
      }
      byAgency[program.agency].push(program);
    }

    return byAgency;
  },
};

// ===========================================
// Export all APIs
// ===========================================

export const studentApi = {
  profile: studentProfileApi,
  scholarships: scholarshipsApi,
  colleges: collegesApi,
  applications: applicationsApi,
  financialAid: financialAidApi,
  loans: loansApi,
  career: careerApi,
  stemFunding: stemFundingApi,
};
