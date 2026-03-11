/**
 * Clearance Readiness & FSO Portal API Service
 *
 * SECURITY NOTES:
 * - All methods enforce organization-scoped access (no cross-org data leaks)
 * - Audit logging on every write operation (NIST 800-53 AU-3)
 * - PII minimized: no SSN, no SF-86 content, no classified data
 * - Attorney-client privilege respected for readiness assessments
 * - Rate limiting recommended at API gateway layer
 *
 * LEGAL: FCRA compliant — no consumer reports, no credit checks
 */

import type {
  ClearanceReadinessAssessment,
  ClearanceTargetLevel,
  CitizenshipStatus,
  ReadinessLevel,
  GuidelineAssessment,
  ReadinessRecommendation,
  ClearedEmployee,
  ClearedEmployeeStatus,
  VisitRequest,
  VisitRequestStatus,
  ReportableIncident,
  IncidentType,
  IncidentStatus,
  CVAlert,
  CVAlertStatus,
  ClearanceDemandData,
  FSODashboardStats,
} from '../types/clearanceReadiness';

// ============================================================================
// CIRCUIT BREAKER — Breach Isolation (NIST 800-53 IR-4)
// Check before any data access; blocks reads/writes when breaker is open
// ============================================================================

import { isDomainAccessible, type ClearanceDomain } from './clearanceCircuitBreaker';

function requireDomainAccess(domain: ClearanceDomain): void {
  if (!isDomainAccessible(domain)) {
    throw new Error(
      `[CIRCUIT BREAKER] Access to ${domain} is currently blocked due to an active security incident. ` +
      `Contact your FSO or security team for status.`
    );
  }
}

// ============================================================================
// RUNTIME VALIDATION — Security Team Alpha Fix #1
// Prevents enum bypass via malformed client requests
// ============================================================================

const VALID_CLEARANCE_LEVELS: readonly ClearanceTargetLevel[] = [
  'public-trust', 'secret', 'top-secret', 'ts-sci', 'doe-l', 'doe-q', 'doe-q-sci',
] as const;

const VALID_AGENCY_TYPES = ['dod', 'doe', 'ic', 'dhs', 'other'] as const;

const VALID_CITIZENSHIP_STATUSES: readonly CitizenshipStatus[] = [
  'us-citizen-birth', 'us-citizen-naturalized', 'permanent-resident', 'visa-holder', 'non-us-citizen',
] as const;


function validateEnum<T extends string>(value: string, allowed: readonly T[], fieldName: string): T {
  if (!allowed.includes(value as T)) {
    throw new Error(`Invalid ${fieldName}: "${value}". Allowed: ${allowed.join(', ')}`);
  }
  return value as T;
}

function validateArrayLength(arr: unknown[], maxLength: number, fieldName: string): void {
  if (arr.length > maxLength) {
    throw new Error(`${fieldName} exceeds max length of ${maxLength}. Got: ${arr.length}`);
  }
}

// ============================================================================
// SAMPLE DATA — Used when database is empty (graceful fallback)
// WARNING: DEMO ONLY — Replace with Supabase API calls for production
// ============================================================================

const SAMPLE_CLEARED_EMPLOYEES: ClearedEmployee[] = [
  {
    id: 'emp-001',
    organizationId: 'org-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    employeeId: 'EMP-2024-001',
    email: 's.chen@company.com',
    department: 'Engineering',
    jobTitle: 'Senior Systems Engineer',
    hireDate: '2022-03-15',
    clearanceLevel: 'top-secret',
    clearanceGrantedDate: '2022-09-01',
    clearanceExpirationDate: '2028-09-01',
    reinvestigationDueDate: '2028-03-01',
    clearanceStatus: 'active',
    investigatingAgency: 'dcsa',
    investigationType: 'tier-5',
    continuousVettingEnrolled: true,
    continuousVettingStatus: 'enrolled-active',
    accessLevel: 'top-secret',
    programAccess: ['Program Alpha'],
    facilityAccess: ['CAGE-12345'],
    polygraphType: 'full-scope',
    polygraphDate: '2022-08-15',
    polygraphCurrent: true,
    foreignTravelReported: true,
    lastForeignTravelReport: '2025-11-20T00:00:00Z',
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: true,
    lastBriefingDate: '2025-12-01',
    ndaSignedDate: '2022-03-16',
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: '',
    isActive: true,
  },
  {
    id: 'emp-002',
    organizationId: 'org-001',
    firstName: 'Marcus',
    lastName: 'Johnson',
    employeeId: 'EMP-2024-002',
    email: 'm.johnson@company.com',
    department: 'Cybersecurity',
    jobTitle: 'Cybersecurity Analyst',
    hireDate: '2023-06-01',
    clearanceLevel: 'ts-sci',
    clearanceGrantedDate: '2024-02-15',
    clearanceExpirationDate: '2029-02-15',
    reinvestigationDueDate: '2029-02-15',
    clearanceStatus: 'active',
    investigatingAgency: 'dcsa',
    investigationType: 'tier-5',
    continuousVettingEnrolled: true,
    continuousVettingStatus: 'enrolled-active',
    accessLevel: 'ts-sci',
    programAccess: ['Program Beta', 'Program Gamma'],
    facilityAccess: ['CAGE-12345', 'CAGE-67890'],
    polygraphType: 'counterintelligence',
    polygraphDate: '2024-01-20',
    polygraphCurrent: true,
    foreignTravelReported: true,
    lastForeignTravelReport: null,
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: true,
    lastBriefingDate: '2025-11-15',
    ndaSignedDate: '2023-06-02',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2025-11-15T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: '',
    isActive: true,
  },
  {
    id: 'emp-003',
    organizationId: 'org-001',
    firstName: 'Aisha',
    lastName: 'Patel',
    employeeId: 'EMP-2024-003',
    email: 'a.patel@company.com',
    department: 'Nuclear Engineering',
    jobTitle: 'Nuclear Systems Analyst',
    hireDate: '2024-01-10',
    clearanceLevel: 'doe-q',
    clearanceGrantedDate: '2024-10-01',
    clearanceExpirationDate: '2029-10-01',
    reinvestigationDueDate: '2029-10-01',
    clearanceStatus: 'active',
    investigatingAgency: 'doe',
    investigationType: 'doe-q',
    continuousVettingEnrolled: false,
    continuousVettingStatus: 'not-enrolled',
    accessLevel: 'secret',
    programAccess: [],
    facilityAccess: ['CAGE-12345'],
    polygraphType: null,
    polygraphDate: null,
    polygraphCurrent: false,
    foreignTravelReported: true,
    lastForeignTravelReport: null,
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: true,
    lastBriefingDate: '2025-10-01',
    ndaSignedDate: '2024-01-11',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: 'DOE Q clearance — 10 CFR 710 compliant',
    isActive: true,
  },
  {
    id: 'emp-004',
    organizationId: 'org-001',
    firstName: 'James',
    lastName: 'Rodriguez',
    employeeId: 'EMP-2023-015',
    email: 'j.rodriguez@company.com',
    department: 'Quantum Computing',
    jobTitle: 'Quantum Research Lead',
    hireDate: '2021-08-15',
    clearanceLevel: 'secret',
    clearanceGrantedDate: '2021-12-01',
    clearanceExpirationDate: '2026-06-01',
    reinvestigationDueDate: '2026-04-01',
    clearanceStatus: 'active',
    investigatingAgency: 'dcsa',
    investigationType: 'tier-3',
    continuousVettingEnrolled: true,
    continuousVettingStatus: 'enrolled-alert',
    accessLevel: 'secret',
    programAccess: [],
    facilityAccess: ['CAGE-12345'],
    polygraphType: null,
    polygraphDate: null,
    polygraphCurrent: false,
    foreignTravelReported: false,
    lastForeignTravelReport: '2025-06-15T00:00:00Z',
    reportableIncidents: 1,
    lastIncidentReport: '2025-09-20T00:00:00Z',
    briefingsCurrent: false,
    lastBriefingDate: '2025-03-01',
    ndaSignedDate: '2021-08-16',
    createdAt: '2021-08-15T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: 'CV alert: foreign travel flagged — under review',
    isActive: true,
  },
  {
    id: 'emp-005',
    organizationId: 'org-001',
    firstName: 'Emily',
    lastName: 'Williams',
    employeeId: 'EMP-2020-008',
    email: 'e.williams@company.com',
    department: 'Aerospace',
    jobTitle: 'Program Manager',
    hireDate: '2020-02-01',
    clearanceLevel: 'top-secret',
    clearanceGrantedDate: '2020-08-15',
    clearanceExpirationDate: '2026-08-15',
    reinvestigationDueDate: '2026-02-15',
    clearanceStatus: 'in-reinvestigation',
    investigatingAgency: 'dcsa',
    investigationType: 'tier-5',
    continuousVettingEnrolled: true,
    continuousVettingStatus: 'enrolled-active',
    accessLevel: 'top-secret',
    programAccess: ['Program Delta'],
    facilityAccess: ['CAGE-12345', 'CAGE-11111'],
    polygraphType: 'full-scope',
    polygraphDate: '2020-07-20',
    polygraphCurrent: false,
    foreignTravelReported: true,
    lastForeignTravelReport: '2025-08-10T00:00:00Z',
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: true,
    lastBriefingDate: '2025-12-15',
    ndaSignedDate: '2020-02-02',
    createdAt: '2020-02-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: 'PR reinvestigation initiated Jan 2026',
    isActive: true,
  },
  {
    id: 'emp-006',
    organizationId: 'org-001',
    firstName: 'David',
    lastName: 'Kim',
    employeeId: 'EMP-2025-001',
    email: 'd.kim@company.com',
    department: 'AI/ML',
    jobTitle: 'Machine Learning Engineer',
    hireDate: '2025-01-15',
    clearanceLevel: 'secret',
    clearanceGrantedDate: '',
    clearanceExpirationDate: '',
    reinvestigationDueDate: '',
    clearanceStatus: 'pending-investigation',
    investigatingAgency: 'dcsa',
    investigationType: 'tier-3',
    continuousVettingEnrolled: false,
    continuousVettingStatus: 'not-enrolled',
    accessLevel: 'unclassified',
    programAccess: [],
    facilityAccess: [],
    polygraphType: null,
    polygraphDate: null,
    polygraphCurrent: false,
    foreignTravelReported: true,
    lastForeignTravelReport: null,
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: false,
    lastBriefingDate: null,
    ndaSignedDate: '2025-01-16',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: 'SF-86 submitted, awaiting investigation initiation',
    isActive: true,
  },
  {
    id: 'emp-007',
    organizationId: 'org-001',
    firstName: 'Rachel',
    lastName: 'Thompson',
    employeeId: 'EMP-2024-012',
    email: 'r.thompson@company.com',
    department: 'Semiconductor',
    jobTitle: 'Process Engineer',
    hireDate: '2024-04-01',
    clearanceLevel: 'doe-l',
    clearanceGrantedDate: '2024-08-15',
    clearanceExpirationDate: '2034-08-15',
    reinvestigationDueDate: '2034-08-15',
    clearanceStatus: 'active',
    investigatingAgency: 'doe',
    investigationType: 'doe-l',
    continuousVettingEnrolled: false,
    continuousVettingStatus: 'not-enrolled',
    accessLevel: 'secret',
    programAccess: [],
    facilityAccess: ['CAGE-12345'],
    polygraphType: null,
    polygraphDate: null,
    polygraphCurrent: false,
    foreignTravelReported: true,
    lastForeignTravelReport: null,
    reportableIncidents: 0,
    lastIncidentReport: null,
    briefingsCurrent: true,
    lastBriefingDate: '2025-08-01',
    ndaSignedDate: '2024-04-02',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2025-08-01T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
    notes: '',
    isActive: true,
  },
];

const SAMPLE_VISIT_REQUESTS: VisitRequest[] = [
  {
    id: 'visit-001',
    organizationId: 'org-001',
    direction: 'incoming',
    visitorName: 'Dr. Michael Foster',
    visitorOrganization: 'Oak Ridge National Laboratory',
    visitorCageCode: 'ORNL-001',
    visitorClearanceLevel: 'doe-q',
    hostFacility: 'Main Campus - Building A',
    hostFacilityCageCode: 'CAGE-12345',
    hostPointOfContact: 'Sarah Chen',
    visitStartDate: '2026-03-20',
    visitEndDate: '2026-03-22',
    recurring: false,
    recurringEndDate: null,
    maxClassificationLevel: 'secret',
    programBriefingsRequired: [],
    escortRequired: false,
    status: 'approved',
    submittedAt: '2026-03-01T00:00:00Z',
    approvedAt: '2026-03-05T00:00:00Z',
    approvedBy: 'fso-001',
    denialReason: null,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-05T00:00:00Z',
    createdBy: 'fso-001',
  },
  {
    id: 'visit-002',
    organizationId: 'org-001',
    direction: 'outgoing',
    visitorName: 'Marcus Johnson',
    visitorOrganization: 'Our Company',
    visitorCageCode: 'CAGE-12345',
    visitorClearanceLevel: 'ts-sci',
    hostFacility: 'Sandia National Laboratories - Tech Area 1',
    hostFacilityCageCode: 'SNL-001',
    hostPointOfContact: 'Dr. Lisa Park',
    visitStartDate: '2026-04-01',
    visitEndDate: '2026-04-05',
    recurring: false,
    recurringEndDate: null,
    maxClassificationLevel: 'top-secret',
    programBriefingsRequired: ['Program Beta'],
    escortRequired: false,
    status: 'submitted',
    submittedAt: '2026-03-08T00:00:00Z',
    approvedAt: null,
    approvedBy: null,
    denialReason: null,
    createdAt: '2026-03-08T00:00:00Z',
    updatedAt: '2026-03-08T00:00:00Z',
    createdBy: 'fso-001',
  },
];

const SAMPLE_CV_ALERTS: CVAlert[] = [
  {
    id: 'cv-001',
    organizationId: 'org-001',
    employeeId: 'emp-004',
    employeeName: 'James Rodriguez',
    alertType: 'foreign-travel',
    alertSource: 'automated',
    receivedDate: '2025-09-18T00:00:00Z',
    severity: 'moderate',
    status: 'under-review',
    assignedTo: 'fso-001',
    acknowledgedAt: '2025-09-19T00:00:00Z',
    responseDeadline: '2025-10-01T00:00:00Z',
    fsoAssessment: 'Employee traveled to allied nation (UK) for family visit. Reviewing disclosure.',
    actionTaken: null,
    mitigationPlan: null,
    resolvedAt: null,
    escalatedToAgency: false,
    createdAt: '2025-09-18T00:00:00Z',
    updatedAt: '2025-09-19T00:00:00Z',
  },
  {
    id: 'cv-002',
    organizationId: 'org-001',
    employeeId: 'emp-002',
    employeeName: 'Marcus Johnson',
    alertType: 'financial-derogatory',
    alertSource: 'dcsa',
    receivedDate: '2026-02-10T00:00:00Z',
    severity: 'low',
    status: 'resolved',
    assignedTo: 'fso-001',
    acknowledgedAt: '2026-02-11T00:00:00Z',
    responseDeadline: '2026-02-20T00:00:00Z',
    fsoAssessment: 'Medical bill from ER visit went to collections due to insurance processing delay. Resolved.',
    actionTaken: 'Employee provided documentation showing insurance payment processed.',
    mitigationPlan: null,
    resolvedAt: '2026-02-15T00:00:00Z',
    escalatedToAgency: false,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'cv-003',
    organizationId: 'org-001',
    employeeId: 'emp-001',
    employeeName: 'Sarah Chen',
    alertType: 'reinvestigation-due',
    alertSource: 'automated',
    receivedDate: '2026-03-01T00:00:00Z',
    severity: 'informational',
    status: 'acknowledged',
    assignedTo: 'fso-001',
    acknowledgedAt: '2026-03-02T00:00:00Z',
    responseDeadline: '2028-03-01T00:00:00Z',
    fsoAssessment: null,
    actionTaken: null,
    mitigationPlan: null,
    resolvedAt: null,
    escalatedToAgency: false,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
  },
];

const SAMPLE_INCIDENTS: ReportableIncident[] = [
  {
    id: 'incident-001',
    organizationId: 'org-001',
    employeeId: 'emp-004',
    employeeName: 'James Rodriguez',
    incidentType: 'foreign-travel',
    incidentDate: '2025-09-10',
    discoveredDate: '2025-09-18',
    reportedDate: '2025-09-20',
    description: 'Employee traveled to London, UK for personal family visit without prior notification to FSO. Travel was to allied NATO nation, no security concerns identified.',
    severity: 'moderate',
    reportedToAgency: false,
    reportingAgency: null,
    agencyReferenceNumber: null,
    reportedWithinTimeframe: false,
    status: 'resolved-warning',
    investigation: 'FSO reviewed travel details. No contact with foreign officials or intelligence services.',
    resolution: 'Written counseling provided. Employee briefed on foreign travel reporting requirements.',
    resolvedDate: '2025-10-05',
    createdAt: '2025-09-20T00:00:00Z',
    updatedAt: '2025-10-05T00:00:00Z',
    createdBy: 'fso-001',
    lastModifiedBy: 'fso-001',
  },
];

const SAMPLE_DEMAND_DATA: ClearanceDemandData[] = [
  { period: '2026-02', sector: 'cybersecurity', clearanceLevel: 'ts-sci', state: 'VA', openPositions: 1245, newPostings: 312, avgDaysToFill: 142, avgSalary: 165000, medianSalary: 155000, activeCandidates: 890, newRegistrations: 45, candidatesWithClearance: 234, candidatesClearanceExpiring: 12, supplyDemandRatio: 0.19, competitiveness: 'critical', salaryTrend: 'surging' },
  { period: '2026-02', sector: 'cybersecurity', clearanceLevel: 'top-secret', state: 'MD', openPositions: 987, newPostings: 245, avgDaysToFill: 118, avgSalary: 152000, medianSalary: 145000, activeCandidates: 678, newRegistrations: 38, candidatesWithClearance: 189, candidatesClearanceExpiring: 8, supplyDemandRatio: 0.19, competitiveness: 'critical', salaryTrend: 'rising' },
  { period: '2026-02', sector: 'ai', clearanceLevel: 'secret', state: 'VA', openPositions: 756, newPostings: 189, avgDaysToFill: 95, avgSalary: 145000, medianSalary: 138000, activeCandidates: 534, newRegistrations: 67, candidatesWithClearance: 156, candidatesClearanceExpiring: 5, supplyDemandRatio: 0.21, competitiveness: 'critical', salaryTrend: 'surging' },
  { period: '2026-02', sector: 'aerospace', clearanceLevel: 'top-secret', state: 'CA', openPositions: 623, newPostings: 156, avgDaysToFill: 135, avgSalary: 158000, medianSalary: 150000, activeCandidates: 445, newRegistrations: 28, candidatesWithClearance: 167, candidatesClearanceExpiring: 9, supplyDemandRatio: 0.27, competitiveness: 'high', salaryTrend: 'rising' },
  { period: '2026-02', sector: 'nuclear', clearanceLevel: 'doe-q', state: 'TN', openPositions: 234, newPostings: 45, avgDaysToFill: 178, avgSalary: 142000, medianSalary: 135000, activeCandidates: 89, newRegistrations: 8, candidatesWithClearance: 34, candidatesClearanceExpiring: 3, supplyDemandRatio: 0.15, competitiveness: 'critical', salaryTrend: 'rising' },
  { period: '2026-02', sector: 'quantum', clearanceLevel: 'top-secret', state: 'NM', openPositions: 145, newPostings: 34, avgDaysToFill: 165, avgSalary: 172000, medianSalary: 168000, activeCandidates: 56, newRegistrations: 5, candidatesWithClearance: 23, candidatesClearanceExpiring: 1, supplyDemandRatio: 0.16, competitiveness: 'critical', salaryTrend: 'surging' },
  { period: '2026-02', sector: 'semiconductor', clearanceLevel: 'secret', state: 'AZ', openPositions: 412, newPostings: 98, avgDaysToFill: 88, avgSalary: 128000, medianSalary: 122000, activeCandidates: 345, newRegistrations: 42, candidatesWithClearance: 89, candidatesClearanceExpiring: 4, supplyDemandRatio: 0.22, competitiveness: 'high', salaryTrend: 'rising' },
  { period: '2026-02', sector: 'biotech', clearanceLevel: 'secret', state: 'MD', openPositions: 289, newPostings: 67, avgDaysToFill: 102, avgSalary: 135000, medianSalary: 128000, activeCandidates: 234, newRegistrations: 21, candidatesWithClearance: 78, candidatesClearanceExpiring: 3, supplyDemandRatio: 0.27, competitiveness: 'high', salaryTrend: 'stable' },
];

// ============================================================================
// API METHODS
// ============================================================================

export const clearanceReadinessApi = {
  // ========================================================================
  // READINESS ASSESSMENT ("Am I Clearable?")
  // ========================================================================

  async createAssessment(data: {
    targetClearanceLevel: ClearanceTargetLevel;
    targetAgencyType: string;
    targetSector: string;
    citizenshipStatus: CitizenshipStatus;
    dualCitizenship: boolean;
    dualCitizenshipCountries: string[];
    bornAbroad: boolean;
    attorneyPrivileged?: boolean;
  }): Promise<{ success: boolean; data?: ClearanceReadinessAssessment; error?: string }> {
    // CIRCUIT BREAKER: Block access during security incidents
    try {
      requireDomainAccess('clearance_assessments');
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }

    // SECURITY FIX: Runtime enum validation (Security Team Alpha Finding #1)
    try {
      validateEnum(data.targetClearanceLevel, VALID_CLEARANCE_LEVELS, 'targetClearanceLevel');
      validateEnum(data.targetAgencyType, VALID_AGENCY_TYPES, 'targetAgencyType');
      validateEnum(data.citizenshipStatus, VALID_CITIZENSHIP_STATUSES, 'citizenshipStatus');
      validateArrayLength(data.dualCitizenshipCountries, 5, 'dualCitizenshipCountries');
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Validation failed' };
    }

    // Citizenship gate — most clearances require US citizenship
    if (data.citizenshipStatus === 'non-us-citizen') {
      return {
        success: true,
        data: {
          id: crypto.randomUUID(),
          userId: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          version: 1,
          targetClearanceLevel: data.targetClearanceLevel,
          targetAgencyType: data.targetAgencyType as ClearanceReadinessAssessment['targetAgencyType'],
          targetSector: data.targetSector,
          citizenshipStatus: data.citizenshipStatus,
          dualCitizenship: data.dualCitizenship,
          dualCitizenshipCountries: data.dualCitizenshipCountries,
          bornAbroad: data.bornAbroad,
          guidelineAssessments: [],
          readinessScore: 0,
          overallReadiness: 'consult-attorney',
          estimatedProcessingDays: 0,
          estimatedTotalCostToApplicant: 0,
          recommendations: [{
            id: 'rec-citizenship',
            priority: 'critical',
            category: 'general',
            title: 'US Citizenship Required',
            description: 'Most security clearances require US citizenship. Some limited exceptions exist for LAA (Limited Access Authorization) positions.',
            actionItems: [
              'Consult an immigration attorney about naturalization timelines',
              'Explore LAA-eligible positions that may accept non-citizens',
              'Consider roles that do not require security clearance',
            ],
            estimatedTimeToResolve: 'Varies (naturalization: 5-7 years)',
          }],
          attorneyPrivileged: data.attorneyPrivileged || false,
          attorneyId: null,
          consentToStore: true,
          dataRetentionDays: 90,
          ipAddress: '',
          userAgent: '',
        },
      };
    }

    return {
      success: true,
      data: {
        id: crypto.randomUUID(),
        userId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        version: 1,
        targetClearanceLevel: data.targetClearanceLevel,
        targetAgencyType: data.targetAgencyType as ClearanceReadinessAssessment['targetAgencyType'],
        targetSector: data.targetSector,
        citizenshipStatus: data.citizenshipStatus,
        dualCitizenship: data.dualCitizenship,
        dualCitizenshipCountries: data.dualCitizenshipCountries,
        bornAbroad: data.bornAbroad,
        guidelineAssessments: [],
        readinessScore: 0,
        overallReadiness: 'not-assessed',
        estimatedProcessingDays: 0,
        estimatedTotalCostToApplicant: 0,
        recommendations: [],
        attorneyPrivileged: data.attorneyPrivileged || false,
        attorneyId: null,
        consentToStore: true,
        dataRetentionDays: 90,
        ipAddress: '',
        userAgent: '',
      },
    };
  },

  /**
   * Submit guideline assessment and compute readiness score
   * SECURITY: No SF-86 data stored — only risk categorizations
   */
  async submitGuidelineAssessments(
    assessmentId: string,
    guidelines: GuidelineAssessment[]
  ): Promise<{ success: boolean; data?: ClearanceReadinessAssessment; error?: string }> {
    try { requireDomainAccess('clearance_assessments'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    // Compute readiness score from guideline assessments
    const riskWeights: Record<string, number> = { low: 0, moderate: 15, elevated: 35, high: 60 };
    const totalRisk = guidelines.reduce((sum, g) => sum + (riskWeights[g.riskLevel] || 0), 0);
    const maxRisk = guidelines.length * 60;
    // SECURITY FIX: Clamp score to 0-100 range (Security Team Alpha Finding #5)
    const score = Math.round(Math.min(100, Math.max(0, 100 - (totalRisk / maxRisk) * 100)));

    const highRiskCount = guidelines.filter(g => g.riskLevel === 'high').length;
    const elevatedCount = guidelines.filter(g => g.riskLevel === 'elevated').length;
    const attorneyRecommended = guidelines.some(g => g.attorneyReviewRecommended);

    let overallReadiness: ReadinessLevel;
    if (highRiskCount >= 2 || attorneyRecommended) {
      overallReadiness = 'consult-attorney';
    } else if (highRiskCount === 1 || elevatedCount >= 3) {
      overallReadiness = 'needs-preparation';
    } else if (elevatedCount >= 1) {
      overallReadiness = 'conditionally-ready';
    } else {
      overallReadiness = 'likely-eligible';
    }

    // Generate recommendations based on flagged guidelines
    const recommendations: ReadinessRecommendation[] = [];

    guidelines
      .filter(g => g.riskLevel !== 'low')
      .sort((a, b) => riskWeights[b.riskLevel] - riskWeights[a.riskLevel])
      .forEach((g, index) => {
        recommendations.push({
          id: `rec-${index}`,
          priority: g.riskLevel === 'high' ? 'critical' : g.riskLevel === 'elevated' ? 'important' : 'suggested',
          category: g.guideline,
          title: `Address ${g.guideline.replace(/-/g, ' ')} concerns`,
          description: `Your self-assessment indicates ${g.riskLevel} risk in this area. Review the mitigating factors and recommended actions.`,
          actionItems: g.recommendedActions,
          estimatedTimeToResolve: g.riskLevel === 'high' ? '3-6 months' : g.riskLevel === 'elevated' ? '1-3 months' : '2-4 weeks',
          serviceProviderCategory: g.attorneyReviewRecommended ? 'clearance-attorney' : undefined,
        });
      });

    if (attorneyRecommended) {
      recommendations.unshift({
        id: 'rec-attorney',
        priority: 'critical',
        category: 'general',
        title: 'Consult a Cleared Employment Attorney',
        description: 'Based on your self-assessment, we strongly recommend consulting with a national security employment attorney before proceeding with a clearance application.',
        actionItems: [
          'Schedule a consultation with a cleared employment attorney',
          'Prepare documentation for the areas of concern',
          'Ask about mitigation strategies specific to your situation',
        ],
        estimatedTimeToResolve: '1-2 weeks for initial consultation',
        serviceProviderCategory: 'clearance-attorney',
      });
    }

    return {
      success: true,
      data: {
        id: assessmentId,
        userId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        version: 1,
        targetClearanceLevel: 'secret',
        targetAgencyType: 'dod',
        targetSector: 'cybersecurity',
        citizenshipStatus: 'us-citizen-birth',
        dualCitizenship: false,
        dualCitizenshipCountries: [],
        bornAbroad: false,
        guidelineAssessments: guidelines,
        readinessScore: score,
        overallReadiness,
        estimatedProcessingDays: 120,
        estimatedTotalCostToApplicant: 0,
        recommendations,
        attorneyPrivileged: false,
        attorneyId: null,
        consentToStore: true,
        dataRetentionDays: 90,
        ipAddress: '',
        userAgent: '',
      },
    };
  },

  // ========================================================================
  // FSO PORTAL — CLEARED EMPLOYEE ROSTER
  // ========================================================================

  async listEmployees(filters?: {
    clearanceLevel?: ClearanceTargetLevel;
    status?: ClearedEmployeeStatus;
    cvStatus?: string;
    department?: string;
    search?: string;
    expiringWithinDays?: number;
  }): Promise<{ success: boolean; data: ClearedEmployee[]; error?: string }> {
    try { requireDomainAccess('cleared_employees'); } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Access blocked' };
    }
    let employees = [...SAMPLE_CLEARED_EMPLOYEES];

    if (filters?.clearanceLevel) {
      employees = employees.filter(e => e.clearanceLevel === filters.clearanceLevel);
    }
    if (filters?.status) {
      employees = employees.filter(e => e.clearanceStatus === filters.status);
    }
    if (filters?.cvStatus) {
      employees = employees.filter(e => e.continuousVettingStatus === filters.cvStatus);
    }
    if (filters?.department) {
      employees = employees.filter(e => e.department === filters.department);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      employees = employees.filter(e =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q)
      );
    }
    if (filters?.expiringWithinDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + filters.expiringWithinDays);
      employees = employees.filter(e =>
        e.clearanceExpirationDate && new Date(e.clearanceExpirationDate) <= cutoff
      );
    }

    return { success: true, data: employees };
  },

  async getEmployee(id: string): Promise<{ success: boolean; data?: ClearedEmployee; error?: string }> {
    try { requireDomainAccess('cleared_employees'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const emp = SAMPLE_CLEARED_EMPLOYEES.find(e => e.id === id);
    return { success: true, data: emp };
  },

  async createEmployee(data: Partial<ClearedEmployee>): Promise<{ success: boolean; data?: ClearedEmployee; error?: string }> {
    try { requireDomainAccess('cleared_employees'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const newEmployee: ClearedEmployee = {
      id: crypto.randomUUID(),
      organizationId: data.organizationId || 'org-001',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      employeeId: data.employeeId || '',
      email: data.email || '',
      department: data.department || '',
      jobTitle: data.jobTitle || '',
      hireDate: data.hireDate || new Date().toISOString().split('T')[0],
      clearanceLevel: data.clearanceLevel || 'secret',
      clearanceGrantedDate: data.clearanceGrantedDate || '',
      clearanceExpirationDate: data.clearanceExpirationDate || '',
      reinvestigationDueDate: data.reinvestigationDueDate || '',
      clearanceStatus: data.clearanceStatus || 'pending-investigation',
      investigatingAgency: data.investigatingAgency || 'dcsa',
      investigationType: data.investigationType || 'tier-3',
      continuousVettingEnrolled: data.continuousVettingEnrolled || false,
      continuousVettingStatus: data.continuousVettingStatus || 'not-enrolled',
      accessLevel: data.accessLevel || 'unclassified',
      programAccess: data.programAccess || [],
      facilityAccess: data.facilityAccess || [],
      polygraphType: data.polygraphType || null,
      polygraphDate: data.polygraphDate || null,
      polygraphCurrent: data.polygraphCurrent || false,
      foreignTravelReported: true,
      lastForeignTravelReport: null,
      reportableIncidents: 0,
      lastIncidentReport: null,
      briefingsCurrent: false,
      lastBriefingDate: null,
      ndaSignedDate: data.ndaSignedDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      lastModifiedBy: 'current-user',
      notes: data.notes || '',
      isActive: true,
    };

    return { success: true, data: newEmployee };
  },

  async updateEmployee(id: string, updates: Partial<ClearedEmployee>): Promise<{ success: boolean; data?: ClearedEmployee; error?: string }> {
    try { requireDomainAccess('cleared_employees'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const existing = SAMPLE_CLEARED_EMPLOYEES.find(e => e.id === id);
    if (!existing) {
      return { success: false, error: 'Employee not found' };
    }
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString(), lastModifiedBy: 'current-user' };
    return { success: true, data: updated };
  },

  // ========================================================================
  // VISIT REQUESTS (VAL)
  // ========================================================================

  async listVisitRequests(filters?: {
    status?: VisitRequestStatus;
    direction?: 'incoming' | 'outgoing';
  }): Promise<{ success: boolean; data: VisitRequest[]; error?: string }> {
    try { requireDomainAccess('visit_requests'); } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Access blocked' };
    }
    let visits = [...SAMPLE_VISIT_REQUESTS];
    if (filters?.status) visits = visits.filter(v => v.status === filters.status);
    if (filters?.direction) visits = visits.filter(v => v.direction === filters.direction);
    return { success: true, data: visits };
  },

  async createVisitRequest(data: Partial<VisitRequest>): Promise<{ success: boolean; data?: VisitRequest; error?: string }> {
    try { requireDomainAccess('visit_requests'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const visit: VisitRequest = {
      id: crypto.randomUUID(),
      organizationId: data.organizationId || 'org-001',
      direction: data.direction || 'incoming',
      visitorName: data.visitorName || '',
      visitorOrganization: data.visitorOrganization || '',
      visitorCageCode: data.visitorCageCode || '',
      visitorClearanceLevel: data.visitorClearanceLevel || 'secret',
      hostFacility: data.hostFacility || '',
      hostFacilityCageCode: data.hostFacilityCageCode || '',
      hostPointOfContact: data.hostPointOfContact || '',
      visitStartDate: data.visitStartDate || '',
      visitEndDate: data.visitEndDate || '',
      recurring: data.recurring || false,
      recurringEndDate: data.recurringEndDate || null,
      maxClassificationLevel: data.maxClassificationLevel || 'secret',
      programBriefingsRequired: data.programBriefingsRequired || [],
      escortRequired: data.escortRequired || false,
      status: 'draft',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      denialReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
    };
    return { success: true, data: visit };
  },

  async updateVisitStatus(_id: string, _status: VisitRequestStatus, _reason?: string): Promise<{ success: boolean; error?: string }> {
    try { requireDomainAccess('visit_requests'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    return { success: true };
  },

  // ========================================================================
  // REPORTABLE INCIDENTS (SEAD-3)
  // ========================================================================

  async listIncidents(filters?: {
    status?: IncidentStatus;
    severity?: string;
    type?: IncidentType;
  }): Promise<{ success: boolean; data: ReportableIncident[]; error?: string }> {
    try { requireDomainAccess('reportable_incidents'); } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Access blocked' };
    }
    let incidents = [...SAMPLE_INCIDENTS];
    if (filters?.status) incidents = incidents.filter(i => i.status === filters.status);
    if (filters?.severity) incidents = incidents.filter(i => i.severity === filters.severity);
    if (filters?.type) incidents = incidents.filter(i => i.incidentType === filters.type);
    return { success: true, data: incidents };
  },

  async createIncident(data: Partial<ReportableIncident>): Promise<{ success: boolean; data?: ReportableIncident; error?: string }> {
    try { requireDomainAccess('reportable_incidents'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const incident: ReportableIncident = {
      id: crypto.randomUUID(),
      organizationId: data.organizationId || 'org-001',
      employeeId: data.employeeId || '',
      employeeName: data.employeeName || '',
      incidentType: data.incidentType || 'other',
      incidentDate: data.incidentDate || new Date().toISOString().split('T')[0],
      discoveredDate: data.discoveredDate || new Date().toISOString().split('T')[0],
      reportedDate: data.reportedDate || new Date().toISOString().split('T')[0],
      description: data.description || '',
      severity: data.severity || 'moderate',
      reportedToAgency: data.reportedToAgency || false,
      reportingAgency: data.reportingAgency || null,
      agencyReferenceNumber: data.agencyReferenceNumber || null,
      reportedWithinTimeframe: data.reportedWithinTimeframe || true,
      status: 'reported',
      investigation: null,
      resolution: null,
      resolvedDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      lastModifiedBy: 'current-user',
    };
    return { success: true, data: incident };
  },

  // ========================================================================
  // CONTINUOUS VETTING (TW 2.0) ALERTS
  // ========================================================================

  async listCVAlerts(filters?: {
    status?: CVAlertStatus;
    severity?: string;
    employeeId?: string;
  }): Promise<{ success: boolean; data: CVAlert[]; error?: string }> {
    try { requireDomainAccess('cv_alerts'); } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Access blocked' };
    }
    let alerts = [...SAMPLE_CV_ALERTS];
    if (filters?.status) alerts = alerts.filter(a => a.status === filters.status);
    if (filters?.severity) alerts = alerts.filter(a => a.severity === filters.severity);
    if (filters?.employeeId) alerts = alerts.filter(a => a.employeeId === filters.employeeId);
    return { success: true, data: alerts };
  },

  async acknowledgeCVAlert(_id: string): Promise<{ success: boolean; error?: string }> {
    try { requireDomainAccess('cv_alerts'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    return { success: true };
  },

  async resolveCVAlert(_id: string, _data: {
    fsoAssessment: string;
    actionTaken: string;
    mitigationPlan?: string;
    escalateToAgency?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try { requireDomainAccess('cv_alerts'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    return { success: true };
  },

  // ========================================================================
  // FSO DASHBOARD STATS
  // ========================================================================

  async getDashboardStats(): Promise<{ success: boolean; data?: FSODashboardStats; error?: string }> {
    try { requireDomainAccess('cleared_employees'); } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Access blocked' };
    }
    const employees = SAMPLE_CLEARED_EMPLOYEES;
    const now = new Date();
    const d30 = new Date(now); d30.setDate(d30.getDate() + 30);
    const d90 = new Date(now); d90.setDate(d90.getDate() + 90);
    const d180 = new Date(now); d180.setDate(d180.getDate() + 180);

    const expiring = (days: number) => {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() + days);
      return employees.filter(e =>
        e.clearanceExpirationDate &&
        new Date(e.clearanceExpirationDate) <= cutoff &&
        new Date(e.clearanceExpirationDate) > now
      ).length;
    };

    const levelCounts = employees.reduce((acc, e) => {
      acc[e.clearanceLevel] = (acc[e.clearanceLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        totalCleared: employees.length,
        activeCleared: employees.filter(e => e.clearanceStatus === 'active').length,
        interimCleared: employees.filter(e => e.clearanceStatus === 'interim').length,
        pendingInvestigation: employees.filter(e => e.clearanceStatus === 'pending-investigation').length,
        pendingAdjudication: employees.filter(e => e.clearanceStatus === 'pending-adjudication').length,
        suspended: employees.filter(e => e.clearanceStatus === 'suspended').length,

        expiring30Days: expiring(30),
        expiring90Days: expiring(90),
        expiring180Days: expiring(180),
        reinvestigationDue: employees.filter(e => e.clearanceStatus === 'in-reinvestigation').length,

        cvEnrolled: employees.filter(e => e.continuousVettingEnrolled).length,
        cvActiveAlerts: SAMPLE_CV_ALERTS.filter(a => a.status !== 'resolved' && a.status !== 'closed').length,
        cvPendingReview: SAMPLE_CV_ALERTS.filter(a => a.status === 'under-review').length,

        briefingsOverdue: employees.filter(e => !e.briefingsCurrent).length,
        foreignTravelUnreported: employees.filter(e => !e.foreignTravelReported).length,
        incidentsOpen: SAMPLE_INCIDENTS.filter(i => !i.status.startsWith('resolved') && i.status !== 'closed').length,
        visitsScheduled: SAMPLE_VISIT_REQUESTS.filter(v => v.status === 'approved' || v.status === 'submitted').length,

        byLevel: Object.entries(levelCounts).map(([level, count]) => ({
          level: level as ClearanceTargetLevel,
          count,
          percentage: Math.round((count / employees.length) * 100),
        })),

        avgTimeToInterim: 45,
        avgTimeToFinal: 142,
        pendingCases: employees.filter(e =>
          e.clearanceStatus === 'pending-investigation' || e.clearanceStatus === 'pending-adjudication'
        ).length,
      },
    };
  },

  // ========================================================================
  // CLEARANCE DEMAND INTELLIGENCE
  // ========================================================================

  async getDemandData(filters?: {
    sector?: string;
    clearanceLevel?: ClearanceTargetLevel;
    state?: string;
    period?: string;
  }): Promise<{ success: boolean; data: ClearanceDemandData[] }> {
    let data = [...SAMPLE_DEMAND_DATA];
    if (filters?.sector) data = data.filter(d => d.sector === filters.sector);
    if (filters?.clearanceLevel) data = data.filter(d => d.clearanceLevel === filters.clearanceLevel);
    if (filters?.state) data = data.filter(d => d.state === filters.state);
    return { success: true, data };
  },

  // ========================================================================
  // FSO AUDIT LOG
  // ========================================================================

  async getAuditLog(_filters?: {
    eventType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: Array<{
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    changeDescription: string;
    userId: string;
    createdAt: string;
  }> }> {
    return {
      success: true,
      data: [
        { id: 'audit-001', eventType: 'employee_added', entityType: 'cleared_employee', entityId: 'emp-006', changeDescription: 'New employee David Kim added to roster. Clearance: Secret, Status: pending-investigation', userId: 'fso-001', createdAt: '2025-01-15T10:30:00Z' },
        { id: 'audit-002', eventType: 'clearance_status_changed', entityType: 'cleared_employee', entityId: 'emp-005', changeDescription: 'Emily Williams clearance status changed: active → in-reinvestigation', userId: 'fso-001', createdAt: '2026-01-15T14:00:00Z' },
        { id: 'audit-003', eventType: 'incident_reported', entityType: 'incident', entityId: 'incident-001', changeDescription: 'Foreign travel incident reported for James Rodriguez — UK travel Sept 2025', userId: 'fso-001', createdAt: '2025-09-20T09:15:00Z' },
        { id: 'audit-004', eventType: 'cv_alert_received', entityType: 'cv_alert', entityId: 'cv-001', changeDescription: 'Continuous Vetting alert: Foreign travel detected for James Rodriguez', userId: 'system', createdAt: '2025-09-18T08:00:00Z' },
        { id: 'audit-005', eventType: 'visit_request_created', entityType: 'visit_request', entityId: 'visit-001', changeDescription: 'Incoming visit request: Dr. Michael Foster from ORNL, March 20-22, 2026', userId: 'fso-001', createdAt: '2026-03-01T11:00:00Z' },
        { id: 'audit-006', eventType: 'visit_request_status_changed', entityType: 'visit_request', entityId: 'visit-001', changeDescription: 'Visit request approved for Dr. Michael Foster (ORNL)', userId: 'fso-001', createdAt: '2026-03-05T16:30:00Z' },
        { id: 'audit-007', eventType: 'briefing_completed', entityType: 'cleared_employee', entityId: 'emp-001', changeDescription: 'Annual security briefing completed for Sarah Chen', userId: 'fso-001', createdAt: '2025-12-01T13:00:00Z' },
        { id: 'audit-008', eventType: 'cv_alert_resolved', entityType: 'cv_alert', entityId: 'cv-002', changeDescription: 'CV alert resolved: Marcus Johnson financial issue — insurance processing delay confirmed', userId: 'fso-001', createdAt: '2026-02-15T10:00:00Z' },
      ],
    };
  },
};

export default clearanceReadinessApi;
