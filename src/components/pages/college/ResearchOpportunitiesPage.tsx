// ===========================================
// Research Opportunities Page - College Students
// REUs, Lab Positions, Summer Programs
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Microscope,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Calendar,
  Beaker,
  Atom,
  Cpu,
  Brain,
  Dna,
  Rocket,
  Search,
  Filter,
  Star,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface ResearchProgram {
  id: string;
  name: string;
  institution: string;
  type: 'reu' | 'internship' | 'fellowship' | 'lab';
  field: string;
  location: string;
  stipend: string;
  duration: string;
  deadline: string;
  housing: boolean;
  travel: boolean;
  citizenship: 'us-only' | 'all' | 'us-preferred';
  eligibility: string[];
  icon: React.ReactNode;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const RESEARCH_PROGRAMS: ResearchProgram[] = [
  {
    id: '1',
    name: 'SULI - Science Undergraduate Laboratory Internships',
    institution: 'DOE National Labs',
    type: 'internship',
    field: 'Physics, Chemistry, Engineering',
    location: '17 National Labs',
    stipend: '$650/week',
    duration: '10-16 weeks',
    deadline: 'January 2025',
    housing: true,
    travel: true,
    citizenship: 'us-only',
    eligibility: ['US Citizen', 'Undergrad or Recent Grad', '3.0+ GPA'],
    icon: <Atom className="w-6 h-6" />,
  },
  {
    id: '2',
    name: 'NASA Pathways Internship',
    institution: 'NASA',
    type: 'internship',
    field: 'Aerospace, Engineering, STEM',
    location: 'Multiple NASA Centers',
    stipend: '$20-30/hr',
    duration: '10-16 weeks',
    deadline: 'Rolling',
    housing: false,
    travel: false,
    citizenship: 'us-only',
    eligibility: ['US Citizen', 'Currently Enrolled', 'STEM Major'],
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: '3',
    name: 'MIT Lincoln Lab Summer Research',
    institution: 'MIT Lincoln Laboratory',
    type: 'internship',
    field: 'AI, Cybersecurity, EE',
    location: 'Lexington, MA',
    stipend: '$8,000/month',
    duration: '12 weeks',
    deadline: 'November 2024',
    housing: true,
    travel: true,
    citizenship: 'us-only',
    eligibility: ['US Citizen', 'Junior/Senior/Grad', 'Clearance Eligible'],
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: '4',
    name: 'Amgen Scholars Program',
    institution: 'Multiple Universities',
    type: 'reu',
    field: 'Biotechnology, Life Sciences',
    location: '24 Host Institutions',
    stipend: '$5,000-6,000',
    duration: '8-10 weeks',
    deadline: 'February 2025',
    housing: true,
    travel: true,
    citizenship: 'all',
    eligibility: ['Sophomore or Junior', '3.2+ GPA', 'Research Interest'],
    icon: <Dna className="w-6 h-6" />,
  },
  {
    id: '5',
    name: 'CERN Summer Student Programme',
    institution: 'CERN',
    type: 'internship',
    field: 'Particle Physics, Computing',
    location: 'Geneva, Switzerland',
    stipend: '~$4,500 total',
    duration: '8-13 weeks',
    deadline: 'January 2025',
    housing: true,
    travel: true,
    citizenship: 'all',
    eligibility: ['3+ years of undergrad', 'Physics/CS/Engineering'],
    icon: <Atom className="w-6 h-6" />,
  },
  {
    id: '6',
    name: 'NSF REU - Machine Learning',
    institution: 'Stanford University',
    type: 'reu',
    field: 'AI/ML, Computer Science',
    location: 'Stanford, CA',
    stipend: '$6,000',
    duration: '9 weeks',
    deadline: 'February 2025',
    housing: true,
    travel: true,
    citizenship: 'us-only',
    eligibility: ['US Citizen/PR', 'Undergrad', 'CS Background'],
    icon: <Brain className="w-6 h-6" />,
  },
  {
    id: '7',
    name: 'NIH Summer Internship (SIP)',
    institution: 'National Institutes of Health',
    type: 'internship',
    field: 'Biomedical Research',
    location: 'Bethesda, MD',
    stipend: '$2,000-4,000/month',
    duration: '8-10 weeks',
    deadline: 'March 2025',
    housing: false,
    travel: false,
    citizenship: 'us-preferred',
    eligibility: ['Age 16+', 'Currently Enrolled', 'Biomedical Interest'],
    icon: <Beaker className="w-6 h-6" />,
  },
  {
    id: '8',
    name: 'Google Research Internship',
    institution: 'Google',
    type: 'internship',
    field: 'CS, AI/ML, Systems',
    location: 'Multiple US Locations',
    stipend: '$10,000+/month',
    duration: '12-14 weeks',
    deadline: 'Rolling (Apply Early)',
    housing: true,
    travel: true,
    citizenship: 'all',
    eligibility: ['PhD Student', 'Research Experience', 'Publications Preferred'],
    icon: <Microscope className="w-6 h-6" />,
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const ResearchOpportunitiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCitizenship, setSelectedCitizenship] = useState<string>('all');
  const [showHousingOnly, setShowHousingOnly] = useState(false);

  const filteredPrograms = useMemo(() => {
    return RESEARCH_PROGRAMS.filter(program => {
      const matchesSearch = !searchQuery ||
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.field.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || program.type === selectedType;
      const matchesCitizenship = selectedCitizenship === 'all' || program.citizenship === selectedCitizenship;
      const matchesHousing = !showHousingOnly || program.housing;

      return matchesSearch && matchesType && matchesCitizenship && matchesHousing;
    });
  }, [searchQuery, selectedType, selectedCitizenship, showHousingOnly]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              For College Students
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Research{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover REUs, lab positions, and summer research programs at top
              universities, national labs, and industry research centers.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Active Programs', value: '500+', icon: <Microscope className="w-5 h-5" /> },
                { label: 'Partner Labs', value: '150+', icon: <Building2 className="w-5 h-5" /> },
                { label: 'Avg Stipend', value: '$5,500', icon: <DollarSign className="w-5 h-5" /> },
                { label: 'Fields', value: '50+', icon: <Beaker className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center text-cyan-400 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 border-b border-gray-800 bg-gray-900/50 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by program name, institution, or field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="reu">REU</option>
                <option value="internship">Internship</option>
                <option value="fellowship">Fellowship</option>
                <option value="lab">Lab Position</option>
              </select>

              {/* Citizenship Filter */}
              <select
                value={selectedCitizenship}
                onChange={(e) => setSelectedCitizenship(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Citizenship</option>
                <option value="us-only">US Citizens Only</option>
                <option value="all">Open to All</option>
              </select>

              {/* Housing Toggle */}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHousingOnly}
                  onChange={(e) => setShowHousingOnly(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                />
                Housing Provided
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Research Programs</h2>
              <p className="text-gray-400 mt-1">{filteredPrograms.length} programs found</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {filteredPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${
                      program.type === 'reu' ? 'bg-purple-500/20 text-purple-400' :
                      program.type === 'internship' ? 'bg-blue-500/20 text-blue-400' :
                      program.type === 'fellowship' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {program.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {program.name}
                      </h3>
                      <p className="text-sm text-gray-500">{program.institution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {program.location}
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      {program.stipend}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Calendar className="w-4 h-4" />
                      {program.deadline}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      program.type === 'reu' ? 'bg-purple-500/20 text-purple-400' :
                      program.type === 'internship' ? 'bg-blue-500/20 text-blue-400' :
                      program.type === 'fellowship' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {program.type.toUpperCase()}
                    </span>
                    {program.housing && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        Housing
                      </span>
                    )}
                    {program.travel && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                        Travel Covered
                      </span>
                    )}
                    {program.citizenship === 'us-only' && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                        US Only
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Fields: {program.field}</p>
                    <div className="flex flex-wrap gap-1">
                      {program.eligibility.map((req, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                      <Star className="w-4 h-4" />
                      Save
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors">
                      Learn More
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
              <Microscope className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No programs found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* How to Get Research Experience */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How to Get Research Experience
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow these steps to land competitive research positions
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Identify Your Interests',
                description: 'Explore different research areas through courses, seminars, and reading papers',
                color: 'cyan',
              },
              {
                step: '2',
                title: 'Find Faculty Mentors',
                description: 'Read faculty profiles, attend office hours, and reach out with specific questions',
                color: 'blue',
              },
              {
                step: '3',
                title: 'Apply to Programs',
                description: 'Apply to REUs, internships, and summer programs well before deadlines',
                color: 'purple',
              },
              {
                step: '4',
                title: 'Build Your Portfolio',
                description: 'Present at conferences, contribute to publications, and document your work',
                color: 'green',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 ${item.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Approach Guide */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                How to Approach Faculty for Research
              </h2>
              <p className="text-gray-400 mb-6">
                Reaching out to professors can be intimidating, but it's essential
                for getting research experience. Here's how to do it right.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Research their work thoroughly before reaching out',
                  'Write a specific email mentioning papers you\'ve read',
                  'Explain your relevant coursework and skills',
                  'Ask about opportunities rather than demanding a position',
                  'Follow up politely if you don\'t hear back',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/college/faculty-email-guide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-xl transition-colors"
              >
                Get Email Templates
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-500 mb-2">Sample Email Subject:</div>
                <div className="text-white font-medium mb-4">
                  Undergraduate Research Inquiry - [Your Name] - [Specific Topic]
                </div>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>Dear Professor [Name],</p>
                  <p>I am a [Year] studying [Major] at [University]. I recently read your paper on [specific topic] and was particularly interested in [specific finding]...</p>
                  <p className="text-cyan-400">[Continue with your relevant experience and specific question]</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Template 1 of 5</span>
                <button className="text-cyan-400 hover:text-cyan-300">View all templates</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Research Journey?
          </h2>
          <p className="text-gray-400 mb-8">
            Create a profile to save programs, set deadline reminders, and get
            personalized recommendations based on your interests and qualifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=student&type=college&goal=research"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Create Free Profile
            </Link>
            <Link
              to="/college/grad-school-prep"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Graduate School Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchOpportunitiesPage;
