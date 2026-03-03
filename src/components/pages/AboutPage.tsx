import { Link } from 'react-router-dom';
import {
  Users,
  Target,
  Globe,
  Zap,
  TrendingUp,
  Shield,
  GraduationCap,
  Building,
  ArrowRight,
  BarChart3,
  Briefcase,
  Clock,
} from 'lucide-react';

// ===========================================
// About Page - Real workforce data from BLS, NSF, DOE (2025-2026)
// ===========================================

const STATS = [
  { label: 'U.S. STEM Workforce', value: '36.8M', icon: Users, source: 'NSF/NCSES' },
  { label: 'STEM Sectors Covered', value: '11', icon: Zap, source: 'Platform data' },
  { label: 'Median STEM Salary', value: '$103K', icon: TrendingUp, source: 'BLS 2024' },
  { label: 'Growth Rate (vs 2.7% avg)', value: '8.1%', icon: BarChart3, source: 'BLS Projections' },
];

const VALUES = [
  {
    title: 'Mission-Driven',
    description: 'We exist to strengthen the national STEM workforce by connecting talent with emerging technology opportunities across government, academia, and industry.',
    icon: Target,
  },
  {
    title: 'Security First',
    description: 'Built with enterprise-grade security for cleared professionals and defense-sector organizations. SOC 2 compliant with role-based access controls.',
    icon: Shield,
  },
  {
    title: 'Data-Informed',
    description: 'Our platform aggregates workforce data from BLS, DOE, NSF, and industry partners to provide actionable career intelligence backed by real numbers.',
    icon: TrendingUp,
  },
  {
    title: 'Inclusive Access',
    description: 'Committed to broadening participation in STEM. 52% of STEM workers lack a bachelor\'s degree -- we serve all pathways including community colleges and apprenticeships.',
    icon: Users,
  },
];

const WORKFORCE_GAPS = [
  { sector: 'Cybersecurity', gap: '457K unfilled jobs', source: 'CyberSeek 2025', color: 'text-red-400' },
  { sector: 'Semiconductor', gap: '90K technicians needed by 2030', source: 'SIA / White House', color: 'text-blue-400' },
  { sector: 'AI & Machine Learning', gap: '3.2:1 demand-to-supply ratio', source: 'Industry Reports', color: 'text-purple-400' },
  { sector: 'Nuclear Energy', gap: '4M professionals needed by 2050', source: 'IAEA', color: 'text-emerald-400' },
  { sector: 'Clean Energy', gap: '3.56M workers, growing 3x faster', source: 'DOE 2024', color: 'text-amber-400' },
];

const ECOSYSTEM = [
  { name: 'DOE National Laboratories', detail: '17 labs, ~70,000+ researchers' },
  { name: 'NASA', detail: 'Aeronautics & space careers' },
  { name: 'NSF', detail: 'Research & fellowship programs' },
  { name: 'CHIPS Act Programs', detail: '$30.9B invested in semiconductor workforce' },
  { name: 'University Partners', detail: 'R1 institutions & community colleges' },
  { name: 'Industry Sponsors', detail: 'Leading employers in emerging tech' },
  { name: 'Workforce Nonprofits', detail: 'Broadening participation in STEM' },
  { name: 'State Workforce Boards', detail: 'Regional workforce development' },
];

const MILESTONES = [
  { year: '2024', title: 'Platform Launch', description: 'STEM Workforce platform launched to connect talent with emerging technology careers across government, academia, and industry.' },
  { year: '2024', title: 'Federation System', description: 'Launched federated job listings aggregating positions from USAJobs, national labs, and industry partners.' },
  { year: '2025', title: 'Partner Network', description: 'Expanded to include DOE National Labs, CHIPS Act workforce hubs, community colleges, and state workforce boards.' },
  { year: '2025', title: 'Challenges Platform', description: 'Launched innovation challenges enabling employers to crowdsource solutions and identify talent through real-world problem solving.' },
  { year: '2026', title: 'Production Ready', description: 'Full platform with career tools, salary data, workforce map, and comprehensive partner ecosystem serving all STEM sectors.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Globe size={16} />
            National STEM Workforce Platform
          </div>
          <h1 className="text-5xl font-bold max-w-3xl mx-auto leading-tight">
            Connecting America's STEM Talent with Emerging Technology Careers
          </h1>
          <p className="text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
            The unified workforce development platform for semiconductor, nuclear, AI, quantum, cybersecurity, aerospace, and clean energy sectors.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <stat.icon size={20} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-600 mt-1">{stat.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              We're building the infrastructure to close the critical STEM workforce gap in emerging technology sectors. By connecting students, job seekers, educators, national labs, government agencies, and industry partners on a single platform, we accelerate the talent pipeline that powers America's technological competitiveness.
            </p>
            <p className="text-slate-400 mt-4 leading-relaxed">
              From high school students exploring STEM careers to senior professionals navigating clearance requirements, our platform provides the tools, data, and connections needed at every career stage.
            </p>

            {/* Key numbers inline */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-400">$103,580</div>
                <div className="text-xs text-slate-500">Median STEM wage (2.16x non-STEM)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-400">8.1%</div>
                <div className="text-xs text-slate-500">Projected STEM growth (vs 2.7% overall)</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <value.icon size={20} className="text-emerald-400 mb-3" />
                <h3 className="font-semibold text-sm">{value.title}</h3>
                <p className="text-xs text-slate-400 mt-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workforce Gap - The problem we solve */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">The Workforce Gap We're Closing</h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
            Critical STEM sectors face structural workforce shortages that threaten America's technological leadership. Here's the scale of the challenge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {WORKFORCE_GAPS.map((gap) => (
              <div key={gap.sector} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <h4 className={`font-bold text-sm ${gap.color}`}>{gap.sector}</h4>
                <div className="text-lg font-bold text-white mt-2">{gap.gap}</div>
                <div className="text-xs text-slate-600 mt-2">{gap.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <GraduationCap size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Students & Job Seekers</h3>
              <p className="text-sm text-slate-400">From high school STEM exploration to career-changers entering emerging tech. AI-powered tools for college prep, job search, and professional development.</p>
              <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-emerald-400 mt-3 hover:underline">
                Explore opportunities <ArrowRight size={12} />
              </Link>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Building size={28} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Partners & Employers</h3>
              <p className="text-sm text-slate-400">National labs, government agencies, universities, nonprofits, and industry partners building the next-generation STEM workforce pipeline.</p>
              <Link to="/partners" className="inline-flex items-center gap-1 text-sm text-emerald-400 mt-3 hover:underline">
                Partner with us <ArrowRight size={12} />
              </Link>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Briefcase size={28} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
              <p className="text-sm text-slate-400">Recruiters, career coaches, trainers, and consultants specializing in emerging technology workforce development and security clearance support.</p>
              <Link to="/become-a-provider" className="inline-flex items-center gap-1 text-sm text-emerald-400 mt-3 hover:underline">
                Join our network <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-900/30 border-y border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative pl-8 border-l-2 border-slate-700 space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={`${m.year}-${i}`} className="relative">
                <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 ${
                  i === MILESTONES.length - 1
                    ? 'bg-emerald-500 border-emerald-400'
                    : 'bg-slate-800 border-slate-600'
                }`} />
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-emerald-400 font-medium">{m.year}</span>
                  <Clock size={12} className="text-slate-600" />
                </div>
                <h4 className="font-semibold">{m.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Ecosystem */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our Ecosystem</h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mb-8">
          Working with federal agencies, national labs, universities, and industry to build the STEM talent pipeline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {ECOSYSTEM.map(partner => (
            <div key={partner.name} className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="text-sm font-medium text-slate-300">{partner.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{partner.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
          <p className="text-slate-400 mt-2">Join STEM professionals building their careers on our platform.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/guides"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Career Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
