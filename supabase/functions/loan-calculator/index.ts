// ===========================================
// Loan Payoff Calculator Edge Function
// Model student loan repayment strategies
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Loan {
  name: string;
  principal: number;
  interest_rate: number;
  type: 'subsidized' | 'unsubsidized' | 'plus' | 'private' | 'perkins';
  servicer?: string;
}

interface RepaymentInput {
  loans: Loan[];
  monthly_income: number;
  monthly_payment_budget: number;
  repayment_strategy: 'standard' | 'avalanche' | 'snowball' | 'income_driven';
  income_driven_plan?: 'SAVE' | 'PAYE' | 'IBR' | 'ICR';
  family_size?: number;
  state?: string;
}

interface PaymentSchedule {
  month: number;
  loan_name: string;
  payment: number;
  principal_paid: number;
  interest_paid: number;
  remaining_balance: number;
}

interface RepaymentResult {
  strategy_name: string;
  total_paid: number;
  total_interest: number;
  months_to_payoff: number;
  monthly_payment: number;
  forgiveness_amount: number;
  schedule_summary: {
    year: number;
    total_paid: number;
    remaining_balance: number;
  }[];
  loan_payoff_order: string[];
}

// 2024 Poverty guidelines for income-driven plans
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

// Calculate standard monthly payment
function calculateStandardPayment(principal: number, rate: number, months: number = 120): number {
  const monthlyRate = rate / 12;
  if (monthlyRate === 0) return principal / months;

  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                  (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment * 100) / 100;
}

// Calculate income-driven payment
function calculateIncomePayment(
  annualIncome: number,
  familySize: number,
  plan: string,
  totalBalance: number
): number {
  const poverty = povertyGuidelines[familySize] || povertyGuidelines[4];

  let discretionaryIncome: number;
  let paymentPercent: number;

  switch (plan) {
    case 'SAVE':
      // 225% of poverty line, 5% of discretionary (undergrad) or 10% (grad)
      discretionaryIncome = Math.max(0, annualIncome - poverty * 2.25);
      paymentPercent = 0.05; // Simplified - using undergrad rate
      break;
    case 'PAYE':
      // 150% of poverty line, 10% of discretionary
      discretionaryIncome = Math.max(0, annualIncome - poverty * 1.5);
      paymentPercent = 0.10;
      break;
    case 'IBR':
      // 150% of poverty line, 10-15% of discretionary
      discretionaryIncome = Math.max(0, annualIncome - poverty * 1.5);
      paymentPercent = 0.10;
      break;
    case 'ICR':
      // 100% of poverty line, 20% of discretionary
      discretionaryIncome = Math.max(0, annualIncome - poverty);
      paymentPercent = 0.20;
      break;
    default:
      discretionaryIncome = annualIncome - poverty * 1.5;
      paymentPercent = 0.10;
  }

  const payment = (discretionaryIncome * paymentPercent) / 12;

  // Cap at 10-year standard payment
  const standardPayment = calculateStandardPayment(totalBalance, 0.05);
  return Math.min(payment, standardPayment);
}

// Simulate repayment
function simulateRepayment(
  loans: Loan[],
  monthlyBudget: number,
  strategy: string,
  incomeInfo?: { annual: number; familySize: number; plan: string }
): RepaymentResult {
  // Create working copies of loans
  let workingLoans = loans.map(loan => ({
    ...loan,
    balance: loan.principal,
    monthlyRate: loan.interest_rate / 12,
    minPayment: calculateStandardPayment(loan.principal, loan.interest_rate),
  }));

  // Sort loans based on strategy
  const sortLoans = () => {
    switch (strategy) {
      case 'avalanche':
        workingLoans.sort((a, b) => b.interest_rate - a.interest_rate);
        break;
      case 'snowball':
        workingLoans.sort((a, b) => a.balance - b.balance);
        break;
      default:
        // Keep original order for standard/income-driven
        break;
    }
  };

  let month = 0;
  const maxMonths = 360; // 30 years max (for income-driven plans)
  let totalPaid = 0;
  let totalInterest = 0;
  const yearlySummary: { year: number; total_paid: number; remaining_balance: number }[] = [];
  const payoffOrder: string[] = [];

  // Calculate total minimum payments
  const totalMinPayment = workingLoans.reduce((sum, loan) => sum + loan.minPayment, 0);

  // Determine actual monthly payment
  let actualMonthlyPayment = monthlyBudget;
  if (strategy === 'income_driven' && incomeInfo) {
    const totalBalance = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
    actualMonthlyPayment = calculateIncomePayment(
      incomeInfo.annual,
      incomeInfo.familySize,
      incomeInfo.plan,
      totalBalance
    );
  } else {
    actualMonthlyPayment = Math.max(totalMinPayment, monthlyBudget);
  }

  // Track annual totals
  let yearlyPaid = 0;

  while (month < maxMonths) {
    sortLoans();

    // Check if all loans are paid
    const remainingBalance = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
    if (remainingBalance <= 0.01) break;

    // Track year boundary
    if (month > 0 && month % 12 === 0) {
      const totalRemaining = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
      yearlySummary.push({
        year: month / 12,
        total_paid: Math.round(yearlyPaid * 100) / 100,
        remaining_balance: Math.round(totalRemaining * 100) / 100,
      });
      yearlyPaid = 0;
    }

    let remainingBudget = actualMonthlyPayment;

    // Pay minimum on all loans first
    for (const loan of workingLoans) {
      if (loan.balance <= 0) continue;

      // Calculate interest accrued this month
      const interest = loan.balance * loan.monthlyRate;
      loan.balance += interest;
      totalInterest += interest;

      // Pay minimum (or remaining balance if less)
      const minPay = Math.min(loan.minPayment, loan.balance, remainingBudget);
      loan.balance -= minPay;
      remainingBudget -= minPay;
      totalPaid += minPay;
      yearlyPaid += minPay;

      // Check if paid off
      if (loan.balance <= 0.01) {
        loan.balance = 0;
        if (!payoffOrder.includes(loan.name)) {
          payoffOrder.push(loan.name);
        }
      }
    }

    // Apply extra payment based on strategy
    if (remainingBudget > 0) {
      for (const loan of workingLoans) {
        if (loan.balance <= 0) continue;

        const extraPayment = Math.min(remainingBudget, loan.balance);
        loan.balance -= extraPayment;
        remainingBudget -= extraPayment;
        totalPaid += extraPayment;
        yearlyPaid += extraPayment;

        if (loan.balance <= 0.01) {
          loan.balance = 0;
          if (!payoffOrder.includes(loan.name)) {
            payoffOrder.push(loan.name);
          }
        }

        if (remainingBudget <= 0) break;
      }
    }

    month++;

    // Income-driven plan adjustments (simplified annual income increase)
    if (strategy === 'income_driven' && incomeInfo && month % 12 === 0) {
      incomeInfo.annual *= 1.03; // 3% annual raise
      const totalBalance = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
      actualMonthlyPayment = calculateIncomePayment(
        incomeInfo.annual,
        incomeInfo.familySize,
        incomeInfo.plan,
        totalBalance
      );
    }
  }

  // Calculate forgiveness for income-driven plans
  let forgivenessAmount = 0;
  if (strategy === 'income_driven' && month >= maxMonths) {
    const forgivenessMonths = incomeInfo?.plan === 'SAVE' || incomeInfo?.plan === 'PAYE' ? 240 : 300;
    if (month >= forgivenessMonths) {
      forgivenessAmount = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
    }
  }

  // Add final year summary
  const finalBalance = workingLoans.reduce((sum, loan) => sum + loan.balance, 0);
  if (yearlyPaid > 0 || finalBalance > 0) {
    yearlySummary.push({
      year: Math.ceil(month / 12),
      total_paid: Math.round(yearlyPaid * 100) / 100,
      remaining_balance: Math.round(finalBalance * 100) / 100,
    });
  }

  return {
    strategy_name: strategy,
    total_paid: Math.round(totalPaid * 100) / 100,
    total_interest: Math.round(totalInterest * 100) / 100,
    months_to_payoff: month,
    monthly_payment: Math.round(actualMonthlyPayment * 100) / 100,
    forgiveness_amount: Math.round(forgivenessAmount * 100) / 100,
    schedule_summary: yearlySummary,
    loan_payoff_order: payoffOrder,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      loans,
      monthly_income,
      monthly_payment_budget,
      repayment_strategy,
      income_driven_plan,
      family_size,
      compare_all,
    } = await req.json();

    if (!loans || loans.length === 0) {
      throw new Error('At least one loan is required');
    }

    const totalPrincipal = loans.reduce((sum: number, l: Loan) => sum + l.principal, 0);
    const avgRate = loans.reduce((sum: number, l: Loan) => sum + l.interest_rate * l.principal, 0) / totalPrincipal;

    const results: RepaymentResult[] = [];

    if (compare_all) {
      // Compare all strategies
      const strategies = ['standard', 'avalanche', 'snowball'];
      if (monthly_income) {
        strategies.push('income_driven');
      }

      for (const strategy of strategies) {
        const result = simulateRepayment(
          loans,
          monthly_payment_budget,
          strategy,
          strategy === 'income_driven'
            ? { annual: monthly_income * 12, familySize: family_size || 1, plan: income_driven_plan || 'SAVE' }
            : undefined
        );
        results.push(result);
      }
    } else {
      // Single strategy
      const result = simulateRepayment(
        loans,
        monthly_payment_budget,
        repayment_strategy,
        repayment_strategy === 'income_driven'
          ? { annual: monthly_income * 12, familySize: family_size || 1, plan: income_driven_plan || 'SAVE' }
          : undefined
      );
      results.push(result);
    }

    // Find best strategies
    const sortedByTotal = [...results].sort((a, b) => a.total_paid - b.total_paid);
    const sortedByTime = [...results].sort((a, b) => a.months_to_payoff - b.months_to_payoff);

    return new Response(
      JSON.stringify({
        success: true,
        loan_summary: {
          total_principal: totalPrincipal,
          average_rate: Math.round(avgRate * 10000) / 100, // Convert to percentage
          number_of_loans: loans.length,
        },
        results,
        recommendations: {
          lowest_total_cost: sortedByTotal[0]?.strategy_name,
          fastest_payoff: sortedByTime[0]?.strategy_name,
          savings_avalanche_vs_standard:
            results.find(r => r.strategy_name === 'standard')
              ? (results.find(r => r.strategy_name === 'standard')!.total_paid -
                 (results.find(r => r.strategy_name === 'avalanche')?.total_paid || 0))
              : 0,
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
