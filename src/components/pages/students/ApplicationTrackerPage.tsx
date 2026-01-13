// ===========================================
// Application Tracker Page
// ===========================================
// Smart deadline management and progress tracking
// for college applications with strategic planning
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types
interface Application {
  id: string;
  school: string;
  location: string;
  type: 'EA' | 'ED' | 'ED2' | 'REA' | 'RD';
  deadline: string;
  tier: 'reach' | 'match' | 'safety';
  status: 'not-started' | 'in-progress' | 'submitted' | 'complete';
  requirements: Requirement[];
  notes?: string;
}

interface Requirement {
  id: string;
  category: 'essay' | 'test' | 'transcript' | 'recommendation' | 'financial' | 'supplement' | 'interview';
  title: string;
  status: 'pending' | 'in-progress' | 'submitted' | 'received';
  dueDate?: string;
  notes?: string;
}

// Sample Data
const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: '1',
    school: 'MIT',
    location: 'Cambridge, MA',
    type: 'EA',
    deadline: '2026-01-01',
    tier: 'reach',
    status: 'in-progress',
    requirements: [
      { id: 'r1', category: 'essay', title: 'Common App Personal Statement', status: 'submitted' },
      { id: 'r2', category: 'essay', title: 'Essay 1: We are looking for...', status: 'submitted' },
      { id: 'r3', category: 'essay', title: 'Essay 2: Department interest', status: 'submitted' },
      { id: 'r4', category: 'essay', title: 'Essay 3: World you come from', status: 'in-progress' },
      { id: 'r5', category: 'recommendation', title: 'Teacher Rec #1 (Dr. Patterson)', status: 'received' },
      { id: 'r6', category: 'recommendation', title: 'Teacher Rec #2 (Ms. Okonkwo)', status: 'pending' },
      { id: 'r7', category: 'recommendation', title: 'Counselor Recommendation', status: 'received' },
      { id: 'r8', category: 'transcript', title: 'High School Transcript', status: 'submitted' },
      { id: 'r9', category: 'test', title: 'SAT/ACT Scores', status: 'submitted' },
      { id: 'r10', category: 'interview', title: 'Alumni Interview', status: 'pending' },
    ],
  },
  {
    id: '2',
    school: 'Stanford',
    location: 'Stanford, CA',
    type: 'REA',
    deadline: '2025-11-01',
    tier: 'reach',
    status: 'submitted',
    requirements: [
      { id: 'r1', category: 'essay', title: 'Common App Personal Statement', status: 'submitted' },
      { id: 'r2', category: 'supplement', title: 'Stanford Supplement Essays (3)', status: 'submitted' },
      { id: 'r3', category: 'recommendation', title: 'Teacher Rec #1', status: 'received' },
      { id: 'r4', category: 'recommendation', title: 'Teacher Rec #2', status: 'received' },
      { id: 'r5', category: 'transcript', title: 'Transcript', status: 'submitted' },
    ],
  },
  {
    id: '3',
    school: 'Georgia Tech',
    location: 'Atlanta, GA',
    type: 'EA',
    deadline: '2025-10-15',
    tier: 'match',
    status: 'submitted',
    requirements: [
      { id: 'r1', category: 'essay', title: 'Common App Essay', status: 'submitted' },
      { id: 'r2', category: 'supplement', title: 'Why Georgia Tech Essay', status: 'submitted' },
    ],
  },
  {
    id: '4',
    school: 'UC Berkeley',
    location: 'Berkeley, CA',
    type: 'RD',
    deadline: '2025-11-30',
    tier: 'reach',
    status: 'in-progress',
    requirements: [
      { id: 'r1', category: 'essay', title: 'UC PIQ #1', status: 'in-progress' },
      { id: 'r2', category: 'essay', title: 'UC PIQ #2', status: 'pending' },
      { id: 'r3', category: 'essay', title: 'UC PIQ #3', status: 'pending' },
      { id: 'r4', category: 'essay', title: 'UC PIQ #4', status: 'pending' },
    ],
  },
  {
    id: '5',
    school: 'CMU',
    location: 'Pittsburgh, PA',
    type: 'RD',
    deadline: '2026-01-03',
    tier: 'reach',
    status: 'not-started',
    requirements: [
      { id: 'r1', category: 'essay', title: 'Common App Essay', status: 'pending' },
      { id: 'r2', category: 'supplement', title: 'CMU Supplemental Essays', status: 'pending' },
    ],
  },
];

// Main Component
const ApplicationTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'detail'>('dashboard');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter(a => a.status === 'submitted' || a.status === 'complete').length;
    const inProgress = applications.filter(a => a.status === 'in-progress').length;
    const reach = applications.filter(a => a.tier === 'reach').length;
    const match = applications.filter(a => a.tier === 'match').length;
    const safety = applications.filter(a => a.tier === 'safety').length;

    return { total, submitted, inProgress, reach, match, safety };
  }, [applications]);

  // Get upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    return applications
      .filter(a => a.status !== 'submitted' && a.status !== 'complete')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [applications]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-blue-400">Application Tracker</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
                <span>📋</span>
                <span>Application Support</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tracker</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Manage deadlines, track progress, and stay organized across all your college applications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>+</span>
                Add School
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* View Toggle */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'calendar', label: 'Calendar', icon: '📅' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => {
                    setActiveView(view.id as typeof activeView);
                    setSelectedApp(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeView === view.id && !selectedApp
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedApp ? (
            <ApplicationDetail
              application={selectedApp}
              onBack={() => setSelectedApp(null)}
              onUpdate={(updated) => {
                setApplications(applications.map(a => a.id === updated.id ? updated : a));
                setSelectedApp(updated);
              }}
            />
          ) : activeView === 'dashboard' ? (
            <DashboardView
              applications={applications}
              stats={stats}
              upcomingDeadlines={upcomingDeadlines}
              onSelectApp={setSelectedApp}
              onAddSchool={() => setShowAddModal(true)}
            />
          ) : (
            <CalendarView
              applications={applications}
              onSelectApp={setSelectedApp}
            />
          )}
        </div>
      </section>

      {/* Add School Modal */}
      {showAddModal && (
        <AddSchoolModal
          onClose={() => setShowAddModal(false)}
          onAdd={(app) => {
            setApplications([...applications, app]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// ===========================================
// Dashboard View
// ===========================================
const DashboardView: React.FC<{
  applications: Application[];
  stats: {
    total: number;
    submitted: number;
    inProgress: number;
    reach: number;
    match: number;
    safety: number;
  };
  upcomingDeadlines: Application[];
  onSelectApp: (app: Application) => void;
  onAddSchool: () => void;
}> = ({ applications, stats, upcomingDeadlines, onSelectApp, onAddSchool }) => {
  const getDaysUntil = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-8">
      {/* Priority This Week */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/20">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚡</span>
            Priority This Week
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.slice(0, 3).map((app) => {
              const days = getDaysUntil(app.deadline);
              const pendingItems = app.requirements.filter(r => r.status !== 'submitted' && r.status !== 'received');

              return (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      days <= 3 ? 'bg-red-500' : days <= 7 ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <div className="font-medium text-white">{app.school} {app.type}</div>
                      <div className="text-sm text-gray-400">
                        {pendingItems.length} items remaining
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      days <= 3 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      {days} days
                    </div>
                    <button
                      onClick={() => onSelectApp(app)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Total Schools</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Submitted</div>
          <div className="text-3xl font-bold text-emerald-400">{stats.submitted}</div>
        </div>
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-amber-400">{stats.inProgress}</div>
        </div>
        <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-400">{stats.reach}R</span>
            <span className="text-gray-500">/</span>
            <span className="text-amber-400">{stats.match}M</span>
            <span className="text-gray-500">/</span>
            <span className="text-emerald-400">{stats.safety}S</span>
          </div>
        </div>
      </div>

      {/* Balance Warning */}
      {stats.safety === 0 && stats.total > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-400">⚠️</span>
            <div>
              <h4 className="font-medium text-white mb-1">No Safety Schools</h4>
              <p className="text-sm text-gray-400">
                Your list has no safety schools. Consider adding at least 2 schools where your stats
                are above the 75th percentile of admitted students.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All Schools</h2>
          <button
            onClick={onAddSchool}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <span>+</span>
            Add School
          </button>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow key={app.id} application={app} onClick={() => onSelectApp(app)} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Application Row
// ===========================================
const ApplicationRow: React.FC<{
  application: Application;
  onClick: () => void;
}> = ({ application: app, onClick }) => {
  const completedReqs = app.requirements.filter(r => r.status === 'submitted' || r.status === 'received').length;
  const totalReqs = app.requirements.length;
  const progress = totalReqs > 0 ? (completedReqs / totalReqs) * 100 : 0;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'reach': return 'bg-red-500/20 text-red-400';
      case 'match': return 'bg-amber-500/20 text-amber-400';
      case 'safety': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'EA':
      case 'ED': return 'bg-violet-500/20 text-violet-400';
      case 'REA': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'complete': return 'text-emerald-400';
      case 'in-progress': return 'text-amber-400';
      default: return 'text-gray-500';
    }
  };

  const getDaysUntil = (date: string) => {
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const days = getDaysUntil(app.deadline);

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-blue-500/30 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadge(app.type)}`}>
              {app.type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${getTierBadge(app.tier)}`}>
              {app.tier}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
              {app.school}
            </h3>
            <p className="text-sm text-gray-500">{app.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress */}
          <div className="hidden sm:block w-32">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">{completedReqs}/{totalReqs}</span>
              <span className={getStatusColor(app.status)}>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  app.status === 'submitted' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="text-right">
            <div className={`text-sm font-medium ${
              app.status === 'submitted' ? 'text-emerald-400' :
              days <= 3 ? 'text-red-400' :
              days <= 7 ? 'text-amber-400' : 'text-gray-400'
            }`}>
              {app.status === 'submitted' ? 'Submitted' : `${days}d left`}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(app.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>

          <span className="text-gray-600 group-hover:text-gray-400">→</span>
        </div>
      </div>
    </button>
  );
};

// ===========================================
// Calendar View
// ===========================================
const CalendarView: React.FC<{
  applications: Application[];
  onSelectApp: (app: Application) => void;
}> = ({ applications, onSelectApp }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const getApplicationsForDay = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString().split('T')[0];
    return applications.filter(a => a.deadline === dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before first of month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-3 min-h-[100px] border-b border-r border-white/5 bg-gray-900/30" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const apps = getApplicationsForDay(day);
            const isToday = new Date().toDateString() ===
              new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

            return (
              <div
                key={day}
                className={`p-2 min-h-[100px] border-b border-r border-white/5 ${
                  isToday ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className={`text-sm mb-2 ${isToday ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => onSelectApp(app)}
                      className={`w-full text-left px-2 py-1 rounded text-xs truncate ${
                        app.status === 'submitted'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : app.type === 'EA' || app.type === 'ED'
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {app.school} {app.type}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-violet-500/40" />
          <span className="text-gray-400">EA/ED Deadlines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/40" />
          <span className="text-gray-400">RD Deadlines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/40" />
          <span className="text-gray-400">Submitted</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// Application Detail
// ===========================================
const ApplicationDetail: React.FC<{
  application: Application;
  onBack: () => void;
  onUpdate: (app: Application) => void;
}> = ({ application: app, onBack, onUpdate }) => {
  const toggleRequirement = (reqId: string) => {
    const updatedReqs = app.requirements.map(r => {
      if (r.id === reqId) {
        const newStatus = r.status === 'submitted' || r.status === 'received' ? 'pending' : 'submitted';
        return { ...r, status: newStatus as Requirement['status'] };
      }
      return r;
    });
    onUpdate({ ...app, requirements: updatedReqs });
  };

  const groupedReqs = {
    essays: app.requirements.filter(r => r.category === 'essay' || r.category === 'supplement'),
    recommendations: app.requirements.filter(r => r.category === 'recommendation'),
    documents: app.requirements.filter(r => r.category === 'test' || r.category === 'transcript' || r.category === 'financial'),
    other: app.requirements.filter(r => r.category === 'interview'),
  };

  const completedReqs = app.requirements.filter(r => r.status === 'submitted' || r.status === 'received').length;
  const progress = (completedReqs / app.requirements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{app.school}</h2>
            <p className="text-sm text-gray-400">{app.location} • {app.type}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Deadline</div>
          <div className="text-lg font-semibold text-white">
            {new Date(app.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Overall Progress</h3>
          <span className="text-2xl font-bold text-blue-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-gray-400">Essays</div>
            <div className="font-medium text-white">
              {groupedReqs.essays.filter(r => r.status === 'submitted').length}/{groupedReqs.essays.length}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Recs</div>
            <div className="font-medium text-white">
              {groupedReqs.recommendations.filter(r => r.status === 'received').length}/{groupedReqs.recommendations.length}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Documents</div>
            <div className="font-medium text-white">
              {groupedReqs.documents.filter(r => r.status === 'submitted').length}/{groupedReqs.documents.length}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Other</div>
            <div className="font-medium text-white">
              {groupedReqs.other.filter(r => r.status === 'submitted' || r.status === 'received').length}/{groupedReqs.other.length}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Essays */}
        <RequirementSection
          title="Essays & Supplements"
          icon="✍️"
          requirements={groupedReqs.essays}
          onToggle={toggleRequirement}
        />

        {/* Recommendations */}
        <RequirementSection
          title="Recommendations"
          icon="📝"
          requirements={groupedReqs.recommendations}
          onToggle={toggleRequirement}
        />

        {/* Documents */}
        <RequirementSection
          title="Tests & Documents"
          icon="📄"
          requirements={groupedReqs.documents}
          onToggle={toggleRequirement}
        />

        {/* Other */}
        {groupedReqs.other.length > 0 && (
          <RequirementSection
            title="Interviews & Other"
            icon="🎤"
            requirements={groupedReqs.other}
            onToggle={toggleRequirement}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {app.status !== 'submitted' && (
          <button
            onClick={() => onUpdate({ ...app, status: 'submitted' })}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
          >
            Mark as Submitted
          </button>
        )}
        <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all">
          Edit School Info
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Requirement Section
// ===========================================
const RequirementSection: React.FC<{
  title: string;
  icon: string;
  requirements: Requirement[];
  onToggle: (id: string) => void;
}> = ({ title, icon, requirements, onToggle }) => {
  if (requirements.length === 0) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'received': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-800/50 text-gray-400 border-white/5';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
      <h4 className="font-medium text-white mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h4>
      <div className="space-y-2">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`p-3 rounded-lg border transition-all ${getStatusStyle(req.status)}`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={req.status === 'submitted' || req.status === 'received'}
                onChange={() => onToggle(req.id)}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="flex-1 text-sm">{req.title}</span>
              <span className="text-xs capitalize opacity-70">{req.status}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===========================================
// Add School Modal
// ===========================================
const AddSchoolModal: React.FC<{
  onClose: () => void;
  onAdd: (app: Application) => void;
}> = ({ onClose, onAdd }) => {
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Application['type']>('RD');
  const [tier, setTier] = useState<Application['tier']>('match');
  const [deadline, setDeadline] = useState('');

  const handleAdd = () => {
    const newApp: Application = {
      id: Date.now().toString(),
      school,
      location,
      type,
      tier,
      deadline,
      status: 'not-started',
      requirements: [
        { id: 'r1', category: 'essay', title: 'Common App Personal Statement', status: 'pending' },
        { id: 'r2', category: 'supplement', title: `${school} Supplemental Essays`, status: 'pending' },
        { id: 'r3', category: 'recommendation', title: 'Teacher Recommendation #1', status: 'pending' },
        { id: 'r4', category: 'recommendation', title: 'Teacher Recommendation #2', status: 'pending' },
        { id: 'r5', category: 'recommendation', title: 'Counselor Recommendation', status: 'pending' },
        { id: 'r6', category: 'transcript', title: 'High School Transcript', status: 'pending' },
        { id: 'r7', category: 'test', title: 'Test Scores (SAT/ACT)', status: 'pending' },
      ],
    };
    onAdd(newApp);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add School</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">School Name</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., MIT, Stanford, Georgia Tech"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Cambridge, MA"
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Application Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Application['type'])}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="EA">Early Action (EA)</option>
                <option value="ED">Early Decision (ED)</option>
                <option value="ED2">Early Decision II (ED2)</option>
                <option value="REA">Restrictive EA (REA)</option>
                <option value="RD">Regular Decision (RD)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">School Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Application['tier'])}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="reach">Reach</option>
                <option value="match">Match</option>
                <option value="safety">Safety</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!school || !deadline}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50"
          >
            Add School
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackerPage;
