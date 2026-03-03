// ===========================================
// STAFF MANAGEMENT HR SYSTEM TYPES
// ===========================================

// ============ HIRING & RECRUITMENT ============

export type RequisitionStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'open'
  | 'filled'
  | 'cancelled';

export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'phone_screen'
  | 'interview'
  | 'final_interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type BackgroundCheckStatus =
  | 'not_started'
  | 'pending'
  | 'in_progress'
  | 'passed'
  | 'failed';

export interface InternDetails {
  programDuration: string;  // e.g., "12 weeks", "Summer 2025"
  schoolPartner?: string;
  stipendAmount?: number;
  academicCredit: boolean;
  supervisorId?: string;
  supervisorName?: string;
  projectDescription?: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  hiringManagerId: string;
  hiringManagerName?: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  location: string;
  remoteAllowed: boolean;
  status: RequisitionStatus;
  approvalChain: ApprovalStep[];
  positionsToFill: number;
  positionsFilled: number;
  targetStartDate: string;
  applicationDeadline?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isPublished: boolean;  // Show on public careers page
  publishedAt?: string;
  internDetails?: InternDetails;
  tags?: string[];
  createdAt: string;
}

export interface ApprovalStep {
  approverId: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

export interface Candidate {
  id: string;
  requisitionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedInUrl?: string;
  source: string;
  referrerId?: string;
  appliedAt: string;
  stage: CandidateStage;
  interviews: Interview[];
  offerStatus?: OfferStatus;
  offerDetails?: OfferDetails;
  backgroundCheckStatus: BackgroundCheckStatus;
  notes?: string;
  rejectionReason?: string;
}

export interface Interview {
  id: string;
  date: string;
  type: 'phone' | 'video' | 'onsite' | 'panel';
  interviewers: string[];
  notes?: string;
  rating?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export type OfferStatus =
  | 'pending'
  | 'extended'
  | 'accepted'
  | 'declined'
  | 'expired';

export interface OfferDetails {
  salary: number;
  startDate: string;
  signOnBonus?: number;
  relocation?: number;
  equityOptions?: number;
  expiresAt: string;
}

// ============ ONBOARDING ============

export type OnboardingStatus =
  | 'not_started'
  | 'preboarding'
  | 'day1'
  | 'in_progress'
  | 'completed';

export type DocumentStatus =
  | 'pending'
  | 'uploaded'
  | 'verified'
  | 'rejected';

export interface OnboardingProgram {
  id: string;
  name: string;
  description: string;
  departmentId?: string;
  roleType?: string;
  phases: OnboardingPhase[];
  isActive: boolean;
}

export interface OnboardingPhase {
  id: string;
  name: string;
  durationDays: number;
  tasks: OnboardingTask[];
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'document' | 'training' | 'meeting' | 'setup' | 'other';
  assignee: 'new_hire' | 'manager' | 'hr' | 'it';
  required: boolean;
  dueOffset: number;
}

export interface StaffOnboarding {
  id: string;
  staffId: string;
  staffName?: string;
  programId: string;
  startDate: string;
  targetCompletionDate: string;
  completedAt?: string;
  status: OnboardingStatus;
  currentPhase: number;
  progressPercent: number;
  mentorId?: string;
  mentorName?: string;
  buddyId?: string;
  buddyName?: string;
  documents: OnboardingDocument[];
  i9Status: DocumentStatus;
  w4Status: DocumentStatus;
  directDepositStatus: DocumentStatus;
  day1Checklist: ChecklistItem[];
  equipmentIssued: EquipmentItem[];
  accessProvisioned: AccessItem[];
  requiredTrainings: TrainingRequirement[];
}

export interface OnboardingDocument {
  type: 'i9' | 'w4' | 'direct_deposit' | 'nda' | 'handbook_ack' | 'other';
  status: DocumentStatus;
  uploadedAt?: string;
  verifiedBy?: string;
  url?: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface EquipmentItem {
  item: string;
  serialNumber?: string;
  issuedAt: string;
  returnedAt?: string;
}

export interface AccessItem {
  system: string;
  accessLevel: string;
  provisionedAt: string;
  revokedAt?: string;
}

export interface TrainingRequirement {
  trainingId: string;
  trainingName: string;
  dueDate: string;
  completedAt?: string;
  score?: number;
}

// ============ TIME & ATTENDANCE ============

export type TimesheetStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected';

export type LeaveType =
  | 'vacation'
  | 'sick'
  | 'personal'
  | 'bereavement'
  | 'jury_duty'
  | 'parental'
  | 'unpaid';

export type LeaveStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'cancelled';

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'half_day'
  | 'remote'
  | 'holiday'
  | 'leave';

export interface Timesheet {
  id: string;
  staffId: string;
  staffName?: string;
  periodStart: string;
  periodEnd: string;
  weekNumber: number;
  year: number;
  status: TimesheetStatus;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  regularHours: number;
  overtimeHours: number;
  entries: TimesheetEntry[];
}

export interface TimesheetEntry {
  id: string;
  entryDate: string;
  startTime?: string;
  endTime?: string;
  breakMinutes: number;
  hoursWorked: number;
  entryType: 'regular' | 'overtime' | 'holiday' | 'sick' | 'pto';
  projectId?: string;
  taskDescription?: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  hoursRequested: number;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  denialReason?: string;
  notes?: string;
  createdAt: string;
}

export interface LeaveBalance {
  staffId: string;
  year: number;
  vacationAccrued: number;
  vacationUsed: number;
  vacationPending: number;
  vacationAvailable: number;
  sickAccrued: number;
  sickUsed: number;
  sickAvailable: number;
  personalAccrued: number;
  personalUsed: number;
  personalAvailable: number;
  carryoverVacation: number;
  carryoverExpiry?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  recordDate: string;
  status: AttendanceStatus;
  clockIn?: string;
  clockOut?: string;
  scheduledStart?: string;
  lateMinutes: number;
  notes?: string;
}

// ============ PERFORMANCE MANAGEMENT ============

export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ReviewCycleStatus =
  | 'draft'
  | 'active'
  | 'in_calibration'
  | 'completed';

export type ReviewType =
  | 'self'
  | 'manager'
  | 'peer'
  | 'upward';

export type ReviewStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'acknowledged';

export interface PerformanceGoal {
  id: string;
  staffId: string;
  staffName?: string;
  title: string;
  description: string;
  category: 'professional' | 'technical' | 'leadership' | 'personal';
  startDate: string;
  targetDate: string;
  completedAt?: string;
  status: GoalStatus;
  progressPercent: number;
  keyResults: KeyResult[];
  reviewCycleId?: string;
  managerId?: string;
  parentGoalId?: string;
}

export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit?: string;
  completed: boolean;
}

export interface ReviewCycle {
  id: string;
  name: string;
  cycleType: 'quarterly' | 'semi_annual' | 'annual';
  periodStart: string;
  periodEnd: string;
  selfReviewDue: string;
  managerReviewDue: string;
  calibrationDate: string;
  finalizationDate: string;
  status: ReviewCycleStatus;
  reviewTemplate: ReviewQuestion[];
  ratingScale: RatingLevel[];
}

export interface ReviewQuestion {
  id: string;
  section: string;
  question: string;
  type: 'text' | 'rating' | 'competency';
  required: boolean;
}

export interface RatingLevel {
  value: number;
  label: string;
  description: string;
}

export interface PerformanceReview {
  id: string;
  cycleId: string;
  cycleName?: string;
  staffId: string;
  staffName?: string;
  reviewerId: string;
  reviewerName?: string;
  reviewType: ReviewType;
  responses: Record<string, unknown>;
  overallRating?: number;
  competencyRatings: CompetencyRating[];
  status: ReviewStatus;
  submittedAt?: string;
  acknowledgedAt?: string;
  finalRating?: number;
  finalComments?: string;
}

export interface CompetencyRating {
  competency: string;
  rating: number;
  comments?: string;
}

export interface DevelopmentPlan {
  id: string;
  staffId: string;
  reviewId?: string;
  title: string;
  focusAreas: string[];
  developmentActions: DevelopmentAction[];
  status: 'draft' | 'active' | 'completed';
  approvedBy?: string;
  approvedAt?: string;
}

export interface DevelopmentAction {
  id: string;
  action: string;
  timeline: string;
  resources?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
}

// ============ PAYROLL & COMPENSATION ============

export type PayType = 'salary' | 'hourly' | 'contract';
export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
export type PayrollRunStatus = 'pending' | 'processing' | 'approved' | 'paid' | 'cancelled';
export type PaymentMethod = 'direct_deposit' | 'check';

export interface CompensationRecord {
  id: string;
  staffId: string;
  staffName?: string;
  payType: PayType;
  baseSalary?: number;
  hourlyRate?: number;
  payFrequency: PayFrequency;
  currency: string;
  effectiveDate: string;
  endDate?: string;
  bonusTargetPercent?: number;
  stockOptions?: number;
  changeReason?: string;
  changePercent?: number;
  approvedBy?: string;
}

export interface PayrollRun {
  id: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  status: PayrollRunStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  totalEmployerTaxes: number;
  employeeCount: number;
  preparedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  processedAt?: string;
  notes?: string;
}

export interface PayStub {
  id: string;
  payrollRunId: string;
  staffId: string;
  staffName?: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;

  // Earnings
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  bonus: number;
  commission: number;
  otherEarnings: number;
  grossPay: number;

  // Deductions
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurity: number;
  medicare: number;
  healthInsurance: number;
  dentalInsurance: number;
  visionInsurance: number;
  retirement401k: number;
  hsaContribution: number;
  garnishments: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net
  netPay: number;

  // YTD
  ytdGross: number;
  ytdFederalTax: number;
  ytdStateTax: number;
  ytdSocialSecurity: number;
  ytdMedicare: number;
  ytdNet: number;

  paymentMethod: PaymentMethod;
}

export interface PayrollDeduction {
  id: string;
  staffId: string;
  deductionType: string;
  description?: string;
  amountType: 'fixed' | 'percentage';
  amount: number;
  annualLimit?: number;
  perPayLimit?: number;
  preTax: boolean;
  effectiveDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface DirectDepositAccount {
  id: string;
  staffId: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumberLast4: string;
  depositType: 'full' | 'fixed' | 'percentage';
  depositAmount?: number;
  depositPercent?: number;
  priority: number;
  isPrimary: boolean;
  isActive: boolean;
  verifiedAt?: string;
}

export interface TaxDocument {
  id: string;
  staffId: string;
  documentType: 'w2' | '1099' | 'w4' | 'state_w4';
  taxYear: number;
  documentUrl?: string;
  status: 'draft' | 'generated' | 'delivered' | 'corrected';
  generatedAt?: string;
  deliveredAt?: string;
  deliveryMethod?: 'electronic' | 'mail';
  isCorrected: boolean;
}

// ============ ORG STRUCTURE ============

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
  departmentHeadId?: string;
  departmentHeadName?: string;
  annualBudget?: number;
  headcountBudget?: number;
  currentHeadcount?: number;
  isActive: boolean;
  children?: Department[];
}

export interface StaffPosition {
  id: string;
  staffId: string;
  staffName?: string;
  title: string;
  jobFamily?: string;
  jobLevel?: string;
  departmentId?: string;
  departmentName?: string;
  reportsToId?: string;
  reportsToName?: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  location?: string;
  workArrangement: 'office' | 'remote' | 'hybrid';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  directReports?: StaffPosition[];
}

export interface OrgChartNode {
  id: string;
  staffId: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  level: number;
  children: OrgChartNode[];
}

export interface SuccessionPlan {
  id: string;
  positionTitle: string;
  currentHolderId?: string;
  currentHolderName?: string;
  departmentId?: string;
  departmentName?: string;
  criticality: 'critical' | 'important' | 'standard';
  riskOfLoss: 'high' | 'medium' | 'low';
  successors: SuccessorEntry[];
  lastReviewedAt?: string;
  reviewedBy?: string;
  nextReviewDate?: string;
  notes?: string;
}

export interface SuccessorEntry {
  staffId: string;
  staffName: string;
  readiness: 'ready_now' | '1_2_years' | '3_5_years' | 'developing';
  developmentNeeds: string[];
}
