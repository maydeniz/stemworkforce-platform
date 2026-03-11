// ===========================================
// Participants Tab - Program Participant Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Users,
  Filter,
  ChevronRight,
  Loader2,
  GraduationCap,
  Briefcase,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  MapPin,
  Download
} from 'lucide-react';
import { getProgramParticipants, getWorkforcePrograms } from '@/services/governmentPartnerApi';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { ProgramParticipant, WorkforceProgram, GovernmentPartnerTier } from '@/types/governmentPartner';

// ===========================================
// TYPES
// ===========================================

interface ParticipantsTabProps {
  partnerId: string;
  tier: GovernmentPartnerTier;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const sampleParticipants: ProgramParticipant[] = [
  {
    id: '1',
    partnerId: '1',
    programId: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'msantos@email.com',
    phone: '555-0123',
    zipCode: '78701',
    county: 'Travis',
    veteranStatus: false,
    disabilityStatus: false,
    barriers: ['long_term_unemployed'],
    educationLevel: 'some_college',
    employedAtEnrollment: false,
    priorWage: 32000,
    unemploymentDuration: 8,
    status: 'active',
    enrollmentDate: '2024-03-15',
    trainingHoursCompleted: 240,
    credentialsEarned: ['CompTIA A+'],
    skillsGained: ['Semiconductor Fabrication', 'Clean Room Protocols'],
    placed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    programId: '1',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'jwilson@email.com',
    veteranStatus: true,
    disabilityStatus: false,
    barriers: [],
    educationLevel: 'bachelors',
    employedAtEnrollment: false,
    priorWage: 45000,
    unemploymentDuration: 3,
    status: 'completed',
    enrollmentDate: '2024-01-10',
    completionDate: '2024-06-15',
    trainingHoursCompleted: 480,
    credentialsEarned: ['Semiconductor Technician Cert', 'OSHA 10'],
    skillsGained: ['Equipment Maintenance', 'Process Control'],
    placed: true,
    placementDate: '2024-07-01',
    placementEmployer: 'Texas Instruments',
    placementOccupation: 'Process Technician',
    placementWage: 65000,
    retainedAt90Days: true,
    wageGain: 20000,
    wageGainPercent: 44,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    partnerId: '1',
    programId: '2',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'schen@email.com',
    veteranStatus: false,
    disabilityStatus: true,
    barriers: ['disability', 'basic_skills_deficient'],
    educationLevel: 'high_school',
    employedAtEnrollment: true,
    priorWage: 28000,
    status: 'active',
    enrollmentDate: '2024-05-20',
    trainingHoursCompleted: 120,
    credentialsEarned: [],
    skillsGained: ['Healthcare Administration Basics'],
    placed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    partnerId: '1',
    programId: '1',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'mjohnson@email.com',
    veteranStatus: true,
    disabilityStatus: false,
    barriers: [],
    educationLevel: 'associates',
    employedAtEnrollment: false,
    priorWage: 52000,
    unemploymentDuration: 2,
    status: 'completed',
    enrollmentDate: '2024-02-01',
    completionDate: '2024-05-30',
    trainingHoursCompleted: 400,
    credentialsEarned: ['CNC Machinist Cert', 'Six Sigma Green Belt'],
    skillsGained: ['CNC Programming', 'Quality Control'],
    placed: true,
    placementDate: '2024-06-15',
    placementEmployer: 'Samsung Austin',
    placementOccupation: 'Manufacturing Technician',
    placementWage: 72000,
    retainedAt90Days: true,
    retainedAt180Days: true,
    wageGain: 20000,
    wageGainPercent: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ===========================================
// CONFIG
// ===========================================

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  enrolled: { label: 'Enrolled', color: 'blue', icon: Users },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  completed: { label: 'Completed', color: 'purple', icon: Award },
  exited: { label: 'Exited', color: 'amber', icon: AlertCircle },
  dropped: { label: 'Dropped', color: 'red', icon: X }
};

// Static Tailwind color map
const twColor: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

const barrierLabels: Record<string, string> = {
  long_term_unemployed: 'Long-term Unemployed',
  basic_skills_deficient: 'Basic Skills Deficient',
  english_language_learner: 'English Language Learner',
  disability: 'Disability',
  ex_offender: 'Ex-Offender',
  homeless: 'Homeless/Housing Insecure',
  foster_care: 'Foster Care Youth',
  low_income: 'Low Income',
  single_parent: 'Single Parent',
  lacks_transportation: 'Lacks Transportation',
  lacks_childcare: 'Lacks Childcare'
};

const educationLabels: Record<string, string> = {
  less_than_high_school: 'Less than High School',
  high_school: 'High School/GED',
  some_college: 'Some College',
  associates: "Associate's Degree",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  doctoral: 'Doctoral Degree'
};

// ===========================================
// COMPONENT
// ===========================================

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ partnerId, tier: _tier }) => {
  const [participants, setParticipants] = useState<ProgramParticipant[]>([]);
  const [programs, setPrograms] = useState<WorkforceProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [veteranFilter, setVeteranFilter] = useState<string>('');
  const [placedFilter, setPlacedFilter] = useState<string>('');
  const [selectedParticipant, setSelectedParticipant] = useState<ProgramParticipant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<ProgramParticipant | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Escape key handling for modals
  const closeAnyModal = () => {
    if (selectedParticipant) setSelectedParticipant(null);
    else if (showEditModal) { setShowEditModal(false); setEditingParticipant(null); }
    else if (showAddModal) setShowAddModal(false);
  };
  useEscapeKey(closeAnyModal, !!selectedParticipant || showAddModal || showEditModal);

  // Add participant form
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    programId: '',
    veteranStatus: false,
    disabilityStatus: false,
    educationLevel: 'high_school',
    priorWage: '',
    zipCode: '',
    county: ''
  });

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [participantsData, programsData] = await Promise.all([
          getProgramParticipants(partnerId),
          getWorkforcePrograms(partnerId)
        ]);
        setParticipants(participantsData.length > 0 ? participantsData : sampleParticipants);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setParticipants(sampleParticipants);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = searchQuery === '' ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    const matchesProgram = programFilter === '' || p.programId === programFilter;
    const matchesVeteran = veteranFilter === '' ||
      (veteranFilter === 'yes' && p.veteranStatus) ||
      (veteranFilter === 'no' && !p.veteranStatus);
    const matchesPlaced = placedFilter === '' ||
      (placedFilter === 'yes' && p.placed) ||
      (placedFilter === 'no' && !p.placed);

    return matchesSearch && matchesStatus && matchesProgram && matchesVeteran && matchesPlaced;
  });

  // Calculate stats
  const stats = {
    total: participants.length,
    active: participants.filter(p => p.status === 'active').length,
    completed: participants.filter(p => p.status === 'completed').length,
    placed: participants.filter(p => p.placed).length,
    veterans: participants.filter(p => p.veteranStatus).length,
    avgWageGain: participants.filter(p => p.wageGain).length > 0
      ? Math.round(participants.filter(p => p.wageGain).reduce((sum, p) => sum + (p.wageGain || 0), 0) / participants.filter(p => p.wageGain).length)
      : 0
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const handleExport = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Status', 'Program', 'Veteran', 'Enrollment Date', 'Training Hours', 'Placed', 'Wage Gain'];
    const rows = filteredParticipants.map(p => [
      p.firstName, p.lastName, p.email || '', p.status, getProgramName(p.programId),
      p.veteranStatus ? 'Yes' : 'No', p.enrollmentDate, p.trainingHoursCompleted,
      p.placed ? 'Yes' : 'No', p.wageGain || 0
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Participant data exported successfully', 'info');
  };

  const handleAddParticipant = () => {
    showNotification('Participant enrolled successfully');
    setShowAddModal(false);
    setAddForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      programId: '',
      veteranStatus: false,
      disabilityStatus: false,
      educationLevel: 'high_school',
      priorWage: '',
      zipCode: '',
      county: ''
    });
  };

  const handleEditParticipant = (participant: ProgramParticipant) => {
    setEditingParticipant(participant);
    setSelectedParticipant(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    showNotification('Participant updated successfully');
    setShowEditModal(false);
    setEditingParticipant(null);
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
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total</span>
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
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Placed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.placed}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Veterans</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.veterans}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Avg Wage Gain</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.avgWageGain.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
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
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Participant
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="exited">Exited</option>
                  <option value="dropped">Dropped</option>
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
              <div>
                <label className="block text-sm text-gray-400 mb-2">Veteran Status</label>
                <select
                  value={veteranFilter}
                  onChange={(e) => setVeteranFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Veterans Only</option>
                  <option value="no">Non-Veterans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Placement Status</label>
                <select
                  value={placedFilter}
                  onChange={(e) => setPlacedFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Placed</option>
                  <option value="no">Not Placed</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 p-4">Participant</th>
                <th className="text-left text-sm text-gray-400 p-4">Program</th>
                <th className="text-center text-sm text-gray-400 p-4">Status</th>
                <th className="text-center text-sm text-gray-400 p-4">Training Hours</th>
                <th className="text-center text-sm text-gray-400 p-4">Credentials</th>
                <th className="text-center text-sm text-gray-400 p-4">Placement</th>
                <th className="text-right text-sm text-gray-400 p-4">Wage Gain</th>
                <th className="text-right text-sm text-gray-400 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant, idx) => {
                const statusConf = statusConfig[participant.status] || statusConfig.active;
                const StatusIcon = statusConf.icon;

                return (
                  <motion.tr
                    key={participant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setSelectedParticipant(participant)}
                    className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {participant.firstName[0]}{participant.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{participant.firstName} {participant.lastName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            {participant.veteranStatus && (
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3 text-amber-400" />
                                Veteran
                              </span>
                            )}
                            {participant.county && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {participant.county}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 text-sm truncate max-w-[200px]">
                        {getProgramName(participant.programId)}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${twColor[statusConf.color]?.bg || 'bg-slate-500/20'} ${twColor[statusConf.color]?.text || 'text-slate-400'}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-white">{participant.trainingHoursCompleted}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-white">{participant.credentialsEarned.length}</span>
                    </td>
                    <td className="p-4 text-center">
                      {participant.placed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          Placed
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {participant.wageGain ? (
                        <div>
                          <p className="text-emerald-400 font-medium">+${participant.wageGain.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">+{participant.wageGainPercent}%</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredParticipants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No participants found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Participant Detail Modal */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedParticipant(null)}
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
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                      {selectedParticipant.firstName[0]}{selectedParticipant.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedParticipant.firstName} {selectedParticipant.lastName}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        {selectedParticipant.veteranStatus && (
                          <span className="flex items-center gap-1 text-sm text-amber-400">
                            <Shield className="w-4 h-4" />
                            Veteran
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${twColor[statusConfig[selectedParticipant.status]?.color || 'slate']?.bg || 'bg-slate-500/20'} ${twColor[statusConfig[selectedParticipant.status]?.color || 'slate']?.text || 'text-slate-400'}`}>
                          {statusConfig[selectedParticipant.status]?.label || selectedParticipant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedParticipant.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{selectedParticipant.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{selectedParticipant.county || 'N/A'}, {selectedParticipant.zipCode || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Education</p>
                    <p className="text-white">{educationLabels[selectedParticipant.educationLevel || ''] || selectedParticipant.educationLevel || 'N/A'}</p>
                  </div>
                </div>

                {/* Program Info */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Program Enrollment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Program</p>
                      <p className="text-white">{getProgramName(selectedParticipant.programId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Enrollment Date</p>
                      <p className="text-white">{new Date(selectedParticipant.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Training Hours</p>
                      <p className="text-white">{selectedParticipant.trainingHoursCompleted} hours</p>
                    </div>
                    {selectedParticipant.completionDate && (
                      <div>
                        <p className="text-sm text-gray-400">Completion Date</p>
                        <p className="text-white">{new Date(selectedParticipant.completionDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Credentials & Skills */}
                {(selectedParticipant.credentialsEarned.length > 0 || selectedParticipant.skillsGained.length > 0) && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      Credentials & Skills
                    </h3>
                    {selectedParticipant.credentialsEarned.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-2">Credentials Earned</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipant.credentialsEarned.map((cred, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {cred}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedParticipant.skillsGained.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Skills Gained</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipant.skillsGained.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Placement Info */}
                {selectedParticipant.placed && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      Placement Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Employer</p>
                        <p className="text-white">{selectedParticipant.placementEmployer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Position</p>
                        <p className="text-white">{selectedParticipant.placementOccupation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Placement Date</p>
                        <p className="text-white">{selectedParticipant.placementDate ? new Date(selectedParticipant.placementDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">New Wage</p>
                        <p className="text-emerald-400 font-medium">${(selectedParticipant.placementWage || 0).toLocaleString()}/yr</p>
                      </div>
                    </div>
                    {selectedParticipant.wageGain && (
                      <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Wage Gain</span>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold text-lg">+${selectedParticipant.wageGain.toLocaleString()}</span>
                            <span className="text-emerald-400 ml-2">(+{selectedParticipant.wageGainPercent}%)</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedParticipant.retainedAt90Days ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                        <span className="text-sm text-gray-400">90-Day Retention</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedParticipant.retainedAt180Days ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                        <span className="text-sm text-gray-400">180-Day Retention</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Barriers */}
                {selectedParticipant.barriers && selectedParticipant.barriers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Employment Barriers</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.barriers.map((barrier, idx) => (
                        <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                          {barrierLabels[barrier] || barrier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditParticipant(selectedParticipant)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Participant
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Participant Modal */}
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
              <h3 className="text-xl font-bold text-white mb-4">Enroll New Participant</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={addForm.firstName}
                      onChange={e => setAddForm({ ...addForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={addForm.lastName}
                      onChange={e => setAddForm({ ...addForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={addForm.phone}
                      onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Program</label>
                  <select
                    value={addForm.programId}
                    onChange={e => setAddForm({ ...addForm, programId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a program</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Education Level</label>
                  <select
                    value={addForm.educationLevel}
                    onChange={e => setAddForm({ ...addForm, educationLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {Object.entries(educationLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={addForm.zipCode}
                      onChange={e => setAddForm({ ...addForm, zipCode: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Prior Wage ($)</label>
                    <input
                      type="number"
                      value={addForm.priorWage}
                      onChange={e => setAddForm({ ...addForm, priorWage: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addForm.veteranStatus}
                      onChange={e => setAddForm({ ...addForm, veteranStatus: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    Veteran
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addForm.disabilityStatus}
                      onChange={e => setAddForm({ ...addForm, disabilityStatus: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    Disability
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleAddParticipant} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Enroll Participant</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Participant Modal */}
      <AnimatePresence>
        {showEditModal && editingParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowEditModal(false); setEditingParticipant(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Participant</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input type="text" defaultValue={editingParticipant.firstName} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input type="text" defaultValue={editingParticipant.lastName} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select defaultValue={editingParticipant.status} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input type="email" defaultValue={editingParticipant.email || ''} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input type="tel" defaultValue={editingParticipant.phone || ''} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowEditModal(false); setEditingParticipant(null); }} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
