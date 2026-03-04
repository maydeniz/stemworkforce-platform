// ===========================================
// Career Launch Hub Page - College Students
// Job Search, Resume Building, Interview Prep
// ===========================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ExpertQASection from '@/components/shared/ExpertQASection';
import {
  Briefcase,
  FileText,
  Users,
  Target,
  TrendingUp,
  Search,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'internship' | 'co-op' | 'research';
  salary: string;
  postedDays: number;
  skills: string[];
  clearanceRequired: boolean;
  remote: boolean;
  sponsorship: boolean;
}

interface CareerResource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  category: 'resume' | 'interview' | 'networking' | 'search';
}

// ===========================================
// SAMPLE DATA
// ===========================================
const FEATURED_JOBS: JobListing[] = [
  {
    id: '1',
    title: 'Software Engineer - New Grad',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'full-time',
    salary: '$125,000 - $165,000',
    postedDays: 2,
    skills: ['Python', 'Distributed Systems', 'Machine Learning'],
    clearanceRequired: false,
    remote: false,
    sponsorship: true,
  },
  {
    id: '2',
    title: 'Hardware Engineering Intern',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'internship',
    salary: '$45/hr',
    postedDays: 5,
    skills: ['VLSI', 'Verilog', 'Digital Design'],
    clearanceRequired: false,
    remote: false,
    sponsorship: true,
  },
  {
    id: '3',
    title: 'Quantum Research Associate',
    company: 'IBM Quantum',
    location: 'Yorktown Heights, NY',
    type: 'full-time',
    salary: '$110,000 - $145,000',
    postedDays: 3,
    skills: ['Quantum Computing', 'Python', 'Physics'],
    clearanceRequired: false,
    remote: true,
    sponsorship: true,
  },
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    company: 'Lockheed Martin',
    location: 'Bethesda, MD',
    type: 'full-time',
    salary: '$95,000 - $125,000',
    postedDays: 1,
    skills: ['Security+', 'SIEM', 'Incident Response'],
    clearanceRequired: true,
    remote: false,
    sponsorship: false,
  },
  {
    id: '5',
    title: 'Data Science Co-op',
    company: 'NASA JPL',
    location: 'Pasadena, CA',
    type: 'co-op',
    salary: '$35/hr',
    postedDays: 7,
    skills: ['Python', 'TensorFlow', 'Data Analysis'],
    clearanceRequired: false,
    remote: false,
    sponsorship: false,
  },
  {
    id: '6',
    title: 'Biomedical Engineer',
    company: 'Medtronic',
    location: 'Minneapolis, MN',
    type: 'full-time',
    salary: '$85,000 - $110,000',
    postedDays: 4,
    skills: ['Medical Devices', 'CAD', 'FDA Regulations'],
    clearanceRequired: false,
    remote: false,
    sponsorship: true,
  },
];

const CAREER_RESOURCES: CareerResource[] = [
  {
    id: '1',
    title: 'AI Resume Builder',
    description: 'Create ATS-optimized resumes tailored for STEM roles with AI feedback',
    icon: <FileText className="w-6 h-6" />,
    link: '/college/resume-builder',
    category: 'resume',
  },
  {
    id: '2',
    title: 'Technical Interview Prep',
    description: 'Practice coding challenges, system design, and behavioral questions',
    icon: <Target className="w-6 h-6" />,
    link: '/college/interview-prep',
    category: 'interview',
  },
  {
    id: '3',
    title: 'Salary Negotiation Guide',
    description: 'Learn to negotiate offers with confidence using real compensation data',
    icon: <DollarSign className="w-6 h-6" />,
    link: '/college/salary-negotiation',
    category: 'search',
  },
  {
    id: '4',
    title: 'Portfolio Builder',
    description: 'Showcase your projects with professional technical portfolios',
    icon: <Sparkles className="w-6 h-6" />,
    link: '/college/portfolio-builder',
    category: 'resume',
  },
  {
    id: '5',
    title: 'Networking Toolkit',
    description: 'LinkedIn optimization, informational interview templates, and more',
    icon: <Users className="w-6 h-6" />,
    link: '/college/networking',
    category: 'networking',
  },
  {
    id: '6',
    title: 'Job Application Tracker',
    description: 'Organize applications, follow-ups, and interview schedules',
    icon: <CheckCircle className="w-6 h-6" />,
    link: '/college/app-tracker',
    category: 'search',
  },
];

const QUICK_STATS = [
  { label: 'Active STEM Jobs', value: '125,000+', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Partner Companies', value: '2,500+', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Avg Starting Salary', value: '$85,000', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Placement Rate', value: '94%', icon: <Award className="w-5 h-5" /> },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const CareerLaunchHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showClearanceOnly, setShowClearanceOnly] = useState(false);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return FEATURED_JOBS.filter(job => {
      const matchesSearch = !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'all' || job.type === selectedType;
      const matchesClearance = !showClearanceOnly || job.clearanceRequired;
      const matchesRemote = !showRemoteOnly || job.remote;

      return matchesSearch && matchesType && matchesClearance && matchesRemote;
    });
  }, [searchQuery, selectedType, showClearanceOnly, showRemoteOnly]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              For College Students
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Career Launch{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hub
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Your one-stop destination for job search, resume building, interview prep,
              and everything you need to launch your STEM career.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {QUICK_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center text-blue-400 mb-2">
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
      <section className="py-8 border-b border-gray-800 bg-gray-900/50 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {['all', 'full-time', 'internship', 'co-op', 'research'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Jobs' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Toggle Filters */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRemoteOnly}
                  onChange={(e) => setShowRemoteOnly(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500"
                />
                Remote
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showClearanceOnly}
                  onChange={(e) => setShowClearanceOnly(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500"
                />
                Clearance
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Listings - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Featured Opportunities
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredJobs.length} jobs found
                </span>
              </div>

              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">{job.salary}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Posted {job.postedDays} day{job.postedDays !== 1 ? 's' : ''} ago
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          job.type === 'full-time' ? 'bg-blue-500/20 text-blue-400' :
                          job.type === 'internship' ? 'bg-purple-500/20 text-purple-400' :
                          job.type === 'co-op' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {job.type}
                        </span>
                        {job.clearanceRequired && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                            Clearance Required
                          </span>
                        )}
                        {job.remote && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                            Remote OK
                          </span>
                        )}
                        {job.sponsorship && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
                            Visa Sponsorship
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <button className="text-sm text-gray-400 hover:text-white transition-colors">
                          Save for later
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No jobs found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search terms</p>
                </div>
              )}

              {/* View All Jobs CTA */}
              <Link
                to="/jobs"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                View All Jobs
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Career Resources - 1/3 width */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Career Tools</h2>

              <div className="space-y-4">
                {CAREER_RESOURCES.map((resource) => (
                  <Link
                    key={resource.id}
                    to={resource.link}
                    className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {resource.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Career Coaching CTA */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Need Guidance?</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Connect with career coaches who specialize in STEM career placement.
                </p>
                <Link
                  to="/service-providers?type=career-coach"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Find a Coach
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Government Careers Banner */}
              <div className="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Federal Careers</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Learn about security clearances, federal hiring paths, and government STEM jobs.
                </p>
                <Link
                  to="/college/government-careers"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Explore Federal Jobs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline Section */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Career Launch Timeline
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you're a freshman just starting out or a senior ready to accept offers,
              we have resources for every stage of your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                year: 'Freshman',
                title: 'Explore & Build',
                items: ['Discover STEM fields', 'Join student orgs', 'Start building skills'],
                color: 'blue',
              },
              {
                year: 'Sophomore',
                title: 'Experience',
                items: ['First internship', 'Research opportunities', 'Build portfolio'],
                color: 'purple',
              },
              {
                year: 'Junior',
                title: 'Focus',
                items: ['Technical internships', 'Leadership roles', 'Grad school decisions'],
                color: 'yellow',
              },
              {
                year: 'Senior',
                title: 'Launch',
                items: ['Full-time job search', 'Negotiate offers', 'Transition planning'],
                color: 'green',
              },
            ].map((stage, idx) => (
              <div
                key={idx}
                className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${stage.color === 'blue' ? 'hover:border-blue-500/50' : stage.color === 'purple' ? 'hover:border-purple-500/50' : stage.color === 'yellow' ? 'hover:border-yellow-500/50' : 'hover:border-green-500/50'} transition-all`}
              >
                <div className={`text-sm font-medium mb-2 ${stage.color === 'blue' ? 'text-blue-400' : stage.color === 'purple' ? 'text-purple-400' : stage.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {stage.year} Year
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{stage.title}</h3>
                <ul className="space-y-2">
                  {stage.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className={`w-4 h-4 ${stage.color === 'blue' ? 'text-blue-400' : stage.color === 'purple' ? 'text-purple-400' : stage.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Launch Your STEM Career?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your profile to get personalized job matches, access exclusive resources,
            and connect with employers actively hiring STEM talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=student&type=college"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Create Free Profile
            </Link>
            <Link
              to="/college/skills-assessment"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Take Skills Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Career Q&A */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExpertQASection
            scenario="first-job"
            title="Career Advice from Industry Experts"
            description="Expert answers to the most common career launch questions"
            limit={5}
            showTags
          />
        </div>
      </section>
    </div>
  );
};

export default CareerLaunchHubPage;
