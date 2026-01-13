// ===========================================
// Scholarship Matcher Edge Function
// AI-powered scholarship matching algorithm
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
  graduation_year: number | null;
  current_grade: string | null;
  citizenship: string | null;
  ethnicity: string[] | null;
  first_generation: boolean | null;
  military_affiliation: string | null;
  household_income_range: string | null;
  state_of_residence: string | null;
  intended_majors: string[] | null;
  career_interests: string[] | null;
}

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount_min: number | null;
  amount_max: number | null;
  min_gpa: number | null;
  min_sat: number | null;
  min_act: number | null;
  grade_levels: string[] | null;
  citizenship_requirements: string[] | null;
  ethnicity_requirements: string[] | null;
  states: string[] | null;
  majors: string[] | null;
  income_cap: number | null;
  need_based: boolean;
  first_generation_required: boolean;
  military_affiliation: string[] | null;
  is_stem: boolean;
  deadline_date: string | null;
  competitiveness: string | null;
}

interface MatchResult {
  scholarship_id: string;
  match_score: number;
  eligibility_status: 'eligible' | 'likely' | 'possible' | 'ineligible';
  match_factors: Record<string, boolean>;
}

// Income range to approximate value
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

// Grade level mapping
function gradeToLevel(grade: string | null): string[] {
  const mapping: Record<string, string[]> = {
    '9th': ['9th'],
    '10th': ['10th'],
    '11th': ['11th'],
    '12th': ['12th', 'high_school_senior'],
    'gap_year': ['gap_year', 'college_freshman'],
    'transfer': ['transfer', 'college_sophomore', 'college_junior'],
    'graduate': ['graduate', 'graduate_1st', 'graduate_2nd'],
  };
  return grade ? mapping[grade] || [] : [];
}

// Calculate match score for a scholarship
function calculateMatch(profile: StudentProfile, scholarship: Scholarship): MatchResult {
  const factors: Record<string, boolean> = {};
  let totalPoints = 0;
  let maxPoints = 0;
  let isDisqualified = false;

  // GPA Check (20 points max)
  if (scholarship.min_gpa !== null) {
    maxPoints += 20;
    const profileGpa = profile.gpa_unweighted || profile.gpa_weighted;
    if (profileGpa !== null) {
      if (profileGpa >= scholarship.min_gpa) {
        totalPoints += 20;
        factors.gpa = true;
      } else if (profileGpa >= scholarship.min_gpa - 0.3) {
        totalPoints += 10;
        factors.gpa = false;
      } else {
        factors.gpa = false;
        isDisqualified = scholarship.min_gpa > 3.5; // Hard requirement for high GPA scholarships
      }
    }
  }

  // SAT Check (15 points max)
  if (scholarship.min_sat !== null) {
    maxPoints += 15;
    if (profile.sat_total !== null) {
      if (profile.sat_total >= scholarship.min_sat) {
        totalPoints += 15;
        factors.sat = true;
      } else if (profile.sat_total >= scholarship.min_sat - 100) {
        totalPoints += 8;
        factors.sat = false;
      } else {
        factors.sat = false;
      }
    }
  }

  // ACT Check (15 points max)
  if (scholarship.min_act !== null) {
    maxPoints += 15;
    if (profile.act_composite !== null) {
      if (profile.act_composite >= scholarship.min_act) {
        totalPoints += 15;
        factors.act = true;
      } else if (profile.act_composite >= scholarship.min_act - 3) {
        totalPoints += 8;
        factors.act = false;
      } else {
        factors.act = false;
      }
    }
  }

  // Grade Level Check (10 points, required)
  if (scholarship.grade_levels && scholarship.grade_levels.length > 0) {
    maxPoints += 10;
    const studentGrades = gradeToLevel(profile.current_grade);
    const gradeMatch = scholarship.grade_levels.some(g => studentGrades.includes(g));
    if (gradeMatch) {
      totalPoints += 10;
      factors.grade_level = true;
    } else {
      factors.grade_level = false;
      isDisqualified = true;
    }
  }

  // Citizenship Check (10 points, often required)
  if (scholarship.citizenship_requirements && scholarship.citizenship_requirements.length > 0) {
    maxPoints += 10;
    if (profile.citizenship) {
      const citizenshipMatch = scholarship.citizenship_requirements.includes(profile.citizenship);
      if (citizenshipMatch) {
        totalPoints += 10;
        factors.citizenship = true;
      } else {
        factors.citizenship = false;
        isDisqualified = true;
      }
    }
  }

  // State Residency Check (10 points)
  if (scholarship.states && scholarship.states.length > 0) {
    maxPoints += 10;
    if (profile.state_of_residence) {
      const stateMatch = scholarship.states.includes(profile.state_of_residence);
      if (stateMatch) {
        totalPoints += 10;
        factors.state = true;
      } else {
        factors.state = false;
        isDisqualified = true;
      }
    }
  } else {
    // No state restriction = bonus
    factors.state = true;
  }

  // Ethnicity/Demographics Check (10 points)
  if (scholarship.ethnicity_requirements && scholarship.ethnicity_requirements.length > 0) {
    maxPoints += 10;
    if (profile.ethnicity && profile.ethnicity.length > 0) {
      const ethnicityMatch = scholarship.ethnicity_requirements.some(
        e => profile.ethnicity?.includes(e)
      );
      if (ethnicityMatch) {
        totalPoints += 10;
        factors.demographics = true;
      } else {
        factors.demographics = false;
        isDisqualified = true;
      }
    } else {
      factors.demographics = false;
      isDisqualified = true;
    }
  }

  // First Generation Check (5 points)
  if (scholarship.first_generation_required) {
    maxPoints += 5;
    if (profile.first_generation === true) {
      totalPoints += 5;
      factors.first_gen = true;
    } else {
      factors.first_gen = false;
      isDisqualified = true;
    }
  }

  // Military Affiliation Check (5 points)
  if (scholarship.military_affiliation && scholarship.military_affiliation.length > 0) {
    maxPoints += 5;
    if (profile.military_affiliation) {
      const militaryMatch = scholarship.military_affiliation.includes(profile.military_affiliation);
      if (militaryMatch) {
        totalPoints += 5;
        factors.military = true;
      } else {
        factors.military = false;
        isDisqualified = true;
      }
    } else {
      factors.military = false;
      isDisqualified = true;
    }
  }

  // Major/Field Match (15 points)
  if (scholarship.majors && scholarship.majors.length > 0) {
    maxPoints += 15;
    if (profile.intended_majors && profile.intended_majors.length > 0) {
      // Check for exact match or category match (e.g., 'all_stem')
      const majorMatch = scholarship.majors.some(m =>
        profile.intended_majors?.includes(m) ||
        m === 'all_stem' ||
        m === 'stem'
      );
      if (majorMatch) {
        totalPoints += 15;
        factors.major = true;
      } else {
        factors.major = false;
        // Not disqualifying, but reduces score
      }
    }
  } else {
    // No major restriction = neutral
    factors.major = true;
  }

  // Income/Need-Based Check (10 points)
  if (scholarship.need_based && scholarship.income_cap !== null) {
    maxPoints += 10;
    const income = incomeRangeToValue(profile.household_income_range);
    if (income !== null && income <= scholarship.income_cap) {
      totalPoints += 10;
      factors.financial_need = true;
    } else {
      factors.financial_need = false;
      if (income !== null && income > scholarship.income_cap * 1.5) {
        isDisqualified = true;
      }
    }
  }

  // Calculate final score
  const rawScore = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 50;
  const matchScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // Determine eligibility status
  let eligibilityStatus: 'eligible' | 'likely' | 'possible' | 'ineligible';
  if (isDisqualified) {
    eligibilityStatus = 'ineligible';
  } else if (matchScore >= 80) {
    eligibilityStatus = 'eligible';
  } else if (matchScore >= 60) {
    eligibilityStatus = 'likely';
  } else if (matchScore >= 40) {
    eligibilityStatus = 'possible';
  } else {
    eligibilityStatus = 'ineligible';
  }

  return {
    scholarship_id: scholarship.id,
    match_score: matchScore,
    eligibility_status: eligibilityStatus,
    match_factors: factors,
  };
}

serve(async (req) => {
  // Handle CORS
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

    // Build scholarship query
    let query = supabaseClient
      .from('scholarships')
      .select('*')
      .eq('active', true);

    // Apply filters
    if (filters?.is_stem) {
      query = query.eq('is_stem', true);
    }
    if (filters?.min_amount) {
      query = query.gte('amount_max', filters.min_amount);
    }
    if (filters?.max_amount) {
      query = query.lte('amount_min', filters.max_amount);
    }
    if (filters?.deadline_after) {
      query = query.gte('deadline_date', filters.deadline_after);
    }

    const { data: scholarships, error: scholarshipsError } = await query;

    if (scholarshipsError) throw scholarshipsError;

    // Calculate matches
    const matches: MatchResult[] = [];
    for (const scholarship of scholarships || []) {
      const match = calculateMatch(profile, scholarship);
      if (match.eligibility_status !== 'ineligible') {
        matches.push(match);
      }
    }

    // Sort by match score
    matches.sort((a, b) => b.match_score - a.match_score);

    // If user is authenticated, save matches to database
    if (user_id) {
      // Delete old matches
      await supabaseClient
        .from('scholarship_matches')
        .delete()
        .eq('user_id', user_id);

      // Insert new matches (top 100)
      const matchesToSave = matches.slice(0, 100).map(m => ({
        user_id,
        scholarship_id: m.scholarship_id,
        match_score: m.match_score,
        eligibility_status: m.eligibility_status,
        match_factors: m.match_factors,
      }));

      if (matchesToSave.length > 0) {
        await supabaseClient
          .from('scholarship_matches')
          .insert(matchesToSave);
      }
    }

    // Return matches with scholarship details
    const enrichedMatches = matches.slice(0, 50).map(m => {
      const scholarship = scholarships?.find(s => s.id === m.scholarship_id);
      return {
        ...m,
        scholarship,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        total_scholarships: scholarships?.length || 0,
        matches_found: matches.length,
        matches: enrichedMatches,
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
