import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Target,
  Briefcase,
  DollarSign,
  ChevronRight,
  Edit,
  Phone,
  Mail,
  X,
  Save,
  ArrowUpRight,
  BarChart3,
  ClipboardList,
} from 'lucide-react';

// Types for case management
interface CaseNote {
  id: string;
  date: string;
  author: string;
  type: 'general' | 'service' | 'follow_up' | 'referral' | 'assessment';
  content: string;
  is_confidential: boolean;
}

interface ServiceRecord {
  id: string;
  service_type: string;
  service_date: string;
  provider: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  notes?: string;
}

interface IEPGoal {
  id: string;
  goal: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  progress_percent: number;
  milestones: { description: string; completed: boolean }[];
}

interface Case {
  id: string;
  participant_id: string;
  participant_name: string;
  case_manager: string;
  status: 'active' | 'pending' | 'closed' | 'follow_up';
  priority: 'high' | 'medium' | 'low';
  opened_date: string;
  last_contact_date: string;
  next_appointment?: string;
  program: string;
  services_active: number;
  notes_count: number;
  iep_goals: IEPGoal[];
  recent_notes: CaseNote[];
  service_history: ServiceRecord[];
}

// Sample case data
const SAMPLE_CASES: Case[] = [
  {
    id: 'case-001',
    participant_id: '1',
    participant_name: 'Maria Rodriguez',
    case_manager: 'Jennifer Adams',
    status: 'active',
    priority: 'high',
    opened_date: '2024-01-15',
    last_contact_date: '2024-02-08',
    next_appointment: '2024-02-15T10:00:00',
    program: 'WIOA Adult',
    services_active: 3,
    notes_count: 12,
    iep_goals: [
      {
        id: 'g1',
        goal: 'Complete Medical Assistant certification',
        target_date: '2024-06-30',
        status: 'in_progress',
        progress_percent: 45,
        milestones: [
          { description: 'Enroll in training program', completed: true },
          { description: 'Complete classroom portion', completed: true },
          { description: 'Complete clinical hours', completed: false },
          { description: 'Pass certification exam', completed: false },
        ],
      },
      {
        id: 'g2',
        goal: 'Obtain employment in healthcare field',
        target_date: '2024-08-31',
        status: 'not_started',
        progress_percent: 0,
        milestones: [
          { description: 'Update resume with new credentials', completed: false },
          { description: 'Apply to 10 healthcare positions', completed: false },
          { description: 'Complete 3 interviews', completed: false },
        ],
      },
    ],
    recent_notes: [
      {
        id: 'n1',
        date: '2024-02-08',
        author: 'Jennifer Adams',
        type: 'follow_up',
        content: 'Participant is progressing well in MA program. Discussed upcoming clinical rotation placement. Transportation to clinical site is a concern - referred to supportive services.',
        is_confidential: false,
      },
      {
        id: 'n2',
        date: '2024-02-01',
        author: 'Jennifer Adams',
        type: 'service',
        content: 'ITA approved for Medical Assistant training at Community College. Training start date: Feb 5.',
        is_confidential: false,
      },
    ],
    service_history: [
      {
        id: 's1',
        service_type: 'Occupational Skills Training',
        service_date: '2024-02-05',
        provider: 'Springfield Community College',
        status: 'in_progress',
        cost: 4500,
      },
      {
        id: 's2',
        service_type: 'Career Counseling',
        service_date: '2024-01-20',
        provider: 'AJC Springfield',
        status: 'completed',
      },
      {
        id: 's3',
        service_type: 'Transportation Assistance',
        service_date: '2024-02-08',
        provider: 'Supportive Services',
        status: 'scheduled',
        cost: 200,
      },
    ],
  },
  {
    id: 'case-002',
    participant_id: '2',
    participant_name: 'James Thompson',
    case_manager: 'Michael Chen',
    status: 'active',
    priority: 'medium',
    opened_date: '2023-11-10',
    last_contact_date: '2024-02-05',
    next_appointment: '2024-02-12T14:00:00',
    program: 'WIOA Adult',
    services_active: 2,
    notes_count: 18,
    iep_goals: [
      {
        id: 'g3',
        goal: 'Obtain CDL Class A license',
        target_date: '2024-04-15',
        status: 'in_progress',
        progress_percent: 70,
        milestones: [
          { description: 'Pass written permit test', completed: true },
          { description: 'Complete 160 hours driving school', completed: true },
          { description: 'Pass pre-trip inspection test', completed: true },
          { description: 'Pass road skills test', completed: false },
        ],
      },
    ],
    recent_notes: [
      {
        id: 'n3',
        date: '2024-02-05',
        author: 'Michael Chen',
        type: 'general',
        content: 'Participant completed driving school. Scheduled for road test next week. Confident about passing.',
        is_confidential: false,
      },
    ],
    service_history: [
      {
        id: 's4',
        service_type: 'CDL Training',
        service_date: '2023-12-01',
        provider: 'ABC Truck Driving School',
        status: 'completed',
        cost: 6000,
      },
      {
        id: 's5',
        service_type: 'Job Search Assistance',
        service_date: '2024-02-05',
        provider: 'AJC Decatur',
        status: 'in_progress',
      },
    ],
  },
  {
    id: 'case-003',
    participant_id: '3',
    participant_name: 'Sarah Chen',
    case_manager: 'Jennifer Adams',
    status: 'pending',
    priority: 'high',
    opened_date: '2024-02-01',
    last_contact_date: '2024-02-05',
    program: 'Dislocated Worker',
    services_active: 0,
    notes_count: 3,
    iep_goals: [],
    recent_notes: [
      {
        id: 'n4',
        date: '2024-02-05',
        author: 'Jennifer Adams',
        type: 'assessment',
        content: 'Initial assessment completed. Participant recently laid off from accounting position. Has Bachelor\'s degree. Interested in transitioning to data analytics. Eligibility determination pending.',
        is_confidential: false,
      },
    ],
    service_history: [
      {
        id: 's6',
        service_type: 'Career Assessment',
        service_date: '2024-02-05',
        provider: 'AJC Champaign',
        status: 'completed',
      },
    ],
  },
  {
    id: 'case-004',
    participant_id: '4',
    participant_name: 'Michael Johnson',
    case_manager: 'David Wilson',
    status: 'active',
    priority: 'high',
    opened_date: '2024-01-08',
    last_contact_date: '2024-02-09',
    next_appointment: '2024-02-16T09:00:00',
    program: 'WIOA Youth',
    services_active: 4,
    notes_count: 15,
    iep_goals: [
      {
        id: 'g4',
        goal: 'Earn GED',
        target_date: '2024-05-31',
        status: 'in_progress',
        progress_percent: 60,
        milestones: [
          { description: 'Complete math modules', completed: true },
          { description: 'Complete reading modules', completed: true },
          { description: 'Complete science modules', completed: false },
          { description: 'Pass all GED subject tests', completed: false },
        ],
      },
      {
        id: 'g5',
        goal: 'Complete work experience program',
        target_date: '2024-07-31',
        status: 'in_progress',
        progress_percent: 35,
        milestones: [
          { description: 'Complete work readiness training', completed: true },
          { description: 'Secure work experience placement', completed: true },
          { description: 'Complete 200 hours of work experience', completed: false },
        ],
      },
    ],
    recent_notes: [
      {
        id: 'n5',
        date: '2024-02-09',
        author: 'David Wilson',
        type: 'follow_up',
        content: 'Weekly check-in. Michael is doing well at his work experience site. Supervisor reports positive attitude and good attendance. Continuing GED prep - science test scheduled for March.',
        is_confidential: false,
      },
    ],
    service_history: [
      {
        id: 's7',
        service_type: 'Tutoring/GED Prep',
        service_date: '2024-01-15',
        provider: 'Adult Education Center',
        status: 'in_progress',
      },
      {
        id: 's8',
        service_type: 'Work Experience',
        service_date: '2024-02-01',
        provider: 'City Parks Department',
        status: 'in_progress',
      },
      {
        id: 's9',
        service_type: 'Mentoring',
        service_date: '2024-01-20',
        provider: 'Youth Mentorship Program',
        status: 'in_progress',
      },
    ],
  },
  {
    id: 'case-005',
    participant_id: '6',
    participant_name: 'Emily Davis',
    case_manager: 'Jennifer Adams',
    status: 'follow_up',
    priority: 'low',
    opened_date: '2023-08-20',
    last_contact_date: '2024-01-30',
    program: 'WIOA Adult',
    services_active: 0,
    notes_count: 22,
    iep_goals: [
      {
        id: 'g6',
        goal: 'Obtain stable employment',
        target_date: '2023-12-31',
        status: 'completed',
        progress_percent: 100,
        milestones: [
          { description: 'Complete job readiness workshop', completed: true },
          { description: 'Update resume and interview skills', completed: true },
          { description: 'Apply to 15+ positions', completed: true },
          { description: 'Accept job offer', completed: true },
        ],
      },
    ],
    recent_notes: [
      {
        id: 'n6',
        date: '2024-01-30',
        author: 'Jennifer Adams',
        type: 'follow_up',
        content: 'Q2 follow-up call. Emily is still employed at ABC Manufacturing. Has received a raise. Housing situation is stable. Will continue quarterly follow-ups through Q4.',
        is_confidential: false,
      },
    ],
    service_history: [
      {
        id: 's10',
        service_type: 'Occupational Skills Training',
        service_date: '2023-09-01',
        provider: 'Technical Training Institute',
        status: 'completed',
        cost: 3200,
      },
      {
        id: 's11',
        service_type: 'Supportive Services - Housing',
        service_date: '2023-08-25',
        provider: 'Housing Authority',
        status: 'completed',
        cost: 1500,
      },
    ],
  },
];

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  pending: { label: 'Pending', color: 'bg-amber-500', textColor: 'text-amber-400' },
  closed: { label: 'Closed', color: 'bg-slate-500', textColor: 'text-slate-400' },
  follow_up: { label: 'Follow-Up', color: 'bg-purple-500', textColor: 'text-purple-400' },
};

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  low: { label: 'Low', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

const NOTE_TYPE_CONFIG = {
  general: { label: 'General', icon: MessageSquare, color: 'text-slate-400' },
  service: { label: 'Service', icon: Briefcase, color: 'text-blue-400' },
  follow_up: { label: 'Follow-Up', icon: Phone, color: 'text-purple-400' },
  referral: { label: 'Referral', icon: ArrowUpRight, color: 'text-emerald-400' },
  assessment: { label: 'Assessment', icon: ClipboardList, color: 'text-amber-400' },
};

const GOAL_STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-slate-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'bg-emerald-500' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500' },
};

export const CaseManagement: React.FC = () => {
  const [cases] = useState<Case[]>(SAMPLE_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'services' | 'iep'>('overview');

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistics
  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status === 'active').length,
    pending: cases.filter((c) => c.status === 'pending').length,
    highPriority: cases.filter((c) => c.priority === 'high').length,
    appointmentsToday: cases.filter((c) => {
      if (!c.next_appointment) return false;
      const today = new Date().toDateString();
      return new Date(c.next_appointment).toDateString() === today;
    }).length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const daysSince = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Case Management</h2>
          <p className="text-slate-400 mt-1">
            Manage participant cases, IEPs, and service delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            My Calendar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Caseload</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Cases</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Intake</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Today's Appts</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.appointmentsToday}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
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
              placeholder="Search by participant name, case ID, or case manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Priorities</option>
            {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            onClick={() => setSelectedCase(caseItem)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                    {caseItem.participant_name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{caseItem.participant_name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${STATUS_CONFIG[caseItem.status].color}`}
                      >
                        {STATUS_CONFIG[caseItem.status].label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${PRIORITY_CONFIG[caseItem.priority].color}`}
                      >
                        {PRIORITY_CONFIG[caseItem.priority].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      <span>Case #{caseItem.id}</span>
                      <span>•</span>
                      <span>{caseItem.program}</span>
                      <span>•</span>
                      <span>CM: {caseItem.case_manager}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-slate-400">Last Contact</p>
                    <p
                      className={`font-medium ${
                        daysSince(caseItem.last_contact_date) > 14
                          ? 'text-red-400'
                          : daysSince(caseItem.last_contact_date) > 7
                            ? 'text-amber-400'
                            : 'text-slate-300'
                      }`}
                    >
                      {daysSince(caseItem.last_contact_date)} days ago
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Next Appt</p>
                    <p className="text-slate-300 font-medium">
                      {caseItem.next_appointment
                        ? formatDateTime(caseItem.next_appointment)
                        : 'Not scheduled'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Active Services</p>
                    <p className="text-slate-300 font-medium">{caseItem.services_active}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">
                    {caseItem.iep_goals.length} IEP Goal{caseItem.iep_goals.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    {caseItem.notes_count} Note{caseItem.notes_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">
                    {caseItem.service_history.length} Service
                    {caseItem.service_history.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {caseItem.iep_goals.some((g) => g.status === 'in_progress') && (
                  <div className="flex items-center gap-2 ml-auto">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-300">
                      {Math.round(
                        caseItem.iep_goals
                          .filter((g) => g.status === 'in_progress')
                          .reduce((sum, g) => sum + g.progress_percent, 0) /
                          caseItem.iep_goals.filter((g) => g.status === 'in_progress').length
                      )}
                      % avg progress
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No cases found matching your criteria</p>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium text-lg">
                  {selectedCase.participant_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {selectedCase.participant_name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${STATUS_CONFIG[selectedCase.status].color}`}
                    >
                      {STATUS_CONFIG[selectedCase.status].label}
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Case #{selectedCase.id} • {selectedCase.program} • CM: {selectedCase.case_manager}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-700 flex-shrink-0">
              <div className="flex gap-6">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'iep', label: 'IEP Goals' },
                  { key: 'services', label: 'Services' },
                  { key: 'notes', label: 'Case Notes' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`py-3 border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Quick Info */}
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-white mb-3">Case Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Case Opened:</span>
                        <span className="text-slate-300">{formatDate(selectedCase.opened_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Contact:</span>
                        <span className="text-slate-300">{formatDate(selectedCase.last_contact_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Next Appointment:</span>
                        <span className="text-slate-300">
                          {selectedCase.next_appointment
                            ? formatDateTime(selectedCase.next_appointment)
                            : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Priority:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${PRIORITY_CONFIG[selectedCase.priority].color}`}
                        >
                          {PRIORITY_CONFIG[selectedCase.priority].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-white mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {selectedCase.recent_notes.slice(0, 2).map((note) => {
                        const NoteIcon = NOTE_TYPE_CONFIG[note.type].icon;
                        return (
                          <div key={note.id} className="flex items-start gap-3">
                            <NoteIcon className={`w-4 h-4 mt-0.5 ${NOTE_TYPE_CONFIG[note.type].color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-300 line-clamp-2">{note.content}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(note.date)} by {note.author}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Goals Progress */}
                  <div className="col-span-2 bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-white mb-3">IEP Goals Progress</h4>
                    {selectedCase.iep_goals.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCase.iep_goals.map((goal) => (
                          <div key={goal.id} className="bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{goal.goal}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium text-white ${GOAL_STATUS_CONFIG[goal.status].color}`}
                              >
                                {GOAL_STATUS_CONFIG[goal.status].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${goal.progress_percent}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-400">{goal.progress_percent}%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Target: {formatDate(goal.target_date)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No IEP goals defined yet</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'iep' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Individual Employment Plan Goals</h4>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Goal
                    </button>
                  </div>
                  {selectedCase.iep_goals.map((goal) => (
                    <div key={goal.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h5 className="font-medium text-white">{goal.goal}</h5>
                          <p className="text-sm text-slate-400 mt-1">
                            Target Date: {formatDate(goal.target_date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${GOAL_STATUS_CONFIG[goal.status].color}`}
                          >
                            {GOAL_STATUS_CONFIG[goal.status].label}
                          </span>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300">{goal.progress_percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${goal.progress_percent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Milestones</p>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  milestone.completed
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-700 border border-slate-600'
                                }`}
                              >
                                {milestone.completed && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  milestone.completed ? 'text-slate-400 line-through' : 'text-slate-300'
                                }`}
                              >
                                {milestone.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedCase.iep_goals.length === 0 && (
                    <div className="bg-slate-900 rounded-lg p-8 border border-slate-700 text-center">
                      <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No IEP goals defined yet</p>
                      <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
                        Create First Goal
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Service History</h4>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Service
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-800">
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                            Provider
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {selectedCase.service_history.map((service) => (
                          <tr key={service.id} className="hover:bg-slate-800/50">
                            <td className="px-4 py-3">
                              <span className="text-white">{service.service_type}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-300">{service.provider}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-300">{formatDate(service.service_date)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  service.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : service.status === 'in_progress'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : service.status === 'scheduled'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-slate-500/20 text-slate-300'
                                }`}
                              >
                                {service.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-slate-300">
                                {service.cost ? `$${service.cost.toLocaleString()}` : '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Case Notes</h4>
                    <button
                      onClick={() => setShowAddNoteModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedCase.recent_notes.map((note) => {
                      const NoteIcon = NOTE_TYPE_CONFIG[note.type].icon;
                      return (
                        <div
                          key={note.id}
                          className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <NoteIcon className={`w-4 h-4 ${NOTE_TYPE_CONFIG[note.type].color}`} />
                              <span
                                className={`text-sm font-medium ${NOTE_TYPE_CONFIG[note.type].color}`}
                              >
                                {NOTE_TYPE_CONFIG[note.type].label}
                              </span>
                              {note.is_confidential && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs">
                                  Confidential
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {formatDate(note.date)} by {note.author}
                            </span>
                          </div>
                          <p className="text-slate-300">{note.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  Contact
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  View Participant
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowAddNoteModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add Case Note</h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Note Type</label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  {Object.entries(NOTE_TYPE_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Note Content</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Enter case note details..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confidential"
                  className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="confidential" className="text-sm text-slate-300">
                  Mark as confidential
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
