// ===========================================
// Participants Tab - WIOA Participant Management
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  X,
  CheckCircle,
  Clock,
  UserCheck,
  UserPlus,
  UserMinus,
  FileText,
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type {
  Participant,
  BarrierToEmployment
} from '@/types/stateWorkforce';

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_PARTICIPANTS: Participant[] = [
  {
    id: 'p-001', first_name: 'Maria', last_name: 'Santos', date_of_birth: '1988-03-15',
    email: 'msantos@email.com', phone: '512-555-0101',
    address_city: 'Austin', address_state: 'TX', address_zip: '78701', county: 'Travis',
    gender: 'FEMALE', veteran_status: false, disability_status: false,
    employment_status: 'UNEMPLOYED', low_income: true,
    barriers: ['LONG_TERM_UNEMPLOYED', 'SINGLE_PARENT'],
    status: 'ACTIVE', registration_date: '2025-01-10', enrollment_date: '2025-01-15',
    assigned_case_manager_id: 'cm-01', assigned_ajc_id: 'ajc-1', lwdb_id: 'lwdb-1',
    program_enrollments: [
      { program: 'Title I - Adult', status: 'Active', enrollment_date: '2025-01-15', services_received: ['Career Counseling', 'ITA - CNC Machining'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'p-002', first_name: 'James', last_name: 'Wilson', date_of_birth: '1975-08-22',
    email: 'jwilson@email.com', phone: '713-555-0202',
    address_city: 'Houston', address_state: 'TX', address_zip: '77027', county: 'Harris',
    gender: 'MALE', veteran_status: true, disability_status: false,
    employment_status: 'UNEMPLOYED',
    barriers: ['VETERAN'],
    status: 'TRAINING', registration_date: '2024-11-01', enrollment_date: '2024-11-15',
    assigned_case_manager_id: 'cm-02', assigned_ajc_id: 'ajc-4', lwdb_id: 'lwdb-2',
    program_enrollments: [
      { program: 'Title I - Dislocated Worker', status: 'Active', enrollment_date: '2024-11-15', services_received: ['OJT - Welding', 'Supportive Services'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'p-003', first_name: 'Aisha', last_name: 'Mohammed', date_of_birth: '2003-06-10',
    email: 'amohammed@email.com', phone: '512-555-0303',
    address_city: 'Round Rock', address_state: 'TX', address_zip: '78681', county: 'Williamson',
    gender: 'FEMALE', veteran_status: false, disability_status: false,
    employment_status: 'NOT_IN_LABOR_FORCE', low_income: true,
    barriers: ['YOUTH_OUT_OF_SCHOOL', 'BASIC_SKILLS_DEFICIENT', 'ENGLISH_LANGUAGE_LEARNER'],
    status: 'ENROLLED', registration_date: '2025-02-05', enrollment_date: '2025-02-10',
    assigned_case_manager_id: 'cm-01', assigned_ajc_id: 'ajc-2', lwdb_id: 'lwdb-1',
    program_enrollments: [
      { program: 'Title I - Youth', status: 'Active', enrollment_date: '2025-02-10', services_received: ['Orientation', 'Assessment'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'p-004', first_name: 'Robert', last_name: 'Chen', date_of_birth: '1965-12-01',
    email: 'rchen@email.com', phone: '713-555-0404',
    address_city: 'Sugar Land', address_state: 'TX', address_zip: '77478', county: 'Fort Bend',
    gender: 'MALE', veteran_status: false, disability_status: true,
    employment_status: 'UNEMPLOYED',
    barriers: ['DISABILITY', 'OLDER_WORKER', 'LONG_TERM_UNEMPLOYED'],
    status: 'FOLLOW_UP_Q2', registration_date: '2024-06-15', enrollment_date: '2024-07-01',
    exit_date: '2024-12-15', exit_reason: 'Completed training, obtained employment',
    assigned_case_manager_id: 'cm-03', assigned_ajc_id: 'ajc-5', lwdb_id: 'lwdb-2',
    program_enrollments: [
      { program: 'Title I - Adult', status: 'Exited', enrollment_date: '2024-07-01', exit_date: '2024-12-15', services_received: ['Occupational Training', 'Supportive Services', 'Job Search Assistance'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'p-005', first_name: 'Linda', last_name: 'Thompson', date_of_birth: '1990-04-28',
    email: 'lthompson@email.com', phone: '512-555-0505',
    address_city: 'San Marcos', address_state: 'TX', address_zip: '78666', county: 'Hays',
    gender: 'FEMALE', veteran_status: false, disability_status: false,
    employment_status: 'UNDEREMPLOYED', tanf_recipient: true,
    barriers: ['EXHAUSTING_TANF', 'LACKS_CHILDCARE', 'LOW_INCOME'],
    status: 'ACTIVE', registration_date: '2025-01-20', enrollment_date: '2025-02-01',
    assigned_case_manager_id: 'cm-01', assigned_ajc_id: 'ajc-3', lwdb_id: 'lwdb-1',
    program_enrollments: [
      { program: 'TANF', status: 'Active', enrollment_date: '2025-02-01', services_received: ['Childcare Assistance', 'Career Counseling'] },
      { program: 'Title I - Adult', status: 'Active', enrollment_date: '2025-02-01', services_received: ['IEP Development'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'p-006', first_name: 'Carlos', last_name: 'Rivera', date_of_birth: '1982-09-17',
    email: 'crivera@email.com', phone: '713-555-0606',
    address_city: 'Pasadena', address_state: 'TX', address_zip: '77501', county: 'Harris',
    gender: 'MALE', veteran_status: false, disability_status: false,
    employment_status: 'UNEMPLOYED',
    barriers: ['EX_OFFENDER', 'LOW_INCOME', 'LIMITED_WORK_HISTORY'],
    status: 'EMPLOYED', registration_date: '2024-08-10', enrollment_date: '2024-08-20',
    exit_date: '2025-01-15',
    assigned_case_manager_id: 'cm-02', assigned_ajc_id: 'ajc-4', lwdb_id: 'lwdb-2',
    program_enrollments: [
      { program: 'Title I - Adult', status: 'Exited', enrollment_date: '2024-08-20', exit_date: '2025-01-15', services_received: ['Transitional Jobs', 'Job Readiness Training', 'Work Attire'] }
    ],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];

// ===========================================
// STATUS CONFIG
// ===========================================

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  REGISTERED: { label: 'Registered', color: 'bg-gray-500/20 text-gray-400', icon: UserPlus },
  PENDING_ELIGIBILITY: { label: 'Pending Eligibility', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  ELIGIBLE: { label: 'Eligible', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle },
  ENROLLED: { label: 'Enrolled', color: 'bg-blue-500/20 text-blue-400', icon: UserPlus },
  ACTIVE: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-400', icon: UserCheck },
  TRAINING: { label: 'In Training', color: 'bg-purple-500/20 text-purple-400', icon: FileText },
  EMPLOYED: { label: 'Employed', color: 'bg-emerald-500/20 text-emerald-400', icon: ArrowUpRight },
  EXITED: { label: 'Exited', color: 'bg-gray-500/20 text-gray-400', icon: UserMinus },
  FOLLOW_UP_Q2: { label: 'Follow-Up Q2', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  FOLLOW_UP_Q4: { label: 'Follow-Up Q4', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  CLOSED: { label: 'Closed', color: 'bg-gray-500/20 text-gray-400', icon: X },
};

const barrierLabels: Record<string, string> = {
  LONG_TERM_UNEMPLOYED: 'Long-term Unemployed',
  EX_OFFENDER: 'Ex-Offender',
  HOMELESS: 'Homeless',
  LOW_INCOME: 'Low Income',
  BASIC_SKILLS_DEFICIENT: 'Basic Skills Deficient',
  ENGLISH_LANGUAGE_LEARNER: 'English Language Learner',
  SINGLE_PARENT: 'Single Parent',
  DISABILITY: 'Disability',
  VETERAN: 'Veteran',
  OLDER_WORKER: 'Older Worker',
  YOUTH_OUT_OF_SCHOOL: 'Out-of-School Youth',
  YOUTH_FOSTER_CARE: 'Youth in Foster Care',
  EXHAUSTING_TANF: 'Exhausting TANF',
  LACKS_CHILDCARE: 'Lacks Childcare',
  LACKS_TRANSPORTATION: 'Lacks Transportation',
  LIMITED_WORK_HISTORY: 'Limited Work History',
  DISPLACED_HOMEMAKER: 'Displaced Homemaker',
  SUBSTANCE_ABUSE_HISTORY: 'Substance Abuse History',
  PUBLIC_ASSISTANCE_RECIPIENT: 'Public Assistance',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  CULTURAL_BARRIERS: 'Cultural Barriers',
  MIGRANT_SEASONAL_FARMWORKER: 'Migrant/Seasonal Farmworker',
  FOSTER_CARE: 'Foster Care',
  REQUIRES_ADDITIONAL_ASSISTANCE: 'Requires Additional Assistance',
};

// ===========================================
// COMPONENT
// ===========================================

export const ParticipantsTab: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [barrierFilter, setBarrierFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedParticipant(null), !!selectedParticipant);

  const handleExport = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Status', 'City', 'County', 'Veteran', 'Registration Date', 'Programs'];
    const rows = filteredParticipants.map(p => [
      p.id, p.first_name, p.last_name, p.email || '', p.status,
      p.address_city || '', p.county || '', p.veteran_status ? 'Yes' : 'No',
      p.registration_date, (p.program_enrollments || []).map(pe => pe.program).join('; ')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Participant data exported successfully');
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setParticipants(SAMPLE_PARTICIPANTS);
    } catch {
      setParticipants(SAMPLE_PARTICIPANTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = searchQuery === '' ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    const matchesProgram = programFilter === 'all' ||
      p.program_enrollments?.some(pe => pe.program.toLowerCase().includes(programFilter.toLowerCase()));

    const matchesBarrier = barrierFilter === 'all' ||
      p.barriers?.includes(barrierFilter as BarrierToEmployment);

    return matchesSearch && matchesStatus && matchesProgram && matchesBarrier;
  });

  // Summary metrics
  const totalActive = participants.filter(p => ['ACTIVE', 'TRAINING', 'ENROLLED'].includes(p.status as string)).length;
  const totalFollowUp = participants.filter(p => (p.status as string).startsWith('FOLLOW_UP')).length;
  const withBarriers = participants.filter(p => (p.barriers?.length || 0) >= 2).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-800 rounded mb-2" />
                <div className="h-3 w-60 bg-gray-800 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-800 rounded" />
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Total Participants</span>
          </div>
          <p className="text-2xl font-bold text-white">{participants.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalActive}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-400">Follow-Up</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalFollowUp}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Multiple Barriers</span>
          </div>
          <p className="text-2xl font-bold text-white">{withBarriers}</p>
        </motion.div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="TRAINING">In Training</option>
              <option value="EMPLOYED">Employed</option>
              <option value="EXITED">Exited</option>
              <option value="FOLLOW_UP_Q2">Follow-Up Q2</option>
              <option value="FOLLOW_UP_Q4">Follow-Up Q4</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-800">
                <select
                  value={programFilter}
                  onChange={e => setProgramFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Programs</option>
                  <option value="Title I - Adult">Title I - Adult</option>
                  <option value="Title I - Dislocated Worker">Title I - DW</option>
                  <option value="Title I - Youth">Title I - Youth</option>
                  <option value="TANF">TANF</option>
                  <option value="SNAP">SNAP E&T</option>
                  <option value="Veteran">Veteran Services</option>
                </select>
                <select
                  value={barrierFilter}
                  onChange={e => setBarrierFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Barriers</option>
                  {Object.entries(barrierLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={() => { setStatusFilter('all'); setProgramFilter('all'); setBarrierFilter('all'); setSearchQuery(''); }}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {filteredParticipants.length} of {participants.length} participants
        </p>
      </div>

      {/* Participant List */}
      <div className="space-y-3">
        {filteredParticipants.map((participant, idx) => {
          const cfg = statusConfig[participant.status as string] || statusConfig.ACTIVE;
          const StatusIcon = cfg.icon;

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedParticipant(participant)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {participant.first_name[0]}{participant.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{participant.first_name} {participant.last_name}</p>
                      {participant.veteran_status && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Veteran</span>
                      )}
                      {participant.disability_status && (
                        <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">Disability</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {participant.address_city}, {participant.address_state} {participant.address_zip} &bull; {participant.county} County
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Barriers */}
                  {(participant.barriers?.length || 0) > 0 && (
                    <div className="hidden md:flex items-center gap-1">
                      {participant.barriers!.slice(0, 2).map((barrier, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded">
                          {barrierLabels[barrier] || barrier}
                        </span>
                      ))}
                      {participant.barriers!.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded">
                          +{participant.barriers!.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Program Enrollments */}
              {participant.program_enrollments && participant.program_enrollments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
                  {participant.program_enrollments.map((pe, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                      {pe.program} ({pe.status})
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No participants match your filters</p>
          <button
            onClick={() => { setStatusFilter('all'); setProgramFilter('all'); setBarrierFilter('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Participant Detail Modal */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedParticipant(null)}
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
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {selectedParticipant.first_name[0]}{selectedParticipant.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedParticipant.first_name} {selectedParticipant.last_name}
                      </h2>
                      <p className="text-sm text-gray-400">ID: {selectedParticipant.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                  {(() => {
                    const cfg = statusConfig[selectedParticipant.status as string] || statusConfig.ACTIVE;
                    return (
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedParticipant.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{selectedParticipant.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{selectedParticipant.address_city}, {selectedParticipant.address_state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">County</p>
                    <p className="text-white">{selectedParticipant.county || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Registration Date</p>
                    <p className="text-white">{new Date(selectedParticipant.registration_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Enrollment Date</p>
                    <p className="text-white">{selectedParticipant.enrollment_date ? new Date(selectedParticipant.enrollment_date).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Employment Status</p>
                    <p className="text-white">{selectedParticipant.employment_status?.replace(/_/g, ' ') || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Veteran</p>
                    <p className="text-white">{selectedParticipant.veteran_status ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Barriers */}
                {selectedParticipant.barriers && selectedParticipant.barriers.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Barriers to Employment</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.barriers.map((barrier, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-lg">
                          {barrierLabels[barrier] || barrier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Program Enrollments */}
                {selectedParticipant.program_enrollments && selectedParticipant.program_enrollments.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Program Enrollments</p>
                    <div className="space-y-2">
                      {selectedParticipant.program_enrollments.map((pe, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{pe.program}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              pe.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>{pe.status}</span>
                          </div>
                          {pe.enrollment_date && (
                            <p className="text-xs text-gray-400">
                              Enrolled: {new Date(pe.enrollment_date).toLocaleDateString()}
                              {pe.exit_date && ` — Exited: ${new Date(pe.exit_date).toLocaleDateString()}`}
                            </p>
                          )}
                          {pe.services_received && pe.services_received.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {pe.services_received.map((svc, j) => (
                                <span key={j} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">{svc}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exit Info */}
                {selectedParticipant.exit_date && (
                  <div className="mb-6 bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Exit Information</p>
                    <p className="text-white text-sm">
                      Exit Date: {new Date(selectedParticipant.exit_date).toLocaleDateString()}
                    </p>
                    {selectedParticipant.exit_reason && (
                      <p className="text-gray-300 text-sm mt-1">Reason: {selectedParticipant.exit_reason}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => showNotification('Opening full record view...')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    View Full Record
                  </button>
                  <button
                    onClick={() => showNotification('Case note form opening...')}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Add Case Note
                  </button>
                  <button
                    onClick={() => showNotification('Recording service...')}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Record Service
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
