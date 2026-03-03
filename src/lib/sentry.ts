// ===========================================
// Sentry Error Tracking Configuration
// ===========================================

// Note: @sentry/react types are bundled with the package
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Sentry: any;
try {
  // Dynamic import to handle cases where Sentry isn't installed
  Sentry = require('@sentry/react');
} catch {
  // Sentry not available - use stub
  Sentry = {
    init: () => {},
    captureException: () => {},
    captureMessage: () => {},
    setUser: () => {},
    setContext: () => {},
    setTag: () => {},
    addBreadcrumb: () => {},
    withScope: (cb: (scope: unknown) => void) => cb({}),
    Severity: { Error: 'error', Warning: 'warning', Info: 'info' },
  };
}
import { ENV_CONFIG } from '@/config/env';

/**
 * Initialize Sentry error tracking
 * Call this before rendering the app in main.tsx
 */
export const initSentry = (): void => {
  const dsn = ENV_CONFIG.SENTRY_DSN;

  if (!dsn) {
    if (ENV_CONFIG.IS_DEVELOPMENT) {
      console.warn('[Sentry] No DSN configured - error tracking disabled');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: ENV_CONFIG.IS_PRODUCTION ? 'production' : 'development',
    release: `stemworkforce@${ENV_CONFIG.APP_VERSION}`,

    // Performance monitoring
    tracesSampleRate: ENV_CONFIG.IS_PRODUCTION ? 0.1 : 1.0,

    // Session replay for debugging (only in production, sampled)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Don't send PII
    sendDefaultPii: false,

    // Filter out known non-issues
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.telecom.com/',
      'chrome-extension://',
      'moz-extension://',
      // Network errors that are expected
      'Failed to fetch',
      'NetworkError',
      'Network request failed',
      'Load failed',
      // User actions
      'ResizeObserver loop',
      'AbortError',
    ],

    // Filter sensitive data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeSend(event: any) {
      // Remove any potential tokens from URLs
      if (event.request?.url) {
        event.request.url = event.request.url.replace(
          /token=[^&]*/gi,
          'token=[FILTERED]'
        );
      }

      // Remove cookies
      if (event.request?.cookies) {
        delete event.request.cookies;
      }

      return event;
    },

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
};

/**
 * Set user context for error tracking
 */
export const setSentryUser = (user: { id: string; email?: string; role?: string } | null): void => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      // Don't send email in production for privacy
      ...(ENV_CONFIG.IS_DEVELOPMENT && user.email ? { email: user.email } : {}),
    });
    Sentry.setTag('user_role', user.role || 'unknown');
  } else {
    Sentry.setUser(null);
  }
};

/**
 * Capture an exception with context
 */
export const captureException = (
  error: Error,
  context?: Record<string, unknown>
): string => {
  return Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Capture a message with severity level
 */
export const captureMessage = (
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: Record<string, unknown>
): string => {
  return Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
): void => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
};

/**
 * Create a performance transaction
 */
export const startTransaction = (
  name: string,
  op: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return Sentry.startInactiveSpan?.({ name, op });
};

/**
 * Wrap a component with Sentry error boundary
 */
export const withSentryErrorBoundary = Sentry.withErrorBoundary;

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureException(
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
      { type: 'unhandledrejection' }
    );
  });

  // Handle global errors not caught by React
  window.addEventListener('error', (event) => {
    // Ignore errors from browser extensions
    if (event.filename?.includes('extension://')) {
      return;
    }

    captureException(event.error || new Error(event.message), {
      type: 'window.onerror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
};

export default {
  initSentry,
  setSentryUser,
  captureException,
  captureMessage,
  addBreadcrumb,
  startTransaction,
  withSentryErrorBoundary,
  setupGlobalErrorHandlers,
};
