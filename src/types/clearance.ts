// ===========================================
// Clearance Pipeline Types
// Tracks security clearance status through investigation lifecycle
// Regulatory: 10 CFR 710 (DOE), 32 CFR 117 (NISPOM)
// ===========================================

import type { ClearanceLevel } from './index';

// Extended clearance levels including DOE-specific types
export type ExtendedClearanceLevel = ClearanceLevel | 'l-clearance' | 'q-clearance' | 'q-clearance-sci';

// DOE-specific clearance types and Sigma designations
export type DOEClearanceType = 'l-clearance' | 'q-clearance' | 'sci' | 'sigma-1' | 'sigma-2' | 'sigma-14' | 'sigma-15';

// Pipeline status tracking (SF-86 lifecycle without content)
export type ClearancePipelineStatus =
  | 'not-started'
  | 'sf86-preparation'
  | 'sf86-submitted'
  | 'investigation-initiated'
  | 'investigation-fieldwork'
  | 'investigation-complete'
  | 'adjudication-pending'
  | 'adjudication-review'
  | 'interim-granted'
  | 'granted'
  | 'denied'
  | 'appeal-pending'
  | 'suspended'
  | 'revoked'
  | 'expired'
  | 'reinvestigation-due';

export type PolygraphType = 'full-scope' | 'counterintelligence' | 'lifestyle';

export type DenialReasonCategory =
  | 'criminal-conduct'
  | 'financial'
  | 'foreign-influence'
  | 'foreign-preference'
  | 'drug-involvement'
  | 'alcohol'
  | 'psychological'
  | 'sexual-behavior'
  | 'personal-conduct'
  | 'information-technology'
  | 'allegiance'
  | 'other';

// Main clearance pipeline record
export interface ClearancePipeline {
  id: string;
  userId: string;
  organizationId?: string;

  // Clearance classification
  clearanceType: ExtendedClearanceLevel;
  doeClearanceType?: DOEClearanceType;
  sponsoringAgency: string;
  sponsoringFacility?: string;

  // Pipeline status
  pipelineStatus: ClearancePipelineStatus;

  // Timeline dates (status tracking only — no content)
  sf86PrepStartedAt?: string;
  sf86SubmittedAt?: string;
  investigationOpenedAt?: string;
  investigationCompletedAt?: string;
  adjudicationStartedAt?: string;
  interimGrantedAt?: string;
  finalGrantedAt?: string;
  deniedAt?: string;

  // Expiration management (10 CFR 710: Q=5yr, L=10yr)
  clearanceGrantedAt?: string;
  clearanceExpiresAt?: string;
  reinvestigationDueAt?: string;
  lastPeriodicReinvestigation?: string;

  // Polygraph
  polygraphRequired: boolean;
  polygraphType?: PolygraphType;
  polygraphScheduledAt?: string;
  polygraphCompletedAt?: string;
  polygraphPassed?: boolean;

  // Drug test
  drugTestRequired: boolean;
  drugTestCompletedAt?: string;
  drugTestPassed?: boolean;

  // FSO assignment
  assignedFsoId?: string;
  assignedFso?: { id: string; firstName: string; lastName: string; email: string };
  fsoNotes?: string;

  // Status metadata
  denialReasonCategory?: DenialReasonCategory;
  appealFiled: boolean;
  appealFiledAt?: string;

  // Joined user data
  user?: { id: string; firstName: string; lastName: string; email: string; organization?: string };

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Status transition audit trail
export interface ClearanceStatusHistory {
  id: string;
  pipelineId: string;
  previousStatus?: ClearancePipelineStatus;
  newStatus: ClearancePipelineStatus;
  changedBy?: string;
  changedByUser?: { id: string; firstName: string; lastName: string };
  changeReason?: string;
  notes?: string;
  createdAt: string;
}

// Dashboard statistics
export interface ClearanceDashboardStats {
  totalActive: number;
  totalPipelines: number;
  pendingInvestigation: number;
  interimGranted: number;
  fullyGranted: number;
  expiringNext30Days: number;
  expiringNext90Days: number;
  reinvestigationDue: number;
  deniedLastQuarter: number;
  averageProcessingDays: number;
  byStatus: Partial<Record<ClearancePipelineStatus, number>>;
  byType: Record<string, number>;
  byAgency: Record<string, number>;
}

// Filters for querying pipelines
export interface ClearancePipelineFilters {
  status?: ClearancePipelineStatus[];
  clearanceType?: ExtendedClearanceLevel[];
  doeClearanceType?: DOEClearanceType[];
  organizationId?: string;
  sponsoringAgency?: string;
  expiringWithinDays?: number;
  reinvestigationDueWithinDays?: number;
  assignedFsoId?: string;
  polygraphRequired?: boolean;
  search?: string;
}

// Create/update payloads
export interface CreateClearancePipelineData {
  userId: string;
  organizationId?: string;
  clearanceType: ExtendedClearanceLevel;
  doeClearanceType?: DOEClearanceType;
  sponsoringAgency: string;
  sponsoringFacility?: string;
  polygraphRequired?: boolean;
  polygraphType?: PolygraphType;
  drugTestRequired?: boolean;
  assignedFsoId?: string;
}

export interface UpdateClearanceStatusData {
  pipelineStatus: ClearancePipelineStatus;
  changeReason?: string;
  notes?: string;
}

// Pipeline status display configuration
export const PIPELINE_STATUS_CONFIG: Record<ClearancePipelineStatus, { label: string; color: string; description: string }> = {
  'not-started': { label: 'Not Started', color: 'gray', description: 'Clearance process has not been initiated' },
  'sf86-preparation': { label: 'SF-86 Prep', color: 'blue', description: 'Candidate preparing SF-86 questionnaire' },
  'sf86-submitted': { label: 'SF-86 Submitted', color: 'indigo', description: 'SF-86 submitted to investigating agency' },
  'investigation-initiated': { label: 'Investigation Started', color: 'purple', description: 'Background investigation initiated' },
  'investigation-fieldwork': { label: 'Fieldwork', color: 'violet', description: 'Field investigators conducting interviews' },
  'investigation-complete': { label: 'Investigation Complete', color: 'amber', description: 'Investigation complete, awaiting adjudication' },
  'adjudication-pending': { label: 'Adjudication Pending', color: 'orange', description: 'Case in adjudication queue' },
  'adjudication-review': { label: 'Under Review', color: 'yellow', description: 'Adjudicator actively reviewing case' },
  'interim-granted': { label: 'Interim Granted', color: 'teal', description: 'Interim clearance granted pending final adjudication' },
  'granted': { label: 'Granted', color: 'green', description: 'Full clearance granted' },
  'denied': { label: 'Denied', color: 'red', description: 'Clearance denied by adjudicating authority' },
  'appeal-pending': { label: 'Appeal Pending', color: 'orange', description: 'Denial appeal in progress' },
  'suspended': { label: 'Suspended', color: 'red', description: 'Clearance temporarily suspended' },
  'revoked': { label: 'Revoked', color: 'red', description: 'Clearance permanently revoked' },
  'expired': { label: 'Expired', color: 'gray', description: 'Clearance has expired, reinvestigation needed' },
  'reinvestigation-due': { label: 'Reinvestigation Due', color: 'amber', description: 'Periodic reinvestigation is due' },
};

// DOE clearance type display
export const DOE_CLEARANCE_CONFIG: Record<DOEClearanceType, { label: string; description: string; reinvestigationYears: number }> = {
  'l-clearance': { label: 'L Clearance', description: 'DOE Confidential/Secret equivalent', reinvestigationYears: 10 },
  'q-clearance': { label: 'Q Clearance', description: 'DOE Top Secret equivalent', reinvestigationYears: 5 },
  'sci': { label: 'SCI', description: 'Sensitive Compartmented Information', reinvestigationYears: 5 },
  'sigma-1': { label: 'Sigma 1', description: 'Theory of nuclear weapon design/operation', reinvestigationYears: 5 },
  'sigma-2': { label: 'Sigma 2', description: 'Nuclear weapon stockpile information', reinvestigationYears: 5 },
  'sigma-14': { label: 'Sigma 14', description: 'Vulnerability of nuclear weapons to deliberate attack', reinvestigationYears: 5 },
  'sigma-15': { label: 'Sigma 15', description: 'Nuclear weapon safeguards and security', reinvestigationYears: 5 },
};
