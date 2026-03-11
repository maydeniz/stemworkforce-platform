// ===========================================
// Offer Comparison Tool Page - College Students
// Compare total compensation packages
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Scale,
  DollarSign,
  MapPin,
  Plus,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  Award,
  Clock,
  Heart,
  Briefcase,
  Calculator,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Offer {
  id: string;
  company: string;
  role: string;
  location: string;
  baseSalary: number;
  signingBonus: number;
  annualBonus: number;
  stockGrant: number;
  vestingYears: number;
  benefits: {
    healthcare: 'excellent' | 'good' | 'basic';
    retirement401k: number;
    pto: number;
    remote: 'full' | 'hybrid' | 'onsite';
  };
  costOfLivingIndex: number;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const SAMPLE_OFFERS: Offer[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer L3',
    location: 'Mountain View, CA',
    baseSalary: 150000,
    signingBonus: 30000,
    annualBonus: 22500,
    stockGrant: 200000,
    vestingYears: 4,
    benefits: {
      healthcare: 'excellent',
      retirement401k: 50,
      pto: 20,
      remote: 'hybrid',
    },
    costOfLivingIndex: 180,
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'Software Engineer',
    location: 'Seattle, WA',
    baseSalary: 140000,
    signingBonus: 25000,
    annualBonus: 21000,
    stockGrant: 150000,
    vestingYears: 4,
    benefits: {
      healthcare: 'excellent',
      retirement401k: 50,
      pto: 15,
      remote: 'hybrid',
    },
    costOfLivingIndex: 145,
  },
];

// ===========================================
// COMPONENT
// ===========================================
const OfferComparisonPage: React.FC = () => {
  const [offers] = useState<Offer[]>(SAMPLE_OFFERS);
  const [showAddForm, setShowAddForm] = useState(false);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalComp = (offer: Offer) => {
    const annualStock = offer.stockGrant / offer.vestingYears;
    return offer.baseSalary + offer.annualBonus + annualStock;
  };

  const calculateAdjustedComp = (offer: Offer) => {
    const totalComp = calculateTotalComp(offer);
    return Math.round((totalComp / offer.costOfLivingIndex) * 100);
  };

  const getBestFor = (metric: keyof Pick<Offer, 'baseSalary' | 'signingBonus' | 'stockGrant'>) => {
    return offers.reduce((best, offer) =>
      offer[metric] > best[metric] ? offer : best
    , offers[0])?.id;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-950 to-purple-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Link to="/college/career-launch" className="hover:underline">Career Launch</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Offer Comparison</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Offer Comparison
              <span className="text-indigo-400"> Tool</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Compare job offers side-by-side with total compensation, cost of living adjustments,
              and benefits analysis. Make the right choice with complete data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Offer Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Offer
          </button>
        </div>

        {/* Add Offer Form Placeholder */}
        {showAddForm && (
          <div className="mb-8 bg-gray-900/50 rounded-xl border border-indigo-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Offer</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <p className="text-gray-400">
              Custom offer entry form is coming soon! For now, compare the sample offers above.
            </p>
          </div>
        )}

        {/* Comparison Table */}
        {offers.length > 0 ? (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 sticky left-0 bg-gray-800/50">
                      Component
                    </th>
                    {offers.map(offer => (
                      <th key={offer.id} className="text-center px-6 py-4 min-w-[250px]">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-white">{offer.company}</span>
                          <span className="text-sm text-gray-400">{offer.role}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {offer.location}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {/* Base Salary */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        Base Salary
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`text-lg font-semibold ${getBestFor('baseSalary') === offer.id ? 'text-green-400' : 'text-white'}`}>
                          {formatCurrency(offer.baseSalary)}
                        </span>
                        {getBestFor('baseSalary') === offer.id && (
                          <span className="ml-2 text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">Best</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Signing Bonus */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        Signing Bonus
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`${getBestFor('signingBonus') === offer.id ? 'text-green-400' : 'text-white'}`}>
                          {formatCurrency(offer.signingBonus)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Annual Bonus */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        Annual Bonus (Target)
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center text-white">
                        {formatCurrency(offer.annualBonus)}
                        <span className="text-gray-500 text-sm ml-1">
                          ({Math.round(offer.annualBonus / offer.baseSalary * 100)}%)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Grant */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        Stock/RSU ({offers[0]?.vestingYears}yr total)
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`${getBestFor('stockGrant') === offer.id ? 'text-green-400' : 'text-white'}`}>
                          {formatCurrency(offer.stockGrant)}
                        </span>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(offer.stockGrant / offer.vestingYears)}/yr
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Total Year 1 Comp */}
                  <tr className="bg-gray-800/30">
                    <td className="px-6 py-4 sticky left-0 bg-gray-800/30">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <Calculator className="w-4 h-4 text-indigo-400" />
                        Total Comp (Year 1)
                      </div>
                    </td>
                    {offers.map(offer => {
                      const year1Total = offer.baseSalary + offer.signingBonus + offer.annualBonus + (offer.stockGrant / offer.vestingYears);
                      return (
                        <td key={offer.id} className="px-6 py-4 text-center">
                          <span className="text-xl font-bold text-indigo-400">
                            {formatCurrency(year1Total)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Annual Comp */}
                  <tr className="bg-gray-800/30">
                    <td className="px-6 py-4 sticky left-0 bg-gray-800/30">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <Calculator className="w-4 h-4 text-indigo-400" />
                        Annual Comp (Recurring)
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-white">
                          {formatCurrency(calculateTotalComp(offer))}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* COL Adjusted */}
                  <tr className="bg-indigo-500/5">
                    <td className="px-6 py-4 sticky left-0 bg-indigo-500/5">
                      <div className="flex items-center gap-2 font-semibold text-indigo-400">
                        <MapPin className="w-4 h-4" />
                        COL-Adjusted Comp
                        <HelpCircle className="w-3 h-3 text-gray-500" />
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-indigo-400">
                          {formatCurrency(calculateAdjustedComp(offer))}
                        </span>
                        <div className="text-xs text-gray-500">
                          COL Index: {offer.costOfLivingIndex}%
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Benefits Section Header */}
                  <tr>
                    <td colSpan={offers.length + 1} className="px-6 py-3 bg-gray-800/50">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Benefits & Perks</span>
                    </td>
                  </tr>

                  {/* Healthcare */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gray-500" />
                        Healthcare
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`capitalize ${
                          offer.benefits.healthcare === 'excellent' ? 'text-green-400' :
                          offer.benefits.healthcare === 'good' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {offer.benefits.healthcare}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 401k Match */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      401(k) Match
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center text-white">
                        {offer.benefits.retirement401k}%
                      </td>
                    ))}
                  </tr>

                  {/* PTO */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        PTO Days
                      </div>
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center text-white">
                        {offer.benefits.pto} days
                      </td>
                    ))}
                  </tr>

                  {/* Remote Policy */}
                  <tr>
                    <td className="px-6 py-4 text-gray-300 sticky left-0 bg-gray-950">
                      Remote Work
                    </td>
                    {offers.map(offer => (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`capitalize ${
                          offer.benefits.remote === 'full' ? 'text-green-400' :
                          offer.benefits.remote === 'hybrid' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {offer.benefits.remote}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Scale className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No offers to compare yet</h3>
            <p className="text-gray-400 mb-6">Add your job offers to compare them side-by-side</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Offer
            </button>
          </div>
        )}

        {/* Decision Factors */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Beyond the Numbers</h3>
            <ul className="space-y-4">
              {[
                { label: 'Career Growth', desc: 'Promotion velocity, learning opportunities, mentorship' },
                { label: 'Team & Manager', desc: 'Who you work with matters more than where you work' },
                { label: 'Tech Stack', desc: 'Will you be working with technologies you want to learn?' },
                { label: 'Work-Life Balance', desc: 'Expected hours, on-call requirements, culture' },
                { label: 'Company Trajectory', desc: 'Is the company growing? Stable? Industry position?' },
              ].map((factor, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">{factor.label}</span>
                    <p className="text-sm text-gray-400">{factor.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Questions to Ask Yourself</h3>
            <ul className="space-y-4">
              {[
                'Where do I see myself in 3-5 years?',
                'Which role aligns best with my career goals?',
                'Am I excited about the product/mission?',
                'What does my gut tell me?',
                'Which manager/team impressed me most?',
              ].map((question, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <HelpCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  {question}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                Remember: The highest paying offer isn't always the best offer. Consider all factors
                that matter to you personally.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help Deciding?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our career advisors can help you evaluate offers and negotiate the best package.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/salary-negotiation"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Negotiation Tips
            </Link>
            <Link
              to="/college/career-launch"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Career Resources
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferComparisonPage;
