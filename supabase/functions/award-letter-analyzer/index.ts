// ===========================================
// Award Letter Analyzer Edge Function
// Parse and analyze financial aid award letters
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AwardItem {
  name: string;
  amount: number;
  type: 'grant' | 'scholarship' | 'loan' | 'work_study' | 'other';
  source: 'federal' | 'state' | 'institutional' | 'private' | 'unknown';
  is_need_based: boolean;
  is_merit_based: boolean;
  renewable: boolean;
  terms?: string;
}

interface AwardLetter {
  college_name: string;
  academic_year: string;
  cost_of_attendance: {
    tuition: number;
    fees: number;
    room_and_board: number;
    books: number;
    personal: number;
    transportation: number;
    total: number;
  };
  awards: AwardItem[];
}

interface AnalysisResult {
  college_name: string;
  total_cost: number;
  total_free_money: number;
  total_loans: number;
  total_work_study: number;
  net_price: number;
  gap: number;
  loan_debt_4yr: number;
  monthly_payment_estimate: number;
  warnings: string[];
  recommendations: string[];
  score: number;
  breakdown: {
    grants_scholarships: number;
    loans: number;
    work_study: number;
    parent_plus_needed: number;
    out_of_pocket: number;
  };
  comparison_metrics: {
    grant_percentage: number;
    loan_percentage: number;
    self_help_ratio: number;
  };
}

// Known federal aid programs
const federalPrograms: Record<string, { type: 'grant' | 'loan' | 'work_study'; maxAmount: number }> = {
  'pell grant': { type: 'grant', maxAmount: 7395 },
  'federal pell': { type: 'grant', maxAmount: 7395 },
  'seog': { type: 'grant', maxAmount: 1000 },
  'fseog': { type: 'grant', maxAmount: 1000 },
  'supplemental educational opportunity': { type: 'grant', maxAmount: 1000 },
  'teach grant': { type: 'grant', maxAmount: 4000 },
  'direct subsidized': { type: 'loan', maxAmount: 5500 },
  'subsidized loan': { type: 'loan', maxAmount: 5500 },
  'stafford subsidized': { type: 'loan', maxAmount: 5500 },
  'direct unsubsidized': { type: 'loan', maxAmount: 7000 },
  'unsubsidized loan': { type: 'loan', maxAmount: 7000 },
  'stafford unsubsidized': { type: 'loan', maxAmount: 7000 },
  'parent plus': { type: 'loan', maxAmount: 999999 },
  'plus loan': { type: 'loan', maxAmount: 999999 },
  'perkins': { type: 'loan', maxAmount: 5500 },
  'work-study': { type: 'work_study', maxAmount: 3000 },
  'federal work study': { type: 'work_study', maxAmount: 3000 },
  'fws': { type: 'work_study', maxAmount: 3000 },
};

// Classify award item
function classifyAward(name: string, amount: number): Partial<AwardItem> {
  const nameLower = name.toLowerCase();

  // Check federal programs first
  for (const [program, info] of Object.entries(federalPrograms)) {
    if (nameLower.includes(program)) {
      return {
        type: info.type,
        source: 'federal',
        is_need_based: info.type === 'grant' || nameLower.includes('subsidized'),
        is_merit_based: false,
        renewable: info.type === 'grant',
      };
    }
  }

  // State grants
  if (nameLower.includes('state grant') || nameLower.includes('cal grant') ||
      nameLower.includes('tap') || nameLower.includes('hope') ||
      nameLower.includes('bright futures') || nameLower.includes('map grant')) {
    return {
      type: 'grant',
      source: 'state',
      is_need_based: true,
      is_merit_based: nameLower.includes('merit') || nameLower.includes('hope'),
      renewable: true,
    };
  }

  // Institutional awards
  if (nameLower.includes('scholarship') || nameLower.includes('award') ||
      nameLower.includes('grant') || nameLower.includes('aid')) {
    const isMerit = nameLower.includes('merit') || nameLower.includes('dean') ||
                    nameLower.includes('presidential') || nameLower.includes('academic') ||
                    nameLower.includes('achievement') || nameLower.includes('excellence');

    return {
      type: nameLower.includes('loan') ? 'loan' : 'scholarship',
      source: 'institutional',
      is_need_based: nameLower.includes('need') || !isMerit,
      is_merit_based: isMerit,
      renewable: !nameLower.includes('one-time') && !nameLower.includes('first year only'),
    };
  }

  // Private scholarships
  if (nameLower.includes('private') || nameLower.includes('external') ||
      nameLower.includes('outside') || nameLower.includes('foundation')) {
    return {
      type: 'scholarship',
      source: 'private',
      is_need_based: false,
      is_merit_based: true,
      renewable: false,
    };
  }

  // Loans (catch-all)
  if (nameLower.includes('loan')) {
    return {
      type: 'loan',
      source: 'unknown',
      is_need_based: false,
      is_merit_based: false,
      renewable: false,
    };
  }

  // Default to institutional grant
  return {
    type: 'grant',
    source: 'institutional',
    is_need_based: true,
    is_merit_based: false,
    renewable: true,
  };
}

// Analyze a single award letter
function analyzeAwardLetter(letter: AwardLetter): AnalysisResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Classify all awards
  const classifiedAwards: AwardItem[] = letter.awards.map(award => ({
    ...award,
    ...classifyAward(award.name, award.amount),
  }));

  // Calculate totals
  const totalCost = letter.cost_of_attendance.total;

  const grantsScholarships = classifiedAwards
    .filter(a => a.type === 'grant' || a.type === 'scholarship')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalLoans = classifiedAwards
    .filter(a => a.type === 'loan')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalWorkStudy = classifiedAwards
    .filter(a => a.type === 'work_study')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalAid = grantsScholarships + totalLoans + totalWorkStudy;
  const gap = totalCost - totalAid;
  const netPrice = totalCost - grantsScholarships;

  // 4-year debt projection (assuming similar packages)
  const loanDebt4yr = totalLoans * 4;

  // Monthly payment (10-year standard, ~5% interest)
  const monthlyPayment = loanDebt4yr > 0
    ? Math.round(loanDebt4yr * 0.0106) // Simplified monthly factor
    : 0;

  // Generate warnings
  if (gap > 5000) {
    warnings.push(`Funding gap of $${gap.toLocaleString()} not covered by aid package`);
  }

  if (totalLoans > grantsScholarships) {
    warnings.push('This package is loan-heavy - loans exceed grants and scholarships');
  }

  const hasParentPlus = classifiedAwards.some(a =>
    a.name.toLowerCase().includes('parent plus') || a.name.toLowerCase().includes('plus loan')
  );
  if (hasParentPlus) {
    warnings.push('Package includes Parent PLUS loans - these require separate application and credit check');
  }

  const hasPrivateLoans = classifiedAwards.some(a =>
    a.source === 'private' && a.type === 'loan'
  );
  if (hasPrivateLoans) {
    warnings.push('Private loans typically have higher interest rates and fewer protections than federal loans');
  }

  const nonRenewableAid = classifiedAwards
    .filter(a => !a.renewable && (a.type === 'grant' || a.type === 'scholarship'))
    .reduce((sum, a) => sum + a.amount, 0);
  if (nonRenewableAid > 5000) {
    warnings.push(`$${nonRenewableAid.toLocaleString()} in one-time aid may not be available in future years`);
  }

  if (loanDebt4yr > 40000) {
    warnings.push(`Projected 4-year loan debt of $${loanDebt4yr.toLocaleString()} exceeds recommended maximum`);
  }

  // Generate recommendations
  if (grantsScholarships < totalCost * 0.5) {
    recommendations.push('Consider applying for additional external scholarships');
  }

  if (totalLoans > 0 && !classifiedAwards.some(a => a.name.toLowerCase().includes('subsidized'))) {
    recommendations.push('Ask if you qualify for subsidized federal loans');
  }

  if (gap > 0) {
    recommendations.push('Contact the financial aid office to discuss additional aid options');
  }

  if (netPrice > 30000) {
    recommendations.push('Compare this offer carefully with other schools\' packages');
  }

  const hasWorkStudy = totalWorkStudy > 0;
  if (!hasWorkStudy && totalLoans > 3000) {
    recommendations.push('Ask about work-study opportunities to reduce loan needs');
  }

  // Calculate score (0-100)
  let score = 100;

  // Penalize for high net price relative to cost
  const netPriceRatio = netPrice / totalCost;
  score -= netPriceRatio * 30;

  // Penalize for loan-heavy packages
  const loanRatio = totalAid > 0 ? totalLoans / totalAid : 0;
  score -= loanRatio * 25;

  // Penalize for gaps
  if (gap > 0) {
    score -= Math.min(20, (gap / 10000) * 10);
  }

  // Penalize for high projected debt
  if (loanDebt4yr > 30000) {
    score -= Math.min(15, ((loanDebt4yr - 30000) / 20000) * 15);
  }

  // Bonus for high grant percentage
  const grantPercentage = totalAid > 0 ? grantsScholarships / totalAid : 0;
  if (grantPercentage > 0.7) score += 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // Calculate comparison metrics
  const grantPercentageOfCost = totalCost > 0 ? (grantsScholarships / totalCost) * 100 : 0;
  const loanPercentageOfAid = totalAid > 0 ? (totalLoans / totalAid) * 100 : 0;
  const selfHelpRatio = grantsScholarships > 0
    ? (totalLoans + totalWorkStudy) / grantsScholarships
    : 999;

  return {
    college_name: letter.college_name,
    total_cost: totalCost,
    total_free_money: grantsScholarships,
    total_loans: totalLoans,
    total_work_study: totalWorkStudy,
    net_price: netPrice,
    gap: Math.max(0, gap),
    loan_debt_4yr: loanDebt4yr,
    monthly_payment_estimate: monthlyPayment,
    warnings,
    recommendations,
    score,
    breakdown: {
      grants_scholarships: grantsScholarships,
      loans: totalLoans,
      work_study: totalWorkStudy,
      parent_plus_needed: Math.max(0, gap),
      out_of_pocket: Math.max(0, gap - totalWorkStudy),
    },
    comparison_metrics: {
      grant_percentage: Math.round(grantPercentageOfCost),
      loan_percentage: Math.round(loanPercentageOfAid),
      self_help_ratio: Math.round(selfHelpRatio * 100) / 100,
    },
  };
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

    const { user_id, award_letters } = await req.json();

    if (!award_letters || !Array.isArray(award_letters) || award_letters.length === 0) {
      throw new Error('At least one award letter is required');
    }

    // Analyze each award letter
    const analyses: AnalysisResult[] = award_letters.map(analyzeAwardLetter);

    // Sort by score (best offers first)
    analyses.sort((a, b) => b.score - a.score);

    // Generate comparison insights
    const comparison = {
      best_value: analyses[0]?.college_name,
      lowest_net_price: [...analyses].sort((a, b) => a.net_price - b.net_price)[0]?.college_name,
      most_grants: [...analyses].sort((a, b) => b.total_free_money - a.total_free_money)[0]?.college_name,
      lowest_debt: [...analyses].sort((a, b) => a.loan_debt_4yr - b.loan_debt_4yr)[0]?.college_name,
      average_net_price: Math.round(analyses.reduce((sum, a) => sum + a.net_price, 0) / analyses.length),
      net_price_range: {
        min: Math.min(...analyses.map(a => a.net_price)),
        max: Math.max(...analyses.map(a => a.net_price)),
      },
    };

    // Save analysis if authenticated
    if (user_id) {
      for (const analysis of analyses) {
        const letterData = award_letters.find(l => l.college_name === analysis.college_name);

        await supabaseClient
          .from('award_letters')
          .upsert({
            user_id,
            college_name: analysis.college_name,
            academic_year: letterData?.academic_year || '2024-2025',
            cost_of_attendance: letterData?.cost_of_attendance?.total || analysis.total_cost,
            grants_scholarships: analysis.total_free_money,
            loans: analysis.total_loans,
            work_study: analysis.total_work_study,
            net_price: analysis.net_price,
            analysis_score: analysis.score,
            raw_data: letterData,
            analysis_results: analysis,
          }, {
            onConflict: 'user_id,college_name',
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analyses,
        comparison,
        recommendation: analyses.length > 1
          ? `Based on the analysis, ${comparison.best_value} offers the best overall value with a score of ${analyses[0]?.score}/100.`
          : `This award package scores ${analyses[0]?.score}/100. ${analyses[0]?.recommendations[0] || ''}`,
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
