import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Plus,
  Filter,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  RefreshCw,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react';

// Types
interface GrantAllocation {
  id: string;
  grant_name: string;
  funding_source: 'federal' | 'state' | 'local' | 'other';
  program: string;
  program_year: string;
  total_amount: number;
  obligated: number;
  expended: number;
  available: number;
  obligation_deadline: string;
  expenditure_deadline: string;
  status: 'active' | 'closed' | 'at_risk';
}

interface Expenditure {
  id: string;
  grant_id: string;
  grant_name: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  lwdb?: string;
}

interface BudgetCategory {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentUsed: number;
}

// Sample data
const SAMPLE_GRANTS: GrantAllocation[] = [
  {
    id: 'grant-001',
    grant_name: 'WIOA Title I Adult Formula',
    funding_source: 'federal',
    program: 'WIOA Adult',
    program_year: 'PY 2023',
    total_amount: 8500000,
    obligated: 7200000,
    expended: 5800000,
    available: 1300000,
    obligation_deadline: '2024-06-30',
    expenditure_deadline: '2025-06-30',
    status: 'active',
  },
  {
    id: 'grant-002',
    grant_name: 'WIOA Title I Dislocated Worker Formula',
    funding_source: 'federal',
    program: 'Dislocated Worker',
    program_year: 'PY 2023',
    total_amount: 6200000,
    obligated: 5500000,
    expended: 4200000,
    available: 700000,
    obligation_deadline: '2024-06-30',
    expenditure_deadline: '2025-06-30',
    status: 'active',
  },
  {
    id: 'grant-003',
    grant_name: 'WIOA Title I Youth Formula',
    funding_source: 'federal',
    program: 'WIOA Youth',
    program_year: 'PY 2023',
    total_amount: 5800000,
    obligated: 4800000,
    expended: 3500000,
    available: 1000000,
    obligation_deadline: '2024-06-30',
    expenditure_deadline: '2025-06-30',
    status: 'active',
  },
  {
    id: 'grant-004',
    grant_name: 'Wagner-Peyser',
    funding_source: 'federal',
    program: 'Wagner-Peyser',
    program_year: 'PY 2023',
    total_amount: 3200000,
    obligated: 2900000,
    expended: 2600000,
    available: 300000,
    obligation_deadline: '2024-06-30',
    expenditure_deadline: '2024-09-30',
    status: 'active',
  },
  {
    id: 'grant-005',
    grant_name: 'Rapid Response',
    funding_source: 'federal',
    program: 'Rapid Response',
    program_year: 'PY 2023',
    total_amount: 1500000,
    obligated: 1450000,
    expended: 1380000,
    available: 50000,
    obligation_deadline: '2024-06-30',
    expenditure_deadline: '2024-09-30',
    status: 'at_risk',
  },
  {
    id: 'grant-006',
    grant_name: 'State Workforce Innovation Fund',
    funding_source: 'state',
    program: 'Innovation',
    program_year: 'FY 2024',
    total_amount: 2000000,
    obligated: 1200000,
    expended: 800000,
    available: 800000,
    obligation_deadline: '2024-12-31',
    expenditure_deadline: '2025-06-30',
    status: 'active',
  },
];

const SAMPLE_EXPENDITURES: Expenditure[] = [
  { id: 'exp-001', grant_id: 'grant-001', grant_name: 'WIOA Adult', category: 'Training Services', description: 'ITA payments - January batch', amount: 125000, date: '2024-02-01', status: 'processed', lwdb: 'Central IL' },
  { id: 'exp-002', grant_id: 'grant-001', grant_name: 'WIOA Adult', category: 'Supportive Services', description: 'Transportation and childcare assistance', amount: 28500, date: '2024-02-05', status: 'processed', lwdb: 'Central IL' },
  { id: 'exp-003', grant_id: 'grant-002', grant_name: 'Dislocated Worker', category: 'Training Services', description: 'OJT reimbursements - Q1', amount: 85000, date: '2024-02-08', status: 'approved', lwdb: 'Peoria Area' },
  { id: 'exp-004', grant_id: 'grant-003', grant_name: 'WIOA Youth', category: 'Work Experience', description: 'Youth wages - February', amount: 45000, date: '2024-02-10', status: 'pending', lwdb: 'Rockford' },
  { id: 'exp-005', grant_id: 'grant-001', grant_name: 'WIOA Adult', category: 'Administrative', description: 'Staff salaries - February', amount: 65000, date: '2024-02-15', status: 'pending', lwdb: 'State Admin' },
  { id: 'exp-006', grant_id: 'grant-004', grant_name: 'Wagner-Peyser', category: 'Operations', description: 'AJC facility costs', amount: 32000, date: '2024-02-01', status: 'processed' },
];

const BUDGET_CATEGORIES: BudgetCategory[] = [
  { category: 'Training Services (ITAs)', budgeted: 8500000, actual: 7200000, variance: 1300000, percentUsed: 84.7 },
  { category: 'On-the-Job Training', budgeted: 2500000, actual: 2100000, variance: 400000, percentUsed: 84.0 },
  { category: 'Supportive Services', budgeted: 1800000, actual: 1650000, variance: 150000, percentUsed: 91.7 },
  { category: 'Work Experience (Youth)', budgeted: 2200000, actual: 1800000, variance: 400000, percentUsed: 81.8 },
  { category: 'Career Services', budgeted: 3500000, actual: 3200000, variance: 300000, percentUsed: 91.4 },
  { category: 'Administrative', budgeted: 2000000, actual: 1750000, variance: 250000, percentUsed: 87.5 },
];

const FUNDING_SOURCE_CONFIG = {
  federal: { label: 'Federal', color: 'bg-blue-500' },
  state: { label: 'State', color: 'bg-emerald-500' },
  local: { label: 'Local', color: 'bg-purple-500' },
  other: { label: 'Other', color: 'bg-amber-500' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-500' },
  closed: { label: 'Closed', color: 'bg-slate-500' },
  at_risk: { label: 'At Risk', color: 'bg-red-500' },
};

const EXPENDITURE_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-500' },
  approved: { label: 'Approved', color: 'bg-blue-500' },
  processed: { label: 'Processed', color: 'bg-emerald-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
};

export const BudgetFiscal: React.FC = () => {
  const [grants] = useState<GrantAllocation[]>(SAMPLE_GRANTS);
  const [expenditures] = useState<Expenditure[]>(SAMPLE_EXPENDITURES);
  const [selectedGrant, setSelectedGrant] = useState<GrantAllocation | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'grants' | 'expenditures' | 'budget'>('overview');
  const [showAddExpenditureModal, setShowAddExpenditureModal] = useState(false);

  // Calculate totals
  const totals = {
    totalAllocated: grants.reduce((sum, g) => sum + g.total_amount, 0),
    totalObligated: grants.reduce((sum, g) => sum + g.obligated, 0),
    totalExpended: grants.reduce((sum, g) => sum + g.expended, 0),
    totalAvailable: grants.reduce((sum, g) => sum + g.available, 0),
    atRiskCount: grants.filter((g) => g.status === 'at_risk').length,
    pendingExpenses: expenditures.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUtilizationColor = (percent: number) => {
    if (percent >= 90) return 'text-emerald-400';
    if (percent >= 70) return 'text-blue-400';
    if (percent >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-emerald-500';
    if (percent >= 70) return 'bg-blue-500';
    if (percent >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget & Fiscal Management</h2>
          <p className="text-slate-400 mt-1">
            Grant allocations, expenditure tracking, and budget monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setShowAddExpenditureModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Expenditure
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Allocated</p>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(totals.totalAllocated)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Obligated</p>
              <p className="text-xl font-bold text-blue-400 mt-1">{formatCurrency(totals.totalObligated)}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Expended</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(totals.totalExpended)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Available</p>
              <p className="text-xl font-bold text-amber-400 mt-1">{formatCurrency(totals.totalAvailable)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">At Risk Grants</p>
              <p className="text-xl font-bold text-red-400 mt-1">{totals.atRiskCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-xl font-bold text-purple-400 mt-1">{formatCurrency(totals.pendingExpenses)}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="border-b border-slate-700 px-4">
          <div className="flex gap-6">
            {[
              { key: 'overview', label: 'Overview', icon: PieChart },
              { key: 'grants', label: 'Grant Allocations', icon: DollarSign },
              { key: 'expenditures', label: 'Expenditures', icon: ArrowDownRight },
              { key: 'budget', label: 'Budget Categories', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Utilization by Program */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Fund Utilization by Program</h4>
                <div className="space-y-4">
                  {grants.slice(0, 4).map((grant) => {
                    const utilizationPercent = (grant.expended / grant.total_amount) * 100;
                    return (
                      <div key={grant.id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-300">{grant.program}</span>
                          <span className={getUtilizationColor(utilizationPercent)}>
                            {utilizationPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getProgressColor(utilizationPercent)}`}
                            style={{ width: `${utilizationPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Expended: {formatCurrency(grant.expended)}</span>
                          <span>Total: {formatCurrency(grant.total_amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Upcoming Deadlines</h4>
                <div className="space-y-3">
                  {grants
                    .sort((a, b) => new Date(a.obligation_deadline).getTime() - new Date(b.obligation_deadline).getTime())
                    .slice(0, 5)
                    .map((grant) => {
                      const daysLeft = daysUntil(grant.obligation_deadline);
                      return (
                        <div key={grant.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-white">{grant.grant_name}</p>
                            <p className="text-xs text-slate-400">Obligation deadline</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${daysLeft < 30 ? 'text-red-400' : daysLeft < 90 ? 'text-amber-400' : 'text-slate-300'}`}>
                              {daysLeft} days
                            </p>
                            <p className="text-xs text-slate-500">{formatDate(grant.obligation_deadline)}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Recent Expenditures */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Recent Expenditures</h4>
                <div className="space-y-3">
                  {expenditures.slice(0, 5).map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{exp.description}</p>
                        <p className="text-xs text-slate-400">{exp.category} • {exp.grant_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(exp.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${EXPENDITURE_STATUS_CONFIG[exp.status].color} text-white`}>
                          {EXPENDITURE_STATUS_CONFIG[exp.status].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding Source Breakdown */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-4">Funding Sources</h4>
                <div className="space-y-4">
                  {(['federal', 'state', 'local'] as const).map((source) => {
                    const sourceGrants = grants.filter((g) => g.funding_source === source);
                    const totalForSource = sourceGrants.reduce((sum, g) => sum + g.total_amount, 0);
                    const percentOfTotal = (totalForSource / totals.totalAllocated) * 100;
                    return (
                      <div key={source} className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded ${FUNDING_SOURCE_CONFIG[source].color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">{FUNDING_SOURCE_CONFIG[source].label}</span>
                            <span className="text-sm font-medium text-white">{formatCurrency(totalForSource)}</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${FUNDING_SOURCE_CONFIG[source].color}`}
                              style={{ width: `${percentOfTotal}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">{percentOfTotal.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grants' && (
            <div className="space-y-4">
              {grants.map((grant) => {
                const obligationPercent = (grant.obligated / grant.total_amount) * 100;
                const expenditurePercent = (grant.expended / grant.total_amount) * 100;
                const daysToObligation = daysUntil(grant.obligation_deadline);

                return (
                  <div
                    key={grant.id}
                    className="bg-slate-900 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedGrant(grant)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{grant.grant_name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs text-white ${FUNDING_SOURCE_CONFIG[grant.funding_source].color}`}>
                            {FUNDING_SOURCE_CONFIG[grant.funding_source].label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs text-white ${STATUS_CONFIG[grant.status].color}`}>
                            {STATUS_CONFIG[grant.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{grant.program} • {grant.program_year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatCurrency(grant.total_amount)}</p>
                        <p className="text-sm text-slate-400">Total Allocation</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Obligated</p>
                        <p className="text-lg font-bold text-blue-400">{formatCurrency(grant.obligated)}</p>
                        <p className="text-xs text-slate-500">{obligationPercent.toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Expended</p>
                        <p className="text-lg font-bold text-emerald-400">{formatCurrency(grant.expended)}</p>
                        <p className="text-xs text-slate-500">{expenditurePercent.toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Available</p>
                        <p className="text-lg font-bold text-amber-400">{formatCurrency(grant.available)}</p>
                        <p className="text-xs text-slate-500">{((grant.available / grant.total_amount) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Obligation Deadline</p>
                        <p className={`text-lg font-bold ${daysToObligation < 30 ? 'text-red-400' : daysToObligation < 90 ? 'text-amber-400' : 'text-slate-300'}`}>
                          {daysToObligation} days
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(grant.obligation_deadline)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Obligation Progress</span>
                          <span>{obligationPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${obligationPercent}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Expenditure Progress</span>
                          <span>{expenditurePercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${expenditurePercent}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'expenditures' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Grant</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">LWDB</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {expenditures.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/50">
                      <td className="py-3">
                        <span className="font-medium text-white">{exp.description}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-300">{exp.grant_name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{exp.category}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{exp.lwdb || 'Statewide'}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-white">{formatCurrency(exp.amount)}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-400">{formatDate(exp.date)}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${EXPENDITURE_STATUS_CONFIG[exp.status].color}`}>
                          {EXPENDITURE_STATUS_CONFIG[exp.status].label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          {exp.status === 'pending' && (
                            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </button>
                          )}
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-4">
              {BUDGET_CATEGORIES.map((cat) => {
                const isOverBudget = cat.actual > cat.budgeted;
                return (
                  <div key={cat.category} className="bg-slate-900 rounded-lg border border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{cat.category}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Budgeted</p>
                          <p className="font-medium text-white">{formatCurrency(cat.budgeted)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Actual</p>
                          <p className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                            {formatCurrency(cat.actual)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Variance</p>
                          <p className={`font-medium ${cat.variance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {cat.variance >= 0 ? '+' : ''}{formatCurrency(cat.variance)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Utilization</span>
                        <span className={getUtilizationColor(cat.percentUsed)}>{cat.percentUsed.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getProgressColor(cat.percentUsed)}`}
                          style={{ width: `${Math.min(100, cat.percentUsed)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Expenditure Modal */}
      {showAddExpenditureModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddExpenditureModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Record Expenditure</h3>
              <button
                onClick={() => setShowAddExpenditureModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Grant *</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Select grant</option>
                  {grants.map((g) => (
                    <option key={g.id} value={g.id}>{g.grant_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category *</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Select category</option>
                  {BUDGET_CATEGORIES.map((c) => (
                    <option key={c.category} value={c.category}>{c.category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Amount *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">LWDB (Optional)</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Statewide</option>
                  <option value="central">Central Illinois</option>
                  <option value="peoria">Peoria Area</option>
                  <option value="rockford">Rockford</option>
                  <option value="champaign">Champaign County</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddExpenditureModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                Record Expenditure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetFiscal;
