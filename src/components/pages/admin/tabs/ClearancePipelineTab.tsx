// ===========================================
// Clearance Pipeline Tracking Tab
// Tracks clearance status through investigation lifecycle
// STATUS ONLY — no SF-86 content or classified data
// Regulatory: 10 CFR 710 (DOE), 32 CFR 117 (NISPOM)
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Search,
  RefreshCw,
  ChevronRight,
  UserCheck,
  Calendar,
  X,
  Save,
  BarChart3,
  Activity,
  Timer,
  FileCheck,
  Lock,
} from 'lucide-react';
import { clearanceApi } from '@/services/clearanceApi';
import type {
  ClearancePipeline,
  ClearanceStatusHistory,
  ClearanceDashboardStats,
  ClearancePipelineFilters,
  CreateClearancePipelineData,
  UpdateClearanceStatusData,
  ClearancePipelineStatus,
} from '@/types/clearance';
import {
  PIPELINE_STATUS_CONFIG,
  DOE_CLEARANCE_CONFIG,
} from '@/types/clearance';

// ===========================================
// Sub-tabs
// ===========================================

const subTabs = [
  { id: 'overview', label: 'Pipeline Overview', icon: BarChart3 },
  { id: 'active', label: 'Active Cases', icon: Activity },
  { id: 'expiration', label: 'Expiration Manager', icon: Calendar },
  { id: 'queue', label: 'Investigation Queue', icon: Timer },
];

// ===========================================
// Helpers
// ===========================================

const getStatusColor = (status: ClearancePipelineStatus): string => {
  const config = PIPELINE_STATUS_CONFIG[status];
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
    yellow: 'bg-yellow-500/20 text-yellow-400',
    teal: 'bg-teal-500/20 text-teal-400',
    rose: 'bg-rose-500/20 text-rose-400',
    pink: 'bg-pink-500/20 text-pink-400',
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

const getDaysUntil = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
// Pipeline Overview Sub-tab
// ===========================================

function PipelineOverview({ stats, loading }: { stats: ClearanceDashboardStats; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading pipeline data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pipelines" value={stats.totalPipelines} icon={Shield} color="blue" />
        <StatCard label="Active Clearances" value={stats.totalActive} icon={CheckCircle2} color="emerald" subtitle="Granted + Interim" />
        <StatCard label="Pending Investigation" value={stats.pendingInvestigation} icon={Clock} color="purple" />
        <StatCard label="Expiring (30 days)" value={stats.expiringNext30Days} icon={AlertTriangle} color="amber" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Lock size={16} />
            <span className="text-xs">Fully Granted</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{stats.fullyGranted}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <UserCheck size={16} />
            <span className="text-xs">Interim Granted</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{stats.interimGranted}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Calendar size={16} />
            <span className="text-xs">Expiring (90d)</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{stats.expiringNext90Days}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <RefreshCw size={16} />
            <span className="text-xs">Reinvestigation Due</span>
          </div>
          <p className="text-xl font-bold text-orange-400">{stats.reinvestigationDue}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <XCircle size={16} />
            <span className="text-xs">Denied</span>
          </div>
          <p className="text-xl font-bold text-red-400">{stats.deniedLastQuarter}</p>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Pipeline Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.entries(stats.byStatus).filter(([, count]) => count > 0).map(([status, count]) => {
            const config = PIPELINE_STATUS_CONFIG[status as ClearancePipelineStatus];
            return (
              <div key={status} className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-slate-400 mt-1">{config?.label || status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Type and Agency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">By Clearance Type</h3>
          <div className="space-y-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 capitalize">{type.replace(/-/g, ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${stats.totalPipelines ? (count / stats.totalPipelines) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">By Sponsoring Agency</h3>
          <div className="space-y-3">
            {Object.entries(stats.byAgency).map(([agency, count]) => (
              <div key={agency} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{agency}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
            {Object.keys(stats.byAgency).length === 0 && (
              <p className="text-sm text-slate-500">No agency data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Active Cases Sub-tab
// ===========================================

function ActiveCases() {
  const [pipelines, setPipelines] = useState<ClearancePipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<ClearancePipeline | null>(null);

  useEffect(() => {
    fetchPipelines();
  }, [page, statusFilter, typeFilter]);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const filters: ClearancePipelineFilters = {};
      if (statusFilter !== 'all') filters.status = [statusFilter as ClearancePipelineStatus];
      if (typeFilter !== 'all') filters.clearanceType = [typeFilter as any];

      const result = await clearanceApi.list(filters, page, 20);
      setPipelines(result.pipelines);
      setTotal(result.total);
    } catch (err) {
      console.error('Error fetching pipelines:', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Active Clearance Cases</h3>
          <p className="text-sm text-slate-400 mt-1">
            Track clearance cases through the investigation lifecycle
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Pipeline
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by agency, facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="not-started">Not Started</option>
          <option value="sf86-preparation">SF-86 Prep</option>
          <option value="sf86-submitted">SF-86 Submitted</option>
          <option value="investigation-initiated">Investigation</option>
          <option value="adjudication-pending">Adjudication</option>
          <option value="interim-granted">Interim Granted</option>
          <option value="granted">Granted</option>
          <option value="denied">Denied</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Types</option>
          <option value="secret">Secret</option>
          <option value="top-secret">Top Secret</option>
          <option value="top-secret-sci">TS/SCI</option>
          <option value="q-clearance">DOE Q</option>
          <option value="l-clearance">DOE L</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
          <span className="ml-3 text-slate-400">Loading cases...</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">DOE Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Agency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Polygraph</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Updated</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pipelines.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                      <Shield size={32} className="mx-auto mb-3 opacity-50" />
                      <p>No clearance pipelines found</p>
                      <p className="text-xs mt-1">Create a new pipeline to begin tracking</p>
                    </td>
                  </tr>
                ) : (
                  pipelines.map((pipeline) => {
                    const daysUntilExpiry = getDaysUntil(pipeline.clearanceExpiresAt);
                    return (
                      <tr key={pipeline.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium capitalize">
                          {pipeline.clearanceType.replace(/-/g, ' ')}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {pipeline.doeClearanceType ? (
                            <span className="text-blue-400">
                              {DOE_CLEARANCE_CONFIG[pipeline.doeClearanceType]?.label || pipeline.doeClearanceType}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {pipeline.sponsoringAgency || '—'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(pipeline.pipelineStatus)}`}>
                            {PIPELINE_STATUS_CONFIG[pipeline.pipelineStatus]?.label || pipeline.pipelineStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {pipeline.polygraphRequired ? (
                            pipeline.polygraphPassed ? (
                              <CheckCircle2 size={14} className="mx-auto text-emerald-400" />
                            ) : pipeline.polygraphCompletedAt ? (
                              <XCircle size={14} className="mx-auto text-red-400" />
                            ) : (
                              <Clock size={14} className="mx-auto text-amber-400" />
                            )
                          ) : (
                            <span className="text-slate-500 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {pipeline.clearanceExpiresAt ? (
                            <span className={
                              daysUntilExpiry !== null && daysUntilExpiry <= 30
                                ? 'text-red-400'
                                : daysUntilExpiry !== null && daysUntilExpiry <= 90
                                  ? 'text-amber-400'
                                  : 'text-slate-400'
                            }>
                              {formatDate(pipeline.clearanceExpiresAt)}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-400">
                          {formatDate(pipeline.updatedAt)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => setSelectedPipeline(pipeline)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
              <span className="text-sm text-slate-400">
                Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 20 >= total}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <PipelineCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            const result = await clearanceApi.create(data);
            if (result) {
              setShowCreateModal(false);
              fetchPipelines();
            }
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedPipeline && (
        <PipelineDetailModal
          pipeline={selectedPipeline}
          onClose={() => setSelectedPipeline(null)}
          onStatusUpdate={async (update) => {
            const result = await clearanceApi.updateStatus(selectedPipeline.id, update);
            if (result) {
              setSelectedPipeline(result);
              fetchPipelines();
            }
          }}
        />
      )}
    </div>
  );
}

// ===========================================
// Pipeline Create Modal
// ===========================================

function PipelineCreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: CreateClearancePipelineData) => void;
}) {
  const [formData, setFormData] = useState<CreateClearancePipelineData>({
    userId: '',
    clearanceType: 'secret',
    sponsoringAgency: '',
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
          <h3 className="text-xl font-bold">New Clearance Pipeline</h3>
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Clearance Type *</label>
            <select
              value={formData.clearanceType}
              onChange={(e) => setFormData({ ...formData, clearanceType: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="public-trust">Public Trust</option>
              <option value="secret">Secret</option>
              <option value="top-secret">Top Secret</option>
              <option value="top-secret-sci">TS/SCI</option>
              <option value="q-clearance">DOE Q Clearance</option>
              <option value="l-clearance">DOE L Clearance</option>
              <option value="q-clearance-sci">DOE Q/SCI</option>
            </select>
          </div>

          {(formData.clearanceType === 'q-clearance' || formData.clearanceType === 'l-clearance' || formData.clearanceType === 'q-clearance-sci') && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">DOE Clearance Designation</label>
              <select
                value={formData.doeClearanceType || ''}
                onChange={(e) => setFormData({ ...formData, doeClearanceType: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select...</option>
                {Object.entries(DOE_CLEARANCE_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Sponsoring Agency</label>
            <input
              type="text"
              value={formData.sponsoringAgency || ''}
              onChange={(e) => setFormData({ ...formData, sponsoringAgency: e.target.value })}
              placeholder="e.g., DOE, DoD, NSA, NRC"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Sponsoring Facility</label>
            <input
              type="text"
              value={formData.sponsoringFacility || ''}
              onChange={(e) => setFormData({ ...formData, sponsoringFacility: e.target.value })}
              placeholder="e.g., Los Alamos National Laboratory"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="polygraphReq"
                checked={formData.polygraphRequired || false}
                onChange={(e) => setFormData({ ...formData, polygraphRequired: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800"
              />
              <label htmlFor="polygraphReq" className="text-sm text-slate-300">Polygraph Required</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="drugTestReq"
                checked={formData.drugTestRequired || false}
                onChange={(e) => setFormData({ ...formData, drugTestRequired: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800"
              />
              <label htmlFor="drugTestReq" className="text-sm text-slate-300">Drug Test Required</label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onCreate(formData)}
            disabled={!formData.userId || !formData.clearanceType}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Create Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Pipeline Detail Modal with History
// ===========================================

function PipelineDetailModal({ pipeline, onClose, onStatusUpdate }: {
  pipeline: ClearancePipeline;
  onClose: () => void;
  onStatusUpdate: (update: UpdateClearanceStatusData) => void;
}) {
  const [history, setHistory] = useState<ClearanceStatusHistory[]>([]);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState<ClearancePipelineStatus>(pipeline.pipelineStatus);
  const [changeReason, setChangeReason] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [pipeline.id]);

  const fetchHistory = async () => {
    const data = await clearanceApi.getHistory(pipeline.id);
    setHistory(data);
  };

  const handleStatusUpdate = () => {
    onStatusUpdate({
      pipelineStatus: newStatus,
      changeReason,
    });
    setShowStatusUpdate(false);
    setChangeReason('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold capitalize">
              {pipeline.clearanceType.replace(/-/g, ' ')} Pipeline
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {pipeline.sponsoringAgency || 'Unknown Agency'} · {pipeline.sponsoringFacility || 'Unknown Facility'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <span className="text-xs text-slate-400 uppercase">Current Status</span>
              <p className="mt-1">
                <span className={`px-3 py-1.5 rounded text-sm font-medium ${getStatusColor(pipeline.pipelineStatus)}`}>
                  {PIPELINE_STATUS_CONFIG[pipeline.pipelineStatus]?.label}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
            >
              Update Status
            </button>
          </div>

          {/* Status Update Form */}
          {showStatusUpdate && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ClearancePipelineStatus)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                >
                  {Object.entries(PIPELINE_STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Reason for Change</label>
                <input
                  type="text"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Brief explanation..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === pipeline.pipelineStatus}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
              >
                Confirm Update
              </button>
            </div>
          )}

          {/* Key Dates */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pipeline.sf86PrepStartedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">SF-86 Prep Started</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.sf86PrepStartedAt)}</p>
              </div>
            )}
            {pipeline.sf86SubmittedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">SF-86 Submitted</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.sf86SubmittedAt)}</p>
              </div>
            )}
            {pipeline.investigationOpenedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Investigation Opened</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.investigationOpenedAt)}</p>
              </div>
            )}
            {pipeline.interimGrantedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Interim Granted</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.interimGrantedAt)}</p>
              </div>
            )}
            {pipeline.finalGrantedAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Final Granted</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.finalGrantedAt)}</p>
              </div>
            )}
            {pipeline.clearanceExpiresAt && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Expires</p>
                <p className="text-sm mt-0.5">{formatDate(pipeline.clearanceExpiresAt)}</p>
              </div>
            )}
          </div>

          {/* Polygraph & Drug Test */}
          {(pipeline.polygraphRequired || pipeline.drugTestRequired) && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Additional Requirements</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {pipeline.polygraphRequired && (
                  <div>
                    <span className="text-slate-400">Polygraph:</span>
                    <span className={`ml-2 ${pipeline.polygraphPassed ? 'text-emerald-400' : pipeline.polygraphCompletedAt ? 'text-red-400' : 'text-amber-400'}`}>
                      {pipeline.polygraphPassed ? 'Passed' : pipeline.polygraphCompletedAt ? 'Failed' : 'Pending'}
                    </span>
                    {pipeline.polygraphType && (
                      <span className="text-xs text-slate-500 ml-1">({pipeline.polygraphType})</span>
                    )}
                  </div>
                )}
                {pipeline.drugTestRequired && (
                  <div>
                    <span className="text-slate-400">Drug Test:</span>
                    <span className={`ml-2 ${pipeline.drugTestPassed ? 'text-emerald-400' : pipeline.drugTestCompletedAt ? 'text-red-400' : 'text-amber-400'}`}>
                      {pipeline.drugTestPassed ? 'Passed' : pipeline.drugTestCompletedAt ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status History */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Status History</h4>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500">No history records</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-2.5 bg-slate-800/30 rounded-lg">
                    <ChevronRight size={14} className="text-slate-500 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <div className="flex items-center gap-2">
                        {entry.previousStatus && (
                          <>
                            <span className="text-slate-400">
                              {PIPELINE_STATUS_CONFIG[entry.previousStatus]?.label || entry.previousStatus}
                            </span>
                            <span className="text-slate-600">→</span>
                          </>
                        )}
                        <span className="font-medium">
                          {PIPELINE_STATUS_CONFIG[entry.newStatus]?.label || entry.newStatus}
                        </span>
                      </div>
                      {entry.changeReason && (
                        <p className="text-xs text-slate-500 mt-0.5">{entry.changeReason}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-0.5">{formatDate(entry.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FSO Notes */}
          {pipeline.fsoNotes && (
            <div>
              <label className="text-xs text-slate-400 uppercase">FSO Notes</label>
              <p className="mt-1 text-sm bg-slate-800/50 p-3 rounded-lg">{pipeline.fsoNotes}</p>
            </div>
          )}
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
// Expiration Manager Sub-tab
// ===========================================

function ExpirationManager() {
  const [expiring, setExpiring] = useState<ClearancePipeline[]>([]);
  const [reinvestigation, setReinvestigation] = useState<ClearancePipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpirations();
  }, []);

  const fetchExpirations = async () => {
    setLoading(true);
    try {
      const [exp, reinv] = await Promise.all([
        clearanceApi.getExpiring(90),
        clearanceApi.getReinvestigationDue(90),
      ]);
      setExpiring(exp);
      setReinvestigation(reinv);
    } catch (err) {
      console.error('Error fetching expirations:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading expiration data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Expiration & Reinvestigation Manager</h3>
        <p className="text-sm text-slate-400 mt-1">
          10 CFR 710: Q-clearance reinvestigation every 5 years, L-clearance every 10 years
        </p>
      </div>

      {/* Expiring Clearances */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          Clearances Expiring (Next 90 Days)
          <span className="ml-auto text-sm text-slate-400">{expiring.length} total</span>
        </h4>
        {expiring.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm">No clearances expiring in the next 90 days</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiring.map((p) => {
              const days = getDaysUntil(p.clearanceExpiresAt);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium capitalize">{p.clearanceType.replace(/-/g, ' ')}</p>
                    <p className="text-xs text-slate-400">{p.sponsoringAgency} · {p.sponsoringFacility || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${days !== null && days <= 30 ? 'text-red-400' : 'text-amber-400'}`}>
                      {days} days
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(p.clearanceExpiresAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reinvestigation Due */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <RefreshCw size={16} className="text-orange-400" />
          Periodic Reinvestigation Due
          <span className="ml-auto text-sm text-slate-400">{reinvestigation.length} total</span>
        </h4>
        {reinvestigation.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm">No reinvestigations due in the next 90 days</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reinvestigation.map((p) => {
              const days = getDaysUntil(p.reinvestigationDueAt);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium capitalize">{p.clearanceType.replace(/-/g, ' ')}</p>
                    <p className="text-xs text-slate-400">
                      {p.sponsoringAgency}
                      {p.lastPeriodicReinvestigation && ` · Last: ${formatDate(p.lastPeriodicReinvestigation)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${days !== null && days <= 30 ? 'text-red-400' : 'text-orange-400'}`}>
                      {days !== null && days <= 0 ? 'OVERDUE' : `${days} days`}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(p.reinvestigationDueAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================
// Investigation Queue Sub-tab
// ===========================================

function InvestigationQueue() {
  const [pipelines, setPipelines] = useState<ClearancePipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const result = await clearanceApi.list({
        status: [
          'sf86-preparation',
          'sf86-submitted',
          'investigation-initiated',
          'investigation-fieldwork',
          'investigation-complete',
          'adjudication-pending',
        ],
      }, 1, 50);
      setPipelines(result.pipelines);
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading investigation queue...</span>
      </div>
    );
  }

  // Group by status for kanban-like view
  const stages = [
    { key: 'sf86-preparation', label: 'SF-86 Prep' },
    { key: 'sf86-submitted', label: 'SF-86 Submitted' },
    { key: 'investigation-initiated', label: 'Investigation' },
    { key: 'investigation-fieldwork', label: 'Fieldwork' },
    { key: 'investigation-complete', label: 'Inv. Complete' },
    { key: 'adjudication-pending', label: 'Adjudication' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Investigation Queue</h3>
        <p className="text-sm text-slate-400 mt-1">
          Cases currently in the investigation pipeline (SF-86 → Adjudication)
        </p>
      </div>

      {pipelines.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <FileCheck size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="text-slate-400">No cases currently in the investigation queue</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stagePipelines = pipelines.filter(p => p.pipelineStatus === stage.key);
            return (
              <div key={stage.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase">{stage.label}</h4>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">{stagePipelines.length}</span>
                </div>
                <div className="space-y-2">
                  {stagePipelines.map((p) => (
                    <div key={p.id} className="p-2.5 bg-slate-800/50 rounded-lg">
                      <p className="text-xs font-medium capitalize">{p.clearanceType.replace(/-/g, ' ')}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.sponsoringAgency || '—'}</p>
                      {p.doeClearanceType && (
                        <p className="text-xs text-blue-400 mt-0.5">
                          {DOE_CLEARANCE_CONFIG[p.doeClearanceType]?.label}
                        </p>
                      )}
                    </div>
                  ))}
                  {stagePipelines.length === 0 && (
                    <p className="text-xs text-slate-600 text-center py-4">Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===========================================
// Main ClearancePipelineTab Component
// ===========================================

export default function ClearancePipelineTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [stats, setStats] = useState<ClearanceDashboardStats>({
    totalPipelines: 0,
    totalActive: 0,
    pendingInvestigation: 0,
    interimGranted: 0,
    fullyGranted: 0,
    expiringNext30Days: 0,
    expiringNext90Days: 0,
    reinvestigationDue: 0,
    deniedLastQuarter: 0,
    averageProcessingDays: 0,
    byStatus: {},
    byType: {},
    byAgency: {},
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await clearanceApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching clearance stats:', err);
    }
    setStatsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={22} className="text-blue-400" />
            Clearance Pipeline Tracking
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            10 CFR 710 (DOE) · 32 CFR 117 (NISPOM) · Status tracking only — no SF-86 content
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
      {activeSubTab === 'overview' && <PipelineOverview stats={stats} loading={statsLoading} />}
      {activeSubTab === 'active' && <ActiveCases />}
      {activeSubTab === 'expiration' && <ExpirationManager />}
      {activeSubTab === 'queue' && <InvestigationQueue />}
    </div>
  );
}
