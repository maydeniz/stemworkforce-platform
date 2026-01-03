// ===========================================
// Audit Logging System
// ===========================================

import { ENV_CONFIG } from '@/config';
import { generateSecureId } from './security';
import type { AuditEntry } from '@/types';

type AuditSeverity = 'info' | 'warning' | 'error';

interface AuditDetails {
  [key: string]: unknown;
}

class AuditLoggerService {
  private queue: AuditEntry[] = [];
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = sessionStorage.getItem('sessionId') || this.initSession();
    this.startFlushTimer();

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
    }
  }

  private initSession(): string {
    const sessionId = `sess_${generateSecureId()}`;
    sessionStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  private startFlushTimer(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Log an audit entry
   */
  log(action: string, details: AuditDetails = {}, severity: AuditSeverity = 'info'): void {
    if (!ENV_CONFIG.ENABLE_AUDIT_LOGGING) return;

    const entry: AuditEntry = {
      id: generateSecureId(),
      timestamp: new Date().toISOString(),
      action,
      details: { ...details, sanitized: true },
      severity,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent.slice(0, 200),
      url: window.location.pathname,
    };

    this.queue.push(entry);

    // Debug logging in development
    if (ENV_CONFIG.ENABLE_DEBUG_MODE) {
      console.log(`[AUDIT] ${severity.toUpperCase()}: ${action}`, details);
    }

    // Flush if batch size reached
    if (this.queue.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  /**
   * Flush audit queue to server
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      // In production, send to audit endpoint
      if (ENV_CONFIG.IS_PRODUCTION) {
        await fetch(`${ENV_CONFIG.API_BASE_URL}/v1/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries: batch }),
          keepalive: true,
        });
      } else {
        // In development, just log to console
        console.group('[AUDIT] Batch flush');
        batch.forEach((entry) => {
          console.log(`${entry.severity}: ${entry.action}`, entry.details);
        });
        console.groupEnd();
      }
    } catch (error) {
      // Re-queue failed entries
      this.queue = [...batch, ...this.queue];
      console.error('[AUDIT] Failed to flush audit log:', error);
    }
  }

  // Convenience methods for common audit events
  loginAttempt(email: string, success: boolean, method: string = 'password'): void {
    this.log('auth.login_attempt', { email: email.slice(0, 50), success, method }, success ? 'info' : 'warning');
  }

  logout(userId: string, reason: string = 'user_initiated'): void {
    this.log('auth.logout', { userId, reason }, 'info');
  }

  sessionTimeout(userId: string): void {
    this.log('auth.session_timeout', { userId }, 'warning');
  }

  pageView(page: string, referrer?: string): void {
    this.log('navigation.page_view', { page, referrer }, 'info');
  }

  jobAction(action: 'view' | 'apply' | 'save' | 'unsave', jobId: string, jobTitle?: string): void {
    this.log(`job.${action}`, { jobId, jobTitle }, 'info');
  }

  eventAction(action: 'view' | 'register' | 'unregister', eventId: string, eventTitle?: string): void {
    this.log(`event.${action}`, { eventId, eventTitle }, 'info');
  }

  trainingAction(action: 'view' | 'enroll' | 'complete', programId: string, programTitle?: string): void {
    this.log(`training.${action}`, { programId, programTitle }, 'info');
  }

  search(query: string, filters: Record<string, unknown>, resultsCount: number): void {
    this.log('search.execute', { query: query.slice(0, 100), filters, resultsCount }, 'info');
  }

  dataExport(dataType: string, format: string, recordCount: number): void {
    this.log('data.export', { dataType, format, recordCount }, 'info');
  }

  error(errorType: string, message: string, stack?: string): void {
    this.log('error.occurred', { errorType, message, stack: stack?.slice(0, 500) }, 'error');
  }

  permissionDenied(action: string, resource: string): void {
    this.log('security.permission_denied', { action, resource }, 'warning');
  }

  apiCall(endpoint: string, method: string, status: number, duration: number): void {
    this.log('api.call', { endpoint, method, status, duration }, status >= 400 ? 'warning' : 'info');
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Reset session (on logout)
   */
  resetSession(): void {
    this.flush();
    this.sessionId = this.initSession();
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    this.flush();
    this.stopFlushTimer();
  }
}

// Singleton instance
export const AuditLogger = new AuditLoggerService();

// React hook for audit logging
export const useAuditLogger = () => AuditLogger;
