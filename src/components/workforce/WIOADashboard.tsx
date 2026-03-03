// @ts-nocheck
// ===========================================
// WIOA Performance Dashboard Component
// Real-time tracking of WIOA Primary Indicators
// Based on DOL ETA performance requirements
// ===========================================

import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Award,
  CheckCircle, AlertTriangle, Clock, Download, RefreshCw, Filter,
  ChevronDown, ChevronRight, Calendar, MapPin, Building2, Target,
  Info, ArrowUpRight, ArrowDownRight, Briefcase, GraduationCap
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface PerformanceIndicator {
  id: string;
  name: string;
  shortName: string;
  description: string;
  negotiatedGoal: number;
  actual: number;
  priorYear: number;
  isPercentage: boolean;
  isCurrency: boolean;
}

interface ProgramData {
  programId: string;
  programName: string;
  indicators: PerformanceIndicator[];
  totalParticipants: number;
  totalExiters: number;
  budgetAllocated: number;
  budgetExpended: number;
}

interface RegionalData {
  lwdbId: string;
  lwdbName: string;
  programs: ProgramData[];
}

// ===========================================
// SAMPLE DATA - Replace with real API calls
// ===========================================
const SAMPLE_INDICATORS: PerformanceIndicator[] = [
  {
    id: 'emp_q2',
    name: 'Employment Rate - 2nd Quarter After Exit',
    shortName: 'Emp Q2',
    description: 'Percentage of participants in unsubsidized employment during 2nd quarter after exit',
    negotiatedGoal: 72.0,
    actual: 74.5,
    priorYear: 71.2,
    isPercentage: true,
    isCurrency: false
  },
  {
    id: 'emp_q4',
    name: 'Employment Rate - 4th Quarter After Exit',
    shortName: 'Emp Q4',
    description: 'Percentage of participants in unsubsidized employment during 4th quarter after exit',
    negotiatedGoal: 70.0,
    actual: 71.2,
    priorYear: 68.8,
    isPercentage: true,
    isCurrency: false
  },
  {
    id: 'median_earnings',
    name: 'Median Earnings - 2nd Quarter After Exit',
    shortName: 'Median Earnings',
    description: 'Median earnings of participants employed in 2nd quarter after exit',
    negotiatedGoal: 6800,
    actual: 7245,
    priorYear: 6520,
    isPercentage: false,
    isCurrency: true
  },
  {
    id: 'credential',
    name: 'Credential Attainment Rate',
    shortName: 'Credential',
    description: 'Percentage attaining recognized credential within 1 year after exit',
    negotiatedGoal: 65.0,
    actual: 68.3,
    priorYear: 62.1,
    isPercentage: true,
    isCurrency: false
  },
  {
    id: 'msg',
    name: 'Measurable Skill Gains',
    shortName: 'Skill Gains',
    description: 'Percentage achieving measurable skill gains during program year',
    negotiatedGoal: 55.0,
    actual: 59.1,
    priorYear: 52.4,
    isPercentage: true,
    isCurrency: false
  },
  {
    id: 'employer_eff',
    name: 'Effectiveness in Serving Employers',
    shortName: 'Employer Eff.',
    description: 'Employer retention rate and penetration measures',
    negotiatedGoal: 60.0,
    actual: 62.8,
    priorYear: 58.3,
    isPercentage: true,
    isCurrency: false
  }
];

const PROGRAMS = [
  { id: 'adult', name: 'Title I - Adult', icon: Users, color: 'blue' },
  { id: 'dw', name: 'Title I - Dislocated Worker', icon: Briefcase, color: 'violet' },
  { id: 'youth', name: 'Title I - Youth', icon: GraduationCap, color: 'amber' },
  { id: 'wp', name: 'Title III - Wagner-Peyser', icon: Building2, color: 'emerald' }
];

const LWDBS = [
  { id: 'lwdb1', name: 'Capital Region WDB', participants: 12450, performance: 103 },
  { id: 'lwdb2', name: 'Greater Metro WDB', participants: 28900, performance: 98 },
  { id: 'lwdb3', name: 'Northern Counties WDB', participants: 8750, performance: 107 },
  { id: 'lwdb4', name: 'Southern Region WDB', participants: 15200, performance: 95 },
  { id: 'lwdb5', name: 'Coastal WDB', participants: 11800, performance: 101 }
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const formatValue = (value: number, isPercentage: boolean, isCurrency: boolean): string => {
  if (isCurrency) {
    return `$${value.toLocaleString()}`;
  }
  if (isPercentage) {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString();
};

const getPerformanceStatus = (actual: number, goal: number): 'exceeds' | 'meets' | 'below' => {
  const ratio = actual / goal;
  if (ratio >= 1.0) return 'exceeds';
  if (ratio >= 0.9) return 'meets';
  return 'below';
};

const getStatusColor = (status: 'exceeds' | 'meets' | 'below'): string => {
  switch (status) {
    case 'exceeds': return 'emerald';
    case 'meets': return 'amber';
    case 'below': return 'red';
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================
interface WIOADashboardProps {
  statewide?: boolean;
  lwdbId?: string;
  programYear?: string;
  showExportButton?: boolean;
}

const WIOADashboard: React.FC<WIOADashboardProps> = ({
  statewide = true,
  lwdbId,
  programYear = 'PY 2024',
  showExportButton = true
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q4');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  // Calculate overall performance
  const overallPerformance = SAMPLE_INDICATORS.reduce((acc, ind) => {
    const status = getPerformanceStatus(ind.actual, ind.negotiatedGoal);
    if (status === 'exceeds') acc.exceeds++;
    else if (status === 'meets') acc.meets++;
    else acc.below++;
    return acc;
  }, { exceeds: 0, meets: 0, below: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-400" />
            WIOA Performance Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            {statewide ? 'Statewide' : 'Local Board'} Performance - {programYear}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filters */}
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
          >
            <option value="all">All Programs</option>
            {PROGRAMS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
          >
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
          {showExportButton && (
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-gray-400">Exceeding Goals</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{overallPerformance.exceeds}</div>
          <div className="text-sm text-gray-500">of 6 indicators</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-gray-400">Meeting Goals</span>
          </div>
          <div className="text-3xl font-bold text-amber-400">{overallPerformance.meets}</div>
          <div className="text-sm text-gray-500">of 6 indicators</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-gray-400">Below Goals</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{overallPerformance.below}</div>
          <div className="text-sm text-gray-500">of 6 indicators</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">Total Participants</span>
          </div>
          <div className="text-3xl font-bold text-white">87,450</div>
          <div className="flex items-center gap-1 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            +12% vs prior year
          </div>
        </div>
      </div>

      {/* Primary Indicators Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-white">Primary Indicators of Performance</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Info className="w-4 h-4" />
            WIOA Section 116(b)(2)(A)
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Indicator</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Negotiated Goal</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Actual</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">% of Goal</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Prior Year</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Trend</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {SAMPLE_INDICATORS.map((indicator) => {
                const status = getPerformanceStatus(indicator.actual, indicator.negotiatedGoal);
                const statusColor = getStatusColor(status);
                const percentOfGoal = (indicator.actual / indicator.negotiatedGoal * 100).toFixed(1);
                const yearOverYearChange = indicator.actual - indicator.priorYear;
                const isPositive = yearOverYearChange > 0;

                return (
                  <tr
                    key={indicator.id}
                    className="hover:bg-slate-700/30 cursor-pointer"
                    onClick={() => setExpandedIndicator(expandedIndicator === indicator.id ? null : indicator.id)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${expandedIndicator === indicator.id ? 'rotate-90' : ''}`} />
                        <div>
                          <div className="font-medium text-white">{indicator.shortName}</div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">{indicator.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-400">
                      {formatValue(indicator.negotiatedGoal, indicator.isPercentage, indicator.isCurrency)}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-white">
                      {formatValue(indicator.actual, indicator.isPercentage, indicator.isCurrency)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-medium text-${statusColor}-400`}>{percentOfGoal}%</span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-400">
                      {formatValue(indicator.priorYear, indicator.isPercentage, indicator.isCurrency)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className={`flex items-center justify-center gap-1 text-${isPositive ? 'emerald' : 'red'}-400`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="text-sm">
                          {isPositive ? '+' : ''}{indicator.isPercentage ? yearOverYearChange.toFixed(1) + ' pts' : (indicator.isCurrency ? '$' + yearOverYearChange.toLocaleString() : yearOverYearChange.toLocaleString())}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-${statusColor}-500/20 text-${statusColor}-400`}>
                        {status === 'exceeds' && <CheckCircle className="w-3.5 h-3.5" />}
                        {status === 'meets' && <Target className="w-3.5 h-3.5" />}
                        {status === 'below' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Program */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4">Performance by Program</h3>
          <div className="space-y-4">
            {PROGRAMS.map((program) => {
              const performance = 95 + Math.random() * 15; // Sample data
              return (
                <div key={program.id} className="flex items-center gap-4">
                  <div className={`p-2 bg-${program.color}-500/20 rounded-lg`}>
                    <program.icon className={`w-5 h-5 text-${program.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{program.name}</span>
                      <span className={`text-sm font-medium ${performance >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {performance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${program.color}-500 rounded-full transition-all`}
                        style={{ width: `${Math.min(performance, 120)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Local Board */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4">Local Workforce Board Performance</h3>
          <div className="space-y-3">
            {LWDBS.map((lwdb) => (
              <div key={lwdb.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-white">{lwdb.name}</div>
                    <div className="text-xs text-gray-500">{lwdb.participants.toLocaleString()} participants</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${lwdb.performance >= 100 ? 'text-emerald-400' : lwdb.performance >= 90 ? 'text-amber-400' : 'text-red-400'}`}>
                    {lwdb.performance}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Data as of: {new Date().toLocaleDateString()}</span>
            <span>|</span>
            <span>Reporting Period: {programYear}</span>
            <span>|</span>
            <span>Quarter: {selectedQuarter}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Next update: Daily at 6:00 AM EST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WIOADashboard;
