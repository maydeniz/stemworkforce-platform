// ===========================================
// Employer Dashboard
// Recruiting & hiring focused dashboard for employers
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GraduationCap,
  BarChart3,
  Shield,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  DollarSign,
  UserPlus,
  Plus,
  Star,
  MapPin,
  Building2,
  Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Import Tab Components
import JobPostingsTab from './dashboard/JobPostingsTab';
import TalentPipelineTab from './dashboard/TalentPipelineTab';
import CampusRecruitingTab from './dashboard/CampusRecruitingTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import ClearancePipelineTab from './dashboard/ClearancePipelineTab';
import EventsTab from './dashboard/EventsTab';
import BillingTab from './dashboard/BillingTab';
import SettingsTab from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'jobs' | 'pipeline' | 'campus' | 'analytics' | 'clearance' | 'events' | 'billing' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'jobs', label: 'Job Postings', icon: Briefcase },
  { key: 'pipeline', label: 'Talent Pipeline', icon: Users },
  { key: 'campus', label: 'Campus Recruiting', icon: GraduationCap },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'clearance', label: 'Clearance Pipeline', icon: Shield },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_METRICS = {
  activeJobs: 34,
  totalPipeline: 2456,
  hiresYTD: 156,
  hiresGoal: 200,
  avgTimeToFill: 42,
  costPerHire: 4250,
  offerAcceptRate: 89,
  diversityScore: 72,
  activeInterns: 24,
  conversionRate: 78,
};

const FUNNEL_DATA = [
  { stage: 'Applied', count: 8923, color: '#6366F1' },
  { stage: 'Screened', count: 3456, color: '#8B5CF6' },
  { stage: 'Interview', count: 1234, color: '#A78BFA' },
  { stage: 'Offered', count: 312, color: '#C4B5FD' },
  { stage: 'Hired', count: 156, color: '#10B981' },
];

const HIRING_VELOCITY = [
  { month: 'Jul', hires: 12, goal: 17 },
  { month: 'Aug', hires: 18, goal: 17 },
  { month: 'Sep', hires: 15, goal: 17 },
  { month: 'Oct', hires: 22, goal: 17 },
  { month: 'Nov', hires: 19, goal: 17 },
  { month: 'Dec', hires: 14, goal: 17 },
  { month: 'Jan', hires: 21, goal: 17 },
  { month: 'Feb', hires: 25, goal: 17 },
  { month: 'Mar', hires: 28, goal: 17 },
];

const SOURCE_DATA = [
  { name: 'Platform', value: 35, color: '#10B981' },
  { name: 'Career Fairs', value: 22, color: '#6366F1' },
  { name: 'University', value: 18, color: '#F59E0B' },
  { name: 'Referrals', value: 15, color: '#EC4899' },
  { name: 'Direct', value: 10, color: '#8B5CF6' },
];

const TOP_JOBS = [
  { title: 'Senior AI/ML Engineer', location: 'San Francisco, CA', applicants: 234, clearance: 'None', status: 'active', daysOpen: 12, match: 94 },
  { title: 'Cybersecurity Analyst', location: 'Arlington, VA', applicants: 189, clearance: 'Secret', status: 'active', daysOpen: 8, match: 91 },
  { title: 'Nuclear Engineer', location: 'Idaho Falls, ID', applicants: 67, clearance: 'Q Clearance', status: 'active', daysOpen: 23, match: 88 },
  { title: 'Quantum Computing Researcher', location: 'Boulder, CO', applicants: 45, clearance: 'Top Secret', status: 'active', daysOpen: 5, match: 96 },
  { title: 'Semiconductor Process Engineer', location: 'Austin, TX', applicants: 156, clearance: 'None', status: 'active', daysOpen: 15, match: 87 },
];

const TOP_CANDIDATES = [
  { name: 'Dr. Sarah Kim', role: 'AI/ML Engineer', university: 'MIT', gpa: 3.9, skills: ['PyTorch', 'LLMs', 'Computer Vision'], stage: 'Interview', match: 97, clearance: 'None' },
  { name: 'James Rodriguez', role: 'Cybersecurity Analyst', university: 'Georgia Tech', gpa: 3.7, skills: ['SIEM', 'Penetration Testing', 'Zero Trust'], stage: 'Offered', match: 94, clearance: 'Secret' },
  { name: 'Emily Chen', role: 'Quantum Researcher', university: 'Caltech', gpa: 3.95, skills: ['Qiskit', 'Quantum Error Correction', 'Python'], stage: 'Screening', match: 92, clearance: 'None' },
  { name: 'Michael Okafor', role: 'Nuclear Engineer', university: 'Penn State', gpa: 3.8, skills: ['Reactor Design', 'MCNP', 'Safety Analysis'], stage: 'Interview', match: 91, clearance: 'L Clearance' },
  { name: 'Priya Patel', role: 'Semiconductor Engineer', university: 'Stanford', gpa: 3.85, skills: ['VLSI', 'Process Development', 'Cleanroom Ops'], stage: 'New', match: 89, clearance: 'None' },
];

const UPCOMING_EVENTS = [
  { name: 'MIT Fall Career Fair', date: 'Mar 15, 2025', type: 'Career Fair', registrations: 450, location: 'Cambridge, MA' },
  { name: 'Cybersecurity Hiring Day', date: 'Mar 22, 2025', type: 'Hiring Event', registrations: 120, location: 'Virtual' },
  { name: 'DOE National Lab Recruiting', date: 'Apr 5, 2025', type: 'Partner Event', registrations: 85, location: 'Oak Ridge, TN' },
];

// ===========================================
// OVERVIEW TAB
// ===========================================

const OverviewTab: React.FC<{ onTabChange: (tab: TabKey) => void }> = ({ onTabChange }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-sm">Active Jobs</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.activeJobs}</div>
          <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 8 new this month
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Talent Pipeline</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.totalPipeline.toLocaleString()}</div>
          <div className="text-sm text-blue-400 mt-1 flex items-center gap-1">
            <UserPlus className="w-3 h-3" /> +312 this week
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Hires YTD</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.hiresYTD}</div>
          <div className="text-sm text-purple-400 mt-1">{Math.round((SAMPLE_METRICS.hiresYTD / SAMPLE_METRICS.hiresGoal) * 100)}% of annual goal</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-gray-400 text-sm">Avg Time-to-Fill</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.avgTimeToFill}<span className="text-lg text-gray-400"> days</span></div>
          <div className="text-sm text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -5 days vs Q3
          </div>
        </motion.div>
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-gray-400 text-sm">Cost per Hire</span>
          </div>
          <div className="text-3xl font-bold text-white">${SAMPLE_METRICS.costPerHire.toLocaleString()}</div>
          <div className="text-sm text-emerald-400 mt-1">12% below industry avg</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-sm">Offer Accept Rate</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.offerAcceptRate}%</div>
          <div className="text-sm text-emerald-400 mt-1">+4% vs last quarter</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-gray-400 text-sm">Active Interns</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.activeInterns}</div>
          <div className="text-sm text-cyan-400 mt-1">{SAMPLE_METRICS.conversionRate}% conversion rate</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-gray-400 text-sm">Diversity Score</span>
          </div>
          <div className="text-3xl font-bold text-white">{SAMPLE_METRICS.diversityScore}<span className="text-lg text-gray-400">/100</span></div>
          <div className="text-sm text-violet-400 mt-1">Above industry benchmark</div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Application Funnel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={FUNNEL_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [value.toLocaleString(), 'Candidates']}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {FUNNEL_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hiring Velocity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hiring Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={HIRING_VELOCITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="hires" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} name="Hires" />
              <Line type="monotone" dataKey="goal" stroke="#6366F1" strokeDasharray="5 5" strokeWidth={1.5} name="Goal" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Source Distribution + Top Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hire Source */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Hire Sources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {SOURCE_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(value: number) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SOURCE_DATA.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-gray-400">{source.name}</span>
                </div>
                <span className="text-white font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Candidates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top Candidates</h3>
            <button onClick={() => onTabChange('pipeline')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {TOP_CANDIDATES.map((candidate, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{candidate.name}</div>
                    <div className="text-gray-400 text-xs">{candidate.role} &middot; {candidate.university}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {candidate.clearance !== 'None' && (
                    <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{candidate.clearance}</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    candidate.stage === 'Offered' ? 'bg-emerald-500/20 text-emerald-400' :
                    candidate.stage === 'Interview' ? 'bg-blue-500/20 text-blue-400' :
                    candidate.stage === 'Screening' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {candidate.stage}
                  </span>
                  <div className="text-right">
                    <div className="text-emerald-400 text-sm font-bold">{candidate.match}%</div>
                    <div className="text-gray-500 text-[10px]">match</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Jobs + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Job Postings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top Job Postings</h3>
            <button onClick={() => onTabChange('jobs')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {TOP_JOBS.slice(0, 4).map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="text-white font-medium text-sm">{job.title}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  {job.clearance !== 'None' && (
                    <span className="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{job.clearance}</span>
                  )}
                  <div>
                    <div className="text-white text-sm font-medium">{job.applicants}</div>
                    <div className="text-gray-500 text-[10px]">applicants</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <button onClick={() => onTabChange('events')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((event, i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium text-sm">{event.name}</div>
                  <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{event.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.registrations} registered</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onTabChange('events')} className="w-full mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium py-2.5 rounded-lg transition-colors text-sm">
            View All Events
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/demo');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onTabChange={setActiveTab} />;
      case 'jobs':
        return <JobPostingsTab />;
      case 'pipeline':
        return <TalentPipelineTab />;
      case 'campus':
        return <CampusRecruitingTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'clearance':
        return <ClearancePipelineTab />;
      case 'events':
        return <EventsTab />;
      case 'billing':
        return <BillingTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Company Header */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Nexus Technologies</div>
              <div className="text-gray-400 text-xs">Enterprise Plan</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{TABS.find(t => t.key === activeTab)?.label}</h1>
              <p className="text-sm text-gray-400">Nexus Technologies &middot; Employer Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPostJobModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Post Job
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 pb-24">
          {renderTabContent()}
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPostJobModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">Post New Job</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Title</label>
                <input type="text" placeholder="e.g. Senior AI/ML Engineer" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Department</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                    <option>Research & Development</option>
                    <option>Security Operations</option>
                    <option>Energy Division</option>
                    <option>Advanced Computing</option>
                    <option>Manufacturing</option>
                    <option>Defense Programs</option>
                    <option>Analytics</option>
                    <option>Automation</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Job Type</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Location</label>
                  <input type="text" placeholder="e.g. San Francisco, CA" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Salary Range</label>
                  <input type="text" placeholder="e.g. $150,000 - $200,000" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Clearance Required</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                  <option>None</option>
                  <option>Public Trust</option>
                  <option>Secret</option>
                  <option>Top Secret</option>
                  <option>Top Secret/SCI</option>
                  <option>Q Clearance (DOE)</option>
                  <option>L Clearance (DOE)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Description</label>
                <textarea rows={4} placeholder="Describe the role, responsibilities, and requirements..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Required Skills (comma separated)</label>
                <input type="text" placeholder="e.g. Python, PyTorch, Machine Learning" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured-job" className="rounded border-gray-700 bg-gray-800 text-emerald-500" />
                <label htmlFor="featured-job" className="text-sm text-gray-300">Feature this job posting (priority placement)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPostJobModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => setShowPostJobModal(false)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">Publish Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
