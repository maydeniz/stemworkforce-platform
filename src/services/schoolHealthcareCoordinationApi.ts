// ===========================================
// School-Healthcare Provider Coordination API
// Handles bidirectional communication and document sharing
// ===========================================

import type {
  SchoolProviderChannel,
  SharedDocument,
  ActionRequest,
  ChannelActivity,
  SchoolCoordinationStats,
  CreateChannelRequest,
  ShareDocumentRequest,
  RespondToRequestPayload,
  DocumentAccessLog,
} from '@/types/schoolHealthcareCoordination';

// ===========================================
// Sample Data
// ===========================================

const SAMPLE_CHANNELS: SchoolProviderChannel[] = [
  {
    id: 'channel-1',
    schoolId: 'school-1',
    schoolName: 'Lincoln Middle School',
    schoolAddress: '123 Main St, Springfield, IL 62701',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Chen',
    providerSpecialty: 'Pediatrics',
    status: 'active',
    schoolAuthorizedUsers: [
      {
        userId: 'nurse-1',
        name: 'Maria Thompson',
        email: 'mthompson@lincoln.edu',
        role: 'school_nurse',
        permissions: ['view_messages', 'send_messages', 'view_documents', 'create_requests'],
        addedAt: '2024-01-15T10:00:00Z',
        addedBy: 'admin-1',
      },
    ],
    providerAuthorizedUsers: [
      {
        userId: 'provider-1',
        name: 'Dr. Sarah Chen',
        email: 'schen@healthcare.com',
        role: 'physician',
        permissions: ['view_messages', 'send_messages', 'view_documents', 'share_documents', 'respond_requests', 'approve_requests'],
        addedAt: '2024-01-15T10:00:00Z',
        addedBy: 'provider-1',
      },
    ],
    documentSharingEnabled: true,
    baaOnFile: true,
    baaSignedDate: '2024-01-15',
    baaExpirationDate: '2025-01-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'channel-2',
    schoolId: 'school-2',
    schoolName: 'Washington High School',
    schoolAddress: '456 Oak Ave, Springfield, IL 62702',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Chen',
    providerSpecialty: 'Pediatrics',
    status: 'active',
    schoolAuthorizedUsers: [
      {
        userId: 'nurse-2',
        name: 'Jennifer Davis',
        email: 'jdavis@washington.edu',
        role: 'school_nurse',
        permissions: ['view_messages', 'send_messages', 'view_documents', 'create_requests'],
        addedAt: '2024-02-01T09:00:00Z',
        addedBy: 'admin-2',
      },
      {
        userId: 'ad-1',
        name: 'Coach Mike Roberts',
        email: 'mroberts@washington.edu',
        role: 'athletic_director',
        permissions: ['view_messages', 'create_requests'],
        addedAt: '2024-02-01T09:00:00Z',
        addedBy: 'admin-2',
      },
    ],
    providerAuthorizedUsers: [
      {
        userId: 'provider-1',
        name: 'Dr. Sarah Chen',
        email: 'schen@healthcare.com',
        role: 'physician',
        permissions: ['view_messages', 'send_messages', 'view_documents', 'share_documents', 'respond_requests', 'approve_requests'],
        addedAt: '2024-02-01T09:00:00Z',
        addedBy: 'provider-1',
      },
    ],
    documentSharingEnabled: true,
    baaOnFile: true,
    baaSignedDate: '2024-02-01',
    baaExpirationDate: '2025-02-01',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
];

const SAMPLE_REQUESTS: ActionRequest[] = [
  {
    id: 'request-1',
    channelId: 'channel-1',
    type: 'sports_clearance_request',
    title: 'Basketball Season Clearance',
    description: 'Requesting sports clearance for basketball season participation. Student had recent ankle injury that has healed.',
    requesterType: 'school',
    requesterId: 'nurse-1',
    requesterName: 'Maria Thompson',
    studentId: 'student-123',
    studentName: 'John Smith',
    studentGrade: '8th Grade',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-02-20',
    attachedDocuments: [],
    responseDocuments: [],
    auditLog: [
      {
        id: 'audit-1',
        action: 'Request Created',
        details: 'Sports clearance request submitted by school nurse',
        performedBy: 'Maria Thompson',
        performedByType: 'school',
        performedAt: '2026-02-14T10:00:00Z',
      },
    ],
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-02-14T10:00:00Z',
  },
  {
    id: 'request-2',
    channelId: 'channel-2',
    type: 'medical_excuse_verification',
    title: 'Absence Verification - Feb 10-12',
    description: 'Please verify medical excuse for student absence from Feb 10-12 due to illness.',
    requesterType: 'school',
    requesterId: 'nurse-2',
    requesterName: 'Jennifer Davis',
    studentId: 'student-456',
    studentName: 'Emily Johnson',
    studentGrade: '10th Grade',
    status: 'in_review',
    priority: 'normal',
    attachedDocuments: [],
    responseDocuments: [],
    auditLog: [
      {
        id: 'audit-2',
        action: 'Request Created',
        details: 'Medical excuse verification requested',
        performedBy: 'Jennifer Davis',
        performedByType: 'school',
        performedAt: '2026-02-13T14:00:00Z',
      },
      {
        id: 'audit-3',
        action: 'Status Changed',
        details: 'Request moved to In Review',
        performedBy: 'Dr. Sarah Chen',
        performedByType: 'provider',
        performedAt: '2026-02-14T09:00:00Z',
      },
    ],
    createdAt: '2026-02-13T14:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'request-3',
    channelId: 'channel-1',
    type: 'care_plan_review',
    title: 'Diabetes Care Plan Update',
    description: 'Annual review of diabetes care plan for student. Please update medication dosages and emergency procedures.',
    requesterType: 'school',
    requesterId: 'nurse-1',
    requesterName: 'Maria Thompson',
    studentId: 'student-789',
    studentName: 'Michael Brown',
    studentGrade: '7th Grade',
    status: 'pending',
    priority: 'normal',
    dueDate: '2026-02-28',
    attachedDocuments: ['doc-current-plan'],
    responseDocuments: [],
    auditLog: [
      {
        id: 'audit-4',
        action: 'Request Created',
        details: 'Care plan review requested',
        performedBy: 'Maria Thompson',
        performedByType: 'school',
        performedAt: '2026-02-10T11:00:00Z',
      },
    ],
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
];

const SAMPLE_DOCUMENTS: SharedDocument[] = [
  {
    id: 'doc-1',
    channelId: 'channel-2',
    fileName: 'Medical_Excuse_EJohnson_Feb2026.pdf',
    fileSize: 125000,
    mimeType: 'application/pdf',
    category: 'medical_excuse',
    description: 'Medical excuse for Emily Johnson - February 10-12, 2026',
    uploadedBy: 'provider-1',
    uploadedByName: 'Dr. Sarah Chen',
    uploadedByType: 'provider',
    schoolAccess: 'view_only',
    providerAccess: 'full_access',
    containsPHI: true,
    studentId: 'student-456',
    studentName: 'Emily Johnson',
    status: 'active',
    accessLog: [
      {
        id: 'access-1',
        documentId: 'doc-1',
        userId: 'nurse-2',
        userName: 'Jennifer Davis',
        userType: 'school',
        action: 'viewed',
        accessedAt: '2026-02-14T10:30:00Z',
      },
    ],
    createdAt: '2026-02-14T09:15:00Z',
    updatedAt: '2026-02-14T09:15:00Z',
  },
  {
    id: 'doc-2',
    channelId: 'channel-1',
    fileName: 'Sports_Physical_JSmith_2026.pdf',
    fileSize: 245000,
    mimeType: 'application/pdf',
    category: 'sports_physical',
    description: 'Annual sports physical for John Smith',
    uploadedBy: 'provider-1',
    uploadedByName: 'Dr. Sarah Chen',
    uploadedByType: 'provider',
    schoolAccess: 'full_access',
    providerAccess: 'full_access',
    containsPHI: true,
    studentId: 'student-123',
    studentName: 'John Smith',
    expiresAt: '2027-02-01',
    status: 'active',
    accessLog: [],
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-01T14:00:00Z',
  },
];

const SAMPLE_ACTIVITIES: ChannelActivity[] = [
  {
    id: 'activity-1',
    channelId: 'channel-1',
    type: 'request_created',
    title: 'Sports Clearance Request',
    description: 'Lincoln Middle School requested sports clearance for John Smith',
    actorId: 'nurse-1',
    actorName: 'Maria Thompson',
    actorType: 'school',
    relatedId: 'request-1',
    relatedType: 'request',
    createdAt: '2026-02-14T10:00:00Z',
  },
  {
    id: 'activity-2',
    channelId: 'channel-2',
    type: 'document_shared',
    title: 'Medical Excuse Shared',
    description: 'Dr. Sarah Chen shared medical excuse for Emily Johnson',
    actorId: 'provider-1',
    actorName: 'Dr. Sarah Chen',
    actorType: 'provider',
    relatedId: 'doc-1',
    relatedType: 'document',
    createdAt: '2026-02-14T09:15:00Z',
  },
  {
    id: 'activity-3',
    channelId: 'channel-2',
    type: 'request_updated',
    title: 'Request Status Updated',
    description: 'Medical excuse verification moved to In Review',
    actorId: 'provider-1',
    actorName: 'Dr. Sarah Chen',
    actorType: 'provider',
    relatedId: 'request-2',
    relatedType: 'request',
    createdAt: '2026-02-14T09:00:00Z',
  },
];

// ===========================================
// API Functions
// ===========================================

class SchoolHealthcareCoordinationApi {
  // ==================== Channel Management ====================

  async getProviderChannels(providerId: string): Promise<SchoolProviderChannel[]> {
    await this.simulateDelay();
    return SAMPLE_CHANNELS.filter(c => c.providerId === providerId);
  }

  async getChannelById(channelId: string): Promise<SchoolProviderChannel | null> {
    await this.simulateDelay();
    return SAMPLE_CHANNELS.find(c => c.id === channelId) || null;
  }

  async createChannelRequest(
    providerId: string,
    request: CreateChannelRequest
  ): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    console.log('Creating channel request:', { providerId, request });
    return {
      success: true,
      message: 'Connection request sent to school. They will be notified to complete the BAA process.',
    };
  }

  async updateChannelStatus(
    channelId: string,
    status: SchoolProviderChannel['status']
  ): Promise<SchoolProviderChannel> {
    await this.simulateDelay();
    const channel = SAMPLE_CHANNELS.find(c => c.id === channelId);
    if (!channel) throw new Error('Channel not found');
    channel.status = status;
    channel.updatedAt = new Date().toISOString();
    return channel;
  }

  // ==================== Request Management ====================

  async getProviderRequests(
    providerId: string,
    filters?: { status?: ActionRequest['status'][]; type?: ActionRequest['type'][] }
  ): Promise<ActionRequest[]> {
    await this.simulateDelay();
    const channelIds = SAMPLE_CHANNELS
      .filter(c => c.providerId === providerId)
      .map(c => c.id);

    let requests = SAMPLE_REQUESTS.filter(r => channelIds.includes(r.channelId));

    if (filters?.status?.length) {
      requests = requests.filter(r => filters.status!.includes(r.status));
    }
    if (filters?.type?.length) {
      requests = requests.filter(r => filters.type!.includes(r.type));
    }

    return requests;
  }

  async getRequestById(requestId: string): Promise<ActionRequest | null> {
    await this.simulateDelay();
    return SAMPLE_REQUESTS.find(r => r.id === requestId) || null;
  }

  async respondToRequest(payload: RespondToRequestPayload): Promise<ActionRequest> {
    await this.simulateDelay();
    const request = SAMPLE_REQUESTS.find(r => r.id === payload.requestId);
    if (!request) throw new Error('Request not found');

    request.status = payload.status === 'approved' ? 'approved' :
                     payload.status === 'denied' ? 'denied' : 'awaiting_info';
    request.responseNotes = payload.responseNotes;
    request.denialReason = payload.denialReason;
    if (payload.responseDocuments) {
      request.responseDocuments = payload.responseDocuments;
    }
    request.updatedAt = new Date().toISOString();
    if (request.status === 'approved' || request.status === 'denied') {
      request.completedAt = new Date().toISOString();
    }

    return request;
  }

  // ==================== Document Management ====================

  async getChannelDocuments(channelId: string): Promise<SharedDocument[]> {
    await this.simulateDelay();
    return SAMPLE_DOCUMENTS.filter(d => d.channelId === channelId);
  }

  async getProviderDocuments(providerId: string): Promise<SharedDocument[]> {
    await this.simulateDelay();
    const channelIds = SAMPLE_CHANNELS
      .filter(c => c.providerId === providerId)
      .map(c => c.id);
    return SAMPLE_DOCUMENTS.filter(d => channelIds.includes(d.channelId));
  }

  async shareDocument(
    providerId: string,
    request: ShareDocumentRequest
  ): Promise<SharedDocument> {
    await this.simulateDelay();
    const newDoc: SharedDocument = {
      id: `doc-${Date.now()}`,
      channelId: request.channelId,
      fileName: request.file.name,
      fileSize: request.file.size,
      mimeType: request.file.type,
      category: request.category,
      description: request.description,
      uploadedBy: providerId,
      uploadedByName: 'Provider',
      uploadedByType: 'provider',
      schoolAccess: request.schoolAccess,
      providerAccess: request.providerAccess,
      containsPHI: request.containsPHI,
      studentId: request.studentId,
      studentName: request.studentName,
      expiresAt: request.expiresAt,
      status: 'active',
      accessLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    SAMPLE_DOCUMENTS.push(newDoc);
    return newDoc;
  }

  async logDocumentAccess(
    documentId: string,
    userId: string,
    userName: string,
    userType: 'school' | 'provider',
    action: DocumentAccessLog['action']
  ): Promise<void> {
    await this.simulateDelay();
    const doc = SAMPLE_DOCUMENTS.find(d => d.id === documentId);
    if (doc) {
      doc.accessLog.push({
        id: `access-${Date.now()}`,
        documentId,
        userId,
        userName,
        userType,
        action,
        accessedAt: new Date().toISOString(),
      });
    }
  }

  async updateDocumentAccess(
    documentId: string,
    schoolAccess: SharedDocument['schoolAccess'],
    providerAccess: SharedDocument['providerAccess']
  ): Promise<SharedDocument> {
    await this.simulateDelay();
    const doc = SAMPLE_DOCUMENTS.find(d => d.id === documentId);
    if (!doc) throw new Error('Document not found');
    doc.schoolAccess = schoolAccess;
    doc.providerAccess = providerAccess;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  // ==================== Activity Feed ====================

  async getProviderActivity(
    providerId: string,
    limit = 20
  ): Promise<ChannelActivity[]> {
    await this.simulateDelay();
    const channelIds = SAMPLE_CHANNELS
      .filter(c => c.providerId === providerId)
      .map(c => c.id);
    return SAMPLE_ACTIVITIES
      .filter(a => channelIds.includes(a.channelId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // ==================== Statistics ====================

  async getProviderStats(providerId: string): Promise<SchoolCoordinationStats> {
    await this.simulateDelay();
    const channels = await this.getProviderChannels(providerId);
    const requests = await this.getProviderRequests(providerId);
    const documents = await this.getProviderDocuments(providerId);
    const activity = await this.getProviderActivity(providerId);

    return {
      connectedSchools: channels.filter(c => c.status === 'active').length,
      pendingRequests: requests.filter(r => r.status === 'pending' || r.status === 'in_review').length,
      sharedDocuments: documents.length,
      pendingConfirmations: 0, // Would be calculated from confirmations
      activeChannels: channels.filter(c => c.status === 'active').length,
      recentActivity: activity.filter(a => {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return new Date(a.createdAt) > dayAgo;
      }).length,
    };
  }

  // ==================== Helper ====================

  private async simulateDelay(ms = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const schoolHealthcareCoordinationApi = new SchoolHealthcareCoordinationApi();
