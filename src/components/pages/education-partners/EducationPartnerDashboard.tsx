// ===========================================
// Education Partner Dashboard
// Main dashboard for approved education partners
// ===========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  CreditCard,
  Plus,
  GraduationCap,
  Target,
  Search,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getPartnerPrograms, type PartnerProgram } from '@/services/educationPartnerApi';
import { PRICING_TIERS, type PartnerSubscription } from '@/services/partnerBillingService';

// Import Tab Components
import ProgramsTab from './dashboard/ProgramsTab';
import EmployerNetworkTab from './dashboard/EmployerNetworkTab';
import EventsTab from './dashboard/EventsTab';
import OutcomesTab from './dashboard/OutcomesTab';
import BillingTab from './dashboard/BillingTab';
import SettingsTabComponent from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

interface PartnerStats {
  totalPrograms: number;
  activePrograms: number;
  totalStudentsReached: number;
  employerConnections: number;
  upcomingEvents: number;
  placementRate: number;
}

interface EmployerConnection {
  id: string;
  name: string;
  type: string;
  studentsPlaced: number;
  lastActivity: string;
}

interface PartnerEventBasic {
  id: string;
  title: string;
  type: string;
  date: string;
  format: string;
  registrations: number;
  status: 'draft' | 'published' | 'completed';
}

interface PartnerInfo {
  id: string;
  name: string;
  tier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'pending' | 'suspended';
}

// ===========================================
// SAMPLE DATA (Replace with API calls)
// ===========================================

const SAMPLE_STATS: PartnerStats = {
  totalPrograms: 8,
  activePrograms: 6,
  totalStudentsReached: 2450,
  employerConnections: 45,
  upcomingEvents: 3,
  placementRate: 89
};

const SAMPLE_EMPLOYERS: EmployerConnection[] = [
  { id: '1', name: 'Intel Corporation', type: 'Hiring Partner', studentsPlaced: 23, lastActivity: '2 days ago' },
  { id: '2', name: 'Lockheed Martin', type: 'Internship Provider', studentsPlaced: 18, lastActivity: '1 week ago' },
  { id: '3', name: 'Google', type: 'Hiring Partner', studentsPlaced: 15, lastActivity: '3 days ago' },
  { id: '4', name: 'AWS', type: 'Advisory Board', studentsPlaced: 8, lastActivity: '2 weeks ago' },
];

const SAMPLE_EVENTS: PartnerEventBasic[] = [
  { id: '1', title: 'Spring Career Fair 2025', type: 'Career Fair', date: 'Mar 15, 2025', format: 'In-Person', registrations: 45, status: 'published' },
  { id: '2', title: 'AI Industry Panel', type: 'Panel Discussion', date: 'Feb 20, 2025', format: 'Virtual', registrations: 120, status: 'published' },
  { id: '3', title: 'Internship Info Session', type: 'Info Session', date: 'Feb 10, 2025', format: 'Hybrid', registrations: 0, status: 'draft' },
];

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  stats: PartnerStats;
  programs: PartnerProgram[];
  employers: EmployerConnection[];
  events: PartnerEventBasic[];
  onTabChange: (tab: TabKey) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, programs, employers, events, onTabChange }) => {
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const statCards = [
    { label: 'Active Programs', value: stats.activePrograms, total: stats.totalPrograms, icon: BookOpen, color: 'indigo' },
    { label: 'Students Reached', value: stats.totalStudentsReached.toLocaleString(), icon: GraduationCap, color: 'emerald' },
    { label: 'Employer Partners', value: stats.employerConnections, icon: Building2, color: 'blue' },
    { label: 'Placement Rate', value: `${stats.placementRate}%`, icon: Target, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${
                stat.color === 'indigo' ? 'bg-indigo-500/20' :
                stat.color === 'emerald' ? 'bg-emerald-500/20' :
                stat.color === 'blue' ? 'bg-blue-500/20' :
                'bg-amber-500/20'
              }`}>
                <stat.icon size={20} className={`${
                  stat.color === 'indigo' ? 'text-indigo-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-amber-400'
                }`} />
              </div>
              {stat.total && (
                <span className="text-sm text-gray-400">
                  of {stat.total}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Your Programs</h3>
            <button
              onClick={() => onTabChange('programs')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {programs.slice(0, 3).map((program) => (
              <div key={program.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{program.name}</p>
                  <p className="text-sm text-gray-400">{program.programType} • {program.format}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    program.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : program.status === 'draft'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {program.status}
                  </span>
                </div>
              </div>
            ))}
            {programs.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No programs yet. Add your first program!
              </div>
            )}
          </div>
          <button
            onClick={() => onTabChange('programs')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Program
          </button>
        </div>

        {/* Employer Connections */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Employer Partners</h3>
            <button
              onClick={() => onTabChange('employers')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {employers.slice(0, 3).map((employer) => (
              <div key={employer.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{employer.name}</p>
                    <p className="text-sm text-gray-400">{employer.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-400">{employer.studentsPlaced} placed</p>
                  <p className="text-xs text-gray-500">{employer.lastActivity}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onTabChange('employers')}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Employer Network
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Upcoming Events</h3>
          <button
            onClick={() => onTabChange('events')}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  event.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {event.status}
                </span>
                <span className="text-xs text-gray-400">{event.format}</span>
              </div>
              <h4 className="font-medium text-white mb-1">{event.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{event.type} • {event.date}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{event.registrations} registrations</span>
                <button onClick={() => setEditEventId(event.id)} className="text-indigo-400 hover:text-indigo-300">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onTabChange('events')}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Edit Event Modal */}
      {editEventId && (() => {
        const event = events.find(e => e.id === editEventId);
        if (!event) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditEventId(null)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Edit Event</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">{event.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">{event.type}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Format</label>
                    <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">{event.format}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">{event.date}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white capitalize">{event.status}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">To make full edits, go to the Events tab.</p>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditEventId(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
                <button onClick={() => { setEditEventId(null); onTabChange('events'); }} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">Go to Events Tab</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ===========================================
// EXTENDED PARTNER DATA (for settings)
// ===========================================

interface ExtendedPartnerData {
  institutionName: string;
  institutionType?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  logoUrl?: string;
}

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

type TabKey = 'overview' | 'programs' | 'employers' | 'events' | 'outcomes' | 'billing' | 'settings';

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'programs', label: 'Programs', icon: BookOpen },
  { key: 'employers', label: 'Employers', icon: Building2 },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'outcomes', label: 'Outcomes', icon: BarChart3 },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const EducationPartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>({
    id: '',
    name: 'Your Institution',
    tier: 'starter',
    status: 'active'
  });
  const [extendedPartnerData, setExtendedPartnerData] = useState<ExtendedPartnerData | null>(null);
  const [programs, setPrograms] = useState<PartnerProgram[]>([]);
  const [stats, setStats] = useState<PartnerStats>(SAMPLE_STATS);
  const [employers] = useState<EmployerConnection[]>(SAMPLE_EMPLOYERS);
  const [events] = useState<PartnerEventBasic[]>(SAMPLE_EVENTS);

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Try to get partner info from education_partners table
        const { data: partner } = await supabase
          .from('education_partners')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (partner) {
          setPartnerInfo({
            id: partner.id,
            name: partner.institution_name || 'Your Institution',
            tier: partner.tier || 'starter',
            status: partner.status || 'active'
          });

          // Set extended data for settings
          setExtendedPartnerData({
            institutionName: partner.institution_name || '',
            institutionType: partner.institution_type,
            website: partner.website,
            email: partner.contact_email,
            phone: partner.contact_phone,
            address: partner.address,
            city: partner.city,
            state: partner.state,
            logoUrl: partner.logo_url
          });

          // Load programs
          const programsData = await getPartnerPrograms(partner.id);
          setPrograms(programsData);

          // Update stats with real program count
          setStats(prev => ({
            ...prev,
            totalPrograms: programsData.length,
            activePrograms: programsData.filter(p => p.status === 'active').length
          }));
        }
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      // Use sample data for demo
      setPartnerInfo({
        id: 'demo-partner',
        name: 'Demo Institution',
        tier: 'starter',
        status: 'active'
      });
      setExtendedPartnerData({
        institutionName: 'Demo Institution'
      });
    }
    setLoading(false);
  };

  const handleUpdatePartner = async (data: Partial<ExtendedPartnerData>) => {
    try {
      const { error: updateError } = await supabase
        .from('education_partners')
        .update({
          institution_name: data.institutionName,
          institution_type: data.institutionType,
          website: data.website,
          contact_email: data.email,
          contact_phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          logo_url: data.logoUrl
        })
        .eq('id', partnerInfo.id);

      if (updateError) throw updateError;

      // Update local state
      if (data.institutionName) {
        setPartnerInfo(prev => ({ ...prev, name: data.institutionName! }));
      }
      setExtendedPartnerData(prev => prev ? { ...prev, ...data } : data as ExtendedPartnerData);
    } catch (err) {
      throw err;
    }
  };

  // Get tier limits for feature gating
  const currentTier = PRICING_TIERS.find(t => t.id === partnerInfo.tier) || PRICING_TIERS[0];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse" />
              <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* Tab nav skeleton */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse mb-4" />
              <div className="h-8 w-24 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state with retry
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadPartnerData}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Partner Dashboard</h1>
              <p className="text-gray-400">{partnerInfo.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                partnerInfo.tier === 'enterprise'
                  ? 'bg-purple-500/20 text-purple-400'
                  : partnerInfo.tier === 'growth'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {partnerInfo.tier} Plan
              </span>
              <Link
                to="/education-partner-resources"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Resources
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            programs={programs}
            employers={employers}
            events={events}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'programs' && (
          <ProgramsTab
            partnerId={partnerInfo.id}
            subscription={{
              id: `${partnerInfo.id}-sub`,
              partnerId: partnerInfo.id,
              tierId: partnerInfo.tier,
              status: partnerInfo.status === 'active' ? 'active' : 'free'
            } as PartnerSubscription}
          />
        )}
        {activeTab === 'employers' && (
          <EmployerNetworkTab
            partnerId={partnerInfo.id}
            canAccessNetwork={true} // All tiers get basic network access
          />
        )}
        {activeTab === 'events' && (
          <EventsTab
            partnerId={partnerInfo.id}
            canHostEvents={currentTier.limits.canHostEvents}
          />
        )}
        {activeTab === 'outcomes' && (
          <OutcomesTab
            partnerId={partnerInfo.id}
            programs={programs.map(p => ({ id: p.id, name: p.name }))}
          />
        )}
        {activeTab === 'billing' && (
          <BillingTab
            partnerId={partnerInfo.id}
            currentTier={partnerInfo.tier}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTabComponent
            partnerId={partnerInfo.id}
            partnerData={extendedPartnerData}
            onUpdatePartner={handleUpdatePartner}
          />
        )}
      </div>
    </div>
  );
};

export default EducationPartnerDashboard;
