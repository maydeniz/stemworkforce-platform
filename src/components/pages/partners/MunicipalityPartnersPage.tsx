// ===========================================
// Municipality Partners Landing Page
// Cities, Counties, Municipal HR Departments
// Internships, Apprenticeships, Talent Pipeline
// ===========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Shield,
  FileText,
  Wrench,
  Zap,
  Award,
  Calendar,
  MapPin,
  BarChart3,
  Handshake
} from 'lucide-react';

// ===========================================
// VALUE PROPOSITIONS
// ===========================================
const VALUE_PROPOSITIONS = [
  {
    icon: Users,
    title: 'Summer Youth Employment (SYEP)',
    description: 'Manage large-scale summer internship programs with automated applicant screening, placement matching, and outcome tracking for youth ages 14-24.',
    highlight: 'Youth Pipeline',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Wrench,
    title: 'Registered Apprenticeships',
    description: 'Build talent pipelines for hard-to-fill trades positions in public works, utilities, and public safety with DOL-compliant apprenticeship management.',
    highlight: 'Trades Pipeline',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Clock,
    title: 'Cut Time-to-Hire by 60%',
    description: 'Reduce your 119-day average hiring timeline with streamlined recruitment, civil service integration, and automated candidate workflows.',
    highlight: '119 Days → 45 Days',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Civil Service Integration',
    description: 'Seamlessly connect intern and apprentice pipelines to civil service exams, eligible lists, and permanent hiring pathways.',
    highlight: 'Exam Integration',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Handshake,
    title: 'Union Partnership Tools',
    description: 'Manage union MOUs, hiring hall procedures, and joint apprenticeship programs with full compliance tracking and reporting.',
    highlight: 'Labor Relations',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Workforce Analytics',
    description: 'Track retirement eligibility, vacancy rates, and succession planning across all departments with real-time dashboards and predictive insights.',
    highlight: 'Data-Driven HR',
    color: 'from-rose-500 to-red-500'
  }
];

// ===========================================
// MUNICIPALITY TYPES
// ===========================================
const MUNICIPALITY_TYPES = [
  {
    name: 'Major Cities',
    examples: 'NYC, LA, Chicago, Houston, Phoenix',
    icon: Building2,
    programs: 'SYEP, Pathways, Civil Service Modernization'
  },
  {
    name: 'Mid-Size Cities',
    examples: 'Austin, Charlotte, Denver, Nashville',
    icon: MapPin,
    programs: 'Youth Employment, Pre-Apprenticeship, College Internships'
  },
  {
    name: 'Counties',
    examples: 'Los Angeles County, Cook County, Harris County',
    icon: Target,
    programs: 'Regional Workforce, Multi-Agency Programs'
  },
  {
    name: 'Regional Authorities',
    examples: 'Metro Planning, Transit, Water Districts',
    icon: Zap,
    programs: 'Utility Apprenticeships, Technical Training'
  }
];

// ===========================================
// DASHBOARD FEATURES
// ===========================================
const DASHBOARD_FEATURES = [
  {
    title: 'Internship Program Manager',
    description: 'Create and manage SYEP, college pathways, and department-specific internship programs with automated applicant workflows',
    icon: GraduationCap
  },
  {
    title: 'Apprenticeship Tracker',
    description: 'Track OJT hours, RTI completion, wage progressions, and credential attainment for all registered apprentices',
    icon: Wrench
  },
  {
    title: 'Department Workforce Needs',
    description: 'Aggregate hiring needs, vacancy rates, and skill gaps across all city departments in one dashboard',
    icon: BarChart3
  },
  {
    title: 'Civil Service Pipeline',
    description: 'Link program completers to upcoming civil service exams and track their journey to permanent employment',
    icon: FileText
  },
  {
    title: 'Union Partnership Hub',
    description: 'Manage union agreements, hiring hall coordination, and joint apprenticeship program tracking',
    icon: Handshake
  },
  {
    title: 'Grant Compliance Reporting',
    description: 'Automated WIOA, CDBG, ARPA, and foundation grant reports with outcome documentation',
    icon: Shield
  }
];

// ===========================================
// STATS
// ===========================================
const STATS = [
  { value: '47', label: 'City Partners', icon: Building2 },
  { value: '12,500+', label: 'Youth Employed', icon: Users },
  { value: '850', label: 'Apprentices Active', icon: Wrench },
  { value: '78%', label: 'Conversion Rate', icon: TrendingUp }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "STEMWorkforce transformed our Summer Youth Employment Program. We went from processing 3,000 applications manually to a fully automated system that matches youth to departments based on interests and skills.",
    author: "Marcus Thompson",
    role: "Director of Youth Services",
    organization: "City of Philadelphia",
    metric: "3x more youth placed"
  },
  {
    quote: "Our public works department had a 25% vacancy rate and 40% retirement-eligible workforce. The apprenticeship pipeline we built with STEMWorkforce is finally solving our succession crisis.",
    author: "Jennifer Rodriguez",
    role: "HR Director",
    organization: "Austin Water Utility",
    metric: "Vacancy rate cut in half"
  },
  {
    quote: "The civil service integration was a game-changer. Our interns who complete the program are twice as likely to pass their civil service exams and accept permanent positions.",
    author: "David Kim",
    role: "Chief Human Capital Officer",
    organization: "City of Seattle",
    metric: "2x exam pass rate"
  }
];

// ===========================================
// PRICING TIERS
// ===========================================
const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For small municipalities getting started',
    features: [
      'Up to 50 participants/year',
      '2 internship programs',
      'Basic applicant tracking',
      'Standard reporting',
      'Email support'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$1,499',
    period: '/month',
    description: 'For mid-size cities with active programs',
    features: [
      'Up to 500 participants/year',
      'Unlimited programs',
      'Apprenticeship management',
      'Civil service integration',
      'Department workforce planning',
      'Grant compliance reports',
      'Priority support'
    ],
    cta: 'Start Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For major cities and regional authorities',
    features: [
      'Unlimited participants',
      'Unlimited programs',
      'Full HR system integration',
      'Union partnership tools',
      'Custom reporting & analytics',
      'API access',
      'Dedicated success manager',
      'On-site training'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

// ===========================================
// PROGRAM TYPES
// ===========================================
const PROGRAM_TYPES = [
  {
    name: 'Summer Youth Employment',
    description: 'Large-scale summer programs for youth 14-24',
    ageRange: '14-24',
    duration: '6-8 weeks',
    icon: Users,
    color: 'blue'
  },
  {
    name: 'College Pathways',
    description: 'Semester and year-long college internships',
    ageRange: '18-26',
    duration: '12-52 weeks',
    icon: GraduationCap,
    color: 'purple'
  },
  {
    name: "Mayor's Fellowship",
    description: 'Executive leadership development programs',
    ageRange: '22-35',
    duration: '12-24 months',
    icon: Award,
    color: 'amber'
  },
  {
    name: 'Registered Apprenticeships',
    description: 'DOL-registered earn-and-learn programs',
    ageRange: '18+',
    duration: '1-4 years',
    icon: Wrench,
    color: 'green'
  },
  {
    name: 'Pre-Apprenticeship',
    description: 'Readiness programs for trades careers',
    ageRange: '16-24',
    duration: '8-16 weeks',
    icon: Target,
    color: 'cyan'
  },
  {
    name: 'High School CTE',
    description: 'Career & Technical Education partnerships',
    ageRange: '16-18',
    duration: 'School year',
    icon: Briefcase,
    color: 'rose'
  }
];

// ===========================================
// COMPONENT
// ===========================================
export default function MunicipalityPartnersPage() {
  const [_selectedTier, setSelectedTier] = useState<string>('Professional');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-slate-950 to-cyan-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full mb-6"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">Municipal Workforce Solutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Build Your City's
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400"> Future Workforce</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              The complete platform for municipal HR departments to manage internships, apprenticeships, and talent pipelines.
              Cut your 119-day time-to-hire and solve the public sector staffing crisis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/municipality-partner-apply"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/municipality-partner-dashboard"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                View Demo Dashboard
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
            >
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-xl mb-3">
                    <stat.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Public Sector Workforce Crisis is Real
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">119-Day Average Time-to-Hire</h3>
                    <p className="text-gray-400">While private sector fills positions in 36 days, cities lose top candidates to faster-moving employers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">30% Retirement-Eligible</h3>
                    <p className="text-gray-400">Nearly one-third of the municipal workforce can retire within 5 years, creating an urgent succession crisis.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">1 in 5 Jobs Vacant</h3>
                    <p className="text-gray-400">Public works, IT, and finance departments are hardest hit, with vacancy rates approaching 20%.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Your Solution: Build the Pipeline</h3>
              <div className="space-y-4">
                {[
                  'Summer youth programs create a talent funnel',
                  'Internships expose students to public service careers',
                  'Apprenticeships train skilled trades workers',
                  'Civil service integration creates permanent hires',
                  'Union partnerships ensure compliance and buy-in'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <p className="text-teal-300 text-sm">
                  <strong>Result:</strong> Cities using talent pipeline programs see 2x higher retention rates and 60% faster time-to-fill for critical positions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything Municipal HR Needs
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From youth employment to registered apprenticeships, manage your entire workforce pipeline in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUE_PROPOSITIONS.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-teal-500/50 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${prop.color} flex items-center justify-center mb-4`}>
                  <prop.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-teal-400 uppercase tracking-wider">{prop.highlight}</span>
                <h3 className="text-lg font-semibold text-white mt-2 mb-3">{prop.title}</h3>
                <p className="text-gray-400 text-sm">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Types */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Programs for Every Pipeline Stage
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From high school CTE to registered apprenticeships, build comprehensive pathways to public service careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAM_TYPES.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-teal-500/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg bg-${program.color}-500/20 flex items-center justify-center mb-4`}>
                  <program.icon className={`w-5 h-5 text-${program.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{program.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{program.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    {program.ageRange}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {program.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Municipal Workforce Command Center
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A comprehensive dashboard designed specifically for city and county HR departments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {DASHBOARD_FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mock Dashboard Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-gray-400 text-sm">Municipality Partner Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Interns', value: '342', change: '+23%' },
                { label: 'Apprentices', value: '87', change: '+12%' },
                { label: 'Placements YTD', value: '156', change: '+45%' },
                { label: 'Avg Days to Fill', value: '48', change: '-58%' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-emerald-400">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Participants by Department</h4>
                <div className="space-y-3">
                  {[
                    { dept: 'Public Works', count: 45, pct: 28 },
                    { dept: 'Parks & Recreation', count: 38, pct: 24 },
                    { dept: 'IT/Technology', count: 32, pct: 20 },
                    { dept: 'Finance', count: 24, pct: 15 },
                    { dept: 'Other', count: 21, pct: 13 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-400">{item.dept}</div>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                      <div className="w-8 text-right text-sm text-gray-400">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Upcoming Civil Service Exams</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Engineering Technician', date: 'Feb 15', linked: 12 },
                    { title: 'IT Specialist I', date: 'Feb 28', linked: 8 },
                    { title: 'Water Treatment Operator', date: 'Mar 10', linked: 15 },
                    { title: 'Administrative Analyst', date: 'Mar 22', linked: 6 }
                  ].map((exam, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                      <div>
                        <p className="text-sm text-white">{exam.title}</p>
                        <p className="text-xs text-gray-500">{exam.linked} linked participants</p>
                      </div>
                      <span className="text-xs text-teal-400">{exam.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Municipality Types */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Municipalities of All Sizes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Whether you're a major metro or a growing city, our platform scales to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MUNICIPALITY_TYPES.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <type.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{type.examples}</p>
                <p className="text-xs text-teal-400">{type.programs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Leading Municipalities
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how cities across the country are solving their workforce challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-teal-400">{testimonial.organization}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 rounded-full">
                    <span className="text-xs text-emerald-400 font-medium">{testimonial.metric}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Plans for Every Municipality
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start free and scale as your programs grow. Government procurement-friendly pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-8 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-teal-900/50 to-slate-900 border-2 border-teal-500/50 relative'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-gray-400">{tier.period}</span>}
                </div>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedTier(tier.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 border border-teal-500/30 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Municipal Workforce?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the cities that are solving the public sector staffing crisis with modern talent pipeline management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/municipality-partner-apply"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact-sales"
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Schedule a Demo
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              No credit card required. Free tier available for small municipalities.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
