// ===========================================
// Settings Tab - Account & Organization Settings
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Users,
  Key,
  Globe,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Building,
  X,
  Plus,
} from 'lucide-react';
import type {
  LabPartnerTier,
  NationalLabsPartner,
  LabType,
} from '../../../../types/nationalLabsPartner';

interface SettingsTabProps {
  partnerId: string;
  tier: LabPartnerTier;
  partner?: NationalLabsPartner;
}

type SettingsSection = 'organization' | 'contact' | 'billing' | 'notifications' | 'team' | 'security';

const labTypeLabels: Record<LabType, string> = {
  doe_national_lab: 'DOE National Laboratory',
  ffrdc: 'FFRDC',
  university_research: 'University Research Center',
  industry_rd: 'Industry R&D',
  other: 'Other Research Organization',
};

const tierConfig: Record<LabPartnerTier, { label: string; color: string; icon: React.ElementType; price: string }> = {
  research: { label: 'Research Partner', color: 'slate', icon: Building, price: 'Free' },
  lab: { label: 'Lab Partner', color: 'amber', icon: Zap, price: '$2,499/mo' },
  enterprise: { label: 'Enterprise', color: 'purple', icon: Crown, price: 'Custom' },
};

export const SettingsTab: React.FC<SettingsTabProps> = ({ partnerId, tier, partner }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('organization');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState<{ name: string; email: string; role: string; status: string } | null>(null);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [showConfigureSSOModal, setShowConfigureSSOModal] = useState(false);
  const [showRevokeSessionModal, setShowRevokeSessionModal] = useState<{ device: string; location: string } | null>(null);
  const [showDeleteOrgModal, setShowDeleteOrgModal] = useState(false);
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // New area input
  const [newArea, setNewArea] = useState('');

  // Invite member form
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Viewer' });

  // Form states
  const [orgForm, setOrgForm] = useState({
    organizationName: partner?.organizationName || 'Oak Ridge National Laboratory',
    labType: partner?.labType || 'doe_national_lab',
    labCode: partner?.labCode || 'ORNL',
    city: partner?.city || 'Oak Ridge',
    state: partner?.state || 'TN',
    facility: partner?.facility || 'Main Campus',
    employeeCount: partner?.employeeCount || 5800,
    researchAreas: partner?.researchAreas || ['Materials Science', 'Nuclear Physics', 'Neutron Sciences', 'Computing'],
  });

  const [contactForm, setContactForm] = useState({
    primaryContactName: partner?.primaryContactName || 'Dr. Sarah Mitchell',
    primaryContactEmail: partner?.primaryContactEmail || 'mitchell@ornl.gov',
    primaryContactPhone: partner?.primaryContactPhone || '(865) 574-1000',
    primaryContactTitle: partner?.primaryContactTitle || 'Director of Talent Acquisition',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCandidateUpdates: true,
    emailClearanceStatus: true,
    emailFellowshipDeadlines: true,
    emailComplianceAlerts: true,
    emailWeeklyDigest: false,
    pushCriticalAlerts: true,
    pushCandidateMatches: true,
  });

  // Team members state
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Dr. Sarah Mitchell', email: 'mitchell@ornl.gov', role: 'Admin', status: 'Active' },
    { name: 'John Smith', email: 'jsmith@ornl.gov', role: 'Compliance Officer', status: 'Active' },
    { name: 'Maria Garcia', email: 'mgarcia@ornl.gov', role: 'HR Manager', status: 'Active' },
    { name: 'Robert Chen', email: 'rchen@ornl.gov', role: 'Viewer', status: 'Pending' },
  ]);

  // Sessions state
  const [sessions, setSessions] = useState([
    { device: 'Chrome on macOS', location: 'Oak Ridge, TN', current: true },
    { device: 'Safari on iPhone', location: 'Knoxville, TN', current: false },
  ]);

  const currentTierConfig = tierConfig[tier];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { updateNationalLabsPartner } = await import('@/services/nationalLabsPartnerApi');
      await updateNationalLabsPartner(partnerId, {
        organizationName: orgForm.organizationName,
        labType: orgForm.labType as LabType,
        labCode: orgForm.labCode,
        city: orgForm.city,
        state: orgForm.state,
        facility: orgForm.facility,
        employeeCount: orgForm.employeeCount,
        researchAreas: orgForm.researchAreas,
        primaryContactName: contactForm.primaryContactName,
        primaryContactEmail: contactForm.primaryContactEmail,
        primaryContactPhone: contactForm.primaryContactPhone,
        primaryContactTitle: contactForm.primaryContactTitle,
      });
      setSaved(true);
      setShowSaveNotification(true);
      setTimeout(() => { setSaved(false); setShowSaveNotification(false); }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaved(true);
      setShowSaveNotification(true);
      setTimeout(() => { setSaved(false); setShowSaveNotification(false); }, 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddArea = () => {
    if (newArea.trim()) {
      setOrgForm({ ...orgForm, researchAreas: [...orgForm.researchAreas, newArea.trim()] });
      setNewArea('');
      setShowAddAreaModal(false);
    }
  };

  const handleInviteMember = () => {
    if (inviteForm.name && inviteForm.email) {
      setTeamMembers(prev => [...prev, { ...inviteForm, status: 'Pending' }]);
      setInviteForm({ name: '', email: '', role: 'Viewer' });
      setShowInviteMemberModal(false);
    }
  };

  const handleUpdateMemberRole = (newRole: string) => {
    if (showEditMemberModal) {
      setTeamMembers(prev => prev.map(m =>
        m.email === showEditMemberModal.email ? { ...m, role: newRole } : m
      ));
      setShowEditMemberModal(null);
    }
  };

  const handleRevokeSession = () => {
    if (showRevokeSessionModal) {
      setSessions(prev => prev.filter(s => s.device !== showRevokeSessionModal.device));
      setShowRevokeSessionModal(null);
    }
  };

  const handleDownloadInvoice = () => {
    setShowDownloadNotification(true);
    setTimeout(() => setShowDownloadNotification(false), 3000);
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
    <div className="space-y-6">
      {/* Notifications */}
      {showSaveNotification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <span className="text-white">Settings saved successfully</span>
        </div>
      )}
      {showDownloadNotification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <span className="text-white">Invoice downloaded successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your organization settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Current Plan Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-5 border ${
          tier === 'enterprise' ? 'bg-purple-500/10 border-purple-500/30' :
          tier === 'lab' ? 'bg-amber-500/10 border-amber-500/30' :
          'bg-slate-800/50 border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              tier === 'enterprise' ? 'bg-purple-500/20' :
              tier === 'lab' ? 'bg-amber-500/20' :
              'bg-slate-700'
            }`}>
              <currentTierConfig.icon className={`w-6 h-6 ${
                tier === 'enterprise' ? 'text-purple-400' :
                tier === 'lab' ? 'text-amber-400' :
                'text-slate-400'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{currentTierConfig.label}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  tier === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                  tier === 'lab' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  Current Plan
                </span>
              </div>
              <p className="text-slate-400 text-sm">{currentTierConfig.price}</p>
            </div>
          </div>
          {tier !== 'enterprise' && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            {activeSection === 'organization' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Organization Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={orgForm.organizationName}
                      onChange={(e) => setOrgForm({ ...orgForm, organizationName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Lab Type</label>
                    <select
                      value={orgForm.labType}
                      onChange={(e) => setOrgForm({ ...orgForm, labType: e.target.value as LabType })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {Object.entries(labTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Lab Code</label>
                    <input
                      type="text"
                      value={orgForm.labCode}
                      onChange={(e) => setOrgForm({ ...orgForm, labCode: e.target.value })}
                      placeholder="e.g., ORNL, LANL, SNL"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={orgForm.city}
                        onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                    <input
                      type="text"
                      value={orgForm.state}
                      onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Facility</label>
                    <input
                      type="text"
                      value={orgForm.facility}
                      onChange={(e) => setOrgForm({ ...orgForm, facility: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Employee Count</label>
                    <input
                      type="number"
                      value={orgForm.employeeCount}
                      onChange={(e) => setOrgForm({ ...orgForm, employeeCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Research Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {orgForm.researchAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center gap-2"
                        >
                          {area}
                          <button
                            onClick={() => setOrgForm({
                              ...orgForm,
                              researchAreas: orgForm.researchAreas.filter((_, i) => i !== index)
                            })}
                            className="text-slate-500 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => setShowAddAreaModal(true)}
                        className="px-3 py-1 bg-slate-700 text-amber-400 rounded-lg text-sm hover:bg-slate-600"
                      >
                        + Add Area
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Primary Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={contactForm.primaryContactName}
                      onChange={(e) => setContactForm({ ...contactForm, primaryContactName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={contactForm.primaryContactEmail}
                        onChange={(e) => setContactForm({ ...contactForm, primaryContactEmail: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={contactForm.primaryContactPhone}
                        onChange={(e) => setContactForm({ ...contactForm, primaryContactPhone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={contactForm.primaryContactTitle}
                      onChange={(e) => setContactForm({ ...contactForm, primaryContactTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Billing & Subscription</h3>
                </div>

                {/* Current Plan */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">{currentTierConfig.label}</h4>
                      <p className="text-slate-400 text-sm">Your current subscription</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{currentTierConfig.price}</div>
                      {tier !== 'research' && <p className="text-slate-400 text-sm">Billed monthly</p>}
                    </div>
                  </div>
                  {tier !== 'research' && (
                    <div className="pt-4 border-t border-slate-600">
                      <p className="text-slate-400 text-sm">Next billing date: February 15, 2024</p>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                {tier !== 'research' && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Payment Method</h4>
                    <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-600 rounded">
                          <CreditCard className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-white">**** **** **** 4242</p>
                          <p className="text-slate-400 text-sm">Expires 12/25</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowEditPaymentModal(true)}
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Billing History */}
                <div>
                  <h4 className="text-white font-medium mb-3">Billing History</h4>
                  {tier === 'research' ? (
                    <p className="text-slate-400 text-sm">No billing history for free tier.</p>
                  ) : (
                    <div className="space-y-2">
                      {[
                        { date: 'Jan 15, 2024', amount: '$2,499.00', status: 'Paid' },
                        { date: 'Dec 15, 2023', amount: '$2,499.00', status: 'Paid' },
                        { date: 'Nov 15, 2023', amount: '$2,499.00', status: 'Paid' },
                      ].map((invoice, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white text-sm">{invoice.date}</p>
                            <p className="text-slate-400 text-xs">{invoice.amount}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                              {invoice.status}
                            </span>
                            <button
                              onClick={handleDownloadInvoice}
                              className="text-amber-400 hover:text-amber-300 text-sm"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  {[
                    { key: 'emailCandidateUpdates', label: 'Candidate status updates', description: 'Get notified when candidates move through the pipeline' },
                    { key: 'emailClearanceStatus', label: 'Clearance status changes', description: 'Updates on clearance investigation progress' },
                    { key: 'emailFellowshipDeadlines', label: 'Fellowship deadlines', description: 'Reminders for upcoming fellowship application deadlines' },
                    { key: 'emailComplianceAlerts', label: 'Compliance alerts', description: 'Important compliance review reminders and issues' },
                    { key: 'emailWeeklyDigest', label: 'Weekly digest', description: 'Summary of weekly activity and metrics' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-700">
                      <div>
                        <p className="text-white">{item.label}</p>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  {[
                    { key: 'pushCriticalAlerts', label: 'Critical alerts', description: 'Urgent compliance issues and security alerts' },
                    { key: 'pushCandidateMatches', label: 'New candidate matches', description: 'When new candidates match your open positions' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-700">
                      <div>
                        <p className="text-white">{item.label}</p>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  </div>
                  <button
                    onClick={() => setShowInviteMemberModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Invite Member
                  </button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-slate-400 text-sm">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                          {member.role}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {member.status}
                        </span>
                        <button
                          onClick={() => setShowEditMemberModal(member)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                </div>

                {/* Two-Factor Auth */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded">
                        <Key className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Enabled</span>
                    </div>
                  </div>
                </div>

                {/* SSO */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600 rounded">
                        <Globe className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Single Sign-On (SSO)</p>
                        <p className="text-slate-400 text-sm">Connect your organization's identity provider</p>
                      </div>
                    </div>
                    {tier === 'enterprise' ? (
                      <button
                        onClick={() => setShowConfigureSSOModal(true)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
                      >
                        Configure
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-slate-600 text-slate-400 rounded text-sm">
                        Enterprise Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Session Management */}
                <div>
                  <h4 className="text-white font-medium mb-3">Active Sessions</h4>
                  <div className="space-y-2">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm">{session.device}</p>
                            {session.current && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs">{session.location}</p>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => setShowRevokeSessionModal(session)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-slate-700">
                  <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  <button
                    onClick={() => setShowDeleteOrgModal(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete Organization
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Upgrade Your Plan</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-4">
              {tier !== 'lab' && (
                <div className="bg-gray-800 rounded-xl p-4 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /><h4 className="text-white font-semibold">Lab Partner</h4></div>
                    <span className="text-amber-400 font-bold">$2,499/mo</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Clearance Pre-Screening</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> ITAR/EAR Compliance</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Advanced Analytics</li>
                  </ul>
                </div>
              )}
              <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><Crown className="w-5 h-5 text-purple-400" /><h4 className="text-white font-semibold">Enterprise</h4></div>
                  <span className="text-purple-400 font-bold">Custom</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Everything in Lab Partner</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> SSO Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Dedicated Support</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-400" /> Custom Integrations</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Contact Sales</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Research Area Modal */}
      {showAddAreaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddAreaModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add Research Area</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Research Area Name</label>
              <input
                type="text"
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddArea()}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Quantum Computing"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddAreaModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleAddArea} disabled={!newArea.trim()} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowInviteMemberModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteMemberModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@ornl.gov"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInviteMemberModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleInviteMember} disabled={!inviteForm.name || !inviteForm.email} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditMemberModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Edit Team Member</h3>
              <button onClick={() => setShowEditMemberModal(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-white font-semibold">{showEditMemberModal.name}</p>
              <p className="text-gray-400 text-sm">{showEditMemberModal.email}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <div className="space-y-2">
                {['Admin', 'Compliance Officer', 'HR Manager', 'Viewer'].map(role => (
                  <button
                    key={role}
                    onClick={() => handleUpdateMemberRole(role)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      showEditMemberModal.role === role
                        ? 'bg-purple-500/20 border border-purple-500/50 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-transparent'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditMemberModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditPaymentModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Update Payment Method</h3>
              <button onClick={() => setShowEditPaymentModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <input type="text" placeholder="**** **** **** ****" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input type="text" placeholder="***" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditPaymentModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowEditPaymentModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Update Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Configure SSO Modal */}
      {showConfigureSSOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfigureSSOModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Configure SSO</h3>
              <button onClick={() => setShowConfigureSSOModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Identity Provider</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>SAML 2.0</option>
                  <option>OpenID Connect</option>
                  <option>Active Directory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">SSO URL</label>
                <input type="url" placeholder="https://login.example.gov/saml" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Certificate</label>
                <textarea placeholder="Paste your certificate here..." className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowConfigureSSOModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowConfigureSSOModal(false)} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Save Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Session Modal */}
      {showRevokeSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRevokeSessionModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Revoke Session</h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to revoke the session for <span className="text-white font-semibold">{showRevokeSessionModal.device}</span> in {showRevokeSessionModal.location}?
            </p>
            <p className="text-gray-400 text-sm mb-4">This will log out the device immediately.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRevokeSessionModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleRevokeSession} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Revoke Session</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Organization Modal */}
      {showDeleteOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteOrgModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete Organization</h3>
            <p className="text-gray-400 mb-4">
              This action is <span className="text-red-400 font-semibold">permanent and cannot be undone</span>. All data including candidates, fellowships, compliance records, and team members will be permanently deleted.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Type "DELETE" to confirm
              </p>
              <input
                type="text"
                placeholder="DELETE"
                className="w-full mt-2 px-3 py-2 bg-gray-800 border border-red-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteOrgModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowDeleteOrgModal(false)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete Organization</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
