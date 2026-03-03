// ===========================================
// Counselor Caseload Tab
// ===========================================
// View and manage assigned students with status
// indicators, filters, and quick actions
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  X,
  Send,
  TrendingUp
} from 'lucide-react';
import type { CaseloadStudent, CaseloadMetrics, GradeLevel, StudentStatus } from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

interface CounselorCaseloadTabProps {
  students: CaseloadStudent[];
  metrics: CaseloadMetrics;
  onStudentSelect: (student: CaseloadStudent) => void;
  onSendNudge: (studentId: string) => void;
}

type SortField = 'name' | 'status' | 'deadline' | 'gpa' | 'progress';
type SortDirection = 'asc' | 'desc';

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorCaseloadTab: React.FC<CounselorCaseloadTabProps> = ({
  students,
  metrics,
  onStudentSelect,
  onSendNudge
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // UI State
  const [selectedStudent, setSelectedStudent] = useState<CaseloadStudent | null>(null);
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeStudent, setNudgeStudent] = useState<CaseloadStudent | null>(null);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter(s => s.gradeLevel === gradeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
          break;
        case 'status':
          const statusOrder = { critical: 0, needs_attention: 1, on_track: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'deadline':
          const aDeadline = a.daysUntilNextDeadline ?? 999;
          const bDeadline = b.daysUntilNextDeadline ?? 999;
          comparison = aDeadline - bDeadline;
          break;
        case 'gpa':
          comparison = (b.gpa ?? 0) - (a.gpa ?? 0);
          break;
        case 'progress':
          const aProgress = a.applicationsSubmitted / Math.max(a.collegeListCount, 1);
          const bProgress = b.applicationsSubmitted / Math.max(b.collegeListCount, 1);
          comparison = bProgress - aProgress;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, searchQuery, statusFilter, gradeFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const openNudgeModal = (student: CaseloadStudent) => {
    setNudgeStudent(student);
    setShowNudgeModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Student Caseload</h2>
          <p className="text-sm text-gray-400">
            {filteredStudents.length} of {students.length} students
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'all')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="needs_attention">Needs Attention</option>
            <option value="on_track">On Track</option>
          </select>

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as GradeLevel)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Grades</option>
            <option value="12">Grade 12</option>
            <option value="11">Grade 11</option>
            <option value="10">Grade 10</option>
            <option value="9">Grade 9</option>
          </select>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatusSummaryCard
          status="critical"
          count={metrics.byStatus.critical}
          label="Critical"
          description="Need immediate attention"
          onClick={() => setStatusFilter('critical')}
          active={statusFilter === 'critical'}
        />
        <StatusSummaryCard
          status="needs_attention"
          count={metrics.byStatus.needsAttention}
          label="Needs Attention"
          description="May need support"
          onClick={() => setStatusFilter('needs_attention')}
          active={statusFilter === 'needs_attention'}
        />
        <StatusSummaryCard
          status="on_track"
          count={metrics.byStatus.onTrack}
          label="On Track"
          description="Making good progress"
          onClick={() => setStatusFilter('on_track')}
          active={statusFilter === 'on_track'}
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Sort by:</span>
        {[
          { field: 'status' as SortField, label: 'Status' },
          { field: 'deadline' as SortField, label: 'Deadline' },
          { field: 'name' as SortField, label: 'Name' },
          { field: 'progress' as SortField, label: 'Progress' }
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              sortField === field
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {label}
            {sortField === field && (
              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filteredStudents.map((student, index) => (
          <StudentCard
            key={student.id}
            student={student}
            index={index}
            onSelect={() => {
              setSelectedStudent(student);
              onStudentSelect(student);
            }}
            onNudge={() => openNudgeModal(student)}
          />
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No students found matching your filters</p>
          </div>
        )}
      </div>

      {/* Student Detail Sidebar */}
      {selectedStudent && (
        <StudentDetailPanel
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onNudge={() => openNudgeModal(selectedStudent)}
        />
      )}

      {/* Nudge Modal */}
      {showNudgeModal && nudgeStudent && (
        <NudgeModal
          student={nudgeStudent}
          onClose={() => {
            setShowNudgeModal(false);
            setNudgeStudent(null);
          }}
          onSend={() => {
            onSendNudge(nudgeStudent.id);
            setShowNudgeModal(false);
            setNudgeStudent(null);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// STATUS SUMMARY CARD
// ===========================================

interface StatusSummaryCardProps {
  status: StudentStatus;
  count: number;
  label: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({
  status,
  count,
  label,
  description,
  onClick,
  active
}) => {
  const config = {
    critical: {
      icon: AlertTriangle,
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      activeBorder: 'border-red-500'
    },
    needs_attention: {
      icon: Clock,
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      activeBorder: 'border-amber-500'
    },
    on_track: {
      icon: CheckCircle2,
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      activeBorder: 'border-emerald-500'
    }
  };

  const cfg = config[status];
  const Icon = cfg.icon;

  return (
    <button
      onClick={onClick}
      className={`${cfg.bg} ${active ? cfg.activeBorder : cfg.border} border rounded-xl p-4 text-left transition-all hover:opacity-80 ${
        active ? 'ring-2 ring-offset-2 ring-offset-gray-950' : ''
      }`}
      style={active ? { ['--tw-ring-color' as string]: cfg.text.replace('text-', '') } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${cfg.text}`} />
        <span className={`text-2xl font-bold ${cfg.text}`}>{count}</span>
      </div>
      <p className="font-medium text-white">{label}</p>
      <p className={`text-xs ${cfg.text} opacity-80`}>{description}</p>
    </button>
  );
};

// ===========================================
// STUDENT CARD
// ===========================================

interface StudentCardProps {
  student: CaseloadStudent;
  index: number;
  onSelect: () => void;
  onNudge: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, index, onSelect, onNudge }) => {
  const statusConfig = {
    critical: { bg: 'bg-red-500', label: 'Critical', labelBg: 'bg-red-500/20 text-red-400' },
    needs_attention: { bg: 'bg-amber-500', label: 'Attention', labelBg: 'bg-amber-500/20 text-amber-400' },
    on_track: { bg: 'bg-emerald-500', label: 'On Track', labelBg: 'bg-emerald-500/20 text-emerald-400' }
  };

  const cfg = statusConfig[student.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className={`w-2 h-12 ${cfg.bg} rounded-full flex-shrink-0`} />

        {/* Avatar & Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 font-medium flex-shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white truncate">
                {student.firstName} {student.lastName}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${cfg.labelBg}`}>
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Grade {student.gradeLevel}</span>
              {student.gpa && <span>GPA: {student.gpa.toFixed(1)}</span>}
              {student.tags?.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="hidden md:flex items-center gap-6">
          {/* Applications */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-white font-medium">
              <FileText className="w-4 h-4 text-blue-400" />
              {student.applicationsSubmitted}/{student.collegeListCount}
            </div>
            <p className="text-xs text-gray-500">Apps</p>
          </div>

          {/* Essays */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-white font-medium">
              <FileText className="w-4 h-4 text-purple-400" />
              {student.essaysCompleted}/{student.essaysDrafted}
            </div>
            <p className="text-xs text-gray-500">Essays</p>
          </div>

          {/* Recs */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-white font-medium">
              <Mail className="w-4 h-4 text-amber-400" />
              {student.recLettersReceived}/{student.recLettersRequested}
            </div>
            <p className="text-xs text-gray-500">Recs</p>
          </div>

          {/* FAFSA */}
          <div className="text-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              student.fafsaCompleted ? 'bg-emerald-500/20 text-emerald-400' :
              student.fafsaStarted ? 'bg-amber-500/20 text-amber-400' :
              'bg-gray-800 text-gray-500'
            }`}>
              <DollarSign className="w-3 h-3" />
            </div>
            <p className="text-xs text-gray-500">FAFSA</p>
          </div>
        </div>

        {/* Deadline Warning */}
        {student.daysUntilNextDeadline !== undefined && student.daysUntilNextDeadline <= 7 && (
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            student.daysUntilNextDeadline <= 3
              ? 'bg-red-500/20 text-red-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {student.daysUntilNextDeadline}d
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNudge();
            }}
            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
            title="Send Nudge"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={onSelect}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="View Details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Counselor Notes (if present) */}
      {student.counselorNotes && (
        <div className="mt-3 pl-6 border-l-2 border-purple-500/30 ml-3">
          <p className="text-sm text-gray-400 italic">{student.counselorNotes}</p>
        </div>
      )}
    </motion.div>
  );
};

// ===========================================
// STUDENT DETAIL PANEL
// ===========================================

interface StudentDetailPanelProps {
  student: CaseloadStudent;
  onClose: () => void;
  onNudge: () => void;
}

const StudentDetailPanel: React.FC<StudentDetailPanelProps> = ({ student, onClose, onNudge }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Student Details</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Student Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 text-xl font-medium mx-auto mb-3">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <h2 className="text-xl font-bold text-white">
            {student.firstName} {student.lastName}
          </h2>
          <p className="text-gray-400">Grade {student.gradeLevel} • GPA: {student.gpa?.toFixed(2) || 'N/A'}</p>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={onNudge}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Nudge
          </button>
          <button
            onClick={() => {
              console.log(`[FERPA AUDIT] Scheduling meeting with ${student.firstName} ${student.lastName}`);
              alert(`Meeting scheduler would open for ${student.firstName} ${student.lastName}. Integration with school calendar system pending.`);
            }}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
          <h4 className="font-medium text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Application Progress
          </h4>

          <div className="space-y-3">
            <ProgressItem
              label="Applications"
              current={student.applicationsSubmitted}
              total={student.collegeListCount}
              color="blue"
            />
            <ProgressItem
              label="Essays Completed"
              current={student.essaysCompleted}
              total={student.essaysDrafted || student.essaysCompleted}
              color="purple"
            />
            <ProgressItem
              label="Rec Letters"
              current={student.recLettersReceived}
              total={student.recLettersRequested}
              color="amber"
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
          <h4 className="font-medium text-white">Key Milestones</h4>

          <ChecklistItem
            label="Test Scores Submitted"
            completed={student.testScoresSubmitted}
          />
          <ChecklistItem
            label="Transcript Requested"
            completed={student.transcriptRequested}
          />
          <ChecklistItem
            label="FAFSA Started"
            completed={student.fafsaStarted}
          />
          <ChecklistItem
            label="FAFSA Completed"
            completed={student.fafsaCompleted}
          />
        </div>

        {/* Notes */}
        {student.counselorNotes && (
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="font-medium text-white mb-2">Counselor Notes</h4>
            <p className="text-sm text-gray-400">{student.counselorNotes}</p>
          </div>
        )}

        {/* Activity */}
        <div className="text-sm text-gray-500">
          Last active: {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// PROGRESS ITEM
// ===========================================

interface ProgressItemProps {
  label: string;
  current: number;
  total: number;
  color: 'blue' | 'purple' | 'amber' | 'emerald';
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, current, total, color }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{current}/{total}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

// ===========================================
// CHECKLIST ITEM
// ===========================================

interface ChecklistItemProps {
  label: string;
  completed: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, completed }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
      completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-500'
    }`}>
      {completed ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current" />}
    </div>
    <span className={completed ? 'text-white' : 'text-gray-400'}>{label}</span>
  </div>
);

// ===========================================
// NUDGE MODAL
// ===========================================

interface NudgeModalProps {
  student: CaseloadStudent;
  onClose: () => void;
  onSend: (message: string) => void;
}

const NudgeModal: React.FC<NudgeModalProps> = ({ student, onClose, onSend }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  const templates = [
    { id: 'deadline', label: 'Deadline Reminder', preview: `Hi ${student.firstName}, just a reminder about your upcoming deadline...` },
    { id: 'missing', label: 'Missing Item', preview: `Hi ${student.firstName}, I noticed you're missing some items...` },
    { id: 'encouragement', label: 'Encouragement', preview: `Hi ${student.firstName}, great progress on your applications!` },
    { id: 'fafsa', label: 'FAFSA Reminder', preview: `Hi ${student.firstName}, don't forget to complete your FAFSA...` },
    { id: 'custom', label: 'Custom Message', preview: '' }
  ];

  const handleSend = () => {
    const message = selectedTemplate === 'custom' ? customMessage : templates.find(t => t.id === selectedTemplate)?.preview || '';
    onSend(message);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Send Nudge</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Send a message to {student.firstName} {student.lastName}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select Template</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview/Editor */}
          {selectedTemplate && (
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {selectedTemplate === 'custom' ? 'Your Message' : 'Message Preview'}
              </label>
              <textarea
                value={selectedTemplate === 'custom' ? customMessage : templates.find(t => t.id === selectedTemplate)?.preview || ''}
                onChange={(e) => selectedTemplate === 'custom' && setCustomMessage(e.target.value)}
                readOnly={selectedTemplate !== 'custom'}
                placeholder="Type your message..."
                className={`w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none ${
                  selectedTemplate !== 'custom' ? 'opacity-70' : ''
                }`}
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!selectedTemplate || (selectedTemplate === 'custom' && !customMessage)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Nudge
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselorCaseloadTab;
