// ===========================================
// TEAM DASHBOARD
// Team collaboration hub for challenge participants
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  FileText,
  Link as LinkIcon,
  Settings,
  Crown,
  UserMinus,
  UserPlus,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Bell,
  Shield,
} from 'lucide-react';
import { ChallengeTeam, Challenge } from '@/types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'lead' | 'member';
  skills: string[];
  joinedAt: string;
  contributionScore?: number;
  isOnline?: boolean;
}

interface TeamDashboardProps {
  team: ChallengeTeam;
  challenge: Challenge;
  currentUserId: string;
  onUpdateTeam: (updates: Partial<ChallengeTeam>) => Promise<void>;
  onInviteMember: (email: string, message: string) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onLeaveTeam: () => Promise<void>;
  onPromoteMember?: (memberId: string) => Promise<void>;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({
  team,
  challenge,
  currentUserId,
  onUpdateTeam,
  onInviteMember,
  onRemoveMember,
  onLeaveTeam,
  onPromoteMember,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const isTeamLead = team.leaderId === currentUserId;
  const inviteLink = `${window.location.origin}/teams/join/${team.inviteCode}`;

  const members: TeamMember[] = team.members || [];

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsSending(true);
    try {
      await onInviteMember(inviteEmail, inviteMessage);
      setInviteEmail('');
      setInviteMessage('');
      setIsInviting(false);
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setIsSending(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedInviteLink(true);
    setTimeout(() => setCopiedInviteLink(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'members', label: `Members (${members.length})`, icon: Users },
    ...(isTeamLead ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-gray-700 rounded-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                <p className="text-gray-400 text-sm">
                  Competing in: {challenge.title}
                </p>
              </div>
            </div>
            {team.description && (
              <p className="text-gray-300 mt-2">{team.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {team.isRecruiting && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                Recruiting
              </span>
            )}
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
              {members.length}/{team.maxMembers} members
            </span>
          </div>
        </div>

        {/* Team stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <div className="text-xs text-gray-400">Team Members</div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {Array.from(new Set(members.flatMap(m => m.skills))).length}
            </div>
            <div className="text-xs text-gray-400">Unique Skills</div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-gray-400">Formed</div>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">Active</div>
            <div className="text-xs text-gray-400">Status</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Skills Overview */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Team Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(members.flatMap(m => m.skills))).map((skill) => {
                  const count = members.filter(m => m.skills.includes(skill)).length;
                  return (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full"
                    >
                      {skill}
                      {count > 1 && (
                        <span className="ml-1 text-blue-400">×{count}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Skills Needed */}
            {team.skillsNeeded && team.skillsNeeded.length > 0 && (
              <div className="p-4 bg-gray-800/50 border border-yellow-500/30 rounded-xl">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Skills We're Looking For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {team.skillsNeeded.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              {isTeamLead && members.length < team.maxMembers && (
                <button
                  onClick={() => setIsInviting(true)}
                  className="flex items-center justify-center gap-2 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all"
                >
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Invite Member</span>
                </button>
              )}
              <button
                onClick={copyInviteLink}
                className="flex items-center justify-center gap-2 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all"
              >
                {copiedInviteLink ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Copy Invite Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{member.name}</h4>
                        {member.role === 'lead' && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            <Crown className="w-3 h-3" />
                            Lead
                          </span>
                        )}
                        {member.id === currentUserId && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{member.email}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-500 text-xs">
                            +{member.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isTeamLead && member.id !== currentUserId && (
                      <>
                        {onPromoteMember && member.role !== 'lead' && (
                          <button
                            onClick={() => onPromoteMember(member.id)}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                            title="Make team lead"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove from team"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {member.id === currentUserId && !isTeamLead && (
                      <button
                        onClick={() => setShowLeaveConfirm(true)}
                        className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 text-sm rounded-lg transition-colors"
                      >
                        Leave Team
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Invite section */}
            {isTeamLead && members.length < team.maxMembers && (
              <button
                onClick={() => setIsInviting(true)}
                className="w-full p-4 border-2 border-dashed border-gray-700 rounded-xl hover:border-purple-500/50 transition-all text-gray-400 hover:text-white flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Team Member ({team.maxMembers - members.length} spots left)
              </button>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && isTeamLead && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Team Settings Form */}
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
              <h3 className="font-semibold text-white">Team Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  defaultValue={team.name}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  defaultValue={team.description}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Recruiting</h4>
                  <p className="text-sm text-gray-400">
                    Allow others to find and request to join your team
                  </p>
                </div>
                <button
                  onClick={() => onUpdateTeam({ isRecruiting: !team.isRecruiting })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    team.isRecruiting ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      team.isRecruiting ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-colors">
                Save Changes
              </button>
            </div>

            {/* Danger Zone */}
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <h3 className="font-semibold text-red-400 mb-4">Danger Zone</h3>
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors"
              >
                Dissolve Team
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsInviting(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Invite Team Member</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Send an invite link to a potential teammate
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Invite link */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Share invite link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm"
                    />
                    <button
                      onClick={copyInviteLink}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {copiedInviteLink ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-gray-500 text-sm">or send email invite</span>
                  <div className="flex-1 h-px bg-gray-700" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Personal message (optional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={3}
                    placeholder="Hey! Want to team up for this challenge?"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setIsInviting(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isSending}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaveConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isTeamLead ? 'Dissolve Team?' : 'Leave Team?'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isTeamLead
                    ? 'This will remove all members and delete the team. This action cannot be undone.'
                    : 'You will lose access to the team and any shared resources.'}
                </p>
              </div>

              <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onLeaveTeam}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-medium rounded-lg transition-colors"
                >
                  {isTeamLead ? 'Dissolve Team' : 'Leave Team'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamDashboard;
