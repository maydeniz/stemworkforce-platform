// ===========================================
// Performance Section - Staff Management
// ===========================================
// Goals, review cycles, 360 feedback, development plans
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  TrendingUp,
  Star,
  ChevronRight,
  Plus,
  CheckCircle2,
  MessageSquare,
  XCircle
} from 'lucide-react';
import type { PerformanceGoal, ReviewCycle, GoalStatus, ReviewCycleStatus } from '@/types/staffManagement';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_GOALS: PerformanceGoal[] = [
  {
    id: 'goal-1',
    staffId: 'staff-1',
    staffName: 'Sarah Chen',
    title: 'Launch Platform V2.0',
    description: 'Lead the development and launch of the new platform version with improved performance and features.',
    category: 'professional',
    startDate: '2025-01-01',
    targetDate: '2025-06-30',
    status: 'in_progress',
    progressPercent: 45,
    keyResults: [
      { id: 'kr-1', description: 'Complete backend API redesign', target: 100, current: 80, unit: '%', completed: false },
      { id: 'kr-2', description: 'Achieve 99.9% uptime', target: 99.9, current: 99.95, unit: '%', completed: true },
      { id: 'kr-3', description: 'Reduce page load time', target: 2, current: 2.5, unit: 'seconds', completed: false }
    ],
    reviewCycleId: 'cycle-1',
    managerId: 'staff-mgr'
  },
  {
    id: 'goal-2',
    staffId: 'staff-2',
    staffName: 'Michael Torres',
    title: 'Improve Test Coverage',
    description: 'Increase unit test coverage across all modules and implement E2E testing.',
    category: 'technical',
    startDate: '2025-01-01',
    targetDate: '2025-03-31',
    status: 'in_progress',
    progressPercent: 70,
    keyResults: [
      { id: 'kr-4', description: 'Unit test coverage', target: 80, current: 72, unit: '%', completed: false },
      { id: 'kr-5', description: 'E2E test scenarios', target: 50, current: 35, unit: 'scenarios', completed: false }
    ],
    reviewCycleId: 'cycle-1'
  },
  {
    id: 'goal-3',
    staffId: 'staff-3',
    staffName: 'Emily Rodriguez',
    title: 'Mentor Junior Developers',
    description: 'Provide mentorship and guidance to new team members.',
    category: 'leadership',
    startDate: '2025-01-01',
    targetDate: '2025-12-31',
    status: 'in_progress',
    progressPercent: 25,
    keyResults: [
      { id: 'kr-6', description: 'Weekly 1:1 sessions', target: 48, current: 4, unit: 'sessions', completed: false },
      { id: 'kr-7', description: 'Mentee promotions', target: 2, current: 0, unit: 'people', completed: false }
    ],
    reviewCycleId: 'cycle-1'
  }
];

const SAMPLE_REVIEW_CYCLES: ReviewCycle[] = [
  {
    id: 'cycle-1',
    name: 'Q1 2025 Performance Review',
    cycleType: 'quarterly',
    periodStart: '2025-01-01',
    periodEnd: '2025-03-31',
    selfReviewDue: '2025-03-15',
    managerReviewDue: '2025-03-25',
    calibrationDate: '2025-03-28',
    finalizationDate: '2025-03-31',
    status: 'active',
    reviewTemplate: [],
    ratingScale: [
      { value: 5, label: 'Exceptional', description: 'Consistently exceeds expectations' },
      { value: 4, label: 'Exceeds', description: 'Often exceeds expectations' },
      { value: 3, label: 'Meets', description: 'Meets expectations' },
      { value: 2, label: 'Needs Improvement', description: 'Below expectations' },
      { value: 1, label: 'Unsatisfactory', description: 'Significantly below expectations' }
    ]
  },
  {
    id: 'cycle-2',
    name: 'Annual Review 2024',
    cycleType: 'annual',
    periodStart: '2024-01-01',
    periodEnd: '2024-12-31',
    selfReviewDue: '2024-12-15',
    managerReviewDue: '2024-12-22',
    calibrationDate: '2024-12-28',
    finalizationDate: '2024-12-31',
    status: 'completed',
    reviewTemplate: [],
    ratingScale: []
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const PerformanceSection: React.FC = () => {
  const [goals] = useState<PerformanceGoal[]>(SAMPLE_GOALS);
  const [reviewCycles] = useState<ReviewCycle[]>(SAMPLE_REVIEW_CYCLES);
  const [activeView, setActiveView] = useState<'goals' | 'reviews' | 'feedback'>('goals');
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState<ReviewCycle | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Metrics
  const metrics = {
    activeGoals: goals.filter(g => g.status === 'in_progress').length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    avgProgress: Math.round(goals.reduce((sum, g) => sum + g.progressPercent, 0) / goals.length),
    activeReviews: reviewCycles.filter(r => r.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Performance Management</h2>
          <p className="text-sm text-gray-400">Track goals, reviews, and development</p>
        </div>
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Target} label="Active Goals" value={metrics.activeGoals} color="emerald" />
        <MetricCard icon={CheckCircle2} label="Completed" value={metrics.completedGoals} color="blue" />
        <MetricCard icon={TrendingUp} label="Avg Progress" value={`${metrics.avgProgress}%`} color="purple" />
        <MetricCard icon={Star} label="Active Reviews" value={metrics.activeReviews} color="amber" />
      </div>

      {/* View Toggle */}
      <div className="flex bg-slate-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveView('goals')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'goals' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Goals & OKRs
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'reviews' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Review Cycles
        </button>
        <button
          onClick={() => setActiveView('feedback')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'feedback' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          360 Feedback
        </button>
      </div>

      {activeView === 'goals' && (
        <GoalsView goals={goals} onSelectGoal={setSelectedGoal} />
      )}

      {activeView === 'reviews' && (
        <ReviewsView reviewCycles={reviewCycles} onViewReviews={setShowReviewsModal} />
      )}

      {activeView === 'feedback' && (
        <FeedbackView onStartFeedback={() => setShowFeedbackModal(true)} />
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetailModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      )}

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <NewGoalModal onClose={() => setShowNewGoalModal(false)} />
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <ReviewsDetailModal cycle={showReviewsModal} onClose={() => setShowReviewsModal(null)} />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackCollectionModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
};

// ===========================================
// METRIC CARD
// ===========================================

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

// ===========================================
// GOALS VIEW
// ===========================================

interface GoalsViewProps {
  goals: PerformanceGoal[];
  onSelectGoal: (goal: PerformanceGoal) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, onSelectGoal }) => {
  const statusConfig: Record<GoalStatus, { label: string; bg: string }> = {
    not_started: { label: 'Not Started', bg: 'bg-slate-500/20 text-slate-400' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-500/20 text-blue-400' },
    completed: { label: 'Completed', bg: 'bg-emerald-500/20 text-emerald-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-500/20 text-red-400' }
  };

  const categoryConfig: Record<string, { label: string; color: string }> = {
    professional: { label: 'Professional', color: 'text-blue-400' },
    technical: { label: 'Technical', color: 'text-purple-400' },
    leadership: { label: 'Leadership', color: 'text-amber-400' },
    personal: { label: 'Personal', color: 'text-emerald-400' }
  };

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const cfg = statusConfig[goal.status];
        const catCfg = categoryConfig[goal.category];
        const completedKRs = goal.keyResults.filter(kr => kr.completed).length;

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
            onClick={() => onSelectGoal(goal)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${cfg.bg}`}>
                    {cfg.label}
                  </span>
                  <span className={`text-xs ${catCfg.color}`}>{catCfg.label}</span>
                </div>

                <p className="text-sm text-gray-400 mb-4">{goal.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{goal.progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {completedKRs}/{goal.keyResults.length} Key Results
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                  <span>{goal.staffName}</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ===========================================
// REVIEWS VIEW
// ===========================================

interface ReviewsViewProps {
  reviewCycles: ReviewCycle[];
  onViewReviews: (cycle: ReviewCycle) => void;
}

const ReviewsView: React.FC<ReviewsViewProps> = ({ reviewCycles, onViewReviews }) => {
  const statusConfig: Record<ReviewCycleStatus, { label: string; bg: string }> = {
    draft: { label: 'Draft', bg: 'bg-slate-500/20 text-slate-400' },
    active: { label: 'Active', bg: 'bg-emerald-500/20 text-emerald-400' },
    in_calibration: { label: 'In Calibration', bg: 'bg-amber-500/20 text-amber-400' },
    completed: { label: 'Completed', bg: 'bg-blue-500/20 text-blue-400' }
  };

  return (
    <div className="space-y-4">
      {reviewCycles.map((cycle) => {
        const cfg = statusConfig[cycle.status];

        return (
          <motion.div
            key={cycle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{cycle.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${cfg.bg}`}>
                    {cfg.label}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Period: {new Date(cycle.periodStart).toLocaleDateString()} - {new Date(cycle.periodEnd).toLocaleDateString()}
                </p>

                {cycle.status === 'active' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-gray-400">Self Review Due</p>
                      <p className="text-white font-medium">{new Date(cycle.selfReviewDue).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-gray-400">Manager Review Due</p>
                      <p className="text-white font-medium">{new Date(cycle.managerReviewDue).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-gray-400">Calibration</p>
                      <p className="text-white font-medium">{new Date(cycle.calibrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-gray-400">Finalization</p>
                      <p className="text-white font-medium">{new Date(cycle.finalizationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {cycle.status === 'active' && (
                <button
                  onClick={() => onViewReviews(cycle)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm"
                >
                  View Reviews
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ===========================================
// FEEDBACK VIEW
// ===========================================

interface FeedbackViewProps {
  onStartFeedback: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ onStartFeedback }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
      <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">360 Feedback</h3>
      <p className="text-gray-400 mb-4">Collect and manage peer feedback for comprehensive performance reviews.</p>
      <button
        onClick={onStartFeedback}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
      >
        Start Feedback Collection
      </button>
    </div>
  );
};

// ===========================================
// GOAL DETAIL MODAL
// ===========================================

interface GoalDetailModalProps {
  goal: PerformanceGoal;
  onClose: () => void;
}

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{goal.title}</h2>
              <p className="text-gray-400">{goal.staffName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <p className="text-gray-300 mb-6">{goal.description}</p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white font-medium">{goal.progressPercent}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${goal.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Key Results */}
          <h3 className="text-sm font-medium text-gray-400 mb-4">Key Results</h3>
          <div className="space-y-4">
            {goal.keyResults.map((kr) => (
              <div
                key={kr.id}
                className={`rounded-lg p-4 ${
                  kr.completed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={kr.completed ? 'text-emerald-400' : 'text-white'}>
                    {kr.description}
                  </span>
                  {kr.completed && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${kr.completed ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((kr.current / kr.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {kr.current} / {kr.target} {kr.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// NEW GOAL MODAL
// ===========================================

interface NewGoalModalProps {
  onClose: () => void;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('professional');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = () => {
    if (!title || !targetDate) return;
    // In a real app, this would submit to the API
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create New Goal</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Launch Platform V2.0"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the goal and expected outcomes..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="professional">Professional</option>
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
            Create Goal
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// REVIEWS DETAIL MODAL
// ===========================================

interface ReviewsDetailModalProps {
  cycle: ReviewCycle;
  onClose: () => void;
}

const ReviewsDetailModal: React.FC<ReviewsDetailModalProps> = ({ cycle, onClose }) => {
  // Sample review data
  const reviews = [
    { id: '1', staffName: 'Sarah Chen', selfComplete: true, managerComplete: false, rating: null },
    { id: '2', staffName: 'Michael Torres', selfComplete: true, managerComplete: true, rating: 4 },
    { id: '3', staffName: 'Emily Rodriguez', selfComplete: false, managerComplete: false, rating: null }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{cycle.name}</h2>
              <p className="text-gray-400 text-sm">Review Progress</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{review.staffName}</span>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${review.selfComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {review.selfComplete ? '✓ Self Review' : '○ Self Review'}
                    </span>
                    <span className={`text-sm ${review.managerComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {review.managerComplete ? '✓ Manager Review' : '○ Manager Review'}
                    </span>
                    {review.rating && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        {review.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// FEEDBACK COLLECTION MODAL
// ===========================================

interface FeedbackCollectionModalProps {
  onClose: () => void;
}

const FeedbackCollectionModal: React.FC<FeedbackCollectionModalProps> = ({ onClose }) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [feedbackType, setFeedbackType] = useState('peer');

  const staffList = [
    { id: '1', name: 'Sarah Chen' },
    { id: '2', name: 'Michael Torres' },
    { id: '3', name: 'Emily Rodriguez' },
    { id: '4', name: 'David Kim' }
  ];

  const handleStartCollection = () => {
    if (selectedStaff.length === 0) return;
    // In a real app, this would send feedback requests
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Start 360 Feedback</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Feedback Type</label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="peer">Peer Feedback</option>
              <option value="manager">Manager Feedback</option>
              <option value="360">Full 360 Review</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Staff</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {staffList.map((staff) => (
                <label key={staff.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStaff([...selectedStaff, staff.id]);
                      } else {
                        setSelectedStaff(selectedStaff.filter(id => id !== staff.id));
                      }
                    }}
                    className="rounded bg-slate-800 border-slate-700"
                  />
                  <span className="text-white">{staff.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleStartCollection}
            disabled={selectedStaff.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Feedback Requests
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceSection;
