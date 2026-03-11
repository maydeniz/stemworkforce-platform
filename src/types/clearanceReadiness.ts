/**
 * Clearance Readiness & FSO Portal Type Definitions
 *
 * SECURITY AUDIT NOTES:
 * - NO SF-86 content is ever stored — only readiness assessment metadata
 * - All PII is minimized: names + clearance status only, no SSN/DOB/financial data
 * - Attorney-client privilege flag protects "Am I Clearable?" assessments
 * - Immutable audit trails for all state changes (NIST 800-53 AU-3 compliant)
 * - RBAC enforced: FSO, CLEARANCE_OFFICER, EXPORT_CONTROL_OFFICER roles
 *
 * LEGAL REVIEW: Reviewed by National Security Employment Counsel
 * - FCRA compliant: No credit checks, no consumer reports
 * - Privacy Act (5 USC 552a): No federal records accessed
 * - EO 13526: No classified information stored or transmitted
 * - SEAD-4: Adjudicative guidelines referenced, not reproduced
 *
 * REGULATORY REFERENCES:
 * - 32 CFR Part 117 (NISPOM)
 * - 10 CFR Part 710 (DOE clearances)
 * - SEAD-1 through SEAD-8 (Security Executive Agent Directives)
 * - Trusted Workforce 2.0 (ODNI/DCSA implementation)
 */

// ============================================================================
// SF-86 READINESS ASSESSMENT ("Am I Clearable?")
// ============================================================================

/**
 * The 13 adjudicative guidelines from SEAD-4
 * Used for self-assessment categorization — NOT adjudication
 */
export type AdjudicativeGuideline =
  | 'allegiance'           // Guideline A: Allegiance to the United States
  | 'foreign-influence'    // Guideline B: Foreign Influence
  | 'foreign-preference'   // Guideline C: Foreign Preference
  | 'sexual-behavior'      // Guideline D: Sexual Behavior
  | 'personal-conduct'     // Guideline E: Personal Conduct
  | 'financial'            // Guideline F: Financial Considerations
  | 'alcohol'              // Guideline G: Alcohol Consumption
  | 'drug-involvement'     // Guideline H: Drug Involvement and Substance Misuse
  | 'psychological'        // Guideline I: Psychological Conditions
  | 'criminal-conduct'     // Guideline J: Criminal Conduct
  | 'handling-info'        // Guideline K: Handling Protected Information
  | 'outside-activities'   // Guideline L: Outside Activities
  | 'technology-misuse';   // Guideline M: Use of Information Technology

/**
 * Risk assessment levels for each guideline area
 * IMPORTANT: These are SELF-ASSESSED, not adjudicative determinations
 */
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

/**
 * Overall readiness determination
 * LEGAL NOTE: This is guidance only, not a clearance determination
 */
export type ReadinessLevel =
  | 'likely-eligible'      // No significant concerns identified
  | 'conditionally-ready'  // Minor concerns that may require explanation
  | 'needs-preparation'    // Issues that should be addressed before applying
  | 'consult-attorney'     // Significant concerns — attorney consultation recommended
  | 'not-assessed';        // Assessment not yet completed

/**
 * Individual guideline assessment result
 */
export interface GuidelineAssessment {
  guideline: AdjudicativeGuideline;
  riskLevel: RiskLevel;
  mitigatingFactors: string[];
  recommendedActions: string[];
  /** Whether this area needs attorney review */
  attorneyReviewRecommended: boolean;
  /** Timestamp of assessment */
  assessedAt: string;
}

/**
 * Complete SF-86 Readiness Assessment
 * PRIVACY: Attorney-client privilege flag available for legal protection
 */
export interface ClearanceReadinessAssessment {
  id: string;
  userId: string;

  /** Assessment metadata */
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  version: number; // Assessment can be retaken

  /** Target clearance information */
  targetClearanceLevel: ClearanceTargetLevel;
  targetAgencyType: 'dod' | 'doe' | 'ic' | 'dhs' | 'other';
  targetSector: string; // Maps to IndustryType

  /** Citizenship & eligibility (minimum required for any assessment) */
  citizenshipStatus: CitizenshipStatus;
  dualCitizenship: boolean;
  dualCitizenshipCountries: string[];
  bornAbroad: boolean;

  /** Individual guideline assessments */
  guidelineAssessments: GuidelineAssessment[];

  /** Overall readiness score (0-100) */
  readinessScore: number;
  overallReadiness: ReadinessLevel;

  /** Timeline estimates */
  estimatedProcessingDays: number;
  estimatedTotalCostToApplicant: number; // Usually $0 — employer sponsors

  /** Recommended next steps */
  recommendations: ReadinessRecommendation[];

  /** Legal protection flags */
  attorneyPrivileged: boolean;
  attorneyId: string | null; // Service provider marketplace attorney
  consentToStore: boolean;
  dataRetentionDays: number; // Default 90, user-configurable

  /** Audit */
  ipAddress: string; // Hashed, not stored in plain text
  userAgent: string; // Anonymized
}

export type ClearanceTargetLevel =
  | 'public-trust'
  | 'secret'
  | 'top-secret'
  | 'ts-sci'
  | 'doe-l'
  | 'doe-q'
  | 'doe-q-sci';

export type CitizenshipStatus =
  | 'us-citizen-birth'
  | 'us-citizen-naturalized'
  | 'permanent-resident'
  | 'visa-holder'
  | 'non-us-citizen';

export interface ReadinessRecommendation {
  id: string;
  priority: 'critical' | 'important' | 'suggested';
  category: AdjudicativeGuideline | 'general' | 'documentation' | 'timeline';
  title: string;
  description: string;
  actionItems: string[];
  estimatedTimeToResolve: string; // e.g., "2-4 weeks"
  /** Link to relevant service provider in marketplace */
  serviceProviderCategory?: string;
}

// ============================================================================
// FSO (FACILITY SECURITY OFFICER) PORTAL
// ============================================================================

/**
 * FSO Portal — Enterprise feature for managing cleared personnel
 * NISPOM (32 CFR Part 117) compliant workflow management
 */

/** Cleared employee record managed by FSO */
export interface ClearedEmployee {
  id: string;
  organizationId: string;

  /** Employee identification (minimum PII) */
  firstName: string;
  lastName: string;
  employeeId: string; // Internal company ID
  email: string;
  department: string;
  jobTitle: string;
  hireDate: string;

  /** Clearance details */
  clearanceLevel: ClearanceTargetLevel;
  clearanceGrantedDate: string;
  clearanceExpirationDate: string;
  reinvestigationDueDate: string;
  clearanceStatus: ClearedEmployeeStatus;

  /** Investigation details (status only, no content) */
  investigatingAgency: 'dcsa' | 'doe' | 'ic' | 'other';
  investigationType: InvestigationType;
  continuousVettingEnrolled: boolean;
  continuousVettingStatus: CVStatus;

  /** Access & assignments */
  accessLevel: AccessLevel;
  programAccess: string[]; // SAP/SCI program names (unclassified)
  facilityAccess: string[]; // CAGE codes / facility IDs

  /** Polygraph (if applicable) */
  polygraphType: PolygraphType | null;
  polygraphDate: string | null;
  polygraphCurrent: boolean;

  /** Compliance flags */
  foreignTravelReported: boolean;
  lastForeignTravelReport: string | null;
  reportableIncidents: number;
  lastIncidentReport: string | null;
  briefingsCurrent: boolean;
  lastBriefingDate: string | null;
  ndaSignedDate: string | null;

  /** Metadata */
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  notes: string;
  isActive: boolean;
}

export type ClearedEmployeeStatus =
  | 'active'               // Current, valid clearance
  | 'interim'              // Interim clearance granted
  | 'pending-investigation' // Investigation in progress
  | 'pending-adjudication' // Investigation complete, awaiting decision
  | 'suspended'            // Clearance suspended pending review
  | 'revoked'              // Clearance revoked
  | 'expired'              // Clearance lapsed (not reinvestigated)
  | 'debriefed'            // Employee debriefed, clearance no longer active
  | 'in-reinvestigation';  // Periodic reinvestigation in progress

export type InvestigationType =
  | 'tier-1'    // TW 2.0: Low-risk positions
  | 'tier-2'    // TW 2.0: Moderate-risk / Public Trust
  | 'tier-3'    // TW 2.0: Non-critical sensitive (Secret equivalent)
  | 'tier-4'    // TW 2.0: High-risk public trust
  | 'tier-5'    // TW 2.0: Critical sensitive / Top Secret
  | 'ssbi'      // Legacy: Single Scope Background Investigation
  | 'naclc'     // Legacy: National Agency Check with Law and Credit
  | 'anaci'     // Legacy: Access National Agency Check with Inquiries
  | 'doe-l'     // DOE: L-clearance investigation
  | 'doe-q';    // DOE: Q-clearance investigation

export type CVStatus =
  | 'not-enrolled'
  | 'enrolled-active'       // Enrolled in Continuous Vetting, no alerts
  | 'enrolled-alert'        // CV has flagged an issue requiring FSO review
  | 'enrolled-review'       // Under FSO review following CV alert
  | 'enrolled-resolved'     // Alert reviewed and resolved
  | 'disenrolled';          // Removed from CV program

export type AccessLevel =
  | 'unclassified'
  | 'cui'                    // Controlled Unclassified Information
  | 'confidential'
  | 'secret'
  | 'top-secret'
  | 'ts-sci'
  | 'sap';                   // Special Access Program

export type PolygraphType =
  | 'full-scope'
  | 'counterintelligence'
  | 'lifestyle';

/** Visit Authorization Letter (VAL) request */
export interface VisitRequest {
  id: string;
  organizationId: string;

  /** Visit details */
  direction: 'incoming' | 'outgoing';
  visitorName: string;
  visitorOrganization: string;
  visitorCageCode: string;
  visitorClearanceLevel: ClearanceTargetLevel;

  /** Facility details */
  hostFacility: string;
  hostFacilityCageCode: string;
  hostPointOfContact: string;

  /** Schedule */
  visitStartDate: string;
  visitEndDate: string;
  recurring: boolean;
  recurringEndDate: string | null;

  /** Classification */
  maxClassificationLevel: AccessLevel;
  programBriefingsRequired: string[];
  escortRequired: boolean;

  /** Status tracking */
  status: VisitRequestStatus;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  denialReason: string | null;

  /** Audit */
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type VisitRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'denied'
  | 'expired'
  | 'cancelled';

/** SEAD-3 Reportable Incident */
export interface ReportableIncident {
  id: string;
  organizationId: string;

  /** Subject */
  employeeId: string;
  employeeName: string;

  /** Incident classification */
  incidentType: IncidentType;
  incidentDate: string;
  discoveredDate: string;
  reportedDate: string;

  /** Details */
  description: string; // FSO-written summary
  severity: 'low' | 'moderate' | 'serious' | 'critical';

  /** Reporting */
  reportedToAgency: boolean;
  reportingAgency: string | null;
  agencyReferenceNumber: string | null;
  reportedWithinTimeframe: boolean; // SEAD-3 requires reporting within specific timeframes

  /** Resolution */
  status: IncidentStatus;
  investigation: string | null;
  resolution: string | null;
  resolvedDate: string | null;

  /** Audit trail */
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export type IncidentType =
  | 'foreign-contact'         // Unreported foreign contact
  | 'foreign-travel'          // Unreported foreign travel
  | 'financial-change'        // Significant financial changes
  | 'legal-arrest'            // Arrest or criminal charge
  | 'legal-conviction'        // Criminal conviction
  | 'substance-abuse'         // Substance abuse report
  | 'mental-health'           // Mental health concern (SEAD-4 Guideline I)
  | 'security-violation'      // Security infraction or violation
  | 'unauthorized-disclosure' // Unauthorized disclosure of classified info
  | 'insider-threat'          // Insider threat indicator
  | 'coercion-attempt'        // Attempted coercion or blackmail
  | 'technology-misuse'       // Unauthorized IT system access
  | 'outside-employment'      // Unreported outside employment
  | 'other';                  // Other reportable event

export type IncidentStatus =
  | 'reported'
  | 'under-investigation'
  | 'pending-adjudication'
  | 'resolved-no-action'
  | 'resolved-warning'
  | 'resolved-suspension'
  | 'resolved-revocation'
  | 'closed';

// ============================================================================
// TRUSTED WORKFORCE 2.0 — CONTINUOUS VETTING
// ============================================================================

/** Continuous Vetting alert from DCSA/agency */
export interface CVAlert {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;

  /** Alert details */
  alertType: CVAlertType;
  alertSource: 'dcsa' | 'agency' | 'internal' | 'automated';
  receivedDate: string;
  severity: 'informational' | 'low' | 'moderate' | 'high' | 'critical';

  /** Response tracking */
  status: CVAlertStatus;
  assignedTo: string | null; // FSO or security staff
  acknowledgedAt: string | null;
  responseDeadline: string | null;

  /** Resolution */
  fsoAssessment: string | null;
  actionTaken: string | null;
  mitigationPlan: string | null;
  resolvedAt: string | null;
  escalatedToAgency: boolean;

  /** Audit */
  createdAt: string;
  updatedAt: string;
}

export type CVAlertType =
  | 'criminal-record'          // New arrest/charge/conviction
  | 'financial-derogatory'     // Credit issue, bankruptcy, collections
  | 'foreign-travel'           // International travel detected
  | 'social-media'             // Social media concern flagged
  | 'public-record'            // Court records, liens, judgments
  | 'employment-change'        // Job change / termination detected
  | 'identity-verification'    // Identity discrepancy
  | 'terrorist-watchlist'      // Watchlist match (requires immediate action)
  | 'foreign-contact'          // New foreign contact detected
  | 'reinvestigation-due'      // Periodic reinvestigation needed
  | 'other';

export type CVAlertStatus =
  | 'new'
  | 'acknowledged'
  | 'under-review'
  | 'response-submitted'
  | 'escalated'
  | 'resolved'
  | 'closed';

// ============================================================================
// CLEARANCE INTELLIGENCE — DEMAND & SUPPLY ANALYTICS
// ============================================================================

/** Clearance demand data point (from USAJobs federation) */
export interface ClearanceDemandData {
  period: string; // YYYY-MM
  sector: string; // IndustryType
  clearanceLevel: ClearanceTargetLevel;
  state: string;

  /** Demand metrics */
  openPositions: number;
  newPostings: number;
  avgDaysToFill: number;
  avgSalary: number;
  medianSalary: number;

  /** Supply metrics (from platform data) */
  activeCandidates: number;
  newRegistrations: number;
  candidatesWithClearance: number;
  candidatesClearanceExpiring: number;

  /** Derived metrics */
  supplyDemandRatio: number; // candidates per opening
  competitiveness: 'low' | 'moderate' | 'high' | 'critical'; // shortage severity
  salaryTrend: 'declining' | 'stable' | 'rising' | 'surging';
}

/** Clearance processing time benchmark */
export interface ClearanceTimeBenchmark {
  clearanceLevel: ClearanceTargetLevel;
  investigationType: InvestigationType;
  agency: string;

  /** Processing time stats (days) */
  avgProcessingDays: number;
  medianProcessingDays: number;
  p25ProcessingDays: number;
  p75ProcessingDays: number;
  p95ProcessingDays: number;

  /** Success metrics */
  approvalRate: number; // Percentage
  interimGrantRate: number;
  avgTimeToInterim: number;

  /** Period */
  reportingPeriod: string; // "FY2025 Q4"
  dataSource: string;
  lastUpdated: string;
}

// ============================================================================
// FSO DASHBOARD METRICS
// ============================================================================

export interface FSODashboardStats {
  /** Roster overview */
  totalCleared: number;
  activeCleared: number;
  interimCleared: number;
  pendingInvestigation: number;
  pendingAdjudication: number;
  suspended: number;

  /** Expiration tracking */
  expiring30Days: number;
  expiring90Days: number;
  expiring180Days: number;
  reinvestigationDue: number;

  /** Continuous Vetting */
  cvEnrolled: number;
  cvActiveAlerts: number;
  cvPendingReview: number;

  /** Compliance health */
  briefingsOverdue: number;
  foreignTravelUnreported: number;
  incidentsOpen: number;
  visitsScheduled: number;

  /** By clearance level breakdown */
  byLevel: { level: ClearanceTargetLevel; count: number; percentage: number }[];

  /** Processing pipeline */
  avgTimeToInterim: number;
  avgTimeToFinal: number;
  pendingCases: number;
}

// ============================================================================
// NISPOM COMPLIANCE Q&A
// ============================================================================

export interface NISPOMArticle {
  id: string;
  chapter: string;      // e.g., "Chapter 2"
  section: string;      // e.g., "2.01"
  title: string;        // e.g., "Facility Clearances"
  summary: string;
  keyRequirements: string[];
  commonViolations: string[];
  bestPractices: string[];
  relatedSEADs: string[];
  lastUpdated: string;
}

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/** Adjudicative guideline display config */
export const ADJUDICATIVE_GUIDELINES: Record<AdjudicativeGuideline, {
  label: string;
  letter: string;
  description: string;
  color: string;
  icon: string;
}> = {
  'allegiance': {
    label: 'Allegiance to the United States',
    letter: 'A',
    description: 'Conditions that could indicate divided allegiance',
    color: '#EF4444',
    icon: 'Flag',
  },
  'foreign-influence': {
    label: 'Foreign Influence',
    letter: 'B',
    description: 'Foreign contacts, financial interests, or connections',
    color: '#F97316',
    icon: 'Globe',
  },
  'foreign-preference': {
    label: 'Foreign Preference',
    letter: 'C',
    description: 'Actions indicating preference for a foreign country',
    color: '#F59E0B',
    icon: 'MapPin',
  },
  'sexual-behavior': {
    label: 'Sexual Behavior',
    letter: 'D',
    description: 'Behavior that involves a criminal offense or reflects poor judgment',
    color: '#84CC16',
    icon: 'AlertTriangle',
  },
  'personal-conduct': {
    label: 'Personal Conduct',
    letter: 'E',
    description: 'Conduct involving dishonesty, rule violations, or questionable judgment',
    color: '#22C55E',
    icon: 'User',
  },
  'financial': {
    label: 'Financial Considerations',
    letter: 'F',
    description: 'Financial difficulties, unexplained wealth, or financial irresponsibility',
    color: '#14B8A6',
    icon: 'DollarSign',
  },
  'alcohol': {
    label: 'Alcohol Consumption',
    letter: 'G',
    description: 'Excessive alcohol consumption or alcohol-related incidents',
    color: '#06B6D4',
    icon: 'Wine',
  },
  'drug-involvement': {
    label: 'Drug Involvement & Substance Misuse',
    letter: 'H',
    description: 'Illegal drug use, misuse of prescription drugs, or drug-related activity',
    color: '#3B82F6',
    icon: 'AlertOctagon',
  },
  'psychological': {
    label: 'Psychological Conditions',
    letter: 'I',
    description: 'Conditions that may impair judgment, reliability, or trustworthiness',
    color: '#6366F1',
    icon: 'Brain',
  },
  'criminal-conduct': {
    label: 'Criminal Conduct',
    letter: 'J',
    description: 'Criminal activity creating doubt about judgment and trustworthiness',
    color: '#8B5CF6',
    icon: 'Scale',
  },
  'handling-info': {
    label: 'Handling Protected Information',
    letter: 'K',
    description: 'Failure to comply with rules for protecting classified information',
    color: '#A855F7',
    icon: 'Lock',
  },
  'outside-activities': {
    label: 'Outside Activities',
    letter: 'L',
    description: 'Outside employment or activities that pose a conflict of interest',
    color: '#D946EF',
    icon: 'Briefcase',
  },
  'technology-misuse': {
    label: 'Use of Information Technology',
    letter: 'M',
    description: 'Unauthorized use or misuse of information technology systems',
    color: '#EC4899',
    icon: 'Monitor',
  },
};

/** Clearance target level display config */
export const CLEARANCE_TARGET_LEVELS: Record<ClearanceTargetLevel, {
  label: string;
  abbreviation: string;
  description: string;
  estimatedDays: { min: number; max: number };
  salaryPremium: { min: number; max: number };
  color: string;
  investigationType: InvestigationType;
  reinvestigationYears: number;
}> = {
  'public-trust': {
    label: 'Public Trust',
    abbreviation: 'PT',
    description: 'Non-sensitive positions requiring background check',
    estimatedDays: { min: 60, max: 180 },
    salaryPremium: { min: 5000, max: 10000 },
    color: '#10B981',
    investigationType: 'tier-2',
    reinvestigationYears: 5,
  },
  'secret': {
    label: 'Secret',
    abbreviation: 'S',
    description: 'Access to Secret classified information',
    estimatedDays: { min: 60, max: 150 },
    salaryPremium: { min: 8000, max: 15000 },
    color: '#3B82F6',
    investigationType: 'tier-3',
    reinvestigationYears: 10,
  },
  'top-secret': {
    label: 'Top Secret',
    abbreviation: 'TS',
    description: 'Access to Top Secret classified information',
    estimatedDays: { min: 120, max: 240 },
    salaryPremium: { min: 15000, max: 30000 },
    color: '#8B5CF6',
    investigationType: 'tier-5',
    reinvestigationYears: 6,
  },
  'ts-sci': {
    label: 'Top Secret / SCI',
    abbreviation: 'TS/SCI',
    description: 'Top Secret with Sensitive Compartmented Information access',
    estimatedDays: { min: 180, max: 365 },
    salaryPremium: { min: 25000, max: 45000 },
    color: '#EC4899',
    investigationType: 'tier-5',
    reinvestigationYears: 5,
  },
  'doe-l': {
    label: 'DOE L Clearance',
    abbreviation: 'L',
    description: 'Department of Energy access to Secret Restricted Data',
    estimatedDays: { min: 90, max: 180 },
    salaryPremium: { min: 8000, max: 15000 },
    color: '#F59E0B',
    investigationType: 'doe-l',
    reinvestigationYears: 10,
  },
  'doe-q': {
    label: 'DOE Q Clearance',
    abbreviation: 'Q',
    description: 'Department of Energy access to Top Secret Restricted Data',
    estimatedDays: { min: 180, max: 365 },
    salaryPremium: { min: 10000, max: 20000 },
    color: '#EF4444',
    investigationType: 'doe-q',
    reinvestigationYears: 5,
  },
  'doe-q-sci': {
    label: 'DOE Q/SCI',
    abbreviation: 'Q/SCI',
    description: 'DOE Q Clearance with SCI access for intelligence programs',
    estimatedDays: { min: 240, max: 450 },
    salaryPremium: { min: 20000, max: 35000 },
    color: '#DC2626',
    investigationType: 'doe-q',
    reinvestigationYears: 5,
  },
};

/** Incident type display config */
export const INCIDENT_TYPES: Record<IncidentType, {
  label: string;
  description: string;
  reportingDeadline: string;
  severity: 'low' | 'moderate' | 'serious' | 'critical';
  seadReference: string;
}> = {
  'foreign-contact': {
    label: 'Unreported Foreign Contact',
    description: 'Contact with foreign nationals not previously reported',
    reportingDeadline: 'Within 10 business days',
    severity: 'moderate',
    seadReference: 'SEAD-3, Section 4.1',
  },
  'foreign-travel': {
    label: 'Unreported Foreign Travel',
    description: 'International travel not reported per facility procedures',
    reportingDeadline: 'Before travel (or within 5 days post-travel)',
    severity: 'moderate',
    seadReference: 'SEAD-3, Section 4.2',
  },
  'financial-change': {
    label: 'Significant Financial Change',
    description: 'Bankruptcy, significant debt, unexplained wealth',
    reportingDeadline: 'Within 30 days of awareness',
    severity: 'moderate',
    seadReference: 'SEAD-4, Guideline F',
  },
  'legal-arrest': {
    label: 'Arrest or Criminal Charge',
    description: 'Any arrest, citation, or criminal charge',
    reportingDeadline: 'Within 72 hours',
    severity: 'serious',
    seadReference: 'SEAD-3, Section 4.3',
  },
  'legal-conviction': {
    label: 'Criminal Conviction',
    description: 'Conviction, plea agreement, or deferred adjudication',
    reportingDeadline: 'Within 72 hours',
    severity: 'serious',
    seadReference: 'SEAD-3, Section 4.3',
  },
  'substance-abuse': {
    label: 'Substance Abuse',
    description: 'Drug use, alcohol-related incident, or treatment',
    reportingDeadline: 'Within 5 business days',
    severity: 'serious',
    seadReference: 'SEAD-4, Guidelines G & H',
  },
  'mental-health': {
    label: 'Mental Health Concern',
    description: 'Condition potentially affecting judgment or reliability',
    reportingDeadline: 'As appropriate (with medical privacy protections)',
    severity: 'moderate',
    seadReference: 'SEAD-4, Guideline I',
  },
  'security-violation': {
    label: 'Security Infraction/Violation',
    description: 'Failure to follow security procedures',
    reportingDeadline: 'Immediately upon discovery',
    severity: 'serious',
    seadReference: '32 CFR 117.13(d)(7)',
  },
  'unauthorized-disclosure': {
    label: 'Unauthorized Disclosure',
    description: 'Disclosure of classified information to unauthorized persons',
    reportingDeadline: 'Immediately',
    severity: 'critical',
    seadReference: '32 CFR 117.13(d)(7), EO 13526',
  },
  'insider-threat': {
    label: 'Insider Threat Indicator',
    description: 'Behavioral indicators of potential insider threat',
    reportingDeadline: 'Immediately',
    severity: 'critical',
    seadReference: 'SEAD-3, Section 5; EO 13587',
  },
  'coercion-attempt': {
    label: 'Coercion/Blackmail Attempt',
    description: 'Attempted coercion, blackmail, or exploitation',
    reportingDeadline: 'Immediately',
    severity: 'critical',
    seadReference: 'SEAD-3, Section 4.5',
  },
  'technology-misuse': {
    label: 'IT Systems Misuse',
    description: 'Unauthorized access or misuse of information systems',
    reportingDeadline: 'Within 24 hours',
    severity: 'serious',
    seadReference: 'SEAD-4, Guideline M',
  },
  'outside-employment': {
    label: 'Unreported Outside Employment',
    description: 'Employment or consulting not previously reported',
    reportingDeadline: 'Before commencement',
    severity: 'low',
    seadReference: 'SEAD-4, Guideline L',
  },
  'other': {
    label: 'Other Reportable Event',
    description: 'Other event requiring FSO notification',
    reportingDeadline: 'Per facility policy',
    severity: 'moderate',
    seadReference: '32 CFR 117.13(d)',
  },
};

/** CV Alert type display config */
export const CV_ALERT_TYPES: Record<CVAlertType, {
  label: string;
  description: string;
  defaultSeverity: CVAlert['severity'];
  responseTimeframe: string;
}> = {
  'criminal-record': {
    label: 'Criminal Record',
    description: 'New arrest, charge, or conviction detected',
    defaultSeverity: 'high',
    responseTimeframe: '72 hours',
  },
  'financial-derogatory': {
    label: 'Financial Issue',
    description: 'New derogatory credit information detected',
    defaultSeverity: 'moderate',
    responseTimeframe: '5 business days',
  },
  'foreign-travel': {
    label: 'Foreign Travel',
    description: 'International travel detected',
    defaultSeverity: 'low',
    responseTimeframe: '10 business days',
  },
  'social-media': {
    label: 'Social Media Concern',
    description: 'Concerning social media activity flagged',
    defaultSeverity: 'moderate',
    responseTimeframe: '5 business days',
  },
  'public-record': {
    label: 'Public Record',
    description: 'New court records, liens, or judgments',
    defaultSeverity: 'moderate',
    responseTimeframe: '5 business days',
  },
  'employment-change': {
    label: 'Employment Change',
    description: 'Job change or termination detected',
    defaultSeverity: 'informational',
    responseTimeframe: '10 business days',
  },
  'identity-verification': {
    label: 'Identity Discrepancy',
    description: 'Identity information mismatch detected',
    defaultSeverity: 'high',
    responseTimeframe: '72 hours',
  },
  'terrorist-watchlist': {
    label: 'Watchlist Match',
    description: 'Match against terrorist watchlist or sanctions list',
    defaultSeverity: 'critical',
    responseTimeframe: 'Immediately',
  },
  'foreign-contact': {
    label: 'Foreign Contact',
    description: 'New foreign contact association detected',
    defaultSeverity: 'moderate',
    responseTimeframe: '5 business days',
  },
  'reinvestigation-due': {
    label: 'Reinvestigation Due',
    description: 'Periodic reinvestigation deadline approaching',
    defaultSeverity: 'informational',
    responseTimeframe: '30 days',
  },
  'other': {
    label: 'Other',
    description: 'Other continuous vetting alert',
    defaultSeverity: 'low',
    responseTimeframe: '10 business days',
  },
};
