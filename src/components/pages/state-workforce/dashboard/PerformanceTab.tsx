// ===========================================
// Performance Tab - WIOA 6 Primary Indicators
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Download,
  X,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  AlertTriangle,
  Award,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { WIOAPerformanceGoals } from '@/types/stateWorkforce';

// ===========================================
// SAMPLE DATA
// ===========================================

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
  },
  {
    id: '4', fiscal_year: 'PY2025', program: 'TITLE_II_ADULT_EDUCATION',
    employment_rate_q2_goal: 44, employment_rate_q4_goal: 44, median_earnings_goal: 5400,
    credential_attainment_goal: 50, measurable_skill_gains_goal: 48, effectiveness_retention_goal: 42,
    employment_rate_q2_actual: 46.8, employment_rate_q4_actual: 43.2, median_earnings_actual: 5650,
    credential_attainment_actual: 52.4, measurable_skill_gains_actual: 51.2, effectiveness_retention_actual: 44.1,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: '5', fiscal_year: 'PY2025', program: 'TITLE_III_WAGNER_PEYSER',
    employment_rate_q2_goal: 65, employment_rate_q4_goal: 63, median_earnings_goal: 6800,
    credential_attainment_goal: 0, measurable_skill_gains_goal: 0, effectiveness_retention_goal: 60,
    employment_rate_q2_actual: 67.3, employment_rate_q4_actual: 64.5, median_earnings_actual: 7100,
    credential_attainment_actual: 0, measurable_skill_gains_actual: 0, effectiveness_retention_actual: 62.8,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: '6', fiscal_year: 'PY2025', program: 'TITLE_IV_VOCATIONAL_REHAB',
    employment_rate_q2_goal: 55.8, employment_rate_q4_goal: 52.5, median_earnings_goal: 4000,
    credential_attainment_goal: 48, measurable_skill_gains_goal: 45, effectiveness_retention_goal: 50,
    employment_rate_q2_actual: 54.2, employment_rate_q4_actual: 51.8, median_earnings_actual: 4150,
    credential_attainment_actual: 46.5, measurable_skill_gains_actual: 47.3, effectiveness_retention_actual: 49.2,
    status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

// ===========================================
// PROGRAM LABELS
// ===========================================

const programLabels: Record<string, string> = {
  TITLE_I_ADULT: 'Title I - Adult',
  TITLE_I_DISLOCATED_WORKER: 'Title I - Dislocated Worker',
  TITLE_I_YOUTH: 'Title I - Youth',
  TITLE_II_ADULT_EDUCATION: 'Title II - Adult Education',
  TITLE_III_WAGNER_PEYSER: 'Title III - Wagner-Peyser',
  TITLE_IV_VOCATIONAL_REHAB: 'Title IV - Vocational Rehab',
};

const indicatorLabels = [
  { key: 'employment_rate_q2', label: 'Employment Rate Q2', suffix: '%', icon: Briefcase, color: 'blue' },
  { key: 'employment_rate_q4', label: 'Employment Rate Q4', suffix: '%', icon: Briefcase, color: 'emerald' },
  { key: 'median_earnings', label: 'Median Earnings', suffix: '', prefix: '$', icon: DollarSign, color: 'amber' },
  { key: 'credential_attainment', label: 'Credential Attainment', suffix: '%', icon: Award, color: 'purple' },
  { key: 'measurable_skill_gains', label: 'Measurable Skill Gains', suffix: '%', icon: TrendingUp, color: 'cyan' },
  { key: 'effectiveness_retention', label: 'Effectiveness in Serving Employers', suffix: '%', icon: Target, color: 'rose' },
];

// ===========================================
// COMPONENT
// ===========================================

export const PerformanceTab: React.FC = () => {
  const [performance, setPerformance] = useState<WIOAPerformanceGoals[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedDetail, setSelectedDetail] = useState<WIOAPerformanceGoals | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedDetail(null), !!selectedDetail);

  const handleExportPerformance = () => {
    const headers = ['Program', 'FY', 'Emp Rate Q2 Goal', 'Emp Rate Q2 Actual', 'Emp Rate Q4 Goal', 'Emp Rate Q4 Actual', 'Median Earnings Goal', 'Median Earnings Actual', 'Credential Goal', 'Credential Actual', 'MSG Goal', 'MSG Actual'];
    const rows = filteredPerformance.map(p => [
      p.program, p.fiscal_year,
      p.employment_rate_q2_goal, p.employment_rate_q2_actual || '',
      p.employment_rate_q4_goal, p.employment_rate_q4_actual || '',
      p.median_earnings_goal, p.median_earnings_actual || '',
      p.credential_attainment_goal, p.credential_attainment_actual || '',
      p.measurable_skill_gains_goal, p.measurable_skill_gains_actual || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wioa-performance-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Performance report exported successfully');
  };

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setPerformance(SAMPLE_PERFORMANCE);
    } catch {
      setPerformance(SAMPLE_PERFORMANCE);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformance = selectedProgram === 'all'
    ? performance
    : performance.filter(p => p.program === selectedProgram);

  // Calculate overall performance across all programs
  const getIndicatorStatus = (key: string) => {
    let totalMet = 0;
    let totalApplicable = 0;
    performance.forEach(p => {
      const goal = (p as any)[`${key}_goal`] as number;
      const actual = (p as any)[`${key}_actual`] as number | undefined;
      if (goal > 0 && actual !== undefined) {
        totalApplicable++;
        if (actual >= goal) totalMet++;
      }
    });
    return { met: totalMet, total: totalApplicable, allMet: totalMet === totalApplicable };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-48 bg-gray-800 rounded mb-3" />
            <div className="h-4 w-80 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg shadow-lg">
          <Download className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Overall Indicator Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {indicatorLabels.map((indicator, idx) => {
          const status = getIndicatorStatus(indicator.key);
          const Icon = indicator.icon;

          const colorMap: Record<string, { iconBg: string; text: string }> = {
            blue: { iconBg: 'bg-blue-500/20', text: 'text-blue-400' },
            emerald: { iconBg: 'bg-emerald-500/20', text: 'text-emerald-400' },
            amber: { iconBg: 'bg-amber-500/20', text: 'text-amber-400' },
            purple: { iconBg: 'bg-purple-500/20', text: 'text-purple-400' },
            cyan: { iconBg: 'bg-cyan-500/20', text: 'text-cyan-400' },
            rose: { iconBg: 'bg-rose-500/20', text: 'text-rose-400' },
          };

          const colors = colorMap[indicator.color] || colorMap.blue;

          return (
            <motion.div
              key={indicator.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <p className="text-xs text-gray-400 mb-1">{indicator.label}</p>
              <div className="flex items-center gap-2">
                {status.allMet ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className={`text-sm font-semibold ${status.allMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {status.met}/{status.total}
                </span>
              </div>
              <p className="text-xs text-gray-500">programs meeting goal</p>
            </motion.div>
          );
        })}
      </div>

      {/* Program Filter & Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedProgram('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedProgram === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All Programs
            </button>
            {performance.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProgram(p.program)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedProgram === p.program ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {programLabels[p.program as string] || p.program}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportPerformance}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Performance Report
          </button>
        </div>
      </div>

      {/* Performance by Program */}
      <div className="space-y-4">
        {filteredPerformance.map((prog, progIdx) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: progIdx * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedDetail(prog)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {programLabels[prog.program as string] || prog.program}
                </h3>
                <p className="text-sm text-gray-400">{prog.fiscal_year} &bull; Status: {prog.status}</p>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const indicators = indicatorLabels.map(ind => {
                    const goal = (prog as any)[`${ind.key}_goal`] as number;
                    const actual = (prog as any)[`${ind.key}_actual`] as number | undefined;
                    return { goal, actual, met: goal > 0 && actual !== undefined && actual >= goal, applicable: goal > 0 };
                  }).filter(i => i.applicable);
                  const metCount = indicators.filter(i => i.met).length;
                  const allMet = metCount === indicators.length;
                  return (
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${allMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {metCount}/{indicators.length} Meeting Goals
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Indicator Bars */}
            <div className="space-y-3">
              {indicatorLabels.map((indicator) => {
                const goal = (prog as any)[`${indicator.key}_goal`] as number;
                const actual = (prog as any)[`${indicator.key}_actual`] as number | undefined;

                if (goal === 0) return null;

                const met = actual !== undefined && actual >= goal;
                const pct = actual !== undefined ? Math.min(120, (actual / goal) * 100) : 0;

                return (
                  <div key={indicator.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        {met ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="text-gray-300">{indicator.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${met ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {indicator.prefix || ''}{actual?.toLocaleString() || 'N/A'}{indicator.suffix}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Goal: {indicator.prefix || ''}{goal.toLocaleString()}{indicator.suffix}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 relative">
                      {/* Goal line */}
                      <div className="absolute top-0 h-2 w-px bg-white/50 z-10" style={{ left: `${Math.min(100, (goal / (goal * 1.2)) * 100)}%` }} />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, pct * (100 / 120))}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`h-2 rounded-full ${met ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cross-Program Comparison Table */}
      {selectedProgram === 'all' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Cross-Program Performance Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-sm text-gray-400 pb-3 pr-4">Program</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">Emp Q2</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">Emp Q4</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">Earnings</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">Credential</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">MSG</th>
                  <th className="text-center text-sm text-gray-400 pb-3 px-2">Eff/Ret</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-800 last:border-0">
                    <td className="py-3 pr-4">
                      <span className="text-white font-medium text-sm">
                        {programLabels[prog.program as string] || prog.program}
                      </span>
                    </td>
                    {indicatorLabels.map(indicator => {
                      const goal = (prog as any)[`${indicator.key}_goal`] as number;
                      const actual = (prog as any)[`${indicator.key}_actual`] as number | undefined;

                      if (goal === 0) {
                        return <td key={indicator.key} className="text-center py-3 px-2 text-gray-600 text-sm">N/A</td>;
                      }

                      const met = actual !== undefined && actual >= goal;

                      return (
                        <td key={indicator.key} className="text-center py-3 px-2">
                          <span className={`text-sm font-medium ${met ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {indicator.prefix || ''}{actual?.toLocaleString() || 'N/A'}{indicator.suffix}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            / {indicator.prefix || ''}{goal.toLocaleString()}{indicator.suffix}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {programLabels[selectedDetail.program as string] || selectedDetail.program}
                    </h2>
                    <p className="text-sm text-gray-400">{selectedDetail.fiscal_year} Performance Report</p>
                  </div>
                  <button onClick={() => setSelectedDetail(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {indicatorLabels.map(indicator => {
                    const goal = (selectedDetail as any)[`${indicator.key}_goal`] as number;
                    const actual = (selectedDetail as any)[`${indicator.key}_actual`] as number | undefined;

                    if (goal === 0) return null;

                    const met = actual !== undefined && actual >= goal;
                    const diff = actual !== undefined ? actual - goal : 0;
                    const pct = actual !== undefined ? Math.min(120, (actual / goal) * 100) : 0;
                    const Icon = indicator.icon;

                    return (
                      <div key={indicator.key} className="bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${met ? 'text-emerald-400' : 'text-amber-400'}`} />
                            <span className="text-white font-medium">{indicator.label}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {met ? 'Meeting Goal' : 'Below Target'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-400">Goal</p>
                            <p className="text-lg font-bold text-white">
                              {indicator.prefix || ''}{goal.toLocaleString()}{indicator.suffix}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Actual</p>
                            <p className={`text-lg font-bold ${met ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {indicator.prefix || ''}{actual?.toLocaleString() || 'N/A'}{indicator.suffix}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Difference</p>
                            <p className={`text-lg font-bold flex items-center gap-1 ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {diff >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {diff >= 0 ? '+' : ''}{indicator.prefix || ''}{diff.toFixed(1)}{indicator.suffix}
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${met ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, pct * (100 / 120))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedDetail.negotiation_notes && (
                  <div className="mt-6 bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Negotiation Notes</p>
                    <p className="text-white text-sm">{selectedDetail.negotiation_notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-gray-800 mt-6">
                  <button
                    onClick={() => {
                      if (!selectedDetail) return;
                      const headers = ['Indicator', 'Goal', 'Actual', 'Met'];
                      const rows = indicatorLabels.map(ind => {
                        const goal = (selectedDetail as any)[`${ind.key}_goal`] as number;
                        const actual = (selectedDetail as any)[`${ind.key}_actual`] as number | undefined;
                        return [ind.label, goal, actual ?? 'N/A', actual !== undefined && actual >= goal ? 'Yes' : 'No'];
                      });
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const anchor = document.createElement('a');
                      anchor.href = url;
                      anchor.download = `eta-9169-${selectedDetail.program}-${selectedDetail.fiscal_year}.csv`;
                      anchor.click();
                      URL.revokeObjectURL(url);
                      showNotification('ETA-9169 report generated');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    Generate ETA-9169 Report
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedDetail) return;
                      const headers = ['Program', 'FY', 'Emp Q2 Goal', 'Emp Q2 Actual', 'Emp Q4 Goal', 'Emp Q4 Actual', 'Median Earnings Goal', 'Median Earnings Actual'];
                      const rows = [[
                        selectedDetail.program, selectedDetail.fiscal_year,
                        selectedDetail.employment_rate_q2_goal, selectedDetail.employment_rate_q2_actual || '',
                        selectedDetail.employment_rate_q4_goal, selectedDetail.employment_rate_q4_actual || '',
                        selectedDetail.median_earnings_goal, selectedDetail.median_earnings_actual || ''
                      ]];
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const anchor = document.createElement('a');
                      anchor.href = url;
                      anchor.download = `pirl-data-${selectedDetail.program}.csv`;
                      anchor.click();
                      URL.revokeObjectURL(url);
                      showNotification('PIRL data exported');
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Export PIRL Data
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===========================================
          STATISTICAL ADJUSTMENT MODEL (Advanced)
          WIOA Section 116(b)(3)(A)(vi)
      =========================================== */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Statistical Adjustment Model
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              WIOA §116(b)(3)(A)(vi) · Accounts for economic conditions and participant characteristics
            </p>
          </div>
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded font-medium">Advanced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            {
              label: 'Local Unemployment Rate',
              value: '4.2%',
              baseline: '5.1% national avg',
              impact: 'Favorable',
              impactColor: 'emerald',
              note: 'Lower UE reduces expected employment rates — goals adjusted downward by ~0.8pp',
            },
            {
              label: 'Participant Barrier Index',
              value: '0.73',
              baseline: '0.65 state avg',
              impact: 'Unfavorable',
              impactColor: 'amber',
              note: 'Higher barrier concentration (SNAP, UI, low-literacy) increases goal difficulty',
            },
            {
              label: 'Adjusted Performance Score',
              value: '94.2%',
              baseline: '90.0% threshold',
              impact: 'Passing',
              impactColor: 'emerald',
              note: 'After SAM adjustment, board is above the 90% combined performance threshold',
            },
          ].map(card => {
            const impactCls = card.impactColor === 'emerald'
              ? 'bg-emerald-500/20 text-emerald-400'
              : card.impactColor === 'amber'
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-red-500/20 text-red-400';
            return (
              <div key={card.label} className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-xs text-gray-500 mb-2">{card.baseline}</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactCls}`}>
                  {card.impact}
                </span>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{card.note}</p>
              </div>
            );
          })}
        </div>

        {/* SAM factors table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Economic Factor', 'Local Value', 'State Avg', 'Adjustment Applied', 'Affected Indicators'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { factor: 'Unemployment Rate', local: '4.2%', state: '5.1%', adj: '-0.8pp on Q2/Q4', indicators: 'Emp Rate Q2, Q4' },
                { factor: 'Median Hourly Wage (Area)', local: '$24.80', state: '$22.40', adj: '+$180 on earnings goal', indicators: 'Median Earnings' },
                { factor: 'SNAP Recipient Share', local: '18.4%', state: '14.2%', adj: '+1.2pp difficulty', indicators: 'Q2/Q4, Credential' },
                { factor: 'Educational Attainment (<HS)', local: '22.1%', state: '18.8%', adj: '-0.5pp on credential goal', indicators: 'Credential Attainment' },
                { factor: 'Long-Term Unemployed Share', local: '12.3%', state: '9.7%', adj: '+0.9pp on Q4', indicators: 'Emp Rate Q4' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                  <td className="px-3 py-2.5 text-gray-200 font-medium">{row.factor}</td>
                  <td className="px-3 py-2.5 text-white">{row.local}</td>
                  <td className="px-3 py-2.5 text-gray-400">{row.state}</td>
                  <td className="px-3 py-2.5 text-blue-400">{row.adj}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{row.indicators}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
          <strong>Methodology:</strong> Statistical adjustments based on ETA&apos;s regression model (TEGL 10-17) using
          BLS LAUS data, ACS 5-year estimates, and state SWIS wage record files.
          Model coefficients updated annually by DOL ETA. Local goals negotiated with state and ETA using adjusted baselines.
        </div>
      </div>
    </div>
  );
};
