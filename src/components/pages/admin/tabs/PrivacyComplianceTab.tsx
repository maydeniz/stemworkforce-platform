import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck, FileText, Clock, AlertTriangle, CheckCircle,
  Eye, Download, Trash2, RefreshCw, Search,
  Lock, Building
} from 'lucide-react';

// =====================================================
// PRIVACY & COMPLIANCE TAB - GDPR/CCPA Compliant
// =====================================================

interface DataSubjectRequest {
  id: string;
  request_number: string;
  user_id: string | null;
  requester_email: string;
  request_type: 'access' | 'deletion' | 'rectification' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'verification_required' | 'completed' | 'denied' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  received_at: string;
  deadline_at: string;
  identity_verified: boolean;
  assigned_to: string | null;
  completed_at: string | null;
  notes: string | null;
}

interface ConsentCategory {
  id: string;
  category_key: string;
  name: string;
  description: string;
  is_required: boolean;
  legal_basis: string;
  display_order: number;
}

interface DataRetentionPolicy {
  id: string;
  data_type: string;
  retention_period_days: number;
  retention_action: 'delete' | 'anonymize' | 'archive';
  legal_basis: string;
  description: string;
  is_active: boolean;
  last_purge_at: string | null;
  next_purge_at: string | null;
}

interface DataProcessingAgreement {
  id: string;
  vendor_name: string;
  vendor_contact_email: string;
  agreement_type: string;
  effective_date: string;
  expiration_date: string | null;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  last_review_date: string | null;
  next_review_date: string | null;
}

interface CCPARecord {
  id: string;
  email: string;
  do_not_sell: boolean;
  do_not_sell_at: string | null;
  verified: boolean;
  created_at: string;
}

type PrivacySubTab = 'dsr' | 'ccpa' | 'consent' | 'retention' | 'dpa';

const PrivacyComplianceTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<PrivacySubTab>('dsr');
  const [loading, setLoading] = useState(true);
  const [dsrRequests, setDsrRequests] = useState<DataSubjectRequest[]>([]);
  const [ccpaRecords, setCcpaRecords] = useState<CCPARecord[]>([]);
  const [consentCategories, setConsentCategories] = useState<ConsentCategory[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
  const [dpas, setDpas] = useState<DataProcessingAgreement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [_selectedDSR, setSelectedDSR] = useState<DataSubjectRequest | null>(null);

  // Stats
  const [stats, setStats] = useState({
    pendingDSRs: 0,
    overdueDSRs: 0,
    doNotSellCount: 0,
    activeDPAs: 0
  });

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    setLoading(true);
    try {
      // Load DSR requests
      const { data: dsrData } = await supabase
        .from('data_subject_requests')
        .select('*')
        .order('received_at', { ascending: false });
      setDsrRequests(dsrData || []);

      // Load CCPA records
      const { data: ccpaData } = await supabase
        .from('ccpa_consumer_rights')
        .select('*')
        .order('created_at', { ascending: false });
      setCcpaRecords(ccpaData || []);

      // Load consent categories
      const { data: consentData } = await supabase
        .from('consent_categories')
        .select('*')
        .order('display_order');
      setConsentCategories(consentData || []);

      // Load retention policies
      const { data: retentionData } = await supabase
        .from('data_retention_policies')
        .select('*')
        .order('data_type');
      setRetentionPolicies(retentionData || []);

      // Load DPAs
      const { data: dpaData } = await supabase
        .from('data_processing_agreements')
        .select('*')
        .order('vendor_name');
      setDpas(dpaData || []);

      // Calculate stats
      const now = new Date();
      const pending = (dsrData || []).filter(d => d.status === 'pending' || d.status === 'in_progress').length;
      const overdue = (dsrData || []).filter(d =>
        (d.status === 'pending' || d.status === 'in_progress') &&
        new Date(d.deadline_at) < now
      ).length;
      const doNotSell = (ccpaData || []).filter(c => c.do_not_sell).length;
      const activeDPAs = (dpaData || []).filter(d => d.status === 'active').length;

      setStats({
        pendingDSRs: pending,
        overdueDSRs: overdue,
        doNotSellCount: doNotSell,
        activeDPAs: activeDPAs
      });

    } catch (error) {
      console.error('Error loading privacy data:', error);
    }
    setLoading(false);
  };

  const updateDSRStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      await supabase
        .from('data_subject_requests')
        .update(updates)
        .eq('id', id);
      loadPrivacyData();
    } catch (error) {
      console.error('Error updating DSR:', error);
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'verification_required': return 'bg-purple-500/20 text-purple-400';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400';
      case 'denied': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="w-4 h-4" />;
      case 'deletion': return <Trash2 className="w-4 h-4" />;
      case 'portability': return <Download className="w-4 h-4" />;
      case 'rectification': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const subTabs = [
    { id: 'dsr', label: 'Data Subject Requests', icon: FileText, count: stats.pendingDSRs },
    { id: 'ccpa', label: 'CCPA Opt-Outs', icon: Lock, count: stats.doNotSellCount },
    { id: 'consent', label: 'Consent Management', icon: CheckCircle, count: consentCategories.length },
    { id: 'retention', label: 'Data Retention', icon: Clock, count: retentionPolicies.length },
    { id: 'dpa', label: 'DPA Tracker', icon: Building, count: stats.activeDPAs },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-blue-500" />
            Privacy & Compliance
          </h2>
          <p className="text-slate-400 mt-1">GDPR, CCPA, and data privacy management</p>
        </div>
        <button
          onClick={loadPrivacyData}
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
              <p className="text-slate-400 text-sm">Pending DSRs</p>
              <p className="text-2xl font-bold text-white">{stats.pendingDSRs}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Overdue DSRs</p>
              <p className="text-2xl font-bold text-white">{stats.overdueDSRs}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.overdueDSRs > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.overdueDSRs > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Do Not Sell Requests</p>
              <p className="text-2xl font-bold text-white">{stats.doNotSellCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active DPAs</p>
              <p className="text-2xl font-bold text-white">{stats.activeDPAs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-500" />
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
              onClick={() => setActiveSubTab(tab.id as PrivacySubTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
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
            {/* Data Subject Requests */}
            {activeSubTab === 'dsr' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by email or request number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="verification_required">Verification Required</option>
                    <option value="completed">Completed</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>

                {/* DSR Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Request</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Requester</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Deadline</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {dsrRequests
                        .filter(dsr =>
                          (statusFilter === 'all' || dsr.status === statusFilter) &&
                          (dsr.requester_email.includes(searchQuery) || dsr.request_number?.includes(searchQuery))
                        )
                        .map((dsr) => {
                          const daysRemaining = getDaysRemaining(dsr.deadline_at);
                          const isOverdue = daysRemaining < 0;

                          return (
                            <tr key={dsr.id} className="hover:bg-slate-800/50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-white font-mono text-sm">{dsr.request_number || 'N/A'}</p>
                                  <p className="text-slate-400 text-xs">{new Date(dsr.received_at).toLocaleDateString()}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400">{getRequestTypeIcon(dsr.request_type)}</span>
                                  <span className="text-white capitalize">{dsr.request_type}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-white">{dsr.requester_email}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {dsr.identity_verified ? (
                                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                                        <CheckCircle className="w-3 h-3" /> Verified
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-xs text-amber-400">
                                        <AlertTriangle className="w-3 h-3" /> Unverified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dsr.status)}`}>
                                  {dsr.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400' : daysRemaining <= 5 ? 'text-amber-400' : 'text-slate-300'}`}>
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">
                                    {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d remaining`}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedDSR(dsr)}
                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {dsr.status === 'pending' && (
                                    <button
                                      onClick={() => updateDSRStatus(dsr.id, 'in_progress')}
                                      className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                      title="Start Processing"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {dsrRequests.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No data subject requests found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CCPA Opt-Outs */}
            {activeSubTab === 'ccpa' && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-purple-200 font-medium">CCPA Consumer Rights</p>
                      <p className="text-purple-200/70 text-sm mt-1">
                        Track and honor "Do Not Sell My Personal Information" requests under CCPA/CPRA.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Do Not Sell</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Opt-Out Date</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ccpaRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white">{record.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.do_not_sell
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}>
                              {record.do_not_sell ? 'Opted Out' : 'Not Opted Out'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">
                              {record.do_not_sell_at ? new Date(record.do_not_sell_at).toLocaleDateString() : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {record.verified ? (
                              <span className="flex items-center gap-1 text-emerald-400 text-sm">
                                <CheckCircle className="w-4 h-4" /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-400 text-sm">
                                <AlertTriangle className="w-4 h-4" /> Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ccpaRecords.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No CCPA records found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Consent Management */}
            {activeSubTab === 'consent' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    + Add Consent Category
                  </button>
                </div>

                <div className="grid gap-4">
                  {consentCategories.map((category) => (
                    <div key={category.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{category.name}</h4>
                            {category.is_required && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">Required</span>
                            )}
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs capitalize">
                              {category.legal_basis?.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mt-2">{category.description}</p>
                          <p className="text-slate-500 text-xs mt-2 font-mono">Key: {category.category_key}</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {consentCategories.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No consent categories configured
                  </div>
                )}
              </div>
            )}

            {/* Data Retention */}
            {activeSubTab === 'retention' && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 font-medium">Data Retention Policies</p>
                      <p className="text-amber-200/70 text-sm mt-1">
                        Configure how long different types of data are retained before automatic deletion or anonymization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Data Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Retention Period</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Action</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Legal Basis</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Last Purge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {retentionPolicies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white capitalize">{policy.data_type.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{policy.retention_period_days} days</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              policy.retention_action === 'delete' ? 'bg-red-500/20 text-red-400' :
                              policy.retention_action === 'anonymize' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {policy.retention_action}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-400 text-sm">{policy.legal_basis}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              policy.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                            }`}>
                              {policy.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-400 text-sm">
                              {policy.last_purge_at ? new Date(policy.last_purge_at).toLocaleDateString() : 'Never'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {retentionPolicies.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No retention policies configured
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DPA Tracker */}
            {activeSubTab === 'dpa' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    + Add DPA
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Vendor</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Effective Date</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Expiration</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Next Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {dpas.map((dpa) => (
                        <tr key={dpa.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white">{dpa.vendor_name}</p>
                              <p className="text-slate-400 text-xs">{dpa.vendor_contact_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 uppercase text-sm">{dpa.agreement_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">{new Date(dpa.effective_date).toLocaleDateString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">
                              {dpa.expiration_date ? new Date(dpa.expiration_date).toLocaleDateString() : 'No expiration'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              dpa.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                              dpa.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                              dpa.status === 'pending_signature' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {dpa.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-400 text-sm">
                              {dpa.next_review_date ? new Date(dpa.next_review_date).toLocaleDateString() : '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dpas.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No DPAs found
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

export default PrivacyComplianceTab;
