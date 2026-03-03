// ===========================================
// SUBMISSION DRAFTS MANAGER
// Manage saved drafts for challenge submissions
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  Save,
  ChevronRight,
  History,
} from 'lucide-react';
import { ChallengeSubmission, Challenge } from '@/types';

interface Draft {
  id: string;
  challengeId: string;
  challengeTitle: string;
  title: string;
  lastModified: string;
  completionPercentage: number;
  version: number;
  autoSaved: boolean;
}

interface SubmissionDraftsManagerProps {
  userId: string;
  challenges: Challenge[];
  onEditDraft: (draftId: string, challengeSlug: string) => void;
  onDeleteDraft: (draftId: string) => Promise<void>;
  onRestoreVersion?: (draftId: string, version: number) => void;
}

export const SubmissionDraftsManager: React.FC<SubmissionDraftsManagerProps> = ({
  userId,
  challenges,
  onEditDraft,
  onDeleteDraft,
  onRestoreVersion,
}) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null);

  useEffect(() => {
    // Load drafts from localStorage/API
    const loadDrafts = async () => {
      try {
        // In real implementation, this would fetch from API
        const savedDrafts: Draft[] = [];

        // Check localStorage for auto-saved drafts
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('submission_draft_')) {
            try {
              const draftData = JSON.parse(localStorage.getItem(key) || '');
              const challenge = challenges.find(c => c.id === draftData.challengeId);
              if (challenge) {
                savedDrafts.push({
                  id: key,
                  challengeId: draftData.challengeId,
                  challengeTitle: challenge.title,
                  title: draftData.title || 'Untitled Submission',
                  lastModified: draftData.lastSaved || new Date().toISOString(),
                  completionPercentage: calculateCompletion(draftData),
                  version: draftData.version || 1,
                  autoSaved: true,
                });
              }
            } catch {
              // Skip invalid drafts
            }
          }
        }

        setDrafts(savedDrafts);
      } catch (error) {
        console.error('Failed to load drafts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, [userId, challenges]);

  const calculateCompletion = (draft: Partial<ChallengeSubmission>): number => {
    const requiredFields = [
      'title',
      'summary',
      'description',
      'videoUrl',
      'technologiesUsed',
    ];
    const filledFields = requiredFields.filter(
      field => draft[field as keyof ChallengeSubmission]
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const handleDelete = async (draftId: string) => {
    setDeletingId(draftId);
    try {
      await onDeleteDraft(draftId);
      // Also remove from localStorage if it's there
      localStorage.removeItem(draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getCompletionColor = (percentage: number): string => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No saved drafts</h3>
        <p className="text-gray-400 text-sm">
          Your submission drafts will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-yellow-400" />
          Saved Drafts ({drafts.length})
        </h3>
        <span className="text-xs text-gray-500">
          Auto-saved drafts are stored locally
        </span>
      </div>

      {/* Drafts list */}
      <div className="space-y-3">
        <AnimatePresence>
          {drafts.map((draft) => {
            const challenge = challenges.find(c => c.id === draft.challengeId);
            const deadline = challenge
              ? new Date(challenge.submissionDeadline)
              : null;
            const isUrgent = deadline && deadline.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

            return (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Challenge name */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 truncate">
                        {draft.challengeTitle}
                      </span>
                      {isUrgent && (
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <AlertCircle className="w-3 h-3" />
                          Deadline soon
                        </span>
                      )}
                    </div>

                    {/* Draft title */}
                    <h4 className="font-medium text-white truncate">
                      {draft.title}
                    </h4>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(draft.lastModified)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        v{draft.version}
                      </span>
                      {draft.autoSaved && (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Auto-saved
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Completion</span>
                        <span className="text-xs text-gray-400">
                          {draft.completionPercentage}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getCompletionColor(draft.completionPercentage)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${draft.completionPercentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {onRestoreVersion && (
                      <button
                        onClick={() => setShowVersionHistory(
                          showVersionHistory === draft.id ? null : draft.id
                        )}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Version history"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(draft.id)}
                      disabled={deletingId === draft.id}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete draft"
                    >
                      {deletingId === draft.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const slug = challenge?.slug || draft.challengeId;
                        onEditDraft(draft.id, slug);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Version history panel */}
                <AnimatePresence>
                  {showVersionHistory === draft.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700 overflow-hidden"
                    >
                      <h5 className="text-sm font-medium text-gray-400 mb-2">
                        Version History
                      </h5>
                      <div className="space-y-2">
                        {/* Mock version history - in real impl would be from API */}
                        {[draft.version, draft.version - 1, draft.version - 2]
                          .filter(v => v > 0)
                          .map((version) => (
                            <div
                              key={version}
                              className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white">
                                  Version {version}
                                </span>
                                {version === draft.version && (
                                  <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                                    Current
                                  </span>
                                )}
                              </div>
                              {version !== draft.version && onRestoreVersion && (
                                <button
                                  onClick={() => onRestoreVersion(draft.id, version)}
                                  className="text-xs text-yellow-400 hover:text-yellow-300"
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubmissionDraftsManager;
