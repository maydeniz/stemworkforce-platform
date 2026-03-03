// ===========================================
// Counselor Tasks Tab
// ===========================================
// Task management with nudge system, action items,
// and deadline tracking
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Send,
  X,
  Edit,
  MessageSquare,
  Bell,
  School
} from 'lucide-react';
import type { CounselorTask, TaskType, TaskPriority, TaskStatus } from '@/types/counselor';

// ===========================================
// TYPES
// ===========================================

interface CounselorTasksTabProps {
  tasks: CounselorTask[];
  onCompleteTask: (taskId: string) => void;
  onCreateTask: () => void;
  onSendNudge: (studentId: string) => void;
}

// ===========================================
// SAMPLE ADDITIONAL TASKS
// ===========================================

const ADDITIONAL_SAMPLE_TASKS: CounselorTask[] = [
  {
    id: 'task-4',
    counselorId: 'counselor-1',
    studentId: 'student-1',
    studentName: 'Emily Chen',
    type: 'review_application',
    title: 'Review MIT application',
    description: 'Student marked as ready for review',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-15',
    relatedSchoolName: 'MIT',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: 'task-5',
    counselorId: 'counselor-1',
    type: 'send_transcript',
    title: 'Send transcripts batch',
    description: '15 transcript requests pending',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-18',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  },
  {
    id: 'task-6',
    counselorId: 'counselor-1',
    studentId: 'student-4',
    studentName: 'Aiden Patel',
    type: 'meeting_scheduled',
    title: 'College decision meeting',
    description: 'Discuss final college decision',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-12',
    completedAt: '2024-01-12T14:00:00Z',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const CounselorTasksTab: React.FC<CounselorTasksTabProps> = ({
  tasks,
  onCompleteTask,
  onCreateTask,
  onSendNudge
}) => {
  // Combine sample tasks
  const allTasks = [...tasks, ...ADDITIONAL_SAMPLE_TASKS];

  // Filters
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Sort by priority then due date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return filtered;
  }, [allTasks, statusFilter, priorityFilter, typeFilter]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => ({
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  }), [filteredTasks]);

  // Counts
  const urgentCount = allTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const overdueCount = allTasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Tasks & Action Items</h2>
          <p className="text-sm text-gray-400">
            {allTasks.filter(t => t.status !== 'completed').length} pending tasks
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            onCreateTask();
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Alert Banners */}
      {(urgentCount > 0 || overdueCount > 0) && (
        <div className="flex flex-wrap gap-4">
          {urgentCount > 0 && (
            <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-white font-medium">{urgentCount} urgent task{urgentCount > 1 ? 's' : ''}</p>
                <p className="text-sm text-red-300">Require immediate attention</p>
              </div>
            </div>
          )}
          {overdueCount > 0 && (
            <div className="flex-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-white font-medium">{overdueCount} overdue task{overdueCount > 1 ? 's' : ''}</p>
                <p className="text-sm text-amber-300">Past due date</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Types</option>
          <option value="rec_letter_due">Rec Letter</option>
          <option value="review_application">Review Application</option>
          <option value="send_transcript">Send Transcript</option>
          <option value="meeting_scheduled">Meeting</option>
          <option value="follow_up">Follow Up</option>
          <option value="deadline_check">Deadline Check</option>
        </select>
      </div>

      {/* Task Columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pending */}
        <TaskColumn
          title="To Do"
          tasks={tasksByStatus.pending}
          onComplete={onCompleteTask}
          onSelect={() => {}}
          color="amber"
        />

        {/* In Progress */}
        <TaskColumn
          title="In Progress"
          tasks={tasksByStatus.in_progress}
          onComplete={onCompleteTask}
          onSelect={() => {}}
          color="blue"
        />

        {/* Completed */}
        <TaskColumn
          title="Completed"
          tasks={tasksByStatus.completed}
          onComplete={onCompleteTask}
          onSelect={() => {}}
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="font-medium text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          Quick Nudge Actions
        </h4>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton
            icon={MessageSquare}
            label="Deadline Reminder"
            description="Send to students with deadlines in 7 days"
            onClick={() => {
              onSendNudge('bulk-deadline');
              alert('Deadline reminders will be sent to all students with deadlines in the next 7 days.');
            }}
          />
          <QuickActionButton
            icon={Send}
            label="FAFSA Reminder"
            description="Remind students who haven't started"
            onClick={() => {
              onSendNudge('bulk-fafsa');
              alert('FAFSA reminders will be sent to students who haven\'t started their applications.');
            }}
          />
          <QuickActionButton
            icon={AlertTriangle}
            label="Missing Items"
            description="Alert students with incomplete apps"
            onClick={() => {
              onSendNudge('bulk-missing');
              alert('Missing item alerts will be sent to students with incomplete applications.');
            }}
          />
          <QuickActionButton
            icon={CheckCircle2}
            label="Encouragement"
            description="Send to students making progress"
            onClick={() => {
              onSendNudge('bulk-encouragement');
              alert('Encouragement messages will be sent to students making good progress.');
            }}
          />
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(task) => {
            console.log('Create task:', task);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// TASK COLUMN
// ===========================================

interface TaskColumnProps {
  title: string;
  tasks: CounselorTask[];
  onComplete: (taskId: string) => void;
  onSelect: (task: CounselorTask) => void;
  color: 'amber' | 'blue' | 'emerald';
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, onComplete, onSelect, color }) => {
  const colorClasses = {
    amber: 'border-amber-500/30 bg-amber-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5'
  };

  return (
    <div className={`border rounded-xl ${colorClasses[color]}`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">{title}</h3>
          <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onComplete={() => onComplete(task.id)}
            onSelect={() => onSelect(task)}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">No tasks</p>
        )}
      </div>
    </div>
  );
};

// ===========================================
// TASK CARD
// ===========================================

interface TaskCardProps {
  task: CounselorTask;
  index: number;
  onComplete: () => void;
  onSelect: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onComplete }) => {
  const priorityConfig: Record<TaskPriority, { bg: string; label: string }> = {
    urgent: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Urgent' },
    high: { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'High' },
    medium: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Medium' },
    low: { bg: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Low' }
  };

  const typeConfig: Record<TaskType, { icon: React.ElementType; label: string }> = {
    rec_letter_due: { icon: Edit, label: 'Rec Letter' },
    meeting_scheduled: { icon: Calendar, label: 'Meeting' },
    review_application: { icon: CheckSquare, label: 'Review' },
    send_transcript: { icon: Send, label: 'Transcript' },
    follow_up: { icon: MessageSquare, label: 'Follow Up' },
    deadline_check: { icon: Clock, label: 'Deadline' },
    other: { icon: CheckSquare, label: 'Task' }
  };

  const priority = priorityConfig[task.priority];
  const type = typeConfig[task.type];
  const TypeIcon = type.icon;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors ${
        isOverdue ? 'border-red-500/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onComplete}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
            task.status === 'completed'
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-gray-600 hover:border-purple-500'
          }`}
        >
          {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">{type.label}</span>
          </div>

          <h4 className={`font-medium mb-1 ${
            task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'
          }`}>
            {task.title}
          </h4>

          {task.description && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {/* Student */}
            {task.studentName && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3 h-3" />
                {task.studentName}
              </span>
            )}

            {/* School */}
            {task.relatedSchoolName && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <School className="w-3 h-3" />
                {task.relatedSchoolName}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-400' : 'text-gray-500'
              }`}>
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Priority Badge */}
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priority.bg}`}>
          {priority.label}
        </span>
      </div>
    </motion.div>
  );
};

// ===========================================
// QUICK ACTION BUTTON
// ===========================================

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-left transition-colors group"
  >
    <Icon className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
    <h5 className="font-medium text-white text-sm">{label}</h5>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </button>
);

// ===========================================
// CREATE TASK MODAL
// ===========================================

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (task: Partial<CounselorTask>) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('other');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    onCreate({
      title,
      description,
      type,
      priority,
      dueDate: dueDate || undefined,
      status: 'pending'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Create New Task</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              className="w-full h-20 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="rec_letter_due">Rec Letter</option>
                <option value="review_application">Review Application</option>
                <option value="send_transcript">Send Transcript</option>
                <option value="meeting_scheduled">Meeting</option>
                <option value="follow_up">Follow Up</option>
                <option value="deadline_check">Deadline Check</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselorTasksTab;
