// ===========================================
// Nonprofit Partner Types
// Workforce Development, STEM Education, DEI Orgs
// ===========================================

// ===========================================
// CORE TYPES
// ===========================================

export type PartnerTier = 'community' | 'impact' | 'coalition';
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'cancelled';
export type NonprofitType = 'workforce_development' | 'stem_education' | 'professional_association' | 'dei_organization' | 'other';

export interface NonprofitPartner {
  id: string;
  userId: string;
  organizationName: string;
  nonprofitType: NonprofitType;
  ein?: string; // Employer Identification Number
  mission: string;
  website?: string;
  logoUrl?: string;

  // Location
  city: string;
  state: string;
  serviceArea: string[]; // Regions/states served

  // Partnership details
  tier: PartnerTier;
  status: PartnerStatus;

  // Contact info
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactTitle?: string;

  // Organization size
  annualBudget?: string;
  staffCount?: number;
  volunteersCount?: number;

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

export type ProgramType = 'job_training' | 'career_services' | 'stem_education' | 'mentorship' | 'apprenticeship' | 'internship' | 'bootcamp' | 'other';
export type ProgramStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type FundingSource = 'federal_grant' | 'state_grant' | 'foundation' | 'corporate' | 'individual_donors' | 'earned_revenue' | 'other';

export interface Program {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  programType: ProgramType;

  // Program details
  targetPopulation: string[];
  eligibilityCriteria?: string;
  duration: string; // e.g., "12 weeks", "6 months"
  format: 'in_person' | 'virtual' | 'hybrid';
  location?: string;

  // Capacity
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;

  // Dates
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  isRollingAdmission: boolean;

  // Funding
  fundingSources: FundingSource[];
  grantIds?: string[];

  // Outcomes (for reporting)
  completionRate?: number;
  placementRate?: number;
  averageWageIncrease?: number;

  // Status
  status: ProgramStatus;
  featured: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// PARTICIPANT TYPES
// ===========================================

export type ParticipantStatus = 'intake' | 'enrolled' | 'active' | 'completed' | 'placed' | 'retained' | 'exited' | 'withdrawn';
export type BarrierType = 'transportation' | 'childcare' | 'housing' | 'digital_access' | 'language' | 'disability' | 'criminal_record' | 'education' | 'other';

export interface Participant {
  id: string;
  partnerId: string;
  programId?: string;

  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;

  // Demographics (for grant reporting)
  gender?: string;
  ethnicity?: string;
  veteranStatus?: boolean;
  disabilityStatus?: boolean;

  // Background
  educationLevel?: string;
  priorWageHourly?: number;
  employmentStatusAtIntake?: string;

  // Barriers (for case management)
  barriers: BarrierType[];
  barrierNotes?: string;

  // Journey tracking
  status: ParticipantStatus;
  intakeDate: string;
  enrollmentDate?: string;
  completionDate?: string;
  placementDate?: string;

  // Placement info
  placedEmployerId?: string;
  placedEmployerName?: string;
  placedJobTitle?: string;
  placedWageHourly?: number;

  // Retention tracking (30, 60, 90, 180 days)
  retention30Day?: boolean;
  retention60Day?: boolean;
  retention90Day?: boolean;
  retention180Day?: boolean;

  // Notes
  caseNotes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantMilestone {
  id: string;
  participantId: string;
  milestoneType: 'intake_complete' | 'training_started' | 'training_completed' | 'credential_earned' | 'interview' | 'job_offer' | 'placement' | 'retention_check' | 'other';
  title: string;
  description?: string;
  achievedDate: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ===========================================
// GRANT & FUNDING TYPES
// ===========================================

export type GrantStatus = 'prospecting' | 'applied' | 'awarded' | 'active' | 'reporting' | 'closed' | 'denied';

export interface Grant {
  id: string;
  partnerId: string;

  // Grant info
  name: string;
  funderName: string;
  funderType: 'federal' | 'state' | 'foundation' | 'corporate';
  grantNumber?: string;

  // Financials
  awardAmount?: number;
  disbursedAmount?: number;
  remainingAmount?: number;

  // Dates
  applicationDate?: string;
  awardDate?: string;
  startDate?: string;
  endDate?: string;
  reportingDeadlines?: string[];

  // Requirements
  targetEnrollment?: number;
  targetPlacements?: number;
  targetWageGoal?: number;
  targetRetentionRate?: number;

  // Actuals (for tracking)
  actualEnrollment?: number;
  actualPlacements?: number;
  actualAverageWage?: number;
  actualRetentionRate?: number;

  // Status
  status: GrantStatus;

  // Programs linked to this grant
  programIds: string[];

  // Notes
  notes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface GrantReport {
  id: string;
  grantId: string;
  partnerId: string;

  // Report details
  reportType: 'quarterly' | 'annual' | 'final' | 'interim' | 'custom';
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  dueDate: string;
  submittedDate?: string;

  // Data
  enrollmentCount: number;
  completionCount: number;
  placementCount: number;
  averageWage: number;
  retentionRate: number;

  // Narrative sections
  narrativeSummary?: string;
  challengesEncountered?: string;
  successStories?: string;

  // Status
  status: 'draft' | 'pending_review' | 'submitted' | 'accepted' | 'revision_requested';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// EMPLOYER CONNECTION TYPES
// ===========================================

export type EmployerRelationshipStatus = 'prospect' | 'outreach' | 'engaged' | 'partner' | 'inactive';

export interface EmployerConnection {
  id: string;
  partnerId: string;

  // Employer info
  employerName: string;
  employerId?: string; // Link to employer in system
  industry: string;
  companySize?: string;
  location: string;

  // Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTitle?: string;

  // Relationship
  status: EmployerRelationshipStatus;
  partnershipType: 'hiring' | 'mentorship' | 'sponsorship' | 'advisory' | 'multiple';

  // Activity
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;

  // Metrics
  participantsPlaced: number;
  participantsInterviewed: number;
  averageWagePlaced?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// COALITION TYPES
// ===========================================

export type CoalitionRole = 'lead' | 'member' | 'observer';

export interface Coalition {
  id: string;
  name: string;
  description: string;
  region: string;

  // Focus areas
  focusAreas: string[];
  targetPopulations: string[];

  // Membership
  leadOrganizationId: string;
  memberCount: number;

  // Activity
  activeGrants?: string[];
  sharedPrograms?: string[];

  // Status
  status: 'forming' | 'active' | 'dormant' | 'dissolved';

  // Timestamps
  formedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoalitionMembership {
  id: string;
  coalitionId: string;
  partnerId: string;
  role: CoalitionRole;
  joinedAt: string;
  dataShareConsent: boolean;
  consentDate?: string;
}

// ===========================================
// ANALYTICS & REPORTING TYPES
// ===========================================

export interface ImpactMetrics {
  // Participant metrics
  totalParticipants: number;
  activeParticipants: number;
  participantsByStatus: Record<ParticipantStatus, number>;
  participantsByProgram: Record<string, number>;

  // Outcome metrics
  completionRate: number;
  placementRate: number;
  averageWageIncrease: number;
  retentionRate30Day: number;
  retentionRate90Day: number;
  retentionRate180Day: number;

  // Financial metrics
  totalWagesGenerated: number;
  costPerPlacement: number;
  roiMultiplier: number;

  // Program metrics
  activePrograms: number;
  totalEnrollments: number;
  waitlistTotal: number;

  // Employer metrics
  activeEmployerPartners: number;
  totalPlacements: number;
  interviewsScheduled: number;

  // Grant metrics
  activeGrants: number;
  grantFundingTotal: number;
  upcomingReportDeadlines: number;
}

export interface DemographicBreakdown {
  category: string;
  count: number;
  percentage: number;
  placementRate: number;
  averageWage: number;
}

export interface SuccessStory {
  id: string;
  partnerId: string;
  participantId?: string;

  // Story content
  title: string;
  summary: string;
  fullStory?: string;

  // Metrics highlighted
  wageIncrease?: number;
  outcomeType: 'placement' | 'credential' | 'promotion' | 'entrepreneurship' | 'other';

  // Media
  photoUrl?: string;
  videoUrl?: string;

  // Permissions
  hasConsent: boolean;
  consentDate?: string;
  canUseExternally: boolean;

  // Usage tracking
  usedInReports?: string[];
  usedInMarketing?: boolean;

  // Status
  status: 'draft' | 'approved' | 'published';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// FILTER TYPES
// ===========================================

export interface ParticipantFilters {
  status?: ParticipantStatus;
  programId?: string;
  barriers?: BarrierType[];
  dateRange?: { start: string; end: string };
  searchQuery?: string;
}

export interface ProgramFilters {
  status?: ProgramStatus;
  programType?: ProgramType;
  fundingSource?: FundingSource;
  searchQuery?: string;
}

export interface GrantFilters {
  status?: GrantStatus;
  funderType?: Grant['funderType'];
  dateRange?: { start: string; end: string };
  searchQuery?: string;
}

export interface EmployerFilters {
  status?: EmployerRelationshipStatus;
  industry?: string;
  partnershipType?: EmployerConnection['partnershipType'];
  searchQuery?: string;
}
