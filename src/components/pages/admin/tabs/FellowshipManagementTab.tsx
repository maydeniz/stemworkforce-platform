// ===========================================
// Fellowship Program Management Tab
// DOE Programs: SULI, SCGSR, CCI, WDTS, VFP
// Manages cohorts, applications, mentors, and analytics
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Eye,
  Search,
  RefreshCw,
  X,
  BarChart3,
  Building2,
  UserCheck,
  Star,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  fellowshipProgramsApi,
  fellowshipCohortsApi,
  fellowshipApplicationsApi,
  fellowshipMentorsApi,
  fellowshipStatsApi,
} from '@/services/fellowshipApi';
import type {
  FellowshipProgram,
  FellowshipCohort,
  FellowshipApplication,
  FellowshipMentor,
  FellowshipDashboardStats,
  FellowshipApplicationStatus,
} from '@/types/fellowship';
import {
  FELLOWSHIP_PROGRAM_CONFIG,
  FELLOWSHIP_STATUS_CONFIG,
  COHORT_STATUS_CONFIG,
} from '@/types/fellowship';

// ===========================================
// Sub-tabs
// ===========================================

const subTabs = [
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'cohorts', label: 'Cohorts', icon: Calendar },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'mentors', label: 'Mentors', icon: UserCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

// ===========================================
// Helpers
// ===========================================

const getStatusColor = (status: FellowshipApplicationStatus): string => {
  const config = FELLOWSHIP_STATUS_CONFIG[status];
  if (!config) return 'bg-slate-500/20 text-slate-400';
  const colorMap: Record<string, string> = {
    gray: 'bg-slate-500/20 text-slate-400',
    blue: 'bg-blue-500/20 text-blue-400',
    indigo: 'bg-indigo-500/20 text-indigo-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/20 text-purple-400',
    violet: 'bg-violet-500/20 text-violet-400',
    amber: 'bg-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    orange: 'bg-orange-500/20 text-orange-400',
    teal: 'bg-teal-500/20 text-teal-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };
  return colorMap[config.color] || 'bg-slate-500/20 text-slate-400';
};

const getCohortStatusColor = (status: string): string => {
  const config = COHORT_STATUS_CONFIG[status as keyof typeof COHORT_STATUS_CONFIG];
  if (!config) return 'bg-slate-500/20 text-slate-400';
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    gray: 'bg-slate-500/20 text-slate-400',
  };
  return colorMap[config.color] || 'bg-slate-500/20 text-slate-400';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (amount?: number): string => {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ===========================================
// Stat Card
// ===========================================

function StatCard({ label, value, icon: Icon, color, subtitle }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg bg-${color}-500/20`}>
          <Icon size={22} className={`text-${color}-400`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ===========================================
// Programs Sub-tab
// ===========================================

function ProgramsView() {
  const [programs, setPrograms] = useState<FellowshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<FellowshipProgram | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await fellowshipProgramsApi.list();
      setPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading programs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fellowship Programs</h3>
          <p className="text-sm text-slate-400 mt-1">DOE Office of Science workforce development programs</p>
        </div>
      </div>

      {programs.length === 0 ? (
        /* Show program cards from config if no DB data */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(FELLOWSHIP_PROGRAM_CONFIG).map(([key, config]) => (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg bg-${config.color}-500/20`}>
                  <GraduationCap size={20} className={`text-${config.color}-400`} />
                </div>
                <span className="text-xs text-slate-500 uppercase">{key}</span>
              </div>
              <h4 className="font-semibold mt-3">{config.label}</h4>
              <p className="text-sm text-slate-400 mt-1">{config.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-500">No active cohorts</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => {
            const config = FELLOWSHIP_PROGRAM_CONFIG[program.programType] || { label: program.programType, color: 'blue', description: '' };
            return (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg bg-${config.color}-500/20`}>
                    <GraduationCap size={20} className={`text-${config.color}-400`} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${program.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {program.status === 'active' ? 'Active' : program.status}
                  </span>
                </div>
                <h4 className="font-semibold mt-3">{program.name}</h4>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{program.description || config.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  {program.termDurationWeeks && (
                    <div>
                      <span className="text-slate-500">Duration:</span>
                      <span className="ml-1">{program.termDurationWeeks} weeks</span>
                    </div>
                  )}
                  {program.stipendAmount && (
                    <div>
                      <span className="text-slate-500">Stipend:</span>
                      <span className="ml-1">{formatCurrency(program.stipendAmount)}</span>
                    </div>
                  )}
                </div>
                {(program.participatingLabs?.length ?? 0) > 0 && (
                  <p className="text-xs text-slate-500 mt-2">
                    {program.participatingLabs!.length} participating lab(s)
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}

// ===========================================
// Program Detail Modal
// ===========================================

function ProgramDetailModal({ program, onClose }: {
  program: FellowshipProgram;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{program.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{program.programType.toUpperCase()} Program</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {program.description && (
            <p className="text-sm text-slate-300">{program.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Duration</p>
              <p className="text-sm mt-0.5">{program.termDurationWeeks ? `${program.termDurationWeeks} weeks` : '—'}</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Stipend</p>
              <p className="text-sm mt-0.5">{formatCurrency(program.stipendAmount)}</p>
            </div>
          </div>

          {program.eligibilityDescription && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Eligibility</h4>
              <p className="text-sm text-slate-300">{program.eligibilityDescription}</p>
            </div>
          )}

          {(program.participatingLabs?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Participating Labs</h4>
              <div className="flex flex-wrap gap-2">
                {program.participatingLabs!.map((lab) => (
                  <span key={lab} className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">
                    {lab}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(program.requiredMajorFields?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Required Major Fields</h4>
              <div className="flex flex-wrap gap-2">
                {program.requiredMajorFields!.map((field) => (
                  <span key={field} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2">
            <p>Created: {formatDate(program.createdAt)}</p>
            <p>Updated: {formatDate(program.updatedAt)}</p>
            {program.applicationDeadline && <p>Deadline: {formatDate(program.applicationDeadline)}</p>}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Cohorts Sub-tab
// ===========================================

function CohortsView() {
  const [cohorts, setCohorts] = useState<FellowshipCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState<FellowshipCohort | null>(null);

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    setLoading(true);
    try {
      const data = await fellowshipCohortsApi.list();
      setCohorts(data);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading cohorts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fellowship Cohorts</h3>
          <p className="text-sm text-slate-400 mt-1">Term-based groups with capacity tracking</p>
        </div>
      </div>

      {cohorts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="text-slate-400">No cohorts created yet</p>
          <p className="text-xs text-slate-500 mt-1">Cohorts are created within fellowship programs</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cohort</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Term</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Dates</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Orientation</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cohorts.map((cohort) => (
                  <tr key={cohort.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-sm">{cohort.name}</p>
                      {cohort.hostLab && <p className="text-xs text-slate-400 mt-0.5">{cohort.hostLab}</p>}
                    </td>
                    <td className="px-4 py-4 text-sm capitalize">
                      {cohort.term} {cohort.academicYear || ''}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {formatDate(cohort.startDate)} – {formatDate(cohort.endDate)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-medium">
                          {cohort.activeCount}/{cohort.maxParticipants || '—'}
                        </span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-emerald-500 rounded-full h-1.5"
                            style={{ width: `${cohort.maxParticipants ? (cohort.activeCount / cohort.maxParticipants) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium ${getCohortStatusColor(cohort.status)}`}>
                        {COHORT_STATUS_CONFIG[cohort.status as keyof typeof COHORT_STATUS_CONFIG]?.label || cohort.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {formatDate(cohort.orientationDate)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedCohort(cohort)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cohort Detail Modal */}
      {selectedCohort && (
        <CohortDetailModal
          cohort={selectedCohort}
          onClose={() => setSelectedCohort(null)}
        />
      )}
    </div>
  );
}

// ===========================================
// Cohort Detail Modal
// ===========================================

function CohortDetailModal({ cohort, onClose }: {
  cohort: FellowshipCohort;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{cohort.name}</h3>
            <p className="text-sm text-slate-400 mt-1">
              {cohort.term} {cohort.academicYear || ''} Cohort
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${getCohortStatusColor(cohort.status)}`}>
              {COHORT_STATUS_CONFIG[cohort.status as keyof typeof COHORT_STATUS_CONFIG]?.label || cohort.status}
            </span>
            {cohort.hostLab && (
              <span className="text-sm text-slate-400">{cohort.hostLab}</span>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Start Date</p>
              <p className="text-sm mt-0.5">{formatDate(cohort.startDate)}</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">End Date</p>
              <p className="text-sm mt-0.5">{formatDate(cohort.endDate)}</p>
            </div>
            {cohort.orientationDate && (
              <div className="p-3 bg-slate-800/30 rounded-lg col-span-2">
                <p className="text-xs text-slate-400">Orientation</p>
                <p className="text-sm mt-0.5">{formatDate(cohort.orientationDate)}</p>
              </div>
            )}
          </div>

          {/* Capacity */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Capacity</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-lg font-bold">{cohort.acceptedCount}</p>
                <p className="text-xs text-slate-500">Accepted</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-400">{cohort.activeCount}</p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-400">{cohort.completedCount}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400">{cohort.maxParticipants || '—'}</p>
                <p className="text-xs text-slate-500">Max</p>
              </div>
            </div>
            {cohort.maxParticipants && (
              <div className="mt-3">
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 rounded-full h-2"
                    style={{ width: `${(cohort.activeCount / cohort.maxParticipants) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.round((cohort.activeCount / cohort.maxParticipants) * 100)}% capacity utilized
                </p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2">
            <p>Created: {formatDate(cohort.createdAt)}</p>
            <p>Updated: {formatDate(cohort.updatedAt)}</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Applications Sub-tab
// ===========================================

function ApplicationsView() {
  const [applications, setApplications] = useState<FellowshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<FellowshipApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = [statusFilter];
      const result = await fellowshipApplicationsApi.list(filters);
      setApplications(result.applications);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
    setLoading(false);
  };

  const filteredApps = applications.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.user?.firstName?.toLowerCase().includes(term) ||
      a.user?.lastName?.toLowerCase().includes(term) ||
      a.preferredLabs?.some(l => l.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fellowship Applications</h3>
          <p className="text-sm text-slate-400 mt-1">Application pipeline with scoring and mentor assignment</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under-review">Under Review</option>
          <option value="interview-scheduled">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading applications...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Program</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Preferred Lab</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mentor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <Users size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No applications found</p>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-sm">
                          {app.user
                            ? `${app.user.firstName} ${app.user.lastName}`
                            : 'Unknown'}
                        </p>
                        {app.user?.email && (
                          <p className="text-xs text-slate-400 mt-0.5">{app.user.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {app.program?.name || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {app.preferredLabs?.join(', ') || '—'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {app.applicationScore !== undefined && app.applicationScore !== null ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star size={12} className="text-amber-400" />
                            <span className="text-sm font-medium">{app.applicationScore.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {app.mentor?.name || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                          {FELLOWSHIP_STATUS_CONFIG[app.status]?.label || app.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={async (status) => {
            const success = await fellowshipApplicationsApi.updateStatus(selectedApp.id, status);
            if (success) {
              setSelectedApp({ ...selectedApp, status });
              fetchApplications();
            }
          }}
        />
      )}
    </div>
  );
}

// ===========================================
// Application Detail Modal
// ===========================================

function ApplicationDetailModal({ application, onClose, onStatusUpdate }: {
  application: FellowshipApplication;
  onClose: () => void;
  onStatusUpdate: (status: FellowshipApplicationStatus) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {application.user
                ? `${application.user.firstName} ${application.user.lastName}`
                : 'Application Details'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {application.program?.name || 'Fellowship Application'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & Score */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                  {FELLOWSHIP_STATUS_CONFIG[application.status]?.label}
                </span>
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Score</p>
              <p className="text-lg font-bold mt-0.5">
                {application.applicationScore?.toFixed(1) || '—'}
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Preferred Lab(s)</p>
              <p className="text-sm mt-0.5">{application.preferredLabs?.join(', ') || '—'}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Submitted</p>
              <p className="text-sm mt-0.5">{formatDate(application.submittedAt)}</p>
            </div>
            {application.startedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Started</p>
                <p className="text-sm mt-0.5">{formatDate(application.startedAt)}</p>
              </div>
            )}
            {application.completedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Completed</p>
                <p className="text-sm mt-0.5">{formatDate(application.completedAt)}</p>
              </div>
            )}
          </div>

          {/* Mentor */}
          {application.mentor && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Assigned Mentor</h4>
              <p className="text-sm">{application.mentor.name}</p>
              {application.mentor.labName && (
                <p className="text-xs text-slate-400 mt-0.5">{application.mentor.labName}</p>
              )}
            </div>
          )}

          {/* Research Statement */}
          {application.researchStatement && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Research Statement</h4>
              <p className="text-sm text-slate-300">{application.researchStatement}</p>
            </div>
          )}

          {/* Compliance */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Compliance Checks</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {application.backgroundCheckStatus === 'cleared' ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Clock size={14} className="text-amber-400" />
                )}
                <span>Background Check</span>
              </div>
              <div className="flex items-center gap-2">
                {application.clearanceStatus === 'cleared' ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Clock size={14} className="text-amber-400" />
                )}
                <span>Clearance</span>
              </div>
              <div className="flex items-center gap-2">
                {application.drugTestStatus === 'cleared' ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Clock size={14} className="text-amber-400" />
                )}
                <span>Drug Test</span>
              </div>
            </div>
          </div>

          {/* Status Update Actions */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-sm font-semibold mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FELLOWSHIP_STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => onStatusUpdate(key as FellowshipApplicationStatus)}
                  disabled={key === application.status}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    key === application.status
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Mentors Sub-tab
// ===========================================

function MentorsView() {
  const [mentors, setMentors] = useState<FellowshipMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<FellowshipMentor | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await fellowshipMentorsApi.list();
      setMentors(data);
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading mentors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fellowship Mentors</h3>
          <p className="text-sm text-slate-400 mt-1">Mentor availability, research areas, and track record</p>
        </div>
      </div>

      {mentors.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <UserCheck size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="text-slate-400">No mentors registered yet</p>
          <p className="text-xs text-slate-500 mt-1">Mentors are assigned to fellowship applications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => setSelectedMentor(mentor)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{mentor.name}</p>
                  {mentor.department && (
                    <p className="text-xs text-slate-400 mt-0.5">{mentor.department}</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${mentor.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {mentor.status === 'active' ? 'Active' : mentor.status}
                </span>
              </div>

              {mentor.labName && (
                <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-300">
                  <Building2 size={14} className="text-slate-400" />
                  {mentor.labName}
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-sm font-bold">{mentor.currentFellows}</p>
                  <p className="text-xs text-slate-500">Current</p>
                </div>
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-sm font-bold">{mentor.maxFellows}</p>
                  <p className="text-xs text-slate-500">Max</p>
                </div>
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-sm font-bold">{mentor.totalFellowsMentored}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>

              {(mentor.researchAreas?.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mentor.researchAreas!.slice(0, 3).map((area) => (
                    <span key={area} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                      {area}
                    </span>
                  ))}
                  {mentor.researchAreas!.length > 3 && (
                    <span className="text-xs text-slate-500">+{mentor.researchAreas!.length - 3}</span>
                  )}
                </div>
              )}

              {mentor.averageFellowRating !== undefined && mentor.averageFellowRating > 0 && (
                <div className="mt-3 flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-400" />
                  <span className="font-medium">{mentor.averageFellowRating.toFixed(1)}</span>
                  <span className="text-slate-500 text-xs">rating</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <MentorDetailModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
}

// ===========================================
// Mentor Detail Modal
// ===========================================

function MentorDetailModal({ mentor, onClose }: {
  mentor: FellowshipMentor;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{mentor.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{mentor.title || 'Research Mentor'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & Lab */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${mentor.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {mentor.status.charAt(0).toUpperCase() + mentor.status.slice(1)}
                </span>
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Lab</p>
              <p className="text-sm mt-0.5">{mentor.labName || '—'}</p>
            </div>
          </div>

          {/* Department & Division */}
          <div className="grid grid-cols-2 gap-4">
            {mentor.department && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Department</p>
                <p className="text-sm mt-0.5">{mentor.department}</p>
              </div>
            )}
            {mentor.division && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Division</p>
                <p className="text-sm mt-0.5">{mentor.division}</p>
              </div>
            )}
          </div>

          {/* Fellow Stats */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Mentoring Record</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-emerald-400">{mentor.currentFellows}</p>
                <p className="text-xs text-slate-500">Current</p>
              </div>
              <div>
                <p className="text-lg font-bold">{mentor.maxFellows}</p>
                <p className="text-xs text-slate-500">Max</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-400">{mentor.totalFellowsMentored}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-400">{mentor.fellowsConvertedToHire}</p>
                <p className="text-xs text-slate-500">Hired</p>
              </div>
            </div>
            {mentor.averageFellowRating !== undefined && mentor.averageFellowRating > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Star size={16} className="text-amber-400" />
                <span className="font-medium">{mentor.averageFellowRating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">average rating</span>
              </div>
            )}
          </div>

          {/* Research Areas */}
          {(mentor.researchAreas?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Research Areas</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.researchAreas!.map((area) => (
                  <span key={area} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specializations */}
          {(mentor.specializations?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.specializations!.map((spec) => (
                  <span key={spec} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm mt-0.5">{mentor.email}</p>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2">
            <p>Created: {formatDate(mentor.createdAt)}</p>
            <p>Updated: {formatDate(mentor.updatedAt)}</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Analytics Sub-tab
// ===========================================

function AnalyticsView() {
  const [stats, setStats] = useState<FellowshipDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await fellowshipStatsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching fellowship stats:', err);
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Fellowship Analytics</h3>
        <p className="text-sm text-slate-400 mt-1">Conversion rates, lab distribution, and retention metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Programs" value={stats.totalPrograms} icon={BookOpen} color="blue" />
        <StatCard label="Active Fellows" value={stats.activeFellows} icon={Users} color="emerald" />
        <StatCard label="Total Applications" value={stats.totalApplications} icon={GraduationCap} color="purple" />
        <StatCard label="Avg Score" value={stats.averageScore.toFixed(1)} icon={Award} color="amber" />
      </div>

      {/* Conversion & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Conversion Rate
          </h4>
          <p className="text-3xl font-bold text-emerald-400">{stats.conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-slate-400 mt-1">Fellows converted to full-time hires</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            Pending Applications
          </h4>
          <p className="text-3xl font-bold text-blue-400">{stats.pendingApplications}</p>
          <p className="text-sm text-slate-400 mt-1">Awaiting review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <UserCheck size={16} className="text-purple-400" />
            Available Mentors
          </h4>
          <p className="text-3xl font-bold text-purple-400">{stats.availableMentors}</p>
          <p className="text-sm text-slate-400 mt-1">Of {stats.totalMentors} total mentors</p>
        </div>
      </div>

      {/* By Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">Applications by Status</h4>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).filter(([, count]) => count > 0).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(status as FellowshipApplicationStatus)}`}>
                  {FELLOWSHIP_STATUS_CONFIG[status as FellowshipApplicationStatus]?.label || status}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${stats.totalApplications ? (count / stats.totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">By Program Type</h4>
          <div className="space-y-3">
            {Object.entries(stats.byProgram).map(([program, data]) => {
              const config = FELLOWSHIP_PROGRAM_CONFIG[program as keyof typeof FELLOWSHIP_PROGRAM_CONFIG];
              return (
                <div key={program} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{config?.label || program}</span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{data.applications} apps</span>
                    <span>{data.active} active</span>
                    <span>{data.completed} done</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lab Distribution */}
      {Object.keys(stats.byLab).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">Fellows by National Lab</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(stats.byLab).map(([lab, count]) => (
              <div key={lab} className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lab}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// Main FellowshipManagementTab Component
// ===========================================

export default function FellowshipManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState('programs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap size={22} className="text-purple-400" />
            Fellowship Program Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            DOE Office of Science: SULI, SCGSR, CCI, WDTS, VFP
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'programs' && <ProgramsView />}
      {activeSubTab === 'cohorts' && <CohortsView />}
      {activeSubTab === 'applications' && <ApplicationsView />}
      {activeSubTab === 'mentors' && <MentorsView />}
      {activeSubTab === 'analytics' && <AnalyticsView />}
    </div>
  );
}
