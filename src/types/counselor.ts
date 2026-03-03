// ===========================================
// School Counselor Types
// ===========================================
// Type definitions for the counselor portal
// Based on Naviance, Scoir, and ASCA best practices
// ===========================================

// ===========================================
// STUDENT STATUS & CASELOAD
// ===========================================

export type StudentStatus = 'on_track' | 'needs_attention' | 'critical';
export type GradeLevel = 9 | 10 | 11 | 12;

export interface CaseloadStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel: GradeLevel;
  gpa?: number;
  status: StudentStatus;
  profilePhotoUrl?: string;

  // Application progress
  collegeListCount: number;
  applicationsSubmitted: number;
  applicationsInProgress: number;

  // Key milestones
  essaysDrafted: number;
  essaysCompleted: number;
  recLettersRequested: number;
  recLettersReceived: number;
  testScoresSubmitted: boolean;
  transcriptRequested: boolean;
  fafsaStarted: boolean;
  fafsaCompleted: boolean;

  // Engagement
  lastActivity?: string;
  upcomingDeadline?: string;
  daysUntilNextDeadline?: number;
  missedDeadlines: number;

  // Notes and tags
  counselorNotes?: string;
  tags?: string[];
  assignedAt: string;
}

// ===========================================
// APPLICATION TRACKING (COUNSELOR VIEW)
// ===========================================

export type ApplicationStatus = 'not_started' | 'in_progress' | 'ready_for_review' | 'counselor_approved' | 'submitted' | 'complete';
export type ApplicationType = 'EA' | 'ED' | 'ED2' | 'REA' | 'RD';
export type SchoolTier = 'reach' | 'match' | 'safety';

export interface StudentApplication {
  id: string;
  studentId: string;
  studentName: string;
  schoolName: string;
  schoolLocation: string;
  applicationType: ApplicationType;
  tier: SchoolTier;
  deadline: string;
  status: ApplicationStatus;

  // Checklist items
  checklist: ApplicationChecklistItem[];
  completedItems: number;
  totalItems: number;
  completionPercent: number;

  // Counselor workflow
  studentSubmittedForReview?: string;
  counselorReviewedAt?: string;
  counselorApproved: boolean;
  counselorNotes?: string;
}

export interface ApplicationChecklistItem {
  id: string;
  category: 'essay' | 'test' | 'transcript' | 'recommendation' | 'financial' | 'supplement' | 'interview' | 'counselor_form';
  title: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'received' | 'verified';
  dueDate?: string;
  notes?: string;
  verifiedByCounselor?: boolean;
}

// ===========================================
// READINESS CONFIRMATION
// ===========================================

export interface ApplicationReadiness {
  id: string;
  studentId: string;
  applicationId: string;

  // Student side
  studentMarkedReady: boolean;
  studentSubmittedAt?: string;

  // Counselor side
  counselorReviewed: boolean;
  counselorReviewedAt?: string;
  counselorApproved: boolean;
  counselorFeedback?: string;

  // Checklist verification
  checklistVerification: {
    itemId: string;
    verified: boolean;
    notes?: string;
  }[];

  // Final status
  readyToSubmit: boolean;
  confirmedAt?: string;
}

// ===========================================
// NUDGES & COMMUNICATIONS
// ===========================================

export type NudgeType =
  | 'deadline_reminder'
  | 'missing_item'
  | 'encouragement'
  | 'action_required'
  | 'fafsa_reminder'
  | 'meeting_request'
  | 'general';

export type NudgeStatus = 'sent' | 'delivered' | 'read' | 'action_taken';

export interface CounselorNudge {
  id: string;
  counselorId: string;
  studentId: string;
  studentName: string;

  type: NudgeType;
  subject: string;
  message: string;

  // Delivery
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;

  // Response tracking
  status: NudgeStatus;
  actionTakenAt?: string;
  studentResponse?: string;

  // Related items
  relatedApplicationId?: string;
  relatedDeadline?: string;
  relatedSchoolName?: string;
}

export interface NudgeTemplate {
  id: string;
  type: NudgeType;
  name: string;
  subject: string;
  body: string;
  variables: string[]; // e.g., ['studentName', 'schoolName', 'deadline']
}

// ===========================================
// TASKS & ACTION ITEMS
// ===========================================

export type TaskType =
  | 'rec_letter_due'
  | 'meeting_scheduled'
  | 'review_application'
  | 'send_transcript'
  | 'follow_up'
  | 'deadline_check'
  | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface CounselorTask {
  id: string;
  counselorId: string;
  studentId?: string;
  studentName?: string;

  type: TaskType;
  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: string;
  completedAt?: string;

  // Related items
  relatedApplicationId?: string;
  relatedSchoolName?: string;

  createdAt: string;
  updatedAt: string;
}

// ===========================================
// REPORTS & ANALYTICS
// ===========================================

export interface CaseloadMetrics {
  totalStudents: number;
  byGrade: {
    grade9: number;
    grade10: number;
    grade11: number;
    grade12: number;
  };
  byStatus: {
    onTrack: number;
    needsAttention: number;
    critical: number;
  };
}

export interface ApplicationMetrics {
  totalApplications: number;
  submitted: number;
  inProgress: number;
  readyForReview: number;
  counselorApproved: number;

  byTier: {
    reach: number;
    match: number;
    safety: number;
  };

  byType: {
    EA: number;
    ED: number;
    ED2: number;
    REA: number;
    RD: number;
  };

  upcomingDeadlines: {
    next7Days: number;
    next14Days: number;
    next30Days: number;
  };
}

export interface FinancialAidMetrics {
  fafsaStarted: number;
  fafsaCompleted: number;
  cssProfileStarted: number;
  cssProfileCompleted: number;
  scholarshipsApplied: number;
}

export interface CounselorReport {
  id: string;
  name: string;
  description: string;
  type: 'caseload' | 'applications' | 'financial_aid' | 'outcomes' | 'deadlines';
  generatedAt: string;
  data: Record<string, unknown>;
}

// ===========================================
// COUNSELOR PROFILE
// ===========================================

export interface CounselorProfile {
  id: string;
  userId: string;
  schoolId: string;
  schoolName: string;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;

  // Caseload assignment
  assignedGrades: GradeLevel[];
  studentCount: number;

  // Settings
  notificationPreferences: {
    emailDigest: boolean;
    deadlineAlerts: boolean;
    studentActivityAlerts: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

// ===========================================
// SCHOOL CONFIGURATION
// ===========================================

export interface SchoolConfig {
  id: string;
  name: string;
  district?: string;
  state: string;

  // Deadlines
  transcriptLeadTime: number; // days before deadline to request
  recLetterLeadTime: number;

  // Workflow settings
  requireCounselorApproval: boolean;
  autoNudgeEnabled: boolean;
  autoNudgeDaysBefore: number;

  // Counselor assignments
  counselorCount: number;
  averageCaseloadSize: number;
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface CounselorDashboardData {
  profile: CounselorProfile;
  caseload: CaseloadStudent[];
  metrics: {
    caseload: CaseloadMetrics;
    applications: ApplicationMetrics;
    financialAid: FinancialAidMetrics;
  };
  pendingTasks: CounselorTask[];
  recentNudges: CounselorNudge[];
  upcomingDeadlines: StudentApplication[];
}
