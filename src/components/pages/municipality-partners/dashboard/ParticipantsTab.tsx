// ===========================================
// Participants Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Filter,
  Loader2,
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Download,
  ChevronRight,
  Shield,
  Award
} from 'lucide-react';
import { getParticipants } from '@/services/municipalityPartnerApi';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { MunicipalityParticipant, MunicipalityPartnerTier, ParticipantStatus, DepartmentType } from '@/types/municipalityPartner';

interface ParticipantsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
}

const sampleParticipants: MunicipalityParticipant[] = [
  {
    id: 'par-001', municipalityId: 'muni-001', programId: 'int-001', programType: 'internship',
    firstName: 'Marcus', lastName: 'Johnson', email: 'mjohnson@email.com', phone: '512-555-0101',
    dateOfBirth: '2005-03-15', city: 'Austin', zipCode: '78701', isResident: true,
    educationLevel: 'high_school', currentSchool: 'Austin High School', gpa: 3.4,
    meetsIncomeRequirement: true, isVeteran: false, department: 'public_works',
    supervisor: 'Robert Chen', startDate: '2025-06-02', expectedEndDate: '2025-08-08',
    status: 'active', hoursCompleted: 120, midpointEvaluation: 4.2,
    createdAt: '2025-01-15', updatedAt: new Date().toISOString()
  },
  {
    id: 'par-002', municipalityId: 'muni-001', programId: 'app-001', programType: 'apprenticeship',
    firstName: 'Sarah', lastName: 'Williams', email: 'swilliams@email.com', phone: '512-555-0102',
    dateOfBirth: '1998-07-22', city: 'Austin', zipCode: '78702', isResident: true,
    educationLevel: 'some_college', isVeteran: true, department: 'utilities',
    supervisor: 'Maria Santos', startDate: '2024-06-01', expectedEndDate: '2027-06-01',
    status: 'active', hoursCompleted: 2400, currentWage: 22.50, ojtHoursCompleted: 2400,
    rtiHoursCompleted: 180, competenciesCompleted: 8, totalCompetencies: 15,
    createdAt: '2024-06-01', updatedAt: new Date().toISOString()
  },
  {
    id: 'par-003', municipalityId: 'muni-001', programId: 'int-002', programType: 'internship',
    firstName: 'Jennifer', lastName: 'Chen', email: 'jchen@email.com', phone: '512-555-0103',
    dateOfBirth: '2002-11-08', city: 'Austin', zipCode: '78703', isResident: true,
    educationLevel: 'bachelors', currentSchool: 'UT Austin', major: 'Public Administration',
    expectedGraduation: '2025-05-15', gpa: 3.8, isVeteran: false, department: 'finance',
    supervisor: 'David Kim', startDate: '2025-01-15', expectedEndDate: '2025-12-15',
    status: 'active', hoursCompleted: 280, midpointEvaluation: 4.8,
    placedInCity: true, civilServiceStatus: 'exam_scheduled',
    createdAt: '2025-01-15', updatedAt: new Date().toISOString()
  },
  {
    id: 'par-004', municipalityId: 'muni-001', programId: 'int-001', programType: 'internship',
    firstName: 'Michael', lastName: 'Davis', email: 'mdavis@email.com', phone: '512-555-0104',
    dateOfBirth: '2006-05-30', city: 'Austin', zipCode: '78704', isResident: true,
    educationLevel: 'high_school', currentSchool: 'Travis High School',
    meetsIncomeRequirement: true, isVeteran: false, department: 'parks_recreation',
    startDate: '2024-06-03', expectedEndDate: '2024-08-09', actualEndDate: '2024-08-09',
    status: 'completed', hoursCompleted: 250, finalEvaluation: 4.5,
    supervisorRecommendation: 'highly_recommend',
    createdAt: '2024-06-01', updatedAt: new Date().toISOString()
  }
];

const statusConfig: Record<ParticipantStatus, { label: string; color: string; icon: React.ElementType }> = {
  applied: { label: 'Applied', color: 'slate', icon: Clock },
  screened: { label: 'Screened', color: 'blue', icon: Users },
  enrolled: { label: 'Enrolled', color: 'indigo', icon: CheckCircle },
  active: { label: 'Active', color: 'emerald', icon: CheckCircle },
  on_leave: { label: 'On Leave', color: 'amber', icon: AlertCircle },
  completed: { label: 'Completed', color: 'purple', icon: Award },
  placed: { label: 'Placed', color: 'teal', icon: Briefcase },
  exited: { label: 'Exited', color: 'gray', icon: Clock },
  withdrawn: { label: 'Withdrawn', color: 'red', icon: X }
};

const departmentLabels: Record<DepartmentType, string> = {
  human_resources: 'Human Resources', public_works: 'Public Works', public_safety: 'Public Safety',
  fire_department: 'Fire Department', police_department: 'Police Department',
  parks_recreation: 'Parks & Recreation', planning_development: 'Planning & Development',
  finance: 'Finance', it_technology: 'IT/Technology', utilities: 'Utilities',
  transportation: 'Transportation', health_services: 'Health Services', library: 'Library',
  mayors_office: "Mayor's Office", city_council: 'City Council', legal: 'Legal',
  communications: 'Communications', economic_development: 'Economic Development',
  community_services: 'Community Services', environmental_services: 'Environmental Services',
  housing: 'Housing', other: 'Other'
};

// Static Tailwind color map
const twColor: Record<string, { bg: string; text: string }> = {
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ partnerId, tier: _tier }) => {
  const [participants, setParticipants] = useState<MunicipalityParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [programTypeFilter, setProgramTypeFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [selectedParticipant, setSelectedParticipant] = useState<MunicipalityParticipant | null>(null);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  useEscapeKey(() => setSelectedParticipant(null), !!selectedParticipant);

  const handleExport = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Status', 'Program Type', 'Department', 'Veteran', 'Start Date'];
    const rows = filteredParticipants.map(p => [
      p.firstName, p.lastName, p.email, p.status, p.programType, p.department,
      p.isVeteran ? 'Yes' : 'No', p.startDate
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'municipality-participants-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Participant data exported successfully');
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const data = await getParticipants(partnerId, {
          status: statusFilter as ParticipantStatus || undefined,
          programType: programTypeFilter as 'internship' | 'apprenticeship' || undefined,
          department: departmentFilter as DepartmentType || undefined
        });
        setParticipants(data.length > 0 ? data : sampleParticipants);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setParticipants(sampleParticipants);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [partnerId, statusFilter, programTypeFilter, departmentFilter]);

  const filteredParticipants = participants.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: participants.length,
    active: participants.filter(p => p.status === 'active').length,
    completed: participants.filter(p => p.status === 'completed' || p.status === 'placed').length,
    veterans: participants.filter(p => p.isVeteran).length
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-lg shadow-lg">
          <CheckCircle className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Program Participants</h2>
          <p className="text-gray-400 text-sm">Track interns, apprentices, and program outcomes</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Participants', value: stats.total, icon: Users, color: 'teal' },
          { label: 'Currently Active', value: stats.active, icon: CheckCircle, color: 'emerald' },
          { label: 'Completed/Placed', value: stats.completed, icon: Award, color: 'purple' },
          { label: 'Veterans', value: stats.veterans, icon: Shield, color: 'amber' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${twColor[stat.color]?.bg || 'bg-slate-500/20'} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${twColor[stat.color]?.text || 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' : 'bg-slate-900 border-slate-800 text-gray-400'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option value="">All</option>
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Program Type</label>
                <select value={programTypeFilter} onChange={(e) => setProgramTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option value="">All</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Department</label>
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option value="">All</option>
                  {Object.entries(departmentLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setStatusFilter(''); setProgramTypeFilter(''); setDepartmentFilter(''); }}
                  className="px-4 py-2 text-gray-400 hover:text-white">Clear</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr className="text-left text-sm text-gray-400">
                  <th className="px-4 py-3 font-medium">Participant</th>
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => {
                  const statusConf = statusConfig[participant.status];
                  return (
                    <tr key={participant.id}
                      onClick={() => setSelectedParticipant(participant)}
                      className="border-t border-slate-800 hover:bg-slate-800/50 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-medium">
                            {participant.firstName[0]}{participant.lastName[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{participant.firstName} {participant.lastName}</p>
                            <p className="text-sm text-gray-400">{participant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          participant.programType === 'internship' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {participant.programType === 'internship' ? 'Intern' : 'Apprentice'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {departmentLabels[participant.department] || participant.department}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${twColor[statusConf.color]?.bg || 'bg-slate-500/20'} ${twColor[statusConf.color]?.text || 'text-slate-400'}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">{participant.hoursCompleted}h</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, (participant.hoursCompleted / 400) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Participant Detail Modal */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedParticipant(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-xl font-medium">
                      {selectedParticipant.firstName[0]}{selectedParticipant.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedParticipant.firstName} {selectedParticipant.lastName}</h2>
                      <p className="text-gray-400">{selectedParticipant.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedParticipant(null)} className="p-2 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Department</span><p className="text-white">{departmentLabels[selectedParticipant.department]}</p></div>
                  <div><span className="text-gray-400">Program Type</span><p className="text-white capitalize">{selectedParticipant.programType}</p></div>
                  <div><span className="text-gray-400">Status</span><p className={`${twColor[statusConfig[selectedParticipant.status].color]?.text || 'text-slate-400'}`}>{statusConfig[selectedParticipant.status].label}</p></div>
                  <div><span className="text-gray-400">Hours Completed</span><p className="text-white">{selectedParticipant.hoursCompleted}</p></div>
                  <div><span className="text-gray-400">Start Date</span><p className="text-white">{new Date(selectedParticipant.startDate).toLocaleDateString()}</p></div>
                  <div><span className="text-gray-400">End Date</span><p className="text-white">{new Date(selectedParticipant.expectedEndDate).toLocaleDateString()}</p></div>
                  {selectedParticipant.supervisor && <div><span className="text-gray-400">Supervisor</span><p className="text-white">{selectedParticipant.supervisor}</p></div>}
                  {selectedParticipant.isVeteran && <div><span className="text-gray-400">Veteran Status</span><p className="text-amber-400">Veteran</p></div>}
                </div>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                <button onClick={() => setSelectedParticipant(null)} className="px-4 py-2 text-gray-400">Close</button>
                <button onClick={() => showNotification('Opening edit form...')} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Edit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
