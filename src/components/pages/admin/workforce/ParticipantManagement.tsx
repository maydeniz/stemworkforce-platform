import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Edit,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Target,
  Briefcase,
  GraduationCap,
  Shield,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';
import type {
  WorkforceParticipant,
  ParticipantStatus,
  BarrierToEmployment,
  WIOAProgram,
} from '../../../../types/stateWorkforce';

// Sample participant data for development
const SAMPLE_PARTICIPANTS: WorkforceParticipant[] = [
  {
    id: '1',
    ssn_last_four: '4521',
    first_name: 'Maria',
    last_name: 'Rodriguez',
    date_of_birth: '1985-03-15',
    email: 'maria.rodriguez@email.com',
    phone: '(555) 234-5678',
    address: {
      street: '456 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      county: 'Sangamon',
    },
    status: 'active',
    registration_date: '2024-01-15',
    assigned_case_manager_id: 'cm-001',
    lwdb_id: 'lwdb-001',
    ajc_id: 'ajc-001',
    barriers_to_employment: ['long_term_unemployed', 'lacks_transportation'],
    priority_population: ['veteran_spouse'],
    highest_education_level: 'some_college',
    employment_status_at_registration: 'unemployed',
    program_enrollments: [
      {
        program: 'adult',
        enrollment_date: '2024-01-20',
        status: 'active',
        services_received: ['career_counseling', 'job_search_assistance'],
      },
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-01T14:30:00Z',
  },
  {
    id: '2',
    ssn_last_four: '7832',
    first_name: 'James',
    last_name: 'Thompson',
    date_of_birth: '1978-08-22',
    email: 'james.thompson@email.com',
    phone: '(555) 345-6789',
    address: {
      street: '789 Maple Ave',
      city: 'Decatur',
      state: 'IL',
      zip: '62521',
      county: 'Macon',
    },
    status: 'active',
    registration_date: '2023-11-10',
    assigned_case_manager_id: 'cm-002',
    lwdb_id: 'lwdb-001',
    ajc_id: 'ajc-002',
    barriers_to_employment: ['ex_offender', 'basic_skills_deficient'],
    priority_population: [],
    highest_education_level: 'high_school',
    employment_status_at_registration: 'unemployed',
    program_enrollments: [
      {
        program: 'adult',
        enrollment_date: '2023-11-15',
        status: 'active',
        services_received: ['occupational_training', 'supportive_services'],
      },
    ],
    created_at: '2023-11-10T09:00:00Z',
    updated_at: '2024-01-20T11:15:00Z',
  },
  {
    id: '3',
    ssn_last_four: '9156',
    first_name: 'Sarah',
    last_name: 'Chen',
    date_of_birth: '1992-12-03',
    email: 'sarah.chen@email.com',
    phone: '(555) 456-7890',
    address: {
      street: '123 Pine Road',
      city: 'Champaign',
      state: 'IL',
      zip: '61820',
      county: 'Champaign',
    },
    status: 'enrolled',
    registration_date: '2024-02-01',
    assigned_case_manager_id: 'cm-001',
    lwdb_id: 'lwdb-002',
    ajc_id: 'ajc-003',
    barriers_to_employment: ['single_parent', 'lacks_childcare'],
    priority_population: ['public_assistance_recipient'],
    highest_education_level: 'bachelors',
    employment_status_at_registration: 'employed_part_time',
    program_enrollments: [
      {
        program: 'dislocated_worker',
        enrollment_date: '2024-02-05',
        status: 'pending',
        services_received: [],
      },
    ],
    created_at: '2024-02-01T13:00:00Z',
    updated_at: '2024-02-05T16:45:00Z',
  },
  {
    id: '4',
    ssn_last_four: '3287',
    first_name: 'Michael',
    last_name: 'Johnson',
    date_of_birth: '2002-06-18',
    email: 'michael.johnson@email.com',
    phone: '(555) 567-8901',
    address: {
      street: '567 Elm Street',
      city: 'Peoria',
      state: 'IL',
      zip: '61602',
      county: 'Peoria',
    },
    status: 'active',
    registration_date: '2024-01-08',
    assigned_case_manager_id: 'cm-003',
    lwdb_id: 'lwdb-003',
    ajc_id: 'ajc-004',
    barriers_to_employment: ['youth_out_of_school', 'foster_care'],
    priority_population: [],
    highest_education_level: 'some_high_school',
    employment_status_at_registration: 'not_in_labor_force',
    program_enrollments: [
      {
        program: 'youth',
        enrollment_date: '2024-01-12',
        status: 'active',
        services_received: ['tutoring', 'work_experience', 'mentoring'],
      },
    ],
    created_at: '2024-01-08T10:30:00Z',
    updated_at: '2024-02-10T09:00:00Z',
  },
  {
    id: '5',
    ssn_last_four: '6541',
    first_name: 'Robert',
    last_name: 'Williams',
    date_of_birth: '1965-04-25',
    email: 'robert.williams@email.com',
    phone: '(555) 678-9012',
    address: {
      street: '890 Cedar Lane',
      city: 'Rockford',
      state: 'IL',
      zip: '61101',
      county: 'Winnebago',
    },
    status: 'exited',
    registration_date: '2023-06-15',
    exit_date: '2024-01-15',
    assigned_case_manager_id: 'cm-002',
    lwdb_id: 'lwdb-004',
    ajc_id: 'ajc-005',
    barriers_to_employment: ['displaced_homemaker', 'older_worker'],
    priority_population: ['veteran'],
    highest_education_level: 'associates',
    employment_status_at_registration: 'unemployed',
    program_enrollments: [
      {
        program: 'dislocated_worker',
        enrollment_date: '2023-06-20',
        status: 'completed',
        exit_date: '2024-01-15',
        services_received: ['career_counseling', 'job_search_assistance', 'on_the_job_training'],
      },
    ],
    created_at: '2023-06-15T08:00:00Z',
    updated_at: '2024-01-15T17:00:00Z',
  },
  {
    id: '6',
    ssn_last_four: '8923',
    first_name: 'Emily',
    last_name: 'Davis',
    date_of_birth: '1990-09-12',
    email: 'emily.davis@email.com',
    phone: '(555) 789-0123',
    address: {
      street: '234 Birch Court',
      city: 'Bloomington',
      state: 'IL',
      zip: '61701',
      county: 'McLean',
    },
    status: 'follow_up',
    registration_date: '2023-08-20',
    exit_date: '2023-12-20',
    assigned_case_manager_id: 'cm-001',
    lwdb_id: 'lwdb-002',
    ajc_id: 'ajc-003',
    barriers_to_employment: ['homeless'],
    priority_population: ['low_income'],
    highest_education_level: 'high_school',
    employment_status_at_registration: 'unemployed',
    program_enrollments: [
      {
        program: 'adult',
        enrollment_date: '2023-08-25',
        status: 'completed',
        exit_date: '2023-12-20',
        services_received: ['occupational_training', 'supportive_services', 'career_counseling'],
      },
    ],
    created_at: '2023-08-20T11:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
];

const STATUS_CONFIG: Partial<Record<ParticipantStatus, { label: string; color: string; icon: React.ElementType }>> = {
  registered: { label: 'Registered', color: 'bg-slate-500', icon: UserPlus },
  enrolled: { label: 'Enrolled', color: 'bg-blue-500', icon: FileText },
  active: { label: 'Active', color: 'bg-emerald-500', icon: CheckCircle },
  exited: { label: 'Exited', color: 'bg-amber-500', icon: Clock },
  follow_up: { label: 'Follow-Up', color: 'bg-purple-500', icon: RefreshCw },
};

const BARRIER_LABELS: Partial<Record<BarrierToEmployment, string>> = {
  displaced_homemaker: 'Displaced Homemaker',
  low_income: 'Low Income',
  public_assistance_recipient: 'Public Assistance',
  basic_skills_deficient: 'Basic Skills Deficient',
  english_language_learner: 'English Language Learner',
  homeless: 'Homeless/Housing Insecure',
  ex_offender: 'Justice-Involved',
  youth_in_foster_care: 'Youth in Foster Care',
  youth_out_of_school: 'Out-of-School Youth',
  youth_aging_out_foster_care: 'Aging Out of Foster Care',
  single_parent: 'Single Parent',
  long_term_unemployed: 'Long-Term Unemployed',
  exhausting_tanf: 'Exhausting TANF',
  disability: 'Individual with Disability',
  lacks_transportation: 'Lacks Transportation',
  lacks_childcare: 'Lacks Childcare',
  substance_abuse: 'Substance Use Disorder',
  domestic_violence: 'Domestic Violence Survivor',
  cultural_barriers: 'Cultural Barriers',
  older_worker: 'Older Worker (55+)',
  limited_work_history: 'Limited Work History',
  veteran: 'Veteran',
  migrant_seasonal_farmworker: 'Migrant/Seasonal Farmworker',
  requires_additional_assistance: 'Requires Additional Assistance',
  foster_care: 'Former Foster Youth',
};

const PROGRAM_LABELS: Partial<Record<WIOAProgram, string>> = {
  adult: 'WIOA Adult',
  dislocated_worker: 'Dislocated Worker',
  youth: 'WIOA Youth',
  wagner_peyser: 'Wagner-Peyser',
  adult_education: 'Adult Education (Title II)',
  vocational_rehab: 'Vocational Rehabilitation',
  veterans: 'Veterans Services',
  trade_adjustment: 'Trade Adjustment Assistance',
  snap_et: 'SNAP E&T',
  tanf: 'TANF Work Program',
  reentry: 'Reentry Services',
};

const EDUCATION_LABELS: Record<string, string> = {
  less_than_high_school: 'Less than High School',
  some_high_school: 'Some High School',
  high_school: 'High School Diploma/GED',
  some_college: 'Some College',
  associates: "Associate's Degree",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  doctorate: 'Doctorate',
  certificate: 'Certificate/Credential',
};

export const ParticipantManagement: React.FC = () => {
  const [participants] = useState<WorkforceParticipant[]>(SAMPLE_PARTICIPANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | 'all'>('all');
  const [programFilter, setProgramFilter] = useState<WIOAProgram | 'all'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<WorkforceParticipant | null>(null);
  const [showNewParticipantModal, setShowNewParticipantModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [barrierFilter, setBarrierFilter] = useState<BarrierToEmployment | 'all'>('all');

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ssn_last_four?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    const matchesProgram =
      programFilter === 'all' ||
      p.program_enrollments?.some((e) => e.program === programFilter);

    const matchesBarrier =
      barrierFilter === 'all' ||
      p.barriers_to_employment?.includes(barrierFilter);

    return matchesSearch && matchesStatus && matchesProgram && matchesBarrier;
  });

  // Statistics
  const stats = {
    total: participants.length,
    active: participants.filter((p) => p.status === 'active').length,
    enrolled: participants.filter((p) => p.status === 'enrolled').length,
    followUp: participants.filter((p) => p.status === 'follow_up').length,
    exited: participants.filter((p) => p.status === 'exited').length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Participant Management</h2>
          <p className="text-slate-400 mt-1">
            Manage WIOA participants, enrollments, and eligibility
          </p>
        </div>
        <button
          onClick={() => setShowNewParticipantModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Participant
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Participants</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Enrolled</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.enrolled}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Follow-Up</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.followUp}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Exited</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.exited}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or SSN last 4..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ParticipantStatus | 'all')}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value as WIOAProgram | 'all')}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Programs</option>
            {Object.entries(PROGRAM_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Filter className="w-4 h-4" />
            More Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Barrier to Employment</label>
              <select
                value={barrierFilter}
                onChange={(e) => setBarrierFilter(e.target.value as BarrierToEmployment | 'all')}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Barriers</option>
                {Object.entries(BARRIER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Participants Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Participant
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Program(s)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Barriers
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Registered
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredParticipants.map((participant) => {
                const statusConfig = STATUS_CONFIG[participant.status];
                const StatusIcon = statusConfig?.icon || CheckCircle;
                return (
                  <tr
                    key={participant.id}
                    className="hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                          {participant.first_name[0]}
                          {participant.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {participant.first_name} {participant.last_name}
                          </p>
                          <p className="text-sm text-slate-400">
                            SSN: ***-**-{participant.ssn_last_four}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${statusConfig?.color || 'bg-slate-500'}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig?.label || participant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {participant.program_enrollments?.slice(0, 2).map((enrollment, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300"
                          >
                            {PROGRAM_LABELS[enrollment.program as WIOAProgram] || enrollment.program}
                          </span>
                        ))}
                        {(participant.program_enrollments?.length ?? 0) > 2 && (
                          <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                            +{(participant.program_enrollments?.length ?? 0) - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {participant.barriers_to_employment &&
                        participant.barriers_to_employment.length > 0 ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-slate-300">
                              {participant.barriers_to_employment.length} barrier
                              {participant.barriers_to_employment.length !== 1 ? 's' : ''}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">None identified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300">
                        {formatDate(participant.registration_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedParticipant(participant);
                          }}
                          className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredParticipants.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No participants found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {filteredParticipants.length} of {participants.length} participants
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors">
              Previous
            </button>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">1</span>
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedParticipant(null)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium text-lg">
                  {selectedParticipant.first_name[0]}
                  {selectedParticipant.last_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedParticipant.first_name} {selectedParticipant.last_name}
                  </h3>
                  <p className="text-slate-400">
                    ID: {selectedParticipant.id} | SSN: ***-**-{selectedParticipant.ssn_last_four}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Quick Info */}
              <div className="flex items-center gap-4 flex-wrap">
                {(() => {
                  const detailStatusConfig = STATUS_CONFIG[selectedParticipant.status];
                  const DetailIcon = detailStatusConfig?.icon || CheckCircle;
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white ${detailStatusConfig?.color || 'bg-slate-500'}`}
                    >
                      <DetailIcon className="w-4 h-4" />
                      {detailStatusConfig?.label || selectedParticipant.status}
                    </span>
                  );
                })()}
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">
                  Age: {calculateAge(selectedParticipant.date_of_birth)}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">
                  {EDUCATION_LABELS[selectedParticipant.highest_education_level || selectedParticipant.highest_education || ''] ||
                    selectedParticipant.highest_education_level || selectedParticipant.highest_education || 'N/A'}
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">{selectedParticipant.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">{selectedParticipant.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                      <span className="text-slate-300">
                        {selectedParticipant.address ? (
                          typeof selectedParticipant.address === 'string' ? (
                            selectedParticipant.address
                          ) : (
                            <>
                              {selectedParticipant.address.street}
                              <br />
                              {selectedParticipant.address.city}, {selectedParticipant.address.state}{' '}
                              {selectedParticipant.address.zip}
                            </>
                          )
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Key Dates
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date of Birth:</span>
                      <span className="text-slate-300">
                        {formatDate(selectedParticipant.date_of_birth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registration Date:</span>
                      <span className="text-slate-300">
                        {formatDate(selectedParticipant.registration_date)}
                      </span>
                    </div>
                    {selectedParticipant.exit_date && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Exit Date:</span>
                        <span className="text-slate-300">
                          {formatDate(selectedParticipant.exit_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Barriers to Employment */}
              {selectedParticipant.barriers_to_employment &&
                selectedParticipant.barriers_to_employment.length > 0 && (
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Barriers to Employment
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.barriers_to_employment.map((barrier) => (
                        <span
                          key={barrier}
                          className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-sm"
                        >
                          {BARRIER_LABELS[barrier as BarrierToEmployment] || barrier.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Priority Populations */}
              {selectedParticipant.priority_population &&
                selectedParticipant.priority_population.length > 0 && (
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Priority Populations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.priority_population.map((pop) => (
                        <span
                          key={pop}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm capitalize"
                        >
                          {pop.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Program Enrollments */}
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Program Enrollments
                </h4>
                <div className="space-y-3">
                  {selectedParticipant.program_enrollments?.map((enrollment, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 rounded-lg p-3 border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {PROGRAM_LABELS[enrollment.program as WIOAProgram] || enrollment.program}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            enrollment.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : enrollment.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p>Enrolled: {formatDate(enrollment.enrollment_date)}</p>
                        {enrollment.exit_date && <p>Exited: {formatDate(enrollment.exit_date)}</p>}
                        {enrollment.services_received && enrollment.services_received.length > 0 && (
                          <div className="mt-2">
                            <p className="text-slate-500 mb-1">Services Received:</p>
                            <div className="flex flex-wrap gap-1">
                              {enrollment.services_received.map((service, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 capitalize"
                                >
                                  {service.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Target className="w-4 h-4" />
                  View IEP
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Briefcase className="w-4 h-4" />
                  Add Service
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  Case Notes
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Participant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Participant Modal */}
      {showNewParticipantModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewParticipantModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">New Participant Registration</h3>
              <button
                onClick={() => setShowNewParticipantModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-medium text-white mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">SSN Last 4 *</label>
                    <input
                      type="text"
                      maxLength={4}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="1234"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-medium text-white mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium text-white mb-3">Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="City"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">State</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="IL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">ZIP</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="62701"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment & Education */}
              <div>
                <h4 className="font-medium text-white mb-3">Employment & Education</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Employment Status at Registration
                    </label>
                    <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select status</option>
                      <option value="employed_full_time">Employed Full-Time</option>
                      <option value="employed_part_time">Employed Part-Time</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="not_in_labor_force">Not in Labor Force</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Highest Education Level
                    </label>
                    <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select education</option>
                      {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowNewParticipantModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Register Participant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManagement;
