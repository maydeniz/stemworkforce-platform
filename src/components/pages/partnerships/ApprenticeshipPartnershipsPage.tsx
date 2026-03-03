import { Link } from 'react-router-dom';
import {
  Wrench,
  GraduationCap,
  Building,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  TrendingUp,
} from 'lucide-react';

// ===========================================
// Apprenticeship Programs - Employer Partnership Page
// Data from DOL, CHIPS Act, DOE, industry reports (2025-2026)
// ===========================================

const PROGRAM_TYPES = [
  {
    title: 'Registered Apprenticeships',
    description: 'DOL-registered programs combining on-the-job training with classroom instruction. Earn-and-learn model with progressive wage increases and nationally recognized credentials.',
    features: ['DOL credential upon completion', 'Structured mentorship', 'Progressive wage scales', 'Employer tax credits up to $2,500'],
    icon: Wrench,
    duration: '1-4 years',
  },
  {
    title: 'Youth Apprenticeships',
    description: 'Pre-apprenticeship pathways for high school juniors and seniors. Students earn industry-recognized credentials while completing high school diploma requirements.',
    features: ['Dual enrollment eligible', 'Industry credentials', 'Paid work experience', 'Direct hire pipeline'],
    icon: GraduationCap,
    duration: '1-2 years',
  },
  {
    title: 'Semiconductor Technician Programs',
    description: 'CHIPS Act-funded apprenticeships for fab technicians, process engineers, and equipment maintenance specialists at new and expanding semiconductor facilities.',
    features: ['CHIPS Act funded', 'Clean room certification', 'Equipment-specific training', 'Fab placement guarantee'],
    icon: Zap,
    duration: '12-18 months',
  },
  {
    title: 'Nuclear Energy Apprenticeships',
    description: 'NRC-pathway programs for reactor operators, health physicists, and nuclear technicians. Includes security clearance support and regulatory compliance training.',
    features: ['NRC licensing pathway', 'Clearance sponsorship', 'Hands-on reactor training', 'DOE lab placements'],
    icon: Shield,
    duration: '2-3 years',
  },
];

const STATS = [
  { label: 'Active STEM Apprentices', value: '68,000+', source: 'DOL RAPIDS 2025' },
  { label: 'Avg Starting Salary', value: '$62K', source: 'DOL data' },
  { label: 'Retention Rate', value: '91%', source: 'DOL studies' },
  { label: 'Employer ROI', value: '$1.47:$1', source: 'Commerce Dept.' },
];

const SECTORS = [
  { name: 'Semiconductor Manufacturing', openings: '2,400+', growth: 'New programs launching at Intel, TSMC, Samsung fabs' },
  { name: 'Cybersecurity', openings: '1,800+', growth: 'DOD CyberSkills2Go and NICE framework programs' },
  { name: 'Nuclear Energy', openings: '950+', growth: 'SMR buildout driving technician demand' },
  { name: 'Aerospace & Defense', openings: '3,200+', growth: 'Manufacturing and maintenance technician pipelines' },
  { name: 'Clean Energy', openings: '5,100+', growth: 'IRA-funded solar, wind, and EV battery programs' },
  { name: 'Advanced Manufacturing', openings: '4,800+', growth: 'CNC, robotics, and additive manufacturing tracks' },
  { name: 'AI & Data', openings: '1,200+', growth: 'Data annotation, MLOps, and AI infrastructure roles' },
  { name: 'Biotechnology', openings: '800+', growth: 'Lab technician and biomanufacturing programs' },
];

const EMPLOYER_BENEFITS = [
  'Federal tax credits up to $2,500 per apprentice per year',
  'State-level incentives and matching grants (varies by state)',
  'Access to diverse, pre-screened talent pipeline',
  'Reduced turnover: 91% retention vs 50% industry average',
  'ROI of $1.47 for every $1 invested (Commerce Dept. study)',
  'Customized training aligned to your specific technology stack',
  'Pathway to security clearance eligibility for cleared positions',
  'CHIPS Act reimbursement for semiconductor-sector programs',
];

export default function ApprenticeshipPartnershipsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Wrench size={24} className="text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold">Apprenticeship Programs</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Build your STEM workforce through earn-and-learn apprenticeships. Proven to deliver 91% retention rates and positive ROI across semiconductor, nuclear, cyber, and clean energy sectors.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data from DOL RAPIDS, Commerce Dept., CHIPS Act programs, and industry partners.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register?role=partner&type=apprenticeship"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors"
            >
              <Wrench size={18} /> Launch a Program
            </Link>
            <Link
              to="/partnerships/academic"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
            >
              <GraduationCap size={18} /> Academic Partnerships
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-600 mt-1">{stat.source}</div>
            </div>
          ))}
        </div>

        {/* Program Types */}
        <h2 className="text-xl font-bold mb-6">Program Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {PROGRAM_TYPES.map((program) => (
            <div key={program.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <program.icon size={20} className="text-amber-400" />
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
                    {program.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sector Opportunities */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-400" />
          Apprenticeship Openings by Sector
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {SECTORS.map((sector) => (
            <div key={sector.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="font-semibold text-sm">{sector.name}</h4>
              <div className="text-xl font-bold text-amber-400 mt-2">{sector.openings}</div>
              <p className="text-xs text-slate-400 mt-2">{sector.growth}</p>
            </div>
          ))}
        </div>

        {/* Employer Benefits */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building size={20} className="text-blue-400" />
            Why Employers Choose Apprenticeships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EMPLOYER_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Ready to Launch an Apprenticeship Program?</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Our team helps employers design, register, and launch STEM apprenticeship programs with access to funding, curriculum resources, and candidate pipelines.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/register?role=partner&type=apprenticeship"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/partnerships/academic"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              Academic Partnerships
            </Link>
            <Link
              to="/partnerships/diversity"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              Diversity Initiatives
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
