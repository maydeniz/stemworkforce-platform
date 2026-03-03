// ===========================================
// ITAR/EAR Export Control Compliance Tab
// Manages export control assessments, foreign national screenings,
// Technology Control Plans, and compliance audit trails
// Regulatory: 22 CFR 120-130 (ITAR), 15 CFR 730-774 (EAR)
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Download,
  X,
  Save,
  Globe,
  UserCheck,
  Flag,
  BarChart3,
  ClipboardList,
  RefreshCw,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { exportControlApi } from '@/services/exportControlApi';
import type {
  ExportControlAssessment,
  ForeignNationalScreening,
  ExportControlAuditEntry,
  ExportControlDashboardStats,
  ExportControlType,
  ExportControlStatus,
  ExportControlFilters,
  ForeignNationalScreeningFilters,
  CreateExportControlAssessmentData,
  CreateForeignNationalScreeningData,
} from '@/types/exportControl';
import {
  USML_CATEGORIES,
  EXPORT_CONTROL_STATUS_CONFIG,
  RESTRICTED_PARTY_LISTS,
} from '@/types/exportControl';

// ===========================================
// Sub-tab definitions
// ===========================================

const subTabs = [
  { id: 'dashboard', label: 'Compliance Dashboard', icon: BarChart3 },
  { id: 'assessments', label: 'Job Assessments', icon: FileText },
  { id: 'screenings', label: 'FN Screening', icon: Users },
  { id: 'tcp', label: 'TCP Management', icon: ClipboardList },
  { id: 'audit', label: 'Audit Trail', icon: Shield },
];

// ===========================================
// Helpers
// ===========================================

const getStatusColor = (status: ExportControlStatus): string => {
  const config = EXPORT_CONTROL_STATUS_CONFIG[status];
  if (!config) return 'bg-slate-500/20 text-slate-400';
  const colorMap: Record<string, string> = {
    gray: 'bg-slate-500/20 text-slate-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400',
    teal: 'bg-teal-500/20 text-teal-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };
  return colorMap[config.color] || 'bg-slate-500/20 text-slate-400';
};

const getControlTypeLabel = (type: ExportControlType): string => {
  switch (type) {
    case 'itar': return 'ITAR';
    case 'ear': return 'EAR';
    case 'both': return 'ITAR + EAR';
    case 'none': return 'None';
    default: return type;
  }
};

const getControlTypeColor = (type: ExportControlType): string => {
  switch (type) {
    case 'itar': return 'bg-red-500/20 text-red-400';
    case 'ear': return 'bg-amber-500/20 text-amber-400';
    case 'both': return 'bg-purple-500/20 text-purple-400';
    case 'none': return 'bg-slate-500/20 text-slate-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const getRiskColor = (risk?: string): string => {
  switch (risk) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-amber-500/20 text-amber-400';
    case 'low': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Static color class maps for Tailwind JIT compatibility
const exportControlColors: Record<string, { iconBg: string; iconText: string }> = {
  emerald: { iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400' },
  blue: { iconBg: 'bg-blue-500/20', iconText: 'text-blue-400' },
  violet: { iconBg: 'bg-violet-500/20', iconText: 'text-violet-400' },
  amber: { iconBg: 'bg-amber-500/20', iconText: 'text-amber-400' },
  cyan: { iconBg: 'bg-cyan-500/20', iconText: 'text-cyan-400' },
  red: { iconBg: 'bg-red-500/20', iconText: 'text-red-400' },
  slate: { iconBg: 'bg-slate-500/20', iconText: 'text-slate-400' },
};

// ===========================================
// Stat Card Component
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
        <div className={`p-2.5 rounded-lg ${exportControlColors[color]?.iconBg || 'bg-slate-500/20'}`}>
          <Icon size={22} className={exportControlColors[color]?.iconText || 'text-slate-400'} />
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
// Dashboard Sub-tab
// ===========================================

function ComplianceDashboard({ stats, loading }: { stats: ExportControlDashboardStats; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading compliance data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assessments" value={stats.totalAssessments} icon={FileText} color="blue" />
        <StatCard label="ITAR Controlled" value={stats.itarControlled} icon={Lock} color="red" subtitle="22 CFR 120-130" />
        <StatCard label="EAR Controlled" value={stats.earControlled} icon={Shield} color="amber" subtitle="15 CFR 730-774" />
        <StatCard label="Pending Reviews" value={stats.pendingAssessments} icon={Clock} color="purple" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users size={16} />
            <span className="text-xs">FN Screened</span>
          </div>
          <p className="text-xl font-bold">{stats.foreignNationalsScreened}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <AlertTriangle size={16} />
            <span className="text-xs">RPL Matches</span>
          </div>
          <p className="text-xl font-bold text-red-400">{stats.restrictedPartyMatches}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ClipboardList size={16} />
            <span className="text-xs">Active TCPs</span>
          </div>
          <p className="text-xl font-bold">{stats.tcpActive}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <AlertCircle size={16} />
            <span className="text-xs">TCPs Expiring</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{stats.tcpExpiringNext30Days}</p>
          <p className="text-xs text-slate-500">Next 30 days</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Clock size={16} />
            <span className="text-xs">Pending Screenings</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{stats.pendingScreenings}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Shield size={16} />
            <span className="text-xs">Both Controls</span>
          </div>
          <p className="text-xl font-bold">{stats.bothControlled}</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Control Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">By Control Type</h3>
          <div className="space-y-3">
            {Object.entries(stats.byControlType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${getControlTypeColor(type as ExportControlType)}`}>
                    {getControlTypeLabel(type as ExportControlType)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-emerald-500 rounded-full h-2"
                      style={{ width: `${stats.totalAssessments ? (count / stats.totalAssessments) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">By Assessment Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).filter(([, count]) => count > 0).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(status as ExportControlStatus)}`}>
                    {EXPORT_CONTROL_STATUS_CONFIG[status as ExportControlStatus]?.label || status}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" />
          Compliance Alerts
        </h3>
        <div className="space-y-3">
          {stats.restrictedPartyMatches > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <XCircle size={18} className="text-red-400" />
              <span className="text-sm">
                <strong>{stats.restrictedPartyMatches}</strong> restricted party list match(es) require immediate review
              </span>
            </div>
          )}
          {stats.tcpExpiringNext30Days > 0 && (
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock size={18} className="text-amber-400" />
              <span className="text-sm">
                <strong>{stats.tcpExpiringNext30Days}</strong> Technology Control Plan(s) expiring within 30 days
              </span>
            </div>
          )}
          {stats.pendingScreenings > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Users size={18} className="text-blue-400" />
              <span className="text-sm">
                <strong>{stats.pendingScreenings}</strong> foreign national screening(s) pending completion
              </span>
            </div>
          )}
          {stats.restrictedPartyMatches === 0 && stats.tcpExpiringNext30Days === 0 && stats.pendingScreenings === 0 && (
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm">No active compliance alerts</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Job Assessments Sub-tab
// ===========================================

function JobAssessments() {
  const [assessments, setAssessments] = useState<ExportControlAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [controlTypeFilter, setControlTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<ExportControlAssessment | null>(null);

  useEffect(() => {
    fetchAssessments();
  }, [controlTypeFilter, statusFilter]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const filters: ExportControlFilters = {};
      if (controlTypeFilter !== 'all') filters.controlType = controlTypeFilter as ExportControlType;
      if (statusFilter !== 'all') filters.status = [statusFilter as ExportControlStatus];

      const result = await exportControlApi.listAssessments(filters);
      setAssessments(result.assessments);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
    setLoading(false);
  };

  const handleCreate = async (formData: CreateExportControlAssessmentData) => {
    const result = await exportControlApi.createAssessment(formData);
    if (result) {
      setShowCreateModal(false);
      fetchAssessments();
    }
  };

  const filteredAssessments = assessments.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.projectName?.toLowerCase().includes(term) ||
      a.itarCategory?.toLowerCase().includes(term) ||
      a.earEccn?.toLowerCase().includes(term) ||
      a.job?.title?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Export Control Assessments</h3>
          <p className="text-sm text-slate-400 mt-1">ITAR (22 CFR) and EAR (15 CFR) classifications per position/project</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Assessment
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, ECCN, or USML category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={controlTypeFilter}
          onChange={(e) => setControlTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Control Types</option>
          <option value="itar">ITAR</option>
          <option value="ear">EAR</option>
          <option value="both">Both</option>
          <option value="none">None</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="not-assessed">Not Assessed</option>
          <option value="assessment-pending">Pending</option>
          <option value="eligible">Eligible</option>
          <option value="restricted">Restricted</option>
          <option value="denied">Denied</option>
          <option value="under-review">Under Review</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading assessments...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Project / Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Control Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Classification</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Citizenship Req</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">TCP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Assessed</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <FileText size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No assessments found</p>
                      <p className="text-xs mt-1">Create a new assessment to classify a position or project</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-sm">
                            {assessment.projectName || assessment.job?.title || 'Unnamed'}
                          </p>
                          {assessment.organization && (
                            <p className="text-xs text-slate-400 mt-0.5">{assessment.organization.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${getControlTypeColor(assessment.controlType)}`}>
                          {getControlTypeLabel(assessment.controlType)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {assessment.controlType === 'itar' || assessment.controlType === 'both' ? (
                          <div>
                            <span className="text-red-400">USML {assessment.itarCategory || '—'}</span>
                            {assessment.itarSubcategory && (
                              <span className="text-slate-400 text-xs ml-1">({assessment.itarSubcategory})</span>
                            )}
                          </div>
                        ) : null}
                        {assessment.controlType === 'ear' || assessment.controlType === 'both' ? (
                          <div>
                            <span className="text-amber-400">ECCN {assessment.earEccn || '—'}</span>
                          </div>
                        ) : null}
                        {assessment.controlType === 'none' && <span className="text-slate-500">N/A</span>}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {assessment.citizenshipRequirement === 'us-citizen-only' && (
                          <span className="text-red-400 flex items-center gap-1">
                            <Flag size={12} /> US Citizen Only
                          </span>
                        )}
                        {assessment.citizenshipRequirement === 'us-person' && (
                          <span className="text-amber-400">US Person</span>
                        )}
                        {assessment.citizenshipRequirement === 'us-authorized' && (
                          <span className="text-blue-400">US Authorized</span>
                        )}
                        {assessment.citizenshipRequirement === 'any' && (
                          <span className="text-slate-400">Any</span>
                        )}
                        {!assessment.citizenshipRequirement && <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {assessment.tcpRequired ? (
                          <div>
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Required
                            </span>
                            {assessment.tcpExpiresAt && (
                              <span className="text-xs text-slate-400 block mt-0.5">
                                Exp: {formatDate(assessment.tcpExpiresAt)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(assessment.assessmentStatus)}`}>
                          {EXPORT_CONTROL_STATUS_CONFIG[assessment.assessmentStatus]?.label || assessment.assessmentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">
                        {formatDate(assessment.assessedAt)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedAssessment(assessment)}
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

      {/* Create Modal */}
      {showCreateModal && (
        <AssessmentCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Detail Modal */}
      {selectedAssessment && (
        <AssessmentDetailModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
}

// ===========================================
// Assessment Create Modal
// ===========================================

function AssessmentCreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: CreateExportControlAssessmentData) => void;
}) {
  const [formData, setFormData] = useState<CreateExportControlAssessmentData>({
    controlType: 'none',
    projectName: '',
  });

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
          <h3 className="text-xl font-bold">New Export Control Assessment</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Project / Position Name *</label>
            <input
              type="text"
              value={formData.projectName || ''}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="e.g., Satellite Communications System Engineer"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Export Control Type *</label>
            <select
              value={formData.controlType}
              onChange={(e) => setFormData({ ...formData, controlType: e.target.value as ExportControlType })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="none">None — Not export controlled</option>
              <option value="itar">ITAR — International Traffic in Arms (22 CFR)</option>
              <option value="ear">EAR — Export Administration Regulations (15 CFR)</option>
              <option value="both">Both — ITAR and EAR controlled</option>
            </select>
          </div>

          {(formData.controlType === 'itar' || formData.controlType === 'both') && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg space-y-4">
              <h4 className="text-sm font-semibold text-red-400">ITAR Classification (22 CFR 121)</h4>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">USML Category</label>
                <select
                  value={formData.itarCategory || ''}
                  onChange={(e) => setFormData({ ...formData, itarCategory: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select USML Category...</option>
                  {Object.entries(USML_CATEGORIES).map(([cat, desc]) => (
                    <option key={cat} value={cat}>Cat {cat}: {desc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Subcategory (optional)</label>
                <input
                  type="text"
                  value={formData.itarSubcategory || ''}
                  onChange={(e) => setFormData({ ...formData, itarSubcategory: e.target.value })}
                  placeholder="e.g., VIII(a)"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {(formData.controlType === 'ear' || formData.controlType === 'both') && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-4">
              <h4 className="text-sm font-semibold text-amber-400">EAR Classification (15 CFR 774)</h4>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">ECCN (Export Control Classification Number)</label>
                <input
                  type="text"
                  value={formData.earEccn || ''}
                  onChange={(e) => setFormData({ ...formData, earEccn: e.target.value })}
                  placeholder="e.g., 3A001, 5D002, 9E003"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Citizenship Requirement</label>
            <select
              value={formData.citizenshipRequirement || ''}
              onChange={(e) => setFormData({ ...formData, citizenshipRequirement: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">Not specified</option>
              <option value="us-citizen-only">US Citizen Only</option>
              <option value="us-person">US Person (Citizen, LPR, or Protected Individual)</option>
              <option value="us-authorized">US Authorized (License/Exemption)</option>
              <option value="any">Any (No restriction)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tcpRequired"
              checked={formData.tcpRequired || false}
              onChange={(e) => setFormData({ ...formData, tcpRequired: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800"
            />
            <label htmlFor="tcpRequired" className="text-sm text-slate-300">
              Technology Control Plan (TCP) required
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="fnAllowed"
              checked={formData.foreignNationalAllowed || false}
              onChange={(e) => setFormData({ ...formData, foreignNationalAllowed: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800"
            />
            <label htmlFor="fnAllowed" className="text-sm text-slate-300">
              Foreign nationals allowed (with appropriate controls)
            </label>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Compliance Notes</label>
            <textarea
              value={formData.complianceNotes || ''}
              onChange={(e) => setFormData({ ...formData, complianceNotes: e.target.value })}
              rows={3}
              placeholder="Any additional compliance requirements or notes..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(formData)}
            disabled={!formData.projectName}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Create Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Assessment Detail Modal
// ===========================================

function AssessmentDetailModal({ assessment, onClose }: {
  assessment: ExportControlAssessment;
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
            <h3 className="text-xl font-bold">{assessment.projectName || assessment.job?.title || 'Assessment Details'}</h3>
            <p className="text-sm text-slate-400 mt-1">Export Control Assessment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Classification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase">Control Type</label>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${getControlTypeColor(assessment.controlType)}`}>
                  {getControlTypeLabel(assessment.controlType)}
                </span>
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Status</label>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(assessment.assessmentStatus)}`}>
                  {EXPORT_CONTROL_STATUS_CONFIG[assessment.assessmentStatus]?.label}
                </span>
              </p>
            </div>
          </div>

          {/* ITAR Details */}
          {(assessment.controlType === 'itar' || assessment.controlType === 'both') && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-red-400 mb-3">ITAR Details (22 CFR 120-130)</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">USML Category:</span>
                  <span className="ml-2">
                    {assessment.itarCategory ? `Cat ${assessment.itarCategory}` : '—'}
                    {assessment.itarCategory && USML_CATEGORIES[assessment.itarCategory] && (
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {USML_CATEGORIES[assessment.itarCategory]}
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Subcategory:</span>
                  <span className="ml-2">{assessment.itarSubcategory || '—'}</span>
                </div>
                {assessment.itarExemption && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Exemption:</span>
                    <span className="ml-2">{assessment.itarExemption}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EAR Details */}
          {(assessment.controlType === 'ear' || assessment.controlType === 'both') && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-400 mb-3">EAR Details (15 CFR 730-774)</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">ECCN:</span>
                  <span className="ml-2">{assessment.earEccn || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Classification Reason:</span>
                  <span className="ml-2">{assessment.earClassificationReason || '—'}</span>
                </div>
                {assessment.earLicenseException && (
                  <div className="col-span-2">
                    <span className="text-slate-400">License Exception:</span>
                    <span className="ml-2">{assessment.earLicenseException}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personnel Requirements */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Personnel Requirements</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Citizenship:</span>
                <span className="ml-2">
                  {assessment.citizenshipRequirement === 'us-citizen-only' && 'US Citizen Only'}
                  {assessment.citizenshipRequirement === 'us-person' && 'US Person'}
                  {assessment.citizenshipRequirement === 'us-authorized' && 'US Authorized'}
                  {assessment.citizenshipRequirement === 'any' && 'Any'}
                  {!assessment.citizenshipRequirement && '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Foreign Nationals:</span>
                <span className={`ml-2 ${assessment.foreignNationalAllowed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {assessment.foreignNationalAllowed ? 'Allowed (with controls)' : 'Not Allowed'}
                </span>
              </div>
            </div>
          </div>

          {/* TCP Status */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Technology Control Plan</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Required:</span>
                <span className={`ml-2 ${assessment.tcpRequired ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {assessment.tcpRequired ? 'Yes' : 'No'}
                </span>
              </div>
              {assessment.tcpReferenceNumber && (
                <div>
                  <span className="text-slate-400">Reference:</span>
                  <span className="ml-2">{assessment.tcpReferenceNumber}</span>
                </div>
              )}
              {assessment.tcpApprovedAt && (
                <div>
                  <span className="text-slate-400">Approved:</span>
                  <span className="ml-2">{formatDate(assessment.tcpApprovedAt)}</span>
                </div>
              )}
              {assessment.tcpExpiresAt && (
                <div>
                  <span className="text-slate-400">Expires:</span>
                  <span className="ml-2">{formatDate(assessment.tcpExpiresAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Info */}
          <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2">
            <p>Created: {formatDate(assessment.createdAt)}</p>
            <p>Updated: {formatDate(assessment.updatedAt)}</p>
            {assessment.assessedAt && <p>Assessed: {formatDate(assessment.assessedAt)}</p>}
            {assessment.nextReviewDue && <p>Next Review: {formatDate(assessment.nextReviewDue)}</p>}
          </div>

          {assessment.complianceNotes && (
            <div>
              <label className="text-xs text-slate-400 uppercase">Compliance Notes</label>
              <p className="mt-1 text-sm bg-slate-800/50 p-3 rounded-lg">{assessment.complianceNotes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Foreign National Screening Sub-tab
// ===========================================

function ForeignNationalScreenings() {
  const [screenings, setScreenings] = useState<ForeignNationalScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScreening, setSelectedScreening] = useState<ForeignNationalScreening | null>(null);

  useEffect(() => {
    fetchScreenings();
  }, [statusFilter, riskFilter]);

  const fetchScreenings = async () => {
    setLoading(true);
    try {
      const filters: ForeignNationalScreeningFilters = {};
      if (statusFilter !== 'all') filters.screeningStatus = [statusFilter as ExportControlStatus];
      if (riskFilter !== 'all') filters.deemedExportRisk = riskFilter as any;

      const result = await exportControlApi.listScreenings(filters);
      setScreenings(result.screenings);
    } catch (err) {
      console.error('Error fetching screenings:', err);
    }
    setLoading(false);
  };

  const handleRunRPL = async (screeningId: string) => {
    const result = await exportControlApi.runRestrictedPartyCheck(screeningId);
    if (result) {
      fetchScreenings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Foreign National Screening</h3>
          <p className="text-sm text-slate-400 mt-1">
            Citizenship verification and restricted party list checks (BIS, OFAC, DDTC)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Screening
        </button>
      </div>

      {/* Restricted Party Lists Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Globe size={16} className="text-blue-400" />
          Restricted Party Lists Checked
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {RESTRICTED_PARTY_LISTS.map((list) => (
            <div key={list.id} className="text-center p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xs font-medium text-slate-300">{list.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{list.agency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="assessment-pending">Pending</option>
          <option value="eligible">Eligible</option>
          <option value="restricted">Restricted</option>
          <option value="denied">Denied</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading screenings...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Individual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Citizenship</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Visa</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">RPL Check</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">ITAR</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">EAR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {screenings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                      <Users size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No screenings found</p>
                      <p className="text-xs mt-1">Initiate a screening for foreign national personnel</p>
                    </td>
                  </tr>
                ) : (
                  screenings.map((screening) => (
                    <tr key={screening.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-sm">
                            {screening.user
                              ? `${screening.user.firstName} ${screening.user.lastName}`
                              : 'Unknown'}
                          </p>
                          {screening.user?.email && (
                            <p className="text-xs text-slate-400 mt-0.5">{screening.user.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Flag size={12} className="text-slate-400" />
                          {screening.declaredCitizenship}
                        </div>
                        {screening.dualCitizenship?.length ? (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Dual: {screening.dualCitizenship.join(', ')}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {screening.visaType || (screening.permanentResident ? 'LPR' : '—')}
                        {screening.visaExpiration && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Exp: {formatDate(screening.visaExpiration)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {screening.restrictedPartyChecked ? (
                          screening.restrictedPartyMatch ? (
                            <span className="text-red-400 flex items-center justify-center gap-1">
                              <XCircle size={14} /> Match
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center justify-center gap-1">
                              <CheckCircle2 size={14} /> Clear
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => handleRunRPL(screening.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
                          >
                            <RefreshCw size={12} /> Run Check
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {screening.itarEligible === true && <CheckCircle2 size={14} className="mx-auto text-emerald-400" />}
                        {screening.itarEligible === false && <XCircle size={14} className="mx-auto text-red-400" />}
                        {screening.itarEligible === undefined && <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {screening.earEligible === true && <CheckCircle2 size={14} className="mx-auto text-emerald-400" />}
                        {screening.earEligible === false && <XCircle size={14} className="mx-auto text-red-400" />}
                        {screening.earEligible === undefined && <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        {screening.deemedExportRisk ? (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(screening.deemedExportRisk)}`}>
                            {screening.deemedExportRisk.charAt(0).toUpperCase() + screening.deemedExportRisk.slice(1)}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(screening.screeningStatus)}`}>
                          {EXPORT_CONTROL_STATUS_CONFIG[screening.screeningStatus]?.label || screening.screeningStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedScreening(screening)}
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

      {/* Detail Modal */}
      {selectedScreening && (
        <ScreeningDetailModal
          screening={selectedScreening}
          onClose={() => setSelectedScreening(null)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <ScreeningCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            const result = await exportControlApi.createScreening(data);
            if (result) {
              setShowCreateModal(false);
              fetchScreenings();
            }
          }}
        />
      )}
    </div>
  );
}

// ===========================================
// Screening Create Modal
// ===========================================

function ScreeningCreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: CreateForeignNationalScreeningData) => void;
}) {
  const [formData, setFormData] = useState<CreateForeignNationalScreeningData>({
    userId: '',
    declaredCitizenship: '',
  });

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
          <h3 className="text-xl font-bold">New Foreign National Screening</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">User ID *</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="User UUID"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Declared Citizenship *</label>
            <input
              type="text"
              value={formData.declaredCitizenship}
              onChange={(e) => setFormData({ ...formData, declaredCitizenship: e.target.value })}
              placeholder="e.g., India, Germany, Brazil"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Country of Birth</label>
            <input
              type="text"
              value={formData.countryOfBirth || ''}
              onChange={(e) => setFormData({ ...formData, countryOfBirth: e.target.value })}
              placeholder="Country of birth"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Visa Type</label>
              <select
                value={formData.visaType || ''}
                onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select...</option>
                <option value="H-1B">H-1B</option>
                <option value="J-1">J-1</option>
                <option value="F-1/OPT">F-1/OPT</option>
                <option value="L-1">L-1</option>
                <option value="O-1">O-1</option>
                <option value="TN">TN</option>
                <option value="E-2">E-2</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Visa Expiration</label>
              <input
                type="date"
                value={formData.visaExpiration || ''}
                onChange={(e) => setFormData({ ...formData, visaExpiration: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="permanentResident"
              checked={formData.permanentResident || false}
              onChange={(e) => setFormData({ ...formData, permanentResident: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800"
            />
            <label htmlFor="permanentResident" className="text-sm text-slate-300">
              Lawful Permanent Resident (Green Card holder)
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(formData)}
            disabled={!formData.userId || !formData.declaredCitizenship}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck size={16} />
            Initiate Screening
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Screening Detail Modal
// ===========================================

function ScreeningDetailModal({ screening, onClose }: {
  screening: ForeignNationalScreening;
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
            <h3 className="text-xl font-bold">
              {screening.user
                ? `${screening.user.firstName} ${screening.user.lastName}`
                : 'Screening Details'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">Foreign National Screening Record</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & Risk */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(screening.screeningStatus)}`}>
                  {EXPORT_CONTROL_STATUS_CONFIG[screening.screeningStatus]?.label || screening.screeningStatus}
                </span>
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Deemed Export Risk</p>
              <p className="mt-1">
                {screening.deemedExportRisk ? (
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${getRiskColor(screening.deemedExportRisk)}`}>
                    {screening.deemedExportRisk.charAt(0).toUpperCase() + screening.deemedExportRisk.slice(1)}
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm">Not assessed</span>
                )}
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400">Permanent Resident</p>
              <p className="text-sm mt-0.5 font-medium">
                {screening.permanentResident ? 'Yes (LPR)' : 'No'}
              </p>
            </div>
          </div>

          {/* Citizenship Info */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Citizenship Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Declared Citizenship:</span>
                <span className="ml-2">{screening.declaredCitizenship}</span>
              </div>
              <div>
                <span className="text-slate-400">Country of Birth:</span>
                <span className="ml-2">{screening.countryOfBirth || '—'}</span>
              </div>
              {screening.dualCitizenship?.length ? (
                <div className="col-span-2">
                  <span className="text-slate-400">Dual Citizenship:</span>
                  <span className="ml-2">{screening.dualCitizenship.join(', ')}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Visa Info */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Visa Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Visa Type:</span>
                <span className="ml-2">{screening.visaType || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400">Expiration:</span>
                <span className="ml-2">{formatDate(screening.visaExpiration)}</span>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Export Eligibility</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {screening.itarEligible === true && <CheckCircle2 size={14} className="text-emerald-400" />}
                {screening.itarEligible === false && <XCircle size={14} className="text-red-400" />}
                {screening.itarEligible === undefined && <Clock size={14} className="text-slate-400" />}
                <span>ITAR: {screening.itarEligible === true ? 'Eligible' : screening.itarEligible === false ? 'Ineligible' : 'Pending'}</span>
              </div>
              <div className="flex items-center gap-2">
                {screening.earEligible === true && <CheckCircle2 size={14} className="text-emerald-400" />}
                {screening.earEligible === false && <XCircle size={14} className="text-red-400" />}
                {screening.earEligible === undefined && <Clock size={14} className="text-slate-400" />}
                <span>EAR: {screening.earEligible === true ? 'Eligible' : screening.earEligible === false ? 'Ineligible' : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Restricted Party List Checks */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-3">Restricted Party List Checks</h4>
            {screening.restrictedPartyChecked ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {screening.restrictedPartyMatch ? (
                    <XCircle size={14} className="text-red-400" />
                  ) : (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  )}
                  <span>
                    Overall: {screening.restrictedPartyMatch ? 'MATCH FOUND' : 'Clear'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={screening.deniedPersonsListChecked ? 'text-emerald-400' : 'text-slate-600'} />
                    Denied Persons List
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={screening.entityListChecked ? 'text-emerald-400' : 'text-slate-600'} />
                    Entity List
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={screening.sdnListChecked ? 'text-emerald-400' : 'text-slate-600'} />
                    SDN List
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className={screening.unverifiedListChecked ? 'text-emerald-400' : 'text-slate-600'} />
                    Unverified List
                  </div>
                </div>
                {screening.restrictedPartyCheckedAt && (
                  <p className="text-xs text-slate-500 mt-2">Checked: {formatDate(screening.restrictedPartyCheckedAt)}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Restricted party check not yet performed</p>
            )}
          </div>

          {/* Screening Notes */}
          {screening.screeningNotes && (
            <div>
              <label className="text-xs text-slate-400 uppercase">Screening Notes</label>
              <p className="mt-1 text-sm bg-slate-800/50 p-3 rounded-lg">{screening.screeningNotes}</p>
            </div>
          )}

          {/* Audit Info */}
          <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2">
            <p>Created: {formatDate(screening.createdAt)}</p>
            <p>Updated: {formatDate(screening.updatedAt)}</p>
            {screening.screenedAt && <p>Screened: {formatDate(screening.screenedAt)}</p>}
            {screening.nextReviewDue && <p>Next Review: {formatDate(screening.nextReviewDue)}</p>}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// TCP Management Sub-tab
// ===========================================

function TCPManagement() {
  const [assessments, setAssessments] = useState<ExportControlAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewalNotice, setRenewalNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchTCPs();
  }, []);

  const fetchTCPs = async () => {
    setLoading(true);
    try {
      const result = await exportControlApi.listAssessments({});
      // Filter to only those with TCPs
      setAssessments(result.assessments.filter(a => a.tcpRequired));
    } catch (err) {
      console.error('Error fetching TCPs:', err);
    }
    setLoading(false);
  };

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const activeTCPs = assessments.filter(a => a.tcpApprovedAt && (!a.tcpExpiresAt || new Date(a.tcpExpiresAt) > now));
  const expiringTCPs = assessments.filter(a => a.tcpExpiresAt && new Date(a.tcpExpiresAt) <= in30Days && new Date(a.tcpExpiresAt) > now);
  const expiredTCPs = assessments.filter(a => a.tcpExpiresAt && new Date(a.tcpExpiresAt) <= now);
  const pendingTCPs = assessments.filter(a => a.tcpRequired && !a.tcpApprovedAt);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Technology Control Plans</h3>
        <p className="text-sm text-slate-400 mt-1">
          Manage TCPs required for controlled technology access by foreign nationals
        </p>
      </div>

      {/* TCP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Active TCPs" value={activeTCPs.length} icon={CheckCircle2} color="emerald" />
        <StatCard label="Expiring (30d)" value={expiringTCPs.length} icon={AlertTriangle} color="amber" />
        <StatCard label="Expired" value={expiredTCPs.length} icon={XCircle} color="red" />
        <StatCard label="Pending Approval" value={pendingTCPs.length} icon={Clock} color="blue" />
      </div>

      {/* Renewal Notice */}
      {renewalNotice && (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm">{renewalNotice}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading TCPs...</span>
        </div>
      ) : (
        <>
          {/* Expiring Soon */}
          {expiringTCPs.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <h4 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} />
                Expiring Within 30 Days
              </h4>
              <div className="space-y-3">
                {expiringTCPs.map(tcp => (
                  <div key={tcp.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{tcp.projectName || tcp.job?.title || 'Unnamed'}</p>
                      <p className="text-xs text-slate-400">
                        TCP #{tcp.tcpReferenceNumber || '—'} · Expires {formatDate(tcp.tcpExpiresAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setRenewalNotice(`Renewal initiated for TCP #${tcp.tcpReferenceNumber || tcp.id.slice(0, 8)}`);
                        setTimeout(() => setRenewalNotice(null), 3000);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-medium transition-colors"
                    >
                      Renew
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All TCPs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Reference #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Control Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Approved</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Expires</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {assessments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        <ClipboardList size={32} className="mx-auto mb-3 opacity-50" />
                        <p>No Technology Control Plans found</p>
                      </td>
                    </tr>
                  ) : (
                    assessments.map((tcp) => {
                      const isExpired = tcp.tcpExpiresAt && new Date(tcp.tcpExpiresAt) <= now;
                      const isExpiring = tcp.tcpExpiresAt && new Date(tcp.tcpExpiresAt) <= in30Days && !isExpired;
                      return (
                        <tr key={tcp.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium">
                            {tcp.projectName || tcp.job?.title || 'Unnamed'}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400">
                            {tcp.tcpReferenceNumber || '—'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getControlTypeColor(tcp.controlType)}`}>
                              {getControlTypeLabel(tcp.controlType)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400">
                            {formatDate(tcp.tcpApprovedAt)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className={isExpired ? 'text-red-400' : isExpiring ? 'text-amber-400' : 'text-slate-400'}>
                              {formatDate(tcp.tcpExpiresAt)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {isExpired && (
                              <span className="px-2.5 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                                Expired
                              </span>
                            )}
                            {isExpiring && (
                              <span className="px-2.5 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
                                Expiring
                              </span>
                            )}
                            {!isExpired && !isExpiring && tcp.tcpApprovedAt && (
                              <span className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                Active
                              </span>
                            )}
                            {!tcp.tcpApprovedAt && (
                              <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ===========================================
// Audit Trail Sub-tab
// ===========================================

function AuditTrail() {
  const [auditEntries, setAuditEntries] = useState<ExportControlAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAuditLog();
  }, [page]);

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const result = await exportControlApi.getAuditLog({}, page, 50);
      setAuditEntries(result.entries);
    } catch (err) {
      console.error('Error fetching audit log:', err);
    }
    setLoading(false);
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('screening')) return <Users size={14} className="text-blue-400" />;
    if (eventType.includes('restricted_party')) return <AlertTriangle size={14} className="text-red-400" />;
    if (eventType.includes('tcp')) return <ClipboardList size={14} className="text-purple-400" />;
    if (eventType.includes('denied') || eventType.includes('denial')) return <XCircle size={14} className="text-red-400" />;
    if (eventType.includes('approved') || eventType.includes('granted')) return <CheckCircle2 size={14} className="text-emerald-400" />;
    return <Shield size={14} className="text-slate-400" />;
  };

  const formatEventType = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Compliance Audit Trail</h3>
          <p className="text-sm text-slate-400 mt-1">
            Immutable record of all export control compliance actions
          </p>
        </div>
        <button
          onClick={() => {
            if (auditEntries.length === 0) return;
            const csvHeader = 'Date,Event Type,Performed By,Details\n';
            const csvRows = auditEntries.map(e =>
              `"${formatDate(e.createdAt)}","${e.eventType.replace(/_/g, ' ')}","${e.performedByUser ? `${e.performedByUser.firstName} ${e.performedByUser.lastName}` : '—'}","${JSON.stringify(e.eventDetails).replace(/"/g, '""')}"`
            ).join('\n');
            const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export-control-audit-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={auditEntries.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Export Log
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading audit trail...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          {auditEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Shield size={32} className="mx-auto mb-3 opacity-50" />
              <p>No audit entries found</p>
              <p className="text-xs mt-1">Actions will be logged here as compliance activities occur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditEntries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="mt-0.5">
                    {getEventIcon(entry.eventType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{formatEventType(entry.eventType)}</p>
                      <span className="text-xs text-slate-500">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    {entry.performedByUser && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        By: {entry.performedByUser.firstName} {entry.performedByUser.lastName}
                      </p>
                    )}
                    {entry.eventDetails && Object.keys(entry.eventDetails).length > 0 && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {JSON.stringify(entry.eventDetails).slice(0, 100)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {auditEntries.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={auditEntries.length < 50}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===========================================
// Main ExportControlTab Component
// ===========================================

export default function ExportControlTab() {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [stats, setStats] = useState<ExportControlDashboardStats>({
    totalAssessments: 0,
    itarControlled: 0,
    earControlled: 0,
    bothControlled: 0,
    pendingAssessments: 0,
    pendingScreenings: 0,
    restrictedPartyMatches: 0,
    tcpActive: 0,
    tcpExpiringNext30Days: 0,
    foreignNationalsScreened: 0,
    byControlType: { itar: 0, ear: 0, both: 0, none: 0 },
    byStatus: {},
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await exportControlApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching export control stats:', err);
    }
    setStatsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield size={22} className="text-red-400" />
            ITAR/EAR Export Control Compliance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            22 CFR 120-130 (ITAR) · 15 CFR 730-774 (EAR) · Restricted party screening
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
      {activeSubTab === 'dashboard' && <ComplianceDashboard stats={stats} loading={statsLoading} />}
      {activeSubTab === 'assessments' && <JobAssessments />}
      {activeSubTab === 'screenings' && <ForeignNationalScreenings />}
      {activeSubTab === 'tcp' && <TCPManagement />}
      {activeSubTab === 'audit' && <AuditTrail />}
    </div>
  );
}
