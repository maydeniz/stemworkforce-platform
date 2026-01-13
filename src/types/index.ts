// ===========================================
// STEMWORKFORCE PLATFORM - Type Definitions
// ===========================================

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  clearanceLevel?: ClearanceLevel;
}

export type UserRole = 'intern' | 'jobseeker' | 'educator' | 'partner' | 'admin';

export interface UserPreferences {
  notifications: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
  theme: 'light' | 'dark' | 'system';
  industries: IndustryType[];
  locations: string[];
}

export type ClearanceLevel = 'none' | 'public-trust' | 'secret' | 'top-secret' | 'top-secret-sci';

// RBAC Types
export interface RBACConfig {
  canView: string[];
  canApply: boolean;
  canPost: boolean;
  canManageUsers: boolean;
  dashboardType: DashboardType;
  dataAccess: DataAccessLevel[];
}

export type DashboardType = 'learner' | 'educator' | 'partner' | 'admin';
export type DataAccessLevel = 'own' | 'students' | 'programs' | 'applicants' | 'postings' | '*';

// Industry Types
export type IndustryType = 
  | 'semiconductor'
  | 'nuclear'
  | 'ai'
  | 'quantum'
  | 'cybersecurity'
  | 'aerospace'
  | 'biotech'
  | 'robotics'
  | 'clean-energy'
  | 'manufacturing'
  | 'healthcare';

export interface Industry {
  id: IndustryType;
  name: string;
  icon: string;
  color: string;
  jobsCount: number;
  growth: number;
  description: string;
  topEmployers: string[];
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  type: JobType;
  industry: IndustryType;
  salary?: SalaryRange;
  clearance?: ClearanceLevel;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  applicantsCount: number;
  postedAt: string;
  expiresAt: string;
  status: JobStatus;
}

export type JobType = 'internship' | 'full-time' | 'part-time' | 'contract' | 'fellowship';
export type JobStatus = 'active' | 'closed' | 'draft' | 'expired';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  resume?: string;
  coverLetter?: string;
  notes?: string;
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';

// Event Types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: EventType;
  category: EventCategory;
  date: string;
  endDate?: string;
  timezone: string;
  location: string;
  venue?: EventVenue;
  virtual: boolean;
  virtualUrl?: string;
  virtualPlatform?: 'zoom' | 'teams' | 'webex' | 'meet' | 'custom';
  capacity: number;
  attendeesCount: number;
  waitlistCount: number;
  organizer: EventOrganizer;
  sponsors?: EventSponsor[];
  speakers?: EventSpeaker[];
  industries: IndustryType[];
  clearanceRequired?: ClearanceLevel;
  image?: string;
  bannerImage?: string;
  registrationDeadline: string;
  registrationFee: number;
  isFree: boolean;
  earlyBirdDeadline?: string;
  earlyBirdFee?: number;
  status: EventStatus;
  tags: string[];
  agenda?: EventAgendaItem[];
  relatedJobs?: string[]; // Job IDs
  relatedTrainings?: string[]; // Training program IDs
  recordingUrl?: string;
  slidesUrl?: string;
  materialsUrl?: string;
  createdAt: string;
  updatedAt: string;
  featuredRank?: number; // For homepage/featured events
}

export type EventType =
  | 'career-fair'
  | 'conference'
  | 'networking'
  | 'workshop'
  | 'webinar'
  | 'hackathon'
  | 'bootcamp'
  | 'info-session'
  | 'recruiting'
  | 'training'
  | 'panel'
  | 'meetup';

export type EventCategory =
  | 'career-events'
  | 'industry-conferences'
  | 'training-development'
  | 'partner-employer'
  | 'student-events'
  | 'clearance-events';

export type EventStatus = 'draft' | 'upcoming' | 'registration-closed' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  parkingInfo?: string;
  accessibilityInfo?: string;
}

export interface EventOrganizer {
  id: string;
  name: string;
  logo?: string;
  type: 'company' | 'university' | 'government' | 'nonprofit' | 'national-lab' | 'consortium' | 'professional-org';
  website?: string;
  contactEmail?: string;
}

export interface EventSponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  website?: string;
  boothNumber?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  photo?: string;
  bio?: string;
  linkedIn?: string;
  sessionTitle?: string;
  sessionTime?: string;
}

export interface EventAgendaItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  speaker?: EventSpeaker;
  location?: string;
  type: 'keynote' | 'session' | 'break' | 'networking' | 'workshop' | 'panel';
  track?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: EventRegistrationStatus;
  ticketType?: string;
  paymentStatus?: 'pending' | 'completed' | 'refunded' | 'waived' | 'free';
  paymentAmount?: number;
  checkedInAt?: string;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  questions?: Record<string, string>;
  reminderSent?: boolean;
  feedbackSubmitted?: boolean;
}

export type EventRegistrationStatus = 'registered' | 'waitlisted' | 'confirmed' | 'attended' | 'cancelled' | 'no-show';

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  wouldRecommend: boolean;
  contentRating?: number;
  organizationRating?: number;
  venueRating?: number;
  speakersRating?: number;
  networkingRating?: number;
  highlights?: string;
  improvements?: string;
  submittedAt: string;
}

// Event filter/search types
export interface EventFilters {
  search?: string;
  types?: EventType[];
  categories?: EventCategory[];
  industries?: IndustryType[];
  dateFrom?: string;
  dateTo?: string;
  virtual?: boolean;
  inPerson?: boolean;
  free?: boolean;
  clearanceRequired?: ClearanceLevel;
  location?: string;
  radius?: number;
  status?: EventStatus[];
}

export interface EventsQueryResult {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Training Types
export interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  description: string;
  duration: string;
  format: TrainingFormat;
  level: SkillLevel;
  industries: IndustryType[];
  skills: string[];
  cost: number;
  isFree: boolean;
  placementRate?: number;
  certificationType?: string;
  startDates: string[];
  enrollmentCount: number;
  rating: number;
  reviewsCount: number;
}

export type TrainingFormat = 'online' | 'in-person' | 'hybrid' | 'self-paced';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Location & Workforce Map Types
export interface StateData {
  id: string;
  name: string;
  abbreviation: string;
  totalJobs: number;
  topIndustry: IndustryType;
  growth: number;
  averageSalary: number;
  topEmployers: Employer[];
  trainingPrograms: number;
  universities: number;
  nationalLabs: string[];
}

export interface Employer {
  id: string;
  name: string;
  logo?: string;
  industry: IndustryType;
  type: EmployerType;
  openPositions: number;
  locations: string[];
  clearanceRequired: boolean;
}

export type EmployerType = 'industry' | 'government' | 'national-lab' | 'academia' | 'nonprofit' | 'healthcare';

// Healthcare-specific types
export type HealthcareComplianceLevel = 'none' | 'hipaa-basic' | 'hipaa-certified' | 'phi-access' | 'clinical-privileged' | 'dea-registered';

export type HealthcareCertification = 
  | 'rhit' | 'rhia' | 'cpc' | 'ccs' | 'chda' 
  | 'cahims' | 'cphims' | 'epic-certified' | 'cerner-certified' 
  | 'pmp-healthcare' | 'six-sigma-healthcare' | 'ccrc' | 'ccrp';

export type HealthcareJobCategory = 
  | 'health-it' | 'clinical-informatics' | 'medical-devices' 
  | 'healthcare-analytics' | 'telemedicine' | 'clinical-research'
  | 'revenue-cycle' | 'population-health' | 'healthcare-ai'
  | 'biomedical-engineering' | 'health-administration' | 'pharmacy-tech';

export interface HealthcareJob extends Job {
  healthcareCategory?: HealthcareJobCategory;
  complianceLevel?: HealthcareComplianceLevel;
  requiredCertifications?: HealthcareCertification[];
  clinicalExperience?: boolean;
  ehrSystem?: 'epic' | 'cerner' | 'meditech' | 'allscripts' | 'other';
  patientFacing?: boolean;
}

// Partner Types
export interface Partner {
  id: string;
  name: string;
  type: EmployerType;
  logo?: string;
  description: string;
  website: string;
  industries: IndustryType[];
  services: string[];
  painPoints: string[];
  outcomes: string[];
  features: string[];
  clearanceLevels: ClearanceLevel[];
  integrations: string[];
  contactEmail: string;
}

// ===========================================
// CHALLENGE & INNOVATION TYPES
// Comprehensive challenge system for employers/partners
// ===========================================

// Challenge Types
export type ChallengeType =
  | 'ideation'           // Concept/idea generation
  | 'prototype'          // Build working prototype
  | 'solution'           // Complete solution delivery
  | 'research'           // Research paper/analysis
  | 'hackathon'          // Time-bounded competition
  | 'grand-challenge';   // Multi-phase, large prize

// Solver Types
export type SolverType =
  | 'individual'         // Solo solvers
  | 'team'               // Formed teams (2-10 members)
  | 'small-business'     // Registered small businesses
  | 'academic'           // University/research groups
  | 'open';              // Any of the above

// Challenge Status
export type ChallengeStatus =
  | 'draft'
  | 'pending-approval'
  | 'registration-open'
  | 'active'
  | 'submission-closed'
  | 'judging'
  | 'winners-announced'
  | 'completed'
  | 'cancelled'
  // UI-friendly aliases
  | 'open'
  | 'upcoming'
  | 'evaluating';

// IP Assignment Options
export type IPAssignment =
  | 'sponsor'
  | 'solver'
  | 'shared'
  | 'negotiated'
  // UI-friendly aliases
  | 'solver-retains'
  | 'sponsor-owns'
  | 'licensed';

// Challenge Sponsor (Employer/Partner posting the challenge)
export interface ChallengeSponsor {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string; // Alias for logo
  type: 'company' | 'government' | 'national-lab' | 'university' | 'nonprofit' | 'consortium';
  website?: string;
  description?: string;
  contactEmail?: string;
  verified: boolean;
}

// Multi-phase structure (NASA Centennial model)
export interface ChallengePhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  order?: number; // Phase order/sequence number
  prizeAmount?: number;
  winnersCount?: number;
  status: 'upcoming' | 'active' | 'judging' | 'completed';
  requirements?: string[];
  deliverables?: string[];
}

// Eligibility criteria
export interface ChallengeEligibility {
  // Geographic
  countries?: string[];  // Empty = worldwide
  geographic?: string[]; // Alias for countries
  excludedCountries?: string[];

  // Demographics
  minAge?: number;
  studentOnly?: boolean;

  // Professional
  clearanceRequired?: ClearanceLevel;
  experienceLevel?: 'any' | 'student' | 'early-career' | 'experienced';
  experience?: string; // Alias for experienceLevel

  // Organizational
  employeeRestrictions?: string[];  // Company names excluded
  affiliationRequired?: string[];   // Must be affiliated with

  // Technical
  requiredSkills?: string[];
  requiredCertifications?: string[];
  certifications?: string[]; // Alias

  // Legal
  mustAcceptTerms?: boolean;
  ipAssignment?: IPAssignment;
  ndaRequired?: boolean;

  // Custom
  customRequirements?: string[];
  custom?: string[]; // Alias
}

// Deliverable types
export type DeliverableType = 'document' | 'code' | 'video' | 'prototype' | 'presentation' | 'dataset' | 'other';

// Challenge Deliverable
export interface ChallengeDeliverable {
  id: string;
  name: string;
  description: string;
  type: DeliverableType;
  required: boolean;
  maxFileSize?: number;  // bytes
  allowedFormats?: string[];
}

// Requirements for submission
export interface ChallengeRequirements {
  // Deliverables
  deliverables: ChallengeDeliverable[];

  // Technical
  technical?: string[]; // Simplified technical requirements list
  techStack?: string[];
  platformRequirements?: string[];

  // Documentation
  documentationRequired?: boolean;
  videoRequired?: boolean;
  videoDurationMax?: number;  // seconds

  // Presentation
  pitchRequired?: boolean;
  pitchDurationMax?: number;  // seconds

  // Code
  openSourceRequired?: boolean;
  repositoryRequired?: boolean;
}

// Resource types
export type ResourceType = 'dataset' | 'api' | 'documentation' | 'tutorial' | 'tool' | 'mentor' | 'credits';

// Resources provided to solvers
export interface ChallengeResource {
  id: string;
  name: string;
  title?: string; // Alias for name
  description: string;
  type: ResourceType;
  url?: string;
  accessInstructions?: string;
  restricted: boolean;  // Requires registration to access
}

// Award structure (HeroX/NASA model)
export interface ChallengeAward {
  id: string;
  rank: number;  // 1 = first place
  place?: number; // Alias for rank
  title: string;  // "Grand Prize", "Runner Up", etc.
  name?: string;  // Alias for title
  prizeAmount: number;
  cashAmount?: number; // Alias for prizeAmount
  description?: string;
  additionalBenefits?: string[];
  nonCashBenefits?: string[]; // Alias for additionalBenefits
  winnersCount: number;  // How many can win this tier
}

// Judging criteria
export interface JudgingCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;  // Percentage (all should sum to 100)
  maxScore: number;
  rubric?: JudgingRubricLevel[];
}

export interface JudgingRubricLevel {
  score: number;
  label: string;
  description: string;
}

// Main Challenge Interface
export interface Challenge {
  id: string;
  // Basic Info
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  problemStatement: string;
  type: ChallengeType;

  // Sponsor/Organizer
  sponsor: ChallengeSponsor;
  coSponsors?: ChallengeSponsor[];

  // Timeline (NASA multi-phase model)
  phases: ChallengePhase[];
  currentPhase: number;
  startDate?: string;
  endDate?: string; // Convenience alias
  registrationDeadline: string;
  submissionDeadline: string;
  judgingPeriod: { start: string; end: string };
  winnersAnnouncedDate: string;

  // Eligibility
  eligibility: ChallengeEligibility;

  // Requirements & Resources
  requirements: ChallengeRequirements;
  resources: ChallengeResource[];

  // Judging
  judgingCriteria: JudgingCriteria[];

  // Awards
  awards: ChallengeAward[];
  totalPrizePool: number;
  nonMonetaryBenefits: string[];

  // Solver Configuration
  solverTypes: SolverType[];
  teamSizeRange?: { min: number; max: number };
  maxSubmissionsPerSolver: number;

  // Categories & Tags
  industry?: IndustryType; // Primary industry (convenience)
  industries: IndustryType[];
  skills: string[];
  tags: string[];

  // Status & Metrics
  status: ChallengeStatus;
  submissionsCount: number;
  submissionCount?: number; // Alias
  registeredSolversCount: number;
  registrationCount?: number; // Alias
  teamsCount: number;
  viewsCount: number;

  // Settings
  visibility: 'public' | 'private' | 'invite-only';
  discussionEnabled: boolean;
  teamFormationEnabled: boolean;

  // Integrations
  slackChannelId?: string;
  slackChannelUrl?: string;

  // Images
  bannerImage?: string;
  thumbnailImage?: string;

  // IP Assignment
  ipAssignment?: IPAssignment;
  legalTermsUrl?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  featured?: boolean;
  featuredRank?: number;
}

// Solver registration
export interface ChallengeSolver {
  id: string;
  challengeId: string;
  userId: string;
  displayName?: string; // Display name for the solver
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    organization?: string;
  };
  type: 'individual' | 'team-member';
  solverType?: SolverType;
  teamId?: string;
  registeredAt: string;
  eligibilityVerified: boolean;
  agreedToTerms: boolean;
  status: 'registered' | 'active' | 'submitted' | 'disqualified' | 'withdrawn';
  skills?: string[];
}

// Team formation
export interface ChallengeTeam {
  id: string;
  challengeId: string;
  name: string;
  description?: string;
  leaderId: string;
  leader?: ChallengeSolver;
  members: ChallengeTeamMember[];
  memberCount?: number;
  maxMembers: number;
  maxSize?: number; // Alias for maxMembers
  isRecruiting: boolean;
  lookingForMembers?: boolean; // Alias for isRecruiting
  skillsNeeded?: string[];
  slackChannelId?: string;
  createdAt: string;
  status: 'forming' | 'complete' | 'active' | 'submitted' | 'disqualified';
}

export interface ChallengeTeamMember {
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  role: 'leader' | 'member';
  skills?: string[];
  joinedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

// Submission status
export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'passed-screening'
  | 'in-judging'
  | 'scored'
  | 'winner'
  | 'finalist'
  | 'rejected'
  | 'disqualified';

// Submission Deliverable
export interface SubmissionDeliverable {
  deliverableId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

// Challenge Submission
export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  phaseId?: string;
  solverId: string;  // Individual or team ID
  solverType: 'individual' | 'team';
  solver?: ChallengeSolver;
  team?: ChallengeTeam;

  // Content
  title: string;
  summary: string;
  description: string;
  technicalApproach?: string; // Detailed technical approach description

  // Deliverables
  deliverables: SubmissionDeliverable[];

  // Links
  repositoryUrl?: string;
  demoUrl?: string;
  videoUrl?: string;

  // AI Evaluation (automated pre-screening)
  aiEvaluation?: SubmissionAIEvaluation;

  // Meta
  submittedAt: string;
  updatedAt: string;
  version: number;  // Allow re-submissions
  status: SubmissionStatus;

  // Judging
  scores?: SubmissionScore[];
  finalScore?: number;
  rank?: number;
  feedback?: string;
}

// AI Evaluation for submissions (full evaluation)
export interface SubmissionAIEvaluation {
  eligibilityCheck: {
    passed: boolean;
    issues: string[];
  };
  completenessScore: number;  // 0-100
  qualityIndicators: {
    documentationQuality: number;
    codeQuality?: number;
    innovationSignals: number;
  };
  plagiarismScore: number;  // 0-100 (100 = likely plagiarized)
  aiConfidence: number;  // 0-100
  evaluatedAt: string;
  modelUsed: 'claude' | 'gemini' | 'chatgpt';
}

// Submission Score
export interface SubmissionScore {
  judgeId: string;
  judgeName?: string;
  criteriaId: string;
  criteriaName?: string;
  score: number;
  maxScore: number;
  comments?: string;
  scoredAt: string;
}

// Judge/Reviewer
export interface ChallengeJudge {
  id: string;
  challengeId: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    organization?: string;
  };
  role: 'screener' | 'judge' | 'lead-judge';
  expertise: string[];
  assignedSubmissions?: string[];
  status: 'invited' | 'confirmed' | 'declined' | 'active' | 'completed';
  conflictsOfInterest?: string[];  // Solver/team IDs to exclude
}

// Challenge Discussion/Comment
export interface ChallengeComment {
  id: string;
  challengeId: string;
  userId: string;
  authorName?: string; // Display name
  authorRole?: string; // Role label
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'solver' | 'sponsor' | 'mentor' | 'admin';
  };
  parentId?: string;  // For replies
  content: string;
  isPinned: boolean;
  isAnnouncement: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: ChallengeComment[];
}

// Challenge Announcement
export interface ChallengeAnnouncement {
  id: string;
  challengeId: string;
  title: string;
  content: string;
  type: 'info' | 'deadline' | 'update' | 'winner';
  createdAt: string;
  sentToSlack: boolean;
  sentToEmail: boolean;
}

// Challenge Filters
export interface ChallengeFilters {
  search?: string;
  types?: ChallengeType[];
  industries?: IndustryType[];
  solverTypes?: SolverType[];
  status?: ChallengeStatus[];
  prizeMin?: number;
  prizeMax?: number;
  deadlineFrom?: string;
  deadlineTo?: string;
  skills?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'deadline' | 'prize' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Challenge Query Result
export interface ChallengesQueryResult {
  challenges: Challenge[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Challenge Form Data (for creation wizard)
export interface ChallengeFormData {
  // Step 1: Basic Info
  title: string;
  shortDescription: string;
  description: string;
  problemStatement: string;
  type: ChallengeType | '';
  industry?: IndustryType; // Primary industry
  industries: IndustryType[];
  skills: string[];
  tags: string[];
  goals?: string[]; // Challenge goals/objectives

  // Step 2: Timeline
  startDate?: string; // Overall start date
  endDate?: string;   // Overall end date
  registrationDeadline: string;
  submissionDeadline: string;
  judgingStart: string;
  judgingEnd: string;
  winnersAnnouncedDate: string;
  phases: Omit<ChallengePhase, 'id'>[];

  // Step 3: Eligibility
  eligibility: Partial<ChallengeEligibility>;
  solverTypes: SolverType[];
  teamSizeMin: number;
  teamSizeMax: number;
  maxTeamSize?: number; // Alias for teamSizeMax
  maxSubmissionsPerSolver: number;
  ipAssignment?: IPAssignment;

  // Step 4: Requirements
  requirements?: {
    technical?: string[];
  }; // Technical requirements object
  deliverables: Omit<ChallengeDeliverable, 'id'>[];
  documentationRequired: boolean;
  videoRequired: boolean;
  videoDurationMax: number;
  repositoryRequired: boolean;
  openSourceRequired: boolean;
  techStack: string[];

  // Step 5: Resources
  resources: Omit<ChallengeResource, 'id'>[];

  // Step 6: Awards & Judging
  awards: Omit<ChallengeAward, 'id'>[];
  totalPrizePool?: number; // Calculated from awards
  nonMonetaryBenefits: string[];
  judgingCriteria: Omit<JudgingCriteria, 'id'>[];

  // Step 7: Settings
  visibility: 'public' | 'private' | 'invite-only';
  discussionEnabled: boolean;
  teamFormationEnabled: boolean;
  createSlackChannel: boolean;

  // Images
  bannerImage?: string;
  thumbnailImage?: string;

  // Display settings
  featured?: boolean;
}

// Leaderboard Entry
export interface Leaderboard {
  rank: number;
  odId: string;
  odName: string;
  avatar?: string;
  organization?: string;
  points: number;
  challengesWon: number;
  challengesParticipated: number;
  totalPrizeWon: number;
}

// AI Service Types
export type AIProvider = 'claude' | 'gemini' | 'chatgpt';

export interface AIServiceConfig {
  provider: AIProvider;
  enabled: boolean;
  apiKeyConfigured: boolean;
  apiEndpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIGenerationRequest {
  provider: AIProvider;
  prompt: string;
  context?: Record<string, unknown>;
  maxTokens?: number;
}

export interface AIGenerationResponse {
  success: boolean;
  content: string;
  provider: AIProvider;
  model?: string;
  tokensUsed: number;
  cached: boolean;
  error?: string;
  generatedAt?: string;
}

export interface AISubmissionEvaluation {
  overallScore: number;
  recommendation: 'accept' | 'reject' | 'review' | 'advance' | 'needs_revision';
  criteriaScores: {
    criteriaId?: string;
    criterionId?: string;
    criterionName?: string;
    criterion?: string;
    score: number;
    maxScore?: number;
    feedback: string;
  }[];
  strengths: string[];
  improvements: string[];
  summary: string;
  evaluatedAt?: string;
}

// Slack Integration Types
export interface SlackChannel {
  id: string;
  name: string;
  url: string;
  topic?: string;
  purpose?: string;
  isPrivate: boolean;
  memberCount?: number;
  createdAt: string;
}

export interface SlackNotification {
  channelId: string;
  message?: string;
  blocks?: SlackBlock[];
  threadTs?: string;
  type?: string;
  title?: string;
  text?: string;
  fields?: { label?: string; title?: string; value: string; short?: boolean }[];
  actions?: { label?: string; text?: string; url: string; style?: string }[];
  metadata?: Record<string, unknown>;
}

export interface SlackBlock {
  type: 'section' | 'divider' | 'header' | 'context' | 'actions';
  text?: {
    type: 'plain_text' | 'mrkdwn';
    text: string;
    emoji?: boolean;
  };
  fields?: { type: 'mrkdwn' | 'plain_text'; text: string }[];
  accessory?: Record<string, unknown>;
  elements?: Record<string, unknown>[];
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  highlighted: boolean;
  targetAudience: 'jobseeker' | 'employer';
  limits: PlanLimits;
}

export interface PlanLimits {
  jobPostings?: number;
  applications?: number;
  savedJobs?: number;
  teamMembers?: number;
  analytics?: boolean;
  prioritySupport?: boolean;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface SearchFilters {
  query?: string;
  industries?: IndustryType[];
  locations?: string[];
  remote?: boolean;
  clearance?: ClearanceLevel[];
  jobTypes?: JobType[];
  salaryMin?: number;
  salaryMax?: number;
  postedAfter?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Audit Types
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  sessionId: string;
  details: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error';
  userAgent: string;
  ip?: string;
  url: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'application' | 'event' | 'system';

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
}

export interface JobApplicationForm {
  resumeUrl: string;
  coverLetter?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  availability: string;
  expectedSalary?: number;
  referral?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalJobs: number;
  activeApplications: number;
  savedJobs: number;
  upcomingEvents: number;
  completedTrainings: number;
  profileViews: number;
  matchScore: number;
}

export interface PartnerDashboardStats {
  activePostings: number;
  totalApplications: number;
  hiredCount: number;
  pendingReviews: number;
  averageTimeToHire: number;
  profileViews: number;
}

// Consultation Request Types
export type OrganizationType = 'startup' | 'smb' | 'enterprise' | 'government' | 'nonprofit' | 'academic';
export type BudgetRange = 'under-50k' | '50k-100k' | '100k-250k' | '250k-500k' | 'over-500k';
export type ConsultationTimeline = 'asap' | '1-3-months' | '3-6-months' | '6-12-months' | 'flexible';
export type EngagementType = 'advisory' | 'implementation' | 'training' | 'audit' | 'custom';
export type ConsultationStatus = 'submitted' | 'reviewing' | 'matched' | 'in-progress' | 'completed';

export interface ConsultationRequest {
  id: string;
  userId: string;
  // Organization
  organizationName: string;
  organizationType: OrganizationType;
  organizationSize: string;
  industry: IndustryType;
  // Request Details
  serviceType: string;
  needsDescription: string;
  challenges: string[];
  desiredOutcomes: string[];
  // Scope
  budgetRange: BudgetRange;
  timeline: ConsultationTimeline;
  teamSize: string;
  engagementType: EngagementType;
  // Meta
  additionalNotes?: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRequestFormData {
  // Step 1: Organization
  organizationName: string;
  organizationType: OrganizationType | '';
  organizationSize: string;
  industry: IndustryType | '';
  // Step 2: Details
  serviceType: string;
  needsDescription: string;
  challenges: string[];
  desiredOutcomes: string[];
  // Step 3: Scope
  budgetRange: BudgetRange | '';
  timeline: ConsultationTimeline | '';
  teamSize: string;
  engagementType: EngagementType | '';
  // Step 4: Review
  additionalNotes: string;
}
