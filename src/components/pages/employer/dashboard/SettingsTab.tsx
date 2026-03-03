// ===========================================
// Employer Dashboard - Settings Tab
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Bell, Shield, Globe, Palette, Link, Save, Plus, X, Trash2 } from 'lucide-react';

const INITIAL_TEAM = [
  { name: 'Jennifer Walsh', email: 'j.walsh@nexustech.com', role: 'Admin', status: 'active', avatar: 'JW' },
  { name: 'Marcus Chen', email: 'm.chen@nexustech.com', role: 'Recruiter', status: 'active', avatar: 'MC' },
  { name: 'Sarah Thompson', email: 's.thompson@nexustech.com', role: 'Hiring Manager', status: 'active', avatar: 'ST' },
  { name: 'David Kim', email: 'd.kim@nexustech.com', role: 'Recruiter', status: 'active', avatar: 'DK' },
  { name: 'Lisa Rodriguez', email: 'l.rodriguez@nexustech.com', role: 'Recruiter', status: 'invited', avatar: 'LR' },
];

const INITIAL_NOTIFICATIONS = [
  { label: 'New applications', description: 'Get notified when candidates apply to your jobs', enabled: true },
  { label: 'Pipeline updates', description: 'Alerts when candidates move through stages', enabled: true },
  { label: 'Event reminders', description: 'Reminders for upcoming recruiting events', enabled: true },
  { label: 'Weekly digest', description: 'Summary of recruiting activity each Monday', enabled: false },
  { label: 'Clearance updates', description: 'Status changes for clearance processing', enabled: true },
];

const INITIAL_INTEGRATIONS = [
  { name: 'Greenhouse ATS', status: 'Connected', color: 'emerald' },
  { name: 'LinkedIn Recruiter', status: 'Connected', color: 'emerald' },
  { name: 'Slack Notifications', status: 'Connected', color: 'emerald' },
  { name: 'Workday HCM', status: 'Not Connected', color: 'gray' },
];

const SettingsTab: React.FC = () => {
  const [showToast, setShowToast] = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState<typeof INITIAL_TEAM[0] | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  const toggleNotification = (index: number) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, enabled: !n.enabled } : n));
  };

  const toggleIntegration = (name: string) => {
    const integration = integrations.find(i => i.name === name);
    if (integration && integration.status === 'Connected') {
      setShowDisconnectModal(name);
    } else {
      setIntegrations(prev => prev.map(i => i.name === name ? { ...i, status: 'Connected', color: 'emerald' } : i));
      triggerToast(`${name} connected!`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {showToast}
        </div>
      )}

      {/* Company Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-400" /> Company Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Company Name</label>
            <input type="text" defaultValue="Nexus Technologies" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Industry</label>
            <input type="text" defaultValue="Defense & Technology" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Headquarters</label>
            <input type="text" defaultValue="Arlington, VA" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Company Size</label>
            <input type="text" defaultValue="1,000 - 5,000 employees" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea defaultValue="Leading defense and technology company specializing in AI, cybersecurity, and advanced computing solutions for national security applications." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
          </div>
        </div>
        <button onClick={() => triggerToast('Company profile saved successfully!')} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </motion.div>

      {/* Team Members */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Team Members</h3>
          <button onClick={() => setShowInviteModal(true)} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Invite Member
          </button>
        </div>
        <div className="space-y-2">
          {INITIAL_TEAM.map((member) => (
            <div key={member.email} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{member.avatar}</div>
                <div>
                  <div className="text-white text-sm font-medium">{member.name}</div>
                  <div className="text-gray-500 text-xs">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{member.role}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{member.status}</span>
                {member.role !== 'Admin' && (
                  <button onClick={() => setShowRemoveMemberModal(member)} className="p-1 text-gray-500 hover:text-red-400 transition-colors" title="Remove member">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-400" /> Notification Preferences</h3>
        <div className="space-y-4">
          {notifications.map((pref, index) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">{pref.label}</div>
                <div className="text-gray-500 text-xs">{pref.description}</div>
              </div>
              <button
                onClick={() => { toggleNotification(index); triggerToast(`${pref.label} ${!pref.enabled ? 'enabled' : 'disabled'}`); }}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${pref.enabled ? 'bg-emerald-500' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${pref.enabled ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => triggerToast('Notification preferences saved!')} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Link className="w-5 h-5 text-purple-400" /> Integrations</h3>
        <div className="grid grid-cols-2 gap-3">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-white text-sm font-medium">{integration.name}</span>
              <button
                onClick={() => toggleIntegration(integration.name)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  integration.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {integration.status}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                <input type="email" placeholder="colleague@nexustech.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <input type="text" placeholder="e.g. John Smith" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Role</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>Recruiter</option>
                  <option>Hiring Manager</option>
                  <option>Admin</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowInviteModal(false); triggerToast('Invitation sent!'); }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRemoveMemberModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Remove Team Member?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to remove <span className="text-white font-medium">{showRemoveMemberModal.name}</span> from the team? They will lose access to the employer dashboard.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{showRemoveMemberModal.avatar}</div>
                <div>
                  <div className="text-white text-sm font-medium">{showRemoveMemberModal.name}</div>
                  <div className="text-gray-500 text-xs">{showRemoveMemberModal.email} &middot; {showRemoveMemberModal.role}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRemoveMemberModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { setShowRemoveMemberModal(null); triggerToast(`${showRemoveMemberModal.name} removed from team`); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Integration Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDisconnectModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Disconnect Integration?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to disconnect <span className="text-white font-medium">{showDisconnectModal}</span>? You can reconnect it later.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDisconnectModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => {
                const name = showDisconnectModal;
                setIntegrations(prev => prev.map(i => i.name === name ? { ...i, status: 'Not Connected', color: 'gray' } : i));
                setShowDisconnectModal(null);
                triggerToast(`${name} disconnected`);
              }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
