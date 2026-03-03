// ===========================================
// ITAR/EAR Export Control Compliance Types
// Manages export control assessments and foreign national screenings
// Regulatory: 22 CFR 120-130 (ITAR), 15 CFR 730-774 (EAR)
// ===========================================

// Export control classification type
export type ExportControlType = 'itar' | 'ear' | 'both' | 'none';

// Assessment lifecycle status
export type ExportControlStatus =
  | 'not-assessed'
  | 'assessment-pending'
  | 'eligible'
  | 'restricted'
  | 'denied'
  | 'exemption-pending'
  | 'exemption-granted'
  | 'under-review';

// Deemed export risk level for foreign nationals
export type DeemedExportRisk = 'low' | 'medium' | 'high';

// Citizenship requirement for controlled positions
export type CitizenshipRequirement = 'us-citizen-only' | 'us-person' | 'us-authorized' | 'any';

// ITAR USML Categories (22 CFR 121)
export const USML_CATEGORIES: Record<string, string> = {
  'I': 'Firearms, Close Assault Weapons & Combat Shotguns',
  'II': 'Guns & Armament',
  'III': 'Ammunition/Ordnance',
  'IV': 'Launch Vehicles, Guided Missiles, Ballistic Missiles',
  'V': 'Explosives & Energetic Materials',
  'VI': 'Surface Vessels of War & Special Naval Equipment',
  'VII': 'Ground Vehicles',
  'VIII': 'Aircraft & Related Articles',
  'IX': 'Military Training Equipment & Training',
  'X': 'Personal Protective Equipment',
  'XI': 'Military Electronics',
  'XII': 'Fire Control, Laser, Imaging & Guidance Equipment',
  'XIII': 'Materials & Miscellaneous Articles',
  'XIV': 'Toxicological Agents & Equipment',
  'XV': 'Spacecraft & Related Articles',
  'XVI': 'Nuclear Weapons Related Articles',
  'XVII': 'Classified Articles, Technical Data & Defense Services',
  'XVIII': 'Directed Energy Weapons',
  'XIX': 'Gas Turbine Engines & Associated Equipment',
  'XX': 'Submersible Vessels & Related Articles',
  'XXI': 'Articles, Technical Data & Defense Services Not Otherwise Enumerated',
};

// Export control audit event types
export type ExportControlAuditEventType =
  | 'assessment_created'
  | 'assessment_updated'
  | 'assessment_approved'
  | 'screening_initiated'
  | 'screening_completed'
  | 'screening_flagged'
  | 'restricted_party_match'
  | 'tcp_created'
  | 'tcp_expired'
  | 'tcp_renewed'
  | 'eligibility_checked'
  | 'exemption_requested'
  | 'exemption_granted'
  | 'denial_issued'
  | 'appeal_filed'
  | 'status_changed';

// Per-job/project export control assessment
export interface ExportControlAssessment {
  id: string;
  jobId?: string;
  organizationId?: string;
  projectName?: string;

  controlType: ExportControlType;

  // ITAR specific (22 CFR 120-130)
  itarCategory?: string;
  itarSubcategory?: string;
  itarExemption?: string;

  // EAR specific (15 CFR 730-774)
  earEccn?: string;
  earClassificationReason?: string;
  earLicenseException?: string;

  // Technology Control Plan
  tcpRequired: boolean;
  tcpReferenceNumber?: string;
  tcpApprovedAt?: string;
  tcpExpiresAt?: string;
  tcpReviewedBy?: string;

  // Assessment result
  assessmentStatus: ExportControlStatus;
  citizenshipRequirement?: CitizenshipRequirement;
  foreignNationalAllowed: boolean;
  complianceNotes?: string;
  specialConditions?: string[];

  // Audit info
  assessedBy?: string;
  assessedAt?: string;
  lastReviewedAt?: string;
  nextReviewDue?: string;
  createdAt: string;
  updatedAt: string;

  // Joined data
  job?: { id: string; title: string; company: string };
  organization?: { id: string; name: string };
  assessedByUser?: { id: string; firstName: string; lastName: string };
}

// Foreign national screening record
export interface ForeignNationalScreening {
  id: string;
  userId: string;
  organizationId?: string;

  // Citizenship info (self-declared)
  declaredCitizenship: string;
  dualCitizenship?: string[];
  countryOfBirth?: string;
  visaType?: string;
  visaExpiration?: string;
  permanentResident: boolean;
  greenCardDate?: string;

  // Screening result
  screeningStatus: ExportControlStatus;
  itarEligible?: boolean;
  earEligible?: boolean;
  deemedExportRisk?: DeemedExportRisk;

  // Restricted party list checks (BIS/OFAC/DDTC)
  restrictedPartyChecked: boolean;
  restrictedPartyCheckedAt?: string;
  restrictedPartyMatch: boolean;
  deniedPersonsListChecked: boolean;
  entityListChecked: boolean;
  sdnListChecked: boolean;
  unverifiedListChecked: boolean;

  // Audit
  screeningNotes?: string;
  screenedBy?: string;
  screenedAt?: string;
  nextReviewDue?: string;
  createdAt: string;
  updatedAt: string;

  // Joined data
  user?: { id: string; firstName: string; lastName: string; email: string };
  screenedByUser?: { id: string; firstName: string; lastName: string };
}

// Export control audit log entry
export interface ExportControlAuditEntry {
  id: string;
  assessmentId?: string;
  screeningId?: string;
  eventType: ExportControlAuditEventType;
  eventDetails: Record<string, unknown>;
  performedBy?: string;
  performedByUser?: { id: string; firstName: string; lastName: string };
  ipAddress?: string;
  createdAt: string;
}

// Dashboard statistics
export interface ExportControlDashboardStats {
  totalAssessments: number;
  itarControlled: number;
  earControlled: number;
  bothControlled: number;
  pendingAssessments: number;
  pendingScreenings: number;
  restrictedPartyMatches: number;
  tcpActive: number;
  tcpExpiringNext30Days: number;
  foreignNationalsScreened: number;
  byControlType: Record<ExportControlType, number>;
  byStatus: Partial<Record<ExportControlStatus, number>>;
}

// Filters
export interface ExportControlFilters {
  controlType?: ExportControlType;
  status?: ExportControlStatus[];
  organizationId?: string;
  hasJobAssociation?: boolean;
  tcpExpiringSoon?: boolean;
  itarCategory?: string;
  search?: string;
}

export interface ForeignNationalScreeningFilters {
  screeningStatus?: ExportControlStatus[];
  organizationId?: string;
  restrictedPartyMatch?: boolean;
  deemedExportRisk?: DeemedExportRisk;
  visaType?: string;
  search?: string;
}

// Create/update payloads
export interface CreateExportControlAssessmentData {
  jobId?: string;
  organizationId?: string;
  projectName?: string;
  controlType: ExportControlType;
  itarCategory?: string;
  itarSubcategory?: string;
  earEccn?: string;
  tcpRequired?: boolean;
  citizenshipRequirement?: CitizenshipRequirement;
  foreignNationalAllowed?: boolean;
  complianceNotes?: string;
}

export interface CreateForeignNationalScreeningData {
  userId: string;
  organizationId?: string;
  declaredCitizenship: string;
  dualCitizenship?: string[];
  countryOfBirth?: string;
  visaType?: string;
  visaExpiration?: string;
  permanentResident?: boolean;
}

// Status display configuration
export const EXPORT_CONTROL_STATUS_CONFIG: Record<ExportControlStatus, { label: string; color: string }> = {
  'not-assessed': { label: 'Not Assessed', color: 'gray' },
  'assessment-pending': { label: 'Pending', color: 'blue' },
  'eligible': { label: 'Eligible', color: 'green' },
  'restricted': { label: 'Restricted', color: 'amber' },
  'denied': { label: 'Denied', color: 'red' },
  'exemption-pending': { label: 'Exemption Pending', color: 'purple' },
  'exemption-granted': { label: 'Exemption Granted', color: 'teal' },
  'under-review': { label: 'Under Review', color: 'orange' },
};

// Restricted party lists reference
export const RESTRICTED_PARTY_LISTS = [
  { id: 'dpl', name: 'Denied Persons List', agency: 'BIS', description: 'Persons denied export privileges' },
  { id: 'entity', name: 'Entity List', agency: 'BIS', description: 'Entities of proliferation concern' },
  { id: 'sdn', name: 'SDN List', agency: 'OFAC', description: 'Specially Designated Nationals' },
  { id: 'unverified', name: 'Unverified List', agency: 'BIS', description: 'End-users BIS could not verify' },
  { id: 'debarred', name: 'ITAR Debarred', agency: 'DDTC', description: 'Parties debarred from defense trade' },
] as const;
