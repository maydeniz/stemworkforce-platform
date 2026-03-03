// ===========================================
// JUDGE PORTAL
// Comprehensive judging interface for reviewers
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Award,
  TrendingUp,
  Play,
} from 'lucide-react';
import { Challenge, ChallengeSubmission } from '@/types';
import { JudgeEvaluationForm } from '../forms/JudgeEvaluationForm';

interface JudgeAssignment {
  id: string;
  challengeId: string;
  challengeTitle: string;
  challengeSlug: string;
  totalAssigned: number;
  reviewed: number;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface JudgePortalProps {
  userId: string;
  assignments: JudgeAssignment[];
  onLoadSubmissions: (challengeId: string) => Promise<ChallengeSubmission[]>;
  onSaveEvaluation: (submissionId: string, evaluation: any, status: 'draft' | 'final') => Promise<void>;
  onSkipSubmission: (submissionId: string, reason: string) => Promise<void>;
  onLoadChallenge: (challengeId: string) => Promise<Challenge>;
}

export const JudgePortal: React.FC<JudgePortalProps> = ({
  userId,
  assignments,
  onLoadSubmissions,
  onSaveEvaluation,
  onSkipSubmission,
  onLoadChallenge,
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'review'>('dashboard');
  const [selectedAssignment, setSelectedAssignment] = useState<JudgeAssignment | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('pending');

  const stats = {
    totalAssignments: assignments.length,
    pendingAssignments: assignments.filter(a => a.status !== 'completed').length,
    totalToReview: assignments.reduce((sum, a) => sum + a.totalAssigned, 0),
    totalReviewed: assignments.reduce((sum, a) => sum + a.reviewed, 0),
    completionRate: assignments.length > 0
      ? Math.round((assignments.reduce((sum, a) => sum + a.reviewed, 0) / assignments.reduce((sum, a) => sum + a.totalAssigned, 0)) * 100) || 0
      : 0,
  };

  const handleStartReview = async (assignment: JudgeAssignment) => {
    setIsLoading(true);
    try {
      const [subs, chal] = await Promise.all([
        onLoadSubmissions(assignment.challengeId),
        onLoadChallenge(assignment.challengeId),
      ]);
      setSubmissions(subs);
      setChallenge(chal);
      setSelectedAssignment(assignment);
      setCurrentSubmissionIndex(0);
      setActiveView('review');
    } catch (error) {
      console.error('Failed to load review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSubmission = submissions[currentSubmissionIndex];

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !s.scores?.some(e => e.judgeId === userId);
    if (filter === 'reviewed') return s.scores?.some(e => e.judgeId === userId);
    return true;
  });

  const handleNextSubmission = () => {
    if (currentSubmissionIndex < filteredSubmissions.length - 1) {
      setCurrentSubmissionIndex(prev => prev + 1);
    }
  };

  const handlePreviousSubmission = () => {
    if (currentSubmissionIndex > 0) {
      setCurrentSubmissionIndex(prev => prev - 1);
    }
  };

  const handleSaveEvaluation = async (evaluation: any, status: 'draft' | 'final') => {
    if (!currentSubmission) return;
    await onSaveEvaluation(currentSubmission.id, evaluation, status);
    if (status === 'final') {
      handleNextSubmission();
    }
  };

  const getDaysRemaining = (deadline: string): number => {
    const end = new Date(deadline);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Judge Portal</h1>
              <p className="text-gray-400">Review and score challenge submissions</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalAssignments}</div>
                    <div className="text-sm text-gray-400">Challenges Assigned</div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalToReview - stats.totalReviewed}</div>
                    <div className="text-sm text-gray-400">Pending Reviews</div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalReviewed}</div>
                    <div className="text-sm text-gray-400">Reviewed</div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
                    <div className="text-sm text-gray-400">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Your Assignments</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('reviewed')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === 'reviewed' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {assignments.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
                  <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No assignments yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    You will be notified when challenge organizers assign submissions for your review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments
                    .filter(a => {
                      if (filter === 'all') return true;
                      if (filter === 'pending') return a.status !== 'completed';
                      if (filter === 'reviewed') return a.status === 'completed';
                      return true;
                    })
                    .map((assignment) => {
                      const daysLeft = getDaysRemaining(assignment.deadline);
                      const isUrgent = daysLeft <= 3 && daysLeft > 0;
                      const isOverdue = daysLeft <= 0;
                      const progress = assignment.totalAssigned > 0
                        ? Math.round((assignment.reviewed / assignment.totalAssigned) * 100)
                        : 0;

                      return (
                        <motion.div
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-5 bg-gray-800/50 border rounded-xl transition-all ${
                            isOverdue ? 'border-red-500/50' :
                            isUrgent ? 'border-yellow-500/50' :
                            'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {assignment.challengeTitle}
                                </h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  assignment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                  assignment.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {assignment.status.replace('-', ' ')}
                                </span>
                                {isOverdue && (
                                  <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                                    Overdue
                                  </span>
                                )}
                                {isUrgent && !isOverdue && (
                                  <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                                    Due soon
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {assignment.totalAssigned} submissions
                                </span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  {assignment.reviewed} reviewed
                                </span>
                                <span className={`flex items-center gap-1 ${
                                  isOverdue ? 'text-red-400' :
                                  isUrgent ? 'text-yellow-400' :
                                  ''
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                  {isOverdue
                                    ? 'Overdue'
                                    : `Due ${new Date(assignment.deadline).toLocaleDateString()}`}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-500">Progress</span>
                                  <span className="text-gray-400">{progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full ${
                                      progress === 100 ? 'bg-green-500' :
                                      progress > 50 ? 'bg-blue-500' :
                                      'bg-yellow-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  />
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleStartReview(assignment)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Play className="w-5 h-5" />
                                  {assignment.status === 'completed' ? 'View' : 'Start Review'}
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Judging Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Review submissions carefully against the challenge criteria
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Provide constructive feedback to help participants improve
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Declare any conflicts of interest before reviewing
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Your evaluations are confidential until results are announced
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Review Mode */}
        {activeView === 'review' && challenge && currentSubmission && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col"
          >
            {/* Review Header */}
            <div className="flex-shrink-0 px-6 py-4 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {selectedAssignment?.challengeTitle}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Reviewing submission {currentSubmissionIndex + 1} of {filteredSubmissions.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousSubmission}
                      disabled={currentSubmissionIndex === 0}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-400 text-sm">
                      {currentSubmissionIndex + 1} / {filteredSubmissions.length}
                    </span>
                    <button
                      onClick={handleNextSubmission}
                      disabled={currentSubmissionIndex >= filteredSubmissions.length - 1}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${((currentSubmissionIndex + 1) / filteredSubmissions.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(((currentSubmissionIndex + 1) / filteredSubmissions.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="flex-1 overflow-hidden">
              <JudgeEvaluationForm
                submission={currentSubmission}
                challenge={challenge}
                existingEvaluation={currentSubmission.scores?.find(e => e.judgeId === userId) as any}
                onSave={handleSaveEvaluation}
                onSkip={(reason) => onSkipSubmission(currentSubmission.id, reason)}
                totalAssigned={filteredSubmissions.length}
                currentIndex={currentSubmissionIndex}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JudgePortal;
