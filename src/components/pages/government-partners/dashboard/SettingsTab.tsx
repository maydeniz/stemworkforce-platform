// ===========================================
// Settings Tab - Account & Organization Settings
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  User,
  Mail,
  Phone,
  CreditCard,
  Bell,
  Shield,
  Users,
  Settings,
  Save,
  CheckCircle,
  Loader2,
  Crown,
  Zap,
  Building,
  Plus
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { GovernmentPartner, GovernmentPartnerTier, AgencyType, AgencyLevel } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface SettingsTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
  partner: GovernmentPartner | null;
}

type SettingsSection = 'organization' | 'contact' | 'billing' | 'notifications' | 'team' | 'security';

// ===========================================
// CONFIG
// ===========================================

const tierConfig: Record<GovernmentPartnerTier, { label: string; color: string; icon: React.ElementType; price: string }> = {
  basic: { label: 'Agency Starter', color: 'slate', icon: Building, price: 'Free' },
  standard: { label: 'Government Partner', color: 'blue', icon: Zap, price: '$4,999/mo' },
  enterprise: { label: 'Enterprise', color: 'purple', icon: Crown, price: 'Custom' },
};

// Static Tailwind color map
const govTwColor: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

const agencyTypeLabels: Record<AgencyType, string> = {
  workforce_board: 'State/Local Workforce Board',
  federal_agency: 'Federal Agency',
  state_agency: 'State Agency',
  economic_development: 'Economic Development Agency',
  education_department: 'Education Department',
  labor_department: 'Labor Department',
  chips_designated: 'CHIPS Act Designated Entity',
  other: 'Other Government Entity'
};

const agencyLevelLabels: Record<AgencyLevel, string> = {
  federal: 'Federal',
  state: 'State',
  regional: 'Regional',
  county: 'County',
  city: 'City/Municipal'
};

// ===========================================
// COMPONENT
// ===========================================

export const SettingsTab: React.FC<SettingsTabProps> = ({ partnerId, tier, partner }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('organization');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [orgForm, setOrgForm] = useState<{
    agencyName: string;
    agencyType: AgencyType;
    agencyLevel: AgencyLevel;
    agencyCode: string;
    city: string;
    state: string;
    region: string;
    jurisdiction: string;
    coveredPopulation: number;
    annualBudget: number;
  }>({
    agencyName: partner?.agencyName || 'Texas Workforce Commission',
    agencyType: partner?.agencyType || 'workforce_board',
    agencyLevel: partner?.agencyLevel || 'state',
    agencyCode: partner?.agencyCode || 'TWC-001',
    city: partner?.city || 'Austin',
    state: partner?.state || 'TX',
    region: partner?.region || 'Central Texas',
    jurisdiction: partner?.jurisdiction || 'State of Texas',
    coveredPopulation: partner?.coveredPopulation || 29500000,
    annualBudget: partner?.annualBudget || 450000000
  });

  const [contactForm, setContactForm] = useState({
    primaryContactName: partner?.primaryContactName || 'John Smith',
    primaryContactEmail: partner?.primaryContactEmail || 'jsmith@twc.texas.gov',
    primaryContactPhone: partner?.primaryContactPhone || '512-555-0100',
    primaryContactTitle: partner?.primaryContactTitle || 'Director of Workforce Programs'
  });

  const [notificationForm, setNotificationForm] = useState({
    emailReportReminders: true,
    emailComplianceAlerts: true,
    emailProgramUpdates: true,
    emailPartnerActivity: false,
    pushCriticalAlerts: true,
    pushDeadlineReminders: true,
  });

  // Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState<string | null>(null);
  const [showTeamMemberModal, setShowTeamMemberModal] = useState<{ name: string; email: string; role: string } | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Invite form
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Program Manager' });

  // Escape key handling for modals
  const closeAnyModal = () => {
    if (showTeamMemberModal) setShowTeamMemberModal(null);
    else if (showSecurityModal) setShowSecurityModal(null);
    else if (showInviteModal) setShowInviteModal(false);
    else if (showUpgradeModal) setShowUpgradeModal(false);
  };
  useEscapeKey(closeAnyModal, showUpgradeModal || showInviteModal || !!showSecurityModal || !!showTeamMemberModal);

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  const currentTierConfig = tierConfig[tier];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { updateGovernmentPartner } = await import('@/services/governmentPartnerApi');
      await updateGovernmentPartner(partnerId, {
        agencyName: orgForm.agencyName,
        agencyType: orgForm.agencyType as AgencyType,
        agencyLevel: orgForm.agencyLevel as AgencyLevel,
        agencyCode: orgForm.agencyCode,
        city: orgForm.city,
        state: orgForm.state,
        region: orgForm.region,
        jurisdiction: orgForm.jurisdiction,
        coveredPopulation: orgForm.coveredPopulation,
        annualBudget: orgForm.annualBudget,
        primaryContactName: contactForm.primaryContactName,
        primaryContactEmail: contactForm.primaryContactEmail,
        primaryContactPhone: contactForm.primaryContactPhone,
        primaryContactTitle: contactForm.primaryContactTitle,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'organization' as const, label: 'Organization', icon: Building2 },
    { id: 'contact' as const, label: 'Contact Info', icon: User },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'team' as const, label: 'Team', icon: Users },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Current Plan Card */}
        <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${govTwColor[currentTierConfig.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
              <currentTierConfig.icon className={`w-5 h-5 ${govTwColor[currentTierConfig.color]?.text || 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-white font-medium">{currentTierConfig.label}</p>
              <p className="text-sm text-gray-400">{currentTierConfig.price}</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          {/* Organization Settings */}
          {activeSection === 'organization' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Organization Settings
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Agency Name</label>
                    <input
                      type="text"
                      value={orgForm.agencyName}
                      onChange={(e) => setOrgForm({ ...orgForm, agencyName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Agency Code</label>
                    <input
                      type="text"
                      value={orgForm.agencyCode}
                      onChange={(e) => setOrgForm({ ...orgForm, agencyCode: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Agency Type</label>
                    <select
                      value={orgForm.agencyType}
                      onChange={(e) => setOrgForm({ ...orgForm, agencyType: e.target.value as AgencyType })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(agencyTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Agency Level</label>
                    <select
                      value={orgForm.agencyLevel}
                      onChange={(e) => setOrgForm({ ...orgForm, agencyLevel: e.target.value as AgencyLevel })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(agencyLevelLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      value={orgForm.city}
                      onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">State</label>
                    <input
                      type="text"
                      value={orgForm.state}
                      onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Region</label>
                    <input
                      type="text"
                      value={orgForm.region}
                      onChange={(e) => setOrgForm({ ...orgForm, region: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Jurisdiction</label>
                  <input
                    type="text"
                    value={orgForm.jurisdiction}
                    onChange={(e) => setOrgForm({ ...orgForm, jurisdiction: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., State of Texas, Travis County"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Covered Population</label>
                    <input
                      type="number"
                      value={orgForm.coveredPopulation}
                      onChange={(e) => setOrgForm({ ...orgForm, coveredPopulation: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Annual Budget ($)</label>
                    <input
                      type="number"
                      value={orgForm.annualBudget}
                      onChange={(e) => setOrgForm({ ...orgForm, annualBudget: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Info */}
          {activeSection === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primary Contact Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={contactForm.primaryContactName}
                        onChange={(e) => setContactForm({ ...contactForm, primaryContactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={contactForm.primaryContactTitle}
                      onChange={(e) => setContactForm({ ...contactForm, primaryContactTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={contactForm.primaryContactEmail}
                        onChange={(e) => setContactForm({ ...contactForm, primaryContactEmail: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        value={contactForm.primaryContactPhone}
                        onChange={(e) => setContactForm({ ...contactForm, primaryContactPhone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Billing */}
          {activeSection === 'billing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Billing & Subscription
              </h2>
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${govTwColor[currentTierConfig.color]?.bg || 'bg-slate-500/20'} rounded-xl flex items-center justify-center`}>
                        <currentTierConfig.icon className={`w-6 h-6 ${govTwColor[currentTierConfig.color]?.text || 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{currentTierConfig.label}</h3>
                        <p className="text-gray-400">{currentTierConfig.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Programs</p>
                      <p className="text-white">Unlimited</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Participants</p>
                      <p className="text-white">Unlimited</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Team Members</p>
                      <p className="text-white">{tier === 'basic' ? '5' : tier === 'standard' ? '25' : 'Unlimited'}</p>
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                  <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
                    {[
                      { date: 'Dec 1, 2025', amount: 1999, status: 'Paid' },
                      { date: 'Nov 1, 2025', amount: 1999, status: 'Paid' },
                      { date: 'Oct 1, 2025', amount: 1999, status: 'Paid' },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4">
                        <div>
                          <p className="text-white">{invoice.date}</p>
                          <p className="text-sm text-gray-400">{currentTierConfig.label}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">${invoice.amount.toLocaleString()}</p>
                          <span className="text-xs text-emerald-400">{invoice.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailReportReminders', label: 'Report Deadline Reminders', desc: 'Get reminded before compliance reports are due' },
                      { key: 'emailComplianceAlerts', label: 'Compliance Alerts', desc: 'Notifications about compliance issues and risks' },
                      { key: 'emailProgramUpdates', label: 'Program Updates', desc: 'Updates about program milestones and changes' },
                      { key: 'emailPartnerActivity', label: 'Partner Activity', desc: 'Activity from employer partners and collaborators' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotificationForm({
                            ...notificationForm,
                            [item.key]: !notificationForm[item.key as keyof typeof notificationForm]
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            notificationForm[item.key as keyof typeof notificationForm]
                              ? 'bg-blue-500'
                              : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            notificationForm[item.key as keyof typeof notificationForm]
                              ? 'right-0.5'
                              : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'pushCriticalAlerts', label: 'Critical Alerts', desc: 'Urgent notifications requiring immediate attention' },
                      { key: 'pushDeadlineReminders', label: 'Deadline Reminders', desc: 'Reminders for upcoming deadlines' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotificationForm({
                            ...notificationForm,
                            [item.key]: !notificationForm[item.key as keyof typeof notificationForm]
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            notificationForm[item.key as keyof typeof notificationForm]
                              ? 'bg-blue-500'
                              : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            notificationForm[item.key as keyof typeof notificationForm]
                              ? 'right-0.5'
                              : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team */}
          {activeSection === 'team' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Team Members
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'John Smith', email: 'jsmith@twc.texas.gov', role: 'Admin', status: 'Active' },
                  { name: 'Sarah Johnson', email: 'sjohnson@twc.texas.gov', role: 'Program Manager', status: 'Active' },
                  { name: 'Mike Chen', email: 'mchen@twc.texas.gov', role: 'Data Analyst', status: 'Active' },
                  { name: 'Lisa Rodriguez', email: 'lrodriguez@twc.texas.gov', role: 'Compliance Officer', status: 'Pending' },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">{member.role}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {member.status}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowTeamMemberModal(member); }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full p-4 border border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  + Invite Team Member
                </button>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Security Settings
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityModal('2fa')}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm"
                    >
                      Enabled
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Single Sign-On (SSO)</p>
                      <p className="text-sm text-gray-400">Configure SSO with your identity provider</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityModal('sso')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                      Configure
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Session Management</p>
                      <p className="text-sm text-gray-400">Manage active sessions and sign out devices</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityModal('sessions')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">API Keys</p>
                      <p className="text-sm text-gray-400">Manage API access for integrations</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityModal('api')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                      View Keys
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Audit Log</p>
                      <p className="text-sm text-gray-400">View all account activity and changes</p>
                    </div>
                    <button
                      onClick={() => setShowSecurityModal('audit')}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                      View Log
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          {(activeSection === 'organization' || activeSection === 'contact' || activeSection === 'notifications') && (
            <div className="p-6 border-t border-gray-800 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg shadow-lg">
          <CheckCircle className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Manage Subscription</h3>
              <div className="space-y-3">
                {Object.entries(tierConfig).map(([key, config]) => {
                  const TierIcon = config.icon;
                  const isCurrentTier = key === tier;
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border transition-colors ${
                        isCurrentTier
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-800 bg-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${govTwColor[config.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                            <TierIcon className={`w-5 h-5 ${govTwColor[config.color]?.text || 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{config.label}</p>
                            <p className="text-sm text-gray-400">{config.price}</p>
                          </div>
                        </div>
                        {isCurrentTier ? (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Current Plan</span>
                        ) : (
                          <button
                            onClick={() => { showNotification(`Upgrade to ${config.label} initiated`); setShowUpgradeModal(false); }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Team Member Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="colleague@agency.gov"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Program Manager">Program Manager</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button
                  onClick={() => {
                    showNotification(`Invitation sent to ${inviteForm.email}`);
                    setShowInviteModal(false);
                    setInviteForm({ email: '', role: 'Program Manager' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Member Settings Modal */}
      <AnimatePresence>
        {showTeamMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTeamMemberModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Manage Team Member</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {showTeamMemberModal.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-medium">{showTeamMemberModal.name}</p>
                    <p className="text-sm text-gray-400">{showTeamMemberModal.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <select
                    defaultValue={showTeamMemberModal.role}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Program Manager">Program Manager</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => { showNotification(`${showTeamMemberModal.name} removed from team`); setShowTeamMemberModal(null); }}
                  className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove Member
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setShowTeamMemberModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button
                    onClick={() => { showNotification(`${showTeamMemberModal.name}'s role updated`); setShowTeamMemberModal(null); }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Settings Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSecurityModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4"
            >
              {showSecurityModal === '2fa' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">2FA is currently enabled</p>
                        <p className="text-sm text-gray-400">Your account is secured with authenticator app</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Disabling 2FA will reduce the security of your account. You will only need your password to sign in.</p>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowSecurityModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
                    <button
                      onClick={() => { showNotification('2FA settings updated'); setShowSecurityModal(null); }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      Disable 2FA
                    </button>
                  </div>
                </>
              )}
              {showSecurityModal === 'sso' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Configure Single Sign-On</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Identity Provider</label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>Azure Active Directory</option>
                        <option>Okta</option>
                        <option>Google Workspace</option>
                        <option>OneLogin</option>
                        <option>Custom SAML</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">SSO URL</label>
                      <input type="url" placeholder="https://login.microsoftonline.com/..." className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Certificate (X.509)</label>
                      <textarea rows={3} placeholder="Paste your certificate here..." className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowSecurityModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button
                      onClick={() => { showNotification('SSO configuration saved'); setShowSecurityModal(null); }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>
                </>
              )}
              {showSecurityModal === 'sessions' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on macOS', location: 'Austin, TX', lastActive: 'Current session', current: true },
                      { device: 'Safari on iPhone', location: 'Austin, TX', lastActive: '2 hours ago', current: false },
                      { device: 'Firefox on Windows', location: 'Dallas, TX', lastActive: '1 day ago', current: false },
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white">{session.device}</p>
                          <p className="text-sm text-gray-400">{session.location} - {session.lastActive}</p>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-emerald-400">Current</span>
                        ) : (
                          <button
                            onClick={() => showNotification(`Session on ${session.device} terminated`)}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowSecurityModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
                    <button
                      onClick={() => { showNotification('All other sessions terminated'); setShowSecurityModal(null); }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      Revoke All Others
                    </button>
                  </div>
                </>
              )}
              {showSecurityModal === 'api' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">API Keys</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Production API Key', created: 'Jan 15, 2024', lastUsed: '5 min ago' },
                      { name: 'Staging API Key', created: 'Mar 1, 2024', lastUsed: '3 days ago' },
                    ].map((key, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white">{key.name}</p>
                          <p className="text-sm text-gray-400">Created {key.created} - Last used {key.lastUsed}</p>
                        </div>
                        <button
                          onClick={() => showNotification(`${key.name} revoked`)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowSecurityModal(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
                    <button
                      onClick={() => { showNotification('New API key generated'); }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Generate New Key
                    </button>
                  </div>
                </>
              )}
              {showSecurityModal === 'audit' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Audit Log</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {[
                      { action: 'Settings updated', user: 'John Smith', time: '10 min ago' },
                      { action: 'Report submitted', user: 'Sarah Johnson', time: '2 hours ago' },
                      { action: 'New participant enrolled', user: 'Mike Chen', time: '5 hours ago' },
                      { action: 'Employer partnership added', user: 'John Smith', time: '1 day ago' },
                      { action: 'Team member invited', user: 'John Smith', time: '2 days ago' },
                      { action: 'Program created', user: 'Sarah Johnson', time: '3 days ago' },
                      { action: 'API key generated', user: 'John Smith', time: '1 week ago' },
                    ].map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white text-sm">{entry.action}</p>
                          <p className="text-xs text-gray-400">by {entry.user}</p>
                        </div>
                        <span className="text-xs text-gray-500">{entry.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => showNotification('Audit log exported')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Export Log
                    </button>
                    <button onClick={() => setShowSecurityModal(null)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Close</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
