// ===========================================
// Salary Negotiation Page - College Students
// Know your worth with real comp data
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  DollarSign,
  MapPin,
  Calculator,
  FileText,
  ChevronRight,
  Info,
  CheckCircle,
  MessageSquare,
  Target,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface SalaryData {
  role: string;
  level: string;
  company: string;
  location: string;
  baseSalary: number;
  bonus: number;
  equity: number;
  totalComp: number;
  yearsExp: string;
}

interface NegotiationScript {
  id: string;
  scenario: string;
  yourLine: string;
  tips: string[];
}

interface CompensationComponent {
  name: string;
  description: string;
  typical: string;
  negotiable: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const SALARY_DATA: SalaryData[] = [
  {
    role: 'Software Engineer',
    level: 'New Grad (L3)',
    company: 'Google',
    location: 'Mountain View, CA',
    baseSalary: 150000,
    bonus: 15000,
    equity: 50000,
    totalComp: 215000,
    yearsExp: '0-1',
  },
  {
    role: 'Software Engineer',
    level: 'New Grad (E3)',
    company: 'Meta',
    location: 'Menlo Park, CA',
    baseSalary: 145000,
    bonus: 15000,
    equity: 60000,
    totalComp: 220000,
    yearsExp: '0-1',
  },
  {
    role: 'Software Engineer',
    level: 'New Grad (L4)',
    company: 'Amazon',
    location: 'Seattle, WA',
    baseSalary: 130000,
    bonus: 30000,
    equity: 25000,
    totalComp: 185000,
    yearsExp: '0-1',
  },
  {
    role: 'Data Scientist',
    level: 'New Grad',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    baseSalary: 180000,
    bonus: 0,
    equity: 40000,
    totalComp: 220000,
    yearsExp: '0-1',
  },
  {
    role: 'Hardware Engineer',
    level: 'New Grad',
    company: 'Apple',
    location: 'Cupertino, CA',
    baseSalary: 140000,
    bonus: 20000,
    equity: 45000,
    totalComp: 205000,
    yearsExp: '0-1',
  },
];

const NEGOTIATION_SCRIPTS: NegotiationScript[] = [
  {
    id: '1',
    scenario: 'Initial Response to Offer',
    yourLine: "Thank you so much for this offer! I'm really excited about the opportunity to join [Company]. I'd like to take some time to review the full compensation package. When would you need a decision by?",
    tips: ['Never accept on the spot', 'Express genuine enthusiasm', 'Buy time to evaluate'],
  },
  {
    id: '2',
    scenario: 'Asking for More Base Salary',
    yourLine: "Based on my research and the value I can bring with my experience in [X], I was hoping for a base salary closer to [Y]. Is there flexibility here?",
    tips: ['Anchor with research', 'Focus on value you bring', 'Ask open-ended questions'],
  },
  {
    id: '3',
    scenario: 'When They Say the Offer is Final',
    yourLine: "I understand the base salary may be fixed, but I'm wondering if there's flexibility in other areas like signing bonus, equity, or start date?",
    tips: ['Pivot to other components', "Don't accept 'no' immediately", 'Be creative'],
  },
  {
    id: '4',
    scenario: 'Using a Competing Offer',
    yourLine: "I have another offer with a total compensation of [X]. I prefer [Your Company] because of [specific reasons], but I want to make sure I'm making the right financial decision for my future.",
    tips: ["Don't bluff", 'Be specific about why you prefer them', 'Frame as wanting to choose them'],
  },
];

const COMPENSATION_COMPONENTS: CompensationComponent[] = [
  {
    name: 'Base Salary',
    description: 'Fixed annual pay before taxes',
    typical: '$80K - $200K for new grads in tech',
    negotiable: true,
  },
  {
    name: 'Signing Bonus',
    description: 'One-time payment when you join',
    typical: '$10K - $100K, often prorated if you leave early',
    negotiable: true,
  },
  {
    name: 'Annual Bonus',
    description: 'Performance-based yearly payment',
    typical: '10-20% of base, depends on performance',
    negotiable: false,
  },
  {
    name: 'Stock/RSUs',
    description: 'Equity that vests over time (usually 4 years)',
    typical: '$50K - $300K total grant for new grads',
    negotiable: true,
  },
  {
    name: '401(k) Match',
    description: 'Employer contribution to retirement',
    typical: '3-6% of salary matched',
    negotiable: false,
  },
  {
    name: 'Relocation',
    description: 'Moving expenses coverage',
    typical: '$5K - $20K or full coverage',
    negotiable: true,
  },
];

const COST_OF_LIVING: { city: string; index: number; avgRent: number }[] = [
  { city: 'San Francisco, CA', index: 180, avgRent: 3500 },
  { city: 'New York, NY', index: 170, avgRent: 3200 },
  { city: 'Seattle, WA', index: 145, avgRent: 2500 },
  { city: 'Austin, TX', index: 110, avgRent: 1800 },
  { city: 'Denver, CO', index: 115, avgRent: 2000 },
  { city: 'Atlanta, GA', index: 100, avgRent: 1600 },
  { city: 'Remote', index: 100, avgRent: 1500 },
];

// ===========================================
// COMPONENT
// ===========================================
const SalaryNegotiationPage: React.FC = () => {
  const { info, success } = useNotifications();
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineer');
  const [activeTab, setActiveTab] = useState<'data' | 'scripts' | 'calculator'>('data');
  const [calcValues, setCalcValues] = useState({ base: '', signing: '', stock: '', bonus: '' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredData = SALARY_DATA.filter(d => d.role === selectedRole);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-gray-950 to-emerald-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-green-400 mb-4">
            <Link to="/college/career-launch" className="hover:underline">Career Launch</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Salary Negotiation</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Salary
                <span className="text-green-400"> Negotiation</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Know your worth with real compensation data from tech companies.
                Get scripts, strategies, and confidence to negotiate your best offer.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveTab('calculator')} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Calculator className="w-5 h-5" />
                  Calculate Your Worth
                </button>
                <button onClick={() => setActiveTab('scripts')} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700">
                  <FileText className="w-5 h-5" />
                  Get Negotiation Scripts
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">New Grad Tech Compensation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Total Comp</span>
                  <span className="text-2xl font-bold text-green-400">$185,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Median Base Salary</span>
                  <span className="text-xl font-semibold text-white">$140,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Typical Equity (4yr)</span>
                  <span className="text-xl font-semibold text-white">$120,000</span>
                </div>
                <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                  Data from 5,000+ verified offers at top tech companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Role Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Software Engineer', 'Data Scientist', 'Hardware Engineer', 'Product Manager'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'data', label: 'Salary Data', icon: DollarSign },
            { id: 'scripts', label: 'Negotiation Scripts', icon: MessageSquare },
            { id: 'calculator', label: 'Offer Calculator', icon: Calculator },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-green-400 border-green-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Salary Data Tab */}
        {activeTab === 'data' && (
          <div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Company</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Level</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Location</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Base</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Bonus</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Equity/yr</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Total Comp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredData.map((data, i) => (
                      <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-white">{data.company}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{data.level}</td>
                        <td className="px-6 py-4 text-gray-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {data.location}
                        </td>
                        <td className="px-6 py-4 text-right text-white">{formatCurrency(data.baseSalary)}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{formatCurrency(data.bonus)}</td>
                        <td className="px-6 py-4 text-right text-gray-300">{formatCurrency(data.equity)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-green-400 font-semibold">{formatCurrency(data.totalComp)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compensation Components */}
            <h3 className="text-xl font-semibold text-white mb-4">Understanding Your Compensation</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPENSATION_COMPONENTS.map((comp, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{comp.name}</h4>
                    {comp.negotiable ? (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded">Negotiable</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">Fixed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{comp.description}</p>
                  <p className="text-xs text-gray-500">{comp.typical}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negotiation Scripts Tab */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Key Negotiation Principles</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Never accept an offer on the spot - always ask for time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Companies expect negotiation - it's part of the process
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Focus on total compensation, not just base salary
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Be enthusiastic but firm - you can do both
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {NEGOTIATION_SCRIPTS.map(script => (
              <div key={script.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{script.scenario}</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border-l-4 border-green-500">
                  <p className="text-gray-300 italic">"{script.yourLine}"</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {script.tips.map((tip, i) => (
                    <span key={i} className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full flex items-center gap-1">
                      <Target className="w-3 h-3 text-green-400" />
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Total Compensation Calculator</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Base Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      placeholder="140000"
                      value={calcValues.base}
                      onChange={(e) => setCalcValues(prev => ({...prev, base: e.target.value}))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Signing Bonus</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      placeholder="25000"
                      value={calcValues.signing}
                      onChange={(e) => setCalcValues(prev => ({...prev, signing: e.target.value}))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stock/RSU Grant (4-year total)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      placeholder="200000"
                      value={calcValues.stock}
                      onChange={(e) => setCalcValues(prev => ({...prev, stock: e.target.value}))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Annual Bonus Target (%)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={calcValues.bonus}
                    onChange={(e) => setCalcValues(prev => ({...prev, bonus: e.target.value}))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    const base = Number(calcValues.base) || 0;
                    const signing = Number(calcValues.signing) || 0;
                    const stock = Number(calcValues.stock) || 0;
                    const bonus = Number(calcValues.bonus) || 0;
                    const totalYear1 = base + signing + (stock / 4) + (base * bonus / 100);
                    if (base === 0) {
                      info('Please enter at least a base salary to calculate.');
                      return;
                    }
                    success(`Year 1 Total Comp: ${formatCurrency(Math.round(totalYear1))}`);
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors mt-4"
                >
                  Calculate Total Comp
                </button>
              </div>
            </div>

            <div>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-6">Cost of Living Comparison</h3>
                <div className="space-y-3">
                  {COST_OF_LIVING.map((city, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{city.city}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Rent: ${city.avgRent}/mo</span>
                        <span className={`text-sm font-medium ${
                          city.index > 120 ? 'text-red-400' : city.index < 110 ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {city.index}% COL
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20 p-6">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-400" />
                  Pro Tip
                </h4>
                <p className="text-gray-300 text-sm">
                  A $150K salary in Austin, TX has roughly the same buying power as $200K in San Francisco.
                  Always factor in cost of living when comparing offers!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl border border-green-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Got an Offer? Let's Maximize It</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Our career advisors have helped students negotiate an average of 15% more in total compensation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => info('Career advisor matching is coming soon!')} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <MessageSquare className="w-5 h-5" />
              Talk to an Advisor
            </button>
            <Link
              to="/college/offer-compare"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Compare Offers
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryNegotiationPage;
