// ===========================================
// SPONSOR CHALLENGE DASHBOARD
// Comprehensive challenge management for sponsors
// ===========================================

import { useState, useEffect, type FC, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  FileText,
  BarChart3,
  Settings,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  MessageSquare,
  Award,
  Search,
  Download,
  Mail,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  UserPlus,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { Challenge, ChallengeSubmission, ChallengeSolver } from '@/types';
import { challengesApi } from '@/services/challengesApi';

interface SponsorChallengeDashboardProps {
  challengeId: string;
  challenge: Challenge;
}

type TabType = 'overview' | 'submissions' | 'participants' | 'analytics' | 'judges' | 'settings';

export const SponsorChallengeDashboard: FC<SponsorChallengeDashboardProps> = ({
  challengeId,
  challenge,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [participants, setParticipants] = useState<ChallengeSolver[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subs, parts] = await Promise.all([
          challengesApi.sponsor.getSubmissions(challengeId),
          challengesApi.sponsor.getSolvers(challengeId),
        ]);
        setSubmissions(subs || []);
        setParticipants(parts || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [challengeId]);

  const getDaysRemaining = (): number => {
    const end = new Date(challenge.submissionDeadline);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatPrize = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: ElementType }> = {
      draft: { color: 'bg-gray-500/20 text-gray-400', icon: Edit },
      'pending-approval': { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
      'registration-open': { color: 'bg-green-500/20 text-green-400', icon: UserPlus },
      active: { color: 'bg-blue-500/20 text-blue-400', icon: TrendingUp },
      'submission-closed': { color: 'bg-orange-500/20 text-orange-400', icon: XCircle },
      judging: { color: 'bg-purple-500/20 text-purple-400', icon: Star },
      'winners-announced': { color: 'bg-green-500/20 text-green-400', icon: Trophy },
      completed: { color: 'bg-gray-500/20 text-gray-400', icon: CheckCircle },
    };
    const config = statusMap[status] || statusMap.draft;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <config.icon className="w-4 h-4" />
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'submissions', label: 'Submissions', icon: FileText, count: submissions.length },
    { id: 'participants', label: 'Participants', icon: Users, count: participants.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'judges', label: 'Judges', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = {
    registrations: participants.length,
    submissions: submissions.length,
    pendingReview: submissions.filter(s => s.status === 'under-review').length,
    reviewed: submissions.filter(s => ['scored', 'finalist', 'winner'].includes(s.status)).length,
    daysRemaining: getDaysRemaining(),
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
                {getStatusBadge(challenge.status)}
              </div>
              <p className="text-gray-400 max-w-2xl">{challenge.shortDescription}</p>
              <div className="flex items-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <DollarSign className="w-4 h-4" />
                  {formatPrize(challenge.totalPrizePool)} Prize Pool
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(challenge.submissionDeadline).toLocaleDateString()}
                </span>
                <span className={`flex items-center gap-1 ${stats.daysRemaining <= 7 ? 'text-red-400' : 'text-gray-400'}`}>
                  <Clock className="w-4 h-4" />
                  {stats.daysRemaining > 0 ? `${stats.daysRemaining} days left` : 'Closed'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/challenges/${challenge.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Public Page
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit Challenge
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-4 mt-8">
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.registrations}</div>
                  <div className="text-xs text-gray-400">Registered</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.submissions}</div>
                  <div className="text-xs text-gray-400">Submissions</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.pendingReview}</div>
                  <div className="text-xs text-gray-400">Pending Review</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.reviewed}</div>
                  <div className="text-xs text-gray-400">Reviewed</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stats.submissions > 0 ? Math.round((stats.submissions / stats.registrations) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-400">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 bg-gray-700 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Activity Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {submissions.slice(0, 5).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                          {sub.title?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{sub.title}</p>
                          <p className="text-xs text-gray-500">
                            Submitted {new Date(sub.submittedAt || sub.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          sub.status === 'submitted' ? 'bg-blue-500/20 text-blue-400' :
                          sub.status === 'scored' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    ))}
                    {submissions.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No submissions yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {stats.pendingReview > 0 && (
                      <button
                        onClick={() => setActiveTab('submissions')}
                        className="w-full flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-yellow-400" />
                          <span className="text-white">Review {stats.pendingReview} pending submissions</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-yellow-400" />
                      </button>
                    )}
                    <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Send announcement to participants</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <UserPlus className="w-5 h-5 text-green-400" />
                        <span className="text-white">Invite judges</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Export all submissions</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Registration Trend Chart Placeholder */}
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Registration & Submission Trends
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  [Chart visualization would go here]
                </div>
              </div>
            </motion.div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search submissions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="scored">Scored</option>
                  <option value="passed-screening">Passed Screening</option>
                  <option value="finalist">Finalist</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Submissions List */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800/80">
                    <tr className="text-left text-xs font-medium text-gray-400 uppercase">
                      <th className="px-4 py-3">Submission</th>
                      <th className="px-4 py-3">Solver/Team</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {submissions
                      .filter(s => statusFilter === 'all' || s.status === statusFilter)
                      .filter(s => !searchQuery || s.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-white">{submission.title}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">{submission.summary}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {submission.solverType === 'team' ? 'Team' : 'Individual'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              submission.status === 'submitted' ? 'bg-blue-500/20 text-blue-400' :
                              submission.status === 'scored' ? 'bg-green-500/20 text-green-400' :
                              submission.status === 'passed-screening' ? 'bg-yellow-500/20 text-yellow-400' :
                              submission.status === 'finalist' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {submission.finalScore?.toFixed(2) || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm">
                            {new Date(submission.submittedAt || submission.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                                <Star className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {submissions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No submissions yet
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <motion.div
              key="participants"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export List
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  Email All
                </button>
              </div>

              {/* Participants Grid */}
              <div className="grid grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {participant.userId.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{participant.userId}</h4>
                        <p className="text-sm text-gray-400">
                          Registered {new Date(participant.registeredAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            participant.type === 'team-member'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {participant.type}
                          </span>
                          {participant.status === 'submitted' && (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Submitted
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {participants.length === 0 && (
                <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No participants yet</h3>
                  <p className="text-gray-400">Share your challenge to attract solvers</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Conversion Rate</h3>
                  <div className="text-3xl font-bold text-white">
                    {stats.registrations > 0
                      ? Math.round((stats.submissions / stats.registrations) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Registrations to submissions</p>
                </div>
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Avg. Time to Submit</h3>
                  <div className="text-3xl font-bold text-white">14d</div>
                  <p className="text-xs text-gray-500 mt-1">From registration to submission</p>
                </div>
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Page Views</h3>
                  <div className="text-3xl font-bold text-white">2,458</div>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +12% this week
                  </p>
                </div>
              </div>

              {/* Charts placeholder */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Registration Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    [Line chart visualization]
                  </div>
                </div>
                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    [Pie chart visualization]
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Participant Demographics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">45%</div>
                    <div className="text-sm text-gray-400">Students</div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">30%</div>
                    <div className="text-sm text-gray-400">Professionals</div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">15%</div>
                    <div className="text-sm text-gray-400">Startups</div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">10%</div>
                    <div className="text-sm text-gray-400">Researchers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Judges Tab */}
          {activeTab === 'judges' && (
            <motion.div
              key="judges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Assigned Judges</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Invite Judge
                </button>
              </div>

              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No judges assigned yet</h3>
                <p className="text-gray-400 mb-4">Invite experts to review submissions</p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Invite Your First Judge
                </button>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Challenge Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Public Visibility</h4>
                      <p className="text-sm text-gray-400">Allow the challenge to be discovered publicly</p>
                    </div>
                    <button className="relative w-12 h-6 bg-green-500 rounded-full">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Accept New Registrations</h4>
                      <p className="text-sm text-gray-400">Allow new participants to register</p>
                    </div>
                    <button className="relative w-12 h-6 bg-green-500 rounded-full">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Show Leaderboard</h4>
                      <p className="text-sm text-gray-400">Display public leaderboard to participants</p>
                    </div>
                    <button className="relative w-12 h-6 bg-gray-700 rounded-full">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                    <XCircle className="w-4 h-4" />
                    Cancel Challenge
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete Challenge
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SponsorChallengeDashboard;
