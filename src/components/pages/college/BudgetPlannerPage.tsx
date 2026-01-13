// ===========================================
// Early Career Budget Planner Page - College Students
// First job financial planning
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PiggyBank,
  CreditCard,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  ChevronRight,
  CheckCircle,
  Target,
  Calculator,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  recommended: string;
  description: string;
}

interface FinancialMilestone {
  id: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'housing',
    name: 'Housing',
    icon: <Home className="w-5 h-5" />,
    recommended: '25-30%',
    description: 'Rent, utilities, renters insurance',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: <Car className="w-5 h-5" />,
    recommended: '10-15%',
    description: 'Car payment, insurance, gas, public transit',
  },
  {
    id: 'food',
    name: 'Food',
    icon: <Utensils className="w-5 h-5" />,
    recommended: '10-15%',
    description: 'Groceries, dining out, coffee',
  },
  {
    id: 'savings',
    name: 'Savings & Investing',
    icon: <PiggyBank className="w-5 h-5" />,
    recommended: '20%+',
    description: '401k, emergency fund, investments',
  },
  {
    id: 'debt',
    name: 'Debt Payments',
    icon: <CreditCard className="w-5 h-5" />,
    recommended: '10-15%',
    description: 'Student loans, credit cards',
  },
  {
    id: 'personal',
    name: 'Personal & Entertainment',
    icon: <ShoppingBag className="w-5 h-5" />,
    recommended: '5-10%',
    description: 'Clothes, hobbies, subscriptions, fun',
  },
];

const MILESTONES: FinancialMilestone[] = [
  {
    id: '1',
    title: 'Build $1,000 emergency fund',
    description: 'Start with a mini emergency fund before tackling debt aggressively',
    priority: 1,
    completed: false,
  },
  {
    id: '2',
    title: 'Contribute to 401k up to employer match',
    description: "Free money! If your employer matches 4%, contribute at least 4%",
    priority: 2,
    completed: false,
  },
  {
    id: '3',
    title: 'Pay off high-interest debt (>7%)',
    description: 'Credit cards first, then consider student loans above 7%',
    priority: 3,
    completed: false,
  },
  {
    id: '4',
    title: 'Build 3-6 months emergency fund',
    description: 'Full emergency fund in a high-yield savings account',
    priority: 4,
    completed: false,
  },
  {
    id: '5',
    title: 'Max out Roth IRA ($7,000/year)',
    description: 'Tax-free growth for retirement. Best done while income is lower',
    priority: 5,
    completed: false,
  },
  {
    id: '6',
    title: 'Increase 401k to 15%',
    description: 'Including employer match, aim for 15% of income toward retirement',
    priority: 6,
    completed: false,
  },
];

const FIRST_PAYCHECK_CHECKLIST = [
  'Set up direct deposit',
  'Enroll in employer 401k (at least get the match!)',
  'Choose health insurance plan',
  'Set up high-yield savings account for emergency fund',
  'Create a budget spreadsheet or use an app',
  "Understand your pay stub (gross vs net, deductions)",
  'Set up automatic transfers to savings',
];

// ===========================================
// COMPONENT
// ===========================================
const BudgetPlannerPage: React.FC = () => {
  const [salary, setSalary] = useState<number>(100000);
  const [taxRate, setTaxRate] = useState<number>(30);
  const [milestones, setMilestones] = useState<FinancialMilestone[]>(MILESTONES);

  const netMonthly = Math.round((salary * (1 - taxRate / 100)) / 12);

  const toggleMilestone = (id: string) => {
    setMilestones(prev =>
      prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-900/20 via-gray-950 to-green-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-lime-400 mb-4">
            <Link to="/college/government-careers" className="hover:underline">Government & Finance</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Budget Planner</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Early Career
                <span className="text-lime-400"> Budget Planner</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your first job is the best time to build good financial habits.
                Learn how to budget, save, and invest for your future.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-lime-600 hover:bg-lime-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Calculator className="w-5 h-5" />
                  Create My Budget
                </button>
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <Target className="w-5 h-5" />
                  Set Goals
                </button>
              </div>
            </div>

            {/* Quick Calculator */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Take-Home Calculator</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Annual Salary: ${salary.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="40000"
                    max="250000"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Estimated Tax Rate: {taxRate}%
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    step="1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-lime-500/10 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400">Monthly Take-Home Pay</div>
                <div className="text-3xl font-bold text-lime-400">${netMonthly.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Yearly: ${(netMonthly * 12).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Budget Breakdown */}
        <h2 className="text-2xl font-bold text-white mb-6">Recommended Budget Breakdown</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BUDGET_CATEGORIES.map(category => {
            const [minPercent, maxPercent] = category.recommended.replace('%', '').replace('+', '-100').split('-').map(Number);
            const minAmount = Math.round(netMonthly * minPercent / 100);
            const maxAmount = maxPercent === 100 ? 'max' : Math.round(netMonthly * maxPercent / 100);

            return (
              <div key={category.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center text-lime-400">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <span className="text-sm text-lime-400">{category.recommended}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                <div className="text-sm text-gray-500">
                  Based on your income: ${minAmount.toLocaleString()} - {maxAmount === 'max' ? maxAmount : `$${maxAmount.toLocaleString()}`}/mo
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Milestones */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Financial Milestones</h2>
            <p className="text-gray-400 mb-6">
              Complete these in order. Each milestone builds on the previous one.
            </p>

            <div className="space-y-4">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.id}
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`bg-gray-900/50 rounded-xl border p-4 cursor-pointer transition-all ${
                    milestone.completed
                      ? 'border-lime-500/30 bg-lime-500/5'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      milestone.completed ? 'bg-lime-500 text-white' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${milestone.completed ? 'text-lime-400' : 'text-white'}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First Paycheck Checklist */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">First Paycheck Checklist</h2>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <ul className="space-y-3">
                {FIRST_PAYCHECK_CHECKLIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-lime-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-lime-500/5 rounded-xl border border-lime-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-lime-400" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>• Pay yourself first - automate savings before you see the money</li>
                <li>• Lifestyle creep is real - live like a student for your first year</li>
                <li>• Your 20s are the most valuable investing years due to compound interest</li>
                <li>• HSA is triple tax-advantaged if you have a HDHP health plan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 50/30/20 Rule */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">The 50/30/20 Rule</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-400">50%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Needs</h3>
              <p className="text-gray-400 text-sm">Housing, utilities, groceries, insurance, minimum debt payments</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-400">30%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wants</h3>
              <p className="text-gray-400 text-sm">Dining out, entertainment, hobbies, shopping, vacations</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-lime-400">20%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Savings</h3>
              <p className="text-gray-400 text-sm">Emergency fund, 401k, IRA, extra debt payments, investments</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Based on your ${netMonthly.toLocaleString()}/month take-home:
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <span className="text-blue-400 font-semibold">${Math.round(netMonthly * 0.5).toLocaleString()}</span>
                <span className="text-gray-500 ml-1">needs</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold">${Math.round(netMonthly * 0.3).toLocaleString()}</span>
                <span className="text-gray-500 ml-1">wants</span>
              </div>
              <div>
                <span className="text-lime-400 font-semibold">${Math.round(netMonthly * 0.2).toLocaleString()}</span>
                <span className="text-gray-500 ml-1">savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-lime-900/30 to-green-900/30 rounded-2xl border border-lime-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Financial Journey</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            The best time to start building wealth is right now. Small steps today lead to big results tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/loan-strategy"
              className="px-8 py-3 bg-lime-600 hover:bg-lime-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Student Loan Strategy
            </Link>
            <Link
              to="/college/salary-negotiation"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Salary Negotiation
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerPage;
