// ===========================================
// Loan Payoff Modeler Page
// Student Loan Repayment Strategy Tool
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Types
interface LoanInfo {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  type: 'subsidized' | 'unsubsidized' | 'plus' | 'private';
}

interface RepaymentPlan {
  id: string;
  name: string;
  description: string;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  payoffTime: number; // months
  forgivenAmount: number;
  pros: string[];
  cons: string[];
}

interface PayoffResult {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanPayoffModelerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'compare' | 'strategies'>('input');
  const [loans, setLoans] = useState<LoanInfo[]>([
    { id: '1', name: 'Federal Direct Subsidized', principal: 5500, interestRate: 5.5, type: 'subsidized' },
    { id: '2', name: 'Federal Direct Unsubsidized', principal: 7000, interestRate: 6.5, type: 'unsubsidized' },
  ]);
  const [income, setIncome] = useState<string>('55000');
  const [familySize, setFamilySize] = useState<number>(1);
  const [extraPayment, setExtraPayment] = useState<string>('0');
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState<Partial<LoanInfo>>({
    name: '',
    principal: 0,
    interestRate: 5.5,
    type: 'unsubsidized',
  });

  // Calculations
  const totalDebt = useMemo(() =>
    loans.reduce((sum, loan) => sum + loan.principal, 0),
    [loans]
  );

  const weightedRate = useMemo(() => {
    if (totalDebt === 0) return 0;
    const weightedSum = loans.reduce(
      (sum, loan) => sum + (loan.principal * loan.interestRate),
      0
    );
    return weightedSum / totalDebt;
  }, [loans, totalDebt]);

  const annualIncome = parseInt(income.replace(/,/g, '')) || 0;
  const monthlyExtra = parseInt(extraPayment.replace(/,/g, '')) || 0;

  // Standard 10-year repayment calculation
  const calculateStandardPayment = (principal: number, rate: number, months: number = 120) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Generate amortization schedule
  const generateAmortization = (
    principal: number,
    rate: number,
    monthlyPayment: number,
    maxMonths: number = 360
  ): PayoffResult[] => {
    const schedule: PayoffResult[] = [];
    let balance = principal;
    const monthlyRate = rate / 100 / 12;

    for (let month = 1; month <= maxMonths && balance > 0; month++) {
      const interestCharge = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestCharge, balance);
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestCharge,
        balance,
      });

      if (balance <= 0) break;
    }

    return schedule;
  };

  // Calculate different repayment plans
  const repaymentPlans = useMemo((): RepaymentPlan[] => {
    if (totalDebt === 0) return [];

    const standardMonthly = calculateStandardPayment(totalDebt, weightedRate);

    // Standard 10-year
    const standardSchedule = generateAmortization(totalDebt, weightedRate, standardMonthly);
    const standardTotal = standardSchedule.reduce((sum, p) => sum + p.payment, 0);

    // Graduated (starts lower, increases)
    const graduatedStartPayment = standardMonthly * 0.6;

    // Extended 25-year
    const extendedMonthly = calculateStandardPayment(totalDebt, weightedRate, 300);
    const extendedSchedule = generateAmortization(totalDebt, weightedRate, extendedMonthly, 300);
    const extendedTotal = extendedSchedule.reduce((sum, p) => sum + p.payment, 0);

    // Income-Driven (SAVE plan) - 10% of discretionary income
    const povertyLine = 14580 + (familySize - 1) * 5140; // 2024 poverty guidelines
    const discretionaryIncome = Math.max(0, annualIncome - (povertyLine * 2.25));
    const saveMonthly = Math.max(0, (discretionaryIncome * 0.10) / 12);
    const saveSchedule = generateAmortization(totalDebt, weightedRate, Math.max(saveMonthly, 50), 300);
    const saveTotal = saveSchedule.reduce((sum, p) => sum + p.payment, 0);
    const savePayoffMonths = saveSchedule.length;
    const saveForgiven = savePayoffMonths >= 240 ? Math.max(0, totalDebt - (saveMonthly * 240)) : 0;

    // With extra payments
    const acceleratedMonthly = standardMonthly + monthlyExtra;
    const acceleratedSchedule = generateAmortization(totalDebt, weightedRate, acceleratedMonthly);
    const acceleratedTotal = acceleratedSchedule.reduce((sum, p) => sum + p.payment, 0);

    return [
      {
        id: 'standard',
        name: 'Standard 10-Year',
        description: 'Fixed payments over 10 years',
        monthlyPayment: standardMonthly,
        totalPaid: standardTotal,
        totalInterest: standardTotal - totalDebt,
        payoffTime: standardSchedule.length,
        forgivenAmount: 0,
        pros: ['Lowest total interest', 'Fastest payoff', 'Predictable payments'],
        cons: ['Higher monthly payments', 'Less flexibility'],
      },
      {
        id: 'graduated',
        name: 'Graduated',
        description: 'Starts low, increases every 2 years',
        monthlyPayment: graduatedStartPayment,
        totalPaid: standardTotal * 1.1, // Approximate
        totalInterest: (standardTotal * 1.1) - totalDebt,
        payoffTime: 120,
        forgivenAmount: 0,
        pros: ['Lower initial payments', 'Good for growing income'],
        cons: ['More total interest', 'Payments increase significantly'],
      },
      {
        id: 'extended',
        name: 'Extended 25-Year',
        description: 'Lower payments spread over 25 years',
        monthlyPayment: extendedMonthly,
        totalPaid: extendedTotal,
        totalInterest: extendedTotal - totalDebt,
        payoffTime: extendedSchedule.length,
        forgivenAmount: 0,
        pros: ['Lowest monthly payment', 'More budget flexibility'],
        cons: ['Much more total interest', 'Longer debt burden'],
      },
      {
        id: 'save',
        name: 'SAVE Plan (IDR)',
        description: '10% of discretionary income, forgiveness after 20-25 years',
        monthlyPayment: saveMonthly,
        totalPaid: saveTotal,
        totalInterest: saveTotal - totalDebt + saveForgiven,
        payoffTime: savePayoffMonths,
        forgivenAmount: saveForgiven,
        pros: ['Lowest payment for low income', 'Forgiveness available', 'Interest subsidy'],
        cons: ['Longer repayment', 'Tax implications on forgiveness', 'Must recertify annually'],
      },
      ...(monthlyExtra > 0 ? [{
        id: 'accelerated',
        name: `Accelerated (+$${monthlyExtra}/mo)`,
        description: `Standard payments plus $${monthlyExtra} extra monthly`,
        monthlyPayment: acceleratedMonthly,
        totalPaid: acceleratedTotal,
        totalInterest: acceleratedTotal - totalDebt,
        payoffTime: acceleratedSchedule.length,
        forgivenAmount: 0,
        pros: ['Fastest payoff', 'Lowest total interest', 'Debt freedom sooner'],
        cons: ['Higher monthly commitment', 'Less disposable income'],
      }] : []),
    ];
  }, [totalDebt, weightedRate, annualIncome, familySize, monthlyExtra]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };

  const addLoan = () => {
    if (!newLoan.name || !newLoan.principal) return;
    setLoans(prev => [...prev, {
      ...newLoan as LoanInfo,
      id: Date.now().toString(),
    }]);
    setNewLoan({ name: '', principal: 0, interestRate: 5.5, type: 'unsubsidized' });
    setShowAddLoan(false);
  };

  const removeLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'subsidized': return 'text-emerald-400 bg-emerald-500/20';
      case 'unsubsidized': return 'text-blue-400 bg-blue-500/20';
      case 'plus': return 'text-purple-400 bg-purple-500/20';
      case 'private': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Render input tab
  const renderInput = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-1">Total Debt</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalDebt)}</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-1">Weighted Rate</div>
          <div className="text-2xl font-bold text-orange-400">{weightedRate.toFixed(2)}%</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
          <div className="text-sm text-gray-400 mb-1">Est. Monthly</div>
          <div className="text-2xl font-bold text-teal-400">
            {formatCurrency(calculateStandardPayment(totalDebt, weightedRate))}
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <h3 className="font-bold text-white">Your Loans</h3>
          <button
            onClick={() => setShowAddLoan(true)}
            className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm hover:bg-teal-500/30"
          >
            + Add Loan
          </button>
        </div>

        {loans.length > 0 ? (
          <div className="divide-y divide-dark-border">
            {loans.map(loan => (
              <div key={loan.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLoanTypeColor(loan.type)}`}>
                    {loan.type}
                  </span>
                  <div>
                    <div className="text-white font-medium">{loan.name}</div>
                    <div className="text-sm text-gray-400">{loan.interestRate}% interest</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-white">{formatCurrency(loan.principal)}</div>
                  </div>
                  <button
                    onClick={() => removeLoan(loan.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No loans added yet. Click "Add Loan" to get started.
          </div>
        )}
      </div>

      {/* Add Loan Modal */}
      {showAddLoan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-white mb-4">Add Loan</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Loan Name</label>
                <input
                  type="text"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                  placeholder="e.g., Federal Direct Subsidized"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Type</label>
                <select
                  value={newLoan.type}
                  onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value as LoanInfo['type'] })}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                >
                  <option value="subsidized">Federal Subsidized</option>
                  <option value="unsubsidized">Federal Unsubsidized</option>
                  <option value="plus">Parent PLUS</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Principal</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={newLoan.principal || ''}
                      onChange={(e) => setNewLoan({ ...newLoan, principal: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                      placeholder="5500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={newLoan.interestRate || ''}
                      onChange={(e) => setNewLoan({ ...newLoan, interestRate: parseFloat(e.target.value) || 0 })}
                      className="w-full pr-8 pl-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                      placeholder="5.5"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddLoan(false)}
                className="flex-1 py-2 border border-dark-border rounded-lg text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addLoan}
                className="flex-1 py-2 bg-teal-500 text-white rounded-lg"
              >
                Add Loan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Income & Settings */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Expected Annual Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={income}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setIncome(value ? parseInt(value).toLocaleString() : '');
                }}
                className="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                placeholder="55,000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Family Size</label>
            <select
              value={familySize}
              onChange={(e) => setFamilySize(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Extra Monthly Payment</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={extraPayment}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setExtraPayment(value || '0');
                }}
                className="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {totalDebt > 0 && (
        <button
          onClick={() => setActiveTab('compare')}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600"
        >
          Compare Repayment Plans
        </button>
      )}
    </div>
  );

  // Render compare tab
  const renderCompare = () => (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => setActiveTab('input')}
        className="text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Edit Loans
      </button>

      {/* Plan comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repaymentPlans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-dark-card border rounded-xl overflow-hidden ${
              plan.id === 'accelerated' ? 'border-emerald-500' :
              plan.id === 'standard' ? 'border-teal-500/50' :
              'border-dark-border'
            }`}
          >
            {plan.id === 'accelerated' && (
              <div className="bg-emerald-500 text-white text-center text-xs py-1 font-medium">
                Recommended
              </div>
            )}

            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Payment</span>
                  <span className="text-xl font-bold text-teal-400">{formatCurrency(plan.monthlyPayment)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payoff Time</span>
                  <span className="font-semibold text-white">{formatMonths(plan.payoffTime)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="font-semibold text-white">{formatCurrency(plan.totalPaid)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Interest</span>
                  <span className="font-semibold text-orange-400">{formatCurrency(plan.totalInterest)}</span>
                </div>

                {plan.forgivenAmount > 0 && (
                  <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400">Forgiven</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(plan.forgivenAmount)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-emerald-400 mb-1">Pros</div>
                    <ul className="space-y-1">
                      {plan.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-gray-400">+ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-red-400 mb-1">Cons</div>
                    <ul className="space-y-1">
                      {plan.cons.map((con, i) => (
                        <li key={i} className="text-xs text-gray-400">- {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Side-by-side comparison table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-border">
          <h3 className="font-bold text-white">Side-by-Side Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg">
                <th className="text-left p-4 text-gray-300 font-medium">Plan</th>
                <th className="text-right p-4 text-gray-300 font-medium">Monthly</th>
                <th className="text-right p-4 text-gray-300 font-medium">Time</th>
                <th className="text-right p-4 text-gray-300 font-medium">Total Paid</th>
                <th className="text-right p-4 text-gray-300 font-medium">Interest</th>
              </tr>
            </thead>
            <tbody>
              {repaymentPlans.map(plan => (
                <tr key={plan.id} className="border-b border-dark-border/50">
                  <td className="p-4 text-white font-medium">{plan.name}</td>
                  <td className="p-4 text-right text-teal-400">{formatCurrency(plan.monthlyPayment)}</td>
                  <td className="p-4 text-right text-white">{formatMonths(plan.payoffTime)}</td>
                  <td className="p-4 text-right text-white">{formatCurrency(plan.totalPaid)}</td>
                  <td className="p-4 text-right text-orange-400">{formatCurrency(plan.totalInterest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interest comparison visualization */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Interest Cost Comparison</h3>
        <div className="space-y-3">
          {repaymentPlans.map(plan => {
            const minInterest = Math.min(...repaymentPlans.map(p => p.totalInterest));
            const maxInterest = Math.max(...repaymentPlans.map(p => p.totalInterest));
            const percentage = maxInterest > minInterest
              ? ((plan.totalInterest - minInterest) / (maxInterest - minInterest)) * 100
              : 0;

            return (
              <div key={plan.id} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-300 truncate">{plan.name}</div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-bg rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(10, 100 - percentage)}%` }}
                      className={`h-full rounded-full ${
                        plan.id === 'accelerated' ? 'bg-emerald-500' :
                        plan.id === 'standard' ? 'bg-teal-500' :
                        'bg-orange-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-orange-400">{formatCurrency(plan.totalInterest)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render strategies tab
  const renderStrategies = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Payoff Strategies</h2>
        <p className="text-gray-400">Smart approaches to becoming debt-free faster</p>
      </div>

      {/* Strategy cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-bold text-white mb-2">Avalanche Method</h3>
          <p className="text-gray-400 text-sm mb-4">
            Pay minimums on all loans, then throw extra money at the highest interest rate loan first.
            Mathematically optimal - saves the most money.
          </p>
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="text-xs text-emerald-400 mb-1">Best For</div>
            <div className="text-sm text-gray-300">Maximizing savings, high-rate loans</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-lg font-bold text-white mb-2">Snowball Method</h3>
          <p className="text-gray-400 text-sm mb-4">
            Pay minimums on all loans, then target the smallest balance first.
            Builds momentum with quick wins.
          </p>
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="text-xs text-blue-400 mb-1">Best For</div>
            <div className="text-sm text-gray-300">Motivation, multiple small loans</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🔄</div>
          <h3 className="text-lg font-bold text-white mb-2">Refinancing</h3>
          <p className="text-gray-400 text-sm mb-4">
            Combine loans into one with a lower rate. Can significantly reduce interest.
            Warning: Federal refinancing loses forgiveness options.
          </p>
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="text-xs text-purple-400 mb-1">Best For</div>
            <div className="text-sm text-gray-300">High earners not seeking forgiveness</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
          <div className="text-3xl mb-4">🏛️</div>
          <h3 className="text-lg font-bold text-white mb-2">Public Service Loan Forgiveness</h3>
          <p className="text-gray-400 text-sm mb-4">
            Work for government or nonprofit for 10 years while on IDR plan = remaining balance forgiven tax-free.
          </p>
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="text-xs text-orange-400 mb-1">Best For</div>
            <div className="text-sm text-gray-300">Teachers, nurses, government employees</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Money-Saving Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              tip: 'Set up autopay',
              detail: 'Most servicers offer 0.25% rate reduction for automatic payments',
              savings: 'Saves $100s over loan life',
            },
            {
              tip: 'Make biweekly payments',
              detail: 'Pay half your monthly amount every 2 weeks (26 payments = 13 months)',
              savings: 'Knocks months off repayment',
            },
            {
              tip: 'Apply windfalls to principal',
              detail: 'Tax refunds, bonuses, gifts - direct to loan principal',
              savings: 'Each $1000 saves $100s in interest',
            },
            {
              tip: 'Pay during grace period',
              detail: 'Interest accrues immediately on unsubsidized loans',
              savings: 'Prevents interest capitalization',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-dark-bg rounded-lg p-4">
              <div className="font-semibold text-white mb-1">{item.tip}</div>
              <div className="text-sm text-gray-400 mb-2">{item.detail}</div>
              <div className="text-xs text-emerald-400">{item.savings}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning about scams */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-white mb-2">Beware of Loan Scams</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Never pay upfront fees for loan help - legitimate programs are free</li>
              <li>• Only use StudentAid.gov for federal loan management</li>
              <li>• Never share your FSA ID password with anyone</li>
              <li>• Be wary of "instant forgiveness" promises - it doesn't exist</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm mb-6"
          >
            <span>💳</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Loan Payoff Modeler
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Compare repayment strategies. Find your fastest path to debt freedom.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-card border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'input'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">📝</span>
              Your Loans
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">📊</span>
              Compare Plans
            </button>
            <button
              onClick={() => setActiveTab('strategies')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'strategies'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">🎯</span>
              Strategies
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'input' && renderInput()}
        {activeTab === 'compare' && renderCompare()}
        {activeTab === 'strategies' && renderStrategies()}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-dark-card border border-dark-border rounded-lg max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-medium text-white mb-1">Calculator Disclaimer</h4>
              <p className="text-sm text-gray-400">
                These calculations are estimates for educational purposes only. Actual payments
                and totals may vary based on your specific loan terms, servicer policies, and
                program requirements. Always verify details with your loan servicer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPayoffModelerPage;
