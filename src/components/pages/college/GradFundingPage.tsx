// ===========================================
// Graduate Funding Search Page - College Students
// TA/RA positions & external funding
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  CheckCircle,
  Calendar,
  Star,
  Users,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface FundingSource {
  id: string;
  name: string;
  type: 'ta' | 'ra' | 'fellowship' | 'grant';
  amount: string;
  source: string;
  deadline?: string;
  description: string;
  covers: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================
const FUNDING_SOURCES: FundingSource[] = [
  {
    id: '1',
    name: 'Teaching Assistantship',
    type: 'ta',
    amount: '$25,000-35,000/year',
    source: 'University Department',
    description: 'Assist professors with courses in exchange for stipend and tuition waiver.',
    covers: ['Tuition waiver', 'Monthly stipend', 'Health insurance', 'Fee reduction'],
  },
  {
    id: '2',
    name: 'Research Assistantship',
    type: 'ra',
    amount: '$28,000-40,000/year',
    source: 'Faculty Research Grants',
    description: 'Work on faculty research projects. Often preferred as no teaching duties.',
    covers: ['Tuition waiver', 'Monthly stipend', 'Health insurance', 'Conference travel'],
  },
  {
    id: '3',
    name: 'NSF Graduate Research Fellowship',
    type: 'fellowship',
    amount: '$37,000/year + $16,000 tuition',
    source: 'National Science Foundation',
    deadline: 'October',
    description: 'Prestigious 3-year fellowship for US citizens/residents in STEM.',
    covers: ['Stipend', 'Tuition allowance', 'Research flexibility'],
  },
  {
    id: '4',
    name: 'DOE SCGSR Program',
    type: 'grant',
    amount: '$3,200/month + travel',
    source: 'Department of Energy',
    deadline: 'May & November',
    description: 'Funding to conduct research at DOE national laboratories.',
    covers: ['Monthly stipend', 'Travel costs', 'Lab access'],
  },
  {
    id: '5',
    name: 'Industry Fellowship',
    type: 'fellowship',
    amount: '$40,000-60,000/year',
    source: 'Tech Companies (Google, Microsoft, etc.)',
    deadline: 'Varies by company',
    description: 'Corporate fellowships often with internship component.',
    covers: ['Stipend', 'Internship opportunity', 'Mentorship', 'Equipment'],
  },
  {
    id: '6',
    name: 'University Fellowship',
    type: 'fellowship',
    amount: '$30,000-45,000/year',
    source: 'Graduate School',
    deadline: 'With admission',
    description: 'Merit-based fellowships awarded at admission. No teaching required.',
    covers: ['Tuition', 'Stipend', 'Health insurance', 'Research funds'],
  },
];

const FUNDING_TIPS = [
  {
    title: 'Apply for external fellowships before starting',
    description: "NSF GRFP, Ford, Hertz - apply senior year. Even if you don't win, applying helps with grad school apps.",
  },
  {
    title: 'Negotiate your offer',
    description: 'If you have competing offers, ask if they can match funding. Many programs have discretionary funds.',
  },
  {
    title: 'Ask about summer funding',
    description: 'TA/RA positions often only cover 9 months. Ask how summer is funded - research grants, fellowships, or self-fund?',
  },
  {
    title: 'Understand the tax implications',
    description: 'Fellowships are taxable income. TA/RA stipends may have taxes withheld. Set aside ~15-20% for taxes.',
  },
  {
    title: 'Look for conference travel grants',
    description: 'Professional societies and your department often have funds for conference travel. Apply early!',
  },
];

const DEPARTMENT_QUESTIONS = [
  'What percentage of PhD students are fully funded?',
  'Is summer funding guaranteed or do I need to find it?',
  'How long is funding typically guaranteed?',
  'What is the health insurance situation?',
  'Are there teaching requirements, and for how long?',
  'What additional funding opportunities exist (travel, research)?',
];

// ===========================================
// COMPONENT
// ===========================================
const GradFundingPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const types = [
    { id: 'all', label: 'All Sources' },
    { id: 'ta', label: 'Teaching' },
    { id: 'ra', label: 'Research' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'grant', label: 'Grants' },
  ];

  const filteredFunding = FUNDING_SOURCES.filter(f => {
    const matchesType = selectedType === 'all' || f.type === selectedType;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-cyan-400 mb-4">
            <Link to="/college/government-careers" className="hover:underline">Government & Finance</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Graduate Funding</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Graduate Funding
              <span className="text-cyan-400"> Search</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore TA/RA positions, fellowships, grants, and other funding sources
              for your graduate education. Most STEM PhD students are fully funded!
            </p>

            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search funding sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Funding Sources */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6">
              {filteredFunding.length} Funding Sources
            </h2>

            <div className="space-y-6">
              {filteredFunding.map(funding => (
                <div
                  key={funding.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{funding.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          funding.type === 'ta' ? 'bg-blue-500/10 text-blue-400' :
                          funding.type === 'ra' ? 'bg-green-500/10 text-green-400' :
                          funding.type === 'fellowship' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {funding.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{funding.source}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-cyan-400">{funding.amount}</div>
                      {funding.deadline && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          Deadline: {funding.deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{funding.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {funding.covers.map((item, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Funding Facts</h3>
              <div className="space-y-4">
                {[
                  { label: 'STEM PhD funding rate', value: '95%+' },
                  { label: 'Avg. PhD stipend', value: '$30-40K' },
                  { label: 'External fellowship boost', value: '+$5-15K' },
                  { label: 'Typical package', value: '5-6 years' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask */}
            <div className="bg-cyan-500/5 rounded-xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Questions for Departments
              </h3>
              <ul className="space-y-3">
                {DEPARTMENT_QUESTIONS.map((q, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fellowship Finder Link */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20 p-6">
              <Star className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Looking for Fellowships?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Browse our database of 200+ STEM fellowships including NSF GRFP, Hertz, Ford, and more.
              </p>
              <Link
                to="/college/fellowships"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
              >
                Fellowship Finder <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Funding Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FUNDING_TIPS.map((tip, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold mb-4">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-white mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-400">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Plan Your Graduate Finances</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Understand the full financial picture of graduate school with our calculators and guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/fellowships"
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Star className="w-5 h-5" />
              Fellowship Finder
            </Link>
            <Link
              to="/college/loan-strategy"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Loan Strategy
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradFundingPage;
