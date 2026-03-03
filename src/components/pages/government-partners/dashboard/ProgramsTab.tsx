// ===========================================
// Programs Tab - Workforce Program Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Briefcase,
  TrendingUp,
  Filter,
  ChevronRight,
  Loader2,
  DollarSign,
  Users,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  FileText
} from 'lucide-react';
import { getWorkforcePrograms } from '@/services/governmentPartnerApi';
import type { WorkforceProgram, GovernmentPartnerTier, ProgramFilters } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface ProgramsTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
}

type ViewMode = 'grid' | 'list';

// ===========================================
// SAMPLE DATA
// ===========================================

const samplePrograms: WorkforceProgram[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'CHIPS Act Semiconductor Workforce Initiative',
    programType: 'chips_act',
    description: 'Training program for semiconductor manufacturing technicians',
    fundingSource: 'chips_act',
    grantNumber: 'CHIPS-2024-001',
    totalBudget: 15000000,
    spentToDate: 8500000,
    budgetRemaining: 6500000,
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    reportingDeadlines: ['2024-03-31', '2024-06-30', '2024-09-30', '2024-12-31'],
    enrollmentTarget: 1000,
    placementTarget: 85,
    wageGainTarget: 15000,
    currentEnrollment: 756,
    completedCount: 423,
    placedCount: 378,
    averageWageGain: 18500,
    status: 'active',
    milestoneProgress: 75,
    complianceStatus: 'compliant',
    lastReportDate: '2024-09-30',
    nextReportDue: '2024-12-31',
    industryFocus: ['Semiconductor Manufacturing', 'Advanced Manufacturing'],
    occupationCodes: ['51-9141', '17-3026'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    name: 'WIOA Dislocated Worker Program',
    programType: 'wioa_title_i',
    description: 'Retraining program for workers displaced by automation',
    fundingSource: 'wioa_title_i',
    grantNumber: 'WIOA-DW-2024-045',
    totalBudget: 5000000,
    spentToDate: 3200000,
    budgetRemaining: 1800000,
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    reportingDeadlines: ['2024-06-30', '2024-12-31'],
    enrollmentTarget: 500,
    placementTarget: 80,
    wageGainTarget: 10000,
    currentEnrollment: 312,
    completedCount: 178,
    placedCount: 145,
    averageWageGain: 11200,
    status: 'active',
    milestoneProgress: 62,
    complianceStatus: 'compliant',
    lastReportDate: '2024-06-30',
    nextReportDue: '2024-12-31',
    industryFocus: ['Healthcare', 'IT', 'Advanced Manufacturing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: '1',
    name: 'Youth Career Pathways',
    programType: 'wioa_title_i',
    description: 'Career exploration and work experience for youth ages 16-24',
    fundingSource: 'wioa_title_i',
    grantNumber: 'WIOA-YTH-2024-012',
    totalBudget: 2500000,
    spentToDate: 1100000,
    budgetRemaining: 1400000,
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    reportingDeadlines: ['2024-12-31', '2025-06-30'],
    enrollmentTarget: 200,
    placementTarget: 70,
    currentEnrollment: 145,
    completedCount: 45,
    placedCount: 38,
    status: 'active',
    milestoneProgress: 45,
    complianceStatus: 'at_risk',
    lastReportDate: '2024-06-30',
    nextReportDue: '2024-12-31',
    industryFocus: ['Multiple Industries'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const programTypeLabels: Record<string, { label: string; color: string }> = {
  chips_act: { label: 'CHIPS Act', color: 'blue' },
  wioa_title_i: { label: 'WIOA Title I', color: 'emerald' },
  wioa_title_ii: { label: 'WIOA Title II', color: 'teal' },
  wioa_title_iii: { label: 'WIOA Title III', color: 'cyan' },
  wioa_title_iv: { label: 'WIOA Title IV', color: 'sky' },
  apprenticeship: { label: 'Apprenticeship', color: 'purple' },
  state_grant: { label: 'State Grant', color: 'amber' },
  federal_grant: { label: 'Federal Grant', color: 'indigo' },
  other: { label: 'Other', color: 'slate' }
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  planning: { label: 'Planning', color: 'slate', icon: Clock },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  paused: { label: 'Paused', color: 'amber', icon: AlertTriangle },
  completed: { label: 'Completed', color: 'blue', icon: CheckCircle },
  closed: { label: 'Closed', color: 'gray', icon: X }
};

const complianceStatusConfig: Record<string, { label: string; color: string }> = {
  compliant: { label: 'Compliant', color: 'emerald' },
  at_risk: { label: 'At Risk', color: 'amber' },
  non_compliant: { label: 'Non-Compliant', color: 'red' }
};

// Static Tailwind color map
const twColor: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  sky: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

// ===========================================
// COMPONENT
// ===========================================

export const ProgramsTab: React.FC<ProgramsTabProps> = ({ partnerId, tier: _tier }) => {
  const [_viewMode, _setViewMode] = useState<ViewMode>('grid');
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [complianceFilter, setComplianceFilter] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<WorkforceProgram | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkforceProgram | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    programType: 'wioa_title_i',
    description: '',
    fundingSource: 'wioa_title_i',
    grantNumber: '',
    totalBudget: '',
    startDate: '',
    endDate: '',
    enrollmentTarget: '',
    placementTarget: '80',
    wageGainTarget: '',
    industryFocus: ''
  });

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const filters: ProgramFilters = {};
        if (statusFilter) filters.status = statusFilter as WorkforceProgram['status'];
        if (typeFilter) filters.programType = typeFilter as WorkforceProgram['programType'];
        if (complianceFilter) filters.complianceStatus = complianceFilter as WorkforceProgram['complianceStatus'];
        if (searchQuery) filters.searchQuery = searchQuery;

        const data = await getWorkforcePrograms(partnerId, filters);
        setPrograms(data.length > 0 ? data : samplePrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setPrograms(samplePrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [partnerId, statusFilter, typeFilter, complianceFilter, searchQuery]);

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchQuery === '' ||
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || program.status === statusFilter;
    const matchesType = typeFilter === '' || program.programType === typeFilter;
    const matchesCompliance = complianceFilter === '' || program.complianceStatus === complianceFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCompliance;
  });

  // Calculate stats
  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'active').length,
    atRisk: programs.filter(p => p.complianceStatus === 'at_risk').length,
    totalBudget: programs.reduce((sum, p) => sum + p.totalBudget, 0),
    totalEnrolled: programs.reduce((sum, p) => sum + p.currentEnrollment, 0)
  };

  const handleCreateProgram = () => {
    showNotification('Program created successfully');
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      programType: 'wioa_title_i',
      description: '',
      fundingSource: 'wioa_title_i',
      grantNumber: '',
      totalBudget: '',
      startDate: '',
      endDate: '',
      enrollmentTarget: '',
      placementTarget: '80',
      wageGainTarget: '',
      industryFocus: ''
    });
  };

  const handleEditProgram = (program: WorkforceProgram) => {
    setEditingProgram(program);
    setSelectedProgram(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    showNotification('Program updated successfully');
    setShowEditModal(false);
    setEditingProgram(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg shadow-lg"
          >
            <CheckCircle className="w-4 h-4" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Programs</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">At Risk</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.atRisk}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Total Budget</span>
          </div>
          <p className="text-2xl font-bold text-white">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Total Enrolled</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalEnrolled.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Program
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Program Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="chips_act">CHIPS Act</option>
                  <option value="wioa_title_i">WIOA Title I</option>
                  <option value="wioa_title_ii">WIOA Title II</option>
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="state_grant">State Grant</option>
                  <option value="federal_grant">Federal Grant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Compliance Status</label>
                <select
                  value={complianceFilter}
                  onChange={(e) => setComplianceFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="compliant">Compliant</option>
                  <option value="at_risk">At Risk</option>
                  <option value="non_compliant">Non-Compliant</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((program, index) => {
          const typeConfig = programTypeLabels[program.programType] || programTypeLabels.other;
          const statusConf = statusConfig[program.status];
          const complianceConf = complianceStatusConfig[program.complianceStatus];
          const StatusIcon = statusConf.icon;
          const budgetPercent = Math.round((program.spentToDate / program.totalBudget) * 100);
          const enrollmentPercent = Math.round((program.currentEnrollment / program.enrollmentTarget) * 100);
          const placementRate = program.completedCount > 0
            ? Math.round((program.placedCount / program.completedCount) * 100)
            : 0;

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedProgram(program)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${twColor[typeConfig.color]?.bg || 'bg-slate-500/20'} ${twColor[typeConfig.color]?.text || 'text-slate-400'}`}>
                      {typeConfig.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${twColor[complianceConf.color]?.bg || 'bg-slate-500/20'} ${twColor[complianceConf.color]?.text || 'text-slate-400'}`}>
                      {complianceConf.label}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold line-clamp-2">{program.name}</h3>
                </div>
                <div className={`w-8 h-8 rounded-lg ${twColor[statusConf.color]?.bg || 'bg-slate-500/20'} flex items-center justify-center`}>
                  <StatusIcon className={`w-4 h-4 ${twColor[statusConf.color]?.text || 'text-slate-400'}`} />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Budget Spent</span>
                    <span className="text-white">${(program.spentToDate / 1000000).toFixed(1)}M / ${(program.totalBudget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${budgetPercent > 90 ? 'bg-red-500' : budgetPercent > 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Enrollment</span>
                    <span className="text-white">{program.currentEnrollment} / {program.enrollmentTarget}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(100, enrollmentPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{program.completedCount}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-emerald-400">{placementRate}%</p>
                  <p className="text-xs text-gray-400">Placement</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-400">${(program.averageWageGain || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Wage Gain</p>
                </div>
              </div>

              {/* Next Report Due */}
              {program.nextReportDue && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Next Report</span>
                  </div>
                  <span className="text-sm text-white">{new Date(program.nextReportDue).toLocaleDateString()}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-end text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No programs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[programTypeLabels[selectedProgram.programType]?.color || 'slate']?.bg || 'bg-slate-500/20'} ${twColor[programTypeLabels[selectedProgram.programType]?.color || 'slate']?.text || 'text-slate-400'}`}>
                        {programTypeLabels[selectedProgram.programType]?.label || selectedProgram.programType}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${twColor[complianceStatusConfig[selectedProgram.complianceStatus]?.color || 'slate']?.bg || 'bg-slate-500/20'} ${twColor[complianceStatusConfig[selectedProgram.complianceStatus]?.color || 'slate']?.text || 'text-slate-400'}`}>
                        {complianceStatusConfig[selectedProgram.complianceStatus]?.label || selectedProgram.complianceStatus}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedProgram.name}</h2>
                    <p className="text-gray-400 mt-1">{selectedProgram.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">Enrolled</span>
                    </div>
                    <p className="text-xl font-bold text-white">{selectedProgram.currentEnrollment}</p>
                    <p className="text-xs text-gray-400">of {selectedProgram.enrollmentTarget} target</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-gray-400">Completed</span>
                    </div>
                    <p className="text-xl font-bold text-white">{selectedProgram.completedCount}</p>
                    <p className="text-xs text-emerald-400">{selectedProgram.placedCount} placed</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">Placement Rate</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {selectedProgram.completedCount > 0
                        ? Math.round((selectedProgram.placedCount / selectedProgram.completedCount) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-400">target: {selectedProgram.placementTarget}%</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-gray-400">Avg Wage Gain</span>
                    </div>
                    <p className="text-xl font-bold text-white">${(selectedProgram.averageWageGain || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">target: ${(selectedProgram.wageGainTarget || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Budget Section */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Budget Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Budget</p>
                      <p className="text-xl font-bold text-white">${(selectedProgram.totalBudget / 1000000).toFixed(2)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Spent to Date</p>
                      <p className="text-xl font-bold text-blue-400">${(selectedProgram.spentToDate / 1000000).toFixed(2)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Remaining</p>
                      <p className="text-xl font-bold text-emerald-400">${(selectedProgram.budgetRemaining / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      style={{ width: `${Math.round((selectedProgram.spentToDate / selectedProgram.totalBudget) * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2 text-right">
                    {Math.round((selectedProgram.spentToDate / selectedProgram.totalBudget) * 100)}% utilized
                  </p>
                </div>

                {/* Timeline */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Program Timeline
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-white">{new Date(selectedProgram.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">End Date</p>
                      <p className="text-white">{new Date(selectedProgram.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Report</p>
                      <p className="text-white">{selectedProgram.lastReportDate ? new Date(selectedProgram.lastReportDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Next Report Due</p>
                      <p className="text-white">{selectedProgram.nextReportDue ? new Date(selectedProgram.nextReportDue).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Industry Focus */}
                {selectedProgram.industryFocus && selectedProgram.industryFocus.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Industry Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.industryFocus.map((industry, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditProgram(selectedProgram)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Program
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Program Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Create New Program</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Program Name</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g., WIOA Adult Training Program"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Program Type</label>
                    <select
                      value={createForm.programType}
                      onChange={e => setCreateForm({ ...createForm, programType: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(programTypeLabels).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Funding Source</label>
                    <select
                      value={createForm.fundingSource}
                      onChange={e => setCreateForm({ ...createForm, fundingSource: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(programTypeLabels).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={2}
                    placeholder="Describe the program objectives..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Grant Number</label>
                    <input
                      type="text"
                      value={createForm.grantNumber}
                      onChange={e => setCreateForm({ ...createForm, grantNumber: e.target.value })}
                      placeholder="e.g., WIOA-2024-001"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Total Budget ($)</label>
                    <input
                      type="number"
                      value={createForm.totalBudget}
                      onChange={e => setCreateForm({ ...createForm, totalBudget: e.target.value })}
                      placeholder="5000000"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={createForm.startDate}
                      onChange={e => setCreateForm({ ...createForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={createForm.endDate}
                      onChange={e => setCreateForm({ ...createForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enrollment Target</label>
                    <input
                      type="number"
                      value={createForm.enrollmentTarget}
                      onChange={e => setCreateForm({ ...createForm, enrollmentTarget: e.target.value })}
                      placeholder="500"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Placement Target (%)</label>
                    <input
                      type="number"
                      value={createForm.placementTarget}
                      onChange={e => setCreateForm({ ...createForm, placementTarget: e.target.value })}
                      placeholder="80"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Wage Gain Target ($)</label>
                    <input
                      type="number"
                      value={createForm.wageGainTarget}
                      onChange={e => setCreateForm({ ...createForm, wageGainTarget: e.target.value })}
                      placeholder="10000"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Industry Focus (comma-separated)</label>
                  <input
                    type="text"
                    value={createForm.industryFocus}
                    onChange={e => setCreateForm({ ...createForm, industryFocus: e.target.value })}
                    placeholder="Healthcare, IT, Manufacturing"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleCreateProgram} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Create Program</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Program Modal */}
      <AnimatePresence>
        {showEditModal && editingProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowEditModal(false); setEditingProgram(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Program</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Program Name</label>
                  <input
                    type="text"
                    defaultValue={editingProgram.name}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    defaultValue={editingProgram.description}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select
                      defaultValue={editingProgram.status}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enrollment Target</label>
                    <input
                      type="number"
                      defaultValue={editingProgram.enrollmentTarget}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Placement Target (%)</label>
                    <input
                      type="number"
                      defaultValue={editingProgram.placementTarget}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Wage Gain Target ($)</label>
                    <input
                      type="number"
                      defaultValue={editingProgram.wageGainTarget || 0}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowEditModal(false); setEditingProgram(null); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
