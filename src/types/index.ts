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
  | 'manufacturing';

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
  description: string;
  type: EventType;
  date: string;
  endDate?: string;
  location: string;
  virtual: boolean;
  virtualUrl?: string;
  capacity: number;
  attendeesCount: number;
  organizer: string;
  industries: IndustryType[];
  image?: string;
  registrationDeadline: string;
  status: EventStatus;
}

export type EventType = 'conference' | 'job-fair' | 'networking' | 'workshop' | 'webinar' | 'hackathon';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'cancelled' | 'no-show';
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

export type EmployerType = 'industry' | 'government' | 'national-lab' | 'academia' | 'nonprofit';

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

// Challenge & Innovation Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  prize: number;
  deadline: string;
  categories: IndustryType[];
  requirements: string[];
  submissions: number;
  status: ChallengeStatus;
}

export type ChallengeStatus = 'open' | 'judging' | 'completed';

export interface Leaderboard {
  userId: string;
  userName: string;
  avatar?: string;
  organization: string;
  points: number;
  challengesWon: number;
  rank: number;
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
