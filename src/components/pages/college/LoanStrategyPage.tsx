// ===========================================
// Student Loan Strategy Page - College Students
// PSLF, IDR & repayment planning
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  CreditCard,
  Calculator,
  TrendingDown,
  CheckCircle,
  ChevronRight,
  DollarSign,
  Calendar,
  Building2,
  PiggyBank,
  AlertCircle,
  Target,
  Clock,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface RepaymentPlan {
  id: string;
  name: string;
  shortName: string;
  description: string;
  monthlyPayment: string;
  term: string;
  forgivenessEligible: boolean;
  bestFor: string[];
}

interface LoanTip {
  title: string;
  description: string;
  savings?: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const REPAYMENT_PLANS: RepaymentPlan[] = [
  {
    id: 'standard',
    name: 'Standard Repayment',
    shortName: 'Standard',
    description: 'Fixed payments over 10 years. Highest monthly payment but lowest total interest.',
    monthlyPayment: 'Highest',
    term: '10 years',
    forgivenessEligible: false,
    bestFor: ['High earners', 'Those who want to pay off quickly', 'Small loan balances'],
  },
  {
    id: 'graduated',
    name: 'Graduated Repayment',
    shortName: 'Graduated',
    description: 'Payments start low and increase every 2 years. Still 10-year term.',
    monthlyPayment: 'Starts low, increases',
    term: '10 years',
    forgivenessEligible: false,
    bestFor: ['Those expecting salary growth', 'New grads with lower starting salaries'],
  },
  {
    id: 'ibr',
    name: 'Income-Based Repayment',
    shortName: 'IBR',
    description: 'Payments capped at 10-15% of discretionary income. Forgiveness after 20-25 years.',
    monthlyPayment: '10-15% of income',
    term: '20-25 years',
    forgivenessEligible: true,
    bestFor: ['Lower-income borrowers', 'Those pursuing PSLF', 'Large loan balances'],
  },
  {
    id: 'paye',
    name: 'Pay As You Earn',
    shortName: 'PAYE',
    description: 'Payments capped at 10% of discretionary income. Forgiveness after 20 years.',
    monthlyPayment: '10% of income',
    term: '20 years',
    forgivenessEligible: true,
    bestFor: ['New borrowers after 2011', 'Those with financial hardship'],
  },
  {
    id: 'save',
    name: 'SAVE Plan',
    shortName: 'SAVE',
    description: 'New IDR plan with lowest payments. Forgiveness after 10-20 years depending on balance.',
    monthlyPayment: '5-10% of income',
    term: '10-20 years',
    forgivenessEligible: true,
    bestFor: ['Most borrowers with federal loans', 'Those pursuing PSLF', 'Undergrad borrowers'],
  },
];

const PSLF_REQUIREMENTS = [
  'Work full-time for a qualifying employer (government or nonprofit)',
  'Have Direct Loans (or consolidate into Direct Loans)',
  'Enroll in an income-driven repayment plan',
  'Make 120 qualifying payments (10 years)',
  'Submit PSLF form annually to track progress',
];

const PSLF_EMPLOYERS = [
  { type: 'Federal Government', examples: 'NASA, DOE, NIH, DoD, etc.' },
  { type: 'State/Local Government', examples: 'Public universities, state agencies' },
  { type: '501(c)(3) Nonprofits', examples: 'Research institutes, hospitals, foundations' },
  { type: 'Public Service Organizations', examples: 'AmeriCorps, Peace Corps' },
];

const LOAN_TIPS: LoanTip[] = [
  {
    title: 'Pay during grace period',
    description: 'Interest accrues during the 6-month grace period. Making payments early saves money.',
    savings: 'Save $500-2,000',
  },
  {
    title: 'Set up autopay',
    description: 'Most servicers offer 0.25% interest rate reduction for automatic payments.',
    savings: 'Save 0.25% on interest',
  },
  {
    title: 'Target high-interest first',
    description: 'Pay minimums on all loans, extra on highest interest rate (avalanche method).',
  },
  {
    title: 'Dont forget employer benefits',
    description: 'Many employers offer student loan repayment assistance ($5,250/year is tax-free).',
  },
  {
    title: 'Recertify IDR annually',
    description: 'Missing recertification can cause payments to spike. Set calendar reminders.',
  },
];

// ===========================================
// COMPONENT
// ===========================================
const LoanStrategyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'pslf' | 'calculator'>('plans');
  const { info } = useNotifications();
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [income, setIncome] = useState(70000);

  const monthlyStandard = Math.round((loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + interestRate / 100 / 12, -120)));
  const monthlyIDR = Math.round((income - 22500) * 0.10 / 12);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-gray-950 to-teal-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <Link to="/college/government-careers" className="hover:underline">Government & Finance</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Student Loan Strategy</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Student Loan
                <span className="text-emerald-400"> Strategy</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Understand your repayment options, explore PSLF and IDR plans,
                and create a strategy to manage your student debt effectively.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Payments
                </button>
                <button
                  onClick={() => setActiveTab('pslf')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
                >
                  <Target className="w-5 h-5" />
                  PSLF Eligibility
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Average Debt', value: '$37,000', icon: DollarSign },
                  { label: 'PSLF Timeline', value: '10 years', icon: Clock },
                  { label: 'IDR Cap', value: '10% income', icon: TrendingDown },
                  { label: 'Grace Period', value: '6 months', icon: Calendar },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-xl p-4">
                    <stat.icon className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'plans', label: 'Repayment Plans', icon: CreditCard },
            { id: 'pslf', label: 'PSLF Guide', icon: Building2 },
            { id: 'calculator', label: 'Payment Calculator', icon: Calculator },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-emerald-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Repayment Plans Tab */}
        {activeTab === 'plans' && (
          <div>
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {REPAYMENT_PLANS.map(plan => (
                <div
                  key={plan.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      <span className="text-sm text-gray-400">({plan.shortName})</span>
                    </div>
                    {plan.forgivenessEligible && (
                      <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded">
                        PSLF Eligible
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Monthly Payment</span>
                      <div className="text-white font-medium">{plan.monthlyPayment}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Term</span>
                      <div className="text-white font-medium">{plan.term}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Best For</span>
                    <ul className="mt-2 space-y-1">
                      {plan.bestFor.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <h2 className="text-2xl font-bold text-white mb-6">Money-Saving Tips</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LOAN_TIPS.map((tip, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                  <h4 className="font-semibold text-white mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{tip.description}</p>
                  {tip.savings && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <PiggyBank className="w-4 h-4" />
                      {tip.savings}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PSLF Tab */}
        {activeTab === 'pslf' && (
          <div>
            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-400" />
                Public Service Loan Forgiveness (PSLF)
              </h2>
              <p className="text-gray-300 mb-4">
                PSLF forgives remaining loan balance after 120 qualifying payments (10 years) while
                working full-time for a qualifying employer. The forgiven amount is tax-free.
              </p>
              <div className="text-2xl font-bold text-emerald-400">
                Average forgiveness: $70,000+
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Requirements */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {PSLF_REQUIREMENTS.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifying Employers */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Qualifying Employers</h3>
                <div className="space-y-4">
                  {PSLF_EMPLOYERS.map((employer, i) => (
                    <div key={i}>
                      <h4 className="font-medium text-emerald-400">{employer.type}</h4>
                      <p className="text-sm text-gray-400">{employer.examples}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/5 rounded-xl border border-yellow-500/20 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Important Reminders</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Submit the PSLF form annually, not just after 120 payments</li>
                    <li>• Use the PSLF Help Tool to verify employer eligibility</li>
                    <li>• Only payments AFTER October 2007 count</li>
                    <li>• You must be working for a qualifying employer when you apply for forgiveness</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Payment Calculator</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Total Loan Balance: ${loanAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Interest Rate: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Annual Income: ${income.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="30000"
                    max="200000"
                    step="5000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h4 className="text-sm text-gray-400 mb-2">Standard 10-Year Plan</h4>
                <div className="text-3xl font-bold text-white mb-2">
                  ${monthlyStandard.toLocaleString()}/month
                </div>
                <p className="text-sm text-gray-500">
                  Total paid: ${(monthlyStandard * 120).toLocaleString()}
                </p>
              </div>

              <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-6">
                <h4 className="text-sm text-gray-400 mb-2">Income-Driven (SAVE Plan)</h4>
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  ${Math.max(0, monthlyIDR).toLocaleString()}/month
                </div>
                <p className="text-sm text-gray-500">
                  Based on 10% of discretionary income
                </p>
                <p className="text-sm text-emerald-400 mt-2">
                  Save ${Math.max(0, monthlyStandard - monthlyIDR).toLocaleString()}/month vs Standard
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h4 className="text-sm text-gray-400 mb-2">With PSLF (after 10 years)</h4>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  ${Math.max(0, loanAmount - (monthlyIDR * 120)).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">
                  Potential forgiveness amount (tax-free)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Need Personalized Advice?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our financial coaches can help you create a customized student loan repayment strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => info('Free consultation scheduling is coming soon!')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Get Free Consultation
            </button>
            <Link
              to="/college/budget-planner"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Budget Planner
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStrategyPage;
