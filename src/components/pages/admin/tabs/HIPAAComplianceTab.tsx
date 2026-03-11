import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Heart, Shield, FileText, CheckCircle,
  XCircle, RefreshCw, GraduationCap, Lock, AlertCircle
} from 'lucide-react';

// =====================================================
// HIPAA COMPLIANCE TAB - Healthcare Security
// =====================================================

interface PHIAccessRole {
  id: string;
  role_name: string;
  access_level: 'none' | 'limited' | 'treatment' | 'operations' | 'full';
  accessible_phi_types: string[];
  requires_justification: boolean;
  description: string;
}

interface PHIAccessOverride {
  id: string;
  user_id: string;
  phi_type: string;
  justification: string;
  approved_by: string | null;
  approved_at: string | null;
  expires_at: string | null;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
  created_at: string;
}

interface BreachIncident {
  id: string;
  incident_number: string;
  discovered_at: string;
  breach_type: string;
  description: string;
  phi_types_affected: string[];
  individuals_affected: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  notification_required: boolean;
  individuals_notified_at: string | null;
  hhs_notified_at: string | null;
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
}

interface TrainingRecord {
  id: string;
  user_id: string;
  training_type: 'initial' | 'annual_refresh' | 'specialized' | 'remedial';
  training_name: string;
  provider: string;
  completed_at: string | null;
  expires_at: string | null;
  score: number | null;
  passed: boolean;
}

type HIPAASubTab = 'phi-access' | 'overrides' | 'breaches' | 'training';

const HIPAAComplianceTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<HIPAASubTab>('phi-access');
  const [loading, setLoading] = useState(true);
  const [phiRoles, setPhiRoles] = useState<PHIAccessRole[]>([]);
  const [overrides, setOverrides] = useState<PHIAccessOverride[]>([]);
  const [breaches, setBreaches] = useState<BreachIncident[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [_searchQuery] = useState('');

  // Stats
  const [stats, setStats] = useState({
    activeOverrides: 0,
    openBreaches: 0,
    expiredTraining: 0,
    complianceRate: 0
  });

  useEffect(() => {
    loadHIPAAData();
  }, []);

  const loadHIPAAData = async () => {
    setLoading(true);
    try {
      // Load PHI access roles
      const { data: rolesData } = await supabase
        .from('phi_access_roles')
        .select('*')
        .order('access_level');
      setPhiRoles(rolesData || []);

      // Load overrides
      const { data: overridesData } = await supabase
        .from('phi_access_overrides')
        .select('*')
        .order('created_at', { ascending: false });
      setOverrides(overridesData || []);

      // Load breaches
      const { data: breachData } = await supabase
        .from('hipaa_breach_incidents')
        .select('*')
        .order('discovered_at', { ascending: false });
      setBreaches(breachData || []);

      // Load training records
      const { data: trainingData } = await supabase
        .from('hipaa_training_records')
        .select('*')
        .order('expires_at');
      setTrainingRecords(trainingData || []);

      // Calculate stats
      const now = new Date();
      const activeOverrides = (overridesData || []).filter(o => o.status === 'approved').length;
      const openBreaches = (breachData || []).filter(b => b.status !== 'closed').length;
      const expiredTraining = (trainingData || []).filter(t =>
        t.expires_at && new Date(t.expires_at) < now
      ).length;
      const totalTraining = (trainingData || []).length;
      const passedTraining = (trainingData || []).filter(t => t.passed).length;

      setStats({
        activeOverrides,
        openBreaches,
        expiredTraining,
        complianceRate: totalTraining > 0 ? Math.round((passedTraining / totalTraining) * 100) : 0
      });

    } catch (error) {
      console.error('Error loading HIPAA data:', error);
    }
    setLoading(false);
  };

  const updateOverrideStatus = async (id: string, status: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updates: any = { status };
      if (status === 'approved') {
        updates.approved_at = new Date().toISOString();
        updates.approved_by = user?.id;
      }
      await supabase
        .from('phi_access_overrides')
        .update(updates)
        .eq('id', id);
      loadHIPAAData();
    } catch (error) {
      console.error('Error updating override:', error);
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-slate-500/20 text-slate-400';
      case 'limited': return 'bg-blue-500/20 text-blue-400';
      case 'treatment': return 'bg-emerald-500/20 text-emerald-400';
      case 'operations': return 'bg-amber-500/20 text-amber-400';
      case 'full': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const subTabs = [
    { id: 'phi-access', label: 'PHI Access Roles', icon: Lock, count: phiRoles.length },
    { id: 'overrides', label: 'Access Overrides', icon: Shield, count: stats.activeOverrides },
    { id: 'breaches', label: 'Breach Incidents', icon: AlertCircle, count: stats.openBreaches },
    { id: 'training', label: 'Training Compliance', icon: GraduationCap, count: stats.expiredTraining },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-teal-500" />
            HIPAA Compliance
          </h2>
          <p className="text-slate-400 mt-1">Healthcare security and PHI protection management</p>
        </div>
        <button
          onClick={loadHIPAAData}
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
              <p className="text-slate-400 text-sm">Active Overrides</p>
              <p className="text-2xl font-bold text-white">{stats.activeOverrides}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Open Breaches</p>
              <p className="text-2xl font-bold text-white">{stats.openBreaches}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.openBreaches > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              <AlertCircle className={`w-6 h-6 ${stats.openBreaches > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Expired Training</p>
              <p className="text-2xl font-bold text-white">{stats.expiredTraining}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.expiredTraining > 0 ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
              <GraduationCap className={`w-6 h-6 ${stats.expiredTraining > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Compliance Rate</p>
              <p className="text-2xl font-bold text-white">{stats.complianceRate}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.complianceRate >= 90 ? 'bg-emerald-500/20' : stats.complianceRate >= 70 ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
              <CheckCircle className={`w-6 h-6 ${stats.complianceRate >= 90 ? 'text-emerald-500' : stats.complianceRate >= 70 ? 'text-amber-500' : 'text-red-500'}`} />
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
              onClick={() => setActiveSubTab(tab.id as HIPAASubTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubTab === tab.id ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* PHI Access Roles */}
            {activeSubTab === 'phi-access' && (
              <div className="space-y-4">
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-teal-200 font-medium">Minimum Necessary Principle</p>
                      <p className="text-teal-200/70 text-sm mt-1">
                        HIPAA requires limiting PHI access to the minimum necessary for each role. Configure access levels carefully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {phiRoles.map((role) => (
                    <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{role.role_name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs uppercase ${getAccessLevelColor(role.access_level)}`}>
                              {role.access_level}
                            </span>
                            {role.requires_justification && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                                Requires Justification
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mt-2">{role.description}</p>
                          {role.accessible_phi_types && role.accessible_phi_types.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {role.accessible_phi_types.map((type, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {phiRoles.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No PHI access roles configured
                  </div>
                )}
              </div>
            )}

            {/* Access Overrides */}
            {activeSubTab === 'overrides' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">User</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">PHI Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Justification</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Expires</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {overrides.map((override) => (
                        <tr key={override.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white font-mono text-sm">{override.user_id.substring(0, 8)}...</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{override.phi_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-400 text-sm line-clamp-2">{override.justification}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              override.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              override.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              override.status === 'denied' ? 'bg-red-500/20 text-red-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {override.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">
                              {override.expires_at ? new Date(override.expires_at).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {override.status === 'pending' && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => updateOverrideStatus(override.id, 'approved')}
                                  className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateOverrideStatus(override.id, 'denied')}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                  title="Deny"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {overrides.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No access override requests
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Breach Incidents */}
            {activeSubTab === 'breaches' && (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-200 font-medium">HIPAA Breach Notification Rule</p>
                      <p className="text-red-200/70 text-sm mt-1">
                        Breaches affecting 500+ individuals must be reported to HHS within 60 days and to media outlets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Incident</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Risk Level</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Affected</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Notifications</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {breaches.map((breach) => (
                        <tr key={breach.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-mono text-sm">{breach.incident_number}</p>
                              <p className="text-slate-400 text-xs">{new Date(breach.discovered_at).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 capitalize">{breach.breach_type?.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs uppercase ${getRiskLevelColor(breach.risk_level)}`}>
                              {breach.risk_level}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white font-medium">{breach.individuals_affected.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${breach.individuals_notified_at ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                Individuals
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${breach.hhs_notified_at ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                HHS
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              breach.status === 'closed' ? 'bg-slate-700 text-slate-400' :
                              breach.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                              breach.status === 'contained' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {breach.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {breaches.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No breach incidents recorded
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Training Compliance */}
            {activeSubTab === 'training' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">User</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Training</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Completed</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Score</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Expires</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {trainingRecords.map((record) => {
                        const isExpired = record.expires_at && new Date(record.expires_at) < new Date();
                        const isExpiringSoon = record.expires_at &&
                          new Date(record.expires_at) > new Date() &&
                          new Date(record.expires_at) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                        return (
                          <tr key={record.id} className="hover:bg-slate-800/50">
                            <td className="px-4 py-3">
                              <span className="text-white font-mono text-sm">{record.user_id.substring(0, 8)}...</span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-white">{record.training_name}</p>
                                <p className="text-slate-400 text-xs">{record.provider}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-300 capitalize text-sm">{record.training_type.replace('_', ' ')}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-300 text-sm">
                                {record.completed_at ? new Date(record.completed_at).toLocaleDateString() : 'Not completed'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm ${record.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {record.score !== null ? `${record.score}%` : '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-slate-300'}`}>
                                {record.expires_at ? new Date(record.expires_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                isExpired ? 'bg-red-500/20 text-red-400' :
                                !record.passed ? 'bg-amber-500/20 text-amber-400' :
                                'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {isExpired ? 'Expired' : !record.passed ? 'Incomplete' : 'Compliant'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {trainingRecords.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No training records found
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HIPAAComplianceTab;
