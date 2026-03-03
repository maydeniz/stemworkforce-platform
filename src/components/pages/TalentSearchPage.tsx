import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Users,
  MapPin,
  Shield,
  Briefcase,
  GraduationCap,
  Filter,
  Star,
  Zap,
  Clock,
  ChevronDown,
  ArrowRight,
  Building,
  CheckCircle,
} from 'lucide-react';

// ===========================================
// Talent Search / Browse Candidates - Employer Tool
// ===========================================

const INDUSTRIES = [
  'All Industries',
  'Semiconductor',
  'Nuclear Energy',
  'AI & Machine Learning',
  'Quantum Computing',
  'Cybersecurity',
  'Aerospace & Defense',
  'Biotechnology',
  'Clean Energy',
  'Robotics & Automation',
  'Advanced Manufacturing',
];

const CLEARANCE_LEVELS = [
  'Any Clearance',
  'No Clearance Required',
  'Public Trust',
  'Secret',
  'Top Secret',
  'TS/SCI',
  'DOE L',
  'DOE Q',
];

const EXPERIENCE_LEVELS = [
  'All Levels',
  'Student / Intern',
  'Entry Level (0-2 years)',
  'Mid Level (3-7 years)',
  'Senior (8-15 years)',
  'Executive (15+ years)',
];

interface CandidateProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  industry: string;
  experience: string;
  clearance: string;
  skills: string[];
  education: string;
  available: boolean;
  matchScore: number;
}

const SAMPLE_CANDIDATES: CandidateProfile[] = [
  {
    id: '1',
    name: 'A. Martinez',
    title: 'Semiconductor Process Engineer',
    location: 'Phoenix, AZ',
    industry: 'Semiconductor',
    experience: 'Mid Level (3-7 years)',
    clearance: 'Secret',
    skills: ['Photolithography', 'Yield Analysis', 'Python', 'SPC', 'FMEA'],
    education: 'M.S. Materials Science, Arizona State',
    available: true,
    matchScore: 96,
  },
  {
    id: '2',
    name: 'J. Chen',
    title: 'ML Research Scientist',
    location: 'San Francisco, CA',
    industry: 'AI & Machine Learning',
    experience: 'Senior (8-15 years)',
    clearance: 'No Clearance Required',
    skills: ['PyTorch', 'Transformers', 'NLP', 'Computer Vision', 'MLOps'],
    education: 'Ph.D. Computer Science, Stanford',
    available: true,
    matchScore: 94,
  },
  {
    id: '3',
    name: 'R. Thompson',
    title: 'Nuclear Systems Engineer',
    location: 'Oak Ridge, TN',
    industry: 'Nuclear Energy',
    experience: 'Senior (8-15 years)',
    clearance: 'DOE Q',
    skills: ['Reactor Design', 'MCNP', 'NRC Regulations', 'Thermal Hydraulics'],
    education: 'M.S. Nuclear Engineering, MIT',
    available: false,
    matchScore: 91,
  },
  {
    id: '4',
    name: 'S. Patel',
    title: 'Cybersecurity Architect',
    location: 'Washington, DC',
    industry: 'Cybersecurity',
    experience: 'Senior (8-15 years)',
    clearance: 'TS/SCI',
    skills: ['CISSP', 'Zero Trust', 'NIST 800-53', 'Incident Response', 'SIEM'],
    education: 'B.S. Computer Science, Georgia Tech',
    available: true,
    matchScore: 89,
  },
  {
    id: '5',
    name: 'K. Williams',
    title: 'Quantum Software Engineer',
    location: 'Boulder, CO',
    industry: 'Quantum Computing',
    experience: 'Mid Level (3-7 years)',
    clearance: 'Secret',
    skills: ['Qiskit', 'Cirq', 'Python', 'Linear Algebra', 'Error Correction'],
    education: 'Ph.D. Physics, CU Boulder',
    available: true,
    matchScore: 87,
  },
  {
    id: '6',
    name: 'M. Davis',
    title: 'Aerospace Systems Engineer',
    location: 'Huntsville, AL',
    industry: 'Aerospace & Defense',
    experience: 'Mid Level (3-7 years)',
    clearance: 'Top Secret',
    skills: ['MBSE', 'SysML', 'Requirements Management', 'V&V', 'DOORS'],
    education: 'M.S. Aerospace Engineering, Purdue',
    available: true,
    matchScore: 85,
  },
];

const PLATFORM_STATS = [
  { label: 'Candidate Profiles', value: '125K+', icon: Users },
  { label: 'Cleared Professionals', value: '34K+', icon: Shield },
  { label: 'STEM Sectors', value: '11', icon: Zap },
  { label: 'Avg Match Time', value: '< 48hrs', icon: Clock },
];

export default function TalentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedClearance, setSelectedClearance] = useState('Any Clearance');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = SAMPLE_CANDIDATES.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All Industries' || c.industry === selectedIndustry;
    const matchesClearance = selectedClearance === 'Any Clearance' || c.clearance === selectedClearance;
    const matchesExperience = selectedExperience === 'All Levels' || c.experience === selectedExperience;
    return matchesSearch && matchesIndustry && matchesClearance && matchesExperience;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users size={24} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold">Browse Candidates</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Search our vetted STEM talent pool across 11 emerging technology sectors. Filter by clearance level, experience, skills, and location.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <stat.icon size={18} className="mx-auto text-blue-400 mb-2" />
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
                placeholder="Search by skill, role, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Industry Sector</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Clearance Level</label>
                <select
                  value={selectedClearance}
                  onChange={(e) => setSelectedClearance(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {CLEARANCE_LEVELS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Experience Level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {EXPERIENCE_LEVELS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-300">
            {filtered.length} Candidate{filtered.length !== 1 ? 's' : ''} Found
          </h2>
          <span className="text-xs text-slate-500">Sorted by match score</span>
        </div>

        <div className="space-y-4">
          {filtered.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    {candidate.available ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                        <CheckCircle size={10} /> Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">
                        Passive
                      </span>
                    )}
                  </div>
                  <p className="text-blue-400 font-medium text-sm">{candidate.title}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {candidate.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={12} /> {candidate.clearance}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} /> {candidate.education}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{candidate.matchScore}%</div>
                    <div className="text-xs text-slate-500">Match Score</div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg text-slate-400">No candidates match your filters</p>
            <p className="text-sm text-slate-500 mt-1">Try broadening your search criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('All Industries');
                setSelectedClearance('Any Clearance');
                setSelectedExperience('All Levels');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Employer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Need More Hiring Support?</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Post jobs, launch innovation challenges, or connect with specialized STEM recruiters to fill critical roles faster.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard?action=post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <Briefcase size={18} /> Post a Job
            </Link>
            <Link
              to="/challenges/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Star size={18} /> Post a Challenge
            </Link>
            <Link
              to="/service-providers?type=recruiter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Building size={18} /> Find Recruiters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
