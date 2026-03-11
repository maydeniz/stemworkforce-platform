// ===========================================
// Government Careers Page - College Students
// Federal Jobs, Security Clearances, Pathways
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Shield,
  Building2,
  Award,
  Clock,
  CheckCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText,
  Users,
  DollarSign,
  Briefcase,
  Lock,
  Unlock,
  Star,
  TrendingUp,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Agency {
  id: string;
  name: string;
  shortName: string;
  description: string;
  stemAreas: string[];
  clearanceLevel: 'none' | 'secret' | 'top-secret' | 'q';
  avgSalary: string;
  internships: boolean;
  newGradPrograms: boolean;
}

interface ClearanceLevel {
  id: string;
  name: string;
  description: string;
  timeline: string;
  scope: string;
  requiredFor: string[];
}

interface PathwayProgram {
  id: string;
  name: string;
  agency: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  link: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const AGENCIES: Agency[] = [
  {
    id: '1',
    name: 'National Aeronautics and Space Administration',
    shortName: 'NASA',
    description: 'Lead agency for space exploration and aeronautics research',
    stemAreas: ['Aerospace', 'Engineering', 'Physics', 'Computer Science'],
    clearanceLevel: 'secret',
    avgSalary: '$95,000',
    internships: true,
    newGradPrograms: true,
  },
  {
    id: '2',
    name: 'Department of Energy',
    shortName: 'DOE',
    description: 'Energy security, national labs, and nuclear weapons stewardship',
    stemAreas: ['Nuclear', 'Physics', 'Chemistry', 'Materials Science'],
    clearanceLevel: 'q',
    avgSalary: '$105,000',
    internships: true,
    newGradPrograms: true,
  },
  {
    id: '3',
    name: 'National Security Agency',
    shortName: 'NSA',
    description: 'Signals intelligence and cybersecurity for national security',
    stemAreas: ['Cybersecurity', 'Computer Science', 'Mathematics', 'EE'],
    clearanceLevel: 'top-secret',
    avgSalary: '$115,000',
    internships: true,
    newGradPrograms: true,
  },
  {
    id: '4',
    name: 'Department of Defense',
    shortName: 'DoD',
    description: 'Largest employer with diverse STEM opportunities',
    stemAreas: ['All STEM', 'Engineering', 'Logistics', 'Data Science'],
    clearanceLevel: 'secret',
    avgSalary: '$90,000',
    internships: true,
    newGradPrograms: true,
  },
  {
    id: '5',
    name: 'National Institutes of Health',
    shortName: 'NIH',
    description: 'Premier biomedical research institution',
    stemAreas: ['Biology', 'Chemistry', 'Biomedical', 'Public Health'],
    clearanceLevel: 'none',
    avgSalary: '$85,000',
    internships: true,
    newGradPrograms: true,
  },
  {
    id: '6',
    name: 'National Science Foundation',
    shortName: 'NSF',
    description: 'Supports fundamental research across all fields',
    stemAreas: ['All STEM', 'Research Administration', 'Program Management'],
    clearanceLevel: 'none',
    avgSalary: '$100,000',
    internships: true,
    newGradPrograms: true,
  },
];

const CLEARANCE_LEVELS: ClearanceLevel[] = [
  {
    id: '1',
    name: 'Public Trust',
    description: 'Basic background check for positions with access to sensitive information',
    timeline: '2-4 weeks',
    scope: 'Employment, credit, criminal history',
    requiredFor: ['Most federal positions', 'Contractors without classified access'],
  },
  {
    id: '2',
    name: 'Secret',
    description: 'Access to classified information that could cause serious damage to national security',
    timeline: '3-6 months',
    scope: '5-year background investigation',
    requiredFor: ['DoD positions', 'Defense contractors', 'Many NASA roles'],
  },
  {
    id: '3',
    name: 'Top Secret',
    description: 'Access to information that could cause exceptionally grave damage to national security',
    timeline: '6-12 months',
    scope: '10-year investigation, interviews with references',
    requiredFor: ['Intelligence agencies', 'Senior defense roles', 'Classified programs'],
  },
  {
    id: '4',
    name: 'TS/SCI',
    description: 'Top Secret with Sensitive Compartmented Information access',
    timeline: '12-18 months',
    scope: 'Most thorough investigation, polygraph may be required',
    requiredFor: ['NSA', 'CIA', 'NRO', 'Special programs'],
  },
  {
    id: '5',
    name: 'DOE Q Clearance',
    description: 'Department of Energy equivalent to Top Secret',
    timeline: '6-12 months',
    scope: 'Similar to TS, specific to nuclear information',
    requiredFor: ['National Labs', 'Nuclear facilities', 'DOE contractors'],
  },
];

const PATHWAY_PROGRAMS: PathwayProgram[] = [
  {
    id: '1',
    name: 'Pathways Internship Program',
    agency: 'All Federal Agencies',
    description: 'Paid internships for current students with potential conversion to permanent employment',
    eligibility: ['Currently enrolled', 'US Citizen', 'Minimum GPA varies by agency'],
    benefits: ['Paid experience', 'Mentorship', 'Path to permanent position', 'Tuition assistance available'],
    link: 'https://www.usajobs.gov/Help/working-in-government/unique-hiring-paths/students/',
  },
  {
    id: '2',
    name: 'Recent Graduates Program',
    agency: 'All Federal Agencies',
    description: 'Entry-level positions for recent graduates with structured development',
    eligibility: ['Graduated within 2 years', 'US Citizen', 'Degree from accredited institution'],
    benefits: ['Professional development', 'Mentorship', 'Training opportunities', 'Career ladder positions'],
    link: 'https://www.usajobs.gov/Help/working-in-government/unique-hiring-paths/recent-graduates/',
  },
  {
    id: '3',
    name: 'SMART Scholarship',
    agency: 'Department of Defense',
    description: 'Full scholarship plus guaranteed employment at DoD',
    eligibility: ['US Citizen', 'STEM major', 'Maintain 3.0 GPA', 'Pass security clearance'],
    benefits: ['Full tuition', 'Monthly stipend', 'Summer internships', 'Guaranteed job after graduation'],
    link: 'https://www.smartscholarship.org/',
  },
  {
    id: '4',
    name: 'CyberCorps: Scholarship for Service',
    agency: 'NSF/DHS',
    description: 'Cybersecurity scholarships with federal service commitment',
    eligibility: ['US Citizen', 'Cybersecurity/IT program', 'Junior or above'],
    benefits: ['Full tuition', 'Living stipend', 'Professional development', 'Federal job placement'],
    link: 'https://www.sfs.opm.gov/',
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const GovernmentCareersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agencies' | 'clearances' | 'pathways'>('overview');
  const { info } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              For College Students
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Federal STEM{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Careers
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Navigate the path to government careers, understand security clearances,
              and discover programs designed for STEM students and graduates.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Federal STEM Jobs', value: '50,000+', icon: <Briefcase className="w-5 h-5" /> },
                { label: 'Avg Salary', value: '$95,000', icon: <DollarSign className="w-5 h-5" /> },
                { label: 'Partner Agencies', value: '50+', icon: <Building2 className="w-5 h-5" /> },
                { label: 'Scholarships', value: '$500M+', icon: <Award className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center text-indigo-400 mb-2">
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

      {/* Tab Navigation */}
      <section className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-4">
            {[
              { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
              { id: 'agencies', label: 'STEM Agencies', icon: <Building2 className="w-4 h-4" /> },
              { id: 'clearances', label: 'Security Clearances', icon: <Shield className="w-4 h-4" /> },
              { id: 'pathways', label: 'Entry Programs', icon: <Users className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Why Federal */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Job Security',
                    description: 'Federal positions offer exceptional stability and benefits',
                    icon: <Shield className="w-6 h-6" />,
                    color: 'indigo',
                  },
                  {
                    title: 'Mission-Driven Work',
                    description: 'Work on projects that matter for national security and science',
                    icon: <Star className="w-6 h-6" />,
                    color: 'blue',
                  },
                  {
                    title: 'Excellent Benefits',
                    description: 'Health insurance, retirement, loan forgiveness, and more',
                    icon: <Award className="w-6 h-6" />,
                    color: 'green',
                  },
                  {
                    title: 'Career Growth',
                    description: 'Structured advancement with GS pay scale progression',
                    icon: <TrendingUp className="w-6 h-6" />,
                    color: 'purple',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-all"
                  >
                    <div className={`p-4 rounded-full inline-block mb-4 ${item.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' : item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : item.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Getting Started */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Getting Started with Federal Careers</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      step: '1',
                      title: 'Create USAJOBS Account',
                      description: 'Register at usajobs.gov and build your federal resume',
                      action: 'Go to USAJOBS',
                      link: 'https://www.usajobs.gov/',
                    },
                    {
                      step: '2',
                      title: 'Understand the Process',
                      description: 'Learn about federal hiring paths and what to expect',
                      action: 'Read Hiring Guide',
                      link: '/college/federal-hiring-guide',
                    },
                    {
                      step: '3',
                      title: 'Apply to Programs',
                      description: 'Start with Pathways internships or scholarships',
                      action: 'Explore Programs',
                      link: '#pathways',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {item.action}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Plan Ahead for Clearances</h3>
                    <p className="text-gray-400">
                      Many STEM federal positions require security clearances, which can take 6-18 months
                      to process. Start early in your junior year if you're interested in cleared positions.
                      Avoid activities that could disqualify you (drug use, foreign contacts without disclosure, financial issues).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agencies Tab */}
          {activeTab === 'agencies' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Top STEM Federal Agencies</h2>
                  <p className="text-gray-400 mt-1">Explore agencies with strong STEM career opportunities</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {AGENCIES.map((agency) => (
                  <div
                    key={agency.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{agency.shortName}</h3>
                        <p className="text-sm text-gray-500">{agency.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agency.clearanceLevel === 'none' ? 'bg-green-500/20 text-green-400' :
                        agency.clearanceLevel === 'secret' ? 'bg-yellow-500/20 text-yellow-400' :
                        agency.clearanceLevel === 'top-secret' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {agency.clearanceLevel === 'none' ? 'No Clearance' :
                         agency.clearanceLevel === 'q' ? 'DOE Q' :
                         agency.clearanceLevel.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{agency.description}</p>

                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">STEM Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {agency.stemAreas.map((area, idx) => (
                          <span key={idx} className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 font-medium">{agency.avgSalary} avg</span>
                        {agency.internships && (
                          <span className="text-gray-400">Internships</span>
                        )}
                        {agency.newGradPrograms && (
                          <span className="text-gray-400">New Grad</span>
                        )}
                      </div>
                      <button
                        onClick={() => info('USAJobs integration is coming soon!')}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        View Jobs →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clearances Tab */}
          {activeTab === 'clearances' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Security Clearance Levels</h2>
                <p className="text-gray-400">Understanding what's required for different positions</p>
              </div>

              <div className="space-y-6">
                {CLEARANCE_LEVELS.map((level) => (
                  <div
                    key={level.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          level.name === 'Public Trust' ? 'bg-green-500/20 text-green-400' :
                          level.name === 'Secret' ? 'bg-yellow-500/20 text-yellow-400' :
                          level.name === 'Top Secret' ? 'bg-orange-500/20 text-orange-400' :
                          level.name === 'TS/SCI' ? 'bg-red-500/20 text-red-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {level.name.includes('Public') ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{level.name}</h3>
                          <p className="text-gray-400 text-sm">{level.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">Timeline: {level.timeline}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Investigation Scope</h4>
                        <p className="text-gray-300 text-sm">{level.scope}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Required For</h4>
                        <div className="flex flex-wrap gap-2">
                          {level.requiredFor.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clearance Tips */}
              <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tips for Clearance Eligibility</h3>
                <ul className="space-y-3">
                  {[
                    'Be completely honest on SF-86 forms - lying is grounds for denial',
                    'Disclose all foreign contacts and travel proactively',
                    'Maintain good financial habits - pay debts on time',
                    'Avoid illegal drug use - past use may be forgiven with honesty',
                    'Keep records of all addresses and employment for the past 10 years',
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Pathways Tab */}
          {activeTab === 'pathways' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Entry Programs for Students</h2>
                  <p className="text-gray-400 mt-1">Scholarships and programs designed to bring STEM talent into government</p>
                </div>
              </div>

              <div className="grid gap-6">
                {PATHWAY_PROGRAMS.map((program) => (
                  <div
                    key={program.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{program.name}</h3>
                        <p className="text-indigo-400 text-sm">{program.agency}</p>
                      </div>
                      <a
                        href={program.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-gray-400 mb-4">{program.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Eligibility</h4>
                        <ul className="space-y-1">
                          {program.eligibility.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {program.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                              <Star className="w-4 h-4 text-yellow-400" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Serve Your Country?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your profile to track federal job applications, get clearance guidance,
            and connect with current federal employees for informational interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=student&type=college&goal=federal"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Create Free Profile
            </Link>
            <a
              href="https://www.usajobs.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Go to USAJOBS
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovernmentCareersPage;
