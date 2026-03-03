// ===========================================
// National Labs Partner Types
// DOE Labs, FFRDCs, University Research Centers
// ===========================================

// ===========================================
// CORE TYPES
// ===========================================

export type LabPartnerTier = 'research' | 'lab' | 'enterprise';
export type LabPartnerStatus = 'pending' | 'active' | 'suspended' | 'cancelled';
export type LabType = 'doe_national_lab' | 'ffrdc' | 'university_research' | 'industry_rd' | 'other';

export interface NationalLabsPartner {
  id: string;
  userId: string;
  organizationName: string;
  labType: LabType;
  labCode?: string; // e.g., ORNL, LANL, SNL

  // Location
  city: string;
  state: string;
  facility?: string;

  // Partnership details
  tier: LabPartnerTier;
  status: LabPartnerStatus;

  // Contact info
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactTitle?: string;

  // Organization details
  employeeCount?: number;
  clearanceTypes: ClearanceType[];
  researchAreas: string[];

  // Billing
  stripeCustomerId?: string;
  subscriptionStatus: 'free' | 'active' | 'past_due' | 'cancelled' | 'trialing';

  // Timestamps
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// CLEARANCE TYPES
// ===========================================

export type ClearanceType = 'public_trust' | 'l_clearance' | 'q_clearance' | 'ts' | 'ts_sci' | 'none';
export type ClearanceStatus = 'not_started' | 'sf86_submitted' | 'investigation' | 'adjudication' | 'granted' | 'denied' | 'revoked' | 'expired';
export type CitizenshipStatus = 'us_citizen' | 'permanent_resident' | 'visa_holder' | 'non_us' | 'unknown';

export interface ClearanceCandidate {
  id: string;
  partnerId: string;
  positionId?: string;

  // Candidate info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  // Clearance eligibility
  citizenshipStatus: CitizenshipStatus;
  birthCountry?: string;
  dualCitizenship: boolean;
  foreignContacts: boolean;
  foreignTravel: boolean;
  financialIssues: boolean;
  criminalHistory: boolean;
  drugUse: boolean;

  // Pre-screening results
  sf86ReadinessScore: number; // 0-100
  eligibilityAssessment: 'eligible' | 'conditional' | 'high_risk' | 'ineligible';
  riskFactors: string[];
  recommendations: string[];

  // Clearance tracking
  targetClearanceType: ClearanceType;
  currentClearanceStatus: ClearanceStatus;
  sf86SubmittedDate?: string;
  investigationStartDate?: string;
  adjudicationDate?: string;
  clearanceGrantedDate?: string;
  clearanceExpirationDate?: string;

  // Timestamps
  screenedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClearancePosition {
  id: string;
  partnerId: string;
  title: string;
  department?: string;
  division?: string;

  // Clearance requirements
  requiredClearance: ClearanceType;
  polygraphRequired: boolean;
  citizenshipRequired: boolean;
  exportControlled: boolean;

  // Position details
  description: string;
  requirements: string[];
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;

  // Status
  status: 'draft' | 'open' | 'filled' | 'closed';
  openings: number;
  filledCount: number;

  // Pipeline
  candidatesTotal: number;
  candidatesScreened: number;
  candidatesEligible: number;
  candidatesInProcess: number;

  // Metrics
  averageTimeToFill?: number; // days
  averageTimeToScreen?: number; // days

  // Timestamps
  postedDate?: string;
  closedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// FELLOWSHIP TYPES
// ===========================================

export type FellowshipType = 'suli' | 'scgsr' | 'cci' | 'nsf_grfp' | 'doe_nnsa' | 'postdoc' | 'internship' | 'lab_specific' | 'other';
export type FellowshipStatus = 'draft' | 'active' | 'accepting' | 'closed' | 'completed' | 'archived';
export type FellowStatus = 'applied' | 'accepted' | 'active' | 'completed' | 'converted' | 'withdrawn' | 'terminated';

export interface FellowshipProgram {
  id: string;
  partnerId: string;
  name: string;
  programType: FellowshipType;
  description: string;

  // Program details
  duration: string; // e.g., "10 weeks", "12 months"
  isPaid: boolean;
  stipendAmount?: number;
  housingProvided: boolean;
  relocationAssistance: boolean;

  // Eligibility
  citizenshipRequired: boolean;
  clearanceRequired?: ClearanceType;
  educationLevels: string[]; // e.g., ['undergraduate', 'graduate', 'postdoc']
  majorsPreferred: string[];
  gpaMinimum?: number;

  // Dates
  applicationDeadline?: string;
  programStartDate?: string;
  programEndDate?: string;

  // Capacity
  totalSlots: number;
  filledSlots: number;
  waitlistCount: number;

  // Conversion tracking
  conversionTarget?: number; // % target
  historicalConversionRate?: number;

  // Status
  status: FellowshipStatus;
  featured: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Fellow {
  id: string;
  partnerId: string;
  programId: string;

  // Fellow info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  // Background
  university: string;
  major: string;
  degree: string; // e.g., 'BS', 'MS', 'PhD'
  graduationDate?: string;
  gpa?: number;

  // Assignment
  mentorId?: string;
  mentorName?: string;
  department?: string;
  projectTitle?: string;
  projectDescription?: string;

  // Status tracking
  status: FellowStatus;
  startDate?: string;
  endDate?: string;
  completionDate?: string;

  // Evaluation
  midtermEvaluation?: number; // 1-5
  finalEvaluation?: number; // 1-5
  mentorFeedback?: string;

  // Conversion
  receivedOffer: boolean;
  acceptedOffer: boolean;
  conversionDate?: string;
  conversionPositionId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// RESEARCH COLLABORATION TYPES
// ===========================================

export type CollaborationType = 'joint_research' | 'consulting' | 'licensing' | 'crada' | 'user_facility' | 'subcontract' | 'other';
export type CollaborationStatus = 'prospecting' | 'negotiating' | 'active' | 'completed' | 'terminated';

export interface PrincipalInvestigator {
  id: string;
  partnerId: string;
  userId?: string;

  // PI info
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string;
  division?: string;

  // Research profile
  researchAreas: string[];
  keywords: string[];
  publications: number;
  hIndex?: number;
  orcidId?: string;
  googleScholarId?: string;

  // Looking for
  seekingCollaborations: boolean;
  collaborationInterests: string[];
  seekingStudents: boolean;
  availableProjects: number;

  // Bio
  biography?: string;
  photoUrl?: string;
  website?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ResearchCollaboration {
  id: string;
  partnerId: string;
  piId: string;

  // Collaboration details
  title: string;
  description: string;
  collaborationType: CollaborationType;

  // External partner
  externalOrganization: string;
  externalOrganizationType: 'university' | 'industry' | 'government' | 'nonprofit' | 'other';
  externalContactName: string;
  externalContactEmail: string;

  // Dates
  startDate?: string;
  endDate?: string;
  contractNumber?: string;

  // Funding
  fundingSource?: string;
  fundingAmount?: number;

  // Status
  status: CollaborationStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// COMPLIANCE TYPES
// ===========================================

export type ExportControlType = 'itar' | 'ear' | 'none' | 'pending_review';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'exception_granted';

export interface ComplianceRecord {
  id: string;
  partnerId: string;
  recordType: 'candidate' | 'position' | 'project' | 'collaboration';
  recordId: string;

  // Export control
  exportControlType: ExportControlType;
  itarControlled: boolean;
  earControlled: boolean;
  eccn?: string; // Export Control Classification Number

  // Citizenship verification
  citizenshipVerified: boolean;
  citizenshipVerificationDate?: string;
  citizenshipVerificationMethod?: string;

  // Compliance assessment
  complianceStatus: ComplianceStatus;
  complianceNotes?: string;
  exceptionReason?: string;
  exceptionApprovedBy?: string;
  exceptionApprovedDate?: string;

  // Audit trail
  lastReviewDate?: string;
  nextReviewDate?: string;
  reviewedBy?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAuditLog {
  id: string;
  partnerId: string;
  complianceRecordId?: string;

  // Action details
  action: string;
  actionType: 'create' | 'update' | 'review' | 'approve' | 'reject' | 'exception';
  performedBy: string;
  performedAt: string;

  // Details
  previousValue?: string;
  newValue?: string;
  notes?: string;

  // Timestamps
  createdAt: string;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface LabDashboardMetrics {
  // Positions
  activeOpenings: number;
  totalOpenings: number;
  positionsFilled: number;
  averageTimeToFill: number;

  // Pipeline
  pipelineSize: number;
  candidatesScreened: number;
  candidatesEligible: number;
  candidatesInProcess: number;

  // Clearance breakdown
  clearanceByType: Record<ClearanceType, number>;
  clearanceByStatus: Record<ClearanceStatus, number>;
  averageScreeningTime: number;

  // Fellowships
  activeFellowships: number;
  totalFellows: number;
  fellowsInProgress: number;
  conversionRate: number;

  // Research
  activePIs: number;
  activeCollaborations: number;
  pendingCollaborations: number;

  // Compliance
  complianceRecordsTotal: number;
  complianceIssues: number;
  pendingReviews: number;
}

export interface ClearancePipelineStage {
  stage: string;
  count: number;
  percentage: number;
  averageDaysInStage: number;
}

export interface TimeToFillByLevel {
  clearanceType: ClearanceType;
  averageDays: number;
  positionCount: number;
}

// ===========================================
// FILTER TYPES
// ===========================================

export interface ClearanceCandidateFilters {
  targetClearanceType?: ClearanceType;
  currentStatus?: ClearanceStatus;
  citizenshipStatus?: CitizenshipStatus;
  eligibilityAssessment?: ClearanceCandidate['eligibilityAssessment'];
  positionId?: string;
  searchQuery?: string;
}

export interface PositionFilters {
  status?: ClearancePosition['status'];
  requiredClearance?: ClearanceType;
  exportControlled?: boolean;
  searchQuery?: string;
}

export interface FellowshipFilters {
  programType?: FellowshipType;
  status?: FellowshipStatus;
  clearanceRequired?: ClearanceType;
  searchQuery?: string;
}

export interface FellowFilters {
  programId?: string;
  status?: FellowStatus;
  receivedOffer?: boolean;
  searchQuery?: string;
}

export interface PIFilters {
  department?: string;
  seekingCollaborations?: boolean;
  seekingStudents?: boolean;
  researchArea?: string;
  searchQuery?: string;
}
