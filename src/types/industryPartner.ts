// ===========================================
// Industry Partner Types
// Talent Pipeline, Internship, Recruiting
// ===========================================

// ===========================================
// CORE TYPES
// ===========================================

export type PartnerTier = 'starter' | 'growth' | 'enterprise';
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'cancelled';
export type PartnershipType = 'talent_pipeline' | 'corporate_sponsor' | 'apprenticeship_host' | 'curriculum_advisor';

export interface IndustryPartner {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  companySize: string;
  headquarters: string;
  website?: string;
  logoUrl?: string;
  description?: string;

  // Partnership details
  partnershipTypes: PartnershipType[];
  tier: PartnerTier;
  status: PartnerStatus;

  // Contact info
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactTitle?: string;

  // Billing
  stripeCustomerId?: string;
  subscriptionStatus: 'free' | 'active' | 'past_due' | 'cancelled' | 'trialing';

  // Timestamps
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// JOB POSTING TYPES
// ===========================================

export type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'filled';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'apprenticeship' | 'co_op';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type WorkLocation = 'onsite' | 'remote' | 'hybrid';

export interface JobPosting {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];

  // Classification
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workLocation: WorkLocation;
  department?: string;

  // Location
  city?: string;
  state?: string;
  country: string;
  remoteAllowed: boolean;

  // Compensation
  salaryMin?: number;
  salaryMax?: number;
  salaryType: 'hourly' | 'annual';
  showSalary: boolean;
  benefits?: string[];

  // Skills & requirements
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirement?: string;
  clearanceRequired?: string;

  // Posting details
  status: JobStatus;
  featured: boolean;
  applicationUrl?: string;
  applicationEmail?: string;

  // Stats
  viewCount: number;
  applicationCount: number;

  // Timestamps
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// CANDIDATE / TALENT PIPELINE TYPES
// ===========================================

export type CandidateStage = 'new' | 'reviewed' | 'screened' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
export type CandidateSource = 'platform' | 'career_fair' | 'university' | 'referral' | 'direct' | 'other';

export interface Candidate {
  id: string;
  partnerId: string;
  jobPostingId?: string;

  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;

  // Background
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
  }[];
  currentTitle?: string;
  currentCompany?: string;
  yearsOfExperience: number;

  // Skills
  skills: string[];
  certifications?: string[];

  // Pipeline tracking
  stage: CandidateStage;
  source: CandidateSource;
  sourceDetail?: string;
  fitScore?: number;

  // Notes & activity
  notes?: string;
  tags: string[];

  // Timestamps
  appliedAt: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateActivity {
  id: string;
  candidateId: string;
  activityType: 'stage_change' | 'note_added' | 'interview_scheduled' | 'offer_sent' | 'email_sent' | 'call_logged';
  description: string;
  metadata?: Record<string, unknown>;
  performedBy: string;
  createdAt: string;
}

// ===========================================
// INTERNSHIP / APPRENTICESHIP TYPES
// ===========================================

export type ProgramType = 'internship' | 'apprenticeship' | 'co_op' | 'fellowship';
export type ProgramStatus = 'planning' | 'recruiting' | 'active' | 'completed' | 'cancelled';

export interface WorkBasedProgram {
  id: string;
  partnerId: string;
  name: string;
  programType: ProgramType;
  description: string;

  // Program details
  department: string;
  location: string;
  isRemote: boolean;
  duration: string; // e.g., "12 weeks", "6 months"
  hoursPerWeek: number;
  isPaid: boolean;
  compensation?: number;
  compensationType?: 'hourly' | 'stipend' | 'salary';

  // Dates
  startDate: string;
  endDate: string;
  applicationDeadline: string;

  // Requirements
  requiredMajors?: string[];
  requiredSkills: string[];
  minimumGpa?: number;
  eligibilityRequirements?: string[];

  // Capacity
  totalPositions: number;
  filledPositions: number;

  // DOL Compliance (for apprenticeships)
  dolRegistered?: boolean;
  dolRegistrationNumber?: string;
  relatedTechnicalInstruction?: string;

  // Status
  status: ProgramStatus;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ProgramParticipant {
  id: string;
  programId: string;
  candidateId: string;

  // Assignment
  mentorId?: string;
  mentorName?: string;
  supervisorId?: string;
  supervisorName?: string;

  // Progress tracking
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: 'pending' | 'active' | 'completed' | 'terminated' | 'converted';

  // Evaluation
  midpointEvaluation?: {
    rating: number;
    feedback: string;
    evaluatedAt: string;
  };
  finalEvaluation?: {
    rating: number;
    feedback: string;
    evaluatedAt: string;
    recommendForHire: boolean;
  };

  // Conversion
  convertedToFullTime: boolean;
  conversionDate?: string;
  conversionRole?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// EVENT & CAREER FAIR TYPES
// ===========================================

export type EventType = 'career_fair' | 'info_session' | 'workshop' | 'hackathon' | 'campus_visit' | 'webinar';
export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface RecruitingEvent {
  id: string;
  partnerId: string;
  name: string;
  eventType: EventType;
  description?: string;

  // Event details
  format: 'virtual' | 'in_person' | 'hybrid';
  venue?: string;
  city?: string;
  state?: string;
  virtualLink?: string;

  // Timing
  startDateTime: string;
  endDateTime: string;
  timezone: string;

  // Registration
  maxRegistrations?: number;
  currentRegistrations: number;
  registrationDeadline?: string;

  // Sponsorship (if sponsored event)
  isSponsor: boolean;
  sponsorshipTier?: string;
  sponsorshipCost?: number;

  // Status
  status: EventStatus;

  // Stats
  attendeeCount?: number;
  leadsGenerated?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// UNIVERSITY RELATIONS TYPES
// ===========================================

export type RelationshipStatus = 'prospect' | 'outreach' | 'engaged' | 'partner' | 'inactive';

export interface UniversityRelationship {
  id: string;
  partnerId: string;
  institutionId?: string;
  institutionName: string;

  // Relationship details
  status: RelationshipStatus;
  partnershipType: 'recruiting' | 'curriculum_advisory' | 'research' | 'sponsorship' | 'general';

  // Contacts
  primaryContact?: {
    name: string;
    title: string;
    email: string;
    phone?: string;
  };

  // Programs of interest
  targetPrograms: string[];
  targetMajors: string[];

  // Activity tracking
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;

  // Metrics
  hiresFromInstitution: number;
  internsFromInstitution: number;
  eventsAttended: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// ANALYTICS & REPORTING TYPES
// ===========================================

export interface RecruitingMetrics {
  // Pipeline metrics
  totalCandidates: number;
  candidatesByStage: Record<CandidateStage, number>;
  candidatesBySource: Record<CandidateSource, number>;

  // Job metrics
  activeJobPostings: number;
  totalApplications: number;
  averageTimeToFill: number; // days

  // Hiring metrics
  hiresYTD: number;
  hiresVsGoal: number; // percentage
  costPerHire: number;

  // Intern/Apprentice metrics
  activeInterns: number;
  conversionRate: number;

  // Event metrics
  eventsAttended: number;
  leadsFromEvents: number;
  eventROI: number;
}

export interface SourcePerformance {
  source: CandidateSource;
  sourceName: string;
  applications: number;
  hires: number;
  conversionRate: number;
  costPerHire: number;
  averageTimeToHire: number;
}

// ===========================================
// EMPLOYER BRANDING TYPES
// ===========================================

export interface CompanyProfile {
  partnerId: string;

  // Basic info
  tagline?: string;
  aboutUs?: string;
  missionStatement?: string;

  // Media
  logoUrl?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  photos: string[];

  // Culture & benefits
  cultureHighlights: string[];
  perks: string[];
  techStack?: string[];

  // Social proof
  awards: {
    name: string;
    year: number;
    issuer: string;
  }[];
  pressFeatures?: {
    title: string;
    publication: string;
    url: string;
    date: string;
  }[];

  // Employee testimonials
  testimonials: {
    quote: string;
    authorName: string;
    authorTitle: string;
    authorPhoto?: string;
  }[];

  // DEI commitment
  deiStatement?: string;
  employeeResourceGroups?: string[];
  diversityStats?: {
    category: string;
    percentage: number;
  }[];

  // Timestamps
  updatedAt: string;
}

// ===========================================
// BILLING TYPES
// ===========================================

export interface IndustryPartnerSubscription {
  id: string;
  partnerId: string;
  tierId: PartnerTier;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing' | 'free';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface IndustryPricingTier {
  id: PartnerTier;
  name: string;
  stripePriceId: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    maxJobPostings: number;
    maxFeaturedJobs: number;
    maxCandidateSearches: number;
    maxInternshipPrograms: number;
    maxUniversityRelationships: number;
    canHostCareerFairs: boolean;
    canAccessCandidateDatabase: boolean;
    hasEmployerBranding: boolean;
    hasAdvancedAnalytics: boolean;
    hasApiAccess: boolean;
    hasDedicatedSupport: boolean;
    hasApprenticeshipManagement: boolean;
    hasCurriculumAdvisory: boolean;
  };
  highlighted?: boolean;
  popular?: boolean;
}

// ===========================================
// FILTER TYPES
// ===========================================

export interface JobFilters {
  status?: JobStatus[];
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  workLocation?: WorkLocation[];
  department?: string;
  search?: string;
}

export interface CandidateFilters {
  stage?: CandidateStage[];
  source?: CandidateSource[];
  jobPostingId?: string;
  minFitScore?: number;
  skills?: string[];
  tags?: string[];
  search?: string;
}

export interface ProgramFilters {
  programType?: ProgramType[];
  status?: ProgramStatus[];
  search?: string;
}
