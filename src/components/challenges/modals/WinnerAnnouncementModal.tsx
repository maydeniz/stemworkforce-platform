import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Medal,
  Star,
  Share2,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Challenge } from '@/types';

interface UserResult {
  isWinner: boolean;
  place?: number;
  prize?: number;
  rank: number;
  score: number;
  percentile: number;
  feedback?: string;
  submissionTitle?: string;
}

interface WinnerAnnouncementModalProps {
  challenge: Challenge;
  userResult: UserResult;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onViewResults?: () => void;
}

const PLACE_DETAILS: Record<number, { icon: React.ReactNode; color: string; label: string; bgColor: string }> = {
  1: {
    icon: <Trophy className="h-12 w-12" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    label: '1st Place'
  },
  2: {
    icon: <Medal className="h-12 w-12" />,
    color: 'text-gray-300',
    bgColor: 'bg-gray-400/20',
    label: '2nd Place'
  },
  3: {
    icon: <Medal className="h-12 w-12" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-700/20',
    label: '3rd Place'
  }
};

export const WinnerAnnouncementModal: React.FC<WinnerAnnouncementModalProps> = ({
  challenge,
  userResult,
  isOpen,
  onClose,
  onShare,
  onViewResults
}) => {
  const placeInfo = userResult.place ? PLACE_DETAILS[userResult.place] : null;

  const formatPrize = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Winner Background Effects */}
          {userResult.isWinner && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Animated gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-transparent to-transparent"
              />
              {/* Sparkle effects */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-10 left-10 text-amber-400"
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute top-20 right-16 text-amber-400"
              >
                <Star className="h-4 w-4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="absolute top-14 right-8 text-amber-400"
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          {/* Content */}
          <div className="relative p-8">
            {userResult.isWinner ? (
              /* Winner View */
              <div className="text-center">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className={`w-24 h-24 ${placeInfo?.bgColor || 'bg-amber-500/20'} rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
                    className={placeInfo?.color || 'text-amber-400'}
                  >
                    {placeInfo?.icon || <Trophy className="h-12 w-12" />}
                  </motion.div>
                </motion.div>

                {/* Congratulations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Congratulations!
                  </h2>
                  <p className="text-xl text-gray-300 mb-2">
                    You've won{' '}
                    <span className={placeInfo?.color || 'text-amber-400'}>
                      {placeInfo?.label || `Place #${userResult.place}`}
                    </span>
                  </p>
                  <p className="text-gray-400 mb-6">
                    in {challenge.title}
                  </p>
                </motion.div>

                {/* Prize Amount */}
                {userResult.prize && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 mb-6"
                  >
                    <p className="text-sm text-amber-300 mb-1">Your Prize</p>
                    <p className="text-4xl font-bold text-amber-400">
                      {formatPrize(userResult.prize)}
                    </p>
                  </motion.div>
                )}

                {/* What's Next */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left"
                >
                  <h4 className="text-sm font-medium text-white mb-3">What Happens Next?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Verification email within 24 hours
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Prize payment within 30 days
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Winner spotlight (optional)
                    </li>
                  </ul>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex gap-3"
                >
                  {onShare && (
                    <button
                      onClick={onShare}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Victory
                    </button>
                  )}
                  <button
                    onClick={onViewResults || onClose}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    View Results
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            ) : (
              /* Non-Winner View */
              <div className="text-center">
                {/* Results Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <TrendingUp className="h-10 w-10 text-indigo-400" />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Results Are In!
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {challenge.title} has concluded.
                  </p>
                </motion.div>

                {/* Your Result */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-800/50 rounded-xl p-6 mb-6"
                >
                  <h4 className="text-sm font-medium text-gray-400 mb-4">Your Result</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-white">#{userResult.rank}</p>
                      <p className="text-xs text-gray-500">out of many</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{userResult.score}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-400">
                        Top {userResult.percentile}%
                      </p>
                      <p className="text-xs text-gray-500">percentile</p>
                    </div>
                  </div>
                </motion.div>

                {/* Feedback */}
                {userResult.feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left"
                  >
                    <h4 className="text-sm font-medium text-white mb-2">Judge Feedback</h4>
                    <p className="text-sm text-gray-400">{userResult.feedback}</p>
                  </motion.div>
                )}

                {/* Encouragement */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6"
                >
                  <p className="text-sm text-indigo-200">
                    Keep building! Your next win is one challenge away.
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={onViewResults || onClose}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    View Leaderboard
                  </button>
                  <Link
                    to="/challenges"
                    className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors text-center"
                  >
                    Browse Challenges
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WinnerAnnouncementModal;
