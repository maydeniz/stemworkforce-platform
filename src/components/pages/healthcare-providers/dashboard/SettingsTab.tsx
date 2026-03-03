// ===========================================
// Settings Tab
// Provider profile and account settings
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Shield,
  Bell,
  Key,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Lock,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Plus,
  AlertTriangle,
  Globe,
  Monitor
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import type { ProviderSpecialty } from '@/types/healthcareProvider';

// UI-friendly provider type for settings
interface UIHealthcareProvider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialty: string;
  credentials?: string[];
  npiNumber?: string;
  npiVerified?: boolean;
  licenses?: Array<{
    type: string;
    number: string;
    state: string;
    status: string;
    expirationDate: string;
  }>;
  // Additional fields for settings form
  firstName?: string;
  lastName?: string;
  credentialsList?: string[];
}

interface SettingsTabProps {
  provider: UIHealthcareProvider;
  onUpdate: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ provider, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [showSchoolRequestModal, setShowSchoolRequestModal] = useState(false);

  // Parse provider name into first/last for form
  const nameParts = provider.name?.replace(/^Dr\.\s*/i, '').split(' ') || [];
  const defaultFirstName = provider.firstName || nameParts[0] || '';
  const defaultLastName = provider.lastName || nameParts.slice(1).join(' ') || '';

  // Profile form state
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(provider.email);
  const [phone, setPhone] = useState(provider.phone || '');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [specialty, setSpecialty] = useState<ProviderSpecialty>(provider.specialty as ProviderSpecialty);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newMessages: true,
    excuseApprovals: true,
    physicalReminders: true,
    weeklyDigest: false
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await healthcareProviderApi.updateProvider(provider.id, {
        firstName,
        lastName,
        email,
        phone,
        address: {
          street1: addressStreet,
          city: addressCity,
          state: addressState,
          zipCode: addressZip,
          country: 'USA'
        },
        specialty
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setSaving(false);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'practice', label: 'Practice Info', icon: Building2 },
    { id: 'credentials', label: 'Credentials', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your provider profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-fit">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Provider Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as ProviderSpecialty)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pediatrics">Pediatrics</option>
                    <option value="family-medicine">Family Medicine</option>
                    <option value="dental-general">Dentistry</option>
                    <option value="sports-medicine">Sports Medicine</option>
                    <option value="psychiatry">Psychiatry</option>
                    <option value="general-practice">General Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="Street address"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="City"
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      placeholder="State"
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      placeholder="ZIP"
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 mt-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === 'practice' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Practice Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Practice Name</label>
                  <input
                    type="text"
                    placeholder="Enter practice name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Practice Type</label>
                    <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option>Solo Practice</option>
                      <option>Group Practice</option>
                      <option>Hospital/Clinic</option>
                      <option>School-Based</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Years in Practice</label>
                    <input
                      type="number"
                      placeholder="Years"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Schools Served</label>
                  <div className="space-y-2">
                    {['Lincoln Elementary', 'Washington Middle School', 'Roosevelt High School'].map(school => (
                      <div key={school} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-white">{school}</span>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Active</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSchoolRequestModal(true)}
                    className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    + Request access to additional schools
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'credentials' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Credential Verification</h3>

                {/* NPI Status */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <div>
                        <p className="font-medium text-white">NPI Verified</p>
                        <p className="text-sm text-gray-400">NPI: {provider.npiNumber}</p>
                      </div>
                    </div>
                    <span className="text-sm text-emerald-400">Verified</span>
                  </div>
                </div>

                {/* Licenses */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white">State Licenses</h4>
                  {provider.licenses?.map((license, i) => (
                    <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">{license.type}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          license.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {license.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">License #:</span>
                          <span className="text-white ml-2">{license.number}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">State:</span>
                          <span className="text-white ml-2">{license.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Expires:</span>
                          <span className="text-white ml-2">{new Date(license.expirationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddLicenseModal(true)}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    + Add License
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Credentials</h3>
                <div className="flex flex-wrap gap-2">
                  {(provider.credentialsList || provider.credentials || []).map((cred: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important notifications via email' },
                  { key: 'newMessages', label: 'New Messages', desc: 'Get notified when school nurses send messages' },
                  { key: 'excuseApprovals', label: 'Excuse Approvals', desc: 'Notifications when excuses are processed' },
                  { key: 'physicalReminders', label: 'Physical Reminders', desc: 'Reminders for expiring sports physicals' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({
                        ...notifications,
                        [item.key]: !notifications[item.key as keyof typeof notifications]
                      })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-emerald-500'
                          : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'left-7'
                            : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Account Security</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="font-medium text-white text-left">Change Password</p>
                        <p className="text-sm text-gray-400">Update your account password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setShow2FAModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="font-medium text-white text-left">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                      Not Enabled
                    </span>
                  </button>

                  <button
                    onClick={() => setShowLoginHistoryModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="font-medium text-white text-left">Login History</p>
                        <p className="text-sm text-gray-400">View recent login activity</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">HIPAA Compliance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-white">Business Associate Agreement</span>
                    </div>
                    <span className="text-sm text-emerald-400">Signed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-white">HIPAA Training</span>
                    </div>
                    <span className="text-sm text-emerald-400">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Audit Logs</span>
                    </div>
                    <button
                      onClick={() => setShowAuditLogsModal(true)}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>

      {/* Two-Factor Authentication Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <TwoFactorAuthModal onClose={() => setShow2FAModal(false)} />
        )}
      </AnimatePresence>

      {/* Login History Modal */}
      <AnimatePresence>
        {showLoginHistoryModal && (
          <LoginHistoryModal onClose={() => setShowLoginHistoryModal(false)} />
        )}
      </AnimatePresence>

      {/* Audit Logs Modal */}
      <AnimatePresence>
        {showAuditLogsModal && (
          <AuditLogsModal onClose={() => setShowAuditLogsModal(false)} />
        )}
      </AnimatePresence>

      {/* Add License Modal */}
      <AnimatePresence>
        {showAddLicenseModal && (
          <AddLicenseModal onClose={() => setShowAddLicenseModal(false)} />
        )}
      </AnimatePresence>

      {/* School Request Modal */}
      <AnimatePresence>
        {showSchoolRequestModal && (
          <SchoolRequestModal onClose={() => setShowSchoolRequestModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// Change Password Modal
// ==========================================
interface ModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ModalProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (err) {
      setError('Failed to change password');
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// Two-Factor Authentication Modal
// ==========================================
const TwoFactorAuthModal: React.FC<ModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'intro' | 'setup' | 'verify'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEnable = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setStep('setup');
  };

  const handleVerify = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {step === 'intro' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Secure Your Account</h4>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security by requiring a verification code from your phone in addition to your password.
                </p>
              </div>
              <div className="space-y-2 text-left bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-white font-medium">What you'll need:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    An authenticator app (Google Authenticator, Authy, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Your mobile device
                  </li>
                </ul>
              </div>
            </div>
          )}

          {step === 'setup' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Scan this QR code with your authenticator app
                </p>
                <div className="bg-white p-4 rounded-lg w-48 h-48 mx-auto flex items-center justify-center">
                  <div className="text-gray-400 text-xs text-center">
                    [QR Code Placeholder]
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Or enter this code manually:</p>
                <p className="font-mono text-white bg-gray-800 px-4 py-2 rounded-lg mt-2">
                  ABCD-EFGH-IJKL-MNOP
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Enter verification code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-center font-mono text-lg tracking-widest focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          {step === 'intro' ? (
            <button
              onClick={handleEnable}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Enable 2FA'
              )}
            </button>
          ) : (
            <button
              onClick={handleVerify}
              disabled={saving || verificationCode.length !== 6}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Enable'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// Login History Modal
// ==========================================
const LoginHistoryModal: React.FC<ModalProps> = ({ onClose }) => {
  const loginHistory = [
    { id: 1, date: '2024-01-15T10:30:00', device: 'Chrome on macOS', location: 'San Francisco, CA', ip: '192.168.1.xxx', current: true },
    { id: 2, date: '2024-01-14T14:22:00', device: 'Safari on iPhone', location: 'San Francisco, CA', ip: '192.168.1.xxx', current: false },
    { id: 3, date: '2024-01-13T09:15:00', device: 'Chrome on macOS', location: 'San Francisco, CA', ip: '192.168.1.xxx', current: false },
    { id: 4, date: '2024-01-12T16:45:00', device: 'Firefox on Windows', location: 'Oakland, CA', ip: '10.0.0.xxx', current: false },
    { id: 5, date: '2024-01-11T11:00:00', device: 'Chrome on macOS', location: 'San Francisco, CA', ip: '192.168.1.xxx', current: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Login History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className={`p-4 rounded-lg ${
                  login.current
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {login.device}
                        {login.current && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            Current Session
                          </span>
                        )}
                      </p>
                      <div className="text-sm text-gray-400 space-y-1 mt-1">
                        <p className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {login.location}
                        </p>
                        <p>IP: {login.ip}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(login.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(login.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-800">
          <button className="text-sm text-red-400 hover:text-red-300">
            Sign out all other sessions
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// Audit Logs Modal
// ==========================================
const AuditLogsModal: React.FC<ModalProps> = ({ onClose }) => {
  const auditLogs = [
    { id: 1, action: 'Medical Excuse Created', details: 'Student: John Smith', timestamp: '2024-01-15T10:30:00', type: 'create' },
    { id: 2, action: 'Sports Physical Viewed', details: 'Student: Sarah Johnson', timestamp: '2024-01-15T09:15:00', type: 'view' },
    { id: 3, action: 'Medical Excuse Updated', details: 'Student: Mike Brown', timestamp: '2024-01-14T14:22:00', type: 'update' },
    { id: 4, action: 'Document Downloaded', details: 'Physical Form - Emily Davis', timestamp: '2024-01-14T11:00:00', type: 'download' },
    { id: 5, action: 'Profile Settings Updated', details: 'Email address changed', timestamp: '2024-01-13T16:45:00', type: 'update' },
    { id: 6, action: 'School Connection Established', details: 'Lincoln Elementary', timestamp: '2024-01-12T09:30:00', type: 'create' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-emerald-500/20 text-emerald-400';
      case 'view': return 'bg-blue-500/20 text-blue-400';
      case 'update': return 'bg-amber-500/20 text-amber-400';
      case 'download': return 'bg-indigo-500/20 text-indigo-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
            <p className="text-sm text-gray-400">HIPAA-compliant activity tracking</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs capitalize ${getTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                  <div>
                    <p className="text-white text-sm">{log.action}</p>
                    <p className="text-gray-400 text-xs">{log.details}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-800">
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            Export Logs (CSV)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// Add License Modal
// ==========================================
const AddLicenseModal: React.FC<ModalProps> = ({ onClose }) => {
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [state, setState] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    onClose();
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Add License</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">License Type</label>
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select license type</option>
              <option value="MD">Medical Doctor (MD)</option>
              <option value="DO">Doctor of Osteopathy (DO)</option>
              <option value="PA">Physician Assistant (PA)</option>
              <option value="NP">Nurse Practitioner (NP)</option>
              <option value="RN">Registered Nurse (RN)</option>
              <option value="DDS">Doctor of Dental Surgery (DDS)</option>
              <option value="DMD">Doctor of Dental Medicine (DMD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">License Number</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter license number"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select state</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
              <p className="text-sm text-amber-400">
                License verification may take 24-48 hours. You'll receive an email when verification is complete.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !licenseType || !licenseNumber || !state || !expirationDate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add License
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// School Request Modal
// ==========================================
const SchoolRequestModal: React.FC<ModalProps> = ({ onClose }) => {
  const [schoolName, setSchoolName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSending(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Request School Access</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-gray-400 text-sm">
            Request access to serve additional schools. The school administrator will review and approve your request.
          </p>

          <div>
            <label className="block text-sm text-gray-400 mb-1">School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter school name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">District Name</label>
            <input
              type="text"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              placeholder="Enter district name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">School Contact Email (Optional)</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="admin@school.edu"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Message to School Administrator</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to serve this school..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending || !schoolName || !districtName}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsTab;
