import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  GraduationCap,
  MapPin,
  Filter,
  BookOpen,
  Building2,
  ArrowRight,
  Star,
  Globe,
} from 'lucide-react';

const DEGREE_TYPES = ['All Degrees', "Bachelor's", "Master's", 'PhD', 'Certificate', 'Online'];
const FIELDS = ['All Fields', 'Computer Science', 'Engineering', 'Physics', 'Biology', 'Mathematics', 'Chemistry', 'Data Science'];

const FEATURED_PROGRAMS = [
  { name: 'BS Computer Science', school: 'Carnegie Mellon', location: 'Pittsburgh, PA', type: "Bachelor's", field: 'Computer Science', rating: 4.9, students: '1,400' },
  { name: 'PhD Physics (Quantum)', school: 'Caltech', location: 'Pasadena, CA', type: 'PhD', field: 'Physics', rating: 4.8, students: '120' },
  { name: 'MS Data Science (Online)', school: 'Georgia Tech', location: 'Online', type: "Master's", field: 'Data Science', rating: 4.7, students: '10,000+' },
  { name: 'BS Biomedical Engineering', school: 'Duke University', location: 'Durham, NC', type: "Bachelor's", field: 'Engineering', rating: 4.8, students: '450' },
  { name: 'PhD Chemistry', school: 'UC Berkeley', location: 'Berkeley, CA', type: 'PhD', field: 'Chemistry', rating: 4.9, students: '200' },
  { name: 'MS Cybersecurity', school: 'NYU Tandon', location: 'New York, NY', type: "Master's", field: 'Computer Science', rating: 4.6, students: '800' },
  { name: 'BS Nuclear Engineering', school: 'Penn State', location: 'State College, PA', type: "Bachelor's", field: 'Engineering', rating: 4.5, students: '180' },
  { name: 'Certificate in AI/ML', school: 'Stanford Online', location: 'Online', type: 'Certificate', field: 'Data Science', rating: 4.7, students: '5,000+' },
];

export default function ProgramSearchPage() {
  const [degreeType, setDegreeType] = useState('All Degrees');
  const [field, setField] = useState('All Fields');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link to="/college/grad-school-prep" className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-block">&larr; Grad School Prep</Link>
          <div className="flex items-center gap-3 mb-4">
            <Search size={28} className="text-emerald-400" />
            <h1 className="text-4xl font-bold">Program Search</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Explore STEM degree programs across top universities. Search by field, degree type, location, and career outcomes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search programs, universities, or specializations..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">
                <Filter size={12} className="inline mr-1" />Degree Type
              </label>
              <div className="flex gap-2 flex-wrap">
                {DEGREE_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setDegreeType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      degreeType === type
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">
                <BookOpen size={12} className="inline mr-1" />Field
              </label>
              <div className="flex gap-2 flex-wrap">
                {FIELDS.slice(0, 5).map(f => (
                  <button
                    key={f}
                    onClick={() => setField(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      field === f
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-slate-500">{FEATURED_PROGRAMS.length} programs found</div>
        <div className="space-y-3">
          {FEATURED_PROGRAMS.map(program => (
            <div key={`${program.name}-${program.school}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap size={16} className="text-emerald-400" />
                    <h3 className="text-base font-semibold">{program.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      program.type === 'PhD' ? 'bg-purple-500/20 text-purple-400' :
                      program.type === "Master's" ? 'bg-blue-500/20 text-blue-400' :
                      program.type === 'Certificate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {program.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Building2 size={13} /> {program.school}</span>
                    <span className="flex items-center gap-1">
                      {program.location === 'Online' ? <Globe size={13} /> : <MapPin size={13} />}
                      {program.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-amber-400" />
                    <span className="font-medium">{program.rating}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{program.students} students</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Not sure which program fits?</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            Use our AI-powered college matcher to find programs aligned with your career goals and academic background.
          </p>
          <Link
            to="/students/college-matcher"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Try College Matcher <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
