// ===========================================
// Counselor Messages Tab
// ===========================================
// Communication hub for nudges and messages
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Clock,
  CheckCircle2,
  Eye,
  Mail,
  ChevronRight,
  Plus
} from 'lucide-react';
import type { CounselorNudge, NudgeType, NudgeStatus } from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

interface CounselorMessagesTabProps {
  counselorId: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_NUDGES: CounselorNudge[] = [
  {
    id: 'nudge-1',
    counselorId: 'counselor-1',
    studentId: 'student-1',
    studentName: 'Emily Chen',
    type: 'deadline_reminder',
    subject: 'Reminder: MIT deadline in 3 days',
    message: 'Hi Emily, just a reminder that your MIT application is due on January 15th...',
    sentAt: '2024-01-12T10:30:00Z',
    deliveredAt: '2024-01-12T10:30:05Z',
    readAt: '2024-01-12T11:45:00Z',
    status: 'read',
    relatedSchoolName: 'MIT',
    relatedDeadline: '2024-01-15'
  },
  {
    id: 'nudge-2',
    counselorId: 'counselor-1',
    studentId: 'student-2',
    studentName: 'Marcus Johnson',
    type: 'missing_item',
    subject: 'Action Required: Missing transcript request',
    message: 'Hi Marcus, I noticed you haven\'t requested your transcript yet...',
    sentAt: '2024-01-11T14:20:00Z',
    deliveredAt: '2024-01-11T14:20:03Z',
    status: 'delivered'
  },
  {
    id: 'nudge-3',
    counselorId: 'counselor-1',
    studentId: 'student-3',
    studentName: 'Sophia Williams',
    type: 'action_required',
    subject: 'URGENT: EA deadline missed - Let\'s discuss RD strategy',
    message: 'Hi Sophia, I see that the Early Action deadline has passed. Let\'s schedule a meeting...',
    sentAt: '2024-01-10T09:00:00Z',
    deliveredAt: '2024-01-10T09:00:02Z',
    readAt: '2024-01-10T16:30:00Z',
    actionTakenAt: '2024-01-11T10:00:00Z',
    status: 'action_taken',
    studentResponse: 'Thank you, I scheduled a meeting for tomorrow.'
  },
  {
    id: 'nudge-4',
    counselorId: 'counselor-1',
    studentId: 'student-4',
    studentName: 'Aiden Patel',
    type: 'encouragement',
    subject: 'Great progress on your applications!',
    message: 'Hi Aiden, I wanted to recognize the excellent work you\'ve done on your applications...',
    sentAt: '2024-01-09T11:00:00Z',
    deliveredAt: '2024-01-09T11:00:04Z',
    readAt: '2024-01-09T12:15:00Z',
    status: 'read'
  },
  {
    id: 'nudge-5',
    counselorId: 'counselor-1',
    studentId: 'student-5',
    studentName: 'Jasmine Rodriguez',
    type: 'fafsa_reminder',
    subject: 'Don\'t forget: FAFSA deadline approaching',
    message: 'Hi Jasmine, this is a reminder to start your FAFSA application...',
    sentAt: '2024-01-08T15:45:00Z',
    status: 'sent'
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorMessagesTab: React.FC<CounselorMessagesTabProps> = ({ counselorId }) => {
  const [nudges] = useState<CounselorNudge[]>(SAMPLE_NUDGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<NudgeType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<NudgeStatus | 'all'>('all');
  const [selectedNudge, setSelectedNudge] = useState<CounselorNudge | null>(null);

  // Filter nudges
  const filteredNudges = nudges.filter(nudge => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!nudge.studentName.toLowerCase().includes(query) &&
          !nudge.subject.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (typeFilter !== 'all' && nudge.type !== typeFilter) return false;
    if (statusFilter !== 'all' && nudge.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const stats = {
    total: nudges.length,
    sent: nudges.filter(n => n.status === 'sent').length,
    delivered: nudges.filter(n => n.status === 'delivered').length,
    read: nudges.filter(n => n.status === 'read').length,
    actionTaken: nudges.filter(n => n.status === 'action_taken').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Messages & Nudges</h2>
          <p className="text-sm text-gray-400">Track communications with students</p>
        </div>

        <button
          onClick={() => {
            console.log(`[FERPA AUDIT] New message initiated by counselor: ${counselorId}`);
            alert('New message feature - select a student from the Caseload tab to send a message.');
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Sent" value={stats.total} icon={Send} color="purple" />
        <StatCard label="Pending" value={stats.sent} icon={Clock} color="gray" />
        <StatCard label="Delivered" value={stats.delivered} icon={Mail} color="blue" />
        <StatCard label="Read" value={stats.read} icon={Eye} color="amber" />
        <StatCard label="Action Taken" value={stats.actionTaken} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by student or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as NudgeType | 'all')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Types</option>
          <option value="deadline_reminder">Deadline Reminder</option>
          <option value="missing_item">Missing Item</option>
          <option value="encouragement">Encouragement</option>
          <option value="action_required">Action Required</option>
          <option value="fafsa_reminder">FAFSA Reminder</option>
          <option value="meeting_request">Meeting Request</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as NudgeStatus | 'all')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Status</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="read">Read</option>
          <option value="action_taken">Action Taken</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredNudges.map((nudge, index) => (
          <NudgeCard
            key={nudge.id}
            nudge={nudge}
            index={index}
            onClick={() => setSelectedNudge(nudge)}
          />
        ))}

        {filteredNudges.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages found</p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedNudge && (
        <NudgeDetailModal
          nudge={selectedNudge}
          onClose={() => setSelectedNudge(null)}
        />
      )}
    </div>
  );
};

// ===========================================
// STAT CARD
// ===========================================

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'purple' | 'gray' | 'blue' | 'amber' | 'emerald';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    gray: 'bg-gray-500/20 text-gray-400',
    blue: 'bg-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-4`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

// ===========================================
// NUDGE CARD
// ===========================================

interface NudgeCardProps {
  nudge: CounselorNudge;
  index: number;
  onClick: () => void;
}

const NudgeCard: React.FC<NudgeCardProps> = ({ nudge, index, onClick }) => {
  const typeConfig: Record<NudgeType, { bg: string; label: string }> = {
    deadline_reminder: { bg: 'bg-amber-500/20 text-amber-400', label: 'Deadline' },
    missing_item: { bg: 'bg-red-500/20 text-red-400', label: 'Missing Item' },
    encouragement: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Encouragement' },
    action_required: { bg: 'bg-red-500/20 text-red-400', label: 'Action Required' },
    fafsa_reminder: { bg: 'bg-blue-500/20 text-blue-400', label: 'FAFSA' },
    meeting_request: { bg: 'bg-purple-500/20 text-purple-400', label: 'Meeting' },
    general: { bg: 'bg-gray-500/20 text-gray-400', label: 'General' }
  };

  const statusConfig: Record<NudgeStatus, { icon: React.ElementType; label: string; color: string }> = {
    sent: { icon: Send, label: 'Sent', color: 'text-gray-400' },
    delivered: { icon: Mail, label: 'Delivered', color: 'text-blue-400' },
    read: { icon: Eye, label: 'Read', color: 'text-amber-400' },
    action_taken: { icon: CheckCircle2, label: 'Action Taken', color: 'text-emerald-400' }
  };

  const type = typeConfig[nudge.type];
  const status = statusConfig[nudge.status];
  const StatusIcon = status.icon;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 font-medium flex-shrink-0">
          {nudge.studentName.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{nudge.studentName}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.bg}`}>
              {type.label}
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-2 truncate">{nudge.subject}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(nudge.sentAt)}
            </span>
            <span className={`flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Response indicator */}
        {nudge.studentResponse && (
          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
            Replied
          </div>
        )}

        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </motion.button>
  );
};

// ===========================================
// NUDGE DETAIL MODAL
// ===========================================

interface NudgeDetailModalProps {
  nudge: CounselorNudge;
  onClose: () => void;
}

const NudgeDetailModal: React.FC<NudgeDetailModalProps> = ({ nudge, onClose }) => {
  const typeConfig: Record<NudgeType, { bg: string; label: string }> = {
    deadline_reminder: { bg: 'bg-amber-500/20 text-amber-400', label: 'Deadline Reminder' },
    missing_item: { bg: 'bg-red-500/20 text-red-400', label: 'Missing Item' },
    encouragement: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Encouragement' },
    action_required: { bg: 'bg-red-500/20 text-red-400', label: 'Action Required' },
    fafsa_reminder: { bg: 'bg-blue-500/20 text-blue-400', label: 'FAFSA Reminder' },
    meeting_request: { bg: 'bg-purple-500/20 text-purple-400', label: 'Meeting Request' },
    general: { bg: 'bg-gray-500/20 text-gray-400', label: 'General' }
  };

  const type = typeConfig[nudge.type];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 font-medium">
                {nudge.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-medium text-white">{nudge.studentName}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.bg}`}>
                  {type.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">{nudge.subject}</h4>
            <p className="text-gray-400 whitespace-pre-wrap">{nudge.message}</p>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
            <h5 className="text-sm font-medium text-gray-400">Delivery Timeline</h5>

            <TimelineItem
              icon={Send}
              label="Sent"
              time={nudge.sentAt}
              active
            />
            {nudge.deliveredAt && (
              <TimelineItem
                icon={Mail}
                label="Delivered"
                time={nudge.deliveredAt}
                active
              />
            )}
            {nudge.readAt && (
              <TimelineItem
                icon={Eye}
                label="Read"
                time={nudge.readAt}
                active
              />
            )}
            {nudge.actionTakenAt && (
              <TimelineItem
                icon={CheckCircle2}
                label="Action Taken"
                time={nudge.actionTakenAt}
                active
              />
            )}
          </div>

          {/* Student Response */}
          {nudge.studentResponse && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <h5 className="text-sm font-medium text-emerald-400 mb-2">Student Response</h5>
              <p className="text-gray-300">{nudge.studentResponse}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
            Send Follow-up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// TIMELINE ITEM
// ===========================================

interface TimelineItemProps {
  icon: React.ElementType;
  label: string;
  time: string;
  active: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ icon: Icon, label, time, active }) => {
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        active ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-500'
      }`}>
        <Icon className="w-3 h-3" />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
      <span className="text-xs text-gray-500 ml-auto">{formatDateTime(time)}</span>
    </div>
  );
};

export default CounselorMessagesTab;
