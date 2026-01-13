// ===========================================
// FEDERATION ADMIN TAB
// Manage federated sources and data pipelines
// ===========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Database, Plus, Search, RefreshCw, Play, Pause, Trash2, Edit2,
  ExternalLink, CheckCircle, XCircle, AlertCircle, Clock, Globe,
  Building2, GraduationCap, Trophy, Calendar, Settings, Eye,
  ChevronDown, X, Save, Activity, BarChart3, Users, Zap,
  Shield, Link, Server, Rss, FileText, BadgeCheck
} from 'lucide-react';
import {
  federationApi,
  federatedSourcesApi,
  federationAdminApi,
} from '@/services/federationApi';
import type {
  FederatedSource,
  FederatedListing,
  SyncJob,
  FederatedSourceType,
  IntegrationMethod,
} from '@/types/federation';

// Theme classes
const getThemeClasses = (isDark: boolean) => ({
  bgPrimary: isDark ? 'bg-slate-950' : 'bg-slate-50',
  bgSecondary: isDark ? 'bg-slate-900' : 'bg-white',
  bgTertiary: isDark ? 'bg-slate-800' : 'bg-slate-100',
  borderPrimary: isDark ? 'border-slate-800' : 'border-slate-200',
  textPrimary: isDark ? 'text-white' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-500',
  inputBg: isDark ? 'bg-slate-900' : 'bg-white',
  inputBorder: isDark ? 'border-slate-700' : 'border-slate-300',
  buttonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  buttonSecondary: isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900',
});

// Source type configuration
const SOURCE_TYPE_CONFIG: Record<FederatedSourceType, { label: string; icon: typeof Building2; color: string }> = {
  national_lab: { label: 'National Lab', icon: Building2, color: 'blue' },
  federal_agency: { label: 'Federal Agency', icon: Shield, color: 'emerald' },
  industry_partner: { label: 'Industry Partner', icon: Building2, color: 'violet' },
  university: { label: 'University', icon: GraduationCap, color: 'amber' },
  nonprofit: { label: 'Nonprofit', icon: Users, color: 'rose' },
  challenge_platform: { label: 'Challenge Platform', icon: Trophy, color: 'cyan' },
};

// Integration method icons
const INTEGRATION_ICONS: Record<IntegrationMethod, typeof Server> = {
  api: Server,
  rss: Rss,
  sitemap: FileText,
  ical: Calendar,
  manual: Edit2,
  partner_portal: Users,
};

type TabType = 'sources' | 'sync' | 'analytics' | 'settings';

const FederationTab = () => {
  const { isDark } = useTheme();
  const tc = getThemeClasses(isDark);

  // State
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const [sources, setSources] = useState<FederatedSource[]>([]);
  const [syncJobs, setSyncJobs] = useState<Record<string, SyncJob[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [editingSource, setEditingSource] = useState<FederatedSource | null>(null);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());

  // Stats
  const [stats, setStats] = useState({
    totalSources: 0,
    activeSources: 0,
    totalListings: 0,
    lastSyncTime: null as string | null,
  });

  useEffect(() => {
    fetchSources();
  }, [typeFilter, statusFilter]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const data = await federatedSourcesApi.list({
        type: typeFilter !== 'all' ? typeFilter as FederatedSourceType : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setSources(data);

      // Calculate stats
      const active = data.filter(s => s.status === 'active').length;
      const totalListings = data.reduce((sum, s) => sum + s.totalItemsSynced, 0);
      const lastSync = data
        .map(s => s.lastSyncAt)
        .filter(Boolean)
        .sort()
        .pop();

      setStats({
        totalSources: data.length,
        activeSources: active,
        totalListings,
        lastSyncTime: lastSync || null,
      });
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
    setLoading(false);
  };

  const fetchSyncJobs = async (sourceId: string) => {
    const jobs = await federationAdminApi.getSyncJobs(sourceId, 5);
    setSyncJobs(prev => ({ ...prev, [sourceId]: jobs }));
  };

  const handleTriggerSync = async (sourceId: string) => {
    setSyncing(prev => new Set(prev).add(sourceId));
    try {
      await federationAdminApi.triggerSync(sourceId);
      await fetchSyncJobs(sourceId);
    } catch (error) {
      console.error('Error triggering sync:', error);
    }
    setSyncing(prev => {
      const newSet = new Set(prev);
      newSet.delete(sourceId);
      return newSet;
    });
  };

  const handleSaveSource = async (formData: Partial<FederatedSource>) => {
    try {
      if (editingSource) {
        await federationAdminApi.updateSource(editingSource.id, formData);
      } else {
        await federationAdminApi.createSource(formData);
      }
      setShowSourceModal(false);
      setEditingSource(null);
      fetchSources();
    } catch (error) {
      console.error('Error saving source:', error);
      alert('Error saving source. Please try again.');
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm('Are you sure you want to delete this source? All synced listings will be removed.')) {
      return;
    }
    try {
      await federationAdminApi.deleteSource(sourceId);
      fetchSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const handleStatusChange = async (sourceId: string, newStatus: string) => {
    try {
      await federationAdminApi.updateSource(sourceId, { status: newStatus as FederatedSource['status'] });
      fetchSources();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tab navigation
  const tabs = [
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'sync', label: 'Sync Status', icon: RefreshCw },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className={`flex gap-2 p-1 ${tc.bgTertiary} rounded-lg w-fit`}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : `${tc.textSecondary} hover:${tc.textPrimary}`
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Sources"
          value={stats.totalSources}
          icon={Database}
          color="emerald"
          tc={tc}
        />
        <StatCard
          label="Active Sources"
          value={stats.activeSources}
          icon={CheckCircle}
          color="green"
          tc={tc}
        />
        <StatCard
          label="Total Listings"
          value={stats.totalListings.toLocaleString()}
          icon={FileText}
          color="blue"
          tc={tc}
        />
        <StatCard
          label="Last Sync"
          value={stats.lastSyncTime ? new Date(stats.lastSyncTime).toLocaleDateString() : 'Never'}
          icon={Clock}
          color="amber"
          tc={tc}
        />
      </div>

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${tc.textMuted}`} />
                <input
                  type="text"
                  placeholder="Search sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64`}
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              >
                <option value="all">All Types</option>
                {Object.entries(SOURCE_TYPE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingSource(null);
                setShowSourceModal(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 ${tc.buttonPrimary} rounded-lg transition-colors text-sm font-medium`}
            >
              <Plus size={18} />
              Add Source
            </button>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5 animate-pulse`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${tc.bgTertiary}`} />
                    <div className="flex-1">
                      <div className={`h-5 ${tc.bgTertiary} rounded w-1/2 mb-2`} />
                      <div className={`h-4 ${tc.bgTertiary} rounded w-1/3`} />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredSources.length === 0 ? (
              <div className={`col-span-2 ${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-12 text-center`}>
                <Database size={48} className={`mx-auto ${tc.textMuted} mb-4`} />
                <h3 className={`text-xl font-semibold ${tc.textPrimary} mb-2`}>No sources found</h3>
                <p className={tc.textSecondary}>Add your first data source to start aggregating opportunities</p>
              </div>
            ) : (
              filteredSources.map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  tc={tc}
                  onEdit={() => {
                    setEditingSource(source);
                    setShowSourceModal(true);
                  }}
                  onDelete={() => handleDeleteSource(source.id)}
                  onSync={() => handleTriggerSync(source.id)}
                  onStatusChange={(status) => handleStatusChange(source.id, status)}
                  isSyncing={syncing.has(source.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Sync Status Tab */}
      {activeTab === 'sync' && (
        <SyncStatusSection sources={sources} tc={tc} onRefresh={fetchSources} />
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <AnalyticsSection sources={sources} tc={tc} />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <FederationSettingsSection tc={tc} />
      )}

      {/* Source Modal */}
      <AnimatePresence>
        {showSourceModal && (
          <SourceFormModal
            source={editingSource}
            onSave={handleSaveSource}
            onClose={() => {
              setShowSourceModal(false);
              setEditingSource(null);
            }}
            tc={tc}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// STAT CARD
// ===========================================

const StatCard = ({ label, value, icon: Icon, color, tc }: {
  label: string;
  value: string | number;
  icon: typeof Database;
  color: string;
  tc: ReturnType<typeof getThemeClasses>;
}) => (
  <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-lg bg-${color}-500/20`}>
        <Icon size={22} className={`text-${color}-400`} />
      </div>
    </div>
    <div className="mt-4">
      <p className={`text-2xl font-bold ${tc.textPrimary}`}>{value}</p>
      <p className={`text-sm ${tc.textSecondary} mt-1`}>{label}</p>
    </div>
  </div>
);

// ===========================================
// SOURCE CARD
// ===========================================

const SourceCard = ({
  source,
  tc,
  onEdit,
  onDelete,
  onSync,
  onStatusChange,
  isSyncing,
}: {
  source: FederatedSource;
  tc: ReturnType<typeof getThemeClasses>;
  onEdit: () => void;
  onDelete: () => void;
  onSync: () => void;
  onStatusChange: (status: string) => void;
  isSyncing: boolean;
}) => {
  const typeConfig = SOURCE_TYPE_CONFIG[source.type];
  const TypeIcon = typeConfig?.icon || Building2;
  const IntegrationIcon = INTEGRATION_ICONS[source.integrationMethod] || Server;

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    paused: 'bg-blue-500/20 text-blue-400',
    inactive: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5 hover:border-slate-700 transition-colors`}>
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className={`w-12 h-12 rounded-xl bg-${typeConfig?.color || 'slate'}-500/20 flex items-center justify-center flex-shrink-0`}>
          {source.logoUrl ? (
            <img src={source.logoUrl} alt={source.name} className="w-8 h-8 object-contain" />
          ) : (
            <TypeIcon size={24} className={`text-${typeConfig?.color || 'slate'}-400`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-bold ${tc.textPrimary} flex items-center gap-2`}>
                {source.name}
                {source.isOfficialPartner && (
                  <BadgeCheck size={16} className="text-blue-400" />
                )}
              </h3>
              <p className={`text-sm ${tc.textSecondary}`}>{source.shortName}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[source.status]}`}>
              {source.status}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-xs bg-${typeConfig?.color || 'slate'}-500/10 text-${typeConfig?.color || 'slate'}-400`}>
              {typeConfig?.label || source.type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${tc.bgTertiary} ${tc.textMuted} flex items-center gap-1`}>
              <IntegrationIcon size={12} />
              {source.integrationMethod.toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${tc.bgTertiary} ${tc.textMuted}`}>
              {source.syncFrequency}
            </span>
          </div>
        </div>
      </div>

      {/* Content Types */}
      <div className="flex flex-wrap gap-2 mt-4">
        {source.providesJobs && (
          <span className={`text-xs px-2 py-1 ${tc.bgTertiary} rounded ${tc.textSecondary}`}>Jobs</span>
        )}
        {source.providesInternships && (
          <span className={`text-xs px-2 py-1 ${tc.bgTertiary} rounded ${tc.textSecondary}`}>Internships</span>
        )}
        {source.providesChallenges && (
          <span className={`text-xs px-2 py-1 ${tc.bgTertiary} rounded ${tc.textSecondary}`}>Challenges</span>
        )}
        {source.providesEvents && (
          <span className={`text-xs px-2 py-1 ${tc.bgTertiary} rounded ${tc.textSecondary}`}>Events</span>
        )}
        {source.providesScholarships && (
          <span className={`text-xs px-2 py-1 ${tc.bgTertiary} rounded ${tc.textSecondary}`}>Scholarships</span>
        )}
      </div>

      {/* Stats Row */}
      <div className={`flex items-center gap-4 mt-4 pt-4 border-t ${tc.borderPrimary} text-sm`}>
        <div>
          <span className={tc.textMuted}>Items: </span>
          <span className={tc.textPrimary}>{source.totalItemsSynced.toLocaleString()}</span>
        </div>
        <div>
          <span className={tc.textMuted}>Last Sync: </span>
          <span className={tc.textPrimary}>
            {source.lastSuccessfulSyncAt
              ? new Date(source.lastSuccessfulSyncAt).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
        {source.syncErrorCount > 0 && (
          <span className="text-red-400 text-xs">
            {source.syncErrorCount} errors
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={`flex items-center justify-between mt-4 pt-4 border-t ${tc.borderPrimary}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={onSync}
            disabled={isSyncing || source.status !== 'active'}
            className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors disabled:opacity-50`}
            title="Trigger Sync"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onEdit}
            className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}
            title="Edit Source"
          >
            <Edit2 size={16} />
          </button>
          <a
            href={source.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}
            title="Visit Website"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={source.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`px-3 py-1.5 ${tc.inputBg} border ${tc.inputBorder} rounded text-sm focus:outline-none focus:border-emerald-500`}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete Source"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// SYNC STATUS SECTION
// ===========================================

const SyncStatusSection = ({
  sources,
  tc,
  onRefresh,
}: {
  sources: FederatedSource[];
  tc: ReturnType<typeof getThemeClasses>;
  onRefresh: () => void;
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className={`text-lg font-semibold ${tc.textPrimary}`}>Sync Status</h3>
        <p className={`text-sm ${tc.textSecondary}`}>Monitor synchronization across all sources</p>
      </div>
      <button
        onClick={onRefresh}
        className={`flex items-center gap-2 px-4 py-2 ${tc.buttonSecondary} rounded-lg transition-colors`}
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>

    <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl overflow-hidden`}>
      <table className="w-full">
        <thead className={tc.bgTertiary}>
          <tr>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Source</th>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Status</th>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Last Sync</th>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Items</th>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Errors</th>
            <th className={`px-4 py-3 text-left text-xs font-medium ${tc.textSecondary} uppercase`}>Next Sync</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${tc.borderPrimary}`}>
          {sources.map(source => (
            <tr key={source.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${SOURCE_TYPE_CONFIG[source.type]?.color || 'slate'}-500/20 flex items-center justify-center`}>
                    {(() => {
                      const Icon = SOURCE_TYPE_CONFIG[source.type]?.icon || Building2;
                      return <Icon size={16} className={`text-${SOURCE_TYPE_CONFIG[source.type]?.color || 'slate'}-400`} />;
                    })()}
                  </div>
                  <div>
                    <p className={`font-medium ${tc.textPrimary}`}>{source.shortName}</p>
                    <p className={`text-xs ${tc.textMuted}`}>{source.integrationMethod}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className={`flex items-center gap-1 text-sm ${
                  source.status === 'active' ? 'text-emerald-400' :
                  source.status === 'paused' ? 'text-blue-400' :
                  source.status === 'pending' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {source.status === 'active' ? <CheckCircle size={14} /> :
                   source.status === 'paused' ? <Pause size={14} /> :
                   source.status === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                  {source.status}
                </span>
              </td>
              <td className={`px-4 py-4 text-sm ${tc.textSecondary}`}>
                {source.lastSuccessfulSyncAt
                  ? new Date(source.lastSuccessfulSyncAt).toLocaleString()
                  : '-'}
              </td>
              <td className={`px-4 py-4 text-sm ${tc.textPrimary} font-medium`}>
                {source.totalItemsSynced.toLocaleString()}
              </td>
              <td className="px-4 py-4">
                {source.syncErrorCount > 0 ? (
                  <span className="text-red-400 text-sm">{source.syncErrorCount}</span>
                ) : (
                  <span className="text-emerald-400 text-sm">0</span>
                )}
              </td>
              <td className={`px-4 py-4 text-sm ${tc.textMuted}`}>
                {source.syncFrequency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ===========================================
// ANALYTICS SECTION
// ===========================================

const AnalyticsSection = ({
  sources,
  tc,
}: {
  sources: FederatedSource[];
  tc: ReturnType<typeof getThemeClasses>;
}) => {
  // Aggregate stats
  const totalItems = sources.reduce((sum, s) => sum + s.totalItemsSynced, 0);
  const byType = sources.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + s.totalItemsSynced;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${tc.textPrimary}`}>Federation Analytics</h3>
        <p className={`text-sm ${tc.textSecondary}`}>Overview of aggregated data across all sources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items by Source Type */}
        <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
          <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Items by Source Type</h4>
          <div className="space-y-4">
            {Object.entries(byType).map(([type, count]) => {
              const config = SOURCE_TYPE_CONFIG[type as FederatedSourceType];
              const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className={tc.textSecondary}>{config?.label || type}</span>
                    <span className={tc.textPrimary}>{count.toLocaleString()}</span>
                  </div>
                  <div className={`h-2 ${tc.bgTertiary} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full bg-${config?.color || 'slate'}-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Sources */}
        <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
          <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Top Sources by Volume</h4>
          <div className="space-y-3">
            {[...sources]
              .sort((a, b) => b.totalItemsSynced - a.totalItemsSynced)
              .slice(0, 5)
              .map((source, index) => (
                <div key={source.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full ${tc.bgTertiary} flex items-center justify-center text-xs ${tc.textMuted}`}>
                    {index + 1}
                  </span>
                  <span className={`flex-1 ${tc.textPrimary}`}>{source.shortName}</span>
                  <span className={tc.textSecondary}>{source.totalItemsSynced.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// SETTINGS SECTION
// ===========================================

const FederationSettingsSection = ({ tc }: { tc: ReturnType<typeof getThemeClasses> }) => (
  <div className="space-y-6">
    <div>
      <h3 className={`text-lg font-semibold ${tc.textPrimary}`}>Federation Settings</h3>
      <p className={`text-sm ${tc.textSecondary}`}>Configure global settings for data aggregation</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sync Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Sync Settings</h4>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Default Sync Frequency
            </label>
            <select className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}>
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Max Items per Source
            </label>
            <input
              type="number"
              defaultValue={1000}
              className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
            />
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Auto-retry failed syncs</span>
          </label>
        </div>
      </div>

      {/* Quality Settings */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h4 className={`font-semibold ${tc.textPrimary} mb-4`}>Quality Settings</h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Enable automatic quality scoring</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Require moderation for manual posts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
            <span className={`text-sm ${tc.textPrimary}`}>Auto-remove expired listings</span>
          </label>
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Minimum Quality Score to Display
            </label>
            <input
              type="number"
              defaultValue={50}
              min={0}
              max={100}
              className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg text-sm focus:outline-none focus:border-emerald-500`}
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <button className={`flex items-center gap-2 px-6 py-2.5 ${tc.buttonPrimary} rounded-lg transition-colors text-sm font-medium`}>
        <Save size={18} />
        Save Settings
      </button>
    </div>
  </div>
);

// ===========================================
// SOURCE FORM MODAL
// ===========================================

const SourceFormModal = ({
  source,
  onSave,
  onClose,
  tc,
}: {
  source: FederatedSource | null;
  onSave: (data: Partial<FederatedSource>) => void;
  onClose: () => void;
  tc: ReturnType<typeof getThemeClasses>;
}) => {
  const [formData, setFormData] = useState<Partial<FederatedSource>>({
    name: source?.name || '',
    shortName: source?.shortName || '',
    type: source?.type || 'federal_agency',
    description: source?.description || '',
    website: source?.website || '',
    logoUrl: source?.logoUrl || '',
    contactEmail: source?.contactEmail || '',
    integrationMethod: source?.integrationMethod || 'rss',
    syncFrequency: source?.syncFrequency || 'daily',
    providesJobs: source?.providesJobs ?? true,
    providesInternships: source?.providesInternships ?? false,
    providesChallenges: source?.providesChallenges ?? false,
    providesEvents: source?.providesEvents ?? false,
    providesScholarships: source?.providesScholarships ?? false,
    industries: source?.industries || [],
    status: source?.status || 'pending',
    partnershipTier: source?.partnershipTier || 'basic',
    isOfficialPartner: source?.isOfficialPartner ?? false,
    attributionRequired: source?.attributionRequired ?? true,
    attributionText: source?.attributionText || '',
  });

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.website) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-2xl max-h-[90vh] ${tc.bgSecondary} rounded-2xl shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${tc.borderPrimary} flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>
            {source ? 'Edit Source' : 'Add New Source'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${tc.buttonSecondary}`}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Source Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Oak Ridge National Laboratory"
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Short Name *
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => updateField('shortName', e.target.value)}
                placeholder="e.g., ORNL"
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Source Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              >
                {Object.entries(SOURCE_TYPE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Integration Method *
              </label>
              <select
                value={formData.integrationMethod}
                onChange={(e) => updateField('integrationMethod', e.target.value)}
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              >
                <option value="api">API</option>
                <option value="rss">RSS Feed</option>
                <option value="manual">Manual Entry</option>
                <option value="partner_portal">Partner Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Website URL *
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://example.com"
              className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
            />
          </div>

          {/* Content Types */}
          <div>
            <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
              Content Types Provided
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'providesJobs', label: 'Jobs' },
                { key: 'providesInternships', label: 'Internships' },
                { key: 'providesChallenges', label: 'Challenges' },
                { key: 'providesEvents', label: 'Events' },
                { key: 'providesScholarships', label: 'Scholarships' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[item.key as keyof typeof formData] as boolean}
                    onChange={(e) => updateField(item.key, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className={`text-sm ${tc.textPrimary}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sync Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Sync Frequency
              </label>
              <select
                value={formData.syncFrequency}
                onChange={(e) => updateField('syncFrequency', e.target.value)}
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Attribution */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.attributionRequired}
                onChange={(e) => updateField('attributionRequired', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span className={`text-sm font-medium ${tc.textPrimary}`}>Attribution Required</span>
            </label>
            {formData.attributionRequired && (
              <input
                type="text"
                value={formData.attributionText}
                onChange={(e) => updateField('attributionText', e.target.value)}
                placeholder="e.g., Data provided by Source Name"
                className={`w-full px-4 py-2.5 ${tc.inputBg} border ${tc.inputBorder} rounded-lg focus:outline-none focus:border-emerald-500`}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${tc.borderPrimary} flex justify-end gap-3`}>
          <button onClick={onClose} className={`px-4 py-2 ${tc.buttonSecondary} rounded-lg transition-colors`}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 ${tc.buttonPrimary} rounded-lg transition-colors flex items-center gap-2`}
          >
            <Save size={18} />
            {source ? 'Update Source' : 'Add Source'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FederationTab;
