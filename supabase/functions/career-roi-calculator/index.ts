// ===========================================
// Career ROI Calculator Edge Function
// Calculate return on investment for career paths
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CareerROIInput {
  career_path_id?: string;
  career_title?: string;
  total_education_cost: number;
  years_of_education: number;
  expected_starting_salary?: number;
  expected_mid_career_salary?: number;
  state?: string;
  include_opportunity_cost?: boolean;
}

interface ROIResult {
  career_title: string;
  total_investment: number;
  opportunity_cost: number;
  total_cost: number;
  year_1_salary: number;
  year_10_salary: number;
  year_20_salary: number;
  lifetime_earnings_30yr: number;
  alternative_earnings_30yr: number;
  net_lifetime_gain: number;
  roi_percentage: number;
  payback_period_years: number;
  breakeven_age: number;
  monthly_loan_payment: number;
  debt_to_income_ratio: number;
  career_outlook: {
    growth_rate: number;
    job_openings: number;
    automation_risk: string;
  };
  recommendation: string;
  metrics: {
    roi_score: number;
    affordability_score: number;
    stability_score: number;
    overall_score: number;
  };
}

// Average salary for high school graduate (baseline)
const HS_GRAD_STARTING_SALARY = 35000;
const HS_GRAD_SALARY_GROWTH = 0.02; // 2% annual growth

// Career salary data (BLS data approximations)
const careerData: Record<string, {
  startingSalary: number;
  midCareerSalary: number;
  growthRate: number;
  jobOpenings: number;
  automationRisk: string;
}> = {
  'software_engineer': {
    startingSalary: 85000,
    midCareerSalary: 140000,
    growthRate: 25,
    jobOpenings: 153900,
    automationRisk: 'low',
  },
  'data_scientist': {
    startingSalary: 95000,
    midCareerSalary: 155000,
    growthRate: 35,
    jobOpenings: 17700,
    automationRisk: 'low',
  },
  'mechanical_engineer': {
    startingSalary: 75000,
    midCareerSalary: 115000,
    growthRate: 4,
    jobOpenings: 17200,
    automationRisk: 'medium',
  },
  'electrical_engineer': {
    startingSalary: 78000,
    midCareerSalary: 120000,
    growthRate: 3,
    jobOpenings: 17400,
    automationRisk: 'medium',
  },
  'biomedical_engineer': {
    startingSalary: 70000,
    midCareerSalary: 110000,
    growthRate: 6,
    jobOpenings: 1400,
    automationRisk: 'low',
  },
  'cybersecurity_analyst': {
    startingSalary: 80000,
    midCareerSalary: 130000,
    growthRate: 32,
    jobOpenings: 16800,
    automationRisk: 'low',
  },
  'nurse_practitioner': {
    startingSalary: 95000,
    midCareerSalary: 125000,
    growthRate: 45,
    jobOpenings: 29400,
    automationRisk: 'very_low',
  },
  'physician_assistant': {
    startingSalary: 100000,
    midCareerSalary: 130000,
    growthRate: 28,
    jobOpenings: 12700,
    automationRisk: 'very_low',
  },
  'pharmacist': {
    startingSalary: 110000,
    midCareerSalary: 140000,
    growthRate: -2,
    jobOpenings: 11300,
    automationRisk: 'medium',
  },
  'registered_nurse': {
    startingSalary: 65000,
    midCareerSalary: 85000,
    growthRate: 6,
    jobOpenings: 193100,
    automationRisk: 'low',
  },
  'civil_engineer': {
    startingSalary: 70000,
    midCareerSalary: 105000,
    growthRate: 5,
    jobOpenings: 21200,
    automationRisk: 'medium',
  },
  'chemical_engineer': {
    startingSalary: 80000,
    midCareerSalary: 125000,
    growthRate: 8,
    jobOpenings: 1800,
    automationRisk: 'medium',
  },
};

// Calculate projected salary for a given year
function projectSalary(startingSalary: number, midCareerSalary: number, year: number): number {
  // Use logarithmic growth curve
  const growthRate = Math.pow(midCareerSalary / startingSalary, 1 / 15) - 1;
  return Math.round(startingSalary * Math.pow(1 + growthRate, year));
}

// Calculate lifetime earnings
function calculateLifetimeEarnings(
  startingSalary: number,
  midCareerSalary: number,
  years: number
): number {
  let total = 0;
  for (let i = 0; i < years; i++) {
    total += projectSalary(startingSalary, midCareerSalary, i);
  }
  return total;
}

// Calculate HS grad lifetime earnings (alternative)
function calculateHSGradEarnings(years: number, delay: number = 0): number {
  let total = 0;
  for (let i = 0; i < years + delay; i++) {
    if (i >= delay) {
      // Would have started earning earlier
    }
    total += Math.round(HS_GRAD_STARTING_SALARY * Math.pow(1 + HS_GRAD_SALARY_GROWTH, i));
  }
  return total;
}

// Calculate opportunity cost
function calculateOpportunityCost(yearsOfEducation: number): number {
  let total = 0;
  for (let i = 0; i < yearsOfEducation; i++) {
    total += Math.round(HS_GRAD_STARTING_SALARY * Math.pow(1 + HS_GRAD_SALARY_GROWTH, i));
  }
  return total;
}

// Calculate monthly loan payment
function calculateMonthlyPayment(principal: number, rate: number = 0.05, years: number = 10): number {
  const monthlyRate = rate / 12;
  const numPayments = years * 12;

  if (principal <= 0) return 0;

  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                  (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment);
}

// Find payback period
function findPaybackPeriod(
  totalCost: number,
  careerStartingSalary: number,
  careerMidSalary: number
): number {
  let cumulativeEarnings = 0;
  let hsEarnings = 0;

  for (let year = 0; year < 30; year++) {
    const careerSalary = projectSalary(careerStartingSalary, careerMidSalary, year);
    const hsSalary = Math.round(HS_GRAD_STARTING_SALARY * Math.pow(1 + HS_GRAD_SALARY_GROWTH, year + 4));

    const netGain = careerSalary - hsSalary;
    cumulativeEarnings += netGain;

    if (cumulativeEarnings >= totalCost) {
      return year + 1;
    }
  }

  return 30; // Doesn't pay back within 30 years
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

    const { inputs } = await req.json();

    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      throw new Error('At least one career input is required');
    }

    const results: ROIResult[] = [];

    for (const input of inputs as CareerROIInput[]) {
      // Get career data
      let careerInfo = careerData[input.career_path_id || ''] || null;

      // Try to fetch from database if not found
      if (!careerInfo && input.career_path_id) {
        const { data } = await supabaseClient
          .from('career_paths')
          .select('*')
          .eq('id', input.career_path_id)
          .single();

        if (data) {
          careerInfo = {
            startingSalary: data.salary_entry || 50000,
            midCareerSalary: data.salary_mid || 80000,
            growthRate: data.growth_rate || 5,
            jobOpenings: data.job_openings || 10000,
            automationRisk: data.automation_risk || 'medium',
          };
        }
      }

      // Use provided values or defaults
      const startingSalary = input.expected_starting_salary || careerInfo?.startingSalary || 50000;
      const midCareerSalary = input.expected_mid_career_salary || careerInfo?.midCareerSalary || 80000;

      // Calculate costs
      const educationCost = input.total_education_cost;
      const opportunityCost = input.include_opportunity_cost !== false
        ? calculateOpportunityCost(input.years_of_education)
        : 0;
      const totalCost = educationCost + opportunityCost;

      // Project salaries
      const year1Salary = startingSalary;
      const year10Salary = projectSalary(startingSalary, midCareerSalary, 10);
      const year20Salary = projectSalary(startingSalary, midCareerSalary, 20);

      // Calculate lifetime earnings (30-year career)
      const lifetimeEarnings = calculateLifetimeEarnings(startingSalary, midCareerSalary, 30);

      // Calculate alternative (HS grad) earnings
      const alternativeEarnings = calculateHSGradEarnings(30, input.years_of_education);

      // Net lifetime gain
      const netLifetimeGain = lifetimeEarnings - alternativeEarnings - educationCost;

      // ROI percentage
      const roiPercentage = Math.round((netLifetimeGain / totalCost) * 100);

      // Payback period
      const paybackPeriod = findPaybackPeriod(totalCost, startingSalary, midCareerSalary);
      const breakevenAge = 22 + input.years_of_education + paybackPeriod;

      // Monthly loan payment (assuming 70% of education cost is loans)
      const loanAmount = educationCost * 0.7;
      const monthlyPayment = calculateMonthlyPayment(loanAmount);

      // Debt to income ratio
      const debtToIncome = Math.round((loanAmount / startingSalary) * 100) / 100;

      // Calculate scores
      const roiScore = Math.min(100, Math.max(0, 50 + (roiPercentage / 20)));
      const affordabilityScore = Math.max(0, 100 - (debtToIncome * 30));
      const stabilityScore = careerInfo
        ? Math.min(100, 50 + careerInfo.growthRate + (careerInfo.automationRisk === 'low' ? 20 : careerInfo.automationRisk === 'very_low' ? 30 : 0))
        : 60;
      const overallScore = Math.round((roiScore * 0.4 + affordabilityScore * 0.3 + stabilityScore * 0.3));

      // Generate recommendation
      let recommendation = '';
      if (overallScore >= 80) {
        recommendation = 'Excellent investment - strong ROI with manageable debt and good career outlook.';
      } else if (overallScore >= 60) {
        recommendation = 'Good investment - solid returns, but consider ways to reduce education costs.';
      } else if (overallScore >= 40) {
        recommendation = 'Moderate investment - consider alternative paths or ways to boost earnings potential.';
      } else {
        recommendation = 'Consider alternatives - the ROI may not justify the investment at this cost level.';
      }

      results.push({
        career_title: input.career_title || input.career_path_id || 'Unknown Career',
        total_investment: educationCost,
        opportunity_cost: opportunityCost,
        total_cost: totalCost,
        year_1_salary: year1Salary,
        year_10_salary: year10Salary,
        year_20_salary: year20Salary,
        lifetime_earnings_30yr: lifetimeEarnings,
        alternative_earnings_30yr: alternativeEarnings,
        net_lifetime_gain: netLifetimeGain,
        roi_percentage: roiPercentage,
        payback_period_years: paybackPeriod,
        breakeven_age: breakevenAge,
        monthly_loan_payment: monthlyPayment,
        debt_to_income_ratio: debtToIncome,
        career_outlook: {
          growth_rate: careerInfo?.growthRate || 5,
          job_openings: careerInfo?.jobOpenings || 10000,
          automation_risk: careerInfo?.automationRisk || 'medium',
        },
        recommendation,
        metrics: {
          roi_score: Math.round(roiScore),
          affordability_score: Math.round(affordabilityScore),
          stability_score: Math.round(stabilityScore),
          overall_score: overallScore,
        },
      });
    }

    // Sort by overall score
    results.sort((a, b) => b.metrics.overall_score - a.metrics.overall_score);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        comparison: results.length > 1 ? {
          best_roi: results.sort((a, b) => b.roi_percentage - a.roi_percentage)[0].career_title,
          fastest_payback: results.sort((a, b) => a.payback_period_years - b.payback_period_years)[0].career_title,
          highest_lifetime_earnings: results.sort((a, b) => b.lifetime_earnings_30yr - a.lifetime_earnings_30yr)[0].career_title,
          lowest_debt_burden: results.sort((a, b) => a.debt_to_income_ratio - b.debt_to_income_ratio)[0].career_title,
        } : null,
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
