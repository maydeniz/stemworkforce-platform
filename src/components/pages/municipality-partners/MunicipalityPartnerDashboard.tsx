// ===========================================
// Municipality Partner Dashboard
// Cities, Counties, Municipal HR Departments
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  GraduationCap,
  Wrench,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Briefcase,
  Shield
} from 'lucide-react';
import { getMunicipalityPartner, getMunicipalityDashboardMetrics } from '@/services/municipalityPartnerApi';
import type { MunicipalityPartner, MunicipalityDashboardMetrics } from '@/types/municipalityPartner';

// Lazy load tabs
import { InternshipsTab } from './dashboard/InternshipsTab';
import { ApprenticeshipsTab } from './dashboard/ApprenticeshipsTab';
import { ParticipantsTab } from './dashboard/ParticipantsTab';
import { DepartmentsTab } from './dashboard/DepartmentsTab';
import { CivilServiceTab } from './dashboard/CivilServiceTab';
import { ReportsTab } from './dashboard/ReportsTab';
import { SettingsTab } from './dashboard/SettingsTab';

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'internships' | 'apprenticeships' | 'participants' | 'departments' | 'civil-service' | 'reports' | 'settings';

// ===========================================
// SAMPLE DATA
// ===========================================

const samplePartner: MunicipalityPartner = {
  id: 'muni-001',
  userId: 'user-001',
  municipalityName: 'City of Austin',
  municipalityType: 'city',
  municipalitySize: 'large',
  population: 1028225,
  city: 'Austin',
  county: 'Travis',
  state: 'TX',
  region: 'Central Texas',
  timezone: 'America/Chicago',
  primaryContactName: 'Maria Garcia',
  primaryContactEmail: 'mgarcia@austintexas.gov',
  primaryContactPhone: '512-555-0100',
  primaryContactTitle: 'Director of Human Resources',
  department: 'human_resources',
  totalEmployees: 14500,
  annualHiringTarget: 1200,
  currentVacancies: 847,
  retirementEligible: 2175,
  hrBudget: 8500000,
  tier: 'professional',
  partnerSince: '2023-06-15',
  hasCivilService: true,
  civilServiceExemptions: ['Executive Management', 'Temporary Employees'],
  unionized: true,
  unionNames: ['AFSCME Local 1624', 'Austin Fire Association'],
  activeInternshipPrograms: 8,
  activeApprenticeships: 4,
  totalParticipantsYTD: 342,
  totalPlacementsYTD: 156,
  isActive: true,
  createdAt: '2023-06-15',
  updatedAt: new Date().toISOString()
};

const sampleMetrics: MunicipalityDashboardMetrics = {
  activeInternships: 8,
  activeApprenticeships: 4,
  totalParticipants: 342,
  totalPlacements: 156,
  applicationsThisMonth: 127,
  enrollmentsThisMonth: 45,
  completionsThisMonth: 38,
  placementsThisMonth: 22,
  avgCompletionRate: 87,
  avgConversionRate: 35,
  avgRetentionRate: 92,
  avgTimeToFill: 48,
  participantsByAge: [
    { range: '14-17', count: 45 },
    { range: '18-21', count: 156 },
    { range: '22-24', count: 98 },
    { range: '25+', count: 43 }
  ],
  participantsByDepartment: [
    { department: 'public_works', count: 78 },
    { department: 'parks_recreation', count: 65 },
    { department: 'it_technology', count: 52 },
    { department: 'finance', count: 41 },
    { department: 'utilities', count: 38 },
    { department: 'other', count: 68 }
  ],
  participantsByProgram: [
    { programType: 'Summer Youth', count: 180 },
    { programType: 'College Pathways', count: 78 },
    { programType: 'Apprenticeship', count: 54 },
    { programType: 'CTE Partnership', count: 30 }
  ],
  totalProgramBudget: 2450000,
  budgetSpentYTD: 1642500,
  costPerPlacement: 10530,
  vacanciesFilled: 156,
  diversityHires: 112,
  youthEmployed: 280,
  veteransEmployed: 18,
  monthlyEnrollments: [
    { month: 'Jul', count: 145 },
    { month: 'Aug', count: 52 },
    { month: 'Sep', count: 38 },
    { month: 'Oct', count: 25 },
    { month: 'Nov', count: 42 },
    { month: 'Dec', count: 40 }
  ],
  monthlyPlacements: [
    { month: 'Jul', count: 28 },
    { month: 'Aug', count: 45 },
    { month: 'Sep', count: 32 },
    { month: 'Oct', count: 18 },
    { month: 'Nov', count: 15 },
    { month: 'Dec', count: 18 }
  ],
  quarterlyRetention: [
    { quarter: 'Q1', rate: 94 },
    { quarter: 'Q2', rate: 91 },
    { quarter: 'Q3', rate: 89 },
    { quarter: 'Q4', rate: 92 }
  ]
};

// ===========================================
// TAB CONFIG
// ===========================================

const TAB_CONFIG: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'internships', label: 'Internships', icon: GraduationCap },
  { id: 'apprenticeships', label: 'Apprenticeships', icon: Wrench },
  { id: 'participants', label: 'Participants', icon: Users },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'civil-service', label: 'Civil Service', icon: FileText },
  { id: 'reports', label: 'Reports', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings }
];

// ===========================================
// STATIC TAILWIND COLOR MAP
// ===========================================

const muniColors: Record<string, { bg: string; text: string }> = {
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

// ===========================================
// COMPONENT
// ===========================================

export default function MunicipalityPartnerDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [partner, setPartner] = useState<MunicipalityPartner | null>(samplePartner);
  const [metrics, setMetrics] = useState<MunicipalityDashboardMetrics>(sampleMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In production, get the actual user's partner ID
      const partnerData = await getMunicipalityPartner('current-user-id');
      if (partnerData) {
        setPartner(partnerData);
        const metricsData = await getMunicipalityDashboardMetrics(partnerData.id);
        setMetrics(metricsData);
      }
    } catch (err) {
      console.error('Error fetching municipality data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Keep sample data as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const partnerId = partner?.id || 'muni-001';
  const tier = partner?.tier || 'professional';

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Header skeleton */}
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse" />
                <div>
                  <div className="h-7 w-56 bg-slate-800 rounded animate-pulse mb-2" />
                  <div className="h-4 w-40 bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          {/* Tab nav skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 pb-px">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-12 w-28 bg-slate-800 rounded-t-lg animate-pulse" />
              ))}
            </nav>
          </div>
        </header>
        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse" />
                  <div>
                    <div className="h-7 w-16 bg-slate-800 rounded animate-pulse mb-1" />
                    <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="h-6 w-40 bg-slate-800 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error && !partner) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{partner?.municipalityName || 'Municipality Dashboard'}</h1>
                <p className="text-gray-400">{partner?.city}, {partner?.state} | {partner?.totalEmployees?.toLocaleString()} employees</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Partner Tier</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tier === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                  tier === 'professional' ? 'bg-teal-500/20 text-teal-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto pb-px">
            {TAB_CONFIG.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-teal-400 border-teal-400'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab metrics={metrics} partner={partner} />
        )}
        {activeTab === 'internships' && (
          <InternshipsTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'apprenticeships' && (
          <ApprenticeshipsTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'participants' && (
          <ParticipantsTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'departments' && (
          <DepartmentsTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'civil-service' && (
          <CivilServiceTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'reports' && (
          <ReportsTab partnerId={partnerId} tier={tier} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab partnerId={partnerId} tier={tier} partner={partner} />
        )}
      </main>
    </div>
  );
}

// ===========================================
// OVERVIEW TAB
// ===========================================

interface OverviewTabProps {
  metrics: MunicipalityDashboardMetrics;
  partner: MunicipalityPartner | null;
}

function OverviewTab({ metrics, partner }: OverviewTabProps) {
  const quickStats = [
    {
      label: 'Active Interns',
      value: metrics.totalParticipants - (metrics.activeApprenticeships * 10),
      change: 23,
      icon: GraduationCap,
      color: 'teal'
    },
    {
      label: 'Active Apprentices',
      value: 87,
      change: 12,
      icon: Wrench,
      color: 'amber'
    },
    {
      label: 'Placements YTD',
      value: metrics.totalPlacements,
      change: 45,
      icon: Briefcase,
      color: 'emerald'
    },
    {
      label: 'Avg Days to Fill',
      value: metrics.avgTimeToFill,
      change: -58,
      icon: Clock,
      color: 'blue',
      suffix: ' days'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'SYEP Application Deadline',
      description: 'Summer Youth Employment Program applications close in 5 days',
      action: 'Review Applications'
    },
    {
      type: 'info',
      title: 'Civil Service Exam',
      description: 'Engineering Technician exam scheduled for Feb 15 - 12 linked participants',
      action: 'View Details'
    },
    {
      type: 'success',
      title: 'Q4 Retention Target Met',
      description: '92% retention rate exceeds 85% target by 7 points',
      action: 'View Report'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${muniColors[stat.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${muniColors[stat.color]?.text || 'text-slate-400'}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}{stat.suffix || ''}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Alerts & Actions
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    alert.type === 'info' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-emerald-500/10 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{alert.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                    </div>
                    <button className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-amber-400' :
                      alert.type === 'info' ? 'text-blue-400' :
                      'text-emerald-400'
                    }`}>
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Participants by Department */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              Participants by Department
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Public Works', count: 78, pct: 23 },
                { name: 'Parks & Recreation', count: 65, pct: 19 },
                { name: 'IT/Technology', count: 52, pct: 15 },
                { name: 'Finance', count: 41, pct: 12 },
                { name: 'Utilities', count: 38, pct: 11 },
                { name: 'Other Departments', count: 68, pct: 20 }
              ].map((dept, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-400">{dept.name}</div>
                  <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-white font-medium">{dept.count}</span>
                    <span className="text-gray-500 text-sm ml-1">({dept.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Programs Performance */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-400" />
              Program Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-slate-800">
                    <th className="pb-3 font-medium">Program</th>
                    <th className="pb-3 font-medium">Enrolled</th>
                    <th className="pb-3 font-medium">Completed</th>
                    <th className="pb-3 font-medium">Placed</th>
                    <th className="pb-3 font-medium">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: 'Summer Youth Employment', enrolled: 180, completed: 165, placed: 58, rate: 35 },
                    { name: 'College Pathways', enrolled: 78, completed: 72, placed: 42, rate: 58 },
                    { name: 'Trades Apprenticeship', enrolled: 54, completed: 48, placed: 45, rate: 94 },
                    { name: 'CTE High School', enrolled: 30, completed: 28, placed: 11, rate: 39 }
                  ].map((prog, idx) => (
                    <tr key={idx} className="border-b border-slate-800/50">
                      <td className="py-3 text-white">{prog.name}</td>
                      <td className="py-3 text-gray-300">{prog.enrolled}</td>
                      <td className="py-3 text-gray-300">{prog.completed}</td>
                      <td className="py-3 text-gray-300">{prog.placed}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          prog.rate >= 50 ? 'bg-emerald-500/20 text-emerald-400' :
                          prog.rate >= 30 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {prog.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              Budget Overview
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Total Budget</span>
                  <span className="text-white font-medium">${(metrics.totalProgramBudget / 1000000).toFixed(2)}M</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    style={{ width: `${(metrics.budgetSpentYTD / metrics.totalProgramBudget) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${(metrics.budgetSpentYTD / 1000000).toFixed(2)}M spent ({Math.round((metrics.budgetSpentYTD / metrics.totalProgramBudget) * 100)}%)
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost per Placement</span>
                  <span className="text-white font-medium">${metrics.costPerPlacement.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workforce Impact */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Workforce Impact
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Vacancies Filled', value: metrics.vacanciesFilled, icon: CheckCircle, color: 'emerald' },
                { label: 'Youth Employed', value: metrics.youthEmployed, icon: Users, color: 'blue' },
                { label: 'Diversity Hires', value: metrics.diversityHires, icon: Target, color: 'purple' },
                { label: 'Veterans Employed', value: metrics.veteransEmployed, icon: Shield, color: 'amber' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${muniColors[item.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${muniColors[item.color]?.text || 'text-slate-400'}`} />
                    </div>
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Civil Service Exams */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Upcoming CS Exams
            </h2>
            <div className="space-y-3">
              {[
                { title: 'Engineering Technician', date: 'Feb 15', linked: 12 },
                { title: 'IT Specialist I', date: 'Feb 28', linked: 8 },
                { title: 'Water Treatment Operator', date: 'Mar 10', linked: 15 },
                { title: 'Administrative Analyst', date: 'Mar 22', linked: 6 }
              ].map((exam, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm text-white">{exam.title}</p>
                    <p className="text-xs text-gray-500">{exam.linked} linked participants</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-teal-400">{exam.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center justify-center gap-2">
              View All Exams
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Organization Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              Organization
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Employees</span>
                <span className="text-white">{partner?.totalEmployees?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Vacancies</span>
                <span className="text-amber-400">{partner?.currentVacancies?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Retirement Eligible</span>
                <span className="text-red-400">{partner?.retirementEligible?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hiring Target</span>
                <span className="text-white">{partner?.annualHiringTarget?.toLocaleString()}/yr</span>
              </div>
              <div className="pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Civil Service</span>
                  <span className={partner?.hasCivilService ? 'text-emerald-400' : 'text-gray-500'}>
                    {partner?.hasCivilService ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Unionized</span>
                  <span className={partner?.unionized ? 'text-emerald-400' : 'text-gray-500'}>
                    {partner?.unionized ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
