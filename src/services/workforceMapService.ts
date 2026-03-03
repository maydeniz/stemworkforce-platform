// ===========================================
// Workforce Map Service
// Fetches live data from BLS cache + federated listings + partner postings
// Falls back to static data when unavailable
// ===========================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateStateIndustries, stateNames } from '@/data/workforceStaticData';
import { matchIndustry } from '@/config/industryMapping';
import type { IndustryData, StateData } from '@/data/workforceStaticData';

// Types for live data from Supabase RPCs

export interface MapSummaryRow {
  state_code: string;
  state_name: string;
  bls_total_jobs: number;
  bls_avg_salary: number;
  bls_growth_rate: number;
  active_listing_count: number;
  partner_posting_count: number;
  top_industry: string;
}

export interface LiveListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  city: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod: string | null;
  industries: string[];
  skills: string[];
  jobType: string | null;
  postedAt: string;
  expiresAt: string | null;
  url: string | null;
}

export interface PartnerPosting {
  id: string;
  title: string;
  company: string;
  city: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string | null;
  jobType: string;
  experienceLevel: string;
  requiredSkills: string[];
  publishedAt: string;
}

interface BLSIndustryData {
  industry: string;
  totalJobs: number;
  averageSalary: number;
  jobGrowthRate: number;
}

export interface StateDetailResponse {
  stateCode: string;
  blsIndustries: BLSIndustryData[];
  listings: LiveListing[];
  partnerPostings: PartnerPosting[];
}

export type DataSource = 'live' | 'demo';

export interface MapSummaryResult {
  data: MapSummaryRow[];
  dataSource: DataSource;
}

export interface StateDetailResult {
  stateData: StateData;
  listings: LiveListing[];
  partnerPostings: PartnerPosting[];
  dataSource: DataSource;
}

/**
 * Fetch map summary for all 50 states.
 * Returns BLS totals + active listing counts per state.
 */
export async function fetchMapSummary(industry?: string): Promise<MapSummaryResult> {
  if (!isSupabaseConfigured()) {
    return { data: [], dataSource: 'demo' };
  }

  try {
    const { data, error } = await supabase.rpc('get_workforce_map_summary', {
      p_industry: industry || null,
    });

    if (error) throw error;

    // Check if we got meaningful BLS data (at least one state with jobs > 0)
    const hasLiveData = data?.some((row: MapSummaryRow) => row.bls_total_jobs > 0);

    return {
      data: data || [],
      dataSource: hasLiveData ? 'live' : 'demo',
    };
  } catch (err) {
    console.warn('Failed to fetch map summary, using demo data:', err);
    return { data: [], dataSource: 'demo' };
  }
}

/**
 * Fetch detailed data for a single state.
 * Returns BLS industry breakdown + live job listings + partner postings.
 */
export async function fetchStateDetail(stateCode: string): Promise<StateDetailResult> {
  if (!isSupabaseConfigured()) {
    return buildFallbackDetail(stateCode);
  }

  try {
    const { data, error } = await supabase.rpc('get_state_workforce_detail', {
      p_state_code: stateCode,
    });

    if (error) throw error;

    const response = data as StateDetailResponse;
    const blsIndustries = response.blsIndustries || [];
    const listings = response.listings || [];
    const partnerPostings = response.partnerPostings || [];

    // If we have BLS data, merge it with static data
    if (blsIndustries.length > 0) {
      const stateData = mergeWithStaticData(blsIndustries, stateCode);
      return {
        stateData,
        listings,
        partnerPostings,
        dataSource: 'live',
      };
    }

    // No BLS data — fall back to static but still include live listings
    const fallback = buildFallbackDetail(stateCode);
    return {
      ...fallback,
      listings,
      partnerPostings,
      dataSource: listings.length > 0 || partnerPostings.length > 0 ? 'live' : 'demo',
    };
  } catch (err) {
    console.warn(`Failed to fetch detail for ${stateCode}, using demo data:`, err);
    return buildFallbackDetail(stateCode);
  }
}

/**
 * Build fallback detail from static data
 */
function buildFallbackDetail(stateCode: string): StateDetailResult {
  return {
    stateData: {
      name: stateNames[stateCode] || stateCode,
      industries: generateStateIndustries(stateCode),
    },
    listings: [],
    partnerPostings: [],
    dataSource: 'demo',
  };
}

/**
 * Merge live BLS data with static data to produce StateData.
 * BLS provides: totalJobs, averageSalary, jobGrowthRate per industry.
 * Static provides: hubs, pathways, training, skills, employers (as fallback).
 */
function mergeWithStaticData(
  blsIndustries: BLSIndustryData[],
  stateCode: string,
): StateData {
  // Generate full static data as the base
  const staticIndustries = generateStateIndustries(stateCode);

  const mergedIndustries: Record<string, IndustryData> = {};

  for (const [industryName, staticData] of Object.entries(staticIndustries)) {
    // Find matching BLS data
    const blsMatch = blsIndustries.find(b => b.industry === industryName);

    if (blsMatch && blsMatch.totalJobs > 0) {
      // Override numeric fields with BLS data, keep static for hubs/pathways/training
      const totalJobs = blsMatch.totalJobs;
      const technicians = Math.round(totalJobs * 0.35);
      const engineers = Math.round(totalJobs * 0.25);
      const avgSalary = blsMatch.averageSalary;

      mergedIndustries[industryName] = {
        ...staticData,
        totalJobs,
        technicians,
        engineers,
        growth: `+${Math.round(blsMatch.jobGrowthRate)}%`,
        salaries: {
          engineer: `$${Math.round(avgSalary * 1.3 / 1000)}K`,
          technician: `$${Math.round(avgSalary * 0.75 / 1000)}K`,
          operator: `$${Math.round(avgSalary * 0.55 / 1000)}K`,
        },
      };
    } else {
      mergedIndustries[industryName] = staticData;
    }
  }

  return {
    name: stateNames[stateCode] || stateCode,
    industries: mergedIndustries,
  };
}

/**
 * Format salary range for display
 */
export function formatSalaryRange(
  min: number | null,
  max: number | null,
  period?: string | null
): string {
  if (!min && !max) return 'Salary not listed';

  const fmt = (n: number) => {
    if (period === 'hourly') return `$${n}/hr`;
    if (n >= 1000) return `$${Math.round(n / 1000)}K`;
    return `$${n}`;
  };

  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

/**
 * Count listings by industry for a state
 */
export function countListingsByIndustry(
  listings: LiveListing[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const listing of listings) {
    const industry = matchIndustry(listing.industries || []);
    if (industry) {
      counts[industry] = (counts[industry] || 0) + 1;
    }
  }
  return counts;
}
