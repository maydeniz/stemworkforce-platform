// ===========================================
// School-Healthcare Provider Coordination Types
// Bidirectional communication and document sharing
// ===========================================

// ==================== Channel Types ====================

export interface SchoolProviderChannel {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolAddress: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  schoolAuthorizedUsers: ChannelAuthorizedUser[];
  providerAuthorizedUsers: ChannelAuthorizedUser[];
  documentSharingEnabled: boolean;
  baaOnFile: boolean;
  baaSignedDate?: string;
  baaExpirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelAuthorizedUser {
  userId: string;
  name: string;
  email: string;
  role: SchoolRole | ProviderRole;
  permissions: ChannelPermission[];
  addedAt: string;
  addedBy: string;
}

export type SchoolRole =
  | 'school_nurse'
  | 'school_admin'
  | 'principal'
  | 'athletic_director'
  | 'registrar';

export type ProviderRole =
  | 'physician'
  | 'nurse_practitioner'
  | 'physician_assistant'
  | 'office_staff'
  | 'specialist';

export type ChannelPermission =
  | 'view_messages'
  | 'send_messages'
  | 'view_documents'
  | 'share_documents'
  | 'create_requests'
  | 'respond_requests'
  | 'approve_requests'
  | 'manage_channel';

// ==================== Document Types ====================

export interface SharedDocument {
  id: string;
  channelId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  documentType?: string; // Alias for UI display
  description?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByType: 'school' | 'provider';
  schoolAccess: DocumentAccessLevel;
  providerAccess: DocumentAccessLevel;
  containsPHI: boolean;
  studentId?: string;
  studentName?: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
  accessLog: DocumentAccessLog[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | 'medical_excuse'
  | 'sports_physical'
  | 'immunization_record'
  | 'care_plan'
  | 'medication_authorization'
  | 'allergy_action_plan'
  | 'emergency_care_plan'
  | 'dental_screening'
  | 'vision_screening'
  | 'hearing_screening'
  | 'general';

export type DocumentAccessLevel =
  | 'full_access'    // Can view and download
  | 'view_only'      // Can view but not download
  | 'no_access';     // Cannot view

export interface DocumentAccessLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userType: 'school' | 'provider';
  action: 'viewed' | 'downloaded' | 'printed' | 'shared';
  ipAddress?: string;
  userAgent?: string;
  accessedAt: string;
}

// ==================== Request Types ====================

export interface ActionRequest {
  id: string;
  channelId: string;
  type: RequestType;
  title: string;
  description: string;
  requesterType: 'school' | 'provider';
  requesterId: string;
  requesterName: string;
  assignedTo?: string;
  assignedToName?: string;
  studentId?: string;
  studentName?: string;
  studentGrade?: string;
  status: RequestStatus;
  priority: RequestPriority;
  dueDate?: string;
  responseDeadline?: string;
  attachedDocuments: string[];
  responseDocuments: string[];
  responseNotes?: string;
  denialReason?: string;
  auditLog: ActionAuditEntry[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type RequestType =
  | 'sports_clearance_request'
  | 'medical_excuse_verification'
  | 'care_plan_review'
  | 'immunization_verification'
  | 'medication_authorization_request'
  | 'allergy_action_plan_request'
  | 'return_to_school_clearance'
  | 'physical_exam_request'
  | 'general_inquiry';

export type RequestStatus =
  | 'pending'
  | 'in_review'
  | 'awaiting_info'
  | 'approved'
  | 'denied'
  | 'completed'
  | 'cancelled';

export type RequestPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface ActionAuditEntry {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  performedByType: 'school' | 'provider' | 'system';
  performedAt: string;
}

// ==================== Confirmation Types ====================

export interface Confirmation {
  id: string;
  channelId: string;
  relatedType: 'message' | 'document' | 'request';
  relatedId: string;
  confirmationType: ConfirmationType;
  requestedBy: string;
  requestedByType: 'school' | 'provider';
  requestedAt: string;
  confirmedBy?: string;
  confirmedByType?: 'school' | 'provider';
  confirmedAt?: string;
  confirmationNotes?: string;
  digitalSignature?: string;
  reminderSentAt?: string;
  deadline?: string;
  status: 'pending' | 'confirmed' | 'expired';
}

export type ConfirmationType =
  | 'receipt_acknowledged'
  | 'action_taken'
  | 'document_reviewed'
  | 'information_verified'
  | 'policy_accepted';

// ==================== Activity Feed Types ====================

export interface ChannelActivity {
  id: string;
  channelId: string;
  type: ActivityType;
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  actorType: 'school' | 'provider' | 'system';
  relatedId?: string;
  relatedType?: 'document' | 'request' | 'message' | 'confirmation';
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ActivityType =
  | 'channel_created'
  | 'user_added'
  | 'user_removed'
  | 'document_shared'
  | 'document_accessed'
  | 'request_created'
  | 'request_updated'
  | 'request_completed'
  | 'confirmation_requested'
  | 'confirmation_received'
  | 'message_sent';

// ==================== Statistics Types ====================

export interface SchoolCoordinationStats {
  connectedSchools: number;
  pendingRequests: number;
  sharedDocuments: number;
  pendingConfirmations: number;
  activeChannels: number;
  recentActivity: number;
}

// ==================== Request/Response Payloads ====================

export interface CreateChannelRequest {
  schoolId: string;
  schoolName: string;
  schoolAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message?: string;
}

export interface ShareDocumentRequest {
  channelId: string;
  file: File;
  category: DocumentCategory;
  description?: string;
  studentId?: string;
  studentName?: string;
  schoolAccess: DocumentAccessLevel;
  providerAccess: DocumentAccessLevel;
  containsPHI: boolean;
  expiresAt?: string;
  requestConfirmation?: boolean;
}

export interface CreateActionRequestPayload {
  channelId: string;
  type: RequestType;
  title: string;
  description: string;
  studentId?: string;
  studentName?: string;
  studentGrade?: string;
  priority: RequestPriority;
  dueDate?: string;
  attachedDocuments?: string[];
}

export interface RespondToRequestPayload {
  requestId: string;
  status: 'approved' | 'denied' | 'awaiting_info';
  responseNotes?: string;
  denialReason?: string;
  responseDocuments?: string[];
}
