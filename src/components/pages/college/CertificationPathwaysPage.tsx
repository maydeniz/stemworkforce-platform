import { Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  BookOpen,
  Shield,
  Cpu,
  Zap,
} from 'lucide-react';

const CERTIFICATION_TRACKS = [
  {
    title: 'Cybersecurity Certifications',
    icon: Shield,
    color: 'blue',
    certs: [
      { name: 'CompTIA Security+', level: 'Entry', duration: '3-6 months', salary: '$76K avg', demand: 'Very High' },
      { name: 'CISSP', level: 'Advanced', duration: '6-12 months', salary: '$120K avg', demand: 'Very High' },
      { name: 'CEH (Certified Ethical Hacker)', level: 'Intermediate', duration: '4-6 months', salary: '$98K avg', demand: 'High' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: Cpu,
    color: 'emerald',
    certs: [
      { name: 'AWS Solutions Architect', level: 'Intermediate', duration: '3-4 months', salary: '$130K avg', demand: 'Very High' },
      { name: 'Google Cloud Professional', level: 'Intermediate', duration: '3-4 months', salary: '$125K avg', demand: 'High' },
      { name: 'Kubernetes (CKA)', level: 'Advanced', duration: '2-3 months', salary: '$135K avg', demand: 'High' },
    ],
  },
  {
    title: 'AI & Data Science',
    icon: Zap,
    color: 'purple',
    certs: [
      { name: 'TensorFlow Developer', level: 'Intermediate', duration: '2-4 months', salary: '$115K avg', demand: 'Very High' },
      { name: 'AWS ML Specialty', level: 'Advanced', duration: '3-6 months', salary: '$140K avg', demand: 'High' },
      { name: 'Google Data Analytics', level: 'Entry', duration: '3-6 months', salary: '$75K avg', demand: 'Very High' },
    ],
  },
  {
    title: 'Project Management & Quality',
    icon: BookOpen,
    color: 'amber',
    certs: [
      { name: 'PMP', level: 'Intermediate', duration: '3-6 months', salary: '$105K avg', demand: 'High' },
      { name: 'Six Sigma Green Belt', level: 'Intermediate', duration: '2-4 months', salary: '$92K avg', demand: 'Medium' },
      { name: 'Scrum Master (CSM)', level: 'Entry', duration: '1-2 months', salary: '$95K avg', demand: 'High' },
    ],
  },
];

export default function CertificationPathwaysPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/college" className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-block">&larr; College Hub</Link>
          <div className="flex items-center gap-3 mb-4">
            <Award size={28} className="text-emerald-400" />
            <h1 className="text-4xl font-bold">Certification Pathways</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Accelerate your STEM career with industry-recognized certifications. AI-matched recommendations based on your goals, timeline, and target salary.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Certifications Tracked', value: '120+', icon: Award },
            { label: 'Avg Salary Increase', value: '+23%', icon: TrendingUp },
            { label: 'Avg Time to Cert', value: '3.5 mo', icon: Clock },
            { label: 'Employer Recognition', value: '95%', icon: CheckCircle },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <stat.icon size={18} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Tracks */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {CERTIFICATION_TRACKS.map(track => (
            <div key={track.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <track.icon size={22} className="text-emerald-400" />
                <h2 className="text-xl font-bold">{track.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {track.certs.map(cert => (
                  <div key={cert.name} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm font-semibold mb-2">{cert.name}</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Level</span>
                        <span className={cert.level === 'Entry' ? 'text-emerald-400' : cert.level === 'Intermediate' ? 'text-blue-400' : 'text-purple-400'}>{cert.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration</span>
                        <span className="text-slate-300 flex items-center gap-1"><Clock size={10} />{cert.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Avg Salary</span>
                        <span className="text-emerald-400 flex items-center gap-1"><DollarSign size={10} />{cert.salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Demand</span>
                        <span className={cert.demand === 'Very High' ? 'text-red-400' : 'text-amber-400'}>{cert.demand}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Get Your Personalized Certification Roadmap</h2>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">
            Our AI analyzes your career goals and current skills to recommend the optimal certification path for maximum ROI.
          </p>
          <Link
            to="/college/skills-assessment"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Start Skills Assessment <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
