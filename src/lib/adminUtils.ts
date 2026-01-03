import { supabase } from '@/lib/supabase';

// ===========================================
// ADMIN UTILITIES - Security & Audit Functions
// ===========================================

/**
 * Log an admin action to the audit_logs table
 */
export const logAdminAction = async ({
  eventType,
  action,
  resourceType,
  resourceId,
  resourceName,
  oldValues = null,
  newValues = null,
  metadata = {},
  severity = 'info',
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user for audit log');
      return { error: 'Not authenticated' };
    }

    const { error } = await supabase.from('audit_logs').insert({
      event_type: eventType,
      event_category: 'admin',
      actor_id: user.id,
      actor_email: user.email,
      actor_type: 'admin',
      resource_type: resourceType,
      resource_id: resourceId,
      resource_name: resourceName,
      action: action,
      old_values: oldValues,
      new_values: newValues,
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      severity: severity,
    });

    if (error) {
      console.error('Failed to create audit log:', error);
    }
    
    return { error };
  } catch (err) {
    console.error('Audit logging error:', err);
    return { error: err };
  }
};

/**
 * Common admin actions for audit logging
 */
export const ADMIN_ACTIONS = {
  // User actions
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  USER_REACTIVATED: 'USER_REACTIVATED',
  USER_DELETED: 'USER_DELETED',
  USER_ROLE_ASSIGNED: 'USER_ROLE_ASSIGNED',
  USER_ROLE_REMOVED: 'USER_ROLE_REMOVED',

  // Organization actions
  ORG_VERIFIED: 'ORG_VERIFIED',
  ORG_SUSPENDED: 'ORG_SUSPENDED',
  ORG_UPDATED: 'ORG_UPDATED',

  // Job actions
  JOB_APPROVED: 'JOB_APPROVED',
  JOB_REJECTED: 'JOB_REJECTED',
  JOB_FEATURED: 'JOB_FEATURED',
  JOB_CLOSED: 'JOB_CLOSED',

  // Marketplace actions
  PROVIDER_APPROVED: 'PROVIDER_APPROVED',
  PROVIDER_SUSPENDED: 'PROVIDER_SUSPENDED',
  REVIEW_APPROVED: 'REVIEW_APPROVED',
  REVIEW_REJECTED: 'REVIEW_REJECTED',
  PAYOUT_PROCESSED: 'PAYOUT_PROCESSED',

  // Billing actions
  SUBSCRIPTION_MODIFIED: 'SUBSCRIPTION_MODIFIED',
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  REFUND_PROCESSED: 'REFUND_PROCESSED',
  PLAN_CREATED: 'PLAN_CREATED',
  PLAN_UPDATED: 'PLAN_UPDATED',

  // Campaign actions
  CAMPAIGN_CREATED: 'CAMPAIGN_CREATED',
  CAMPAIGN_APPROVED: 'CAMPAIGN_APPROVED',
  CAMPAIGN_PAUSED: 'CAMPAIGN_PAUSED',
  CAMPAIGN_RESUMED: 'CAMPAIGN_RESUMED',

  // System actions
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  FEATURE_FLAG_TOGGLED: 'FEATURE_FLAG_TOGGLED',

  // Security Center actions
  SESSION_TERMINATED: 'SESSION_TERMINATED',
  SESSION_BULK_TERMINATED: 'SESSION_BULK_TERMINATED',
  ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
  IP_RULE_CREATED: 'IP_RULE_CREATED',
  IP_RULE_UPDATED: 'IP_RULE_UPDATED',
  IP_RULE_DELETED: 'IP_RULE_DELETED',
  RATE_LIMIT_UPDATED: 'RATE_LIMIT_UPDATED',
  SECURITY_HEADER_UPDATED: 'SECURITY_HEADER_UPDATED',
  SECURITY_ALERT_CREATED: 'SECURITY_ALERT_CREATED',

  // Privacy & Compliance actions (GDPR/CCPA)
  DSR_CREATED: 'DSR_CREATED',
  DSR_ASSIGNED: 'DSR_ASSIGNED',
  DSR_VERIFIED: 'DSR_VERIFIED',
  DSR_COMPLETED: 'DSR_COMPLETED',
  DSR_DENIED: 'DSR_DENIED',
  DATA_EXPORTED: 'DATA_EXPORTED',
  DATA_DELETED: 'DATA_DELETED',
  DATA_RECTIFIED: 'DATA_RECTIFIED',
  CCPA_OPTOUT_PROCESSED: 'CCPA_OPTOUT_PROCESSED',
  CONSENT_CATEGORY_CREATED: 'CONSENT_CATEGORY_CREATED',
  CONSENT_CATEGORY_UPDATED: 'CONSENT_CATEGORY_UPDATED',
  RETENTION_POLICY_CREATED: 'RETENTION_POLICY_CREATED',
  RETENTION_POLICY_UPDATED: 'RETENTION_POLICY_UPDATED',
  RETENTION_PURGE_EXECUTED: 'RETENTION_PURGE_EXECUTED',
  DPA_CREATED: 'DPA_CREATED',
  DPA_UPDATED: 'DPA_UPDATED',
  DPA_EXPIRED: 'DPA_EXPIRED',

  // HIPAA Compliance actions
  PHI_ACCESS_ROLE_CREATED: 'PHI_ACCESS_ROLE_CREATED',
  PHI_ACCESS_ROLE_UPDATED: 'PHI_ACCESS_ROLE_UPDATED',
  PHI_OVERRIDE_REQUESTED: 'PHI_OVERRIDE_REQUESTED',
  PHI_OVERRIDE_APPROVED: 'PHI_OVERRIDE_APPROVED',
  PHI_OVERRIDE_DENIED: 'PHI_OVERRIDE_DENIED',
  PHI_ACCESSED: 'PHI_ACCESSED',
  HIPAA_BREACH_REPORTED: 'HIPAA_BREACH_REPORTED',
  HIPAA_BREACH_UPDATED: 'HIPAA_BREACH_UPDATED',
  HIPAA_BREACH_CLOSED: 'HIPAA_BREACH_CLOSED',
  HHS_NOTIFICATION_SENT: 'HHS_NOTIFICATION_SENT',
  HIPAA_TRAINING_COMPLETED: 'HIPAA_TRAINING_COMPLETED',
  HIPAA_TRAINING_ASSIGNED: 'HIPAA_TRAINING_ASSIGNED',
  BAA_CREATED: 'BAA_CREATED',
  BAA_UPDATED: 'BAA_UPDATED',
  BAA_TERMINATED: 'BAA_TERMINATED',

  // SOC 2 & Audit actions
  ACCESS_REVIEW_CREATED: 'ACCESS_REVIEW_CREATED',
  ACCESS_REVIEW_STARTED: 'ACCESS_REVIEW_STARTED',
  ACCESS_REVIEW_COMPLETED: 'ACCESS_REVIEW_COMPLETED',
  ACCESS_REVIEW_ITEM_APPROVED: 'ACCESS_REVIEW_ITEM_APPROVED',
  ACCESS_REVIEW_ITEM_REVOKED: 'ACCESS_REVIEW_ITEM_REVOKED',
  CHANGE_REQUEST_CREATED: 'CHANGE_REQUEST_CREATED',
  CHANGE_REQUEST_APPROVED: 'CHANGE_REQUEST_APPROVED',
  CHANGE_REQUEST_REJECTED: 'CHANGE_REQUEST_REJECTED',
  CHANGE_REQUEST_IMPLEMENTED: 'CHANGE_REQUEST_IMPLEMENTED',
  CHANGE_REQUEST_ROLLED_BACK: 'CHANGE_REQUEST_ROLLED_BACK',
  SECURITY_INCIDENT_CREATED: 'SECURITY_INCIDENT_CREATED',
  SECURITY_INCIDENT_ASSIGNED: 'SECURITY_INCIDENT_ASSIGNED',
  SECURITY_INCIDENT_ESCALATED: 'SECURITY_INCIDENT_ESCALATED',
  SECURITY_INCIDENT_RESOLVED: 'SECURITY_INCIDENT_RESOLVED',
  VENDOR_CREATED: 'VENDOR_CREATED',
  VENDOR_UPDATED: 'VENDOR_UPDATED',
  VENDOR_RISK_ASSESSED: 'VENDOR_RISK_ASSESSED',
  VENDOR_DEACTIVATED: 'VENDOR_DEACTIVATED',

  // Communications actions
  ANNOUNCEMENT_CREATED: 'ANNOUNCEMENT_CREATED',
  ANNOUNCEMENT_PUBLISHED: 'ANNOUNCEMENT_PUBLISHED',
  ANNOUNCEMENT_EXPIRED: 'ANNOUNCEMENT_EXPIRED',
  ANNOUNCEMENT_DELETED: 'ANNOUNCEMENT_DELETED',
  PARTNER_MESSAGE_SENT: 'PARTNER_MESSAGE_SENT',

  // Content Management actions
  CONTENT_PAGE_CREATED: 'CONTENT_PAGE_CREATED',
  CONTENT_PAGE_UPDATED: 'CONTENT_PAGE_UPDATED',
  CONTENT_PAGE_PUBLISHED: 'CONTENT_PAGE_PUBLISHED',
  CONTENT_PAGE_ARCHIVED: 'CONTENT_PAGE_ARCHIVED',
  SITE_BANNER_CREATED: 'SITE_BANNER_CREATED',
  SITE_BANNER_UPDATED: 'SITE_BANNER_UPDATED',
  SITE_BANNER_ACTIVATED: 'SITE_BANNER_ACTIVATED',
  SITE_BANNER_DEACTIVATED: 'SITE_BANNER_DEACTIVATED',
  SITE_BANNER_DELETED: 'SITE_BANNER_DELETED',
};

/**
 * Admin role definitions
 */
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SECURITY_ADMIN: 'SECURITY_ADMIN',
  PRIVACY_OFFICER: 'PRIVACY_OFFICER',
  INCIDENT_MANAGER: 'INCIDENT_MANAGER',
  COMMUNICATIONS_ADMIN: 'COMMUNICATIONS_ADMIN',
  COMPLIANCE_AUDITOR: 'COMPLIANCE_AUDITOR',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
  ANALYST: 'ANALYST',
};

/**
 * Admin permission definitions
 */
export const ADMIN_PERMISSIONS = {
  // Security permissions
  SECURITY_VIEW_SESSIONS: 'security.view_sessions',
  SECURITY_MANAGE_SESSIONS: 'security.manage_sessions',
  SECURITY_VIEW_FAILED_LOGINS: 'security.view_failed_logins',
  SECURITY_MANAGE_IP_RULES: 'security.manage_ip_rules',
  SECURITY_MANAGE_RATE_LIMITS: 'security.manage_rate_limits',
  SECURITY_MANAGE_HEADERS: 'security.manage_headers',

  // Privacy permissions
  PRIVACY_VIEW_DSR: 'privacy.view_dsr',
  PRIVACY_MANAGE_DSR: 'privacy.manage_dsr',
  PRIVACY_MANAGE_CONSENT: 'privacy.manage_consent',
  PRIVACY_MANAGE_RETENTION: 'privacy.manage_retention',
  PRIVACY_MANAGE_DPA: 'privacy.manage_dpa',
  PRIVACY_EXECUTE_PURGE: 'privacy.execute_purge',

  // HIPAA permissions
  HIPAA_VIEW_PHI_LOGS: 'hipaa.view_phi_logs',
  HIPAA_MANAGE_PHI_ROLES: 'hipaa.manage_phi_roles',
  HIPAA_APPROVE_OVERRIDES: 'hipaa.approve_overrides',
  HIPAA_MANAGE_BREACH: 'hipaa.manage_breach',
  HIPAA_MANAGE_TRAINING: 'hipaa.manage_training',
  HIPAA_MANAGE_BAA: 'hipaa.manage_baa',

  // Audit permissions
  AUDIT_VIEW_REVIEWS: 'audit.view_reviews',
  AUDIT_MANAGE_REVIEWS: 'audit.manage_reviews',
  AUDIT_VIEW_CHANGES: 'audit.view_changes',
  AUDIT_MANAGE_CHANGES: 'audit.manage_changes',
  AUDIT_APPROVE_CHANGES: 'audit.approve_changes',
  AUDIT_VIEW_INCIDENTS: 'audit.view_incidents',
  AUDIT_MANAGE_INCIDENTS: 'audit.manage_incidents',
  AUDIT_VIEW_VENDORS: 'audit.view_vendors',
  AUDIT_MANAGE_VENDORS: 'audit.manage_vendors',

  // Communications permissions
  COMM_VIEW_ANNOUNCEMENTS: 'communications.view_announcements',
  COMM_MANAGE_ANNOUNCEMENTS: 'communications.manage_announcements',
  COMM_SEND_PARTNER_MESSAGES: 'communications.send_partner_messages',

  // Content permissions
  CONTENT_VIEW_PAGES: 'content.view_pages',
  CONTENT_MANAGE_PAGES: 'content.manage_pages',
  CONTENT_PUBLISH_PAGES: 'content.publish_pages',
  CONTENT_VIEW_BANNERS: 'content.view_banners',
  CONTENT_MANAGE_BANNERS: 'content.manage_banners',
};

// ===========================================
// INPUT VALIDATION
// ===========================================

/**
 * Validate string input
 */
export const validateString = (value, { minLength = 0, maxLength = 255, required = false, label = 'Field' }) => {
  if (required && (!value || value.trim() === '')) {
    return `${label} is required`;
  }
  if (value && value.length < minLength) {
    return `${label} must be at least ${minLength} characters`;
  }
  if (value && value.length > maxLength) {
    return `${label} must be less than ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

/**
 * Validate number in range
 */
export const validateNumber = (value, { min = null, max = null, required = false, label = 'Value' }) => {
  if (required && (value === null || value === undefined || value === '')) {
    return `${label} is required`;
  }
  const num = parseFloat(value);
  if (isNaN(num)) return `${label} must be a number`;
  if (min !== null && num < min) return `${label} must be at least ${min}`;
  if (max !== null && num > max) return `${label} must be at most ${max}`;
  return null;
};

/**
 * Validate form data object
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    if (fieldRules.type === 'string') {
      const error = validateString(value, fieldRules);
      if (error) errors[field] = error;
    } else if (fieldRules.type === 'email') {
      const error = validateEmail(value);
      if (error) errors[field] = error;
    } else if (fieldRules.type === 'number') {
      const error = validateNumber(value, fieldRules);
      if (error) errors[field] = error;
    } else if (fieldRules.custom) {
      const error = fieldRules.custom(value, data);
      if (error) errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ===========================================
// CONFIRMATION HELPERS
// ===========================================

/**
 * Show confirmation dialog for destructive actions
 */
export const confirmAction = async (message, { 
  title = 'Confirm Action',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  // For now, use browser confirm
  // In production, replace with custom modal
  return window.confirm(`${title}\n\n${message}`);
};

/**
 * Pre-built confirmation messages
 */
export const CONFIRM_MESSAGES = {
  suspendUser: (name) => `Are you sure you want to suspend ${name}? They will lose access to their account.`,
  deleteUser: (name) => `Are you sure you want to permanently delete ${name}'s account? This action cannot be undone.`,
  suspendOrg: (name) => `Are you sure you want to suspend ${name}? All associated users will lose access.`,
  cancelSubscription: () => 'Are you sure you want to cancel this subscription? Access will continue until the end of the billing period.',
  approveProvider: (name) => `Approve ${name} as a marketplace provider? They will be able to list services.`,
  suspendProvider: (name) => `Suspend ${name}? Their services will be hidden from the marketplace.`,
  rejectReview: () => 'Reject this review? It will not be visible to other users.',
  processRefund: (amount) => `Process a refund of $${amount}? This action cannot be undone.`,
  pauseCampaign: (name) => `Pause the campaign "${name}"? Ads will stop serving immediately.`,
  deletePlan: (name) => `Delete the "${name}" plan? Existing subscribers will be moved to a default plan.`,
};

// ===========================================
// RATE LIMITING
// ===========================================

const rateLimitStore = new Map();

/**
 * Simple client-side rate limiter
 */
export const checkRateLimit = (key, { maxCalls = 10, windowMs = 60000 }) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const calls = rateLimitStore.get(key);
  
  // Remove calls outside the window
  const validCalls = calls.filter(time => time > windowStart);
  rateLimitStore.set(key, validCalls);
  
  if (validCalls.length >= maxCalls) {
    return {
      allowed: false,
      retryAfter: Math.ceil((validCalls[0] + windowMs - now) / 1000),
    };
  }
  
  validCalls.push(now);
  return { allowed: true };
};

// ===========================================
// PERMISSION CHECKING
// ===========================================

/**
 * Check if user has specific permission
 */
export const checkPermission = async (permissionName) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('user_role_assignments')
      .select(`
        admin_roles!inner(
          role_permissions!inner(
            admin_permissions!inner(name)
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true);
    
    if (error || !data) return false;
    
    // Flatten permissions
    const permissions = data.flatMap(assignment => 
      assignment.admin_roles?.role_permissions?.map(rp => 
        rp.admin_permissions?.name
      ) || []
    );
    
    return permissions.includes(permissionName);
  } catch (err) {
    console.error('Permission check error:', err);
    return false;
  }
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = async (roleNames) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('user_role_assignments')
      .select('admin_roles(name)')
      .eq('user_id', user.id)
      .eq('is_active', true);
    
    if (error || !data) return false;
    
    const userRoles = data.map(d => d.admin_roles?.name).filter(Boolean);
    return roleNames.some(role => userRoles.includes(role));
  } catch (err) {
    console.error('Role check error:', err);
    return false;
  }
};

// ===========================================
// ERROR HANDLING
// ===========================================

/**
 * Handle Supabase errors consistently
 */
export const handleSupabaseError = (error, defaultMessage = 'An error occurred') => {
  if (!error) return null;
  
  // Map common Supabase errors to user-friendly messages
  const errorMessages = {
    '23505': 'This item already exists',
    '23503': 'Cannot delete: item is referenced by other records',
    '42501': 'You do not have permission to perform this action',
    'PGRST301': 'You do not have access to this resource',
  };
  
  const code = error.code || error.message;
  return errorMessages[code] || error.message || defaultMessage;
};

/**
 * Wrap async function with error handling
 */
export const withErrorHandling = (fn, { onError, onSuccess }) => {
  return async (...args) => {
    try {
      const result = await fn(...args);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      if (onError) onError(message, error);
      throw error;
    }
  };
};

export default {
  logAdminAction,
  ADMIN_ACTIONS,
  ADMIN_ROLES,
  ADMIN_PERMISSIONS,
  validateForm,
  validateString,
  validateEmail,
  validateNumber,
  confirmAction,
  CONFIRM_MESSAGES,
  checkRateLimit,
  checkPermission,
  hasAnyRole,
  handleSupabaseError,
  withErrorHandling,
};
