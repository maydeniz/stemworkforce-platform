// ===========================================
// Settings Tab - Nonprofit Partner Dashboard
// Organization settings and account management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Users,
  Download,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  ExternalLink,
  Key,
  FileText,
  X,
  Copy
} from 'lucide-react';
import type { NonprofitPartner, PartnerTier } from '@/types/nonprofitPartner';

interface SettingsTabProps {
  partnerId: string;
  tier: PartnerTier;
  partner?: NonprofitPartner;
}

const NONPROFIT_TYPES = [
  { value: 'workforce_development', label: 'Workforce Development' },
  { value: 'stem_education', label: 'STEM Education' },
  { value: 'professional_association', label: 'Professional Association' },
  { value: 'dei_organization', label: 'DEI Organization' },
  { value: 'other', label: 'Other' }
];

const TIER_INFO: Record<PartnerTier, { name: string; price: string; features: string[] }> = {
  community: {
    name: 'Community',
    price: 'Free',
    features: ['Basic participant tracking', 'Up to 3 programs', 'Community support']
  },
  impact: {
    name: 'Impact',
    price: '$249/month',
    features: ['Unlimited programs', 'Grant reporting tools', 'Employer partnerships', 'Priority support']
  },
  coalition: {
    name: 'Coalition',
    price: 'Custom',
    features: ['Everything in Impact', 'Coalition collaboration', 'Data sharing', 'Dedicated support', 'Custom integrations']
  }
};

interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: string;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ partnerId: _partnerId, tier, partner }) => {
  const [activeSection, setActiveSection] = useState<'organization' | 'billing' | 'notifications' | 'team' | 'data'>('organization');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsNotification, setSettingsNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState<TeamMember | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Program Manager');

  // Notification toggles state
  const [notificationToggles, setNotificationToggles] = useState([
    { title: 'New Participant Enrolled', desc: 'When a new participant joins a program', enabled: true },
    { title: 'Placement Updates', desc: 'When a participant is placed with an employer', enabled: true },
    { title: 'Grant Report Reminders', desc: 'Upcoming grant reporting deadlines', enabled: true },
    { title: 'Coalition Activity', desc: 'Updates from your coalition partners', enabled: tier === 'coalition' },
    { title: 'Weekly Summary', desc: 'Weekly digest of key metrics', enabled: false },
    { title: 'Marketing & Tips', desc: 'Best practices and platform updates', enabled: false }
  ]);

  // Team state
  const [team, setTeam] = useState<TeamMember[]>([
    { name: 'Maria Rodriguez', email: 'maria@stemfutures.org', role: 'Admin', status: 'active' },
    { name: 'James Chen', email: 'james@stemfutures.org', role: 'Program Manager', status: 'active' },
    { name: 'Sarah Williams', email: 'sarah@stemfutures.org', role: 'Case Manager', status: 'active' }
  ]);

  useEffect(() => {
    if (settingsNotification) {
      const timer = setTimeout(() => setSettingsNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [settingsNotification]);

  // Form state
  const [orgName, setOrgName] = useState(partner?.organizationName || 'STEM Futures Foundation');
  const [nonprofitType, setNonprofitType] = useState<string>(partner?.nonprofitType || 'workforce_development');
  const [mission, setMission] = useState(partner?.mission || 'Empowering underserved communities with STEM skills for sustainable careers.');
  const [ein, setEin] = useState(partner?.ein || '12-3456789');
  const [website, setWebsite] = useState(partner?.website || 'https://stemfutures.org');
  const [city, setCity] = useState(partner?.city || 'San Francisco');
  const [state, setState] = useState(partner?.state || 'CA');

  // Contact info
  const [contactName, setContactName] = useState(partner?.primaryContactName || 'Maria Rodriguez');
  const [contactEmail, setContactEmail] = useState(partner?.primaryContactEmail || 'maria@stemfutures.org');
  const [contactPhone, setContactPhone] = useState(partner?.primaryContactPhone || '(415) 555-0123');
  const [contactTitle, setContactTitle] = useState(partner?.primaryContactTitle || 'Executive Director');

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tierInfo = TIER_INFO[tier];

  const sections = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team Access', icon: Users },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  return (
    <div className="space-y-4">
      {/* Notification Banner */}
      {settingsNotification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          settingsNotification.type === 'success'
            ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400'
            : settingsNotification.type === 'error'
            ? 'bg-red-500/20 border border-red-500/30 text-red-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{settingsNotification.message}</span>
          <button onClick={() => setSettingsNotification(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Organization Settings */}
          {activeSection === 'organization' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Organization Profile</h2>
                <p className="text-gray-400">Manage your organization's information</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Type
                    </label>
                    <select
                      value={nonprofitType}
                      onChange={(e) => setNonprofitType(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    >
                      {NONPROFIT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mission Statement
                  </label>
                  <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        EIN (Tax ID)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ein}
                      onChange={(e) => setEin(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </span>
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        City
                      </span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-400" />
                  Primary Contact
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeSection === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Billing & Subscription</h2>
                <p className="text-gray-400">Manage your subscription and payment methods</p>
              </div>

              {/* Current Plan */}
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{tierInfo.name} Plan</h3>
                    <p className="text-gray-300">{tierInfo.price}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    Active
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {tierInfo.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier !== 'coalition' && (
                  <button
                    onClick={() => window.location.href = '/education-partner-apply?type=nonprofit&plan=upgrade'}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Upgrade Plan
                  </button>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-pink-400" />
                  Payment Method
                </h3>
                {tier === 'community' ? (
                  <p className="text-gray-400">No payment method required for free tier.</p>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                        VISA
                      </div>
                      <div>
                        <p className="text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-400">Expires 12/26</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>

              {/* Billing History */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                {tier === 'community' ? (
                  <p className="text-gray-400">No billing history available.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div>
                        <p className="text-white">January 2025</p>
                        <p className="text-sm text-gray-400">Impact Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">$249.00</p>
                        <span className="text-xs text-emerald-400">Paid</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-white">December 2024</p>
                        <p className="text-sm text-gray-400">Impact Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">$249.00</p>
                        <span className="text-xs text-emerald-400">Paid</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Notification Preferences</h2>
                <p className="text-gray-400">Control how you receive updates</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
                {notificationToggles.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setNotificationToggles(prev => prev.map((t, idx) => idx === i ? { ...t, enabled: !t.enabled } : t));
                        setSettingsNotification({ type: 'success', message: `${item.title} notifications ${item.enabled ? 'disabled' : 'enabled'}.` });
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.enabled ? 'bg-pink-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          item.enabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Access Settings */}
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Team Access</h2>
                  <p className="text-gray-400">Manage who can access your dashboard</p>
                </div>
                <button
                  onClick={() => { setInviteEmail(''); setInviteRole('Program Manager'); setShowInviteModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Invite Member
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
                {team.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <span className="text-pink-400 font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={member.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setTeam(prev => prev.map((m, idx) => idx === i ? { ...m, role: newRole } : m));
                          setSettingsNotification({ type: 'success', message: `${member.name}'s role updated to ${newRole}.` });
                        }}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Program Manager">Program Manager</option>
                        <option value="Case Manager">Case Manager</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button
                        onClick={() => setShowRemoveMemberModal(member)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* API Access */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-pink-400" />
                  API Access
                </h3>
                <p className="text-gray-400 mb-4">
                  Generate API keys to integrate with your existing systems.
                </p>
                <button
                  onClick={() => {
                    const key = `np_live_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
                    setGeneratedApiKey(key);
                    setShowApiKeyModal(true);
                  }}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Generate API Key
                </button>
              </div>
            </div>
          )}

          {/* Data & Export Settings */}
          {activeSection === 'data' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Data Management</h2>
                <p className="text-gray-400">Export data and manage your information</p>
              </div>

              {/* Export Options */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-pink-400" />
                  Export Data
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Participants', desc: 'All participant records and milestones' },
                    { name: 'Programs', desc: 'Program details and enrollments' },
                    { name: 'Grants', desc: 'Grant tracking and reports' },
                    { name: 'Employers', desc: 'Employer connections and placements' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setSettingsNotification({ type: 'success', message: `Exporting ${item.name} data as CSV. Your download will begin shortly.` })}
                        className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Retention */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-pink-400" />
                  Data Retention & Privacy
                </h3>
                <p className="text-gray-400 mb-4">
                  Your participant data is retained according to grant requirements and regulatory compliance.
                  Standard retention period is 7 years after program completion.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open('/privacy-policy', '_blank')}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    View Privacy Policy
                  </button>
                  <button
                    onClick={() => setSettingsNotification({ type: 'info', message: 'Opening Data Processing Agreement document. This will open in a new tab.' })}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Data Processing Agreement
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </h3>
                <p className="text-gray-400 mb-4">
                  Permanently delete your organization account and all associated data.
                  This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirmModal(true)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                >
                  Delete Organization Account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@organization.org" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                  <option value="Admin">Admin</option>
                  <option value="Program Manager">Program Manager</option>
                  <option value="Case Manager">Case Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (!inviteEmail) return;
                  setShowInviteModal(false);
                  setSettingsNotification({ type: 'success', message: `Invitation sent to ${inviteEmail} as ${inviteRole}.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRemoveMemberModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Remove Team Member</h3>
              <button onClick={() => setShowRemoveMemberModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{showRemoveMemberModal.name}</span> ({showRemoveMemberModal.email}) from the team? They will immediately lose access to the dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRemoveMemberModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  const memberName = showRemoveMemberModal.name;
                  setTeam(prev => prev.filter(m => m.email !== showRemoveMemberModal.email));
                  setShowRemoveMemberModal(null);
                  setSettingsNotification({ type: 'success', message: `${memberName} has been removed from the team.` });
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && generatedApiKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowApiKeyModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">API Key Generated</h3>
              <button onClick={() => setShowApiKeyModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Copy this key now. For security, it will not be shown again.
            </p>
            <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
              <code className="text-pink-400 text-sm flex-1 break-all">{generatedApiKey}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedApiKey);
                  setSettingsNotification({ type: 'success', message: 'API key copied to clipboard.' });
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowApiKeyModal(false)} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Billing Address</label>
                <input type="text" placeholder="123 Main St, City, State" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSettingsNotification({ type: 'success', message: 'Payment method updated successfully.' });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Update Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-400">Delete Organization Account</h3>
              <button onClick={() => setShowDeleteConfirmModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
              <p className="text-red-400 text-sm font-semibold mb-2">This action cannot be undone.</p>
              <p className="text-gray-400 text-sm">
                All data including participants, programs, grants, employer connections, and reports will be permanently deleted. Active grant obligations may still need to be fulfilled.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirmModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSettingsNotification({ type: 'success', message: 'Account deletion request submitted. You will receive a confirmation email within 24 hours.' });
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
