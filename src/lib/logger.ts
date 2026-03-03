// ===========================================
// Production-Safe Logging Utility
// ===========================================

import { ENV_CONFIG } from '@/config/env';
import { captureMessage, addBreadcrumb } from './sentry';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Production-safe logger that:
 * - Only logs to console in development
 * - Sends important logs to Sentry in production
 * - Never exposes sensitive data
 */
class Logger {
  private isDev = ENV_CONFIG.IS_DEVELOPMENT;
  private isDebugMode = ENV_CONFIG.ENABLE_DEBUG_MODE;

  /**
   * Sanitize sensitive data from log context
   */
  private sanitize(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'creditcard',
      'ssn',
      'apikey',
    ];

    const sanitized: LogContext = {};

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitive) =>
        lowerKey.includes(sensitive)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value as LogContext);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Debug level - only in development with debug mode
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDev && this.isDebugMode) {
      console.debug(
        this.formatMessage('debug', message, this.sanitize(context))
      );
    }
  }

  /**
   * Info level - development only, or adds breadcrumb in production
   */
  info(message: string, context?: LogContext): void {
    const sanitizedContext = this.sanitize(context);

    if (this.isDev) {
      console.info(this.formatMessage('info', message, sanitizedContext));
    } else {
      // Add as breadcrumb for debugging in production
      addBreadcrumb('log', message, sanitizedContext, 'info');
    }
  }

  /**
   * Warning level - always logs, sends to Sentry in production
   */
  warn(message: string, context?: LogContext): void {
    const sanitizedContext = this.sanitize(context);

    if (this.isDev) {
      console.warn(this.formatMessage('warn', message, sanitizedContext));
    } else {
      // Add breadcrumb and potentially capture
      addBreadcrumb('log', message, sanitizedContext, 'warning');
    }
  }

  /**
   * Error level - always logs, always sends to Sentry
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const sanitizedContext = this.sanitize(context);
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (this.isDev) {
      console.error(
        this.formatMessage('error', message, {
          ...sanitizedContext,
          error: errorMessage,
        })
      );
      if (error instanceof Error) {
        console.error(error.stack);
      }
    } else {
      // Send to Sentry in production
      captureMessage(
        `${message}: ${errorMessage}`,
        'error',
        sanitizedContext as Record<string, unknown>
      );
    }
  }

  /**
   * Log API calls for debugging
   */
  apiCall(
    method: string,
    endpoint: string,
    status?: number,
    duration?: number
  ): void {
    this.info(`API ${method} ${endpoint}`, {
      status,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  /**
   * Log authentication events
   */
  auth(event: string, context?: LogContext): void {
    // Auth events are sensitive, only log in dev
    if (this.isDev) {
      this.debug(`Auth: ${event}`, context);
    } else {
      // In production, just add a breadcrumb without details
      addBreadcrumb('auth', event, undefined, 'info');
    }
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, unit = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit });
  }

  /**
   * Create a scoped logger with a prefix
   */
  scope(prefix: string): ScopedLogger {
    return new ScopedLogger(prefix, this);
  }
}

/**
 * Scoped logger that prefixes all messages
 */
class ScopedLogger {
  constructor(
    private prefix: string,
    private logger: Logger
  ) {}

  debug(message: string, context?: LogContext): void {
    this.logger.debug(`[${this.prefix}] ${message}`, context);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(`[${this.prefix}] ${message}`, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(`[${this.prefix}] ${message}`, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.logger.error(`[${this.prefix}] ${message}`, error, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger, ScopedLogger };

// Convenience exports
export const { debug, info, warn, error } = logger;
