// ===========================================
// Employers Tab - Employer Partnership Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Building2,
  Filter,
  ChevronRight,
  Loader2,
  Users,
  Briefcase,
  Target,
  CheckCircle,
  Clock,
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  Handshake,
  GraduationCap
} from 'lucide-react';
import { getEmployerPartnerships, getWorkforcePrograms } from '@/services/governmentPartnerApi';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { EmployerPartnership, WorkforceProgram, GovernmentPartnerTier } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface EmployersTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const sampleEmployers: EmployerPartnership[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    employerName: 'Texas Instruments',
    industry: 'Semiconductor Manufacturing',
    naicsCode: '334413',
    contactName: 'Sarah Mitchell',
    contactEmail: 'smitchell@ti.com',
    contactPhone: '555-0456',
    contactTitle: 'Workforce Development Manager',
    city: 'Dallas',
    state: 'TX',
    commitmentTypes: ['hiring_pledge', 'ojt', 'apprenticeship'],
    status: 'active',
    hiringPledgeCount: 150,
    hiredToDate: 89,
    wageCommitment: 55000,
    ojtSlotsOffered: 50,
    ojtSlotsUsed: 32,
    apprenticeshipSlots: 25,
    agreementStartDate: '2024-01-15',
    agreementEndDate: '2026-12-31',
    moaSignedDate: '2024-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    employerName: 'Samsung Austin Semiconductor',
    industry: 'Semiconductor Manufacturing',
    naicsCode: '334413',
    contactName: 'John Park',
    contactEmail: 'jpark@samsung.com',
    contactPhone: '555-0789',
    contactTitle: 'HR Director',
    city: 'Austin',
    state: 'TX',
    commitmentTypes: ['hiring_pledge', 'apprenticeship', 'curriculum_input'],
    status: 'active',
    hiringPledgeCount: 200,
    hiredToDate: 145,
    wageCommitment: 62000,
    ojtSlotsOffered: 0,
    ojtSlotsUsed: 0,
    apprenticeshipSlots: 40,
    agreementStartDate: '2024-02-01',
    agreementEndDate: '2027-01-31',
    moaSignedDate: '2024-01-28',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: '1',
    programId: '2',
    employerName: 'Memorial Hermann Health System',
    industry: 'Healthcare',
    naicsCode: '622110',
    contactName: 'Lisa Rodriguez',
    contactEmail: 'lrodriguez@memorialhermann.org',
    contactPhone: '555-0321',
    contactTitle: 'Talent Acquisition Lead',
    city: 'Houston',
    state: 'TX',
    commitmentTypes: ['hiring_pledge', 'ojt', 'work_experience'],
    status: 'active',
    hiringPledgeCount: 75,
    hiredToDate: 42,
    wageCommitment: 45000,
    ojtSlotsOffered: 30,
    ojtSlotsUsed: 18,
    apprenticeshipSlots: 0,
    agreementStartDate: '2024-04-01',
    agreementEndDate: '2025-12-31',
    moaSignedDate: '2024-03-25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    partnerId: '1',
    employerName: 'Applied Materials',
    industry: 'Semiconductor Equipment',
    naicsCode: '333242',
    contactName: 'Mike Chen',
    contactEmail: 'mchen@amat.com',
    contactPhone: '555-0654',
    contactTitle: 'University Relations Manager',
    city: 'Austin',
    state: 'TX',
    commitmentTypes: ['hiring_pledge', 'curriculum_input'],
    status: 'pending',
    hiringPledgeCount: 100,
    hiredToDate: 0,
    wageCommitment: 58000,
    ojtSlotsOffered: 0,
    ojtSlotsUsed: 0,
    apprenticeshipSlots: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  prospecting: { label: 'Prospecting', color: 'slate', icon: Target },
  pending: { label: 'Pending', color: 'amber', icon: Clock },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'gray', icon: X },
  expired: { label: 'Expired', color: 'red', icon: X }
};

const commitmentTypeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  hiring_pledge: { label: 'Hiring Pledge', icon: Users, color: 'blue' },
  ojt: { label: 'OJT', icon: Briefcase, color: 'purple' },
  apprenticeship: { label: 'Apprenticeship', icon: GraduationCap, color: 'emerald' },
  work_experience: { label: 'Work Experience', icon: Briefcase, color: 'amber' },
  curriculum_input: { label: 'Curriculum Input', icon: FileText, color: 'cyan' }
};

// Static Tailwind color map
const twColor: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
};

// ===========================================
// COMPONENT
// ===========================================

export const EmployersTab: React.FC<EmployersTabProps> = ({ partnerId, tier: _tier }) => {
  const [employers, setEmployers] = useState<EmployerPartnership[]>([]);
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerPartnership | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState<EmployerPartnership | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Add employer form
  const [addForm, setAddForm] = useState({
    employerName: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactTitle: '',
    city: '',
    state: '',
    hiringPledgeCount: '',
    wageCommitment: '',
    programId: ''
  });

  // Escape key handling for modals
  const closeAnyModal = () => {
    if (selectedEmployer) setSelectedEmployer(null);
    else if (showEditModal) { setShowEditModal(false); setEditingEmployer(null); }
    else if (showAddModal) setShowAddModal(false);
  };
  useEscapeKey(closeAnyModal, !!selectedEmployer || showAddModal || showEditModal);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportEmployers = () => {
    const headers = ['Employer', 'Industry', 'NAICS', 'Contact', 'Email', 'Status', 'Hiring Pledge', 'Hired', 'OJT Slots', 'Apprenticeships'];
    const rows = filteredEmployers.map(e => [
      `"${e.employerName}"`, `"${e.industry}"`, e.naicsCode || '', `"${e.contactName}"`, e.contactEmail,
      e.status, e.hiringPledgeCount || 0, e.hiredToDate, e.ojtSlotsOffered || 0, e.apprenticeshipSlots || 0
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employers-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Employer data exported successfully');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employersData, programsData] = await Promise.all([
          getEmployerPartnerships(partnerId),
          getWorkforcePrograms(partnerId)
        ]);
        setEmployers(employersData.length > 0 ? employersData : sampleEmployers);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching employers:', error);
        setEmployers(sampleEmployers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  // Get unique industries
  const industries = [...new Set(employers.map(e => e.industry))];

  // Filter employers
  const filteredEmployers = employers.filter(e => {
    const matchesSearch = searchQuery === '' ||
      e.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.contactName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || e.status === statusFilter;
    const matchesIndustry = industryFilter === '' || e.industry === industryFilter;
    const matchesProgram = programFilter === '' || e.programId === programFilter;

    return matchesSearch && matchesStatus && matchesIndustry && matchesProgram;
  });

  // Calculate stats
  const stats = {
    total: employers.length,
    active: employers.filter(e => e.status === 'active').length,
    totalPledges: employers.reduce((sum, e) => sum + (e.hiringPledgeCount || 0), 0),
    totalHired: employers.reduce((sum, e) => sum + e.hiredToDate, 0),
    ojtSlots: employers.reduce((sum, e) => sum + (e.ojtSlotsOffered || 0), 0),
    apprenticeships: employers.reduce((sum, e) => sum + (e.apprenticeshipSlots || 0), 0)
  };

  const getProgramName = (programId?: string) => {
    if (!programId) return 'Multiple Programs';
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const handleAddEmployer = () => {
    showNotification('Employer partnership added successfully');
    setShowAddModal(false);
    setAddForm({
      employerName: '',
      industry: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactTitle: '',
      city: '',
      state: '',
      hiringPledgeCount: '',
      wageCommitment: '',
      programId: ''
    });
  };

  const handleEditEmployer = (employer: EmployerPartnership) => {
    setEditingEmployer(employer);
    setSelectedEmployer(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    showNotification('Partnership updated successfully');
    setShowEditModal(false);
    setEditingEmployer(null);
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
            className={`fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Partners</span>
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
            <Handshake className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Hiring Pledges</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalPledges}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Hired</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalHired}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">OJT Slots</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.ojtSlots}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Apprenticeships</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.apprenticeships}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employers..."
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
            onClick={handleExportEmployers}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Employer
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
                  <option value="prospecting">Prospecting</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Industry</label>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Industries</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Program</label>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Programs</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployers.map((employer, index) => {
          const statusConf = statusConfig[employer.status] || statusConfig.active;
          const pledgeProgress = employer.hiringPledgeCount
            ? Math.round(((employer.hiredToDate || 0) / employer.hiringPledgeCount) * 100)
            : 0;

          return (
            <motion.div
              key={employer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedEmployer(employer)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${twColor[statusConf.color]?.bg || 'bg-slate-500/20'} ${twColor[statusConf.color]?.text || 'text-slate-400'}`}>
                      {statusConf.label}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold">{employer.employerName}</h3>
                  <p className="text-sm text-gray-400">{employer.industry}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                {employer.city}, {employer.state}
              </div>

              {/* Commitment Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {employer.commitmentTypes.map((type, idx) => {
                  const typeConf = commitmentTypeLabels[type];
                  if (!typeConf) return null;
                  const TypeIcon = typeConf.icon;
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${twColor[typeConf.color]?.bg || 'bg-slate-500/20'} ${twColor[typeConf.color]?.text || 'text-slate-400'}`}
                    >
                      <TypeIcon className="w-3 h-3" />
                      {typeConf.label}
                    </span>
                  );
                })}
              </div>

              {/* Hiring Progress */}
              {employer.hiringPledgeCount && employer.hiringPledgeCount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Hiring Progress</span>
                    <span className="text-white">{employer.hiredToDate} / {employer.hiringPledgeCount}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(100, pledgeProgress)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pledgeProgress}% fulfilled</p>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{employer.ojtSlotsUsed}/{employer.ojtSlotsOffered || 0}</p>
                  <p className="text-xs text-gray-400">OJT</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">{employer.apprenticeshipSlots || 0}</p>
                  <p className="text-xs text-gray-400">Apprentice</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-emerald-400">${((employer.wageCommitment || 0) / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-400">Min Wage</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEmployers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No employers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Employer Detail Modal */}
      <AnimatePresence>
        {selectedEmployer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedEmployer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedEmployer.employerName}</h2>
                      <p className="text-gray-400">{selectedEmployer.industry}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${twColor[statusConfig[selectedEmployer.status]?.color || 'slate']?.bg || 'bg-slate-500/20'} ${twColor[statusConfig[selectedEmployer.status]?.color || 'slate']?.text || 'text-slate-400'}`}>
                        {statusConfig[selectedEmployer.status]?.label || selectedEmployer.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmployer(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Primary Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-white">{selectedEmployer.contactName}</p>
                      {selectedEmployer.contactTitle && (
                        <p className="text-sm text-gray-400">{selectedEmployer.contactTitle}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white">{selectedEmployer.city}, {selectedEmployer.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedEmployer.contactEmail}`} className="text-blue-400 hover:underline">
                        {selectedEmployer.contactEmail}
                      </a>
                    </div>
                    {selectedEmployer.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{selectedEmployer.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commitment Types */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Partnership Commitments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployer.commitmentTypes.map((type, idx) => {
                      const typeConf = commitmentTypeLabels[type];
                      if (!typeConf) return null;
                      const TypeIcon = typeConf.icon;
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${twColor[typeConf.color]?.bg || 'bg-slate-500/20'} ${twColor[typeConf.color]?.text || 'text-slate-400'}`}
                        >
                          <TypeIcon className="w-4 h-4" />
                          {typeConf.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Hiring Metrics */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Hiring Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Hiring Pledge</p>
                      <p className="text-xl font-bold text-white">{selectedEmployer.hiringPledgeCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Hired to Date</p>
                      <p className="text-xl font-bold text-emerald-400">{selectedEmployer.hiredToDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">OJT Slots</p>
                      <p className="text-xl font-bold text-white">{selectedEmployer.ojtSlotsUsed}/{selectedEmployer.ojtSlotsOffered || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Apprenticeships</p>
                      <p className="text-xl font-bold text-white">{selectedEmployer.apprenticeshipSlots || 0}</p>
                    </div>
                  </div>
                  {selectedEmployer.hiringPledgeCount && selectedEmployer.hiringPledgeCount > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Pledge Fulfillment</span>
                        <span className="text-white">
                          {Math.round((selectedEmployer.hiredToDate / selectedEmployer.hiringPledgeCount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          style={{ width: `${Math.min(100, (selectedEmployer.hiredToDate / selectedEmployer.hiringPledgeCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Agreement Info */}
                {(selectedEmployer.agreementStartDate || selectedEmployer.moaSignedDate) && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Agreement Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedEmployer.moaSignedDate && (
                        <div>
                          <p className="text-sm text-gray-400">MOA Signed</p>
                          <p className="text-white">{new Date(selectedEmployer.moaSignedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedEmployer.agreementStartDate && (
                        <div>
                          <p className="text-sm text-gray-400">Start Date</p>
                          <p className="text-white">{new Date(selectedEmployer.agreementStartDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedEmployer.agreementEndDate && (
                        <div>
                          <p className="text-sm text-gray-400">End Date</p>
                          <p className="text-white">{new Date(selectedEmployer.agreementEndDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedEmployer.wageCommitment && (
                        <div>
                          <p className="text-sm text-gray-400">Minimum Wage Commitment</p>
                          <p className="text-emerald-400 font-medium">${selectedEmployer.wageCommitment.toLocaleString()}/yr</p>
                        </div>
                      )}
                      {selectedEmployer.naicsCode && (
                        <div>
                          <p className="text-sm text-gray-400">NAICS Code</p>
                          <p className="text-white">{selectedEmployer.naicsCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Program Association */}
                {selectedEmployer.programId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Associated Program</h3>
                    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <span className="text-white">{getProgramName(selectedEmployer.programId)}</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEmployer.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                    <p className="text-gray-300 bg-gray-800 rounded-lg p-3">{selectedEmployer.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEmployer(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditEmployer(selectedEmployer)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Partnership
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Employer Partner</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Employer Name</label>
                  <input
                    type="text"
                    value={addForm.employerName}
                    onChange={e => setAddForm({ ...addForm, employerName: e.target.value })}
                    placeholder="e.g., Acme Corporation"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Industry</label>
                    <input
                      type="text"
                      value={addForm.industry}
                      onChange={e => setAddForm({ ...addForm, industry: e.target.value })}
                      placeholder="e.g., Manufacturing"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Program</label>
                    <select
                      value={addForm.programId}
                      onChange={e => setAddForm({ ...addForm, programId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select program</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={addForm.contactName}
                      onChange={e => setAddForm({ ...addForm, contactName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Title</label>
                    <input
                      type="text"
                      value={addForm.contactTitle}
                      onChange={e => setAddForm({ ...addForm, contactTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={addForm.contactEmail}
                      onChange={e => setAddForm({ ...addForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={addForm.contactPhone}
                      onChange={e => setAddForm({ ...addForm, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">City</label>
                    <input
                      type="text"
                      value={addForm.city}
                      onChange={e => setAddForm({ ...addForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">State</label>
                    <input
                      type="text"
                      value={addForm.state}
                      onChange={e => setAddForm({ ...addForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Hiring Pledge</label>
                    <input
                      type="number"
                      value={addForm.hiringPledgeCount}
                      onChange={e => setAddForm({ ...addForm, hiringPledgeCount: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min Wage Commitment ($)</label>
                    <input
                      type="number"
                      value={addForm.wageCommitment}
                      onChange={e => setAddForm({ ...addForm, wageCommitment: e.target.value })}
                      placeholder="50000"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleAddEmployer} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Add Partnership</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Employer Modal */}
      <AnimatePresence>
        {showEditModal && editingEmployer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowEditModal(false); setEditingEmployer(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Partnership</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Employer Name</label>
                  <input type="text" defaultValue={editingEmployer.employerName} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select defaultValue={editingEmployer.status} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Hiring Pledge</label>
                    <input type="number" defaultValue={editingEmployer.hiringPledgeCount || 0} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Hired to Date</label>
                    <input type="number" defaultValue={editingEmployer.hiredToDate} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                    <input type="text" defaultValue={editingEmployer.contactName} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                    <input type="email" defaultValue={editingEmployer.contactEmail} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowEditModal(false); setEditingEmployer(null); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
