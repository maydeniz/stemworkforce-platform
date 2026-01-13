import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Send,
  Eye,
  ExternalLink,
  Video,
  Github,
  Globe,
  FileText,
  Download,
  Star,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  User,
  Users
} from 'lucide-react';
import type { Challenge, ChallengeSubmission, JudgingCriteria } from '@/types';

interface SubmissionScore {
  criterionId: string;
  score: number;
  feedback: string;
}

interface EvaluationData {
  scores: SubmissionScore[];
  overallComments: string;
  exceedsExpectations: boolean;
  recommendation: 'strong-yes' | 'yes' | 'maybe' | 'no' | null;
  conflictOfInterest: boolean;
  timeSpentMinutes: number;
}

interface JudgeEvaluationFormProps {
  submission: ChallengeSubmission;
  challenge: Challenge;
  existingEvaluation?: Partial<EvaluationData>;
  onSave: (evaluation: EvaluationData, status: 'draft' | 'final') => void;
  onSkip?: (reason: string) => void;
  totalAssigned: number;
  currentIndex: number;
}

const SCORE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Poor', color: 'text-red-400' },
  2: { label: 'Below Average', color: 'text-orange-400' },
  3: { label: 'Average', color: 'text-yellow-400' },
  4: { label: 'Good', color: 'text-green-400' },
  5: { label: 'Excellent', color: 'text-emerald-400' }
};

const RECOMMENDATION_OPTIONS = [
  { value: 'strong-yes', label: 'Strong Yes', description: 'Outstanding submission, should be a top contender', color: 'bg-emerald-500' },
  { value: 'yes', label: 'Yes', description: 'Good submission, meets criteria well', color: 'bg-green-500' },
  { value: 'maybe', label: 'Maybe', description: 'Has potential but needs consideration', color: 'bg-yellow-500' },
  { value: 'no', label: 'No', description: 'Does not meet criteria sufficiently', color: 'bg-red-500' }
];

export const JudgeEvaluationForm: React.FC<JudgeEvaluationFormProps> = ({
  submission,
  challenge,
  existingEvaluation,
  onSave,
  onSkip,
  totalAssigned,
  currentIndex
}) => {
  const [startTime] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);
  const [showDeliverables, setShowDeliverables] = useState(true);

  const [evaluation, setEvaluation] = useState<EvaluationData>(() => ({
    scores: challenge.judgingCriteria?.map(c => ({
      criterionId: c.name,
      score: 0,
      feedback: ''
    })) || [],
    overallComments: existingEvaluation?.overallComments || '',
    exceedsExpectations: existingEvaluation?.exceedsExpectations || false,
    recommendation: existingEvaluation?.recommendation || null,
    conflictOfInterest: existingEvaluation?.conflictOfInterest || false,
    timeSpentMinutes: existingEvaluation?.timeSpentMinutes || 0
  }));

  // Calculate time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const minutesSpent = Math.floor((Date.now() - startTime) / 60000);
      setEvaluation(prev => ({ ...prev, timeSpentMinutes: minutesSpent }));
    }, 60000);
    return () => clearInterval(interval);
  }, [startTime]);

  const updateScore = (criterionId: string, score: number) => {
    setEvaluation(prev => ({
      ...prev,
      scores: prev.scores.map(s =>
        s.criterionId === criterionId ? { ...s, score } : s
      )
    }));
  };

  const updateFeedback = (criterionId: string, feedback: string) => {
    setEvaluation(prev => ({
      ...prev,
      scores: prev.scores.map(s =>
        s.criterionId === criterionId ? { ...s, feedback } : s
      )
    }));
  };

  const calculateTotalScore = () => {
    if (!challenge.judgingCriteria || evaluation.scores.length === 0) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    challenge.judgingCriteria.forEach((criterion, index) => {
      const score = evaluation.scores[index]?.score || 0;
      const weight = criterion.weight || 1;
      weightedSum += score * weight;
      totalWeight += weight * 5; // Max score is 5
    });

    return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  };

  const allCriteriaScored = evaluation.scores.every(s => s.score > 0);

  const canSubmit = allCriteriaScored && evaluation.recommendation && !evaluation.conflictOfInterest;

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      onSave(evaluation, 'draft');
    } catch (err) {
      setError('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      onSave(evaluation, 'final');
    } catch (err: any) {
      setError(err.message || 'Failed to submit evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">
            Evaluating {currentIndex} of {totalAssigned}
          </p>
          <h2 className="text-2xl font-bold text-white">{submission.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Score</p>
            <p className="text-3xl font-bold text-indigo-400">{calculateTotalScore()}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Submission Details */}
        <div className="lg:col-span-1 space-y-4">
          {/* Submission Info */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Submission Details</h3>
              <button
                onClick={() => setShowDeliverables(!showDeliverables)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                {showDeliverables ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {showDeliverables && (
              <div className="space-y-3">
                {/* Solver/Team */}
                <div className="flex items-center gap-2 text-sm">
                  {submission.solverType === 'team' ? (
                    <Users className="h-4 w-4 text-gray-400" />
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-gray-300">
                    {submission.solverType === 'team' ? 'Team Submission' : 'Individual'}
                  </span>
                </div>

                {/* Submitted Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    Submitted: {formatDate(submission.submittedAt || '')}
                  </span>
                </div>

                {/* Deliverables */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  {submission.videoUrl && (
                    <a
                      href={submission.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      <Video className="h-4 w-4 text-red-400" />
                      Watch Video Demo
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}

                  {submission.repositoryUrl && (
                    <a
                      href={submission.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      View Repository
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}

                  {submission.demoUrl && (
                    <a
                      href={submission.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      <Globe className="h-4 w-4 text-blue-400" />
                      Try Live Demo
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}

                  {submission.deliverables && (
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors w-full">
                      <Download className="h-4 w-4 text-green-400" />
                      Download Files
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submission Description */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <h3 className="font-semibold text-white mb-3">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {submission.description || 'No description provided.'}
            </p>
          </div>

          {/* Conflict of Interest */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={evaluation.conflictOfInterest}
                onChange={(e) => setEvaluation(prev => ({
                  ...prev,
                  conflictOfInterest: e.target.checked
                }))}
                className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-white">
                  Conflict of Interest
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Check if you have a personal or professional relationship with the submitter
                </p>
              </div>
            </label>
            {evaluation.conflictOfInterest && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-200">
                  Please skip this submission and notify the challenge administrator.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Evaluation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scoring Criteria */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Evaluation Criteria</h3>

            <div className="space-y-6">
              {challenge.judgingCriteria?.map((criterion, index) => {
                const score = evaluation.scores[index]?.score || 0;
                const feedback = evaluation.scores[index]?.feedback || '';
                const isExpanded = expandedCriteria === criterion.name;

                return (
                  <div key={criterion.name} className="border-b border-gray-800 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{criterion.name}</h4>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            {criterion.weight}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{criterion.description}</p>
                      </div>
                      <button
                        onClick={() => setExpandedCriteria(isExpanded ? null : criterion.name)}
                        className="p-1 hover:bg-gray-800 rounded text-gray-400"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Score Selection */}
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => updateScore(criterion.name, value)}
                          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            score === value
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>

                    {/* Score Label */}
                    {score > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <Star className={`h-4 w-4 ${SCORE_LABELS[score].color}`} />
                        <span className={`text-sm font-medium ${SCORE_LABELS[score].color}`}>
                          {SCORE_LABELS[score].label}
                        </span>
                      </div>
                    )}

                    {/* Rubric Details (expanded) */}
                    {isExpanded && criterion.rubric && (
                      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-xs text-gray-400 font-medium mb-2">Scoring Guide</p>
                        <ul className="space-y-1 text-xs text-gray-500">
                          <li><span className="text-red-400">1:</span> Does not meet criteria</li>
                          <li><span className="text-orange-400">2:</span> Partially meets, significant gaps</li>
                          <li><span className="text-yellow-400">3:</span> Meets basic requirements</li>
                          <li><span className="text-green-400">4:</span> Exceeds requirements</li>
                          <li><span className="text-emerald-400">5:</span> Exceptional, sets a high bar</li>
                        </ul>
                      </div>
                    )}

                    {/* Feedback */}
                    <textarea
                      value={feedback}
                      onChange={(e) => updateFeedback(criterion.name, e.target.value)}
                      placeholder={`Feedback for ${criterion.name}...`}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Overall Assessment</h3>

            {/* Recommendation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Your Recommendation *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RECOMMENDATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setEvaluation(prev => ({
                      ...prev,
                      recommendation: option.value as EvaluationData['recommendation']
                    }))}
                    className={`p-3 rounded-xl text-center transition-all ${
                      evaluation.recommendation === option.value
                        ? `${option.color} text-white shadow-lg`
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
              {evaluation.recommendation && (
                <p className="text-xs text-gray-500 mt-2">
                  {RECOMMENDATION_OPTIONS.find(o => o.value === evaluation.recommendation)?.description}
                </p>
              )}
            </div>

            {/* Overall Comments */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overall Comments
              </label>
              <textarea
                value={evaluation.overallComments}
                onChange={(e) => setEvaluation(prev => ({
                  ...prev,
                  overallComments: e.target.value
                }))}
                placeholder="Summarize your overall assessment, highlighting strengths and areas for improvement..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Exceeds Expectations */}
            <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={evaluation.exceedsExpectations}
                onChange={(e) => setEvaluation(prev => ({
                  ...prev,
                  exceedsExpectations: e.target.checked
                }))}
                className="h-4 w-4 rounded border-amber-500 bg-gray-700 text-amber-500 focus:ring-amber-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Exceeds Expectations
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Recommend for special recognition or award consideration
                </p>
              </div>
            </label>

            {/* Time Spent */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time spent: {evaluation.timeSpentMinutes} minute{evaluation.timeSpentMinutes !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </button>

            <div className="flex items-center gap-3">
              {onSkip && (
                <button
                  onClick={() => onSkip('Skipped')}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {!canSubmit && !evaluation.conflictOfInterest && (
            <p className="text-xs text-amber-400 text-right">
              {!allCriteriaScored && 'Score all criteria. '}
              {!evaluation.recommendation && 'Select a recommendation.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JudgeEvaluationForm;
