// ===========================================
// CHALLENGE LEADERBOARD
// Kaggle-style public/private leaderboard
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  User,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Star,
  Lock,
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  solverId: string;
  solverName: string;
  teamName?: string;
  isTeam: boolean;
  avatarUrl?: string;
  score: number;
  submissionCount: number;
  lastSubmission: string;
  isCurrentUser?: boolean;
  country?: string;
}

interface ChallengeLeaderboardProps {
  challengeId: string;
  entries: LeaderboardEntry[];
  currentUserId?: string;
  hasPrivateLeaderboard?: boolean;
  showPrivate?: boolean;
  onTogglePrivate?: () => void;
  lastUpdated?: string;
  onRefresh?: () => void;
  maxDisplayed?: number;
}

export const ChallengeLeaderboard: React.FC<ChallengeLeaderboardProps> = ({
  challengeId,
  entries,
  currentUserId,
  hasPrivateLeaderboard = false,
  showPrivate = false,
  onTogglePrivate,
  lastUpdated,
  onRefresh,
  maxDisplayed = 50,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const currentUserEntry = entries.find(e => e.solverId === currentUserId);
  const displayedEntries = entries.slice(0, maxDisplayed);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getRankChange = (entry: LeaderboardEntry): 'up' | 'down' | 'same' | null => {
    if (!entry.previousRank) return null;
    if (entry.rank < entry.previousRank) return 'up';
    if (entry.rank > entry.previousRank) return 'down';
    return 'same';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-900" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
            <Medal className="w-4 h-4 text-gray-800" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
            <Medal className="w-4 h-4 text-amber-200" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

  const getRankChangeIcon = (change: 'up' | 'down' | 'same' | null) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const formatScore = (score: number): string => {
    return score.toFixed(4);
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {showPrivate ? 'Private Leaderboard' : 'Public Leaderboard'}
          </h3>

          {hasPrivateLeaderboard && onTogglePrivate && (
            <button
              onClick={onTogglePrivate}
              className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-colors ${
                showPrivate
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {showPrivate ? (
                <>
                  <Eye className="w-4 h-4" />
                  Switch to Public
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  View Private
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {formatTimeAgo(lastUpdated)}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh leaderboard"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Current user position (if not in top) */}
      {currentUserEntry && currentUserEntry.rank > maxDisplayed && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getRankIcon(currentUserEntry.rank)}
              {getRankChangeIcon(getRankChange(currentUserEntry))}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {currentUserEntry.solverName}
                </span>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                  You
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Rank #{currentUserEntry.rank} of {entries.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold text-white">
                {formatScore(currentUserEntry.score)}
              </div>
              <div className="text-xs text-gray-500">
                {currentUserEntry.submissionCount} submissions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/80 border-b border-gray-700 text-xs font-medium text-gray-400 uppercase">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Solver</div>
          <div className="col-span-2 text-right">Score</div>
          <div className="col-span-2 text-right">Submissions</div>
          <div className="col-span-2 text-right">Last Submit</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-700/50">
          {displayedEntries.map((entry, index) => {
            const rankChange = getRankChange(entry);
            const isExpanded = expandedEntry === entry.solverId;

            return (
              <motion.div
                key={entry.solverId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`${
                  entry.isCurrentUser
                    ? 'bg-yellow-500/5'
                    : 'hover:bg-gray-700/30'
                } transition-colors`}
              >
                <div
                  className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.solverId)}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    {rankChange && (
                      <div className="flex flex-col items-center">
                        {getRankChangeIcon(rankChange)}
                        {rankChange !== 'same' && entry.previousRank && (
                          <span className={`text-xs ${
                            rankChange === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {Math.abs(entry.rank - entry.previousRank)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Solver info */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {entry.isTeam ? (
                          <Users className="w-4 h-4" />
                        ) : (
                          entry.solverName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {entry.solverName}
                          </span>
                          {entry.isCurrentUser && (
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              You
                            </span>
                          )}
                          {entry.rank <= 3 && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                        {entry.teamName && (
                          <span className="text-xs text-gray-500">
                            {entry.teamName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-right">
                    <span className="font-mono font-bold text-white">
                      {formatScore(entry.score)}
                    </span>
                  </div>

                  {/* Submissions */}
                  <div className="col-span-2 text-right text-gray-400">
                    {entry.submissionCount}
                  </div>

                  {/* Last submission */}
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(entry.lastSubmission)}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Best Score</span>
                            <div className="font-mono text-white">{formatScore(entry.score)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Submissions</span>
                            <div className="text-white">{entry.submissionCount}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Rank Change (24h)</span>
                            <div className="flex items-center gap-1">
                              {getRankChangeIcon(rankChange)}
                              <span className={
                                rankChange === 'up' ? 'text-green-400' :
                                rankChange === 'down' ? 'text-red-400' :
                                'text-gray-400'
                              }>
                                {entry.previousRank
                                  ? rankChange === 'same'
                                    ? 'No change'
                                    : `${Math.abs(entry.rank - entry.previousRank)} ${rankChange === 'up' ? 'up' : 'down'}`
                                  : 'New entry'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Show more */}
        {entries.length > maxDisplayed && (
          <div className="p-4 text-center border-t border-gray-700">
            <span className="text-gray-500 text-sm">
              Showing top {maxDisplayed} of {entries.length} participants
            </span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No submissions yet</h3>
          <p className="text-gray-400 text-sm">
            Be the first to submit and claim the top spot!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengeLeaderboard;
