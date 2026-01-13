// ===========================================
// Internship & Co-op Finder Page - College Students
// Find the right experience for your goals
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  ChevronRight,
  Star,
  Clock,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'co-op';
  duration: string;
  pay: string;
  deadline: string;
  season: 'summer' | 'fall' | 'spring' | 'year-round';
  field: string;
  remote: boolean;
  sponsorship: boolean;
  returnRate: number;
  housing: boolean;
  description: string;
}

interface TimelineItem {
  month: string;
  action: string;
  target: string;
  tips: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================
const INTERNSHIPS: Internship[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Multiple Locations',
    type: 'internship',
    duration: '12 weeks',
    pay: '$45-55/hr',
    deadline: 'Rolling (Sep-Mar)',
    season: 'summer',
    field: 'Software',
    remote: false,
    sponsorship: true,
    returnRate: 85,
    housing: true,
    description: 'Work on products used by billions with a team of world-class engineers.',
  },
  {
    id: '2',
    title: 'STEP Intern (Freshman/Sophomore)',
    company: 'Google',
    location: 'Multiple Locations',
    type: 'internship',
    duration: '12 weeks',
    pay: '$40-45/hr',
    deadline: 'Oct-Dec',
    season: 'summer',
    field: 'Software',
    remote: false,
    sponsorship: true,
    returnRate: 80,
    housing: true,
    description: 'Early career program for first and second year students new to CS.',
  },
  {
    id: '3',
    title: 'Hardware Engineering Co-op',
    company: 'Intel',
    location: 'Hillsboro, OR',
    type: 'co-op',
    duration: '6 months',
    pay: '$35-45/hr',
    deadline: 'Rolling',
    season: 'year-round',
    field: 'Hardware',
    remote: false,
    sponsorship: true,
    returnRate: 75,
    housing: false,
    description: 'Design and validate next-generation processors and chipsets.',
  },
  {
    id: '4',
    title: 'Data Science Intern',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'internship',
    duration: '12 weeks',
    pay: '$50-60/hr',
    deadline: 'Sep-Jan',
    season: 'summer',
    field: 'Data Science',
    remote: false,
    sponsorship: true,
    returnRate: 88,
    housing: true,
    description: 'Apply ML and statistical analysis to improve user experience.',
  },
  {
    id: '5',
    title: 'Pathways Intern',
    company: 'NASA',
    location: 'Multiple Centers',
    type: 'internship',
    duration: '10-16 weeks',
    pay: '$22-35/hr',
    deadline: 'Mar & Oct',
    season: 'summer',
    field: 'Aerospace',
    remote: false,
    sponsorship: false,
    returnRate: 70,
    housing: false,
    description: 'Work on missions that explore the universe and advance aeronautics.',
  },
  {
    id: '6',
    title: 'Research Intern - AI',
    company: 'Microsoft Research',
    location: 'Redmond, WA',
    type: 'internship',
    duration: '12 weeks',
    pay: '$50+/hr',
    deadline: 'Rolling',
    season: 'summer',
    field: 'Research',
    remote: false,
    sponsorship: true,
    returnRate: 65,
    housing: true,
    description: 'Conduct cutting-edge AI research with world-renowned scientists.',
  },
  {
    id: '7',
    title: 'Cybersecurity Co-op',
    company: 'Raytheon',
    location: 'Multiple Locations',
    type: 'co-op',
    duration: '6 months',
    pay: '$30-40/hr',
    deadline: 'Rolling',
    season: 'year-round',
    field: 'Cybersecurity',
    remote: false,
    sponsorship: false,
    returnRate: 78,
    housing: false,
    description: 'Protect critical infrastructure and develop secure systems.',
  },
  {
    id: '8',
    title: 'Biotech Research Intern',
    company: 'Genentech',
    location: 'South San Francisco, CA',
    type: 'internship',
    duration: '12 weeks',
    pay: '$35-45/hr',
    deadline: 'Jan-Mar',
    season: 'summer',
    field: 'Biotech',
    remote: false,
    sponsorship: true,
    returnRate: 72,
    housing: true,
    description: 'Contribute to breakthrough therapies in oncology and immunology.',
  },
];

const APPLICATION_TIMELINE: TimelineItem[] = [
  {
    month: 'August',
    action: 'Prepare materials',
    target: 'Summer internships',
    tips: ['Update resume', 'Practice LeetCode', 'Research target companies'],
  },
  {
    month: 'September',
    action: 'Apply to Big Tech',
    target: 'Google, Meta, Amazon, etc.',
    tips: ['Submit within first 2 weeks of opening', 'Early bird advantage'],
  },
  {
    month: 'October-November',
    action: 'Interview season',
    target: 'Multiple companies',
    tips: ['Schedule interviews strategically', 'Mock interview practice'],
  },
  {
    month: 'December-January',
    action: 'Continue applying',
    target: 'Mid-size companies, startups',
    tips: ['Many companies hire through March', "Don't stop if no offer yet"],
  },
  {
    month: 'February-March',
    action: 'Final applications',
    target: 'Late recruiters, gov programs',
    tips: ['NASA, DoE deadlines often here', 'Backup options'],
  },
];

// ===========================================
// COMPONENT
// ===========================================
const InternshipFinderPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    season: 'all',
    field: 'all',
    remote: false,
    sponsorship: false,
    housing: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredInternships = useMemo(() => {
    return INTERNSHIPS.filter(internship => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type === 'all' || internship.type === filters.type;
      const matchesSeason = filters.season === 'all' || internship.season === filters.season;
      const matchesField = filters.field === 'all' || internship.field === filters.field;
      const matchesRemote = !filters.remote || internship.remote;
      const matchesSponsorship = !filters.sponsorship || internship.sponsorship;
      const matchesHousing = !filters.housing || internship.housing;

      return matchesSearch && matchesType && matchesSeason && matchesField &&
             matchesRemote && matchesSponsorship && matchesHousing;
    });
  }, [searchQuery, filters]);

  const fields = [...new Set(INTERNSHIPS.map(i => i.field))];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Link to="/college/career-launch" className="hover:underline">Career Launch</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Internship Finder</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Internship & Co-op
            <span className="text-blue-400"> Finder</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            Find the perfect internship or co-op to launch your career. Browse 5,000+ opportunities
            at top tech companies, startups, national labs, and government agencies.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by company, role, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gray-900/80 rounded-xl border border-gray-700">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="internship">Internship</option>
                    <option value="co-op">Co-op</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Season</label>
                  <select
                    value={filters.season}
                    onChange={(e) => setFilters({...filters, season: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Seasons</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="spring">Spring</option>
                    <option value="year-round">Year-Round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Field</label>
                  <select
                    value={filters.field}
                    onChange={(e) => setFilters({...filters, field: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Fields</option>
                    {fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sponsorship}
                      onChange={(e) => setFilters({...filters, sponsorship: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">Visa Sponsorship</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.housing}
                      onChange={(e) => setFilters({...filters, housing: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">Housing Provided</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">Remote Option</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Internship Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {filteredInternships.length} Opportunities Found
              </h2>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                <option>Sort by: Deadline</option>
                <option>Sort by: Pay</option>
                <option>Sort by: Company</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredInternships.map(internship => (
                <div
                  key={internship.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{internship.title}</h3>
                        {internship.housing && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded">Housing</span>
                        )}
                        {internship.sponsorship && (
                          <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded">Visa OK</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {internship.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {internship.pay}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      internship.type === 'co-op'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {internship.type === 'co-op' ? 'Co-op' : 'Internship'}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{internship.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {internship.duration}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {internship.deadline}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      {internship.returnRate}% return offer rate
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <span className="text-sm text-gray-500">{internship.field}</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                      Apply Now <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Timeline */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Application Timeline
              </h3>
              <div className="space-y-4">
                {APPLICATION_TIMELINE.map((item, i) => (
                  <div key={i} className="relative pl-6 pb-4 border-l-2 border-gray-700 last:border-l-transparent">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                    <div className="text-sm font-medium text-blue-400">{item.month}</div>
                    <div className="text-white font-medium">{item.action}</div>
                    <div className="text-sm text-gray-400">{item.target}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Internship Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Average hourly pay', value: '$35-55/hr', icon: DollarSign },
                  { label: 'Typical duration', value: '10-12 weeks', icon: Clock },
                  { label: 'Return offer rate', value: '70-85%', icon: TrendingUp },
                  { label: 'Companies hiring', value: '500+', icon: Building2 },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-400">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </span>
                    <span className="text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Co-op vs Internship */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Co-op vs Internship</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">Internship</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li>• 10-12 weeks, typically summer</li>
                    <li>• Explore different companies/roles</li>
                    <li>• Graduate on time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-400 mb-1">Co-op</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li>• 4-8 months, multiple rotations</li>
                    <li>• Deeper experience at one company</li>
                    <li>• May extend graduation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Resume Tips for Internships', link: '/college/resume-builder' },
                  { label: 'Technical Interview Prep', link: '/college/interview-prep' },
                  { label: 'First-Year Programs', link: '#' },
                ].map((resource, i) => (
                  <li key={i}>
                    <Link
                      to={resource.link}
                      className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                    >
                      {resource.label}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipFinderPage;
