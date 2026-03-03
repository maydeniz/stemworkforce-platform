// ===========================================
// State Workforce Board Dashboard Types
// ===========================================
// Comprehensive type definitions for WIOA program management,
// participant tracking, AJC operations, and workforce development
// ===========================================

// ===========================================
// USER ROLES FOR WORKFORCE OPERATIONS
// ===========================================
export type WorkforceRole =
  | 'STATE_WORKFORCE_DIRECTOR'    // Statewide oversight
  | 'LWDB_DIRECTOR'               // Local Workforce Development Board Director
  | 'LWDB_FINANCE_MANAGER'        // Budget and fiscal management
  | 'AJC_DIRECTOR'                // American Job Center Director
  | 'AJC_MANAGER'                 // AJC Operations Manager
  | 'CASE_MANAGER'                // Participant case management
  | 'CAREER_COUNSELOR'            // Career counseling services
  | 'BUSINESS_SERVICES_REP'       // Employer services
  | 'TRAINING_COORDINATOR'        // Training program management
  | 'YOUTH_SERVICES_COORDINATOR'  // WIOA Youth programs
  | 'VR_LIAISON'                  // Vocational Rehabilitation coordination
  | 'DATA_ANALYST'                // Reporting and analytics
  | 'COMPLIANCE_OFFICER'          // WIOA compliance monitoring
  | 'RAPID_RESPONSE_COORDINATOR'; // Layoff response

// ===========================================
// WIOA PROGRAMS
// ===========================================
export type WIOAProgram =
  | 'TITLE_I_ADULT' | 'adult'
  | 'TITLE_I_DISLOCATED_WORKER' | 'dislocated_worker'
  | 'TITLE_I_YOUTH' | 'youth'
  | 'TITLE_II_ADULT_EDUCATION' | 'adult_education'
  | 'TITLE_III_WAGNER_PEYSER' | 'wagner_peyser'
  | 'TITLE_IV_VOCATIONAL_REHAB' | 'vocational_rehab'
  | 'TAA' | 'taa'                 // Trade Adjustment Assistance
  | 'trade_adjustment'            // Alias for TAA
  | 'RESEA' | 'resea'             // Reemployment Services and Eligibility Assessment
  | 'SNAP_ET' | 'snap_et'         // SNAP Employment & Training
  | 'TANF' | 'tanf'               // Temporary Assistance for Needy Families
  | 'VETERAN_SERVICES' | 'veteran_services' | 'veterans'
  | 'REENTRY' | 'reentry';        // Reentry services

// ===========================================
// PARTICIPANT MANAGEMENT
// ===========================================
export type ParticipantStatus =
  | 'REGISTERED' | 'registered'
  | 'PENDING_ELIGIBILITY' | 'pending_eligibility'
  | 'ELIGIBLE' | 'eligible'
  | 'ENROLLED' | 'enrolled'
  | 'ACTIVE' | 'active'
  | 'TRAINING' | 'training'
  | 'EMPLOYED' | 'employed'
  | 'EXITED' | 'exited'
  | 'FOLLOW_UP_Q1' | 'follow_up_q1'
  | 'FOLLOW_UP_Q2' | 'follow_up_q2'
  | 'FOLLOW_UP_Q3' | 'follow_up_q3'
  | 'FOLLOW_UP_Q4' | 'follow_up_q4'
  | 'FOLLOW_UP' | 'follow_up'
  | 'CLOSED' | 'closed';

export type BarrierToEmployment =
  | 'LONG_TERM_UNEMPLOYED' | 'long_term_unemployed'
  | 'EX_OFFENDER' | 'ex_offender'
  | 'HOMELESS' | 'homeless'
  | 'LOW_INCOME' | 'low_income'
  | 'BASIC_SKILLS_DEFICIENT' | 'basic_skills_deficient'
  | 'ENGLISH_LANGUAGE_LEARNER' | 'english_language_learner'
  | 'SINGLE_PARENT' | 'single_parent'
  | 'DISPLACED_HOMEMAKER' | 'displaced_homemaker'
  | 'YOUTH_FOSTER_CARE' | 'youth_foster_care' | 'youth_in_foster_care'
  | 'YOUTH_AGING_OUT' | 'youth_aging_out' | 'youth_aging_out_foster_care'
  | 'YOUTH_OUT_OF_SCHOOL' | 'youth_out_of_school'
  | 'DISABILITY' | 'disability'
  | 'VETERAN' | 'veteran'
  | 'OLDER_WORKER' | 'older_worker'
  | 'MIGRANT_SEASONAL_FARMWORKER' | 'migrant_seasonal_farmworker'
  | 'EXHAUSTING_TANF' | 'exhausting_tanf'
  | 'LACKS_TRANSPORTATION' | 'lacks_transportation'
  | 'LACKS_CHILDCARE' | 'lacks_childcare'
  | 'SUBSTANCE_ABUSE_HISTORY' | 'substance_abuse_history' | 'substance_abuse'
  | 'PUBLIC_ASSISTANCE_RECIPIENT' | 'public_assistance_recipient'
  | 'DOMESTIC_VIOLENCE' | 'domestic_violence'
  | 'CULTURAL_BARRIERS' | 'cultural_barriers'
  | 'LIMITED_WORK_HISTORY' | 'limited_work_history'
  | 'REQUIRES_ADDITIONAL_ASSISTANCE' | 'requires_additional_assistance'
  | 'FOSTER_CARE' | 'foster_care';

export interface Participant {
  id: string;
  ssn_last_four?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  email?: string;
  phone?: string;

  // Address (structured)
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  county?: string;
  // Address (object or string format)
  address?: string | {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
  };

  // Demographics
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
  race?: string[];
  ethnicity?: 'HISPANIC_LATINO' | 'NOT_HISPANIC_LATINO';
  veteran_status?: boolean;
  disability_status?: boolean;
  highest_education?: string;

  // Employment
  employment_status?: 'EMPLOYED' | 'UNEMPLOYED' | 'UNDEREMPLOYED' | 'NOT_IN_LABOR_FORCE';
  employment_status_at_registration?: 'employed' | 'unemployed' | 'underemployed' | 'not_in_labor_force' | 'employed_part_time';
  ui_claimant?: boolean;
  tanf_recipient?: boolean;
  snap_recipient?: boolean;
  low_income?: boolean;

  // Barriers
  barriers?: BarrierToEmployment[];
  barriers_to_employment?: string[]; // Alias for UI

  // Program enrollment
  programs?: ParticipantProgram[];
  program_enrollments?: ProgramEnrollment[]; // Alias for UI
  status: ParticipantStatus;

  // Additional demographic fields
  highest_education_level?: string;
  priority_population?: string[];

  // Case management
  assigned_case_manager_id?: string;
  assigned_ajc_id?: string;
  ajc_id?: string; // Alias for UI
  lwdb_id?: string;

  // Dates
  registration_date: string;
  enrollment_date?: string;
  exit_date?: string;
  exit_reason?: string;

  created_at: string;
  updated_at: string;
}

// Alias for backward compatibility
export type WorkforceParticipant = Participant;

// Program enrollment for UI display
export interface ProgramEnrollment {
  program: string;
  status: string;
  enrollment_date?: string;
  exit_date?: string;
  services_received?: string[];
}

export interface ParticipantProgram {
  id: string;
  participant_id: string;
  program: WIOAProgram;
  enrollment_date: string;
  exit_date?: string;
  status: 'ENROLLED' | 'ACTIVE' | 'EXITED' | 'CLOSED';
  funding_stream?: string;
  co_enrolled_programs?: WIOAProgram[];
}

// ===========================================
// INDIVIDUAL EMPLOYMENT PLAN (IEP)
// ===========================================
export interface IndividualEmploymentPlan {
  id: string;
  participant_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;

  // Career goals
  short_term_goal: string;
  long_term_goal: string;
  target_occupation?: string;
  target_soc_code?: string;
  target_wage?: number;

  // Assessment results
  skills_assessment?: string;
  interests_assessment?: string;
  aptitude_assessment?: string;
  barriers_identified: BarrierToEmployment[];

  // Action steps
  action_steps: IEPActionStep[];

  // Services planned
  services_planned: PlannedService[];

  // Signatures
  participant_signature_date?: string;
  counselor_signature_date?: string;

  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'REVISED';
  review_date?: string;
}

export interface IEPActionStep {
  id: string;
  description: string;
  target_date: string;
  completion_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
  notes?: string;
}

export interface PlannedService {
  service_type: ServiceType;
  provider?: string;
  start_date?: string;
  end_date?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cost?: number;
  funding_source?: string;
}

// ===========================================
// SERVICES
// ===========================================
export type ServiceType =
  // Career Services - Basic
  | 'ELIGIBILITY_DETERMINATION'
  | 'OUTREACH_INTAKE'
  | 'ORIENTATION'
  | 'INITIAL_ASSESSMENT'
  | 'LABOR_EXCHANGE'
  | 'JOB_SEARCH_ASSISTANCE'
  | 'REFERRALS'
  | 'LMI_PROVISION'
  | 'PERFORMANCE_INFO'
  | 'SUPPORTIVE_SERVICES_INFO'
  | 'UI_ASSISTANCE'
  | 'FINANCIAL_AID_INFO'

  // Career Services - Individualized
  | 'COMPREHENSIVE_ASSESSMENT'
  | 'IEP_DEVELOPMENT'
  | 'CAREER_COUNSELING'
  | 'CASE_MANAGEMENT'
  | 'SHORT_TERM_PREVOCATIONAL'
  | 'INTERNSHIP_WORK_EXPERIENCE'
  | 'WORKFORCE_PREPARATION'
  | 'FINANCIAL_LITERACY'
  | 'OUT_OF_AREA_JOB_SEARCH'
  | 'ENGLISH_LANGUAGE_ACQUISITION'

  // Training Services
  | 'OCCUPATIONAL_SKILLS_TRAINING'
  | 'OJT'                          // On-the-Job Training
  | 'INCUMBENT_WORKER_TRAINING'
  | 'WORKPLACE_TRAINING'
  | 'SKILL_UPGRADING'
  | 'ENTREPRENEURIAL_TRAINING'
  | 'TRANSITIONAL_JOBS'
  | 'JOB_READINESS_TRAINING'
  | 'ADULT_EDUCATION'
  | 'CUSTOMIZED_TRAINING'
  | 'REGISTERED_APPRENTICESHIP'

  // Supportive Services
  | 'TRANSPORTATION_ASSISTANCE'
  | 'CHILDCARE_ASSISTANCE'
  | 'HOUSING_ASSISTANCE'
  | 'NEEDS_RELATED_PAYMENTS'
  | 'WORK_ATTIRE'
  | 'TOOLS_EQUIPMENT'
  | 'LICENSURE_FEES'
  | 'UNION_FEES'
  | 'LINKAGE_TO_COMMUNITY_SERVICES';

export interface ServiceTransaction {
  id: string;
  participant_id: string;
  service_type: ServiceType;
  service_date: string;
  provider_id?: string;
  provider_name?: string;
  staff_id: string;
  ajc_id?: string;
  duration_minutes?: number;
  cost?: number;
  funding_source?: string;
  notes?: string;
  created_at: string;
}

// ===========================================
// CASE NOTES
// ===========================================
export interface CaseNote {
  id: string;
  participant_id: string;
  staff_id: string;
  staff_name: string;
  note_date: string;
  note_type: 'GENERAL' | 'ASSESSMENT' | 'SERVICE' | 'REFERRAL' | 'FOLLOW_UP' | 'OUTCOME' | 'BARRIER' | 'GOAL_PROGRESS';
  content: string;
  is_confidential: boolean;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

// ===========================================
// TRAINING & CREDENTIALS
// ===========================================
export interface IndividualTrainingAccount {
  id: string;
  participant_id: string;
  program_id: string;
  provider_id: string;
  provider_name: string;
  program_name: string;
  credential_type?: CredentialType;

  // Funding
  approved_amount: number;
  obligated_amount: number;
  expended_amount: number;
  funding_source: string;

  // Dates
  start_date: string;
  expected_end_date: string;
  actual_end_date?: string;

  // Status
  status: 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN' | 'CANCELLED';
  completion_status?: 'COMPLETED' | 'DID_NOT_COMPLETE';

  // Outcomes
  credential_earned?: boolean;
  credential_date?: string;
  employed_after_training?: boolean;
  wage_at_placement?: number;

  created_at: string;
  updated_at: string;
}

export type CredentialType =
  | 'ASSOCIATES_DEGREE'
  | 'BACHELORS_DEGREE'
  | 'MASTERS_DEGREE'
  | 'DOCTORATE'
  | 'POST_SECONDARY_CERTIFICATE'
  | 'SECONDARY_DIPLOMA'
  | 'GED'
  | 'INDUSTRY_CERTIFICATION'
  | 'OCCUPATIONAL_LICENSE'
  | 'REGISTERED_APPRENTICESHIP_CERTIFICATE'
  | 'OTHER_CREDENTIAL';

// ===========================================
// TRAINING PROVIDERS (ETPL)
// ===========================================
export interface ETPLProvider {
  id: string;
  name: string;
  dba_name?: string;
  provider_type: 'COMMUNITY_COLLEGE' | 'UNIVERSITY' | 'TECHNICAL_SCHOOL' | 'APPRENTICESHIP_SPONSOR' | 'ONLINE' | 'EMPLOYER' | 'NONPROFIT';

  // Contact
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  phone: string;
  email: string;
  website?: string;

  // Status
  etpl_status: 'APPROVED' | 'PENDING' | 'PROBATION' | 'REMOVED';
  approval_date?: string;
  renewal_date?: string;

  // Programs
  programs: TrainingProgram[];

  // Performance
  total_enrollments?: number;
  completion_rate?: number;
  employment_rate?: number;
  median_wage?: number;

  created_at: string;
  updated_at: string;
}

export interface TrainingProgram {
  id: string;
  provider_id: string;
  program_name: string;
  cip_code?: string;          // Classification of Instructional Programs
  soc_code?: string;          // Standard Occupational Classification

  // Program details
  credential_type: CredentialType;
  duration_hours: number;
  duration_weeks: number;
  delivery_method: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  cost: number;
  ita_eligible: boolean;

  // Status
  etpl_status: 'APPROVED' | 'PENDING' | 'REMOVED';
  in_demand_occupation: boolean;

  // Outcomes
  completion_rate?: number;
  employment_rate?: number;
  median_wage?: number;

  created_at: string;
  updated_at: string;
}

// ===========================================
// AMERICAN JOB CENTER (AJC)
// ===========================================
export interface AmericanJobCenter {
  id: string;
  name: string;
  center_type: 'COMPREHENSIVE' | 'AFFILIATE' | 'SPECIALIZED';
  lwdb_id: string;
  lwdb_name: string;

  // Location
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  county: string;
  latitude?: number;
  longitude?: number;

  // Contact
  phone: string;
  email: string;
  website?: string;

  // Hours
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  // Services
  services_offered: ServiceType[];
  programs_offered: WIOAProgram[];
  partner_agencies: string[];

  // Accessibility
  wheelchair_accessible: boolean;
  hearing_assistance: boolean;
  vision_assistance: boolean;
  languages: string[];

  // Staff
  director_name?: string;
  director_email?: string;
  total_staff?: number;

  // Capacity
  resource_room_computers?: number;
  workshop_room_capacity?: number;

  status: 'ACTIVE' | 'INACTIVE' | 'TEMPORARILY_CLOSED';

  created_at: string;
  updated_at: string;
}

export interface AJCDailyTraffic {
  id: string;
  ajc_id: string;
  date: string;

  // Traffic counts
  walk_ins: number;
  appointments: number;
  virtual_visits: number;
  phone_calls: number;

  // Service counts
  registrations: number;
  assessments: number;
  job_referrals: number;
  workshop_attendees: number;
  resource_room_users: number;

  // Staff
  staff_on_duty: number;

  created_at: string;
}

// ===========================================
// EMPLOYER SERVICES
// ===========================================
export interface Employer {
  id: string;
  company_name: string;
  dba_name?: string;
  fein?: string;              // Federal Employer Identification Number

  // Industry
  naics_code?: string;
  industry_description?: string;
  company_size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  employee_count?: number;

  // Location
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;

  // Contact
  primary_contact_name?: string;
  primary_contact_title?: string;
  primary_contact_phone?: string;
  primary_contact_email?: string;

  // Services
  registered_apprenticeship_sponsor?: boolean;
  ojt_partner?: boolean;
  wotc_registered?: boolean;       // Work Opportunity Tax Credit

  // Assigned staff
  assigned_bsr_id?: string;        // Business Services Representative

  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  engagement_level: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEW';

  created_at: string;
  updated_at: string;
}

export interface JobOrder {
  id: string;
  employer_id: string;
  employer_name: string;

  // Job details
  job_title: string;
  soc_code?: string;
  job_description: string;
  requirements: string;
  wage_min?: number;
  wage_max?: number;
  wage_type: 'HOURLY' | 'SALARY' | 'COMMISSION';

  // Position details
  openings: number;
  openings_filled: number;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY' | 'SEASONAL' | 'INTERNSHIP';

  // Location
  work_location_city?: string;
  work_location_state?: string;
  remote_eligible?: boolean;

  // Dates
  date_posted: string;
  date_needed?: string;
  expiration_date?: string;

  // Status
  status: 'OPEN' | 'FILLED' | 'CANCELLED' | 'ON_HOLD' | 'EXPIRED';

  // Staff
  posted_by_staff_id: string;
  ajc_id?: string;

  // Referrals
  referrals_count: number;
  interviews_count: number;
  placements_count: number;

  created_at: string;
  updated_at: string;
}

export interface OJTAgreement {
  id: string;
  employer_id: string;
  employer_name: string;
  participant_id: string;
  participant_name: string;

  // Job details
  job_title: string;
  soc_code?: string;
  starting_wage: number;
  target_wage: number;

  // Training
  training_hours: number;
  training_weeks: number;
  skills_to_learn: string[];

  // Reimbursement
  reimbursement_rate: number;      // Percentage (50-75%)
  estimated_reimbursement: number;
  actual_reimbursement?: number;

  // Dates
  start_date: string;
  expected_end_date: string;
  actual_end_date?: string;

  // Status
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  completion_status?: 'SUCCESSFUL' | 'UNSUCCESSFUL';
  retained_after_training?: boolean;

  // Staff
  case_manager_id: string;

  created_at: string;
  updated_at: string;
}

// ===========================================
// RAPID RESPONSE
// ===========================================
export interface WARNNotice {
  id: string;
  employer_id?: string;
  company_name: string;

  // Event details
  event_type: 'LAYOFF' | 'PLANT_CLOSURE' | 'RELOCATION';
  affected_workers: number;

  // Location
  facility_address: string;
  facility_city: string;
  facility_state: string;
  facility_zip: string;

  // Dates
  notice_date: string;
  effective_date: string;

  // Status
  status: 'RECEIVED' | 'ASSIGNED' | 'RESPONSE_SCHEDULED' | 'RESPONSE_COMPLETED' | 'CLOSED';

  // Response
  assigned_coordinator_id?: string;
  response_date?: string;
  workers_served?: number;

  // Notes
  notes?: string;

  created_at: string;
  updated_at: string;
}

export interface RapidResponseEvent {
  id: string;
  warn_notice_id?: string;
  employer_id?: string;
  company_name: string;

  // Event details
  event_type: 'INFO_SESSION' | 'ENROLLMENT_EVENT' | 'JOB_FAIR' | 'WORKSHOP';
  event_date: string;
  event_time: string;
  location: string;

  // Attendance
  expected_attendees: number;
  actual_attendees?: number;

  // Services provided
  services_provided: ServiceType[];
  registrations?: number;
  referrals?: number;

  // Staff
  coordinator_id: string;
  staff_attending: string[];

  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

  notes?: string;

  created_at: string;
  updated_at: string;
}

// ===========================================
// BUDGET & FISCAL
// ===========================================
export interface GrantAllocation {
  id: string;
  fiscal_year: string;
  program: WIOAProgram;

  // Geographic
  lwdb_id?: string;
  lwdb_name?: string;
  statewide?: boolean;

  // Funding
  allocation_amount: number;
  carryover_amount?: number;
  total_available: number;

  // Spending
  obligated_amount: number;
  expended_amount: number;
  remaining_amount: number;

  // Dates
  period_start: string;
  period_end: string;

  // Match requirements
  match_required?: number;
  match_provided?: number;

  status: 'ACTIVE' | 'CLOSED' | 'PENDING';

  created_at: string;
  updated_at: string;
}

export interface Expenditure {
  id: string;
  grant_allocation_id: string;

  // Category
  cost_category: 'STAFF_SALARIES' | 'STAFF_BENEFITS' | 'STAFF_TRAINING' | 'PARTICIPANT_TRAINING' | 'PARTICIPANT_SUPPORTIVE' | 'PARTICIPANT_ITA' | 'OPERATIONS' | 'EQUIPMENT' | 'INDIRECT' | 'OTHER';
  description: string;

  // Amount
  amount: number;

  // Vendor/Payee
  vendor_name?: string;
  invoice_number?: string;

  // Dates
  expenditure_date: string;
  period_start?: string;
  period_end?: string;

  // Tracking
  participant_id?: string;
  ajc_id?: string;

  // Approval
  approved_by?: string;
  approval_date?: string;

  created_at: string;
}

// ===========================================
// PERFORMANCE METRICS
// ===========================================
export interface WIOAPerformanceGoals {
  id: string;
  fiscal_year: string;
  program: WIOAProgram;
  lwdb_id?: string;

  // Six Primary Indicators
  employment_rate_q2_goal: number;
  employment_rate_q4_goal: number;
  median_earnings_goal: number;
  credential_attainment_goal: number;
  measurable_skill_gains_goal: number;
  effectiveness_retention_goal: number;

  // Actual performance
  employment_rate_q2_actual?: number;
  employment_rate_q4_actual?: number;
  median_earnings_actual?: number;
  credential_attainment_actual?: number;
  measurable_skill_gains_actual?: number;
  effectiveness_retention_actual?: number;

  // Status
  status: 'NEGOTIATING' | 'APPROVED' | 'FINAL';
  negotiation_notes?: string;

  created_at: string;
  updated_at: string;
}

export interface ParticipantOutcome {
  id: string;
  participant_id: string;
  program: WIOAProgram;
  exit_date: string;

  // Quarter 2 outcomes
  employed_q2?: boolean;
  q2_employer_name?: string;
  q2_wage?: number;
  q2_data_source?: 'WAGE_RECORD' | 'SUPPLEMENTAL' | 'CASE_MANAGEMENT';

  // Quarter 4 outcomes
  employed_q4?: boolean;
  q4_employer_name?: string;
  q4_wage?: number;
  q4_data_source?: 'WAGE_RECORD' | 'SUPPLEMENTAL' | 'CASE_MANAGEMENT';

  // Credentials
  credential_earned?: boolean;
  credential_type?: CredentialType;
  credential_date?: string;

  // Skills
  measurable_skill_gain?: boolean;
  msg_type?: 'EDUCATIONAL_GAIN' | 'CREDENTIAL' | 'PROGRESS_REPORT' | 'SKILLS_PROGRESSION';

  // Same employer retention
  same_employer_q2_to_q4?: boolean;

  created_at: string;
  updated_at: string;
}

// ===========================================
// LOCAL WORKFORCE DEVELOPMENT BOARD
// ===========================================
export interface LocalWorkforceBoard {
  id: string;
  name: string;
  lwdb_number: string;

  // Geographic
  counties_served: string[];
  region_name?: string;

  // Contact
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  phone: string;
  email: string;
  website?: string;

  // Leadership
  director_name?: string;
  director_email?: string;
  board_chair_name?: string;

  // American Job Centers
  ajc_ids: string[];
  comprehensive_ajc_count: number;
  affiliate_ajc_count: number;

  // Budget
  current_fiscal_year_budget?: number;

  // Performance
  meeting_performance_goals?: boolean;

  status: 'ACTIVE' | 'INACTIVE';

  created_at: string;
  updated_at: string;
}

// ===========================================
// DASHBOARD ANALYTICS
// ===========================================
export interface WorkforceDashboardStats {
  // Participants
  total_participants: number;
  active_participants: number;
  new_enrollments_mtd: number;
  exits_mtd: number;

  // Services
  total_services_delivered: number;
  services_this_month: number;

  // Training
  active_itas: number;
  ita_expenditures_ytd: number;
  training_completions_ytd: number;
  credentials_earned_ytd: number;

  // Employers
  active_employers: number;
  job_orders_open: number;
  placements_mtd: number;
  ojt_agreements_active: number;

  // AJC
  total_ajc_visits_mtd: number;
  virtual_services_mtd: number;

  // Budget
  total_allocation: number;
  total_expended: number;
  burn_rate: number;

  // Performance
  meeting_q2_employment: boolean;
  meeting_q4_employment: boolean;
  meeting_median_earnings: boolean;
  meeting_credential: boolean;
  meeting_msg: boolean;
  meeting_effectiveness: boolean;
}

// ===========================================
// REPORTS
// ===========================================
export interface ReportRequest {
  id: string;
  report_type: 'ETA_9169' | 'PIRL' | 'QUARTERLY_NARRATIVE' | 'ANNUAL_REPORT' | 'CUSTOM';
  fiscal_year: string;
  quarter?: 1 | 2 | 3 | 4;

  // Filters
  programs?: WIOAProgram[];
  lwdb_ids?: string[];
  ajc_ids?: string[];
  date_range_start?: string;
  date_range_end?: string;

  // Status
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  requested_by: string;
  requested_at: string;
  completed_at?: string;

  // Output
  file_url?: string;
  file_format?: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  record_count?: number;

  error_message?: string;
}
