// ===========================================
// Award Letter Analyzer Page
// Compare and Decode Financial Aid Offers
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface AidItem {
  name: string;
  amount: number;
  type: 'grant' | 'scholarship' | 'loan' | 'work-study';
  renewable: boolean;
  conditions?: string;
}

interface AwardLetter {
  id: string;
  schoolName: string;
  costOfAttendance: {
    tuition: number;
    roomBoard: number;
    fees: number;
    books: number;
    personal: number;
    transportation: number;
  };
  aidItems: AidItem[];
  deadline: string;
  acceptanceDeadline: string;
}

interface AnalyzedLetter extends AwardLetter {
  totalCOA: number;
  totalFreeAid: number;
  totalLoans: number;
  totalWorkStudy: number;
  netCost: number;
  outOfPocket: number;
  fourYearProjection: number;
  loanBurden: number;
  affordabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  warnings: string[];
  tips: string[];
}

// Sample decoded letter
const sampleDecodedLetter: AnalyzedLetter = {
  id: '1',
  schoolName: 'State University',
  costOfAttendance: {
    tuition: 12500,
    roomBoard: 14000,
    fees: 1800,
    books: 1200,
    personal: 2500,
    transportation: 1500,
  },
  aidItems: [
    { name: 'Federal Pell Grant', amount: 7395, type: 'grant', renewable: true },
    { name: 'State Need-Based Grant', amount: 3500, type: 'grant', renewable: true, conditions: 'Must maintain 2.5 GPA' },
    { name: 'Institutional Merit Award', amount: 5000, type: 'scholarship', renewable: true, conditions: 'Must maintain 3.0 GPA' },
    { name: 'Federal Direct Subsidized Loan', amount: 3500, type: 'loan', renewable: true },
    { name: 'Federal Direct Unsubsidized Loan', amount: 2000, type: 'loan', renewable: true },
    { name: 'Federal Work-Study', amount: 2500, type: 'work-study', renewable: true },
  ],
  deadline: '2025-05-01',
  acceptanceDeadline: '2025-05-01',
  totalCOA: 33500,
  totalFreeAid: 15895,
  totalLoans: 5500,
  totalWorkStudy: 2500,
  netCost: 17605,
  outOfPocket: 9605,
  fourYearProjection: 70420,
  loanBurden: 22000,
  affordabilityGrade: 'B',
  warnings: [
    'Merit scholarship requires maintaining 3.0 GPA - monitor grades closely',
    'Work-study earnings are not guaranteed and require finding a job',
  ],
  tips: [
    'Consider appealing for additional institutional aid',
    'Look into departmental scholarships after enrollment',
    'The subsidized loan is the better loan option - interest is covered while enrolled',
  ],
};

const AwardLetterAnalyzerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'compare'>('input');
  const [letters, setLetters] = useState<AnalyzedLetter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<Partial<AwardLetter>>({
    schoolName: '',
    costOfAttendance: {
      tuition: 0,
      roomBoard: 0,
      fees: 0,
      books: 0,
      personal: 0,
      transportation: 0,
    },
    aidItems: [],
    deadline: '',
    acceptanceDeadline: '',
  });
  const [showAddAid, setShowAddAid] = useState(false);
  const [newAidItem, setNewAidItem] = useState<Partial<AidItem>>({
    name: '',
    amount: 0,
    type: 'grant',
    renewable: true,
    conditions: '',
  });
  const [, setShowDemo] = useState(false);

  const aidTypeInfo = {
    grant: {
      label: 'Grant',
      color: 'emerald',
      icon: '🎁',
      description: 'Free money - does not need to be repaid',
    },
    scholarship: {
      label: 'Scholarship',
      color: 'teal',
      icon: '🏆',
      description: 'Free money based on merit or other criteria',
    },
    loan: {
      label: 'Loan',
      color: 'orange',
      icon: '💳',
      description: 'Must be repaid with interest after graduation',
    },
    'work-study': {
      label: 'Work-Study',
      color: 'blue',
      icon: '💼',
      description: 'Money earned through part-time campus job',
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const analyzeLetter = (letter: Partial<AwardLetter>): AnalyzedLetter => {
    const totalCOA = Object.values(letter.costOfAttendance || {}).reduce((a, b) => a + (b || 0), 0);
    const aidItems = letter.aidItems || [];

    const totalFreeAid = aidItems
      .filter(item => item.type === 'grant' || item.type === 'scholarship')
      .reduce((a, b) => a + b.amount, 0);

    const totalLoans = aidItems
      .filter(item => item.type === 'loan')
      .reduce((a, b) => a + b.amount, 0);

    const totalWorkStudy = aidItems
      .filter(item => item.type === 'work-study')
      .reduce((a, b) => a + b.amount, 0);

    const netCost = totalCOA - totalFreeAid - totalLoans - totalWorkStudy;
    const outOfPocket = totalCOA - totalFreeAid - totalLoans;
    const fourYearProjection = (netCost + totalLoans) * 4;
    const loanBurden = totalLoans * 4;

    // Calculate affordability grade
    let affordabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
    const freeAidRatio = totalFreeAid / totalCOA;
    const loanRatio = totalLoans / totalCOA;

    if (freeAidRatio >= 0.7 && loanRatio <= 0.15) affordabilityGrade = 'A';
    else if (freeAidRatio >= 0.5 && loanRatio <= 0.25) affordabilityGrade = 'B';
    else if (freeAidRatio >= 0.3 && loanRatio <= 0.35) affordabilityGrade = 'C';
    else if (freeAidRatio >= 0.2) affordabilityGrade = 'D';
    else affordabilityGrade = 'F';

    // Generate warnings
    const warnings: string[] = [];
    const tips: string[] = [];

    aidItems.forEach(item => {
      if (item.conditions) {
        warnings.push(`${item.name}: ${item.conditions}`);
      }
      if (!item.renewable && (item.type === 'grant' || item.type === 'scholarship')) {
        warnings.push(`${item.name} is ONE-TIME only - budget for reduced aid in future years`);
      }
    });

    if (loanRatio > 0.3) {
      warnings.push('High loan burden - consider alternatives or negotiate for more grants');
    }

    if (totalWorkStudy > 0) {
      warnings.push('Work-study is not guaranteed - you must find and maintain a qualifying job');
    }

    // Generate tips
    if (totalFreeAid < totalCOA * 0.5) {
      tips.push('Consider appealing for more institutional aid with a professional appeal letter');
    }

    if (totalLoans > 5500) {
      tips.push('Maximize subsidized loans first - interest is covered while enrolled');
    }

    if (aidItems.some(item => item.type === 'loan' && item.name.toLowerCase().includes('parent'))) {
      tips.push('Parent PLUS loans are optional - explore alternatives before accepting');
    }

    tips.push('Look for outside scholarships to reduce your out-of-pocket costs');

    return {
      ...letter as AwardLetter,
      id: Date.now().toString(),
      totalCOA,
      totalFreeAid,
      totalLoans,
      totalWorkStudy,
      netCost,
      outOfPocket,
      fourYearProjection,
      loanBurden,
      affordabilityGrade,
      warnings,
      tips,
    };
  };

  const addAidItem = () => {
    if (!newAidItem.name || !newAidItem.amount) return;

    setCurrentLetter(prev => ({
      ...prev,
      aidItems: [...(prev.aidItems || []), newAidItem as AidItem],
    }));

    setNewAidItem({
      name: '',
      amount: 0,
      type: 'grant',
      renewable: true,
      conditions: '',
    });
    setShowAddAid(false);
  };

  const removeAidItem = (index: number) => {
    setCurrentLetter(prev => ({
      ...prev,
      aidItems: prev.aidItems?.filter((_, i) => i !== index) || [],
    }));
  };

  const submitLetter = () => {
    if (!currentLetter.schoolName) return;

    const analyzed = analyzeLetter(currentLetter);
    setLetters(prev => [...prev, analyzed]);
    setCurrentLetter({
      schoolName: '',
      costOfAttendance: {
        tuition: 0,
        roomBoard: 0,
        fees: 0,
        books: 0,
        personal: 0,
        transportation: 0,
      },
      aidItems: [],
      deadline: '',
      acceptanceDeadline: '',
    });
    setActiveTab('compare');
  };

  const loadDemo = () => {
    setLetters([sampleDecodedLetter]);
    setShowDemo(true);
    setActiveTab('compare');
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-400 bg-emerald-500/20';
      case 'B': return 'text-teal-400 bg-teal-500/20';
      case 'C': return 'text-yellow-400 bg-yellow-500/20';
      case 'D': return 'text-orange-400 bg-orange-500/20';
      case 'F': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Render input form
  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Enter Award Letter Details</h2>
          <button
            onClick={loadDemo}
            className="text-sm text-teal-400 hover:text-teal-300"
          >
            Load Demo Data
          </button>
        </div>

        {/* School Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            School Name *
          </label>
          <input
            type="text"
            value={currentLetter.schoolName}
            onChange={(e) => setCurrentLetter({ ...currentLetter, schoolName: e.target.value })}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            placeholder="Enter school name"
          />
        </div>

        {/* Cost of Attendance */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cost of Attendance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'tuition', label: 'Tuition & Fees' },
              { key: 'roomBoard', label: 'Room & Board' },
              { key: 'fees', label: 'Additional Fees' },
              { key: 'books', label: 'Books & Supplies' },
              { key: 'personal', label: 'Personal Expenses' },
              { key: 'transportation', label: 'Transportation' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={currentLetter.costOfAttendance?.[field.key as keyof typeof currentLetter.costOfAttendance] || ''}
                    onChange={(e) => setCurrentLetter({
                      ...currentLetter,
                      costOfAttendance: {
                        ...currentLetter.costOfAttendance!,
                        [field.key]: parseInt(e.target.value) || 0,
                      },
                    })}
                    className="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:border-teal-500"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-dark-bg rounded-lg flex justify-between items-center">
            <span className="text-gray-400">Total Cost of Attendance</span>
            <span className="text-xl font-bold text-white">
              {formatCurrency(Object.values(currentLetter.costOfAttendance || {}).reduce((a, b) => a + (b || 0), 0))}
            </span>
          </div>
        </div>

        {/* Aid Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Financial Aid Package</h3>
            <button
              onClick={() => setShowAddAid(true)}
              className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm hover:bg-teal-500/30 transition-colors"
            >
              + Add Aid Item
            </button>
          </div>

          {/* Aid type legend */}
          <div className="flex flex-wrap gap-4 mb-4 p-3 bg-dark-bg rounded-lg">
            {Object.entries(aidTypeInfo).map(([type, info]) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <span>{info.icon}</span>
                <span className="text-gray-400">{info.label}</span>
                <span className={`px-2 py-0.5 rounded ${
                  info.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  info.color === 'teal' ? 'bg-teal-500/20 text-teal-400' :
                  info.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {type === 'grant' || type === 'scholarship' ? 'FREE' : type === 'loan' ? 'REPAY' : 'EARN'}
                </span>
              </div>
            ))}
          </div>

          {/* Current aid items */}
          {(currentLetter.aidItems || []).length > 0 ? (
            <div className="space-y-2">
              {currentLetter.aidItems?.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.type === 'grant' || item.type === 'scholarship'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : item.type === 'loan'
                      ? 'border-orange-500/30 bg-orange-500/5'
                      : 'border-blue-500/30 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{aidTypeInfo[item.type].icon}</span>
                    <div>
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-xs text-gray-400">
                        {aidTypeInfo[item.type].label} • {item.renewable ? 'Renewable' : 'One-time'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${
                      item.type === 'grant' || item.type === 'scholarship'
                        ? 'text-emerald-400'
                        : item.type === 'loan'
                        ? 'text-orange-400'
                        : 'text-blue-400'
                    }`}>
                      {formatCurrency(item.amount)}
                    </span>
                    <button
                      onClick={() => removeAidItem(idx)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-dashed border-dark-border rounded-lg">
              No aid items added yet. Click "Add Aid Item" to start.
            </div>
          )}

          {/* Add aid modal */}
          <AnimatePresence>
            {showAddAid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddAid(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold text-white mb-4">Add Aid Item</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Aid Name</label>
                      <input
                        type="text"
                        value={newAidItem.name}
                        onChange={(e) => setNewAidItem({ ...newAidItem, name: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                        placeholder="e.g., Federal Pell Grant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={newAidItem.amount || ''}
                          onChange={(e) => setNewAidItem({ ...newAidItem, amount: parseInt(e.target.value) || 0 })}
                          className="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(aidTypeInfo).map(([type, info]) => (
                          <button
                            key={type}
                            onClick={() => setNewAidItem({ ...newAidItem, type: type as AidItem['type'] })}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              newAidItem.type === type
                                ? 'border-teal-500 bg-teal-500/10'
                                : 'border-dark-border hover:border-gray-600'
                            }`}
                          >
                            <div className="text-xl mb-1">{info.icon}</div>
                            <div className="text-sm text-white">{info.label}</div>
                            <div className="text-xs text-gray-500">{info.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="renewable"
                        checked={newAidItem.renewable}
                        onChange={(e) => setNewAidItem({ ...newAidItem, renewable: e.target.checked })}
                        className="w-4 h-4 rounded border-dark-border bg-dark-bg text-teal-500"
                      />
                      <label htmlFor="renewable" className="text-gray-300 text-sm">
                        Renewable each year
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Conditions (optional)</label>
                      <input
                        type="text"
                        value={newAidItem.conditions}
                        onChange={(e) => setNewAidItem({ ...newAidItem, conditions: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white"
                        placeholder="e.g., Must maintain 3.0 GPA"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddAid(false)}
                      className="flex-1 py-2 border border-dark-border rounded-lg text-gray-300 hover:border-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addAidItem}
                      className="flex-1 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                      Add Item
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <button
          onClick={submitLetter}
          disabled={!currentLetter.schoolName}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Analyze Award Letter
        </button>
      </div>
    </div>
  );

  // Render comparison view
  const renderComparison = () => (
    <div className="max-w-6xl mx-auto">
      {letters.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Award Letters Yet</h2>
          <p className="text-gray-400 mb-6">Add your first award letter to start comparing offers</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveTab('input')}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Add Award Letter
            </button>
            <button
              onClick={loadDemo}
              className="px-6 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
            >
              Load Demo
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Action bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {letters.length} Award {letters.length === 1 ? 'Letter' : 'Letters'} Analyzed
            </h2>
            <button
              onClick={() => setActiveTab('input')}
              className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm hover:bg-teal-500/30"
            >
              + Add Another
            </button>
          </div>

          {/* Comparison cards */}
          <div className={`grid gap-6 ${letters.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {letters.map((letter, idx) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-dark-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{letter.schoolName}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        Decision deadline: {letter.acceptanceDeadline || 'Not specified'}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getGradeColor(letter.affordabilityGrade)}`}>
                      {letter.affordabilityGrade}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-xs text-gray-400">Cost of Attendance</div>
                      <div className="text-lg font-bold text-white">{formatCurrency(letter.totalCOA)}</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-xs text-gray-400">Free Aid</div>
                      <div className="text-lg font-bold text-emerald-400">{formatCurrency(letter.totalFreeAid)}</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-xs text-gray-400">Loans Offered</div>
                      <div className="text-lg font-bold text-orange-400">{formatCurrency(letter.totalLoans)}</div>
                    </div>
                    <div className="bg-dark-bg rounded-lg p-3">
                      <div className="text-xs text-gray-400">Work-Study</div>
                      <div className="text-lg font-bold text-blue-400">{formatCurrency(letter.totalWorkStudy)}</div>
                    </div>
                  </div>

                  {/* Key metrics */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-lg">
                      <span className="text-gray-300">Your Net Cost</span>
                      <span className="text-xl font-bold text-teal-400">{formatCurrency(letter.netCost)}/yr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Out-of-pocket (excluding work-study)</span>
                      <span className="text-white font-semibold">{formatCurrency(letter.outOfPocket)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">4-Year Projection</span>
                      <span className="text-white font-semibold">{formatCurrency(letter.fourYearProjection)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Loan Burden (4 years)</span>
                      <span className="text-orange-400 font-semibold">{formatCurrency(letter.loanBurden)}</span>
                    </div>
                  </div>

                  {/* Aid breakdown bar */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-400 mb-2">Aid Package Breakdown</div>
                    <div className="h-4 rounded-full overflow-hidden bg-dark-bg flex">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${(letter.totalFreeAid / letter.totalCOA) * 100}%` }}
                        title={`Free Aid: ${formatCurrency(letter.totalFreeAid)}`}
                      />
                      <div
                        className="bg-orange-500 transition-all"
                        style={{ width: `${(letter.totalLoans / letter.totalCOA) * 100}%` }}
                        title={`Loans: ${formatCurrency(letter.totalLoans)}`}
                      />
                      <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${(letter.totalWorkStudy / letter.totalCOA) * 100}%` }}
                        title={`Work-Study: ${formatCurrency(letter.totalWorkStudy)}`}
                      />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-emerald-400">Free Aid</span>
                      <span className="text-orange-400">Loans</span>
                      <span className="text-blue-400">Work-Study</span>
                      <span className="text-gray-400">Gap</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {letter.warnings.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 mb-2 flex items-center gap-1">
                        <span>⚠️</span> Warnings
                      </div>
                      <div className="space-y-1">
                        {letter.warnings.map((warning, i) => (
                          <div key={i} className="text-xs text-gray-400 bg-yellow-500/5 border border-yellow-500/20 rounded p-2">
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {letter.tips.length > 0 && (
                    <div>
                      <div className="text-xs text-teal-400 mb-2 flex items-center gap-1">
                        <span>💡</span> Tips
                      </div>
                      <div className="space-y-1">
                        {letter.tips.map((tip, i) => (
                          <div key={i} className="text-xs text-gray-400 bg-teal-500/5 border border-teal-500/20 rounded p-2">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-dark-border flex gap-2">
                  <button
                    onClick={() => setLetters(prev => prev.filter(l => l.id !== letter.id))}
                    className="flex-1 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Side-by-side comparison table */}
          {letters.length >= 2 && (
            <div className="mt-8 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-dark-border">
                <h3 className="font-bold text-white">Side-by-Side Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left p-4 text-gray-400 font-medium">Metric</th>
                      {letters.map(l => (
                        <th key={l.id} className="text-right p-4 text-white font-medium">{l.schoolName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Cost of Attendance', key: 'totalCOA', format: 'currency' },
                      { label: 'Free Aid (Grants/Scholarships)', key: 'totalFreeAid', format: 'currency', highlight: 'emerald' },
                      { label: 'Loans Offered', key: 'totalLoans', format: 'currency', highlight: 'orange' },
                      { label: 'Work-Study', key: 'totalWorkStudy', format: 'currency', highlight: 'blue' },
                      { label: 'Net Cost/Year', key: 'netCost', format: 'currency', highlight: 'teal', bold: true },
                      { label: '4-Year Total', key: 'fourYearProjection', format: 'currency' },
                      { label: 'Total Loan Burden', key: 'loanBurden', format: 'currency', highlight: 'orange' },
                      { label: 'Affordability Grade', key: 'affordabilityGrade', format: 'grade' },
                    ].map(row => (
                      <tr key={row.key} className="border-b border-dark-border/50">
                        <td className="p-4 text-gray-300">{row.label}</td>
                        {letters.map(l => {
                          const value = l[row.key as keyof AnalyzedLetter];
                          const displayValue = row.format === 'currency'
                            ? formatCurrency(value as number)
                            : row.format === 'grade'
                            ? String(value)
                            : String(value);
                          return (
                            <td key={l.id} className={`p-4 text-right ${row.bold ? 'font-bold' : ''} ${
                              row.format === 'grade' ? getGradeColor(value as string) :
                              row.highlight === 'emerald' ? 'text-emerald-400' :
                              row.highlight === 'orange' ? 'text-orange-400' :
                              row.highlight === 'blue' ? 'text-blue-400' :
                              row.highlight === 'teal' ? 'text-teal-400' :
                              'text-white'
                            }`}>
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Important disclaimer */}
      <div className="mt-8 p-4 bg-dark-card border border-dark-border rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <div>
            <h4 className="font-medium text-white mb-1">Understanding Your Award Letter</h4>
            <p className="text-sm text-gray-400">
              Award letters can be confusing. Remember: Grants and scholarships are FREE money.
              Loans must be REPAID with interest. Work-study is money you must EARN through employment.
              Always compare net costs, not just aid amounts. If your aid seems low, you can appeal!
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
            <span>📊</span>
            <span>Financial Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Award Letter Analyzer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Decode confusing award letters. Compare offers. Make informed decisions.
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
              Enter Award Letter
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">⚖️</span>
              Compare Offers
              {letters.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-teal-600 rounded-full text-xs">{letters.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'input' ? renderInputForm() : renderComparison()}

        {/* Educational content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {Object.entries(aidTypeInfo).map(([type, info]) => (
            <div key={type} className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="text-3xl mb-4">{info.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{info.label}s</h3>
              <p className="text-gray-400 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardLetterAnalyzerPage;
