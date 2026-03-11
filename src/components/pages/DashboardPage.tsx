// ===========================================
// DASHBOARD PAGE - Role-Based Dashboards
// Supports: Intern, JobSeeker, Educator, Partner
// ===========================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { UsageMeter, FeatureGate, UpgradePrompt } from '@/components/common';
import { useBilling } from '@/contexts/BillingContext';
import { AddProgramModal } from '@/components/modals/AddProgramModal';
import type { ProgramFormData } from '@/types/program';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_name?: string;
  organization_type?: string;
}

// Partner/Employer organization types with styling
const orgTypes = {
  'federal': { name: 'Federal Government', icon: '🏛️', color: '#3b82f6' },
  'national-lab': { name: 'National Laboratory', icon: '⚛️', color: '#8b5cf6' },
  'municipality': { name: 'State/Local Government', icon: '🏙️', color: '#10b981' },
  'academic': { name: 'Academic Institution', icon: '🎓', color: '#f59e0b' },
  'private': { name: 'Private Sector', icon: '🏢', color: '#F5C518' },
  'nonprofit': { name: 'Non-Profit Organization', icon: '💚', color: '#06b6d4' },
  // Map role values to org types
  'partner_federal': { name: 'Federal Government', icon: '🏛️', color: '#3b82f6' },
  'partner_lab': { name: 'National Laboratory', icon: '⚛️', color: '#8b5cf6' },
  'partner_industry': { name: 'Industry Partner', icon: '🏢', color: '#F5C518' },
  'partner_nonprofit': { name: 'Non-Profit Organization', icon: '💚', color: '#06b6d4' },
  'partner_academic': { name: 'Academic Institution', icon: '🔬', color: '#f59e0b' },
  'partner': { name: 'Partner Organization', icon: '🤝', color: '#8b5cf6' },
  'employer': { name: 'Employer', icon: '🏢', color: '#F5C518' },
};

// ============================================
// INTERN/LEARNER DASHBOARD
// ============================================
const InternDashboard: React.FC<{ user: UserProfile; onSignOut: () => void }> = ({ user, onSignOut }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'applications', icon: '📝', label: 'My Applications', badge: 12 },
    { id: 'saved', icon: '💾', label: 'Saved Opportunities' },
    { id: 'challenges', icon: '🏆', label: 'Challenges' },
    { id: 'clearance', icon: '🛡️', label: 'Clearance Center' },
    { id: 'documents', icon: '🔐', label: 'Document Vault' },
    { id: 'messages', icon: '💬', label: 'Messages', badge: 3 },
    { id: 'interviews', icon: '📅', label: 'Interviews' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const applications = [
    { id: 1, title: 'AI/ML Engineering Intern', company: 'Google DeepMind', status: 'Interview Scheduled', stage: 4, clearance: 'None' },
    { id: 2, title: 'Quantum Research Intern', company: 'Oak Ridge National Lab', status: 'Clearance Review', stage: 3, clearance: 'Q Clearance' },
    { id: 3, title: 'Cybersecurity Intern', company: 'NSA', status: 'Application Submitted', stage: 1, clearance: 'TS/SCI' },
    { id: 4, title: 'Process Engineer Intern', company: 'Intel', status: 'Under Review', stage: 2, clearance: 'None' },
  ];

  const statusColors: Record<string, string> = { 
    'Interview Scheduled': '#F5C518', 
    'Under Review': '#06b6d4', 
    'Application Submitted': '#8b5cf6', 
    'Clearance Review': '#f59e0b' 
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="p-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-xl">🎓</div>
            <div>
              <div className="font-semibold text-white text-sm">{user.first_name} {user.last_name}</div>
              <div className="text-xs text-gray-400">Learner Account</div>
            </div>
          </div>
        </div>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 p-3 text-gray-400 hover:text-white text-sm"
        >
          ← Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            {/* Welcome Banner */}
            <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 rounded-3xl border border-cyan-500/20 mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.first_name}! 🎓</h1>
              <p className="text-gray-400">
                You have <span className="text-cyan-400 font-semibold">2 interview invitations</span> and{' '}
                <span className="text-orange-400 font-semibold">1 pending clearance application</span>.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Applications', value: 12, color: '#F5C518' },
                { label: 'Interviews', value: 4, color: '#10b981' },
                { label: 'Saved', value: 28, color: '#8b5cf6' },
                { label: 'Profile Views', value: 156, color: '#06b6d4' }
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Clearance CTA */}
            <div className="p-6 bg-gradient-to-r from-orange-500/10 to-transparent rounded-2xl border border-orange-500/20 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🛡️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Clearance Ready?</h3>
                    <p className="text-gray-400 text-sm">Many top internships require security clearance. Check your eligibility and start preparing.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-orange-500 text-gray-900 font-semibold rounded-xl">Check Eligibility</button>
                  <button className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl border border-gray-700">SF-86 Prep</button>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">📝 Recent Applications</h2>
              </div>
              {applications.map(app => (
                <div key={app.id} className="p-5 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white mb-1">{app.title}</div>
                    <div className="text-sm text-gray-400">{app.company}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {app.clearance !== 'None' && (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">{app.clearance}</span>
                    )}
                    <span 
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ 
                        backgroundColor: `${statusColors[app.status]}15`,
                        color: statusColors[app.status]
                      }}
                    >
                      {app.status}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div
                          key={s}
                          className={`w-6 h-1 rounded-full ${s <= app.stage ? 'bg-yellow-500' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">My Applications</h1>
              <div className="flex gap-3">
                <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                  <option>All Status</option>
                  <option>Interview Scheduled</option>
                  <option>Under Review</option>
                  <option>Submitted</option>
                </select>
                <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm">
                  Browse Internships
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {applications.map(app => (
                <div key={app.id} className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg mb-1">{app.title}</div>
                      <div className="text-gray-400 mb-2">{app.company}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Applied: Dec 15, 2024</span>
                        {app.clearance !== 'None' && (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">{app.clearance}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <span
                          className="px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: `${statusColors[app.status]}15`,
                            color: statusColors[app.status]
                          }}
                        >
                          {app.status}
                        </span>
                        <div className="flex gap-1 mt-2 justify-end">
                          {[1, 2, 3, 4, 5].map(s => (
                            <div
                              key={s}
                              className={`w-8 h-1.5 rounded-full ${s <= app.stage ? 'bg-yellow-500' : 'bg-gray-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Opportunities Tab */}
        {activeTab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Saved Opportunities</h1>
              <span className="text-gray-400">28 saved</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Data Science Intern', company: 'Meta', location: 'Menlo Park, CA', salary: '$45/hr', deadline: '5 days' },
                { title: 'Software Engineering Intern', company: 'Apple', location: 'Cupertino, CA', salary: '$50/hr', deadline: '2 weeks' },
                { title: 'ML Research Intern', company: 'DeepMind', location: 'London, UK', salary: '£40/hr', deadline: '1 week' },
                { title: 'Quantum Technologies Intern', company: 'IBM', location: 'Remote', salary: '$42/hr', deadline: '3 days' },
                { title: 'Cybersecurity Intern', company: 'CrowdStrike', location: 'Austin, TX', salary: '$38/hr', deadline: '10 days' },
              ].map((job, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-white mb-1">{job.title}</div>
                      <div className="text-gray-400 text-sm">{job.company}</div>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-green-400">{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">Deadline: {job.deadline}</span>
                    <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg text-sm font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm">
                + New Message
              </button>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { from: 'Sarah Chen', company: 'Google DeepMind', subject: 'Interview Confirmation', time: '2 hours ago', unread: true },
                { from: 'HR Team', company: 'Oak Ridge National Lab', subject: 'Clearance Application Update', time: '1 day ago', unread: true },
                { from: 'Mike Johnson', company: 'Intel', subject: 'Application Received', time: '3 days ago', unread: false },
                { from: 'Recruiter', company: 'NSA', subject: 'Additional Documents Required', time: '1 week ago', unread: true },
                { from: 'Career Services', company: 'STEMWorkforce', subject: 'New Opportunities Match Your Profile', time: '1 week ago', unread: false },
              ].map((msg, i) => (
                <div key={i} className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${msg.unread ? 'bg-yellow-500/5' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      {msg.unread && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                      <span className={`font-medium ${msg.unread ? 'text-white' : 'text-gray-400'}`}>{msg.from}</span>
                      <span className="text-gray-500 text-sm">• {msg.company}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{msg.time}</span>
                  </div>
                  <p className={`ml-5 ${msg.unread ? 'text-gray-300' : 'text-gray-500'}`}>{msg.subject}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Upcoming Interviews</h1>
            </div>
            <div className="space-y-4">
              {[
                { company: 'Google DeepMind', role: 'AI/ML Engineering Intern', date: 'Jan 8, 2025', time: '10:00 AM PST', type: 'Video Call', round: 'Technical Round 1' },
                { company: 'Apple', role: 'Software Engineering Intern', date: 'Jan 12, 2025', time: '2:00 PM PST', type: 'On-site', round: 'Final Round' },
              ].map((interview, i) => (
                <div key={i} className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-semibold text-white mb-1">{interview.company}</div>
                      <div className="text-gray-400">{interview.role}</div>
                    </div>
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">{interview.round}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📅</span> {interview.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>🕐</span> {interview.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📍</span> {interview.type}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm">
                      Join Meeting
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">First Name</label>
                      <input type="text" defaultValue={user.first_name} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                      <input type="text" defaultValue={user.last_name} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" disabled />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Education</h2>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <div className="font-medium text-white">MIT - Massachusetts Institute of Technology</div>
                      <div className="text-sm text-gray-400">B.S. Computer Science • Expected 2025</div>
                    </div>
                  </div>
                  <button className="mt-4 text-yellow-400 text-sm font-medium">+ Add Education</button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div className="font-semibold text-white">{user.first_name} {user.last_name}</div>
                  <div className="text-sm text-gray-400 mb-4">Learner Account</div>
                  <button className="text-yellow-400 text-sm font-medium">Change Photo</button>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-3">Profile Completion</h3>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="text-sm text-gray-400">75% Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new job matches', checked: true },
                    { label: 'Email notifications for application updates', checked: true },
                    { label: 'SMS notifications for interviews', checked: false },
                    { label: 'Weekly digest of opportunities', checked: true },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${setting.checked ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Privacy</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Make profile visible to employers', checked: true },
                    { label: 'Allow recruiters to contact me', checked: true },
                    { label: 'Show my profile in search results', checked: false },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${setting.checked ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clearance Center Tab */}
        {activeTab === 'clearance' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Clearance Center</h1>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { level: 'Public Trust', status: 'Eligible', color: '#10b981' },
                { level: 'Secret', status: 'Eligible', color: '#F5C518' },
                { level: 'Top Secret', status: 'Review Needed', color: '#f59e0b' },
              ].map((clearance, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-lg font-semibold text-white mb-2">{clearance.level}</div>
                  <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${clearance.color}15`, color: clearance.color }}>
                    {clearance.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">SF-86 Preparation Checklist</h2>
              <div className="space-y-3">
                {[
                  { task: 'Employment history (10 years)', complete: true },
                  { task: 'Residence history (10 years)', complete: true },
                  { task: 'Education verification', complete: true },
                  { task: 'Foreign contacts', complete: false },
                  { task: 'Financial records', complete: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.complete ? 'bg-green-500' : 'bg-gray-600'}`}>
                      {item.complete && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={item.complete ? 'text-gray-400' : 'text-white'}>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Document Vault</h1>
              <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm">
                + Upload Document
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Resume_2024.pdf', type: 'Resume', date: 'Dec 1, 2024', size: '245 KB' },
                { name: 'Transcript_MIT.pdf', type: 'Transcript', date: 'Nov 15, 2024', size: '1.2 MB' },
                { name: 'Cover_Letter_Google.docx', type: 'Cover Letter', date: 'Dec 10, 2024', size: '28 KB' },
                { name: 'Recommendation_Prof_Smith.pdf', type: 'Recommendation', date: 'Oct 20, 2024', size: '156 KB' },
                { name: 'Portfolio.pdf', type: 'Portfolio', date: 'Nov 1, 2024', size: '5.4 MB' },
              ].map((doc, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                      📄
                    </div>
                    <button className="text-gray-500 hover:text-white">⋮</button>
                  </div>
                  <div className="font-medium text-white text-sm mb-1 truncate">{doc.name}</div>
                  <div className="text-xs text-gray-500">{doc.type} • {doc.size}</div>
                  <div className="text-xs text-gray-600 mt-1">{doc.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================
// JOB SEEKER DASHBOARD
// ============================================
const JobSeekerDashboard: React.FC<{ user: UserProfile; onSignOut: () => void }> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'applications', icon: '📝', label: 'Applications', badge: 8 },
    { id: 'saved', icon: '💾', label: 'Saved Jobs' },
    { id: 'challenges', icon: '🏆', label: 'Challenges' },
    { id: 'interviews', icon: '📅', label: 'Interviews', badge: 2 },
    { id: 'clearance', icon: '🛡️', label: 'Clearance Status' },
    { id: 'resume', icon: '📄', label: 'Resume Builder' },
    { id: 'messages', icon: '💬', label: 'Messages', badge: 5 },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="p-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-xl">💼</div>
            <div>
              <div className="font-semibold text-white text-sm">{user.first_name} {user.last_name}</div>
              <div className="text-xs text-gray-400">Job Seeker</div>
            </div>
          </div>
        </div>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button onClick={onSignOut} className="flex items-center gap-2 p-3 text-gray-400 hover:text-white text-sm">
          ← Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            <div className="p-8 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-3xl border border-purple-500/20 mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.first_name}! 💼</h1>
              <p className="text-gray-400">
                You have <span className="text-purple-400 font-semibold">2 upcoming interviews</span> and{' '}
                <span className="text-green-400 font-semibold">5 new messages</span>.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Applications', value: 8, color: '#F5C518' },
                { label: 'Interviews', value: 2, color: '#10b981' },
                { label: 'Saved Jobs', value: 45, color: '#8b5cf6' },
                { label: 'Profile Views', value: 287, color: '#06b6d4' }
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Usage Meters */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <UsageMeter
                used={7}
                limit={10}
                label="Applications This Month"
                upgradeLink="/pricing"
                colorScheme="blue"
              />
              <UsageMeter
                used={8}
                limit={10}
                label="Saved Jobs"
                upgradeLink="/pricing"
                colorScheme="amber"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">🔥 Recommended Jobs</h2>
                <div className="space-y-3">
                  {[
                    { title: 'Senior AI Engineer', company: 'Anthropic', match: 95 },
                    { title: 'ML Research Scientist', company: 'OpenAI', match: 92 },
                    { title: 'Software Engineer', company: 'SpaceX', match: 88 }
                  ].map((job, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{job.title}</div>
                        <div className="text-sm text-gray-400">{job.company}</div>
                      </div>
                      <div className="text-green-400 font-semibold">{job.match}% match</div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="w-full mt-4 py-2.5 bg-yellow-500/10 text-yellow-400 rounded-xl font-medium"
                >
                  View All Jobs →
                </button>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">📅 Upcoming Events</h2>
                <div className="space-y-3">
                  {[
                    { title: 'AI/ML Career Fair', date: 'Jan 15, 2025', type: 'Virtual' },
                    { title: 'Cybersecurity Summit', date: 'Jan 22, 2025', type: 'In-Person' },
                    { title: 'Quantum Technologies Workshop', date: 'Feb 1, 2025', type: 'Hybrid' }
                  ].map((event, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{event.title}</div>
                        <div className="text-sm text-gray-400">{event.date}</div>
                      </div>
                      <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs">{event.type}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/events')}
                  className="w-full mt-4 py-2.5 bg-yellow-500/10 text-yellow-400 rounded-xl font-medium"
                >
                  View All Events →
                </button>
              </div>
            </div>

            {/* Salary Analytics (gated) */}
            <FeatureGate
              isUnlocked={false}
              feature="Salary Analytics"
              requiredTier="Career Pro"
              upgradeLink="/pricing"
            >
              <div className="mt-8 bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Salary Analytics</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Market Average', value: '$165,000', trend: '+5%' },
                    { label: 'Your Target Range', value: '$180-220K', trend: '' },
                    { label: 'Competitiveness', value: '85th %ile', trend: '+12%' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-xl text-center">
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                      {stat.trend && <div className="text-xs text-green-400 mt-1">{stat.trend}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </FeatureGate>
          </>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">My Applications</h1>
              <div className="flex gap-3">
                <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                  <option>All Status</option>
                  <option>Interview Scheduled</option>
                  <option>Under Review</option>
                  <option>Submitted</option>
                  <option>Offer Received</option>
                </select>
                <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium text-sm">
                  Browse Jobs
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { id: 1, title: 'Senior AI Engineer', company: 'Anthropic', status: 'Interview Scheduled', stage: 4, clearance: 'None', salary: '$180-220K', applied: 'Dec 20, 2024' },
                { id: 2, title: 'ML Research Scientist', company: 'OpenAI', status: 'Under Review', stage: 2, clearance: 'None', salary: '$200-250K', applied: 'Dec 18, 2024' },
                { id: 3, title: 'Quantum Technologies Engineer', company: 'IBM Quantum', status: 'Phone Screen', stage: 3, clearance: 'Secret', salary: '$150-180K', applied: 'Dec 15, 2024' },
                { id: 4, title: 'Cybersecurity Lead', company: 'CrowdStrike', status: 'Application Submitted', stage: 1, clearance: 'TS/SCI', salary: '$170-200K', applied: 'Dec 22, 2024' },
                { id: 5, title: 'Software Engineer', company: 'SpaceX', status: 'Offer Received', stage: 5, clearance: 'Secret', salary: '$160-190K', applied: 'Nov 28, 2024' },
              ].map(app => (
                <div key={app.id} className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg mb-1">{app.title}</div>
                      <div className="text-gray-400 mb-2">{app.company} • <span className="text-green-400">{app.salary}</span></div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Applied: {app.applied}</span>
                        {app.clearance !== 'None' && (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">{app.clearance}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          app.status === 'Offer Received' ? 'bg-green-500/15 text-green-400' :
                          app.status === 'Interview Scheduled' ? 'bg-yellow-500/15 text-yellow-400' :
                          app.status === 'Phone Screen' ? 'bg-cyan-500/15 text-cyan-400' :
                          'bg-purple-500/15 text-purple-400'
                        }`}>
                          {app.status}
                        </span>
                        <div className="flex gap-1 mt-2 justify-end">
                          {[1, 2, 3, 4, 5].map(s => (
                            <div key={s} className={`w-8 h-1.5 rounded-full ${s <= app.stage ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
              <span className="text-gray-400">45 saved</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Principal Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$200-280K', deadline: '5 days', match: 95 },
                { title: 'Staff ML Engineer', company: 'Meta', location: 'Menlo Park, CA', salary: '$220-300K', deadline: '2 weeks', match: 92 },
                { title: 'Senior Data Scientist', company: 'Netflix', location: 'Los Gatos, CA', salary: '$180-250K', deadline: '1 week', match: 88 },
                { title: 'Tech Lead', company: 'Stripe', location: 'Remote', salary: '$190-260K', deadline: '3 days', match: 91 },
                { title: 'AI Research Lead', company: 'DeepMind', location: 'London, UK', salary: '£150-200K', deadline: '10 days', match: 89 },
                { title: 'Security Architect', company: 'Palo Alto Networks', location: 'Santa Clara, CA', salary: '$175-225K', deadline: '4 days', match: 85 },
              ].map((job, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-white mb-1">{job.title}</div>
                      <div className="text-gray-400 text-sm">{job.company}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-medium">{job.match}%</span>
                      <button className="text-purple-400 hover:text-purple-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-green-400">{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">Deadline: {job.deadline}</span>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Interviews</h1>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium">Upcoming</button>
                <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm">Completed</button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { company: 'Anthropic', role: 'Senior AI Engineer', date: 'Jan 8, 2025', time: '10:00 AM PST', type: 'Video Call', round: 'Technical Interview', interviewers: 'Sarah Chen, Mike Johnson' },
                { company: 'SpaceX', role: 'Software Engineer', date: 'Jan 12, 2025', time: '2:00 PM PST', type: 'On-site', round: 'Final Round', interviewers: 'Engineering Team' },
              ].map((interview, i) => (
                <div key={i} className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-semibold text-white mb-1">{interview.company}</div>
                      <div className="text-gray-400">{interview.role}</div>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">{interview.round}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📅</span> {interview.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>🕐</span> {interview.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📍</span> {interview.type}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Interviewers: <span className="text-gray-400">{interview.interviewers}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium text-sm">
                      {interview.type === 'Video Call' ? 'Join Meeting' : 'View Details'}
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
                      Reschedule
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
                      Prepare
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">Completed Interviews</h2>
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                {[
                  { company: 'OpenAI', role: 'ML Research Scientist', date: 'Dec 28, 2024', result: 'Pending' },
                  { company: 'Netflix', role: 'Senior Data Scientist', date: 'Dec 20, 2024', result: 'Passed' },
                ].map((interview, i) => (
                  <div key={i} className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{interview.company} - {interview.role}</div>
                      <div className="text-sm text-gray-500">{interview.date}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${
                      interview.result === 'Passed' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {interview.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clearance Status Tab */}
        {activeTab === 'clearance' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Clearance Status</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { level: 'Public Trust', status: 'Eligible', color: '#10b981', icon: '✓' },
                { level: 'Secret', status: 'Active', color: '#F5C518', icon: '✓' },
                { level: 'Top Secret', status: 'Eligible', color: '#8b5cf6', icon: '✓' },
                { level: 'TS/SCI', status: 'Pending', color: '#f59e0b', icon: '⏳' },
              ].map((clearance, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{clearance.icon}</span>
                    <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: `${clearance.color}15`, color: clearance.color }}>
                      {clearance.status}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-white">{clearance.level}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Active Clearance Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Clearance Level</span>
                    <span className="text-white font-medium">Secret</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Granted Date</span>
                    <span className="text-white font-medium">March 15, 2023</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Renewal Date</span>
                    <span className="text-white font-medium">March 15, 2033</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Sponsoring Agency</span>
                    <span className="text-white font-medium">DoD</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">TS/SCI Application Progress</h2>
                <div className="space-y-3">
                  {[
                    { step: 'SF-86 Submitted', complete: true },
                    { step: 'Background Check', complete: true },
                    { step: 'Polygraph Scheduled', complete: false, current: true },
                    { step: 'Final Review', complete: false },
                    { step: 'Clearance Granted', complete: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.complete ? 'bg-green-500' : step.current ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}>
                        {step.complete ? <span className="text-white text-xs">✓</span> :
                         step.current ? <span className="text-gray-900 text-xs">●</span> : null}
                      </div>
                      <span className={step.complete ? 'text-gray-400' : step.current ? 'text-white' : 'text-gray-500'}>
                        {step.step}
                      </span>
                      {step.current && <span className="ml-auto text-xs text-yellow-400">In Progress</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Builder Tab */}
        {activeTab === 'resume' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">Import from LinkedIn</button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium text-sm">+ Create New</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 mb-6">
                  <h2 className="text-lg font-semibold text-white mb-4">My Resumes</h2>
                  <div className="space-y-3">
                    {[
                      { name: 'Software Engineer - General', updated: 'Dec 28, 2024', tailored: false, score: 85 },
                      { name: 'AI/ML Specialist Resume', updated: 'Dec 20, 2024', tailored: true, score: 92 },
                      { name: 'Security Clearance Resume', updated: 'Dec 15, 2024', tailored: true, score: 88 },
                    ].map((resume, i) => (
                      <div key={i} className="p-4 bg-gray-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                            📄
                          </div>
                          <div>
                            <div className="font-medium text-white">{resume.name}</div>
                            <div className="text-sm text-gray-500">Updated: {resume.updated}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {resume.tailored && (
                            <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">Tailored</span>
                          )}
                          <div className="text-right">
                            <div className={`font-semibold ${resume.score >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {resume.score}/100
                            </div>
                            <div className="text-xs text-gray-500">ATS Score</div>
                          </div>
                          <button className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">AI Resume Optimization</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Paste a job description and we'll optimize your resume for ATS systems and highlight relevant experience.
                  </p>
                  <textarea
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white h-32 resize-none mb-4"
                    placeholder="Paste job description here..."
                  />
                  <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium">
                    Optimize Resume
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Resume Score</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="8" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke="#8b5cf6" strokeWidth="8" fill="none"
                        strokeDasharray={`${85 * 3.52} 352`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">85</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Good - Room for improvement</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Suggestions</h3>
                  <div className="space-y-3">
                    {[
                      'Add more quantifiable achievements',
                      'Include relevant certifications',
                      'Expand technical skills section',
                    ].map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-400">💡</span>
                        <span className="text-gray-400">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium text-sm">
                + New Message
              </button>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { from: 'Anthropic Recruiting', subject: 'Interview Confirmation - Senior AI Engineer', time: '2 hours ago', unread: true, preview: 'Hi! We are excited to confirm your interview for...' },
                { from: 'SpaceX HR', subject: 'Offer Letter - Software Engineer', time: '1 day ago', unread: true, preview: 'Congratulations! We are pleased to extend an offer...' },
                { from: 'OpenAI Talent', subject: 'Application Update', time: '2 days ago', unread: false, preview: 'Thank you for your patience. Your application is...' },
                { from: 'LinkedIn Recruiter', subject: 'Exciting Opportunity at Meta', time: '3 days ago', unread: false, preview: 'I came across your profile and thought you would be...' },
                { from: 'Google Careers', subject: 'Your Application Status', time: '1 week ago', unread: false, preview: 'We have reviewed your application for Principal...' },
              ].map((msg, i) => (
                <div key={i} className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${msg.unread ? 'bg-purple-500/5' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {msg.unread && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                      <span className={`font-medium ${msg.unread ? 'text-white' : 'text-gray-400'}`}>{msg.from}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{msg.time}</span>
                  </div>
                  <p className={`font-medium mb-1 ${msg.unread ? 'text-white' : 'text-gray-400'}`}>{msg.subject}</p>
                  <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">First Name</label>
                      <input type="text" defaultValue={user.first_name} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                      <input type="text" defaultValue={user.last_name} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" disabled />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Location</label>
                      <input type="text" defaultValue="San Francisco, CA" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">Save Changes</button>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Work Experience</h2>
                  <div className="space-y-3">
                    {[
                      { role: 'Senior Software Engineer', company: 'Tech Corp', period: '2022 - Present' },
                      { role: 'Software Engineer', company: 'Startup Inc', period: '2019 - 2022' },
                    ].map((exp, i) => (
                      <div key={i} className="p-4 bg-gray-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-medium text-white">{exp.role}</div>
                          <div className="text-sm text-gray-400">{exp.company} • {exp.period}</div>
                        </div>
                        <button className="text-gray-400 hover:text-white">Edit</button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-purple-400 text-sm font-medium">+ Add Experience</button>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Education</h2>
                  <div className="p-4 bg-gray-800 rounded-xl">
                    <div className="font-medium text-white">Stanford University</div>
                    <div className="text-sm text-gray-400">M.S. Computer Science • 2019</div>
                  </div>
                  <button className="mt-4 text-purple-400 text-sm font-medium">+ Add Education</button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div className="font-semibold text-white">{user.first_name} {user.last_name}</div>
                  <div className="text-sm text-gray-400 mb-4">Job Seeker</div>
                  <button className="text-purple-400 text-sm font-medium">Change Photo</button>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-3">Profile Completion</h3>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="text-sm text-gray-400">85% Complete</div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="text-gray-500">Missing:</div>
                    <div className="text-yellow-400">• Add portfolio link</div>
                    <div className="text-yellow-400">• Complete skills assessment</div>
                  </div>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Machine Learning', 'AWS', 'React', 'Node.js', 'SQL'].map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">{skill}</span>
                    ))}
                  </div>
                  <button className="mt-4 text-purple-400 text-sm font-medium">+ Add Skills</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Job Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Desired Salary Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Min (e.g., $150,000)" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                      <input type="text" placeholder="Max (e.g., $250,000)" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Preferred Work Type</label>
                    <div className="flex gap-3">
                      {['Remote', 'Hybrid', 'On-site'].map((type, i) => (
                        <button key={i} className={`px-4 py-2 rounded-lg text-sm ${i === 0 ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new job matches', checked: true },
                    { label: 'Email notifications for application updates', checked: true },
                    { label: 'SMS notifications for interviews', checked: true },
                    { label: 'Weekly job digest', checked: false },
                    { label: 'Recruiter messages', checked: true },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${setting.checked ? 'bg-purple-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Privacy</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Make profile visible to employers', checked: true },
                    { label: 'Allow recruiters to contact me', checked: true },
                    { label: 'Show salary expectations on profile', checked: false },
                    { label: 'Show in search results', checked: true },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${setting.checked ? 'bg-purple-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">
                    Download My Data
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================
// EDUCATOR DASHBOARD
// ============================================
const EducatorDashboard: React.FC<{ user: UserProfile; onSignOut: () => void }> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [showPostOpportunityModal, setShowPostOpportunityModal] = useState(false);
  const [, setIsSubmittingEduPosting] = useState(false);
  const [, setLoadingEduJobs] = useState(true);

  // Job/Internship Posting State for Education Providers
  const [eduPostingForm, setEduPostingForm] = useState({
    title: '',
    postingType: 'internship' as 'job' | 'internship',
    employmentType: 'full-time',
    workLocationType: 'onsite' as 'onsite' | 'remote' | 'hybrid',
    workLocationCity: '',
    workLocationState: '',
    remoteRestrictions: '',
    hybridDaysOnsite: '',
    salaryType: 'hourly' as 'annual' | 'hourly',
    salaryMin: '',
    salaryMax: '',
    salaryNegotiable: false,
    bonusEligible: false,
    equityOffered: false,
    benefits: [] as string[],
    department: '',
    travelRequired: 'none' as 'none' | 'occasional' | 'frequent' | 'extensive',
    educationLevel: 'bachelors',
    yearsExperience: '',
    requiredSkills: '',
    preferredSkills: '',
    certifications: '',
    clearanceLevel: 'none',
    clearanceSponsored: false,
    description: '',
    responsibilities: '',
    qualifications: '',
    applicationDeadline: '',
    startDate: '',
    applicationUrl: '',
    contactEmail: '',
    internshipPaid: true,
    internshipDuration: '',
    internshipHoursPerWeek: '',
    academicCreditAvailable: true,
    mentorshipProvided: true,
    conversionPossible: false,
    internshipProgram: '',
    urgentHiring: false,
    featuredListing: false,
    postingExpiration: '30',
  });

  // Job/internship listings - fetched from database
  const [eduOpportunities, setEduOpportunities] = useState<any[]>([]);

  // Fetch jobs from database on component mount
  useEffect(() => {
    const fetchEduJobs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoadingEduJobs(false);
          return;
        }

        // Get user's organization ID
        const { data: userDataArray, error: userError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', session.user.id)
          .limit(1);

        const userData = userDataArray?.[0];

        if (userError) {
          console.error('Error fetching user for edu jobs:', userError);
          setLoadingEduJobs(false);
          return;
        }

        if (!userData?.organization_id) {
if (import.meta.env.DEV) console.log('No organization found for educator');
          setLoadingEduJobs(false);
          return;
        }

        // Fetch jobs for this organization
if (import.meta.env.DEV) console.log('Fetching edu jobs for organization:', userData.organization_id);
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('organization_id', userData.organization_id)
          .order('created_at', { ascending: false });

if (import.meta.env.DEV) console.log('Edu jobs query result:', { jobs, error, count: jobs?.length });

        if (error) {
          console.error('Error fetching edu jobs:', error);
          setLoadingEduJobs(false);
          return;
        }

        // Transform jobs to display format
        const formattedJobs = (jobs || []).map(job => ({
          id: job.id,
          title: job.title,
          type: job.type === 'internship' ? 'internship' : 'job',
          location: job.location || 'Not specified',
          salary: job.salary_period === 'hourly'
            ? `$${job.salary_min}/hr - $${job.salary_max}/hr`
            : `$${job.salary_min?.toLocaleString() || 0} - $${job.salary_max?.toLocaleString() || 0}`,
          posted: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          applications: job.applications_count || 0,
          status: job.status || 'active',
        }));

        setEduOpportunities(formattedJobs);
if (import.meta.env.DEV) console.log('Fetched edu jobs:', formattedJobs);
      } catch (error) {
        console.error('Error in fetchEduJobs:', error);
      } finally {
        setLoadingEduJobs(false);
      }
    };

    fetchEduJobs();
  }, []);

  const handleSubmitEduPosting = async () => {
    if (!eduPostingForm.title || !eduPostingForm.description) {
      alert('Please fill in the required fields');
      return;
    }

    setIsSubmittingEduPosting(true);

    try {
      // Get current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to post a job');
        setIsSubmittingEduPosting(false);
        return;
      }

      // Get user's organization ID
      const { data: userDataArray, error: userError } = await supabase
        .from('users')
        .select('id, organization_id')
        .eq('id', session.user.id)
        .limit(1);

      const userData = userDataArray?.[0];

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        alert(`Could not find your user data. Error: ${userError?.message || 'User record not found'}`);
        setIsSubmittingEduPosting(false);
        return;
      }

      if (!userData.organization_id) {
        alert('Your account is not linked to an organization. Please contact support.');
        setIsSubmittingEduPosting(false);
        return;
      }

      // Build location string
      let locationString = '';
      if (eduPostingForm.workLocationType === 'remote') {
        locationString = 'Remote';
        if (eduPostingForm.remoteRestrictions) {
          locationString += ` (${eduPostingForm.remoteRestrictions})`;
        }
      } else if (eduPostingForm.workLocationType === 'hybrid') {
        locationString = `Hybrid - ${eduPostingForm.workLocationCity}, ${eduPostingForm.workLocationState}`;
      } else {
        locationString = eduPostingForm.workLocationCity && eduPostingForm.workLocationState
          ? `${eduPostingForm.workLocationCity}, ${eduPostingForm.workLocationState}`
          : 'On-campus';
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(eduPostingForm.postingExpiration || '30'));

      // Generate a URL-friendly slug from the title
      const generateSlug = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          + '-' + Date.now();
      };

      // Prepare job data matching actual database schema
      const jobData: Record<string, any> = {
        organization_id: userData.organization_id,
        posted_by_id: session.user.id,
        title: eduPostingForm.title,
        slug: generateSlug(eduPostingForm.title),
        description: eduPostingForm.description,
        location: locationString,
        industry: 'ai', // Default for academia - could be made configurable
        type: eduPostingForm.postingType === 'internship' ? 'internship' : 'full_time',
        expires_at: expiresAt.toISOString(),
        status: 'active',

        // Optional fields
        remote: eduPostingForm.workLocationType === 'remote',
        department: eduPostingForm.department || null,
        responsibilities: eduPostingForm.responsibilities || null,
        qualifications: eduPostingForm.qualifications || null,
        employment_type: eduPostingForm.employmentType,
        work_arrangement: eduPostingForm.workLocationType === 'onsite' ? 'on-site' :
                          eduPostingForm.workLocationType === 'hybrid' ? 'hybrid' : 'remote',

        // Compensation
        salary_min: parseInt(eduPostingForm.salaryMin) || null,
        salary_max: parseInt(eduPostingForm.salaryMax) || null,
        salary_period: eduPostingForm.salaryType === 'hourly' ? 'hourly' : 'yearly',
        show_salary: true,

        // Clearance
        clearance_level: eduPostingForm.clearanceLevel,

        // Application settings
        application_deadline: eduPostingForm.applicationDeadline || null,
        start_date: eduPostingForm.startDate || null,
        external_url: eduPostingForm.applicationUrl || null,

        // Posting settings
        featured: eduPostingForm.featuredListing || false,
      };

if (import.meta.env.DEV) console.log('Submitting edu job to database:', jobData);

      // Insert into database
      const { data: newJob, error: insertError } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting edu job:', insertError);
        alert(`Failed to post job: ${insertError.message}`);
        setIsSubmittingEduPosting(false);
        return;
      }

if (import.meta.env.DEV) console.log('Edu job posted successfully:', newJob);

      // Add to local state for immediate UI update
      const newOpp = {
        id: newJob.id,
        title: newJob.title,
        type: newJob.type === 'internship' ? 'internship' : 'job',
        location: newJob.location,
        salary: newJob.salary_period === 'hourly'
          ? `$${newJob.salary_min}/hr - $${newJob.salary_max}/hr`
          : `$${newJob.salary_min?.toLocaleString() || 0} - $${newJob.salary_max?.toLocaleString() || 0}`,
        posted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        applications: 0,
        status: newJob.status || 'active',
      };
      setEduOpportunities(prev => [newOpp, ...prev]);

      setShowPostOpportunityModal(false);
      // Reset form
      setEduPostingForm({
        ...eduPostingForm,
        title: '',
        description: '',
        responsibilities: '',
        qualifications: '',
      });
      alert(`${eduPostingForm.postingType === 'job' ? 'Job' : 'Internship'} posted successfully!`);
    } catch (error) {
      console.error('Error in handleSubmitEduPosting:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingEduPosting(false);
    }
  };

  // Event management state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    name: string;
    date: string;
    type: string;
    attendees: number;
    employers?: number;
    hires?: number;
    description?: string;
    location?: string;
    status?: string;
  } | null>(null);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: '',
    type: 'Career Fair',
    description: '',
    location: '',
    maxAttendees: '',
  });
  const [events, setEvents] = useState([
    { id: 1, name: 'AI/ML Career Fair', date: 'Jan 15, 2025', type: 'Career Fair', attendees: 250, employers: 15, location: 'Main Campus Auditorium', description: 'Connect with top AI/ML employers', status: 'upcoming' },
    { id: 2, name: 'Cybersecurity Workshop', date: 'Jan 22, 2025', type: 'Workshop', attendees: 45, employers: 3, location: 'Tech Center Room 101', description: 'Hands-on cybersecurity training', status: 'upcoming' },
    { id: 3, name: 'Industry Panel: Future of Tech', date: 'Feb 5, 2025', type: 'Panel', attendees: 120, employers: 8, location: 'Virtual Event', description: 'Industry leaders discuss tech trends', status: 'upcoming' },
  ]);

  // Handle Create Event
  const handleCreateEvent = () => {
    if (!eventFormData.name || !eventFormData.date) {
      alert('Please fill in the event name and date');
      return;
    }
    const newEvent = {
      id: Date.now(),
      name: eventFormData.name,
      date: new Date(eventFormData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: eventFormData.type,
      attendees: 0,
      employers: 0,
      location: eventFormData.location,
      description: eventFormData.description,
      status: 'upcoming',
    };
    setEvents([...events, newEvent]);
    setEventFormData({ name: '', date: '', type: 'Career Fair', description: '', location: '', maxAttendees: '' });
    setShowCreateEventModal(false);
    alert('Event created successfully!');
  };

  // Handle View Event Details
  const handleViewEventDetails = (event: typeof selectedEvent) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  // Handle Manage Event (opens details with edit capability)
  const handleManageEvent = (event: typeof selectedEvent) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  // ==========================================
  // BILLING STATE MANAGEMENT
  // ==========================================
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false);
  const [_selectedInvoice, _setSelectedInvoice] = useState<unknown>(null);

  // Subscription plans
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      period: 'month',
      features: ['Up to 5 programs', 'Basic analytics', 'Email support', 'Community access'],
      recommended: false,
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 499,
      period: 'month',
      features: ['Unlimited programs', 'Advanced analytics', 'Priority support', 'Event management', 'Employer matching', 'Custom branding'],
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      period: 'month',
      features: ['Everything in Growth', 'Dedicated account manager', 'API access', 'SSO integration', 'Custom integrations', 'SLA guarantee', 'Bulk data import'],
      recommended: false,
    },
  ];

  // Current subscription state
  const [currentSubscription, setCurrentSubscription] = useState({
    planId: 'growth',
    planName: 'Growth',
    status: 'active',
    currentPeriodStart: '2024-12-01',
    currentPeriodEnd: '2025-01-01',
    nextBillingDate: 'Jan 1, 2025',
    amount: 499,
  });

  // Invoices
  const [invoices, _setInvoices] = useState([
    { id: 'INV-2024-012', date: 'Dec 1, 2024', amount: 499, status: 'paid', description: 'Growth Plan - December 2024', paidDate: 'Dec 1, 2024' },
    { id: 'INV-2024-011', date: 'Nov 1, 2024', amount: 499, status: 'paid', description: 'Growth Plan - November 2024', paidDate: 'Nov 1, 2024' },
    { id: 'INV-2024-010', date: 'Oct 1, 2024', amount: 499, status: 'paid', description: 'Growth Plan - October 2024', paidDate: 'Oct 1, 2024' },
    { id: 'INV-2024-009', date: 'Sep 1, 2024', amount: 499, status: 'paid', description: 'Growth Plan - September 2024', paidDate: 'Sep 1, 2024' },
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'card', brand: 'Mastercard', last4: '8888', expiry: '03/25', isDefault: false },
  ]);

  // Event revenue (for paid events)
  const [eventRevenue, setEventRevenue] = useState([
    { id: 1, eventName: 'AI/ML Career Fair', ticketsSold: 180, ticketPrice: 25, totalRevenue: 4500, date: 'Jan 15, 2025', status: 'upcoming' },
    { id: 2, eventName: 'Fall Career Fair 2024', ticketsSold: 320, ticketPrice: 20, totalRevenue: 6400, date: 'Nov 15, 2024', status: 'completed', paidOut: true },
    { id: 3, eventName: 'Data Science Bootcamp Demo Day', ticketsSold: 85, ticketPrice: 15, totalRevenue: 1275, date: 'Oct 30, 2024', status: 'completed', paidOut: true },
  ]);

  // New payment method form
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    billingAddress: '',
    city: '',
    state: '',
    zip: '',
  });

  // Handle plan upgrade/downgrade
  const handleChangePlan = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      setCurrentSubscription({
        ...currentSubscription,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
      });
      setShowUpgradePlanModal(false);
      alert(`Successfully switched to ${plan.name} plan!`);
    }
  };

  // Handle add payment method
  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiry || !newPaymentMethod.cvc) {
      alert('Please fill in all required fields');
      return;
    }
    const newMethod = {
      id: Date.now(),
      type: 'card',
      brand: newPaymentMethod.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: newPaymentMethod.cardNumber.slice(-4),
      expiry: newPaymentMethod.expiry,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod({ cardNumber: '', expiry: '', cvc: '', name: '', billingAddress: '', city: '', state: '', zip: '' });
    setShowAddPaymentMethodModal(false);
    alert('Payment method added successfully!');
  };

  // Handle set default payment method
  const handleSetDefaultPayment = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id })));
  };

  // Handle remove payment method
  const handleRemovePaymentMethod = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoice: any) => {
    const invoiceText = `
INVOICE
===============================
Invoice #: ${invoice.id}
Date: ${invoice.date}
Status: ${invoice.status.toUpperCase()}

Description: ${invoice.description}
Amount: $${invoice.amount}.00

Payment Status: ${invoice.status === 'paid' ? `Paid on ${invoice.paidDate}` : 'Pending'}
===============================
Thank you for your business!
    `;
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle request payout for event revenue
  const handleRequestPayout = (eventId: number) => {
    setEventRevenue(eventRevenue.map(e =>
      e.id === eventId ? { ...e, paidOut: true, payoutRequested: true } : e
    ));
    alert('Payout requested! Funds will be transferred within 3-5 business days.');
  };

  // Handle program submission from modal
  const handleProgramSubmit = (data: ProgramFormData) => {
if (import.meta.env.DEV) console.log('Program submitted:', data);
    // TODO: Save to database via Supabase
    setShowAddProgramModal(false);
    alert('Program submitted successfully! It will be reviewed within 2-3 business days.');
  };

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'programs', icon: '📚', label: 'Programs', badge: 12 },
    { id: 'opportunities', icon: '💼', label: 'Jobs & Internships' },
    { id: 'challenges', icon: '🏆', label: 'Research Challenges' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'outcomes', icon: '📈', label: 'Outcomes' },
    { id: 'employers', icon: '🏢', label: 'Employer Partners' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'billing', icon: '💳', label: 'Billing' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="p-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🎓</div>
            <div>
              <div className="font-semibold text-white text-sm">{user.organization_name || 'Institution'}</div>
              <div className="text-xs text-gray-400">Education Provider</div>
            </div>
          </div>
        </div>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button onClick={onSignOut} className="flex items-center gap-2 p-3 text-gray-400 hover:text-white text-sm">
          ← Sign Out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Education Provider Portal</h1>
                <p className="text-gray-400">Manage programs, track outcomes, and connect with employers</p>
              </div>
              <button
                onClick={() => setShowAddProgramModal(true)}
                className="px-5 py-2.5 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                + Add Program
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Programs', value: 12, color: '#F5C518' },
                { label: 'Enrolled Students', value: 2847, color: '#10b981' },
                { label: 'Placement Rate', value: '89%', color: '#8b5cf6' },
                { label: 'Employer Partners', value: 45, color: '#06b6d4' }
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">📚 Recent Programs</h2>
                <div className="space-y-3">
                  {[
                    { name: 'AI/ML Certificate Program', status: 'Active', enrolled: 156 },
                    { name: 'Cybersecurity Bootcamp', status: 'Active', enrolled: 89 },
                    { name: 'Quantum Technologies Fundamentals', status: 'Pending', enrolled: 45 }
                  ].map((program, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{program.name}</div>
                        <div className="text-sm text-gray-400">{program.enrolled} enrolled</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${
                        program.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">🏢 Top Hiring Partners</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Intel', hires: 23, industry: 'Semiconductor' },
                    { name: 'Google', hires: 18, industry: 'AI/ML' },
                    { name: 'Lockheed Martin', hires: 15, industry: 'Aerospace' }
                  ].map((partner, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{partner.name}</div>
                        <div className="text-sm text-gray-400">{partner.industry}</div>
                      </div>
                      <div className="text-green-400 font-semibold">{partner.hires} hires</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Programs</h1>
              <button
                onClick={() => setShowAddProgramModal(true)}
                className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors"
              >
                + Add Program
              </button>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { id: 1, name: 'AI/ML Certificate Program', duration: '6 months', enrolled: 156, completed: 89, placement: 94, status: 'Active' },
                { id: 2, name: 'Cybersecurity Bootcamp', duration: '12 weeks', enrolled: 89, completed: 67, placement: 91, status: 'Active' },
                { id: 3, name: 'Quantum Technologies Fundamentals', duration: '8 weeks', enrolled: 45, completed: 0, placement: 0, status: 'Enrollment' },
                { id: 4, name: 'Data Engineering Track', duration: '4 months', enrolled: 124, completed: 98, placement: 87, status: 'Active' },
                { id: 5, name: 'Cloud Architecture Program', duration: '3 months', enrolled: 78, completed: 45, placement: 89, status: 'Active' },
              ].map(program => (
                <div key={program.id} className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg mb-1">{program.name}</div>
                      <div className="text-gray-400 text-sm mb-2">Duration: {program.duration}</div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">Enrolled: <span className="text-white">{program.enrolled}</span></span>
                        <span className="text-gray-400">Completed: <span className="text-green-400">{program.completed}</span></span>
                        {program.placement > 0 && (
                          <span className="text-gray-400">Placement: <span className="text-cyan-400">{program.placement}%</span></span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-lg text-sm ${
                        program.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {program.status}
                      </span>
                      <button
                        onClick={() => alert(`Manage program: ${program.name}`)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Students</h1>
              <div className="flex gap-3">
                <input type="search" placeholder="Search students..." className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm w-64" />
                <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                  <option>All Programs</option>
                  <option>AI/ML Certificate</option>
                  <option>Cybersecurity Bootcamp</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Students', value: 2847, color: '#F5C518' },
                { label: 'Active', value: 1256, color: '#10b981' },
                { label: 'Graduated', value: 1402, color: '#8b5cf6' },
                { label: 'Job Placed', value: 1189, color: '#06b6d4' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Student</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Program</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Progress</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Status</th>
                    <th className="p-4 text-right text-sm text-gray-400 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sarah Chen', email: 'sarah.c@email.com', program: 'AI/ML Certificate', progress: 85, status: 'Active' },
                    { name: 'James Wilson', email: 'james.w@email.com', program: 'Cybersecurity Bootcamp', progress: 100, status: 'Graduated' },
                    { name: 'Maria Garcia', email: 'maria.g@email.com', program: 'Data Engineering', progress: 62, status: 'Active' },
                    { name: 'Alex Kim', email: 'alex.k@email.com', program: 'AI/ML Certificate', progress: 100, status: 'Placed' },
                    { name: 'Emily Brown', email: 'emily.b@email.com', program: 'Cloud Architecture', progress: 45, status: 'Active' },
                  ].map((student, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-white">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{student.program}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-800 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-sm text-gray-400">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs ${
                          student.status === 'Placed' ? 'bg-cyan-500/10 text-cyan-400' :
                          student.status === 'Graduated' ? 'bg-green-500/10 text-green-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Outcomes Tab */}
        {activeTab === 'outcomes' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Outcomes & Analytics</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Overall Placement Rate', value: '89%', color: '#10b981', trend: '+3%' },
                { label: 'Avg Time to Employment', value: '45 days', color: '#F5C518', trend: '-12 days' },
                { label: 'Avg Starting Salary', value: '$95K', color: '#8b5cf6', trend: '+8%' },
                { label: 'Employer Satisfaction', value: '4.8/5', color: '#06b6d4', trend: '+0.2' },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-xs text-green-400">{stat.trend} vs last year</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Placement by Program</h2>
                <div className="space-y-4">
                  {[
                    { program: 'AI/ML Certificate', rate: 94 },
                    { program: 'Cybersecurity Bootcamp', rate: 91 },
                    { program: 'Data Engineering', rate: 87 },
                    { program: 'Cloud Architecture', rate: 89 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.program}</span>
                        <span className="text-white font-medium">{item.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.rate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Top Hiring Industries</h2>
                <div className="space-y-3">
                  {[
                    { industry: 'Technology', hires: 456, percent: 38 },
                    { industry: 'Government/Defense', hires: 234, percent: 19 },
                    { industry: 'Finance', hires: 189, percent: 16 },
                    { industry: 'Healthcare', hires: 156, percent: 13 },
                    { industry: 'Energy', hires: 167, percent: 14 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">{item.industry}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">{item.hires} hires</span>
                        <span className="text-orange-400 font-medium">{item.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employer Partners Tab */}
        {activeTab === 'employers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Employer Partners</h1>
              <button
                onClick={() => alert('Invite Partner feature coming soon!')}
                className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors"
              >
                + Invite Partner
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Partners', value: 45, color: '#F5C518' },
                { label: 'Active Partnerships', value: 38, color: '#10b981' },
                { label: 'Total Hires', value: 1189, color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { name: 'Intel', industry: 'Semiconductor', hires: 23, openRoles: 5, status: 'Active' },
                { name: 'Google', industry: 'Technology', hires: 18, openRoles: 8, status: 'Active' },
                { name: 'Lockheed Martin', industry: 'Aerospace', hires: 15, openRoles: 3, status: 'Active' },
                { name: 'Oak Ridge National Lab', industry: 'Research', hires: 12, openRoles: 6, status: 'Active' },
                { name: 'JPMorgan Chase', industry: 'Finance', hires: 9, openRoles: 4, status: 'Pending' },
              ].map((partner, i) => (
                <div key={i} className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-lg">
                        🏢
                      </div>
                      <div>
                        <div className="font-semibold text-white">{partner.name}</div>
                        <div className="text-sm text-gray-400">{partner.industry}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">{partner.hires}</div>
                        <div className="text-xs text-gray-500">Total Hires</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-cyan-400">{partner.openRoles}</div>
                        <div className="text-xs text-gray-500">Open Roles</div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        partner.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {partner.status}
                      </span>
                      <button
                        onClick={() => alert(`View details for ${partner.name}`)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Events</h1>
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors"
              >
                + Create Event
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white">{event.name}</div>
                          <div className="text-sm text-gray-400">{event.date}</div>
                        </div>
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">{event.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>👥 {event.attendees} attendees</span>
                        <span>🏢 {event.employers} employers</span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleManageEvent(event)}
                          className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-orange-400 transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleViewEventDetails(event)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Past Events</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Fall Career Fair 2024', date: 'Nov 15, 2024', attendees: 320, hires: 28, type: 'Career Fair' },
                    { name: 'Data Science Bootcamp Demo Day', date: 'Oct 30, 2024', attendees: 85, hires: 12, type: 'Demo Day' },
                    { name: 'Summer Networking Mixer', date: 'Aug 20, 2024', attendees: 180, hires: 15, type: 'Networking' },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-700 transition-colors"
                      onClick={() => handleViewEventDetails({ ...event, employers: 0 })}
                    >
                      <div>
                        <div className="font-medium text-white">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.date}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">{event.attendees} attended</span>
                        <span className="text-green-400">{event.hires} hires</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opportunities Tab (Jobs & Internships) */}
        {activeTab === 'opportunities' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Jobs & Internships</h1>
                <p className="text-gray-400 text-sm mt-1">Post and manage opportunities for students and graduates</p>
              </div>
              <button
                onClick={() => setShowPostOpportunityModal(true)}
                className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors flex items-center gap-2"
              >
                <span>+</span> Post Opportunity
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Listings', value: eduOpportunities.filter(o => o.status === 'active').length, color: 'text-green-400' },
                { label: 'Total Applications', value: eduOpportunities.reduce((sum, o) => sum + o.applications, 0), color: 'text-blue-400' },
                { label: 'Internships', value: eduOpportunities.filter(o => o.type === 'internship').length, color: 'text-cyan-400' },
                { label: 'Jobs', value: eduOpportunities.filter(o => o.type === 'job').length, color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Listings */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="font-semibold text-white">Your Listings</h2>
                <div className="flex gap-2">
                  <select className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                    <option>All Types</option>
                    <option>Jobs</option>
                    <option>Internships</option>
                  </select>
                  <select className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3 font-medium">Position</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Compensation</th>
                    <th className="px-4 py-3 font-medium">Posted</th>
                    <th className="px-4 py-3 font-medium">Applications</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {eduOpportunities.map((opp) => (
                    <tr key={opp.id} className="text-sm hover:bg-gray-800/30">
                      <td className="px-4 py-4 text-white font-medium">{opp.title}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          opp.type === 'internship' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {opp.type === 'internship' ? 'Internship' : 'Job'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-300">{opp.location}</td>
                      <td className="px-4 py-4 text-green-400">{opp.salary}</td>
                      <td className="px-4 py-4 text-gray-400">{opp.posted}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                          {opp.applications} applicants
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          opp.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {opp.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View applications for: ${opp.title}`)}
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20"
                          >
                            View Apps
                          </button>
                          <button
                            onClick={() => alert(`Edit listing: ${opp.title}`)}
                            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-xs hover:bg-gray-600"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Billing & Payments</h1>
              <button
                onClick={() => setShowUpgradePlanModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 rounded-lg font-medium text-sm hover:from-orange-400 hover:to-yellow-400 transition-all"
              >
                Upgrade Plan
              </button>
            </div>

            {/* Current Subscription */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Current Subscription</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentSubscription.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {currentSubscription.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Plan</div>
                  <div className="text-xl font-bold text-white">{currentSubscription.planName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Monthly Cost</div>
                  <div className="text-xl font-bold text-orange-400">${currentSubscription.amount}/mo</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Next Billing Date</div>
                  <div className="text-xl font-bold text-white">{currentSubscription.nextBillingDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Billing Period</div>
                  <div className="text-lg font-medium text-gray-300">{currentSubscription.currentPeriodStart} - {currentSubscription.currentPeriodEnd}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 flex gap-3">
                <button
                  onClick={() => setShowUpgradePlanModal(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  Change Plan
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
                      setCurrentSubscription({ ...currentSubscription, status: 'cancelled' });
                      alert('Subscription cancelled. You will have access until the end of your current billing period.');
                    }
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Payment Methods</h2>
                <button
                  onClick={() => setShowAddPaymentMethodModal(true)}
                  className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors"
                >
                  + Add Payment Method
                </button>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-sm font-bold">
                        {method.brand === 'Visa' ? '💳' : '💳'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{method.brand} •••• {method.last4}</div>
                        <div className="text-sm text-gray-400">Expires {method.expiry}</div>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs font-medium">Default</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(method.id)}
                          className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Revenue */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Event Revenue</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${eventRevenue.reduce((sum, e) => sum + e.totalRevenue, 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="pb-3 font-medium">Event</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Tickets Sold</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Revenue</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {eventRevenue.map((event) => (
                      <tr key={event.id} className="text-sm">
                        <td className="py-4 text-white font-medium">{event.eventName}</td>
                        <td className="py-4 text-gray-400">{event.date}</td>
                        <td className="py-4 text-gray-300">{event.ticketsSold}</td>
                        <td className="py-4 text-gray-300">${event.ticketPrice}</td>
                        <td className="py-4 text-green-400 font-semibold">${event.totalRevenue.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.status === 'completed'
                              ? event.paidOut ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {event.status === 'completed' ? (event.paidOut ? 'Paid Out' : 'Pending Payout') : 'Upcoming'}
                          </span>
                        </td>
                        <td className="py-4">
                          {event.status === 'completed' && !event.paidOut && (
                            <button
                              onClick={() => handleRequestPayout(event.id)}
                              className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                            >
                              Request Payout
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Billing History</h2>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <div className="text-white font-medium">{invoice.description}</div>
                        <div className="text-sm text-gray-400">{invoice.id} • {invoice.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-semibold">${invoice.amount}.00</div>
                        <span className={`text-xs ${invoice.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h1>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Graduates', value: '1,402', color: '#10b981' },
                { label: 'Placed', value: '1,189', color: '#8b5cf6' },
                { label: 'Avg Salary', value: '$95K', color: '#F5C518' },
                { label: 'Retention Rate', value: '92%', color: '#06b6d4' },
                { label: 'NPS Score', value: '78', color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Enrollment Trends</h2>
                <div className="space-y-3">
                  {[
                    { month: 'September', enrolled: 234 },
                    { month: 'October', enrolled: 189 },
                    { month: 'November', enrolled: 256 },
                    { month: 'December', enrolled: 145 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-400">{item.month}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-4">
                        <div className="bg-orange-500 h-4 rounded-full" style={{ width: `${(item.enrolled / 256) * 100}%` }} />
                      </div>
                      <span className="text-white font-medium w-12">{item.enrolled}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Clearance Pipeline</h2>
                <div className="space-y-3">
                  {[
                    { level: 'Public Trust Eligible', count: 892, percent: 63 },
                    { level: 'Secret Eligible', count: 567, percent: 40 },
                    { level: 'TS/SCI Eligible', count: 234, percent: 17 },
                    { level: 'Active Clearance', count: 189, percent: 13 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">{item.level}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">{item.count}</span>
                        <span className="text-orange-400 font-medium">{item.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Institution Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Institution Name</label>
                    <input type="text" defaultValue={user.organization_name || 'Institution'} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Website</label>
                    <input type="url" placeholder="https://www.example.edu" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-24 resize-none" placeholder="Describe your institution..." />
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-orange-500 text-gray-900 rounded-lg text-sm font-medium">Save Changes</button>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: 'New employer partner requests', checked: true },
                    { label: 'Student placement updates', checked: true },
                    { label: 'Program milestone notifications', checked: true },
                    { label: 'Weekly analytics report', checked: false },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${setting.checked ? 'bg-orange-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Team Members</h2>
                <div className="space-y-3">
                  {[
                    { name: user.first_name + ' ' + user.last_name, role: 'Admin', email: user.email },
                    { name: 'Program Coordinator', role: 'Editor', email: 'coordinator@example.edu' },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-xs">{member.role}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => alert('Invite Team Member feature coming soon!')}
                  className="mt-4 text-orange-400 text-sm font-medium hover:text-orange-300"
                >
                  + Invite Team Member
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Program Modal */}
      <AddProgramModal
        isOpen={showAddProgramModal}
        onClose={() => setShowAddProgramModal(false)}
        onSubmit={handleProgramSubmit}
      />

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create New Event</h2>
                <button
                  onClick={() => setShowCreateEventModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  value={eventFormData.name}
                  onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Spring Career Fair 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Date *</label>
                <input
                  type="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                <select
                  value={eventFormData.type}
                  onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Career Fair">Career Fair</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Panel">Panel Discussion</option>
                  <option value="Networking">Networking Event</option>
                  <option value="Info Session">Info Session</option>
                  <option value="Demo Day">Demo Day</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Main Campus Auditorium or Virtual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Describe your event..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Attendees</label>
                <input
                  type="number"
                  value={eventFormData.maxAttendees}
                  onChange={(e) => setEventFormData({ ...eventFormData, maxAttendees: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 200"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-5 py-2.5 bg-orange-500 text-gray-900 font-semibold rounded-lg hover:bg-orange-400 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEvent.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedEvent.date}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEventDetailsModal(false);
                    setSelectedEvent(null);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-400">{selectedEvent.attendees}</div>
                  <div className="text-sm text-gray-400">Attendees</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-400">{selectedEvent.employers || 0}</div>
                  <div className="text-sm text-gray-400">Employers</div>
                </div>
                {selectedEvent.hires && (
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">{selectedEvent.hires}</div>
                    <div className="text-sm text-gray-400">Hires Made</div>
                  </div>
                )}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-lg font-semibold text-purple-400">{selectedEvent.type}</div>
                  <div className="text-sm text-gray-400">Event Type</div>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Location</h3>
                  <p className="text-white">{selectedEvent.location}</p>
                </div>
              )}

              {selectedEvent.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                  <p className="text-gray-300">{selectedEvent.description}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`You're Invited: ${selectedEvent.name}`);
                      const body = encodeURIComponent(
                        `You're invited to ${selectedEvent.name}!\n\n` +
                        `Date: ${selectedEvent.date}\n` +
                        `Location: ${selectedEvent.location || 'TBA'}\n` +
                        `Type: ${selectedEvent.type}\n\n` +
                        `${selectedEvent.description || ''}\n\n` +
                        `We hope to see you there!\n\n` +
                        `Best regards,\nThe Events Team`
                      );
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                    }}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-colors"
                  >
                    Bulk Email Invite
                  </button>
                  <button
                    onClick={() => {
                      setShowEventDetailsModal(false);
                      setEventFormData({
                        name: selectedEvent.name,
                        date: '',
                        type: selectedEvent.type,
                        description: selectedEvent.description || '',
                        location: selectedEvent.location || '',
                        maxAttendees: '',
                      });
                      setShowCreateEventModal(true);
                    }}
                    className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors"
                  >
                    Edit Event
                  </button>
                  <button
                    onClick={() => {
                      const csvContent = `Event: ${selectedEvent.name}\nDate: ${selectedEvent.date}\nAttendees: ${selectedEvent.attendees}\nEmployers: ${selectedEvent.employers || 0}\n\nNote: Full attendee list export would be available in the production version.`;
                      alert(`Export Preview:\n\n${csvContent}`);
                    }}
                    className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-colors"
                  >
                    Export Attendees
                  </button>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <h3 className="text-sm font-medium text-white mb-3">Share on Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Join us for ${selectedEvent.name} on ${selectedEvent.date}! ${selectedEvent.description || ''}`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'width=600,height=400');
                    }}
                    className="px-4 py-2 bg-[#0077B5]/20 text-[#0077B5] rounded-lg text-sm hover:bg-[#0077B5]/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const quote = encodeURIComponent(`Join us for ${selectedEvent.name} on ${selectedEvent.date}!`);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank', 'width=600,height=400');
                    }}
                    className="px-4 py-2 bg-[#1877F2]/20 text-[#1877F2] rounded-lg text-sm hover:bg-[#1877F2]/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                  {/* Twitter/X */}
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Join us for ${selectedEvent.name} on ${selectedEvent.date}! ${selectedEvent.description || ''}`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
                    }}
                    className="px-4 py-2 bg-black/40 text-white rounded-lg text-sm hover:bg-black/60 transition-colors flex items-center gap-2 border border-gray-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (Twitter)
                  </button>
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `*${selectedEvent.name}*\n\n` +
                        `📅 Date: ${selectedEvent.date}\n` +
                        `📍 Location: ${selectedEvent.location || 'TBA'}\n` +
                        `🎯 Type: ${selectedEvent.type}\n\n` +
                        `${selectedEvent.description || ''}\n\n` +
                        `Join us! 🎉`
                      );
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="px-4 py-2 bg-[#25D366]/20 text-[#25D366] rounded-lg text-sm hover:bg-[#25D366]/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </button>
                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      const shareText = `${selectedEvent.name} - ${selectedEvent.date}\n${selectedEvent.location || ''}\n${selectedEvent.description || ''}`;
                      navigator.clipboard.writeText(shareText);
                      alert('Event details copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-600/20 text-gray-300 rounded-lg text-sm hover:bg-gray-600/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-between">
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${selectedEvent.name}"?`)) {
                    setEvents(events.filter(e => e.name !== selectedEvent.name));
                    setShowEventDetailsModal(false);
                    setSelectedEvent(null);
                    alert('Event deleted successfully!');
                  }
                }}
                className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Delete Event
              </button>
              <button
                onClick={() => {
                  setShowEventDetailsModal(false);
                  setSelectedEvent(null);
                }}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradePlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
                  <p className="text-gray-400 text-sm mt-1">Select the plan that best fits your needs</p>
                </div>
                <button
                  onClick={() => setShowUpgradePlanModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      currentSubscription.planId === plan.id
                        ? 'border-orange-500 bg-orange-500/5'
                        : plan.recommended
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    {plan.recommended && currentSubscription.planId !== plan.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        Recommended
                      </div>
                    )}
                    {currentSubscription.planId === plan.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-gray-900 text-xs font-semibold rounded-full">
                        Current Plan
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleChangePlan(plan.id)}
                      disabled={currentSubscription.planId === plan.id}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        currentSubscription.planId === plan.id
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {currentSubscription.planId === plan.id
                        ? 'Current Plan'
                        : plan.price > currentSubscription.amount
                        ? 'Upgrade'
                        : 'Downgrade'}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                All plans include a 14-day free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentMethodModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPaymentMethodModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number *</label>
                <input
                  type="text"
                  value={newPaymentMethod.cardNumber}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    value={newPaymentMethod.expiry}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CVC *</label>
                  <input
                    type="text"
                    value={newPaymentMethod.cvc}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Billing Address</label>
                <input
                  type="text"
                  value={newPaymentMethod.billingAddress}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, billingAddress: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={newPaymentMethod.city}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, city: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  <input
                    type="text"
                    value={newPaymentMethod.state}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, state: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ZIP</label>
                  <input
                    type="text"
                    value={newPaymentMethod.zip}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, zip: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-gray-400">Your payment information is encrypted and secure</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowAddPaymentMethodModal(false)}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="px-5 py-2.5 bg-orange-500 text-gray-900 font-semibold rounded-lg hover:bg-orange-400 transition-colors"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Opportunity Modal for Education Providers */}
      {showPostOpportunityModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Post Job or Internship</h2>
                <p className="text-sm text-gray-400 mt-1">Create opportunities for your students and community</p>
              </div>
              <button onClick={() => setShowPostOpportunityModal(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-800 rounded-xl mb-6 w-fit">
                <button
                  onClick={() => setEduPostingForm({ ...eduPostingForm, postingType: 'internship' })}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    eduPostingForm.postingType === 'internship' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Internship
                </button>
                <button
                  onClick={() => setEduPostingForm({ ...eduPostingForm, postingType: 'job' })}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    eduPostingForm.postingType === 'job' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Job
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position Title *</label>
                  <input
                    type="text"
                    value={eduPostingForm.title}
                    onChange={(e) => setEduPostingForm({ ...eduPostingForm, title: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    placeholder="e.g., Research Assistant, Lab Technician"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      value={eduPostingForm.department}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, department: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="e.g., Computer Science, Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Work Location</label>
                    <div className="flex gap-2">
                      {['onsite', 'remote', 'hybrid'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setEduPostingForm({ ...eduPostingForm, workLocationType: loc as any })}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            eduPostingForm.workLocationType === loc
                              ? 'bg-orange-500 text-gray-900'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {loc === 'onsite' ? 'On-campus' : loc.charAt(0).toUpperCase() + loc.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Compensation *</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <select
                      value={eduPostingForm.salaryType}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, salaryType: e.target.value as any })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    >
                      <option value="hourly">Hourly Rate</option>
                      <option value="annual">Annual Salary</option>
                    </select>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={eduPostingForm.salaryMin}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, salaryMin: e.target.value })}
                      className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="Min"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={eduPostingForm.salaryMax}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, salaryMax: e.target.value })}
                      className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Internship Details */}
              {eduPostingForm.postingType === 'internship' && (
                <div className="mb-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <h3 className="text-sm font-medium text-cyan-400 mb-3">Internship Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration</label>
                      <select
                        value={eduPostingForm.internshipDuration}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, internshipDuration: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      >
                        <option value="">Select...</option>
                        <option value="1-month">1 month</option>
                        <option value="3-months">3 months (Summer)</option>
                        <option value="4-months">4 months (Semester)</option>
                        <option value="6-months">6 months</option>
                        <option value="12-months">12 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Hours/Week</label>
                      <select
                        value={eduPostingForm.internshipHoursPerWeek}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, internshipHoursPerWeek: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      >
                        <option value="">Select...</option>
                        <option value="10-15">10-15 hours</option>
                        <option value="15-20">15-20 hours</option>
                        <option value="20-30">20-30 hours</option>
                        <option value="40">40 hours (Full-time)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eduPostingForm.internshipPaid}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, internshipPaid: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Paid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eduPostingForm.academicCreditAvailable}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, academicCreditAvailable: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Academic Credit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eduPostingForm.mentorshipProvided}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, mentorshipProvided: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Mentorship</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eduPostingForm.conversionPossible}
                        onChange={(e) => setEduPostingForm({ ...eduPostingForm, conversionPossible: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Full-time Conversion</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Requirements</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Education</label>
                    <select
                      value={eduPostingForm.educationLevel}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, educationLevel: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    >
                      <option value="none">No requirement</option>
                      <option value="enrolled">Currently Enrolled</option>
                      <option value="associate">Associate's</option>
                      <option value="bachelors">Bachelor's</option>
                      <option value="masters">Master's</option>
                      <option value="doctorate">Doctorate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Experience</label>
                    <select
                      value={eduPostingForm.yearsExperience}
                      onChange={(e) => setEduPostingForm({ ...eduPostingForm, yearsExperience: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    >
                      <option value="">Select...</option>
                      <option value="0">No experience required</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Required Skills</label>
                  <input
                    type="text"
                    value={eduPostingForm.requiredSkills}
                    onChange={(e) => setEduPostingForm({ ...eduPostingForm, requiredSkills: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    placeholder="e.g., Python, Data Analysis, Lab Techniques (comma-separated)"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Description *</h3>
                <textarea
                  value={eduPostingForm.description}
                  onChange={(e) => setEduPostingForm({ ...eduPostingForm, description: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white h-32 resize-none"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                />
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={eduPostingForm.applicationDeadline}
                    onChange={(e) => setEduPostingForm({ ...eduPostingForm, applicationDeadline: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={eduPostingForm.startDate}
                    onChange={(e) => setEduPostingForm({ ...eduPostingForm, startDate: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowPostOpportunityModal(false)}
                className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEduPosting}
                className="px-6 py-2.5 bg-orange-500 text-gray-900 font-semibold rounded-xl hover:bg-orange-400"
              >
                Publish {eduPostingForm.postingType === 'internship' ? 'Internship' : 'Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// PARTNER/EMPLOYER DASHBOARD
// ============================================
const PartnerDashboard: React.FC<{ user: UserProfile; onSignOut: () => void }> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ==========================================
  // BULK UPLOAD/DOWNLOAD & AI FEATURES STATE
  // ==========================================
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showBulkDownloadModal, setShowBulkDownloadModal] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [bulkUploadPreview, setBulkUploadPreview] = useState<any[]>([]);
  const [bulkUploadStep, setBulkUploadStep] = useState<'upload' | 'preview' | 'confirm' | 'complete'>('upload');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Job postings state - will be populated from database
  const [jobPostings, setJobPostings] = useState<unknown[]>([]);
  const [, setLoadingJobs] = useState(true);

  // Fetch jobs from database on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get user's organization ID (use limit(1) to handle potential duplicates)
        const { data: userDataArray, error: userError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', session.user.id)
          .limit(1);

        const userData = userDataArray?.[0];

        if (userError) {
          console.error('Error fetching user for jobs:', userError);
          setLoadingJobs(false);
          return;
        }

        if (!userData?.organization_id) {
if (import.meta.env.DEV) console.log('No organization found for user, user data:', userData);
          setLoadingJobs(false);
          return;
        }

        // Fetch jobs for this organization
if (import.meta.env.DEV) console.log('Fetching jobs for organization:', userData.organization_id);
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('organization_id', userData.organization_id)
          .order('created_at', { ascending: false });

if (import.meta.env.DEV) console.log('Jobs query result:', { jobs, error, count: jobs?.length });

        if (error) {
          console.error('Error fetching jobs:', error);
          setLoadingJobs(false);
          return;
        }

        // Transform jobs to display format
        const formattedJobs = (jobs || []).map(job => ({
          id: job.id,
          title: job.title,
          type: job.type === 'internship' ? 'internship' : 'job',
          location: job.location || 'Not specified',
          salary: job.salary_period === 'hourly'
            ? `$${job.salary_min}/hr - $${job.salary_max}/hr`
            : `$${job.salary_min?.toLocaleString() || 0} - $${job.salary_max?.toLocaleString() || 0}`,
          posted: new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          applications: job.view_count || 0, // Using view_count since applications_count may not exist
          status: job.status || 'active',
          aiScore: Math.floor(Math.random() * 15) + 85, // Placeholder until AI scoring is implemented
          clearance: job.clearance || 'None',
        }));

        setJobPostings(formattedJobs);
if (import.meta.env.DEV) console.log('Fetched jobs:', formattedJobs);
      } catch (error) {
        console.error('Error in fetchJobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Sample applications for demo
  const [applications, _setApplications] = useState([
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@email.com', position: 'Senior AI Engineer', applied: 'Dec 22, 2024', status: 'new', aiScore: 94, aiMatch: 'Excellent', skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'] },
    { id: 2, name: 'Michael Johnson', email: 'mjohnson@email.com', position: 'Senior AI Engineer', applied: 'Dec 21, 2024', status: 'reviewed', aiScore: 87, aiMatch: 'Strong', skills: ['Python', 'Keras', 'AWS', 'Docker'] },
    { id: 3, name: 'Emily Rodriguez', email: 'erodriguez@email.com', position: 'Data Scientist', applied: 'Dec 20, 2024', status: 'new', aiScore: 91, aiMatch: 'Excellent', skills: ['R', 'Python', 'SQL', 'Tableau'] },
    { id: 4, name: 'David Kim', email: 'dkim@email.com', position: 'ML Research Intern', applied: 'Dec 19, 2024', status: 'shortlisted', aiScore: 89, aiMatch: 'Strong', skills: ['Python', 'PyTorch', 'Research'] },
    { id: 5, name: 'Lisa Wang', email: 'lwang@email.com', position: 'Cybersecurity Analyst', applied: 'Dec 18, 2024', status: 'new', aiScore: 78, aiMatch: 'Good', skills: ['Network Security', 'SIEM', 'Penetration Testing'] },
  ]);

  // Handle bulk file upload
  const handleBulkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBulkUploadFile(file);
      // Simulate parsing CSV/Excel
      setBulkUploadPreview([
        { title: 'Software Engineer', type: 'job', location: 'Remote', salaryMin: '100000', salaryMax: '140000', department: 'Engineering' },
        { title: 'Product Manager', type: 'job', location: 'New York, NY', salaryMin: '120000', salaryMax: '160000', department: 'Product' },
        { title: 'UX Design Intern', type: 'internship', location: 'San Francisco, CA', salaryMin: '35', salaryMax: '45', department: 'Design' },
        { title: 'DevOps Engineer', type: 'job', location: 'Hybrid - Austin', salaryMin: '110000', salaryMax: '150000', department: 'Infrastructure' },
        { title: 'Data Engineering Intern', type: 'internship', location: 'Remote', salaryMin: '40', salaryMax: '50', department: 'Data' },
      ]);
      setBulkUploadStep('preview');
    }
  };

  // Handle bulk upload confirmation
  const handleBulkUploadConfirm = () => {
    setBulkUploadStep('confirm');
    // Simulate processing
    setTimeout(() => {
      const newPostings = bulkUploadPreview.map((item, index) => ({
        id: Date.now() + index,
        title: item.title,
        type: item.type,
        location: item.location,
        salary: item.type === 'internship' ? `$${item.salaryMin}/hr - $${item.salaryMax}/hr` : `$${parseInt(item.salaryMin).toLocaleString()} - $${parseInt(item.salaryMax).toLocaleString()}`,
        posted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        applications: 0,
        status: 'active',
        aiScore: Math.floor(Math.random() * 15) + 85,
      }));
      setJobPostings([...newPostings, ...jobPostings]);
      setBulkUploadStep('complete');
    }, 2000);
  };

  // Handle bulk download of applications
  const handleBulkDownload = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Name', 'Email', 'Position', 'Applied Date', 'Status', 'AI Score', 'AI Match', 'Skills'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app =>
        [app.name, app.email, app.position, app.applied, app.status, app.aiScore, app.aiMatch, app.skills.join('; ')].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowBulkDownloadModal(false);
    alert(`Applications exported as ${format.toUpperCase()}!`);
  };

  // AI Job Description Generator
  const handleAIGenerateDescription = (jobTitle: string) => {
    setAiGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setAiSuggestion(`We are seeking a talented ${jobTitle} to join our innovative team. In this role, you will work on cutting-edge projects that push the boundaries of technology.

Key Responsibilities:
• Lead the design and implementation of scalable solutions
• Collaborate with cross-functional teams to deliver high-quality products
• Mentor junior team members and contribute to technical strategy
• Stay current with industry trends and emerging technologies

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision coverage
• Flexible work arrangements and unlimited PTO
• Professional development budget and learning opportunities
• Inclusive, diverse, and supportive work environment`);
      setAiGenerating(false);
    }, 1500);
  };

  // AI Application Screening
  const handleAIScreenApplications = () => {
    alert('AI Screening Complete!\n\n✓ 127 applications analyzed\n✓ 23 candidates marked as "Excellent Match"\n✓ 45 candidates marked as "Strong Match"\n✓ 12 candidates flagged for review\n\nTop recommendation: Sarah Chen (94% match)');
  };

  // Enhanced Job/Internship Posting Form State
  const [postingForm, setPostingForm] = useState({
    // Basic Information
    title: '',
    postingType: 'job' as 'job' | 'internship',
    employmentType: 'full-time', // full-time, part-time, contract, temporary, fellowship

    // Work Location
    workLocationType: 'onsite' as 'onsite' | 'remote' | 'hybrid',
    workLocationCity: '',
    workLocationState: '',
    workLocationCountry: 'United States',
    remoteRestrictions: '', // e.g., "Must be based in US"
    hybridDaysOnsite: '',

    // Compensation (Pay Transparency Compliance)
    salaryType: 'annual' as 'annual' | 'hourly',
    salaryMin: '',
    salaryMax: '',
    salaryNegotiable: false,
    bonusEligible: false,
    bonusDescription: '',
    commissionEligible: false,
    equityOffered: false,
    equityDescription: '',

    // Benefits
    benefits: [] as string[],
    benefitsDescription: '',

    // Job Details
    department: '',
    reportsTo: '',
    directReports: '',
    travelRequired: 'none' as 'none' | 'occasional' | 'frequent' | 'extensive',
    travelPercentage: '',

    // Requirements
    educationLevel: 'bachelors',
    yearsExperience: '',
    requiredSkills: '',
    preferredSkills: '',
    certifications: '',
    clearanceLevel: 'none',
    clearanceSponsored: false,

    // Description
    description: '',
    responsibilities: '',
    qualifications: '',
    niceToHave: '',

    // Application
    applicationDeadline: '',
    startDate: '',
    applicationInstructions: '',
    applicationUrl: '',
    contactEmail: '',

    // Internship-specific fields
    internshipPaid: true,
    internshipStipend: '',
    internshipDuration: '',
    internshipHoursPerWeek: '',
    academicCreditAvailable: false,
    mentorshipProvided: true,
    conversionPossible: false,
    internshipProgram: '',

    // Posting Settings
    urgentHiring: false,
    featuredListing: false,
    postingExpiration: '30', // days
  });

  // Benefits options
  const benefitOptions = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Life Insurance',
    '401(k) / Retirement Plan', '401(k) Matching', 'Pension',
    'Paid Time Off (PTO)', 'Sick Leave', 'Parental Leave', 'Family Leave',
    'Flexible Hours', 'Remote Work Options', 'Compressed Work Week',
    'Professional Development', 'Tuition Reimbursement', 'Conference Attendance',
    'Gym Membership / Wellness', 'Employee Assistance Program', 'Mental Health Support',
    'Stock Options / RSUs', 'Employee Stock Purchase Plan', 'Profit Sharing',
    'Relocation Assistance', 'Signing Bonus', 'Performance Bonus',
    'Commuter Benefits', 'Parking', 'Company Car / Allowance',
    'Free Meals / Snacks', 'Childcare Assistance', 'Pet Insurance',
  ];

  // Handle benefit toggle
  const toggleBenefit = (benefit: string) => {
    setPostingForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  // State for form submission
  const [, setIsSubmitting] = useState(false);

  // Handle form submission - saves to Supabase
  const handleSubmitPosting = async () => {
    if (!postingForm.title) {
      alert('Please enter a job title');
      return;
    }
    if (!postingForm.description) {
      alert('Please enter a job description');
      return;
    }
    if (!postingForm.salaryMin || !postingForm.salaryMax) {
      alert('Salary range is required for pay transparency compliance');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to post a job');
        setIsSubmitting(false);
        return;
      }

      // Get user's organization ID (use limit(1) instead of single() to handle duplicate records)
      const { data: userDataArray, error: userError } = await supabase
        .from('users')
        .select('id, organization_id')
        .eq('id', session.user.id)
        .limit(1);

      const userData = userDataArray?.[0];

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        console.error('Session user ID:', session.user.id);
        console.error('Session user email:', session.user.email);
        alert(`Could not find your user data. Error: ${userError?.message || 'User record not found'}. Please check the browser console for details.`);
        setIsSubmitting(false);
        return;
      }

      if (!userData.organization_id) {
        console.error('User has no organization_id');
        alert('Your account is not linked to an organization. Please contact support or complete your organization profile.');
        setIsSubmitting(false);
        return;
      }

      // Build location string
      let locationString = '';
      if (postingForm.workLocationType === 'remote') {
        locationString = 'Remote';
        if (postingForm.remoteRestrictions) {
          locationString += ` (${postingForm.remoteRestrictions})`;
        }
      } else if (postingForm.workLocationType === 'hybrid') {
        locationString = `Hybrid - ${postingForm.workLocationCity}, ${postingForm.workLocationState}`;
      } else {
        locationString = `${postingForm.workLocationCity}, ${postingForm.workLocationState}`;
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(postingForm.postingExpiration));

      // Parse skills into arrays
      const requiredSkillsArray = postingForm.requiredSkills
        ? postingForm.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
        : [];
      const preferredSkillsArray = postingForm.preferredSkills
        ? postingForm.preferredSkills.split(',').map(s => s.trim()).filter(s => s)
        : [];
      const certificationsArray = postingForm.certifications
        ? postingForm.certifications.split(',').map(s => s.trim()).filter(s => s)
        : [];

      // Generate a URL-friendly slug from the title
      const generateSlug = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          + '-' + Date.now();
      };

      // Prepare job data matching actual database schema
      const jobData: Record<string, any> = {
        // Required fields
        organization_id: userData.organization_id,
        posted_by_id: session.user.id,
        title: postingForm.title,
        slug: generateSlug(postingForm.title),
        description: postingForm.description,
        location: locationString,
        industry: 'ai', // Valid values: semiconductor, nuclear, ai, quantum, cybersecurity, aerospace, biotech, robotics, clean_energy, manufacturing, healthcare
        type: postingForm.postingType === 'internship' ? 'internship' : 'full_time',
        expires_at: expiresAt.toISOString(),

        // Optional fields
        remote: postingForm.workLocationType === 'remote',
        department: postingForm.department || null,
        responsibilities: postingForm.responsibilities || null,
        qualifications: postingForm.qualifications || null,
        employment_type: postingForm.employmentType,
        work_arrangement: postingForm.workLocationType === 'onsite' ? 'on-site' :
                          postingForm.workLocationType === 'hybrid' ? 'hybrid' : 'remote',
        travel_required: postingForm.travelRequired,

        // Compensation
        salary_min: parseInt(postingForm.salaryMin) || null,
        salary_max: parseInt(postingForm.salaryMax) || null,
        salary_period: postingForm.salaryType === 'hourly' ? 'hourly' : 'yearly',
        show_salary: true,
        bonus_eligible: postingForm.bonusEligible,
        equity_offered: postingForm.equityOffered,

        // Clearance
        clearance_level: postingForm.clearanceLevel,
        visa_sponsorship: postingForm.clearanceSponsored,

        // Education & Skills
        education_required: postingForm.educationLevel,
        required_skills: requiredSkillsArray.length > 0 ? requiredSkillsArray : null,
        preferred_skills: preferredSkillsArray.length > 0 ? preferredSkillsArray : null,
        certifications_required: certificationsArray.length > 0 ? certificationsArray : null,

        // Application settings
        application_deadline: postingForm.applicationDeadline || null,
        start_date: postingForm.startDate || null,
        external_url: postingForm.applicationUrl || null,

        // Posting settings
        featured: postingForm.featuredListing || false,

        // Set status to active so it shows immediately
        status: 'active',
      };

if (import.meta.env.DEV) console.log('Submitting job to database:', jobData);

      // Insert into database
      const { data: newJob, error: insertError } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting job:', insertError);
        alert(`Failed to post job: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

if (import.meta.env.DEV) console.log('Job posted successfully:', newJob);

      // Add to local state for immediate UI update
      const newPosting = {
        id: newJob.id,
        title: newJob.title,
        type: newJob.type === 'internship' ? 'internship' : 'job',
        location: newJob.location,
        salary: newJob.salary_period === 'hourly'
          ? `$${newJob.salary_min}/hr - $${newJob.salary_max}/hr`
          : `$${newJob.salary_min?.toLocaleString() || 0} - $${newJob.salary_max?.toLocaleString() || 0}`,
        posted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        applications: 0,
        status: newJob.status || 'active',
        aiScore: Math.floor(Math.random() * 15) + 85,
        clearance: newJob.clearance || 'None',
      };
if (import.meta.env.DEV) console.log('Adding new posting to list:', newPosting);
      setJobPostings(prev => [newPosting, ...prev]);

      // Reset form
      setPostingForm({
        title: '',
        postingType: 'job',
        employmentType: 'full-time',
        workLocationType: 'onsite',
        workLocationCity: '',
        workLocationState: '',
        workLocationCountry: 'United States',
        remoteRestrictions: '',
        hybridDaysOnsite: '',
        salaryType: 'annual',
        salaryMin: '',
        salaryMax: '',
        salaryNegotiable: false,
        bonusEligible: false,
        bonusDescription: '',
        commissionEligible: false,
        equityOffered: false,
        equityDescription: '',
        benefits: [],
        benefitsDescription: '',
        department: '',
        reportsTo: '',
        directReports: '',
        travelRequired: 'none',
        travelPercentage: '',
        educationLevel: 'bachelors',
        yearsExperience: '',
        requiredSkills: '',
        preferredSkills: '',
        certifications: '',
        clearanceLevel: 'none',
        clearanceSponsored: false,
        description: '',
        responsibilities: '',
        qualifications: '',
        niceToHave: '',
        applicationDeadline: '',
        startDate: '',
        applicationInstructions: '',
        applicationUrl: '',
        contactEmail: '',
        internshipPaid: true,
        internshipStipend: '',
        internshipDuration: '',
        internshipHoursPerWeek: '',
        academicCreditAvailable: false,
        mentorshipProvided: true,
        conversionPossible: false,
        internshipProgram: '',
        urgentHiring: false,
        featuredListing: false,
        postingExpiration: '30',
      });

      setShowPostModal(false);
      alert(`${postingForm.postingType === 'job' ? 'Job' : 'Internship'} posted successfully!`);
    } catch (error) {
      console.error('Unexpected error posting job:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Billing context
  const {
    subscription,
    currentFeatures,
    canAccessFeature,
    canPostJob,
    getJobPostingsRemaining: _getJobPostingsRemaining,
    canSponsorEvent: _canSponsorEvent,
    subscribeToPlan,
    cancelSubscription,
    resumeSubscription,
    jobPostingsUsed,
  } = useBilling();

  // Determine org type from role or organization_type field
  const orgTypeKey = user.organization_type || user.role || 'private';
  const currentOrg = orgTypes[orgTypeKey as keyof typeof orgTypes] || orgTypes.private;

  // Helper to check if feature requires upgrade
  const requiresUpgrade = (feature: string): boolean => {
    if (feature === 'analytics') return !canAccessFeature('advancedAnalytics');
    if (feature === 'events') return !canAccessFeature('eventSponsorship');
    if (feature === 'branding') return !canAccessFeature('employerBranding');
    return false;
  };

  // Handle feature click with upgrade check
  const handleFeatureClick = (tabId: string) => {
    if (requiresUpgrade(tabId)) {
      setShowUpgradeModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  // Handle post job with limit check
  const handlePostJob = () => {
    if (!canPostJob()) {
      setShowUpgradeModal(true);
    } else {
      setShowPostModal(true);
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'postings', icon: '📋', label: 'Job Postings', badge: 8 },
    { id: 'applicants', icon: '👥', label: 'Applicants', badge: 156 },
    { id: 'pipeline', icon: '🔄', label: 'Hiring Pipeline' },
    { id: 'challenges', icon: '🏆', label: 'Innovation Challenges' },
    { id: 'compliance', icon: '⚖️', label: 'Compliance' },
    { id: 'events', icon: '📅', label: 'Events & Sponsorship', premium: !canAccessFeature('eventSponsorship') },
    { id: 'analytics', icon: '📈', label: 'Analytics', premium: !canAccessFeature('advancedAnalytics') },
    { id: 'branding', icon: '🏢', label: 'Employer Branding', premium: !canAccessFeature('employerBranding') },
    { id: 'billing', icon: '💳', label: 'Billing & Plans' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const postings = [
    { id: 1, title: 'Senior AI Engineer', type: 'Full-time', clearance: 'None', applicants: 45, eligible: 38 },
    { id: 2, title: 'Quantum Research Intern', type: 'Internship', clearance: 'Q Clearance', applicants: 23, eligible: 12 },
    { id: 3, title: 'Cybersecurity Analyst', type: 'Full-time', clearance: 'TS/SCI', applicants: 67, eligible: 28 },
    { id: 4, title: 'Process Engineer', type: 'Full-time', clearance: 'None', applicants: 34, eligible: 31 },
  ];

  const applicants = [
    { id: 1, name: 'Sarah Chen', role: 'AI Engineering Intern', avatar: 'SC', clearance: 'Q Clearance Eligible', score: 95 },
    { id: 2, name: 'Marcus Johnson', role: 'Cybersecurity Analyst', avatar: 'MJ', clearance: 'TS/SCI Active', score: 92 },
    { id: 3, name: 'Emily Rodriguez', role: 'Process Engineer', avatar: 'ER', clearance: 'None Required', score: 88 },
    { id: 4, name: 'David Kim', role: 'Quantum Researcher', avatar: 'DK', clearance: 'Q Clearance Pending', score: 85 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="p-3 mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${currentOrg.color}20` }}
            >
              {currentOrg.icon}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{user.organization_name || 'Organization'}</div>
              <div className="text-xs text-gray-400">{currentOrg.name}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleFeatureClick(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg mb-1 text-left text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {'premium' in item && item.premium && (
                <span className="ml-auto px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">PRO</span>
              )}
              {item.badge && !('premium' in item && item.premium) && (
                <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-gray-900 rounded-full text-xs font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button onClick={onSignOut} className="flex items-center gap-2 p-3 text-gray-400 hover:text-white text-sm">
          ← Sign Out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Partner Dashboard</h1>
                <p className="text-gray-400">Manage postings, review applicants, and track hiring pipeline</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePostJob}
                  className="px-5 py-2.5 font-semibold rounded-xl"
                  style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                >
                  + Post Opportunity
                </button>
              </div>
            </div>

            {/* Usage Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <UsageMeter
                label="Job Postings"
                used={jobPostingsUsed}
                limit={currentFeatures.maxJobPostings === Infinity ? -1 : currentFeatures.maxJobPostings}
                upgradeLink="/pricing"
                colorScheme="amber"
              />
              <UsageMeter
                label="Team Members"
                used={1}
                limit={currentFeatures.maxJobPostings === Infinity ? -1 : 5}
                upgradeLink="/pricing"
                colorScheme="blue"
              />
              <UsageMeter
                label="Event Sponsorships"
                used={0}
                limit={currentFeatures.eventSponsorsPerQuarter === Infinity ? -1 : currentFeatures.eventSponsorsPerQuarter}
                upgradeLink="/pricing"
                colorScheme="emerald"
              />
            </div>

            <div className="grid grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Active Postings', value: 8, color: currentOrg.color },
                { label: 'Total Applicants', value: 287, color: '#8b5cf6' },
                { label: 'Eligible', value: 156, color: '#10b981' },
                { label: 'Pending Clearance', value: 12, color: '#f59e0b' },
                { label: 'Hires (YTD)', value: 18, color: '#06b6d4' }
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Active Postings Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-8">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">📋 Active Postings</h2>
                <button className="text-sm font-medium" style={{ color: currentOrg.color }}>Manage All →</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Position</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Type</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Clearance</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Applicants</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Eligible</th>
                    <th className="p-4 text-right text-sm text-gray-400 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {postings.map(posting => (
                    <tr key={posting.id} className="border-b border-gray-800">
                      <td className="p-4 font-semibold text-white">{posting.title}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs ${
                          posting.type === 'Internship' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {posting.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">
                          {posting.clearance}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-white">{posting.applicants}</td>
                      <td className="p-4">
                        <span className="text-green-400 font-semibold">{posting.eligible}</span>
                        <span className="text-gray-500 text-sm ml-1">({Math.round(posting.eligible/posting.applicants*100)}%)</span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          className="px-4 py-2 rounded-lg text-sm font-semibold"
                          style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Applicants */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">👥 Recent Applicants</h2>
                <button className="text-sm font-medium" style={{ color: currentOrg.color }}>View All →</button>
              </div>
              {applicants.map(applicant => (
                <div key={applicant.id} className="p-5 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                    >
                      {applicant.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{applicant.name}</div>
                      <div className="text-sm text-gray-400">{applicant.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs">
                      {applicant.clearance}
                    </span>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${applicant.score >= 90 ? 'text-green-400' : 'text-orange-400'}`}>
                        {applicant.score}%
                      </div>
                      <div className="text-xs text-gray-500">Eligibility</div>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Job Postings Tab */}
        {activeTab === 'postings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Job Postings</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIAssistantModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>🤖</span> AI Assistant
                </button>
                <button
                  onClick={() => setShowBulkUploadModal(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-700"
                >
                  <span>📤</span> Bulk Upload
                </button>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="px-4 py-2 rounded-lg font-medium text-sm"
                  style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                >
                  + New Posting
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Position</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Type</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Clearance</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Posted</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Applicants</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Status</th>
                    <th className="p-4 text-right text-sm text-gray-400 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, title: 'Senior AI Engineer', type: 'Full-time', clearance: 'None', posted: 'Dec 15, 2024', applicants: 45, status: 'Active' },
                    { id: 2, title: 'Quantum Research Intern', type: 'Internship', clearance: 'Q Clearance', posted: 'Dec 10, 2024', applicants: 23, status: 'Active' },
                    { id: 3, title: 'Cybersecurity Analyst', type: 'Full-time', clearance: 'TS/SCI', posted: 'Dec 5, 2024', applicants: 67, status: 'Active' },
                    { id: 4, title: 'Process Engineer', type: 'Full-time', clearance: 'None', posted: 'Nov 28, 2024', applicants: 34, status: 'Active' },
                    { id: 5, title: 'Data Scientist', type: 'Full-time', clearance: 'Secret', posted: 'Nov 20, 2024', applicants: 89, status: 'Closed' },
                  ].map(posting => (
                    <tr key={posting.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 font-semibold text-white">{posting.title}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs ${
                          posting.type === 'Internship' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {posting.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs">{posting.clearance}</span>
                      </td>
                      <td className="p-4 text-gray-400">{posting.posted}</td>
                      <td className="p-4 font-semibold text-white">{posting.applicants}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs ${
                          posting.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {posting.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">Edit</button>
                          <button
                            className="px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">All Applicants</h1>
                <p className="text-gray-400 text-sm mt-1">{applications.length} total applications • AI-scored and ready for review</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAIScreenApplications}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>🤖</span> AI Screen All
                </button>
                <button
                  onClick={() => setShowBulkDownloadModal(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-700"
                >
                  <span>📥</span> Export All
                </button>
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              <input type="search" placeholder="Search applicants..." className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm w-64" />
              <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                <option>All Positions</option>
                <option>Senior AI Engineer</option>
                <option>Cybersecurity Analyst</option>
              </select>
              <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                <option>All Clearances</option>
                <option>None Required</option>
                <option>Secret</option>
                <option>TS/SCI</option>
              </select>
              <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                <option>All AI Scores</option>
                <option>Excellent (90+)</option>
                <option>Strong (80-89)</option>
                <option>Good (70-79)</option>
                <option>Fair (60-69)</option>
              </select>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {[
                { id: 1, name: 'Sarah Chen', position: 'Senior AI Engineer', clearance: 'Q Clearance Eligible', score: 95, stage: 'Interview', applied: 'Dec 20, 2024' },
                { id: 2, name: 'Marcus Johnson', position: 'Cybersecurity Analyst', clearance: 'TS/SCI Active', score: 92, stage: 'Offer', applied: 'Dec 18, 2024' },
                { id: 3, name: 'Emily Rodriguez', position: 'Process Engineer', clearance: 'None Required', score: 88, stage: 'Review', applied: 'Dec 22, 2024' },
                { id: 4, name: 'David Kim', position: 'Quantum Research Intern', clearance: 'Q Clearance Pending', score: 85, stage: 'Screening', applied: 'Dec 21, 2024' },
                { id: 5, name: 'Lisa Park', position: 'Senior AI Engineer', clearance: 'Secret Active', score: 91, stage: 'Interview', applied: 'Dec 19, 2024' },
              ].map(applicant => (
                <div key={applicant.id} className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                      >
                        {applicant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{applicant.name}</div>
                        <div className="text-sm text-gray-400">{applicant.position}</div>
                        <div className="text-xs text-gray-500">Applied: {applicant.applied}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs">{applicant.clearance}</span>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${applicant.score >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {applicant.score}%
                        </div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        applicant.stage === 'Offer' ? 'bg-green-500/10 text-green-400' :
                        applicant.stage === 'Interview' ? 'bg-yellow-500/10 text-yellow-400' :
                        applicant.stage === 'Review' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {applicant.stage}
                      </span>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiring Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Hiring Pipeline</h1>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {[
                { stage: 'Applied', count: 156, color: '#6b7280' },
                { stage: 'Screening', count: 89, color: '#8b5cf6' },
                { stage: 'Interview', count: 34, color: '#F5C518' },
                { stage: 'Offer', count: 12, color: '#10b981' },
                { stage: 'Hired', count: 8, color: '#06b6d4' },
              ].map((stage, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-2xl font-bold mb-1" style={{ color: stage.color }}>{stage.count}</div>
                  <div className="text-sm text-gray-400">{stage.stage}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { stage: 'Screening', candidates: [
                  { name: 'John Smith', position: 'AI Engineer', days: 2 },
                  { name: 'Amy Lee', position: 'Data Scientist', days: 3 },
                ]},
                { stage: 'Interview', candidates: [
                  { name: 'Sarah Chen', position: 'AI Engineer', days: 5 },
                  { name: 'Lisa Park', position: 'AI Engineer', days: 4 },
                ]},
                { stage: 'Offer', candidates: [
                  { name: 'Marcus Johnson', position: 'Security Analyst', days: 7 },
                ]},
                { stage: 'Hired', candidates: [
                  { name: 'Chris Evans', position: 'Process Engineer', days: 14 },
                ]},
              ].map((column, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                  <h3 className="text-white font-semibold mb-4">{column.stage}</h3>
                  <div className="space-y-3">
                    {column.candidates.map((candidate, j) => (
                      <div key={j} className="p-3 bg-gray-800 rounded-xl">
                        <div className="font-medium text-white text-sm">{candidate.name}</div>
                        <div className="text-xs text-gray-500">{candidate.position}</div>
                        <div className="text-xs text-gray-400 mt-1">{candidate.days} days in stage</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Compliance & Regulations</h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Compliance Score', value: '94%', color: '#10b981', status: 'Good' },
                { label: 'Pending Reviews', value: 3, color: '#f59e0b', status: 'Action Needed' },
                { label: 'Clearance Requests', value: 12, color: '#8b5cf6', status: 'In Progress' },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      stat.status === 'Good' ? 'bg-green-500/10 text-green-400' :
                      stat.status === 'Action Needed' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {stat.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">EEO Compliance</h2>
                <div className="space-y-4">
                  {[
                    { category: 'Diversity Reporting', status: 'Complete', date: 'Q4 2024' },
                    { category: 'Affirmative Action Plan', status: 'Complete', date: '2024' },
                    { category: 'Wage Gap Analysis', status: 'In Progress', date: 'Q1 2025' },
                    { category: 'Harassment Training', status: 'Complete', date: 'Nov 2024' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">{item.date}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'Complete' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Clearance Processing</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Marcus Johnson', level: 'TS/SCI', status: 'Pending Adjudication', progress: 85 },
                    { name: 'Emily Rodriguez', level: 'Secret', status: 'Background Check', progress: 60 },
                    { name: 'David Kim', level: 'Q Clearance', status: 'Investigation', progress: 45 },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-red-400 text-sm">{item.level}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{item.status}</div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${item.progress}%`, backgroundColor: currentOrg.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events & Sponsorship Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Events & Sponsorship</h1>
              <button
                className="px-4 py-2 rounded-lg font-medium text-sm"
                style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
              >
                + Sponsor Event
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Sponsored Events</h2>
                <div className="space-y-4">
                  {[
                    { name: 'AI/ML Career Fair 2025', date: 'Jan 15, 2025', type: 'Career Fair', level: 'Gold Sponsor', candidates: 45 },
                    { name: 'Cybersecurity Summit', date: 'Feb 10, 2025', type: 'Conference', level: 'Platinum', candidates: 0 },
                    { name: 'STEM Diversity Summit', date: 'Mar 5, 2025', type: 'Summit', level: 'Silver', candidates: 0 },
                  ].map((event, i) => (
                    <div key={i} className="p-5 bg-gray-900 rounded-2xl border border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white">{event.name}</div>
                          <div className="text-sm text-gray-400">{event.date}</div>
                        </div>
                        <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${currentOrg.color}15`, color: currentOrg.color }}>
                          {event.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{event.type}</span>
                        {event.candidates > 0 && (
                          <span className="text-sm text-green-400">{event.candidates} candidates engaged</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Available Opportunities</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Quantum Technologies Workshop', date: 'Apr 20, 2025', spots: 3, price: '$5,000' },
                    { name: 'National Lab Open House', date: 'May 15, 2025', spots: 5, price: '$2,500' },
                    { name: 'STEM Internship Fair', date: 'Jun 1, 2025', spots: 10, price: '$3,000' },
                  ].map((event, i) => (
                    <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-medium">{event.price}</div>
                          <div className="text-xs text-gray-500">{event.spots} spots left</div>
                        </div>
                        <button
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                        >
                          Sponsor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Hiring Analytics</h1>
            <FeatureGate
              feature="Advanced Analytics"
              isUnlocked={canAccessFeature('advancedAnalytics')}
              requiredTier="Talent Engine"
              upgradeLink="/pricing"
            >
            <div className="grid grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Hires (YTD)', value: 18, color: '#10b981' },
                { label: 'Avg Time to Hire', value: '32 days', color: '#F5C518' },
                { label: 'Offer Acceptance', value: '87%', color: '#8b5cf6' },
                { label: 'Retention Rate', value: '94%', color: '#06b6d4' },
                { label: 'Cost per Hire', value: '$4.2K', color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Hires by Source</h2>
                <div className="space-y-3">
                  {[
                    { source: 'STEMWorkforce Platform', hires: 8, percent: 44 },
                    { source: 'Career Fairs', hires: 4, percent: 22 },
                    { source: 'Employee Referrals', hires: 3, percent: 17 },
                    { source: 'University Partnerships', hires: 2, percent: 11 },
                    { source: 'Direct Applications', hires: 1, percent: 6 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.source}</span>
                        <span className="text-white font-medium">{item.hires} ({item.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: currentOrg.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Pipeline Conversion</h2>
                <div className="space-y-3">
                  {[
                    { stage: 'Applied → Screened', rate: 57 },
                    { stage: 'Screened → Interviewed', rate: 38 },
                    { stage: 'Interviewed → Offered', rate: 35 },
                    { stage: 'Offered → Hired', rate: 87 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">{item.stage}</span>
                      <span style={{ color: currentOrg.color }} className="font-medium">{item.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </FeatureGate>
          </div>
        )}

        {/* Employer Branding Tab */}
        {activeTab === 'branding' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Employer Branding</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Company Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                      <input type="text" defaultValue={user.organization_name || 'Organization'} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tagline</label>
                      <input type="text" placeholder="Brief company tagline" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">About Us</label>
                      <textarea className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-32 resize-none" placeholder="Tell candidates about your company..." />
                    </div>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                  >
                    Save Changes
                  </button>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4">Benefits & Perks</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Health Insurance', '401(k) Match', 'Remote Work', 'Unlimited PTO',
                      'Stock Options', 'Learning Budget', 'Gym Membership', 'Relocation',
                    ].map((benefit, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 4} className="w-4 h-4 accent-yellow-500" />
                        <span className="text-gray-300">{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Profile Strength</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="8" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke={currentOrg.color} strokeWidth="8" fill="none"
                        strokeDasharray={`${78 * 3.52} 352`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">78%</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Good - Add photos to improve</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4">Profile Views</h3>
                  <div className="text-3xl font-bold mb-2" style={{ color: currentOrg.color }}>1,247</div>
                  <div className="text-sm text-gray-400">Last 30 days</div>
                  <div className="text-xs text-green-400 mt-1">+23% vs previous month</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Organization Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Organization Name</label>
                    <input type="text" defaultValue={user.organization_name || 'Organization'} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Industry</label>
                    <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                      <option>{currentOrg.name}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Website</label>
                    <input type="url" placeholder="https://www.example.com" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                  </div>
                </div>
                <button
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                >
                  Save Changes
                </button>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: 'New applicant notifications', checked: true },
                    { label: 'Interview reminders', checked: true },
                    { label: 'Clearance status updates', checked: true },
                    { label: 'Weekly hiring report', checked: false },
                    { label: 'Event announcements', checked: true },
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors`} style={{ backgroundColor: setting.checked ? currentOrg.color : '#374151' }}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.checked ? 'translate-x-6' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Team Access</h2>
                <div className="space-y-3">
                  {[
                    { name: user.first_name + ' ' + user.last_name, role: 'Admin', email: user.email },
                    { name: 'HR Manager', role: 'Recruiter', email: 'hr@example.com' },
                    { name: 'Hiring Manager', role: 'Viewer', email: 'hiring@example.com' },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${currentOrg.color}15`, color: currentOrg.color }}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => alert('Invite Team Member feature coming soon!')}
                  className="mt-4 text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: currentOrg.color }}
                >
                  + Invite Team Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h1>

            {/* Current Plan */}
            <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Plan</div>
                  <div className="text-2xl font-bold text-white capitalize">
                    {subscription?.tier || 'Free'} Plan
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    subscription?.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    subscription?.status === 'trialing' ? 'bg-yellow-500/10 text-yellow-400' :
                    subscription?.status === 'past_due' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {subscription?.status === 'trialing' ? 'Trial' : subscription?.status || 'Active'}
                  </span>
                </div>
              </div>
              {subscription?.trialEnd && subscription.status === 'trialing' && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                  <div className="text-yellow-400 text-sm">
                    Your free trial ends on {new Date(subscription.trialEnd).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {jobPostingsUsed} / {currentFeatures.maxJobPostings === Infinity ? '∞' : currentFeatures.maxJobPostings}
                  </div>
                  <div className="text-sm text-gray-400">Job Postings</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {currentFeatures.advancedAnalytics ? '✓' : '✕'}
                  </div>
                  <div className="text-sm text-gray-400">Advanced Analytics</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {currentFeatures.eventSponsorship ? `${currentFeatures.eventSponsorsPerQuarter === Infinity ? '∞' : currentFeatures.eventSponsorsPerQuarter}/qtr` : '✕'}
                  </div>
                  <div className="text-sm text-gray-400">Event Sponsorships</div>
                </div>
              </div>
              {subscription?.cancelAtPeriodEnd && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm">Your subscription will cancel at the end of the billing period</span>
                    <button
                      onClick={() => resumeSubscription()}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Available Plans */}
            <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                {
                  id: 'free',
                  name: 'Launchpad',
                  price: 'Free',
                  period: 'forever',
                  features: ['Up to 3 job postings', 'Basic candidate search', 'Email support', 'Standard job listing'],
                  current: subscription?.tier === 'free',
                },
                {
                  id: 'professional-monthly',
                  name: 'Talent Engine',
                  price: '$499',
                  period: '/month',
                  features: ['Up to 25 job postings', 'Advanced analytics', 'Candidate search & filters', 'Event sponsorship (2/quarter)', 'Employer branding page', 'Priority support'],
                  popular: true,
                  current: subscription?.tier === 'professional',
                },
                {
                  id: 'enterprise',
                  name: 'Mission Control',
                  price: '$1,999',
                  period: '/month',
                  features: ['Unlimited job postings', 'Full analytics suite', 'Unlimited event sponsorships', 'Dedicated account manager', 'Custom integrations', 'API access'],
                  current: subscription?.tier === 'enterprise',
                },
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border ${
                    plan.popular
                      ? 'bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/50'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Current
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (plan.id === 'enterprise') {
                        window.location.href = 'mailto:sales@stemworkforce.net?subject=Enterprise%20Inquiry';
                      } else if (!plan.current) {
                        subscribeToPlan(plan.id);
                      }
                    }}
                    disabled={plan.current}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      plan.current
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {plan.current ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>

            {/* Billing History */}
            <h2 className="text-lg font-semibold text-white mb-4">Billing History</h2>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Date</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Description</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Amount</th>
                    <th className="p-4 text-left text-sm text-gray-400 font-normal">Status</th>
                    <th className="p-4 text-right text-sm text-gray-400 font-normal">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {subscription?.tier !== 'free' ? (
                    [
                      { date: 'Dec 1, 2024', description: 'Growth Plan - Monthly', amount: '$499.00', status: 'Paid' },
                      { date: 'Nov 1, 2024', description: 'Growth Plan - Monthly', amount: '$499.00', status: 'Paid' },
                      { date: 'Oct 1, 2024', description: 'Growth Plan - Monthly', amount: '$499.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="p-4 text-gray-300">{invoice.date}</td>
                        <td className="p-4 text-white">{invoice.description}</td>
                        <td className="p-4 text-white">{invoice.amount}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">{invoice.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-purple-400 hover:text-purple-300 text-sm">Download</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No billing history yet. Upgrade to a paid plan to see invoices here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Manage Subscription */}
            {subscription?.tier !== 'free' && (
              <div className="mt-6 p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-semibold text-white mb-4">Manage Subscription</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {/* Would open Stripe portal */}}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                  >
                    Update Payment Method
                  </button>
                  <button
                    onClick={() => cancelSubscription()}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradePrompt
          feature="Advanced Hiring Tools"
          currentTier="Launchpad (Free)"
          requiredTier="Talent Engine"
          price="$499/mo"
          variant="modal"
          onUpgrade={() => {
            subscribeToPlan('employer_professional');
            setShowUpgradeModal(false);
          }}
          onDismiss={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Enhanced Post Job/Internship Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Post New Opportunity</h2>
                <p className="text-sm text-gray-400 mt-1">Create a comprehensive job or internship posting</p>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Posting Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-800 rounded-xl mb-6 w-fit">
                <button
                  onClick={() => setPostingForm({ ...postingForm, postingType: 'job' })}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    postingForm.postingType === 'job'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Job Posting
                </button>
                <button
                  onClick={() => setPostingForm({ ...postingForm, postingType: 'internship' })}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    postingForm.postingType === 'internship'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Internship
                </button>
              </div>

              {/* Section: Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">1</span>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position Title *</label>
                    <input
                      type="text"
                      value={postingForm.title}
                      onChange={(e) => setPostingForm({ ...postingForm, title: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer, AI Research Intern"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type *</label>
                      <select
                        value={postingForm.employmentType}
                        onChange={(e) => setPostingForm({ ...postingForm, employmentType: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                        <option value="fellowship">Fellowship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                      <input
                        type="text"
                        value={postingForm.department}
                        onChange={(e) => setPostingForm({ ...postingForm, department: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Engineering, Research"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Work Location */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">2</span>
                  Work Location
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Work Location Type *</label>
                    <div className="flex gap-3">
                      {[
                        { value: 'onsite', label: 'On-site', icon: '🏢' },
                        { value: 'remote', label: 'Remote', icon: '🏠' },
                        { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setPostingForm({ ...postingForm, workLocationType: option.value as any })}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            postingForm.workLocationType === option.value
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <div className={`font-medium ${postingForm.workLocationType === option.value ? 'text-blue-400' : 'text-white'}`}>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {postingForm.workLocationType !== 'remote' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                        <input
                          type="text"
                          value={postingForm.workLocationCity}
                          onChange={(e) => setPostingForm({ ...postingForm, workLocationCity: e.target.value })}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                        <input
                          type="text"
                          value={postingForm.workLocationState}
                          onChange={(e) => setPostingForm({ ...postingForm, workLocationState: e.target.value })}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., California"
                        />
                      </div>
                    </div>
                  )}

                  {postingForm.workLocationType === 'remote' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Remote Work Restrictions</label>
                      <input
                        type="text"
                        value={postingForm.remoteRestrictions}
                        onChange={(e) => setPostingForm({ ...postingForm, remoteRestrictions: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Must be based in the United States"
                      />
                    </div>
                  )}

                  {postingForm.workLocationType === 'hybrid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Days On-site Per Week</label>
                      <select
                        value={postingForm.hybridDaysOnsite}
                        onChange={(e) => setPostingForm({ ...postingForm, hybridDaysOnsite: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="1">1 day per week</option>
                        <option value="2">2 days per week</option>
                        <option value="3">3 days per week</option>
                        <option value="4">4 days per week</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Travel Requirements</label>
                    <select
                      value={postingForm.travelRequired}
                      onChange={(e) => setPostingForm({ ...postingForm, travelRequired: e.target.value as any })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">No travel required</option>
                      <option value="occasional">Occasional (up to 25%)</option>
                      <option value="frequent">Frequent (25-50%)</option>
                      <option value="extensive">Extensive (50%+)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Compensation (Pay Transparency) */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">3</span>
                  Compensation
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full ml-2">Pay Transparency Required</span>
                </h3>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-4">
                  <p className="text-sm text-yellow-300">
                    Many states now require salary ranges in job postings. Providing transparent compensation helps attract qualified candidates.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pay Type</label>
                      <select
                        value={postingForm.salaryType}
                        onChange={(e) => setPostingForm({ ...postingForm, salaryType: e.target.value as any })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500"
                      >
                        <option value="annual">Annual Salary</option>
                        <option value="hourly">Hourly Rate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum {postingForm.salaryType === 'annual' ? 'Salary' : 'Rate'} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={postingForm.salaryMin}
                          onChange={(e) => setPostingForm({ ...postingForm, salaryMin: e.target.value })}
                          className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500"
                          placeholder={postingForm.salaryType === 'annual' ? '80,000' : '40'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Maximum {postingForm.salaryType === 'annual' ? 'Salary' : 'Rate'} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={postingForm.salaryMax}
                          onChange={(e) => setPostingForm({ ...postingForm, salaryMax: e.target.value })}
                          className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-green-500"
                          placeholder={postingForm.salaryType === 'annual' ? '120,000' : '60'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postingForm.bonusEligible}
                        onChange={(e) => setPostingForm({ ...postingForm, bonusEligible: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-300">Bonus Eligible</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postingForm.commissionEligible}
                        onChange={(e) => setPostingForm({ ...postingForm, commissionEligible: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-300">Commission</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postingForm.equityOffered}
                        onChange={(e) => setPostingForm({ ...postingForm, equityOffered: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-300">Equity/Stock Options</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postingForm.salaryNegotiable}
                        onChange={(e) => setPostingForm({ ...postingForm, salaryNegotiable: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-300">Negotiable</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section: Benefits */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">4</span>
                  Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {benefitOptions.map((benefit) => (
                    <button
                      key={benefit}
                      onClick={() => toggleBenefit(benefit)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        postingForm.benefits.includes(benefit)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {benefit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section: Requirements */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">5</span>
                  Requirements
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Education Level</label>
                      <select
                        value={postingForm.educationLevel}
                        onChange={(e) => setPostingForm({ ...postingForm, educationLevel: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="none">No requirement</option>
                        <option value="high-school">High School Diploma</option>
                        <option value="associate">Associate's Degree</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="doctorate">Doctorate (PhD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience</label>
                      <select
                        value={postingForm.yearsExperience}
                        onChange={(e) => setPostingForm({ ...postingForm, yearsExperience: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select...</option>
                        <option value="0">Entry Level (0 years)</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-7">5-7 years</option>
                        <option value="7-10">7-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Security Clearance</label>
                      <select
                        value={postingForm.clearanceLevel}
                        onChange={(e) => setPostingForm({ ...postingForm, clearanceLevel: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="none">None Required</option>
                        <option value="public-trust">Public Trust</option>
                        <option value="secret">Secret</option>
                        <option value="top-secret">Top Secret</option>
                        <option value="ts-sci">TS/SCI</option>
                        <option value="ts-sci-poly">TS/SCI with Polygraph</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-800 rounded-xl border border-gray-700 w-full">
                        <input
                          type="checkbox"
                          checked={postingForm.clearanceSponsored}
                          onChange={(e) => setPostingForm({ ...postingForm, clearanceSponsored: e.target.checked })}
                          className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-300">Will sponsor clearance</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={postingForm.requiredSkills}
                      onChange={(e) => setPostingForm({ ...postingForm, requiredSkills: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Python, Machine Learning, TensorFlow, Data Analysis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={postingForm.preferredSkills}
                      onChange={(e) => setPostingForm({ ...postingForm, preferredSkills: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., AWS, Docker, Kubernetes, CI/CD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Certifications</label>
                    <input
                      type="text"
                      value={postingForm.certifications}
                      onChange={(e) => setPostingForm({ ...postingForm, certifications: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., AWS Solutions Architect, PMP, CISSP"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Internship-specific fields */}
              {postingForm.postingType === 'internship' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">6</span>
                    Internship Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                        <select
                          value={postingForm.internshipDuration}
                          onChange={(e) => setPostingForm({ ...postingForm, internshipDuration: e.target.value })}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select...</option>
                          <option value="1-month">1 month</option>
                          <option value="2-months">2 months</option>
                          <option value="3-months">3 months (Summer)</option>
                          <option value="4-months">4 months (Semester)</option>
                          <option value="6-months">6 months</option>
                          <option value="12-months">12 months</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Hours Per Week</label>
                        <select
                          value={postingForm.internshipHoursPerWeek}
                          onChange={(e) => setPostingForm({ ...postingForm, internshipHoursPerWeek: e.target.value })}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select...</option>
                          <option value="10-15">10-15 hours (Part-time)</option>
                          <option value="15-20">15-20 hours (Part-time)</option>
                          <option value="20-30">20-30 hours</option>
                          <option value="40">40 hours (Full-time)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={postingForm.internshipPaid}
                          onChange={(e) => setPostingForm({ ...postingForm, internshipPaid: e.target.checked })}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-gray-300">Paid Internship</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={postingForm.academicCreditAvailable}
                          onChange={(e) => setPostingForm({ ...postingForm, academicCreditAvailable: e.target.checked })}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-gray-300">Academic Credit Eligible</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={postingForm.mentorshipProvided}
                          onChange={(e) => setPostingForm({ ...postingForm, mentorshipProvided: e.target.checked })}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-gray-300">Mentorship Provided</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={postingForm.conversionPossible}
                          onChange={(e) => setPostingForm({ ...postingForm, conversionPossible: e.target.checked })}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-gray-300">Full-time Conversion Possible</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Internship Program Name (optional)</label>
                      <input
                        type="text"
                        value={postingForm.internshipProgram}
                        onChange={(e) => setPostingForm({ ...postingForm, internshipProgram: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., Summer Technology Leadership Program"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Job Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400">
                    {postingForm.postingType === 'internship' ? '7' : '6'}
                  </span>
                  Job Description
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                    <textarea
                      value={postingForm.description}
                      onChange={(e) => setPostingForm({ ...postingForm, description: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white h-32 resize-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Provide a compelling overview of the role and your organization..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Key Responsibilities</label>
                    <textarea
                      value={postingForm.responsibilities}
                      onChange={(e) => setPostingForm({ ...postingForm, responsibilities: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white h-24 resize-none focus:ring-2 focus:ring-pink-500"
                      placeholder="• Lead development of AI/ML models&#10;• Collaborate with cross-functional teams&#10;• Present findings to stakeholders"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Qualifications</label>
                    <textarea
                      value={postingForm.qualifications}
                      onChange={(e) => setPostingForm({ ...postingForm, qualifications: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white h-24 resize-none focus:ring-2 focus:ring-pink-500"
                      placeholder="• Bachelor's degree in Computer Science&#10;• 3+ years of experience in ML&#10;• Strong Python and TensorFlow skills"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Application Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                    {postingForm.postingType === 'internship' ? '8' : '7'}
                  </span>
                  Application Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Application Deadline</label>
                      <input
                        type="date"
                        value={postingForm.applicationDeadline}
                        onChange={(e) => setPostingForm({ ...postingForm, applicationDeadline: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={postingForm.startDate}
                        onChange={(e) => setPostingForm({ ...postingForm, startDate: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Application URL (optional)</label>
                    <input
                      type="url"
                      value={postingForm.applicationUrl}
                      onChange={(e) => setPostingForm({ ...postingForm, applicationUrl: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://careers.yourcompany.com/apply"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={postingForm.contactEmail}
                      onChange={(e) => setPostingForm({ ...postingForm, contactEmail: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="recruiting@yourcompany.com"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Posting Options */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                    {postingForm.postingType === 'internship' ? '9' : '8'}
                  </span>
                  Posting Options
                </h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-800 rounded-xl border border-gray-700">
                    <input
                      type="checkbox"
                      checked={postingForm.urgentHiring}
                      onChange={(e) => setPostingForm({ ...postingForm, urgentHiring: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-gray-300">🔥 Urgent Hiring</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-800 rounded-xl border border-gray-700">
                    <input
                      type="checkbox"
                      checked={postingForm.featuredListing}
                      onChange={(e) => setPostingForm({ ...postingForm, featuredListing: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-gray-300">⭐ Featured Listing</span>
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-300">Expires in:</span>
                    <select
                      value={postingForm.postingExpiration}
                      onChange={(e) => setPostingForm({ ...postingForm, postingExpiration: e.target.value })}
                      className="bg-gray-700 border-none rounded-lg text-white p-1"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800 flex justify-between items-center flex-shrink-0">
              <div className="text-sm text-gray-400">
                * Required fields
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPosting}
                  className="px-6 py-2.5 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
                >
                  Publish {postingForm.postingType === 'job' ? 'Job' : 'Internship'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-3xl bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📤</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Bulk Upload Jobs & Internships</h2>
                  <p className="text-sm text-gray-400">Import multiple positions from CSV or Excel file</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setBulkUploadStep('upload');
                  setBulkUploadFile(null);
                  setBulkUploadPreview([]);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {['upload', 'preview', 'confirm', 'complete'].map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      bulkUploadStep === step ? 'bg-blue-500 text-white' :
                      ['upload', 'preview', 'confirm', 'complete'].indexOf(bulkUploadStep) > index ? 'bg-green-500 text-white' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {['upload', 'preview', 'confirm', 'complete'].indexOf(bulkUploadStep) > index ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${bulkUploadStep === step ? 'text-white' : 'text-gray-400'}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                    {index < 3 && <div className="w-8 h-0.5 bg-gray-700 mx-2" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Upload */}
              {bulkUploadStep === 'upload' && (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-700 rounded-2xl p-12 hover:border-blue-500 transition-colors">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📁</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload your file</h3>
                    <p className="text-gray-400 mb-4">Drag and drop or click to browse</p>
                    <p className="text-sm text-gray-500 mb-6">Supports CSV, XLSX (Excel)</p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleBulkFileUpload}
                      className="hidden"
                      id="bulk-upload-input"
                    />
                    <label
                      htmlFor="bulk-upload-input"
                      className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl font-medium cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                  <div className="mt-6 p-4 bg-gray-800 rounded-xl">
                    <h4 className="font-medium text-white mb-2">Required Columns:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Title', 'Type (job/internship)', 'Location', 'Salary Min', 'Salary Max', 'Department'].map((col) => (
                        <span key={col} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">{col}</span>
                      ))}
                    </div>
                    <button className="mt-4 text-blue-400 text-sm hover:underline">Download Template</button>
                  </div>
                </div>
              )}

              {/* Step 2: Preview */}
              {bulkUploadStep === 'preview' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <div className="font-medium text-white">{bulkUploadFile?.name}</div>
                        <div className="text-sm text-gray-400">{bulkUploadPreview.length} positions found</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">Valid Format</span>
                  </div>
                  <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="p-3 text-left text-sm text-gray-400 font-normal">Title</th>
                          <th className="p-3 text-left text-sm text-gray-400 font-normal">Type</th>
                          <th className="p-3 text-left text-sm text-gray-400 font-normal">Location</th>
                          <th className="p-3 text-left text-sm text-gray-400 font-normal">Salary Range</th>
                          <th className="p-3 text-left text-sm text-gray-400 font-normal">Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkUploadPreview.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700 last:border-0">
                            <td className="p-3 text-white">{item.title}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.type === 'internship' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-3 text-gray-300">{item.location}</td>
                            <td className="p-3 text-gray-300">
                              {item.type === 'internship'
                                ? `$${item.salaryMin}/hr - $${item.salaryMax}/hr`
                                : `$${parseInt(item.salaryMin).toLocaleString()} - $${parseInt(item.salaryMax).toLocaleString()}`
                              }
                            </td>
                            <td className="p-3 text-gray-300">{item.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setBulkUploadStep('upload');
                        setBulkUploadFile(null);
                        setBulkUploadPreview([]);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                    >
                      Upload Different File
                    </button>
                    <button
                      onClick={handleBulkUploadConfirm}
                      className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400"
                    >
                      Confirm & Upload {bulkUploadPreview.length} Positions
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Processing */}
              {bulkUploadStep === 'confirm' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-4xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Processing Your Upload</h3>
                  <p className="text-gray-400 mb-6">Creating {bulkUploadPreview.length} job postings...</p>
                  <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-[progress_2s_ease-in-out]" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {bulkUploadStep === 'complete' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
                  <p className="text-gray-400 mb-6">{bulkUploadPreview.length} positions have been created and are now live</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-white">{bulkUploadPreview.filter(p => p.type === 'job').length}</div>
                      <div className="text-sm text-gray-400">Jobs</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-white">{bulkUploadPreview.filter(p => p.type === 'internship').length}</div>
                      <div className="text-sm text-gray-400">Internships</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">Active</div>
                      <div className="text-sm text-gray-400">Status</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkUploadStep('upload');
                      setBulkUploadFile(null);
                      setBulkUploadPreview([]);
                    }}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400"
                  >
                    View All Postings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Download Modal */}
      {showBulkDownloadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-lg bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📥</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Export Applications</h2>
                  <p className="text-sm text-gray-400">Download all application data</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkDownloadModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Export Summary</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-800 rounded-xl text-center">
                    <div className="text-xl font-bold text-white">{applications.length}</div>
                    <div className="text-xs text-gray-400">Total Applications</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-xl text-center">
                    <div className="text-xl font-bold text-green-400">{applications.filter(a => a.aiScore >= 90).length}</div>
                    <div className="text-xs text-gray-400">Top Matches</div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-xl text-center">
                    <div className="text-xl font-bold text-blue-400">{new Set(applications.map(a => a.position)).size}</div>
                    <div className="text-xs text-gray-400">Positions</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Data Fields Included</h3>
                <div className="flex flex-wrap gap-2">
                  {['Name', 'Email', 'Position', 'Applied Date', 'Status', 'AI Score', 'AI Match Rating', 'Skills'].map((field) => (
                    <span key={field} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm flex items-center gap-1">
                      <span className="text-green-400">✓</span> {field}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-medium text-white mb-3">Choose Export Format</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBulkDownload('csv')}
                  className="w-full p-4 bg-gray-800 rounded-xl flex items-center justify-between hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">CSV File</div>
                      <div className="text-sm text-gray-400">Best for Excel, Google Sheets</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-white">Download →</span>
                </button>
                <button
                  onClick={() => handleBulkDownload('excel')}
                  className="w-full p-4 bg-gray-800 rounded-xl flex items-center justify-between hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📗</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">Excel File (.xlsx)</div>
                      <div className="text-sm text-gray-400">Formatted spreadsheet with styling</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-white">Download →</span>
                </button>
                <button
                  onClick={() => handleBulkDownload('pdf')}
                  className="w-full p-4 bg-gray-800 rounded-xl flex items-center justify-between hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📕</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-white">PDF Report</div>
                      <div className="text-sm text-gray-400">Print-ready formatted report</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-white">Download →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistantModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-3xl bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">AI Recruitment Assistant</h2>
                  <p className="text-sm text-gray-400">Powered by advanced AI for smarter hiring</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAIAssistantModal(false);
                  setAiSuggestion('');
                }}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* AI Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">✍️</span>
                    <h3 className="font-semibold text-white">Job Description Generator</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Generate compelling, compliant job descriptions in seconds</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter job title..."
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                      id="ai-job-title-input"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('ai-job-title-input') as HTMLInputElement;
                        handleAIGenerateDescription(input?.value || 'Software Engineer');
                      }}
                      disabled={aiGenerating}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-400 disabled:opacity-50"
                    >
                      {aiGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎯</span>
                    <h3 className="font-semibold text-white">AI Application Screening</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Automatically score and rank candidates based on job fit</p>
                  <button
                    onClick={handleAIScreenApplications}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-400 w-full"
                  >
                    Screen All Applications
                  </button>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📊</span>
                    <h3 className="font-semibold text-white">Salary Insights</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Get AI-powered salary recommendations based on market data</p>
                  <button
                    onClick={() => alert('AI Salary Analysis:\n\nBased on market data for Senior AI Engineers:\n• National Average: $165,000\n• Your Market (Remote): $155,000 - $195,000\n• Recommended Range: $160,000 - $190,000\n\nThis is competitive with 85% of similar postings.')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-400 w-full"
                  >
                    Analyze Salaries
                  </button>
                </div>

                <div className="p-5 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📈</span>
                    <h3 className="font-semibold text-white">Hiring Predictions</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Predict time-to-hire and candidate quality for your postings</p>
                  <button
                    onClick={() => alert('AI Hiring Predictions:\n\n📊 Senior AI Engineer:\n• Estimated Time to Hire: 28-35 days\n• Expected Quality Candidates: 15-20\n• Suggested Sourcing: LinkedIn, GitHub\n\n📊 ML Research Intern:\n• Estimated Time to Hire: 14-21 days\n• Expected Quality Candidates: 35-45\n• Suggested Sourcing: University Partners')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-400 w-full"
                  >
                    Get Predictions
                  </button>
                </div>
              </div>

              {/* AI Generated Content Display */}
              {aiSuggestion && (
                <div className="p-5 bg-gray-800 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">✨</span>
                      <h4 className="font-medium text-white">AI Generated Job Description</h4>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiSuggestion);
                        alert('Copied to clipboard!');
                      }}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {aiSuggestion}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setPostingForm({ ...postingForm, description: aiSuggestion });
                        setShowAIAssistantModal(false);
                        setShowPostModal(true);
                        setAiSuggestion('');
                      }}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium"
                    >
                      Use This Description
                    </button>
                    <button
                      onClick={() => setAiSuggestion('')}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {/* AI Stats */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">⚡</span>
                    <div>
                      <div className="text-white font-medium">AI Usage This Month</div>
                      <div className="text-sm text-gray-400">147 of 500 AI credits used</div>
                    </div>
                  </div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '29.4%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN DASHBOARD PAGE (Router)
// ============================================
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        navigate('/login');
        return;
      }

      // Try to get profile from users table first (try by id, then auth_id, then email)
if (import.meta.env.DEV) console.log('[DashboardPage] Fetching profile for user:', authUser.id, authUser.email);

      let profile = null;

      // Try by id first (synced with auth.users)
      const { data: profileById } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileById) {
        profile = profileById;
if (import.meta.env.DEV) console.log('[DashboardPage] Found profile by id:', profile.role);
      } else {
        // Try by auth_id
        const { data: profileByAuthId } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (profileByAuthId) {
          profile = profileByAuthId;
if (import.meta.env.DEV) console.log('[DashboardPage] Found profile by auth_id:', profile.role);
        } else if (authUser.email) {
          // Try by email as last resort
          const { data: profileByEmail } = await supabase
            .from('users')
            .select('*')
            .eq('email', authUser.email)
            .single();

          if (profileByEmail) {
            profile = profileByEmail;
if (import.meta.env.DEV) console.log('[DashboardPage] Found profile by email:', profile.role);
          }
        }
      }

      if (profile) {
if (import.meta.env.DEV) console.log('[DashboardPage] Using profile with role:', profile.role);
        setUser(profile as UserProfile);
      } else {
        // Fall back to auth user metadata if no profile exists
if (import.meta.env.DEV) console.log('[DashboardPage] No profile found, using auth metadata');
        const metadata = authUser.user_metadata || {};
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          first_name: metadata.first_name || metadata.name?.split(' ')[0] || 'User',
          last_name: metadata.last_name || metadata.name?.split(' ').slice(1).join(' ') || '',
          role: metadata.role || 'jobseeker',
          organization_name: metadata.organization_name,
          organization_type: metadata.organization_type,
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      // If there's an error (e.g., users table doesn't exist), use auth metadata
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const metadata = authUser.user_metadata || {};
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            first_name: metadata.first_name || metadata.name?.split(' ')[0] || 'User',
            last_name: metadata.last_name || metadata.name?.split(' ').slice(1).join(' ') || '',
            role: metadata.role || 'jobseeker',
          });
        }
      } catch {
        // Auth error, will show session expired
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session Expired</h2>
          <p className="text-gray-400 mb-6">Please sign in again to continue.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-xl">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
if (import.meta.env.DEV) console.log('[DashboardPage] Routing based on role:', user.role);

  switch (user.role) {
    case 'admin':
    case 'super_admin':
    case 'SUPER_ADMIN':
    case 'PLATFORM_ADMIN':
      // Redirect admins to the admin dashboard
      navigate('/admin');
      return null;
    case 'intern':
    case 'learner':
      return <InternDashboard user={user} onSignOut={handleSignOut} />;
    case 'jobseeker':
    case 'job_seeker':
    case 'job seeker':
      return <JobSeekerDashboard user={user} onSignOut={handleSignOut} />;
    case 'educator':
    case 'education_provider':
      return <EducatorDashboard user={user} onSignOut={handleSignOut} />;
    case 'partner':
    case 'employer':
    case 'partner_federal':
    case 'partner_lab':
    case 'partner_industry':
    case 'partner_nonprofit':
    case 'partner_academic':
      return <PartnerDashboard user={user} onSignOut={handleSignOut} />;
    default:
if (import.meta.env.DEV) console.log('[DashboardPage] Unknown role, defaulting to JobSeeker:', user.role);
      return <JobSeekerDashboard user={user} onSignOut={handleSignOut} />;
  }
};

export default DashboardPage;
