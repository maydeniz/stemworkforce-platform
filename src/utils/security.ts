// ===========================================
// Security Utilities
// ===========================================

import { ENV_CONFIG } from '@/config';

/**
 * Cryptographically secure random ID generation
 */
export const generateSecureId = (): string => {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => x.toString(16).padStart(8, '0')).join('');
};

/**
 * Generate a session ID
 */
export const generateSessionId = (): string => {
  return `sess_${generateSecureId()}`;
};

/**
 * XSS-safe text sanitization
 */
export const sanitizeInput = (input: unknown, maxLength = 1000): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, maxLength);
};

/**
 * Sanitize object properties recursively
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }
  return sanitized;
};

/**
 * Secure storage with encryption marker and TTL
 */
interface SecuredData<T> {
  data: T;
  timestamp: number;
  version: number;
  checksum?: string;
}

const STORAGE_VERSION = 1;
const STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const secureStore = {
  set: <T>(key: string, value: T): void => {
    try {
      const secured: SecuredData<T> = {
        data: value,
        timestamp: Date.now(),
        version: STORAGE_VERSION,
      };
      localStorage.setItem(`__secure_${key}`, JSON.stringify(secured));
    } catch (error) {
      console.error('[SECURITY] Storage set error:', error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`__secure_${key}`);
      if (!item) return null;

      const parsed: SecuredData<T> = JSON.parse(item);

      // Check version compatibility
      if (parsed.version !== STORAGE_VERSION) {
        localStorage.removeItem(`__secure_${key}`);
        return null;
      }

      // Check for data expiry
      if (Date.now() - parsed.timestamp > STORAGE_TTL) {
        localStorage.removeItem(`__secure_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`__secure_${key}`);
  },

  clear: (): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('__secure_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  },
};

/**
 * CSRF Token management
 */
let csrfToken: string | null = null;

export const getCSRFToken = (): string => {
  if (!csrfToken) {
    csrfToken = generateSecureId();
    sessionStorage.setItem('csrf_token', csrfToken);
  }
  return csrfToken;
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
};

export const refreshCSRFToken = (): string => {
  csrfToken = generateSecureId();
  sessionStorage.setItem('csrf_token', csrfToken);
  return csrfToken;
};

/**
 * Password strength validation
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  return { score: Math.min(score, 4), feedback };
};

/**
 * Rate limiting helper
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string,
  maxRequests: number = ENV_CONFIG.API_RATE_LIMIT,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
};

/**
 * Input validation helpers
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Content Security Policy nonce generator
 */
export const generateCSPNonce = (): string => {
  return btoa(generateSecureId());
};
