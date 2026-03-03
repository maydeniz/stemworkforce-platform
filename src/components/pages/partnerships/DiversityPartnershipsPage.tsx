import { Link } from 'react-router-dom';
import {
  Users,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const PROGRAMS = [
  {
    title: 'Workforce Diversity Partnerships',
    description: 'Connect underrepresented communities with STEM career pathways through mentorship, training, and direct hiring programs.',
    features: ['Targeted recruitment campaigns', 'Mentorship matching', 'Skills-based hiring support', 'Pipeline development'],
    icon: Users,
    color: 'emerald',
  },
  {
    title: 'STEM Education Equity',
    description: 'Programs designed to increase representation of women, minorities, and persons with disabilities in emerging technology sectors.',
    features: ['Scholarship connections', 'HBCU partnerships', 'HSI collaborations', 'Tribal college programs'],
    icon: GraduationCap,
    color: 'purple',
  },
  {
    title: 'Inclusive Hiring Initiatives',
    description: 'Tools and frameworks for employers to build more diverse technical teams through bias-reduction and equitable hiring practices.',
    features: ['Blind resume screening', 'Structured interviews', 'Diverse panel reviews', 'Equitable job descriptions'],
    icon: Briefcase,
    color: 'blue',
  },
  {
    title: 'Community Partnerships',
    description: 'Collaborate with community organizations, nonprofits, and workforce boards to extend STEM opportunities to underserved communities.',
    features: ['Community outreach tools', 'Local workforce connections', 'Program impact tracking', 'Grant alignment support'],
    icon: Heart,
    color: 'rose',
  },
];

const IMPACT_STATS = [
  { label: 'Partner Organizations', value: '85+' },
  { label: 'Candidates Connected', value: '12,000+' },
  { label: 'Scholarships Matched', value: '$2.5M+' },
  { label: 'Hiring Rate Improvement', value: '34%' },
];

export default function DiversityPartnershipsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Globe size={24} className="text-emerald-400" />
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full">
              DEI Programs
            </span>
          </div>
          <h1 className="text-4xl font-bold">Diversity & Inclusion Partnerships</h1>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Building a more representative STEM workforce through equitable access to career pathways, mentorship, training, and hiring opportunities.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACT_STATS.map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Programs */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Partnership Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROGRAMS.map((program) => (
            <div key={program.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <program.icon size={24} className="text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold">{program.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{program.description}</p>
              <div className="mt-4 space-y-2">
                {program.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Partner With Us</h2>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">
            Join our diversity and inclusion ecosystem to expand your organization's reach and impact in building a representative STEM workforce.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/register?type=partner&program=diversity"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Become a Partner <ArrowRight size={16} />
            </Link>
            <Link
              to="/partners/nonprofits"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              View Nonprofits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
