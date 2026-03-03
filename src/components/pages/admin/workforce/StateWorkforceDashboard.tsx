import React, { useState, Suspense, lazy } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Briefcase,
  BarChart3,
  DollarSign,
  Settings,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  ArrowUpRight,
  Activity,
  Workflow,
} from 'lucide-react';

// Lazy load sub-components
const ParticipantManagement = lazy(() => import('./ParticipantManagement'));
const CaseManagement = lazy(() => import('./CaseManagement'));
const AJCOperations = lazy(() => import('./AJCOperations'));
const EmployerServices = lazy(() => import('./EmployerServices'));
const WIOAReporting = lazy(() => import('./WIOAReporting'));
const BudgetFiscal = lazy(() => import('./BudgetFiscal'));
const EligibilityWorkflows = lazy(() => import('./EligibilityWorkflows'));

// Types
type DashboardTab = 'overview' | 'participants' | 'cases' | 'ajc' | 'employers' | 'reporting' | 'budget' | 'eligibility';

interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color: string;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  description: string;
  action?: string;
  actionLink?: string;
}

// Sample dashboard data
const QUICK_STATS: QuickStat[] = [
  { label: 'Active Participants', value: '4,287', change: 12.5, changeLabel: 'vs last month', icon: Users, color: 'text-emerald-400' },
  { label: 'Open Cases', value: '1,842', change: -3.2, changeLabel: 'vs last month', icon: FileText, color: 'text-blue-400' },
  { label: 'AJC Visitors Today', value: '274', change: 8.1, changeLabel: 'vs yesterday', icon: Building2, color: 'text-purple-400' },
  { label: 'Active Job Orders', value: '156', change: 15.3, changeLabel: 'vs last month', icon: Briefcase, color: 'text-amber-400' },
  { label: 'Employment Rate Q2', value: '78.5%', change: 3.3, changeLabel: 'vs target', icon: TrendingUp, color: 'text-teal-400' },
  { label: 'Funds Expended', value: '$18.2M', change: 72.4, changeLabel: 'of budget', icon: DollarSign, color: 'text-pink-400' },
];

const ALERTS: AlertItem[] = [
  { id: 'a1', type: 'warning', title: 'PIRL Submission Due', description: 'Q1 2024 PIRL (ETA-9173) submission due in 5 days', action: 'Review Data', actionLink: '#reporting' },
  { id: 'a2', type: 'error', title: 'At-Risk Grant', description: 'Rapid Response grant has low obligation rate (96.7%). Action needed before deadline.', action: 'View Grant', actionLink: '#budget' },
  { id: 'a3', type: 'info', title: 'New Training Provider', description: 'ABC Technical Institute application pending ETPL review', action: 'Review', actionLink: '#participants' },
  { id: 'a4', type: 'success', title: 'Performance Target Met', description: 'Youth Credential Attainment rate exceeds negotiated target by 7.1%', action: 'View Report', actionLink: '#reporting' },
];

const RECENT_ACTIVITY = [
  { id: 'r1', action: 'New participant registered', user: 'Jennifer Adams', time: '10 minutes ago', type: 'participant' },
  { id: 'r2', action: 'ITA approved for MA training', user: 'Michael Chen', time: '25 minutes ago', type: 'training' },
  { id: 'r3', action: 'OJT agreement completed', user: 'David Wilson', time: '1 hour ago', type: 'employer' },
  { id: 'r4', action: 'Case note added', user: 'Jennifer Adams', time: '1.5 hours ago', type: 'case' },
  { id: 'r5', action: 'Job order filled (3/3 positions)', user: 'Business Services', time: '2 hours ago', type: 'employer' },
  { id: 'r6', action: 'Participant exited - employed', user: 'Michael Chen', time: '3 hours ago', type: 'participant' },
];

const PERFORMANCE_SUMMARY = [
  { program: 'Adult', empQ2: 78.5, empQ4: 74.2, earnings: 7250, credential: 68.3, msg: 62.1, targetMet: 5, targetTotal: 5 },
  { program: 'Dislocated Worker', empQ2: 82.3, empQ4: 79.8, earnings: 9450, credential: 72.5, msg: 58.4, targetMet: 5, targetTotal: 5 },
  { program: 'Youth', empQ2: 71.2, empQ4: 68.5, earnings: 4850, credential: 58.9, msg: 55.2, targetMet: 5, targetTotal: 5 },
];

const TAB_CONFIG: { key: DashboardTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'participants', label: 'Participants', icon: Users },
  { key: 'cases', label: 'Case Management', icon: FileText },
  { key: 'ajc', label: 'AJC Operations', icon: Building2 },
  { key: 'employers', label: 'Employer Services', icon: Briefcase },
  { key: 'reporting', label: 'WIOA Reporting', icon: BarChart3 },
  { key: 'budget', label: 'Budget & Fiscal', icon: DollarSign },
  { key: 'eligibility', label: 'Eligibility Workflows', icon: Workflow },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
  </div>
);

export const StateWorkforceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const getAlertStyles = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-400' };
      case 'error':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertTriangle, iconColor: 'text-red-400' };
      case 'success':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle, iconColor: 'text-emerald-400' };
      case 'info':
      default:
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Activity, iconColor: 'text-blue-400' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">State Workforce Board Dashboard</h1>
            <p className="text-slate-400 mt-1">Illinois Department of Employment Security - WIOA Administration</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-slate-400">Program Year</p>
              <p className="text-white font-medium">PY 2023-2024</p>
            </div>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-400 bg-slate-700/30'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-6 gap-4">
              {QUICK_STATS.map((stat, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                      {stat.change !== undefined && (
                        <div className="flex items-center gap-1 mt-1">
                          {stat.change >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-xs ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.change >= 0 ? '+' : ''}{stat.change}%
                          </span>
                          <span className="text-xs text-slate-500">{stat.changeLabel}</span>
                        </div>
                      )}
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts & Activity */}
            <div className="grid grid-cols-2 gap-6">
              {/* Alerts */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Action Items & Alerts
                </h3>
                <div className="space-y-3">
                  {ALERTS.map((alert) => {
                    const styles = getAlertStyles(alert.type);
                    const AlertIcon = styles.icon;
                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${styles.bg} ${styles.border}`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertIcon className={`w-5 h-5 mt-0.5 ${styles.iconColor}`} />
                          <div className="flex-1">
                            <p className="font-medium text-white">{alert.title}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{alert.description}</p>
                          </div>
                          {alert.action && (
                            <button className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors">
                              {alert.action}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'participant' ? 'bg-emerald-400' :
                        activity.type === 'case' ? 'bg-blue-400' :
                        activity.type === 'employer' ? 'bg-amber-400' : 'bg-purple-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.user}</p>
                      </div>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                WIOA Performance Summary (Current Quarter)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                      <th className="pb-3 font-medium">Program</th>
                      <th className="pb-3 font-medium text-center">Employment Q2</th>
                      <th className="pb-3 font-medium text-center">Employment Q4</th>
                      <th className="pb-3 font-medium text-center">Median Earnings</th>
                      <th className="pb-3 font-medium text-center">Credential Rate</th>
                      <th className="pb-3 font-medium text-center">MSG Rate</th>
                      <th className="pb-3 font-medium text-center">Targets Met</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {PERFORMANCE_SUMMARY.map((row) => (
                      <tr key={row.program} className="hover:bg-slate-700/30">
                        <td className="py-3 font-medium text-white">{row.program}</td>
                        <td className="py-3 text-center text-emerald-400">{row.empQ2}%</td>
                        <td className="py-3 text-center text-emerald-400">{row.empQ4}%</td>
                        <td className="py-3 text-center text-white">${row.earnings.toLocaleString()}</td>
                        <td className="py-3 text-center text-blue-400">{row.credential}%</td>
                        <td className="py-3 text-center text-purple-400">{row.msg}%</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            row.targetMet === row.targetTotal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {row.targetMet}/{row.targetTotal}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Register New Participant', icon: Users, tab: 'participants' as DashboardTab },
                { label: 'Create Job Order', icon: Briefcase, tab: 'employers' as DashboardTab },
                { label: 'Run Performance Report', icon: BarChart3, tab: 'reporting' as DashboardTab },
                { label: 'Review Budget Status', icon: DollarSign, tab: 'budget' as DashboardTab },
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(link.tab)}
                  className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <link.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-medium text-white">{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === 'participants' && <ParticipantManagement />}
            {activeTab === 'cases' && <CaseManagement />}
            {activeTab === 'ajc' && <AJCOperations />}
            {activeTab === 'employers' && <EmployerServices />}
            {activeTab === 'reporting' && <WIOAReporting />}
            {activeTab === 'budget' && <BudgetFiscal />}
            {activeTab === 'eligibility' && <EligibilityWorkflows />}
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default StateWorkforceDashboard;
