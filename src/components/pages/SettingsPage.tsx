import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your account preferences and security settings.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-56 flex-shrink-0">
            <div className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail size={14} className="inline mr-1" /> Email
                      </label>
                      <input type="email" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Smartphone size={14} className="inline mr-1" /> Phone
                      </label>
                      <input type="tel" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Globe size={14} className="inline mr-1" /> Location
                      </label>
                      <input type="text" placeholder="City, State" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Job Alerts', desc: 'New jobs matching your profile' },
                    { label: 'Event Reminders', desc: 'Upcoming events and career fairs' },
                    { label: 'Challenge Updates', desc: 'New challenges and submission deadlines' },
                    { label: 'Platform News', desc: 'New features and announcements' },
                    { label: 'Weekly Digest', desc: 'Summary of opportunities and activity' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-700 peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">
                    <Key size={18} className="inline mr-2" />Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
                  <p className="text-sm text-slate-400 mb-4">Add an extra layer of security to your account.</p>
                  <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Display Preferences</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Industry Focus</label>
                    <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none">
                      <option value="">All Industries</option>
                      <option>Semiconductor</option>
                      <option>Nuclear Technologies</option>
                      <option>AI & Machine Learning</option>
                      <option>Quantum Computing</option>
                      <option>Cybersecurity</option>
                      <option>Aerospace & Defense</option>
                      <option>Biotechnology</option>
                      <option>Robotics</option>
                      <option>Clean Energy</option>
                      <option>Advanced Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Location</label>
                    <input type="text" placeholder="e.g., San Francisco, CA" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                    <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none">
                      <option>Student / Entry Level</option>
                      <option>Mid-Career (3-7 years)</option>
                      <option>Senior (8+ years)</option>
                      <option>Executive / Leadership</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
              {saved && (
                <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
                  <CheckCircle size={14} /> Settings saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
