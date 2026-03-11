// ===========================================
// Settings Tab - Industry Partner Dashboard
// Account, notifications, and company settings
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Bell,
  Shield,
  Globe,
  Mail,
  Users,
  Key,
  Save,
  Loader2,
  Check,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

interface SettingsTabProps {
  partnerId: string;
  companyName: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  status: 'active' | 'pending';
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_NOTIFICATIONS: NotificationSetting[] = [
  {
    id: 'new_applications',
    label: 'New Applications',
    description: 'Get notified when candidates apply to your job postings',
    enabled: true
  },
  {
    id: 'candidate_updates',
    label: 'Candidate Updates',
    description: 'Receive updates when candidates move through your pipeline',
    enabled: true
  },
  {
    id: 'event_reminders',
    label: 'Event Reminders',
    description: 'Reminders for upcoming recruiting events and career fairs',
    enabled: true
  },
  {
    id: 'weekly_digest',
    label: 'Weekly Digest',
    description: 'Weekly summary of recruiting activity and metrics',
    enabled: false
  },
  {
    id: 'program_updates',
    label: 'Program Updates',
    description: 'Updates about your internship and apprenticeship programs',
    enabled: true
  },
  {
    id: 'platform_news',
    label: 'Platform News',
    description: 'New features and updates from the STEM Workforce platform',
    enabled: false
  }
];

const SAMPLE_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'recruiter',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'viewer',
    status: 'pending'
  }
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const SettingsTab: React.FC<SettingsTabProps> = ({ partnerId, companyName }) => {
  const [activeSection, setActiveSection] = useState<'company' | 'notifications' | 'team' | 'security'>('company');
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [team, setTeam] = useState(SAMPLE_TEAM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter' | 'viewer'>('recruiter');
  const [inviting, setInviting] = useState(false);
  const [settingsNotification, setSettingsNotification] = useState<string | null>(null);

  // Company settings state
  const [companySettings, setCompanySettings] = useState({
    displayName: companyName,
    website: 'https://company.com',
    linkedIn: 'https://linkedin.com/company/example',
    headquarters: 'San Francisco, CA',
    employeeCount: '1000-5000',
    industry: 'Technology',
    description: 'Leading technology company focused on innovation and talent development.'
  });

  // Security settings state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      setSettingsNotification('Please enter an email address');
      return;
    }
    setInviting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTeam(prev => [...prev, {
      id: `new-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending' as const
    }]);
    setInviting(false);
    setShowInviteModal(false);
    const sentEmail = inviteEmail;
    setInviteEmail('');
    setSettingsNotification(`Invitation sent to ${sentEmail}`);
    setTimeout(() => setSettingsNotification(null), 4000);
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSettingsNotification('Please fill in all password fields');
      setTimeout(() => setSettingsNotification(null), 4000);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSettingsNotification('New passwords do not match');
      setTimeout(() => setSettingsNotification(null), 4000);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setSettingsNotification('Password must be at least 8 characters');
      setTimeout(() => setSettingsNotification(null), 4000);
      return;
    }
    setUpdatingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUpdatingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSettingsNotification('Password updated successfully');
    setTimeout(() => setSettingsNotification(null), 4000);
  };

  const handleEnable2FA = async () => {
    setEnabling2FA(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEnabling2FA(false);
    setSettingsNotification('2FA setup initiated. In production, a QR code would display for your authenticator app.');
    setTimeout(() => setSettingsNotification(null), 5000);
  };

  const handleDeleteAccount = async () => {
    setSettingsNotification('Account deletion requires contacting support. Please email support@stemworkforce.net.');
    setTimeout(() => setSettingsNotification(null), 6000);
    setShowDeleteConfirm(false);
  };

  const sections = [
    { id: 'company' as const, label: 'Company Profile', icon: Building2 },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'team' as const, label: 'Team Access', icon: Users },
    { id: 'security' as const, label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {settingsNotification && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-between text-emerald-400">
          <span>{settingsNotification}</span>
          <button onClick={() => setSettingsNotification(null)} className="ml-4 text-emerald-300 hover:text-white">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-gray-400">Manage your account and company settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Company Profile */}
          {activeSection === 'company' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Company Profile</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.displayName}
                    onChange={(e) => setCompanySettings({ ...companySettings, displayName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Industry
                  </label>
                  <select
                    value={companySettings.industry}
                    onChange={(e) => setCompanySettings({ ...companySettings, industry: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Energy">Energy</option>
                    <option value="Aerospace">Aerospace & Defense</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" /> Website
                  </label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    LinkedIn Page
                  </label>
                  <input
                    type="url"
                    value={companySettings.linkedIn}
                    onChange={(e) => setCompanySettings({ ...companySettings, linkedIn: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={companySettings.headquarters}
                    onChange={(e) => setCompanySettings({ ...companySettings, headquarters: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Company Size
                  </label>
                  <select
                    value={companySettings.employeeCount}
                    onChange={(e) => setCompanySettings({ ...companySettings, employeeCount: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1,000 employees</option>
                    <option value="1000-5000">1,000-5,000 employees</option>
                    <option value="5000+">5,000+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Company Description
                </label>
                <textarea
                  value={companySettings.description}
                  onChange={(e) => setCompanySettings({ ...companySettings, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Tell candidates about your company..."
                />
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Partner ID: <span className="text-gray-300 font-mono">{partnerId}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
              </div>

              <div className="space-y-4">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <h4 className="text-white font-medium">{notification.label}</h4>
                      <p className="text-sm text-gray-400">{notification.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notification.enabled ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notification.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium">Email Delivery</p>
                    <p className="text-sm text-gray-400">
                      Notifications are sent to your account email. Make sure your email is verified to receive updates.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Access */}
          {activeSection === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  Invite Member
                </button>
              </div>

              <div className="space-y-3">
                {team.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <span className="text-emerald-400 font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {member.status}
                      </span>
                      <select
                        value={member.role}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                        onChange={(e) => {
                          const newRole = e.target.value as 'admin' | 'recruiter' | 'viewer';
                          setTeam(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Role Permissions</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-emerald-400 font-medium">Admin</p>
                    <p className="text-gray-400">Full access to all settings, billing, and team management</p>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-medium">Recruiter</p>
                    <p className="text-gray-400">Manage jobs, candidates, events, and programs</p>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-medium">Viewer</p>
                    <p className="text-gray-400">View-only access to dashboard and reports</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    disabled={updatingPassword}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {updatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Authenticator App</h4>
                    <p className="text-sm text-gray-400">Use an authenticator app for additional security</p>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    disabled={enabling2FA}
                    className="px-4 py-2 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {enabling2FA && <Loader2 className="w-4 h-4 animate-spin" />}
                    {enabling2FA ? 'Setting up...' : 'Enable 2FA'}
                  </button>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
                </div>

                {!showDeleteConfirm ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Delete Account</h4>
                      <p className="text-sm text-gray-400">Permanently delete your partner account and all data</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-400">
                      Are you sure you want to delete your account? This action cannot be undone.
                      All your data, job postings, and candidate information will be permanently removed.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                      >
                        Yes, Delete My Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'recruiter' | 'viewer')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
