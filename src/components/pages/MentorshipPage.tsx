import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Star,
  Briefcase,
  Shield,
  GraduationCap,
  CheckCircle,
  Clock,
  Zap,
  MessageCircle,
  Target,
  TrendingUp,
} from 'lucide-react';

// ===========================================
// Mentorship Programs - Connect STEM Talent with Mentors
// ===========================================

const PROGRAM_TYPES = [
  {
    title: '1:1 Career Mentorship',
    description: 'Get matched with experienced STEM professionals for personalized career guidance. Weekly or bi-weekly sessions focused on your goals.',
    features: ['AI-powered mentor matching', 'Structured goal tracking', 'Video & chat sessions', 'Progress reports'],
    icon: Users,
    duration: '3-6 months',
    color: 'emerald',
  },
  {
    title: 'Security Clearance Mentorship',
    description: 'Navigate the clearance process with guidance from cleared professionals. Covers SF-86, polygraphs, adjudication, and continuous vetting.',
    features: ['Clearance-specific guidance', 'SF-86 preparation tips', 'Lifestyle considerations', 'Adjudication support'],
    icon: Shield,
    duration: '3 months',
    color: 'blue',
  },
  {
    title: 'Industry Transition Program',
    description: 'Career changers and veterans transitioning into STEM. Mentors help translate skills, build networks, and navigate industry-specific hiring.',
    features: ['Skills translation coaching', 'Industry networking intros', 'Resume transformation', 'Interview preparation'],
    icon: Briefcase,
    duration: '4 months',
    color: 'purple',
  },
  {
    title: 'Research & Graduate Mentorship',
    description: 'PhD students and early researchers paired with senior scientists at national labs, universities, and industry R&D organizations.',
    features: ['Research direction guidance', 'Publication strategy', 'Lab-to-industry pathways', 'Fellowship applications'],
    icon: GraduationCap,
    duration: '6-12 months',
    color: 'amber',
  },
];

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  expertise: string[];
  rating: number;
  mentees: number;
  clearance: string;
  available: boolean;
}

const FEATURED_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Kim',
    title: 'Principal ML Scientist',
    company: 'National Lab (ORNL)',
    industry: 'AI & Machine Learning',
    expertise: ['Deep Learning', 'HPC', 'Career Transitions'],
    rating: 4.9,
    mentees: 23,
    clearance: 'DOE Q',
    available: true,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'VP of Engineering',
    company: 'Defense Contractor',
    industry: 'Cybersecurity',
    expertise: ['Zero Trust', 'Clearance Process', 'Leadership'],
    rating: 4.8,
    mentees: 18,
    clearance: 'TS/SCI',
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Elena Reyes',
    title: 'Senior Process Engineer',
    company: 'Semiconductor Fab',
    industry: 'Semiconductor',
    expertise: ['Fab Operations', 'CHIPS Act Careers', 'Women in STEM'],
    rating: 4.9,
    mentees: 15,
    clearance: 'Secret',
    available: true,
  },
  {
    id: '4',
    name: 'James Park',
    title: 'Quantum Research Lead',
    company: 'University Research Lab',
    industry: 'Quantum Computing',
    expertise: ['Quantum Algorithms', 'PhD Applications', 'Research Funding'],
    rating: 4.7,
    mentees: 12,
    clearance: 'No Clearance',
    available: false,
  },
  {
    id: '5',
    name: 'Lt. Col. (Ret.) David Chen',
    title: 'Aerospace Program Director',
    company: 'Prime Contractor',
    industry: 'Aerospace & Defense',
    expertise: ['Military Transition', 'Program Management', 'Systems Engineering'],
    rating: 5.0,
    mentees: 31,
    clearance: 'TS/SCI',
    available: true,
  },
  {
    id: '6',
    name: 'Dr. Amara Okonkwo',
    title: 'Nuclear Safety Engineer',
    company: 'NRC / DOE',
    industry: 'Nuclear Energy',
    expertise: ['NRC Licensing', 'Health Physics', 'Diversity in Nuclear'],
    rating: 4.8,
    mentees: 9,
    clearance: 'DOE L',
    available: true,
  },
];

const STATS = [
  { label: 'Active Mentors', value: '2,400+', icon: Users },
  { label: 'Mentees Matched', value: '8,700+', icon: Target },
  { label: 'Avg Satisfaction', value: '4.8/5', icon: Star },
  { label: 'Career Outcomes', value: '89%', icon: TrendingUp },
];

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-400',
};

export default function MentorshipPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = FEATURED_MENTORS.filter(
    (m) =>
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Users size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">Mentorship Programs</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Connect with experienced STEM professionals who've navigated the career paths, clearance processes, and industry transitions you're pursuing. AI-powered matching ensures the right fit.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register?role=mentee"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Target size={18} /> Find a Mentor
            </Link>
            <Link
              to="/register?role=mentor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
            >
              <Users size={18} /> Become a Mentor
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <stat.icon size={18} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Program Types */}
        <h2 className="text-xl font-bold mb-6">Mentorship Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {PROGRAM_TYPES.map((program) => (
            <div key={program.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${COLOR_MAP[program.color]}`}>
                  <program.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{program.title}</h3>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={10} /> {program.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{program.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {program.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Mentors */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star size={20} className="text-amber-400" />
            Featured Mentors
          </h2>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, industry, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-slate-400">{mentor.title}</p>
                  <p className="text-xs text-slate-500">{mentor.company}</p>
                </div>
                {mentor.available ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">Available</span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">Waitlist</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400" /> {mentor.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={10} /> {mentor.mentees} mentees
                </span>
                {mentor.clearance !== 'No Clearance' && (
                  <span className="flex items-center gap-1">
                    <Shield size={10} /> {mentor.clearance}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {mentor.expertise.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="px-2.5 py-1 bg-blue-500/10 rounded text-xs text-blue-400 inline-block">
                {mentor.industry}
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-16 mb-12">
            <Search size={36} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No mentors match your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* How it Works */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Create Profile', desc: 'Tell us about your goals, industry interests, and experience level.', icon: Users },
              { step: '2', title: 'Get Matched', desc: 'Our AI matches you with mentors based on your goals and career stage.', icon: Zap },
              { step: '3', title: 'Meet & Connect', desc: 'Schedule video or chat sessions with your mentor on your timeline.', icon: MessageCircle },
              { step: '4', title: 'Grow & Advance', desc: 'Track progress, hit milestones, and advance your STEM career.', icon: TrendingUp },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <item.icon size={22} className="text-emerald-400" />
                </div>
                <div className="text-xs text-emerald-400 font-medium mb-1">Step {item.step}</div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Start Your Mentorship Journey</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Whether you're a student, career changer, or experienced professional looking to give back, our mentorship platform connects you with the right people.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/register?role=mentee"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              Find a Mentor
            </Link>
            <Link
              to="/register?role=mentor"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
