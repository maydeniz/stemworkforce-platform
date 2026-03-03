// ===========================================
// Counselor Applications Tab
// ===========================================
// View all student applications with readiness
// checking and counselor approval workflow
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckSquare,
  X,
  AlertCircle,
  Send,
  User
} from 'lucide-react';
import type {
  StudentApplication,
  ApplicationMetrics,
  ApplicationStatus,
  ApplicationType,
  SchoolTier,
  ApplicationChecklistItem
} from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

interface CounselorApplicationsTabProps {
  applications: StudentApplication[];
  metrics: ApplicationMetrics;
  onReviewApplication: (app: StudentApplication) => void;
  onApproveApplication: (appId: string) => void;
}

type FilterStatus = ApplicationStatus | 'all';
type FilterType = ApplicationType | 'all';

// ===========================================
// SAMPLE CHECKLIST DATA
// ===========================================

const generateSampleChecklist = (appStatus: ApplicationStatus): ApplicationChecklistItem[] => {
  const baseItems: ApplicationChecklistItem[] = [
    { id: '1', category: 'essay', title: 'Common App Personal Statement', status: 'submitted', verifiedByCounselor: true },
    { id: '2', category: 'essay', title: 'School-specific Essay 1', status: appStatus === 'ready_for_review' ? 'submitted' : 'in_progress' },
    { id: '3', category: 'essay', title: 'School-specific Essay 2', status: appStatus === 'counselor_approved' ? 'submitted' : 'pending' },
    { id: '4', category: 'recommendation', title: 'Teacher Rec #1 (Dr. Smith)', status: 'received', verifiedByCounselor: true },
    { id: '5', category: 'recommendation', title: 'Teacher Rec #2 (Ms. Johnson)', status: appStatus === 'in_progress' ? 'pending' : 'received' },
    { id: '6', category: 'recommendation', title: 'Counselor Recommendation', status: 'submitted' },
    { id: '7', category: 'transcript', title: 'High School Transcript', status: 'submitted', verifiedByCounselor: true },
    { id: '8', category: 'test', title: 'SAT/ACT Scores', status: 'submitted' },
    { id: '9', category: 'counselor_form', title: 'School Report Form', status: 'submitted' },
    { id: '10', category: 'financial', title: 'CSS Profile (if required)', status: appStatus === 'counselor_approved' ? 'submitted' : 'pending' }
  ];
  return baseItems;
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorApplicationsTab: React.FC<CounselorApplicationsTabProps> = ({
  applications,
  metrics,
  onReviewApplication,
  onApproveApplication
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | '7days' | '14days' | '30days'>('all');

  // UI State
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(query) ||
        a.schoolName.toLowerCase().includes(query)
      );
    }

    // Status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.applicationType === typeFilter);
    }

    // Deadline
    if (deadlineFilter !== 'all') {
      const now = new Date();
      const daysMap = { '7days': 7, '14days': 14, '30days': 30 };
      const days = daysMap[deadlineFilter];
      const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => new Date(a.deadline) <= cutoff);
    }

    // Sort by deadline
    filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return filtered;
  }, [applications, searchQuery, statusFilter, typeFilter, deadlineFilter]);

  const openReviewModal = (app: StudentApplication) => {
    // Add sample checklist if not present
    const appWithChecklist = {
      ...app,
      checklist: app.checklist.length > 0 ? app.checklist : generateSampleChecklist(app.status)
    };
    setSelectedApp(appWithChecklist);
    setShowReviewModal(true);
    onReviewApplication(app);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Application Tracker</h2>
          <p className="text-sm text-gray-400">
            {filteredApplications.length} applications • {metrics.readyForReview} awaiting review
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total"
          value={metrics.totalApplications}
          icon={FileText}
          color="purple"
        />
        <MetricCard
          label="Submitted"
          value={metrics.submitted}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          label="In Progress"
          value={metrics.inProgress}
          icon={Clock}
          color="amber"
        />
        <MetricCard
          label="Ready for Review"
          value={metrics.readyForReview}
          icon={Eye}
          color="blue"
          onClick={() => setStatusFilter('ready_for_review')}
          highlight={metrics.readyForReview > 0}
        />
        <MetricCard
          label="Approved"
          value={metrics.counselorApproved}
          icon={CheckSquare}
          color="emerald"
        />
        <MetricCard
          label="Due in 7 Days"
          value={metrics.upcomingDeadlines.next7Days}
          icon={AlertTriangle}
          color="red"
          onClick={() => setDeadlineFilter('7days')}
          highlight={metrics.upcomingDeadlines.next7Days > 0}
        />
      </div>

      {/* Balance Visualization */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Application Balance (Reach/Match/Safety)</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden flex">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${(metrics.byTier.reach / metrics.totalApplications) * 100}%` }}
              title={`Reach: ${metrics.byTier.reach}`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(metrics.byTier.match / metrics.totalApplications) * 100}%` }}
              title={`Match: ${metrics.byTier.match}`}
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(metrics.byTier.safety / metrics.totalApplications) * 100}%` }}
              title={`Safety: ${metrics.byTier.safety}`}
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-gray-400">Reach: {metrics.byTier.reach}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span className="text-gray-400">Match: {metrics.byTier.match}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500 rounded" />
              <span className="text-gray-400">Safety: {metrics.byTier.safety}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by student or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="ready_for_review">Ready for Review</option>
          <option value="counselor_approved">Approved</option>
          <option value="submitted">Submitted</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FilterType)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Types</option>
          <option value="EA">Early Action</option>
          <option value="ED">Early Decision</option>
          <option value="ED2">Early Decision II</option>
          <option value="REA">Restrictive EA</option>
          <option value="RD">Regular Decision</option>
        </select>

        {/* Deadline Filter */}
        <select
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value as typeof deadlineFilter)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Deadlines</option>
          <option value="7days">Next 7 Days</option>
          <option value="14days">Next 14 Days</option>
          <option value="30days">Next 30 Days</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.map((app, index) => (
          <ApplicationCard
            key={app.id}
            application={app}
            index={index}
            onReview={() => openReviewModal(app)}
          />
        ))}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No applications found matching your filters</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedApp && (
        <ApplicationReviewModal
          application={selectedApp}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedApp(null);
          }}
          onApprove={() => {
            onApproveApplication(selectedApp.id);
            setShowReviewModal(false);
            setSelectedApp(null);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// METRIC CARD
// ===========================================

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'purple' | 'emerald' | 'amber' | 'blue' | 'red' | 'pink';
  onClick?: () => void;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, color, onClick, highlight }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`${colorClasses[color]} border rounded-xl p-3 text-left transition-all ${
        onClick ? 'hover:opacity-80 cursor-pointer' : ''
      } ${highlight ? 'ring-2 ring-offset-2 ring-offset-gray-950' : ''}`}
    >
      <Icon className="w-5 h-5 mb-2" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </button>
  );
};

// ===========================================
// APPLICATION CARD
// ===========================================

interface ApplicationCardProps {
  application: StudentApplication;
  index: number;
  onReview: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application: app, index, onReview }) => {
  const statusConfig: Record<ApplicationStatus, { bg: string; label: string; icon: React.ElementType }> = {
    not_started: { bg: 'bg-gray-500/20 text-gray-400', label: 'Not Started', icon: Clock },
    in_progress: { bg: 'bg-amber-500/20 text-amber-400', label: 'In Progress', icon: Clock },
    ready_for_review: { bg: 'bg-blue-500/20 text-blue-400', label: 'Review', icon: Eye },
    counselor_approved: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Approved', icon: CheckCircle2 },
    submitted: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Submitted', icon: CheckCircle2 },
    complete: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Complete', icon: CheckCircle2 }
  };

  const tierConfig: Record<SchoolTier, { bg: string; label: string }> = {
    reach: { bg: 'bg-red-500/20 text-red-400', label: 'Reach' },
    match: { bg: 'bg-amber-500/20 text-amber-400', label: 'Match' },
    safety: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Safety' }
  };

  const typeConfig: Record<ApplicationType, { bg: string }> = {
    EA: { bg: 'bg-violet-500/20 text-violet-400' },
    ED: { bg: 'bg-pink-500/20 text-pink-400' },
    ED2: { bg: 'bg-pink-500/20 text-pink-400' },
    REA: { bg: 'bg-purple-500/20 text-purple-400' },
    RD: { bg: 'bg-blue-500/20 text-blue-400' }
  };

  const status = statusConfig[app.status];
  const tier = tierConfig[app.tier];
  const type = typeConfig[app.applicationType];
  const StatusIcon = status.icon;

  const daysUntilDeadline = Math.ceil(
    (new Date(app.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-gray-900 border rounded-xl p-4 transition-colors ${
        app.status === 'ready_for_review'
          ? 'border-blue-500/50 bg-blue-500/5'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* School Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{app.schoolName}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.bg}`}>
              {app.applicationType}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${tier.bg}`}>
              {tier.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {app.studentName}
            </span>
            <span>{app.schoolLocation}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="hidden md:block w-32">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{app.completionPercent}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                app.completionPercent === 100 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${app.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Deadline */}
        <div className={`text-center px-3 py-2 rounded-lg ${
          daysUntilDeadline <= 3 ? 'bg-red-500/20 text-red-400' :
          daysUntilDeadline <= 7 ? 'bg-amber-500/20 text-amber-400' :
          'bg-gray-800 text-gray-400'
        }`}>
          <div className="text-lg font-bold">{daysUntilDeadline}</div>
          <div className="text-xs">days</div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.bg}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>

        {/* Actions */}
        {app.status === 'ready_for_review' ? (
          <button
            onClick={onReview}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Review
          </button>
        ) : (
          <button
            onClick={onReview}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ===========================================
// APPLICATION REVIEW MODAL
// ===========================================

interface ApplicationReviewModalProps {
  application: StudentApplication;
  onClose: () => void;
  onApprove: () => void;
}

const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  application: app,
  onClose,
  onApprove
}) => {
  const [counselorNotes, setCounselorNotes] = useState(app.counselorNotes || '');
  const [checklist, setChecklist] = useState(app.checklist);

  const toggleVerification = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, verifiedByCounselor: !item.verifiedByCounselor }
          : item
      )
    );
  };

  const allVerified = checklist.every(
    item => item.status === 'submitted' || item.status === 'received' || item.verifiedByCounselor
  );

  const groupedChecklist = {
    essays: checklist.filter(i => i.category === 'essay'),
    supplements: checklist.filter(i => i.category === 'supplement'),
    recommendations: checklist.filter(i => i.category === 'recommendation'),
    documents: checklist.filter(i => ['transcript', 'test', 'financial', 'counselor_form'].includes(i.category))
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{app.schoolName}</h3>
              <p className="text-sm text-gray-400">
                {app.studentName} • {app.applicationType} • Due {new Date(app.deadline).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Progress Overview */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Application Progress</h4>
              <span className="text-2xl font-bold text-blue-400">{app.completionPercent}%</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${app.completionPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-4">
            <h4 className="font-medium text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              Application Checklist
            </h4>

            {Object.entries(groupedChecklist).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="bg-gray-800/30 rounded-xl p-4">
                  <h5 className="text-sm font-medium text-gray-400 mb-3 capitalize">
                    {category === 'documents' ? 'Tests & Documents' : category}
                  </h5>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ChecklistRow
                        key={item.id}
                        item={item}
                        onToggleVerify={() => toggleVerification(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Counselor Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Counselor Notes</label>
            <textarea
              value={counselorNotes}
              onChange={(e) => setCounselorNotes(e.target.value)}
              placeholder="Add notes for the student (optional)..."
              className="w-full h-24 p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          {!allVerified && (
            <div className="flex items-center gap-2 mb-4 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Some items are incomplete or not verified</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Back with Notes
              </button>
              <button
                onClick={onApprove}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Application
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// CHECKLIST ROW
// ===========================================

interface ChecklistRowProps {
  item: ApplicationChecklistItem;
  onToggleVerify: () => void;
}

const ChecklistRow: React.FC<ChecklistRowProps> = ({ item, onToggleVerify }) => {
  const statusConfig = {
    pending: { bg: 'bg-gray-500/20 text-gray-400', label: 'Pending' },
    in_progress: { bg: 'bg-amber-500/20 text-amber-400', label: 'In Progress' },
    submitted: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Submitted' },
    received: { bg: 'bg-emerald-500/20 text-emerald-400', label: 'Received' },
    verified: { bg: 'bg-blue-500/20 text-blue-400', label: 'Verified' }
  };

  const cfg = statusConfig[item.status];
  const isComplete = item.status === 'submitted' || item.status === 'received';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleVerify}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            item.verifiedByCounselor
              ? 'bg-purple-600 border-purple-600 text-white'
              : 'border-gray-600 hover:border-purple-500'
          }`}
        >
          {item.verifiedByCounselor && <CheckCircle2 className="w-3 h-3" />}
        </button>
        <span className={isComplete ? 'text-white' : 'text-gray-400'}>
          {item.title}
        </span>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${cfg.bg}`}>
        {cfg.label}
      </span>
    </div>
  );
};

export default CounselorApplicationsTab;
