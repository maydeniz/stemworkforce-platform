// ===========================================
// CareerNet React Query Hooks
// Convenience hooks for career Q&A data fetching
// ===========================================

import { useQuery } from '@tanstack/react-query';
import { queryKeys, queryOptions } from '@/lib/queryClient';
import { careernetApi } from '@/services/careernetService';
import type { CareerQAFilters, CareerNetSortBy } from '@/types/careernet';

/**
 * Search career Q&A with filters and pagination
 */
export function useCareerQASearch(
  filters: CareerQAFilters = {},
  page = 1,
  pageSize = 20,
  sortBy: CareerNetSortBy = 'quality'
) {
  return useQuery({
    queryKey: queryKeys.careerQA.search({ ...filters, page, pageSize, sortBy }),
    queryFn: () => careernetApi.search(filters, page, pageSize, sortBy),
    ...queryOptions.static,
  });
}

/**
 * Get Q&A by scenario (e.g., 'interview-prep', 'resume-optimization')
 */
export function useCareerQAByScenario(scenario: string, limit = 10) {
  return useQuery({
    queryKey: queryKeys.careerQA.byScenario(scenario),
    queryFn: () => careernetApi.getByScenario(scenario, limit),
    ...queryOptions.static,
    enabled: !!scenario,
  });
}

/**
 * Get top Q&A for a specific industry
 */
export function useCareerQAByIndustry(industry: string, limit = 5) {
  return useQuery({
    queryKey: queryKeys.careerQA.byIndustry(industry),
    queryFn: () => careernetApi.getTopByIndustry(industry, limit),
    ...queryOptions.static,
    enabled: !!industry,
  });
}

/**
 * Get related Q&A for a given question
 */
export function useCareerQARelated(questionId: number, limit = 5) {
  return useQuery({
    queryKey: queryKeys.careerQA.related(String(questionId)),
    queryFn: () => careernetApi.getRelated(questionId, limit),
    ...queryOptions.static,
    enabled: !!questionId,
  });
}

/**
 * Get aggregate statistics
 */
export function useCareerQAStats() {
  return useQuery({
    queryKey: queryKeys.careerQA.stats(),
    queryFn: () => careernetApi.getStats(),
    ...queryOptions.static,
  });
}

/**
 * Get popular tags
 */
export function useCareerQAPopularTags(limit = 30) {
  return useQuery({
    queryKey: queryKeys.careerQA.popularTags(),
    queryFn: () => careernetApi.getPopularTags(limit),
    ...queryOptions.static,
  });
}
