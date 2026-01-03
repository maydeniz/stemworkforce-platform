// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ClipboardCheck, Users, FileText, AlertTriangle, CheckCircle,
  XCircle, Eye, RefreshCw, Search, Clock, Building, Shield, Settings
} from 'lucide-react';

// =====================================================
// SOC 2 & AUDIT TAB - Compliance & Risk Management
// =====================================================

interface AccessReviewCampaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  total_items: number;
  reviewed_items: number;
  approved_items: number;
  revoked_items: number;
}

interface ChangeRequest {
  id: string;
  change_number: string;
  title: string;
  description: string;
  change_type: string;
  risk_level: string;
  approval_status: string;
  status: string;
  requested_at: string;
}

interface SecurityIncident {
  id: string;
  incident_number: string;
  title: string;
  description: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  detected_at: string;
  status: string;
  affected_users: number;
}

interface Vendor {
  id: string;
  name: string;
  vendor_type: string;
  criticality: string;
  data_access_level: string;
  soc2_certified: boolean;
  hipaa_compliant: boolean;
  risk_score: number;
  last_assessment_date: string;
  status: string;
}

type SOC2SubTab = 'reviews' | 'changes' | 'incidents' | 'vendors';

const SOC2AuditTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SOC2SubTab>('reviews');
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<AccessReviewCampaign[]>([]);
  const [changes, setChanges] = useState<ChangeRequest[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Stats
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    pendingChanges: 0,
    openIncidents: 0,
    highRiskVendors: 0
  });

  useEffect(() => {
    loadSOC2Data();
  }, []);

  const loadSOC2Data = async () => {
    setLoading(true);
    try {
      // Load campaigns
      const { data: campaignsData } = await supabase
        .from('access_review_campaigns')
        .select('*')
        .order('start_date', { ascending: false });
      setCampaigns(campaignsData || []);

      // Load changes
      const { data: changesData } = await supabase
        .from('change_requests')
        .select('*')
        .order('requested_at', { ascending: false });
      setChanges(changesData || []);

      // Load incidents
      const { data: incidentsData } = await supabase
        .from('security_incidents')
        .select('*')
        .order('detected_at', { ascending: false });
      setIncidents(incidentsData || []);

      // Load vendors
      const { data: vendorsData } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      setVendors(vendorsData || []);

      // Calculate stats
      const activeCampaigns = (campaignsData || []).filter(c => c.status === 'active').length;
      const pendingChanges = (changesData || []).filter(c => c.approval_status === 'pending').length;
      const openIncidents = (incidentsData || []).filter(i => i.status !== 'closed').length;
      const highRiskVendors = (vendorsData || []).filter(v => v.risk_score && v.risk_score > 50).length;

      setStats({
        activeCampaigns,
        pendingChanges,
        openIncidents,
        highRiskVendors
      });

    } catch (error) {
      console.error('Error loading SOC2 data:', error);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'P1': return 'bg-red-500/20 text-red-400';
      case 'P2': return 'bg-orange-500/20 text-orange-400';
      case 'P3': return 'bg-amber-500/20 text-amber-400';
      case 'P4': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 25) return 'text-emerald-400';
    if (score <= 50) return 'text-amber-400';
    if (score <= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const subTabs = [
    { id: 'reviews', label: 'Access Reviews', icon: Users, count: stats.activeCampaigns },
    { id: 'changes', label: 'Change Management', icon: Settings, count: stats.pendingChanges },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, count: stats.openIncidents },
    { id: 'vendors', label: 'Vendor Risk', icon: Building, count: stats.highRiskVendors },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-violet-500" />
            SOC 2 & Audit
          </h2>
          <p className="text-slate-400 mt-1">Access reviews, change management, and vendor risk</p>
        </div>
        <button
          onClick={loadSOC2Data}
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
              <p className="text-slate-400 text-sm">Active Reviews</p>
              <p className="text-2xl font-bold text-white">{stats.activeCampaigns}</p>
            </div>
            <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Changes</p>
              <p className="text-2xl font-bold text-white">{stats.pendingChanges}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.pendingChanges > 0 ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
              <Settings className={`w-6 h-6 ${stats.pendingChanges > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Open Incidents</p>
              <p className="text-2xl font-bold text-white">{stats.openIncidents}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.openIncidents > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.openIncidents > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">High-Risk Vendors</p>
              <p className="text-2xl font-bold text-white">{stats.highRiskVendors}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.highRiskVendors > 0 ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
              <Building className={`w-6 h-6 ${stats.highRiskVendors > 0 ? 'text-orange-500' : 'text-emerald-500'}`} />
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
              onClick={() => setActiveSubTab(tab.id as SOC2SubTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'text-violet-500 border-b-2 border-violet-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubTab === tab.id ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-400'
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
            {/* Access Reviews */}
            {activeSubTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                    + New Campaign
                  </button>
                </div>

                <div className="grid gap-4">
                  {campaigns.map((campaign) => {
                    const progress = campaign.total_items > 0
                      ? Math.round((campaign.reviewed_items / campaign.total_items) * 100)
                      : 0;

                    return (
                      <div key={campaign.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-medium">{campaign.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-slate-700 text-slate-400'
                              }`}>
                                {campaign.status}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs capitalize">
                                {campaign.campaign_type?.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm mt-2">{campaign.description}</p>

                            {/* Progress bar */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                <span>{campaign.reviewed_items} of {campaign.total_items} reviewed</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-500 transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex gap-4 mt-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                {campaign.approved_items} approved
                              </span>
                              <span className="flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-400" />
                                {campaign.revoked_items} revoked
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Ends {new Date(campaign.end_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {campaigns.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No access review campaigns
                  </div>
                )}
              </div>
            )}

            {/* Change Management */}
            {activeSubTab === 'changes' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Change</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Risk</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Approval</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {changes.map((change) => (
                        <tr key={change.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-mono text-sm">{change.change_number}</p>
                              <p className="text-slate-300 text-sm">{change.title}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 capitalize text-sm">{change.change_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs uppercase ${getCriticalityColor(change.risk_level)}`}>
                              {change.risk_level}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              change.approval_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              change.approval_status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              change.approval_status === 'denied' ? 'bg-red-500/20 text-red-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {change.approval_status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              change.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              change.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {change.status?.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {changes.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No change requests
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Incidents */}
            {activeSubTab === 'incidents' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Incident</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Severity</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Affected</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Detected</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-mono text-sm">{incident.incident_number}</p>
                              <p className="text-slate-300 text-sm line-clamp-1">{incident.title}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                              {incident.severity}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 capitalize text-sm">{incident.category?.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white">{incident.affected_users}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 text-sm">{new Date(incident.detected_at).toLocaleDateString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              incident.status === 'closed' ? 'bg-slate-700 text-slate-400' :
                              incident.status === 'recovered' ? 'bg-emerald-500/20 text-emerald-400' :
                              incident.status === 'contained' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {incident.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {incidents.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No security incidents
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vendor Risk */}
            {activeSubTab === 'vendors' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Vendor</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Criticality</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Data Access</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Certifications</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {vendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                            <span className="text-white">{vendor.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 capitalize text-sm">{vendor.vendor_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs uppercase ${getCriticalityColor(vendor.criticality)}`}>
                              {vendor.criticality}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300 capitalize text-sm">{vendor.data_access_level}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {vendor.soc2_certified && (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">SOC 2</span>
                              )}
                              {vendor.hipaa_compliant && (
                                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded text-xs">HIPAA</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono font-medium ${getRiskScoreColor(vendor.risk_score || 0)}`}>
                              {vendor.risk_score || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {vendors.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No vendors registered
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

export default SOC2AuditTab;
