// ===========================================
// Career ROI Calculator Page
// 15-Year STEM Career Projections
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Types
interface CareerPath {
  id: string;
  title: string;
  field: string;
  icon: string;
  startingSalary: number;
  medianSalary: number;
  seniorSalary: number;
  growthRate: number; // Annual salary growth %
  jobGrowth: number; // Industry job growth %
  demandLevel: 'very high' | 'high' | 'moderate' | 'stable';
  typicalEducation: string;
  timeToSenior: number; // years
}

interface EducationPath {
  id: string;
  name: string;
  years: number;
  avgCost: number;
  opportunityCost: number; // Lost wages during school
}

interface ROIResult {
  year: number;
  age: number;
  salary: number;
  cumEarnings: number;
  cumCost: number;
  netROI: number;
  isBreakEven: boolean;
}

// Career data
const careerPaths: CareerPath[] = [
  {
    id: 'swe',
    title: 'Software Engineer',
    field: 'Technology',
    icon: '💻',
    startingSalary: 95000,
    medianSalary: 130000,
    seniorSalary: 185000,
    growthRate: 5.5,
    jobGrowth: 25,
    demandLevel: 'very high',
    typicalEducation: "Bachelor's in CS/SE",
    timeToSenior: 7,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    field: 'Technology',
    icon: '📊',
    startingSalary: 90000,
    medianSalary: 125000,
    seniorSalary: 175000,
    growthRate: 6,
    jobGrowth: 35,
    demandLevel: 'very high',
    typicalEducation: "Master's in Data Science",
    timeToSenior: 6,
  },
  {
    id: 'chip-engineer',
    title: 'Semiconductor Engineer',
    field: 'Semiconductors',
    icon: '🔬',
    startingSalary: 85000,
    medianSalary: 120000,
    seniorSalary: 165000,
    growthRate: 5,
    jobGrowth: 15,
    demandLevel: 'very high',
    typicalEducation: "Master's in EE",
    timeToSenior: 8,
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    field: 'AI/ML',
    icon: '🤖',
    startingSalary: 105000,
    medianSalary: 145000,
    seniorSalary: 200000,
    growthRate: 6.5,
    jobGrowth: 40,
    demandLevel: 'very high',
    typicalEducation: "Master's in ML/AI",
    timeToSenior: 6,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Engineer',
    field: 'Security',
    icon: '🔐',
    startingSalary: 85000,
    medianSalary: 115000,
    seniorSalary: 160000,
    growthRate: 5.5,
    jobGrowth: 33,
    demandLevel: 'very high',
    typicalEducation: "Bachelor's in CS/Cyber",
    timeToSenior: 7,
  },
  {
    id: 'biotech-engineer',
    title: 'Biotech Engineer',
    field: 'Biotech',
    icon: '🧬',
    startingSalary: 75000,
    medianSalary: 105000,
    seniorSalary: 145000,
    growthRate: 4.5,
    jobGrowth: 10,
    demandLevel: 'high',
    typicalEducation: "Master's in BioE",
    timeToSenior: 8,
  },
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    field: 'Engineering',
    icon: '⚙️',
    startingSalary: 72000,
    medianSalary: 95000,
    seniorSalary: 135000,
    growthRate: 3.5,
    jobGrowth: 7,
    demandLevel: 'stable',
    typicalEducation: "Bachelor's in ME",
    timeToSenior: 9,
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    field: 'Technology',
    icon: '🚀',
    startingSalary: 88000,
    medianSalary: 120000,
    seniorSalary: 165000,
    growthRate: 5.5,
    jobGrowth: 22,
    demandLevel: 'very high',
    typicalEducation: "Bachelor's + Certs",
    timeToSenior: 6,
  },
  {
    id: 'quant',
    title: 'Quantitative Analyst',
    field: 'Finance',
    icon: '📈',
    startingSalary: 120000,
    medianSalary: 175000,
    seniorSalary: 300000,
    growthRate: 7,
    jobGrowth: 8,
    demandLevel: 'high',
    typicalEducation: "Master's/PhD in Math/CS",
    timeToSenior: 7,
  },
  {
    id: 'product-manager',
    title: 'Technical PM',
    field: 'Product',
    icon: '🎯',
    startingSalary: 95000,
    medianSalary: 140000,
    seniorSalary: 200000,
    growthRate: 6,
    jobGrowth: 12,
    demandLevel: 'high',
    typicalEducation: "Bachelor's + MBA",
    timeToSenior: 8,
  },
];

// Education paths
const educationPaths: EducationPath[] = [
  {
    id: 'cc-bachelor',
    name: "Community College → Bachelor's",
    years: 4,
    avgCost: 45000,
    opportunityCost: 0,
  },
  {
    id: 'public-bachelor',
    name: "Public University Bachelor's",
    years: 4,
    avgCost: 100000,
    opportunityCost: 0,
  },
  {
    id: 'private-bachelor',
    name: "Private University Bachelor's",
    years: 4,
    avgCost: 220000,
    opportunityCost: 0,
  },
  {
    id: 'public-master',
    name: "Public University Master's",
    years: 6,
    avgCost: 140000,
    opportunityCost: 60000,
  },
  {
    id: 'private-master',
    name: "Private University Master's",
    years: 6,
    avgCost: 300000,
    opportunityCost: 60000,
  },
  {
    id: 'phd',
    name: 'PhD (Funded)',
    years: 10,
    avgCost: 100000,
    opportunityCost: 200000,
  },
];

const CareerROICalculatorPage: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string>('swe');
  const [selectedEducation, setSelectedEducation] = useState<string>('public-bachelor');
  const [actualCost, setActualCost] = useState<string>('');
  const [startingAge, setStartingAge] = useState<number>(18);
  const [compareCareer, setCompareCareer] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const career = careerPaths.find(c => c.id === selectedCareer)!;
  const education = educationPaths.find(e => e.id === selectedEducation)!;
  const compareCareerData = compareCareer ? careerPaths.find(c => c.id === compareCareer) : null;

  const totalCost = actualCost
    ? parseInt(actualCost.replace(/,/g, ''))
    : education.avgCost + education.opportunityCost;

  // Calculate 15-year projections
  const projections = useMemo((): ROIResult[] => {
    const results: ROIResult[] = [];
    let cumEarnings = 0;
    let salary = career.startingSalary;
    let hasBreakEven = false;

    for (let year = 1; year <= 15; year++) {
      // Salary progression with diminishing returns after hitting senior level
      if (year <= career.timeToSenior) {
        salary = career.startingSalary + (career.seniorSalary - career.startingSalary) * (year / career.timeToSenior);
      } else {
        salary = career.seniorSalary * (1 + (career.growthRate / 100) * (year - career.timeToSenior) * 0.5);
      }

      cumEarnings += salary;
      const netROI = cumEarnings - totalCost;
      const isBreakEven = !hasBreakEven && netROI >= 0;
      if (isBreakEven) hasBreakEven = true;

      results.push({
        year,
        age: startingAge + education.years + year,
        salary: Math.round(salary),
        cumEarnings: Math.round(cumEarnings),
        cumCost: totalCost,
        netROI: Math.round(netROI),
        isBreakEven,
      });
    }

    return results;
  }, [career, totalCost, startingAge, education.years]);

  const breakEvenYear = projections.find(p => p.isBreakEven)?.year || null;
  const year15ROI = projections[14]?.netROI || 0;
  const lifetimeEarnings = projections[14]?.cumEarnings || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'very high': return 'text-emerald-400 bg-emerald-500/20';
      case 'high': return 'text-teal-400 bg-teal-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'stable': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6"
          >
            <span>📈</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            STEM Career ROI Calculator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            15-year earning projections. See the true value of your education investment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Configuration */}
          <div className="space-y-6">
            {/* Career Selection */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Select Career Path</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {careerPaths.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareer(c.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                      selectedCareer === c.id
                        ? 'bg-emerald-500/20 border border-emerald-500'
                        : 'bg-dark-bg border border-transparent hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.field}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDemandColor(c.demandLevel)}`}>
                      {c.demandLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Education Selection */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Education Path</h3>
              <div className="space-y-2">
                {educationPaths.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEducation(e.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedEducation === e.id
                        ? 'bg-teal-500/20 border border-teal-500'
                        : 'bg-dark-bg border border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{e.name}</span>
                      <span className="text-gray-400 text-xs">{e.years} years</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Avg Cost: {formatCurrency(e.avgCost + e.opportunityCost)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Cost */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Your Actual Cost (Optional)</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={actualCost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setActualCost(value ? parseInt(value).toLocaleString() : '');
                  }}
                  className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white"
                  placeholder={totalCost.toLocaleString()}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Include tuition, fees, living expenses, and any opportunity cost
              </p>
            </div>

            {/* Starting Age */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Starting Age</h3>
              <input
                type="range"
                min="16"
                max="30"
                value={startingAge}
                onChange={(e) => setStartingAge(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>16</span>
                <span className="text-teal-400 font-semibold">{startingAge} years old</span>
                <span>30</span>
              </div>
            </div>
          </div>

          {/* Right columns - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Summary */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{career.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{career.title}</h2>
                  <p className="text-gray-400">{career.field} • {career.typicalEducation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">Starting</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(career.startingSalary)}</div>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">Median</div>
                  <div className="text-xl font-bold text-teal-400">{formatCurrency(career.medianSalary)}</div>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">Senior</div>
                  <div className="text-xl font-bold text-emerald-400">{formatCurrency(career.seniorSalary)}</div>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">Job Growth</div>
                  <div className="text-xl font-bold text-purple-400">+{career.jobGrowth}%</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Total Investment</div>
                <div className="text-2xl font-bold text-orange-400">{formatCurrency(totalCost)}</div>
                <div className="text-xs text-gray-500 mt-1">{education.years} years</div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Break-Even</div>
                <div className="text-2xl font-bold text-teal-400">
                  {breakEvenYear ? `Year ${breakEvenYear}` : '>15 years'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {breakEvenYear ? `Age ${startingAge + education.years + breakEvenYear}` : '—'}
                </div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">15-Year Net ROI</div>
                <div className={`text-2xl font-bold ${year15ROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(year15ROI)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((year15ROI / totalCost) * 100).toFixed(0)}% return
                </div>
              </div>
            </div>

            {/* Projection Table */}
            <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-dark-border flex items-center justify-between">
                <h3 className="font-bold text-white">15-Year Earning Projection</h3>
                <div className="text-sm text-gray-400">
                  Career starts at age {startingAge + education.years}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border bg-dark-bg text-xs">
                      <th className="p-3 text-left text-gray-400">Year</th>
                      <th className="p-3 text-left text-gray-400">Age</th>
                      <th className="p-3 text-right text-gray-400">Salary</th>
                      <th className="p-3 text-right text-gray-400">Cumulative</th>
                      <th className="p-3 text-right text-gray-400">Net ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projections.map((p) => (
                      <tr
                        key={p.year}
                        className={`border-b border-dark-border/50 ${
                          p.isBreakEven ? 'bg-emerald-500/10' : ''
                        }`}
                      >
                        <td className="p-3 text-white">
                          {p.year}
                          {p.isBreakEven && (
                            <span className="ml-2 text-xs text-emerald-400">Break-even</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-400">{p.age}</td>
                        <td className="p-3 text-right text-teal-400">{formatCurrency(p.salary)}</td>
                        <td className="p-3 text-right text-white">{formatCurrency(p.cumEarnings)}</td>
                        <td className={`p-3 text-right font-medium ${
                          p.netROI >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {formatCurrency(p.netROI)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual ROI Chart */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">ROI Trajectory</h3>
              <div className="h-48 flex items-end gap-1">
                {projections.map((p, idx) => {
                  const maxROI = Math.max(...projections.map(pr => Math.abs(pr.netROI)));
                  const height = Math.max(5, Math.abs(p.netROI) / maxROI * 100);
                  const isPositive = p.netROI >= 0;

                  return (
                    <div
                      key={p.year}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div className="text-xs text-gray-500 mb-1 hidden md:block">
                        {p.year % 3 === 0 ? formatCurrency(p.netROI) : ''}
                      </div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.05 }}
                        className={`w-full rounded-t ${
                          isPositive ? 'bg-emerald-500' : 'bg-red-500'
                        } ${p.isBreakEven ? 'ring-2 ring-white' : ''}`}
                      />
                      <div className="text-xs text-gray-500 mt-1">{p.year}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded" />
                  <span className="text-gray-400">Positive ROI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span className="text-gray-400">Negative ROI</span>
                </div>
              </div>
            </div>

            {/* Compare careers */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Compare Careers</h3>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </button>
              </div>

              {showComparison && (
                <div className="space-y-4">
                  <select
                    value={compareCareer || ''}
                    onChange={(e) => setCompareCareer(e.target.value || null)}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white"
                  >
                    <option value="">Select career to compare</option>
                    {careerPaths.filter(c => c.id !== selectedCareer).map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.field})</option>
                    ))}
                  </select>

                  {compareCareerData && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-border">
                            <th className="p-3 text-left text-gray-400">Metric</th>
                            <th className="p-3 text-right text-teal-400">{career.title}</th>
                            <th className="p-3 text-right text-purple-400">{compareCareerData.title}</th>
                            <th className="p-3 text-right text-gray-400">Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-dark-border/50">
                            <td className="p-3 text-gray-300">Starting Salary</td>
                            <td className="p-3 text-right text-white">{formatCurrency(career.startingSalary)}</td>
                            <td className="p-3 text-right text-white">{formatCurrency(compareCareerData.startingSalary)}</td>
                            <td className={`p-3 text-right ${career.startingSalary > compareCareerData.startingSalary ? 'text-emerald-400' : 'text-red-400'}`}>
                              {formatCurrency(career.startingSalary - compareCareerData.startingSalary)}
                            </td>
                          </tr>
                          <tr className="border-b border-dark-border/50">
                            <td className="p-3 text-gray-300">Senior Salary</td>
                            <td className="p-3 text-right text-white">{formatCurrency(career.seniorSalary)}</td>
                            <td className="p-3 text-right text-white">{formatCurrency(compareCareerData.seniorSalary)}</td>
                            <td className={`p-3 text-right ${career.seniorSalary > compareCareerData.seniorSalary ? 'text-emerald-400' : 'text-red-400'}`}>
                              {formatCurrency(career.seniorSalary - compareCareerData.seniorSalary)}
                            </td>
                          </tr>
                          <tr className="border-b border-dark-border/50">
                            <td className="p-3 text-gray-300">Job Growth</td>
                            <td className="p-3 text-right text-white">+{career.jobGrowth}%</td>
                            <td className="p-3 text-right text-white">+{compareCareerData.jobGrowth}%</td>
                            <td className={`p-3 text-right ${career.jobGrowth > compareCareerData.jobGrowth ? 'text-emerald-400' : 'text-red-400'}`}>
                              {career.jobGrowth - compareCareerData.jobGrowth}%
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-300">Time to Senior</td>
                            <td className="p-3 text-right text-white">{career.timeToSenior} years</td>
                            <td className="p-3 text-right text-white">{compareCareerData.timeToSenior} years</td>
                            <td className={`p-3 text-right ${career.timeToSenior < compareCareerData.timeToSenior ? 'text-emerald-400' : 'text-red-400'}`}>
                              {career.timeToSenior - compareCareerData.timeToSenior} years
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400">✓</span>
                  <p className="text-gray-300 text-sm">
                    Your 15-year cumulative earnings of <strong className="text-white">{formatCurrency(lifetimeEarnings)}</strong> represent
                    a <strong className="text-emerald-400">{((year15ROI / totalCost) * 100).toFixed(0)}%</strong> return on your education investment.
                  </p>
                </div>
                {breakEvenYear && (
                  <div className="flex items-start gap-3">
                    <span className="text-teal-400">✓</span>
                    <p className="text-gray-300 text-sm">
                      You'll recoup your education costs in <strong className="text-white">year {breakEvenYear}</strong> of your career,
                      at age <strong className="text-white">{startingAge + education.years + breakEvenYear}</strong>.
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">✓</span>
                  <p className="text-gray-300 text-sm">
                    With <strong className="text-white">+{career.jobGrowth}%</strong> projected job growth, {career.title}s are in
                    <strong className="text-white"> {career.demandLevel}</strong> demand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-dark-card border border-dark-border rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-medium text-white mb-1">Projection Disclaimer</h4>
              <p className="text-sm text-gray-400">
                These projections are estimates based on current salary data and historical trends.
                Actual salaries vary significantly by location, company, experience, and market conditions.
                Education costs and career trajectories are highly individual. Use this as a planning tool,
                not a guarantee of future earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerROICalculatorPage;
