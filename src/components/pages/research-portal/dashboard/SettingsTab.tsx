// ===========================================
// Settings Tab
// Researcher profile and account settings
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  GraduationCap,
  FileText,
  Lock,
  Clock
} from 'lucide-react';

interface Researcher {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  title: string;
  irbApproved: boolean;
  ferpaTrainingCompleted: boolean;
}

interface SettingsTabProps {
  researcher: Researcher;
  onUpdate: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ researcher, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [name, setName] = useState(researcher.name);
  const [email, setEmail] = useState(researcher.email);
  const [institution, setInstitution] = useState(researcher.institution);
  const [department, setDepartment] = useState(researcher.department);
  const [title, setTitle] = useState(researcher.title);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    dataAccessAlerts: true,
    complianceReminders: true,
    weeklyDigest: false
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    onUpdate();
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'institution', label: 'Institution', icon: Building2 },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your researcher profile and preferences</p>
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
                      ? 'bg-indigo-500/20 text-indigo-400'
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
              <h3 className="text-lg font-semibold text-white mb-6">Researcher Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
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
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Associate Professor"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 mt-4"
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

          {activeSection === 'institution' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Institution Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-sm text-indigo-400">
                    Your institution affiliation is verified through your institutional email domain.
                    Contact your IRB administrator to update institutional details.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'compliance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Compliance Status</h3>

                {/* IRB Status */}
                <div className={`p-4 rounded-lg mb-4 ${
                  researcher.irbApproved
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-amber-500/10 border border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {researcher.irbApproved ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">IRB Approval</p>
                        <p className="text-sm text-gray-400">
                          {researcher.irbApproved
                            ? 'Your IRB approval is active'
                            : 'IRB approval pending'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm ${
                      researcher.irbApproved ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {researcher.irbApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* FERPA Training */}
                <div className={`p-4 rounded-lg mb-4 ${
                  researcher.ferpaTrainingCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-amber-500/10 border border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {researcher.ferpaTrainingCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">FERPA Training</p>
                        <p className="text-sm text-gray-400">
                          {researcher.ferpaTrainingCompleted
                            ? 'Annual training completed'
                            : 'Training required'}
                        </p>
                      </div>
                    </div>
                    {!researcher.ferpaTrainingCompleted && (
                      <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm">
                        Complete Training
                      </button>
                    )}
                  </div>
                </div>

                {/* Data Use Agreements */}
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">Data Use Agreements</p>
                        <p className="text-sm text-gray-400">2 active DUAs on file</p>
                      </div>
                    </div>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </button>
                  </div>
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
                  { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes for your applications' },
                  { key: 'dataAccessAlerts', label: 'Data Access Alerts', desc: 'Notifications about data room access' },
                  { key: 'complianceReminders', label: 'Compliance Reminders', desc: 'IRB renewal and training reminders' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of activity' }
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
                          ? 'bg-indigo-500'
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
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Account Security</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-medium text-white text-left">Change Password</p>
                      <p className="text-sm text-gray-400">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-medium text-white text-left">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                    Enabled
                  </span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="font-medium text-white text-left">Access Logs</p>
                      <p className="text-sm text-gray-400">View your data access history</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
