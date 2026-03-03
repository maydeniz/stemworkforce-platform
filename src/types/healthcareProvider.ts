// ===========================================
// HEALTHCARE PROVIDER PORTAL - Type Definitions
// Enables healthcare providers to communicate with schools
// ===========================================

import type { IndustryType } from './index';

// Provider Types
export type ProviderType =
  | 'physician'
  | 'nurse-practitioner'
  | 'physician-assistant'
  | 'dentist'
  | 'orthodontist'
  | 'optometrist'
  | 'psychologist'
  | 'psychiatrist'
  | 'physical-therapist'
  | 'occupational-therapist'
  | 'speech-therapist'
  | 'chiropractor'
  | 'pediatrician'
  | 'sports-medicine'
  | 'other';

export type ProviderSpecialty =
  | 'general-practice'
  | 'pediatrics'
  | 'family-medicine'
  | 'sports-medicine'
  | 'orthopedics'
  | 'cardiology'
  | 'neurology'
  | 'psychology'
  | 'psychiatry'
  | 'dental-general'
  | 'dental-pediatric'
  | 'optometry'
  | 'physical-therapy'
  | 'occupational-therapy'
  | 'speech-language'
  | 'other';

export type ProviderVerificationStatus =
  | 'pending'
  | 'npi-verified'
  | 'license-verified'
  | 'fully-verified'
  | 'expired'
  | 'suspended'
  | 'rejected';

// Healthcare Provider Profile
export interface HealthcareProvider {
  id: string;

  // Basic Information
  firstName: string;
  lastName: string;
  credentials: string; // MD, DO, DDS, NP, PA, etc.
  email: string;
  phone: string;

  // Practice Information
  practiceName: string;
  practiceType: 'solo' | 'group' | 'hospital' | 'clinic' | 'health-center' | 'school-based';
  address: ProviderAddress;
  additionalLocations?: ProviderAddress[];

  // Credentials
  npiNumber: string;
  stateLicenseNumber: string;
  stateLicenseState: string;
  stateLicenseExpiration: string;
  deaNumber?: string; // For prescribers

  // Provider Type & Specialty
  providerType: ProviderType;
  specialty: ProviderSpecialty;
  subspecialties?: string[];

  // Verification
  verificationStatus: ProviderVerificationStatus;
  npiVerifiedAt?: string;
  licenseVerifiedAt?: string;
  lastVerificationCheck?: string;

  // Platform Settings
  acceptingNewPatients: boolean;
  schoolsServed: string[]; // School IDs
  districtsServed: string[]; // District IDs
  preferredContactMethod: 'email' | 'phone' | 'portal';
  notificationPreferences: ProviderNotificationPreferences;

  // Licenses (array for multiple state licenses)
  licenses?: Array<{
    type: string;
    number: string;
    state: string;
    status: 'active' | 'expired' | 'pending';
    expirationDate: string;
  }>;

  // Credentials as array (for UI display)
  credentialsList?: string[];

  // Meta
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface ProviderAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  country?: string;
  phone?: string;
  fax?: string;
  isPrimary?: boolean;
}

export interface ProviderNotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newMessageAlerts: boolean;
  excuseStatusUpdates: boolean;
  clearanceRequests: boolean;
  weeklyDigest: boolean;
}

// ===========================================
// MEDICAL EXCUSE SYSTEM
// ===========================================

export type MedicalExcuseType =
  | 'illness'
  | 'injury'
  | 'medical-appointment'
  | 'surgery'
  | 'mental-health'
  | 'dental'
  | 'vision'
  | 'chronic-condition'
  | 'hospitalization'
  | 'quarantine'
  | 'other';

export type MedicalExcuseStatus =
  | 'draft'
  | 'submitted'
  | 'received'
  | 'verified'
  | 'processed'
  | 'rejected'
  | 'expired'
  | 'pending'
  | 'approved';

export interface MedicalExcuse {
  id: string;

  // Provider Information
  providerId: string;
  provider?: HealthcareProvider;
  providerName?: string; // Alias for display
  providerCredentials?: string; // Alias for display
  providerNPI?: string; // Alias for display

  // Student Information
  studentId: string;
  studentName: string;
  studentDateOfBirth: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  studentGrade?: string; // Alias for grade

  // Excuse Details
  excuseType: MedicalExcuseType;
  diagnosis?: string; // General diagnosis description
  diagnosisCode?: string; // ICD-10 (optional, HIPAA compliant)
  generalReason: string; // Non-specific reason for school

  // Dates
  appointmentDate?: string;
  absenceStartDate: string;
  absenceEndDate: string;
  startDate?: string; // Alias for absenceStartDate
  endDate?: string; // Alias for absenceEndDate
  returnToSchoolDate: string;
  isRecurring: boolean;
  recurringSchedule?: RecurringSchedule;

  // Restrictions & Accommodations
  restrictions?: MedicalRestriction[];
  accommodationsNeeded?: string[];
  peRestrictions?: PERestriction;
  peRestricted?: boolean; // Alias for UI

  // Return to School
  returnClearanceRequired: boolean;
  returnClearanceProvided: boolean;
  returnClearanceDate?: string;
  followUpRequired: boolean;
  followUpDate?: string;

  // Verification
  providerSignature: string;
  providerSignedAt: string;
  npiVerified: boolean;

  // Status & Processing
  status: MedicalExcuseStatus;
  submittedAt?: string;
  receivedAt?: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;

  // School Response
  attendanceUpdated: boolean;
  attendanceCode?: string;
  schoolNotes?: string;
  notes?: string; // General notes field

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface RecurringSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  startDate: string;
  endDate: string;
  appointmentTime?: string;
}

export interface MedicalRestriction {
  type: 'no-pe' | 'limited-activity' | 'no-stairs' | 'rest-as-needed' | 'medication-schedule' | 'dietary' | 'other';
  description: string;
  startDate: string;
  endDate?: string;
  duration?: string;
}

export interface PERestriction {
  fullyExcused: boolean;
  limitedParticipation: boolean;
  activities?: {
    running: boolean;
    jumping: boolean;
    contactSports: boolean;
    swimming: boolean;
    climbing: boolean;
    lifting: boolean;
  };
  notes?: string;
  startDate: string;
  endDate: string;
}

// ===========================================
// SPORTS PHYSICAL & ATHLETIC CLEARANCE
// ===========================================

export type SportsPhysicalStatus =
  | 'not-submitted'
  | 'pending-review'
  | 'pending' // Alias for pending-review
  | 'approved'
  | 'cleared' // Alias for approved
  | 'conditionally-approved'
  | 'conditional' // Alias for conditionally-approved
  | 'denied'
  | 'not_cleared' // Alias for denied
  | 'expired';

export type ClearanceType =
  | 'full-clearance'
  | 'conditional-clearance'
  | 'sport-specific'
  | 'return-to-play'
  | 'no-clearance';

export interface SportsPhysical {
  id: string;

  // Provider Information
  providerId: string;
  provider?: HealthcareProvider;
  providerName?: string; // Alias for display
  providerCredentials?: string; // Alias for display
  providerNPI?: string; // Alias for display

  // Student Information
  studentId: string;
  studentName: string;
  studentDateOfBirth: string;
  schoolId: string;
  schoolName?: string;
  grade: string;
  studentGrade?: string; // Alias for grade

  // Physical Exam Details
  examDate: string;
  expirationDate: string;
  height: string;
  weight: string;
  bloodPressure: string;
  pulseRate: number;
  visionLeft: string;
  visionRight: string;

  // Medical History Review
  medicalHistoryReviewed: boolean;
  significantFindings?: string[];
  medicationsReviewed: boolean;
  currentMedications?: string[];

  // Cardiac Screening
  cardiacScreeningCompleted: boolean;
  cardiacScreeningDate?: string;
  ekgCompleted?: boolean;
  ekgFindings?: string;
  echoCompleted?: boolean;
  echoFindings?: string;
  familyHistoryReviewed: boolean;
  suddenCardiacDeathHistory: boolean;

  // Clearance Decision
  clearanceType: ClearanceType;
  clearanceLevel?: 'full' | 'limited' | 'none'; // Alias for UI
  status: SportsPhysicalStatus;
  sportsCleared: string[]; // List of sports cleared for
  sports?: string[]; // Alias for sportsCleared
  sportsRestricted?: string[]; // Sports with limitations
  restrictions?: string[];
  requiresFollowUp: boolean;
  followUpReason?: string;

  // Concussion History
  concussionHistory: boolean;
  numberOfConcussions?: number;
  lastConcussionDate?: string;
  baselineConcussionTestRequired: boolean;
  baselineConcussionTestCompleted?: boolean;

  // Provider Signature
  providerSignature: string;
  providerSignedAt: string;
  npiVerified: boolean;

  // Processing
  submittedAt?: string;
  processedAt?: string;
  processedBy?: string; // Athletic director, school nurse
  athleticDirectorApproval?: boolean;

  // Meta
  createdAt: string;
  updatedAt: string;
}

// Return-to-Play Protocol (Post-Injury/Concussion)
export interface ReturnToPlayProtocol {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;

  // Injury Information
  injuryType: 'concussion' | 'musculoskeletal' | 'cardiac' | 'heat-illness' | 'other';
  injuryDate: string;
  injuryDescription: string;

  // Protocol Steps
  steps: ReturnToPlayStep[];
  currentStep: number;

  // Medical Oversight
  treatingProviderId: string;
  treatingProvider?: HealthcareProvider;

  // Clearance
  finalClearanceRequired: boolean;
  finalClearanceProviderId?: string;
  finalClearanceDate?: string;

  // Status
  status: 'in-progress' | 'completed' | 'paused' | 'cleared';
  startedAt: string;
  completedAt?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface ReturnToPlayStep {
  stepNumber: number;
  name: string;
  description: string;
  minimumDuration: string; // "24 hours", "48 hours", etc.
  activities: string[];
  symptoms: string[];
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

// ===========================================
// DENTAL SCREENING
// ===========================================

export type DentalScreeningResult =
  | 'no-obvious-problem'
  | 'needs-dental-care'
  | 'urgent-care-needed';

export interface DentalScreening {
  id: string;

  // Provider Information
  providerId: string;
  provider?: HealthcareProvider;
  providerName?: string; // Alias for display
  providerCredentials?: string; // Alias for display
  providerNPI?: string; // Alias for display

  // Student Information
  studentId: string;
  studentName: string;
  studentDateOfBirth: string;
  schoolId: string;
  schoolName?: string;
  grade: string;
  studentGrade?: string;

  // Screening Details
  screeningDate: string;
  screeningType: 'routine' | 'state-mandated' | 'follow-up';
  screeningResult: DentalScreeningResult;

  // Findings
  cavitiesFound: boolean;
  cavitiesCount?: number;
  urgentCareNeeded: boolean;
  orthodonticIssues?: boolean;
  gingivitisPresent?: boolean;
  findings?: {
    cavities: number;
    gumDisease: boolean;
    orthodonticNeeds: boolean;
    otherFindings?: string[];
  };

  // Treatment Urgency
  treatmentUrgency?: 'none' | 'non_urgent' | 'urgent';

  // Recommendations
  recommendations: string[];
  referralNeeded: boolean;
  referralProvided?: boolean;
  referralDate?: string;
  followUpDate?: string;

  // Certificate
  certificateNumber?: string;
  certificateExpiration?: string;
  meetsStateRequirement: boolean;

  // Provider Signature
  providerSignature: string;
  providerSignedAt: string;
  npiVerified: boolean;

  // Processing
  submittedAt?: string;
  processedAt?: string;
  status: 'submitted' | 'received' | 'verified' | 'processed' | 'pending' | 'completed';

  // Notes
  notes?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// SCHOOL NURSE - PROVIDER MESSAGING
// ===========================================

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export type MessageCategory =
  | 'medical-excuse-clarification'
  | 'medication-question'
  | 'care-plan-coordination'
  | 'sports-clearance'
  | 'immunization'
  | 'return-to-school'
  | 'chronic-condition'
  | 'mental-health'
  | 'general';

export interface SecureMessage {
  id: string;
  threadId: string;

  // Sender/Recipient
  senderId: string;
  senderType: 'provider' | 'school-nurse' | 'school-admin';
  senderName: string;
  recipientId: string;
  recipientType: 'provider' | 'school-nurse' | 'school-admin';
  recipientName: string;

  // Student Context (optional)
  studentId?: string;
  studentName?: string;
  schoolId?: string;

  // Message Content
  subject: string;
  body: string;
  content?: string; // Alias for body
  category: MessageCategory;
  priority: MessagePriority;

  // Attachments
  attachments?: MessageAttachment[];

  // Status
  read: boolean;
  isRead?: boolean; // Alias for read
  readAt?: string;
  replied: boolean;
  repliedAt?: string;

  // HIPAA Compliance
  containsPHI: boolean;
  hipaaAcknowledged: boolean;
  auditLogId: string;

  // Meta
  createdAt: string;
  expiresAt?: string; // Auto-delete for compliance
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  scannedForMalware: boolean;
}

export interface MessageThread {
  id: string;
  subject: string;
  category: MessageCategory;
  priority: MessagePriority;

  // Participants
  participants: MessageParticipant[];
  participantId?: string; // Primary participant for UI
  participantName?: string; // Primary participant name for UI

  // School Context
  schoolId?: string;
  schoolName?: string;

  // Student Context
  studentId?: string;
  studentName?: string;

  // Messages
  messages: SecureMessage[];
  messageCount: number;

  // Status
  status: 'open' | 'closed' | 'archived';
  lastMessageAt: string;
  unreadCount: Record<string, number> | number;

  // Meta
  createdAt: string;
  closedAt?: string;
}

export interface MessageParticipant {
  id: string;
  type: 'provider' | 'school-nurse' | 'school-admin';
  name: string;
  email: string;
  organization: string;
  lastReadAt?: string;
}

// ===========================================
// IMMUNIZATION RECORDS
// ===========================================

export type ImmunizationType =
  | 'DTaP'
  | 'Tdap'
  | 'Polio'
  | 'MMR'
  | 'Hepatitis-B'
  | 'Hepatitis-A'
  | 'Varicella'
  | 'Meningococcal'
  | 'HPV'
  | 'Influenza'
  | 'COVID-19'
  | 'PCV'
  | 'Hib'
  | 'Rotavirus'
  | 'Other';

export type ImmunizationComplianceStatus =
  | 'compliant'
  | 'conditional'
  | 'non-compliant'
  | 'exempt-medical'
  | 'exempt-religious'
  | 'exempt-philosophical'
  | 'pending-verification';

export interface ImmunizationRecord {
  id: string;

  // Student Information
  studentId: string;
  studentName: string;
  studentDateOfBirth: string;
  schoolId: string;

  // Immunization Details
  immunizationType: ImmunizationType;
  vaccineName: string;
  manufacturer?: string;
  lotNumber?: string;
  doseNumber: number;
  totalDosesRequired: number;

  // Administration
  administrationDate: string;
  administeredBy: string;
  administeredAt: string; // Location/facility
  providerId?: string;

  // Verification
  verificationSource: 'provider-submitted' | 'state-registry' | 'parent-submitted' | 'school-entered';
  stateRegistryId?: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface StudentImmunizationProfile {
  studentId: string;
  studentName: string;
  dateOfBirth: string;
  schoolId: string;
  grade: string;

  // Compliance
  overallStatus: ImmunizationComplianceStatus;
  compliancePercentage: number;

  // Requirements by Type
  requirements: ImmunizationRequirement[];

  // Exemptions
  exemptions: ImmunizationExemption[];

  // Pending Items
  pendingImmunizations: string[];
  nextDueDate?: string;

  // State Registry Sync
  lastRegistrySync?: string;
  registrySyncStatus?: 'synced' | 'pending' | 'error';

  // Meta
  lastUpdated: string;
}

export interface ImmunizationRequirement {
  immunizationType: ImmunizationType;
  requiredDoses: number;
  receivedDoses: number;
  status: 'complete' | 'in-progress' | 'not-started' | 'exempt' | 'overdue';
  records: ImmunizationRecord[];
  nextDoseDate?: string;
  gradeRequirement?: string; // "Kindergarten", "7th Grade", etc.
}

export interface ImmunizationExemption {
  id: string;
  studentId: string;
  immunizationType: ImmunizationType | 'all';
  exemptionType: 'medical' | 'religious' | 'philosophical';
  reason: string;
  grantedBy: string;
  grantedDate: string;
  expirationDate?: string;
  renewalRequired: boolean;
  documentUrl?: string;
  status: 'active' | 'expired' | 'revoked';
}

// ===========================================
// PROVIDER VERIFICATION & ONBOARDING
// ===========================================

export interface ProviderRegistration {
  id: string;

  // Account Info
  email: string;
  phone: string;

  // Provider Info
  firstName: string;
  lastName: string;
  credentials: string;
  providerType: ProviderType;
  specialty: ProviderSpecialty;

  // Practice Info
  practiceName: string;
  practiceAddress: ProviderAddress;

  // Credentials for Verification
  npiNumber: string;
  stateLicenseNumber: string;
  stateLicenseState: string;

  // Verification Status
  npiVerificationStatus: 'pending' | 'verified' | 'failed';
  npiVerificationDate?: string;
  npiVerificationDetails?: NPIVerificationResult;

  licenseVerificationStatus: 'pending' | 'verified' | 'failed';
  licenseVerificationDate?: string;
  licenseVerificationDetails?: LicenseVerificationResult;

  // Onboarding Progress
  onboardingStep: number;
  onboardingCompleted: boolean;
  termsAccepted: boolean;
  hipaaTrainingCompleted: boolean;
  hipaaTrainingDate?: string;

  // Status
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface NPIVerificationResult {
  npiNumber: string;
  isValid: boolean;
  providerName?: string;
  providerType?: string;
  specialty?: string;
  practiceAddress?: string;
  enumerationDate?: string;
  lastUpdateDate?: string;
  status?: 'active' | 'deactivated';
  verificationSource: 'NPPES' | 'manual';
  verifiedAt: string;
  rawResponse?: Record<string, unknown>;
}

export interface LicenseVerificationResult {
  licenseNumber: string;
  state: string;
  isValid: boolean;
  providerName?: string;
  licenseType?: string;
  issueDate?: string;
  expirationDate?: string;
  status?: 'active' | 'expired' | 'suspended' | 'revoked';
  disciplinaryActions?: string[];
  verificationSource: 'state-api' | 'manual';
  verifiedAt: string;
}

// ===========================================
// PROVIDER DASHBOARD & ANALYTICS
// ===========================================

export interface ProviderDashboardStats {
  // Activity Metrics
  totalExcusesSubmitted: number;
  excusesThisMonth: number;
  excusesPending: number;
  excusesProcessed: number;

  // Sports Physicals
  totalPhysicalsSubmitted: number;
  physicalsThisMonth: number;
  activeAthletesCovered: number;

  // Messaging
  unreadMessages: number;
  activeThreads: number;

  // Schools
  schoolsServed: number;
  districtsConnected: number;

  // Compliance
  verificationStatus: ProviderVerificationStatus;
  licenseExpirationDate: string;
  daysUntilLicenseExpiration: number;
}

export interface ProviderActivityLog {
  id: string;
  providerId: string;
  action: ProviderAction;
  resourceType: 'excuse' | 'physical' | 'dental' | 'message' | 'immunization' | 'profile';
  resourceId: string;
  description: string;
  studentId?: string;
  schoolId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export type ProviderAction =
  | 'excuse_submitted'
  | 'excuse_updated'
  | 'physical_submitted'
  | 'physical_updated'
  | 'dental_submitted'
  | 'message_sent'
  | 'message_read'
  | 'immunization_submitted'
  | 'profile_updated'
  | 'login'
  | 'logout';

// ===========================================
// FORM DATA & FILTERS
// ===========================================

export interface MedicalExcuseFormData {
  // Provider
  providerId?: string;

  // Student Selection
  studentSearch: string;
  studentId: string;
  studentName?: string;
  studentGrade?: string;
  schoolId: string;
  schoolName?: string;

  // Excuse Details
  excuseType: MedicalExcuseType | '';
  generalReason: string;
  diagnosis?: string;
  appointmentDate: string;
  absenceStartDate: string;
  absenceEndDate: string;
  startDate?: string; // Alias for absenceStartDate
  endDate?: string; // Alias for absenceEndDate
  returnToSchoolDate: string;

  // Recurring
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | '';
  recurringEndDate?: string;

  // Restrictions
  hasRestrictions: boolean;
  restrictions: MedicalRestriction[];
  peRestricted: boolean;
  peRestrictionType?: 'full' | 'limited' | '';
  peRestrictionEndDate?: string;

  // Return Clearance
  returnClearanceRequired: boolean;
  followUpRequired: boolean;
  followUpDate?: string;

  // Notes
  additionalNotes?: string;
  notes?: string; // Alias for additionalNotes
}

export interface SportsPhysicalFormData {
  // Student Selection
  studentId: string;
  studentName?: string;
  studentGrade?: string;
  studentDob?: string;
  schoolId: string;
  schoolName?: string;

  // Sports
  sports?: string[]; // List of sports

  // Exam Details
  examDate: string;
  height: string;
  weight: string;
  bloodPressure: string;
  pulseRate: string;
  visionLeft: string;
  visionRight: string;

  // Medical History
  medicalHistoryReviewed: boolean;
  significantFindings: string;
  currentMedications: string;

  // Cardiac Screening
  cardiacScreeningCompleted: boolean;
  ekgCompleted: boolean;
  ekgFindings: string;
  familyHistoryReviewed: boolean;
  suddenCardiacDeathHistory: boolean;

  // Concussion History
  concussionHistory: boolean;
  numberOfConcussions: string;
  lastConcussionDate: string;

  // Clearance
  clearanceType: ClearanceType | '';
  sportsCleared: string[];
  sportsRestricted: string[];
  restrictions: string;
  requiresFollowUp: boolean;
  followUpReason: string;
}

export interface ProviderFilters {
  search?: string;
  providerType?: ProviderType[];
  specialty?: ProviderSpecialty[];
  verificationStatus?: ProviderVerificationStatus[];
  district?: string;
  school?: string;
  status?: ('active' | 'inactive' | 'suspended')[];
}

export interface ExcuseFilters {
  search?: string;
  status?: MedicalExcuseStatus[];
  excuseType?: MedicalExcuseType[];
  schoolId?: string;
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
  studentId?: string;
}

export interface DentalScreeningFormData {
  providerId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  schoolId: string;
  schoolName: string;
  screeningDate: string;
  findings: {
    cavities: number;
    gumDisease: boolean;
    orthodonticNeeds: boolean;
    otherFindings?: string[];
  };
  treatmentUrgency: 'none' | 'non_urgent' | 'urgent';
  referralNeeded: boolean;
  notes?: string;
}

// UI-specific types for Healthcare Provider Dashboard
export interface UIProviderDashboardStats {
  totalExcuses: number;
  pendingExcuses: number;
  approvedExcuses: number;
  activePhysicals: number;
  expiringSoonPhysicals: number;
  immunizationsDue: number;
  unreadMessages: number;
  totalMessages: number;
  pendingDentalScreenings: number;
}

// Extended types for UI components
export interface UIMedicalExcuse {
  id: string;
  providerId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  schoolId: string;
  schoolName: string;
  excuseType: string;
  startDate: string;
  endDate: string;
  diagnosis?: string;
  restrictions?: string[];
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UISportsPhysical {
  id: string;
  providerId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentDob: string;
  schoolId: string;
  schoolName: string;
  sports: string[];
  examDate: string;
  expirationDate: string;
  vitals: {
    height: string;
    weight: string;
    bloodPressure: string;
    pulse: number;
    vision: string;
  };
  clearanceLevel: 'full' | 'limited' | 'none';
  restrictions?: string[];
  notes?: string;
  status: 'pending' | 'cleared' | 'conditional' | 'not_cleared';
  createdAt: string;
  updatedAt: string;
}

export interface UIDentalScreening {
  id: string;
  providerId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  schoolId: string;
  schoolName: string;
  screeningDate: string;
  findings: {
    cavities: number;
    gumDisease: boolean;
    orthodonticNeeds: boolean;
    otherFindings?: string[];
  };
  treatmentUrgency: 'none' | 'non_urgent' | 'urgent';
  referralNeeded: boolean;
  notes?: string;
  status: 'pending' | 'completed' | 'follow_up_needed';
  createdAt: string;
  updatedAt: string;
}

export interface UISecureMessage {
  id: string;
  threadId?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  subject?: string;
  content: string;
  isRead: boolean;
  isHIPAAProtected: boolean;
  createdAt: string;
}

export interface UIMessageThread {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  schoolId: string;
  schoolName: string;
  studentId?: string;
  studentName: string;
  lastMessageAt?: string;
  unreadCount?: number;
  messages?: UISecureMessage[];
}
