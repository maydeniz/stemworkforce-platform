// ===========================================
// CHALLENGE DISCOVERY CARD
// Enhanced card for challenge browsing/discovery
// ===========================================

import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  DollarSign,
  Building,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Challenge } from '@/types';

interface ChallengeDiscoveryCardProps {
  challenge: Challenge;
  variant?: 'default' | 'compact' | 'featured';
  isSaved?: boolean;
  onToggleSave?: (challengeId: string) => void;
  showMatchScore?: boolean;
  matchScore?: number;
  index?: number;
}

export const ChallengeDiscoveryCard: FC<ChallengeDiscoveryCardProps> = ({
  challenge,
  variant = 'default',
  isSaved = false,
  onToggleSave,
  showMatchScore = false,
  matchScore,
  index = 0,
}) => {
  const getDaysRemaining = (): number => {
    const end = new Date(challenge.submissionDeadline);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysRemaining();
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const isClosed = daysLeft <= 0;

  const formatPrize = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    if (isClosed) {
      return (
        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-full">
          Closed
        </span>
      );
    }
    if (challenge.status === 'judging') {
      return (
        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
          Judging
        </span>
      );
    }
    if (isUrgent) {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysLeft}d left
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
        Open
      </span>
    );
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Link
          to={`/challenges/${challenge.slug}`}
          className="flex items-center gap-4 p-3 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all"
        >
          <div className="flex-shrink-0">
            {challenge.thumbnailImage ? (
              <img
                src={challenge.thumbnailImage}
                alt={challenge.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate group-hover:text-yellow-400 transition-colors">
              {challenge.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1 text-green-400">
                <DollarSign className="w-3 h-3" />
                {formatPrize(challenge.totalPrizePool)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {challenge.registeredSolversCount || 0}
              </span>
            </div>
          </div>

          {getStatusBadge()}
        </Link>
      </motion.div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />

        <div className="relative p-6 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          {/* Featured badge */}
          <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold">
            FEATURED
          </div>

          {/* Thumbnail */}
          {challenge.thumbnailImage && (
            <img
              src={challenge.thumbnailImage}
              alt={challenge.title}
              className="w-full h-40 rounded-xl object-cover mb-4"
            />
          )}

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {challenge.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                  <Building className="w-4 h-4" />
                  <span>{challenge.sponsor.name}</span>
                </div>
              </div>
              {getStatusBadge()}
            </div>

            <p className="text-gray-400 line-clamp-2">
              {challenge.shortDescription}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-400">
                  {formatPrize(challenge.totalPrizePool)}
                </div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-400">
                  {challenge.registeredSolversCount || 0}
                </div>
                <div className="text-xs text-gray-500">Solvers</div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <div className={`text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-gray-300'}`}>
                  {daysLeft > 0 ? `${daysLeft}d` : 'Closed'}
                </div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {challenge.tags?.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              to={`/challenges/${challenge.slug}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-colors"
            >
              View Challenge
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {challenge.thumbnailImage ? (
              <img
                src={challenge.thumbnailImage}
                alt={challenge.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            )}
            <div>
              <span className="text-xs text-gray-500">{challenge.sponsor.name}</span>
              <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                {challenge.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave(challenge.id);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'text-yellow-400 bg-yellow-500/10'
                    : 'text-gray-500 hover:text-white hover:bg-gray-700'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save challenge'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {challenge.shortDescription}
        </p>

        {/* Match Score (if enabled) */}
        {showMatchScore && matchScore !== undefined && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Skills Match
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">{matchScore}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1 text-green-400">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">{formatPrize(challenge.totalPrizePool)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{challenge.registeredSolversCount || 0}</span>
          </div>
          {!isClosed && (
            <div className={`flex items-center gap-1 ml-auto ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
              <Clock className="w-4 h-4" />
              <span>{daysLeft}d left</span>
            </div>
          )}
        </div>

        {/* Categories/Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags?.slice(0, 4).map((category) => (
            <span
              key={category}
              className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
          {challenge.tags && challenge.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{challenge.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              Deadline: {new Date(challenge.submissionDeadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <Link
            to={`/challenges/${challenge.slug}`}
            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengeDiscoveryCard;
