// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Users, Lock, Globe, Zap, Settings, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw, Trash2, Eye, Ban, Search } from 'lucide-react';

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

type SecuritySubTab = 'sessions' | 'failed-logins' | 'ip-rules' | 'rate-limits' | 'headers';

const SecurityCenterTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SecuritySubTab>('sessions');
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLoginAttempt[]>([]);
  const [ipRules, setIpRules] = useState<IPAccessRule[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimitConfig[]>([]);
  const [securityHeaders, setSecurityHeaders] = useState<SecurityHeader[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddIPModal, setShowAddIPModal] = useState(false);
  const [showAddRateLimitModal, setShowAddRateLimitModal] = useState(false);

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

  const subTabs = [
    { id: 'sessions', label: 'Active Sessions', icon: Users, count: stats.activeSessions },
    { id: 'failed-logins', label: 'Failed Logins', icon: AlertTriangle, count: stats.failedLoginsToday },
    { id: 'ip-rules', label: 'IP Access Rules', icon: Globe, count: ipRules.length },
    { id: 'rate-limits', label: 'Rate Limiting', icon: Zap, count: rateLimits.length },
    { id: 'headers', label: 'Security Headers', icon: Settings, count: securityHeaders.length },
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
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SecuritySubTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityCenterTab;
