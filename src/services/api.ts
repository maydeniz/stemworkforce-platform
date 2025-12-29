// ===========================================
// API Service Layer
// ===========================================

import { ENV_CONFIG } from '@/config';
import { generateSecureId, getCSRFToken } from '@/utils/security';
import { AuditLogger } from '@/utils/audit';
import type { ApiResponse, SearchFilters } from '@/types';

// Custom API Error class
export class APIError extends Error {
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    endpoint: string,
    method: string,
    status: number = 0,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
    this.endpoint = endpoint;
    this.method = method;
    this.status = status;
    this.timestamp = new Date().toISOString();
    this.details = details;
  }
}

// Request options
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  retry?: boolean;
  timeout?: number;
}

// API Service singleton
class ApiService {
  private baseUrl: string;
  private requestQueue: Map<string, Promise<unknown>>;

  constructor() {
    this.baseUrl = `${ENV_CONFIG.API_BASE_URL}/${ENV_CONFIG.API_VERSION}`;
    this.requestQueue = new Map();
  }

  /**
   * Build headers for request
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCSRFToken(),
      'X-Request-ID': generateSecureId(),
      ...customHeaders,
    };
  }

  /**
   * Execute request with retry logic
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
    attempt: number = 1
  ): Promise<T> {
    const { body, retry = true, timeout = 30000, ...fetchOptions } = options;
    const method = options.method || 'GET';
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        headers: this.getHeaders(fetchOptions.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;
      AuditLogger.apiCall(endpoint, method, response.status, duration);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `Request failed with status ${response.status}`,
          endpoint,
          method,
          response.status,
          errorData.details
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout', endpoint, method, 408);
      }

      // Retry on network errors
      if (retry && attempt < ENV_CONFIG.MAX_RETRY_ATTEMPTS && !(error instanceof APIError)) {
        console.log(`[API] Retry ${attempt + 1}/${ENV_CONFIG.MAX_RETRY_ATTEMPTS} for ${endpoint}`);
        const delay = Math.pow(2, attempt) * ENV_CONFIG.RETRY_BASE_DELAY;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeRequest<T>(endpoint, options, attempt + 1);
      }

      // Log error
      if (error instanceof APIError) {
        AuditLogger.error('api_error', error.message, error.stack);
        throw error;
      }

      const apiError = new APIError(
        error instanceof Error ? error.message : 'Unknown error',
        endpoint,
        method
      );
      AuditLogger.error('api_error', apiError.message, apiError.stack);
      throw apiError;
    }
  }

  /**
   * Deduplicated fetch - prevents duplicate concurrent requests
   */
  async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const requestId = `${options.method || 'GET'}_${endpoint}`;

    // Return existing request if in progress
    if (this.requestQueue.has(requestId)) {
      return this.requestQueue.get(requestId) as Promise<T>;
    }

    // Create new request
    const requestPromise = this.executeRequest<T>(endpoint, options);
    this.requestQueue.set(requestId, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.requestQueue.delete(requestId);
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Singleton instance
export const api = new ApiService();

// ===========================================
// Domain-specific API modules
// ===========================================

// Jobs API
export const jobsApi = {
  list: (filters?: SearchFilters) => api.get<ApiResponse<import('@/types').Job[]>>('/jobs', {
    headers: filters ? { 'X-Filters': JSON.stringify(filters) } : undefined,
  }),
  
  get: (id: string) => api.get<import('@/types').Job>(`/jobs/${id}`),
  
  create: (job: Partial<import('@/types').Job>) => api.post<import('@/types').Job>('/jobs', job),
  
  update: (id: string, job: Partial<import('@/types').Job>) => api.patch<import('@/types').Job>(`/jobs/${id}`, job),
  
  delete: (id: string) => api.delete<void>(`/jobs/${id}`),
  
  apply: (jobId: string, application: import('@/types').JobApplicationForm) => 
    api.post<import('@/types').JobApplication>(`/jobs/${jobId}/apply`, application),
  
  save: (jobId: string) => api.post<void>(`/jobs/${jobId}/save`, {}),
  
  unsave: (jobId: string) => api.delete<void>(`/jobs/${jobId}/save`),
  
  getSavedJobs: () => api.get<import('@/types').Job[]>('/jobs/saved'),
  
  getApplications: () => api.get<import('@/types').JobApplication[]>('/jobs/applications'),
};

// Events API
export const eventsApi = {
  list: (_filters?: SearchFilters) => api.get<ApiResponse<import('@/types').Event[]>>('/events'),
  
  get: (id: string) => api.get<import('@/types').Event>(`/events/${id}`),
  
  create: (event: Partial<import('@/types').Event>) => api.post<import('@/types').Event>('/events', event),
  
  update: (id: string, event: Partial<import('@/types').Event>) => api.patch<import('@/types').Event>(`/events/${id}`, event),
  
  delete: (id: string) => api.delete<void>(`/events/${id}`),
  
  register: (eventId: string) => api.post<import('@/types').EventRegistration>(`/events/${eventId}/register`, {}),
  
  unregister: (eventId: string) => api.delete<void>(`/events/${eventId}/register`),
  
  getRegistrations: () => api.get<import('@/types').EventRegistration[]>('/events/registrations'),
};

// Training API
export const trainingApi = {
  list: (_filters?: SearchFilters) => api.get<ApiResponse<import('@/types').TrainingProgram[]>>('/training'),
  
  get: (id: string) => api.get<import('@/types').TrainingProgram>(`/training/${id}`),
  
  enroll: (programId: string) => api.post<void>(`/training/${programId}/enroll`, {}),
  
  getEnrollments: () => api.get<import('@/types').TrainingProgram[]>('/training/enrollments'),
};

// User API
export const userApi = {
  getProfile: () => api.get<import('@/types').User>('/user/profile'),
  
  updateProfile: (profile: Partial<import('@/types').User>) => api.patch<import('@/types').User>('/user/profile', profile),
  
  getDashboardStats: () => api.get<import('@/types').DashboardStats>('/user/dashboard/stats'),
  
  getNotifications: () => api.get<import('@/types').Notification[]>('/user/notifications'),
  
  markNotificationRead: (id: string) => api.patch<void>(`/user/notifications/${id}/read`, {}),
};

// Partners API
export const partnersApi = {
  list: () => api.get<import('@/types').Partner[]>('/partners'),
  
  get: (id: string) => api.get<import('@/types').Partner>(`/partners/${id}`),
  
  getDashboardStats: () => api.get<import('@/types').PartnerDashboardStats>('/partners/dashboard/stats'),
};

// Workforce Map API
export const workforceApi = {
  getStates: () => api.get<import('@/types').StateData[]>('/workforce/states'),
  
  getState: (id: string) => api.get<import('@/types').StateData>(`/workforce/states/${id}`),
  
  getIndustryStats: (industry: string) => api.get<import('@/types').Industry>(`/workforce/industries/${industry}`),
};

// Challenges API
export const challengesApi = {
  list: () => api.get<import('@/types').Challenge[]>('/challenges'),
  
  get: (id: string) => api.get<import('@/types').Challenge>(`/challenges/${id}`),
  
  submit: (challengeId: string, submission: unknown) => api.post<void>(`/challenges/${challengeId}/submit`, submission),
  
  getLeaderboard: () => api.get<import('@/types').Leaderboard[]>('/challenges/leaderboard'),
};
