// ===========================================
// Work-Based Learning Explorer for High School Students
// ===========================================
// Discover co-ops, job shadows, mentorships, and
// hands-on learning experiences that combine
// classroom learning with real-world work
// ===========================================

// Static Tailwind color map for WBL type cards
const wblColors: Record<string, { hoverBorder: string; bg: string; text: string; bgLight: string; borderLight: string }> = {
  blue: { hoverBorder: 'hover:border-blue-500/50', bg: 'bg-blue-500/20', text: 'text-blue-400', bgLight: 'bg-blue-500/10', borderLight: 'border-blue-500/20' },
  purple: { hoverBorder: 'hover:border-purple-500/50', bg: 'bg-purple-500/20', text: 'text-purple-400', bgLight: 'bg-purple-500/10', borderLight: 'border-purple-500/20' },
  emerald: { hoverBorder: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/20', text: 'text-emerald-400', bgLight: 'bg-emerald-500/10', borderLight: 'border-emerald-500/20' },
  teal: { hoverBorder: 'hover:border-teal-500/50', bg: 'bg-teal-500/20', text: 'text-teal-400', bgLight: 'bg-teal-500/10', borderLight: 'border-teal-500/20' },
  yellow: { hoverBorder: 'hover:border-yellow-500/50', bg: 'bg-yellow-500/20', text: 'text-yellow-400', bgLight: 'bg-yellow-500/10', borderLight: 'border-yellow-500/20' },
  rose: { hoverBorder: 'hover:border-rose-500/50', bg: 'bg-rose-500/20', text: 'text-rose-400', bgLight: 'bg-rose-500/10', borderLight: 'border-rose-500/20' },
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  Wrench,
  Beaker,
  Heart,
  ChevronRight,
  ExternalLink,
  Search,
  Handshake,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface WBLProgram {
  id: string;
  type: 'job_shadow' | 'mentorship' | 'coop' | 'service_learning' | 'school_enterprise' | 'clinical';
  title: string;
  organization: string;
  industry: string;
  description: string;
  duration: string;
  commitment: string;
  location: string;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  forGrades: number[];
  benefits: string[];
  requirements: string[];
  skills: string[];
  paid: boolean;
  creditAvailable: boolean;
  applicationProcess: string;
  url?: string;
}

interface WBLType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
  bestFor: string;
  intensity: 'low' | 'medium' | 'high';
  color: string;
  examples: string[];
}

// ===========================================
// Data
// ===========================================

const WBL_TYPES: WBLType[] = [
  {
    id: 'job_shadow',
    title: 'Job Shadowing',
    icon: <Users className="w-6 h-6" />,
    description: 'Observe professionals in their workplace for a day or week. Perfect for exploring careers with minimal commitment.',
    duration: '1-5 days',
    bestFor: 'Career exploration, understanding daily work',
    intensity: 'low',
    color: 'blue',
    examples: ['Shadow an engineer at NASA', 'Spend a day with a hospital surgeon', 'Visit a semiconductor fab with process engineers']
  },
  {
    id: 'mentorship',
    title: 'Career Mentorship',
    icon: <Heart className="w-6 h-6" />,
    description: 'Get paired with a STEM professional who guides your career journey with regular meetings and advice.',
    duration: '3-12 months',
    bestFor: 'Long-term guidance, building relationships',
    intensity: 'low',
    color: 'purple',
    examples: ['FIRST Robotics mentor', 'ACM-W tech mentorship', 'Million Women Mentors STEM']
  },
  {
    id: 'coop',
    title: 'Cooperative Education (Co-op)',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Extended work experience that alternates between school and full-time work. Earn money and credit simultaneously.',
    duration: '1 semester - 1 year',
    bestFor: 'Deep skill building, serious career commitment',
    intensity: 'high',
    color: 'emerald',
    examples: ['Half-day at school, half at employer', 'Summer + school year with same company', 'Earn HS credit while working']
  },
  {
    id: 'service_learning',
    title: 'STEM Service Learning',
    icon: <Handshake className="w-6 h-6" />,
    description: 'Apply STEM skills to solve community problems. Combines academics with meaningful community service.',
    duration: 'Varies (20-100+ hours)',
    bestFor: 'College apps, making a difference',
    intensity: 'medium',
    color: 'teal',
    examples: ['Build websites for nonprofits', 'Environmental monitoring projects', 'STEM tutoring programs']
  },
  {
    id: 'school_enterprise',
    title: 'School-Based Enterprise',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Student-run businesses within schools that produce goods or services for the community.',
    duration: 'School year',
    bestFor: 'Entrepreneurship, business skills',
    intensity: 'medium',
    color: 'yellow',
    examples: ['Student-run 3D printing shop', 'School IT help desk', 'Greenhouse/hydroponics business']
  },
  {
    id: 'clinical',
    title: 'Clinical Experience',
    icon: <Beaker className="w-6 h-6" />,
    description: 'Hands-on healthcare or lab experience in supervised settings. Essential for healthcare career paths.',
    duration: '50-200 hours',
    bestFor: 'Healthcare careers, lab skills',
    intensity: 'high',
    color: 'rose',
    examples: ['Hospital volunteer program', 'Certified Nursing Assistant training', 'Lab technician shadowing']
  },
];

const SAMPLE_PROGRAMS: WBLProgram[] = [
  {
    id: 'nasa-shadow',
    type: 'job_shadow',
    title: 'NASA Engineer Job Shadow Day',
    organization: 'NASA Centers',
    industry: 'Aerospace',
    description: 'Shadow NASA engineers working on spacecraft, rovers, and mission planning. Available at multiple NASA centers during designated shadow days.',
    duration: '1 day',
    commitment: '8 hours',
    location: 'Multiple NASA Centers',
    locationType: 'in-person',
    forGrades: [9, 10, 11, 12],
    benefits: ['See real spacecraft', 'Meet NASA engineers', 'Learn about career paths', 'Get NASA swag'],
    requirements: ['Parent/guardian permission', 'US citizen or permanent resident', 'School approval'],
    skills: ['Career awareness', 'Professional networking', 'STEM exposure'],
    paid: false,
    creditAvailable: false,
    applicationProcess: 'Apply through your school counselor or local NASA center education office',
    url: 'https://www.nasa.gov/learning-resources/for-students/'
  },
  {
    id: 'acm-mentor',
    type: 'mentorship',
    title: 'ACM/ACM-W Student Mentorship Program',
    organization: 'Association for Computing Machinery',
    industry: 'Computer Science',
    description: 'Get matched with a computer science professional who provides guidance on education, careers, and skill development.',
    duration: '6-12 months',
    commitment: '2-4 hours/month',
    location: 'Virtual',
    locationType: 'virtual',
    forGrades: [9, 10, 11, 12],
    benefits: ['Personal guidance', 'Industry connections', 'Resume help', 'College advice'],
    requirements: ['Interest in computing', 'Commitment to regular meetings'],
    skills: ['Career planning', 'Technical guidance', 'Professional development'],
    paid: false,
    creditAvailable: false,
    applicationProcess: 'Apply online through ACM-W or local ACM chapter',
    url: 'https://www.acm.org/'
  },
  {
    id: 'prostart-coop',
    type: 'coop',
    title: 'Manufacturing Co-op Program',
    organization: 'Various Manufacturing Companies',
    industry: 'Advanced Manufacturing',
    description: 'Work part-time at a manufacturing facility while completing high school. Learn CNC machining, robotics, quality control, and more.',
    duration: '1-2 years',
    commitment: '15-20 hours/week',
    location: 'Various',
    locationType: 'in-person',
    forGrades: [11, 12],
    benefits: ['Paid experience', 'Industry credentials', 'Post-graduation job offers', 'College credit'],
    requirements: ['Enrolled in CTE pathway', 'Reliable transportation', 'Minimum age requirements'],
    skills: ['Manufacturing', 'Safety protocols', 'Quality control', 'Technical drawing'],
    paid: true,
    creditAvailable: true,
    applicationProcess: 'Through school CTE coordinator and local manufacturers',
  },
  {
    id: 'code-service',
    type: 'service_learning',
    title: 'Code for Community',
    organization: 'Various Nonprofits',
    industry: 'Technology',
    description: 'Build websites, apps, or technology solutions for local nonprofits and community organizations while earning service hours.',
    duration: '1 semester',
    commitment: '5-10 hours/week',
    location: 'Virtual/Local',
    locationType: 'hybrid',
    forGrades: [9, 10, 11, 12],
    benefits: ['Real portfolio projects', 'Community impact', 'Service hours', 'References'],
    requirements: ['Basic coding skills', 'Commitment to project completion'],
    skills: ['Web development', 'Project management', 'Client communication', 'Problem solving'],
    paid: false,
    creditAvailable: true,
    applicationProcess: 'Connect with local Code for America brigade or school tech club',
  },
  {
    id: 'fablab-enterprise',
    type: 'school_enterprise',
    title: 'FabLab Student Enterprise',
    organization: 'School-Based',
    industry: 'Engineering/Manufacturing',
    description: 'Run a student business using 3D printers, laser cutters, and CNC machines to create products for the community.',
    duration: 'School year',
    commitment: '5-10 hours/week',
    location: 'School',
    locationType: 'in-person',
    forGrades: [9, 10, 11, 12],
    benefits: ['Business skills', 'Technical skills', 'Revenue sharing', 'Portfolio building'],
    requirements: ['FabLab training', 'Commitment to production schedule'],
    skills: ['CAD design', '3D printing', 'Laser cutting', 'Business operations'],
    paid: true,
    creditAvailable: true,
    applicationProcess: 'Join through school engineering or business program',
  },
  {
    id: 'hospital-clinical',
    type: 'clinical',
    title: 'Hospital Junior Volunteer Program',
    organization: 'Local Hospitals',
    industry: 'Healthcare',
    description: 'Gain healthcare exposure through supervised volunteer work in various hospital departments. Many hospitals offer dedicated STEM tracks.',
    duration: '1 semester - 1 year',
    commitment: '4-8 hours/week',
    location: 'Local Hospital',
    locationType: 'in-person',
    forGrades: [10, 11, 12],
    benefits: ['Healthcare exposure', 'Patient interaction', 'Recommendation letters', 'Career clarity'],
    requirements: ['Minimum age 14-16', 'Health screening', 'Training completion', 'Commitment to schedule'],
    skills: ['Patient care', 'Medical terminology', 'Healthcare operations', 'Empathy'],
    paid: false,
    creditAvailable: true,
    applicationProcess: 'Apply directly to hospital volunteer services',
  },
];

const INDUSTRIES = [
  'Aerospace', 'Biotechnology', 'Computer Science', 'Cybersecurity', 'Engineering',
  'Healthcare', 'Manufacturing', 'Robotics', 'Semiconductor', 'Technology'
];

// ===========================================
// Helper Functions
// ===========================================

const getIntensityBadge = (intensity: string) => {
  switch (intensity) {
    case 'low': return { text: 'Entry Level', color: 'bg-green-500/20 text-green-400' };
    case 'medium': return { text: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400' };
    case 'high': return { text: 'Intensive', color: 'bg-red-500/20 text-red-400' };
    default: return { text: 'Varies', color: 'bg-gray-500/20 text-gray-400' };
  }
};

const getProgramTypeLabel = (type: WBLProgram['type']) => {
  const labels: Record<WBLProgram['type'], string> = {
    job_shadow: 'Job Shadow',
    mentorship: 'Mentorship',
    coop: 'Co-op',
    service_learning: 'Service Learning',
    school_enterprise: 'School Enterprise',
    clinical: 'Clinical',
  };
  return labels[type];
};

// ===========================================
// Main Component
// ===========================================

const WorkBasedLearningPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrograms, setShowPrograms] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterPaid, setFilterPaid] = useState(false);

  // Filter programs
  const filteredPrograms = SAMPLE_PROGRAMS.filter(p => {
    if (selectedType && p.type !== selectedType) return false;
    if (filterIndustry !== 'all' && p.industry !== filterIndustry) return false;
    if (filterPaid && !p.paid) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) ||
             p.organization.toLowerCase().includes(q) ||
             p.industry.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white">For Students</Link>
            <span>/</span>
            <span className="text-white">Work-Based Learning</span>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full mb-4">
              <Lightbulb className="w-4 h-4" />
              Learn While You Earn
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Work-Based Learning{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Explorer
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Connect classroom learning to real-world careers through job shadows, mentorships,
              co-ops, and hands-on experiences designed for high school students.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Target className="w-5 h-5" />, label: 'Career Clarity', desc: 'Explore before you commit' },
                { icon: <TrendingUp className="w-5 h-5" />, label: 'Skills Building', desc: 'Real-world experience' },
                { icon: <Award className="w-5 h-5" />, label: 'College Ready', desc: 'Stand out in applications' },
                { icon: <GraduationCap className="w-5 h-5" />, label: 'Earn Credit', desc: 'Many programs offer credit' },
              ].map((prop, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                    {prop.icon}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{prop.label}</div>
                    <div className="text-xs text-gray-500">{prop.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowPrograms(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/25"
              >
                Explore Programs →
              </button>
              <a
                href="#types"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Learn About WBL Types
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WBL Types Section */}
      <div id="types" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Types of Work-Based Learning</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From low-commitment job shadows to intensive co-op programs, find the right level
            of engagement for your goals and schedule.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WBL_TYPES.map((type) => {
            const intensityBadge = getIntensityBadge(type.intensity);
            return (
              <div
                key={type.id}
                className={`bg-gray-900 border border-gray-700 rounded-xl overflow-hidden ${wblColors[type.color]?.hoverBorder || 'hover:border-slate-500/50'} transition-all cursor-pointer group`}
                onClick={() => {
                  setSelectedType(type.id);
                  setShowPrograms(true);
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${wblColors[type.color]?.bg || 'bg-slate-500/20'} rounded-xl flex items-center justify-center ${wblColors[type.color]?.text || 'text-slate-400'}`}>
                      {type.icon}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${intensityBadge.color}`}>
                      {intensityBadge.text}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{type.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{type.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Target className="w-4 h-4" />
                      <span>{type.bestFor}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-2">Examples:</div>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.slice(0, 2).map((ex, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`px-6 py-3 ${wblColors[type.color]?.bgLight || 'bg-slate-500/10'} border-t ${wblColors[type.color]?.borderLight || 'border-slate-500/20'} flex items-center justify-between`}>
                  <span className={`text-sm font-medium ${wblColors[type.color]?.text || 'text-slate-400'}`}>View Programs</span>
                  <ChevronRight className={`w-4 h-4 ${wblColors[type.color]?.text || 'text-slate-400'} group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Programs Section */}
      {showPrograms && (
        <div className="bg-gray-900/50 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedType
                    ? `${WBL_TYPES.find(t => t.id === selectedType)?.title} Programs`
                    : 'All Work-Based Learning Programs'
                  }
                </h2>
                <p className="text-gray-400">{filteredPrograms.length} opportunities available</p>
              </div>
              <button
                onClick={() => {
                  setSelectedType(null);
                  setShowPrograms(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Overview
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search programs..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={selectedType || 'all'}
                onChange={e => setSelectedType(e.target.value === 'all' ? null : e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                {WBL_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.title}</option>
                ))}
              </select>
              <select
                value={filterIndustry}
                onChange={e => setFilterIndustry(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="all">All Industries</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <button
                onClick={() => setFilterPaid(!filterPaid)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                }`}
              >
                💰 Paid Only
              </button>
            </div>

            {/* Programs Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPrograms.map(program => (
                <div key={program.id} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                        {getProgramTypeLabel(program.type)}
                      </span>
                      <div className="flex gap-2">
                        {program.paid && (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            Paid
                          </span>
                        )}
                        {program.creditAvailable && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                            Credit
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{program.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Building2 className="w-4 h-4" />
                      <span>{program.organization}</span>
                      <span className="text-gray-600">•</span>
                      <span>{program.industry}</span>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">{program.description}</p>

                    <div className="flex flex-wrap gap-3 text-sm mb-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{program.commitment}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{program.locationType === 'virtual' ? 'Virtual' : program.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-gray-500">Skills:</span>
                      {program.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Grades:</span> {program.forGrades.join(', ')}th
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">{program.applicationProcess}</div>
                    {program.url && (
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Learn More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">No programs found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How to Get Started */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How to Get Started</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Talk to Your Counselor',
              description: 'School counselors can connect you with local WBL programs and help with paperwork.',
              icon: <Users className="w-6 h-6" />
            },
            {
              step: '2',
              title: 'Identify Your Goals',
              description: 'Are you exploring careers or building specific skills? This determines the best program type.',
              icon: <Target className="w-6 h-6" />
            },
            {
              step: '3',
              title: 'Check Requirements',
              description: 'Review age, transportation, and time requirements. Some programs need parent permission.',
              icon: <FileText className="w-6 h-6" />
            },
            {
              step: '4',
              title: 'Apply & Prepare',
              description: 'Complete applications, prepare for interviews, and get ready to learn!',
              icon: <CheckCircle2 className="w-6 h-6" />
            }
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400 relative">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Comparison */}
      <div className="bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Why Work-Based Learning?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Research shows students who participate in work-based learning are more likely to graduate,
            attend college, and earn higher wages.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Career Readiness</h3>
              <p className="text-gray-400 text-sm mb-4">
                Students with WBL experience are 60% more likely to feel prepared for their careers.
              </p>
              <ul className="space-y-2">
                {['Professional skills', 'Industry knowledge', 'Network building', 'Resume building'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Academic Success</h3>
              <p className="text-gray-400 text-sm mb-4">
                WBL participants have higher graduation rates and better college outcomes.
              </p>
              <ul className="space-y-2">
                {['Higher GPA', 'Better attendance', 'Clearer college goals', 'Stronger applications'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Future Earnings</h3>
              <p className="text-gray-400 text-sm mb-4">
                Young workers with WBL experience earn 12% more than peers without it.
              </p>
              <ul className="space-y-2">
                {['Earlier job offers', 'Higher starting salary', 'Faster promotions', 'Industry credentials'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Related Resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/students/internship-finder"
            className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              STEM Internship Finder
            </h3>
            <p className="text-sm text-gray-400">
              Find 1,000+ internships at NASA, national labs, and top tech companies.
            </p>
          </Link>

          <Link
            to="/students/apprenticeship-pathways"
            className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
              Youth Apprenticeships
            </h3>
            <p className="text-sm text-gray-400">
              Earn while you learn with registered apprenticeship programs.
            </p>
          </Link>

          <Link
            to="/students/career-roi"
            className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              STEM Career ROI Calculator
            </h3>
            <p className="text-sm text-gray-400">
              Compare earnings potential across different STEM career paths.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkBasedLearningPage;
