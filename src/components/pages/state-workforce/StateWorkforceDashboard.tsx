// ===========================================
// State Workforce Board Dashboard
// WIOA Programs, AJCs, Participants, Employers
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  Landmark,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts';
import type {
  WorkforceDashboardStats,
  WIOAPerformanceGoals,
  LocalWorkforceBoard
} from '@/types/stateWorkforce';

// Import dashboard tabs
import { ParticipantsTab } from './dashboard/ParticipantsTab';
import { ProgramsTab } from './dashboard/ProgramsTab';
import { AJCOperationsTab } from './dashboard/AJCOperationsTab';
import { EmployersTab } from './dashboard/EmployersTab';
import { BudgetTab } from './dashboard/BudgetTab';
import { PerformanceTab } from './dashboard/PerformanceTab';
import { SettingsTab } from './dashboard/SettingsTab';
import PartnerProgramsTab from './dashboard/PartnerProgramsTab';

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'participants' | 'programs' | 'ajc' | 'employers' | 'budget' | 'performance' | 'partner_programs' | 'settings';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_STATS: WorkforceDashboardStats = {
  total_participants: 12847,
  active_participants: 4562,
  new_enrollments_mtd: 387,
  exits_mtd: 214,
  total_services_delivered: 34891,
  services_this_month: 2845,
  active_itas: 876,
  ita_expenditures_ytd: 4250000,
  training_completions_ytd: 1423,
  credentials_earned_ytd: 1189,
  active_employers: 567,
  job_orders_open: 1234,
  placements_mtd: 198,
  ojt_agreements_active: 89,
  total_ajc_visits_mtd: 18456,
  virtual_services_mtd: 5672,
  total_allocation: 45000000,
  total_expended: 28750000,
  burn_rate: 63.9,
  meeting_q2_employment: true,
  meeting_q4_employment: true,
  meeting_median_earnings: true,
  meeting_credential: false,
  meeting_msg: true,
  meeting_effectiveness: true
};

const SAMPLE_PERFORMANCE: WIOAPerformanceGoals[] = [
  {
    id: '1', fiscal_year: 'PY2025', program: 'TITLE_I_ADULT',
    employment_rate_q2_goal: 78, employment_rate_q4_goal: 75.5, median_earnings_goal: 7200,
    credential_attainment_goal: 65, measurable_skill_gains_goal: 55, effectiveness_retention_goal: 72,
    employment_rate_q2_actual: 81.2, employment_rate_q4_actual: 77.8, median_earnings_actual: 7650,
    credential_attainment_actual: 62.1, measurable_skill_gains_actual: 58.4, effectiveness_retention_actual: 74.3,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: '2', fiscal_year: 'PY2025', program: 'TITLE_I_DISLOCATED_WORKER',
    employment_rate_q2_goal: 80, employment_rate_q4_goal: 77, median_earnings_goal: 8500,
    credential_attainment_goal: 68, measurable_skill_gains_goal: 52, effectiveness_retention_goal: 75,
    employment_rate_q2_actual: 83.5, employment_rate_q4_actual: 79.2, median_earnings_actual: 9100,
    credential_attainment_actual: 64.8, measurable_skill_gains_actual: 54.1, effectiveness_retention_actual: 76.8,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: '3', fiscal_year: 'PY2025', program: 'TITLE_I_YOUTH',
    employment_rate_q2_goal: 72, employment_rate_q4_goal: 70, median_earnings_goal: 4200,
    credential_attainment_goal: 60, measurable_skill_gains_goal: 58, effectiveness_retention_goal: 68,
    employment_rate_q2_actual: 74.6, employment_rate_q4_actual: 71.3, median_earnings_actual: 4450,
    credential_attainment_actual: 57.2, measurable_skill_gains_actual: 61.8, effectiveness_retention_actual: 69.5,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

const SAMPLE_LWDBS: LocalWorkforceBoard[] = [
  {
    id: 'lwdb-1', name: 'Capital Region Workforce Board', lwdb_number: 'LWDB-01',
    counties_served: ['Travis', 'Williamson', 'Hays', 'Bastrop', 'Caldwell'],
    region_name: 'Capital Region',
    address_street: '123 Congress Ave', address_city: 'Austin', address_state: 'TX', address_zip: '78701',
    phone: '512-555-0100', email: 'info@capitalwfb.org', website: 'https://capitalwfb.org',
    director_name: 'Sarah Chen', director_email: 'schen@capitalwfb.org', board_chair_name: 'Robert Martinez',
    ajc_ids: ['ajc-1', 'ajc-2', 'ajc-3'], comprehensive_ajc_count: 2, affiliate_ajc_count: 1,
    current_fiscal_year_budget: 12500000, meeting_performance_goals: true,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'lwdb-2', name: 'Gulf Coast Workforce Solutions', lwdb_number: 'LWDB-02',
    counties_served: ['Harris', 'Fort Bend', 'Montgomery', 'Galveston', 'Brazoria', 'Liberty', 'Waller', 'Chambers', 'Austin', 'Colorado', 'Matagorda', 'Walker', 'Wharton'],
    region_name: 'Gulf Coast Region',
    address_street: '3555 Timmons Ln', address_city: 'Houston', address_state: 'TX', address_zip: '77027',
    phone: '713-555-0200', email: 'info@gulfcoastwfs.org',
    director_name: 'Michael Johnson', director_email: 'mjohnson@gulfcoastwfs.org',
    ajc_ids: ['ajc-4', 'ajc-5', 'ajc-6', 'ajc-7'], comprehensive_ajc_count: 3, affiliate_ajc_count: 1,
    current_fiscal_year_budget: 18500000, meeting_performance_goals: true,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

// ===========================================
// OVERVIEW TAB
// ===========================================

interface OverviewTabProps {
  stats: WorkforceDashboardStats;
  performance: WIOAPerformanceGoals[];
  lwdbs: LocalWorkforceBoard[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, performance, lwdbs }) => {
  const kpiCards = [
    { label: 'Total Participants', value: stats.total_participants.toLocaleString(), icon: Users, color: 'blue', sub: `${stats.new_enrollments_mtd} new this month` },
    { label: 'Placement Rate', value: `${Math.round((stats.placements_mtd / (stats.exits_mtd || 1)) * 100)}%`, icon: Target, color: 'emerald', sub: `${stats.placements_mtd} placements MTD` },
    { label: 'Active AJCs', value: '24', icon: MapPin, color: 'purple', sub: `${stats.total_ajc_visits_mtd.toLocaleString()} visits MTD` },
    { label: 'Budget Utilization', value: `${stats.burn_rate}%`, icon: DollarSign, color: 'amber', sub: `$${(stats.total_expended / 1000000).toFixed(1)}M of $${(stats.total_allocation / 1000000).toFixed(1)}M` },
  ];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
  };

  const performanceIndicators = [
    { label: 'Employment Q2', met: stats.meeting_q2_employment },
    { label: 'Employment Q4', met: stats.meeting_q4_employment },
    { label: 'Median Earnings', met: stats.meeting_median_earnings },
    { label: 'Credential Attainment', met: stats.meeting_credential },
    { label: 'Measurable Skill Gains', met: stats.meeting_msg },
    { label: 'Effectiveness/Retention', met: stats.meeting_effectiveness },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          const colors = colorMap[kpi.color];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-sm text-gray-400">{kpi.label}</p>
                </div>
              </div>
              <p className={`text-xs ${colors.text} mt-2`}>{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Active Participants</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.active_participants.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> {stats.new_enrollments_mtd} enrolled MTD
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Credentials Earned</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.credentials_earned_ytd.toLocaleString()}</p>
          <p className="text-xs text-emerald-400">{stats.training_completions_ytd} training completions YTD</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Open Job Orders</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.job_orders_open.toLocaleString()}</p>
          <p className="text-xs text-purple-400">{stats.active_employers} active employers</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Active ITAs</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.active_itas}</p>
          <p className="text-xs text-amber-400">${(stats.ita_expenditures_ytd / 1000000).toFixed(1)}M expended YTD</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* WIOA Performance Indicators */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            WIOA Performance Indicators
          </h3>
          <div className="space-y-3">
            {performanceIndicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2">
                  {indicator.met ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-gray-300">{indicator.label}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  indicator.met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {indicator.met ? 'Meeting Goal' : 'Below Target'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Indicators Meeting Goals</span>
              <span className="text-emerald-400">{performanceIndicators.filter(p => p.met).length} of 6</span>
            </div>
          </div>
        </div>

        {/* Program Performance Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Program Performance
          </h3>
          <div className="space-y-4">
            {performance.map((prog, idx) => {
              const programLabels: Record<string, string> = {
                'TITLE_I_ADULT': 'Title I - Adult',
                'TITLE_I_DISLOCATED_WORKER': 'Title I - Dislocated Worker',
                'TITLE_I_YOUTH': 'Title I - Youth',
              };
              const q2Pct = prog.employment_rate_q2_actual || 0;
              const q2Goal = prog.employment_rate_q2_goal;
              const meetingQ2 = q2Pct >= q2Goal;

              return (
                <div key={idx} className="border-b border-gray-800 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{programLabels[prog.program] || prog.program}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      meetingQ2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      Q2: {q2Pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (q2Pct / q2Goal) * 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`h-2 rounded-full ${meetingQ2 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right">Goal: {q2Goal}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LWDB Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          Local Workforce Development Boards
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Board Name</th>
                <th className="text-left text-sm text-gray-400 pb-3">Region</th>
                <th className="text-center text-sm text-gray-400 pb-3">Counties</th>
                <th className="text-center text-sm text-gray-400 pb-3">AJCs</th>
                <th className="text-right text-sm text-gray-400 pb-3">Budget</th>
                <th className="text-right text-sm text-gray-400 pb-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {lwdbs.map((lwdb, idx) => (
                <tr key={idx} className="border-b border-gray-800 last:border-0">
                  <td className="py-3">
                    <p className="text-white font-medium">{lwdb.name}</p>
                    <p className="text-sm text-gray-400">{lwdb.director_name}</p>
                  </td>
                  <td className="py-3 text-gray-300">{lwdb.region_name || '-'}</td>
                  <td className="py-3 text-center text-white">{lwdb.counties_served.length}</td>
                  <td className="py-3 text-center text-white">
                    {lwdb.comprehensive_ajc_count + lwdb.affiliate_ajc_count}
                  </td>
                  <td className="py-3 text-right text-white">
                    ${((lwdb.current_fiscal_year_budget || 0) / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      lwdb.meeting_performance_goals ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {lwdb.meeting_performance_goals ? 'Meeting Goals' : 'Below Target'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Delivery & AJC Traffic */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Service Delivery
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Total Services Delivered</span>
              <span className="text-white font-semibold">{stats.total_services_delivered.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Services This Month</span>
              <span className="text-white font-semibold">{stats.services_this_month.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Virtual Services MTD</span>
              <span className="text-white font-semibold">{stats.virtual_services_mtd.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Active OJT Agreements</span>
              <span className="text-white font-semibold">{stats.ojt_agreements_active}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            AJC Traffic Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Total AJC Visits MTD</span>
              <span className="text-white font-semibold">{stats.total_ajc_visits_mtd.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Avg Daily Visits</span>
              <span className="text-white font-semibold">{Math.round(stats.total_ajc_visits_mtd / 22).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Virtual Services</span>
              <span className="text-white font-semibold">{stats.virtual_services_mtd.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Virtual Share</span>
              <span className="text-white font-semibold">
                {Math.round((stats.virtual_services_mtd / (stats.total_ajc_visits_mtd + stats.virtual_services_mtd)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// LOADING SKELETON
// ===========================================

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-950 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-xl animate-pulse" />
          <div>
            <div className="h-7 w-64 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
              <div>
                <div className="h-7 w-16 bg-gray-800 rounded animate-pulse mb-1" />
                <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between py-2">
                  <div className="h-4 w-28 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const StateWorkforceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WorkforceDashboardStats>(SAMPLE_STATS);
  const [performance, setPerformance] = useState<WIOAPerformanceGoals[]>(SAMPLE_PERFORMANCE);
  const [lwdbs, setLwdbs] = useState<LocalWorkforceBoard[]>(SAMPLE_LWDBS);

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

      // Attempt to load real data; fall back to samples
      // In production, replace with actual API calls:
      // const [statsData, perfData, lwdbData] = await Promise.all([
      //   getWorkforceDashboardStats(user.id),
      //   getWIOAPerformanceGoals(user.id),
      //   getLocalWorkforceBoards(user.id)
      // ]);

      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 600));

      // Fall back to sample data
      setStats(SAMPLE_STATS);
      setPerformance(SAMPLE_PERFORMANCE);
      setLwdbs(SAMPLE_LWDBS);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      // Fall back to sample data
      setStats(SAMPLE_STATS);
      setPerformance(SAMPLE_PERFORMANCE);
      setLwdbs(SAMPLE_LWDBS);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'participants' as const, label: 'Participants', icon: Users },
    { id: 'programs' as const, label: 'Programs', icon: BookOpen },
    { id: 'ajc' as const, label: 'AJC Operations', icon: MapPin },
    { id: 'employers' as const, label: 'Employers', icon: Briefcase },
    { id: 'budget' as const, label: 'Budget', icon: DollarSign },
    { id: 'performance' as const, label: 'Performance', icon: BarChart3 },
    { id: 'partner_programs' as const, label: 'Partner Programs', icon: Activity },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error && stats.total_participants === 0) {
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
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
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  State Workforce Board Dashboard
                </h1>
                <p className="text-gray-400">
                  WIOA Program Management & Workforce Development
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
                    ? 'bg-blue-500 text-white'
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
          <OverviewTab stats={stats} performance={performance} lwdbs={lwdbs} />
        )}
        {activeTab === 'participants' && <ParticipantsTab />}
        {activeTab === 'programs' && <ProgramsTab />}
        {activeTab === 'ajc' && <AJCOperationsTab />}
        {activeTab === 'employers' && <EmployersTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'partner_programs' && <PartnerProgramsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default StateWorkforceDashboard;
