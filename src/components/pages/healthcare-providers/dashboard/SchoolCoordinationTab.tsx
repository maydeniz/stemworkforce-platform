// ===========================================
// School Coordination Tab
// Healthcare Provider Dashboard - Schools Tab
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ChevronRight,
  School,
  Shield,
  Users,
  X,
  Upload,
  Eye,
  Activity,
  Calendar,
  MapPin,
  Search,
  Loader2,
  Send,
} from 'lucide-react';
import { schoolHealthcareCoordinationApi } from '@/services/schoolHealthcareCoordinationApi';
import type {
  SchoolProviderChannel,
  ActionRequest,
  SharedDocument,
  ChannelActivity,
  SchoolCoordinationStats,
  RequestStatus,
  RequestPriority,
} from '@/types/schoolHealthcareCoordination';

// ===========================================
// Types
// ===========================================

interface SchoolCoordinationTabProps {
  providerId: string;
}

// ===========================================
// Helper Functions
// ===========================================

const getPriorityColor = (priority: RequestPriority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500/20 text-red-400';
    case 'high': return 'bg-orange-500/20 text-orange-400';
    case 'normal': return 'bg-blue-500/20 text-blue-400';
    case 'low': return 'bg-gray-500/20 text-gray-400';
  }
};

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'pending':
    case 'in_review':
      return <Clock className="w-4 h-4 text-amber-400" />;
    case 'denied':
    case 'cancelled':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case 'awaiting_info':
      return <MessageSquare className="w-4 h-4 text-blue-400" />;
  }
};

const getStatusLabel = (status: RequestStatus) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_review': return 'In Review';
    case 'awaiting_info': return 'Awaiting Info';
    case 'approved': return 'Approved';
    case 'denied': return 'Denied';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
  }
};

const formatRequestType = (type: string) => {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// ===========================================
// Components
// ===========================================

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const RequestCard: React.FC<{
  request: ActionRequest;
  onRespond: (request: ActionRequest) => void;
}> = ({ request, onRespond }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getPriorityColor(request.priority)}`}>
          {request.priority}
        </span>
        <span className="text-xs text-gray-500">
          {formatRequestType(request.type)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {getStatusIcon(request.status)}
        <span className="text-xs text-gray-400">{getStatusLabel(request.status)}</span>
      </div>
    </div>

    <h4 className="font-semibold text-white mb-2">{request.title}</h4>

    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
      <span className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        {request.studentName}
      </span>
      {request.studentGrade && (
        <span className="flex items-center gap-1">
          <School className="w-4 h-4" />
          {request.studentGrade}
        </span>
      )}
    </div>

    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{request.description}</p>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>From: {request.requesterName}</span>
        {request.dueDate && (
          <>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due: {new Date(request.dueDate).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
      {(request.status === 'pending' || request.status === 'in_review') && (
        <button
          onClick={() => onRespond(request)}
          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors"
        >
          Respond
        </button>
      )}
    </div>
  </motion.div>
);

const DocumentCard: React.FC<{
  document: SharedDocument;
  onView: (doc: SharedDocument) => void;
}> = ({ document, onView }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
        <FileText className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{document.fileName}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{document.studentName || 'General'}</span>
          <span>•</span>
          <span>{new Date(document.createdAt).toLocaleDateString()}</span>
          {document.containsPHI && (
            <>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                PHI
              </span>
            </>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-0.5 rounded ${
        document.schoolAccess === 'full_access' ? 'bg-emerald-500/20 text-emerald-400' :
        document.schoolAccess === 'view_only' ? 'bg-blue-500/20 text-blue-400' :
        'bg-gray-500/20 text-gray-400'
      }`}>
        School: {document.schoolAccess.replace('_', ' ')}
      </span>
      <button
        onClick={() => onView(document)}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        title="View document"
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  </div>
);

const SchoolCard: React.FC<{
  channel: SchoolProviderChannel;
  onClick: () => void;
}> = ({ channel, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <School className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white">{channel.schoolName}</h4>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {channel.schoolAddress.split(',')[0]}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        channel.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
        channel.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
        'bg-gray-500/20 text-gray-400'
      }`}>
        {channel.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Authorized Users</p>
        <p className="text-lg font-semibold text-white">
          {channel.schoolAuthorizedUsers.length}
        </p>
      </div>
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">BAA Status</p>
        <p className="text-lg font-semibold text-white flex items-center gap-1">
          {channel.baaOnFile ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              On File
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Pending
            </>
          )}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {channel.documentSharingEnabled && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Documents enabled
          </span>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500" />
    </div>
  </motion.div>
);

const ActivityItem: React.FC<{ activity: ChannelActivity }> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'document_shared': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'request_created': return <Plus className="w-4 h-4 text-emerald-400" />;
      case 'request_updated': return <Activity className="w-4 h-4 text-amber-400" />;
      case 'request_completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">{activity.title}</p>
        <p className="text-xs text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-600 mt-1">
          {new Date(activity.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Response Modal Component
const ResponseModal: React.FC<{
  request: ActionRequest;
  onClose: () => void;
  onSubmit: (status: 'approved' | 'denied', notes: string) => void;
}> = ({ request, onClose, onSubmit }) => {
  const [status, setStatus] = useState<'approved' | 'denied'>('approved');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Respond to Request</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium text-white mb-1">{request.title}</h4>
            <p className="text-sm text-gray-400">{request.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Student: {request.studentName}</span>
              <span>From: {request.requesterName}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Decision</label>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus('approved')}
                className={`flex-1 p-3 rounded-lg border font-medium transition-all ${
                  status === 'approved'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                Approve
              </button>
              <button
                onClick={() => setStatus('denied')}
                className={`flex-1 p-3 rounded-lg border font-medium transition-all ${
                  status === 'denied'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <AlertCircle className="w-5 h-5 mx-auto mb-1" />
                Deny
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {status === 'approved' ? 'Notes (Optional)' : 'Reason for Denial'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              placeholder={status === 'approved' ? 'Add any notes for the school...' : 'Please provide a reason...'}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(status, notes)}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              status === 'approved'
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {status === 'approved' ? 'Approve Request' : 'Deny Request'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// Main Component
// ===========================================

const SchoolCoordinationTab: React.FC<SchoolCoordinationTabProps> = ({ providerId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SchoolCoordinationStats | null>(null);
  const [channels, setChannels] = useState<SchoolProviderChannel[]>([]);
  const [requests, setRequests] = useState<ActionRequest[]>([]);
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [activities, setActivities] = useState<ChannelActivity[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ActionRequest | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedSchoolChannel, setSelectedSchoolChannel] = useState<SchoolProviderChannel | null>(null);
  const [showShareDocumentModal, setShowShareDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);

  useEffect(() => {
    loadData();
  }, [providerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, channelsData, requestsData, documentsData, activityData] = await Promise.all([
        schoolHealthcareCoordinationApi.getProviderStats(providerId),
        schoolHealthcareCoordinationApi.getProviderChannels(providerId),
        schoolHealthcareCoordinationApi.getProviderRequests(providerId),
        schoolHealthcareCoordinationApi.getProviderDocuments(providerId),
        schoolHealthcareCoordinationApi.getProviderActivity(providerId),
      ]);

      setStats(statsData);
      setChannels(channelsData);
      setRequests(requestsData);
      setDocuments(documentsData);
      setActivities(activityData);
    } catch (error) {
      console.error('Error loading school coordination data:', error);
    }
    setLoading(false);
  };

  const handleRespondToRequest = async (status: 'approved' | 'denied', notes: string) => {
    if (!selectedRequest) return;

    try {
      await schoolHealthcareCoordinationApi.respondToRequest({
        requestId: selectedRequest.id,
        status,
        responseNotes: notes,
        denialReason: status === 'denied' ? notes : undefined,
      });
      await loadData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_review');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">School Coordination</h2>
          <p className="text-gray-400">Manage communications and documents with connected schools</p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Connect School
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Connected Schools"
            value={stats.connectedSchools}
            icon={School}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            label="Pending Requests"
            value={stats.pendingRequests}
            icon={Clock}
            color="bg-amber-500/20 text-amber-400"
          />
          <StatCard
            label="Shared Documents"
            value={stats.sharedDocuments}
            icon={FileText}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            label="Needs Response"
            value={pendingRequests.length}
            icon={MessageSquare}
            color="bg-purple-500/20 text-purple-400"
          />
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Pending Requests from Schools
            </h3>
            <span className="text-sm text-gray-400">{pendingRequests.length} awaiting response</span>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onRespond={setSelectedRequest}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Connected Schools */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Connected Schools ({channels.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <SchoolCard
                key={channel.id}
                channel={channel}
                onClick={() => setSelectedSchoolChannel(channel)}
              />
            ))}
          </div>
          {channels.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <School className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">No Connected Schools</h4>
              <p className="text-gray-400 mb-4">
                Connect with schools to start sharing documents and receiving requests.
              </p>
              <button
                onClick={() => setShowConnectModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
              >
                Connect Your First School
              </button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            Recent Activity
          </h3>
          <div className="divide-y divide-gray-800">
            {activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          {activities.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Recent Shared Documents */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Recent Shared Documents
          </h3>
          <button
            onClick={() => setShowShareDocumentModal(true)}
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <Upload className="w-4 h-4" />
            Share Document
          </button>
        </div>
        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={(d) => setSelectedDocument(d)}
            />
          ))}
        </div>
        {documents.length === 0 && (
          <p className="text-center text-gray-500 py-4">No shared documents yet</p>
        )}
      </div>

      {/* HIPAA Compliance Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-emerald-400 mb-1">HIPAA Compliant Communication</h4>
            <p className="text-sm text-emerald-300/80">
              All communications and documents shared through this platform are encrypted and logged
              for HIPAA compliance. Business Associate Agreements (BAAs) are required for each school connection.
            </p>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <ResponseModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onSubmit={handleRespondToRequest}
          />
        )}
      </AnimatePresence>

      {/* Connect School Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <ConnectSchoolModal
            providerId={providerId}
            onClose={() => setShowConnectModal(false)}
            onSuccess={() => {
              setShowConnectModal(false);
              loadData();
            }}
          />
        )}
      </AnimatePresence>

      {/* School Detail Modal */}
      <AnimatePresence>
        {selectedSchoolChannel && (
          <SchoolDetailModal
            channel={selectedSchoolChannel}
            onClose={() => setSelectedSchoolChannel(null)}
          />
        )}
      </AnimatePresence>

      {/* Share Document Modal */}
      <AnimatePresence>
        {showShareDocumentModal && (
          <ShareDocumentModal
            providerId={providerId}
            channels={channels}
            onClose={() => setShowShareDocumentModal(false)}
            onSuccess={() => {
              setShowShareDocumentModal(false);
              loadData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <DocumentViewerModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// Connect School Modal
// ===========================================

interface ConnectSchoolModalProps {
  providerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ConnectSchoolModal: React.FC<ConnectSchoolModalProps> = ({ providerId, onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<{ id: string; name: string; address: string } | null>(null);
  const [message, setMessage] = useState('');

  // Mock available schools
  const availableSchools = [
    { id: 'school-1', name: 'Lincoln Elementary School', address: '123 Main St, Springfield' },
    { id: 'school-2', name: 'Washington Middle School', address: '456 Oak Ave, Springfield' },
    { id: 'school-3', name: 'Jefferson High School', address: '789 Pine Rd, Springfield' },
    { id: 'school-4', name: 'Roosevelt Elementary', address: '321 Elm St, Springfield' },
    { id: 'school-5', name: 'Kennedy Middle School', address: '654 Maple Dr, Springfield' },
  ];

  const filteredSchools = availableSchools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async () => {
    if (!selectedSchool) return;
    setSubmitting(true);
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Connecting to school:', selectedSchool.id, 'Provider:', providerId, 'Message:', message);
      onSuccess();
    } catch (error) {
      console.error('Error connecting to school:', error);
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <School className="w-6 h-6 text-emerald-400" />
              Connect to School
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* School List */}
          <div className="space-y-2">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedSchool?.id === school.id
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <p className="font-medium text-white">{school.name}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {school.address}
                </p>
              </button>
            ))}
            {filteredSchools.length === 0 && (
              <p className="text-center text-gray-500 py-4">No schools found matching your search</p>
            )}
          </div>

          {/* Connection Message */}
          {selectedSchool && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Connection Request Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Introduce yourself and explain why you'd like to connect..."
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedSchool || submitting}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// School Detail Modal
// ===========================================

interface SchoolDetailModalProps {
  channel: SchoolProviderChannel;
  onClose: () => void;
}

const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ channel, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <School className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{channel.schoolName}</h3>
                <p className="text-sm text-gray-400">{channel.schoolAddress}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className={`font-semibold ${
                channel.status === 'active' ? 'text-emerald-400' :
                channel.status === 'pending' ? 'text-amber-400' : 'text-gray-400'
              }`}>
                {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
              </p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">BAA Status</p>
              <p className="font-semibold text-white flex items-center gap-1">
                {channel.baaOnFile ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    On File
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-400" />
                    Pending
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Authorized School Users</p>
            <div className="flex flex-wrap gap-2">
              {channel.schoolAuthorizedUsers.map((userId, index) => (
                <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                  User {index + 1}
                </span>
              ))}
              {channel.schoolAuthorizedUsers.length === 0 && (
                <span className="text-gray-500">No authorized users yet</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Features</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Document Sharing</span>
                <span className={channel.documentSharingEnabled ? 'text-emerald-400' : 'text-gray-500'}>
                  {channel.documentSharingEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Connected Since</span>
                <span className="text-gray-400">
                  {new Date(channel.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// Share Document Modal
// ===========================================

interface ShareDocumentModalProps {
  providerId: string;
  channels: SchoolProviderChannel[];
  onClose: () => void;
  onSuccess: () => void;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({ providerId, channels, onClose, onSuccess }) => {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [documentType, setDocumentType] = useState('medical_record');
  const [containsPHI, setContainsPHI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleSchool = (schoolId: string) => {
    setSelectedSchools(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const handleShare = async () => {
    if (selectedSchools.length === 0 || !fileName) return;
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sharing document:', { providerId, fileName, documentType, containsPHI, schools: selectedSchools });
      onSuccess();
    } catch (error) {
      console.error('Error sharing document:', error);
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-400" />
              Share Document
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Document Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Enter document name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="medical_record">Medical Record</option>
              <option value="excuse_letter">Excuse Letter</option>
              <option value="clearance_form">Clearance Form</option>
              <option value="screening_results">Screening Results</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <input
              type="checkbox"
              id="containsPHI"
              checked={containsPHI}
              onChange={(e) => setContainsPHI(e.target.checked)}
              className="w-5 h-5 text-amber-500 rounded border-gray-600 bg-gray-800 focus:ring-amber-500"
            />
            <label htmlFor="containsPHI" className="text-amber-300">
              This document contains Protected Health Information (PHI)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Share with Schools</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {channels.filter(c => c.status === 'active').map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => toggleSchool(channel.schoolId)}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                    selectedSchools.includes(channel.schoolId)
                      ? 'bg-blue-500/10 border-blue-500'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedSchools.includes(channel.schoolId)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedSchools.includes(channel.schoolId) && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-white">{channel.schoolName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedSchools.length === 0 || !fileName || submitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Share Document
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// Document Viewer Modal
// ===========================================

interface DocumentViewerModalProps {
  document: SharedDocument;
  onClose: () => void;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{document.fileName}</h3>
                <p className="text-sm text-gray-400">{(document.documentType || document.category || 'document').replace('_', ' ')}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Student</p>
              <p className="font-medium text-white">{document.studentName || 'General'}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">School Access</p>
              <p className="font-medium text-white">{document.schoolAccess.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Uploaded</p>
            <p className="text-white">{new Date(document.createdAt).toLocaleString()}</p>
          </div>

          {document.containsPHI && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-amber-400 font-medium">Contains PHI</p>
                <p className="text-sm text-amber-300/80">This document contains Protected Health Information</p>
              </div>
            </div>
          )}

          <div className="p-8 bg-gray-800/30 rounded-lg border border-dashed border-gray-700 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Document preview would appear here</p>
            <p className="text-sm text-gray-500">In production, this would display the actual document</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SchoolCoordinationTab;
