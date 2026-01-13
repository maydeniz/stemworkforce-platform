// ===========================================
// Financial Fit Calculator Page
// ===========================================
// Realistic cost/aid estimates and financial planning
// Helps students understand true college costs
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types
interface FinancialProfile {
  householdIncome: string;
  householdSize: number;
  assets: string;
  specialCircumstances: string[];
}

interface SchoolCost {
  id: string;
  name: string;
  location: string;
  type: 'public-in' | 'public-out' | 'private';
  stickerPrice: number;
  estimatedAid: number;
  netCost: number;
  aidBreakdown: AidBreakdown;
  fourYearTotal: number;
  meritAidAvailable: boolean;
}

interface AidBreakdown {
  grants: number;
  scholarships: number;
  workStudy: number;
  subsidizedLoans: number;
  unsubsidizedLoans: number;
  parentLoans: number;
  gap: number;
}

interface LoanProjection {
  principal: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

// Income brackets for estimation
const INCOME_BRACKETS = [
  { id: 'under-30k', label: 'Under $30,000', range: [0, 30000] },
  { id: '30k-48k', label: '$30,000 - $48,000', range: [30000, 48000] },
  { id: '48k-75k', label: '$48,000 - $75,000', range: [48000, 75000] },
  { id: '75k-110k', label: '$75,000 - $110,000', range: [75000, 110000] },
  { id: '110k-150k', label: '$110,000 - $150,000', range: [110000, 150000] },
  { id: 'over-150k', label: 'Over $150,000', range: [150000, 999999] },
  { id: 'prefer-not', label: 'Prefer not to say', range: null },
];

// Sample school costs
const SAMPLE_SCHOOLS: SchoolCost[] = [
  {
    id: '1',
    name: 'MIT',
    location: 'Cambridge, MA',
    type: 'private',
    stickerPrice: 82000,
    estimatedAid: 58000,
    netCost: 24000,
    aidBreakdown: {
      grants: 55000,
      scholarships: 3000,
      workStudy: 3000,
      subsidizedLoans: 3500,
      unsubsidizedLoans: 2000,
      parentLoans: 0,
      gap: 0,
    },
    fourYearTotal: 96000,
    meritAidAvailable: false,
  },
  {
    id: '2',
    name: 'Georgia Tech',
    location: 'Atlanta, GA',
    type: 'public-out',
    stickerPrice: 54000,
    estimatedAid: 18000,
    netCost: 36000,
    aidBreakdown: {
      grants: 12000,
      scholarships: 6000,
      workStudy: 2500,
      subsidizedLoans: 3500,
      unsubsidizedLoans: 2000,
      parentLoans: 5000,
      gap: 5000,
    },
    fourYearTotal: 144000,
    meritAidAvailable: true,
  },
  {
    id: '3',
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    type: 'public-out',
    stickerPrice: 58000,
    estimatedAid: 22000,
    netCost: 36000,
    aidBreakdown: {
      grants: 15000,
      scholarships: 7000,
      workStudy: 2500,
      subsidizedLoans: 3500,
      unsubsidizedLoans: 2000,
      parentLoans: 8000,
      gap: 2000,
    },
    fourYearTotal: 144000,
    meritAidAvailable: true,
  },
  {
    id: '4',
    name: 'Georgia State University',
    location: 'Atlanta, GA',
    type: 'public-in',
    stickerPrice: 28000,
    estimatedAid: 16000,
    netCost: 12000,
    aidBreakdown: {
      grants: 10000,
      scholarships: 6000,
      workStudy: 2000,
      subsidizedLoans: 3500,
      unsubsidizedLoans: 0,
      parentLoans: 0,
      gap: 0,
    },
    fourYearTotal: 48000,
    meritAidAvailable: true,
  },
  {
    id: '5',
    name: 'Purdue University',
    location: 'West Lafayette, IN',
    type: 'public-out',
    stickerPrice: 46000,
    estimatedAid: 14000,
    netCost: 32000,
    aidBreakdown: {
      grants: 8000,
      scholarships: 6000,
      workStudy: 2500,
      subsidizedLoans: 3500,
      unsubsidizedLoans: 2000,
      parentLoans: 10000,
      gap: 0,
    },
    fourYearTotal: 128000,
    meritAidAvailable: true,
  },
];

// Main Component
const FinancialFitPage: React.FC = () => {
  const [view, setView] = useState<'intro' | 'profile' | 'results' | 'compare' | 'loan'>('intro');
  const [profile, setProfile] = useState<Partial<FinancialProfile>>({});
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white transition-colors">For Students</Link>
            <span>/</span>
            <span className="text-emerald-400">Financial Fit Calculator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span>💰</span>
                <span>College Discovery</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Financial Fit <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Calculator</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Don't let sticker prices scare you away. See what college will really cost,
                understand your aid options, and plan for the future.
              </p>
            </div>

            {view === 'intro' && (
              <button
                onClick={() => setView('profile')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>📊</span>
                Start Calculating
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="border-y border-white/5 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-amber-400">⚠️</span>
            <span>
              These are <strong className="text-white">estimates</strong> based on public formulas.
              Always complete the official FAFSA and each school's net price calculator for accurate figures.
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'intro' && (
            <IntroView onStart={() => setView('profile')} />
          )}

          {view === 'profile' && (
            <ProfileSetup
              profile={profile}
              onUpdate={setProfile}
              onNext={() => setView('results')}
              onBack={() => setView('intro')}
            />
          )}

          {view === 'results' && (
            <ResultsView
              schools={SAMPLE_SCHOOLS}
              profile={profile}
              selectedSchools={selectedSchools}
              onToggleSelect={(id) => setSelectedSchools(prev =>
                prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
              )}
              onCompare={() => setView('compare')}
              onLoanCalc={() => setView('loan')}
              onEditProfile={() => setView('profile')}
            />
          )}

          {view === 'compare' && (
            <CompareView
              schools={SAMPLE_SCHOOLS.filter(s => selectedSchools.includes(s.id))}
              onBack={() => setView('results')}
            />
          )}

          {view === 'loan' && (
            <LoanCalculator
              onBack={() => setView('results')}
            />
          )}
        </div>
      </section>
    </div>
  );
};

// ===========================================
// Intro View
// ===========================================
const IntroView: React.FC<{
  onStart: () => void;
}> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Key Message */}
      <div className="text-center">
        <div className="text-6xl mb-6">💡</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Sticker Price ≠ What You'll Pay
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Many families pay far less than listed prices. An $80,000 school might cost
          the same as a $30,000 school after financial aid.
        </p>
      </div>

      {/* Terms Explained */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { term: 'Sticker Price', icon: '🏷️', desc: 'The published cost before any aid. Almost no one pays this.' },
          { term: 'Net Price', icon: '💵', desc: 'What you actually pay after grants and scholarships. This is the real number.' },
          { term: 'Grants & Scholarships', icon: '🎁', desc: 'Free money you don\'t pay back. Based on need or merit.' },
          { term: 'Loans', icon: '📝', desc: 'Money you borrow and must repay with interest. Minimize these.' },
          { term: 'Work-Study', icon: '💼', desc: 'Part-time campus job. You earn this money during school.' },
          { term: 'Gap', icon: '❓', desc: 'Amount not covered by aid. You\'ll need to find other sources.' },
        ].map((item, i) => (
          <div key={i} className="p-5 bg-gray-900/50 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-semibold text-white">{item.term}</h3>
            </div>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">
          Get Your Personalized Estimates
        </h3>
        <p className="text-gray-400 mb-6">
          Share some basic financial information (all optional and private),
          and we'll estimate what schools might actually cost you.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
        >
          Calculate My Costs →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Profile Setup
// ===========================================
const ProfileSetup: React.FC<{
  profile: Partial<FinancialProfile>;
  onUpdate: (profile: Partial<FinancialProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ profile, onUpdate, onNext, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-400">All fields optional</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Financial Information</h2>
        <p className="text-gray-400">
          This helps us estimate your aid. Everything is kept private and never shared.
        </p>
      </div>

      {/* Income */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <label className="block text-sm text-gray-400 mb-3">
          Household Income (approximate)
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {INCOME_BRACKETS.map((bracket) => (
            <button
              key={bracket.id}
              onClick={() => onUpdate({ ...profile, householdIncome: bracket.id })}
              className={`p-3 rounded-lg border text-left transition-all ${
                profile.householdIncome === bracket.id
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-white text-sm">{bracket.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Household Size */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <label className="block text-sm text-gray-400 mb-3">
          Household Size (people supported by this income)
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6, 7].map((size) => (
            <button
              key={size}
              onClick={() => onUpdate({ ...profile, householdSize: size })}
              className={`w-12 h-12 rounded-lg border transition-all ${
                profile.householdSize === size
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {size}{size === 7 ? '+' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Special Circumstances */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <label className="block text-sm text-gray-400 mb-3">
          Special Circumstances (select all that apply)
        </label>
        <div className="space-y-2">
          {[
            { id: 'first-gen', label: 'First-generation college student' },
            { id: 'single-parent', label: 'Single-parent household' },
            { id: 'multiple-students', label: 'Multiple students in college' },
            { id: 'unusual-expenses', label: 'Unusual medical or other expenses' },
            { id: 'recent-change', label: 'Recent income change (job loss, etc.)' },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.specialCircumstances?.includes(item.id) || false}
                onChange={(e) => {
                  const current = profile.specialCircumstances || [];
                  const updated = e.target.checked
                    ? [...current, item.id]
                    : current.filter(c => c !== item.id);
                  onUpdate({ ...profile, specialCircumstances: updated });
                }}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-gray-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-emerald-400">🔒</span>
          <div className="text-sm text-gray-400">
            <strong className="text-white">Your privacy is protected.</strong> This information
            is used only to generate estimates and is never stored or shared with colleges.
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
        >
          See My Estimates →
        </button>
      </div>
    </div>
  );
};

// ===========================================
// Results View
// ===========================================
const ResultsView: React.FC<{
  schools: SchoolCost[];
  profile: Partial<FinancialProfile>;
  selectedSchools: string[];
  onToggleSelect: (id: string) => void;
  onCompare: () => void;
  onLoanCalc: () => void;
  onEditProfile: () => void;
}> = ({ schools, selectedSchools, onToggleSelect, onCompare, onLoanCalc, onEditProfile }) => {
  const sortedSchools = useMemo(() =>
    [...schools].sort((a, b) => a.netCost - b.netCost),
    [schools]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Cost Estimates</h2>
          <p className="text-gray-400">
            Sorted by estimated net cost. Select schools to compare side-by-side.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEditProfile}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={onLoanCalc}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
          >
            Loan Calculator
          </button>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-emerald-400 text-xl">💡</span>
          <div>
            <div className="font-medium text-white mb-1">Did You Know?</div>
            <p className="text-sm text-gray-300">
              The most expensive school on this list (sticker price) might not be the most
              expensive for <em>you</em>. Schools with higher sticker prices often have
              more generous financial aid.
            </p>
          </div>
        </div>
      </div>

      {/* School Cards */}
      <div className="space-y-4">
        {sortedSchools.map((school, index) => (
          <CostCard
            key={school.id}
            school={school}
            rank={index + 1}
            isSelected={selectedSchools.includes(school.id)}
            onToggleSelect={() => onToggleSelect(school.id)}
          />
        ))}
      </div>

      {/* Compare Button */}
      {selectedSchools.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={onCompare}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Compare {selectedSchools.length} Schools →
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center p-6 bg-gray-900/50 border border-white/5 rounded-xl">
        <p className="text-sm text-gray-400">
          These estimates are based on published formulas and may differ from actual awards.
          Always complete the FAFSA and each school's net price calculator.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// Cost Card
// ===========================================
const CostCard: React.FC<{
  school: SchoolCost;
  rank: number;
  isSelected: boolean;
  onToggleSelect: () => void;
}> = ({ school, rank, isSelected, onToggleSelect }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'public-in': return 'Public (In-State)';
      case 'public-out': return 'Public (Out-of-State)';
      case 'private': return 'Private';
      default: return type;
    }
  };

  return (
    <div className={`bg-gray-900/50 border rounded-xl transition-all ${
      isSelected ? 'border-emerald-500' : 'border-white/5'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-400 font-medium">
              {rank}
            </div>
            <div>
              <h3 className="font-semibold text-white">{school.name}</h3>
              <p className="text-sm text-gray-500">
                {school.location} • {getTypeLabel(school.type)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500 line-through">
                ${school.stickerPrice.toLocaleString()}/yr
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                ${school.netCost.toLocaleString()}/yr
              </div>
              <div className="text-xs text-gray-500">
                ${school.fourYearTotal.toLocaleString()} over 4 years
              </div>
            </div>
            <button
              onClick={onToggleSelect}
              className={`w-6 h-6 rounded border-2 transition-all ${
                isSelected
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-600'
              }`}
            >
              {isSelected && <span className="text-white text-sm">✓</span>}
            </button>
          </div>
        </div>

        {/* Aid Summary */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
            ${school.aidBreakdown.grants.toLocaleString()} in grants
          </span>
          {school.meritAidAvailable && (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
              Merit aid available
            </span>
          )}
          {school.aidBreakdown.gap > 0 && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
              ${school.aidBreakdown.gap.toLocaleString()} gap
            </span>
          )}
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {showBreakdown ? 'Hide breakdown ↑' : 'Show aid breakdown ↓'}
        </button>
      </div>

      {/* Detailed Breakdown */}
      {showBreakdown && (
        <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-4">
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-xs text-gray-500 uppercase mb-2">Free Money (Don't Repay)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Grants</span>
                  <span className="text-emerald-400">${school.aidBreakdown.grants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Scholarships</span>
                  <span className="text-emerald-400">${school.aidBreakdown.scholarships.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs text-gray-500 uppercase mb-2">Self-Help (Earn or Repay)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Work-Study</span>
                  <span className="text-blue-400">${school.aidBreakdown.workStudy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subsidized Loans</span>
                  <span className="text-amber-400">${school.aidBreakdown.subsidizedLoans.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unsubsidized Loans</span>
                  <span className="text-amber-400">${school.aidBreakdown.unsubsidizedLoans.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          {school.aidBreakdown.parentLoans > 0 && (
            <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-amber-400">Parent PLUS Loans (expected)</span>
                <span className="text-amber-400">${school.aidBreakdown.parentLoans.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===========================================
// Compare View
// ===========================================
const CompareView: React.FC<{
  schools: SchoolCost[];
  onBack: () => void;
}> = ({ schools, onBack }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-white">Compare Costs</h2>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-gray-400 font-medium">Cost Category</th>
              {schools.map((school) => (
                <th key={school.id} className="p-4 text-left">
                  <div className="font-semibold text-white">{school.name}</div>
                  <div className="text-xs text-gray-500">{school.location}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Sticker Price</td>
              {schools.map((school) => (
                <td key={school.id} className="p-4 text-gray-500 line-through">
                  ${school.stickerPrice.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 bg-emerald-500/5">
              <td className="p-4 text-gray-400 font-medium">Net Cost (You Pay)</td>
              {schools.map((school) => (
                <td key={school.id} className="p-4 text-xl font-bold text-emerald-400">
                  ${school.netCost.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Grants (Free)</td>
              {schools.map((school) => (
                <td key={school.id} className="p-4 text-emerald-400">
                  ${school.aidBreakdown.grants.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">Loans (Borrow)</td>
              {schools.map((school) => (
                <td key={school.id} className="p-4 text-amber-400">
                  ${(school.aidBreakdown.subsidizedLoans + school.aidBreakdown.unsubsidizedLoans).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-gray-400">4-Year Total</td>
              {schools.map((school) => (
                <td key={school.id} className="p-4 text-white font-medium">
                  ${school.fourYearTotal.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Key Takeaway */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
        <h3 className="font-medium text-white mb-3">Key Takeaway</h3>
        <p className="text-gray-300">
          The school with the lowest sticker price isn't always the cheapest after aid.
          Compare <strong>net costs</strong>, not sticker prices. Also consider the
          mix of grants (free) vs loans (debt).
        </p>
      </div>
    </div>
  );
};

// ===========================================
// Loan Calculator
// ===========================================
const LoanCalculator: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [principal, setPrincipal] = useState(27000);
  const [interestRate] = useState(5.5);
  const [term, setTerm] = useState(10);

  const projection: LoanProjection = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = term * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;

    return {
      principal,
      interestRate,
      term,
      monthlyPayment,
      totalPaid,
      totalInterest,
    };
  }, [principal, interestRate, term]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-white">Loan Payback Calculator</h2>
      </div>

      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
        <p className="text-gray-400 mb-6">
          See what borrowing means for your future. Adjust the loan amount to understand
          the monthly payments you'll face after graduation.
        </p>

        {/* Loan Amount Slider */}
        <div className="mb-8">
          <label className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-400">Total Loan Amount</span>
            <span className="text-2xl font-bold text-white">${principal.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$5,000</span>
            <span>$100,000</span>
          </div>
        </div>

        {/* Term Selector */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-3">Repayment Term</label>
          <div className="flex gap-2">
            {[10, 15, 20, 25].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-2 rounded-lg border transition-all ${
                  term === t
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {t} years
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
            <div className="text-2xl font-bold text-emerald-400">
              ${Math.round(projection.monthlyPayment).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <div className="text-sm text-gray-400 mb-1">Total Interest</div>
            <div className="text-2xl font-bold text-amber-400">
              ${Math.round(projection.totalInterest).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <div className="text-sm text-gray-400 mb-1">Total Repaid</div>
            <div className="text-2xl font-bold text-white">
              ${Math.round(projection.totalPaid).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2">
          <span>💡</span>
          Putting This in Context
        </h3>
        <p className="text-sm text-gray-300">
          A ${Math.round(projection.monthlyPayment).toLocaleString()}/month payment is roughly what you'd pay for
          {projection.monthlyPayment < 200 ? ' a phone bill and streaming services' :
           projection.monthlyPayment < 400 ? ' a car payment' :
           projection.monthlyPayment < 600 ? ' rent in a shared apartment in some cities' :
           ' a significant portion of monthly expenses'}.
          Consider whether this fits your expected salary.
        </p>
      </div>

      {/* Salary Context */}
      <div className="bg-gray-900/50 border border-white/5 rounded-xl p-5">
        <h3 className="font-medium text-white mb-4">Rule of Thumb</h3>
        <p className="text-gray-300 mb-4">
          Many financial experts suggest keeping total student loan debt below your
          expected first-year salary. If you expect to earn $60,000, try to borrow less than $60,000.
        </p>
        <div className="text-sm text-gray-500">
          Average starting salary for STEM graduates: $65,000 - $85,000
        </div>
      </div>
    </div>
  );
};

export default FinancialFitPage;
