// ===========================================
// Lab Portal Page - Standalone for National Lab HR/FSOs
// Simplified views scoped to user's organization
// Role-gated: FSO, LAB_HR, CLEARANCE_OFFICER, FELLOWSHIP_COORDINATOR, EXPORT_CONTROL_OFFICER
// ===========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  GraduationCap,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  BarChart3,
  FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { clearanceApi } from '@/services/clearanceApi';
import { exportControlApi } from '@/services/exportControlApi';
import { fellowshipStatsApi } from '@/services/fellowshipApi';
import type { ClearanceDashboardStats } from '@/types/clearance';
import type { ExportControlDashboardStats } from '@/types/exportControl';
import type { FellowshipDashboardStats } from '@/types/fellowship';

// ===========================================
// Portal sections
// ===========================================

const portalSections = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'clearance', label: 'Clearance Tracking', icon: Lock },
  { id: 'export-control', label: 'Export Control', icon: Shield },
  { id: 'fellowship', label: 'Fellowship Programs', icon: GraduationCap },
];

// ===========================================
// Overview Section
// ===========================================

function OverviewSection({
  clearanceStats,
  exportStats,
  fellowshipStats,
  loading,
}: {
  clearanceStats: ClearanceDashboardStats | null;
  exportStats: ExportControlDashboardStats | null;
  fellowshipStats: FellowshipDashboardStats | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading portal data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clearance Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Lock size={18} className="text-blue-400" />
            </div>
            <h3 className="font-semibold">Clearance Pipeline</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Clearances</span>
              <span className="font-medium">{clearanceStats?.totalActive || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending Investigation</span>
              <span className="font-medium text-purple-400">{clearanceStats?.pendingInvestigation || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Expiring (30 days)</span>
              <span className="font-medium text-amber-400">{clearanceStats?.expiringNext30Days || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Reinvestigation Due</span>
              <span className="font-medium text-orange-400">{clearanceStats?.reinvestigationDue || 0}</span>
            </div>
          </div>
        </div>

        {/* Export Control Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Shield size={18} className="text-red-400" />
            </div>
            <h3 className="font-semibold">Export Control</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ITAR Positions</span>
              <span className="font-medium text-red-400">{exportStats?.itarControlled || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">EAR Positions</span>
              <span className="font-medium text-amber-400">{exportStats?.earControlled || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending Screenings</span>
              <span className="font-medium text-blue-400">{exportStats?.pendingScreenings || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">RPL Matches</span>
              <span className="font-medium text-red-400">{exportStats?.restrictedPartyMatches || 0}</span>
            </div>
          </div>
        </div>

        {/* Fellowship Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <GraduationCap size={18} className="text-purple-400" />
            </div>
            <h3 className="font-semibold">Fellowship Programs</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Programs</span>
              <span className="font-medium">{fellowshipStats?.activePrograms || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Fellows</span>
              <span className="font-medium text-emerald-400">{fellowshipStats?.activeFellows || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending Applications</span>
              <span className="font-medium text-blue-400">{fellowshipStats?.pendingApplications || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Conversion Rate</span>
              <span className="font-medium text-emerald-400">{fellowshipStats?.conversionRate.toFixed(0) || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          Action Items
        </h3>
        <div className="space-y-3">
          {(clearanceStats?.expiringNext30Days ?? 0) > 0 && (
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock size={16} className="text-amber-400" />
              <span className="text-sm">
                <strong>{clearanceStats!.expiringNext30Days}</strong> clearance(s) expiring within 30 days
              </span>
            </div>
          )}
          {(exportStats?.restrictedPartyMatches ?? 0) > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <XCircle size={16} className="text-red-400" />
              <span className="text-sm">
                <strong>{exportStats!.restrictedPartyMatches}</strong> restricted party list match(es) require review
              </span>
            </div>
          )}
          {(exportStats?.tcpExpiringNext30Days ?? 0) > 0 && (
            <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <FileText size={16} className="text-orange-400" />
              <span className="text-sm">
                <strong>{exportStats!.tcpExpiringNext30Days}</strong> Technology Control Plan(s) expiring soon
              </span>
            </div>
          )}
          {(clearanceStats?.reinvestigationDue ?? 0) > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <RefreshCw size={16} className="text-blue-400" />
              <span className="text-sm">
                <strong>{clearanceStats!.reinvestigationDue}</strong> periodic reinvestigation(s) due
              </span>
            </div>
          )}
          {(clearanceStats?.expiringNext30Days ?? 0) === 0 &&
           (exportStats?.restrictedPartyMatches ?? 0) === 0 &&
           (exportStats?.tcpExpiringNext30Days ?? 0) === 0 &&
           (clearanceStats?.reinvestigationDue ?? 0) === 0 && (
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm">No urgent action items</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Clearance Section (Read-heavy simplified view)
// ===========================================

function ClearanceSection({ stats }: { stats: ClearanceDashboardStats | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Clearance Pipeline Status</h3>
        <p className="text-sm text-slate-400 mt-1">Status tracking only — no SF-86 content or classified data stored</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats?.totalActive || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Active</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats?.pendingInvestigation || 0}</p>
          <p className="text-xs text-slate-400 mt-1">In Investigation</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats?.expiringNext90Days || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Expiring (90d)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{stats?.deniedLastQuarter || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Denied</p>
        </div>
      </div>

      {/* Status Distribution */}
      {stats && Object.keys(stats.byStatus).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">Pipeline Distribution</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats.byStatus).filter(([, count]) => count > 0).map(([status, count]) => (
              <div key={status} className="p-3 bg-slate-800/50 rounded-lg text-center">
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{status.replace(/-/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Type */}
      {stats && Object.keys(stats.byType).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">By Clearance Type</h4>
          <div className="space-y-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 capitalize">{type.replace(/-/g, ' ')}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-400">
          For detailed case management, status updates, and FSO assignments, access the full Admin Dashboard.
        </p>
      </div>
    </div>
  );
}

// ===========================================
// Export Control Section
// ===========================================

function ExportControlSection({ stats }: { stats: ExportControlDashboardStats | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Export Control Compliance</h3>
        <p className="text-sm text-slate-400 mt-1">ITAR (22 CFR 120-130) and EAR (15 CFR 730-774) status overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{stats?.totalAssessments || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Total Assessments</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{stats?.itarControlled || 0}</p>
          <p className="text-xs text-slate-400 mt-1">ITAR Controlled</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats?.earControlled || 0}</p>
          <p className="text-xs text-slate-400 mt-1">EAR Controlled</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats?.foreignNationalsScreened || 0}</p>
          <p className="text-xs text-slate-400 mt-1">FN Screened</p>
        </div>
      </div>

      {/* TCP Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="font-semibold mb-4">Technology Control Plans</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <p className="text-xl font-bold text-emerald-400">{stats?.tcpActive || 0}</p>
            <p className="text-xs text-slate-400 mt-0.5">Active</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <p className="text-xl font-bold text-amber-400">{stats?.tcpExpiringNext30Days || 0}</p>
            <p className="text-xs text-slate-400 mt-0.5">Expiring (30d)</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <p className="text-xl font-bold text-blue-400">{stats?.pendingAssessments || 0}</p>
            <p className="text-xs text-slate-400 mt-0.5">Pending Review</p>
          </div>
        </div>
      </div>

      {/* Restricted Party Alert */}
      {(stats?.restrictedPartyMatches ?? 0) > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <XCircle size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-400">Restricted Party List Matches</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats!.restrictedPartyMatches} match(es) require immediate compliance review
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// Fellowship Section
// ===========================================

function FellowshipSection({ stats }: { stats: FellowshipDashboardStats | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Fellowship Programs</h3>
        <p className="text-sm text-slate-400 mt-1">DOE Office of Science workforce development programs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats?.activePrograms || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Active Programs</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats?.activeFellows || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Active Fellows</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats?.totalApplications || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Applications</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats?.availableMentors || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Mentors Available</p>
        </div>
      </div>

      {/* Conversion & Completion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-3">Conversion to Hire</h4>
          <p className="text-3xl font-bold text-emerald-400">{stats?.conversionRate.toFixed(1) || '0'}%</p>
          <p className="text-sm text-slate-400 mt-1">Fellows converted to full-time positions</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-3">Average Application Score</h4>
          <p className="text-3xl font-bold text-blue-400">{stats?.averageScore.toFixed(1) || '0'}</p>
          <p className="text-sm text-slate-400 mt-1">Across all evaluated applications</p>
        </div>
      </div>

      {/* By Lab */}
      {stats && Object.keys(stats.byLab).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="font-semibold mb-4">Fellows by Lab</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats.byLab).map(([lab, count]) => (
              <div key={lab} className="p-3 bg-slate-800/50 rounded-lg text-center">
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
// Main LabPortalPage Component
// ===========================================

export default function LabPortalPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [clearanceStats, setClearanceStats] = useState<ClearanceDashboardStats | null>(null);
  const [exportStats, setExportStats] = useState<ExportControlDashboardStats | null>(null);
  const [fellowshipStats, setFellowshipStats] = useState<FellowshipDashboardStats | null>(null);

  useEffect(() => {
    fetchUser();
    fetchAllStats();
  }, []);

  const fetchUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      setUser(profile);
    }
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [clearance, exportControl, fellowship] = await Promise.all([
        clearanceApi.getStats(),
        exportControlApi.getStats(),
        fellowshipStatsApi.getDashboardStats(),
      ]);
      setClearanceStats(clearance);
      setExportStats(exportControl);
      setFellowshipStats(fellowship);
    } catch (err) {
      console.error('Error fetching portal stats:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Building2 size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Lab Portal</h1>
              <p className="text-xs text-slate-400">National Lab HR & Security</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-400">
                {user.first_name} {user.last_name}
              </span>
            )}
            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Full Admin
            </button>
            <button
              onClick={signOut}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Section Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {portalSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <section.icon size={16} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && (
          <OverviewSection
            clearanceStats={clearanceStats}
            exportStats={exportStats}
            fellowshipStats={fellowshipStats}
            loading={loading}
          />
        )}
        {activeSection === 'clearance' && <ClearanceSection stats={clearanceStats} />}
        {activeSection === 'export-control' && <ExportControlSection stats={exportStats} />}
        {activeSection === 'fellowship' && <FellowshipSection stats={fellowshipStats} />}
      </div>
    </div>
  );
}
