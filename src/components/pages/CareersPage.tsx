import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Search,
  Filter,
  ChevronRight,
  X,
  Users,
  Zap,
  Globe,
  Heart,
  GraduationCap,
  Laptop,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import type { JobRequisition } from '../../types/staffManagement';

// Sample published job listings for STEMWorkforce
const publishedJobs: JobRequisition[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    departmentId: 'eng',
    departmentName: 'Engineering',
    hiringManagerId: 'hm-1',
    hiringManagerName: 'Sarah Chen',
    description: 'We\'re looking for a passionate senior developer to help build the future of STEM workforce development. You\'ll work on our core platform, creating tools that connect students with career opportunities in science, technology, engineering, and mathematics.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience with React, TypeScript, and Node.js. Experience with cloud services (AWS/GCP). Strong problem-solving skills and passion for education technology.',
    responsibilities: 'Lead development of new platform features. Mentor junior developers. Collaborate with product and design teams. Participate in architecture decisions.',
    benefits: 'Competitive salary. Equity options. Comprehensive health, dental, and vision insurance. Unlimited PTO. Remote-first culture. Professional development budget.',
    salaryMin: 140000,
    salaryMax: 180000,
    employmentType: 'full-time',
    location: 'Remote (US)',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [],
    positionsToFill: 2,
    positionsFilled: 0,
    targetStartDate: '2025-03-01',
    applicationDeadline: '2025-02-15',
    priority: 'high',
    isPublished: true,
    publishedAt: '2025-01-15',
    tags: ['engineering', 'senior', 'remote', 'full-stack'],
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    title: 'Product Manager - Student Experience',
    departmentId: 'prod',
    departmentName: 'Product',
    hiringManagerId: 'hm-2',
    hiringManagerName: 'Amanda Foster',
    description: 'Drive the product vision for our student-facing features. You\'ll work closely with educators, employers, and students to create meaningful experiences that help young people discover and pursue STEM careers.',
    requirements: '4+ years of product management experience. Experience with education technology or workforce development preferred. Strong analytical skills and data-driven mindset. Excellent communication skills.',
    responsibilities: 'Define product roadmap for student features. Conduct user research and gather feedback. Work with engineering to deliver features. Analyze metrics and optimize user experience.',
    benefits: 'Competitive compensation. Equity participation. Full benefits package. Flexible work arrangements. Mission-driven team.',
    salaryMin: 120000,
    salaryMax: 150000,
    employmentType: 'full-time',
    location: 'San Francisco, CA (Hybrid)',
    remoteAllowed: false,
    status: 'open',
    approvalChain: [],
    positionsToFill: 1,
    positionsFilled: 0,
    targetStartDate: '2025-03-15',
    applicationDeadline: '2025-02-28',
    priority: 'high',
    isPublished: true,
    publishedAt: '2025-01-18',
    tags: ['product', 'education', 'hybrid'],
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    title: 'UX Designer',
    departmentId: 'prod',
    departmentName: 'Design',
    hiringManagerId: 'hm-3',
    hiringManagerName: 'Jordan Lee',
    description: 'Create intuitive and accessible designs for our platform. You\'ll design experiences that help students, educators, and employers navigate the STEM career landscape.',
    requirements: '3+ years of UX/UI design experience. Proficiency in Figma. Portfolio demonstrating user-centered design process. Experience with accessibility best practices.',
    responsibilities: 'Design user interfaces for web and mobile. Conduct usability testing. Create design systems and component libraries. Collaborate with product and engineering.',
    benefits: 'Competitive salary. Health benefits. Stock options. Remote flexibility. Design conference budget.',
    salaryMin: 100000,
    salaryMax: 130000,
    employmentType: 'full-time',
    location: 'Remote (US)',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [],
    positionsToFill: 1,
    positionsFilled: 0,
    targetStartDate: '2025-04-01',
    priority: 'normal',
    isPublished: true,
    publishedAt: '2025-01-20',
    tags: ['design', 'ux', 'remote'],
    createdAt: '2025-01-18'
  },
  {
    id: '4',
    title: 'Software Engineering Intern - Summer 2025',
    departmentId: 'eng',
    departmentName: 'Engineering',
    hiringManagerId: 'hm-1',
    hiringManagerName: 'Sarah Chen',
    description: 'Join our engineering team for a 12-week summer program. You\'ll work on real features that impact students and employers, gaining hands-on experience with modern web development.',
    requirements: 'Currently pursuing a degree in Computer Science or related field. Experience with JavaScript/TypeScript. Interest in education technology. Strong communication skills.',
    responsibilities: 'Develop features under mentor guidance. Participate in code reviews. Present project at end of internship. Collaborate with cross-functional teams.',
    benefits: 'Competitive stipend. Housing assistance available. Mentorship program. Full-time offer potential.',
    salaryMin: 0,
    salaryMax: 0,
    employmentType: 'intern',
    location: 'San Francisco, CA or Remote',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [],
    positionsToFill: 4,
    positionsFilled: 0,
    targetStartDate: '2025-06-02',
    applicationDeadline: '2025-03-31',
    priority: 'high',
    isPublished: true,
    publishedAt: '2025-01-10',
    tags: ['internship', 'engineering', 'summer', 'new-grad'],
    internDetails: {
      programDuration: '12 weeks',
      schoolPartner: undefined,
      stipendAmount: 8500,
      academicCredit: true,
      projectDescription: 'Work on student-facing features for career discovery'
    },
    createdAt: '2025-01-05'
  },
  {
    id: '5',
    title: 'Customer Success Manager',
    departmentId: 'ops',
    departmentName: 'Operations',
    hiringManagerId: 'hm-4',
    hiringManagerName: 'Robert Martinez',
    description: 'Help our partner schools and employers succeed with STEMWorkforce. You\'ll be the primary point of contact, ensuring they get maximum value from our platform.',
    requirements: '3+ years in customer success or account management. Experience in EdTech or workforce development preferred. Strong relationship-building skills. Data-driven approach to customer health.',
    responsibilities: 'Manage portfolio of education and employer partners. Drive adoption and engagement. Identify expansion opportunities. Gather feedback for product improvements.',
    benefits: 'Competitive base + commission. Full benefits. Growth opportunities. Mission-driven work.',
    salaryMin: 80000,
    salaryMax: 110000,
    employmentType: 'full-time',
    location: 'Remote (US)',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [],
    positionsToFill: 2,
    positionsFilled: 0,
    targetStartDate: '2025-03-01',
    priority: 'normal',
    isPublished: true,
    publishedAt: '2025-01-22',
    tags: ['customer-success', 'sales', 'remote'],
    createdAt: '2025-01-20'
  },
  {
    id: '6',
    title: 'Data Science Intern - Fall 2025',
    departmentId: 'eng',
    departmentName: 'Data Science',
    hiringManagerId: 'hm-5',
    hiringManagerName: 'Emily Watson',
    description: 'Work with our data team to build models that help match students with career opportunities. You\'ll gain experience with real-world data science applications in education.',
    requirements: 'Pursuing degree in Data Science, Statistics, or related field. Experience with Python and SQL. Familiarity with machine learning concepts. Interest in education equity.',
    responsibilities: 'Build and evaluate ML models. Analyze platform data. Create visualizations and reports. Present findings to stakeholders.',
    benefits: 'Monthly stipend. Flexible schedule. Mentorship. Academic credit available.',
    salaryMin: 0,
    salaryMax: 0,
    employmentType: 'intern',
    location: 'Remote',
    remoteAllowed: true,
    status: 'open',
    approvalChain: [],
    positionsToFill: 2,
    positionsFilled: 0,
    targetStartDate: '2025-09-01',
    applicationDeadline: '2025-07-15',
    priority: 'normal',
    isPublished: true,
    publishedAt: '2025-01-25',
    tags: ['internship', 'data-science', 'fall', 'remote'],
    internDetails: {
      programDuration: '16 weeks',
      stipendAmount: 6000,
      academicCredit: true,
      projectDescription: 'Career matching algorithm improvements'
    },
    createdAt: '2025-01-22'
  }
];

const perks = [
  { icon: Laptop, title: 'Remote-First', description: 'Work from anywhere in the US with flexible hours' },
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage' },
  { icon: GraduationCap, title: 'Learning Budget', description: '$2,000 annual professional development stipend' },
  { icon: Globe, title: 'Mission-Driven', description: 'Make a real impact on STEM education' },
  { icon: Users, title: 'Inclusive Culture', description: 'Diverse team committed to equity in education' },
  { icon: Zap, title: 'Growth Opportunity', description: 'Fast-growing startup with career advancement' }
];

type EmploymentFilter = 'all' | 'full-time' | 'part-time' | 'contract' | 'intern';
type DepartmentFilter = 'all' | string;

const CareersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState<EmploymentFilter>('all');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>('all');
  const [selectedJob, setSelectedJob] = useState<JobRequisition | null>(null);

  // Get unique departments
  const departments = Array.from(new Set(publishedJobs.map(job => job.departmentName).filter(Boolean))) as string[];

  // Filter jobs
  const filteredJobs = publishedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.departmentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployment = employmentFilter === 'all' || job.employmentType === employmentFilter;
    const matchesDepartment = departmentFilter === 'all' || job.departmentName === departmentFilter;
    return matchesSearch && matchesEmployment && matchesDepartment;
  });

  const formatSalary = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Stipend';
    const format = (n: number) => `$${(n / 1000).toFixed(0)}k`;
    return `${format(min)} - ${format(max)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Full-time';
      case 'part-time': return 'Part-time';
      case 'contract': return 'Contract';
      case 'intern': return 'Internship';
      default: return type;
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-emerald-500/20 text-emerald-400';
      case 'part-time': return 'bg-blue-500/20 text-blue-400';
      case 'contract': return 'bg-amber-500/20 text-amber-400';
      case 'intern': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">STEMWorkforce</h1>
                <p className="text-xs text-slate-400">Careers</p>
              </div>
            </Link>
            <Link
              to="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us in Shaping the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                STEM Education
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              We're building the platform that connects students with STEM career opportunities.
              Join our mission to create equitable pathways into high-demand fields.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Remote-First
              </span>
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Mission-Driven
              </span>
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Inclusive Culture
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-12 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Work at STEMWorkforce?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <perk.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{perk.title}</h3>
                    <p className="text-slate-400 text-sm">{perk.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Open Positions</h2>
              <p className="text-slate-400">{filteredJobs.length} opportunities available</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value as EmploymentFilter)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Internship</option>
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      {job.priority === 'urgent' || job.priority === 'high' ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                          <Star className="w-3 h-3" />
                          Hot
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.departmentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      {job.employmentType !== 'intern' && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                      {job.internDetails?.stipendAmount && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${job.internDetails.stipendAmount.toLocaleString()}/month
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-slate-400 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getEmploymentTypeColor(job.employmentType)}`}>
                      {getEmploymentTypeLabel(job.employmentType)}
                    </span>
                    {job.applicationDeadline && (
                      <span className="text-sm text-slate-400">
                        Apply by {formatDate(job.applicationDeadline)}
                      </span>
                    )}
                    <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
                    {job.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No positions found</h3>
                <p className="text-slate-400">Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Don't see the right role?
          </h2>
          <p className="text-slate-400 mb-8">
            We're always looking for talented people who share our mission. Send us your resume
            and we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@stemworkforce.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all"
          >
            Send Us Your Resume
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} STEMWorkforce. All rights reserved.</p>
          <p className="mt-2">Building equitable pathways to STEM careers.</p>
        </div>
      </footer>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700/50 flex items-start justify-between z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getEmploymentTypeColor(selectedJob.employmentType)}`}>
                      {getEmploymentTypeLabel(selectedJob.employmentType)}
                    </span>
                    {selectedJob.remoteAllowed && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        Remote OK
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {selectedJob.departmentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedJob.employmentType !== 'intern' ? (
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-400">Salary Range</p>
                      <p className="text-lg font-bold text-white">{formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}</p>
                    </div>
                  ) : selectedJob.internDetails?.stipendAmount ? (
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-400">Monthly Stipend</p>
                      <p className="text-lg font-bold text-white">${selectedJob.internDetails.stipendAmount.toLocaleString()}</p>
                    </div>
                  ) : null}
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Open Positions</p>
                    <p className="text-lg font-bold text-white">{selectedJob.positionsToFill}</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-400">Start Date</p>
                    <p className="text-lg font-bold text-white">{formatDate(selectedJob.targetStartDate)}</p>
                  </div>
                  {selectedJob.applicationDeadline && (
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-sm text-slate-400">Apply By</p>
                      <p className="text-lg font-bold text-amber-400">{formatDate(selectedJob.applicationDeadline)}</p>
                    </div>
                  )}
                </div>

                {/* Intern Details */}
                {selectedJob.internDetails && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      Internship Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Duration</p>
                        <p className="text-white">{selectedJob.internDetails.programDuration}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Academic Credit</p>
                        <p className="text-white">{selectedJob.internDetails.academicCredit ? 'Available' : 'Not available'}</p>
                      </div>
                      {selectedJob.internDetails.projectDescription && (
                        <div className="col-span-2">
                          <p className="text-slate-400">Project Focus</p>
                          <p className="text-white">{selectedJob.internDetails.projectDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* About the Role */}
                <div>
                  <h3 className="text-white font-medium mb-3">About the Role</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-white font-medium mb-3">Requirements</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.requirements}</p>
                </div>

                {/* Responsibilities */}
                {selectedJob.responsibilities && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Responsibilities</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.responsibilities}</p>
                  </div>
                )}

                {/* Benefits */}
                {selectedJob.benefits && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Benefits</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.benefits}</p>
                  </div>
                )}

                {/* Apply Button */}
                <div className="pt-4 border-t border-slate-700/50">
                  <a
                    href={`mailto:careers@stemworkforce.com?subject=Application: ${selectedJob.title}`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all"
                  >
                    Apply for this Position
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-center text-sm text-slate-400 mt-3">
                    Or send your resume to careers@stemworkforce.com
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareersPage;
