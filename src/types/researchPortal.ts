// ===========================================
// UNIVERSITY RESEARCH REQUEST PORTAL - Type Definitions
// Enables universities to submit and manage K-12 research partnerships
// ===========================================

// Research Study Types
export type ResearchType =
  | 'quantitative'
  | 'qualitative'
  | 'mixed-methods'
  | 'action-research'
  | 'experimental'
  | 'quasi-experimental'
  | 'longitudinal'
  | 'cross-sectional'
  | 'case-study'
  | 'ethnographic'
  | 'survey'
  | 'meta-analysis';

export type ResearchFocus =
  | 'curriculum-instruction'
  | 'student-achievement'
  | 'assessment'
  | 'special-education'
  | 'english-learners'
  | 'early-childhood'
  | 'stem-education'
  | 'social-emotional'
  | 'school-climate'
  | 'teacher-development'
  | 'educational-technology'
  | 'equity-access'
  | 'policy'
  | 'administration'
  | 'parent-engagement'
  | 'health-wellness'
  | 'college-career'
  | 'other';

export type ResearchApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'additional-info-requested'
  | 'committee-review'
  | 'pending-irb'
  | 'school-review'
  | 'conditionally-approved'
  | 'approved'
  | 'denied'
  | 'withdrawn'
  | 'expired';

export type ResearchStudyStatus =
  | 'not-started'
  | 'recruiting'
  | 'active-data-collection'
  | 'data-collection-complete'
  | 'analysis-phase'
  | 'findings-submitted'
  | 'completed'
  | 'suspended'
  | 'terminated';

// ===========================================
// RESEARCHER & INSTITUTION
// ===========================================

export interface Researcher {
  id: string;

  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string; // Dr., Professor, etc.
  position: string; // Assistant Professor, Graduate Student, etc.

  // Institution
  institutionId: string;
  institution?: ResearchInstitution;
  department: string;
  facultyPage?: string;

  // Credentials
  orcidId?: string;
  googleScholarId?: string;
  researchGateId?: string;

  // Research Profile
  researchAreas: ResearchFocus[];
  publications?: Publication[];
  previousStudies?: PreviousStudySummary[];

  // Platform Status
  verificationStatus: 'pending' | 'verified' | 'suspended';
  citiTrainingCompleted: boolean;
  citiTrainingDate?: string;
  citiCertificateUrl?: string;

  // Track Record
  totalStudiesSubmitted: number;
  studiesApproved: number;
  studiesCompleted: number;
  complianceScore: number; // 0-100

  // Meta
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}

export interface ResearchInstitution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'research-institute' | 'think-tank' | 'government' | 'nonprofit';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  irbContact: {
    name: string;
    email: string;
    phone: string;
  };
  dataUseAgreementOnFile: boolean;
  duaExpirationDate?: string;
  federalwideAssuranceNumber?: string; // FWA number for IRB
  verificationStatus: 'pending' | 'verified' | 'suspended';
  createdAt: string;
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  peerReviewed: boolean;
}

export interface PreviousStudySummary {
  title: string;
  institution: string;
  year: number;
  participantCount: number;
  gradeLevel: string;
  outcome: 'completed' | 'terminated' | 'ongoing';
  findingsSummary?: string;
}

// ===========================================
// RESEARCH APPLICATION
// ===========================================

export interface ResearchApplication {
  id: string;
  applicationNumber: string; // e.g., "RES-2026-0042"

  // Researcher Information
  principalInvestigatorId: string;
  principalInvestigator?: Researcher;
  coInvestigators?: Researcher[];
  researchTeam?: ResearchTeamMember[];

  // Study Information
  title: string;
  shortDescription: string;
  fullDescription: string;
  researchType: ResearchType;
  researchFocus: ResearchFocus[];
  keywords: string[];

  // Research Questions
  researchQuestions: string[];
  hypotheses?: string[];
  objectives: string[];

  // Methodology
  methodology: ResearchMethodology;

  // Participant Information
  participantInfo: ParticipantInformation;

  // Data Collection
  dataCollection: DataCollectionPlan;

  // Timeline
  timeline: ResearchTimeline;

  // IRB Information
  irbInfo: IRBInformation;

  // Documents
  documents: ResearchDocument[];

  // District/School Selection
  targetDistricts: string[];
  targetSchools?: string[];
  schoolSelectionCriteria?: string;

  // Status & Review
  status: ResearchApplicationStatus;
  submittedAt?: string;
  currentReviewStage?: ReviewStage;
  reviewHistory: ReviewHistoryEntry[];

  // Approval
  approvalConditions?: string[];
  approvedAt?: string;
  approvedBy?: string;
  expirationDate?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface ResearchTeamMember {
  name: string;
  email: string;
  role: 'co-investigator' | 'research-assistant' | 'data-analyst' | 'consultant';
  institution: string;
  citiCertified: boolean;
  backgroundCheckCompleted: boolean;
}

export interface ResearchMethodology {
  design: ResearchType;
  approach: string; // Detailed methodology description
  instruments: ResearchInstrument[];
  dataAnalysisPlan: string;
  validityMeasures?: string;
  reliabilityMeasures?: string;
  limitations?: string;
}

export interface ResearchInstrument {
  name: string;
  type: 'survey' | 'interview' | 'observation' | 'assessment' | 'focus-group' | 'existing-data' | 'other';
  description: string;
  administrationMethod: 'online' | 'paper' | 'in-person' | 'phone' | 'mixed';
  estimatedDuration: number; // minutes
  validationStatus?: 'validated' | 'piloted' | 'new';
  attachmentUrl?: string;
}

export interface ParticipantInformation {
  // Target Population
  targetPopulation: string;
  gradelevels: string[];
  estimatedSampleSize: number;
  minimumSampleSize?: number;

  // Demographics
  demographicFocus?: string[];
  specialPopulations?: ('special-education' | 'english-learners' | 'gifted' | 'low-income' | 'title-i')[];

  // Recruitment
  recruitmentMethod: string;
  recruitmentMaterials?: string[];
  incentives?: {
    type: string;
    value?: number;
    description: string;
  };

  // Consent
  consentProcess: string;
  parentConsentRequired: boolean;
  studentAssentRequired: boolean;
  passiveConsentAllowed: boolean;
  consentFormUrl?: string;

  // Vulnerable Populations
  involvesMinors: boolean;
  involvesSpecialEducation: boolean;
  involvesMentalHealth: boolean;
  additionalProtections?: string;
}

export interface DataCollectionPlan {
  // Collection Details
  startDate: string;
  endDate: string;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  totalSessions?: number;

  // Data Types
  dataTypes: DataType[];
  existingDataRequested: boolean;
  existingDataDescription?: string;

  // Location & Timing
  collectionLocation: 'classroom' | 'school' | 'home' | 'online' | 'off-site' | 'mixed';
  instructionalTimeRequired: boolean;
  estimatedInstructionalMinutes?: number;

  // School Resources
  schoolResourcesNeeded?: string[];
  teacherInvolvementRequired: boolean;
  teacherInvolvementDescription?: string;

  // Recording
  audioRecording: boolean;
  videoRecording: boolean;
  photoCapture: boolean;
  recordingConsent?: string;
}

export type DataType =
  | 'survey-responses'
  | 'interview-transcripts'
  | 'observation-notes'
  | 'assessment-scores'
  | 'grades'
  | 'attendance'
  | 'demographic'
  | 'behavioral'
  | 'health'
  | 'iep-504'
  | 'discipline'
  | 'other';

export interface ResearchTimeline {
  phases: ResearchPhase[];
  keyMilestones: Milestone[];
  totalDuration: string; // "6 months", "1 year", etc.
  schoolYearSpan: string; // "2026-2027", "2026-2028"
}

export interface ResearchPhase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  activities: string[];
  deliverables?: string[];
}

export interface Milestone {
  name: string;
  date: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

export interface IRBInformation {
  irbApprovalStatus: 'not-submitted' | 'pending' | 'approved' | 'exempt' | 'expired' | 'modifications-required';
  irbProtocolNumber?: string;
  irbApprovalDate?: string;
  irbExpirationDate?: string;
  irbApprovalLetterUrl?: string;
  riskLevel: 'minimal' | 'moderate' | 'high';
  humanSubjectsProtection: boolean;
  ferpaCompliant: boolean;
  coppaCompliant?: boolean;
  additionalProtocols?: string[];
}

export interface ResearchDocument {
  id: string;
  type: ResearchDocumentType;
  name: string;
  description?: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

export type ResearchDocumentType =
  | 'irb-approval'
  | 'irb-protocol'
  | 'consent-form-parent'
  | 'consent-form-teacher'
  | 'assent-form-student'
  | 'recruitment-materials'
  | 'survey-instrument'
  | 'interview-protocol'
  | 'observation-protocol'
  | 'citi-certificate'
  | 'data-use-agreement'
  | 'conflict-of-interest'
  | 'research-proposal'
  | 'budget'
  | 'other';

// ===========================================
// REVIEW & APPROVAL WORKFLOW
// ===========================================

export type ReviewStage =
  | 'initial-screening'
  | 'compliance-review'
  | 'committee-review'
  | 'superintendent-review'
  | 'school-level-review'
  | 'final-approval';

export interface ReviewHistoryEntry {
  id: string;
  stage: ReviewStage;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  action: 'approved' | 'denied' | 'requested-changes' | 'escalated' | 'returned';
  comments: string;
  conditions?: string[];
  timestamp: string;
}

export interface ResearchReviewCommittee {
  id: string;
  districtId: string;
  name: string;
  description: string;
  members: CommitteeMember[];
  meetingSchedule: 'weekly' | 'biweekly' | 'monthly' | 'as-needed';
  nextMeetingDate?: string;
  reviewCriteria: ReviewCriteria[];
  createdAt: string;
}

export interface CommitteeMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'chair' | 'member' | 'ex-officio';
  title: string;
  department: string;
  expertise: string[];
  status: 'active' | 'inactive';
}

export interface ReviewCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage
  scoringRubric: {
    score: number;
    label: string;
    description: string;
  }[];
}

export interface ApplicationReview {
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewer?: CommitteeMember;
  stage: ReviewStage;

  // Scores
  criteriaScores: {
    criteriaId: string;
    score: number;
    comments: string;
  }[];
  overallScore: number;

  // Decision
  recommendation: 'approve' | 'approve-with-conditions' | 'deny' | 'request-changes' | 'defer';
  conditions?: string[];
  concerns?: string[];
  strengths?: string[];

  // Comments
  publicComments: string;
  privateComments?: string;

  // Meta
  submittedAt: string;
  status: 'draft' | 'submitted';
}

// ===========================================
// SCHOOL-LEVEL COORDINATION
// ===========================================

export interface SchoolResearchRequest {
  id: string;
  applicationId: string;
  application?: ResearchApplication;
  schoolId: string;
  schoolName: string;
  districtId: string;

  // Request Details
  requestedParticipants: number;
  gradeLevels: string[];
  estimatedTimeCommitment: string;
  schedulingNeeds: string;

  // School Response
  status: 'pending' | 'under-review' | 'approved' | 'denied' | 'withdrawn';
  principalReviewedAt?: string;
  principalDecision?: 'approved' | 'denied';
  principalComments?: string;

  // Capacity Assessment
  currentActiveStudies: number;
  researchBurdenScore: number; // 0-100
  capacityAvailable: boolean;
  capacityNotes?: string;

  // Coordination
  schoolCoordinator?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };

  // Teacher Participation
  teachersRequested: number;
  teachersConfirmed: number;
  teacherParticipants?: TeacherParticipant[];

  // Scheduling
  proposedDates?: string[];
  confirmedDates?: string[];
  dataCollectionSchedule?: DataCollectionSession[];

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface TeacherParticipant {
  teacherId: string;
  name: string;
  email: string;
  gradeLevel: string;
  subject?: string;
  consentGiven: boolean;
  consentDate?: string;
  status: 'invited' | 'confirmed' | 'declined' | 'withdrawn';
}

export interface DataCollectionSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  activity: string;
  participants: number;
  facilitator: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

// ===========================================
// FERPA DATA SHARING & COMPLIANCE
// ===========================================

export interface DataSharingRequest {
  id: string;
  applicationId: string;
  requesterId: string;
  requester?: Researcher;

  // Data Requested
  dataElements: DataElement[];
  deIdentificationLevel: 'full-pii' | 'limited-dataset' | 'de-identified' | 'aggregate-only';
  studentCount: number;
  gradeSpan: string;
  schoolIds: string[];

  // FERPA Justification
  ferpaExemption: FERPAExemption;
  ferpaJustification: string;

  // Data Use Agreement
  duaId?: string;
  dua?: DataUseAgreement;
  duaStatus: 'required' | 'pending' | 'active' | 'expired';

  // De-identification
  deIdentificationPlan?: DeIdentificationPlan;
  kAnonymityLevel?: number; // k-anonymity threshold
  reIdentificationRisk?: number; // 0-100

  // Secure Transfer
  transferMethod: 'secure-portal' | 'encrypted-file' | 'secure-api' | 'in-person';
  dataRoom?: SecureDataRoom;

  // Status
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'denied' | 'data-transferred' | 'closed';
  approvedAt?: string;
  approvedBy?: string;
  dataTransferredAt?: string;

  // Retention & Destruction
  retentionPeriod: string;
  destructionDate: string;
  destructionVerified: boolean;
  destructionVerifiedAt?: string;
  destructionCertificateUrl?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface DataElement {
  category: DataCategory;
  element: string;
  description: string;
  piiLevel: 'direct-identifier' | 'quasi-identifier' | 'sensitive' | 'non-sensitive';
  justification: string;
  approved: boolean;
}

export type DataCategory =
  | 'demographics'
  | 'enrollment'
  | 'attendance'
  | 'grades'
  | 'assessments'
  | 'discipline'
  | 'special-education'
  | 'english-learner'
  | 'health'
  | 'socioeconomic'
  | 'course-history'
  | 'teacher-student'
  | 'other';

export type FERPAExemption =
  | 'studies-exception' // 34 CFR 99.31(a)(6)
  | 'audit-exception' // 34 CFR 99.31(a)(3)
  | 'directory-information'
  | 'consent-obtained'
  | 'other-lawful-purpose';

export interface DataUseAgreement {
  id: string;
  applicationId: string;
  institutionId: string;
  districtId: string;

  // Agreement Details
  version: string;
  effectiveDate: string;
  expirationDate: string;
  autoRenewal: boolean;

  // Signatories
  institutionSignatory: {
    name: string;
    title: string;
    email: string;
    signedAt?: string;
    signature?: string;
  };
  districtSignatory: {
    name: string;
    title: string;
    email: string;
    signedAt?: string;
    signature?: string;
  };

  // Terms
  permittedUses: string[];
  prohibitedUses: string[];
  securityRequirements: string[];
  reportingRequirements: string[];
  breachNotificationProcedure: string;

  // Status
  status: 'draft' | 'pending-institution' | 'pending-district' | 'active' | 'expired' | 'terminated';

  // Documents
  agreementDocumentUrl: string;
  amendments?: {
    date: string;
    description: string;
    documentUrl: string;
  }[];

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface DeIdentificationPlan {
  method: 'suppression' | 'generalization' | 'perturbation' | 'synthetic' | 'hybrid';
  directIdentifiersRemoved: string[];
  quasiIdentifiersGeneralized: {
    field: string;
    generalizationLevel: string;
  }[];
  suppressionThreshold: number;
  kAnonymityTarget: number;
  lDiversityTarget?: number;
  tClosenessTarget?: number;
  validationMethod: string;
  validationResults?: {
    kAnonymityAchieved: number;
    reIdentificationRisk: number;
    informationLoss: number;
    validatedAt: string;
  };
}

export interface SecureDataRoom {
  id: string;
  applicationId: string;
  status: 'provisioning' | 'active' | 'suspended' | 'terminated';

  // Access
  accessUrl: string;
  authorizedUsers: {
    researcherId: string;
    name: string;
    email: string;
    role: 'owner' | 'analyst' | 'viewer';
    accessGrantedAt: string;
    lastAccessAt?: string;
  }[];

  // Data
  datasets: {
    id: string;
    name: string;
    description: string;
    recordCount: number;
    uploadedAt: string;
    expiresAt: string;
  }[];

  // Security
  encryptionStatus: 'encrypted-at-rest' | 'encrypted-in-transit' | 'full-encryption';
  mfaRequired: boolean;
  ipWhitelist?: string[];
  downloadRestricted: boolean;

  // Audit
  accessLogs: DataRoomAccessLog[];

  // Meta
  createdAt: string;
  expiresAt: string;
}

export interface DataRoomAccessLog {
  timestamp: string;
  userId: string;
  userName: string;
  action: 'login' | 'view-data' | 'run-query' | 'export' | 'download-attempt' | 'logout';
  details: string;
  ipAddress: string;
  userAgent: string;
  blocked?: boolean;
  blockReason?: string;
}

// ===========================================
// RESEARCH FINDINGS & KNOWLEDGE TRANSFER
// ===========================================

export interface ResearchFindings {
  id: string;
  applicationId: string;
  application?: ResearchApplication;

  // Study Completion
  studyCompletedDate: string;
  actualParticipantCount: number;
  dataCollectionSummary: string;

  // Findings
  executiveSummary: string;
  keyFindings: KeyFinding[];
  practitionerSummary: string; // AI-generated or researcher-written
  policyImplications?: string[];
  limitationsAndFuturework: string;

  // Publications
  publications?: Publication[];
  pendingPublications?: string[];
  presentationsGiven?: Presentation[];

  // Dissemination
  disseminationPlan: string;
  schoolsNotified: boolean;
  schoolsNotifiedAt?: string;
  districtBriefingCompleted: boolean;
  districtBriefingDate?: string;
  publicDissemination?: string;

  // Documents
  finalReportUrl: string;
  practitionerBriefUrl?: string;
  dataVisualizationsUrl?: string;
  supplementaryMaterialsUrl?: string;

  // Impact Tracking
  impactMetrics?: ImpactMetric[];
  adoptionStatus?: 'not-tracked' | 'no-adoption' | 'pilot-adoption' | 'partial-adoption' | 'full-adoption';
  adoptionNotes?: string;

  // Status
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'published';
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface KeyFinding {
  id: string;
  title: string;
  description: string;
  evidenceStrength: 'strong' | 'moderate' | 'suggestive' | 'inconclusive';
  practicalSignificance: 'high' | 'medium' | 'low';
  actionableRecommendation?: string;
  relatedDataVisualization?: string;
}

export interface Presentation {
  title: string;
  venue: string;
  date: string;
  type: 'conference' | 'workshop' | 'webinar' | 'district-briefing' | 'school-presentation';
  audience: string;
  slidesUrl?: string;
  recordingUrl?: string;
}

export interface ImpactMetric {
  name: string;
  baseline: number;
  current: number;
  change: number;
  changePercent: number;
  measurementDate: string;
  notes?: string;
}

// ===========================================
// DASHBOARD & ANALYTICS
// ===========================================

export interface ResearcherDashboardStats {
  // Applications
  totalApplications: number;
  pendingApplications: number;
  activeStudies: number;
  completedStudies: number;

  // Current Status
  applicationsAwaitingAction: number;
  upcomingDeadlines: {
    type: string;
    date: string;
    description: string;
  }[];

  // Compliance
  citiCertificationValid: boolean;
  citiExpirationDate?: string;
  duasRequiringRenewal: number;

  // Performance
  approvalRate: number;
  averageReviewTime: number; // days
  complianceScore: number;
}

export interface DistrictResearchDashboard {
  // Overview
  totalActiveStudies: number;
  pendingApplications: number;
  studentsParticipating: number;
  schoolsInvolved: number;

  // By Status
  applicationsByStatus: {
    status: ResearchApplicationStatus;
    count: number;
  }[];

  // By School
  studiesBySchool: {
    schoolId: string;
    schoolName: string;
    activeStudies: number;
    burdenScore: number;
  }[];

  // Research Burden
  overallBurdenScore: number;
  highBurdenSchools: string[];

  // Compliance
  expiringApprovals: number;
  overdueFindingsReports: number;
  dataDestructionPending: number;

  // Recent Activity
  recentApplications: ResearchApplication[];
  recentFindings: ResearchFindings[];
}

// ===========================================
// FORM DATA & FILTERS
// ===========================================

export interface ResearchApplicationFormData {
  // Step 1: Basic Info
  title: string;
  shortDescription: string;
  researchType: ResearchType | '';
  researchFocus: ResearchFocus[];
  researchQuestions: string[];
  objectives: string[];

  // Step 2: Team
  coInvestigatorIds: string[];
  teamMembers: Omit<ResearchTeamMember, 'backgroundCheckCompleted'>[];

  // Step 3: Methodology
  methodologyDesign: ResearchType | '';
  methodologyApproach: string;
  instruments: Omit<ResearchInstrument, 'attachmentUrl'>[];
  dataAnalysisPlan: string;

  // Step 4: Participants
  targetPopulation: string;
  gradeLevels: string[];
  estimatedSampleSize: number;
  specialPopulations: string[];
  recruitmentMethod: string;
  incentiveDescription: string;
  consentProcess: string;

  // Step 5: Data Collection
  dataCollectionStartDate: string;
  dataCollectionEndDate: string;
  dataTypes: DataType[];
  collectionLocation: string;
  instructionalTimeRequired: boolean;
  instructionalMinutes: number;
  teacherInvolvementRequired: boolean;
  teacherInvolvementDescription: string;
  recordingRequired: boolean;
  recordingTypes: ('audio' | 'video' | 'photo')[];

  // Step 6: Timeline
  totalDuration: string;
  phases: Omit<ResearchPhase, 'id'>[];

  // Step 7: IRB
  irbApprovalStatus: string;
  irbProtocolNumber: string;
  riskLevel: 'minimal' | 'moderate' | 'high' | '';
  ferpaCompliant: boolean;

  // Step 8: Schools
  targetDistricts: string[];
  targetSchools: string[];
  schoolSelectionCriteria: string;

  // Step 9: Documents
  documents: File[];

  // Step 10: Review
  additionalNotes: string;
}

export interface ResearchApplicationFilters {
  search?: string;
  status?: ResearchApplicationStatus[];
  researchType?: ResearchType[];
  researchFocus?: ResearchFocus[];
  institutionId?: string;
  districtId?: string;
  schoolId?: string;
  researcherId?: string; // Filter by researcher/principal investigator
  submittedFrom?: string;
  submittedTo?: string;
  reviewStage?: ReviewStage;
  riskLevel?: ('minimal' | 'moderate' | 'high')[];
}

export interface SchoolResearchFilters {
  schoolId?: string;
  status?: ('pending' | 'approved' | 'active' | 'completed')[];
  researchFocus?: ResearchFocus[];
  gradeLevels?: string[];
  dateFrom?: string;
  dateTo?: string;
}
