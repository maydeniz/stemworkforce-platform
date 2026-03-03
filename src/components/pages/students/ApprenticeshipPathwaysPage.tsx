// ===========================================
// Youth Apprenticeship Pathways for High School Students
// ===========================================
// Discover registered apprenticeship programs that
// combine paid work, classroom instruction, and
// industry credentials - starting in high school
// ===========================================

// Static Tailwind color map for pathway cards
const pathwayColors: Record<string, { hoverBorder: string; bg: string; text: string; bgLight: string; borderLight: string }> = {
  blue: { hoverBorder: 'hover:border-blue-500/50', bg: 'bg-blue-500/20', text: 'text-blue-400', bgLight: 'bg-blue-500/10', borderLight: 'border-blue-500/20' },
  yellow: { hoverBorder: 'hover:border-yellow-500/50', bg: 'bg-yellow-500/20', text: 'text-yellow-400', bgLight: 'bg-yellow-500/10', borderLight: 'border-yellow-500/20' },
  rose: { hoverBorder: 'hover:border-rose-500/50', bg: 'bg-rose-500/20', text: 'text-rose-400', bgLight: 'bg-rose-500/10', borderLight: 'border-rose-500/20' },
  amber: { hoverBorder: 'hover:border-amber-500/50', bg: 'bg-amber-500/20', text: 'text-amber-400', bgLight: 'bg-amber-500/10', borderLight: 'border-amber-500/20' },
  purple: { hoverBorder: 'hover:border-purple-500/50', bg: 'bg-purple-500/20', text: 'text-purple-400', bgLight: 'bg-purple-500/10', borderLight: 'border-purple-500/20' },
  emerald: { hoverBorder: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/20', text: 'text-emerald-400', bgLight: 'bg-emerald-500/10', borderLight: 'border-emerald-500/20' },
  teal: { hoverBorder: 'hover:border-teal-500/50', bg: 'bg-teal-500/20', text: 'text-teal-400', bgLight: 'bg-teal-500/10', borderLight: 'border-teal-500/20' },
  green: { hoverBorder: 'hover:border-green-500/50', bg: 'bg-green-500/20', text: 'text-green-400', bgLight: 'bg-green-500/10', borderLight: 'border-green-500/20' },
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  FileText,
  Award,
  Beaker,
  Users,
  ChevronRight,
  ExternalLink,
  Search,
  Star,
  Zap,
  BookOpen,
  Cpu,
  Factory,
  Heart,
  Lock,
  Rocket,
  Info,
} from 'lucide-react';

// ===========================================
// Types
// ===========================================

interface ApprenticeshipPathway {
  id: string;
  title: string;
  industry: string;
  icon: React.ReactNode;
  description: string;
  averageWage: string;
  duration: string;
  credentials: string[];
  careerOutlook: string;
  typicalEmployers: string[];
  skills: string[];
  color: string;
  featured?: boolean;
}

interface StateProgram {
  state: string;
  programName: string;
  description: string;
  industries: string[];
  ageRequirement: string;
  url: string;
}

// ===========================================
// Data
// ===========================================

const PATHWAYS: ApprenticeshipPathway[] = [
  {
    id: 'it-cybersecurity',
    title: 'IT & Cybersecurity',
    industry: 'Technology',
    icon: <Lock className="w-6 h-6" />,
    description: 'Learn network security, system administration, and cyber defense while earning CompTIA, Cisco, and security clearance credentials.',
    averageWage: '$18-25/hour',
    duration: '2-3 years',
    credentials: ['CompTIA A+', 'CompTIA Security+', 'Cisco CCNA', 'Security Clearance eligible'],
    careerOutlook: '+33% job growth by 2033',
    typicalEmployers: ['Defense contractors', 'Government agencies', 'Financial services', 'Healthcare'],
    skills: ['Network security', 'Penetration testing', 'Security operations', 'Risk assessment'],
    color: 'blue',
    featured: true
  },
  {
    id: 'advanced-manufacturing',
    title: 'Advanced Manufacturing',
    industry: 'Manufacturing',
    icon: <Factory className="w-6 h-6" />,
    description: 'Master CNC machining, robotics, quality control, and Industry 4.0 technologies in high-demand manufacturing roles.',
    averageWage: '$16-22/hour',
    duration: '2-4 years',
    credentials: ['NIMS Certification', 'OSHA Safety', 'Six Sigma Yellow Belt', 'CNC Operator Certificate'],
    careerOutlook: 'CHIPS Act creating 100,000+ jobs',
    typicalEmployers: ['Intel', 'TSMC', 'Boeing', 'Local manufacturers'],
    skills: ['CNC operation', 'Robotics', 'Quality control', 'Lean manufacturing'],
    color: 'yellow',
    featured: true
  },
  {
    id: 'healthcare-tech',
    title: 'Healthcare Technology',
    industry: 'Healthcare',
    icon: <Heart className="w-6 h-6" />,
    description: 'Combine healthcare knowledge with technical skills in medical device maintenance, health IT, and clinical technology.',
    averageWage: '$17-24/hour',
    duration: '2-3 years',
    credentials: ['BMET Certification', 'A+ Certification', 'Healthcare IT Specialist', 'CPR/First Aid'],
    careerOutlook: '+14% job growth projected',
    typicalEmployers: ['Hospitals', 'Medical device companies', 'Healthcare IT firms', 'Clinical labs'],
    skills: ['Medical equipment maintenance', 'Health informatics', 'Patient care technology', 'Regulatory compliance'],
    color: 'rose'
  },
  {
    id: 'electrical-instrumentation',
    title: 'Electrical & Instrumentation',
    industry: 'Energy & Utilities',
    icon: <Zap className="w-6 h-6" />,
    description: 'Work with electrical systems, PLCs, and instrumentation in power generation, utilities, and industrial settings.',
    averageWage: '$18-28/hour',
    duration: '3-4 years',
    credentials: ['Journeyman Electrician License', 'PLC Certification', 'Instrumentation Technician Certificate'],
    careerOutlook: 'Critical infrastructure jobs in demand',
    typicalEmployers: ['Power utilities', 'Oil & gas', 'Chemical plants', 'Manufacturing'],
    skills: ['Electrical systems', 'PLC programming', 'Instrumentation', 'Safety protocols'],
    color: 'amber'
  },
  {
    id: 'aerospace-composites',
    title: 'Aerospace & Composites',
    industry: 'Aerospace',
    icon: <Rocket className="w-6 h-6" />,
    description: 'Build aircraft, spacecraft, and defense systems using advanced composite materials and precision assembly techniques.',
    averageWage: '$19-26/hour',
    duration: '2-4 years',
    credentials: ['FAA Airframe Certificate', 'Composite Technician Certification', 'Security Clearance'],
    careerOutlook: 'Space industry boom + defense spending',
    typicalEmployers: ['Boeing', 'Lockheed Martin', 'SpaceX', 'Blue Origin'],
    skills: ['Composite layup', 'Precision assembly', 'Blueprint reading', 'Quality inspection'],
    color: 'purple',
    featured: true
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics & AI',
    industry: 'Technology',
    icon: <Cpu className="w-6 h-6" />,
    description: 'Learn data analysis, machine learning fundamentals, and business intelligence while building real-world projects.',
    averageWage: '$18-28/hour',
    duration: '2-3 years',
    credentials: ['Google Data Analytics Certificate', 'Microsoft Power BI', 'AWS Cloud Practitioner', 'Python Certification'],
    careerOutlook: '+35% job growth, high demand',
    typicalEmployers: ['Tech companies', 'Financial services', 'Healthcare', 'Government'],
    skills: ['Python/SQL', 'Data visualization', 'Statistical analysis', 'Machine learning basics'],
    color: 'emerald'
  },
  {
    id: 'biotech-lab',
    title: 'Biotechnology & Lab Science',
    industry: 'Biotechnology',
    icon: <Beaker className="w-6 h-6" />,
    description: 'Work in research labs, pharmaceutical companies, and biotech firms performing tests, analyses, and research support.',
    averageWage: '$16-22/hour',
    duration: '2-3 years',
    credentials: ['Clinical Laboratory Assistant', 'GMP Training', 'Quality Control Certification'],
    careerOutlook: 'Biotech industry expanding rapidly',
    typicalEmployers: ['Pfizer', 'Moderna', 'Research hospitals', 'Biotech startups'],
    skills: ['Lab techniques', 'Quality control', 'Documentation', 'Safety protocols'],
    color: 'teal'
  },
  {
    id: 'clean-energy',
    title: 'Clean Energy & Solar',
    industry: 'Clean Energy',
    icon: <Zap className="w-6 h-6" />,
    description: 'Install, maintain, and troubleshoot solar panels, wind turbines, and battery storage systems for the renewable energy transition.',
    averageWage: '$17-25/hour',
    duration: '2-4 years',
    credentials: ['NABCEP Certification', 'OSHA Safety', 'Electrical License', 'Wind Technician Certificate'],
    careerOutlook: 'Fastest growing occupation category',
    typicalEmployers: ['Solar installers', 'Utility companies', 'Energy developers', 'EV charging networks'],
    skills: ['Solar installation', 'Electrical systems', 'Troubleshooting', 'Safety compliance'],
    color: 'green'
  }
];

const STATE_PROGRAMS: StateProgram[] = [
  {
    state: 'Wisconsin',
    programName: 'Wisconsin Youth Apprenticeship',
    description: 'One of the oldest and most comprehensive youth apprenticeship programs in the nation, offering 11 career clusters.',
    industries: ['Manufacturing', 'IT', 'Healthcare', 'Finance', 'Agriculture'],
    ageRequirement: 'Juniors and Seniors (16+)',
    url: 'https://dwd.wisconsin.gov/apprenticeship/ya/'
  },
  {
    state: 'California',
    programName: 'California Youth Apprenticeship',
    description: '$15 million investment to align disconnected youth with apprenticeships in high-demand fields.',
    industries: ['Technology', 'Healthcare', 'Clean Energy', 'Construction'],
    ageRequirement: 'Ages 16-24',
    url: 'https://www.dir.ca.gov/das/Youth-Apprenticeship.html'
  },
  {
    state: 'Maryland',
    programName: 'Maryland Apprenticeship & Training Program',
    description: 'CTE-aligned pathways with registered apprenticeship sponsors transitioning HS students to employment.',
    industries: ['Cybersecurity', 'Biotechnology', 'Manufacturing', 'Healthcare'],
    ageRequirement: 'HS Juniors and Seniors',
    url: 'https://www.dllr.state.md.us/employment/appr/'
  },
  {
    state: 'Oregon',
    programName: 'Oregon Pathways to Computer Science (OrPACS)',
    description: 'Competency-based apprenticeship pathway in computer science for high school CTE students.',
    industries: ['Computer Science', 'Technology'],
    ageRequirement: 'HS Students in CTE programs',
    url: 'https://www.oregon.gov/boli/apprenticeship'
  },
  {
    state: 'Rhode Island',
    programName: 'Rhode Island Youth Apprenticeship',
    description: 'Cyber-Security Analyst and Data Analyst apprenticeship programs for high school students.',
    industries: ['Cybersecurity', 'Data Analytics'],
    ageRequirement: 'HS Students',
    url: 'https://dlt.ri.gov/apprenticeship'
  },
  {
    state: 'Colorado',
    programName: 'CareerWise Colorado',
    description: 'Swiss-model youth apprenticeship with 3-year pathways starting junior year.',
    industries: ['Technology', 'Healthcare', 'Finance', 'Business'],
    ageRequirement: 'HS Juniors (16+)',
    url: 'https://www.careerwisecolorado.org/'
  }
];

// ===========================================
// Components
// ===========================================

const PathwayCard: React.FC<{ pathway: ApprenticeshipPathway; onClick: () => void }> = ({ pathway, onClick }) => {
  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-xl overflow-hidden ${pathwayColors[pathway.color]?.hoverBorder || 'hover:border-slate-500/50'} transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${pathwayColors[pathway.color]?.bg || 'bg-slate-500/20'} rounded-xl flex items-center justify-center ${pathwayColors[pathway.color]?.text || 'text-slate-400'}`}>
            {pathway.icon}
          </div>
          {pathway.featured && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> High Demand
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
          {pathway.title}
        </h3>
        <div className="text-sm text-gray-500 mb-3">{pathway.industry}</div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{pathway.description}</p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-emerald-400">
            <DollarSign className="w-4 h-4" />
            <span>{pathway.averageWage}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{pathway.duration}</span>
          </div>
        </div>
      </div>
      <div className={`px-6 py-3 ${pathwayColors[pathway.color]?.bgLight || 'bg-slate-500/10'} border-t ${pathwayColors[pathway.color]?.borderLight || 'border-slate-500/20'} flex items-center justify-between`}>
        <span className="text-sm text-gray-400">{pathway.careerOutlook}</span>
        <ChevronRight className={`w-4 h-4 ${pathwayColors[pathway.color]?.text || 'text-slate-400'} group-hover:translate-x-1 transition-transform`} />
      </div>
    </div>
  );
};

// ===========================================
// Main Component
// ===========================================

const ApprenticeshipPathwaysPage: React.FC = () => {
  const [selectedPathway, setSelectedPathway] = useState<ApprenticeshipPathway | null>(null);
  const [activeTab, setActiveTab] = useState<'pathways' | 'states' | 'how-it-works'>('pathways');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/students" className="hover:text-white">For Students</Link>
            <span>/</span>
            <span className="text-white">Youth Apprenticeships</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full mb-4">
                <Award className="w-4 h-4" />
                Earn While You Learn
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Youth Apprenticeship{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Pathways
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-6">
                Start your career in high school with registered apprenticeship programs that combine
                paid work, classroom instruction, and industry-recognized credentials.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: '$30/hr', label: 'Avg Exit Wage', icon: <DollarSign className="w-5 h-5" /> },
                  { value: '94%', label: 'Employment Rate', icon: <Briefcase className="w-5 h-5" /> },
                  { value: '$0', label: 'Student Debt', icon: <TrendingUp className="w-5 h-5" /> },
                  { value: '1,000+', label: 'Occupations', icon: <Target className="w-5 h-5" /> },
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 mx-auto mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('pathways')}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-yellow-500/25"
                >
                  Explore Pathways →
                </button>
                <button
                  onClick={() => setActiveTab('how-it-works')}
                  className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  How It Works
                </button>
              </div>
            </div>

            {/* What is an Apprenticeship */}
            <div className="w-full lg:w-96 bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                What is Youth Apprenticeship?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Youth apprenticeships are DOL-registered programs designed for ages 16-24 that combine:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: <DollarSign className="w-4 h-4" />, text: 'Paid on-the-job training' },
                  { icon: <BookOpen className="w-4 h-4" />, text: 'Classroom instruction' },
                  { icon: <Award className="w-4 h-4" />, text: 'Industry credentials' },
                  { icon: <GraduationCap className="w-4 h-4" />, text: 'Often counts for HS credit' },
                  { icon: <TrendingUp className="w-4 h-4" />, text: 'Progressive wage increases' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                      {item.icon}
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
              <a
                href="https://www.apprenticeship.gov/educators/youth-apprenticeship"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
              >
                Learn More at Apprenticeship.gov
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'pathways', label: 'Career Pathways', icon: <Target className="w-4 h-4" /> },
              { id: 'states', label: 'State Programs', icon: <MapPin className="w-4 h-4" /> },
              { id: 'how-it-works', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Pathways Tab */}
        {activeTab === 'pathways' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">STEM Apprenticeship Pathways</h2>
                <p className="text-gray-400">High-demand career tracks with registered apprenticeship programs</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-blue-400" />
                All programs are DOL-registered
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PATHWAYS.map(pathway => (
                <PathwayCard
                  key={pathway.id}
                  pathway={pathway}
                  onClick={() => setSelectedPathway(pathway)}
                />
              ))}
            </div>

            {/* Pathway Detail Modal */}
            {selectedPathway && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPathway(null)}>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${pathwayColors[selectedPathway.color]?.bg || 'bg-slate-500/20'} rounded-xl flex items-center justify-center ${pathwayColors[selectedPathway.color]?.text || 'text-slate-400'}`}>
                          {selectedPathway.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedPathway.title}</h2>
                          <div className="text-gray-400">{selectedPathway.industry}</div>
                        </div>
                      </div>
                      <button onClick={() => setSelectedPathway(null)} className="text-gray-400 hover:text-white">
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <p className="text-gray-300">{selectedPathway.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-sm text-gray-400 mb-1">Average Wage</div>
                        <div className="text-xl font-bold text-emerald-400">{selectedPathway.averageWage}</div>
                      </div>
                      <div className="p-4 bg-gray-800 rounded-xl">
                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                        <div className="text-xl font-bold text-white">{selectedPathway.duration}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">Credentials You'll Earn</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPathway.credentials.map((cred, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                            {cred}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">Skills You'll Develop</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPathway.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">Typical Employers</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPathway.typicalEmployers.map((emp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">
                            {emp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
                        <TrendingUp className="w-4 h-4" />
                        Career Outlook
                      </div>
                      <div className="text-white">{selectedPathway.careerOutlook}</div>
                    </div>

                    <a
                      href="https://www.apprenticeship.gov/apprenticeship-job-finder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all"
                    >
                      Find {selectedPathway.title} Apprenticeships
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* State Programs Tab */}
        {activeTab === 'states' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Youth Apprenticeship by State</h2>
              <p className="text-gray-400">
                Many states have dedicated youth apprenticeship programs. Find your state's program below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {STATE_PROGRAMS.map(program => (
                <div key={program.state} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{program.state}</h3>
                        <div className="text-sm text-yellow-400">{program.programName}</div>
                      </div>
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{program.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.industries.map((ind, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {ind}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <strong>Eligibility:</strong> {program.ageRequirement}
                    </div>
                    <a
                      href={program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Visit Program Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Don't see your state?</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Many states have apprenticeship programs even if not listed here. Use the national
                apprenticeship finder to discover opportunities near you.
              </p>
              <a
                href="https://www.apprenticeship.gov/apprenticeship-job-finder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Search All Apprenticeships
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </>
        )}

        {/* How It Works Tab */}
        {activeTab === 'how-it-works' && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-2">How Youth Apprenticeship Works</h2>
              <p className="text-gray-400">
                A step-by-step guide to starting your apprenticeship journey in high school.
              </p>
            </div>

            {/* Timeline */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  step: '1',
                  title: 'Explore Pathways',
                  description: 'Research career paths and identify industries that match your interests and local opportunities.',
                  icon: <Search className="w-6 h-6" />
                },
                {
                  step: '2',
                  title: 'Connect with Programs',
                  description: 'Talk to your school counselor or CTE coordinator. They can connect you with local apprenticeship sponsors.',
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: '3',
                  title: 'Apply & Interview',
                  description: 'Complete applications, participate in interviews, and demonstrate your commitment to learning.',
                  icon: <FileText className="w-6 h-6" />
                },
                {
                  step: '4',
                  title: 'Start Earning',
                  description: 'Begin paid work while completing related instruction. Wages increase as you gain skills.',
                  icon: <DollarSign className="w-6 h-6" />
                }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-full">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 mb-4 relative">
                      {step.icon}
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden mb-12">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Apprenticeship vs Traditional Path</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Factor</th>
                      <th className="text-left p-4 text-yellow-400 font-medium">Youth Apprenticeship</th>
                      <th className="text-left p-4 text-gray-400 font-medium">4-Year College</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { factor: 'Cost', apprentice: '$0 (you get paid)', college: '$50,000-$200,000+' },
                      { factor: 'Debt', apprentice: 'None', college: '$37,000 average' },
                      { factor: 'Earn While Learning', apprentice: 'Yes, from day 1', college: 'Limited (part-time work)' },
                      { factor: 'Time to Career', apprentice: '2-4 years', college: '4-6 years' },
                      { factor: 'Job Placement', apprentice: '94% employed', college: 'Varies by major' },
                      { factor: 'Credentials', apprentice: 'Industry certifications', college: 'Degree' },
                      { factor: 'Career Advancement', apprentice: 'Clear progression path', college: 'Entry-level start' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700/50">
                        <td className="p-4 text-white font-medium">{row.factor}</td>
                        <td className="p-4 text-emerald-400">{row.apprentice}</td>
                        <td className="p-4 text-gray-400">{row.college}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  {
                    q: 'Can I do an apprenticeship AND go to college?',
                    a: 'Yes! Many apprentices earn college credits while working. Some even get associate degrees as part of their apprenticeship, then continue to bachelor\'s programs if desired.'
                  },
                  {
                    q: 'What if I\'m not sure what career I want?',
                    a: 'Start with job shadowing or work-based learning to explore. Pre-apprenticeship programs also help you try different fields before committing.'
                  },
                  {
                    q: 'Do I need experience to apply?',
                    a: 'No! Apprenticeships are designed to train you from scratch. Employers look for motivation, reliability, and willingness to learn.'
                  },
                  {
                    q: 'How much can I earn?',
                    a: 'Starting wages vary by industry ($12-20/hour), but increase as you gain skills. Completers average $30/hour or $60,000+/year.'
                  },
                  {
                    q: 'Will I miss out on the "college experience"?',
                    a: 'Apprenticeships offer different but valuable experiences: professional growth, financial independence, and career community. Many apprentices later pursue degrees with employer support.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Your Journey?</h3>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Talk to your school counselor about apprenticeship opportunities, or explore
                programs directly through Apprenticeship.gov.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.apprenticeship.gov/apprenticeship-job-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
                >
                  Find Apprenticeships
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  to="/students/internship-finder"
                  className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Explore Internships First
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Related Resources */}
      <div className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-white mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/students/internship-finder"
              className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                STEM Internship Finder
              </h3>
              <p className="text-sm text-gray-400">
                Explore 1,000+ summer and school-year internships for high schoolers.
              </p>
            </Link>

            <Link
              to="/students/work-based-learning"
              className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Work-Based Learning
              </h3>
              <p className="text-sm text-gray-400">
                Job shadows, mentorships, and co-ops to explore before you commit.
              </p>
            </Link>

            <Link
              to="/students/career-roi"
              className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Career ROI Calculator
              </h3>
              <p className="text-sm text-gray-400">
                Compare earnings across different STEM career paths and education routes.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprenticeshipPathwaysPage;
