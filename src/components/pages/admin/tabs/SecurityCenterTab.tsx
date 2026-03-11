import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Users, Globe, Zap, Settings, AlertTriangle, XCircle, RefreshCw, Trash2, Ban, Search, Lock, Unlock, RadioTower } from 'lucide-react';
import {
  getAllBreakerStatuses,
  tripBreaker,
  resetBreaker,
  tripAllCritical,
  DOMAIN_SEVERITY,
  type ClearanceDomain,
} from '@/services/clearanceCircuitBreaker';

// =====================================================
// SECURITY CENTER TAB - OWASP & SOC 2 Compliant
// =====================================================

interface UserSession {
  id: string;
  user_id: string;
  device_info: {
    browser?: string;
    os?: string;
    device_type?: string;
  };
  ip_address: string;
  geo_location: {
    country?: string;
    city?: string;
    region?: string;
  };
  created_at: string;
  last_active_at: string;
  expires_at: string;
  revoked_at: string | null;
}

interface FailedLoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  failure_reason: string;
  geo_location: {
    country?: string;
    city?: string;
  };
  created_at: string;
}

interface IPAccessRule {
  id: string;
  rule_type: 'allow' | 'block';
  ip_pattern: string;
  description: string;
  applies_to: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

interface RateLimitConfig {
  id: string;
  endpoint_pattern: string;
  user_tier: string;
  requests_per_minute: number;
  requests_per_hour: number;
  burst_limit: number;
  is_active: boolean;
}

interface SecurityHeader {
  id: string;
  header_name: string;
  header_value: string;
  environment: string;
  is_active: boolean;
  updated_at: string;
}

type SecuritySubTab = 'sessions' | 'failed-logins' | 'ip-rules' | 'rate-limits' | 'headers' | 'circuit-breaker';

interface SecurityCenterTabProps {
  /** When navigated from "Circuit Breaker" menu item, open that sub-tab directly. */
  initialSubTab?: SecuritySubTab;
}

const SecurityCenterTab: React.FC<SecurityCenterTabProps> = ({ initialSubTab = 'sessions' }) => {
  const [activeSubTab, setActiveSubTab] = useState<SecuritySubTab>(initialSubTab);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLoginAttempt[]>([]);
  const [ipRules, setIpRules] = useState<IPAccessRule[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimitConfig[]>([]);
  const [securityHeaders, setSecurityHeaders] = useState<SecurityHeader[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddIPModal, setShowAddIPModal] = useState(false);
  const [showAddRateLimitModal, setShowAddRateLimitModal] = useState(false);

  // Circuit breaker state
  const [breakerStatuses, setBreakerStatuses] = useState(getAllBreakerStatuses());
  const [breakerLoading, setBreakerLoading] = useState<string | null>(null);
  const [breakerMessage, setBreakerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tripReason, setTripReason] = useState('');
  const [tripTarget, setTripTarget] = useState<ClearanceDomain | null>(null);

  const refreshBreakerStatuses = useCallback(() => {
    setBreakerStatuses(getAllBreakerStatuses());
  }, []);

  const handleTripBreaker = async (domain: ClearanceDomain, reason: string) => {
    setBreakerLoading(domain);
    setBreakerMessage(null);
    const result = await tripBreaker(domain, reason);
    setBreakerMessage({ type: result.success ? 'success' : 'error', text: result.message });
    refreshBreakerStatuses();
    setBreakerLoading(null);
    setTripTarget(null);
    setTripReason('');
  };

  const handleResetBreaker = async (domain: ClearanceDomain, notes: string) => {
    setBreakerLoading(domain);
    setBreakerMessage(null);
    const result = await resetBreaker(domain, notes);
    setBreakerMessage({ type: result.success ? 'success' : 'error', text: result.message });
    refreshBreakerStatuses();
    setBreakerLoading(null);
    setResetNotes('');
  };

  const handleTripAllCritical = async () => {
    setBreakerLoading('ALL');
    setBreakerMessage(null);
    const result = await tripAllCritical('Emergency: admin-initiated full isolation');
    setBreakerMessage({
      type: result.tripped.length > 0 ? 'success' : 'error',
      text: `Tripped ${result.tripped.length} domain(s). Failed: ${result.failed.length}.`,
    });
    refreshBreakerStatuses();
    setBreakerLoading(null);
  };

  // Stats
  const [stats, setStats] = useState({
    activeSessions: 0,
    failedLoginsToday: 0,
    blockedIPs: 0,
    rateLimitHits: 0
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Load sessions
      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('*')
        .is('revoked_at', null)
        .order('last_active_at', { ascending: false });
      setSessions(sessionsData || []);

      // Load failed logins (last 7 days)
      const { data: failedData } = await supabase
        .from('failed_login_attempts')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      setFailedLogins(failedData || []);

      // Load IP rules
      const { data: ipData } = await supabase
        .from('ip_access_rules')
        .select('*')
        .order('created_at', { ascending: false });
      setIpRules(ipData || []);

      // Load rate limits
      const { data: rateData } = await supabase
        .from('rate_limit_configs')
        .select('*')
        .order('endpoint_pattern');
      setRateLimits(rateData || []);

      // Load security headers
      const { data: headersData } = await supabase
        .from('security_headers_config')
        .select('*')
        .eq('environment', 'production')
        .order('header_name');
      setSecurityHeaders(headersData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const failedToday = (failedData || []).filter(f => new Date(f.created_at) >= today).length;
      const blockedCount = (ipData || []).filter(r => r.rule_type === 'block' && r.is_active).length;

      setStats({
        activeSessions: (sessionsData || []).length,
        failedLoginsToday: failedToday,
        blockedIPs: blockedCount,
        rateLimitHits: 0 // Would need rate_limit_events table query
      });

    } catch (error) {
      console.error('Error loading security data:', error);
    }
    setLoading(false);
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({
          revoked_at: new Date().toISOString(),
          revoke_reason: 'Admin force logout'
        })
        .eq('id', sessionId);
      loadSecurityData();
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  const revokeAllSessions = async (userId: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({
          revoked_at: new Date().toISOString(),
          revoke_reason: 'Admin force logout - all sessions'
        })
        .eq('user_id', userId)
        .is('revoked_at', null);
      loadSecurityData();
    } catch (error) {
      console.error('Error revoking all sessions:', error);
    }
  };

  const toggleIPRule = async (ruleId: string, isActive: boolean) => {
    try {
      await supabase
        .from('ip_access_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);
      loadSecurityData();
    } catch (error) {
      console.error('Error toggling IP rule:', error);
    }
  };

  const deleteIPRule = async (ruleId: string) => {
    try {
      await supabase
        .from('ip_access_rules')
        .delete()
        .eq('id', ruleId);
      loadSecurityData();
    } catch (error) {
      console.error('Error deleting IP rule:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const openBreakers = breakerStatuses.filter(b => b.state === 'open').length;

  const subTabs = [
    { id: 'sessions', label: 'Active Sessions', icon: Users, count: stats.activeSessions },
    { id: 'failed-logins', label: 'Failed Logins', icon: AlertTriangle, count: stats.failedLoginsToday },
    { id: 'ip-rules', label: 'IP Access Rules', icon: Globe, count: ipRules.length },
    { id: 'rate-limits', label: 'Rate Limiting', icon: Zap, count: rateLimits.length },
    { id: 'headers', label: 'Security Headers', icon: Settings, count: securityHeaders.length },
    {
      id: 'circuit-breaker',
      label: 'Circuit Breakers',
      icon: RadioTower,
      count: openBreakers,
      alert: openBreakers > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-emerald-500" />
            Security Center
          </h2>
          <p className="text-slate-400 mt-1">Monitor and manage platform security settings</p>
        </div>
        <button
          onClick={loadSecurityData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{stats.activeSessions}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Failed Logins (24h)</p>
              <p className="text-2xl font-bold text-white">{stats.failedLoginsToday}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.failedLoginsToday > 10 ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.failedLoginsToday > 10 ? 'text-red-500' : 'text-amber-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Blocked IPs</p>
              <p className="text-2xl font-bold text-white">{stats.blockedIPs}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Security Headers</p>
              <p className="text-2xl font-bold text-white">{securityHeaders.filter(h => h.is_active).length}/{securityHeaders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-slate-800">
        <div className="flex gap-1 overflow-x-auto">
          {subTabs.map((tab) => {
            const hasAlert = (tab as any).alert;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SecuritySubTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? hasAlert ? 'text-red-400 border-b-2 border-red-500' : 'text-emerald-500 border-b-2 border-emerald-500'
                    : hasAlert ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  hasAlert
                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                    : isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active sub-tab */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Active Sessions */}
            {activeSubTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by user ID or IP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">User / Device</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">IP / Location</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Last Active</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Expires</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sessions
                        .filter(s =>
                          s.user_id.includes(searchQuery) ||
                          s.ip_address.includes(searchQuery)
                        )
                        .map((session) => (
                        <tr key={session.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-mono text-sm">{session.user_id.substring(0, 8)}...</p>
                              <p className="text-slate-400 text-xs">
                                {session.device_info?.browser} • {session.device_info?.os}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-mono text-sm">{session.ip_address}</p>
                              <p className="text-slate-400 text-xs">
                                {session.geo_location?.city}, {session.geo_location?.country}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                new Date(session.last_active_at) > new Date(Date.now() - 5 * 60000)
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-500'
                              }`} />
                              <span className="text-slate-300 text-sm">{formatTimeAgo(session.last_active_at)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">
                              {new Date(session.expires_at).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => revokeSession(session.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Revoke Session"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => revokeAllSessions(session.user_id)}
                                className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                                title="Revoke All User Sessions"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sessions.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No active sessions found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Failed Logins */}
            {activeSubTab === 'failed-logins' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">IP Address</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Location</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Reason</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Time</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {failedLogins.map((attempt) => (
                        <tr key={attempt.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white">{attempt.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white font-mono text-sm">{attempt.ip_address}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">
                              {attempt.geo_location?.city || 'Unknown'}, {attempt.geo_location?.country || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              attempt.failure_reason === 'account_locked'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {attempt.failure_reason?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">{formatTimeAgo(attempt.created_at)}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                // Add to blocklist
                              }}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Block IP"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {failedLogins.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No failed login attempts in the last 7 days
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IP Access Rules */}
            {activeSubTab === 'ip-rules' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddIPModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    + Add IP Rule
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">IP Pattern</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Description</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Applies To</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ipRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rule.rule_type === 'allow'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {rule.rule_type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white font-mono text-sm">{rule.ip_pattern}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">{rule.description}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm capitalize">{rule.applies_to}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleIPRule(rule.id, rule.is_active)}
                              className={`px-2 py-1 rounded-full text-xs ${
                                rule.is_active
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {rule.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteIPRule(rule.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ipRules.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No IP access rules configured
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rate Limits */}
            {activeSubTab === 'rate-limits' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddRateLimitModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    + Add Rate Limit
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Endpoint</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">User Tier</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Per Minute</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Per Hour</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Burst</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {rateLimits.map((limit) => (
                        <tr key={limit.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white font-mono text-sm">{limit.endpoint_pattern}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              limit.user_tier === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                              limit.user_tier === 'premium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {limit.user_tier}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{limit.requests_per_minute}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{limit.requests_per_hour}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{limit.burst_limit}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              limit.is_active
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}>
                              {limit.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rateLimits.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No rate limit configurations
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Headers */}
            {activeSubTab === 'headers' && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 font-medium">Security Headers Configuration</p>
                      <p className="text-amber-200/70 text-sm mt-1">
                        These headers are applied at the server/CDN level. Changes here update the configuration database only.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {securityHeaders.map((header) => (
                    <div key={header.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{header.header_name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              header.is_active
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}>
                              {header.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mt-2 font-mono break-all">
                            {header.header_value}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            Last updated: {new Date(header.updated_at).toLocaleString()}
                          </p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {securityHeaders.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No security headers configured
                  </div>
                )}
              </div>
            )}

            {/* ── Circuit Breaker Panel ───────────────────────────────── */}
            {activeSubTab === 'circuit-breaker' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <RadioTower className="w-5 h-5 text-amber-400" />
                      Clearance Data Circuit Breakers
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Emergency kill-switch for cleared employee data domains (NIST 800-53 IR-4).
                      Tripping a breaker blocks all frontend access to that domain immediately.
                      Server-side RLS enforcement requires admin role.
                    </p>
                  </div>
                  <button
                    onClick={refreshBreakerStatuses}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Feedback message */}
                {breakerMessage && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    breakerMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {breakerMessage.type === 'success'
                      ? <Shield className="w-4 h-4 flex-shrink-0" />
                      : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                    {breakerMessage.text}
                  </div>
                )}

                {/* Emergency: Trip all critical */}
                {openBreakers === 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-red-400 font-semibold text-sm">Emergency Isolation</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Trip all critical + high severity breakers simultaneously (breach response).
                      </p>
                    </div>
                    <button
                      onClick={handleTripAllCritical}
                      disabled={breakerLoading === 'ALL'}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {breakerLoading === 'ALL' ? 'Isolating…' : 'Isolate All Critical'}
                    </button>
                  </div>
                )}

                {/* Domain rows */}
                <div className="space-y-2">
                  {breakerStatuses.map((status) => {
                    const isOpen = status.state === 'open';
                    const severity = DOMAIN_SEVERITY[status.domain];
                    const severityColors: Record<string, string> = {
                      critical: 'text-red-400 bg-red-500/10',
                      high: 'text-orange-400 bg-orange-500/10',
                      medium: 'text-amber-400 bg-amber-500/10',
                      low: 'text-slate-400 bg-slate-500/10',
                    };
                    const isLoading = breakerLoading === status.domain;

                    return (
                      <div
                        key={status.domain}
                        className={`rounded-xl border p-4 transition-colors ${
                          isOpen
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <div className="min-w-0">
                              <p className="text-white text-sm font-mono font-semibold truncate">{status.domain}</p>
                              {isOpen && (
                                <p className="text-red-400 text-xs mt-0.5 truncate">
                                  Opened {status.openedAt ? new Date(status.openedAt).toLocaleString() : 'unknown'} — {status.reason}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[severity]}`}>
                              {severity}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              isOpen
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {isOpen ? 'OPEN' : 'closed'}
                            </span>

                            {status.domain !== 'fso_audit_log' && (
                              isOpen ? (
                                <button
                                  onClick={() => {
                                    const notes = window.prompt('Resolution notes (required):');
                                    if (notes) handleResetBreaker(status.domain, notes);
                                  }}
                                  disabled={isLoading}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                  {isLoading ? 'Resetting…' : 'Reset'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setTripTarget(status.domain)}
                                  disabled={isLoading}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-red-600/80 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  {isLoading ? 'Tripping…' : 'Trip'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  Frontend breaker state is stored in localStorage + module memory for instant UX effect.
                  Server-side enforcement via <code className="text-slate-500">clearance_circuit_breakers</code> table (migration 064+068) is the authoritative kill-switch.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Trip Breaker Confirmation Modal */}
      {tripTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 border border-red-500/40 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Trip Circuit Breaker</h3>
                <p className="text-slate-400 text-sm font-mono">{tripTarget}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              This will immediately block all frontend access to <strong className="text-white">{tripTarget}</strong> data.
              Pair with server-side revocation for full isolation.
            </p>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Reason <span className="text-red-400">*</span></label>
              <textarea
                value={tripReason}
                onChange={(e) => setTripReason(e.target.value)}
                placeholder="Describe the security incident or reason for isolation…"
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setTripTarget(null); setTripReason(''); }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => tripReason.trim() && handleTripBreaker(tripTarget, tripReason.trim())}
                disabled={!tripReason.trim() || breakerLoading === tripTarget}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {breakerLoading === tripTarget ? 'Tripping…' : 'Confirm Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add IP Rule Modal */}
      {showAddIPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">Add IP Rule</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-sm mb-1">CIDR / IP Pattern</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.0/24"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Action</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="allow">Allow</option>
                  <option value="block">Block</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddIPModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rate Limit Modal */}
      {showAddRateLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">Add Rate Limit</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Endpoint Pattern</label>
                <input
                  type="text"
                  placeholder="e.g. /api/v1/*"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Request Limit</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  min={1}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Window</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="minute">Per Minute</option>
                  <option value="hour">Per Hour</option>
                  <option value="day">Per Day</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddRateLimitModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCenterTab;
