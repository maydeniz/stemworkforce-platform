// ===========================================
// Government Partner Types
// Federal Agencies, State Workforce Boards, CHIPS Act Programs
// ===========================================

// ===========================================
// CORE TYPES
// ===========================================

export type GovernmentPartnerTier = 'basic' | 'standard' | 'enterprise';
export type GovernmentPartnerStatus = 'pending' | 'active' | 'suspended' | 'cancelled';
export type AgencyType = 'workforce_board' | 'federal_agency' | 'state_agency' | 'economic_development' | 'education_department' | 'labor_department' | 'chips_designated' | 'other';
export type AgencyLevel = 'federal' | 'state' | 'regional' | 'county' | 'city';

export interface GovernmentPartner {
  id: string;
  userId: string;
  agencyName: string;
  agencyType: AgencyType;
  agencyLevel: AgencyLevel;
  agencyCode?: string; // e.g., DOE, DOL, NSF

  // Location
  city: string;
  state: string;
  region?: string;

  // Partnership details
  tier: GovernmentPartnerTier;
  status: GovernmentPartnerStatus;

  // Contact info
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactTitle?: string;

  // Organization details
  jurisdiction?: string; // e.g., "State of Ohio", "Region 5"
  coveredPopulation?: number;
  annualBudget?: number;

  // Billing
  stripeCustomerId?: string;
  subscriptionStatus: 'free' | 'active' | 'past_due' | 'cancelled' | 'trialing';

  // Timestamps
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// PROGRAM TYPES
// ===========================================

export type ProgramType = 'chips_act' | 'wioa_title_i' | 'wioa_title_ii' | 'wioa_title_iii' | 'wioa_title_iv' | 'nsf_ate' | 'dol_eta' | 'state_grant' | 'federal_grant' | 'regional' | 'cte' | 'apprenticeship' | 'other';
export type ProgramStatus = 'draft' | 'planning' | 'active' | 'reporting' | 'completed' | 'archived';
export type FundingSource = 'federal' | 'state' | 'regional' | 'local' | 'mixed' | 'private' | 'chips_act' | 'wioa_title_i' | 'wioa_title_ii' | 'wioa_title_iii' | 'wioa_title_iv';

export interface WorkforceProgram {
  id: string;
  partnerId: string;
  name: string;
  programType: ProgramType;
  description: string;

  // Funding details
  fundingSource: FundingSource;
  grantNumber?: string;
  totalBudget: number;
  spentToDate: number;
  budgetRemaining: number;

  // Timeline
  startDate: string;
  endDate: string;
  reportingDeadlines: string[];

  // Targets
  enrollmentTarget: number;
  placementTarget: number; // percentage
  wageGainTarget?: number;

  // Current metrics
  currentEnrollment: number;
  completedCount: number;
  placedCount: number;
  averageWageGain?: number;

  // Status tracking
  status: ProgramStatus;
  milestoneProgress: number; // 0-100
  complianceStatus: 'compliant' | 'at_risk' | 'non_compliant' | 'pending_review';
  lastReportDate?: string;
  nextReportDue?: string;

  // Industry focus
  industryFocus: string[];
  occupationCodes?: string[]; // SOC codes

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// PARTICIPANT TYPES
// ===========================================

export type ParticipantStatus = 'enrolled' | 'active' | 'completed' | 'placed' | 'exited' | 'dropped' | 'withdrawn';
export type BarrierType = 'veteran' | 'disability' | 'low_income' | 'ex_offender' | 'long_term_unemployed' | 'youth' | 'displaced_worker' | 'limited_english' | 'basic_skills_deficient' | 'english_language_learner' | 'homeless' | 'foster_care' | 'single_parent' | 'lacks_transportation' | 'lacks_childcare' | 'none';

export interface ProgramParticipant {
  id: string;
  partnerId: string;
  programId: string;

  // Participant info
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;

  // Demographics (for reporting)
  zipCode?: string;
  county?: string;
  veteranStatus: boolean;
  disabilityStatus: boolean;
  barriers: BarrierType[];

  // Education
  educationLevel?: string;
  priorCredentials?: string[];

  // Employment at enrollment
  employedAtEnrollment: boolean;
  priorWage?: number;
  priorOccupation?: string;
  unemploymentDuration?: number; // weeks

  // Program tracking
  status: ParticipantStatus;
  enrollmentDate: string;
  exitDate?: string;
  completionDate?: string;

  // Training
  trainingHoursCompleted: number;
  credentialsEarned: string[];
  skillsGained: string[];

  // Placement
  placed: boolean;
  placementDate?: string;
  placementEmployer?: string;
  placementOccupation?: string;
  placementWage?: number;
  retainedAt90Days?: boolean;
  retainedAt180Days?: boolean;

  // Calculated metrics
  wageGain?: number;
  wageGainPercent?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// EMPLOYER PARTNERSHIP TYPES
// ===========================================

export type EmployerCommitmentType = 'hiring_pledge' | 'ojt' | 'ojt_agreement' | 'advisory_council' | 'curriculum_input' | 'equipment_donation' | 'internship_host' | 'apprenticeship' | 'apprenticeship_sponsor' | 'work_experience';
export type EmployerPartnershipStatus = 'prospecting' | 'negotiating' | 'pending' | 'active' | 'completed' | 'inactive' | 'expired';

export interface EmployerPartnership {
  id: string;
  partnerId: string;
  programId?: string;

  // Employer info
  employerName: string;
  industry: string;
  naicsCode?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle?: string;

  // Location
  city: string;
  state: string;

  // Partnership details
  commitmentTypes: EmployerCommitmentType[];
  status: EmployerPartnershipStatus;

  // Hiring commitments
  hiringPledgeCount?: number;
  hiredToDate: number;
  wageCommitment?: number; // minimum wage offered

  // OJT/Apprenticeship
  ojtSlotsOffered?: number;
  ojtSlotsUsed?: number;
  apprenticeshipSlots?: number;

  // Agreement details
  agreementStartDate?: string;
  agreementEndDate?: string;
  moaSignedDate?: string;

  // Notes
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// COMPLIANCE & REPORTING TYPES
// ===========================================

export type ReportType = 'quarterly' | 'quarterly_progress' | 'annual' | 'annual_performance' | 'mid_year' | 'final' | 'financial_report' | 'chips_quarterly' | 'chips_annual' | 'participant_outcomes' | 'employer_engagement' | 'audit_response' | 'ad_hoc';
export type ReportStatus = 'draft' | 'not_started' | 'in_review' | 'in_progress' | 'pending_review' | 'submitted' | 'accepted' | 'rejected' | 'revision_requested';

export interface ComplianceReport {
  id: string;
  partnerId: string;
  programId: string;

  // Report details
  reportType: ReportType;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  dueDate: string;

  // Status
  status: ReportStatus;
  submittedDate?: string;
  acceptedDate?: string;
  rejectionReason?: string;

  // Data summary
  enrollmentCount: number;
  completionCount: number;
  placementCount: number;
  placementRate: number;
  averageWageAtPlacement?: number;
  averageWageGain?: number;
  expendituresReported: number;

  // Veterans tracking (OFCCP)
  veteransEnrolled: number;
  veteransPlaced: number;

  // Prepared by
  preparedBy: string;
  reviewedBy?: string;

  // Notes
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// LABOR MARKET DATA TYPES
// ===========================================

export interface RegionalLaborData {
  id: string;
  partnerId: string;
  region: string;
  state: string;
  dataDate: string;

  // Supply metrics
  laborForceSize: number;
  unemploymentRate: number;
  stemWorkforce: number;
  stemUnemploymentRate?: number;

  // Demand metrics
  jobOpenings: number;
  stemJobOpenings: number;
  hardToFillPositions: number;

  // Wage data
  medianWage: number;
  stemMedianWage: number;
  wageGrowthYoY?: number;

  // Industry breakdown
  topIndustries: {
    name: string;
    percentage: number;
    industry?: string;
    employment?: number;
    openings?: number;
    medianWage?: number;
  }[];

  // Occupation breakdown
  topOccupations: {
    title: string;
    demand: number;
    medianWage: number;
    occupation?: string;
    socCode?: string;
    employment?: number;
    openings?: number;
    growthProjection?: number; // 10-year projection
  }[];

  // Skills in demand
  topSkills: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// ECONOMIC IMPACT TYPES
// ===========================================

export interface EconomicImpactMetrics {
  id: string;
  partnerId: string;
  programId?: string;
  reportingPeriod: string;

  // Direct impacts
  totalWagesGenerated: number;
  averageWageGainPerParticipant: number;
  jobsCreated: number;
  jobsRetained: number;

  // Tax impacts
  estimatedTaxRevenue: number;
  federalTaxImpact: number;
  stateTaxImpact: number;
  localTaxImpact: number;

  // Economic multipliers
  economicMultiplier: number;
  totalEconomicImpact: number;

  // ROI
  programCosts: number;
  roiRatio: number;
  costPerPlacement: number;
  costPerCredential: number;

  // Reduction in public assistance (estimated)
  publicAssistanceReduction?: number;

  // Timestamps
  calculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface GovernmentDashboardMetrics {
  // Programs
  activePrograms: number;
  totalPrograms: number;
  chipsActPrograms: number;
  programsAtRisk: number;

  // Enrollment
  totalEnrolled: number;
  enrollmentThisQuarter: number;
  enrollmentTarget: number;
  enrollmentProgress: number; // percentage

  // Outcomes
  completedCount: number;
  placedCount: number;
  overallPlacementRate: number;
  placementTarget: number;

  // Wages
  averageWageGain: number;
  totalWagesGenerated: number;
  averageWageAtPlacement: number;

  // Veterans
  veteransEnrolled: number;
  veteransPlaced: number;
  veteransPlacementRate: number;

  // Employer partnerships
  activeEmployerPartners: number;
  hiringPledgesTotal: number;
  hiringPledgesFulfilled: number;

  // Compliance
  upcomingReports: number;
  overdueReports: number;
  complianceScore: number; // 0-100

  // Economic impact
  totalEconomicImpact: number;
  roiRatio: number;
}

export interface ProgramPerformance {
  programId: string;
  programName: string;
  programType: ProgramType;
  status: ProgramStatus;
  enrollmentProgress: number;
  placementRate: number;
  complianceStatus: string;
  daysUntilNextDeadline?: number;
}

// ===========================================
// FILTER TYPES
// ===========================================

export interface ProgramFilters {
  programType?: ProgramType;
  status?: ProgramStatus;
  fundingSource?: FundingSource;
  complianceStatus?: string;
  searchQuery?: string;
}

export interface ParticipantFilters {
  programId?: string;
  status?: ParticipantStatus;
  veteranStatus?: boolean;
  placed?: boolean;
  barriers?: BarrierType[];
  searchQuery?: string;
}

export interface EmployerFilters {
  programId?: string;
  status?: EmployerPartnershipStatus;
  commitmentType?: EmployerCommitmentType;
  industry?: string;
  searchQuery?: string;
}

export interface ReportFilters {
  programId?: string;
  reportType?: ReportType;
  status?: ReportStatus;
  overdue?: boolean;
  searchQuery?: string;
}
