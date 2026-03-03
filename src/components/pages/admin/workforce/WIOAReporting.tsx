import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Briefcase,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
  Printer,
  HelpCircle,
} from 'lucide-react';

// Types
interface PerformanceIndicator {
  id: string;
  name: string;
  description: string;
  program: 'adult' | 'dislocated_worker' | 'youth' | 'all';
  current_value: number;
  target_value: number;
  previous_value: number;
  unit: 'percent' | 'currency' | 'number';
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  frequency: 'quarterly' | 'annual' | 'monthly';
  eta_form: string;
  due_date?: string;
  status: 'due' | 'submitted' | 'overdue' | 'upcoming';
  last_submitted?: string;
}

interface QuarterlyData {
  quarter: string;
  adult: { exiters: number; employed_q2: number; employed_q4: number; median_earnings: number };
  dislocated_worker: { exiters: number; employed_q2: number; employed_q4: number; median_earnings: number };
  youth: { exiters: number; employed_q2: number; employed_q4: number; median_earnings: number };
}

// Sample data
const PERFORMANCE_INDICATORS: PerformanceIndicator[] = [
  // Adult Program
  { id: 'adult-emp-q2', name: 'Employment Rate Q2', description: 'Employment in the 2nd quarter after exit', program: 'adult', current_value: 78.5, target_value: 76.0, previous_value: 75.2, unit: 'percent' },
  { id: 'adult-emp-q4', name: 'Employment Rate Q4', description: 'Employment in the 4th quarter after exit', program: 'adult', current_value: 74.2, target_value: 73.0, previous_value: 72.8, unit: 'percent' },
  { id: 'adult-earnings', name: 'Median Earnings Q2', description: 'Median earnings in the 2nd quarter after exit', program: 'adult', current_value: 7250, target_value: 6800, previous_value: 6950, unit: 'currency' },
  { id: 'adult-credential', name: 'Credential Attainment', description: 'Credential attainment within 1 year of exit', program: 'adult', current_value: 68.3, target_value: 65.0, previous_value: 64.5, unit: 'percent' },
  { id: 'adult-msg', name: 'Measurable Skill Gains', description: 'Participants achieving measurable skill gains', program: 'adult', current_value: 62.1, target_value: 58.0, previous_value: 55.8, unit: 'percent' },

  // Dislocated Worker Program
  { id: 'dw-emp-q2', name: 'Employment Rate Q2', description: 'Employment in the 2nd quarter after exit', program: 'dislocated_worker', current_value: 82.3, target_value: 80.0, previous_value: 79.5, unit: 'percent' },
  { id: 'dw-emp-q4', name: 'Employment Rate Q4', description: 'Employment in the 4th quarter after exit', program: 'dislocated_worker', current_value: 79.8, target_value: 78.0, previous_value: 77.2, unit: 'percent' },
  { id: 'dw-earnings', name: 'Median Earnings Q2', description: 'Median earnings in the 2nd quarter after exit', program: 'dislocated_worker', current_value: 9450, target_value: 8500, previous_value: 8850, unit: 'currency' },
  { id: 'dw-credential', name: 'Credential Attainment', description: 'Credential attainment within 1 year of exit', program: 'dislocated_worker', current_value: 72.5, target_value: 70.0, previous_value: 68.9, unit: 'percent' },
  { id: 'dw-msg', name: 'Measurable Skill Gains', description: 'Participants achieving measurable skill gains', program: 'dislocated_worker', current_value: 58.4, target_value: 55.0, previous_value: 53.2, unit: 'percent' },

  // Youth Program
  { id: 'youth-emp-q2', name: 'Employment/Education Rate Q2', description: 'Employment or education in Q2 after exit', program: 'youth', current_value: 71.2, target_value: 68.0, previous_value: 67.5, unit: 'percent' },
  { id: 'youth-emp-q4', name: 'Employment/Education Rate Q4', description: 'Employment or education in Q4 after exit', program: 'youth', current_value: 68.5, target_value: 65.0, previous_value: 64.8, unit: 'percent' },
  { id: 'youth-earnings', name: 'Median Earnings Q2', description: 'Median earnings in the 2nd quarter after exit', program: 'youth', current_value: 4850, target_value: 4200, previous_value: 4350, unit: 'currency' },
  { id: 'youth-credential', name: 'Credential Attainment', description: 'Credential attainment within 1 year of exit', program: 'youth', current_value: 58.9, target_value: 55.0, previous_value: 52.3, unit: 'percent' },
  { id: 'youth-msg', name: 'Measurable Skill Gains', description: 'Participants achieving measurable skill gains', program: 'youth', current_value: 55.2, target_value: 50.0, previous_value: 48.5, unit: 'percent' },
];

const REPORT_TYPES: ReportType[] = [
  { id: 'eta-9169', name: 'ETA-9169 WIOA Annual Report', description: 'Annual performance report for WIOA Title I programs', frequency: 'annual', eta_form: 'ETA-9169', due_date: '2024-10-01', status: 'upcoming', last_submitted: '2023-10-01' },
  { id: 'eta-9173', name: 'ETA-9173 Participant Individual Record Layout', description: 'Quarterly participant data submission (PIRL)', frequency: 'quarterly', eta_form: 'ETA-9173', due_date: '2024-04-15', status: 'due', last_submitted: '2024-01-15' },
  { id: 'eta-9170', name: 'ETA-9170 Wagner-Peyser Report', description: 'Quarterly Wagner-Peyser performance report', frequency: 'quarterly', eta_form: 'ETA-9170', due_date: '2024-04-15', status: 'due', last_submitted: '2024-01-15' },
  { id: 'eta-9171', name: 'ETA-9171 Financial Report', description: 'Quarterly financial status report', frequency: 'quarterly', eta_form: 'ETA-9171', due_date: '2024-04-30', status: 'upcoming', last_submitted: '2024-01-30' },
  { id: 'eta-9172', name: 'ETA-9172 Trade Act Report', description: 'Quarterly Trade Adjustment Assistance report', frequency: 'quarterly', eta_form: 'ETA-9172', due_date: '2024-04-15', status: 'due', last_submitted: '2024-01-15' },
];

const QUARTERLY_DATA: QuarterlyData[] = [
  { quarter: 'Q1 2024', adult: { exiters: 1245, employed_q2: 978, employed_q4: 924, median_earnings: 7250 }, dislocated_worker: { exiters: 892, employed_q2: 734, employed_q4: 712, median_earnings: 9450 }, youth: { exiters: 456, employed_q2: 325, employed_q4: 312, median_earnings: 4850 } },
  { quarter: 'Q4 2023', adult: { exiters: 1189, employed_q2: 893, employed_q4: 865, median_earnings: 6950 }, dislocated_worker: { exiters: 845, employed_q2: 671, employed_q4: 652, median_earnings: 8850 }, youth: { exiters: 423, employed_q2: 285, employed_q4: 274, median_earnings: 4350 } },
  { quarter: 'Q3 2023', adult: { exiters: 1156, employed_q2: 867, employed_q4: 835, median_earnings: 6820 }, dislocated_worker: { exiters: 812, employed_q2: 642, employed_q4: 618, median_earnings: 8650 }, youth: { exiters: 398, employed_q2: 265, employed_q4: 251, median_earnings: 4180 } },
  { quarter: 'Q2 2023', adult: { exiters: 1098, employed_q2: 812, employed_q4: 785, median_earnings: 6750 }, dislocated_worker: { exiters: 756, employed_q2: 589, employed_q4: 568, median_earnings: 8420 }, youth: { exiters: 367, employed_q2: 241, employed_q4: 228, median_earnings: 4050 } },
];

const PROGRAM_LABELS = {
  adult: 'WIOA Adult',
  dislocated_worker: 'Dislocated Worker',
  youth: 'WIOA Youth',
  all: 'All Programs',
};

const STATUS_CONFIG = {
  due: { label: 'Due Soon', color: 'bg-amber-500', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-emerald-500', icon: CheckCircle },
  overdue: { label: 'Overdue', color: 'bg-red-500', icon: AlertTriangle },
  upcoming: { label: 'Upcoming', color: 'bg-slate-500', icon: Calendar },
};

export const WIOAReporting: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'reports' | 'data'>('performance');

  const filteredIndicators = PERFORMANCE_INDICATORS.filter(
    (ind) => selectedProgram === 'all' || ind.program === selectedProgram || ind.program === 'all'
  );

  const formatValue = (value: number, unit: string) => {
    if (unit === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    }
    if (unit === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const getPerformanceStatus = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio >= 1) return { status: 'exceeding', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', label: 'Exceeding' };
    if (ratio >= 0.9) return { status: 'meeting', color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'Meeting' };
    if (ratio >= 0.8) return { status: 'approaching', color: 'text-amber-400', bgColor: 'bg-amber-500/20', label: 'Approaching' };
    return { status: 'below', color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Below Target' };
  };

  const getTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      value: Math.abs(change).toFixed(1),
      icon: change >= 0 ? TrendingUp : TrendingDown,
      color: change >= 0 ? 'text-emerald-400' : 'text-red-400',
    };
  };

  // Calculate aggregate stats
  const aggregateStats = {
    totalExiters: QUARTERLY_DATA[0].adult.exiters + QUARTERLY_DATA[0].dislocated_worker.exiters + QUARTERLY_DATA[0].youth.exiters,
    avgEmploymentQ2: ((QUARTERLY_DATA[0].adult.employed_q2 / QUARTERLY_DATA[0].adult.exiters) * 100).toFixed(1),
    meetingTargets: PERFORMANCE_INDICATORS.filter((ind) => ind.current_value >= ind.target_value).length,
    totalIndicators: PERFORMANCE_INDICATORS.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">WIOA Reporting</h2>
          <p className="text-slate-400 mt-1">
            Performance indicators, federal reports, and outcome tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Exiters (Q1)</p>
              <p className="text-2xl font-bold text-white mt-1">{aggregateStats.totalExiters.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Employment Q2</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{aggregateStats.avgEmploymentQ2}%</p>
            </div>
            <Briefcase className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Meeting Targets</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{aggregateStats.meetingTargets}/{aggregateStats.totalIndicators}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Reports Due</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{REPORT_TYPES.filter((r) => r.status === 'due').length}</p>
            </div>
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="border-b border-slate-700 px-4">
          <div className="flex gap-6">
            {[
              { key: 'performance', label: 'Performance Indicators', icon: BarChart3 },
              { key: 'reports', label: 'Federal Reports', icon: FileText },
              { key: 'data', label: 'Quarterly Data', icon: PieChart },
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
          {activeTab === 'performance' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Programs</option>
                  <option value="adult">WIOA Adult</option>
                  <option value="dislocated_worker">Dislocated Worker</option>
                  <option value="youth">WIOA Youth</option>
                </select>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="current">Current Quarter (Q1 2024)</option>
                  <option value="q4-2023">Q4 2023</option>
                  <option value="q3-2023">Q3 2023</option>
                  <option value="annual">Annual (PY 2023)</option>
                </select>
              </div>

              {/* Performance Indicators */}
              <div className="space-y-3">
                {filteredIndicators.map((indicator) => {
                  const status = getPerformanceStatus(indicator.current_value, indicator.target_value);
                  const trend = getTrend(indicator.current_value, indicator.previous_value);
                  const TrendIcon = trend.icon;
                  const isExpanded = expandedIndicator === indicator.id;

                  return (
                    <div
                      key={indicator.id}
                      className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${status.bgColor} flex items-center justify-center`}>
                              <span className={`text-lg font-bold ${status.color}`}>
                                {indicator.unit === 'percent' ? `${Math.round(indicator.current_value)}%` : ''}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white">{indicator.name}</h4>
                                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                                  {PROGRAM_LABELS[indicator.program]}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400">{indicator.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${status.color}`}>
                                {formatValue(indicator.current_value, indicator.unit)}
                              </p>
                              <p className="text-sm text-slate-500">
                                Target: {formatValue(indicator.target_value, indicator.unit)}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1 ${trend.color}`}>
                              <TrendIcon className="w-4 h-4" />
                              <span className="text-sm">{trend.value}%</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                              {status.label}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-700 pt-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-slate-400 text-sm">Current Period</p>
                              <p className="text-xl font-bold text-white mt-1">
                                {formatValue(indicator.current_value, indicator.unit)}
                              </p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-slate-400 text-sm">Negotiated Target</p>
                              <p className="text-xl font-bold text-blue-400 mt-1">
                                {formatValue(indicator.target_value, indicator.unit)}
                              </p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-slate-400 text-sm">Previous Period</p>
                              <p className="text-xl font-bold text-slate-300 mt-1">
                                {formatValue(indicator.previous_value, indicator.unit)}
                              </p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                              <p className="text-slate-400 text-sm">Performance %</p>
                              <p className={`text-xl font-bold mt-1 ${status.color}`}>
                                {((indicator.current_value / indicator.target_value) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-400">Progress to Target</span>
                              <span className={status.color}>
                                {Math.min(100, (indicator.current_value / indicator.target_value) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  status.status === 'exceeding' ? 'bg-emerald-500' :
                                  status.status === 'meeting' ? 'bg-blue-500' :
                                  status.status === 'approaching' ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(100, (indicator.current_value / indicator.target_value) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {REPORT_TYPES.map((report) => {
                  const StatusIcon = STATUS_CONFIG[report.status].icon;
                  return (
                    <div key={report.id} className="bg-slate-900 rounded-lg border border-slate-700 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-white">{report.name}</h4>
                              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                                {report.eta_form}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400 capitalize">
                                {report.frequency}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{report.description}</p>
                            {report.last_submitted && (
                              <p className="text-xs text-slate-500 mt-1">
                                Last submitted: {new Date(report.last_submitted).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {report.due_date && (
                            <div className="text-right">
                              <p className="text-sm text-slate-400">Due Date</p>
                              <p className={`font-medium ${
                                report.status === 'overdue' ? 'text-red-400' :
                                report.status === 'due' ? 'text-amber-400' : 'text-slate-300'
                              }`}>
                                {new Date(report.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          )}
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white ${STATUS_CONFIG[report.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {STATUS_CONFIG[report.status].label}
                          </span>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View Report">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Download">
                              <Download className="w-4 h-4 text-slate-400" />
                            </button>
                            {(report.status === 'due' || report.status === 'overdue') && (
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
                                <Send className="w-4 h-4" />
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Quarter</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300" colSpan={4}>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">Adult</span>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300" colSpan={4}>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">Dislocated Worker</span>
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300" colSpan={4}>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">Youth</span>
                        </div>
                      </th>
                    </tr>
                    <tr className="border-b border-slate-700 text-xs text-slate-400">
                      <th className="py-2 px-4"></th>
                      <th className="py-2 px-2">Exiters</th>
                      <th className="py-2 px-2">Emp Q2</th>
                      <th className="py-2 px-2">Emp Q4</th>
                      <th className="py-2 px-2">Med Earn</th>
                      <th className="py-2 px-2">Exiters</th>
                      <th className="py-2 px-2">Emp Q2</th>
                      <th className="py-2 px-2">Emp Q4</th>
                      <th className="py-2 px-2">Med Earn</th>
                      <th className="py-2 px-2">Exiters</th>
                      <th className="py-2 px-2">Emp Q2</th>
                      <th className="py-2 px-2">Emp Q4</th>
                      <th className="py-2 px-2">Med Earn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUARTERLY_DATA.map((quarter, idx) => (
                      <tr key={quarter.quarter} className={`border-b border-slate-800 ${idx === 0 ? 'bg-slate-800/30' : ''}`}>
                        <td className="py-3 px-4 font-medium text-white">{quarter.quarter}</td>
                        {/* Adult */}
                        <td className="py-3 px-2 text-slate-300">{quarter.adult.exiters.toLocaleString()}</td>
                        <td className="py-3 px-2 text-emerald-400">{quarter.adult.employed_q2.toLocaleString()}</td>
                        <td className="py-3 px-2 text-emerald-400">{quarter.adult.employed_q4.toLocaleString()}</td>
                        <td className="py-3 px-2 text-slate-300">${quarter.adult.median_earnings.toLocaleString()}</td>
                        {/* Dislocated Worker */}
                        <td className="py-3 px-2 text-slate-300">{quarter.dislocated_worker.exiters.toLocaleString()}</td>
                        <td className="py-3 px-2 text-blue-400">{quarter.dislocated_worker.employed_q2.toLocaleString()}</td>
                        <td className="py-3 px-2 text-blue-400">{quarter.dislocated_worker.employed_q4.toLocaleString()}</td>
                        <td className="py-3 px-2 text-slate-300">${quarter.dislocated_worker.median_earnings.toLocaleString()}</td>
                        {/* Youth */}
                        <td className="py-3 px-2 text-slate-300">{quarter.youth.exiters.toLocaleString()}</td>
                        <td className="py-3 px-2 text-purple-400">{quarter.youth.employed_q2.toLocaleString()}</td>
                        <td className="py-3 px-2 text-purple-400">{quarter.youth.employed_q4.toLocaleString()}</td>
                        <td className="py-3 px-2 text-slate-300">${quarter.youth.median_earnings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Data sourced from PIRL (ETA-9172) submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WIOAReporting;
