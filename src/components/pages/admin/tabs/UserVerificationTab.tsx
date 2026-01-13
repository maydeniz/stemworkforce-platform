// ===========================================
// User Verification Tab - Admin Dashboard
// ===========================================
// Manages pending user verifications:
// - View users pending email domain verification
// - Manually approve or reject users
// - View verified users history
// ===========================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  UserCheck, UserX, Clock, CheckCircle2, XCircle,
  Search, RefreshCw, Mail, Building2,
  Calendar, AlertTriangle, Shield
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

interface PendingUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  verification_status: string;
  email_domain: string;
  organization_name: string | null;
  org_allowed_domains: string[] | null;
  institution_name: string | null;
  inst_allowed_domains: string[] | null;
}

interface VerifiedUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  verification_status: string;
  verified_at: string;
  organization_name: string | null;
  institution_name: string | null;
}

// ===========================================
// SUB-TAB NAVIGATION
// ===========================================

type SubTab = 'pending' | 'verified' | 'rejected';

const SUB_TABS = [
  { id: 'pending' as SubTab, label: 'Pending Verification', icon: Clock },
  { id: 'verified' as SubTab, label: 'Verified Users', icon: CheckCircle2 },
  { id: 'rejected' as SubTab, label: 'Rejected', icon: XCircle },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const UserVerificationTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('pending');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<VerifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    type: 'approve' | 'reject';
    user: PendingUser;
  } | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchPendingUsers();
    fetchVerifiedUsers();
    fetchRejectedUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          verification_status,
          organization_id,
          institution_id,
          organizations (name, allowed_domains),
          institutions (name, allowed_domains)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: PendingUser[] = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'unknown',
        created_at: user.created_at,
        verification_status: user.verification_status,
        email_domain: user.email?.split('@')[1] || '',
        organization_name: user.organizations?.name || null,
        org_allowed_domains: user.organizations?.allowed_domains || null,
        institution_name: user.institutions?.name || null,
        inst_allowed_domains: user.institutions?.allowed_domains || null,
      }));

      setPendingUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifiedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          verification_status,
          verified_at,
          organization_id,
          institution_id,
          organizations (name),
          institutions (name)
        `)
        .in('verification_status', ['verified', 'manually_verified'])
        .order('verified_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedUsers: VerifiedUser[] = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'unknown',
        verification_status: user.verification_status,
        verified_at: user.verified_at,
        organization_name: user.organizations?.name || null,
        institution_name: user.institutions?.name || null,
      }));

      setVerifiedUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching verified users:', error);
    }
  };

  const fetchRejectedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          verification_status,
          verified_at,
          organization_id,
          institution_id,
          organizations (name),
          institutions (name)
        `)
        .eq('verification_status', 'rejected')
        .order('verified_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedUsers: VerifiedUser[] = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'unknown',
        verification_status: user.verification_status,
        verified_at: user.verified_at,
        organization_name: user.organizations?.name || null,
        institution_name: user.institutions?.name || null,
      }));

      setRejectedUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching rejected users:', error);
    }
  };

  const handleApprove = async (user: PendingUser) => {
    setProcessingId(user.id);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          email_domain_verified: true,
          verification_status: 'manually_verified',
          verified_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh lists
      await fetchPendingUsers();
      await fetchVerifiedUsers();
      setShowConfirmModal(null);
      setVerificationNotes('');
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (user: PendingUser) => {
    setProcessingId(user.id);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          email_domain_verified: false,
          verification_status: 'rejected',
          verified_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh lists
      await fetchPendingUsers();
      await fetchRejectedUsers();
      setShowConfirmModal(null);
      setVerificationNotes('');
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = () => {
    fetchPendingUsers();
    fetchVerifiedUsers();
    fetchRejectedUsers();
  };

  // Filter users based on search query
  const filterUsers = <T extends { email: string; first_name: string; last_name: string }>(users: T[]) => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user =>
      user.email.toLowerCase().includes(query) ||
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      partner_lab: 'bg-purple-500/20 text-purple-400',
      partner_federal: 'bg-blue-500/20 text-blue-400',
      partner_academic: 'bg-cyan-500/20 text-cyan-400',
      educator: 'bg-green-500/20 text-green-400',
      partner_industry: 'bg-orange-500/20 text-orange-400',
      partner_nonprofit: 'bg-pink-500/20 text-pink-400',
      jobseeker: 'bg-gray-500/20 text-gray-400',
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  const formatRole = (role: string) => {
    const roleNames: Record<string, string> = {
      partner_lab: 'National Lab',
      partner_federal: 'Federal Agency',
      partner_academic: 'Academic',
      educator: 'Educator',
      partner_industry: 'Industry',
      partner_nonprofit: 'Non-Profit',
      jobseeker: 'Job Seeker',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Verification</h2>
          <p className="text-gray-400 mt-1">Manage pending user verifications and approvals</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Clock className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingUsers.length}</p>
              <p className="text-sm text-gray-400">Pending Verification</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{verifiedUsers.length}</p>
              <p className="text-sm text-gray-400">Verified Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <XCircle className="text-red-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{rejectedUsers.length}</p>
              <p className="text-sm text-gray-400">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="border-b border-slate-700">
        <div className="flex gap-1">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeSubTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'pending' && pendingUsers.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <>
          {/* Pending Users Tab */}
          {activeSubTab === 'pending' && (
            <div className="space-y-4">
              {filterUsers(pendingUsers).length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
                  <CheckCircle2 className="mx-auto text-green-400 mb-4" size={48} />
                  <p className="text-xl font-medium text-white">All caught up!</p>
                  <p className="text-gray-400 mt-2">No pending verifications at this time.</p>
                </div>
              ) : (
                filterUsers(pendingUsers).map((user) => (
                  <div
                    key={user.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-gray-400">{user.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Organization/Institution */}
                          <div className="flex items-start gap-2">
                            <Building2 className="text-gray-500 mt-0.5" size={16} />
                            <div>
                              <p className="text-sm text-gray-400">Organization</p>
                              <p className="text-white">
                                {user.organization_name || user.institution_name || 'Not specified'}
                              </p>
                            </div>
                          </div>

                          {/* Email Domain */}
                          <div className="flex items-start gap-2">
                            <Mail className="text-gray-500 mt-0.5" size={16} />
                            <div>
                              <p className="text-sm text-gray-400">Email Domain</p>
                              <p className="text-white">@{user.email_domain}</p>
                            </div>
                          </div>

                          {/* Expected Domains */}
                          <div className="flex items-start gap-2">
                            <Shield className="text-gray-500 mt-0.5" size={16} />
                            <div>
                              <p className="text-sm text-gray-400">Expected Domains</p>
                              <p className="text-white">
                                {(user.org_allowed_domains || user.inst_allowed_domains)?.join(', ') || 'None configured'}
                              </p>
                            </div>
                          </div>

                          {/* Registered At */}
                          <div className="flex items-start gap-2">
                            <Calendar className="text-gray-500 mt-0.5" size={16} />
                            <div>
                              <p className="text-sm text-gray-400">Registered</p>
                              <p className="text-white">{formatDate(user.created_at)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Domain Mismatch Warning */}
                        {(user.org_allowed_domains || user.inst_allowed_domains) &&
                          !(user.org_allowed_domains?.includes(user.email_domain) ||
                            user.inst_allowed_domains?.includes(user.email_domain)) && (
                          <div className="mt-4 flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
                            <AlertTriangle size={16} />
                            <span className="text-sm">
                              Email domain does not match organization's allowed domains
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setShowConfirmModal({ type: 'approve', user })}
                          disabled={processingId === user.id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserCheck size={18} />
                          Approve
                        </button>
                        <button
                          onClick={() => setShowConfirmModal({ type: 'reject', user })}
                          disabled={processingId === user.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserX size={18} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Verified Users Tab */}
          {activeSubTab === 'verified' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Organization</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Verification</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Verified At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filterUsers(verifiedUsers).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No verified users found
                      </td>
                    </tr>
                  ) : (
                    filterUsers(verifiedUsers).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center font-bold text-white text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {user.organization_name || user.institution_name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.verification_status === 'manually_verified'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {user.verification_status === 'manually_verified' ? 'Manual' : 'Auto'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {user.verified_at ? formatDate(user.verified_at) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Rejected Users Tab */}
          {activeSubTab === 'rejected' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Organization</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Rejected At</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filterUsers(rejectedUsers).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No rejected users
                      </td>
                    </tr>
                  ) : (
                    filterUsers(rejectedUsers).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center font-bold text-white text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {user.organization_name || user.institution_name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {user.verified_at ? formatDate(user.verified_at) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              // Re-approve a rejected user
                              setShowConfirmModal({
                                type: 'approve',
                                user: user as any
                              });
                            }}
                            className="text-sm text-cyan-400 hover:text-cyan-300"
                          >
                            Reconsider
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {showConfirmModal.type === 'approve' ? 'Approve User' : 'Reject User'}
            </h3>

            <p className="text-gray-400 mb-4">
              Are you sure you want to {showConfirmModal.type === 'approve' ? 'approve' : 'reject'}{' '}
              <span className="text-white font-medium">
                {showConfirmModal.user.first_name} {showConfirmModal.user.last_name}
              </span>
              ?
            </p>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(null);
                  setVerificationNotes('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showConfirmModal.type === 'approve') {
                    handleApprove(showConfirmModal.user);
                  } else {
                    handleReject(showConfirmModal.user);
                  }
                }}
                disabled={processingId === showConfirmModal.user.id}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  showConfirmModal.type === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {processingId === showConfirmModal.user.id ? 'Processing...' :
                  showConfirmModal.type === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationTab;
