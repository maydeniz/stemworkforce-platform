// ===========================================
// Settings Tab - Education Partner Dashboard
// Organization settings, integrations, and preferences
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image,
  Link2,
  Shield,
  Bell,
  Users,
  Key,
  Trash2,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

interface SettingsTabProps {
  partnerId: string;
  partnerData: {
    institutionName: string;
    institutionType?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    logoUrl?: string;
  } | null;
  onUpdatePartner: (data: Partial<OrganizationSettings>) => Promise<void>;
}

interface OrganizationSettings {
  institutionName: string;
  institutionType: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl: string;
  description: string;
}

interface NotificationSettings {
  emailNewApplications: boolean;
  emailEventReminders: boolean;
  emailOutcomeReports: boolean;
  emailBillingAlerts: boolean;
  emailWeeklyDigest: boolean;
}

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
}

const INSTITUTION_TYPES = [
  { value: 'university', label: 'University' },
  { value: 'community_college', label: 'Community College' },
  { value: 'trade_school', label: 'Trade School' },
  { value: 'bootcamp', label: 'Coding Bootcamp' },
  { value: 'k12', label: 'K-12 School' },
  { value: 'workforce_board', label: 'Workforce Development Board' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const SettingsTab: React.FC<SettingsTabProps> = ({
  partnerId: _partnerId,
  partnerData,
  onUpdatePartner
}) => {
  const [activeSection, setActiveSection] = useState<'organization' | 'notifications' | 'integrations' | 'api' | 'danger'>('organization');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Organization Settings
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    institutionName: partnerData?.institutionName || '',
    institutionType: partnerData?.institutionType || 'university',
    website: partnerData?.website || '',
    email: partnerData?.email || '',
    phone: partnerData?.phone || '',
    address: partnerData?.address || '',
    city: partnerData?.city || '',
    state: partnerData?.state || '',
    zipCode: '',
    logoUrl: partnerData?.logoUrl || '',
    description: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNewApplications: true,
    emailEventReminders: true,
    emailOutcomeReports: true,
    emailBillingAlerts: true,
    emailWeeklyDigest: false
  });

  // API Settings
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  const [showUploadLogoModal, setShowUploadLogoModal] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaveSuccess, setNotifSaveSuccess] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);
  const [showConfigureModal, setShowConfigureModal] = useState<string | null>(null);
  const [syncingIntegration, setSyncingIntegration] = useState<string | null>(null);
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showCancelPlanModal, setShowCancelPlanModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Integrations
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'sis',
      name: 'Student Information System',
      description: 'Sync student data from Banner, Colleague, or PeopleSoft',
      icon: 'users',
      connected: false
    },
    {
      id: 'lms',
      name: 'Learning Management System',
      description: 'Connect Canvas, Blackboard, or Moodle for course data',
      icon: 'book',
      connected: false
    },
    {
      id: 'handshake',
      name: 'Handshake',
      description: 'Import employer connections and job postings',
      icon: 'briefcase',
      connected: true,
      lastSync: '2026-02-14T10:30:00Z'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Learning',
      description: 'Track professional development completions',
      icon: 'linkedin',
      connected: false
    }
  ]);

  useEffect(() => {
    if (partnerData) {
      setOrgSettings({
        institutionName: partnerData.institutionName || '',
        institutionType: partnerData.institutionType || 'university',
        website: partnerData.website || '',
        email: partnerData.email || '',
        phone: partnerData.phone || '',
        address: partnerData.address || '',
        city: partnerData.city || '',
        state: partnerData.state || '',
        zipCode: '',
        logoUrl: partnerData.logoUrl || '',
        description: ''
      });
    }
  }, [partnerData]);

  const handleSaveOrgSettings = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await onUpdatePartner(orgSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setGeneratingKey(true);
    // Simulate API key generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newKey = `ep_live_${Array.from(crypto.getRandomValues(new Uint8Array(32)), b =>
      b.toString(36).padStart(2, '0').charAt(0)
    ).join('')}`;
    setApiKey(newKey);
    setGeneratingKey(false);
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setNotifSaving(false);
    setNotifSaveSuccess(true);
    setTimeout(() => setNotifSaveSuccess(false), 3000);
  };

  const handleSyncIntegration = async (integrationId: string) => {
    setSyncingIntegration(integrationId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIntegrations(prev => prev.map(i =>
      i.id === integrationId ? { ...i, lastSync: new Date().toISOString() } : i
    ));
    setSyncingIntegration(null);
  };

  const handleConnectIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === integrationId ? { ...i, connected: true, lastSync: new Date().toISOString() } : i
    ));
    setShowConnectModal(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navItems = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'api', label: 'API Access', icon: Key },
    { id: 'danger', label: 'Danger Zone', icon: AlertCircle }
  ] as const;

  return (
    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-2 sticky top-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : item.id === 'danger'
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {/* Organization Settings */}
        {activeSection === 'organization' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Organization Profile
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Settings saved successfully!</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Organization Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center">
                      {orgSettings.logoUrl ? (
                        <img
                          src={orgSettings.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Image className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <button onClick={() => setShowUploadLogoModal(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB. 200x200 recommended.</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Institution Name *</label>
                    <input
                      type="text"
                      value={orgSettings.institutionName}
                      onChange={(e) => setOrgSettings({ ...orgSettings, institutionName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Institution Type</label>
                    <select
                      value={orgSettings.institutionType}
                      onChange={(e) => setOrgSettings({ ...orgSettings, institutionType: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      {INSTITUTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Website
                    </label>
                    <input
                      type="url"
                      value={orgSettings.website}
                      onChange={(e) => setOrgSettings({ ...orgSettings, website: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="https://example.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={orgSettings.email}
                      onChange={(e) => setOrgSettings({ ...orgSettings, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="careers@example.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orgSettings.phone}
                    onChange={(e) => setOrgSettings({ ...orgSettings, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Address
                  </label>
                  <input
                    type="text"
                    value={orgSettings.address}
                    onChange={(e) => setOrgSettings({ ...orgSettings, address: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 mb-3"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={orgSettings.city}
                      onChange={(e) => setOrgSettings({ ...orgSettings, city: e.target.value })}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="City"
                    />
                    <select
                      value={orgSettings.state}
                      onChange={(e) => setOrgSettings({ ...orgSettings, state: e.target.value })}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">State</option>
                      {US_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={orgSettings.zipCode}
                      onChange={(e) => setOrgSettings({ ...orgSettings, zipCode: e.target.value })}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={orgSettings.description}
                    onChange={(e) => setOrgSettings({ ...orgSettings, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Brief description of your institution and programs..."
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <button
                    onClick={handleSaveOrgSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notification Settings */}
        {activeSection === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                { key: 'emailNewApplications', label: 'New Applications', desc: 'Get notified when students apply to your programs' },
                { key: 'emailEventReminders', label: 'Event Reminders', desc: 'Receive reminders about upcoming events you\'re hosting' },
                { key: 'emailOutcomeReports', label: 'Outcome Reports', desc: 'Monthly reports on graduate placement outcomes' },
                { key: 'emailBillingAlerts', label: 'Billing Alerts', desc: 'Payment confirmations and subscription updates' },
                { key: 'emailWeeklyDigest', label: 'Weekly Digest', desc: 'Summary of platform activity and employer engagement' }
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key as keyof NotificationSettings]
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof NotificationSettings]
                        ? 'bg-indigo-600'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof NotificationSettings]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {notifSaveSuccess && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Notification preferences saved!</span>
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-800 mt-6">
              <button onClick={handleSaveNotifications} disabled={notifSaving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50">
                {notifSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}

        {/* Integrations */}
        {activeSection === 'integrations' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-indigo-400" />
                Connected Integrations
              </h2>

              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        integration.connected ? 'bg-emerald-500/20' : 'bg-gray-700'
                      }`}>
                        <Users className={`w-6 h-6 ${
                          integration.connected ? 'text-emerald-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {integration.name}
                          {integration.connected && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                              Connected
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{integration.description}</div>
                        {integration.lastSync && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last synced: {formatDate(integration.lastSync)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <>
                          <button onClick={() => handleSyncIntegration(integration.id)} disabled={syncingIntegration === integration.id} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${syncingIntegration === integration.id ? 'animate-spin' : ''}`} />
                          </button>
                          <button onClick={() => setShowConfigureModal(integration.id)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                            Configure
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setShowConnectModal(integration.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* API Access */}
        {activeSection === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                API Access
              </h2>
              <p className="text-gray-400 mb-6">
                Use API keys to integrate with your internal systems or build custom applications.
              </p>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-400">Keep your API key secure</div>
                    <p className="text-sm text-amber-300/80">
                      Never share your API key publicly or commit it to version control.
                      Regenerate immediately if compromised.
                    </p>
                  </div>
                </div>
              </div>

              {apiKey ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your API Key</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm">
                        {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleCopyApiKey}
                        className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateApiKey}
                    disabled={generatingKey}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${generatingKey ? 'animate-spin' : ''}`} />
                    Regenerate Key
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No API key generated yet</p>
                  <button
                    onClick={handleGenerateApiKey}
                    disabled={generatingKey}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors mx-auto"
                  >
                    {generatingKey ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    Generate API Key
                  </button>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">API Documentation</h3>
                    <p className="text-sm text-gray-400">Learn how to integrate with our API</p>
                  </div>
                  <a
                    href="/docs/api"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                  >
                    View Docs <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Danger Zone */}
        {activeSection === 'danger' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-red-500/30 rounded-xl p-6"
          >
            <h2 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="font-medium text-white">Delete all program data</div>
                  <div className="text-sm text-gray-400">
                    Remove all programs, outcomes, and associated data. This cannot be undone.
                  </div>
                </div>
                <button onClick={() => setShowDeleteDataModal(true)} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  Delete Data
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="font-medium text-white">Cancel subscription</div>
                  <div className="text-sm text-gray-400">
                    Downgrade to free plan and lose access to premium features.
                  </div>
                </div>
                <button onClick={() => setShowCancelPlanModal(true)} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  Cancel Plan
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="font-medium text-white">Delete organization account</div>
                  <div className="text-sm text-gray-400">
                    Permanently delete your organization and all associated data.
                  </div>
                </div>
                <button onClick={() => setShowDeleteAccountModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Logo Modal */}
      {showUploadLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadLogoModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Upload Organization Logo</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-4">
              <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">Drag and drop your logo here, or click to browse</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB. 200x200px recommended.</p>
              <input type="file" accept="image/png,image/jpeg" className="hidden" id="logo-upload-input" onChange={() => {}} />
              <button onClick={() => document.getElementById('logo-upload-input')?.click()} className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">
                Choose File
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUploadLogoModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowUploadLogoModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Integration Modal */}
      {showConnectModal && (() => {
        const integration = integrations.find(i => i.id === showConnectModal);
        if (!integration) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConnectModal(null)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Connect {integration.name}</h3>
              <p className="text-gray-400 mb-4">{integration.description}</p>
              <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
                <p className="text-sm text-gray-300">
                  Connecting this integration will allow data synchronization between your {integration.name} and the STEM Workforce platform.
                  You may need to provide credentials or authorize access.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowConnectModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => handleConnectIntegration(showConnectModal)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Authorize & Connect</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Configure Integration Modal */}
      {showConfigureModal && (() => {
        const integration = integrations.find(i => i.id === showConfigureModal);
        if (!integration) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfigureModal(null)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Configure {integration.name}</h3>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Sync Frequency</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Data Sync Direction</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                    <option value="import">Import Only</option>
                    <option value="export">Export Only</option>
                    <option value="bidirectional">Bidirectional</option>
                  </select>
                </div>
                {integration.lastSync && (
                  <p className="text-xs text-gray-500">Last synced: {formatDate(integration.lastSync)}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowConfigureModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowConfigureModal(null)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Save Configuration</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Data Confirmation Modal */}
      {showDeleteDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteDataModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Delete All Program Data?</h3>
            <p className="text-gray-400 mb-4">
              This will permanently remove all programs, outcomes, and associated data. This action cannot be undone.
            </p>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
              <p className="text-sm text-red-400">Warning: This is a destructive action that cannot be reversed.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteDataModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowDeleteDataModal(false)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete All Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Plan Confirmation Modal */}
      {showCancelPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelPlanModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription?</h3>
            <p className="text-gray-400 mb-4">
              You will be downgraded to the free Community plan. You will lose access to premium features including event hosting, advanced analytics, and API access.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <p className="text-sm text-amber-400">Your current billing period will remain active until the end date.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCancelPlanModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Keep Plan</button>
              <button onClick={() => setShowCancelPlanModal(false)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Cancel Subscription</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteAccountModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Delete Organization Account?</h3>
            <p className="text-gray-400 mb-4">
              This will permanently delete your organization account, all programs, events, outcomes, employer connections, and billing data. This action is irreversible.
            </p>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
              <p className="text-sm text-red-400">
                This action is permanent and cannot be undone. All your data will be lost forever.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteAccountModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowDeleteAccountModal(false)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                <Trash2 className="w-4 h-4" />
                Delete Account Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
