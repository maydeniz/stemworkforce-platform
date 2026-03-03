// ===========================================
// Workforce Map React Query Hooks
// Hybrid loading: summary on mount, detail on state click
// ===========================================

import { useQuery } from '@tanstack/react-query';
import { queryKeys, queryOptions } from '@/lib/queryClient';
import {
  fetchMapSummary,
  fetchStateDetail,
  type MapSummaryResult,
  type StateDetailResult,
} from '@/services/workforceMapService';

/**
 * Fetch map summary for all 50 states.
 * Used on page load to color the map and populate stats bar.
 * Cached for 30 minutes — BLS data doesn't change frequently.
 */
export function useMapSummary(industry?: string) {
  return useQuery<MapSummaryResult>({
    queryKey: queryKeys.workforce.mapSummary(industry),
    queryFn: () => fetchMapSummary(industry),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: queryOptions.static.gcTime, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Fetch detailed data for a single state.
 * Only runs when stateCode is provided (user clicks a state).
 * Returns BLS breakdown + live listings + partner postings.
 */
export function useStateDetail(stateCode: string | null) {
  return useQuery<StateDetailResult>({
    queryKey: queryKeys.workforce.stateDetail(stateCode || ''),
    queryFn: () => fetchStateDetail(stateCode!),
    enabled: !!stateCode,
    staleTime: queryOptions.standard.staleTime, // 5 minutes
    gcTime: queryOptions.standard.gcTime, // 30 minutes
  });
}
