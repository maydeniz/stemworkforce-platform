// ===========================================
// React Query Configuration
// Centralized caching and data fetching setup
// ===========================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ENV_CONFIG } from '@/config/env';
import { logger } from './logger';

/**
 * Query key factory for consistent cache key generation
 * Use these to ensure cache keys are consistent across the app
 */
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    role: (userId: string) => [...queryKeys.user.all, 'role', userId] as const,
  },

  // Challenges
  challenges: {
    all: ['challenges'] as const,
    lists: () => [...queryKeys.challenges.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.challenges.lists(), filters] as const,
    details: () => [...queryKeys.challenges.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.challenges.details(), id] as const,
    myRegistrations: () => [...queryKeys.challenges.all, 'my-registrations'] as const,
    submissions: (challengeId: string) => [...queryKeys.challenges.all, 'submissions', challengeId] as const,
    teams: (challengeId: string) => [...queryKeys.challenges.all, 'teams', challengeId] as const,
  },

  // Federated listings (jobs, internships, etc.)
  listings: {
    all: ['listings'] as const,
    lists: () => [...queryKeys.listings.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.listings.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.listings.all, 'detail', id] as const,
    related: (id: string) => [...queryKeys.listings.all, 'related', id] as const,
    saved: () => [...queryKeys.listings.all, 'saved'] as const,
  },

  // Events
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.events.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
    registered: () => [...queryKeys.events.all, 'registered'] as const,
  },

  // Organizations
  organizations: {
    all: ['organizations'] as const,
    list: () => [...queryKeys.organizations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.organizations.all, 'detail', id] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    users: (filters?: Record<string, unknown>) => [...queryKeys.admin.all, 'users', filters] as const,
    analytics: () => [...queryKeys.admin.all, 'analytics'] as const,
    dsrRequests: () => [...queryKeys.admin.all, 'dsr'] as const,
  },

  // Partner dashboards
  partners: {
    education: {
      all: ['partners', 'education'] as const,
      dashboard: () => [...queryKeys.partners.education.all, 'dashboard'] as const,
    },
    industry: {
      all: ['partners', 'industry'] as const,
      dashboard: () => [...queryKeys.partners.industry.all, 'dashboard'] as const,
    },
  },

  // Workforce map
  workforce: {
    all: ['workforce'] as const,
    mapSummary: (industry?: string) => [...queryKeys.workforce.all, 'mapSummary', industry] as const,
    stateDetail: (stateCode: string) => [...queryKeys.workforce.all, 'stateDetail', stateCode] as const,
  },
} as const;

/**
 * Default query options for different data freshness requirements
 */
export const queryOptions = {
  // Static data that rarely changes (organizations, config)
  static: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // Semi-static data (challenges, listings)
  standard: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  // Dynamic user data (registrations, submissions)
  user: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  // Real-time data (notifications, live updates)
  realtime: {
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000 * 60, // Poll every minute
  },
} as const;

/**
 * Create the query client with production-optimized settings
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default to standard caching
        staleTime: queryOptions.standard.staleTime,
        gcTime: queryOptions.standard.gcTime,

        // Retry configuration
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error) {
            const status = (error as { status?: number }).status;
            if (status && status >= 400 && status < 500) {
              return false;
            }
          }
          // Retry up to 3 times on server errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch behavior
        refetchOnWindowFocus: ENV_CONFIG.IS_PRODUCTION,
        refetchOnReconnect: true,

        // Network mode
        networkMode: 'online',
      },

      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay: 1000,

        // Error handling
        onError: (error) => {
          logger.error('Mutation error', error as Error);
        },
      },
    },
  });
}

// Singleton query client instance
let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

/**
 * Query Provider component
 * Wraps the app with React Query context
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const client = React.useMemo(() => getQueryClient(), []);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * Helper to invalidate related queries after mutations
 */
export function invalidateRelatedQueries(
  client: QueryClient,
  type: 'challenges' | 'listings' | 'events' | 'user'
): void {
  switch (type) {
    case 'challenges':
      client.invalidateQueries({ queryKey: queryKeys.challenges.all });
      break;
    case 'listings':
      client.invalidateQueries({ queryKey: queryKeys.listings.all });
      break;
    case 'events':
      client.invalidateQueries({ queryKey: queryKeys.events.all });
      break;
    case 'user':
      client.invalidateQueries({ queryKey: queryKeys.user.all });
      break;
  }
}

/**
 * Prefetch helper for anticipated navigation
 */
export async function prefetchQuery<T>(
  client: QueryClient,
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options = queryOptions.standard
): Promise<void> {
  await client.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime,
  });
}

export default QueryProvider;
