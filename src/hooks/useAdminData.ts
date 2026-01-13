// ===========================================
// React Hooks for Admin Portal Data
// Provides easy integration with the admin API
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  adminApi,
  AdminUser,
  Organization,
  AdminJob,
  Application,
  UserSession,
  FailedLogin,
  IPAccessRule,
  RateLimitConfig,
  DataSubjectRequest,
  AuditLog,
  PlatformContent,
  Announcement,
  StaffMember,
  DashboardStats,
} from '@/services/adminApi';

// ===========================================
// Dashboard Stats Hook
// ===========================================

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activityData] = await Promise.all([
        adminApi.dashboard.getStats(),
        adminApi.dashboard.getRecentActivity(20),
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refetch: fetchData,
  };
}

// ===========================================
// Users Hook
// ===========================================

interface UseAdminUsersOptions {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminUsers(options?: UseAdminUsersOptions) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { users: data, total: count } = await adminApi.users.list(options);
      setUsers(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, [options?.role, options?.status, options?.search, options?.page, options?.limit]);

  const suspendUser = useCallback(async (id: string, reason?: string) => {
    await adminApi.users.suspend(id, reason);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' as const } : u));
  }, []);

  const reactivateUser = useCallback(async (id: string) => {
    await adminApi.users.reactivate(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' as const } : u));
  }, []);

  const updateRole = useCallback(async (id: string, role: string) => {
    await adminApi.users.updateRole(id, role);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    loading,
    error,
    suspendUser,
    reactivateUser,
    updateRole,
    refetch: fetchUsers,
  };
}

// ===========================================
// Organizations Hook
// ===========================================

interface UseAdminOrganizationsOptions {
  type?: string;
  tier?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminOrganizations(options?: UseAdminOrganizationsOptions) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { organizations: data, total: count } = await adminApi.organizations.list(options);
      setOrganizations(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch organizations'));
    } finally {
      setLoading(false);
    }
  }, [options?.type, options?.tier, options?.status, options?.search, options?.page, options?.limit]);

  const verifyOrg = useCallback(async (id: string) => {
    await adminApi.organizations.verify(id);
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, verified: true, status: 'verified' as const } : o));
  }, []);

  const suspendOrg = useCallback(async (id: string, reason?: string) => {
    await adminApi.organizations.suspend(id, reason);
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, status: 'suspended' as const } : o));
  }, []);

  const updateTier = useCallback(async (id: string, tier: Organization['tier']) => {
    await adminApi.organizations.updateTier(id, tier);
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, tier } : o));
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    total,
    loading,
    error,
    verifyOrg,
    suspendOrg,
    updateTier,
    refetch: fetchOrganizations,
  };
}

// ===========================================
// Jobs Hook
// ===========================================

interface UseAdminJobsOptions {
  status?: string;
  company?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminJobs(options?: UseAdminJobsOptions) {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { jobs: data, total: count } = await adminApi.jobs.list(options);
      setJobs(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.company, options?.search, options?.page, options?.limit]);

  const approveJob = useCallback(async (id: string) => {
    await adminApi.jobs.approve(id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'active' as const } : j));
  }, []);

  const rejectJob = useCallback(async (id: string, reason?: string) => {
    await adminApi.jobs.reject(id, reason);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'rejected' as const } : j));
  }, []);

  const closeJob = useCallback(async (id: string) => {
    await adminApi.jobs.close(id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'closed' as const } : j));
  }, []);

  const setFeatured = useCallback(async (id: string, featured: boolean) => {
    await adminApi.jobs.setFeatured(id, featured);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, is_featured: featured } : j));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    total,
    loading,
    error,
    approveJob,
    rejectJob,
    closeJob,
    setFeatured,
    refetch: fetchJobs,
  };
}

// ===========================================
// Applications Hook
// ===========================================

interface UseAdminApplicationsOptions {
  status?: string;
  job_id?: string;
  user_id?: string;
  page?: number;
  limit?: number;
}

export function useAdminApplications(options?: UseAdminApplicationsOptions) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { applications: data, total: count } = await adminApi.applications.list(options);
      setApplications(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.job_id, options?.user_id, options?.page, options?.limit]);

  const updateStatus = useCallback(async (id: string, status: Application['status']) => {
    await adminApi.applications.updateStatus(id, status);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    total,
    loading,
    error,
    updateStatus,
    refetch: fetchApplications,
  };
}

// ===========================================
// Security Hooks
// ===========================================

export function useAdminSessions(filters?: { user_id?: string; is_active?: boolean }) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { sessions: data, total: count } = await adminApi.security.getSessions(filters);
      setSessions(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
    } finally {
      setLoading(false);
    }
  }, [filters?.user_id, filters?.is_active]);

  const terminateSession = useCallback(async (id: string) => {
    await adminApi.security.terminateSession(id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, is_active: false } : s));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    total,
    loading,
    error,
    terminateSession,
    refetch: fetchSessions,
  };
}

export function useAdminFailedLogins(filters?: { email?: string; ip_address?: string; since?: string }) {
  const [attempts, setAttempts] = useState<FailedLogin[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttempts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { attempts: data, total: count } = await adminApi.security.getFailedLogins(filters);
      setAttempts(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch failed logins'));
    } finally {
      setLoading(false);
    }
  }, [filters?.email, filters?.ip_address, filters?.since]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    total,
    loading,
    error,
    refetch: fetchAttempts,
  };
}

export function useAdminIPRules() {
  const [rules, setRules] = useState<IPAccessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.security.getIPRules();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch IP rules'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(async (rule: Omit<IPAccessRule, 'id' | 'created_at'>) => {
    const newRule = await adminApi.security.createIPRule(rule);
    setRules(prev => [newRule, ...prev]);
    return newRule;
  }, []);

  const updateRule = useCallback(async (id: string, updates: Partial<IPAccessRule>) => {
    const updated = await adminApi.security.updateIPRule(id, updates);
    setRules(prev => prev.map(r => r.id === id ? updated : r));
    return updated;
  }, []);

  const deleteRule = useCallback(async (id: string) => {
    await adminApi.security.deleteIPRule(id);
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    error,
    createRule,
    updateRule,
    deleteRule,
    refetch: fetchRules,
  };
}

export function useAdminRateLimits() {
  const [configs, setConfigs] = useState<RateLimitConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.security.getRateLimits();
      setConfigs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rate limits'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (id: string, config: Partial<RateLimitConfig>) => {
    const updated = await adminApi.security.updateRateLimit(id, config);
    setConfigs(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return {
    configs,
    loading,
    error,
    updateConfig,
    refetch: fetchConfigs,
  };
}

// ===========================================
// Privacy/Compliance Hooks
// ===========================================

export function useAdminDSRs(filters?: { status?: string; request_type?: string }) {
  const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { requests: data, total: count } = await adminApi.privacy.getDSRs(filters);
      setRequests(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch DSRs'));
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.request_type]);

  const updateDSR = useCallback(async (id: string, updates: Partial<DataSubjectRequest>) => {
    const updated = await adminApi.privacy.updateDSR(id, updates);
    setRequests(prev => prev.map(r => r.id === id ? updated : r));
    return updated;
  }, []);

  const completeDSR = useCallback(async (id: string, notes?: string) => {
    await adminApi.privacy.completeDSR(id, notes);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' as const } : r));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    total,
    loading,
    error,
    updateDSR,
    completeDSR,
    refetch: fetchRequests,
  };
}

// ===========================================
// Content Hooks
// ===========================================

export function useAdminContent() {
  const [pages, setPages] = useState<PlatformContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.content.getPages();
      setPages(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pages'));
    } finally {
      setLoading(false);
    }
  }, []);

  const savePage = useCallback(async (pageKey: string, content: Record<string, unknown>, title: string) => {
    const saved = await adminApi.content.savePage(pageKey, content, title);
    setPages(prev => {
      const exists = prev.find(p => p.page_key === pageKey);
      if (exists) {
        return prev.map(p => p.page_key === pageKey ? saved : p);
      }
      return [...prev, saved];
    });
    return saved;
  }, []);

  const publishPage = useCallback(async (id: string) => {
    await adminApi.content.publishPage(id);
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'published' as const } : p));
  }, []);

  const unpublishPage = useCallback(async (id: string) => {
    await adminApi.content.unpublishPage(id);
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'draft' as const } : p));
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    pages,
    loading,
    error,
    savePage,
    publishPage,
    unpublishPage,
    refetch: fetchPages,
  };
}

export function useAdminAnnouncements(activeOnly: boolean = false) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.content.getAnnouncements(activeOnly);
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch announcements'));
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  const createAnnouncement = useCallback(async (announcement: Omit<Announcement, 'id' | 'created_at' | 'created_by'>) => {
    const created = await adminApi.content.createAnnouncement(announcement);
    setAnnouncements(prev => [created, ...prev]);
    return created;
  }, []);

  const updateAnnouncement = useCallback(async (id: string, updates: Partial<Announcement>) => {
    const updated = await adminApi.content.updateAnnouncement(id, updates);
    setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  }, []);

  const deleteAnnouncement = useCallback(async (id: string) => {
    await adminApi.content.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements,
  };
}

// ===========================================
// Staff Hooks
// ===========================================

export function useAdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.staff.list();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch staff'));
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteStaff = useCallback(async (email: string, role: string, permissions: string[]) => {
    await adminApi.staff.invite(email, role, permissions);
    await fetchStaff();
  }, [fetchStaff]);

  const updatePermissions = useCallback(async (id: string, permissions: string[]) => {
    await adminApi.staff.updatePermissions(id, permissions);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, permissions } : s));
  }, []);

  const updateRole = useCallback(async (id: string, role: string) => {
    await adminApi.staff.updateRole(id, role);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s));
  }, []);

  const deactivateStaff = useCallback(async (id: string) => {
    await adminApi.staff.deactivate(id);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: false } : s));
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    inviteStaff,
    updatePermissions,
    updateRole,
    deactivateStaff,
    refetch: fetchStaff,
  };
}

// ===========================================
// Audit Logs Hooks
// ===========================================

interface UseAdminAuditLogsOptions {
  event_type?: string;
  severity?: string;
  actor_id?: string;
  resource_type?: string;
  since?: string;
  until?: string;
  page?: number;
  limit?: number;
}

export function useAdminAuditLogs(options?: UseAdminAuditLogsOptions) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { logs: data, total: count } = await adminApi.audit.getLogs(options);
      setLogs(data);
      setTotal(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'));
    } finally {
      setLoading(false);
    }
  }, [
    options?.event_type,
    options?.severity,
    options?.actor_id,
    options?.resource_type,
    options?.since,
    options?.until,
    options?.page,
    options?.limit,
  ]);

  const exportLogs = useCallback(async (since: string, until: string, event_type?: string) => {
    return adminApi.audit.exportLogs({ since, until, event_type });
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    total,
    loading,
    error,
    exportLogs,
    refetch: fetchLogs,
  };
}
