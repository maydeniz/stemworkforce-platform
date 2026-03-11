// ===========================================
// Staff Management Tab - Enterprise Admin
// ===========================================
// Provides comprehensive staff management including:
// - Staff directory with role assignments
// - Invite new staff members
// - Role management and permissions
// - Pending invitations tracking
// - Activity logs per staff member
// ===========================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users, UserPlus, Shield, Mail, Clock, CheckCircle2,
  XCircle, Search,
  ChevronRight, Edit2, Trash2, RefreshCw,
  Key, Building2, AlertTriangle, Send,
  UserCheck, Crown, Lock, Unlock, Globe
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

interface AdminRole {
  id: string;
  name: string;
  display_name: string;
  description: string;
  hierarchy_level: number;
  is_system_role: boolean;
}

interface StaffMember {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AdminRole;
  organization_id?: string;
  organization_name?: string;
  assigned_at: string;
  assigned_by_name?: string;
  is_active: boolean;
  last_login?: string;
  permissions_count?: number;
}

interface StaffInvitation {
  id: string;
  email: string;
  role_id: string;
  role_name: string;
  invited_by_name: string;
  invited_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
}

interface Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  is_sensitive: boolean;
}

// ===========================================
// SUB-TAB NAVIGATION
// ===========================================

type SubTab = 'directory' | 'invitations' | 'roles' | 'activity';

const SUB_TABS = [
  { id: 'directory' as SubTab, label: 'Staff Directory', icon: Users },
  { id: 'invitations' as SubTab, label: 'Invitations', icon: Mail },
  { id: 'roles' as SubTab, label: 'Roles & Permissions', icon: Shield },
  { id: 'activity' as SubTab, label: 'Activity Log', icon: Clock },
];

// ===========================================
// SAMPLE DATA (fallback when database is empty)
// ===========================================

const SAMPLE_ROLES: AdminRole[] = [
  { id: 'role-1', name: 'SUPER_ADMIN', display_name: 'Super Administrator', description: 'Full platform access with all permissions', hierarchy_level: 1, is_system_role: true },
  { id: 'role-2', name: 'PLATFORM_ADMIN', display_name: 'Platform Administrator', description: 'Full system access without role management', hierarchy_level: 2, is_system_role: true },
  { id: 'role-3', name: 'SECURITY_ADMIN', display_name: 'Security Administrator', description: 'Security and compliance management', hierarchy_level: 3, is_system_role: true },
  { id: 'role-4', name: 'COMPLIANCE_ADMIN', display_name: 'Compliance Administrator', description: 'OFCCP, HIPAA, and regulatory compliance', hierarchy_level: 3, is_system_role: true },
  { id: 'role-5', name: 'BILLING_ADMIN', display_name: 'Billing Administrator', description: 'Billing and subscription management', hierarchy_level: 3, is_system_role: true },
  { id: 'role-6', name: 'CONTENT_ADMIN', display_name: 'Content Administrator', description: 'Content moderation and management', hierarchy_level: 3, is_system_role: true },
  { id: 'role-7', name: 'SUPPORT_ADMIN', display_name: 'Support Administrator', description: 'Customer support management', hierarchy_level: 3, is_system_role: true },
  { id: 'role-8', name: 'PRIVACY_OFFICER', display_name: 'Privacy Officer', description: 'GDPR/CCPA compliance and data subject requests', hierarchy_level: 3, is_system_role: true },
  { id: 'role-9', name: 'PARTNER_ADMIN', display_name: 'Partner Administrator', description: 'Organization-level administration', hierarchy_level: 4, is_system_role: true },
  { id: 'role-10', name: 'PARTNER_HR_MANAGER', display_name: 'Partner HR Manager', description: 'Job posting and ATS management', hierarchy_level: 5, is_system_role: true },
  { id: 'role-11', name: 'PARTNER_RECRUITER', display_name: 'Partner Recruiter', description: 'Limited ATS access', hierarchy_level: 6, is_system_role: true },
  { id: 'role-12', name: 'EDUCATOR_ADMIN', display_name: 'Educator Administrator', description: 'Institution-level administration', hierarchy_level: 4, is_system_role: true },
];

const SAMPLE_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    user_id: 'user-1',
    email: 'admin@stemworkforce.net',
    first_name: 'System',
    last_name: 'Administrator',
    role: SAMPLE_ROLES[0],
    assigned_at: '2024-01-01T00:00:00Z',
    is_active: true,
    last_login: '2025-01-18T10:30:00Z',
  },
  {
    id: 'staff-2',
    user_id: 'user-2',
    email: 'security@stemworkforce.net',
    first_name: 'Sarah',
    last_name: 'Chen',
    role: SAMPLE_ROLES[2],
    assigned_at: '2024-03-15T00:00:00Z',
    is_active: true,
    last_login: '2025-01-17T14:20:00Z',
  },
  {
    id: 'staff-3',
    user_id: 'user-3',
    email: 'billing@stemworkforce.net',
    first_name: 'Michael',
    last_name: 'Johnson',
    role: SAMPLE_ROLES[4],
    assigned_at: '2024-05-20T00:00:00Z',
    is_active: true,
    last_login: '2025-01-18T09:15:00Z',
  },
  {
    id: 'staff-4',
    user_id: 'user-4',
    email: 'compliance@stemworkforce.net',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    role: SAMPLE_ROLES[3],
    assigned_at: '2024-06-10T00:00:00Z',
    is_active: true,
    last_login: '2025-01-16T16:45:00Z',
  },
  {
    id: 'staff-5',
    user_id: 'user-5',
    email: 'support@stemworkforce.net',
    first_name: 'David',
    last_name: 'Kim',
    role: SAMPLE_ROLES[6],
    assigned_at: '2024-08-01T00:00:00Z',
    is_active: true,
    last_login: '2025-01-18T11:00:00Z',
  },
  {
    id: 'staff-6',
    user_id: 'user-6',
    email: 'content@stemworkforce.net',
    first_name: 'Jennifer',
    last_name: 'Martinez',
    role: SAMPLE_ROLES[5],
    assigned_at: '2024-09-15T00:00:00Z',
    is_active: false,
    last_login: '2024-12-20T10:00:00Z',
  },
  {
    id: 'staff-7',
    user_id: 'user-7',
    email: 'privacy@stemworkforce.net',
    first_name: 'Robert',
    last_name: 'Thompson',
    role: SAMPLE_ROLES[7],
    assigned_at: '2024-10-01T00:00:00Z',
    is_active: true,
    last_login: '2025-01-17T08:30:00Z',
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

const StaffManagementTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('directory');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'directory' && (
        <StaffDirectory
          onInvite={() => setShowInviteModal(true)}
          onAddStaff={() => setShowAddStaffModal(true)}
        />
      )}
      {activeSubTab === 'invitations' && (
        <InvitationsSection onInvite={() => setShowInviteModal(true)} />
      )}
      {activeSubTab === 'roles' && (
        <RolesSection
          onViewRole={(role) => { setSelectedRole(role); setShowRoleModal(true); }}
        />
      )}
      {activeSubTab === 'activity' && <ActivitySection />}

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <InviteStaffModal onClose={() => setShowInviteModal(false)} />
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaffModal onClose={() => setShowAddStaffModal(false)} />
      )}

      {/* Role Details Modal */}
      {showRoleModal && selectedRole && (
        <RoleDetailsModal
          role={selectedRole}
          onClose={() => { setShowRoleModal(false); setSelectedRole(null); }}
        />
      )}
    </div>
  );
};

// ===========================================
// STAFF DIRECTORY
// ===========================================

const StaffDirectory: React.FC<{ onInvite: () => void; onAddStaff: () => void }> = ({ onInvite, onAddStaff }) => {
  const [staff, setStaff] = useState<StaffMember[]>(SAMPLE_STAFF);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roles, setRoles] = useState<AdminRole[]>(SAMPLE_ROLES);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usingSampleData, setUsingSampleData] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchStaff();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await supabase
        .from('admin_roles')
        .select('*')
        .order('hierarchy_level');
      if (data && data.length > 0) {
        setRoles(data);
      } else {
        // Use sample data if database is empty
        setRoles(SAMPLE_ROLES);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setRoles(SAMPLE_ROLES);
    }
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select(`
          id,
          user_id,
          assigned_at,
          is_active,
          organization_id,
          users:user_id (id, email, first_name, last_name, last_login_at),
          admin_roles:role_id (id, name, display_name, description, hierarchy_level, is_system_role),
          organizations:organization_id (name)
        `)
        .order('assigned_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedStaff = data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          email: item.users?.email || '',
          first_name: item.users?.first_name || '',
          last_name: item.users?.last_name || '',
          role: item.admin_roles,
          organization_id: item.organization_id,
          organization_name: item.organizations?.name,
          assigned_at: item.assigned_at,
          is_active: item.is_active,
          last_login: item.users?.last_login_at,
        }));
        setStaff(formattedStaff);
        setUsingSampleData(false);
      } else {
        // Use sample data if database is empty
        setStaff(SAMPLE_STAFF);
        setUsingSampleData(true);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff(SAMPLE_STAFF);
      setUsingSampleData(true);
    }
    setLoading(false);
  };

  const handleDeactivate = async (staffId: string) => {
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ is_active: false })
      .eq('id', staffId);

    if (!error) {
      fetchStaff();
      // Log audit event
      await supabase.from('audit_logs').insert({
        event_type: 'STAFF_DEACTIVATED',
        event_category: 'admin',
        resource_type: 'user_role_assignment',
        resource_id: staffId,
        action: 'deactivate',
        severity: 'warning'
      });
    }
  };

  const handleReactivate = async (staffId: string) => {
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ is_active: true })
      .eq('id', staffId);

    if (!error) {
      fetchStaff();
    }
  };

  const filteredStaff = staff.filter(s => {
    // Search filter
    const matchesSearch =
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'all' || s.role?.id === roleFilter || s.role?.name === roleFilter;

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.is_active) ||
      (statusFilter === 'inactive' && !s.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-500/20 text-red-400 border-red-500/30',
      'PLATFORM_ADMIN': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      'SECURITY_ADMIN': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'COMPLIANCE_ADMIN': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'BILLING_ADMIN': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'CONTENT_ADMIN': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'SUPPORT_ADMIN': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    };
    return colors[roleName] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Sample Data Notice */}
      {usingSampleData && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          <AlertTriangle size={16} />
          Showing sample data. Connect to your database to see actual staff members.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Roles ({roles.length})</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.display_name} (L{role.hierarchy_level})
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={onAddStaff}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium border border-slate-600"
          >
            <UserPlus size={18} />
            Add Staff
          </button>
          <button
            onClick={onInvite}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium"
          >
            <Send size={18} />
            Invite Staff
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20">
              <Users size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{staff.filter(s => s.is_active).length}</p>
              <p className="text-sm text-slate-400">Active Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/20">
              <Crown size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {staff.filter(s => s.role?.name === 'SUPER_ADMIN').length}
              </p>
              <p className="text-sm text-slate-400">Super Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roles.length}</p>
              <p className="text-sm text-slate-400">Admin Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-500/20">
              <XCircle size={20} className="text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{staff.filter(s => !s.is_active).length}</p>
              <p className="text-sm text-slate-400">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Staff Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                    Loading staff...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    <Users size={24} className="mx-auto mb-2 opacity-50" />
                    No staff members found
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{member.first_name} {member.last_name}</p>
                          <p className="text-sm text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role?.name || '')}`}>
                        <Shield size={12} />
                        {member.role?.display_name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {member.organization_name || (
                        <span className="text-slate-500 italic">Platform-wide</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {member.is_active ? (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                          <CheckCircle2 size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                          <XCircle size={14} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {new Date(member.assigned_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {member.last_login
                        ? new Date(member.last_login).toLocaleDateString()
                        : <span className="text-slate-500">Never</span>
                      }
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedStaff(member); setShowEditModal(true); }}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        {member.is_active ? (
                          <button
                            onClick={() => handleDeactivate(member.id)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-amber-400"
                            title="Deactivate"
                          >
                            <Lock size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(member.id)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400"
                            title="Reactivate"
                          >
                            <Unlock size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => { if (window.confirm('Remove this staff member?')) { /* TODO: wire to API */ console.info('Staff removal pending API integration'); } }}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          roles={roles}
          onClose={() => { setShowEditModal(false); setSelectedStaff(null); }}
          onSave={() => { fetchStaff(); setShowEditModal(false); setSelectedStaff(null); }}
        />
      )}
    </div>
  );
};

// ===========================================
// INVITATIONS SECTION
// ===========================================

const InvitationsSection: React.FC<{ onInvite: () => void }> = ({ onInvite }) => {
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchInvitations();
  }, [statusFilter]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('staff_invitations')
        .select(`
          *,
          admin_roles:role_id (name, display_name),
          invited_by:invited_by_user_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (!error && data) {
        const formatted = data.map((inv: any) => ({
          id: inv.id,
          email: inv.email,
          role_id: inv.role_id,
          role_name: inv.admin_roles?.display_name || 'Unknown',
          invited_by_name: `${inv.invited_by?.first_name || ''} ${inv.invited_by?.last_name || ''}`.trim() || 'System',
          invited_at: inv.created_at,
          expires_at: inv.expires_at,
          status: inv.status,
        }));
        setInvitations(formatted);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      // If table doesn't exist yet, show empty state
      setInvitations([]);
    }
    setLoading(false);
  };

  const handleResend = async (invitationId: string) => {
    console.info('Resending invitation:', invitationId);
    /* TODO: Call supabase edge function for email resend */
  };

  const handleRevoke = async (invitationId: string) => {
    const { error } = await supabase
      .from('staff_invitations')
      .update({ status: 'revoked' })
      .eq('id', invitationId);

    if (!error) {
      fetchInvitations();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
        <button
          onClick={onInvite}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium"
        >
          <Send size={18} />
          Send Invitation
        </button>
      </div>

      {/* Invitations List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Invited By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Sent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Expires</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading invitations...</td>
              </tr>
            ) : invitations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  <Mail size={24} className="mx-auto mb-2 opacity-50" />
                  No invitations found
                </td>
              </tr>
            ) : (
              invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <Mail size={18} className="text-slate-400" />
                      </div>
                      <p className="font-medium">{inv.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{inv.role_name}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">{inv.invited_by_name}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(inv.invited_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(inv.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      inv.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                      inv.status === 'expired' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResend(inv.id)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400"
                            title="Resend"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
                            title="Revoke"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// ROLES SECTION
// ===========================================

const RolesSection: React.FC<{ onViewRole: (role: AdminRole) => void }> = ({ onViewRole }) => {
  const [roles, setRoles] = useState<AdminRole[]>(SAMPLE_ROLES);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    try {
      // Fetch roles
      const { data: rolesData } = await supabase
        .from('admin_roles')
        .select('*')
        .order('hierarchy_level');

      // Fetch permissions
      const { data: permsData } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('category, name');

      // Fetch role-permission mappings
      const { data: rpData } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id');

      if (rolesData && rolesData.length > 0) {
        setRoles(rolesData);
      } else {
        setRoles(SAMPLE_ROLES);
      }
      if (permsData) setPermissions(permsData);

      if (rpData) {
        const mapping: Record<string, string[]> = {};
        rpData.forEach((rp: any) => {
          if (!mapping[rp.role_id]) mapping[rp.role_id] = [];
          mapping[rp.role_id].push(rp.permission_id);
        });
        setRolePermissions(mapping);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles(SAMPLE_ROLES);
    }
    setLoading(false);
  };

  const getRoleColor = (level: number) => {
    if (level === 1) return 'border-red-500/30 bg-red-500/10';
    if (level === 2) return 'border-violet-500/30 bg-violet-500/10';
    if (level === 3) return 'border-amber-500/30 bg-amber-500/10';
    if (level === 4) return 'border-blue-500/30 bg-blue-500/10';
    return 'border-slate-500/30 bg-slate-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-slate-400">Loading roles...</div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className={`border rounded-xl p-5 hover:border-opacity-60 transition-colors cursor-pointer ${getRoleColor(role.hierarchy_level)}`}
              onClick={() => onViewRole(role)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-800">
                    {role.hierarchy_level === 1 ? (
                      <Crown size={20} className="text-red-400" />
                    ) : (
                      <Shield size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.display_name}</h3>
                    <p className="text-xs text-slate-400">Level {role.hierarchy_level}</p>
                  </div>
                </div>
                {role.is_system_role && (
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">System</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{role.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {rolePermissions[role.id]?.length || 0} permissions
                </span>
                <ChevronRight size={16} className="text-slate-500" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Permissions by Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">All Permissions by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['user_management', 'org_management', 'job_management', 'application_management', 'compliance', 'billing', 'system'].map((category) => {
            const categoryPerms = permissions.filter(p => p.category === category);
            if (categoryPerms.length === 0) return null;
            return (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300 capitalize">
                  {category.replace('_', ' ')}
                </h4>
                <div className="space-y-1">
                  {categoryPerms.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center gap-2 text-sm text-slate-400 p-2 rounded-lg bg-slate-800/50"
                    >
                      <Key size={14} className={perm.is_sensitive ? 'text-amber-400' : 'text-slate-500'} />
                      <span className="truncate">{perm.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// ACTIVITY SECTION
// ===========================================

const ActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .in('event_category', ['admin', 'staff', 'role_assignment'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setActivities(data);
    }
    setLoading(false);
  };

  const getActivityIcon = (eventType: string) => {
    if (eventType.includes('CREATED') || eventType.includes('INVITED')) return <UserPlus size={16} className="text-emerald-400" />;
    if (eventType.includes('DEACTIVATED') || eventType.includes('REMOVED')) return <XCircle size={16} className="text-red-400" />;
    if (eventType.includes('UPDATED') || eventType.includes('MODIFIED')) return <Edit2 size={16} className="text-blue-400" />;
    if (eventType.includes('LOGIN')) return <UserCheck size={16} className="text-cyan-400" />;
    return <Clock size={16} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Staff Activity Log</h3>
        <button
          onClick={fetchActivities}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Clock size={24} className="mx-auto mb-2 opacity-50" />
            No activity found
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
              <div className="p-2 rounded-lg bg-slate-800">
                {getActivityIcon(activity.event_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.event_type.replace(/_/g, ' ')}</p>
                <p className="text-xs text-slate-400 truncate">
                  {activity.actor_email || 'System'} - {activity.action}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===========================================
// SAMPLE ORGANIZATIONS (fallback)
// ===========================================

const SAMPLE_ORGANIZATIONS = [
  { id: 'org-1', name: 'Acme Corporation' },
  { id: 'org-2', name: 'TechStart Industries' },
  { id: 'org-3', name: 'Global Manufacturing Inc.' },
  { id: 'org-4', name: 'Healthcare Solutions Ltd.' },
  { id: 'org-5', name: 'Education First Academy' },
];

// ===========================================
// INVITE STAFF MODAL
// ===========================================

const InviteStaffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [scopeType, setScopeType] = useState<'platform' | 'organization'>('platform');
  const [organizationId, setOrganizationId] = useState('');
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState<AdminRole[]>(SAMPLE_ROLES);
  const [organizations, setOrganizations] = useState<any[]>(SAMPLE_ORGANIZATIONS);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [rolesRes, orgsRes] = await Promise.all([
        supabase.from('admin_roles').select('*').order('hierarchy_level'),
        supabase.from('organizations').select('id, name').eq('verified', true).limit(100)
      ]);

      if (rolesRes.data && rolesRes.data.length > 0) {
        setRoles(rolesRes.data);
      } else {
        setRoles(SAMPLE_ROLES);
      }

      if (orgsRes.data && orgsRes.data.length > 0) {
        setOrganizations(orgsRes.data);
      } else {
        setOrganizations(SAMPLE_ORGANIZATIONS);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      setRoles(SAMPLE_ROLES);
      setOrganizations(SAMPLE_ORGANIZATIONS);
    }
    setLoadingOptions(false);
  };

  // Get role color for visual feedback
  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'text-red-400',
      'PLATFORM_ADMIN': 'text-violet-400',
      'SECURITY_ADMIN': 'text-amber-400',
      'COMPLIANCE_ADMIN': 'text-blue-400',
      'BILLING_ADMIN': 'text-emerald-400',
      'CONTENT_ADMIN': 'text-cyan-400',
      'SUPPORT_ADMIN': 'text-pink-400',
      'PRIVACY_OFFICER': 'text-indigo-400',
    };
    return colors[roleName] || 'text-slate-400';
  };

  // Get selected role details
  const selectedRole = roles.find(r => r.id === roleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Determine organization ID based on scope type
    const effectiveOrgId = scopeType === 'organization' ? organizationId : null;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Check if email already exists as staff
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        // User exists - create role assignment directly
        const { error: assignError } = await supabase
          .from('user_role_assignments')
          .insert({
            user_id: existingUser.id,
            role_id: roleId,
            organization_id: effectiveOrgId,
            assigned_by: user?.id,
            is_active: true
          });

        if (assignError) throw assignError;
      } else {
        // Create invitation
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

        const { error: inviteError } = await supabase
          .from('staff_invitations')
          .insert({
            email,
            role_id: roleId,
            organization_id: effectiveOrgId,
            invited_by_user_id: user?.id,
            message,
            expires_at: expiresAt.toISOString(),
            status: 'pending'
          });

        if (inviteError) throw inviteError;
      }

      // Log audit event
      await supabase.from('audit_logs').insert({
        event_type: 'STAFF_INVITED',
        event_category: 'admin',
        resource_type: 'staff_invitation',
        action: 'create',
        actor_id: user?.id,
        metadata: { email, role_id: roleId, scope: scopeType, organization_id: effectiveOrgId }
      });

      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20">
              <UserPlus size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Invite Staff Member</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Invitation Sent!</h4>
            <p className="text-slate-400">The staff member will receive an email with instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {/* Loading indicator for options */}
            {loadingOptions && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <RefreshCw size={14} className="animate-spin" />
                Loading options...
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="staff@company.com"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Role Selection - Improved with visual cards */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Role * <span className="text-slate-500 font-normal">({roles.length} available)</span>
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setRoleId(role.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                      roleId === role.id
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${roleId === role.id ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                      <Shield size={16} className={roleId === role.id ? 'text-emerald-400' : getRoleColor(role.name)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${roleId === role.id ? 'text-emerald-400' : 'text-white'}`}>
                          {role.display_name}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                          L{role.hierarchy_level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{role.description}</p>
                    </div>
                    {roleId === role.id && (
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              {!roleId && (
                <p className="text-xs text-amber-400 mt-2">Please select a role</p>
              )}
            </div>

            {/* Access Scope - Improved with toggle and clear explanation */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Access Scope</label>

              {/* Scope Toggle */}
              <div className="flex gap-2 p-1 bg-slate-800 rounded-lg mb-3">
                <button
                  type="button"
                  onClick={() => { setScopeType('platform'); setOrganizationId(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scopeType === 'platform'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe size={16} />
                  Platform-wide
                </button>
                <button
                  type="button"
                  onClick={() => setScopeType('organization')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scopeType === 'organization'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={16} />
                  Specific Org
                </button>
              </div>

              {/* Scope Description */}
              {scopeType === 'platform' ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Globe size={16} className="text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Platform-wide Access</p>
                      <p className="text-xs text-slate-400 mt-1">
                        This staff member will have access across the entire platform, not limited to any specific organization.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    required={scopeType === 'organization'}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select an organization...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                  {organizationId && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Building2 size={16} className="text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-400">Organization-scoped Access</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Access will be limited to: <strong>{organizations.find(o => o.id === organizationId)?.name}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Personal Message
                <span className="text-slate-500 font-normal ml-2">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Welcome to the team! We're excited to have you..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Summary */}
            {roleId && (
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Invitation Summary</p>
                <p className="text-sm">
                  Invite <strong className="text-white">{email || 'user'}</strong> as{' '}
                  <strong className={getRoleColor(selectedRole?.name || '')}>{selectedRole?.display_name}</strong>
                  {scopeType === 'organization' && organizationId ? (
                    <> for <strong className="text-blue-400">{organizations.find(o => o.id === organizationId)?.name}</strong></>
                  ) : (
                    <> with <strong className="text-emerald-400">platform-wide</strong> access</>
                  )}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !roleId || (scopeType === 'organization' && !organizationId)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ===========================================
// ADD STAFF MODAL (Direct Addition)
// ===========================================

const AddStaffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [roles, setRoles] = useState<AdminRole[]>(SAMPLE_ROLES);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addMode, setAddMode] = useState<'existing' | 'new'>('existing');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [rolesRes, orgsRes] = await Promise.all([
        supabase.from('admin_roles').select('*').order('hierarchy_level'),
        supabase.from('organizations').select('id, name').eq('verified', true).limit(100)
      ]);

      if (rolesRes.data && rolesRes.data.length > 0) setRoles(rolesRes.data);
      if (orgsRes.data) setOrganizations(orgsRes.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setExistingUsers([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(10);

      if (data) {
        setExistingUsers(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (addMode === 'existing') {
        if (!selectedUserId) {
          setError('Please select a user');
          setLoading(false);
          return;
        }

        // Check if already has a role assignment
        const { data: existingAssignment } = await supabase
          .from('user_role_assignments')
          .select('id')
          .eq('user_id', selectedUserId)
          .eq('role_id', roleId)
          .single();

        if (existingAssignment) {
          setError('This user already has this role assigned');
          setLoading(false);
          return;
        }

        // Create role assignment
        const { error: assignError } = await supabase
          .from('user_role_assignments')
          .insert({
            user_id: selectedUserId,
            role_id: roleId,
            organization_id: organizationId || null,
            assigned_by: currentUser?.id,
            is_active: true
          });

        if (assignError) throw assignError;
      } else {
        // Create new user and assign role
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName
          }
        });

        if (authError) {
          // If can't create admin user, try inviting instead
          const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
          if (inviteError) throw inviteError;

          // Create pending record
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

          await supabase.from('staff_invitations').insert({
            email,
            role_id: roleId,
            organization_id: organizationId || null,
            invited_by_user_id: currentUser?.id,
            expires_at: expiresAt.toISOString(),
            status: 'pending'
          });
        } else if (authData.user) {
          // Create user record
          await supabase.from('users').insert({
            id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            user_type: 'admin',
            status: 'active'
          });

          // Assign role
          await supabase.from('user_role_assignments').insert({
            user_id: authData.user.id,
            role_id: roleId,
            organization_id: organizationId || null,
            assigned_by: currentUser?.id,
            is_active: true
          });
        }
      }

      // Log audit event
      await supabase.from('audit_logs').insert({
        event_type: 'STAFF_ADDED',
        event_category: 'admin',
        resource_type: 'user_role_assignment',
        action: 'create',
        actor_id: currentUser?.id,
        metadata: { email: addMode === 'existing' ? selectedUserId : email, role_id: roleId }
      });

      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-500/20">
              <UserPlus size={20} className="text-violet-400" />
            </div>
            <h3 className="text-xl font-bold">Add Staff Member</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Staff Member Added!</h4>
            <p className="text-slate-400">The role has been assigned successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setAddMode('existing')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  addMode === 'existing'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Existing User
              </button>
              <button
                type="button"
                onClick={() => setAddMode('new')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  addMode === 'new'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                New User
              </button>
            </div>

            {addMode === 'existing' ? (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Search User *</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    onChange={(e) => searchUsers(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                  {searching && (
                    <RefreshCw size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                  )}
                </div>

                {/* User Results */}
                {existingUsers.length > 0 && (
                  <div className="mt-2 border border-slate-700 rounded-lg overflow-hidden">
                    {existingUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setEmail(user.email);
                          setFirstName(user.first_name || '');
                          setLastName(user.last_name || '');
                        }}
                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800 transition-colors ${
                          selectedUserId === user.id ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                        {selectedUserId === user.id && (
                          <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {selectedUserId && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-sm text-emerald-400">
                      Selected: <strong>{firstName} {lastName}</strong> ({email})
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="John"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="staff@company.com"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Admin Role *</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display_name} (Level {role.hierarchy_level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Organization Scope
                <span className="text-slate-500 font-normal ml-2">(optional)</span>
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Platform-wide access</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to grant access to all organizations
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (addMode === 'existing' && !selectedUserId)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Add Staff
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ===========================================
// EDIT STAFF MODAL
// ===========================================

const EditStaffModal: React.FC<{
  staff: StaffMember;
  roles: AdminRole[];
  onClose: () => void;
  onSave: () => void;
}> = ({ staff, roles, onClose, onSave }) => {
  const [roleId, setRoleId] = useState(staff.role?.id || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ role_id: roleId })
      .eq('id', staff.id);

    if (!error) {
      onSave();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">Edit Staff Member</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-2xl">
              {staff.first_name?.[0]}{staff.last_name?.[0]}
            </div>
            <div>
              <h4 className="text-lg font-semibold">{staff.first_name} {staff.last_name}</h4>
              <p className="text-slate-400">{staff.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.display_name} (Level {role.hierarchy_level})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// ROLE DETAILS MODAL
// ===========================================

const RoleDetailsModal: React.FC<{
  role: AdminRole;
  onClose: () => void;
}> = ({ role, onClose }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRolePermissions();
  }, [role.id]);

  const fetchRolePermissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('role_permissions')
      .select(`
        permission_id,
        admin_permissions:permission_id (*)
      `)
      .eq('role_id', role.id);

    if (data) {
      const perms = data.map((rp: any) => rp.admin_permissions).filter(Boolean);
      setPermissions(perms);
    }
    setLoading(false);
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800">
              <Shield size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{role.display_name}</h3>
              <p className="text-sm text-slate-400">Level {role.hierarchy_level} • {permissions.length} permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-300">{role.description}</p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading permissions...</div>
          ) : (
            <div className="space-y-6">
              <h4 className="font-semibold">Permissions</h4>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category}>
                  <h5 className="text-sm font-medium text-slate-400 uppercase mb-3">
                    {category.replace('_', ' ')}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg"
                      >
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{perm.display_name}</p>
                          {perm.is_sensitive && (
                            <span className="text-xs text-amber-400">Sensitive</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagementTab;
