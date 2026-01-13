// ===========================================
// Fellowship Finder Page - College Students
// NSF GRFP, Hertz, Ford & 200+ more
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  Calendar,
  DollarSign,
  Filter,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Star,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Fellowship {
  id: string;
  name: string;
  organization: string;
  amount: string;
  duration: string;
  deadline: string;
  eligibility: string[];
  fields: string[];
  benefits: string[];
  competitiveness: 'very-high' | 'high' | 'moderate';
  citizenshipReq: 'us-only' | 'permanent-resident' | 'international';
  featured: boolean;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const FELLOWSHIPS: Fellowship[] = [
  {
    id: '1',
    name: 'NSF Graduate Research Fellowship',
    organization: 'National Science Foundation',
    amount: '$37,000/year + $16,000 tuition',
    duration: '3 years',
    deadline: 'October (varies by field)',
    eligibility: ['US Citizen or Permanent Resident', 'Early-stage graduate or senior undergrad', 'STEM field'],
    fields: ['All STEM fields', 'Social Sciences'],
    benefits: ['Stipend', 'Tuition allowance', 'Research flexibility', 'Prestige'],
    competitiveness: 'very-high',
    citizenshipReq: 'permanent-resident',
    featured: true,
  },
  {
    id: '2',
    name: 'Hertz Foundation Fellowship',
    organization: 'Hertz Foundation',
    amount: '$250,000+ total',
    duration: '5 years',
    deadline: 'October 25',
    eligibility: ['US Citizen or Permanent Resident', 'PhD applicant', 'Applied sciences focus'],
    fields: ['Applied Physical Sciences', 'Engineering', 'Math'],
    benefits: ['Full tuition', 'Stipend', 'Lifetime community', 'Flexibility'],
    competitiveness: 'very-high',
    citizenshipReq: 'permanent-resident',
    featured: true,
  },
  {
    id: '3',
    name: 'Ford Foundation Fellowship',
    organization: 'Ford Foundation',
    amount: '$27,000/year',
    duration: '3 years',
    deadline: 'December',
    eligibility: ['US Citizen', 'PhD student', 'Commitment to diversity in academia'],
    fields: ['All academic fields'],
    benefits: ['Stipend', 'Conference support', 'Mentoring'],
    competitiveness: 'high',
    citizenshipReq: 'us-only',
    featured: true,
  },
  {
    id: '4',
    name: 'DOE SCGSR Fellowship',
    organization: 'Department of Energy',
    amount: '$3,200/month + travel',
    duration: '3-12 months',
    deadline: 'May & November',
    eligibility: ['US Citizen', 'PhD candidate', 'Research at DOE labs'],
    fields: ['Energy Sciences', 'Nuclear', 'Physics', 'Materials'],
    benefits: ['Stipend', 'Travel', 'Lab access', 'Mentorship'],
    competitiveness: 'moderate',
    citizenshipReq: 'us-only',
    featured: false,
  },
  {
    id: '5',
    name: 'Paul & Daisy Soros Fellowship',
    organization: 'Soros Foundation',
    amount: '$90,000 total',
    duration: '2 years',
    deadline: 'October 28',
    eligibility: ['New American (immigrant or child of immigrants)', 'Graduate student'],
    fields: ['All fields'],
    benefits: ['Tuition', 'Stipend', 'Community'],
    competitiveness: 'very-high',
    citizenshipReq: 'permanent-resident',
    featured: false,
  },
  {
    id: '6',
    name: 'Fulbright US Student Program',
    organization: 'US State Department',
    amount: 'Full funding',
    duration: '1 year',
    deadline: 'October',
    eligibility: ['US Citizen', 'Bachelor degree holder', 'Research/study abroad'],
    fields: ['All fields'],
    benefits: ['Full funding', 'Travel', 'Healthcare', 'Cultural exchange'],
    competitiveness: 'high',
    citizenshipReq: 'us-only',
    featured: false,
  },
  {
    id: '7',
    name: 'NDSEG Fellowship',
    organization: 'Department of Defense',
    amount: '$38,400/year',
    duration: '3 years',
    deadline: 'December',
    eligibility: ['US Citizen', 'STEM PhD student', 'Early stage'],
    fields: ['DoD priority areas', 'STEM'],
    benefits: ['Stipend', 'Full tuition', 'Health insurance'],
    competitiveness: 'high',
    citizenshipReq: 'us-only',
    featured: false,
  },
];

const DEADLINE_CALENDAR = [
  { month: 'October', fellowships: ['NSF GRFP', 'Hertz', 'Soros', 'Fulbright'] },
  { month: 'November', fellowships: ['DOE SCGSR', 'Gates Cambridge'] },
  { month: 'December', fellowships: ['Ford Foundation', 'NDSEG', 'Knight-Hennessy'] },
  { month: 'January', fellowships: ['Rhodes', 'Marshall', 'Churchill'] },
];

// ===========================================
// COMPONENT
// ===========================================
const FellowshipFinderPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    citizenship: 'all',
    competitiveness: 'all',
    field: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredFellowships = useMemo(() => {
    return FELLOWSHIPS.filter(f => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCitizenship =
        filters.citizenship === 'all' || f.citizenshipReq === filters.citizenship;
      const matchesCompetitiveness =
        filters.competitiveness === 'all' || f.competitiveness === filters.competitiveness;
      return matchesSearch && matchesCitizenship && matchesCompetitiveness;
    });
  }, [searchQuery, filters]);

  const featuredFellowships = filteredFellowships.filter(f => f.featured);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-gray-950 to-amber-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-yellow-400 mb-4">
            <Link to="/college/grad-school-prep" className="hover:underline">Graduate & Research</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Fellowship Finder</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Fellowship
                <span className="text-yellow-400"> Finder</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Find prestigious fellowships to fund your graduate education.
                NSF GRFP, Hertz, Ford, and 200+ more opportunities.
              </p>

              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search fellowships..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-700"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-gray-900/80 rounded-xl border border-gray-700 grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Citizenship</label>
                    <select
                      value={filters.citizenship}
                      onChange={(e) => setFilters({...filters, citizenship: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">All</option>
                      <option value="us-only">US Citizens Only</option>
                      <option value="permanent-resident">US/Permanent Residents</option>
                      <option value="international">International OK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Competitiveness</label>
                    <select
                      value={filters.competitiveness}
                      onChange={(e) => setFilters({...filters, competitiveness: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="very-high">Very High</option>
                      <option value="high">High</option>
                      <option value="moderate">Moderate</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                {DEADLINE_CALENDAR.map((item, i) => (
                  <div key={i}>
                    <div className="text-sm font-medium text-yellow-400 mb-2">{item.month}</div>
                    <div className="flex flex-wrap gap-2">
                      {item.fellowships.map((f, j) => (
                        <span key={j} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Fellowships */}
        {featuredFellowships.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Most Prestigious Fellowships
            </h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {featuredFellowships.map(fellowship => (
                <div
                  key={fellowship.id}
                  className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-xl border border-yellow-500/20 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      fellowship.competitiveness === 'very-high' ? 'bg-red-500/10 text-red-400' :
                      fellowship.competitiveness === 'high' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {fellowship.competitiveness.replace('-', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{fellowship.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{fellowship.organization}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-green-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {fellowship.amount}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {fellowship.duration}
                    </p>
                    <p className="text-yellow-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Deadline: {fellowship.deadline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {fellowship.fields.slice(0, 2).map((field, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                        {field}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Fellowships */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            All Fellowships ({filteredFellowships.length})
          </h2>
          <div className="space-y-4">
            {filteredFellowships.map(fellowship => (
              <div
                key={fellowship.id}
                className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{fellowship.name}</h3>
                        <p className="text-gray-400">{fellowship.organization}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          fellowship.citizenshipReq === 'us-only' ? 'bg-blue-500/10 text-blue-400' :
                          fellowship.citizenshipReq === 'permanent-resident' ? 'bg-green-500/10 text-green-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {fellowship.citizenshipReq === 'us-only' ? 'US Citizens' :
                           fellowship.citizenshipReq === 'permanent-resident' ? 'US/PR' : 'International'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          fellowship.competitiveness === 'very-high' ? 'bg-red-500/10 text-red-400' :
                          fellowship.competitiveness === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {fellowship.competitiveness.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Amount</span>
                        <p className="text-green-400 font-medium">{fellowship.amount}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Duration</span>
                        <p className="text-white">{fellowship.duration}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Deadline</span>
                        <p className="text-yellow-400">{fellowship.deadline}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Eligibility</span>
                      <ul className="mt-2 space-y-1">
                        {fellowship.eligibility.map((req, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3">
                    <button className="flex-1 lg:flex-none px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      Apply <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="flex-1 lg:flex-none px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              Application Tips
            </h3>
            <ul className="space-y-4">
              {[
                'Start 3-6 months before deadlines',
                'Get feedback from multiple readers',
                'Tailor essays to each fellowship',
                'Research past recipients',
                'Apply to multiple fellowships',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Common Mistakes
            </h3>
            <ul className="space-y-4">
              {[
                "Waiting until the last minute",
                'Generic essays not tailored to fellowship',
                'Underselling your accomplishments',
                'Not explaining research impact clearly',
                'Forgetting to mention broader impacts',
              ].map((mistake, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-xs flex-shrink-0">✕</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-2xl border border-yellow-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help With Applications?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get personalized feedback on your fellowship essays from our AI coach and past fellowship recipients.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/sop-coach"
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Essay Coach
            </Link>
            <Link
              to="/college/grad-school-prep"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Grad School Prep
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FellowshipFinderPage;
