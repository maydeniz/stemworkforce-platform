// ===========================================
// Role-Based Access Control Configuration
// ===========================================

import type { UserRole, RBACConfig, DataAccessLevel } from '@/types';

export const RBAC_CONFIG: Record<UserRole, RBACConfig> = {
  intern: {
    canView: ['home', 'intern-hub', 'events', 'training-portal', 'pricing', 'innovate', 'dashboard'],
    canApply: true,
    canPost: false,
    canManageUsers: false,
    dashboardType: 'learner',
    dataAccess: ['own'],
  },
  jobseeker: {
    canView: ['home', 'intern-hub', 'workforce-map', 'events', 'training-portal', 'pricing', 'innovate', 'dashboard'],
    canApply: true,
    canPost: false,
    canManageUsers: false,
    dashboardType: 'learner',
    dataAccess: ['own'],
  },
  educator: {
    canView: ['*'],
    canApply: false,
    canPost: true,
    canManageUsers: true,
    dashboardType: 'educator',
    dataAccess: ['own', 'students', 'programs'],
  },
  partner: {
    canView: ['*'],
    canApply: false,
    canPost: true,
    canManageUsers: true,
    dashboardType: 'partner',
    dataAccess: ['own', 'applicants', 'postings'],
  },
  admin: {
    canView: ['*'],
    canApply: true,
    canPost: true,
    canManageUsers: true,
    dashboardType: 'admin',
    dataAccess: ['*'],
  },
};

// Permission checker utilities
export const PermissionChecker = {
  canViewPage: (role: UserRole | null, page: string): boolean => {
    if (!role || !RBAC_CONFIG[role]) return page === 'home';
    const config = RBAC_CONFIG[role];
    return config.canView.includes('*') || config.canView.includes(page);
  },

  canPerformAction: (role: UserRole | null, action: 'apply' | 'post' | 'manage_users'): boolean => {
    if (!role || !RBAC_CONFIG[role]) return false;
    const config = RBAC_CONFIG[role];
    switch (action) {
      case 'apply':
        return config.canApply;
      case 'post':
        return config.canPost;
      case 'manage_users':
        return config.canManageUsers;
      default:
        return false;
    }
  },

  hasDataAccess: (role: UserRole | null, dataType: DataAccessLevel): boolean => {
    if (!role || !RBAC_CONFIG[role]) return false;
    const config = RBAC_CONFIG[role];
    return config.dataAccess.includes('*') || config.dataAccess.includes(dataType);
  },

  getDashboardType: (role: UserRole | null): string => {
    if (!role || !RBAC_CONFIG[role]) return 'learner';
    return RBAC_CONFIG[role].dashboardType;
  },
};

// Route protection configuration
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['intern', 'jobseeker', 'educator', 'partner', 'admin'],
  '/dashboard/admin': ['admin'],
  '/dashboard/partner': ['partner', 'admin'],
  '/dashboard/educator': ['educator', 'admin'],
  '/post-job': ['partner', 'admin'],
  '/manage-users': ['educator', 'partner', 'admin'],
  '/analytics': ['partner', 'admin'],
  '/reports': ['educator', 'partner', 'admin'],
};

// Action permissions by role
export const ACTION_PERMISSIONS = {
  JOB_APPLY: ['intern', 'jobseeker', 'admin'],
  JOB_POST: ['partner', 'admin'],
  JOB_EDIT: ['partner', 'admin'],
  JOB_DELETE: ['partner', 'admin'],
  EVENT_REGISTER: ['intern', 'jobseeker', 'educator', 'partner', 'admin'],
  EVENT_CREATE: ['educator', 'partner', 'admin'],
  TRAINING_ENROLL: ['intern', 'jobseeker', 'admin'],
  TRAINING_CREATE: ['educator', 'admin'],
  USER_INVITE: ['educator', 'partner', 'admin'],
  USER_MANAGE: ['admin'],
  ANALYTICS_VIEW: ['partner', 'admin'],
  EXPORT_DATA: ['partner', 'admin'],
} as const;

export type ActionType = keyof typeof ACTION_PERMISSIONS;

export const canPerformAction = (role: UserRole | null, action: ActionType): boolean => {
  if (!role) return false;
  return (ACTION_PERMISSIONS[action] as readonly string[]).includes(role);
};
