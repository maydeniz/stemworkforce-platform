import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  Video,
  Search,
  ExternalLink,
  Shield,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Zap,
  Globe,
  Clock,
  BarChart3,
  Wrench,
  List,
} from 'lucide-react';

// ===========================================
// Resource Categories & Content Types
// ===========================================

const RESOURCE_CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Globe },
  { id: 'career', label: 'Career Tools', icon: Briefcase },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'clearance', label: 'Clearance', icon: Shield },
  { id: 'industry', label: 'Industry', icon: TrendingUp },
];

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: typeof FileText }> = {
  guide:     { bg: 'bg-blue-500/20',    text: 'text-blue-400',    icon: BookOpen },
  toolkit:   { bg: 'bg-purple-500/20',  text: 'text-purple-400',  icon: Wrench },
  data:      { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: BarChart3 },
  directory: { bg: 'bg-amber-500/20',   text: 'text-amber-400',   icon: List },
  tool:      { bg: 'bg-cyan-500/20',    text: 'text-cyan-400',    icon: Zap },
  video:     { bg: 'bg-red-500/20',     text: 'text-red-400',     icon: Video },
};

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: keyof typeof TYPE_STYLES;
  icon: typeof FileText;
  link: string;
  readTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Resume Builder & ATS Optimization Guide',
    description: 'Create resumes that pass Applicant Tracking Systems used by top STEM employers. Includes templates for federal, contractor, and private sector roles.',
    category: 'career',
    type: 'guide',
    icon: FileText,
    link: '/college/resume-builder',
    readTime: '15 min',
    difficulty: 'beginner',
    popular: true,
  },
  {
    id: '2',
    title: 'Interview Preparation Toolkit',
    description: 'Technical and behavioral interview prep for STEM roles including common questions for national lab, defense contractor, and tech company positions.',
    category: 'career',
    type: 'toolkit',
    icon: Video,
    link: '/college/interview-prep',
    readTime: '20 min',
    difficulty: 'intermediate',
    popular: true,
  },
  {
    id: '3',
    title: 'Salary Negotiation & Compensation Data',
    description: 'Real compensation data across 12 STEM roles, industries, and 8 metro areas. Understand your market value and learn negotiation strategies.',
    category: 'career',
    type: 'data',
    icon: TrendingUp,
    link: '/salary-insights',
    readTime: '10 min',
    difficulty: 'beginner',
    popular: true,
  },
  {
    id: '4',
    title: 'Security Clearance Process Guide',
    description: 'Step-by-step guide to obtaining Secret, Top Secret, and SCI clearances. Includes Trusted Workforce 2.0 updates, eApp process, and continuous vetting details.',
    category: 'clearance',
    type: 'guide',
    icon: Shield,
    link: '/college/clearance-guide',
    readTime: '25 min',
    difficulty: 'intermediate',
  },
  {
    id: '5',
    title: 'STEM Training & Certification Programs',
    description: 'Browse industry certifications, bootcamps, and upskilling programs in semiconductor, AI, quantum, nuclear, and cybersecurity fields.',
    category: 'training',
    type: 'directory',
    icon: GraduationCap,
    link: '/training',
    difficulty: 'beginner',
  },
  {
    id: '6',
    title: 'Industry Career Roadmaps',
    description: 'Detailed career progression guides for 10 emerging technology sectors with salary data, growth projections, and certification requirements.',
    category: 'industry',
    type: 'guide',
    icon: BookOpen,
    link: '/guides',
    readTime: '30 min',
    difficulty: 'beginner',
  },
  {
    id: '7',
    title: 'DOE National Lab Careers Guide',
    description: 'How to land a position at one of the 17 DOE National Laboratories (~70K+ employees). Covers SULI, SCGSR, postdoc programs, and Q/L clearance process.',
    category: 'career',
    type: 'guide',
    icon: Zap,
    link: '/partners/national-labs',
    readTime: '20 min',
    difficulty: 'intermediate',
  },
  {
    id: '8',
    title: 'Fellowship & Internship Finder',
    description: 'Comprehensive database of STEM fellowships, internships, and research experiences including SULI, SCGSR, NSF REU, and industry programs.',
    category: 'training',
    type: 'directory',
    icon: GraduationCap,
    link: '/college/fellowships',
    difficulty: 'beginner',
  },
  {
    id: '9',
    title: 'ITAR & Export Control Compliance',
    description: 'Understanding export control regulations for STEM professionals. Covers ITAR, EAR, deemed exports, and Technology Control Plans.',
    category: 'clearance',
    type: 'guide',
    icon: Shield,
    link: '/events/compliance',
    readTime: '20 min',
    difficulty: 'advanced',
  },
  {
    id: '10',
    title: 'Offer Comparison & Decision Tool',
    description: 'Compare multiple job offers considering total compensation, benefits, location cost-of-living, growth potential, and work-life balance factors.',
    category: 'career',
    type: 'tool',
    icon: BarChart3,
    link: '/college/offer-compare',
    readTime: '10 min',
    difficulty: 'beginner',
  },
  {
    id: '11',
    title: 'CHIPS Act Workforce Programs',
    description: 'Guide to workforce development programs funded by the CHIPS and Science Act ($30.9B awarded). Includes semiconductor training, apprenticeships, and scholarships.',
    category: 'industry',
    type: 'guide',
    icon: Zap,
    link: '/partners/government?type=chips-act',
    readTime: '15 min',
    difficulty: 'beginner',
  },
  {
    id: '12',
    title: 'Skills Assessment & Gap Analysis',
    description: 'Identify your current skill level and get personalized learning paths for in-demand STEM competencies. Covers technical and soft skills.',
    category: 'training',
    type: 'tool',
    icon: TrendingUp,
    link: '/college/skills-assessment',
    readTime: '15 min',
    difficulty: 'beginner',
  },
];

const DIFFICULTY_STYLES = {
  beginner: 'bg-emerald-500/20 text-emerald-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-purple-500/20 text-purple-400',
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = RESOURCES.filter(r => {
    const matchesSearch = !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularResources = RESOURCES.filter(r => r.popular);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Briefcase size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">Career Resources</h1>
          </div>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Tools, guides, and data to accelerate your STEM career. From resume building to salary negotiation, security clearances to industry certifications.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {RESOURCE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Popular Resources */}
        {selectedCategory === 'all' && !searchTerm && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              Most Popular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularResources.map((resource) => {
                const typeStyle = TYPE_STYLES[resource.type];
                return (
                  <Link
                    key={resource.id}
                    to={resource.link}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${typeStyle.bg} rounded-lg`}>
                        <typeStyle.icon size={18} className={typeStyle.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{resource.description}</p>
                        {resource.readTime && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-2">
                            <Clock size={10} /> {resource.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Resources */}
        <h2 className="text-lg font-semibold text-slate-300 mb-4">
          {selectedCategory === 'all' ? 'All Resources' : RESOURCE_CATEGORIES.find(c => c.id === selectedCategory)?.label}
          {' '}({filtered.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource) => {
            const typeStyle = TYPE_STYLES[resource.type];
            return (
              <Link
                key={resource.id}
                to={resource.link}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${typeStyle.bg} rounded-lg`}>
                    <typeStyle.icon size={20} className={typeStyle.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 ${typeStyle.bg} rounded text-xs ${typeStyle.text} capitalize`}>
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className={`px-2 py-0.5 rounded text-xs ${DIFFICULTY_STYLES[resource.difficulty]}`}>
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                      {resource.description}
                    </p>
                    {resource.readTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-3">
                        <Clock size={12} /> {resource.readTime}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View resource</span>
                  <ExternalLink size={14} className="ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg text-slate-400">No resources found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
