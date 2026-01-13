// ===========================================
// Net Price Calculator Edge Function
// Calculate estimated net price for colleges
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FinancialProfile {
  household_income: number;
  household_size: number;
  number_in_college: number;
  total_assets: number;
  parent_age: number;
  state_of_residence: string;
  filing_status: 'single' | 'married' | 'head_of_household';
  efc_override?: number; // If they already know their EFC
}

interface CollegeInfo {
  id: string;
  name: string;
  type: string;
  state: string;
  in_state_tuition: number;
  out_of_state_tuition: number;
  room_and_board: number;
  books_supplies: number;
  personal_expenses: number;
  transportation: number;
  avg_net_price: number | null;
}

interface AidEstimate {
  college_id: string;
  college_name: string;
  cost_of_attendance: number;
  estimated_efc: number;
  federal_aid: {
    pell_grant: number;
    seog: number;
    work_study: number;
    subsidized_loan: number;
    unsubsidized_loan: number;
  };
  state_aid: number;
  institutional_aid: number;
  total_grants: number;
  total_loans: number;
  total_work_study: number;
  net_price: number;
  monthly_payment_10yr: number;
  breakdown: {
    tuition: number;
    room_board: number;
    books: number;
    personal: number;
    transportation: number;
  };
}

// 2024-2025 Federal Poverty Guidelines (simplified)
const povertyGuidelines: Record<number, number> = {
  1: 14580,
  2: 19720,
  3: 24860,
  4: 30000,
  5: 35140,
  6: 40280,
  7: 45420,
  8: 50560,
};

// Calculate simplified EFC using Federal Methodology approximation
function calculateEFC(profile: FinancialProfile): number {
  // If user has provided their actual EFC
  if (profile.efc_override !== undefined) {
    return profile.efc_override;
  }

  const { household_income, household_size, number_in_college, total_assets } = profile;

  // Income Protection Allowance (IPA) - 2024 values approximated
  const ipaTable: Record<number, number> = {
    2: 19950,
    3: 24810,
    4: 30630,
    5: 36110,
    6: 42240,
  };
  const ipa = ipaTable[household_size] || 30630;

  // Calculate Available Income
  const taxAllowance = household_income * 0.22; // Simplified federal tax estimate
  const fica = Math.min(household_income * 0.0765, 10000);
  const employmentAllowance = Math.min(household_income * 0.35, 4500);

  const availableIncome = Math.max(0, household_income - taxAllowance - fica - employmentAllowance - ipa);

  // Parent contribution from income (22-47% depending on income)
  let incomeContributionRate = 0.22;
  if (availableIncome > 30000) incomeContributionRate = 0.25;
  if (availableIncome > 50000) incomeContributionRate = 0.29;
  if (availableIncome > 75000) incomeContributionRate = 0.34;
  if (availableIncome > 100000) incomeContributionRate = 0.40;
  if (availableIncome > 150000) incomeContributionRate = 0.47;

  const incomeContribution = availableIncome * incomeContributionRate;

  // Asset contribution (5.64% of net assets after protection)
  const assetProtection = profile.parent_age >= 65 ? 84000 :
                          profile.parent_age >= 55 ? 64000 :
                          profile.parent_age >= 45 ? 45000 : 35000;
  const availableAssets = Math.max(0, total_assets - assetProtection);
  const assetContribution = availableAssets * 0.0564;

  // Total parent contribution
  const parentContribution = incomeContribution + assetContribution;

  // Divide by number in college
  const efc = Math.round(parentContribution / number_in_college);

  return Math.max(0, efc);
}

// Calculate Pell Grant based on EFC (2024-2025 maximums)
function calculatePellGrant(efc: number, income: number): number {
  const maxPell = 7395; // 2024-2025 maximum

  if (efc === 0) return maxPell;
  if (efc >= 6656) return 0; // EFC cutoff for Pell eligibility

  // Linear reduction
  const reduction = (efc / 6656) * maxPell;
  return Math.round(Math.max(0, maxPell - reduction));
}

// Estimate institutional aid based on college type and financial need
function estimateInstitutionalAid(
  college: CollegeInfo,
  efc: number,
  coa: number,
  income: number
): number {
  const need = Math.max(0, coa - efc);

  // Private colleges typically meet more need
  let meetNeedRate = 0.5; // Default for public
  if (college.type === 'private') {
    meetNeedRate = 0.7;
    // Elite privates often meet full need
    if (college.avg_net_price && college.avg_net_price < 25000) {
      meetNeedRate = 0.9;
    }
  }

  // Adjust for income level
  if (income < 30000) meetNeedRate = Math.min(1, meetNeedRate + 0.2);
  else if (income < 60000) meetNeedRate = Math.min(1, meetNeedRate + 0.1);

  return Math.round(need * meetNeedRate * 0.7); // 70% as grants, rest may be loans/work-study
}

// Calculate state aid (simplified - varies greatly by state)
function estimateStateAid(
  state: string,
  income: number,
  collegeState: string,
  collegeType: string
): number {
  // Only available for in-state students at many programs
  const isInState = state === collegeState;
  if (!isInState && collegeType === 'public') return 0;

  // State grant programs vary widely - using rough averages
  const stateGrantPrograms: Record<string, { maxGrant: number; incomeLimit: number }> = {
    'CA': { maxGrant: 12630, incomeLimit: 120000 }, // Cal Grant
    'TX': { maxGrant: 6500, incomeLimit: 80000 }, // TEXAS Grant
    'NY': { maxGrant: 6165, incomeLimit: 80000 }, // TAP
    'PA': { maxGrant: 4500, incomeLimit: 110000 }, // PHEAA
    'FL': { maxGrant: 2000, incomeLimit: 75000 }, // Bright Futures
    'GA': { maxGrant: 5000, incomeLimit: 999999 }, // HOPE (merit-based)
    'IL': { maxGrant: 4720, incomeLimit: 75000 }, // MAP Grant
    'default': { maxGrant: 2000, incomeLimit: 60000 },
  };

  const program = stateGrantPrograms[state] || stateGrantPrograms['default'];

  if (income > program.incomeLimit) return 0;

  // Scale grant based on income
  const incomeRatio = income / program.incomeLimit;
  return Math.round(program.maxGrant * (1 - incomeRatio * 0.5));
}

// Calculate monthly loan payment (10-year standard repayment)
function calculateMonthlyPayment(totalLoans: number, rate: number = 0.05): number {
  const monthlyRate = rate / 12;
  const numPayments = 120; // 10 years

  if (totalLoans <= 0) return 0;

  const payment = totalLoans * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                  (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment);
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

    const { financial_profile, college_ids } = await req.json();

    if (!financial_profile) {
      throw new Error('Financial profile is required');
    }

    const profile: FinancialProfile = financial_profile;

    // Get colleges
    let query = supabaseClient.from('colleges').select('*');

    if (college_ids && college_ids.length > 0) {
      query = query.in('id', college_ids);
    } else {
      query = query.limit(20); // Default to top 20 colleges
    }

    const { data: colleges, error: collegesError } = await query;
    if (collegesError) throw collegesError;

    // Calculate EFC once
    const efc = calculateEFC(profile);

    // Calculate estimates for each college
    const estimates: AidEstimate[] = [];

    for (const college of colleges || []) {
      const isInState = profile.state_of_residence === college.state;
      const tuition = isInState ? college.in_state_tuition : college.out_of_state_tuition;
      const roomBoard = college.room_and_board || 12000;
      const books = college.books_supplies || 1200;
      const personal = college.personal_expenses || 2000;
      const transportation = college.transportation || 1500;

      const coa = tuition + roomBoard + books + personal + transportation;

      // Calculate federal aid
      const pellGrant = calculatePellGrant(efc, profile.household_income);
      const seog = efc === 0 && profile.household_income < 30000 ? 1000 : 0;
      const workStudy = profile.household_income < 75000 ? 2500 : 0;

      // Federal loan limits (dependent undergraduate)
      const subsidizedLimit = efc < coa ? Math.min(3500, Math.max(0, coa - efc)) : 0;
      const unsubsidizedLimit = 2000;

      // State and institutional aid
      const stateAid = estimateStateAid(
        profile.state_of_residence,
        profile.household_income,
        college.state,
        college.type
      );
      const institutionalAid = estimateInstitutionalAid(
        college,
        efc,
        coa,
        profile.household_income
      );

      const totalGrants = pellGrant + seog + stateAid + institutionalAid;
      const totalLoans = subsidizedLimit + unsubsidizedLimit;
      const totalWorkStudy = workStudy;
      const netPrice = Math.max(0, coa - totalGrants);
      const monthlyPayment = calculateMonthlyPayment(totalLoans * 4); // 4 years of loans

      estimates.push({
        college_id: college.id,
        college_name: college.name,
        cost_of_attendance: coa,
        estimated_efc: efc,
        federal_aid: {
          pell_grant: pellGrant,
          seog,
          work_study: workStudy,
          subsidized_loan: subsidizedLimit,
          unsubsidized_loan: unsubsidizedLimit,
        },
        state_aid: stateAid,
        institutional_aid: institutionalAid,
        total_grants: totalGrants,
        total_loans: totalLoans,
        total_work_study: totalWorkStudy,
        net_price: netPrice,
        monthly_payment_10yr: monthlyPayment,
        breakdown: {
          tuition,
          room_board: roomBoard,
          books,
          personal,
          transportation,
        },
      });
    }

    // Sort by net price
    estimates.sort((a, b) => a.net_price - b.net_price);

    return new Response(
      JSON.stringify({
        success: true,
        estimated_efc: efc,
        colleges_analyzed: estimates.length,
        estimates,
        summary: {
          lowest_net_price: estimates[0]?.net_price || 0,
          highest_net_price: estimates[estimates.length - 1]?.net_price || 0,
          average_net_price: Math.round(
            estimates.reduce((sum, e) => sum + e.net_price, 0) / estimates.length
          ),
          avg_total_grants: Math.round(
            estimates.reduce((sum, e) => sum + e.total_grants, 0) / estimates.length
          ),
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
