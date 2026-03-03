// ===========================================
// React Query Data Hooks
// Reusable hooks for data fetching with caching
// ===========================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys, queryOptions, invalidateRelatedQueries } from '@/lib/queryClient';
import { federatedListingsApi, type FederatedListingFilters } from '@/services/federationApi';
import { challengesApi } from '@/services/challengesApi';
import type { ChallengeSubmission, ChallengeFilters } from '@/types';
import { logger } from '@/lib/logger';

// ===========================================
// FEDERATED LISTINGS HOOKS
// ===========================================

/**
 * Hook to fetch federated listings with caching
 */
export function useListings(
  filters: FederatedListingFilters = {},
  page = 1,
  pageSize = 20
) {
  return useQuery({
    queryKey: queryKeys.listings.list({ ...filters, page, pageSize }),
    queryFn: () => federatedListingsApi.list(filters, page, pageSize),
    ...queryOptions.standard,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single listing detail
 */
export function useListingDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id || ''),
    queryFn: () => federatedListingsApi.get(id!),
    enabled: !!id,
    ...queryOptions.standard,
  });
}

/**
 * Hook to fetch related listings
 */
export function useRelatedListings(id: string | undefined, limit = 6) {
  return useQuery({
    queryKey: queryKeys.listings.related(id || ''),
    queryFn: () => federatedListingsApi.getRelated(id!, limit),
    enabled: !!id,
    ...queryOptions.standard,
  });
}

/**
 * Hook to fetch user's saved listings
 * Note: Uses applications table as proxy for saved listings
 */
export function useSavedListings() {
  return useQuery({
    queryKey: queryKeys.listings.saved(),
    queryFn: async () => {
      // Using getBySource as a placeholder - actual saved listings
      // functionality would need a dedicated saved_listings table
      return [];
    },
    ...queryOptions.user,
  });
}

/**
 * Hook to save/unsave a listing
 * Note: Placeholder - needs saved_listings table implementation
 */
export function useSaveListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, save }: { listingId: string; save: boolean }) => {
      // Placeholder - would need saved_listings table
      logger.info('Save listing mutation called', { listingId, save });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.saved() });
    },
    onError: (error) => {
      logger.error('Failed to save listing', error as Error);
    },
  });
}

// ===========================================
// CHALLENGES HOOKS
// ===========================================

/**
 * Hook to fetch challenges with caching
 */
export function useChallenges(
  filters: ChallengeFilters = {},
  _page = 1,
  _pageSize = 20
) {
  return useQuery({
    queryKey: queryKeys.challenges.list({ ...filters, _page, _pageSize }),
    queryFn: () => challengesApi.challenges.list(filters),
    ...queryOptions.standard,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single challenge detail
 */
export function useChallengeDetail(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.challenges.detail(idOrSlug || ''),
    queryFn: () => challengesApi.challenges.get(idOrSlug!),
    enabled: !!idOrSlug,
    ...queryOptions.standard,
  });
}

/**
 * Hook to fetch user's challenge registrations
 */
export function useMyRegistrations() {
  return useQuery({
    queryKey: queryKeys.challenges.myRegistrations(),
    queryFn: () => challengesApi.solvers.getMyRegistrations(),
    ...queryOptions.user,
  });
}

/**
 * Hook to register for a challenge
 */
export function useRegisterForChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
      skills,
    }: {
      challengeId: string;
      participationType?: 'individual' | 'team';
      teamId?: string;
      skills?: string[];
    }) => {
      return challengesApi.solvers.register(challengeId, skills);
    },
    onSuccess: () => {
      invalidateRelatedQueries(queryClient, 'challenges');
    },
    onError: (error) => {
      logger.error('Failed to register for challenge', error as Error);
    },
  });
}

/**
 * Hook to fetch user's submission for a challenge
 */
export function useChallengeSubmission(challengeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.challenges.submissions(challengeId || ''),
    queryFn: () => challengesApi.submissions.getMySubmission(challengeId!),
    enabled: !!challengeId,
    ...queryOptions.user,
  });
}

/**
 * Hook to create a submission
 */
export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
      submission,
    }: {
      challengeId: string;
      submission: Partial<ChallengeSubmission>;
    }) => {
      return challengesApi.submissions.create(challengeId, submission);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.submissions(variables.challengeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.challenges.myRegistrations(),
      });
    },
    onError: (error) => {
      logger.error('Failed to create submission', error as Error);
    },
  });
}

/**
 * Hook to fetch challenge teams (recruiting)
 */
export function useChallengeTeams(challengeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.challenges.teams(challengeId || ''),
    queryFn: () => challengesApi.teams.listRecruiting(challengeId!),
    enabled: !!challengeId,
    ...queryOptions.standard,
  });
}

// ===========================================
// PREFETCHING UTILITIES
// ===========================================

/**
 * Prefetch challenge detail for anticipated navigation
 */
export function usePrefetchChallenge() {
  const queryClient = useQueryClient();

  return (idOrSlug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.challenges.detail(idOrSlug),
      queryFn: () => challengesApi.challenges.get(idOrSlug),
      staleTime: queryOptions.standard.staleTime,
    });
  };
}

/**
 * Prefetch listing detail for anticipated navigation
 */
export function usePrefetchListing() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.listings.detail(id),
      queryFn: () => federatedListingsApi.get(id),
      staleTime: queryOptions.standard.staleTime,
    });
  };
}

// ===========================================
// INFINITE QUERY HOOKS
// ===========================================

/**
 * Hook for infinite scrolling listings
 */
export function useInfiniteListings(
  filters: FederatedListingFilters = {},
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.listings.lists(), 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      federatedListingsApi.list(filters, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (acc, page) => acc + (page.listings?.length || 0),
        0
      );
      if (totalLoaded < (lastPage.total || 0)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    ...queryOptions.standard,
  });
}

/**
 * Hook for infinite scrolling challenges
 */
export function useInfiniteChallenges(
  filters: ChallengeFilters = {},
  _pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.challenges.lists(), 'infinite', filters],
    queryFn: () => challengesApi.challenges.list(filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (acc, page) => acc + (page.challenges?.length || 0),
        0
      );
      if (totalLoaded < (lastPage.total || 0)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    ...queryOptions.standard,
  });
}

export default {
  useListings,
  useListingDetail,
  useRelatedListings,
  useSavedListings,
  useSaveListingMutation,
  useChallenges,
  useChallengeDetail,
  useMyRegistrations,
  useRegisterForChallenge,
  useChallengeSubmission,
  useCreateSubmission,
  useChallengeTeams,
  usePrefetchChallenge,
  usePrefetchListing,
  useInfiniteListings,
  useInfiniteChallenges,
};
