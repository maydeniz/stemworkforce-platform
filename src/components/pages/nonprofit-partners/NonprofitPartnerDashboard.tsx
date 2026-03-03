// ===========================================
// Nonprofit Partner Dashboard
// Main dashboard for workforce development nonprofits
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Briefcase,
  FileText,
  Network,
  Settings,
  Heart,
  TrendingUp,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts';
import {
  getNonprofitPartner,
  getPrograms,
  getParticipants,
  getGrants,
  getEmployerConnections,
  getImpactMetrics
} from '@/services/nonprofitPartnerApi';
import type {
  NonprofitPartner,
  Program,
  Participant,
  Grant,
  EmployerConnection,
  ImpactMetrics,
  PartnerTier
} from '@/types/nonprofitPartner';

// Import dashboard tabs
import { ParticipantsTab } from './dashboard/ParticipantsTab';
import { ProgramsTab } from './dashboard/ProgramsTab';
import { GrantsTab } from './dashboard/GrantsTab';
import { EmployersTab } from './dashboard/EmployersTab';
import { ReportsTab } from './dashboard/ReportsTab';
import { CoalitionsTab } from './dashboard/CoalitionsTab';
import { SettingsTab } from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'participants' | 'programs' | 'grants' | 'employers' | 'reports' | 'coalitions' | 'settings';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_METRICS: ImpactMetrics = {
  totalParticipants: 892,
  activeParticipants: 234,
  participantsByStatus: {
    intake: 45, enrolled: 89, active: 234, completed: 312,
    placed: 156, retained: 42, exited: 8, withdrawn: 6
  },
  participantsByProgram: {},
  completionRate: 78.5,
  placementRate: 84.2,
  averageWageIncrease: 18200,
  retentionRate30Day: 94,
  retentionRate90Day: 88,
  retentionRate180Day: 82,
  totalWagesGenerated: 15600000,
  costPerPlacement: 2850,
  roiMultiplier: 3.8,
  activePrograms: 8,
  totalEnrollments: 323,
  waitlistTotal: 67,
  activeEmployerPartners: 42,
  totalPlacements: 198,
  interviewsScheduled: 56,
  activeGrants: 5,
  grantFundingTotal: 2450000,
  upcomingReportDeadlines: 3
};

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  metrics: ImpactMetrics;
  programs: Program[];
  participants: Participant[];
  grants: Grant[];
  employers: EmployerConnection[];
  tier: PartnerTier;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  programs,
  grants,
  tier
}) => {
  // Recent activity (mock)
  const recentActivity = [
    { type: 'placement', text: 'Maria S. placed at TechCorp as Junior Developer', time: '2 hours ago' },
    { type: 'completion', text: 'John D. completed Web Development Bootcamp', time: '5 hours ago' },
    { type: 'enrollment', text: '3 new participants enrolled in IT Fundamentals', time: '1 day ago' },
    { type: 'grant', text: 'DOL Grant Q3 Report submitted successfully', time: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.totalParticipants}</p>
              <p className="text-xs text-gray-400">Total Participants</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.placementRate.toFixed(0)}%</p>
              <p className="text-xs text-gray-400">Placement Rate</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${(metrics.averageWageIncrease / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-400">Avg Wage Increase</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.roiMultiplier.toFixed(1)}x</p>
              <p className="text-xs text-gray-400">ROI Multiplier</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Programs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Programs</h3>
            <span className="text-2xl font-bold text-pink-400">{metrics.activePrograms}</span>
          </div>
          <div className="space-y-3">
            {programs.filter(p => p.status === 'active').slice(0, 3).map(program => (
              <div key={program.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{program.name}</p>
                  <p className="text-xs text-gray-400">{program.enrolledCount} enrolled</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm">{((program.enrolledCount / program.capacity) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-400">capacity</p>
                </div>
              </div>
            ))}
            {programs.filter(p => p.status === 'active').length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No active programs</p>
            )}
          </div>
        </div>

        {/* Grant Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Grant Funding</h3>
            <span className="text-2xl font-bold text-emerald-400">${(metrics.grantFundingTotal / 1000000).toFixed(1)}M</span>
          </div>
          <div className="space-y-3">
            {grants.filter(g => ['active', 'reporting'].includes(g.status)).slice(0, 3).map(grant => (
              <div key={grant.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{grant.name}</p>
                  <p className="text-xs text-gray-400">{grant.funderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm">${((grant.awardAmount || 0) / 1000).toFixed(0)}K</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    grant.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {grant.status}
                  </span>
                </div>
              </div>
            ))}
            {grants.filter(g => ['active', 'reporting'].includes(g.status)).length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No active grants</p>
            )}
          </div>
          {metrics.upcomingReportDeadlines > 0 && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{metrics.upcomingReportDeadlines} reports due soon</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'placement' ? 'bg-emerald-400' :
                  activity.type === 'completion' ? 'bg-blue-400' :
                  activity.type === 'enrollment' ? 'bg-pink-400' : 'bg-amber-400'
                }`} />
                <div>
                  <p className="text-sm text-gray-300">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participant Funnel */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Participant Journey</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[
            { stage: 'Intake', count: metrics.participantsByStatus.intake, color: 'bg-gray-500' },
            { stage: 'Enrolled', count: metrics.participantsByStatus.enrolled, color: 'bg-blue-500' },
            { stage: 'Active', count: metrics.participantsByStatus.active, color: 'bg-purple-500' },
            { stage: 'Completed', count: metrics.participantsByStatus.completed, color: 'bg-indigo-500' },
            { stage: 'Placed', count: metrics.participantsByStatus.placed, color: 'bg-emerald-500' },
            { stage: 'Retained', count: metrics.participantsByStatus.retained, color: 'bg-green-500' },
            { stage: 'Exited', count: metrics.participantsByStatus.exited, color: 'bg-amber-500' },
            { stage: 'Withdrawn', count: metrics.participantsByStatus.withdrawn, color: 'bg-red-500' }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className={`h-20 ${item.color} rounded-lg mb-2 flex items-end justify-center`}
                style={{ height: `${Math.max(20, (item.count / metrics.totalParticipants) * 200)}px` }}>
                <span className="text-white font-bold text-sm pb-1">{item.count}</span>
              </div>
              <p className="text-xs text-gray-400">{item.stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Notice */}
      {tier === 'community' && (
        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Upgrade to Impact</h3>
              <p className="text-gray-400 text-sm mb-4">
                Unlock grant reporting automation, employer partnership facilitation, and full impact dashboards.
              </p>
              <button
                onClick={() => window.location.href = '/education-partner-apply?type=nonprofit&plan=impact'}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors"
              >
                Upgrade to Impact - $299/mo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const NonprofitPartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<NonprofitPartner | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [employers, setEmployers] = useState<EmployerConnection[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics>(SAMPLE_METRICS);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const partner = await getNonprofitPartner(user.id);

      if (partner) {
        setPartnerInfo(partner);

        // Load all data in parallel
        const [programsData, participantsData, grantsData, employersData, metricsData] = await Promise.all([
          getPrograms(partner.id),
          getParticipants(partner.id),
          getGrants(partner.id),
          getEmployerConnections(partner.id),
          getImpactMetrics(partner.id)
        ]);

        setPrograms(programsData.length > 0 ? programsData : []);
        setParticipants(participantsData.length > 0 ? participantsData : []);
        setGrants(grantsData.length > 0 ? grantsData : []);
        setEmployers(employersData.length > 0 ? employersData : []);
        setMetrics(metricsData.totalParticipants > 0 ? metricsData : SAMPLE_METRICS);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
            <div>
              <div className="h-7 w-56 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Tab nav skeleton */}
        <div className="flex gap-2 mb-6 pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
                <div>
                  <div className="h-7 w-16 bg-gray-800 rounded animate-pulse mb-1" />
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'participants' as const, label: 'Participants', icon: Users },
    { id: 'programs' as const, label: 'Programs', icon: GraduationCap },
    { id: 'grants' as const, label: 'Grants', icon: DollarSign },
    { id: 'employers' as const, label: 'Employers', icon: Briefcase },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'coalitions' as const, label: 'Coalitions', icon: Network, tierRequired: 'coalition' as const },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state with retry
  if (error && !partnerInfo) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {partnerInfo?.organizationName || 'Nonprofit Partner Dashboard'}
                </h1>
                <p className="text-gray-400">
                  {partnerInfo?.tier ? `${partnerInfo.tier.charAt(0).toUpperCase() + partnerInfo.tier.slice(1)} Plan` : 'Community Plan'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{metrics.activeParticipants}</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-400">{metrics.totalPlacements}</p>
              <p className="text-xs text-gray-400">Placements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{metrics.activeGrants}</p>
              <p className="text-xs text-gray-400">Grants</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isDisabled = tab.tierRequired && partnerInfo?.tier !== 'coalition';

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-pink-500 text-white'
                    : isDisabled
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isDisabled && (
                  <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">Coalition</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && partnerInfo && (
          <OverviewTab
            metrics={metrics}
            programs={programs}
            participants={participants}
            grants={grants}
            employers={employers}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'participants' && partnerInfo && (
          <ParticipantsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'programs' && partnerInfo && (
          <ProgramsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'grants' && partnerInfo && (
          <GrantsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'employers' && partnerInfo && (
          <EmployersTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'reports' && partnerInfo && (
          <ReportsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'coalitions' && partnerInfo && (
          <CoalitionsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'settings' && partnerInfo && (
          <SettingsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
            partner={partnerInfo}
          />
        )}
      </div>
    </div>
  );
};

export default NonprofitPartnerDashboard;
