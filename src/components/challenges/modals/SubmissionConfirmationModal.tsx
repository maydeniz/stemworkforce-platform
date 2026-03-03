import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  Edit3,
  Share2,
  AlertCircle,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Challenge, ChallengeSubmission } from '@/types';

interface SubmissionConfirmationModalProps {
  submission: ChallengeSubmission;
  challenge: Challenge;
  isUpdate: boolean;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export const SubmissionConfirmationModal: React.FC<SubmissionConfirmationModalProps> = ({
  submission,
  challenge,
  isUpdate,
  isOpen,
  onClose,
  onShare
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (date: string) => {
    const now = new Date();
    const deadline = new Date(date);
    const diff = deadline.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getDaysRemaining(challenge.submissionDeadline);
  const canStillEdit = daysRemaining > 0;

  const copySubmissionId = () => {
    navigator.clipboard.writeText(submission.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Confetti Animation Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <CheckCircle className="h-10 w-10 text-green-400" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {isUpdate ? 'Submission Updated!' : 'Submission Received!'}
              </h2>
              <p className="text-gray-400 mb-6">
                "{submission.title}" has been {isUpdate ? 'updated' : 'submitted'}
              </p>
            </motion.div>

            {/* Submission Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Submission ID</span>
                  <button
                    onClick={copySubmissionId}
                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    #{submission.id.slice(0, 8)}
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Version</span>
                  <span className="text-gray-300">{submission.version || 1}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Submitted</span>
                  <span className="text-gray-300">
                    {formatDate(submission.submittedAt || new Date().toISOString())}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-1 text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Under Review
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Edit Warning */}
            {canStillEdit && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200">
                      You can still edit your submission until{' '}
                      <span className="font-semibold">
                        {formatDate(challenge.submissionDeadline)}
                      </span>
                    </p>
                    <p className="text-xs text-amber-300/70 mt-1">
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left"
            >
              <h4 className="text-sm font-medium text-white mb-3">What Happens Next?</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-400">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Eligibility Check</p>
                    <p className="text-xs text-gray-500">1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-400">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Judge Evaluation</p>
                    <p className="text-xs text-gray-500">
                      {challenge.judgingPeriod?.start
                        ? `${formatDate(challenge.judgingPeriod.start)} - ${formatDate(challenge.judgingPeriod.end)}`
                        : 'Judging period TBD'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Results Announced</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(challenge.winnersAnnouncedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3"
            >
              <Link
                to={`/challenges/${challenge.slug || challenge.id}/submission`}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {canStillEdit ? 'Edit' : 'View'} Submission
              </Link>
              {onShare && (
                <button
                  onClick={onShare}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              )}
            </motion.div>

            {/* Good Luck Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-500 text-sm mt-6"
            >
              Good luck! We're rooting for you.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubmissionConfirmationModal;
