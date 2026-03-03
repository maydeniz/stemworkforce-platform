// ===========================================
// Municipality Partner Types
// Cities, Counties, Municipal HR Departments
// ===========================================

// ===========================================
// ENUMS & UNION TYPES
// ===========================================

export type MunicipalityPartnerTier = 'starter' | 'professional' | 'enterprise';

export type MunicipalityType =
  | 'city'
  | 'county'
  | 'town'
  | 'village'
  | 'township'
  | 'borough'
  | 'regional_authority';

export type MunicipalitySize =
  | 'small'      // < 50,000 population
  | 'medium'     // 50,000 - 250,000
  | 'large'      // 250,000 - 1,000,000
  | 'major'      // > 1,000,000
  | 'metro';     // Multi-jurisdiction metro area

export type DepartmentType =
  | 'human_resources'
  | 'public_works'
  | 'public_safety'
  | 'fire_department'
  | 'police_department'
  | 'parks_recreation'
  | 'planning_development'
  | 'finance'
  | 'it_technology'
  | 'utilities'
  | 'transportation'
  | 'health_services'
  | 'library'
  | 'mayors_office'
  | 'city_council'
  | 'legal'
  | 'communications'
  | 'economic_development'
  | 'community_services'
  | 'environmental_services'
  | 'housing'
  | 'other';

export type InternshipProgramType =
  | 'summer_youth'           // SYEP-style summer programs
  | 'college_pathways'       // College internship programs
  | 'high_school_cte'        // CTE/vocational high school
  | 'mayors_fellowship'      // Executive/policy fellowships
  | 'department_specific'    // Department-based internships
  | 'year_round'             // Ongoing internship programs
  | 'graduate_fellowship'    // Graduate-level programs
  | 'work_study';            // Federal work-study placements

export type ApprenticeshipType =
  | 'registered'             // DOL Registered Apprenticeship
  | 'pre_apprenticeship'     // Pre-apprenticeship/readiness
  | 'youth_apprenticeship'   // Ages 16-24
  | 'trades'                 // Building/construction trades
  | 'utilities'              // Water, electric, gas utilities
  | 'public_safety'          // Police, fire, EMS pathways
  | 'it_cyber'               // IT/Cybersecurity apprenticeships
  | 'administrative';        // Admin/professional apprenticeships

export type ProgramStatus =
  | 'planning'
  | 'recruiting'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived';

export type ParticipantStatus =
  | 'applied'
  | 'screened'
  | 'enrolled'
  | 'active'
  | 'on_leave'
  | 'completed'
  | 'placed'          // Placed in city job
  | 'exited'          // Left program
  | 'withdrawn';

export type PlacementType =
  | 'full_time_permanent'
  | 'full_time_temp'
  | 'part_time_permanent'
  | 'part_time_temp'
  | 'seasonal'
  | 'contract'
  | 'fellowship';

export type CivilServiceStatus =
  | 'not_required'
  | 'exam_scheduled'
  | 'exam_completed'
  | 'on_list'
  | 'certified'
  | 'appointed';

export type FundingSource =
  | 'general_fund'
  | 'federal_wioa'
  | 'federal_cdbg'
  | 'federal_arpa'
  | 'state_grant'
  | 'private_foundation'
  | 'employer_sponsored'
  | 'union_partnership'
  | 'mixed';

export type ReportType =
  | 'quarterly_progress'
  | 'annual_performance'
  | 'grant_expenditure'
  | 'wioa_compliance'
  | 'civil_service_audit'
  | 'equal_opportunity'
  | 'union_compliance'
  | 'budget_variance'
  | 'program_outcomes'
  | 'retention_analysis';

export type ReportStatus =
  | 'draft'
  | 'in_progress'
  | 'pending_review'
  | 'submitted'
  | 'accepted'
  | 'revision_requested';

// ===========================================
// CORE INTERFACES
// ===========================================

export interface MunicipalityPartner {
  id: string;
  userId: string;

  // Organization Info
  municipalityName: string;           // "City of Austin", "Los Angeles County"
  municipalityType: MunicipalityType;
  municipalitySize: MunicipalitySize;
  population: number;

  // Location
  city: string;
  county: string;
  state: string;
  region?: string;
  timezone: string;

  // Primary Contact
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactTitle: string;
  department: DepartmentType;

  // Organization Details
  totalEmployees: number;             // Total municipal workforce
  annualHiringTarget: number;         // Target hires per year
  currentVacancies: number;           // Open positions
  retirementEligible: number;         // Employees eligible to retire
  hrBudget?: number;                  // Annual HR/training budget

  // Partnership
  tier: MunicipalityPartnerTier;
  partnerSince: string;
  contractExpiration?: string;

  // Civil Service
  hasCivilService: boolean;
  civilServiceExemptions?: string[];  // Exempt job classifications
  unionized: boolean;
  unionNames?: string[];              // AFSCME, SEIU, etc.

  // Program Counts
  activeInternshipPrograms: number;
  activeApprenticeships: number;
  totalParticipantsYTD: number;
  totalPlacementsYTD: number;

  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// INTERNSHIP PROGRAMS
// ===========================================

export interface InternshipProgram {
  id: string;
  municipalityId: string;

  // Program Details
  programName: string;
  programType: InternshipProgramType;
  description: string;

  // Departments
  hostDepartments: DepartmentType[];

  // Timing
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  durationWeeks: number;

  // Eligibility
  minAge: number;
  maxAge: number;
  educationRequirement: 'high_school' | 'enrolled_college' | 'college_graduate' | 'graduate_student' | 'none';
  residencyRequired: boolean;
  residencyArea?: string;             // "City limits", "County", etc.
  incomeEligibility?: boolean;        // Low-income requirement
  incomeThreshold?: number;           // % of poverty level

  // Compensation
  isPaid: boolean;
  hourlyRate?: number;
  stipend?: number;
  totalBudget: number;
  fundingSource: FundingSource;

  // Capacity
  totalSlots: number;
  filledSlots: number;
  waitlistCount: number;

  // Status
  status: ProgramStatus;
  applicationDeadline?: string;

  // Outcomes
  completionRate?: number;
  conversionRate?: number;            // % converted to city jobs
  satisfactionScore?: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// APPRENTICESHIP PROGRAMS
// ===========================================

export interface ApprenticeshipProgram {
  id: string;
  municipalityId: string;

  // Program Details
  programName: string;
  apprenticeshipType: ApprenticeshipType;
  occupation: string;                 // "Electrician", "Water Treatment Operator"
  rapidsCode?: string;                // DOL RAPIDS code
  description: string;

  // Sponsorship
  sponsorType: 'municipality' | 'joint' | 'union' | 'contractor';
  unionPartner?: string;
  contractorPartners?: string[];

  // Departments
  hostDepartments: DepartmentType[];

  // Duration & Structure
  durationMonths: number;
  totalOJTHours: number;              // On-the-job training hours
  totalRTIHours: number;              // Related technical instruction hours
  progressivewageSchedule: boolean;

  // Compensation
  startingWage: number;
  journeyWage: number;                // Wage upon completion
  benefits: boolean;

  // Capacity
  totalSlots: number;
  activeApprentices: number;
  graduatedYTD: number;

  // Requirements
  minAge: number;
  educationRequirement: string;
  physicalRequirements?: string;
  backgroundCheckRequired: boolean;
  drugTestRequired: boolean;
  driversLicenseRequired: boolean;

  // Credentials
  credentialAwarded: string;          // "Journeyman Electrician"
  industryRecognized: boolean;

  // Funding
  fundingSource: FundingSource;
  employerContribution?: number;
  grantFunding?: number;

  // Status
  status: ProgramStatus;

  // Outcomes
  completionRate?: number;
  retentionRate?: number;             // % still employed after 1 year
  avgCompletionTime?: number;         // Months

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// PARTICIPANTS
// ===========================================

export interface MunicipalityParticipant {
  id: string;
  municipalityId: string;
  programId: string;
  programType: 'internship' | 'apprenticeship';

  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;

  // Demographics
  city: string;
  zipCode: string;
  isResident: boolean;

  // Education
  educationLevel: 'high_school' | 'some_college' | 'associates' | 'bachelors' | 'masters' | 'other';
  currentSchool?: string;
  major?: string;
  expectedGraduation?: string;
  gpa?: number;

  // Eligibility
  meetsIncomeRequirement?: boolean;
  isVeteran: boolean;
  hasDisability?: boolean;
  isFirstGenCollege?: boolean;

  // Program Details
  department: DepartmentType;
  supervisor?: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;

  // Status
  status: ParticipantStatus;
  hoursCompleted: number;

  // For Apprentices
  currentWage?: number;
  ojtHoursCompleted?: number;
  rtiHoursCompleted?: number;
  competenciesCompleted?: number;
  totalCompetencies?: number;

  // Civil Service (if applicable)
  civilServiceStatus?: CivilServiceStatus;
  examScore?: number;
  listPosition?: number;

  // Placement
  placedInCity?: boolean;
  placementType?: PlacementType;
  placementDepartment?: DepartmentType;
  placementTitle?: string;
  placementSalary?: number;
  placementDate?: string;

  // Evaluations
  midpointEvaluation?: number;        // 1-5 scale
  finalEvaluation?: number;
  supervisorRecommendation?: 'highly_recommend' | 'recommend' | 'neutral' | 'not_recommend';

  // Notes
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// DEPARTMENT WORKFORCE NEEDS
// ===========================================

export interface DepartmentWorkforceNeed {
  id: string;
  municipalityId: string;
  department: DepartmentType;

  // Current State
  authorizedPositions: number;
  filledPositions: number;
  vacancyRate: number;

  // Workforce Planning
  retirementEligible5Years: number;   // Retiring in 5 years
  hardToFillPositions: string[];      // Job titles
  criticalSkillGaps: string[];

  // Hiring Pipeline
  activeRequisitions: number;
  avgTimeToFill: number;              // Days
  avgCostPerHire?: number;

  // Intern/Apprentice Needs
  internSlotsRequested: number;
  internSlotsApproved: number;
  apprenticeSlotsRequested: number;
  apprenticeSlotsApproved: number;

  // Priority Areas
  priorityJobFamilies: string[];      // "IT", "Engineering", "Trades"
  emergingSkillNeeds: string[];       // "Data Analytics", "Cybersecurity"

  // Budget
  trainingBudget?: number;
  projectedHiringBudget?: number;

  // Metadata
  fiscalYear: string;
  lastUpdated: string;
}

// ===========================================
// CIVIL SERVICE INTEGRATION
// ===========================================

export interface CivilServiceExam {
  id: string;
  municipalityId: string;

  examTitle: string;
  examNumber: string;
  jobClassification: string;

  // Schedule
  applicationOpenDate: string;
  applicationCloseDate: string;
  examDate?: string;
  resultsExpectedDate?: string;
  listExpirationDate?: string;

  // Details
  examType: 'written' | 'performance' | 'oral' | 'education_experience' | 'combined';
  isContinuous: boolean;              // Open continuous exam

  // Stats
  applicantsCount?: number;
  passersCount?: number;
  passingScore: number;

  // Intern/Apprentice Connection
  linkedProgramIds?: string[];        // Programs that feed into this exam

  // Status
  status: 'upcoming' | 'open' | 'closed' | 'results_pending' | 'list_active' | 'list_expired';
}

// ===========================================
// REPORTING
// ===========================================

export interface MunicipalityReport {
  id: string;
  municipalityId: string;

  reportType: ReportType;
  reportTitle: string;
  reportPeriod: string;               // "Q1 2025", "FY 2024-2025"

  // Timeline
  dueDate: string;
  submittedDate?: string;

  // Status
  status: ReportStatus;

  // Linked Programs
  programIds?: string[];

  // Grant Info (if applicable)
  grantNumber?: string;
  grantorAgency?: string;

  // Attachments
  attachmentUrls?: string[];

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// DASHBOARD METRICS
// ===========================================

export interface MunicipalityDashboardMetrics {
  // Overview
  activeInternships: number;
  activeApprenticeships: number;
  totalParticipants: number;
  totalPlacements: number;

  // Pipeline
  applicationsThisMonth: number;
  enrollmentsThisMonth: number;
  completionsThisMonth: number;
  placementsThisMonth: number;

  // Performance
  avgCompletionRate: number;
  avgConversionRate: number;          // To city employment
  avgRetentionRate: number;           // 1-year retention
  avgTimeToFill: number;              // Days

  // Demographics
  participantsByAge: { range: string; count: number }[];
  participantsByDepartment: { department: DepartmentType; count: number }[];
  participantsByProgram: { programType: string; count: number }[];

  // Financial
  totalProgramBudget: number;
  budgetSpentYTD: number;
  costPerPlacement: number;

  // Workforce Impact
  vacanciesFilled: number;
  diversityHires: number;
  youthEmployed: number;
  veteransEmployed: number;

  // Trends
  monthlyEnrollments: { month: string; count: number }[];
  monthlyPlacements: { month: string; count: number }[];
  quarterlyRetention: { quarter: string; rate: number }[];
}

// ===========================================
// UNION PARTNERSHIP
// ===========================================

export interface UnionPartnership {
  id: string;
  municipalityId: string;

  unionName: string;
  unionLocal: string;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Agreement
  agreementType: 'apprenticeship_mou' | 'hiring_hall' | 'training_partnership' | 'general';
  agreementStartDate: string;
  agreementEndDate: string;

  // Programs
  coveredOccupations: string[];
  coveredDepartments: DepartmentType[];
  apprenticeshipProgramIds?: string[];

  // Hiring Hall
  usesHiringHall: boolean;
  hiringHallProcedure?: string;

  // Status
  isActive: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// FILTERS & QUERIES
// ===========================================

export interface InternshipFilters {
  status?: ProgramStatus;
  programType?: InternshipProgramType;
  department?: DepartmentType;
  isPaid?: boolean;
  fundingSource?: FundingSource;
}

export interface ApprenticeshipFilters {
  status?: ProgramStatus;
  apprenticeshipType?: ApprenticeshipType;
  department?: DepartmentType;
  fundingSource?: FundingSource;
}

export interface ParticipantFilters {
  status?: ParticipantStatus;
  programType?: 'internship' | 'apprenticeship';
  department?: DepartmentType;
  isResident?: boolean;
  isVeteran?: boolean;
  placedInCity?: boolean;
}

export interface DepartmentFilters {
  department?: DepartmentType;
  hasVacancies?: boolean;
  hasInternSlots?: boolean;
  hasApprenticeSlots?: boolean;
}
