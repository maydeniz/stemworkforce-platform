// ===========================================
// SOLVER PROFILE CARD
// Showcase solver achievements and stats
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  Target,
  Users,
  Clock,
  MapPin,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface SolverStats {
  challengesCompleted: number;
  wins: number;
  topThreeFinishes: number;
  totalSubmissions: number;
  avgScore: number;
  rank?: number;
  percentile?: number;
}

interface SolverBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SolverProfile {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
  skills: string[];
  stats: SolverStats;
  badges: SolverBadge[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  isAvailableForTeam?: boolean;
  memberSince: string;
}

interface SolverProfileCardProps {
  profile: SolverProfile;
  variant?: 'default' | 'compact' | 'expanded';
  showInviteButton?: boolean;
  onInvite?: (solverId: string) => void;
  isCurrentUser?: boolean;
}

export const SolverProfileCard: React.FC<SolverProfileCardProps> = ({
  profile,
  variant = 'default',
  showInviteButton = false,
  onInvite,
  isCurrentUser = false,
}) => {
  const getRankTier = (percentile?: number): { label: string; color: string; icon: React.ElementType } => {
    if (!percentile) return { label: 'Unranked', color: 'text-gray-400', icon: Target };
    if (percentile >= 99) return { label: 'Grandmaster', color: 'text-red-400', icon: Trophy };
    if (percentile >= 95) return { label: 'Master', color: 'text-orange-400', icon: Medal };
    if (percentile >= 85) return { label: 'Expert', color: 'text-purple-400', icon: Star };
    if (percentile >= 70) return { label: 'Advanced', color: 'text-blue-400', icon: Award };
    if (percentile >= 50) return { label: 'Intermediate', color: 'text-green-400', icon: TrendingUp };
    return { label: 'Beginner', color: 'text-gray-400', icon: Target };
  };

  const getBadgeColor = (rarity: SolverBadge['rarity']): string => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const tier = getRankTier(profile.stats.percentile);

  // Compact variant for lists
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          {profile.isAvailableForTeam && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{profile.name}</h4>
            <span className={`text-xs font-medium ${tier.color}`}>{tier.label}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              {profile.stats.wins} wins
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {profile.stats.challengesCompleted} challenges
            </span>
          </div>
        </div>

        {/* Skills preview */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {profile.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 2 && (
            <span className="text-xs text-gray-500">+{profile.skills.length - 2}</span>
          )}
        </div>

        {/* Action */}
        {showInviteButton && onInvite && !isCurrentUser && profile.isAvailableForTeam && (
          <button
            onClick={() => onInvite(profile.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            Invite
          </button>
        )}
      </motion.div>
    );
  }

  // Expanded variant for full profiles
  if (variant === 'expanded') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            {profile.isAvailableForTeam && (
              <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" />
                Looking for team
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-700/50 ${tier.color}`}>
                <tier.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tier.label}</span>
              </div>
            </div>

            {profile.title && (
              <p className="text-gray-400 mb-2">{profile.title}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Member since {new Date(profile.memberSince).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Social Links */}
            {profile.socialLinks && (
              <div className="flex items-center gap-3 mt-3">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Invite button */}
          {showInviteButton && onInvite && !isCurrentUser && (
            <button
              onClick={() => onInvite(profile.id)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              Invite to Team
            </button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-300 mb-6">{profile.bio}</p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-gray-900/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-white">{profile.stats.challengesCompleted}</div>
            <div className="text-xs text-gray-400">Challenges</div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-yellow-400">{profile.stats.wins}</div>
            <div className="text-xs text-gray-400">Wins</div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-orange-400">{profile.stats.topThreeFinishes}</div>
            <div className="text-xs text-gray-400">Top 3</div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-400">{profile.stats.totalSubmissions}</div>
            <div className="text-xs text-gray-400">Submissions</div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-400">{profile.stats.avgScore.toFixed(2)}</div>
            <div className="text-xs text-gray-400">Avg Score</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="group relative"
                  title={badge.description}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getBadgeColor(badge.rarity)} p-0.5`}>
                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center text-2xl">
                      {badge.icon}
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          {profile.isAvailableForTeam && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-800 rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{profile.name}</h3>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">You</span>
            )}
          </div>

          <div className={`flex items-center gap-1 text-sm ${tier.color}`}>
            <tier.icon className="w-4 h-4" />
            <span>{tier.label}</span>
            {profile.stats.rank && (
              <span className="text-gray-500 ml-1">#{profile.stats.rank}</span>
            )}
          </div>

          {profile.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              {profile.location}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-2 bg-gray-900/50 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-400">{profile.stats.wins}</div>
          <div className="text-xs text-gray-500">Wins</div>
        </div>
        <div className="p-2 bg-gray-900/50 rounded-lg text-center">
          <div className="text-lg font-bold text-white">{profile.stats.challengesCompleted}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="p-2 bg-gray-900/50 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">{profile.stats.avgScore.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Avg Score</div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {profile.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
          >
            {skill}
          </span>
        ))}
        {profile.skills.length > 4 && (
          <span className="px-2 py-0.5 text-gray-500 text-xs">
            +{profile.skills.length - 4}
          </span>
        )}
      </div>

      {/* Badges preview */}
      {profile.badges.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {profile.badges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getBadgeColor(badge.rarity)} p-0.5`}
              title={badge.name}
            >
              <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center text-sm">
                {badge.icon}
              </div>
            </div>
          ))}
          {profile.badges.length > 4 && (
            <span className="text-xs text-gray-500">+{profile.badges.length - 4}</span>
          )}
        </div>
      )}

      {/* Action */}
      {showInviteButton && onInvite && !isCurrentUser && profile.isAvailableForTeam && (
        <button
          onClick={() => onInvite(profile.id)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
        >
          <Users className="w-4 h-4" />
          Invite to Team
        </button>
      )}
    </motion.div>
  );
};

export default SolverProfileCard;
