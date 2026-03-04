import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  ArrowRight,
  Building2,
  Star,
} from 'lucide-react';

const INDUSTRIES = ['All Fields', 'AI & ML', 'Cybersecurity', 'Quantum Computing', 'Nuclear Engineering', 'Semiconductor', 'Aerospace', 'Biotech', 'Clean Energy', 'Robotics'];

const PROGRAMS = [
  { name: "MS Computer Science (AI Track)", school: "Stanford University", location: "Stanford, CA", duration: "2 years", tuition: "$58K/yr", ranking: 1, funding: "RA/TA Available", online: false },
  { name: "MS Electrical Engineering", school: "MIT", location: "Cambridge, MA", duration: "2 years", tuition: "$57K/yr", ranking: 2, funding: "Full Funding Available", online: false },
  { name: "MS Cybersecurity", school: "Georgia Tech", location: "Atlanta, GA / Online", duration: "1-2 years", tuition: "$10K total (online)", ranking: 5, funding: "Scholarships", online: true },
  { name: "MS Nuclear Engineering", school: "University of Michigan", location: "Ann Arbor, MI", duration: "2 years", tuition: "$52K/yr", ranking: 3, funding: "DOE Fellowships", online: false },
  { name: "MS Quantum Information Science", school: "University of Chicago", location: "Chicago, IL", duration: "2 years", tuition: "$55K/yr", ranking: 4, funding: "Research Funding", online: false },
  { name: "MS Data Science", school: "UC Berkeley", location: "Berkeley, CA / Online", duration: "1-2 years", tuition: "$42K total (online)", ranking: 6, funding: "TA Positions", online: true },
  { name: "MS Aerospace Engineering", school: "Purdue University", location: "West Lafayette, IN", duration: "2 years", tuition: "$30K/yr", ranking: 7, funding: "NASA Fellowships", online: false },
  { name: "MS Biomedical Engineering", school: "Johns Hopkins University", location: "Baltimore, MD", duration: "2 years", tuition: "$55K/yr", ranking: 3, funding: "NIH Funding", online: false },
];

export default function MastersProgramsPage() {
  const [selectedField, setSelectedField] = useState('All Fields');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/college/grad-school-prep" className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-block">&larr; Grad School Prep</Link>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={28} className="text-emerald-400" />
            <h1 className="text-4xl font-bold">Master's Programs Explorer</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Find the right STEM master's program. Compare tuition, funding, rankings, and career outcomes across top universities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search programs, schools, or locations..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Filter size={16} className="text-slate-500 mt-3" />
            {INDUSTRIES.slice(0, 6).map(field => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedField === field
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Programs Indexed', value: '2,400+' },
            { label: 'Avg Starting Salary (MS)', value: '$105K' },
            { label: 'With Full Funding', value: '68%' },
            { label: 'Online Options', value: '340+' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-emerald-400">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Program List */}
        <div className="space-y-3">
          {PROGRAMS.map(program => (
            <div key={program.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold">{program.name}</h3>
                    {program.online && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-medium rounded-full">ONLINE</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 size={14} />
                    {program.school}
                    <span className="text-slate-600">|</span>
                    <MapPin size={14} />
                    {program.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-400" />
                  <span className="text-slate-300">#{program.ranking}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {program.duration}</span>
                <span className="flex items-center gap-1"><DollarSign size={12} /> {program.tuition}</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} className="text-emerald-400" /> {program.funding}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Need Help Choosing?</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            Our AI matches your career goals, budget, and preferences to recommend the best programs for you.
          </p>
          <Link
            to="/college/grad-school-prep"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Get AI Recommendations <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
