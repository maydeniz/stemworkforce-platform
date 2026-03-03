// Eligibility Workflows Types
// Smart Checklist-based configuration for WIOA eligibility per LWDB

// WIOA Program Types
export type WIOAProgram = 'adult' | 'dislocated_worker' | 'youth' | 'national_dislocated_worker_grants';

// Criterion Types
export type CriterionType =
  | 'age'
  | 'citizenship'
  | 'selective_service'
  | 'employment_status'
  | 'income'
  | 'public_assistance'
  | 'disability'
  | 'veteran_status'
  | 'education_level'
  | 'english_proficiency'
  | 'basic_skills_deficient'
  | 'foster_care'
  | 'homeless'
  | 'runaway'
  | 'offender'
  | 'pregnant_parenting'
  | 'needs_additional_assistance'
  | 'layoff_notice'
  | 'plant_closure'
  | 'self_employed_closure'
  | 'displaced_homemaker'
  | 'military_spouse'
  | 'custom';

// Validation Status
export type ValidationLevel = 'blocking' | 'warning' | 'info';

// Workflow Status
export type WorkflowStatus = 'draft' | 'published' | 'archived';

// Comparison Operators
export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'contains'
  | 'not_contains'
  | 'in_list'
  | 'not_in_list'
  | 'between'
  | 'is_empty'
  | 'is_not_empty';

// Document Types for Verification
export type DocumentType =
  | 'drivers_license'
  | 'state_id'
  | 'passport'
  | 'birth_certificate'
  | 'social_security_card'
  | 'work_authorization'
  | 'selective_service_registration'
  | 'unemployment_letter'
  | 'layoff_notice'
  | 'pay_stubs'
  | 'tax_return'
  | 'public_assistance_letter'
  | 'disability_documentation'
  | 'dd214'
  | 'veteran_letter'
  | 'education_transcript'
  | 'ged_certificate'
  | 'diploma'
  | 'foster_care_letter'
  | 'homeless_certification'
  | 'court_documents'
  | 'pregnancy_verification'
  | 'other';

// Criterion Value Types
export interface CriterionValue {
  type: 'number' | 'string' | 'boolean' | 'date' | 'list';
  value: number | string | boolean | string[];
  operator: ComparisonOperator;
  // For range comparisons
  minValue?: number;
  maxValue?: number;
}

// Required Documentation Configuration
export interface DocumentRequirement {
  documentType: DocumentType;
  required: boolean;
  alternativeDocuments?: DocumentType[];
  description: string;
  description_es?: string;
}

// Individual Eligibility Criterion
export interface EligibilityCriterion {
  id: string;
  type: CriterionType;
  name: string;
  name_es?: string;
  description: string;
  description_es?: string;

  // Value configuration
  value: CriterionValue;

  // Validation behavior
  validationLevel: ValidationLevel;
  errorMessage: string;
  errorMessage_es?: string;
  warningMessage?: string;
  warningMessage_es?: string;

  // Documentation requirements
  documentRequirements: DocumentRequirement[];

  // Is this a federal requirement or local addition?
  isFederalRequirement: boolean;

  // Can case manager override?
  allowOverride: boolean;
  overrideRequiresApproval: boolean;

  // Display order
  sortOrder: number;

  // Conditional logic - only evaluate if conditions met
  conditions?: CriterionCondition[];

  // Grouping for "any of" logic
  groupId?: string;
  groupOperator?: 'all' | 'any';
}

// Condition for conditional criteria
export interface CriterionCondition {
  criterionId: string;
  operator: ComparisonOperator;
  value: string | number | boolean;
}

// Priority Population Definition
export interface PriorityPopulation {
  id: string;
  name: string;
  name_es?: string;
  description: string;
  description_es?: string;
  priorityLevel: 1 | 2 | 3; // 1 = highest priority
  criteria: EligibilityCriterion[];
}

// Eligibility Workflow Configuration
export interface EligibilityWorkflow {
  id: string;
  lwdbId: string;
  program: WIOAProgram;
  name: string;
  name_es?: string;
  description: string;
  description_es?: string;

  // Version control
  version: number;
  status: WorkflowStatus;
  publishedAt?: string;
  publishedBy?: string;

  // Criteria configuration
  criteria: EligibilityCriterion[];

  // Priority populations (for limited funding scenarios)
  priorityPopulations: PriorityPopulation[];

  // Workflow settings
  settings: WorkflowSettings;

  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;

  // Change log
  changeLog: WorkflowChange[];
}

// Workflow Settings
export interface WorkflowSettings {
  // Auto-determination settings
  enableAutoDetermination: boolean;
  autoDeterminationThreshold: number; // % confidence required

  // Case manager review settings
  requireCaseManagerReview: boolean;
  reviewTimeoutDays: number;

  // Notification settings
  notifyParticipantOnPending: boolean;
  notifyParticipantOnApproval: boolean;
  notifyParticipantOnDenial: boolean;

  // Document collection settings
  allowDocumentUpload: boolean;
  maxDocumentSizeMB: number;
  allowedDocumentTypes: string[];

  // Language settings
  availableLanguages: ('en' | 'es')[];

  // Expiration settings
  eligibilityValidDays: number;

  // Custom messaging
  welcomeMessage?: string;
  welcomeMessage_es?: string;
  completionMessage?: string;
  completionMessage_es?: string;
}

// Workflow Change Log Entry
export interface WorkflowChange {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  changeType: 'created' | 'modified' | 'published' | 'archived' | 'criterion_added' | 'criterion_removed' | 'criterion_modified';
  description: string;
  previousValue?: string;
  newValue?: string;
}

// Eligibility Determination Result
export interface EligibilityDetermination {
  id: string;
  participantId: string;
  workflowId: string;
  workflowVersion: number;

  // Results
  overallResult: 'eligible' | 'ineligible' | 'pending_review' | 'pending_documents';
  confidenceScore: number;

  // Criterion-level results
  criterionResults: CriterionResult[];

  // Priority population matching
  matchedPriorityPopulations: string[];
  priorityLevel?: 1 | 2 | 3;

  // Documents
  submittedDocuments: SubmittedDocument[];
  missingDocuments: DocumentType[];

  // Review info
  reviewStatus: 'not_required' | 'pending' | 'approved' | 'denied';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;

  // Metadata
  determinedAt: string;
  expiresAt: string;
}

// Individual Criterion Result
export interface CriterionResult {
  criterionId: string;
  criterionName: string;
  result: 'passed' | 'failed' | 'pending' | 'overridden' | 'skipped';
  validationLevel: ValidationLevel;
  providedValue?: string | number | boolean;
  expectedValue?: string;
  message?: string;
  overrideReason?: string;
  overrideApprovedBy?: string;
}

// Submitted Document
export interface SubmittedDocument {
  id: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

// Federal Baseline Templates
export interface FederalBaselineTemplate {
  program: WIOAProgram;
  name: string;
  description: string;
  criteria: Omit<EligibilityCriterion, 'id'>[];
  priorityPopulations: Omit<PriorityPopulation, 'id'>[];
  defaultSettings: Partial<WorkflowSettings>;
  lastUpdated: string;
  regulatoryReference: string;
}

// LWDB Configuration Summary
export interface LWDBWorkflowSummary {
  lwdbId: string;
  lwdbName: string;
  workflows: {
    program: WIOAProgram;
    status: WorkflowStatus;
    version: number;
    lastPublished?: string;
    totalCriteria: number;
    customCriteria: number;
  }[];
}

// Test Mode Types
export interface WorkflowTestCase {
  id: string;
  name: string;
  description: string;
  inputs: Record<string, string | number | boolean>;
  expectedResult: 'eligible' | 'ineligible' | 'pending_review';
  expectedPriorityLevel?: 1 | 2 | 3;
}

export interface WorkflowTestResult {
  testCaseId: string;
  passed: boolean;
  actualResult: 'eligible' | 'ineligible' | 'pending_review' | 'pending_documents';
  actualPriorityLevel?: 1 | 2 | 3;
  criterionResults: CriterionResult[];
  errorMessage?: string;
}
