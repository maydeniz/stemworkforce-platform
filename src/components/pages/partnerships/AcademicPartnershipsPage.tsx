import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Building,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const PARTNERSHIP_TYPES = [
  {
    title: 'University Research Partnerships',
    description: 'Connect university research programs with industry sponsors, national labs, and government agencies for collaborative STEM research.',
    features: ['Research collaboration matching', 'Funding opportunity alerts', 'Lab-to-industry pipelines', 'Publication & IP support'],
    icon: Building,
  },
  {
    title: 'Curriculum & Workforce Alignment',
    description: 'Align academic programs with industry workforce needs through advisory boards, guest lectures, and curriculum feedback loops.',
    features: ['Industry advisory connections', 'Skills gap analysis', 'Curriculum review tools', 'Employer feedback channels'],
    icon: BookOpen,
  },
  {
    title: 'Student Pipeline Programs',
    description: 'Build direct pathways from academic programs to employer hiring through internships, co-ops, capstone projects, and research appointments.',
    features: ['Internship/co-op matching', 'Capstone project sponsors', 'Research appointments', 'Direct-hire pipelines'],
    icon: Users,
  },
  {
    title: 'Faculty & Staff Development',
    description: 'Keep faculty connected to industry practices through sabbaticals, industry fellowships, and professional development exchanges.',
    features: ['Industry sabbatical matching', 'Professional development', 'Conference sponsorships', 'Research grants'],
    icon: GraduationCap,
  },
];

const INSTITUTIONS = [
  { type: 'R1 Universities', count: '45+' },
  { type: 'HBCUs', count: '18' },
  { type: 'Community Colleges', count: '60+' },
  { type: 'HSIs', count: '25+' },
  { type: 'National Labs', count: '17' },
  { type: 'Industry Partners', count: '120+' },
];

export default function AcademicPartnershipsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <GraduationCap size={24} className="text-blue-400" />
            </div>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full">
              Academic Programs
            </span>
          </div>
          <h1 className="text-4xl font-bold">Academic Partnerships</h1>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Connect universities, community colleges, and research institutions with industry partners, national labs, and government agencies to build the STEM workforce pipeline.
          </p>
        </div>
      </div>

      {/* Institution Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {INSTITUTIONS.map(inst => (
            <div key={inst.type} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-blue-400">{inst.count}</div>
              <div className="text-xs text-slate-400 mt-1">{inst.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partnership Types */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Partnership Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARTNERSHIP_TYPES.map((program) => (
            <div key={program.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <program.icon size={24} className="text-blue-400 mb-3" />
              <h3 className="text-lg font-bold">{program.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{program.description}</p>
              <div className="mt-4 space-y-2">
                {program.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your institution profile and define partnership interests' },
              { step: '2', title: 'Match', desc: 'Our platform connects you with aligned industry and research partners' },
              { step: '3', title: 'Collaborate', desc: 'Develop joint programs, research projects, and student pipelines' },
              { step: '4', title: 'Impact', desc: 'Track outcomes, placement rates, and workforce development metrics' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Join Our Academic Network</h2>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">
            Whether you're a university, community college, or research institution, our platform helps you connect with the employers and programs your students need.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/register?type=partner&program=academic"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Register Institution <ArrowRight size={16} />
            </Link>
            <Link
              to="/education-partners"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Education Partners
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
