// ===========================================
// Healthcare Provider API Service
// CRUD operations for healthcare provider portal features
// Supabase-first with sample data fallback
// ===========================================

import { supabase } from '@/lib/supabase';
import type {
  HealthcareProvider,
  ProviderRegistration,
  MedicalExcuse,
  MedicalExcuseFormData,
  SportsPhysical,
  SportsPhysicalFormData,
  DentalScreening,
  SecureMessage,
  MessageThread,
  MessageParticipant,
  ImmunizationRecord,
  StudentImmunizationProfile,
  ProviderDashboardStats,
  ProviderActivityLog,
  NPIVerificationResult,
  LicenseVerificationResult,
  ProviderFilters,
  ExcuseFilters,
  MedicalExcuseStatus,
} from '@/types/healthcareProvider';

// ===========================================
// SAMPLE DATA (fallback when DB tables don't exist yet)
// ===========================================

const SAMPLE_PROVIDERS: HealthcareProvider[] = [
  {
    id: 'prov-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    credentials: 'MD',
    email: 'dr.chen@pediatriccare.com',
    phone: '(555) 234-5678',
    practiceName: 'Pediatric Care Associates',
    practiceType: 'group',
    address: {
      street1: '123 Medical Center Dr',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      isPrimary: true,
    },
    npiNumber: '1234567890',
    stateLicenseNumber: 'A123456',
    stateLicenseState: 'CA',
    stateLicenseExpiration: '2027-06-30',
    providerType: 'pediatrician',
    specialty: 'pediatrics',
    verificationStatus: 'fully-verified',
    npiVerifiedAt: '2024-01-15T10:00:00Z',
    licenseVerifiedAt: '2024-01-15T10:00:00Z',
    acceptingNewPatients: true,
    schoolsServed: ['school-001', 'school-002'],
    districtsServed: ['district-001'],
    preferredContactMethod: 'portal',
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      newMessageAlerts: true,
      excuseStatusUpdates: true,
      clearanceRequests: true,
      weeklyDigest: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    lastLoginAt: '2024-12-10T09:15:00Z',
    status: 'active',
  },
  {
    id: 'prov-002',
    firstName: 'Michael',
    lastName: 'Johnson',
    credentials: 'DDS',
    email: 'dr.johnson@smiledental.com',
    phone: '(555) 345-6789',
    practiceName: 'Smile Dental Clinic',
    practiceType: 'group',
    address: {
      street1: '456 Dental Way',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
      isPrimary: true,
    },
    npiNumber: '0987654321',
    stateLicenseNumber: 'D654321',
    stateLicenseState: 'CA',
    stateLicenseExpiration: '2026-12-31',
    providerType: 'dentist',
    specialty: 'dental-pediatric',
    verificationStatus: 'fully-verified',
    npiVerifiedAt: '2024-02-01T10:00:00Z',
    licenseVerifiedAt: '2024-02-01T10:00:00Z',
    acceptingNewPatients: true,
    schoolsServed: ['school-001', 'school-003'],
    districtsServed: ['district-001'],
    preferredContactMethod: 'email',
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newMessageAlerts: true,
      excuseStatusUpdates: false,
      clearanceRequests: false,
      weeklyDigest: false,
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-11-15T11:00:00Z',
    status: 'active',
  },
  {
    id: 'prov-003',
    firstName: 'Linda',
    lastName: 'Ramirez',
    credentials: 'NP',
    email: 'lramirez@schoolhealthnp.com',
    phone: '(555) 456-7890',
    practiceName: 'School Health Nurse Practitioners',
    practiceType: 'solo',
    address: {
      street1: '789 School Health Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95112',
      isPrimary: true,
    },
    npiNumber: '1122334455',
    stateLicenseNumber: 'NP789012',
    stateLicenseState: 'CA',
    stateLicenseExpiration: '2027-03-15',
    providerType: 'nurse-practitioner',
    specialty: 'school-health',
    verificationStatus: 'fully-verified',
    npiVerifiedAt: '2024-03-01T10:00:00Z',
    licenseVerifiedAt: '2024-03-01T10:00:00Z',
    acceptingNewPatients: true,
    schoolsServed: ['school-002', 'school-003', 'school-004'],
    districtsServed: ['district-001', 'district-002'],
    preferredContactMethod: 'portal',
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newMessageAlerts: true,
      excuseStatusUpdates: true,
      clearanceRequests: true,
      weeklyDigest: true,
    },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-12-05T09:00:00Z',
    lastLoginAt: '2024-12-11T08:30:00Z',
    status: 'active',
  },
];

const SAMPLE_EXCUSES: MedicalExcuse[] = [
  {
    id: 'excuse-001',
    providerId: 'prov-001',
    studentId: 'student-001',
    studentName: 'Emma Wilson',
    studentDateOfBirth: '2012-03-15',
    schoolId: 'school-001',
    schoolName: 'Lincoln Elementary School',
    grade: '5',
    excuseType: 'illness',
    generalReason: 'Student was seen for respiratory infection and requires rest.',
    absenceStartDate: '2024-12-09',
    absenceEndDate: '2024-12-11',
    returnToSchoolDate: '2024-12-12',
    isRecurring: false,
    restrictions: [
      {
        type: 'limited-activity',
        description: 'No strenuous physical activity',
        startDate: '2024-12-12',
        endDate: '2024-12-16',
      },
    ],
    peRestrictions: {
      fullyExcused: false,
      limitedParticipation: true,
      activities: {
        running: false,
        jumping: false,
        contactSports: false,
        swimming: false,
        climbing: true,
        lifting: true,
      },
      notes: 'May participate in light stretching and walking only',
      startDate: '2024-12-12',
      endDate: '2024-12-16',
    },
    returnClearanceRequired: false,
    returnClearanceProvided: false,
    followUpRequired: false,
    providerSignature: 'Dr. Sarah Chen, MD',
    providerSignedAt: '2024-12-09T14:30:00Z',
    npiVerified: true,
    status: 'processed',
    submittedAt: '2024-12-09T14:30:00Z',
    receivedAt: '2024-12-09T14:31:00Z',
    processedAt: '2024-12-09T15:00:00Z',
    processedBy: 'nurse-001',
    attendanceUpdated: true,
    attendanceCode: 'EA',
    createdAt: '2024-12-09T14:30:00Z',
    updatedAt: '2024-12-09T15:00:00Z',
  },
  {
    id: 'excuse-002',
    providerId: 'prov-001',
    studentId: 'student-002',
    studentName: 'James Martinez',
    studentDateOfBirth: '2010-07-22',
    schoolId: 'school-001',
    schoolName: 'Lincoln Elementary School',
    grade: '7',
    excuseType: 'medical-appointment',
    generalReason: 'Routine medical appointment',
    appointmentDate: '2024-12-15',
    absenceStartDate: '2024-12-15',
    absenceEndDate: '2024-12-15',
    returnToSchoolDate: '2024-12-16',
    isRecurring: true,
    recurringSchedule: {
      frequency: 'monthly',
      startDate: '2024-12-15',
      endDate: '2025-06-15',
      appointmentTime: '10:00 AM',
    },
    returnClearanceRequired: false,
    returnClearanceProvided: false,
    followUpRequired: false,
    providerSignature: 'Dr. Sarah Chen, MD',
    providerSignedAt: '2024-12-10T09:00:00Z',
    npiVerified: true,
    status: 'submitted',
    submittedAt: '2024-12-10T09:00:00Z',
    attendanceUpdated: false,
    createdAt: '2024-12-10T09:00:00Z',
    updatedAt: '2024-12-10T09:00:00Z',
  },
  {
    id: 'excuse-003',
    providerId: 'prov-003',
    studentId: 'student-004',
    studentName: 'Sophia Nguyen',
    studentDateOfBirth: '2011-11-03',
    schoolId: 'school-002',
    schoolName: 'Washington Middle School',
    grade: '6',
    excuseType: 'injury',
    generalReason: 'Student sustained a minor sprain during PE. Rest recommended.',
    absenceStartDate: '2024-12-12',
    absenceEndDate: '2024-12-13',
    returnToSchoolDate: '2024-12-16',
    isRecurring: false,
    restrictions: [
      {
        type: 'no-pe',
        description: 'Excused from all physical education activities',
        startDate: '2024-12-16',
        endDate: '2024-12-23',
      },
    ],
    peRestrictions: {
      fullyExcused: true,
      limitedParticipation: false,
      startDate: '2024-12-16',
      endDate: '2024-12-23',
    },
    returnClearanceRequired: true,
    returnClearanceProvided: false,
    followUpRequired: true,
    followUpDate: '2024-12-23',
    providerSignature: 'Linda Ramirez, NP',
    providerSignedAt: '2024-12-12T11:00:00Z',
    npiVerified: true,
    status: 'submitted',
    submittedAt: '2024-12-12T11:00:00Z',
    attendanceUpdated: false,
    createdAt: '2024-12-12T11:00:00Z',
    updatedAt: '2024-12-12T11:00:00Z',
  },
];

const SAMPLE_DENTAL_SCREENINGS: DentalScreening[] = [
  {
    id: 'dental-001',
    providerId: 'prov-002',
    studentId: 'student-001',
    studentName: 'Emma Wilson',
    studentDateOfBirth: '2012-03-15',
    schoolId: 'school-001',
    schoolName: 'Lincoln Elementary School',
    grade: '5',
    screeningDate: '2024-11-15',
    screeningType: 'routine',
    screeningResult: 'no-obvious-problem',
    cavitiesFound: false,
    cavitiesCount: 0,
    urgentCareNeeded: false,
    orthodonticIssues: false,
    gingivitisPresent: false,
    findings: {
      cavities: 0,
      gumDisease: false,
      orthodonticNeeds: false,
    },
    recommendations: ['Continue regular brushing', 'Floss daily'],
    referralNeeded: false,
    meetsStateRequirement: true,
    treatmentUrgency: 'none',
    providerSignature: 'Dr. Michael Johnson, DDS',
    providerSignedAt: '2024-11-15T10:30:00Z',
    npiVerified: true,
    status: 'completed',
    submittedAt: '2024-11-15T10:30:00Z',
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-11-15T10:30:00Z',
  },
  {
    id: 'dental-002',
    providerId: 'prov-002',
    studentId: 'student-002',
    studentName: 'James Martinez',
    studentDateOfBirth: '2010-07-22',
    schoolId: 'school-001',
    schoolName: 'Lincoln Elementary School',
    grade: '7',
    screeningDate: '2024-11-15',
    screeningType: 'routine',
    screeningResult: 'needs-dental-care',
    cavitiesFound: true,
    cavitiesCount: 2,
    urgentCareNeeded: false,
    orthodonticIssues: true,
    gingivitisPresent: false,
    findings: {
      cavities: 2,
      gumDisease: false,
      orthodonticNeeds: true,
      otherFindings: ['Visible plaque buildup'],
    },
    recommendations: ['Schedule dental appointment', 'Orthodontic consultation recommended'],
    referralNeeded: true,
    referralProvided: true,
    meetsStateRequirement: true,
    treatmentUrgency: 'non_urgent',
    providerSignature: 'Dr. Michael Johnson, DDS',
    providerSignedAt: '2024-11-15T11:00:00Z',
    npiVerified: true,
    status: 'completed',
    submittedAt: '2024-11-15T11:00:00Z',
    createdAt: '2024-11-15T11:00:00Z',
    updatedAt: '2024-11-15T11:00:00Z',
  },
];

const SAMPLE_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'thread-001',
    participants: [
      {
        id: 'prov-001',
        type: 'provider',
        name: 'Dr. Sarah Chen',
        email: 'dr.chen@pediatriccare.com',
        organization: 'Pediatric Care Associates',
      },
      {
        id: 'nurse-001',
        type: 'school-nurse',
        name: 'Nurse Mary Johnson',
        email: 'mjohnson@lincoln.edu',
        organization: 'Lincoln Elementary School',
      },
    ],
    participantId: 'nurse-001',
    participantName: 'Nurse Mary Johnson',
    studentId: 'student-001',
    studentName: 'Emma Wilson',
    schoolId: 'school-001',
    schoolName: 'Lincoln Elementary School',
    subject: 'Follow-up on medical excuse',
    category: 'medical-excuse-clarification',
    priority: 'normal',
    lastMessageAt: '2024-12-10T14:30:00Z',
    unreadCount: { 'prov-001': 0, 'nurse-001': 1 },
    messageCount: 3,
    status: 'open',
    createdAt: '2024-12-09T10:00:00Z',
    messages: [
      {
        id: 'msg-001',
        threadId: 'thread-001',
        senderId: 'nurse-001',
        senderType: 'school-nurse',
        senderName: 'Nurse Mary Johnson',
        recipientId: 'prov-001',
        recipientType: 'provider',
        recipientName: 'Dr. Sarah Chen',
        subject: 'Follow-up on medical excuse',
        body: 'Hi Dr. Chen, I wanted to confirm the activity restrictions for Emma Wilson. Can she participate in PE with limited activities?',
        category: 'medical-excuse-clarification',
        priority: 'normal',
        read: true,
        containsPHI: true,
        hipaaAcknowledged: true,
        auditLogId: 'audit-001',
        replied: true,
        createdAt: '2024-12-09T10:00:00Z',
      },
      {
        id: 'msg-002',
        threadId: 'thread-001',
        senderId: 'prov-001',
        senderType: 'provider',
        senderName: 'Dr. Sarah Chen',
        recipientId: 'nurse-001',
        recipientType: 'school-nurse',
        recipientName: 'Nurse Mary Johnson',
        subject: 'Re: Follow-up on medical excuse',
        body: 'Yes, Emma can participate in light stretching and walking only. No running or contact activities until Monday.',
        category: 'medical-excuse-clarification',
        priority: 'normal',
        read: true,
        containsPHI: true,
        hipaaAcknowledged: true,
        auditLogId: 'audit-002',
        replied: true,
        createdAt: '2024-12-10T09:00:00Z',
      },
      {
        id: 'msg-003',
        threadId: 'thread-001',
        senderId: 'prov-001',
        senderType: 'provider',
        senderName: 'Dr. Sarah Chen',
        recipientId: 'nurse-001',
        recipientType: 'school-nurse',
        recipientName: 'Nurse Mary Johnson',
        subject: 'Re: Follow-up on medical excuse',
        body: 'The student can return to normal activities on Monday.',
        category: 'medical-excuse-clarification',
        priority: 'normal',
        read: false,
        containsPHI: true,
        hipaaAcknowledged: true,
        auditLogId: 'audit-003',
        replied: false,
        createdAt: '2024-12-10T14:30:00Z',
      },
    ],
  },
];

const SAMPLE_SPORTS_PHYSICALS: SportsPhysical[] = [
  {
    id: 'physical-001',
    providerId: 'prov-001',
    studentId: 'student-003',
    studentName: 'Alex Thompson',
    studentDateOfBirth: '2009-04-18',
    schoolId: 'school-001',
    grade: '8',
    examDate: '2024-08-15',
    expirationDate: '2025-08-15',
    height: '5\'6"',
    weight: '130 lbs',
    bloodPressure: '110/70',
    pulseRate: 72,
    visionLeft: '20/20',
    visionRight: '20/25',
    medicalHistoryReviewed: true,
    medicationsReviewed: true,
    cardiacScreeningCompleted: true,
    cardiacScreeningDate: '2024-08-15',
    familyHistoryReviewed: true,
    suddenCardiacDeathHistory: false,
    clearanceType: 'full-clearance',
    status: 'approved',
    sportsCleared: ['Basketball', 'Track & Field', 'Soccer'],
    requiresFollowUp: false,
    concussionHistory: false,
    baselineConcussionTestRequired: true,
    baselineConcussionTestCompleted: true,
    providerSignature: 'Dr. Sarah Chen, MD',
    providerSignedAt: '2024-08-15T11:00:00Z',
    npiVerified: true,
    submittedAt: '2024-08-15T11:00:00Z',
    processedAt: '2024-08-15T14:00:00Z',
    processedBy: 'athletic-dir-001',
    athleticDirectorApproval: true,
    createdAt: '2024-08-15T11:00:00Z',
    updatedAt: '2024-08-15T14:00:00Z',
  },
  {
    id: 'physical-002',
    providerId: 'prov-003',
    studentId: 'student-005',
    studentName: 'Maya Patel',
    studentDateOfBirth: '2010-09-22',
    schoolId: 'school-002',
    grade: '7',
    examDate: '2024-09-01',
    expirationDate: '2025-09-01',
    height: '5\'2"',
    weight: '105 lbs',
    bloodPressure: '105/68',
    pulseRate: 68,
    visionLeft: '20/20',
    visionRight: '20/20',
    medicalHistoryReviewed: true,
    medicationsReviewed: true,
    cardiacScreeningCompleted: true,
    cardiacScreeningDate: '2024-09-01',
    familyHistoryReviewed: true,
    suddenCardiacDeathHistory: false,
    clearanceType: 'full-clearance',
    status: 'approved',
    sportsCleared: ['Volleyball', 'Swimming', 'Tennis'],
    requiresFollowUp: false,
    concussionHistory: false,
    baselineConcussionTestRequired: false,
    providerSignature: 'Linda Ramirez, NP',
    providerSignedAt: '2024-09-01T10:00:00Z',
    npiVerified: true,
    submittedAt: '2024-09-01T10:00:00Z',
    processedAt: '2024-09-02T09:00:00Z',
    processedBy: 'athletic-dir-002',
    athleticDirectorApproval: true,
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-02T09:00:00Z',
  },
];

// ===========================================
// DB-to-frontend mappers
// ===========================================

function mapProvider(row: Record<string, unknown>): HealthcareProvider {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    credentials: row.credentials as string,
    email: row.email as string,
    phone: row.phone as string,
    practiceName: row.practice_name as string,
    practiceType: row.practice_type as HealthcareProvider['practiceType'],
    address: (row.address as HealthcareProvider['address']) || {
      street1: '',
      city: '',
      state: '',
      zipCode: '',
      isPrimary: true,
    },
    npiNumber: row.npi_number as string,
    stateLicenseNumber: row.state_license_number as string,
    stateLicenseState: row.state_license_state as string,
    stateLicenseExpiration: row.state_license_expiration as string,
    providerType: row.provider_type as HealthcareProvider['providerType'],
    specialty: row.specialty as string,
    verificationStatus: row.verification_status as HealthcareProvider['verificationStatus'],
    npiVerifiedAt: row.npi_verified_at as string | undefined,
    licenseVerifiedAt: row.license_verified_at as string | undefined,
    acceptingNewPatients: row.accepting_new_patients as boolean,
    schoolsServed: (row.schools_served as string[]) || [],
    districtsServed: (row.districts_served as string[]) || [],
    preferredContactMethod: row.preferred_contact_method as HealthcareProvider['preferredContactMethod'],
    notificationPreferences: (row.notification_preferences as HealthcareProvider['notificationPreferences']) || {
      emailNotifications: true,
      smsNotifications: false,
      newMessageAlerts: true,
      excuseStatusUpdates: true,
      clearanceRequests: true,
      weeklyDigest: false,
    },
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    lastLoginAt: row.last_login_at as string | undefined,
    status: row.status as HealthcareProvider['status'],
  };
}

function mapExcuse(row: Record<string, unknown>): MedicalExcuse {
  return {
    id: row.id as string,
    providerId: row.provider_id as string,
    studentId: row.student_id as string,
    studentName: row.student_name as string,
    studentDateOfBirth: row.student_date_of_birth as string,
    schoolId: row.school_id as string,
    schoolName: row.school_name as string,
    grade: row.grade as string,
    excuseType: row.excuse_type as MedicalExcuse['excuseType'],
    generalReason: row.general_reason as string,
    appointmentDate: row.appointment_date as string | undefined,
    absenceStartDate: row.absence_start_date as string,
    absenceEndDate: row.absence_end_date as string,
    returnToSchoolDate: row.return_to_school_date as string,
    isRecurring: row.is_recurring as boolean,
    recurringSchedule: row.recurring_schedule as MedicalExcuse['recurringSchedule'],
    restrictions: (row.restrictions as MedicalExcuse['restrictions']) || [],
    peRestrictions: row.pe_restrictions as MedicalExcuse['peRestrictions'],
    returnClearanceRequired: row.return_clearance_required as boolean,
    returnClearanceProvided: row.return_clearance_provided as boolean,
    followUpRequired: row.follow_up_required as boolean,
    followUpDate: row.follow_up_date as string | undefined,
    providerSignature: row.provider_signature as string,
    providerSignedAt: row.provider_signed_at as string,
    npiVerified: row.npi_verified as boolean,
    status: row.status as MedicalExcuse['status'],
    submittedAt: row.submitted_at as string,
    receivedAt: row.received_at as string | undefined,
    processedAt: row.processed_at as string | undefined,
    processedBy: row.processed_by as string | undefined,
    schoolNotes: row.school_notes as string | undefined,
    attendanceUpdated: row.attendance_updated as boolean,
    attendanceCode: row.attendance_code as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapSportsPhysical(row: Record<string, unknown>): SportsPhysical {
  return {
    id: row.id as string,
    providerId: row.provider_id as string,
    studentId: row.student_id as string,
    studentName: row.student_name as string,
    studentDateOfBirth: row.student_date_of_birth as string,
    schoolId: row.school_id as string,
    grade: row.grade as string,
    examDate: row.exam_date as string,
    expirationDate: row.expiration_date as string,
    height: row.height as string,
    weight: row.weight as string,
    bloodPressure: row.blood_pressure as string,
    pulseRate: row.pulse_rate as number,
    visionLeft: row.vision_left as string,
    visionRight: row.vision_right as string,
    medicalHistoryReviewed: row.medical_history_reviewed as boolean,
    significantFindings: row.significant_findings as string[] | undefined,
    medicationsReviewed: row.medications_reviewed as boolean,
    currentMedications: row.current_medications as string[] | undefined,
    cardiacScreeningCompleted: row.cardiac_screening_completed as boolean,
    cardiacScreeningDate: row.cardiac_screening_date as string | undefined,
    ekgCompleted: row.ekg_completed as boolean | undefined,
    ekgFindings: row.ekg_findings as string | undefined,
    familyHistoryReviewed: row.family_history_reviewed as boolean,
    suddenCardiacDeathHistory: row.sudden_cardiac_death_history as boolean,
    clearanceType: row.clearance_type as SportsPhysical['clearanceType'],
    status: row.status as SportsPhysical['status'],
    sportsCleared: (row.sports_cleared as string[]) || [],
    sportsRestricted: row.sports_restricted as string[] | undefined,
    restrictions: row.restrictions as string[] | undefined,
    requiresFollowUp: row.requires_follow_up as boolean,
    followUpReason: row.follow_up_reason as string | undefined,
    concussionHistory: row.concussion_history as boolean,
    numberOfConcussions: row.number_of_concussions as number | undefined,
    lastConcussionDate: row.last_concussion_date as string | undefined,
    baselineConcussionTestRequired: row.baseline_concussion_test_required as boolean,
    baselineConcussionTestCompleted: row.baseline_concussion_test_completed as boolean | undefined,
    providerSignature: row.provider_signature as string,
    providerSignedAt: row.provider_signed_at as string,
    npiVerified: row.npi_verified as boolean,
    submittedAt: row.submitted_at as string,
    processedAt: row.processed_at as string | undefined,
    processedBy: row.processed_by as string | undefined,
    athleticDirectorApproval: row.athletic_director_approval as boolean | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapDentalScreening(row: Record<string, unknown>): DentalScreening {
  return {
    id: row.id as string,
    providerId: row.provider_id as string,
    studentId: row.student_id as string,
    studentName: row.student_name as string,
    studentDateOfBirth: row.student_date_of_birth as string,
    schoolId: row.school_id as string,
    schoolName: row.school_name as string,
    grade: row.grade as string,
    screeningDate: row.screening_date as string,
    screeningType: row.screening_type as DentalScreening['screeningType'],
    screeningResult: row.screening_result as DentalScreening['screeningResult'],
    cavitiesFound: row.cavities_found as boolean,
    cavitiesCount: row.cavities_count as number,
    urgentCareNeeded: row.urgent_care_needed as boolean,
    orthodonticIssues: row.orthodontic_issues as boolean,
    gingivitisPresent: row.gingivitis_present as boolean,
    findings: (row.findings as DentalScreening['findings']) || { cavities: 0, gumDisease: false, orthodonticNeeds: false },
    recommendations: (row.recommendations as string[]) || [],
    referralNeeded: row.referral_needed as boolean,
    referralProvided: row.referral_provided as boolean | undefined,
    meetsStateRequirement: row.meets_state_requirement as boolean,
    treatmentUrgency: row.treatment_urgency as DentalScreening['treatmentUrgency'],
    providerSignature: row.provider_signature as string,
    providerSignedAt: row.provider_signed_at as string,
    npiVerified: row.npi_verified as boolean,
    notes: row.notes as string | undefined,
    status: row.status as DentalScreening['status'],
    submittedAt: row.submitted_at as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ===========================================
// Local filter helpers (applied to sample data)
// ===========================================

function filterProviders(providers: HealthcareProvider[], filters?: ProviderFilters): HealthcareProvider[] {
  let result = [...providers];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.practiceName.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search)
    );
  }

  if (filters?.providerType?.length) {
    result = result.filter((p) => filters.providerType!.includes(p.providerType));
  }

  if (filters?.specialty?.length) {
    result = result.filter((p) => filters.specialty!.includes(p.specialty));
  }

  if (filters?.verificationStatus?.length) {
    result = result.filter((p) => filters.verificationStatus!.includes(p.verificationStatus));
  }

  if (filters?.status?.length) {
    result = result.filter((p) => filters.status!.includes(p.status));
  }

  return result;
}

function filterExcuses(excuses: MedicalExcuse[], filters?: ExcuseFilters): MedicalExcuse[] {
  let result = [...excuses];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.studentName.toLowerCase().includes(search) ||
        e.generalReason.toLowerCase().includes(search)
    );
  }

  if (filters?.status?.length) {
    result = result.filter((e) => filters.status!.includes(e.status));
  }

  if (filters?.excuseType?.length) {
    result = result.filter((e) => filters.excuseType!.includes(e.excuseType));
  }

  if (filters?.providerId) {
    result = result.filter((e) => e.providerId === filters.providerId);
  }

  if (filters?.studentId) {
    result = result.filter((e) => e.studentId === filters.studentId);
  }

  if (filters?.schoolId) {
    result = result.filter((e) => e.schoolId === filters.schoolId);
  }

  return result;
}

// ===========================================
// HEALTHCARE PROVIDER SERVICE
// ===========================================

class HealthcareProviderService {
  // ===========================================
  // PROVIDER MANAGEMENT
  // ===========================================

  async getProviders(filters?: ProviderFilters): Promise<HealthcareProvider[]> {
    try {
      let query = supabase.from('healthcare_providers').select('*');

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,practice_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }
      if (filters?.providerType?.length) {
        query = query.in('provider_type', filters.providerType);
      }
      if (filters?.specialty?.length) {
        query = query.in('specialty', filters.specialty);
      }
      if (filters?.verificationStatus?.length) {
        query = query.in('verification_status', filters.verificationStatus);
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const providers = (data || []).map(mapProvider);
      if (providers.length === 0) {
        return filterProviders(SAMPLE_PROVIDERS, filters);
      }
      return providers;
    } catch (err) {
      console.error('Error fetching healthcare providers:', err);
      return filterProviders(SAMPLE_PROVIDERS, filters);
    }
  }

  async getProvider(id: string): Promise<HealthcareProvider | null> {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapProvider(data) : null;
    } catch (err) {
      console.error('Error fetching healthcare provider:', err);
      return SAMPLE_PROVIDERS.find((p) => p.id === id) || null;
    }
  }

  async getProviderByNPI(npiNumber: string): Promise<HealthcareProvider | null> {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select('*')
        .eq('npi_number', npiNumber)
        .single();

      if (error) throw error;
      return data ? mapProvider(data) : null;
    } catch (err) {
      console.error('Error fetching provider by NPI:', err);
      return SAMPLE_PROVIDERS.find((p) => p.npiNumber === npiNumber) || null;
    }
  }

  async updateProvider(id: string, updates: Partial<HealthcareProvider>): Promise<HealthcareProvider> {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          credentials: updates.credentials,
          email: updates.email,
          phone: updates.phone,
          practice_name: updates.practiceName,
          practice_type: updates.practiceType,
          address: updates.address,
          npi_number: updates.npiNumber,
          state_license_number: updates.stateLicenseNumber,
          state_license_state: updates.stateLicenseState,
          state_license_expiration: updates.stateLicenseExpiration,
          provider_type: updates.providerType,
          specialty: updates.specialty,
          verification_status: updates.verificationStatus,
          accepting_new_patients: updates.acceptingNewPatients,
          schools_served: updates.schoolsServed,
          districts_served: updates.districtsServed,
          preferred_contact_method: updates.preferredContactMethod,
          notification_preferences: updates.notificationPreferences,
          status: updates.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapProvider(data);
    } catch (err) {
      console.error('Error updating healthcare provider:', err);
      // Fallback to local mutation
      const index = SAMPLE_PROVIDERS.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Provider not found');
      SAMPLE_PROVIDERS[index] = {
        ...SAMPLE_PROVIDERS[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return SAMPLE_PROVIDERS[index];
    }
  }

  // ===========================================
  // PROVIDER REGISTRATION & VERIFICATION
  // ===========================================

  async registerProvider(data: Partial<ProviderRegistration>): Promise<ProviderRegistration> {
    try {
      const insertPayload = {
        email: data.email || '',
        phone: data.phone || '',
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        credentials: data.credentials || '',
        provider_type: data.providerType || 'physician',
        specialty: data.specialty || 'general-practice',
        practice_name: data.practiceName || '',
        practice_address: data.practiceAddress || { street1: '', city: '', state: '', zipCode: '' },
        npi_number: data.npiNumber || '',
        state_license_number: data.stateLicenseNumber || '',
        state_license_state: data.stateLicenseState || '',
        status: 'pending',
      };

      const { data: row, error } = await supabase
        .from('healthcare_provider_registrations')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        email: row.email,
        phone: row.phone,
        firstName: row.first_name,
        lastName: row.last_name,
        credentials: row.credentials,
        providerType: row.provider_type,
        specialty: row.specialty,
        practiceName: row.practice_name,
        practiceAddress: row.practice_address,
        npiNumber: row.npi_number,
        stateLicenseNumber: row.state_license_number,
        stateLicenseState: row.state_license_state,
        npiVerificationStatus: row.npi_verification_status || 'pending',
        licenseVerificationStatus: row.license_verification_status || 'pending',
        onboardingStep: row.onboarding_step || 1,
        onboardingCompleted: row.onboarding_completed || false,
        termsAccepted: row.terms_accepted || false,
        hipaaTrainingCompleted: row.hipaa_training_completed || false,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } as ProviderRegistration;
    } catch (err) {
      console.error('Error registering provider:', err);
      // Fallback: return locally constructed registration
      const registration: ProviderRegistration = {
        id: `reg-${Date.now()}`,
        email: data.email || '',
        phone: data.phone || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        credentials: data.credentials || '',
        providerType: data.providerType || 'physician',
        specialty: data.specialty || 'general-practice',
        practiceName: data.practiceName || '',
        practiceAddress: data.practiceAddress || {
          street1: '',
          city: '',
          state: '',
          zipCode: '',
        },
        npiNumber: data.npiNumber || '',
        stateLicenseNumber: data.stateLicenseNumber || '',
        stateLicenseState: data.stateLicenseState || '',
        npiVerificationStatus: 'pending',
        licenseVerificationStatus: 'pending',
        onboardingStep: 1,
        onboardingCompleted: false,
        termsAccepted: false,
        hipaaTrainingCompleted: false,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return registration;
    }
  }

  async verifyNPI(npiNumber: string): Promise<NPIVerificationResult> {
    // NPI verification calls external NPPES API - no Supabase table needed
    // Simulate with timeout (in production would call NPPES API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isValid = npiNumber.length === 10 && /^\d+$/.test(npiNumber);

    return {
      npiNumber,
      isValid,
      providerName: isValid ? 'Dr. Sample Provider' : undefined,
      providerType: isValid ? 'Individual' : undefined,
      specialty: isValid ? 'Pediatrics' : undefined,
      practiceAddress: isValid ? '123 Medical Center Dr, San Francisco, CA 94102' : undefined,
      enumerationDate: isValid ? '2015-03-15' : undefined,
      status: isValid ? 'active' : undefined,
      verificationSource: 'NPPES',
      verifiedAt: new Date().toISOString(),
    };
  }

  async verifyLicense(
    licenseNumber: string,
    state: string
  ): Promise<LicenseVerificationResult> {
    // License verification calls external state API - no Supabase table needed
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isValid = licenseNumber.length >= 5;

    return {
      licenseNumber,
      state,
      isValid,
      providerName: isValid ? 'Dr. Sample Provider' : undefined,
      licenseType: isValid ? 'MD' : undefined,
      issueDate: isValid ? '2015-06-01' : undefined,
      expirationDate: isValid ? '2026-06-30' : undefined,
      status: isValid ? 'active' : undefined,
      verificationSource: 'state-api',
      verifiedAt: new Date().toISOString(),
    };
  }

  // ===========================================
  // MEDICAL EXCUSES
  // ===========================================

  async getExcuses(filters?: ExcuseFilters): Promise<MedicalExcuse[]> {
    try {
      let query = supabase.from('medical_excuses').select('*');

      if (filters?.search) {
        query = query.or(
          `student_name.ilike.%${filters.search}%,general_reason.ilike.%${filters.search}%`
        );
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.excuseType?.length) {
        query = query.in('excuse_type', filters.excuseType);
      }
      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }
      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }
      if (filters?.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const excuses = (data || []).map(mapExcuse);
      if (excuses.length === 0) {
        return filterExcuses(SAMPLE_EXCUSES, filters);
      }
      return excuses;
    } catch (err) {
      console.error('Error fetching medical excuses:', err);
      return filterExcuses(SAMPLE_EXCUSES, filters);
    }
  }

  async getExcuse(id: string): Promise<MedicalExcuse | null> {
    try {
      const { data, error } = await supabase
        .from('medical_excuses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapExcuse(data) : null;
    } catch (err) {
      console.error('Error fetching medical excuse:', err);
      return SAMPLE_EXCUSES.find((e) => e.id === id) || null;
    }
  }

  async createExcuse(
    providerId: string,
    data: MedicalExcuseFormData
  ): Promise<MedicalExcuse> {
    try {
      const insertPayload = {
        provider_id: providerId,
        student_id: data.studentId,
        student_name: 'Student Name', // Would be resolved via lookup
        student_date_of_birth: '2010-01-01',
        school_id: data.schoolId,
        school_name: 'School Name',
        grade: '5',
        excuse_type: data.excuseType,
        general_reason: data.generalReason,
        appointment_date: data.appointmentDate || null,
        absence_start_date: data.absenceStartDate,
        absence_end_date: data.absenceEndDate,
        return_to_school_date: data.returnToSchoolDate,
        is_recurring: data.isRecurring,
        recurring_schedule: data.isRecurring
          ? {
              frequency: data.recurringFrequency,
              startDate: data.absenceStartDate,
              endDate: data.recurringEndDate || data.absenceEndDate,
            }
          : null,
        restrictions: data.restrictions || [],
        pe_restrictions: data.peRestricted
          ? {
              fullyExcused: data.peRestrictionType === 'full',
              limitedParticipation: data.peRestrictionType === 'limited',
              startDate: data.absenceStartDate,
              endDate: data.peRestrictionEndDate || data.absenceEndDate,
            }
          : null,
        return_clearance_required: data.returnClearanceRequired,
        follow_up_required: data.followUpRequired,
        follow_up_date: data.followUpDate || null,
        provider_signature: 'Provider Signature',
        provider_signed_at: new Date().toISOString(),
        npi_verified: true,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      const { data: row, error } = await supabase
        .from('medical_excuses')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return mapExcuse(row);
    } catch (err) {
      console.error('Error creating medical excuse:', err);
      // Fallback: local creation
      const excuse: MedicalExcuse = {
        id: `excuse-${Date.now()}`,
        providerId,
        studentId: data.studentId,
        studentName: 'Student Name',
        studentDateOfBirth: '2010-01-01',
        schoolId: data.schoolId,
        schoolName: 'School Name',
        grade: '5',
        excuseType: data.excuseType as MedicalExcuse['excuseType'],
        generalReason: data.generalReason,
        appointmentDate: data.appointmentDate || undefined,
        absenceStartDate: data.absenceStartDate,
        absenceEndDate: data.absenceEndDate,
        returnToSchoolDate: data.returnToSchoolDate,
        isRecurring: data.isRecurring,
        recurringSchedule: data.isRecurring
          ? {
              frequency: data.recurringFrequency as 'daily' | 'weekly' | 'biweekly' | 'monthly',
              startDate: data.absenceStartDate,
              endDate: data.recurringEndDate || data.absenceEndDate,
            }
          : undefined,
        restrictions: data.restrictions || [],
        peRestrictions: data.peRestricted
          ? {
              fullyExcused: data.peRestrictionType === 'full',
              limitedParticipation: data.peRestrictionType === 'limited',
              startDate: data.absenceStartDate,
              endDate: data.peRestrictionEndDate || data.absenceEndDate,
            }
          : undefined,
        returnClearanceRequired: data.returnClearanceRequired,
        returnClearanceProvided: false,
        followUpRequired: data.followUpRequired,
        followUpDate: data.followUpDate,
        providerSignature: 'Provider Signature',
        providerSignedAt: new Date().toISOString(),
        npiVerified: true,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        attendanceUpdated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      SAMPLE_EXCUSES.push(excuse);
      return excuse;
    }
  }

  async updateExcuseStatus(
    id: string,
    status: MedicalExcuseStatus,
    processedBy?: string,
    notes?: string
  ): Promise<MedicalExcuse> {
    try {
      const updatePayload: Record<string, unknown> = {
        status,
        processed_by: processedBy || null,
        school_notes: notes || null,
        processed_at: status === 'processed' ? new Date().toISOString() : null,
        attendance_updated: status === 'processed',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('medical_excuses')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapExcuse(data);
    } catch (err) {
      console.error('Error updating excuse status:', err);
      // Fallback
      const index = SAMPLE_EXCUSES.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Excuse not found');
      SAMPLE_EXCUSES[index] = {
        ...SAMPLE_EXCUSES[index],
        status,
        processedBy,
        schoolNotes: notes,
        processedAt: status === 'processed' ? new Date().toISOString() : undefined,
        attendanceUpdated: status === 'processed',
        updatedAt: new Date().toISOString(),
      };
      return SAMPLE_EXCUSES[index];
    }
  }

  // ===========================================
  // SPORTS PHYSICALS
  // ===========================================

  async getSportsPhysicals(
    filters?: { providerId?: string; schoolId?: string; status?: SportsPhysical['status'][] }
  ): Promise<SportsPhysical[]> {
    try {
      let query = supabase.from('sports_physicals').select('*');

      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }
      if (filters?.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const physicals = (data || []).map(mapSportsPhysical);
      if (physicals.length === 0) {
        let fallback = [...SAMPLE_SPORTS_PHYSICALS];
        if (filters?.providerId) fallback = fallback.filter((p) => p.providerId === filters.providerId);
        if (filters?.schoolId) fallback = fallback.filter((p) => p.schoolId === filters.schoolId);
        if (filters?.status?.length) fallback = fallback.filter((p) => filters.status!.includes(p.status));
        return fallback;
      }
      return physicals;
    } catch (err) {
      console.error('Error fetching sports physicals:', err);
      let fallback = [...SAMPLE_SPORTS_PHYSICALS];
      if (filters?.providerId) fallback = fallback.filter((p) => p.providerId === filters.providerId);
      if (filters?.schoolId) fallback = fallback.filter((p) => p.schoolId === filters.schoolId);
      if (filters?.status?.length) fallback = fallback.filter((p) => filters.status!.includes(p.status));
      return fallback;
    }
  }

  async getSportsPhysical(id: string): Promise<SportsPhysical | null> {
    try {
      const { data, error } = await supabase
        .from('sports_physicals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapSportsPhysical(data) : null;
    } catch (err) {
      console.error('Error fetching sports physical:', err);
      return SAMPLE_SPORTS_PHYSICALS.find((p) => p.id === id) || null;
    }
  }

  async createSportsPhysical(
    providerId: string,
    data: SportsPhysicalFormData
  ): Promise<SportsPhysical> {
    try {
      const expirationDate = new Date(
        new Date(data.examDate).setFullYear(new Date(data.examDate).getFullYear() + 1)
      ).toISOString().split('T')[0];

      const insertPayload = {
        provider_id: providerId,
        student_id: data.studentId,
        student_name: 'Student Name',
        student_date_of_birth: '2009-01-01',
        school_id: data.schoolId,
        grade: '8',
        exam_date: data.examDate,
        expiration_date: expirationDate,
        height: data.height,
        weight: data.weight,
        blood_pressure: data.bloodPressure,
        pulse_rate: parseInt(data.pulseRate),
        vision_left: data.visionLeft,
        vision_right: data.visionRight,
        medical_history_reviewed: data.medicalHistoryReviewed,
        significant_findings: data.significantFindings ? [data.significantFindings] : null,
        medications_reviewed: true,
        current_medications: data.currentMedications ? [data.currentMedications] : null,
        cardiac_screening_completed: data.cardiacScreeningCompleted,
        cardiac_screening_date: data.cardiacScreeningCompleted ? data.examDate : null,
        ekg_completed: data.ekgCompleted || false,
        ekg_findings: data.ekgFindings || null,
        family_history_reviewed: data.familyHistoryReviewed,
        sudden_cardiac_death_history: data.suddenCardiacDeathHistory,
        clearance_type: data.clearanceType,
        status: 'pending-review',
        sports_cleared: data.sportsCleared,
        sports_restricted: data.sportsRestricted.length > 0 ? data.sportsRestricted : null,
        restrictions: data.restrictions ? [data.restrictions] : null,
        requires_follow_up: data.requiresFollowUp,
        follow_up_reason: data.followUpReason || null,
        concussion_history: data.concussionHistory,
        number_of_concussions: data.numberOfConcussions ? parseInt(data.numberOfConcussions) : null,
        last_concussion_date: data.lastConcussionDate || null,
        baseline_concussion_test_required: data.concussionHistory,
        provider_signature: 'Provider Signature',
        provider_signed_at: new Date().toISOString(),
        npi_verified: true,
        submitted_at: new Date().toISOString(),
      };

      const { data: row, error } = await supabase
        .from('sports_physicals')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return mapSportsPhysical(row);
    } catch (err) {
      console.error('Error creating sports physical:', err);
      // Fallback: local creation
      const physical: SportsPhysical = {
        id: `physical-${Date.now()}`,
        providerId,
        studentId: data.studentId,
        studentName: 'Student Name',
        studentDateOfBirth: '2009-01-01',
        schoolId: data.schoolId,
        grade: '8',
        examDate: data.examDate,
        expirationDate: new Date(
          new Date(data.examDate).setFullYear(new Date(data.examDate).getFullYear() + 1)
        ).toISOString().split('T')[0],
        height: data.height,
        weight: data.weight,
        bloodPressure: data.bloodPressure,
        pulseRate: parseInt(data.pulseRate),
        visionLeft: data.visionLeft,
        visionRight: data.visionRight,
        medicalHistoryReviewed: data.medicalHistoryReviewed,
        significantFindings: data.significantFindings ? [data.significantFindings] : undefined,
        medicationsReviewed: true,
        currentMedications: data.currentMedications ? [data.currentMedications] : undefined,
        cardiacScreeningCompleted: data.cardiacScreeningCompleted,
        cardiacScreeningDate: data.cardiacScreeningCompleted ? data.examDate : undefined,
        ekgCompleted: data.ekgCompleted,
        ekgFindings: data.ekgFindings || undefined,
        familyHistoryReviewed: data.familyHistoryReviewed,
        suddenCardiacDeathHistory: data.suddenCardiacDeathHistory,
        clearanceType: data.clearanceType as SportsPhysical['clearanceType'],
        status: 'pending-review',
        sportsCleared: data.sportsCleared,
        sportsRestricted: data.sportsRestricted.length > 0 ? data.sportsRestricted : undefined,
        restrictions: data.restrictions ? [data.restrictions] : undefined,
        requiresFollowUp: data.requiresFollowUp,
        followUpReason: data.followUpReason || undefined,
        concussionHistory: data.concussionHistory,
        numberOfConcussions: data.numberOfConcussions ? parseInt(data.numberOfConcussions) : undefined,
        lastConcussionDate: data.lastConcussionDate || undefined,
        baselineConcussionTestRequired: data.concussionHistory,
        providerSignature: 'Provider Signature',
        providerSignedAt: new Date().toISOString(),
        npiVerified: true,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      SAMPLE_SPORTS_PHYSICALS.push(physical);
      return physical;
    }
  }

  async approveSportsPhysical(
    id: string,
    approvedBy: string
  ): Promise<SportsPhysical> {
    try {
      const { data, error } = await supabase
        .from('sports_physicals')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: approvedBy,
          athletic_director_approval: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapSportsPhysical(data);
    } catch (err) {
      console.error('Error approving sports physical:', err);
      const index = SAMPLE_SPORTS_PHYSICALS.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Sports physical not found');
      SAMPLE_SPORTS_PHYSICALS[index] = {
        ...SAMPLE_SPORTS_PHYSICALS[index],
        status: 'approved',
        processedAt: new Date().toISOString(),
        processedBy: approvedBy,
        athleticDirectorApproval: true,
        updatedAt: new Date().toISOString(),
      };
      return SAMPLE_SPORTS_PHYSICALS[index];
    }
  }

  // ===========================================
  // DENTAL SCREENINGS
  // ===========================================

  async getDentalScreenings(
    filters?: { providerId?: string; schoolId?: string; status?: string }
  ): Promise<DentalScreening[]> {
    try {
      let query = supabase.from('dental_screenings').select('*');

      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }
      if (filters?.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const screenings = (data || []).map(mapDentalScreening);
      if (screenings.length === 0) {
        let fallback = [...SAMPLE_DENTAL_SCREENINGS];
        if (filters?.providerId) fallback = fallback.filter((s) => s.providerId === filters.providerId);
        if (filters?.schoolId) fallback = fallback.filter((s) => s.schoolId === filters.schoolId);
        if (filters?.status) fallback = fallback.filter((s) => s.status === filters.status);
        return fallback;
      }
      return screenings;
    } catch (err) {
      console.error('Error fetching dental screenings:', err);
      let fallback = [...SAMPLE_DENTAL_SCREENINGS];
      if (filters?.providerId) fallback = fallback.filter((s) => s.providerId === filters.providerId);
      if (filters?.schoolId) fallback = fallback.filter((s) => s.schoolId === filters.schoolId);
      if (filters?.status) fallback = fallback.filter((s) => s.status === filters.status);
      return fallback;
    }
  }

  async getDentalScreening(id: string): Promise<DentalScreening | null> {
    try {
      const { data, error } = await supabase
        .from('dental_screenings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapDentalScreening(data) : null;
    } catch (err) {
      console.error('Error fetching dental screening:', err);
      return SAMPLE_DENTAL_SCREENINGS.find((s) => s.id === id) || null;
    }
  }

  async createDentalScreening(data: {
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
  }): Promise<DentalScreening> {
    try {
      const screeningResult = data.treatmentUrgency === 'urgent' ? 'urgent-care-needed' :
                              data.findings.cavities > 0 ? 'needs-dental-care' : 'no-obvious-problem';

      const insertPayload = {
        provider_id: data.providerId,
        student_id: data.studentId,
        student_name: data.studentName,
        student_date_of_birth: '2010-01-01',
        school_id: data.schoolId,
        school_name: data.schoolName,
        grade: data.studentGrade,
        screening_date: data.screeningDate,
        screening_type: 'routine',
        screening_result: screeningResult,
        cavities_found: data.findings.cavities > 0,
        cavities_count: data.findings.cavities,
        urgent_care_needed: data.treatmentUrgency === 'urgent',
        orthodontic_issues: data.findings.orthodonticNeeds,
        gingivitis_present: data.findings.gumDisease,
        findings: data.findings,
        recommendations: data.referralNeeded ? ['Referral to dental provider recommended'] : [],
        referral_needed: data.referralNeeded,
        referral_provided: data.referralNeeded,
        meets_state_requirement: true,
        treatment_urgency: data.treatmentUrgency,
        provider_signature: 'Provider Signature',
        provider_signed_at: new Date().toISOString(),
        npi_verified: true,
        notes: data.notes || null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };

      const { data: row, error } = await supabase
        .from('dental_screenings')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return mapDentalScreening(row);
    } catch (err) {
      console.error('Error creating dental screening:', err);
      // Fallback: local creation
      const screening: DentalScreening = {
        id: `dental-${Date.now()}`,
        providerId: data.providerId,
        studentId: data.studentId,
        studentName: data.studentName,
        studentDateOfBirth: '2010-01-01',
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        grade: data.studentGrade,
        screeningDate: data.screeningDate,
        screeningType: 'routine',
        screeningResult: data.treatmentUrgency === 'urgent' ? 'urgent-care-needed' :
                         data.findings.cavities > 0 ? 'needs-dental-care' : 'no-obvious-problem',
        cavitiesFound: data.findings.cavities > 0,
        cavitiesCount: data.findings.cavities,
        urgentCareNeeded: data.treatmentUrgency === 'urgent',
        orthodonticIssues: data.findings.orthodonticNeeds,
        gingivitisPresent: data.findings.gumDisease,
        findings: {
          cavities: data.findings.cavities,
          gumDisease: data.findings.gumDisease,
          orthodonticNeeds: data.findings.orthodonticNeeds,
          otherFindings: data.findings.otherFindings,
        },
        recommendations: data.referralNeeded ? ['Referral to dental provider recommended'] : [],
        referralNeeded: data.referralNeeded,
        referralProvided: data.referralNeeded,
        meetsStateRequirement: true,
        treatmentUrgency: data.treatmentUrgency,
        providerSignature: 'Provider Signature',
        providerSignedAt: new Date().toISOString(),
        npiVerified: true,
        notes: data.notes,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      SAMPLE_DENTAL_SCREENINGS.push(screening);
      return screening;
    }
  }

  // ===========================================
  // SECURE MESSAGING
  // ===========================================

  async getMessageThreads(userId: string): Promise<MessageThread[]> {
    try {
      const { data, error } = await supabase
        .from('healthcare_message_threads')
        .select('*')
        .contains('participant_ids', [userId])
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return SAMPLE_MESSAGE_THREADS.filter((t) =>
          t.participants.some((p: MessageParticipant) => p.id === userId)
        );
      }

      // Map DB rows to MessageThread (simplified - messages fetched separately)
      return data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        participants: (row.participants as MessageParticipant[]) || [],
        participantId: row.participant_id as string,
        participantName: row.participant_name as string,
        studentId: row.student_id as string,
        studentName: row.student_name as string,
        schoolId: row.school_id as string,
        schoolName: row.school_name as string,
        subject: row.subject as string,
        category: row.category as string,
        priority: row.priority as MessageThread['priority'],
        lastMessageAt: row.last_message_at as string,
        unreadCount: (row.unread_count as Record<string, number>) || {},
        messageCount: row.message_count as number,
        status: row.status as MessageThread['status'],
        createdAt: row.created_at as string,
        messages: [],
      }));
    } catch (err) {
      console.error('Error fetching message threads:', err);
      return SAMPLE_MESSAGE_THREADS.filter((t) =>
        t.participants.some((p: MessageParticipant) => p.id === userId)
      );
    }
  }

  async getMessageThread(threadId: string): Promise<MessageThread | null> {
    try {
      const { data, error } = await supabase
        .from('healthcare_message_threads')
        .select('*')
        .eq('id', threadId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Also fetch messages for the thread
      const { data: messages } = await supabase
        .from('healthcare_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      return {
        id: data.id,
        participants: data.participants || [],
        participantId: data.participant_id,
        participantName: data.participant_name,
        studentId: data.student_id,
        studentName: data.student_name,
        schoolId: data.school_id,
        schoolName: data.school_name,
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        lastMessageAt: data.last_message_at,
        unreadCount: data.unread_count || {},
        messageCount: data.message_count,
        status: data.status,
        createdAt: data.created_at,
        messages: (messages || []).map((m: Record<string, unknown>) => ({
          id: m.id as string,
          threadId: m.thread_id as string,
          senderId: m.sender_id as string,
          senderType: m.sender_type as string,
          senderName: m.sender_name as string,
          recipientId: m.recipient_id as string,
          recipientType: m.recipient_type as string,
          recipientName: m.recipient_name as string,
          subject: m.subject as string,
          body: m.body as string,
          category: m.category as string,
          priority: m.priority as string,
          read: m.read as boolean,
          containsPHI: m.contains_phi as boolean,
          hipaaAcknowledged: m.hipaa_acknowledged as boolean,
          auditLogId: m.audit_log_id as string,
          replied: m.replied as boolean,
          createdAt: m.created_at as string,
        })),
      } as MessageThread;
    } catch (err) {
      console.error('Error fetching message thread:', err);
      return SAMPLE_MESSAGE_THREADS.find((t) => t.id === threadId) || null;
    }
  }

  async sendMessage(data: {
    threadId?: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    recipientId: string;
    subject?: string;
    content: string;
    isHIPAAProtected: boolean;
  }): Promise<SecureMessage> {
    try {
      const threadId = data.threadId || `thread-${Date.now()}`;
      const insertPayload = {
        thread_id: threadId,
        sender_id: data.senderId,
        sender_type: data.senderRole,
        sender_name: data.senderName,
        recipient_id: data.recipientId,
        recipient_type: 'school-nurse',
        recipient_name: 'Recipient Name',
        subject: data.subject || 'No Subject',
        body: data.content,
        category: 'general',
        priority: 'normal',
        read: false,
        contains_phi: data.isHIPAAProtected,
        hipaa_acknowledged: true,
      };

      const { data: row, error } = await supabase
        .from('healthcare_messages')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        threadId: row.thread_id,
        senderId: row.sender_id,
        senderType: row.sender_type,
        senderName: row.sender_name,
        recipientId: row.recipient_id,
        recipientType: row.recipient_type,
        recipientName: row.recipient_name,
        subject: row.subject,
        body: row.body,
        category: row.category,
        priority: row.priority,
        read: row.read,
        containsPHI: row.contains_phi,
        hipaaAcknowledged: row.hipaa_acknowledged,
        auditLogId: row.audit_log_id || `audit-${Date.now()}`,
        replied: false,
        createdAt: row.created_at,
      } as SecureMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      // Fallback: local message
      const message: SecureMessage = {
        id: `msg-${Date.now()}`,
        threadId: data.threadId || `thread-${Date.now()}`,
        senderId: data.senderId,
        senderType: data.senderRole as 'provider' | 'school-nurse',
        senderName: data.senderName,
        recipientId: data.recipientId,
        recipientType: 'school-nurse',
        recipientName: 'Recipient Name',
        subject: data.subject || 'No Subject',
        body: data.content,
        category: 'general',
        priority: 'normal',
        read: false,
        containsPHI: data.isHIPAAProtected,
        hipaaAcknowledged: true,
        auditLogId: `audit-${Date.now()}`,
        replied: false,
        createdAt: new Date().toISOString(),
      };

      if (data.threadId) {
        const threadIndex = SAMPLE_MESSAGE_THREADS.findIndex((t) => t.id === data.threadId);
        if (threadIndex !== -1) {
          SAMPLE_MESSAGE_THREADS[threadIndex].messages?.push(message);
          SAMPLE_MESSAGE_THREADS[threadIndex].lastMessageAt = message.createdAt;
        }
      }

      return message;
    }
  }

  // ===========================================
  // DASHBOARD & STATS
  // ===========================================

  async getProviderDashboardStats(providerId: string): Promise<ProviderDashboardStats> {
    try {
      // Try to get stats from DB in parallel
      const [excusesResult, physicalsResult, providerResult] = await Promise.all([
        supabase
          .from('medical_excuses')
          .select('id, status, created_at')
          .eq('provider_id', providerId),
        supabase
          .from('sports_physicals')
          .select('id, status, created_at, expiration_date')
          .eq('provider_id', providerId),
        supabase
          .from('healthcare_providers')
          .select('schools_served, districts_served, verification_status, state_license_expiration')
          .eq('id', providerId)
          .single(),
      ]);

      if (excusesResult.error && physicalsResult.error) throw new Error('DB unavailable');

      const excuses = excusesResult.data || [];
      const physicals = physicalsResult.data || [];
      const provider = providerResult.data;

      const now = new Date();
      const thisMonth = excuses.filter(
        (e: Record<string, unknown>) => new Date(e.created_at as string).getMonth() === now.getMonth()
      );

      const licenseExpDate = provider?.state_license_expiration as string || '';
      const daysUntilExpiry = licenseExpDate
        ? Math.ceil((new Date(licenseExpDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        totalExcusesSubmitted: excuses.length,
        excusesThisMonth: thisMonth.length,
        excusesPending: excuses.filter((e: Record<string, unknown>) => e.status === 'submitted').length,
        excusesProcessed: excuses.filter((e: Record<string, unknown>) => e.status === 'processed').length,
        totalPhysicalsSubmitted: physicals.length,
        physicalsThisMonth: physicals.filter(
          (p: Record<string, unknown>) => new Date(p.created_at as string).getMonth() === now.getMonth()
        ).length,
        activeAthletesCovered: physicals.filter((p: Record<string, unknown>) => p.status === 'approved').length,
        unreadMessages: 0,
        activeThreads: 0,
        schoolsServed: (provider?.schools_served as string[])?.length || 0,
        districtsConnected: (provider?.districts_served as string[])?.length || 0,
        verificationStatus: (provider?.verification_status as string) || 'pending',
        licenseExpirationDate: licenseExpDate,
        daysUntilLicenseExpiration: daysUntilExpiry,
      };
    } catch (err) {
      console.error('Error fetching provider dashboard stats:', err);
      // Fallback: compute from sample data
      const excuses = SAMPLE_EXCUSES.filter((e) => e.providerId === providerId);
      const physicals = SAMPLE_SPORTS_PHYSICALS.filter((p) => p.providerId === providerId);
      const provider = SAMPLE_PROVIDERS.find((p) => p.id === providerId);

      const now = new Date();
      const thisMonth = excuses.filter(
        (e) => new Date(e.createdAt).getMonth() === now.getMonth()
      );

      return {
        totalExcusesSubmitted: excuses.length,
        excusesThisMonth: thisMonth.length,
        excusesPending: excuses.filter((e) => e.status === 'submitted').length,
        excusesProcessed: excuses.filter((e) => e.status === 'processed').length,
        totalPhysicalsSubmitted: physicals.length,
        physicalsThisMonth: physicals.filter(
          (p) => new Date(p.createdAt).getMonth() === now.getMonth()
        ).length,
        activeAthletesCovered: physicals.filter((p) => p.status === 'approved').length,
        unreadMessages: 0,
        activeThreads: 0,
        schoolsServed: provider?.schoolsServed?.length || 0,
        districtsConnected: provider?.districtsServed?.length || 0,
        verificationStatus: provider?.verificationStatus || 'pending',
        licenseExpirationDate: provider?.stateLicenseExpiration || '',
        daysUntilLicenseExpiration: provider
          ? Math.ceil(
              (new Date(provider.stateLicenseExpiration).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0,
      };
    }
  }

  async getProviderActivityLog(providerId: string): Promise<ProviderActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('healthcare_activity_log')
        .select('*')
        .eq('provider_id', providerId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          providerId: row.provider_id as string,
          action: row.action as string,
          resourceType: row.resource_type as string,
          resourceId: row.resource_id as string,
          description: row.description as string,
          studentId: row.student_id as string | undefined,
          schoolId: row.school_id as string | undefined,
          timestamp: row.timestamp as string,
        }));
      }

      // Fallback sample data
      return [
        {
          id: 'log-001',
          providerId,
          action: 'excuse_submitted',
          resourceType: 'excuse',
          resourceId: 'excuse-001',
          description: 'Submitted medical excuse for Emma Wilson',
          studentId: 'student-001',
          schoolId: 'school-001',
          timestamp: '2024-12-09T14:30:00Z',
        },
        {
          id: 'log-002',
          providerId,
          action: 'physical_submitted',
          resourceType: 'sports_physical',
          resourceId: 'physical-001',
          description: 'Submitted sports physical for Alex Thompson',
          studentId: 'student-003',
          schoolId: 'school-001',
          timestamp: '2024-08-15T11:00:00Z',
        },
        {
          id: 'log-003',
          providerId,
          action: 'login',
          resourceType: 'profile',
          resourceId: providerId,
          description: 'Logged into provider portal',
          timestamp: '2024-12-09T14:25:00Z',
        },
      ];
    } catch (err) {
      console.error('Error fetching provider activity log:', err);
      return [
        {
          id: 'log-001',
          providerId,
          action: 'excuse_submitted',
          resourceType: 'excuse',
          resourceId: 'excuse-001',
          description: 'Submitted medical excuse for Emma Wilson',
          studentId: 'student-001',
          schoolId: 'school-001',
          timestamp: '2024-12-09T14:30:00Z',
        },
        {
          id: 'log-002',
          providerId,
          action: 'login',
          resourceType: 'profile',
          resourceId: providerId,
          description: 'Logged into provider portal',
          timestamp: '2024-12-09T14:25:00Z',
        },
      ];
    }
  }

  // ===========================================
  // STUDENT SEARCH (for excuse submission)
  // ===========================================

  async searchStudents(
    query: string,
    schoolId?: string
  ): Promise<{ id: string; name: string; grade: string; school: string }[]> {
    try {
      let dbQuery = supabase
        .from('students')
        .select('id, first_name, last_name, grade, school_name')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(20);

      if (schoolId) {
        dbQuery = dbQuery.eq('school_id', schoolId);
      }

      const { data, error } = await dbQuery;
      if (error) throw error;

      if (data && data.length > 0) {
        return data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          name: `${s.first_name} ${s.last_name}`,
          grade: s.grade as string,
          school: s.school_name as string,
        }));
      }

      // Fallback sample data
      return [
        { id: 'student-001', name: 'Emma Wilson', grade: '5', school: 'Lincoln Elementary' },
        { id: 'student-002', name: 'James Martinez', grade: '7', school: 'Lincoln Elementary' },
        { id: 'student-003', name: 'Alex Thompson', grade: '8', school: 'Lincoln Elementary' },
        { id: 'student-004', name: 'Sophia Nguyen', grade: '6', school: 'Washington Middle School' },
        { id: 'student-005', name: 'Maya Patel', grade: '7', school: 'Washington Middle School' },
      ].filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) &&
          (!schoolId || s.school.toLowerCase().includes(schoolId.toLowerCase()))
      );
    } catch (err) {
      console.error('Error searching students:', err);
      return [
        { id: 'student-001', name: 'Emma Wilson', grade: '5', school: 'Lincoln Elementary' },
        { id: 'student-002', name: 'James Martinez', grade: '7', school: 'Lincoln Elementary' },
        { id: 'student-003', name: 'Alex Thompson', grade: '8', school: 'Lincoln Elementary' },
        { id: 'student-004', name: 'Sophia Nguyen', grade: '6', school: 'Washington Middle School' },
        { id: 'student-005', name: 'Maya Patel', grade: '7', school: 'Washington Middle School' },
      ].filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) &&
          (!schoolId || s.school.toLowerCase().includes(schoolId.toLowerCase()))
      );
    }
  }

  // ===========================================
  // IMMUNIZATION RECORDS
  // ===========================================

  async getStudentImmunizationProfile(
    studentId: string
  ): Promise<StudentImmunizationProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_immunization_profiles')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;

      return {
        studentId: data.student_id,
        studentName: data.student_name,
        dateOfBirth: data.date_of_birth,
        schoolId: data.school_id,
        grade: data.grade,
        overallStatus: data.overall_status,
        compliancePercentage: data.compliance_percentage,
        requirements: data.requirements || [],
        exemptions: data.exemptions || [],
        pendingImmunizations: data.pending_immunizations || [],
        lastUpdated: data.last_updated || data.updated_at,
      };
    } catch (err) {
      console.error('Error fetching immunization profile:', err);
      // Fallback sample data
      return {
        studentId,
        studentName: 'Student Name',
        dateOfBirth: '2012-03-15',
        schoolId: 'school-001',
        grade: '5',
        overallStatus: 'compliant',
        compliancePercentage: 100,
        requirements: [],
        exemptions: [],
        pendingImmunizations: [],
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async submitImmunizationRecord(
    providerId: string,
    data: Partial<ImmunizationRecord>
  ): Promise<ImmunizationRecord> {
    try {
      const insertPayload = {
        student_id: data.studentId || '',
        student_name: 'Student Name',
        student_date_of_birth: '2012-03-15',
        school_id: data.schoolId || '',
        immunization_type: data.immunizationType || 'Other',
        vaccine_name: data.vaccineName || '',
        dose_number: data.doseNumber || 1,
        total_doses_required: data.totalDosesRequired || 1,
        administration_date: data.administrationDate || new Date().toISOString().split('T')[0],
        administered_by: 'Provider Name',
        administered_at: 'Practice Name',
        provider_id: providerId,
        verification_source: 'provider-submitted',
        verified: false,
      };

      const { data: row, error } = await supabase
        .from('immunization_records')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return {
        id: row.id,
        studentId: row.student_id,
        studentName: row.student_name,
        studentDateOfBirth: row.student_date_of_birth,
        schoolId: row.school_id,
        immunizationType: row.immunization_type,
        vaccineName: row.vaccine_name,
        doseNumber: row.dose_number,
        totalDosesRequired: row.total_doses_required,
        administrationDate: row.administration_date,
        administeredBy: row.administered_by,
        administeredAt: row.administered_at,
        providerId: row.provider_id,
        verificationSource: row.verification_source,
        verified: row.verified,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } as ImmunizationRecord;
    } catch (err) {
      console.error('Error submitting immunization record:', err);
      // Fallback
      const record: ImmunizationRecord = {
        id: `imm-${Date.now()}`,
        studentId: data.studentId || '',
        studentName: 'Student Name',
        studentDateOfBirth: '2012-03-15',
        schoolId: data.schoolId || '',
        immunizationType: data.immunizationType || 'Other',
        vaccineName: data.vaccineName || '',
        doseNumber: data.doseNumber || 1,
        totalDosesRequired: data.totalDosesRequired || 1,
        administrationDate: data.administrationDate || new Date().toISOString().split('T')[0],
        administeredBy: 'Provider Name',
        administeredAt: 'Practice Name',
        providerId,
        verificationSource: 'provider-submitted',
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return record;
    }
  }

  // ===========================================
  // UI-SPECIFIC METHODS (Simplified for Dashboard)
  // ===========================================

  async getUIProviders(): Promise<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    specialty: string;
    credentials?: string[];
    npiNumber?: string;
    npiVerified?: boolean;
    licenses?: Array<{
      type: string;
      number: string;
      state: string;
      status: string;
      expirationDate: string;
    }>;
  }[]> {
    const providers = await this.getProviders();
    return providers.map((p) => ({
      id: p.id,
      name: `Dr. ${p.firstName} ${p.lastName}`,
      email: p.email,
      phone: p.phone,
      address: p.address ? `${p.address.street1}, ${p.address.city}, ${p.address.state}` : undefined,
      specialty: p.specialty,
      credentials: [p.credentials],
      npiNumber: p.npiNumber,
      npiVerified: p.verificationStatus === 'fully-verified' || p.verificationStatus === 'npi-verified',
      licenses: [{
        type: p.credentials,
        number: p.stateLicenseNumber,
        state: p.stateLicenseState,
        status: 'active',
        expirationDate: p.stateLicenseExpiration,
      }],
    }));
  }

  async getUIExcuses(filters?: { providerId?: string }): Promise<{
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
  }[]> {
    const excuses = await this.getExcuses(filters);
    return excuses.map((e) => ({
      id: e.id,
      providerId: e.providerId,
      studentId: e.studentId,
      studentName: e.studentName,
      studentGrade: e.grade,
      schoolId: e.schoolId,
      schoolName: e.schoolName,
      excuseType: e.excuseType,
      startDate: e.absenceStartDate,
      endDate: e.absenceEndDate,
      diagnosis: e.generalReason,
      restrictions: e.restrictions?.map((r) => r.description),
      notes: e.schoolNotes,
      status: e.status === 'processed' || e.status === 'verified' ? 'approved' :
              e.status === 'rejected' ? 'rejected' : 'pending',
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  async getUISportsPhysicals(filters?: { providerId?: string }): Promise<{
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
  }[]> {
    const physicals = await this.getSportsPhysicals(filters);
    return physicals.map((p) => ({
      id: p.id,
      providerId: p.providerId,
      studentId: p.studentId,
      studentName: p.studentName,
      studentGrade: p.grade,
      studentDob: p.studentDateOfBirth,
      schoolId: p.schoolId,
      schoolName: 'School Name',
      sports: p.sportsCleared || [],
      examDate: p.examDate,
      expirationDate: p.expirationDate,
      vitals: {
        height: p.height,
        weight: p.weight,
        bloodPressure: p.bloodPressure,
        pulse: p.pulseRate,
        vision: `${p.visionLeft}/${p.visionRight}`,
      },
      clearanceLevel: p.clearanceType === 'full-clearance' ? 'full' :
                      p.clearanceType === 'conditional-clearance' ? 'limited' : 'none',
      restrictions: p.restrictions,
      notes: p.followUpReason,
      status: p.status === 'approved' || p.status === 'cleared' ? 'cleared' :
              p.status === 'pending-review' || p.status === 'pending' ? 'pending' :
              p.status === 'conditionally-approved' || p.status === 'conditional' ? 'conditional' : 'not_cleared',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async getUIDashboardStats(providerId: string): Promise<{
    totalExcuses: number;
    pendingExcuses: number;
    approvedExcuses: number;
    activePhysicals: number;
    expiringSoonPhysicals: number;
    immunizationsDue: number;
    unreadMessages: number;
    totalMessages: number;
    pendingDentalScreenings: number;
  }> {
    const excuses = await this.getExcuses({ providerId });
    const physicals = await this.getSportsPhysicals({ providerId });
    const threads = await this.getMessageThreads(providerId);

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const unreadMessages = threads.reduce((sum, t) => {
      const unread = t.unreadCount;
      if (typeof unread === 'number') return sum + unread;
      if (typeof unread === 'object' && unread !== null) {
        return sum + (unread[providerId] || 0);
      }
      return sum;
    }, 0);

    return {
      totalExcuses: excuses.length,
      pendingExcuses: excuses.filter((e) => e.status === 'submitted').length,
      approvedExcuses: excuses.filter((e) => e.status === 'processed' || e.status === 'verified').length,
      activePhysicals: physicals.filter((p) => p.status === 'approved').length,
      expiringSoonPhysicals: physicals.filter((p) =>
        new Date(p.expirationDate) <= thirtyDaysFromNow && new Date(p.expirationDate) > now
      ).length,
      immunizationsDue: 3,
      unreadMessages,
      totalMessages: threads.reduce((sum, t) => sum + (t.messages?.length || 0), 0),
      pendingDentalScreenings: 2,
    };
  }
}

// Export singleton instance
export const healthcareProviderApi = new HealthcareProviderService();

// Export class for testing
export { HealthcareProviderService };
