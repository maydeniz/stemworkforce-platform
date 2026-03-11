// ===========================================
// Programs Tab - WIOA Title I-IV Programs
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Download,
  X,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { WIOAProgram, WIOAPerformanceGoals } from '@/types/stateWorkforce';

// ===========================================
// TYPES
// ===========================================

interface ProgramSummary {
  id: string;
  program: WIOAProgram;
  label: string;
  description: string;
  enrolled: number;
  capacity: number;
  active: number;
  exited: number;
  employedQ2: number;
  credentialsEarned: number;
  budget: number;
  spent: number;
  status: 'active' | 'inactive' | 'at_capacity';
  performanceGoals?: WIOAPerformanceGoals;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_PROGRAMS: ProgramSummary[] = [
  {
    id: 'prog-1', program: 'TITLE_I_ADULT', label: 'Title I - Adult', description: 'Career and training services for adults 18+',
    enrolled: 2345, capacity: 3000, active: 1890, exited: 455, employedQ2: 378, credentialsEarned: 312,
    budget: 12000000, spent: 7850000, status: 'active',
    performanceGoals: {
      id: '1', fiscal_year: 'PY2025', program: 'TITLE_I_ADULT',
      employment_rate_q2_goal: 78, employment_rate_q4_goal: 75.5, median_earnings_goal: 7200,
      credential_attainment_goal: 65, measurable_skill_gains_goal: 55, effectiveness_retention_goal: 72,
      employment_rate_q2_actual: 81.2, employment_rate_q4_actual: 77.8, median_earnings_actual: 7650,
      credential_attainment_actual: 62.1, measurable_skill_gains_actual: 58.4, effectiveness_retention_actual: 74.3,
      status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  },
  {
    id: 'prog-2', program: 'TITLE_I_DISLOCATED_WORKER', label: 'Title I - Dislocated Worker', description: 'Services for workers displaced from employment',
    enrolled: 1567, capacity: 2000, active: 1234, exited: 333, employedQ2: 289, credentialsEarned: 245,
    budget: 8500000, spent: 5200000, status: 'active',
    performanceGoals: {
      id: '2', fiscal_year: 'PY2025', program: 'TITLE_I_DISLOCATED_WORKER',
      employment_rate_q2_goal: 80, employment_rate_q4_goal: 77, median_earnings_goal: 8500,
      credential_attainment_goal: 68, measurable_skill_gains_goal: 52, effectiveness_retention_goal: 75,
      employment_rate_q2_actual: 83.5, employment_rate_q4_actual: 79.2, median_earnings_actual: 9100,
      credential_attainment_actual: 64.8, measurable_skill_gains_actual: 54.1, effectiveness_retention_actual: 76.8,
      status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  },
  {
    id: 'prog-3', program: 'TITLE_I_YOUTH', label: 'Title I - Youth', description: 'Workforce services for youth ages 14-24',
    enrolled: 987, capacity: 1200, active: 845, exited: 142, employedQ2: 98, credentialsEarned: 112,
    budget: 6000000, spent: 4100000, status: 'active',
    performanceGoals: {
      id: '3', fiscal_year: 'PY2025', program: 'TITLE_I_YOUTH',
      employment_rate_q2_goal: 72, employment_rate_q4_goal: 70, median_earnings_goal: 4200,
      credential_attainment_goal: 60, measurable_skill_gains_goal: 58, effectiveness_retention_goal: 68,
      employment_rate_q2_actual: 74.6, employment_rate_q4_actual: 71.3, median_earnings_actual: 4450,
      credential_attainment_actual: 57.2, measurable_skill_gains_actual: 61.8, effectiveness_retention_actual: 69.5,
      status: 'APPROVED', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  },
  {
    id: 'prog-4', program: 'TITLE_II_ADULT_EDUCATION', label: 'Title II - Adult Education', description: 'Adult education and literacy activities',
    enrolled: 3456, capacity: 4000, active: 2890, exited: 566, employedQ2: 234, credentialsEarned: 445,
    budget: 5500000, spent: 3800000, status: 'active'
  },
  {
    id: 'prog-5', program: 'TITLE_III_WAGNER_PEYSER', label: 'Title III - Wagner-Peyser', description: 'Employment services and labor exchange',
    enrolled: 8765, capacity: 10000, active: 6543, exited: 2222, employedQ2: 1876, credentialsEarned: 0,
    budget: 4200000, spent: 2900000, status: 'active'
  },
  {
    id: 'prog-6', program: 'TITLE_IV_VOCATIONAL_REHAB', label: 'Title IV - Vocational Rehab', description: 'Vocational rehabilitation services for individuals with disabilities',
    enrolled: 1234, capacity: 1500, active: 1100, exited: 134, employedQ2: 89, credentialsEarned: 67,
    budget: 7800000, spent: 5100000, status: 'active'
  },
  {
    id: 'prog-7', program: 'TAA', label: 'Trade Adjustment Assistance', description: 'Assistance for workers affected by foreign trade',
    enrolled: 234, capacity: 400, active: 189, exited: 45, employedQ2: 38, credentialsEarned: 34,
    budget: 2100000, spent: 1450000, status: 'active'
  },
  {
    id: 'prog-8', program: 'VETERAN_SERVICES', label: 'Veteran Services', description: 'DVOP and LVER services for veterans',
    enrolled: 456, capacity: 600, active: 378, exited: 78, employedQ2: 67, credentialsEarned: 45,
    budget: 1800000, spent: 1200000, status: 'active'
  }
];

// ===========================================
// COMPONENT
// ===========================================

export const ProgramsTab: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<ProgramSummary | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedProgram(null), !!selectedProgram);

  const handleExportReport = () => {
    const headers = ['Program', 'Enrolled', 'Capacity', 'Active', 'Exited', 'Employed Q2', 'Credentials', 'Budget', 'Spent', 'Status'];
    const rows = filteredPrograms.map(p => [
      `"${p.label}"`, p.enrolled, p.capacity, p.active, p.exited, p.employedQ2,
      p.credentialsEarned, p.budget, p.spent, p.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wioa-programs-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Program report exported successfully');
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setPrograms(SAMPLE_PROGRAMS);
    } catch {
      setPrograms(SAMPLE_PROGRAMS);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(p =>
    searchQuery === '' ||
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEnrolled = programs.reduce((sum, p) => sum + p.enrolled, 0);
  const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = programs.reduce((sum, p) => sum + p.spent, 0);
  const totalCredentials = programs.reduce((sum, p) => sum + p.credentialsEarned, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-48 bg-gray-800 rounded mb-3" />
            <div className="h-4 w-80 bg-gray-800 rounded mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-16 bg-gray-800 rounded" />
              ))}
            </div>
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
          <CheckCircle className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Programs</span>
          </div>
          <p className="text-2xl font-bold text-white">{programs.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Total Enrolled</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalEnrolled.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Total Budget</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalBudget / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-amber-400">{Math.round((totalSpent / totalBudget) * 100)}% expended</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Credentials Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCredentials.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Search & Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Program Cards */}
      <div className="space-y-4">
        {filteredPrograms.map((program, idx) => {
          const enrollmentPct = Math.round((program.enrolled / program.capacity) * 100);
          const budgetPct = Math.round((program.spent / program.budget) * 100);

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{program.label}</h3>
                  <p className="text-sm text-gray-400">{program.description}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  program.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  program.status === 'at_capacity' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {program.status === 'at_capacity' ? 'At Capacity' : program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Enrolled / Capacity</p>
                  <p className="text-lg font-semibold text-white">{program.enrolled.toLocaleString()} / {program.capacity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-lg font-semibold text-emerald-400">{program.active.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Employed Q2</p>
                  <p className="text-lg font-semibold text-blue-400">{program.employedQ2.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Credentials</p>
                  <p className="text-lg font-semibold text-purple-400">{program.credentialsEarned.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Enrollment</span>
                    <span>{enrollmentPct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollmentPct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 rounded-full ${enrollmentPct >= 90 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Budget Spent</span>
                    <span>{budgetPct}% (${(program.spent / 1000000).toFixed(1)}M / ${(program.budget / 1000000).toFixed(1)}M)</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${budgetPct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 rounded-full ${budgetPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Performance Indicators (if available) */}
              {program.performanceGoals && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-400 mb-2">Performance vs Goals</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { label: 'Emp Q2', actual: program.performanceGoals.employment_rate_q2_actual, goal: program.performanceGoals.employment_rate_q2_goal, suffix: '%' },
                      { label: 'Emp Q4', actual: program.performanceGoals.employment_rate_q4_actual, goal: program.performanceGoals.employment_rate_q4_goal, suffix: '%' },
                      { label: 'Earnings', actual: program.performanceGoals.median_earnings_actual, goal: program.performanceGoals.median_earnings_goal, suffix: '', prefix: '$' },
                      { label: 'Credential', actual: program.performanceGoals.credential_attainment_actual, goal: program.performanceGoals.credential_attainment_goal, suffix: '%' },
                      { label: 'MSG', actual: program.performanceGoals.measurable_skill_gains_actual, goal: program.performanceGoals.measurable_skill_gains_goal, suffix: '%' },
                      { label: 'Eff/Ret', actual: program.performanceGoals.effectiveness_retention_actual, goal: program.performanceGoals.effectiveness_retention_goal, suffix: '%' },
                    ].map((ind, i) => {
                      const met = (ind.actual || 0) >= ind.goal;
                      return (
                        <div key={i} className={`p-2 rounded-lg text-center ${met ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                          <p className="text-xs text-gray-400">{ind.label}</p>
                          <p className={`text-sm font-semibold ${met ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {ind.prefix || ''}{ind.actual?.toLocaleString() || 'N/A'}{ind.suffix}
                          </p>
                          <p className="text-xs text-gray-500">Goal: {ind.prefix || ''}{ind.goal.toLocaleString()}{ind.suffix}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProgram(null)}
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
                    <h2 className="text-xl font-bold text-white">{selectedProgram.label}</h2>
                    <p className="text-sm text-gray-400">{selectedProgram.description}</p>
                  </div>
                  <button onClick={() => setSelectedProgram(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedProgram.enrolled.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Enrolled</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{selectedProgram.active.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{selectedProgram.employedQ2.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Employed Q2</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedProgram.credentialsEarned.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Credentials</p>
                  </div>
                </div>

                {selectedProgram.performanceGoals && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">WIOA Performance Indicators</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Employment Rate Q2', actual: selectedProgram.performanceGoals.employment_rate_q2_actual, goal: selectedProgram.performanceGoals.employment_rate_q2_goal, suffix: '%' },
                        { label: 'Employment Rate Q4', actual: selectedProgram.performanceGoals.employment_rate_q4_actual, goal: selectedProgram.performanceGoals.employment_rate_q4_goal, suffix: '%' },
                        { label: 'Median Earnings', actual: selectedProgram.performanceGoals.median_earnings_actual, goal: selectedProgram.performanceGoals.median_earnings_goal, suffix: '', prefix: '$' },
                        { label: 'Credential Attainment', actual: selectedProgram.performanceGoals.credential_attainment_actual, goal: selectedProgram.performanceGoals.credential_attainment_goal, suffix: '%' },
                        { label: 'Measurable Skill Gains', actual: selectedProgram.performanceGoals.measurable_skill_gains_actual, goal: selectedProgram.performanceGoals.measurable_skill_gains_goal, suffix: '%' },
                        { label: 'Effectiveness/Retention', actual: selectedProgram.performanceGoals.effectiveness_retention_actual, goal: selectedProgram.performanceGoals.effectiveness_retention_goal, suffix: '%' },
                      ].map((ind, i) => {
                        const met = (ind.actual || 0) >= ind.goal;
                        const pct = Math.min(100, ((ind.actual || 0) / ind.goal) * 100);
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <div className="flex items-center gap-2">
                                {met ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                                <span className="text-gray-300">{ind.label}</span>
                              </div>
                              <span className={met ? 'text-emerald-400' : 'text-amber-400'}>
                                {ind.prefix || ''}{ind.actual?.toLocaleString() || 'N/A'}{ind.suffix} / {ind.prefix || ''}{ind.goal.toLocaleString()}{ind.suffix}
                              </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div className={`h-2 rounded-full ${met ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => showNotification('Opening full program details...')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedProgram) return;
                      const headers = ['Metric', 'Value'];
                      const rows = [
                        ['Program', selectedProgram.label],
                        ['Enrolled', String(selectedProgram.enrolled)],
                        ['Active', String(selectedProgram.active)],
                        ['Exited', String(selectedProgram.exited)],
                        ['Employed Q2', String(selectedProgram.employedQ2)],
                        ['Credentials Earned', String(selectedProgram.credentialsEarned)],
                        ['Budget', `$${selectedProgram.budget.toLocaleString()}`],
                        ['Spent', `$${selectedProgram.spent.toLocaleString()}`],
                      ];
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedProgram.label.replace(/\s+/g, '-').toLowerCase()}-report.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showNotification('Program report exported');
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Export Program Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
