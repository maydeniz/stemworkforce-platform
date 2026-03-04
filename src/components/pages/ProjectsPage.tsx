import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  DollarSign,
  Clock,
  Shield,
  Building,
  Zap,
  Users,
  Star,
} from 'lucide-react';

// ===========================================
// Browse Projects - Service Provider Marketplace
// ===========================================

const CATEGORIES = [
  'All Categories',
  'Recruiting & Staffing',
  'Career Coaching',
  'Training & Upskilling',
  'Clearance Processing',
  'Consulting',
  'Technical Assessment',
  'Workforce Planning',
];

const INDUSTRIES = [
  'All Industries',
  'Semiconductor',
  'Nuclear Technologies',
  'AI & Machine Learning',
  'Cybersecurity',
  'Aerospace & Defense',
  'Clean Energy',
  'Quantum Computing',
  'Biotechnology',
  'Robotics & Automation',
];

interface Project {
  id: string;
  title: string;
  organization: string;
  category: string;
  industry: string;
  description: string;
  budget: string;
  duration: string;
  location: string;
  clearance: string;
  skills: string[];
  posted: string;
  urgent: boolean;
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Semiconductor Workforce Recruiting Campaign',
    organization: 'Major Semiconductor Fab',
    category: 'Recruiting & Staffing',
    industry: 'Semiconductor',
    description: 'Seeking STEM recruiting firm to fill 50+ fab technician and process engineer roles for new CHIPS Act-funded facility. Must have semiconductor industry experience.',
    budget: '$150K - $250K',
    duration: '6 months',
    location: 'Phoenix, AZ',
    clearance: 'None required',
    skills: ['STEM Recruiting', 'Semiconductor', 'Volume Hiring', 'Technical Assessment'],
    posted: '2 days ago',
    urgent: true,
  },
  {
    id: '2',
    title: 'Cybersecurity Training Program Development',
    organization: 'Defense Contractor',
    category: 'Training & Upskilling',
    industry: 'Cybersecurity',
    description: 'Design and deliver a cybersecurity upskilling program for 200+ employees. Must cover NIST 800-53, Zero Trust, and CMMC 2.0 compliance requirements.',
    budget: '$80K - $120K',
    duration: '4 months',
    location: 'Remote',
    clearance: 'Secret required',
    skills: ['Cybersecurity Training', 'NIST Frameworks', 'CMMC', 'Curriculum Design'],
    posted: '5 days ago',
    urgent: false,
  },
  {
    id: '3',
    title: 'Nuclear Engineering Career Coaching',
    organization: 'DOE National Laboratory',
    category: 'Career Coaching',
    industry: 'Nuclear Technologies',
    description: 'Provide career coaching and development planning for early-career nuclear engineers (20 participants). Include clearance preparation guidance.',
    budget: '$40K - $60K',
    duration: '3 months',
    location: 'Oak Ridge, TN / Hybrid',
    clearance: 'DOE Q preferred',
    skills: ['Career Coaching', 'Nuclear Engineering', 'Clearance Process', 'Leadership Development'],
    posted: '1 week ago',
    urgent: false,
  },
  {
    id: '4',
    title: 'AI/ML Technical Assessment Platform',
    organization: 'Enterprise Tech Company',
    category: 'Technical Assessment',
    industry: 'AI & Machine Learning',
    description: 'Build and administer technical assessment program for ML engineer hiring pipeline. Need validated coding challenges, system design evaluations, and ML-specific assessments.',
    budget: '$60K - $90K',
    duration: '2 months',
    location: 'Remote',
    clearance: 'None required',
    skills: ['Technical Assessment', 'ML Engineering', 'Hiring Pipeline', 'Psychometrics'],
    posted: '3 days ago',
    urgent: true,
  },
  {
    id: '5',
    title: 'Cleared Workforce Staffing - Aerospace Program',
    organization: 'Prime Aerospace Contractor',
    category: 'Recruiting & Staffing',
    industry: 'Aerospace & Defense',
    description: 'Staff 25 cleared systems engineers and software developers for classified satellite program. All candidates must hold active TS/SCI clearance.',
    budget: '$200K - $350K',
    duration: '8 months',
    location: 'El Segundo, CA',
    clearance: 'TS/SCI required',
    skills: ['Cleared Staffing', 'Systems Engineering', 'Aerospace', 'TS/SCI Candidates'],
    posted: '1 day ago',
    urgent: true,
  },
  {
    id: '6',
    title: 'Clean Energy Workforce Planning Study',
    organization: 'State Workforce Board',
    category: 'Workforce Planning',
    industry: 'Clean Energy',
    description: 'Conduct comprehensive workforce analysis for state clean energy sector. Identify skill gaps, training needs, and employer demand across solar, wind, and EV battery industries.',
    budget: '$75K - $100K',
    duration: '3 months',
    location: 'Colorado',
    clearance: 'None required',
    skills: ['Workforce Planning', 'Labor Market Analysis', 'Clean Energy', 'Policy Research'],
    posted: '4 days ago',
    urgent: false,
  },
];

const STATS = [
  { label: 'Active Projects', value: '340+', icon: Briefcase },
  { label: 'Total Value', value: '$28M+', icon: DollarSign },
  { label: 'Organizations', value: '180+', icon: Building },
  { label: 'Active Providers', value: '520+', icon: Users },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = SAMPLE_PROJECTS.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'All Industries' || p.industry === selectedIndustry;
    return matchesSearch && matchesCategory && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Briefcase size={24} className="text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold">Browse Projects</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Find STEM workforce projects from employers, national labs, government agencies, and defense contractors. Bid on recruiting, training, consulting, and workforce development opportunities.
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <stat.icon size={18} className="mx-auto text-purple-400 mb-2" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by keyword, skill, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm hover:bg-slate-700 transition-colors"
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-300">
            {filtered.length} Project{filtered.length !== 1 ? 's' : ''} Available
          </h2>
        </div>

        <div className="space-y-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.urgent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                        <Zap size={10} /> Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{project.organization}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-bold text-sm">{project.budget}</div>
                  <div className="text-xs text-slate-500">{project.posted}</div>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4">{project.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {project.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Shield size={12} /> {project.clearance}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                  {project.category}
                </span>
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                  {project.industry}
                </span>
                {project.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                    {skill}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="text-xs text-slate-500">+{project.skills.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg text-slate-400">No projects match your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedIndustry('All Industries');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Provider CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Ready to Win More Projects?</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Join our provider network to access exclusive STEM workforce projects from top employers, national labs, and government agencies.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/become-a-provider"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              <Star size={18} /> Become a Provider
            </Link>
            <Link
              to="/provider-resources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Briefcase size={18} /> Provider Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
