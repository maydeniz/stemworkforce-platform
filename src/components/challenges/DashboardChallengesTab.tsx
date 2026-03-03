// ===========================================
// DASHBOARD CHALLENGES TAB COMPONENTS
// Role-specific challenge views for dashboards
// ===========================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Plus,
  Eye,
  Users,
  Calendar,
  DollarSign,
  Clock,
  ChevronRight,
  Target,
  Award,
  FileText,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Send,
  UserPlus,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { challengesApi } from '@/services/challengesApi';
import { Challenge, ChallengeTeam } from '@/types';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function formatPrize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

function getDaysRemaining(deadline: string): number {
  const end = new Date(deadline);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBadge(status: string): { color: string; label: string } {
  const statusMap: Record<string, { color: string; label: string }> = {
    draft: { color: 'bg-gray-500/20 text-gray-400', label: 'Draft' },
    'pending-approval': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Pending' },
    'registration-open': { color: 'bg-green-500/20 text-green-400', label: 'Open' },
    active: { color: 'bg-blue-500/20 text-blue-400', label: 'Active' },
    'submission-closed': { color: 'bg-orange-500/20 text-orange-400', label: 'Closed' },
    judging: { color: 'bg-purple-500/20 text-purple-400', label: 'Judging' },
    'winners-announced': { color: 'bg-green-500/20 text-green-400', label: 'Winners' },
    completed: { color: 'bg-gray-500/20 text-gray-400', label: 'Completed' },
    open: { color: 'bg-green-500/20 text-green-400', label: 'Open' },
    upcoming: { color: 'bg-blue-500/20 text-blue-400', label: 'Upcoming' },
  };
  return statusMap[status] || { color: 'bg-gray-500/20 text-gray-400', label: status };
}

// ===========================================
// SPONSOR/PARTNER CHALLENGES TAB
// For employers and partners who host challenges
// ===========================================

interface SponsorChallengesTabProps {
  userId: string;
  organizationId?: string;
}

export const SponsorChallengesTab: React.FC<SponsorChallengesTabProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'draft' | 'completed'>('all');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // In a real implementation, this would filter by sponsor
        const result = await challengesApi.challenges.list({ search: userId } as any);
        setChallenges(result.challenges || []);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, [userId]);

  const filteredChallenges = challenges.filter((c) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return ['registration-open', 'active', 'open'].includes(c.status);
    if (activeFilter === 'draft') return c.status === 'draft';
    if (activeFilter === 'completed') return ['completed', 'winners-announced'].includes(c.status);
    return true;
  });

  const stats = {
    total: challenges.length,
    active: challenges.filter((c) => ['registration-open', 'active', 'open'].includes(c.status)).length,
    totalPrize: challenges.reduce((sum, c) => sum + c.totalPrizePool, 0),
    totalSolvers: challenges.reduce((sum, c) => sum + (c.registeredSolversCount || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Innovation Challenges</h2>
          <p className="text-gray-400 text-sm mt-1">Create and manage challenges to source innovative solutions</p>
        </div>
        <button
          onClick={() => navigate('/challenges/create')}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Challenge
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-gray-400">Total Challenges</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
              <div className="text-xs text-gray-400">Active Challenges</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{formatPrize(stats.totalPrize)}</div>
              <div className="text-xs text-gray-400">Total Prize Pool</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalSolvers}</div>
              <div className="text-xs text-gray-400">Total Solvers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {(['all', 'active', 'draft', 'completed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === filter
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenge List */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No challenges yet</h3>
          <p className="text-gray-400 mb-4">Create your first challenge to start sourcing innovative solutions</p>
          <button
            onClick={() => navigate('/challenges/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => {
            const status = getStatusBadge(challenge.status);
            const daysLeft = getDaysRemaining(challenge.submissionDeadline);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{challenge.shortDescription}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatPrize(challenge.totalPrizePool)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <Users className="w-4 h-4" />
                        <span>{challenge.registeredSolversCount || 0} solvers</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <FileText className="w-4 h-4" />
                        <span>{challenge.submissionCount || 0} submissions</span>
                      </div>
                      <div className={`flex items-center gap-1 ${daysLeft > 7 ? 'text-gray-400' : 'text-yellow-400'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/challenges/${challenge.slug}`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Challenge"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => navigate(`/challenges/${challenge.slug}/manage`)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
        <Link
          to="/challenges"
          className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-gray-600 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Browse All Challenges</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </Link>
        <Link
          to="/challenges/analytics"
          className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-gray-600 transition-all group"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Challenge Analytics</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </Link>
        <Link
          to="/challenges/leaderboard"
          className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-gray-600 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Solver Leaderboard</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  );
};

// ===========================================
// SOLVER CHALLENGES TAB
// For students/job seekers who participate in challenges
// ===========================================

interface SolverChallengesTabProps {
  userId: string;
}

export const SolverChallengesTab: React.FC<SolverChallengesTabProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [registeredChallenges, setRegisteredChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  const [myTeams, setMyTeams] = useState<ChallengeTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'registered' | 'recommended' | 'teams'>('registered');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch registered challenges
        const registrations = await challengesApi.solvers.getMyRegistrations();
        setRegisteredChallenges(registrations);

        // Fetch recommended/featured challenges
        const featured = await challengesApi.challenges.getFeatured(6);
        setRecommendedChallenges(featured);

        // Fetch user's teams
        const teams = await challengesApi.teams.getMyTeams();
        setMyTeams(teams);
      } catch (error) {
        console.error('Failed to fetch challenge data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const stats = {
    registered: registeredChallenges.length,
    submitted: registeredChallenges.filter((c) => (c.status as string) === 'submitted').length,
    wins: 0, // Would come from user profile
    teams: myTeams.length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Challenges</h2>
          <p className="text-gray-400 text-sm mt-1">Participate in challenges, build your portfolio, and win prizes</p>
        </div>
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
        >
          <Target className="w-5 h-5" />
          Find Challenges
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.registered}</div>
              <div className="text-xs text-gray-400">Registered</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Send className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.submitted}</div>
              <div className="text-xs text-gray-400">Submitted</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.teams}</div>
              <div className="text-xs text-gray-400">My Teams</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {[
          { id: 'registered', label: 'My Challenges', icon: Trophy },
          { id: 'recommended', label: 'Recommended', icon: Star },
          { id: 'teams', label: 'My Teams', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as typeof activeView)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeView === tab.id
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === 'registered' && (
        <>
          {registeredChallenges.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No challenges registered</h3>
              <p className="text-gray-400 mb-4">Find challenges that match your skills and start competing</p>
              <button
                onClick={() => navigate('/challenges')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
              >
                <Target className="w-4 h-4" />
                Browse Challenges
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredChallenges.map((challenge) => {
                const status = getStatusBadge(challenge.status);
                const daysLeft = getDaysRemaining(challenge.submissionDeadline);
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{challenge.shortDescription}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1 text-green-400">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatPrize(challenge.totalPrizePool)}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${daysLeft > 7 ? 'text-gray-400' : 'text-yellow-400'}`}>
                            <Clock className="w-4 h-4" />
                            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/challenges/${challenge.slug}`}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors"
                        >
                          View Challenge
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeView === 'recommended' && (
        <div className="grid grid-cols-2 gap-4">
          {recommendedChallenges.map((challenge) => {
            const status = getStatusBadge(challenge.status);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                    {formatPrize(challenge.totalPrizePool)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{challenge.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {formatDate(challenge.submissionDeadline)}</span>
                  </div>
                  <Link
                    to={`/challenges/${challenge.slug}`}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
                  >
                    View <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeView === 'teams' && (
        <>
          {myTeams.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No teams yet</h3>
              <p className="text-gray-400 mb-4">Join or create a team to collaborate on challenges</p>
              <button
                onClick={() => navigate('/challenges?tab=teams')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Find Teams
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myTeams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                      <p className="text-gray-400 text-sm">{team.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-400">
                          <Users className="w-4 h-4 inline mr-1" />
                          {team.members.length}/{team.maxMembers} members
                        </span>
                        {team.isRecruiting && (
                          <span className="text-green-400">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Recruiting
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                      View Team
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ===========================================
// REVIEWER/JUDGE CHALLENGES TAB
// For experts who evaluate submissions
// ===========================================

interface ReviewerChallengesTabProps {
  userId: string;
}

export const ReviewerChallengesTab: React.FC<ReviewerChallengesTabProps> = ({ userId }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, fetch judge assignments
    setIsLoading(false);
    setAssignments([]);
  }, [userId]);

  const stats = {
    pending: 0,
    completed: 0,
    avgScore: 0,
    challenges: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Judging Assignments</h2>
          <p className="text-gray-400 text-sm mt-1">Review and score challenge submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-xs text-gray-400">Pending Reviews</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.avgScore}</div>
              <div className="text-xs text-gray-400">Avg Score Given</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.challenges}</div>
              <div className="text-xs text-gray-400">Challenges Judged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
          <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No judging assignments</h3>
          <p className="text-gray-400 mb-4">You will be notified when new submissions are assigned for review</p>
          <Link
            to="/provider/services"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Manage Judge Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default {
  SponsorChallengesTab,
  SolverChallengesTab,
  ReviewerChallengesTab,
};
