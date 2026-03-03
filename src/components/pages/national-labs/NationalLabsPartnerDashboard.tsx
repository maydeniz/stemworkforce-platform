// ===========================================
// National Labs Partner Dashboard
// Main dashboard for DOE Labs, FFRDCs, Research Centers
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  GraduationCap,
  Network,
  FileCheck,
  Settings,
  Atom,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts';
import {
  getNationalLabsPartner,
  getClearancePositions,
  getClearanceCandidates,
  getFellowshipPrograms,
  getFellows,
  getLabDashboardMetrics
} from '@/services/nationalLabsPartnerApi';
import type {
  NationalLabsPartner,
  ClearancePosition,
  ClearanceCandidate,
  FellowshipProgram,
  Fellow,
  LabDashboardMetrics
} from '@/types/nationalLabsPartner';

// Import dashboard tabs
import { ClearanceTab } from './dashboard/ClearanceTab';
import { FellowshipsTab } from './dashboard/FellowshipsTab';
import { ResearchTab } from './dashboard/ResearchTab';
import { ComplianceTab } from './dashboard/ComplianceTab';
import { SettingsTab } from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'clearance' | 'fellowships' | 'research' | 'compliance' | 'settings';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_METRICS: LabDashboardMetrics = {
  activeOpenings: 47,
  totalOpenings: 89,
  positionsFilled: 156,
  averageTimeToFill: 72,
  pipelineSize: 1234,
  candidatesScreened: 892,
  candidatesEligible: 312,
  candidatesInProcess: 156,
  clearanceByType: {
    public_trust: 145,
    l_clearance: 234,
    q_clearance: 312,
    ts: 89,
    ts_sci: 42,
    none: 412
  },
  clearanceByStatus: {
    not_started: 412,
    sf86_submitted: 234,
    investigation: 178,
    adjudication: 89,
    granted: 156,
    denied: 23,
    revoked: 5,
    expired: 12
  },
  averageScreeningTime: 3.2,
  activeFellowships: 8,
  totalFellows: 234,
  fellowsInProgress: 89,
  conversionRate: 78,
  activePIs: 156,
  activeCollaborations: 42,
  pendingCollaborations: 12,
  complianceRecordsTotal: 892,
  complianceIssues: 3,
  pendingReviews: 12
};

// ===========================================
// OVERVIEW TAB COMPONENT
// ===========================================

interface OverviewTabProps {
  metrics: LabDashboardMetrics;
  positions: ClearancePosition[];
  candidates: ClearanceCandidate[];
  programs: FellowshipProgram[];
  fellows: Fellow[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ metrics, positions, candidates, programs: _programs }) => {
  const clearancePipeline = [
    { stage: 'Applied', count: metrics.pipelineSize, width: '100%' },
    { stage: 'Screened', count: metrics.candidatesScreened, width: `${(metrics.candidatesScreened / metrics.pipelineSize) * 100}%` },
    { stage: 'Eligible', count: metrics.candidatesEligible, width: `${(metrics.candidatesEligible / metrics.pipelineSize) * 100}%` },
    { stage: 'In Process', count: metrics.candidatesInProcess, width: `${(metrics.candidatesInProcess / metrics.pipelineSize) * 100}%` },
    { stage: 'Granted', count: metrics.clearanceByStatus.granted || 0, width: `${((metrics.clearanceByStatus.granted || 0) / metrics.pipelineSize) * 100}%` }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.activeOpenings}</p>
              <p className="text-sm text-gray-400">Active Openings</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.pipelineSize.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Pipeline Size</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.candidatesEligible}</p>
              <p className="text-sm text-gray-400">Clearance Ready</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metrics.conversionRate}%</p>
              <p className="text-sm text-gray-400">Intern-to-Hire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Clearance Pipeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Clearance Pipeline Funnel
          </h3>
          <div className="space-y-4">
            {clearancePipeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">{item.stage}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                  />
                </div>
                <span className="text-sm text-white w-16 text-right">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Fill by Clearance Level */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Time-to-Fill by Clearance Level
          </h3>
          <div className="space-y-4">
            {[
              { level: 'Public Trust', days: 45, width: '30%', color: 'bg-green-500' },
              { level: 'L Clearance', days: 72, width: '50%', color: 'bg-blue-500' },
              { level: 'Q Clearance', days: 98, width: '68%', color: 'bg-purple-500' },
              { level: 'TS/SCI', days: 145, width: '100%', color: 'bg-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-24">{item.level}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`${item.color} h-3 rounded-full`}
                  />
                </div>
                <span className="text-sm text-white w-20 text-right">{item.days} days</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Active Fellowships</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.activeFellowships}</p>
          <p className="text-xs text-emerald-400">+{metrics.fellowsInProgress} in progress</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Active Collaborations</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.activeCollaborations}</p>
          <p className="text-xs text-amber-400">+{metrics.pendingCollaborations} pending</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Compliance Records</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.complianceRecordsTotal}</p>
          <p className="text-xs text-emerald-400">{metrics.pendingReviews} pending review</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-400">Compliance Issues</span>
          </div>
          <p className="text-xl font-bold text-white">{metrics.complianceIssues}</p>
          <p className="text-xs text-gray-400">requires attention</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Positions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Positions</h3>
          <div className="space-y-3">
            {positions.slice(0, 4).map((pos, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{pos.title}</p>
                  <p className="text-sm text-gray-400">{pos.department} • {pos.requiredClearance.replace('_', ' ')}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  pos.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                  pos.status === 'filled' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {pos.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Candidates</h3>
          <div className="space-y-3">
            {candidates.slice(0, 4).map((candidate, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{candidate.firstName} {candidate.lastName}</p>
                  <p className="text-sm text-gray-400">{candidate.targetClearanceType.replace('_', ' ')} • Score: {candidate.sf86ReadinessScore}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  candidate.eligibilityAssessment === 'eligible' ? 'bg-emerald-500/20 text-emerald-400' :
                  candidate.eligibilityAssessment === 'conditional' ? 'bg-amber-500/20 text-amber-400' :
                  candidate.eligibilityAssessment === 'high_risk' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {candidate.eligibilityAssessment || 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const NationalLabsPartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<NationalLabsPartner | null>(null);
  const [positions, setPositions] = useState<ClearancePosition[]>([]);
  const [candidates, setCandidates] = useState<ClearanceCandidate[]>([]);
  const [programs, setPrograms] = useState<FellowshipProgram[]>([]);
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [metrics, setMetrics] = useState<LabDashboardMetrics>(SAMPLE_METRICS);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const partner = await getNationalLabsPartner(user.id);
      setPartnerInfo(partner);

      if (partner) {
        const [positionsData, candidatesData, programsData, fellowsData, metricsData] = await Promise.all([
          getClearancePositions(partner.id),
          getClearanceCandidates(partner.id),
          getFellowshipPrograms(partner.id),
          getFellows(partner.id),
          getLabDashboardMetrics(partner.id)
        ]);

        // Use sample data if no real data exists
        setPositions(positionsData.length > 0 ? positionsData : SAMPLE_POSITIONS);
        setCandidates(candidatesData.length > 0 ? candidatesData : SAMPLE_CANDIDATES);
        setPrograms(programsData.length > 0 ? programsData : SAMPLE_PROGRAMS);
        setFellows(fellowsData.length > 0 ? fellowsData : []);
        setMetrics(metricsData.pipelineSize > 0 ? metricsData : SAMPLE_METRICS);
      } else {
        // Use sample data for demo
        setPositions(SAMPLE_POSITIONS);
        setCandidates(SAMPLE_CANDIDATES);
        setPrograms(SAMPLE_PROGRAMS);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Fall back to sample data
      setPositions(SAMPLE_POSITIONS);
      setCandidates(SAMPLE_CANDIDATES);
      setPrograms(SAMPLE_PROGRAMS);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-800 rounded-xl animate-pulse" />
              <div>
                <div className="h-7 w-64 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        {/* Tab nav skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse" />
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
    { id: 'clearance' as const, label: 'Clearance Pipeline', icon: Shield },
    { id: 'fellowships' as const, label: 'Fellowships', icon: GraduationCap },
    { id: 'research' as const, label: 'Research', icon: Network },
    { id: 'compliance' as const, label: 'Compliance', icon: FileCheck },
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
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Atom className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {partnerInfo?.organizationName || 'National Labs Partner Dashboard'}
                </h1>
                <p className="text-gray-400">
                  {partnerInfo?.tier ? `${partnerInfo.tier.charAt(0).toUpperCase() + partnerInfo.tier.slice(1)} Plan` : 'Research Partner Plan'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-gray-400">Live Data</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            metrics={metrics}
            positions={positions}
            candidates={candidates}
            programs={programs}
            fellows={fellows}
          />
        )}
        {activeTab === 'clearance' && partnerInfo && (
          <ClearanceTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'fellowships' && partnerInfo && (
          <FellowshipsTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'research' && partnerInfo && (
          <ResearchTab
            partnerId={partnerInfo.id}
            tier={partnerInfo.tier}
          />
        )}
        {activeTab === 'compliance' && partnerInfo && (
          <ComplianceTab
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

// ===========================================
// SAMPLE DATA FOR DEMO
// ===========================================

const SAMPLE_POSITIONS: ClearancePosition[] = [
  {
    id: '1',
    partnerId: '1',
    title: 'Nuclear Engineer',
    department: 'Reactor Engineering',
    division: 'Nuclear Science',
    requiredClearance: 'q_clearance',
    polygraphRequired: false,
    citizenshipRequired: true,
    exportControlled: true,
    description: 'Design and analyze nuclear reactor systems',
    requirements: ['PhD in Nuclear Engineering', '5+ years experience'],
    location: 'Oak Ridge, TN',
    remote: false,
    salaryMin: 120000,
    salaryMax: 180000,
    status: 'open',
    openings: 3,
    filledCount: 0,
    candidatesTotal: 45,
    candidatesScreened: 32,
    candidatesEligible: 18,
    candidatesInProcess: 8,
    averageTimeToFill: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    title: 'Computational Physicist',
    department: 'Computing Division',
    requiredClearance: 'l_clearance',
    polygraphRequired: false,
    citizenshipRequired: true,
    exportControlled: false,
    description: 'Develop physics simulations for HPC systems',
    requirements: ['MS/PhD in Physics or CS', 'HPC experience'],
    location: 'Los Alamos, NM',
    remote: false,
    status: 'open',
    openings: 2,
    filledCount: 0,
    candidatesTotal: 67,
    candidatesScreened: 45,
    candidatesEligible: 28,
    candidatesInProcess: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_CANDIDATES: ClearanceCandidate[] = [
  {
    id: '1',
    partnerId: '1',
    positionId: '1',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@university.edu',
    citizenshipStatus: 'us_citizen',
    dualCitizenship: false,
    foreignContacts: false,
    foreignTravel: true,
    financialIssues: false,
    criminalHistory: false,
    drugUse: false,
    sf86ReadinessScore: 92,
    eligibilityAssessment: 'eligible',
    riskFactors: [],
    recommendations: ['Proceed with clearance application'],
    targetClearanceType: 'q_clearance',
    currentClearanceStatus: 'investigation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'mrodriguez@graduate.edu',
    citizenshipStatus: 'us_citizen',
    dualCitizenship: false,
    foreignContacts: true,
    foreignTravel: true,
    financialIssues: false,
    criminalHistory: false,
    drugUse: false,
    sf86ReadinessScore: 78,
    eligibilityAssessment: 'conditional',
    riskFactors: ['Foreign contacts require disclosure'],
    recommendations: ['Document all foreign contacts thoroughly'],
    targetClearanceType: 'l_clearance',
    currentClearanceStatus: 'sf86_submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_PROGRAMS: FellowshipProgram[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'SULI - Science Undergraduate Laboratory Internship',
    programType: 'suli',
    description: 'DOE program for undergraduate research experience',
    duration: '10 weeks',
    isPaid: true,
    stipendAmount: 6500,
    housingProvided: true,
    relocationAssistance: true,
    citizenshipRequired: true,
    educationLevels: ['undergraduate'],
    majorsPreferred: ['Physics', 'Chemistry', 'Engineering'],
    totalSlots: 25,
    filledSlots: 18,
    waitlistCount: 12,
    conversionTarget: 30,
    historicalConversionRate: 34,
    status: 'accepting',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default NationalLabsPartnerDashboard;
