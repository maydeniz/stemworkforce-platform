import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  UserPlus,
  Search,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  Send,
  Plus,
  Brain,
  Code,
  Database,
  Palette,
  Server,
  Shield
} from 'lucide-react';
import type { Challenge, ChallengeTeam } from '@/types';
import { challengesApi } from '@/services/challengesApi';
import { useAuth } from '@/contexts';

interface TeamFormationModalProps {
  challenge: Challenge;
  mode: 'create' | 'join' | 'find';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (team: ChallengeTeam) => void;
}

interface RecruitingTeam extends ChallengeTeam {
  memberCount?: number;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  'Machine Learning': <Brain className="h-4 w-4" />,
  'AI': <Brain className="h-4 w-4" />,
  'Python': <Code className="h-4 w-4" />,
  'JavaScript': <Code className="h-4 w-4" />,
  'React': <Code className="h-4 w-4" />,
  'Data Science': <Database className="h-4 w-4" />,
  'UI/UX': <Palette className="h-4 w-4" />,
  'Backend': <Server className="h-4 w-4" />,
  'Security': <Shield className="h-4 w-4" />,
};

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'Machine Learning', 'Data Science',
  'React', 'Node.js', 'Cloud Computing', 'UI/UX Design',
  'Backend Development', 'Mobile Development', 'DevOps', 'Security'
];

export const TeamFormationModal: React.FC<TeamFormationModalProps> = ({
  challenge,
  mode: initialMode,
  isOpen,
  onClose,
  onSuccess
}) => {
  useAuth();
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Team State
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>([]);
  const [isRecruiting, setIsRecruiting] = useState(true);

  // Join Team State
  const [recruitingTeams, setRecruitingTeams] = useState<RecruitingTeam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<ChallengeTeam | null>(null);
  const [joinMessage, setJoinMessage] = useState('');

  // Find Teammates State
  const [skillFilter, setSkillFilter] = useState<string[]>([]);

  // Success State
  const [createdTeam, setCreatedTeam] = useState<ChallengeTeam | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'join') {
      loadRecruitingTeams();
    }
  }, [isOpen, mode]);

  const loadRecruitingTeams = async () => {
    setIsLoading(true);
    try {
      const teams = await challengesApi.teams.listRecruiting(challenge.id);
      setRecruitingTeams(teams || []);
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const team = await challengesApi.teams.create(
        challenge.id,
        teamName,
        teamDescription,
        skillsNeeded
      );

      if (team) {
        setCreatedTeam(team);
        setShowSuccess(true);
        onSuccess(team);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!selectedTeam) return;

    setIsLoading(true);
    setError(null);

    try {
      await challengesApi.teams.requestJoin(selectedTeam.id);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send join request');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkillNeeded = (skill: string) => {
    setSkillsNeeded(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredTeams = recruitingTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {mode === 'create' && 'Create Your Team'}
                  {mode === 'join' && 'Join a Team'}
                  {mode === 'find' && 'Find Teammates'}
                </h2>
                <p className="text-sm text-gray-400">{challenge.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Mode Tabs */}
          {!showSuccess && (
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setMode('create')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  mode === 'create'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Create Team
              </button>
              <button
                onClick={() => {
                  setMode('join');
                  loadRecruitingTeams();
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  mode === 'join'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Join Team
              </button>
              <button
                onClick={() => setMode('find')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  mode === 'find'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Find Teammates
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* Success State */}
              {showSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {mode === 'create' ? 'Team Created!' : 'Request Sent!'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {mode === 'create'
                      ? `"${createdTeam?.name}" is ready. Start inviting teammates!`
                      : `Your request to join "${selectedTeam?.name}" has been sent.`}
                  </p>

                  {mode === 'create' && createdTeam && (
                    <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left max-w-sm mx-auto">
                      <h4 className="text-sm font-medium text-white mb-3">Next Steps</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                          <span className="text-indigo-400">1.</span>
                          Share your team link with potential members
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-indigo-400">2.</span>
                          Review and accept join requests
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-indigo-400">3.</span>
                          Start collaborating on your solution
                        </li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Create Team */}
              {mode === 'create' && !showSuccess && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter a memorable team name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">{teamName.length}/50 characters</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Tell potential teammates about your team's approach..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      maxLength={300}
                    />
                  </div>

                  {/* Skills Needed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills Needed
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkillNeeded(skill)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            skillsNeeded.includes(skill)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {SKILL_ICONS[skill] || <Code className="h-4 w-4" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recruiting Toggle */}
                  <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecruiting}
                      onChange={(e) => setIsRecruiting(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                    />
                    <div>
                      <span className="text-sm text-white">Open to new members</span>
                      <p className="text-xs text-gray-400">
                        Allow other solvers to request to join your team
                      </p>
                    </div>
                  </label>

                  {/* Team Size Info */}
                  {challenge.teamSizeRange && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      Maximum team size: {challenge.teamSizeRange.max} members
                    </div>
                  )}
                </motion.div>
              )}

              {/* Join Team */}
              {mode === 'join' && !showSuccess && (
                <motion.div
                  key="join"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search teams..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Teams List */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                    </div>
                  ) : filteredTeams.length > 0 ? (
                    <div className="space-y-3">
                      {filteredTeams.map((team) => (
                        <div
                          key={team.id}
                          onClick={() => setSelectedTeam(team)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedTeam?.id === team.id
                              ? 'bg-indigo-500/20 border-2 border-indigo-500'
                              : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-white">{team.name}</h4>
                              {team.description && (
                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                  {team.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Users className="h-4 w-4" />
                              {team.members?.length || 1}/{challenge.teamSizeRange?.max || 5}
                            </div>
                          </div>

                          {/* Skills Needed */}
                          {team.skillsNeeded && team.skillsNeeded.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs text-gray-500">Looking for:</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {team.skillsNeeded.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded-full text-xs text-gray-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedTeam?.id === team.id && (
                            <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-indigo-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-300 mb-2">No Teams Recruiting</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Be the first to create a team for this challenge!
                      </p>
                      <button
                        onClick={() => setMode('create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Create Team
                      </button>
                    </div>
                  )}

                  {/* Join Message */}
                  {selectedTeam && (
                    <div className="pt-4 border-t border-gray-800">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={joinMessage}
                        onChange={(e) => setJoinMessage(e.target.value)}
                        placeholder="Introduce yourself and explain why you'd be a great fit..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Find Teammates */}
              {mode === 'find' && !showSuccess && (
                <motion.div
                  key="find"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">
                          AI-Powered Teammate Matching
                        </h4>
                        <p className="text-sm text-gray-400">
                          We'll match you with solvers who have complementary skills and are looking for team members.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills You're Looking For
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSkillFilter(prev =>
                            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
                          )}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            skillFilter.includes(skill)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coming Soon */}
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-300 mb-2">
                      Coming Soon
                    </h4>
                    <p className="text-sm text-gray-500">
                      AI teammate matching will be available soon. For now, browse recruiting teams or create your own!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50">
            {showSuccess ? (
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
              >
                Done
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                {mode === 'create' && (
                  <button
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || isLoading}
                    className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Team
                      </>
                    )}
                  </button>
                )}
                {mode === 'join' && selectedTeam && (
                  <button
                    onClick={handleJoinRequest}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Request to Join
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TeamFormationModal;
