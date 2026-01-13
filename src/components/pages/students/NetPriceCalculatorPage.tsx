// ===========================================
// Net Price Calculator Page
// True Cost Calculator for College Planning
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface FinancialProfile {
  householdIncome: string;
  householdSize: number;
  studentsInCollege: number;
  assets: string;
  homeEquity: string;
  businessFarm: boolean;
  singleParent: boolean;
  state: string;
}

interface QuickEstimateInputs {
  income: string;
  state: string;
  collegeType: 'public_in' | 'public_out' | 'private' | 'elite';
}

interface SchoolCostBreakdown {
  id: string;
  name: string;
  type: 'public' | 'private' | 'elite';
  stickerPrice: {
    tuition: number;
    roomBoard: number;
    fees: number;
    books: number;
    personal: number;
    transportation: number;
  };
  estimatedAid: {
    pellGrant: number;
    stateGrant: number;
    institutionalGrant: number;
    meritScholarship: number;
    workStudy: number;
  };
  netPrice: number;
  fourYearTotal: number;
  affordabilityScore: number; // 1-100
  dataSource: 'official' | 'crowdsourced' | 'estimated';
}

// Sample school data
const sampleSchools: SchoolCostBreakdown[] = [
  {
    id: '1',
    name: 'State University',
    type: 'public',
    stickerPrice: {
      tuition: 12500,
      roomBoard: 14000,
      fees: 1800,
      books: 1200,
      personal: 2500,
      transportation: 1500,
    },
    estimatedAid: {
      pellGrant: 7395,
      stateGrant: 3500,
      institutionalGrant: 2000,
      meritScholarship: 0,
      workStudy: 2500,
    },
    netPrice: 18100,
    fourYearTotal: 72400,
    affordabilityScore: 82,
    dataSource: 'official',
  },
  {
    id: '2',
    name: 'Regional State College',
    type: 'public',
    stickerPrice: {
      tuition: 9800,
      roomBoard: 11500,
      fees: 1200,
      books: 1000,
      personal: 2000,
      transportation: 1200,
    },
    estimatedAid: {
      pellGrant: 7395,
      stateGrant: 3500,
      institutionalGrant: 1500,
      meritScholarship: 2000,
      workStudy: 2000,
    },
    netPrice: 10300,
    fourYearTotal: 41200,
    affordabilityScore: 94,
    dataSource: 'official',
  },
  {
    id: '3',
    name: 'Private Research University',
    type: 'private',
    stickerPrice: {
      tuition: 58000,
      roomBoard: 18500,
      fees: 2200,
      books: 1200,
      personal: 3000,
      transportation: 2000,
    },
    estimatedAid: {
      pellGrant: 7395,
      stateGrant: 0,
      institutionalGrant: 48000,
      meritScholarship: 5000,
      workStudy: 3000,
    },
    netPrice: 21505,
    fourYearTotal: 86020,
    affordabilityScore: 68,
    dataSource: 'crowdsourced',
  },
  {
    id: '4',
    name: 'Elite University',
    type: 'elite',
    stickerPrice: {
      tuition: 62000,
      roomBoard: 20000,
      fees: 2500,
      books: 1400,
      personal: 3500,
      transportation: 2500,
    },
    estimatedAid: {
      pellGrant: 7395,
      stateGrant: 0,
      institutionalGrant: 58000,
      meritScholarship: 0,
      workStudy: 3500,
    },
    netPrice: 23005,
    fourYearTotal: 92020,
    affordabilityScore: 72,
    dataSource: 'official',
  },
];

// Income brackets for Pell Grant estimation
const pellGrantTable: Record<string, number> = {
  '0-30000': 7395,
  '30001-40000': 6200,
  '40001-50000': 4800,
  '50001-60000': 3200,
  '60001-70000': 1500,
  '70001+': 0,
};

// State grant averages
const stateGrantAverages: Record<string, number> = {
  CA: 4500,
  NY: 5000,
  TX: 2500,
  FL: 3000,
  PA: 4000,
  IL: 3500,
  OH: 2800,
  GA: 4200,
  NC: 2600,
  MI: 2400,
  DEFAULT: 2500,
};

const NetPriceCalculatorPage: React.FC = () => {
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  // Quick estimate state
  const [quickInputs, setQuickInputs] = useState<QuickEstimateInputs>({
    income: '',
    state: '',
    collegeType: 'public_in',
  });

  // Detailed profile state
  const [profile, setProfile] = useState<FinancialProfile>({
    householdIncome: '',
    householdSize: 4,
    studentsInCollege: 1,
    assets: '',
    homeEquity: '',
    businessFarm: false,
    singleParent: false,
    state: '',
  });

  // Results state
  const [results, setResults] = useState<SchoolCostBreakdown[]>([]);

  const calculateQuickEstimate = () => {
    const income = parseInt(quickInputs.income.replace(/,/g, '')) || 0;

    // Determine Pell Grant
    let pellGrant = 0;
    if (income <= 30000) pellGrant = pellGrantTable['0-30000'];
    else if (income <= 40000) pellGrant = pellGrantTable['30001-40000'];
    else if (income <= 50000) pellGrant = pellGrantTable['40001-50000'];
    else if (income <= 60000) pellGrant = pellGrantTable['50001-60000'];
    else if (income <= 70000) pellGrant = pellGrantTable['60001-70000'];
    else pellGrant = 0;

    // Get state grant
    const stateGrant = stateGrantAverages[quickInputs.state] || stateGrantAverages.DEFAULT;

    // Adjust sample schools based on inputs
    const adjustedSchools = sampleSchools.map(school => {
      const adjustedAid = {
        ...school.estimatedAid,
        pellGrant,
        stateGrant: school.type === 'public' ? stateGrant : 0,
      };

      // Adjust institutional grant based on income
      if (income > 100000) {
        adjustedAid.institutionalGrant = Math.round(adjustedAid.institutionalGrant * 0.4);
      } else if (income > 80000) {
        adjustedAid.institutionalGrant = Math.round(adjustedAid.institutionalGrant * 0.6);
      } else if (income > 60000) {
        adjustedAid.institutionalGrant = Math.round(adjustedAid.institutionalGrant * 0.8);
      }

      const totalAid = Object.values(adjustedAid).reduce((a, b) => a + b, 0);
      const totalCost = Object.values(school.stickerPrice).reduce((a, b) => a + b, 0);
      const netPrice = Math.max(0, totalCost - totalAid);
      const fourYearTotal = netPrice * 4;

      // Calculate affordability score (higher is better)
      let affordabilityScore = 100;
      const incomeRatio = netPrice / Math.max(income, 1);
      if (incomeRatio > 0.5) affordabilityScore = 30;
      else if (incomeRatio > 0.35) affordabilityScore = 50;
      else if (incomeRatio > 0.25) affordabilityScore = 70;
      else if (incomeRatio > 0.15) affordabilityScore = 85;

      return {
        ...school,
        estimatedAid: adjustedAid,
        netPrice,
        fourYearTotal,
        affordabilityScore,
      };
    });

    setResults(adjustedSchools);
    setShowResults(true);
  };

  const calculateDetailedEstimate = () => {
    // More sophisticated calculation for detailed mode
    const income = parseInt(profile.householdIncome.replace(/,/g, '')) || 0;
    const assets = parseInt(profile.assets.replace(/,/g, '')) || 0;

    // Calculate Expected Family Contribution (EFC) approximation
    let efc = 0;

    // Income component (simplified FAFSA formula)
    if (income > 50000) {
      efc += (income - 50000) * 0.22;
    }
    if (income > 100000) {
      efc += (income - 100000) * 0.25;
    }

    // Asset component
    if (assets > 10000) {
      efc += (assets - 10000) * 0.05;
    }

    // Adjustments
    if (profile.studentsInCollege > 1) {
      efc = efc / profile.studentsInCollege;
    }
    if (profile.singleParent) {
      efc = efc * 0.85;
    }

    // Determine Pell Grant
    let pellGrant = 0;
    if (efc < 6000) pellGrant = 7395;
    else if (efc < 10000) pellGrant = 5000;
    else if (efc < 15000) pellGrant = 2500;

    // Get state grant
    const stateGrant = stateGrantAverages[profile.state] || stateGrantAverages.DEFAULT;

    // Adjust schools based on detailed profile
    const adjustedSchools = sampleSchools.map(school => {
      const totalCost = Object.values(school.stickerPrice).reduce((a, b) => a + b, 0);

      // Calculate institutional aid based on need
      const needGap = totalCost - efc;
      let institutionalGrant = 0;

      if (school.type === 'elite') {
        // Elite schools meet 100% of need
        institutionalGrant = Math.max(0, needGap - pellGrant - stateGrant);
      } else if (school.type === 'private') {
        // Private schools meet ~80% of need
        institutionalGrant = Math.max(0, (needGap * 0.8) - pellGrant - stateGrant);
      } else {
        // Public schools meet ~50% of need
        institutionalGrant = Math.max(0, (needGap * 0.5) - pellGrant - stateGrant);
      }

      const adjustedAid = {
        pellGrant,
        stateGrant: school.type === 'public' ? stateGrant : 0,
        institutionalGrant: Math.round(institutionalGrant),
        meritScholarship: school.estimatedAid.meritScholarship,
        workStudy: school.estimatedAid.workStudy,
      };

      const totalAid = Object.values(adjustedAid).reduce((a, b) => a + b, 0);
      const netPrice = Math.max(0, totalCost - totalAid);
      const fourYearTotal = netPrice * 4;

      // Calculate affordability score
      let affordabilityScore = 100;
      const incomeRatio = netPrice / Math.max(income, 1);
      if (incomeRatio > 0.5) affordabilityScore = 30;
      else if (incomeRatio > 0.35) affordabilityScore = 50;
      else if (incomeRatio > 0.25) affordabilityScore = 70;
      else if (incomeRatio > 0.15) affordabilityScore = 85;

      return {
        ...school,
        estimatedAid: adjustedAid,
        netPrice,
        fourYearTotal,
        affordabilityScore,
      };
    });

    setResults(adjustedSchools);
    setShowResults(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAffordabilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAffordabilityBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const toggleSchoolSelection = (id: string) => {
    setSelectedSchools(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id].slice(0, 3)
    );
  };

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];

  // Render quick estimate form
  const renderQuickEstimate = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quick Estimate</h2>
          <p className="text-gray-400">Get a ballpark figure in 30 seconds</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Household Income (before taxes)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={quickInputs.income}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value ? parseInt(value).toLocaleString() : '';
                  setQuickInputs({ ...quickInputs, income: formatted });
                }}
                className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="60,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State of Residence
            </label>
            <select
              value={quickInputs.state}
              onChange={(e) => setQuickInputs({ ...quickInputs, state: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Select state</option>
              {usStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              College Type Interest
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'public_in', label: 'Public (In-State)', icon: '🏛️' },
                { value: 'public_out', label: 'Public (Out-of-State)', icon: '🚗' },
                { value: 'private', label: 'Private', icon: '🏫' },
                { value: 'elite', label: 'Elite/Ivy', icon: '🎓' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setQuickInputs({ ...quickInputs, collegeType: option.value as any })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    quickInputs.collegeType === option.value
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-dark-border hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm text-white">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateQuickEstimate}
            disabled={!quickInputs.income || !quickInputs.state}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Calculate Estimate
          </button>
        </div>
      </div>
    </div>
  );

  // Render detailed form steps
  const renderDetailedForm = () => {
    const steps = [
      { num: 1, title: 'Income', icon: '💵' },
      { num: 2, title: 'Family', icon: '👨‍👩‍👧‍👦' },
      { num: 3, title: 'Assets', icon: '🏠' },
      { num: 4, title: 'Review', icon: '✅' },
    ];

    return (
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  step === s.num
                    ? 'bg-teal-500/20 text-teal-400'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${step > s.num ? 'bg-emerald-500' : 'bg-dark-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Income Information</h2>
                  <p className="text-gray-400 text-sm mt-1">This helps estimate your Expected Family Contribution</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Household Income (before taxes)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={profile.householdIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value ? parseInt(value).toLocaleString() : '';
                        setProfile({ ...profile, householdIncome: formatted });
                      }}
                      className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="75,000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Include wages, investments, business income</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State of Residence
                  </label>
                  <select
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Select state</option>
                    {usStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="singleParent"
                    checked={profile.singleParent}
                    onChange={(e) => setProfile({ ...profile, singleParent: e.target.checked })}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg text-teal-500 focus:ring-teal-500"
                  />
                  <label htmlFor="singleParent" className="text-gray-300">
                    Single parent household
                  </label>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Family Information</h2>
                  <p className="text-gray-400 text-sm mt-1">Family size affects your expected contribution</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Household Size (including student)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setProfile({ ...profile, householdSize: Math.max(2, profile.householdSize - 1) })}
                      className="w-12 h-12 rounded-lg border border-dark-border flex items-center justify-center text-xl hover:border-teal-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold text-white w-12 text-center">{profile.householdSize}</span>
                    <button
                      onClick={() => setProfile({ ...profile, householdSize: Math.min(10, profile.householdSize + 1) })}
                      className="w-12 h-12 rounded-lg border border-dark-border flex items-center justify-center text-xl hover:border-teal-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Students in College (next year)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setProfile({ ...profile, studentsInCollege: Math.max(1, profile.studentsInCollege - 1) })}
                      className="w-12 h-12 rounded-lg border border-dark-border flex items-center justify-center text-xl hover:border-teal-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold text-white w-12 text-center">{profile.studentsInCollege}</span>
                    <button
                      onClick={() => setProfile({ ...profile, studentsInCollege: Math.min(5, profile.studentsInCollege + 1) })}
                      className="w-12 h-12 rounded-lg border border-dark-border flex items-center justify-center text-xl hover:border-teal-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Having multiple students in college at the same time can significantly reduce your EFC per student
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Assets Information</h2>
                  <p className="text-gray-400 text-sm mt-1">Optional - for more accurate estimates</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Savings & Investments (not including retirement)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={profile.assets}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value ? parseInt(value).toLocaleString() : '';
                        setProfile({ ...profile, assets: formatted });
                      }}
                      className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="25,000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">401k, IRA, and retirement accounts are not counted</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Home Equity (for CSS Profile schools only)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={profile.homeEquity}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value ? parseInt(value).toLocaleString() : '';
                        setProfile({ ...profile, homeEquity: formatted });
                      }}
                      className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="100,000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Only some private colleges consider home equity</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="businessFarm"
                    checked={profile.businessFarm}
                    onChange={(e) => setProfile({ ...profile, businessFarm: e.target.checked })}
                    className="w-5 h-5 rounded border-dark-border bg-dark-bg text-teal-500 focus:ring-teal-500"
                  />
                  <label htmlFor="businessFarm" className="text-gray-300">
                    Family owns a small business or farm
                  </label>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">Review Your Information</h2>
                  <p className="text-gray-400 text-sm mt-1">Make sure everything looks correct</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">Household Income</div>
                    <div className="text-xl font-bold text-white">${profile.householdIncome || '0'}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">State</div>
                    <div className="text-xl font-bold text-white">{profile.state || 'Not selected'}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">Household Size</div>
                    <div className="text-xl font-bold text-white">{profile.householdSize}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">Students in College</div>
                    <div className="text-xl font-bold text-white">{profile.studentsInCollege}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">Assets</div>
                    <div className="text-xl font-bold text-white">${profile.assets || '0'}</div>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-4">
                    <div className="text-sm text-gray-400">Home Equity</div>
                    <div className="text-xl font-bold text-white">${profile.homeEquity || '0'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-bg rounded-lg p-4">
                  <span className="text-teal-400">ℹ️</span>
                  <span>Single parent: {profile.singleParent ? 'Yes' : 'No'} | Business/Farm: {profile.businessFarm ? 'Yes' : 'No'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 transition-colors ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(Math.min(4, step + 1))}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={calculateDetailedEstimate}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                Calculate Net Price
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => (
    <div className="max-w-6xl mx-auto">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Your Estimated Net Prices</h2>
            <p className="text-gray-400 text-sm">Based on your financial profile. Select up to 3 schools to compare.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              disabled={selectedSchools.length < 2}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                compareMode
                  ? 'bg-teal-500 text-white'
                  : 'border border-dark-border text-gray-300 hover:border-teal-500'
              } ${selectedSchools.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Compare Selected ({selectedSchools.length}/3)
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setStep(1);
              }}
              className="px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Comparison View */}
      {compareMode && selectedSchools.length >= 2 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results
              .filter(s => selectedSchools.includes(s.id))
              .map((school, idx) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-dark-card border border-teal-500/30 rounded-xl p-6"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white">{school.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      school.dataSource === 'official' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {school.dataSource === 'official' ? 'Official Data' : 'Crowdsourced'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sticker Price</span>
                      <span className="text-gray-300">{formatCurrency(Object.values(school.stickerPrice).reduce((a, b) => a + b, 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Aid</span>
                      <span className="text-emerald-400">-{formatCurrency(Object.values(school.estimatedAid).reduce((a, b) => a + b, 0))}</span>
                    </div>
                    <div className="border-t border-dark-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-white">Net Price/Year</span>
                        <span className="text-xl font-bold text-teal-400">{formatCurrency(school.netPrice)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">4-Year Total</span>
                      <span className="text-white font-semibold">{formatCurrency(school.fourYearTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Affordability</span>
                      <span className={getAffordabilityColor(school.affordabilityScore)}>{school.affordabilityScore}/100</span>
                    </div>
                    <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getAffordabilityBg(school.affordabilityScore)} rounded-full transition-all`}
                        style={{ width: `${school.affordabilityScore}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((school, idx) => (
          <motion.div
            key={school.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-dark-card border rounded-xl overflow-hidden transition-all ${
              selectedSchools.includes(school.id)
                ? 'border-teal-500'
                : 'border-dark-border hover:border-gray-600'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{school.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-dark-bg text-gray-400 capitalize">
                      {school.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      school.dataSource === 'official' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {school.dataSource === 'official' ? 'Official' : 'Crowdsourced'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSchoolSelection(school.id)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    selectedSchools.includes(school.id)
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : 'border-dark-border text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {selectedSchools.includes(school.id) ? '✓' : '+'}
                </button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Sticker Price</div>
                  <div className="text-lg font-semibold text-gray-300">
                    {formatCurrency(Object.values(school.stickerPrice).reduce((a, b) => a + b, 0))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Estimated Aid</div>
                  <div className="text-lg font-semibold text-emerald-400">
                    -{formatCurrency(Object.values(school.estimatedAid).reduce((a, b) => a + b, 0))}
                  </div>
                </div>
              </div>

              {/* Aid breakdown */}
              <div className="bg-dark-bg rounded-lg p-4 mb-4">
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Aid Breakdown</div>
                <div className="space-y-2 text-sm">
                  {school.estimatedAid.pellGrant > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pell Grant</span>
                      <span className="text-emerald-400">{formatCurrency(school.estimatedAid.pellGrant)}</span>
                    </div>
                  )}
                  {school.estimatedAid.stateGrant > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">State Grant</span>
                      <span className="text-emerald-400">{formatCurrency(school.estimatedAid.stateGrant)}</span>
                    </div>
                  )}
                  {school.estimatedAid.institutionalGrant > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Institutional Grant</span>
                      <span className="text-emerald-400">{formatCurrency(school.estimatedAid.institutionalGrant)}</span>
                    </div>
                  )}
                  {school.estimatedAid.meritScholarship > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Merit Scholarship</span>
                      <span className="text-emerald-400">{formatCurrency(school.estimatedAid.meritScholarship)}</span>
                    </div>
                  )}
                  {school.estimatedAid.workStudy > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Work-Study</span>
                      <span className="text-yellow-400">{formatCurrency(school.estimatedAid.workStudy)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Net Price */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-lg mb-4">
                <div>
                  <div className="text-sm text-gray-400">Your Net Price</div>
                  <div className="text-2xl font-bold text-teal-400">{formatCurrency(school.netPrice)}/yr</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">4-Year Total</div>
                  <div className="text-lg font-semibold text-white">{formatCurrency(school.fourYearTotal)}</div>
                </div>
              </div>

              {/* Affordability Score */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Affordability Score</span>
                  <span className={`font-semibold ${getAffordabilityColor(school.affordabilityScore)}`}>
                    {school.affordabilityScore >= 80 ? 'Excellent' : school.affordabilityScore >= 60 ? 'Good' : school.affordabilityScore >= 40 ? 'Moderate' : 'Stretch'}
                  </span>
                </div>
                <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getAffordabilityBg(school.affordabilityScore)} rounded-full transition-all`}
                    style={{ width: `${school.affordabilityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-dark-card border border-dark-border rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <div>
            <h4 className="font-medium text-white mb-1">Important Disclaimer</h4>
            <p className="text-sm text-gray-400">
              These are estimates only. Actual aid packages vary and depend on many factors including
              application timing, demonstrated interest, and each school's specific methodology.
              Always use official Net Price Calculators on school websites for the most accurate estimates.
              Your actual financial aid offer may differ significantly from these projections.
            </p>
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
            <span>💰</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            True Net Price Calculator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Cut through the sticker shock. See what you'll really pay at different schools.
          </motion.p>
        </div>

        {!showResults ? (
          <>
            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-dark-card border border-dark-border rounded-lg p-1">
                <button
                  onClick={() => { setMode('quick'); setStep(1); }}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'quick'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="mr-2">⚡</span>
                  Quick Estimate
                </button>
                <button
                  onClick={() => { setMode('detailed'); setStep(1); }}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'detailed'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="mr-2">📊</span>
                  Detailed Analysis
                </button>
              </div>
            </div>

            {mode === 'quick' ? renderQuickEstimate() : renderDetailedForm()}
          </>
        ) : (
          renderResults()
        )}

        {/* Info Cards */}
        {!showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Estimates</h3>
              <p className="text-gray-400 text-sm">
                Get net price estimates based on your specific financial situation, not just averages.
              </p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Compare Schools</h3>
              <p className="text-gray-400 text-sm">
                See side-by-side comparisons of net costs across different school types and aid packages.
              </p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Understand Aid Types</h3>
              <p className="text-gray-400 text-sm">
                Learn the difference between grants, scholarships, work-study, and loans in your package.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetPriceCalculatorPage;
