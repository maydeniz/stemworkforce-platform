// ===========================================
// DASHBOARD PAGE - Role-Based Dashboards
// Supports: Intern, JobSeeker, Educator, Partner
// ===========================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
  'nonprofit': { name: 'Non-Profit Organization', icon: '💚', color: '#06b6d4' }
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

        {activeTab !== 'overview' && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">{sidebarItems.find(i => i.id === activeTab)?.icon}</span>
            <h2 className="text-2xl font-semibold text-white mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-400">This section is coming soon.</p>
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
                    { title: 'Quantum Computing Workshop', date: 'Feb 1, 2025', type: 'Hybrid' }
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
          </>
        )}

        {activeTab !== 'overview' && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">{sidebarItems.find(i => i.id === activeTab)?.icon}</span>
            <h2 className="text-2xl font-semibold text-white mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-400">This section is coming soon.</p>
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

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'programs', icon: '📚', label: 'Programs', badge: 12 },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'outcomes', icon: '📈', label: 'Outcomes' },
    { id: 'employers', icon: '🏢', label: 'Employer Partners' },
    { id: 'events', icon: '📅', label: 'Events' },
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
              <button className="px-5 py-2.5 bg-yellow-500 text-gray-900 font-semibold rounded-xl">
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
                    { name: 'Quantum Computing Fundamentals', status: 'Pending', enrolled: 45 }
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

        {activeTab !== 'overview' && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">{sidebarItems.find(i => i.id === activeTab)?.icon}</span>
            <h2 className="text-2xl font-semibold text-white mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-400">This section is coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================
// PARTNER/EMPLOYER DASHBOARD
// ============================================
const PartnerDashboard: React.FC<{ user: UserProfile; onSignOut: () => void }> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPostModal, setShowPostModal] = useState(false);

  const orgType = user.organization_type || 'private';
  const currentOrg = orgTypes[orgType as keyof typeof orgTypes] || orgTypes.private;

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'postings', icon: '📋', label: 'Job Postings', badge: 8 },
    { id: 'applicants', icon: '👥', label: 'Applicants', badge: 156 },
    { id: 'pipeline', icon: '🔄', label: 'Hiring Pipeline' },
    { id: 'compliance', icon: '⚖️', label: 'Compliance' },
    { id: 'events', icon: '📅', label: 'Events & Sponsorship' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'branding', icon: '🏢', label: 'Employer Branding' },
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
                <h1 className="text-2xl font-bold text-white mb-1">Partner Dashboard</h1>
                <p className="text-gray-400">Manage postings, review applicants, and track hiring pipeline</p>
              </div>
              <button 
                onClick={() => setShowPostModal(true)}
                className="px-5 py-2.5 font-semibold rounded-xl"
                style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
              >
                + Post Opportunity
              </button>
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

        {activeTab !== 'overview' && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">{sidebarItems.find(i => i.id === activeTab)?.icon}</span>
            <h2 className="text-2xl font-semibold text-white mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-400">This section is coming soon.</p>
          </div>
        )}
      </main>

      {/* Post Opportunity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-2xl bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Post New Opportunity</h2>
                <p className="text-sm text-gray-400 mt-1">Create a job or internship posting</p>
              </div>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Job Title *</label>
                <input type="text" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="e.g., Senior AI Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type *</label>
                  <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Clearance Level *</label>
                  <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                    <option>None Required</option>
                    <option>Public Trust</option>
                    <option>Secret</option>
                    <option>Top Secret</option>
                    <option>TS/SCI</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description *</label>
                <textarea className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white h-24 resize-none" placeholder="Describe the role..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setShowPostModal(false)} className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl">Cancel</button>
              <button 
                className="px-5 py-2.5 rounded-xl font-semibold"
                style={{ backgroundColor: currentOrg.color, color: '#0a0a0b' }}
              >
                Publish Opportunity
              </button>
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

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (profile) {
        setUser(profile as UserProfile);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
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
  switch (user.role) {
    case 'intern':
    case 'learner':
      return <InternDashboard user={user} onSignOut={handleSignOut} />;
    case 'jobseeker':
    case 'job_seeker':
      return <JobSeekerDashboard user={user} onSignOut={handleSignOut} />;
    case 'educator':
    case 'education_provider':
      return <EducatorDashboard user={user} onSignOut={handleSignOut} />;
    case 'partner':
    case 'employer':
      return <PartnerDashboard user={user} onSignOut={handleSignOut} />;
    default:
      return <JobSeekerDashboard user={user} onSignOut={handleSignOut} />;
  }
};

export default DashboardPage;
