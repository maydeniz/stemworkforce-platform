import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Zap,
  Shield,
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';

// ===========================================
// Career Guides - Research-backed industry data (2025-2026)
// ===========================================

const GUIDES = [
  {
    id: 'semiconductor',
    title: 'Semiconductor Industry Career Guide',
    description: 'From fab technician to VP of Engineering. Understand the CHIPS Act ecosystem, required certifications, and career progression in semiconductor manufacturing and design.',
    icon: '\u{1F48E}',
    color: 'blue',
    link: '/industries/semiconductor',
    roles: ['Process Engineer', 'Design Engineer', 'Fab Technician', 'Yield Engineer'],
    avgSalary: '$103K',
    growth: '+10%',
    openings: '18K+',
    highlight: 'CHIPS Act is driving $30.9B in new fab investment',
  },
  {
    id: 'nuclear',
    title: 'Nuclear Energy Career Roadmap',
    description: 'Career paths in nuclear power, from reactor operations to fusion research. Covers NRC licensing, DOE programs, and the growing SMR sector.',
    icon: '\u{2622}\u{FE0F}',
    color: 'emerald',
    link: '/industries/nuclear-energy',
    roles: ['Reactor Operator', 'Nuclear Engineer', 'Health Physicist', 'Fuel Analyst'],
    avgSalary: '$118K',
    growth: '+5.7%',
    openings: '3.8K',
    highlight: '63% of employers report hiring as "very difficult"',
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning Careers',
    description: 'Navigate the rapidly evolving AI landscape. From research scientist to ML engineer, understand the skills, tools, and specializations that matter.',
    icon: '\u{1F916}',
    color: 'purple',
    link: '/industries/artificial-intelligence',
    roles: ['ML Engineer', 'AI Research Scientist', 'Data Engineer', 'MLOps Specialist'],
    avgSalary: '$150K',
    growth: '+17%',
    openings: '49K+',
    highlight: 'AI roles posted grew 163% YoY in 2025',
  },
  {
    id: 'quantum',
    title: 'Quantum Computing Career Paths',
    description: 'One of the fastest-growing fields in tech. Explore roles in quantum hardware, algorithms, error correction, and applications.',
    icon: '\u{269B}\u{FE0F}',
    color: 'cyan',
    link: '/industries/quantum-computing',
    roles: ['Quantum Physicist', 'Quantum Software Engineer', 'Algorithm Researcher'],
    avgSalary: '$149K',
    growth: '+12%',
    openings: '2.1K',
    highlight: 'Only ~30,000 quantum professionals worldwide',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Career Guide',
    description: 'Protect critical infrastructure and defense systems. Covers clearance requirements, certifications (CISSP, CEH, CompTIA), and specialization paths.',
    icon: '\u{1F6E1}\u{FE0F}',
    color: 'red',
    link: '/industries/cybersecurity',
    roles: ['SOC Analyst', 'Penetration Tester', 'Security Architect', 'CISO'],
    avgSalary: '$120K',
    growth: '+29%',
    openings: '457K',
    highlight: '457,398 unfilled cybersecurity jobs in the U.S.',
  },
  {
    id: 'aerospace',
    title: 'Aerospace & Defense Careers',
    description: 'From launch vehicles to satellite systems. Navigate clearance requirements, major employers (NASA, SpaceX, Lockheed), and career progression.',
    icon: '\u{1F680}',
    color: 'amber',
    link: '/industries/aerospace-defense',
    roles: ['Systems Engineer', 'Propulsion Engineer', 'Avionics Specialist'],
    avgSalary: '$110K',
    growth: '+5%',
    openings: '8.5K',
    highlight: 'TS/SCI clearance adds $25-45K salary premium',
  },
  {
    id: 'biotech',
    title: 'Biotechnology & Life Sciences',
    description: 'Career paths in genomics, drug development, bioinformatics, and medical devices. Covers academic vs industry tracks and regulatory expertise.',
    icon: '\u{1F9EC}',
    color: 'green',
    link: '/industries/biotechnology',
    roles: ['Research Scientist', 'Bioinformatician', 'Regulatory Affairs Specialist'],
    avgSalary: '$111K',
    growth: '+7%',
    openings: '6.2K',
    highlight: 'Gene therapy and mRNA platforms driving growth',
  },
  {
    id: 'clean-energy',
    title: 'Clean Energy & Sustainability',
    description: 'Rapidly growing sector driven by the Inflation Reduction Act. Covers solar, wind, battery storage, hydrogen, and grid modernization careers.',
    icon: '\u{26A1}',
    color: 'yellow',
    link: '/industries/clean-energy',
    roles: ['Energy Engineer', 'Grid Analyst', 'Sustainability Manager', 'EV Specialist'],
    avgSalary: '$113K',
    growth: '+9%',
    openings: '11K+',
    highlight: '3.56M clean energy workers in the U.S., growing 3x faster',
  },
  {
    id: 'robotics',
    title: 'Robotics & Automation Careers',
    description: 'From industrial automation to autonomous systems. Covers mechanical design, computer vision, motion planning, and human-robot interaction.',
    icon: '\u{1F9BE}',
    color: 'indigo',
    link: '/industries/robotics-automation',
    roles: ['Robotics Engineer', 'Controls Engineer', 'Computer Vision Specialist'],
    avgSalary: '$130K',
    growth: '+9%',
    openings: '5.4K',
    highlight: 'Warehouse automation and humanoid robotics driving demand',
  },
  {
    id: 'clearance',
    title: 'Security Clearance Guide',
    description: 'Everything you need to know about obtaining and maintaining Secret, Top Secret, and SCI clearances. Covers Trusted Workforce 2.0 and continuous vetting.',
    icon: '\u{1F510}',
    color: 'slate',
    link: '/college/clearance-guide',
    roles: ['Cleared Professionals', 'Defense Contractors', 'Federal Employees'],
    avgSalary: '+$15-45K',
    growth: 'Premium',
    openings: '200K+',
    highlight: 'Secret: ~60-150 days, Top Secret: ~120-240 days',
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BookOpen size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold">Career Guides</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            In-depth career roadmaps for every major STEM sector. Understand the roles, skills, certifications, and progression paths that lead to success.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data from BLS, industry surveys, and workforce reports. Updated for 2025-2026.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/salary-insights"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <DollarSign size={20} />
              Compare Salaries
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
            >
              <Briefcase size={20} />
              Browse 125K+ Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-emerald-400">36.8M</div>
            <div className="text-xs text-slate-400">STEM Workers in U.S.</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-blue-400">8.1%</div>
            <div className="text-xs text-slate-400">Projected Growth</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-purple-400">$103K</div>
            <div className="text-xs text-slate-400">Median STEM Salary</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-amber-400">2.16x</div>
            <div className="text-xs text-slate-400">vs Non-STEM Wages</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.id}
              to={guide.link}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{guide.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    {guide.description}
                  </p>

                  {/* Industry Stats */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-500">Avg Salary</div>
                      <div className="text-sm font-bold text-emerald-400">{guide.avgSalary}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-500">Growth</div>
                      <div className="text-sm font-bold text-blue-400">{guide.growth}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-500">Openings</div>
                      <div className="text-sm font-bold text-amber-400">{guide.openings}</div>
                    </div>
                  </div>

                  {/* Highlight */}
                  <div className="mt-3 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                    <p className="text-xs text-emerald-400/80">{guide.highlight}</p>
                  </div>

                  {/* Roles */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {guide.roles.map(role => (
                      <span key={role} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
                        {role}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore guide</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-12 p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/training" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <GraduationCap size={14} />
              Training Programs
            </Link>
            <Link to="/salary-insights" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <TrendingUp size={14} />
              Salary Insights
            </Link>
            <Link to="/resources" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <Briefcase size={14} />
              All Resources
            </Link>
            <Link to="/jobs" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <Zap size={14} />
              Browse Jobs
            </Link>
            <Link to="/college/clearance-guide" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <Shield size={14} />
              Clearance Guide
            </Link>
            <Link to="/map" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              <Users size={14} />
              Workforce Map
            </Link>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="mt-6 text-xs text-slate-600 text-center">
          Data sourced from BLS, NSF/NCSES, ISC2, SIA, DOE, and industry workforce reports.
        </div>
      </div>
    </div>
  );
}
