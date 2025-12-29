// ===========================================
// Environment Configuration
// ===========================================

export const ENV_CONFIG = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_URL || '/api',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  
  // Auth
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN || '',
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  AUTH0_CALLBACK_URL: import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  
  // Features
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_AUDIT_LOGGING: import.meta.env.VITE_ENABLE_AUDIT_LOGGING !== 'false',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  
  // Session
  SESSION_TIMEOUT: (parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '30') * 60 * 1000),
  TOKEN_REFRESH_INTERVAL: (parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL_MINUTES || '5') * 60 * 1000),
  
  // Rate Limiting
  API_RATE_LIMIT: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
  SEARCH_DEBOUNCE_MS: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS || '300'),
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '20'),
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
  
  // Retry
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BASE_DELAY: 1000,
  
  // Toast
  TOAST_MAX_COUNT: 5,
  TOAST_DURATION: 5000,
  
  // External
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  GA_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  CDN_URL: import.meta.env.VITE_CDN_URL || '',
  
  // App Info
  APP_NAME: 'STEMWorkforce',
  APP_VERSION: import.meta.env.npm_package_version || '3.0.0',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

export type EnvConfig = typeof ENV_CONFIG;
