// ===========================================
// CareerNet Service
// 3-tier: Supabase query → React Query cache → Static fallback
// Career Q&A from CareerVillage.org via CareerNet (CC BY 4.0)
// ===========================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CAREERNET_FALLBACK_DATA } from '@/data/careernetFallback';
import type {
  CareerQA,
  CareerQAFilters,
  CareerQAResult,
  CareerQAStats,
  CareerNetSortBy,
} from '@/types/careernet';
import type { IndustryType } from '@/types/index';

// ===========================================
// DB Row → CareerQA Transformer
// ===========================================

function transformDBRow(row: Record<string, unknown>): CareerQA {
  return {
    id: row.id as string,
    answerId: row.answer_id as number,
    questionId: row.question_id as number,
    sourceDataset: row.source_dataset as CareerQA['sourceDataset'],
    questionTitle: row.question_title as string,
    questionBody: row.question_body as string,
    questionScore: (row.question_score as number) || 0,
    questionViews: (row.question_views as number) || 0,
    questionAddedAt: row.question_added_at as string | undefined,
    answerBody: row.answer_body as string,
    answerScore: (row.answer_score as number) || 0,
    answerAddedAt: row.answer_added_at as string | undefined,
    correctness: row.correctness as number,
    completeness: row.completeness as number,
    coherency: row.coherency as number,
    qualityScore: Number(row.quality_score) || 0,
    scenarioLabels: (row.scenario_labels as string[]) || [],
    questionTags: (row.question_tags as string[]) || [],
    industries: (row.industries as IndustryType[]) || [],
    askerLocation: row.asker_location as string | undefined,
    answererLocation: row.answerer_location as string | undefined,
    exploreOptions: (row.explore_options as boolean) || false,
    takeAction: (row.take_action as boolean) || false,
    understandingPurpose: (row.understanding_purpose as boolean) || false,
    validationSupport: (row.validation_support as boolean) || false,
    findResources: (row.find_resources as boolean) || false,
    navigateConstraints: (row.navigate_constraints as boolean) || false,
    compareOptions: (row.compare_options as boolean) || false,
    unclearGoal: (row.unclear_goal as boolean) || false,
  };
}

// ===========================================
// Fallback Filtering (offline / demo mode)
// ===========================================

function filterFallbackData(
  filters: CareerQAFilters,
  page: number,
  pageSize: number
): CareerQAResult {
  let items = [...CAREERNET_FALLBACK_DATA];

  // Text search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.questionTitle.toLowerCase().includes(q) ||
        item.questionBody.toLowerCase().includes(q) ||
        item.answerBody.toLowerCase().includes(q)
    );
  }

  // Industry filter
  if (filters.industries?.length) {
    items = items.filter((item) =>
      item.industries.some((ind) => filters.industries!.includes(ind))
    );
  }

  // Scenario filter
  if (filters.scenarios?.length) {
    items = items.filter((item) =>
      item.scenarioLabels.some((s) => filters.scenarios!.includes(s))
    );
  }

  // Tag filter
  if (filters.tags?.length) {
    items = items.filter((item) =>
      item.questionTags.some((t) => filters.tags!.includes(t))
    );
  }

  // Dataset filter
  if (filters.sourceDataset) {
    items = items.filter((item) => item.sourceDataset === filters.sourceDataset);
  }

  // Quality filter
  const minCorrectness = filters.minCorrectness ?? 3;
  items = items.filter((item) => item.correctness >= minCorrectness);

  // Sort by quality
  items.sort((a, b) => b.qualityScore - a.qualityScore);

  // Paginate
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    items: paged,
    total,
    page,
    pageSize,
    hasMore: total > start + paged.length,
  };
}

// ===========================================
// Service API
// ===========================================

export const careernetApi = {
  /**
   * Search career Q&A with filters, pagination, and sorting
   */
  async search(
    filters: CareerQAFilters = {},
    page = 1,
    pageSize = 20,
    sortBy: CareerNetSortBy = 'quality'
  ): Promise<CareerQAResult> {
    if (!isSupabaseConfigured()) {
      return filterFallbackData(filters, page, pageSize);
    }

    try {
      let query = supabase
        .from('career_qa')
        .select('*', { count: 'exact' })
        .gte('correctness', filters.minCorrectness ?? 3);

      // Full-text search
      if (filters.search) {
        query = query.textSearch('searchable_content', filters.search, {
          type: 'websearch',
          config: 'english',
        });
      }

      // Industry filter (array overlap)
      if (filters.industries?.length) {
        query = query.overlaps('industries', filters.industries);
      }

      // Scenario filter
      if (filters.scenarios?.length) {
        query = query.overlaps('scenario_labels', filters.scenarios);
      }

      // Tag filter
      if (filters.tags?.length) {
        query = query.overlaps('question_tags', filters.tags);
      }

      // Dataset filter
      if (filters.sourceDataset) {
        query = query.eq('source_dataset', filters.sourceDataset);
      }

      // Sorting
      switch (sortBy) {
        case 'quality':
          query = query.order('quality_score', { ascending: false });
          break;
        case 'views':
          query = query.order('question_views', { ascending: false });
          break;
        case 'recent':
          query = query.order('answer_added_at', { ascending: false });
          break;
        default:
          query = query.order('quality_score', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.warn('CareerNet query error, falling back:', error.message);
        return filterFallbackData(filters, page, pageSize);
      }

      return {
        items: (data || []).map(transformDBRow),
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > from + (data?.length || 0),
      };
    } catch {
      return filterFallbackData(filters, page, pageSize);
    }
  },

  /**
   * Get Q&A by scenario label (e.g., 'interview-prep')
   */
  async getByScenario(scenario: string, limit = 10): Promise<CareerQA[]> {
    if (!isSupabaseConfigured()) {
      return CAREERNET_FALLBACK_DATA
        .filter((qa) => qa.scenarioLabels.includes(scenario))
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('career_qa')
        .select('*')
        .contains('scenario_labels', [scenario])
        .gte('correctness', 3)
        .order('quality_score', { ascending: false })
        .limit(limit);

      if (error || !data) {
        return CAREERNET_FALLBACK_DATA
          .filter((qa) => qa.scenarioLabels.includes(scenario))
          .slice(0, limit);
      }

      return data.map(transformDBRow);
    } catch {
      return CAREERNET_FALLBACK_DATA
        .filter((qa) => qa.scenarioLabels.includes(scenario))
        .slice(0, limit);
    }
  },

  /**
   * Get top Q&A for a specific industry
   */
  async getTopByIndustry(industry: string, limit = 5): Promise<CareerQA[]> {
    if (!isSupabaseConfigured()) {
      return CAREERNET_FALLBACK_DATA
        .filter((qa) => qa.industries.includes(industry as IndustryType))
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('career_qa')
        .select('*')
        .contains('industries', [industry])
        .gte('correctness', 3)
        .order('quality_score', { ascending: false })
        .limit(limit);

      if (error || !data) {
        return CAREERNET_FALLBACK_DATA
          .filter((qa) => qa.industries.includes(industry as IndustryType))
          .slice(0, limit);
      }

      return data.map(transformDBRow);
    } catch {
      return CAREERNET_FALLBACK_DATA
        .filter((qa) => qa.industries.includes(industry as IndustryType))
        .slice(0, limit);
    }
  },

  /**
   * Get related Q&A based on shared tags
   */
  async getRelated(questionId: number, limit = 5): Promise<CareerQA[]> {
    if (!isSupabaseConfigured()) {
      return CAREERNET_FALLBACK_DATA.slice(0, limit);
    }

    try {
      // First get the source question's tags
      const { data: source } = await supabase
        .from('career_qa')
        .select('question_tags')
        .eq('question_id', questionId)
        .limit(1)
        .single();

      if (!source?.question_tags?.length) {
        return [];
      }

      const { data, error } = await supabase
        .from('career_qa')
        .select('*')
        .neq('question_id', questionId)
        .overlaps('question_tags', source.question_tags)
        .gte('correctness', 3)
        .order('quality_score', { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data.map(transformDBRow);
    } catch {
      return [];
    }
  },

  /**
   * Get popular tags with counts
   */
  async getPopularTags(limit = 30): Promise<{ tag: string; count: number }[]> {
    if (!isSupabaseConfigured()) {
      const tagMap: Record<string, number> = {};
      for (const qa of CAREERNET_FALLBACK_DATA) {
        for (const tag of qa.questionTags) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      }
      return Object.entries(tagMap)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    }

    try {
      // Use RPC or manual aggregation
      const { data, error } = await supabase
        .from('career_qa')
        .select('question_tags')
        .gte('correctness', 3)
        .limit(1000);

      if (error || !data) return [];

      const tagMap: Record<string, number> = {};
      for (const row of data) {
        const tags = (row.question_tags as string[]) || [];
        for (const tag of tags) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      }

      return Object.entries(tagMap)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch {
      return [];
    }
  },

  /**
   * Get aggregate statistics
   */
  async getStats(): Promise<CareerQAStats> {
    const fallbackStats: CareerQAStats = {
      totalPairs: CAREERNET_FALLBACK_DATA.length,
      uniqueQuestions: new Set(CAREERNET_FALLBACK_DATA.map((q) => q.questionId)).size,
      avgQuality: CAREERNET_FALLBACK_DATA.reduce((s, q) => s + q.qualityScore, 0) / CAREERNET_FALLBACK_DATA.length,
      byDataset: [
        { dataset: 'general', count: CAREERNET_FALLBACK_DATA.filter((q) => q.sourceDataset === 'general').length, avgQuality: 3.8 },
        { dataset: 'technology', count: CAREERNET_FALLBACK_DATA.filter((q) => q.sourceDataset === 'technology').length, avgQuality: 3.8 },
        { dataset: 'health', count: CAREERNET_FALLBACK_DATA.filter((q) => q.sourceDataset === 'health').length, avgQuality: 3.8 },
      ],
      byIndustry: [],
      byScenario: [],
      topTags: [],
    };

    if (!isSupabaseConfigured()) {
      return fallbackStats;
    }

    try {
      const { count } = await supabase
        .from('career_qa')
        .select('*', { count: 'exact', head: true })
        .gte('correctness', 3);

      if (!count) return fallbackStats;

      // Get industry distribution
      const { data: industryData } = await supabase
        .from('career_qa')
        .select('industries')
        .gte('correctness', 3)
        .limit(2000);

      const industryMap: Record<string, number> = {};
      if (industryData) {
        for (const row of industryData) {
          for (const ind of (row.industries as string[]) || []) {
            industryMap[ind] = (industryMap[ind] || 0) + 1;
          }
        }
      }

      // Get scenario distribution
      const { data: scenarioData } = await supabase
        .from('career_qa')
        .select('scenario_labels')
        .gte('correctness', 3)
        .limit(2000);

      const scenarioMap: Record<string, number> = {};
      if (scenarioData) {
        for (const row of scenarioData) {
          for (const s of (row.scenario_labels as string[]) || []) {
            scenarioMap[s] = (scenarioMap[s] || 0) + 1;
          }
        }
      }

      return {
        totalPairs: count,
        uniqueQuestions: count, // Approximate
        avgQuality: 3.5, // Approximate
        byDataset: fallbackStats.byDataset,
        byIndustry: Object.entries(industryMap)
          .map(([industry, cnt]) => ({ industry, count: cnt }))
          .sort((a, b) => b.count - a.count),
        byScenario: Object.entries(scenarioMap)
          .map(([scenario, cnt]) => ({ scenario, count: cnt }))
          .sort((a, b) => b.count - a.count),
        topTags: await careernetApi.getPopularTags(30),
      };
    } catch {
      return fallbackStats;
    }
  },
};
