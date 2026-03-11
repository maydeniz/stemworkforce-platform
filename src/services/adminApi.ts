// ===========================================
// Admin Portal API Service Layer
// Complete backend integration for admin dashboard
// ===========================================

import { supabase } from '@/lib/supabase';

// ===========================================
// Types
// ===========================================

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  clearance_level: string | null;
  is_veteran: boolean;
  created_at: string;
  last_login: string | null;
  organization_id: string | null;
  organization_name?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  industry: string;
  tier: 'free' | 'professional' | 'enterprise' | 'government';
  status: 'active' | 'pending' | 'suspended' | 'verified';
  verified: boolean;
  employee_count: number | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: Record<string, unknown> | null;
  logo_url: string | null;
  quotas: Record<string, number> | null;
  created_at: string;
  updated_at: string;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  organization_id: string | null;
  status: 'draft' | 'pending' | 'active' | 'closed' | 'rejected';
  is_featured: boolean;
  clearance_required: string | null;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  applications_count: number;
  created_at: string;
  expires_at: string | null;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: 'pending' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
  job?: AdminJob;
  applicant?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface UserSession {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  os: string;
  country: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

export interface FailedLogin {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  failure_reason: string;
  created_at: string;
}

export interface IPAccessRule {
  id: string;
  ip_address: string;
  rule_type: 'allow' | 'block';
  description: string | null;
  created_by: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RateLimitConfig {
  id: string;
  endpoint: string;
  tier: string;
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  is_active: boolean;
  created_at: string;
}

export interface DataSubjectRequest {
  id: string;
  user_id: string | null;
  email: string;
  request_type: 'access' | 'deletion' | 'rectification' | 'portability' | 'restriction';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  identity_verified: boolean;
  deadline: string;
  completed_at: string | null;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  event_type: 'user' | 'admin' | 'security' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PlatformContent {
  id: string;
  page_key: string;
  title: string;
  content: Record<string, unknown>;
  status: 'draft' | 'published' | 'maintenance';
  version: number;
  published_at: string | null;
  scheduled_publish_at: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target_roles: string[] | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string;
  created_at: string;
}

export interface StaffMember {
  id: string;
  user_id: string;
  role: string;
  department: string | null;
  title: string | null;
  permissions: string[];
  is_active: boolean;
  invited_by: string | null;
  invited_at: string;
  accepted_at: string | null;
  user?: {
    email: string;
    full_name: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  verifiedOrganizations: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}

// ===========================================
// User Management API
// ===========================================

export const adminUsersApi = {
  // List users with filters
  async list(filters?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: AdminUser[]; total: number }> {
    let query = supabase
      .from('users')
      .select('*, organizations(name)', { count: 'exact' });

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const users = (data || []).map(u => ({
      ...u,
      organization_name: u.organizations?.name,
    }));

    return { users, total: count || 0 };
  },

  // Get single user
  async get(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*, organizations(name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? { ...data, organization_name: data.organizations?.name } : null;
  },

  // Update user
  async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Suspend user
  async suspend(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ status: 'suspended', suspension_reason: reason })
      .eq('id', id);

    if (error) throw error;

    // Log action
    await adminAuditApi.log({
      action: 'user_suspended',
      resource_type: 'user',
      resource_id: id,
      event_type: 'admin',
      severity: 'warning',
      metadata: { reason },
    });
  },

  // Reactivate user
  async reactivate(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ status: 'active', suspension_reason: null })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'user_reactivated',
      resource_type: 'user',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Update user role
  async updateRole(id: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'user_role_updated',
      resource_type: 'user',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
      metadata: { new_role: role },
    });
  },

  // Delete user (soft delete)
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ status: 'deleted', deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'user_deleted',
      resource_type: 'user',
      resource_id: id,
      event_type: 'admin',
      severity: 'warning',
    });
  },
};

// ===========================================
// Organization Management API
// ===========================================

export const adminOrganizationsApi = {
  // List organizations
  async list(filters?: {
    type?: string;
    tier?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ organizations: Organization[]; total: number }> {
    let query = supabase
      .from('organizations')
      .select('*', { count: 'exact' });

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters?.tier && filters.tier !== 'all') {
      query = query.eq('tier', filters.tier);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { organizations: data || [], total: count || 0 };
  },

  // Get single organization
  async get(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update organization
  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await adminAuditApi.log({
      action: 'organization_updated',
      resource_type: 'organization',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });

    return data;
  },

  // Verify organization
  async verify(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .update({ verified: true, status: 'verified' })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'organization_verified',
      resource_type: 'organization',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Suspend organization
  async suspend(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .update({ status: 'suspended', suspension_reason: reason })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'organization_suspended',
      resource_type: 'organization',
      resource_id: id,
      event_type: 'admin',
      severity: 'warning',
      metadata: { reason },
    });
  },

  // Update tier
  async updateTier(id: string, tier: Organization['tier'], quotas?: Record<string, number>): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .update({ tier, quotas: quotas || null })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'organization_tier_updated',
      resource_type: 'organization',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
      metadata: { new_tier: tier },
    });
  },
};

// ===========================================
// Job Management API
// ===========================================

export const adminJobsApi = {
  // List jobs
  async list(filters?: {
    status?: string;
    company?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: AdminJob[]; total: number }> {
    let query = supabase
      .from('jobs')
      .select('*, applications(count)', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.company) {
      query = query.eq('organization_id', filters.company);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const jobs = (data || []).map(j => ({
      ...j,
      applications_count: j.applications?.[0]?.count || 0,
    }));

    return { jobs, total: count || 0 };
  },

  // Get single job
  async get(id: string): Promise<AdminJob | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, applications(count)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? { ...data, applications_count: data.applications?.[0]?.count || 0 } : null;
  },

  // Approve job
  async approve(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'active' })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'job_approved',
      resource_type: 'job',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Reject job
  async reject(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'job_rejected',
      resource_type: 'job',
      resource_id: id,
      event_type: 'admin',
      severity: 'warning',
      metadata: { reason },
    });
  },

  // Close job
  async close(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'job_closed',
      resource_type: 'job',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Feature/unfeature job
  async setFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ is_featured: featured })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: featured ? 'job_featured' : 'job_unfeatured',
      resource_type: 'job',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },
};

// ===========================================
// Application Management API
// ===========================================

export const adminApplicationsApi = {
  // List applications
  async list(filters?: {
    status?: string;
    job_id?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: Application[]; total: number }> {
    let query = supabase
      .from('applications')
      .select('*, jobs(id, title, company), users!applications_user_id_fkey(id, full_name, email)', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.job_id) {
      query = query.eq('job_id', filters.job_id);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const applications = (data || []).map(a => ({
      ...a,
      job: a.jobs,
      applicant: a.users,
    }));

    return { applications, total: count || 0 };
  },

  // Update application status
  async updateStatus(id: string, status: Application['status']): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'application_status_updated',
      resource_type: 'application',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
      metadata: { new_status: status },
    });
  },
};

// ===========================================
// Security API
// ===========================================

export const adminSecurityApi = {
  // Get active sessions
  async getSessions(filters?: {
    user_id?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ sessions: UserSession[]; total: number }> {
    let query = supabase
      .from('user_sessions')
      .select('*', { count: 'exact' });

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    query = query
      .order('last_activity', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { sessions: data || [], total: count || 0 };
  },

  // Terminate session
  async terminateSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'session_terminated',
      resource_type: 'session',
      resource_id: sessionId,
      event_type: 'security',
      severity: 'warning',
    });
  },

  // Terminate all sessions for user
  async terminateUserSessions(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'all_sessions_terminated',
      resource_type: 'user',
      resource_id: userId,
      event_type: 'security',
      severity: 'warning',
    });
  },

  // Get failed logins
  async getFailedLogins(filters?: {
    email?: string;
    ip_address?: string;
    since?: string;
    page?: number;
    limit?: number;
  }): Promise<{ attempts: FailedLogin[]; total: number }> {
    let query = supabase
      .from('failed_login_attempts')
      .select('*', { count: 'exact' });

    if (filters?.email) {
      query = query.eq('email', filters.email);
    }
    if (filters?.ip_address) {
      query = query.eq('ip_address', filters.ip_address);
    }
    if (filters?.since) {
      query = query.gte('created_at', filters.since);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { attempts: data || [], total: count || 0 };
  },

  // IP Access Rules
  async getIPRules(): Promise<IPAccessRule[]> {
    const { data, error } = await supabase
      .from('ip_access_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createIPRule(rule: Omit<IPAccessRule, 'id' | 'created_at'>): Promise<IPAccessRule> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('ip_access_rules')
      .insert({ ...rule, created_by: user?.id })
      .select()
      .single();

    if (error) throw error;

    await adminAuditApi.log({
      action: 'ip_rule_created',
      resource_type: 'ip_rule',
      resource_id: data.id,
      event_type: 'security',
      severity: rule.rule_type === 'block' ? 'warning' : 'info',
      metadata: { ip_address: rule.ip_address, rule_type: rule.rule_type },
    });

    return data;
  },

  async updateIPRule(id: string, updates: Partial<IPAccessRule>): Promise<IPAccessRule> {
    const { data, error } = await supabase
      .from('ip_access_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteIPRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('ip_access_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'ip_rule_deleted',
      resource_type: 'ip_rule',
      resource_id: id,
      event_type: 'security',
      severity: 'info',
    });
  },

  // Rate Limit Configuration
  async getRateLimits(): Promise<RateLimitConfig[]> {
    const { data, error } = await supabase
      .from('rate_limit_configs')
      .select('*')
      .order('endpoint');

    if (error) throw error;
    return data || [];
  },

  async updateRateLimit(id: string, config: Partial<RateLimitConfig>): Promise<RateLimitConfig> {
    const { data, error } = await supabase
      .from('rate_limit_configs')
      .update(config)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await adminAuditApi.log({
      action: 'rate_limit_updated',
      resource_type: 'rate_limit',
      resource_id: id,
      event_type: 'security',
      severity: 'info',
    });

    return data;
  },
};

// ===========================================
// Privacy & Compliance API
// ===========================================

export const adminPrivacyApi = {
  // Data Subject Requests
  async getDSRs(filters?: {
    status?: string;
    request_type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: DataSubjectRequest[]; total: number }> {
    let query = supabase
      .from('data_subject_requests')
      .select('*', { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.request_type && filters.request_type !== 'all') {
      query = query.eq('request_type', filters.request_type);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    query = query
      .order('deadline', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { requests: data || [], total: count || 0 };
  },

  async updateDSR(id: string, updates: Partial<DataSubjectRequest>): Promise<DataSubjectRequest> {
    const { data, error } = await supabase
      .from('data_subject_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await adminAuditApi.log({
      action: 'dsr_updated',
      resource_type: 'dsr',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
      metadata: { status: updates.status },
    });

    return data;
  },

  async completeDSR(id: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('data_subject_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        notes,
      })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'dsr_completed',
      resource_type: 'dsr',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // CCPA Opt-outs
  async getCCPAOptOuts(page: number = 1, limit: number = 50): Promise<{ records: unknown[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('ccpa_consumer_rights')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { records: data || [], total: count || 0 };
  },

  // Consent Categories
  async getConsentCategories(): Promise<unknown[]> {
    const { data, error } = await supabase
      .from('consent_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Data Retention Policies
  async getRetentionPolicies(): Promise<unknown[]> {
    const { data, error } = await supabase
      .from('data_retention_policies')
      .select('*')
      .order('data_type');

    if (error) throw error;
    return data || [];
  },
};

// ===========================================
// Content Management API
// ===========================================

export const adminContentApi = {
  // Get all content pages
  async getPages(): Promise<PlatformContent[]> {
    const { data, error } = await supabase
      .from('platform_content')
      .select('*')
      .order('page_key');

    if (error) throw error;
    return data || [];
  },

  // Get single page
  async getPage(pageKey: string): Promise<PlatformContent | null> {
    const { data, error } = await supabase
      .from('platform_content')
      .select('*')
      .eq('page_key', pageKey)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create/update page content
  async savePage(pageKey: string, content: Record<string, unknown>, title: string): Promise<PlatformContent> {
    const { data: { user } } = await supabase.auth.getUser();

    const existing = await this.getPage(pageKey);

    if (existing) {
      // Create version snapshot
      await supabase
        .from('platform_content_versions')
        .insert({
          content_id: existing.id,
          content: existing.content,
          version: existing.version,
          created_by: user?.id,
        });

      // Update
      const { data, error } = await supabase
        .from('platform_content')
        .update({
          content,
          title,
          version: existing.version + 1,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('platform_content')
        .insert({
          page_key: pageKey,
          title,
          content,
          status: 'draft',
          version: 1,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Publish page
  async publishPage(id: string): Promise<void> {
    const { error } = await supabase
      .from('platform_content')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'content_published',
      resource_type: 'content',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Unpublish page
  async unpublishPage(id: string): Promise<void> {
    const { error } = await supabase
      .from('platform_content')
      .update({ status: 'draft' })
      .eq('id', id);

    if (error) throw error;
  },

  // Get announcements
  async getAnnouncements(activeOnly: boolean = false): Promise<Announcement[]> {
    let query = supabase
      .from('platform_announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Create announcement
  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'created_by'>): Promise<Announcement> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('platform_announcements')
      .insert({ ...announcement, created_by: user?.id })
      .select()
      .single();

    if (error) throw error;

    await adminAuditApi.log({
      action: 'announcement_created',
      resource_type: 'announcement',
      resource_id: data.id,
      event_type: 'admin',
      severity: 'info',
    });

    return data;
  },

  // Update announcement
  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    const { data, error } = await supabase
      .from('platform_announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete announcement
  async deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase
      .from('platform_announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ===========================================
// Staff Management API
// ===========================================

export const adminStaffApi = {
  // Get all staff
  async list(): Promise<StaffMember[]> {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .select('*, users(email, full_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(s => ({
      ...s,
      user: s.users,
    }));
  },

  // Invite staff member
  async invite(email: string, role: string, permissions: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('staff_invitations')
      .insert({
        email,
        role,
        permissions,
        invited_by: user?.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

    if (error) throw error;

    await adminAuditApi.log({
      action: 'staff_invited',
      resource_type: 'staff',
      event_type: 'admin',
      severity: 'info',
      metadata: { email, role },
    });
  },

  // Update staff permissions
  async updatePermissions(id: string, permissions: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ permissions })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'staff_permissions_updated',
      resource_type: 'staff',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
    });
  },

  // Update staff role
  async updateRole(id: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ role })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'staff_role_updated',
      resource_type: 'staff',
      resource_id: id,
      event_type: 'admin',
      severity: 'info',
      metadata: { new_role: role },
    });
  },

  // Deactivate staff
  async deactivate(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_role_assignments')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    await adminAuditApi.log({
      action: 'staff_deactivated',
      resource_type: 'staff',
      resource_id: id,
      event_type: 'admin',
      severity: 'warning',
    });
  },
};

// ===========================================
// Audit Logs API
// ===========================================

export const adminAuditApi = {
  // Get audit logs
  async getLogs(filters?: {
    event_type?: string;
    severity?: string;
    actor_id?: string;
    resource_type?: string;
    since?: string;
    until?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (filters?.event_type && filters.event_type !== 'all') {
      query = query.eq('event_type', filters.event_type);
    }
    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }
    if (filters?.actor_id) {
      query = query.eq('actor_id', filters.actor_id);
    }
    if (filters?.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters?.since) {
      query = query.gte('created_at', filters.since);
    }
    if (filters?.until) {
      query = query.lte('created_at', filters.until);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { logs: data || [], total: count || 0 };
  },

  // Log an action
  async log(entry: {
    action: string;
    resource_type: string;
    resource_id?: string | null;
    event_type: 'user' | 'admin' | 'security' | 'system';
    severity: 'info' | 'warning' | 'error' | 'critical';
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        ...entry,
        event_category: entry.event_type,
        actor_id: user?.id,
        actor_email: user?.email,
      });

    if (error) {
      console.error('Failed to log audit entry:', error);
    }
  },

  // Export logs
  async exportLogs(filters: {
    since: string;
    until: string;
    event_type?: string;
  }): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', filters.since)
      .lte('created_at', filters.until);

    if (filters.event_type) {
      query = query.eq('event_type', filters.event_type);
    }

    query = query.order('created_at', { ascending: false }).limit(10000);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },
};

// ===========================================
// Dashboard Stats API
// ===========================================

export const adminDashboardApi = {
  // Get dashboard overview stats
  async getStats(): Promise<DashboardStats> {
    const [
      usersResult,
      activeUsersResult,
      orgsResult,
      verifiedOrgsResult,
      jobsResult,
      activeJobsResult,
      appsResult,
      pendingAppsResult,
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('organizations').select('id', { count: 'exact', head: true }),
      supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      totalUsers: usersResult.count || 0,
      activeUsers: activeUsersResult.count || 0,
      totalOrganizations: orgsResult.count || 0,
      verifiedOrganizations: verifiedOrgsResult.count || 0,
      totalJobs: jobsResult.count || 0,
      activeJobs: activeJobsResult.count || 0,
      totalApplications: appsResult.count || 0,
      pendingApplications: pendingAppsResult.count || 0,
      monthlyRevenue: 0, // Would need billing table
      activeSubscriptions: 0, // Would need subscriptions table
    };
  },

  // Get recent activity
  async getRecentActivity(limit: number = 20): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get user growth data
  async getUserGrowth(days: number = 30): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .rpc('get_user_growth', { start_date: startDate.toISOString() });

    if (error) {
      // Fallback if RPC doesn't exist
      return [];
    }
    return data || [];
  },
};

// ===========================================
// Export all admin APIs
// ===========================================

export const adminApi = {
  users: adminUsersApi,
  organizations: adminOrganizationsApi,
  jobs: adminJobsApi,
  applications: adminApplicationsApi,
  security: adminSecurityApi,
  privacy: adminPrivacyApi,
  content: adminContentApi,
  staff: adminStaffApi,
  audit: adminAuditApi,
  dashboard: adminDashboardApi,
};
