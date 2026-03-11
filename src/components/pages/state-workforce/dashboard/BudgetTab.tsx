// ===========================================
// Budget Tab - Grant Allocations & Expenditure Tracking
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Download,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileText
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { GrantAllocation, Expenditure } from '@/types/stateWorkforce';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_GRANTS: GrantAllocation[] = [
  {
    id: 'ga-1', fiscal_year: 'PY2025', program: 'TITLE_I_ADULT',
    statewide: true, allocation_amount: 12000000, carryover_amount: 1500000, total_available: 13500000,
    obligated_amount: 10200000, expended_amount: 7850000, remaining_amount: 5650000,
    period_start: '2025-07-01', period_end: '2027-06-30',
    match_required: 0, match_provided: 0,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-2', fiscal_year: 'PY2025', program: 'TITLE_I_DISLOCATED_WORKER',
    statewide: true, allocation_amount: 8500000, carryover_amount: 800000, total_available: 9300000,
    obligated_amount: 7100000, expended_amount: 5200000, remaining_amount: 4100000,
    period_start: '2025-07-01', period_end: '2027-06-30',
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-3', fiscal_year: 'PY2025', program: 'TITLE_I_YOUTH',
    statewide: true, allocation_amount: 6000000, carryover_amount: 500000, total_available: 6500000,
    obligated_amount: 5400000, expended_amount: 4100000, remaining_amount: 2400000,
    period_start: '2025-07-01', period_end: '2027-06-30',
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-4', fiscal_year: 'PY2025', program: 'TITLE_II_ADULT_EDUCATION',
    statewide: true, allocation_amount: 5500000, total_available: 5500000,
    obligated_amount: 4200000, expended_amount: 3800000, remaining_amount: 1700000,
    period_start: '2025-07-01', period_end: '2026-06-30',
    match_required: 2750000, match_provided: 2400000,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-5', fiscal_year: 'PY2025', program: 'TITLE_III_WAGNER_PEYSER',
    statewide: true, allocation_amount: 4200000, total_available: 4200000,
    obligated_amount: 3800000, expended_amount: 2900000, remaining_amount: 1300000,
    period_start: '2025-07-01', period_end: '2026-06-30',
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-6', fiscal_year: 'PY2025', program: 'TITLE_IV_VOCATIONAL_REHAB',
    statewide: true, allocation_amount: 7800000, total_available: 7800000,
    obligated_amount: 5900000, expended_amount: 5100000, remaining_amount: 2700000,
    period_start: '2025-10-01', period_end: '2026-09-30',
    match_required: 1734000, match_provided: 1734000,
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-7', fiscal_year: 'PY2025', program: 'TAA',
    statewide: true, allocation_amount: 2100000, total_available: 2100000,
    obligated_amount: 1800000, expended_amount: 1450000, remaining_amount: 650000,
    period_start: '2025-07-01', period_end: '2026-06-30',
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'ga-8', fiscal_year: 'PY2025', program: 'VETERAN_SERVICES',
    statewide: true, allocation_amount: 1800000, total_available: 1800000,
    obligated_amount: 1500000, expended_amount: 1200000, remaining_amount: 600000,
    period_start: '2025-07-01', period_end: '2026-06-30',
    status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

const SAMPLE_EXPENDITURES: Expenditure[] = [
  { id: 'exp-1', grant_allocation_id: 'ga-1', cost_category: 'PARTICIPANT_ITA', description: 'ITA - CNC Machining Program', amount: 4500, vendor_name: 'Austin Community College', expenditure_date: '2025-03-05', created_at: new Date().toISOString() },
  { id: 'exp-2', grant_allocation_id: 'ga-1', cost_category: 'PARTICIPANT_SUPPORTIVE', description: 'Transportation assistance', amount: 250, expenditure_date: '2025-03-06', participant_id: 'p-001', created_at: new Date().toISOString() },
  { id: 'exp-3', grant_allocation_id: 'ga-2', cost_category: 'STAFF_SALARIES', description: 'Case Manager salaries - February', amount: 45000, expenditure_date: '2025-03-01', ajc_id: 'ajc-1', created_at: new Date().toISOString() },
  { id: 'exp-4', grant_allocation_id: 'ga-1', cost_category: 'PARTICIPANT_TRAINING', description: 'OJT reimbursement - TI', amount: 2400, vendor_name: 'Texas Instruments', expenditure_date: '2025-03-04', participant_id: 'p-002', created_at: new Date().toISOString() },
  { id: 'exp-5', grant_allocation_id: 'ga-3', cost_category: 'OPERATIONS', description: 'Youth program supplies', amount: 1200, vendor_name: 'Office Depot', expenditure_date: '2025-03-07', ajc_id: 'ajc-1', created_at: new Date().toISOString() },
  { id: 'exp-6', grant_allocation_id: 'ga-4', cost_category: 'PARTICIPANT_TRAINING', description: 'ESL course materials', amount: 3500, vendor_name: 'Pearson Education', expenditure_date: '2025-03-03', created_at: new Date().toISOString() },
];

// ===========================================
// PROGRAM LABELS
// ===========================================

const programLabels: Record<string, string> = {
  TITLE_I_ADULT: 'Title I - Adult',
  TITLE_I_DISLOCATED_WORKER: 'Title I - DW',
  TITLE_I_YOUTH: 'Title I - Youth',
  TITLE_II_ADULT_EDUCATION: 'Title II - Adult Ed',
  TITLE_III_WAGNER_PEYSER: 'Title III - W-P',
  TITLE_IV_VOCATIONAL_REHAB: 'Title IV - VR',
  TAA: 'TAA',
  VETERAN_SERVICES: 'Veteran Services',
};

const costCategoryLabels: Record<string, string> = {
  STAFF_SALARIES: 'Staff Salaries',
  STAFF_BENEFITS: 'Staff Benefits',
  STAFF_TRAINING: 'Staff Training',
  PARTICIPANT_TRAINING: 'Participant Training',
  PARTICIPANT_SUPPORTIVE: 'Supportive Services',
  PARTICIPANT_ITA: 'ITA',
  OPERATIONS: 'Operations',
  EQUIPMENT: 'Equipment',
  INDIRECT: 'Indirect Costs',
  OTHER: 'Other',
};

// ===========================================
// COMPONENT
// ===========================================

export const BudgetTab: React.FC = () => {
  const [grants, setGrants] = useState<GrantAllocation[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<GrantAllocation | null>(null);
  const [viewMode, setViewMode] = useState<'allocations' | 'expenditures'>('allocations');
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedGrant(null), !!selectedGrant);

  const handleExportBudget = () => {
    const headers = ['Fiscal Year', 'Program', 'Allocation', 'Carryover', 'Total Available', 'Obligated', 'Expended', 'Remaining', 'Status'];
    const rows = grants.map(g => [
      g.fiscal_year, g.program, g.allocation_amount, g.carryover_amount || 0,
      g.total_available, g.obligated_amount, g.expended_amount, g.remaining_amount, g.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Budget report exported successfully');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setGrants(SAMPLE_GRANTS);
      setExpenditures(SAMPLE_EXPENDITURES);
    } catch {
      setGrants(SAMPLE_GRANTS);
      setExpenditures(SAMPLE_EXPENDITURES);
    } finally {
      setLoading(false);
    }
  };

  const totalAllocation = grants.reduce((sum, g) => sum + g.total_available, 0);
  const totalExpended = grants.reduce((sum, g) => sum + g.expended_amount, 0);
  const totalObligated = grants.reduce((sum, g) => sum + g.obligated_amount, 0);
  const totalRemaining = grants.reduce((sum, g) => sum + g.remaining_amount, 0);
  const overallBurnRate = Math.round((totalExpended / totalAllocation) * 100);

  const matchRequired = grants.reduce((sum, g) => sum + (g.match_required || 0), 0);
  const matchProvided = grants.reduce((sum, g) => sum + (g.match_provided || 0), 0);

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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Available</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalAllocation / 1000000).toFixed(1)}M</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Obligated</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalObligated / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-emerald-400">{Math.round((totalObligated / totalAllocation) * 100)}% of available</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Expended</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalExpended / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-amber-400">{overallBurnRate}% burn rate</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalRemaining / 1000000).toFixed(1)}M</p>
        </motion.div>
      </div>

      {/* Match Requirements */}
      {matchRequired > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Match Requirements</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-400">Required: </span>
                <span className="text-white font-medium">${(matchRequired / 1000000).toFixed(2)}M</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Provided: </span>
                <span className={`font-medium ${matchProvided >= matchRequired ? 'text-emerald-400' : 'text-amber-400'}`}>
                  ${(matchProvided / 1000000).toFixed(2)}M
                </span>
              </div>
              {matchProvided >= matchRequired ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('allocations')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'allocations' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Grant Allocations
            </button>
            <button
              onClick={() => setViewMode('expenditures')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'expenditures' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Recent Expenditures
            </button>
          </div>
          <button
            onClick={handleExportBudget}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Budget Report
          </button>
        </div>
      </div>

      {/* Allocations View */}
      {viewMode === 'allocations' && (
        <div className="space-y-4">
          {grants.map((grant, idx) => {
            const burnRate = Math.round((grant.expended_amount / grant.total_available) * 100);
            const obligatedRate = Math.round((grant.obligated_amount / grant.total_available) * 100);

            return (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedGrant(grant)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {programLabels[grant.program as string] || grant.program}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {grant.fiscal_year} &bull; {new Date(grant.period_start).toLocaleDateString()} - {new Date(grant.period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    grant.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                    grant.status === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {grant.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Available</p>
                    <p className="text-lg font-semibold text-white">${(grant.total_available / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Obligated</p>
                    <p className="text-lg font-semibold text-blue-400">${(grant.obligated_amount / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Expended</p>
                    <p className="text-lg font-semibold text-emerald-400">${(grant.expended_amount / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Remaining</p>
                    <p className="text-lg font-semibold text-white">${(grant.remaining_amount / 1000000).toFixed(2)}M</p>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Obligated ({obligatedRate}%)</span>
                      <span>Expended ({burnRate}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${obligatedRate}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-0 h-3 rounded-full bg-blue-500/30"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${burnRate}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute top-0 left-0 h-3 rounded-full ${burnRate >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Match info */}
                {grant.match_required && grant.match_required > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Match: ${((grant.match_provided || 0) / 1000000).toFixed(2)}M / ${(grant.match_required / 1000000).toFixed(2)}M required
                    </span>
                    {(grant.match_provided || 0) >= grant.match_required ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Met</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Shortfall</span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expenditures View */}
      {viewMode === 'expenditures' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-sm text-gray-400 p-4">Date</th>
                  <th className="text-left text-sm text-gray-400 p-4">Description</th>
                  <th className="text-left text-sm text-gray-400 p-4">Category</th>
                  <th className="text-left text-sm text-gray-400 p-4">Program</th>
                  <th className="text-left text-sm text-gray-400 p-4">Vendor</th>
                  <th className="text-right text-sm text-gray-400 p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map(exp => {
                  const grant = grants.find(g => g.id === exp.grant_allocation_id);
                  return (
                    <tr key={exp.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 text-gray-300 text-sm">{new Date(exp.expenditure_date).toLocaleDateString()}</td>
                      <td className="p-4 text-white text-sm">{exp.description}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                          {costCategoryLabels[exp.cost_category] || exp.cost_category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">
                        {grant ? (programLabels[grant.program as string] || grant.program) : '-'}
                      </td>
                      <td className="p-4 text-gray-300 text-sm">{exp.vendor_name || '-'}</td>
                      <td className="p-4 text-right text-white font-medium">${exp.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700">
                  <td colSpan={5} className="p-4 text-sm text-gray-400 font-medium">Total Recent Expenditures</td>
                  <td className="p-4 text-right text-white font-bold">
                    ${expenditures.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grant Detail Modal */}
      <AnimatePresence>
        {selectedGrant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedGrant(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {programLabels[selectedGrant.program as string] || selectedGrant.program}
                    </h2>
                    <p className="text-sm text-gray-400">{selectedGrant.fiscal_year} Grant Allocation</p>
                  </div>
                  <button onClick={() => setSelectedGrant(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Base Allocation</p>
                    <p className="text-lg font-bold text-white">${(selectedGrant.allocation_amount / 1000000).toFixed(2)}M</p>
                  </div>
                  {selectedGrant.carryover_amount && selectedGrant.carryover_amount > 0 && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-400">Carryover</p>
                      <p className="text-lg font-bold text-white">${(selectedGrant.carryover_amount / 1000000).toFixed(2)}M</p>
                    </div>
                  )}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Total Available</p>
                    <p className="text-lg font-bold text-blue-400">${(selectedGrant.total_available / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Remaining</p>
                    <p className="text-lg font-bold text-emerald-400">${(selectedGrant.remaining_amount / 1000000).toFixed(2)}M</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Budget Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Obligated</span>
                        <span className="text-blue-400">${(selectedGrant.obligated_amount / 1000000).toFixed(2)}M ({Math.round((selectedGrant.obligated_amount / selectedGrant.total_available) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(selectedGrant.obligated_amount / selectedGrant.total_available) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Expended</span>
                        <span className="text-emerald-400">${(selectedGrant.expended_amount / 1000000).toFixed(2)}M ({Math.round((selectedGrant.expended_amount / selectedGrant.total_available) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(selectedGrant.expended_amount / selectedGrant.total_available) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Period Start</p>
                    <p className="text-white">{new Date(selectedGrant.period_start).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Period End</p>
                    <p className="text-white">{new Date(selectedGrant.period_end).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedGrant.match_required && selectedGrant.match_required > 0 && (
                  <div className="mb-6 bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Match Requirement</p>
                        <p className="text-white">${(selectedGrant.match_required / 1000000).toFixed(2)}M required</p>
                        <p className={`text-sm ${(selectedGrant.match_provided || 0) >= selectedGrant.match_required ? 'text-emerald-400' : 'text-amber-400'}`}>
                          ${((selectedGrant.match_provided || 0) / 1000000).toFixed(2)}M provided
                        </p>
                      </div>
                      {(selectedGrant.match_provided || 0) >= selectedGrant.match_required ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                  </div>
                )}

                {/* Related Expenditures */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Expenditures</h3>
                  <div className="space-y-2">
                    {expenditures.filter(e => e.grant_allocation_id === selectedGrant.id).map(exp => (
                      <div key={exp.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{exp.description}</p>
                          <p className="text-xs text-gray-400">{new Date(exp.expenditure_date).toLocaleDateString()} &bull; {costCategoryLabels[exp.cost_category]}</p>
                        </div>
                        <span className="text-white font-medium">${exp.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    {expenditures.filter(e => e.grant_allocation_id === selectedGrant.id).length === 0 && (
                      <p className="text-sm text-gray-500">No recent expenditures</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => showNotification('Opening full ledger view...')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    View Full Ledger
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedGrant) return;
                      const grantExps = expenditures.filter(e => e.grant_allocation_id === selectedGrant.id);
                      const headers = ['Date', 'Cost Category', 'Description', 'Amount', 'Vendor'];
                      const rows = grantExps.map(e => [
                        e.expenditure_date, e.cost_category, `"${e.description}"`, e.amount, e.vendor_name || ''
                      ]);
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const anchor = document.createElement('a');
                      anchor.href = url;
                      anchor.download = `${selectedGrant.program}-financial-report.csv`;
                      anchor.click();
                      URL.revokeObjectURL(url);
                      showNotification('Financial report exported');
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Export Financial Report
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
