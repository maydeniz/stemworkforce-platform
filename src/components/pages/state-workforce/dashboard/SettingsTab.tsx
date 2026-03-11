// ===========================================
// Settings Tab - State Workforce Board Settings
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Mail,
  Bell,
  Shield,
  Users,
  Save,
  CheckCircle,
  Loader2,
  Globe,
  FileText,
  Database,
  Briefcase
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

type SettingsSection = 'organization' | 'contact' | 'notifications' | 'team' | 'security' | 'integrations';

// ===========================================
// COMPONENT
// ===========================================

export const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('organization');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [orgName, setOrgName] = useState('Texas Workforce Commission');
  const [orgAbbrev, setOrgAbbrev] = useState('TWC');
  const [orgWebsite, setOrgWebsite] = useState('https://twc.texas.gov');
  const [orgPhone, setOrgPhone] = useState('512-463-2222');
  const [orgEmail, setOrgEmail] = useState('workforce@twc.texas.gov');
  const [orgAddress, setOrgAddress] = useState('101 E 15th St, Austin, TX 78778');
  const [directorName, setDirectorName] = useState('Commissioner Bryan Daniel');
  const [directorEmail, setDirectorEmail] = useState('bdaniel@twc.texas.gov');
  const [fiscalYear, setFiscalYear] = useState('PY2025');

  // Load persisted settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stateWorkforceSettings');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.orgName) setOrgName(s.orgName);
        if (s.orgAbbrev) setOrgAbbrev(s.orgAbbrev);
        if (s.orgWebsite) setOrgWebsite(s.orgWebsite);
        if (s.orgPhone) setOrgPhone(s.orgPhone);
        if (s.orgEmail) setOrgEmail(s.orgEmail);
        if (s.orgAddress) setOrgAddress(s.orgAddress);
        if (s.directorName) setDirectorName(s.directorName);
        if (s.directorEmail) setDirectorEmail(s.directorEmail);
        if (s.fiscalYear) setFiscalYear(s.fiscalYear);
        if (s.emailNotifications !== undefined) setEmailNotifications(s.emailNotifications);
        if (s.performanceAlerts !== undefined) setPerformanceAlerts(s.performanceAlerts);
        if (s.budgetAlerts !== undefined) setBudgetAlerts(s.budgetAlerts);
        if (s.complianceAlerts !== undefined) setComplianceAlerts(s.complianceAlerts);
        if (s.weeklyDigest !== undefined) setWeeklyDigest(s.weeklyDigest);
        if (s.warnNotifications !== undefined) setWarnNotifications(s.warnNotifications);
      }
    } catch (e) {
      console.error('Error loading saved settings:', e);
    }
  }, []);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [warnNotifications, setWarnNotifications] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Persist settings to localStorage until backend API is ready
      const settings = {
        orgName, orgAbbrev, orgWebsite, orgPhone, orgEmail, orgAddress,
        directorName, directorEmail, fiscalYear,
        emailNotifications, performanceAlerts, budgetAlerts,
        complianceAlerts, weeklyDigest, warnNotifications,
      };
      localStorage.setItem('stateWorkforceSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving state workforce settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'organization' as const, label: 'Organization', icon: Building2 },
    { id: 'contact' as const, label: 'Contact Info', icon: Mail },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'team' as const, label: 'Team Members', icon: Users },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'integrations' as const, label: 'Integrations', icon: Database },
  ];

  return (
    <div className="space-y-6">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            {/* Organization Settings */}
            {activeSection === 'organization' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Organization Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Organization Name</label>
                      <input
                        type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Abbreviation</label>
                      <input
                        type="text" value={orgAbbrev} onChange={e => setOrgAbbrev(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Website</label>
                    <input
                      type="url" value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <input
                      type="text" value={orgAddress} onChange={e => setOrgAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Director / Commissioner</label>
                      <input
                        type="text" value={directorName} onChange={e => setDirectorName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Director Email</label>
                      <input
                        type="email" value={directorEmail} onChange={e => setDirectorEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Current Program Year</label>
                    <select
                      value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="PY2025">PY2025 (Jul 2025 - Jun 2026)</option>
                      <option value="PY2024">PY2024 (Jul 2024 - Jun 2025)</option>
                      <option value="PY2023">PY2023 (Jul 2023 - Jun 2024)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeSection === 'contact' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Main Phone</label>
                      <input
                        type="tel" value={orgPhone} onChange={e => setOrgPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Main Email</label>
                      <input
                        type="email" value={orgEmail} onChange={e => setOrgEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Emergency Contacts</h4>
                    <p className="text-sm text-gray-400">Configure rapid response coordinator contacts for WARN notices and layoff events.</p>
                    <button className="mt-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                      Manage Emergency Contacts
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive notifications via email', value: emailNotifications, set: setEmailNotifications },
                    { label: 'Performance Alerts', desc: 'Alert when indicators fall below target', value: performanceAlerts, set: setPerformanceAlerts },
                    { label: 'Budget Alerts', desc: 'Spending thresholds and burn rate warnings', value: budgetAlerts, set: setBudgetAlerts },
                    { label: 'Compliance Alerts', desc: 'Report deadlines and compliance issues', value: complianceAlerts, set: setComplianceAlerts },
                    { label: 'Weekly Digest', desc: 'Summary of key metrics every Monday', value: weeklyDigest, set: setWeeklyDigest },
                    { label: 'WARN Notice Alerts', desc: 'Immediate notification of new WARN filings', value: warnNotifications, set: setWarnNotifications },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.set(!item.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? 'bg-blue-500' : 'bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            {activeSection === 'team' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                    Invite Member
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Bryan Daniel', role: 'STATE_WORKFORCE_DIRECTOR', email: 'bdaniel@twc.texas.gov', status: 'active' },
                    { name: 'Sarah Chen', role: 'LWDB_DIRECTOR', email: 'schen@capitalwfb.org', status: 'active' },
                    { name: 'Michael Johnson', role: 'LWDB_DIRECTOR', email: 'mjohnson@gulfcoastwfs.org', status: 'active' },
                    { name: 'Patricia Gonzalez', role: 'AJC_DIRECTOR', email: 'pgonzalez@capitalwfc.org', status: 'active' },
                    { name: 'Angela Washington', role: 'AJC_DIRECTOR', email: 'awashington@gulfcoastcc.org', status: 'active' },
                    { name: 'David Kim', role: 'DATA_ANALYST', email: 'dkim@twc.texas.gov', status: 'active' },
                    { name: 'Lisa Rodriguez', role: 'COMPLIANCE_OFFICER', email: 'lrodriguez@twc.texas.gov', status: 'active' },
                    { name: 'Tom Baker', role: 'RAPID_RESPONSE_COORDINATOR', email: 'tbaker@twc.texas.gov', status: 'invited' },
                  ].map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 px-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                          {member.role.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Enabled</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Session Timeout</h4>
                        <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                      </div>
                      <select className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">PII Data Masking</h4>
                        <p className="text-sm text-gray-400">Mask SSN and sensitive participant data by default</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Enabled</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">API Keys</h4>
                    <p className="text-sm text-gray-400 mb-3">Manage API keys for system integrations</p>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                      Manage API Keys
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">System Integrations</h3>
                <div className="space-y-4">
                  {[
                    { name: 'PIRL Reporting System', desc: 'Participant Individual Record Layout data export', status: 'connected', icon: FileText },
                    { name: 'Wage Record Match', desc: 'State Unemployment Insurance wage records', status: 'connected', icon: Database },
                    { name: 'ETPL System', desc: 'Eligible Training Provider List management', status: 'connected', icon: Globe },
                    { name: 'USAJobs.gov', desc: 'Federal job listing integration', status: 'configured', icon: Briefcase },
                    { name: 'O*NET Online', desc: 'Occupational information network', status: 'connected', icon: Globe },
                    { name: 'DOL ETA Reporting', desc: 'Federal reporting submissions', status: 'configured', icon: FileText },
                  ].map((integration, idx) => {
                    const Icon = integration.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{integration.name}</p>
                            <p className="text-sm text-gray-400">{integration.desc}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          integration.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-end gap-3">
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Settings saved</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
