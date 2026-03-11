/**
 * FSO (Facility Security Officer) Portal Tab
 *
 * Comprehensive dashboard for managing cleared personnel, visit requests,
 * reportable incidents, continuous vetting alerts, and audit logs.
 *
 * REGULATORY REFERENCES:
 * - 32 CFR Part 117 (NISPOM) — National Industrial Security Program Operating Manual
 * - SEAD-3 — Reporting Requirements for Personnel with Access to Classified Information
 * - SEAD-4 — National Security Adjudicative Guidelines
 * - Trusted Workforce 2.0 (ODNI/DCSA) — Continuous Vetting framework
 *
 * SECURITY:
 * - All data scoped to organization via API
 * - No classified information displayed
 * - PII minimized (names + clearance status only)
 * - Immutable audit trail on every action
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShieldCheck, ShieldAlert, Users, UserPlus, Calendar, Clock,
  AlertTriangle, Bell, FileText, MapPin, Plane, Eye, Plus, Search,
  Download, ChevronDown, ChevronRight, X, CheckCircle, XCircle,
  AlertOctagon, BarChart3, Activity, Lock, RefreshCw,
} from 'lucide-react';
import type {
  ClearedEmployee, VisitRequest, ReportableIncident, CVAlert,
  FSODashboardStats, ClearedEmployeeStatus,
} from '../../../../types/clearanceReadiness';
import {
  CLEARANCE_TARGET_LEVELS, INCIDENT_TYPES, CV_ALERT_TYPES,
} from '../../../../types/clearanceReadiness';
import clearanceReadinessApi from '../../../../services/clearanceReadinessApi';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type SubTab = 'overview' | 'roster' | 'visits' | 'incidents' | 'cv-alerts' | 'audit-log';

interface AuditLogEntry {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  changeDescription: string;
  userId: string;
  createdAt: string;
}

const SUB_TABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'roster', label: 'Roster', icon: Users },
  { id: 'visits', label: 'Visit Requests', icon: Plane },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'cv-alerts', label: 'CV Alerts', icon: Bell },
  { id: 'audit-log', label: 'Audit Log', icon: FileText },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  interim: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'pending-investigation': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'pending-adjudication': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
  revoked: 'bg-red-600/20 text-red-500 border-red-600/30',
  expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  debriefed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'in-reinvestigation': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  serious: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  informational: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const VISIT_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  submitted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'under-review': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  denied: 'bg-red-500/20 text-red-400 border-red-500/30',
  expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const CV_STATUS_COLORS: Record<string, string> = {
  new: 'bg-red-500/20 text-red-400 border-red-500/30',
  acknowledged: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'under-review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'response-submitted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  escalated: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const INCIDENT_STATUS_LABELS: Record<string, string> = {
  reported: 'Reported',
  'under-investigation': 'Under Investigation',
  'pending-adjudication': 'Pending Adjudication',
  'resolved-no-action': 'Resolved - No Action',
  'resolved-warning': 'Resolved - Warning',
  'resolved-suspension': 'Resolved - Suspension',
  'resolved-revocation': 'Resolved - Revocation',
  closed: 'Closed',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return '--';
  }
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '--';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '--';
  }
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getClearanceBadgeColor(level: string): string {
  const config = CLEARANCE_TARGET_LEVELS[level as keyof typeof CLEARANCE_TARGET_LEVELS];
  return config?.color || '#6B7280';
}

function getClearanceLabel(level: string): string {
  const config = CLEARANCE_TARGET_LEVELS[level as keyof typeof CLEARANCE_TARGET_LEVELS];
  return config?.abbreviation || level;
}

function getClearanceFullLabel(level: string): string {
  const config = CLEARANCE_TARGET_LEVELS[level as keyof typeof CLEARANCE_TARGET_LEVELS];
  return config?.label || level;
}

function statusLabel(status: string): string {
  return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Sanitize a CSV cell value to prevent CSV injection.
 * Prefixes cells starting with dangerous characters with a single quote.
 */
function sanitizeCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}

function KPICard({
  icon: Icon, label, value, subValue, color, delay = 0,
}: {
  icon: React.ElementType; label: string; value: number | string; subValue?: string;
  color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </motion.div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Icon className="w-12 h-12 mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function Modal({
  title, children, onClose, wide = false,
}: {
  title: string; children: React.ReactNode; onClose: () => void; wide?: boolean;
}) {
  // Fix #1: ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    // Fix #10: role="dialog" and aria-modal="true"
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      {/* Fix #4: backdrop stopPropagation */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-lg'} w-full max-h-[85vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {/* Fix #10: aria-label on close button, Fix #11: p-2.5 touch target */}
          <button onClick={onClose} className="p-2.5 hover:bg-gray-800 rounded-lg transition-colors" aria-label="Close dialog">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}

function SearchInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      {/* Fix #10: aria-label on search input */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}

function SelectFilter({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={placeholder}
        className="appearance-none w-full pl-3 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
}

function FormField({
  label, required, children, error,
}: {
  label: string; required?: boolean; children: React.ReactNode; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = 'text',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
    />
  );
}

function TextAreaInput({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
    />
  );
}

// ============================================================================
// OVERVIEW SUB-TAB
// ============================================================================

function OverviewSubTab({ stats, employees }: { stats: FSODashboardStats | null; employees: ClearedEmployee[] }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  const complianceIssues = stats.briefingsOverdue + stats.incidentsOpen + stats.foreignTravelUnreported;
  const complianceScore = stats.totalCleared > 0
    ? Math.round(((stats.totalCleared - complianceIssues) / stats.totalCleared) * 100)
    : 100;
  const complianceColor = complianceScore >= 90 ? 'text-emerald-400' : complianceScore >= 70 ? 'text-amber-400' : 'text-red-400';

  // Reinvestigation timeline
  const reinvestigationEntries = employees
    .filter(e => e.reinvestigationDueDate && e.clearanceStatus !== 'debriefed' && e.clearanceStatus !== 'revoked')
    .map(e => ({ name: `${e.firstName} ${e.lastName}`, level: e.clearanceLevel, dueDate: e.reinvestigationDueDate, daysLeft: daysUntil(e.reinvestigationDueDate) }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard icon={ShieldCheck} label="Total Cleared" value={stats.totalCleared} color="bg-emerald-500/20 text-emerald-400" delay={0} />
        <KPICard icon={Shield} label="Active" value={stats.activeCleared} color="bg-blue-500/20 text-blue-400" delay={0.05} />
        <KPICard icon={Clock} label="Interim" value={stats.interimCleared} color="bg-cyan-500/20 text-cyan-400" delay={0.1} />
        <KPICard icon={Activity} label="Pending" value={stats.pendingInvestigation + stats.pendingAdjudication} subValue={`${stats.pendingInvestigation} inv. / ${stats.pendingAdjudication} adj.`} color="bg-amber-500/20 text-amber-400" delay={0.15} />
        <KPICard icon={AlertTriangle} label="Expiring (90d)" value={stats.expiring90Days} color="bg-orange-500/20 text-orange-400" delay={0.2} />
        <KPICard icon={Bell} label="CV Alerts" value={stats.cvActiveAlerts} subValue={`${stats.cvPendingReview} pending review`} color="bg-red-500/20 text-red-400" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clearance Level Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Clearance Distribution
          </h3>
          <div className="space-y-3">
            {stats.byLevel.map(item => {
              const color = getClearanceBadgeColor(item.level);
              return (
                <div key={item.level}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{getClearanceFullLabel(item.level)}</span>
                    <span className="text-xs text-gray-400">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Health Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Compliance Health
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2937" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={complianceScore >= 90 ? '#10B981' : complianceScore >= 70 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${complianceScore * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${complianceColor}`}>{complianceScore}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Briefings Overdue</span>
              <span className={stats.briefingsOverdue > 0 ? 'text-red-400 font-medium' : 'text-emerald-400'}>{stats.briefingsOverdue}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Open Incidents</span>
              <span className={stats.incidentsOpen > 0 ? 'text-amber-400 font-medium' : 'text-emerald-400'}>{stats.incidentsOpen}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Travel Unreported</span>
              <span className={stats.foreignTravelUnreported > 0 ? 'text-red-400 font-medium' : 'text-emerald-400'}>{stats.foreignTravelUnreported}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Visits Scheduled</span>
              <span className="text-blue-400">{stats.visitsScheduled}</span>
            </div>
          </div>
        </div>

        {/* Reinvestigation Timeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Reinvestigation Timeline
          </h3>
          {reinvestigationEntries.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No upcoming reinvestigations</p>
          ) : (
            <div className="space-y-3">
              {reinvestigationEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getClearanceBadgeColor(entry.level) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{entry.name}</div>
                    <div className="text-xs text-gray-500">{getClearanceLabel(entry.level)} &middot; {formatDate(entry.dueDate)}</div>
                  </div>
                  <Badge className={
                    entry.daysLeft <= 90 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    entry.daysLeft <= 180 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-gray-700/50 text-gray-400 border-gray-600/30'
                  }>
                    {entry.daysLeft <= 0 ? 'Overdue' : `${entry.daysLeft}d`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Avg. Time to Interim</span>
              <span className="text-white font-medium">{stats.avgTimeToInterim} days</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Avg. Time to Final</span>
              <span className="text-white font-medium">{stats.avgTimeToFinal} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* NISPOM Quick Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-400" />
          NISPOM Quick Reference (32 CFR Part 117)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="font-medium text-amber-400 mb-1">Reporting Requirements</div>
            <ul className="text-gray-400 space-y-1">
              <li>&bull; Adverse information: Report immediately</li>
              <li>&bull; Foreign travel: Pre-travel notification required</li>
              <li>&bull; Foreign contacts: Report within 10 business days</li>
              <li>&bull; Arrests/charges: Report within 72 hours</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="font-medium text-blue-400 mb-1">Reinvestigation Cycles</div>
            <ul className="text-gray-400 space-y-1">
              <li>&bull; Secret: Every 10 years (Tier 3)</li>
              <li>&bull; Top Secret: Every 6 years (Tier 5)</li>
              <li>&bull; TS/SCI: Every 5 years (Tier 5)</li>
              <li>&bull; DOE Q: Every 5 years</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="font-medium text-purple-400 mb-1">Trusted Workforce 2.0</div>
            <ul className="text-gray-400 space-y-1">
              <li>&bull; Continuous Vetting replaces periodic reinvestigation</li>
              <li>&bull; Automated record checks (criminal, financial, travel)</li>
              <li>&bull; FSO must acknowledge alerts within response timeframe</li>
              <li>&bull; DCSA manages enrollment via DISS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROSTER SUB-TAB
// ============================================================================

function RosterSubTab({ employees, onRefresh }: { employees: ClearedEmployee[]; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [cvFilter, setCvFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = useMemo(() =>
    [...new Set(employees.map(e => e.department))].sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    let result = [...employees];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q)
      );
    }
    if (levelFilter) result = result.filter(e => e.clearanceLevel === levelFilter);
    if (statusFilter) result = result.filter(e => e.clearanceStatus === statusFilter);
    if (deptFilter) result = result.filter(e => e.department === deptFilter);
    if (cvFilter) result = result.filter(e => e.continuousVettingStatus === cvFilter);
    return result;
  }, [employees, search, levelFilter, statusFilter, deptFilter, cvFilter]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID, email, or title..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          <SelectFilter
            value={levelFilter} onChange={setLevelFilter}
            placeholder="Clearance Level"
            options={Object.entries(CLEARANCE_TARGET_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <SelectFilter
            value={statusFilter} onChange={setStatusFilter}
            placeholder="Status"
            options={[
              { value: 'active', label: 'Active' }, { value: 'interim', label: 'Interim' },
              { value: 'pending-investigation', label: 'Pending Investigation' },
              { value: 'pending-adjudication', label: 'Pending Adjudication' },
              { value: 'in-reinvestigation', label: 'In Reinvestigation' },
              { value: 'suspended', label: 'Suspended' }, { value: 'revoked', label: 'Revoked' },
            ]}
          />
          <SelectFilter
            value={deptFilter} onChange={setDeptFilter}
            placeholder="Department"
            options={departments.map(d => ({ value: d, label: d }))}
          />
          <SelectFilter
            value={cvFilter} onChange={setCvFilter}
            placeholder="CV Status"
            options={[
              { value: 'enrolled-active', label: 'Enrolled - Active' },
              { value: 'enrolled-alert', label: 'Enrolled - Alert' },
              { value: 'not-enrolled', label: 'Not Enrolled' },
            ]}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            aria-label="Add cleared employee"
          >
            <UserPlus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">{filtered.length} of {employees.length} employees</div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Clearance</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Expiration</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">CV</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                    No employees match current filters
                  </td>
                </tr>
              ) : (
                filtered.map(emp => {
                  const isExpanded = expandedId === emp.id;
                  const daysLeft = emp.clearanceExpirationDate ? daysUntil(emp.clearanceExpirationDate) : null;
                  const expirationWarning = daysLeft !== null && daysLeft > 0 && daysLeft <= 180;

                  return (
                    <React.Fragment key={emp.id}>
                      <tr
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-white">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-gray-500">{emp.jobTitle} &middot; {emp.department}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 font-mono">{emp.employeeId}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white"
                            style={{ backgroundColor: getClearanceBadgeColor(emp.clearanceLevel) }}
                          >
                            {getClearanceLabel(emp.clearanceLevel)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={STATUS_COLORS[emp.clearanceStatus] || STATUS_COLORS.active}>
                            {statusLabel(emp.clearanceStatus)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-300">{formatDate(emp.clearanceExpirationDate)}</div>
                          {expirationWarning && (
                            <div className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> {daysLeft}d remaining
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {emp.continuousVettingEnrolled ? (
                            emp.continuousVettingStatus === 'enrolled-alert' ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <AlertOctagon className="w-3 h-3 mr-1" /> Alert
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                              </Badge>
                            )
                          ) : (
                            <Badge className="bg-gray-700/50 text-gray-500 border-gray-600/30">Not Enrolled</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {/* Fix #11: p-2.5 touch target */}
                          <button className="p-2.5" aria-label={isExpanded ? 'Collapse employee details' : 'Expand employee details'}>
                            <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-800/20">
                          <td colSpan={7} className="px-4 py-4">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                            >
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Investigating Agency</span>
                                <span className="text-gray-300 uppercase">{emp.investigatingAgency}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Investigation Type</span>
                                <span className="text-gray-300 uppercase">{emp.investigationType}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Access Level</span>
                                <span className="text-gray-300">{statusLabel(emp.accessLevel)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Polygraph</span>
                                <span className="text-gray-300">
                                  {emp.polygraphType ? `${statusLabel(emp.polygraphType)} (${formatDate(emp.polygraphDate)})` : 'None'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Hire Date</span>
                                <span className="text-gray-300">{formatDate(emp.hireDate)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Clearance Granted</span>
                                <span className="text-gray-300">{formatDate(emp.clearanceGrantedDate)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Reinvestigation Due</span>
                                <span className="text-gray-300">{formatDate(emp.reinvestigationDueDate)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">NDA Signed</span>
                                <span className="text-gray-300">{formatDate(emp.ndaSignedDate)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Last Briefing</span>
                                <span className={`${emp.briefingsCurrent ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {formatDate(emp.lastBriefingDate)} {!emp.briefingsCurrent && '(Overdue)'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Foreign Travel</span>
                                <span className={`${emp.foreignTravelReported ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {emp.foreignTravelReported ? 'Reported' : 'Unreported'}
                                  {emp.lastForeignTravelReport && ` (${formatDate(emp.lastForeignTravelReport)})`}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Program Access</span>
                                <span className="text-gray-300">{emp.programAccess.length > 0 ? emp.programAccess.join(', ') : 'None'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">Facility Access</span>
                                <span className="text-gray-300 font-mono text-xs">{emp.facilityAccess.length > 0 ? emp.facilityAccess.join(', ') : 'None'}</span>
                              </div>
                              {emp.notes && (
                                <div className="col-span-2 md:col-span-4">
                                  <span className="text-gray-500 text-xs block mb-1">Notes</span>
                                  <span className="text-gray-400 text-xs">{emp.notes}</span>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            await clearanceReadinessApi.createEmployee(data);
            setShowAddModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// FRAGMENT — REQUIRED IMPORT
// ============================================================================
import React from 'react';

// ============================================================================
// ADD EMPLOYEE MODAL
// ============================================================================

function AddEmployeeModal({
  onClose, onSave,
}: {
  onClose: () => void;
  onSave: (data: Partial<ClearedEmployee>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', employeeId: '', email: '',
    department: '', jobTitle: '', hireDate: '',
    clearanceLevel: '' as ClearedEmployee['clearanceLevel'],
    clearanceStatus: 'pending-investigation' as ClearedEmployeeStatus,
    investigatingAgency: 'dcsa' as ClearedEmployee['investigatingAgency'],
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  // Fix #5: track whether user has attempted to save for inline error display
  const [attempted, setAttempted] = useState(false);

  const handleSave = async () => {
    setAttempted(true);
    // Fix #7: clearanceLevel is now required
    if (!form.firstName || !form.lastName || !form.employeeId || !form.clearanceLevel) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Modal title="Add Cleared Employee" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        {/* Fix #5: inline error messages after first save attempt */}
        <FormField label="First Name" required error={attempted && !form.firstName ? 'First name is required' : undefined}>
          <TextInput value={form.firstName} onChange={v => update('firstName', v)} placeholder="First name" />
        </FormField>
        <FormField label="Last Name" required error={attempted && !form.lastName ? 'Last name is required' : undefined}>
          <TextInput value={form.lastName} onChange={v => update('lastName', v)} placeholder="Last name" />
        </FormField>
        <FormField label="Employee ID" required error={attempted && !form.employeeId ? 'Employee ID is required' : undefined}>
          <TextInput value={form.employeeId} onChange={v => update('employeeId', v)} placeholder="EMP-XXXX-XXX" />
        </FormField>
        <FormField label="Email">
          <TextInput value={form.email} onChange={v => update('email', v)} type="email" placeholder="employee@company.com" />
        </FormField>
        <FormField label="Department">
          <TextInput value={form.department} onChange={v => update('department', v)} placeholder="Department" />
        </FormField>
        <FormField label="Job Title">
          <TextInput value={form.jobTitle} onChange={v => update('jobTitle', v)} placeholder="Job title" />
        </FormField>
        <FormField label="Hire Date">
          <TextInput value={form.hireDate} onChange={v => update('hireDate', v)} type="date" />
        </FormField>
        {/* Fix #7: clearanceLevel is now required with error message */}
        <FormField label="Clearance Level" required error={attempted && !form.clearanceLevel ? 'Clearance level is required' : undefined}>
          <SelectFilter
            value={form.clearanceLevel}
            onChange={v => update('clearanceLevel', v)}
            placeholder="Select level"
            options={Object.entries(CLEARANCE_TARGET_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </FormField>
        <FormField label="Status">
          <SelectFilter
            value={form.clearanceStatus}
            onChange={v => update('clearanceStatus', v)}
            placeholder="Select status"
            options={[
              { value: 'pending-investigation', label: 'Pending Investigation' },
              { value: 'interim', label: 'Interim' },
              { value: 'active', label: 'Active' },
            ]}
          />
        </FormField>
        <FormField label="Investigating Agency">
          <SelectFilter
            value={form.investigatingAgency}
            onChange={v => update('investigatingAgency', v)}
            placeholder="Agency"
            options={[
              { value: 'dcsa', label: 'DCSA' }, { value: 'doe', label: 'DOE' },
              { value: 'ic', label: 'IC' }, { value: 'other', label: 'Other' },
            ]}
          />
        </FormField>
        <div className="col-span-2">
          <FormField label="Notes">
            <TextAreaInput value={form.notes} onChange={v => update('notes', v)} placeholder="Optional notes..." rows={2} />
          </FormField>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-800">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSave}
          disabled={saving || !form.firstName || !form.lastName || !form.employeeId || !form.clearanceLevel}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Employee
        </button>
      </div>
    </Modal>
  );
}

// ============================================================================
// VISIT REQUESTS SUB-TAB
// ============================================================================

function VisitRequestsSubTab({ visits, onRefresh }: { visits: VisitRequest[]; onRefresh: () => void }) {
  const [directionFilter, setDirectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitRequest | null>(null);
  // Fix #8: loading states for approve/deny
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filtered = useMemo(() => {
    let result = [...visits];
    if (directionFilter) result = result.filter(v => v.direction === directionFilter);
    if (statusFilter) result = result.filter(v => v.status === statusFilter);
    return result.sort((a, b) => new Date(a.visitStartDate).getTime() - new Date(b.visitStartDate).getTime());
  }, [visits, directionFilter, statusFilter]);

  // Group visits by month for calendar-like view
  const visitsByMonth = useMemo(() => {
    const groups: Record<string, VisitRequest[]> = {};
    filtered.forEach(v => {
      const month = v.visitStartDate.substring(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(v);
    });
    return groups;
  }, [filtered]);

  const handleVisitAction = async (visitId: string, action: 'approved' | 'denied') => {
    // Fix #9: confirmation dialog
    const actionLabel = action === 'approved' ? 'approve' : 'deny';
    if (!window.confirm(`Are you sure you want to ${actionLabel} this visit request?`)) return;

    setActionLoading(action);
    setActionFeedback(null);
    try {
      await clearanceReadinessApi.updateVisitStatus(visitId, action);
      setActionFeedback({ type: 'success', message: `Visit request ${action} successfully.` });
      setTimeout(() => {
        setSelectedVisit(null);
        setActionFeedback(null);
        onRefresh();
      }, 1200);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update visit status:', err);
      setActionFeedback({ type: 'error', message: `Failed to ${actionLabel} visit request.` });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <SelectFilter
            value={directionFilter} onChange={setDirectionFilter}
            placeholder="Direction"
            options={[
              { value: 'incoming', label: 'Incoming' },
              { value: 'outgoing', label: 'Outgoing' },
            ]}
          />
          <SelectFilter
            value={statusFilter} onChange={setStatusFilter}
            placeholder="Status"
            options={[
              { value: 'draft', label: 'Draft' }, { value: 'submitted', label: 'Submitted' },
              { value: 'under-review', label: 'Under Review' },
              { value: 'approved', label: 'Approved' }, { value: 'denied', label: 'Denied' },
            ]}
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
          aria-label="Create new visit request"
        >
          <Plus className="w-4 h-4" /> New Visit Request
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{visits.length}</div>
          <div className="text-xs text-gray-500">Total Requests</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">{visits.filter(v => v.status === 'approved').length}</div>
          <div className="text-xs text-gray-500">Approved</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{visits.filter(v => v.status === 'submitted' || v.status === 'under-review').length}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{visits.filter(v => v.direction === 'incoming').length}</div>
          <div className="text-xs text-gray-500">Incoming</div>
        </div>
      </div>

      {/* Calendar-like grouping */}
      {Object.keys(visitsByMonth).length === 0 ? (
        <EmptyState icon={Plane} message="No visit requests match current filters" />
      ) : (
        Object.entries(visitsByMonth).map(([month, monthVisits]) => (
          <div key={month}>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="space-y-2">
              {monthVisits.map(visit => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedVisit(visit)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${visit.direction === 'incoming' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                        {visit.direction === 'incoming' ? (
                          <MapPin className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Plane className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{visit.visitorName}</div>
                        <div className="text-xs text-gray-400">
                          {visit.direction === 'incoming' ? 'From' : 'To'}: {visit.direction === 'incoming' ? visit.visitorOrganization : visit.hostFacility}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(visit.visitStartDate)} - {formatDate(visit.visitEndDate)}
                          {visit.escortRequired && <span className="text-amber-400 ml-2">Escort Required</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: getClearanceBadgeColor(visit.visitorClearanceLevel) }}
                      >
                        {getClearanceLabel(visit.visitorClearanceLevel)}
                      </span>
                      <Badge className={VISIT_STATUS_COLORS[visit.status] || VISIT_STATUS_COLORS.draft}>
                        {statusLabel(visit.status)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <Modal title="Visit Request Details" onClose={() => setSelectedVisit(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Direction</span>
                <Badge className={selectedVisit.direction === 'incoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}>
                  {selectedVisit.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Status</span>
                <Badge className={VISIT_STATUS_COLORS[selectedVisit.status] || ''}>{statusLabel(selectedVisit.status)}</Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Visitor</span>
                <span className="text-sm text-white">{selectedVisit.visitorName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Organization</span>
                <span className="text-sm text-white">{selectedVisit.visitorOrganization}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">CAGE Code</span>
                <span className="text-sm text-gray-300 font-mono">{selectedVisit.visitorCageCode}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Visitor Clearance</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: getClearanceBadgeColor(selectedVisit.visitorClearanceLevel) }}>
                  {getClearanceFullLabel(selectedVisit.visitorClearanceLevel)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Host Facility</span>
                <span className="text-sm text-white">{selectedVisit.hostFacility}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Host CAGE Code</span>
                <span className="text-sm text-gray-300 font-mono">{selectedVisit.hostFacilityCageCode}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Point of Contact</span>
                <span className="text-sm text-white">{selectedVisit.hostPointOfContact}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Max Classification</span>
                <span className="text-sm text-gray-300">{statusLabel(selectedVisit.maxClassificationLevel)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Visit Dates</span>
                <span className="text-sm text-white">{formatDate(selectedVisit.visitStartDate)} - {formatDate(selectedVisit.visitEndDate)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Escort Required</span>
                <span className={`text-sm ${selectedVisit.escortRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedVisit.escortRequired ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            {selectedVisit.programBriefingsRequired.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">Program Briefings Required</span>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedVisit.programBriefingsRequired.map(p => (
                    <Badge key={p} className="bg-purple-500/20 text-purple-400 border-purple-500/30">{p}</Badge>
                  ))}
                </div>
              </div>
            )}
            {/* Fix #8: action feedback */}
            {actionFeedback && (
              <div className={`text-sm rounded-lg p-3 ${actionFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {actionFeedback.message}
              </div>
            )}
            {selectedVisit.status === 'submitted' && (
              <div className="flex gap-2 pt-3 border-t border-gray-800">
                {/* Fix #8: loading states on approve/deny, Fix #11: p-2.5 touch target */}
                <button
                  onClick={() => handleVisitAction(selectedVisit.id, 'approved')}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  aria-label="Approve visit request"
                >
                  {actionLoading === 'approved' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
                <button
                  onClick={() => handleVisitAction(selectedVisit.id, 'denied')}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  aria-label="Deny visit request"
                >
                  {actionLoading === 'denied' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Deny
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Visit Modal */}
      {showCreateModal && (
        <CreateVisitModal
          onClose={() => setShowCreateModal(false)}
          onSave={async (data) => {
            await clearanceReadinessApi.createVisitRequest(data);
            setShowCreateModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function CreateVisitModal({
  onClose, onSave,
}: {
  onClose: () => void;
  onSave: (data: Partial<VisitRequest>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    direction: 'incoming' as 'incoming' | 'outgoing',
    visitorName: '', visitorOrganization: '', visitorCageCode: '',
    visitorClearanceLevel: 'secret' as VisitRequest['visitorClearanceLevel'],
    hostFacility: '', hostFacilityCageCode: '', hostPointOfContact: '',
    visitStartDate: '', visitEndDate: '',
    maxClassificationLevel: 'secret' as VisitRequest['maxClassificationLevel'],
    escortRequired: false,
  });
  const [saving, setSaving] = useState(false);
  // Fix #6: validation state
  const [attempted, setAttempted] = useState(false);

  const update = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  // Fix #6: comprehensive validation
  const dateRangeValid = !form.visitStartDate || !form.visitEndDate || form.visitEndDate >= form.visitStartDate;
  const isFormValid = !!form.visitorName && !!form.hostFacility && !!form.visitStartDate && !!form.visitEndDate && dateRangeValid;

  const handleSave = async () => {
    setAttempted(true);
    if (!isFormValid) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Modal title="Create Visit Request" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Direction" required>
          <SelectFilter
            value={form.direction} onChange={v => update('direction', v)}
            placeholder="Direction"
            options={[{ value: 'incoming', label: 'Incoming' }, { value: 'outgoing', label: 'Outgoing' }]}
          />
        </FormField>
        <FormField label="Visitor Clearance Level">
          <SelectFilter
            value={form.visitorClearanceLevel} onChange={v => update('visitorClearanceLevel', v)}
            placeholder="Level"
            options={Object.entries(CLEARANCE_TARGET_LEVELS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </FormField>
        {/* Fix #6: inline errors */}
        <FormField label="Visitor Name" required error={attempted && !form.visitorName ? 'Visitor name is required' : undefined}>
          <TextInput value={form.visitorName} onChange={v => update('visitorName', v)} placeholder="Full name" />
        </FormField>
        <FormField label="Visitor Organization">
          <TextInput value={form.visitorOrganization} onChange={v => update('visitorOrganization', v)} placeholder="Organization" />
        </FormField>
        <FormField label="Visitor CAGE Code">
          <TextInput value={form.visitorCageCode} onChange={v => update('visitorCageCode', v)} placeholder="CAGE-XXXXX" />
        </FormField>
        <FormField label="Host Facility" required error={attempted && !form.hostFacility ? 'Host facility is required' : undefined}>
          <TextInput value={form.hostFacility} onChange={v => update('hostFacility', v)} placeholder="Facility name" />
        </FormField>
        <FormField label="Host CAGE Code">
          <TextInput value={form.hostFacilityCageCode} onChange={v => update('hostFacilityCageCode', v)} placeholder="CAGE-XXXXX" />
        </FormField>
        <FormField label="Point of Contact">
          <TextInput value={form.hostPointOfContact} onChange={v => update('hostPointOfContact', v)} placeholder="Contact name" />
        </FormField>
        <FormField label="Start Date" required error={attempted && !form.visitStartDate ? 'Start date is required' : undefined}>
          <TextInput value={form.visitStartDate} onChange={v => update('visitStartDate', v)} type="date" />
        </FormField>
        <FormField label="End Date" required error={attempted && !form.visitEndDate ? 'End date is required' : (attempted && !dateRangeValid ? 'End date must be on or after start date' : undefined)}>
          <TextInput value={form.visitEndDate} onChange={v => update('visitEndDate', v)} type="date" />
        </FormField>
        <FormField label="Max Classification">
          <SelectFilter
            value={form.maxClassificationLevel as string} onChange={v => update('maxClassificationLevel', v)}
            placeholder="Level"
            options={[
              { value: 'unclassified', label: 'Unclassified' }, { value: 'cui', label: 'CUI' },
              { value: 'confidential', label: 'Confidential' }, { value: 'secret', label: 'Secret' },
              { value: 'top-secret', label: 'Top Secret' }, { value: 'ts-sci', label: 'TS/SCI' },
            ]}
          />
        </FormField>
        <FormField label="Escort Required">
          <button
            onClick={() => update('escortRequired', !form.escortRequired)}
            className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${form.escortRequired ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
          >
            {form.escortRequired ? 'Yes - Escort Required' : 'No Escort Needed'}
          </button>
        </FormField>
      </div>
      <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-800">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSave}
          disabled={saving || (attempted && !isFormValid)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Request
        </button>
      </div>
    </Modal>
  );
}

// ============================================================================
// INCIDENTS SUB-TAB
// ============================================================================

function IncidentsSubTab({ incidents, employees, onRefresh }: { incidents: ReportableIncident[]; employees: ClearedEmployee[]; onRefresh: () => void }) {
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<ReportableIncident | null>(null);

  const filtered = useMemo(() => {
    let result = [...incidents];
    if (severityFilter) result = result.filter(i => i.severity === severityFilter);
    if (typeFilter) result = result.filter(i => i.incidentType === typeFilter);
    return result.sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime());
  }, [incidents, severityFilter, typeFilter]);

  return (
    <div className="space-y-4">
      {/* SEAD-3 Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-400">SEAD-3 Reporting Requirements</h4>
          <p className="text-xs text-gray-400 mt-1">
            Security Executive Agent Directive 3 requires cleared personnel and their supervisors to report
            adverse information, foreign contacts, and other reportable events within specified timeframes.
            Failure to report may result in clearance action.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <SelectFilter
            value={severityFilter} onChange={setSeverityFilter}
            placeholder="Severity"
            options={[
              { value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' },
              { value: 'serious', label: 'Serious' }, { value: 'critical', label: 'Critical' },
            ]}
          />
          <SelectFilter
            value={typeFilter} onChange={setTypeFilter}
            placeholder="Incident Type"
            options={Object.entries(INCIDENT_TYPES).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
          aria-label="Report new incident"
        >
          <AlertOctagon className="w-4 h-4" /> Report Incident
        </button>
      </div>

      {/* Incidents List */}
      {filtered.length === 0 ? (
        <EmptyState icon={ShieldCheck} message="No incidents match current filters" />
      ) : (
        <div className="space-y-3">
          {filtered.map(incident => {
            const typeInfo = INCIDENT_TYPES[incident.incidentType];
            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'serious' ? 'bg-orange-500' :
                      incident.severity === 'moderate' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">{typeInfo?.label || incident.incidentType}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{incident.employeeName}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{incident.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className={SEVERITY_COLORS[incident.severity] || ''}>
                      {incident.severity}
                    </Badge>
                    <Badge className={
                      incident.status.startsWith('resolved') || incident.status === 'closed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }>
                      {INCIDENT_STATUS_LABELS[incident.status] || incident.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatDate(incident.reportedDate)}</span>
                  </div>
                </div>
                {!incident.reportedWithinTimeframe && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <XCircle className="w-3 h-3" />
                    Not reported within required timeframe ({typeInfo?.reportingDeadline})
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Modal title="Incident Details" onClose={() => setSelectedIncident(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Type</span>
                <span className="text-sm text-white">{INCIDENT_TYPES[selectedIncident.incidentType]?.label}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Severity</span>
                <Badge className={SEVERITY_COLORS[selectedIncident.severity] || ''}>{selectedIncident.severity}</Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Employee</span>
                <span className="text-sm text-white">{selectedIncident.employeeName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Status</span>
                <Badge className={
                  selectedIncident.status.startsWith('resolved') || selectedIncident.status === 'closed'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }>
                  {INCIDENT_STATUS_LABELS[selectedIncident.status] || selectedIncident.status}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Incident Date</span>
                <span className="text-sm text-gray-300">{formatDate(selectedIncident.incidentDate)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Discovered Date</span>
                <span className="text-sm text-gray-300">{formatDate(selectedIncident.discoveredDate)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Reported Date</span>
                <span className="text-sm text-gray-300">{formatDate(selectedIncident.reportedDate)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Reported on Time</span>
                <span className={`text-sm ${selectedIncident.reportedWithinTimeframe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedIncident.reportedWithinTimeframe ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Description</span>
              <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{selectedIncident.description}</p>
            </div>
            {selectedIncident.investigation && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">Investigation Notes</span>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{selectedIncident.investigation}</p>
              </div>
            )}
            {selectedIncident.resolution && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">Resolution</span>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{selectedIncident.resolution}</p>
              </div>
            )}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">SEAD Reference</span>
              <span className="text-xs text-gray-400 font-mono">{INCIDENT_TYPES[selectedIncident.incidentType]?.seadReference}</span>
              <span className="text-xs text-gray-500 block mt-1">
                Required reporting deadline: {INCIDENT_TYPES[selectedIncident.incidentType]?.reportingDeadline}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Incident Modal */}
      {showReportModal && (
        <ReportIncidentModal
          employees={employees}
          onClose={() => setShowReportModal(false)}
          onSave={async (data) => {
            await clearanceReadinessApi.createIncident(data);
            setShowReportModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ReportIncidentModal({
  employees, onClose, onSave,
}: {
  employees: ClearedEmployee[];
  onClose: () => void;
  onSave: (data: Partial<ReportableIncident>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    employeeId: '', incidentType: '' as string,
    incidentDate: '', discoveredDate: '', description: '',
    severity: 'moderate' as ReportableIncident['severity'],
    reportedToAgency: false,
  });
  const [saving, setSaving] = useState(false);

  const selectedType = form.incidentType ? INCIDENT_TYPES[form.incidentType as keyof typeof INCIDENT_TYPES] : null;
  const selectedEmployee = employees.find(e => e.id === form.employeeId);
  const update = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.employeeId || !form.incidentType || !form.description) return;
    setSaving(true);
    await onSave({
      ...form,
      incidentType: form.incidentType as ReportableIncident['incidentType'],
      employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      reportedDate: new Date().toISOString().split('T')[0],
    });
    setSaving(false);
  };

  return (
    <Modal title="Report Incident (SEAD-3)" onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee" required>
            <SelectFilter
              value={form.employeeId} onChange={v => update('employeeId', v)}
              placeholder="Select employee"
              options={employees.filter(e => e.isActive).map(e => ({
                value: e.id, label: `${e.firstName} ${e.lastName} (${e.employeeId})`,
              }))}
            />
          </FormField>
          <FormField label="Incident Type" required>
            <SelectFilter
              value={form.incidentType} onChange={v => update('incidentType', v)}
              placeholder="Select type"
              options={Object.entries(INCIDENT_TYPES).map(([k, v]) => ({ value: k, label: v.label }))}
            />
          </FormField>
          <FormField label="Incident Date" required>
            <TextInput value={form.incidentDate} onChange={v => update('incidentDate', v)} type="date" />
          </FormField>
          <FormField label="Discovered Date">
            <TextInput value={form.discoveredDate} onChange={v => update('discoveredDate', v)} type="date" />
          </FormField>
          <FormField label="Severity">
            <SelectFilter
              value={form.severity} onChange={v => update('severity', v)}
              placeholder="Severity"
              options={[
                { value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' },
                { value: 'serious', label: 'Serious' }, { value: 'critical', label: 'Critical' },
              ]}
            />
          </FormField>
          <FormField label="Reported to Agency">
            <button
              onClick={() => update('reportedToAgency', !form.reportedToAgency)}
              className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${form.reportedToAgency ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
            >
              {form.reportedToAgency ? 'Yes' : 'No'}
            </button>
          </FormField>
        </div>

        {selectedType && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
            <div className="text-xs font-medium text-amber-400 mb-1">SEAD-3 Guidance for {selectedType.label}</div>
            <p className="text-xs text-gray-400">{selectedType.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="text-gray-500">Reporting deadline: <span className="text-amber-400">{selectedType.reportingDeadline}</span></span>
              <span className="text-gray-500">Reference: <span className="text-gray-400 font-mono">{selectedType.seadReference}</span></span>
            </div>
          </div>
        )}

        <FormField label="Description" required>
          <TextAreaInput
            value={form.description}
            onChange={v => update('description', v)}
            placeholder="Describe the incident. Include relevant dates, circumstances, and any mitigating factors. Do NOT include classified information."
            rows={4}
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-800">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button
          onClick={handleSave}
          disabled={saving || !form.employeeId || !form.incidentType || !form.description}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertOctagon className="w-4 h-4" />}
          Submit Report
        </button>
      </div>
    </Modal>
  );
}

// ============================================================================
// CV ALERTS SUB-TAB
// ============================================================================

function CVAlertsSubTab({ alerts, employees, onRefresh }: { alerts: CVAlert[]; employees: ClearedEmployee[]; onRefresh: () => void }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<CVAlert | null>(null);
  const [resolveForm, setResolveForm] = useState({ assessment: '', action: '', mitigation: '' });
  // Fix #8: loading states for acknowledge/resolve
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filtered = useMemo(() => {
    let result = [...alerts];
    if (statusFilter) result = result.filter(a => a.status === statusFilter);
    if (severityFilter) result = result.filter(a => a.severity === severityFilter);
    return result.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, informational: 4 };
      return (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5);
    });
  }, [alerts, statusFilter, severityFilter]);

  // CV enrollment stats
  const cvEnrolled = employees.filter(e => e.continuousVettingEnrolled).length;
  const cvNotEnrolled = employees.filter(e => !e.continuousVettingEnrolled && e.clearanceStatus === 'active').length;
  const activeAlerts = alerts.filter(a => a.status !== 'resolved' && a.status !== 'closed').length;

  const handleAcknowledge = async (alertId: string) => {
    // Fix #9: confirmation dialog
    if (!window.confirm('Are you sure you want to acknowledge this CV alert?')) return;
    setActionLoading('acknowledge');
    setActionFeedback(null);
    try {
      await clearanceReadinessApi.acknowledgeCVAlert(alertId);
      setActionFeedback({ type: 'success', message: 'Alert acknowledged successfully.' });
      setTimeout(() => {
        onRefresh();
        setSelectedAlert(null);
        setActionFeedback(null);
      }, 1200);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to acknowledge CV alert:', err);
      setActionFeedback({ type: 'error', message: 'Failed to acknowledge alert.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (alertId: string) => {
    // Fix #9: confirmation dialog
    if (!window.confirm('Are you sure you want to resolve this CV alert?')) return;
    setActionLoading('resolve');
    setActionFeedback(null);
    try {
      await clearanceReadinessApi.resolveCVAlert(alertId, {
        fsoAssessment: resolveForm.assessment,
        actionTaken: resolveForm.action,
        mitigationPlan: resolveForm.mitigation || undefined,
      });
      setResolveForm({ assessment: '', action: '', mitigation: '' });
      setActionFeedback({ type: 'success', message: 'Alert resolved successfully.' });
      setTimeout(() => {
        onRefresh();
        setSelectedAlert(null);
        setActionFeedback(null);
      }, 1200);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to resolve CV alert:', err);
      setActionFeedback({ type: 'error', message: 'Failed to resolve alert.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* TW 2.0 Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-400">Trusted Workforce 2.0 - Continuous Vetting</h4>
          <p className="text-xs text-gray-400 mt-1">
            DCSA's Continuous Vetting program performs automated record checks against enrolled personnel.
            FSOs must acknowledge and respond to alerts within the specified timeframes. Enrollment is
            managed through the Defense Information System for Security (DISS).
          </p>
        </div>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">{cvEnrolled}</div>
          <div className="text-xs text-gray-500">CV Enrolled</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{cvNotEnrolled}</div>
          <div className="text-xs text-gray-500">Not Enrolled (Active)</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{activeAlerts}</div>
          <div className="text-xs text-gray-500">Active Alerts</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{alerts.filter(a => a.status === 'resolved' || a.status === 'closed').length}</div>
          <div className="text-xs text-gray-500">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <SelectFilter
          value={statusFilter} onChange={setStatusFilter}
          placeholder="Status"
          options={[
            { value: 'new', label: 'New' }, { value: 'acknowledged', label: 'Acknowledged' },
            { value: 'under-review', label: 'Under Review' },
            { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' },
          ]}
        />
        <SelectFilter
          value={severityFilter} onChange={setSeverityFilter}
          placeholder="Severity"
          options={[
            { value: 'critical', label: 'Critical' }, { value: 'high', label: 'High' },
            { value: 'moderate', label: 'Moderate' }, { value: 'low', label: 'Low' },
            { value: 'informational', label: 'Informational' },
          ]}
        />
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Bell} message="No CV alerts match current filters" />
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const typeInfo = CV_ALERT_TYPES[alert.alertType];
            const isActionable = alert.status === 'new' || alert.status === 'acknowledged' || alert.status === 'under-review';

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900 border rounded-xl p-4 transition-colors cursor-pointer ${
                  isActionable ? 'border-gray-700 hover:border-gray-600' : 'border-gray-800 hover:border-gray-700'
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alert.severity === 'critical' ? 'bg-red-500/20' :
                      alert.severity === 'high' ? 'bg-orange-500/20' :
                      alert.severity === 'moderate' ? 'bg-yellow-500/20' :
                      alert.severity === 'low' ? 'bg-blue-500/20' : 'bg-gray-700/50'
                    }`}>
                      {alert.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-red-400" /> :
                       alert.severity === 'high' ? <ShieldAlert className="w-4 h-4 text-orange-400" /> :
                       <Bell className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{typeInfo?.label || alert.alertType}</div>
                      <div className="text-xs text-gray-400">{alert.employeeName}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Source: <span className="uppercase">{alert.alertSource}</span> &middot; Received: {formatDate(alert.receivedDate)}
                      </div>
                      {alert.responseDeadline && isActionable && (
                        <div className="text-xs text-amber-400 mt-1">
                          Response deadline: {formatDate(alert.responseDeadline)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className={SEVERITY_COLORS[alert.severity] || ''}>{alert.severity}</Badge>
                    <Badge className={CV_STATUS_COLORS[alert.status] || ''}>{statusLabel(alert.status)}</Badge>
                  </div>
                </div>
                {alert.fsoAssessment && (
                  <div className="mt-3 bg-gray-800/50 rounded-lg p-2.5 text-xs text-gray-400">
                    <span className="text-gray-500 font-medium">FSO Assessment: </span>{alert.fsoAssessment}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Alert Detail / Action Modal */}
      {selectedAlert && (
        <Modal title="CV Alert Details" onClose={() => setSelectedAlert(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Alert Type</span>
                <span className="text-sm text-white">{CV_ALERT_TYPES[selectedAlert.alertType]?.label}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Severity</span>
                <Badge className={SEVERITY_COLORS[selectedAlert.severity] || ''}>{selectedAlert.severity}</Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Employee</span>
                <span className="text-sm text-white">{selectedAlert.employeeName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Status</span>
                <Badge className={CV_STATUS_COLORS[selectedAlert.status] || ''}>{statusLabel(selectedAlert.status)}</Badge>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Source</span>
                <span className="text-sm text-gray-300 uppercase">{selectedAlert.alertSource}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Received</span>
                <span className="text-sm text-gray-300">{formatDateTime(selectedAlert.receivedDate)}</span>
              </div>
              {selectedAlert.responseDeadline && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Response Deadline</span>
                  <span className="text-sm text-amber-400">{formatDate(selectedAlert.responseDeadline)}</span>
                </div>
              )}
              {selectedAlert.acknowledgedAt && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Acknowledged</span>
                  <span className="text-sm text-gray-300">{formatDateTime(selectedAlert.acknowledgedAt)}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">Response Timeframe</span>
              <span className="text-xs text-gray-400">{CV_ALERT_TYPES[selectedAlert.alertType]?.responseTimeframe}</span>
            </div>

            {selectedAlert.fsoAssessment && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">FSO Assessment</span>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{selectedAlert.fsoAssessment}</p>
              </div>
            )}
            {selectedAlert.actionTaken && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">Action Taken</span>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">{selectedAlert.actionTaken}</p>
              </div>
            )}

            {/* Fix #8: action feedback */}
            {actionFeedback && (
              <div className={`text-sm rounded-lg p-3 ${actionFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {actionFeedback.message}
              </div>
            )}

            {/* Action Buttons */}
            {selectedAlert.status === 'new' && (
              <div className="pt-3 border-t border-gray-800">
                <button
                  onClick={() => handleAcknowledge(selectedAlert.id)}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  aria-label="Acknowledge CV alert"
                >
                  {actionLoading === 'acknowledge' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  Acknowledge Alert
                </button>
              </div>
            )}

            {(selectedAlert.status === 'acknowledged' || selectedAlert.status === 'under-review') && (
              <div className="pt-3 border-t border-gray-800 space-y-3">
                <h4 className="text-sm font-medium text-white">Resolve Alert</h4>
                <FormField label="FSO Assessment" required>
                  <TextAreaInput
                    value={resolveForm.assessment}
                    onChange={v => setResolveForm(prev => ({ ...prev, assessment: v }))}
                    placeholder="Provide your assessment of this alert..."
                    rows={3}
                  />
                </FormField>
                <FormField label="Action Taken" required>
                  <TextAreaInput
                    value={resolveForm.action}
                    onChange={v => setResolveForm(prev => ({ ...prev, action: v }))}
                    placeholder="Describe the action taken..."
                    rows={2}
                  />
                </FormField>
                <FormField label="Mitigation Plan (Optional)">
                  <TextAreaInput
                    value={resolveForm.mitigation}
                    onChange={v => setResolveForm(prev => ({ ...prev, mitigation: v }))}
                    placeholder="If applicable, describe ongoing mitigation..."
                    rows={2}
                  />
                </FormField>
                <button
                  onClick={() => handleResolve(selectedAlert.id)}
                  disabled={!resolveForm.assessment || !resolveForm.action || actionLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  aria-label="Resolve CV alert"
                >
                  {actionLoading === 'resolve' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Resolve Alert
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================================
// AUDIT LOG SUB-TAB
// ============================================================================

function AuditLogSubTab({ auditLog }: { auditLog: AuditLogEntry[] }) {
  const [typeFilter, setTypeFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [search, setSearch] = useState('');

  const eventTypes = useMemo(() =>
    [...new Set(auditLog.map(e => e.eventType))].sort(),
    [auditLog]
  );
  const entityTypes = useMemo(() =>
    [...new Set(auditLog.map(e => e.entityType))].sort(),
    [auditLog]
  );

  const filtered = useMemo(() => {
    let result = [...auditLog];
    if (typeFilter) result = result.filter(e => e.eventType === typeFilter);
    if (entityFilter) result = result.filter(e => e.entityType === entityFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.changeDescription.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [auditLog, typeFilter, entityFilter, search]);

  const eventTypeIcons: Record<string, React.ElementType> = {
    employee_added: UserPlus,
    clearance_status_changed: Shield,
    incident_reported: AlertTriangle,
    cv_alert_received: Bell,
    cv_alert_resolved: CheckCircle,
    visit_request_created: Plane,
    visit_request_status_changed: MapPin,
    briefing_completed: FileText,
  };

  const eventTypeColors: Record<string, string> = {
    employee_added: 'bg-blue-500/20 text-blue-400',
    clearance_status_changed: 'bg-purple-500/20 text-purple-400',
    incident_reported: 'bg-red-500/20 text-red-400',
    cv_alert_received: 'bg-amber-500/20 text-amber-400',
    cv_alert_resolved: 'bg-emerald-500/20 text-emerald-400',
    visit_request_created: 'bg-cyan-500/20 text-cyan-400',
    visit_request_status_changed: 'bg-teal-500/20 text-teal-400',
    briefing_completed: 'bg-green-500/20 text-green-400',
  };

  // Fix #3: CSV injection protection on audit log export
  // NOTE: In production, userId should be hashed before export to prevent PII leakage
  const handleExport = useCallback(() => {
    const csv = [
      'Timestamp,Event Type,Entity Type,Entity ID,Description,User',
      ...filtered.map(e =>
        `"${sanitizeCsvCell(e.createdAt)}","${sanitizeCsvCell(e.eventType)}","${sanitizeCsvCell(e.entityType)}","${sanitizeCsvCell(e.entityId)}","${sanitizeCsvCell(e.changeDescription.replace(/"/g, '""'))}","${sanitizeCsvCell(e.userId)}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fso-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Compliance Notice */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-gray-300">Immutable Audit Trail</h4>
          <p className="text-xs text-gray-500 mt-1">
            All FSO actions are logged per NIST 800-53 AU-3. This log is immutable and cannot be edited or deleted.
            Export this data for DCSA security reviews or internal compliance audits.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="flex-1 max-w-xs">
            <SearchInput value={search} onChange={setSearch} placeholder="Search audit log..." />
          </div>
          <SelectFilter
            value={typeFilter} onChange={setTypeFilter}
            placeholder="Event Type"
            options={eventTypes.map(t => ({ value: t, label: t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))}
          />
          <SelectFilter
            value={entityFilter} onChange={setEntityFilter}
            placeholder="Entity Type"
            options={entityTypes.map(t => ({ value: t, label: t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))}
          />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm rounded-lg transition-colors"
          aria-label="Export audit log as CSV"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">{filtered.length} events</div>

      {/* Log Entries */}
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} message="No audit log entries match current filters" />
      ) : (
        <div className="space-y-1">
          {filtered.map((entry, idx) => {
            const IconComponent = eventTypeIcons[entry.eventType] || Activity;
            const colorClass = eventTypeColors[entry.eventType] || 'bg-gray-700/50 text-gray-400';

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-start gap-3 hover:border-gray-700 transition-colors"
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-300">{entry.changeDescription}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{formatDateTime(entry.createdAt)}</span>
                    <span className="font-mono">{entry.entityId}</span>
                    <span>by {entry.userId}</span>
                  </div>
                </div>
                <Badge className="bg-gray-800 text-gray-500 border-gray-700 text-[10px]">
                  {entry.eventType.replace(/_/g, ' ')}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FSOPortalTab() {
  const [activeTab, setActiveTab] = useState<SubTab>('overview');
  const [stats, setStats] = useState<FSODashboardStats | null>(null);
  const [employees, setEmployees] = useState<ClearedEmployee[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [incidents, setIncidents] = useState<ReportableIncident[]>([]);
  const [cvAlerts, setCvAlerts] = useState<CVAlert[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, empRes, visitRes, incidentRes, alertRes, auditRes] = await Promise.all([
        clearanceReadinessApi.getDashboardStats(),
        clearanceReadinessApi.listEmployees(),
        clearanceReadinessApi.listVisitRequests(),
        clearanceReadinessApi.listIncidents(),
        clearanceReadinessApi.listCVAlerts(),
        clearanceReadinessApi.getAuditLog(),
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (empRes.success) setEmployees(empRes.data);
      if (visitRes.success) setVisits(visitRes.data);
      if (incidentRes.success) setIncidents(incidentRes.data);
      if (alertRes.success) setCvAlerts(alertRes.data);
      if (auditRes.success) setAuditLog(auditRes.data);
    } catch (err) {
      // Fix #2: console.error redaction
      if (import.meta.env.DEV) console.error('Failed to load FSO portal data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Alert count for badge on CV Alerts tab
  const activeAlertCount = cvAlerts.filter(a => a.status !== 'resolved' && a.status !== 'closed').length;
  const openIncidentCount = incidents.filter(i => !i.status.startsWith('resolved') && i.status !== 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">FSO Portal</h2>
            <p className="text-xs text-gray-500">Facility Security Officer &middot; 32 CFR Part 117 (NISPOM)</p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm rounded-lg transition-colors"
          aria-label="Refresh FSO portal data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Sub-Navigation */}
      <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        {SUB_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          const badgeCount = tab.id === 'cv-alerts' ? activeAlertCount : tab.id === 'incidents' ? openIncidentCount : 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap relative ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {badgeCount > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'
                }`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewSubTab stats={stats} employees={employees} />}
          {activeTab === 'roster' && <RosterSubTab employees={employees} onRefresh={loadData} />}
          {activeTab === 'visits' && <VisitRequestsSubTab visits={visits} onRefresh={loadData} />}
          {activeTab === 'incidents' && <IncidentsSubTab incidents={incidents} employees={employees} onRefresh={loadData} />}
          {activeTab === 'cv-alerts' && <CVAlertsSubTab alerts={cvAlerts} employees={employees} onRefresh={loadData} />}
          {activeTab === 'audit-log' && <AuditLogSubTab auditLog={auditLog} />}
        </motion.div>
      )}
    </div>
  );
}
