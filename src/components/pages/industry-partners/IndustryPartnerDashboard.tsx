// ===========================================
// Industry Partner Dashboard
// Main dashboard for approved industry partners
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GraduationCap,
  Calendar,
  Building2,
  Settings,
  CreditCard,
  TrendingUp,
  Target,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getIndustryPartner,
  getJobPostings,
  getCandidates,
  getWorkBasedPrograms,
  getRecruitingEvents,
  getRecruitingMetrics
} from '@/services/industryPartnerApi';
import type { IndustryPartner, JobPosting, Candidate, WorkBasedProgram, RecruitingEvent, RecruitingMetrics } from '@/types/industryPartner';

// Import Tab Components
import JobPostingsTab from './dashboard/JobPostingsTab';
import TalentPipelineTab from './dashboard/TalentPipelineTab';
import ProgramsTab from './dashboard/ProgramsTab';
import EventsTab from './dashboard/EventsTab';
import UniversityRelationsTab from './dashboard/UniversityRelationsTab';
import BillingTab from './dashboard/BillingTab';
import SettingsTab from './dashboard/SettingsTab';
import WorkforceMapWidget from '@/components/shared/WorkforceMapWidget';

// ===========================================
// TYPES
// ===========================================

type TabKey = 'overview' | 'jobs' | 'pipeline' | 'talentmap' | 'programs' | 'events' | 'universities' | 'billing' | 'settings';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

// ===========================================
// SAMPLE DATA (Fallback when DB is empty)
// ===========================================

const SAMPLE_METRICS: RecruitingMetrics = {
  totalCandidates: 2456,
  candidatesByStage: {
    new: 456, reviewed: 312, screened: 234, interviewing: 156,
    offered: 45, hired: 89, rejected: 234, withdrawn: 56
  },
  candidatesBySource: {
    platform: 890, career_fair: 456, university: 534,
    referral: 312, direct: 198, other: 66
  },
  activeJobPostings: 34,
  totalApplications: 8923,
  averageTimeToFill: 42,
  hiresYTD: 156,
  hiresVsGoal: 123,
  costPerHire: 1245,
  activeInterns: 24,
  conversionRate: 78,
  eventsAttended: 12,
  leadsFromEvents: 892,
  eventROI: 3.2
};

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  metrics: RecruitingMetrics;
  jobs: JobPosting[];
  candidates: Candidate[];
  programs: WorkBasedProgram[];
  events: RecruitingEvent[];
  onTabChange: (tab: TabKey) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  jobs,
  candidates,
  programs,
  events,
  onTabChange
}) => {
  const activeJobs = jobs.filter(j => j.status === 'active');
  const recentCandidates = candidates.slice(0, 5);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const activePrograms = programs.filter(p => ['recruiting', 'active'].includes(p.status));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-sm">Active Jobs</span>
          </div>
          <div className="text-3xl font-bold text-white">{activeJobs.length || metrics.activeJobPostings}</div>
          <div className="text-sm text-emerald-400 mt-1">Featured: {jobs.filter(j => j.featured).length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Pipeline</span>
          </div>
          <div className="text-3xl font-bold text-white">{candidates.length || metrics.totalCandidates}</div>
          <div className="text-sm text-blue-400 mt-1">+{metrics.candidatesByStage.new} new this month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Hired YTD</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.hiresYTD}</div>
          <div className="text-sm text-purple-400 mt-1">{metrics.hiresVsGoal}% of goal</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-gray-400 text-sm">Active Interns</span>
          </div>
          <div className="text-3xl font-bold text-white">{activePrograms.reduce((sum, p) => sum + p.filledPositions, 0) || metrics.activeInterns}</div>
          <div className="text-sm text-amber-400 mt-1">{metrics.conversionRate}% conversion</div>
        </motion.div>
      </div>

      {/* Application Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Application Funnel</h3>
          <button
            onClick={() => onTabChange('pipeline')}
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View Pipeline <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { stage: 'Total Applications', count: metrics.totalApplications, width: '100%', color: 'bg-gray-600' },
            { stage: 'Screened', count: metrics.candidatesByStage.screened, width: '45%', color: 'bg-blue-500' },
            { stage: 'Interviewing', count: metrics.candidatesByStage.interviewing, width: '25%', color: 'bg-purple-500' },
            { stage: 'Offered', count: metrics.candidatesByStage.offered, width: '8%', color: 'bg-amber-500' },
            { stage: 'Hired', count: metrics.hiresYTD, width: '5%', color: 'bg-emerald-500' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-32">{item.stage}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all`}
                  style={{ width: item.width }}
                />
              </div>
              <span className="text-sm text-white w-16 text-right">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Candidates</h3>
            <button
              onClick={() => onTabChange('pipeline')}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentCandidates.length > 0 ? (
              recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{candidate.firstName} {candidate.lastName}</p>
                      <p className="text-sm text-gray-400">{candidate.currentTitle || 'Candidate'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    candidate.stage === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                    candidate.stage === 'interviewing' ? 'bg-purple-500/20 text-purple-400' :
                    candidate.stage === 'screened' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {candidate.stage}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No candidates yet. Post your first job!
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <button
              onClick={() => onTabChange('events')}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{event.name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(event.startDateTime).toLocaleDateString()} • {event.format}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-400">
                    {event.currentRegistrations} registered
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No upcoming events. Register for a career fair!
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Active Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Internship & Apprenticeship Programs</h3>
          <button
            onClick={() => onTabChange('programs')}
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Manage Programs <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {activePrograms.length > 0 ? (
            activePrograms.slice(0, 3).map((program) => (
              <div key={program.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    program.programType === 'internship' ? 'bg-blue-500/20 text-blue-400' :
                    program.programType === 'apprenticeship' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {program.programType}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    program.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <h4 className="font-medium text-white mb-1">{program.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{program.department}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {program.filledPositions}/{program.totalPositions} filled
                  </span>
                  <span className="text-emerald-400">{program.duration}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              No active programs. Create an internship or apprenticeship program!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// TABS CONFIG
// ===========================================

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'jobs', label: 'Job Postings', icon: Briefcase },
  { key: 'pipeline', label: 'Talent Pipeline', icon: Users },
  { key: 'talentmap', label: 'Talent Map', icon: MapPin },
  { key: 'programs', label: 'Programs', icon: GraduationCap },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'universities', label: 'Universities', icon: Building2 },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const IndustryPartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<IndustryPartner | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [programs, setPrograms] = useState<WorkBasedProgram[]>([]);
  const [events, setEvents] = useState<RecruitingEvent[]>([]);
  const [metrics, setMetrics] = useState<RecruitingMetrics>(SAMPLE_METRICS);

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const partner = await getIndustryPartner(user.id);

        if (partner) {
          setPartnerInfo(partner);

          // Load all data in parallel
          const [jobsData, candidatesData, programsData, eventsData, metricsData] = await Promise.all([
            getJobPostings(partner.id),
            getCandidates(partner.id),
            getWorkBasedPrograms(partner.id),
            getRecruitingEvents(partner.id),
            getRecruitingMetrics(partner.id)
          ]);

          setJobs(jobsData);
          setCandidates(candidatesData);
          setPrograms(programsData);
          setEvents(eventsData);
          setMetrics(metricsData);
        }
      }

      // If no partner found, use demo data
      if (!partnerInfo) {
        setPartnerInfo({
          id: 'demo-partner',
          userId: 'demo-user',
          companyName: 'Demo Company',
          industry: 'Technology',
          companySize: '201-1000',
          headquarters: 'San Francisco, CA',
          partnershipTypes: ['talent_pipeline'],
          tier: 'starter',
          status: 'active',
          primaryContactName: 'Demo User',
          primaryContactEmail: 'demo@example.com',
          subscriptionStatus: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error loading partner data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Set demo data as fallback
      setPartnerInfo({
        id: 'demo-partner',
        userId: 'demo-user',
        companyName: 'Demo Company',
        industry: 'Technology',
        companySize: '201-1000',
        headquarters: 'San Francisco, CA',
        partnershipTypes: ['talent_pipeline'],
        tier: 'starter',
        status: 'active',
        primaryContactName: 'Demo User',
        primaryContactEmail: 'demo@example.com',
        subscriptionStatus: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950">
      {/* Header skeleton */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
              <div>
                <div className="h-6 w-48 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* Tab nav skeleton */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mb-1" />
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-28 bg-gray-800 rounded animate-pulse" />
                <div className="flex-1 h-3 bg-gray-800 rounded-full animate-pulse" />
                <div className="h-4 w-12 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state with retry
  if (error && !partnerInfo) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
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
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Industry Partner Dashboard</h1>
                <p className="text-gray-400">{partnerInfo?.companyName || 'Your Company'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                partnerInfo?.tier === 'enterprise'
                  ? 'bg-purple-500/20 text-purple-400'
                  : partnerInfo?.tier === 'growth'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {partnerInfo?.tier || 'starter'} Plan
              </span>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{metrics.hiresYTD} hires YTD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'bg-emerald-500/20 text-emerald-400'
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

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && partnerInfo && (
          <OverviewTab
            metrics={metrics}
            jobs={jobs}
            candidates={candidates}
            programs={programs}
            events={events}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'jobs' && partnerInfo && (
          <JobPostingsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'pipeline' && partnerInfo && (
          <TalentPipelineTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'talentmap' && partnerInfo && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">STEM Talent Map</h2>
              <p className="text-gray-400">Explore talent distribution across the country to inform your recruiting strategy</p>
            </div>
            <WorkforceMapWidget
              variant="full"
              showFilters={true}
              industryFilter={partnerInfo.industry}
              onStateSelect={(state) => console.log('Selected state:', state)}
            />
          </div>
        )}
        {activeTab === 'programs' && partnerInfo && (
          <ProgramsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'events' && partnerInfo && (
          <EventsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'universities' && partnerInfo && (
          <UniversityRelationsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'billing' && partnerInfo && (
          <BillingTab
            partnerId={partnerInfo.id}
            currentTier={partnerInfo.tier}
          />
        )}
        {activeTab === 'settings' && partnerInfo && (
          <SettingsTab
            partnerId={partnerInfo.id}
            companyName={partnerInfo.companyName}
          />
        )}
      </div>
    </div>
  );
};

export default IndustryPartnerDashboard;
