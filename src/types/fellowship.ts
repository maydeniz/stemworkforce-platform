// ===========================================
// Fellowship Program Management Types
// DOE SULI, SCGSR, CCI, WDTS and custom programs
// ===========================================

// DOE fellowship program types
export type FellowshipProgramType =
  | 'suli'              // Science Undergraduate Laboratory Internships
  | 'scgsr'             // Office of Science Graduate Student Research
  | 'cci'               // Community College Internships
  | 'wdts'              // Workforce Development for Teachers and Scientists
  | 'visiting-faculty'  // Visiting Faculty Program
  | 'postdoc'           // Postdoctoral Research
  | 'research-associate'
  | 'custom';

// Application lifecycle status
export type FellowshipApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'faculty-review'
  | 'mentor-assigned'
  | 'accepted'
  | 'waitlisted'
  | 'declined'
  | 'withdrawn'
  | 'completed'
  | 'terminated';

// Cohort status
export type CohortStatus = 'planning' | 'accepting' | 'full' | 'active' | 'completed' | 'cancelled';

// Fellowship program record
export interface FellowshipProgram {
  id: string;
  name: string;
  shortName: string;
  programType: FellowshipProgramType;
  managingOrganizationId?: string;

  description: string;
  eligibilityDescription?: string;
  website?: string;

  // Timing
  termType: 'semester' | 'summer' | 'year-round' | 'custom';
  termStartMonth?: number;
  termEndMonth?: number;
  termDurationWeeks?: number;
  applicationOpenDate?: string;
  applicationDeadline?: string;

  // Capacity
  maxParticipants?: number;
  currentParticipants: number;

  // Compensation
  stipendAmount?: number;
  stipendFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'total';
  housingProvided: boolean;
  travelReimbursed: boolean;
  healthInsuranceProvided: boolean;

  // Requirements
  citizenshipRequired: string[];
  minGpa?: number;
  educationLevels: string[];
  requiredMajorFields?: string[];
  clearanceRequired?: string;
  drugTestRequired: boolean;
  backgroundCheckRequired: boolean;

  // DOE Lab specific
  participatingLabs?: string[];

  // Status
  status: 'draft' | 'active' | 'paused' | 'archived';
  academicYear?: string;

  createdAt: string;
  updatedAt: string;
  createdBy?: string;

  // Joined data
  managingOrganization?: { id: string; name: string };
  cohorts?: FellowshipCohort[];
  _applicationCount?: number;
  _activeCount?: number;
}

// Cohort (group per term/semester)
export interface FellowshipCohort {
  id: string;
  programId: string;
  name: string;
  term: string;
  academicYear?: string;

  startDate: string;
  endDate: string;
  orientationDate?: string;

  maxParticipants?: number;
  acceptedCount: number;
  activeCount: number;
  completedCount: number;

  status: CohortStatus;
  hostLab?: string;

  createdAt: string;
  updatedAt: string;

  // Joined
  program?: FellowshipProgram;
}

// Fellowship application
export interface FellowshipApplication {
  id: string;
  programId: string;
  cohortId?: string;
  userId: string;

  status: FellowshipApplicationStatus;

  // Academic info (snapshot at application time)
  university?: string;
  major?: string;
  gpa?: number;
  educationLevel?: string;
  expectedGraduation?: string;

  // Preferences
  preferredLabs?: string[];
  preferredResearchAreas?: string[];
  researchStatement?: string;

  // Mentor assignment
  assignedMentorId?: string;
  assignedLab?: string;
  assignedDivision?: string;
  assignedProject?: string;

  // Evaluations
  facultyRecommendationReceived: boolean;
  facultyRecommendationScore?: number;
  applicationScore?: number;
  interviewScore?: number;
  overallScore?: number;

  // Compliance checks
  citizenshipVerified: boolean;
  backgroundCheckStatus: string;
  drugTestStatus: string;
  clearanceStatus: string;

  // Completion tracking
  midtermEvaluationScore?: number;
  finalEvaluationScore?: number;
  finalReportSubmitted: boolean;
  posterPresentationCompleted: boolean;

  // Outcomes
  completionStatus?: 'completed' | 'withdrew' | 'terminated' | 'extended';
  returnOfferExtended: boolean;
  convertedToHire: boolean;

  // Timestamps
  submittedAt?: string;
  reviewedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Joined data
  user?: { id: string; firstName: string; lastName: string; email: string };
  mentor?: FellowshipMentor;
  program?: FellowshipProgram;
  cohort?: FellowshipCohort;
}

// Fellowship mentor
export interface FellowshipMentor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  title?: string;
  department?: string;
  labName?: string;
  division?: string;

  researchAreas?: string[];
  specializations?: string[];

  maxFellows: number;
  currentFellows: number;
  totalFellowsMentored: number;
  averageFellowRating?: number;
  fellowsConvertedToHire: number;

  status: 'active' | 'on-leave' | 'inactive' | 'retired';
  availableForPrograms?: string[];

  createdAt: string;
  updatedAt: string;
}

// Dashboard statistics
export interface FellowshipDashboardStats {
  totalPrograms: number;
  activePrograms: number;
  totalApplications: number;
  pendingApplications: number;
  activeFellows: number;
  completedThisYear: number;
  conversionRate: number;
  averageScore: number;
  totalMentors: number;
  availableMentors: number;
  byProgram: Record<string, { applications: number; active: number; completed: number }>;
  byLab: Record<string, number>;
  byStatus: Partial<Record<FellowshipApplicationStatus, number>>;
}

// Filters
export interface FellowshipProgramFilters {
  programType?: FellowshipProgramType[];
  status?: ('draft' | 'active' | 'paused' | 'archived')[];
  lab?: string;
  search?: string;
}

export interface FellowshipApplicationFilters {
  status?: FellowshipApplicationStatus[];
  programId?: string;
  programType?: FellowshipProgramType[];
  cohortId?: string;
  lab?: string;
  mentorId?: string;
  search?: string;
}

export interface FellowshipMentorFilters {
  status?: ('active' | 'on-leave' | 'inactive' | 'retired')[];
  labName?: string;
  availableForProgram?: string;
  hasCapacity?: boolean;
  search?: string;
}

// Create/update payloads
export interface CreateFellowshipProgramData {
  name: string;
  shortName: string;
  programType: FellowshipProgramType;
  managingOrganizationId?: string;
  description: string;
  eligibilityDescription?: string;
  website?: string;
  termType: 'semester' | 'summer' | 'year-round' | 'custom';
  termDurationWeeks?: number;
  applicationDeadline?: string;
  maxParticipants?: number;
  stipendAmount?: number;
  stipendFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'total';
  citizenshipRequired?: string[];
  educationLevels?: string[];
  participatingLabs?: string[];
}

export interface CreateFellowshipApplicationData {
  programId: string;
  cohortId?: string;
  university?: string;
  major?: string;
  gpa?: number;
  educationLevel?: string;
  expectedGraduation?: string;
  preferredLabs?: string[];
  preferredResearchAreas?: string[];
  researchStatement?: string;
}

// Display configuration
export const FELLOWSHIP_PROGRAM_CONFIG: Record<FellowshipProgramType, { label: string; color: string; description: string }> = {
  'suli': { label: 'SULI', color: 'blue', description: 'Science Undergraduate Laboratory Internships' },
  'scgsr': { label: 'SCGSR', color: 'purple', description: 'Office of Science Graduate Student Research' },
  'cci': { label: 'CCI', color: 'green', description: 'Community College Internships' },
  'wdts': { label: 'WDTS', color: 'amber', description: 'Workforce Development for Teachers & Scientists' },
  'visiting-faculty': { label: 'VFP', color: 'indigo', description: 'Visiting Faculty Program' },
  'postdoc': { label: 'Postdoc', color: 'rose', description: 'Postdoctoral Research Program' },
  'research-associate': { label: 'Research Assoc.', color: 'teal', description: 'Research Associate Program' },
  'custom': { label: 'Custom', color: 'gray', description: 'Custom fellowship program' },
};

export const FELLOWSHIP_STATUS_CONFIG: Record<FellowshipApplicationStatus, { label: string; color: string }> = {
  'draft': { label: 'Draft', color: 'gray' },
  'submitted': { label: 'Submitted', color: 'blue' },
  'under-review': { label: 'Under Review', color: 'indigo' },
  'faculty-review': { label: 'Faculty Review', color: 'purple' },
  'mentor-assigned': { label: 'Mentor Assigned', color: 'violet' },
  'accepted': { label: 'Accepted', color: 'green' },
  'waitlisted': { label: 'Waitlisted', color: 'amber' },
  'declined': { label: 'Declined', color: 'red' },
  'withdrawn': { label: 'Withdrawn', color: 'gray' },
  'completed': { label: 'Completed', color: 'emerald' },
  'terminated': { label: 'Terminated', color: 'red' },
};

export const COHORT_STATUS_CONFIG: Record<CohortStatus, { label: string; color: string }> = {
  'planning': { label: 'Planning', color: 'gray' },
  'accepting': { label: 'Accepting Applications', color: 'blue' },
  'full': { label: 'Full', color: 'amber' },
  'active': { label: 'Active', color: 'green' },
  'completed': { label: 'Completed', color: 'emerald' },
  'cancelled': { label: 'Cancelled', color: 'red' },
};

// DOE National Labs reference
export const DOE_NATIONAL_LABS = [
  'Argonne National Laboratory',
  'Brookhaven National Laboratory',
  'Fermi National Accelerator Laboratory',
  'Idaho National Laboratory',
  'Lawrence Berkeley National Laboratory',
  'Lawrence Livermore National Laboratory',
  'Los Alamos National Laboratory',
  'National Renewable Energy Laboratory',
  'Oak Ridge National Laboratory',
  'Pacific Northwest National Laboratory',
  'Princeton Plasma Physics Laboratory',
  'Sandia National Laboratories',
  'Savannah River National Laboratory',
  'SLAC National Accelerator Laboratory',
  'Thomas Jefferson National Accelerator Facility',
  'Ames National Laboratory',
  'National Energy Technology Laboratory',
] as const;
