// ===========================================
// College Matcher Edge Function
// AI-powered college matching and fit scoring
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StudentProfile {
  gpa_unweighted: number | null;
  gpa_weighted: number | null;
  sat_total: number | null;
  act_composite: number | null;
  state_of_residence: string | null;
  intended_majors: string[] | null;
  household_income_range: string | null;
  preferred_college_size: string | null;
  preferred_setting: string | null;
  preferred_regions: string[] | null;
}

interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  type: string;
  setting: string;
  size_category: string;
  total_enrollment: number;
  acceptance_rate: number | null;
  sat_avg: number | null;
  act_avg: number | null;
  in_state_tuition: number;
  out_of_state_tuition: number;
  room_and_board: number;
  avg_net_price: number | null;
  graduation_rate_4yr: number | null;
  graduation_rate_6yr: number | null;
  retention_rate: number | null;
  stem_focus: boolean;
  top_majors: string[] | null;
  avg_starting_salary: number | null;
  ranking_national: number | null;
}

interface CollegeMatch {
  college_id: string;
  fit_score: number;
  admission_chance: 'safety' | 'target' | 'reach' | 'far_reach';
  fit_factors: Record<string, number>;
  estimated_net_price: number;
}

// Income range to approximate value for financial calculations
function incomeRangeToValue(range: string | null): number | null {
  if (!range) return null;
  const ranges: Record<string, number> = {
    '0-30000': 15000,
    '30001-48000': 39000,
    '48001-75000': 61500,
    '75001-110000': 92500,
    '110001-150000': 130000,
    '150001+': 200000,
  };
  return ranges[range] || null;
}

// Calculate admission chance based on academic profile
function calculateAdmissionChance(
  profile: StudentProfile,
  college: College
): 'safety' | 'target' | 'reach' | 'far_reach' {
  let academicIndex = 0;
  let collegeIndex = 0;
  let dataPoints = 0;

  // SAT comparison
  if (profile.sat_total && college.sat_avg) {
    academicIndex += profile.sat_total;
    collegeIndex += college.sat_avg;
    dataPoints++;
  }

  // ACT comparison (convert to SAT scale roughly)
  if (profile.act_composite && college.act_avg) {
    const satEquiv = profile.act_composite * 40 + 400; // Rough conversion
    const collegeSatEquiv = college.act_avg * 40 + 400;
    academicIndex += satEquiv;
    collegeIndex += collegeSatEquiv;
    dataPoints++;
  }

  // GPA factor (scale to comparable range)
  if (profile.gpa_unweighted || profile.gpa_weighted) {
    const gpa = profile.gpa_unweighted || profile.gpa_weighted || 3.0;
    academicIndex += gpa * 200; // Scale GPA to roughly 600-800 range
    collegeIndex += 3.5 * 200; // Assume average admitted GPA of 3.5
    dataPoints++;
  }

  if (dataPoints === 0) return 'target'; // Not enough data

  const avgAcademic = academicIndex / dataPoints;
  const avgCollege = collegeIndex / dataPoints;
  const acceptanceRate = college.acceptance_rate || 50;

  // Calculate difference and factor in acceptance rate
  const diff = avgAcademic - avgCollege;

  // Adjust thresholds based on acceptance rate
  const selectivityFactor = acceptanceRate < 20 ? 1.5 : acceptanceRate < 40 ? 1.2 : 1.0;

  if (diff > 100 / selectivityFactor) return 'safety';
  if (diff > -50 / selectivityFactor) return 'target';
  if (diff > -150 / selectivityFactor) return 'reach';
  return 'far_reach';
}

// Estimate net price based on income
function estimateNetPrice(
  college: College,
  profile: StudentProfile
): number {
  const income = incomeRangeToValue(profile.household_income_range);
  const isInState = profile.state_of_residence === college.state;
  const baseTuition = isInState ? college.in_state_tuition : college.out_of_state_tuition;
  const totalCost = baseTuition + college.room_and_board;

  if (!income) {
    return college.avg_net_price || totalCost * 0.7;
  }

  // Estimate aid based on income bracket
  let estimatedAidPercent = 0;
  if (income <= 30000) {
    estimatedAidPercent = college.type === 'public' ? 0.7 : 0.85;
  } else if (income <= 48000) {
    estimatedAidPercent = college.type === 'public' ? 0.6 : 0.75;
  } else if (income <= 75000) {
    estimatedAidPercent = college.type === 'public' ? 0.45 : 0.6;
  } else if (income <= 110000) {
    estimatedAidPercent = college.type === 'public' ? 0.25 : 0.4;
  } else {
    estimatedAidPercent = college.type === 'public' ? 0.1 : 0.2;
  }

  return Math.round(totalCost * (1 - estimatedAidPercent));
}

// Calculate overall fit score
function calculateFitScore(
  profile: StudentProfile,
  college: College
): { score: number; factors: Record<string, number> } {
  const factors: Record<string, number> = {};
  let totalWeight = 0;
  let weightedScore = 0;

  // Academic Fit (30% weight)
  const academicWeight = 30;
  totalWeight += academicWeight;
  let academicScore = 50; // Base score

  if (profile.sat_total && college.sat_avg) {
    const satDiff = profile.sat_total - college.sat_avg;
    academicScore = Math.min(100, Math.max(0, 50 + satDiff / 10));
  } else if (profile.act_composite && college.act_avg) {
    const actDiff = profile.act_composite - college.act_avg;
    academicScore = Math.min(100, Math.max(0, 50 + actDiff * 2.5));
  }
  factors.academic = Math.round(academicScore);
  weightedScore += academicScore * academicWeight;

  // Major/Program Fit (25% weight)
  const majorWeight = 25;
  totalWeight += majorWeight;
  let majorScore = 70; // Default if no preference

  if (profile.intended_majors && profile.intended_majors.length > 0 && college.top_majors) {
    const hasMatch = profile.intended_majors.some(m =>
      college.top_majors?.some(cm =>
        cm.toLowerCase().includes(m.toLowerCase()) ||
        m.toLowerCase().includes(cm.toLowerCase())
      )
    );
    majorScore = hasMatch ? 95 : 50;

    // Bonus for STEM focus alignment
    if (college.stem_focus && profile.intended_majors.some(m =>
      ['engineering', 'computer science', 'biology', 'chemistry', 'physics', 'mathematics'].some(stem =>
        m.toLowerCase().includes(stem)
      )
    )) {
      majorScore = Math.min(100, majorScore + 10);
    }
  }
  factors.major = Math.round(majorScore);
  weightedScore += majorScore * majorWeight;

  // Location Fit (15% weight)
  const locationWeight = 15;
  totalWeight += locationWeight;
  let locationScore = 70;

  if (profile.preferred_regions && profile.preferred_regions.length > 0) {
    locationScore = profile.preferred_regions.includes(college.region) ? 95 : 40;
  }
  // In-state bonus
  if (profile.state_of_residence === college.state) {
    locationScore = Math.min(100, locationScore + 15);
  }
  factors.location = Math.round(locationScore);
  weightedScore += locationScore * locationWeight;

  // Size Fit (10% weight)
  const sizeWeight = 10;
  totalWeight += sizeWeight;
  let sizeScore = 70;

  if (profile.preferred_college_size) {
    sizeScore = profile.preferred_college_size === college.size_category ? 95 : 50;
  }
  factors.size = Math.round(sizeScore);
  weightedScore += sizeScore * sizeWeight;

  // Setting Fit (10% weight)
  const settingWeight = 10;
  totalWeight += settingWeight;
  let settingScore = 70;

  if (profile.preferred_setting) {
    settingScore = profile.preferred_setting === college.setting ? 95 : 50;
  }
  factors.setting = Math.round(settingScore);
  weightedScore += settingScore * settingWeight;

  // Outcomes Score (10% weight) - graduation rate, salary
  const outcomesWeight = 10;
  totalWeight += outcomesWeight;
  let outcomesScore = 60;

  if (college.graduation_rate_6yr) {
    outcomesScore = Math.min(100, college.graduation_rate_6yr);
  }
  if (college.avg_starting_salary && college.avg_starting_salary > 60000) {
    outcomesScore = Math.min(100, outcomesScore + 10);
  }
  factors.outcomes = Math.round(outcomesScore);
  weightedScore += outcomesScore * outcomesWeight;

  const finalScore = Math.round(weightedScore / totalWeight);
  return { score: finalScore, factors };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, profile_data, filters } = await req.json();

    // Get student profile
    let profile: StudentProfile;
    if (profile_data) {
      profile = profile_data;
    } else if (user_id) {
      const { data: profileData, error: profileError } = await supabaseClient
        .from('student_profiles')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (profileError) throw new Error('Profile not found');
      profile = profileData;
    } else {
      throw new Error('Either user_id or profile_data is required');
    }

    // Build college query
    let query = supabaseClient
      .from('colleges')
      .select('*');

    // Apply filters
    if (filters?.stem_only) {
      query = query.eq('stem_focus', true);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.max_tuition) {
      query = query.lte('out_of_state_tuition', filters.max_tuition);
    }
    if (filters?.min_acceptance_rate) {
      query = query.gte('acceptance_rate', filters.min_acceptance_rate);
    }

    const { data: colleges, error: collegesError } = await query;

    if (collegesError) throw collegesError;

    // Calculate matches
    const matches: CollegeMatch[] = [];
    for (const college of colleges || []) {
      const { score, factors } = calculateFitScore(profile, college);
      const admissionChance = calculateAdmissionChance(profile, college);
      const estimatedNetPrice = estimateNetPrice(college, profile);

      matches.push({
        college_id: college.id,
        fit_score: score,
        admission_chance: admissionChance,
        fit_factors: factors,
        estimated_net_price: estimatedNetPrice,
      });
    }

    // Sort by fit score
    matches.sort((a, b) => b.fit_score - a.fit_score);

    // Categorize matches
    const safetySchools = matches.filter(m => m.admission_chance === 'safety').slice(0, 5);
    const targetSchools = matches.filter(m => m.admission_chance === 'target').slice(0, 10);
    const reachSchools = matches.filter(m => m.admission_chance === 'reach').slice(0, 5);

    // Save matches if authenticated
    if (user_id) {
      await supabaseClient
        .from('college_matches')
        .delete()
        .eq('user_id', user_id);

      const matchesToSave = matches.slice(0, 50).map(m => ({
        user_id,
        college_id: m.college_id,
        fit_score: m.fit_score,
        admission_chance: m.admission_chance,
        fit_factors: m.fit_factors,
        estimated_net_price: m.estimated_net_price,
      }));

      if (matchesToSave.length > 0) {
        await supabaseClient
          .from('college_matches')
          .insert(matchesToSave);
      }
    }

    // Enrich with college details
    const enrichMatches = (matchList: CollegeMatch[]) =>
      matchList.map(m => ({
        ...m,
        college: colleges?.find(c => c.id === m.college_id),
      }));

    return new Response(
      JSON.stringify({
        success: true,
        total_colleges: colleges?.length || 0,
        matches: {
          safety: enrichMatches(safetySchools),
          target: enrichMatches(targetSchools),
          reach: enrichMatches(reachSchools),
          all: enrichMatches(matches.slice(0, 30)),
        },
        recommended_list: {
          safety_count: Math.min(2, safetySchools.length),
          target_count: Math.min(5, targetSchools.length),
          reach_count: Math.min(3, reachSchools.length),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
