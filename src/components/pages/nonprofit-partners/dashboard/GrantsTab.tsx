// ===========================================
// Grants Tab - Nonprofit Partner Dashboard
// Grant tracking and reporting
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  DollarSign,
  Calendar,
  Target,
  CheckCircle,
  FileText,
  Loader2,
  TrendingUp,
  X
} from 'lucide-react';
import { getGrants } from '@/services/nonprofitPartnerApi';
import type { Grant, GrantStatus, PartnerTier } from '@/types/nonprofitPartner';

interface GrantsTabProps {
  partnerId: string;
  tier: PartnerTier;
}

const SAMPLE_GRANTS: Grant[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'DOL WIOA Adult & DW Grant',
    funderName: 'U.S. Department of Labor',
    funderType: 'federal',
    grantNumber: 'DOL-ETA-24-001',
    awardAmount: 1250000,
    disbursedAmount: 625000,
    startDate: '2024-07-01',
    endDate: '2027-06-30',
    targetEnrollment: 500,
    targetPlacements: 350,
    targetRetentionRate: 80,
    actualEnrollment: 234,
    actualPlacements: 156,
    actualRetentionRate: 82,
    status: 'active',
    programIds: ['1', '2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    partnerId: '1',
    name: 'Tech Training Initiative',
    funderName: 'Google.org',
    funderType: 'corporate',
    awardAmount: 500000,
    disbursedAmount: 200000,
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    targetEnrollment: 200,
    targetPlacements: 150,
    actualEnrollment: 89,
    actualPlacements: 45,
    status: 'active',
    programIds: ['1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STATUS_COLORS: Record<GrantStatus, string> = {
  prospecting: 'bg-gray-500',
  applied: 'bg-blue-500',
  awarded: 'bg-purple-500',
  active: 'bg-emerald-500',
  reporting: 'bg-amber-500',
  closed: 'bg-gray-600',
  denied: 'bg-red-500'
};

interface AddGrantFormData {
  name: string;
  funderName: string;
  funderType: string;
  grantNumber: string;
  awardAmount: string;
  startDate: string;
  endDate: string;
  targetEnrollment: string;
  targetPlacements: string;
}

const EMPTY_GRANT_FORM: AddGrantFormData = {
  name: '',
  funderName: '',
  funderType: 'federal',
  grantNumber: '',
  awardAmount: '',
  startDate: '',
  endDate: '',
  targetEnrollment: '',
  targetPlacements: ''
};

export const GrantsTab: React.FC<GrantsTabProps> = ({ partnerId, tier }) => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddGrantModal, setShowAddGrantModal] = useState(false);
  const [grantFormData, setGrantFormData] = useState<AddGrantFormData>(EMPTY_GRANT_FORM);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showCreateReportModal, setShowCreateReportModal] = useState<Grant | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadGrants();
  }, [partnerId]);

  const loadGrants = async () => {
    setLoading(true);
    const data = await getGrants(partnerId);
    setGrants(data.length > 0 ? data : SAMPLE_GRANTS);
    setLoading(false);
  };

  const filteredGrants = grants.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.funderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canAccessReporting = tier !== 'community';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  if (!canAccessReporting) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Grant Management</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Track grant funding, automate reporting, and monitor performance against targets.
          Upgrade to Impact to access grant management tools.
        </p>
        <button
          onClick={() => window.location.href = '/education-partner-apply?type=nonprofit&plan=impact'}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition-colors"
        >
          Upgrade to Impact - $249/mo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Grants</h2>
          <p className="text-gray-400">Track funding and performance against targets</p>
        </div>
        <button
          onClick={() => { setGrantFormData(EMPTY_GRANT_FORM); setShowAddGrantModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Grant
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg text-sm flex items-center justify-between ${
          notification.type === 'success'
            ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400'
            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                ${(grants.reduce((sum, g) => sum + (g.awardAmount || 0), 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-400">Total Funding</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {grants.filter(g => g.status === 'active').length}
              </p>
              <p className="text-xs text-gray-400">Active Grants</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {grants.filter(g => g.status === 'reporting').length}
              </p>
              <p className="text-xs text-gray-400">Reports Due</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {Math.round(grants.reduce((sum, g) => sum + (g.actualPlacements || 0), 0) /
                  Math.max(1, grants.reduce((sum, g) => sum + (g.targetPlacements || 0), 0)) * 100)}%
              </p>
              <p className="text-xs text-gray-400">Goal Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="reporting">Reporting</option>
          <option value="applied">Applied</option>
          <option value="prospecting">Prospecting</option>
        </select>
      </div>

      {/* Grants List */}
      <div className="space-y-4">
        {filteredGrants.map(grant => {
          const enrollmentProgress = grant.targetEnrollment
            ? ((grant.actualEnrollment || 0) / grant.targetEnrollment) * 100
            : 0;
          const placementProgress = grant.targetPlacements
            ? ((grant.actualPlacements || 0) / grant.targetPlacements) * 100
            : 0;
          const spendingProgress = grant.awardAmount
            ? ((grant.disbursedAmount || 0) / grant.awardAmount) * 100
            : 0;

          return (
            <motion.div
              key={grant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{grant.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${STATUS_COLORS[grant.status]}`}>
                      {grant.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{grant.funderName}</p>
                  {grant.grantNumber && (
                    <p className="text-gray-500 text-xs mt-1">Grant #{grant.grantNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">
                    ${((grant.awardAmount || 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-400">Award Amount</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Enrollment</span>
                    <span className="text-gray-300">{grant.actualEnrollment || 0}/{grant.targetEnrollment || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${enrollmentProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, enrollmentProgress)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Placements</span>
                    <span className="text-gray-300">{grant.actualPlacements || 0}/{grant.targetPlacements || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${placementProgress >= 100 ? 'bg-emerald-500' : 'bg-pink-500'}`}
                      style={{ width: `${Math.min(100, placementProgress)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Spending</span>
                    <span className="text-gray-300">${((grant.disbursedAmount || 0) / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, spendingProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {grant.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(grant.startDate).toLocaleDateString()} - {grant.endDate ? new Date(grant.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  )}
                  {grant.actualRetentionRate && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      {grant.actualRetentionRate}% retention
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGrant(grant)}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowCreateReportModal(grant)}
                    className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-500"
                  >
                    Create Report
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredGrants.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No grants found</p>
          </div>
        )}
      </div>

      {/* Add Grant Modal */}
      {showAddGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddGrantModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Grant</h3>
              <button onClick={() => setShowAddGrantModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Grant Name *</label>
                <input type="text" value={grantFormData.name} onChange={(e) => setGrantFormData({ ...grantFormData, name: e.target.value })} placeholder="e.g., DOL WIOA Adult Grant" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Funder Name *</label>
                  <input type="text" value={grantFormData.funderName} onChange={(e) => setGrantFormData({ ...grantFormData, funderName: e.target.value })} placeholder="e.g., U.S. Department of Labor" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Funder Type</label>
                  <select value={grantFormData.funderType} onChange={(e) => setGrantFormData({ ...grantFormData, funderType: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                    <option value="federal">Federal</option>
                    <option value="state">State</option>
                    <option value="local">Local</option>
                    <option value="foundation">Foundation</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Grant Number</label>
                  <input type="text" value={grantFormData.grantNumber} onChange={(e) => setGrantFormData({ ...grantFormData, grantNumber: e.target.value })} placeholder="e.g., DOL-ETA-24-001" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Award Amount *</label>
                  <input type="number" value={grantFormData.awardAmount} onChange={(e) => setGrantFormData({ ...grantFormData, awardAmount: e.target.value })} placeholder="e.g., 500000" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input type="date" value={grantFormData.startDate} onChange={(e) => setGrantFormData({ ...grantFormData, startDate: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input type="date" value={grantFormData.endDate} onChange={(e) => setGrantFormData({ ...grantFormData, endDate: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Target Enrollment</label>
                  <input type="number" value={grantFormData.targetEnrollment} onChange={(e) => setGrantFormData({ ...grantFormData, targetEnrollment: e.target.value })} placeholder="e.g., 200" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Target Placements</label>
                  <input type="number" value={grantFormData.targetPlacements} onChange={(e) => setGrantFormData({ ...grantFormData, targetPlacements: e.target.value })} placeholder="e.g., 150" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddGrantModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  if (!grantFormData.name || !grantFormData.funderName) return;
                  setShowAddGrantModal(false);
                  setNotification({ type: 'success', message: `Grant "${grantFormData.name}" added successfully.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Add Grant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Detail Modal */}
      {selectedGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedGrant(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedGrant.name}</h3>
              <button onClick={() => setSelectedGrant(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs text-white ${STATUS_COLORS[selectedGrant.status]}`}>{selectedGrant.status}</span>
                <span className="text-sm text-gray-400">{selectedGrant.funderName}</span>
                {selectedGrant.grantNumber && <span className="text-xs text-gray-500">#{selectedGrant.grantNumber}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400">Award Amount</p>
                  <p className="text-lg font-bold text-emerald-400">${((selectedGrant.awardAmount || 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400">Disbursed</p>
                  <p className="text-lg font-bold text-white">${((selectedGrant.disbursedAmount || 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-white">{selectedGrant.actualEnrollment || 0}</p>
                  <p className="text-xs text-gray-400">Enrolled / {selectedGrant.targetEnrollment || 0}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-white">{selectedGrant.actualPlacements || 0}</p>
                  <p className="text-xs text-gray-400">Placed / {selectedGrant.targetPlacements || 0}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-xl font-bold text-white">{selectedGrant.actualRetentionRate || 0}%</p>
                  <p className="text-xs text-gray-400">Retention</p>
                </div>
              </div>

              {selectedGrant.startDate && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedGrant.startDate).toLocaleDateString()} - {selectedGrant.endDate ? new Date(selectedGrant.endDate).toLocaleDateString() : 'Ongoing'}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button onClick={() => setSelectedGrant(null)} className="px-4 py-2 text-gray-400 hover:text-white">Close</button>
              <button
                onClick={() => { setSelectedGrant(null); setShowCreateReportModal(selectedGrant); }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateReportModal(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Create Report</h3>
                <p className="text-sm text-gray-400">For: {showCreateReportModal.name}</p>
              </div>
              <button onClick={() => setShowCreateReportModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Report Type</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                  <option value="quarterly">Quarterly Report</option>
                  <option value="annual">Annual Report</option>
                  <option value="interim">Interim Report</option>
                  <option value="final">Final Report</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Period Start</label>
                  <input type="date" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Period End</label>
                  <input type="date" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Narrative Summary</label>
                <textarea rows={3} placeholder="Describe key outcomes and highlights for this period..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateReportModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  setShowCreateReportModal(null);
                  setNotification({ type: 'success', message: `Report created for "${showCreateReportModal.name}". You can now fill in the detailed metrics.` });
                }}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantsTab;
