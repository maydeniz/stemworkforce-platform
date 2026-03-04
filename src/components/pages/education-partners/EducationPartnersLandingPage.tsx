// ===========================================
// Education Partners Landing Page
// Redesigned based on expert recommendations for:
// Universities, Community Colleges, Bootcamps, Corporate Training,
// National Labs, and Informal Education Providers
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Building2,
  Target,
  BookOpen,
  Handshake,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Briefcase,
  FlaskConical,
  Atom,
  Lock,
  BarChart3,
  UserCheck,
  School,
  Microscope,
  FileCheck,
  Network
} from 'lucide-react';

// ===========================================
// PARTNER TYPES - Expanded per expert research
// ===========================================
const PARTNER_TYPES = [
  {
    id: 'university',
    title: 'Universities & 4-Year Colleges',
    icon: GraduationCap,
    description: 'Research institutions, engineering schools, and degree-granting colleges',
    keyBenefit: 'Demonstrate ROI to students & parents with verifiable employer partnerships',
    benefits: [
      'Access 500+ employers in AI, quantum, semiconductor actively recruiting',
      'Verifiable outcome data for accreditation and marketing',
      'Industry advisory board connections for curriculum alignment',
      'Research collaboration matching with industry sponsors'
    ],
    stats: { placements: '94%', employers: '500+', avgSalary: '$92K' },
    color: 'indigo'
  },
  {
    id: 'community',
    title: 'Community Colleges',
    icon: School,
    description: 'Two-year programs, vocational training, and certificate programs',
    keyBenefit: 'Connect students directly to employers - no 4-year degree required',
    benefits: [
      'Apprenticeship and certification pathways to high-paying careers',
      'Local and national employer connections in emerging tech',
      'Articulation agreement support with 4-year partners',
      'Workforce development grant outcome documentation'
    ],
    stats: { placements: '89%', employers: '350+', avgSalary: '$68K' },
    color: 'emerald'
  },
  {
    id: 'bootcamp',
    title: 'Coding Bootcamps & Accelerators',
    icon: Zap,
    description: 'Intensive training programs for career changers and upskilling',
    keyBenefit: 'Validate your outcomes with transparent, third-party verified placement data',
    benefits: [
      'Employer-trusted outcome verification and reporting',
      'Direct hiring partner introductions in emerging tech',
      'Credibility boost through recognized employer partnerships',
      '90-day placement tracking with salary verification'
    ],
    stats: { placements: '87%', employers: '300+', avgSalary: '$78K' },
    color: 'purple'
  },
  {
    id: 'corporate',
    title: 'Corporate Training Providers',
    icon: Building2,
    description: 'Professional development, upskilling, and enterprise training organizations',
    keyBenefit: 'Reach enterprise clients looking to upskill in AI, cybersecurity, and emerging tech',
    benefits: [
      'B2B lead generation through our employer network',
      'Enterprise client introductions for workforce contracts',
      'Government training program partnerships (CHIPS Act, DOE)',
      'Measurable skill competency tracking for clients'
    ],
    stats: { placements: '92%', employers: '400+', avgSalary: '$105K' },
    color: 'blue'
  },
  {
    id: 'national-lab',
    title: 'National Labs & Research Facilities',
    icon: Atom,
    description: 'DOE national laboratories, federally funded research centers, and government facilities',
    keyBenefit: 'Build your Q-clearance talent pipeline with security-eligible students',
    benefits: [
      'Pre-screened candidates for Q-clearance and TS/SCI positions',
      'STEM students interested in national security careers',
      'Intern-to-hire conversion tracking and optimization',
      'Research collaboration matching with academic partners'
    ],
    stats: { placements: '96%', employers: '50+', avgSalary: '$98K' },
    color: 'amber'
  },
  {
    id: 'informal',
    title: 'Informal Education Providers',
    icon: Microscope,
    description: 'Science museums, STEM camps, after-school programs, and community organizations',
    keyBenefit: 'Demonstrate your impact on the STEM pipeline with pathway tracking',
    benefits: [
      'Connect participants to next-step educational opportunities',
      'Grant reporting with verifiable outcome data',
      'NSF STEM ecosystem partnership recognition',
      'Pathway tracking from programs to careers'
    ],
    stats: { participants: '50K+', pathways: '200+', grants: '$2M+' },
    color: 'pink'
  }
];

// ===========================================
// INDUSTRY OPPORTUNITIES - Emerging Tech Focus
// ===========================================
const INDUSTRY_OPPORTUNITIES = [
  { name: 'Semiconductor', growth: '+45%', jobs: '245K+', icon: '💎', color: 'from-blue-500 to-indigo-500', badge: 'CHIPS Act' },
  { name: 'Nuclear Technologies', growth: '+15%', jobs: '89K+', icon: '☢️', color: 'from-green-500 to-emerald-500' },
  { name: 'AI & Machine Learning', growth: '+340%', jobs: '312K+', icon: '🤖', color: 'from-purple-500 to-pink-500' },
  { name: 'Quantum Technologies', growth: '+67%', jobs: '12K+', icon: '⚛️', color: 'from-pink-500 to-rose-500' },
  { name: 'Cybersecurity', growth: '+32%', jobs: '567K+', icon: '🛡️', color: 'from-red-500 to-orange-500' },
  { name: 'Aerospace & Defense', growth: '+18%', jobs: '198K+', icon: '🚀', color: 'from-cyan-500 to-blue-500' },
  { name: 'Biotechnology', growth: '+28%', jobs: '234K+', icon: '🧬', color: 'from-emerald-500 to-teal-500' },
  { name: 'Healthcare & Medical Technology', growth: '+31%', jobs: '892K+', icon: '🏥', color: 'from-teal-500 to-cyan-500' },
  { name: 'Robotics & Automation', growth: '+35%', jobs: '156K+', icon: '🦾', color: 'from-amber-500 to-orange-500' },
  { name: 'Clean Energy', growth: '+42%', jobs: '178K+', icon: '⚡', color: 'from-lime-500 to-green-500' },
  { name: 'Advanced Manufacturing', growth: '+12%', jobs: '423K+', icon: '🏭', color: 'from-slate-500 to-gray-500' }
];

// ===========================================
// WHAT PARTNERS GET - Institution-Focused Features
// ===========================================
const PARTNER_FEATURES = [
  {
    icon: BookOpen,
    title: 'List & Promote Your Programs',
    description: 'Your STEM programs appear when students and parents research emerging tech careers. Reach prospective students at the moment of intent.',
    highlight: 'Program Visibility'
  },
  {
    icon: Network,
    title: 'Employer Network Access',
    description: 'Connect with 500+ employers actively hiring in AI, quantum, semiconductor, and emerging tech for student placements.',
    highlight: '500+ Employers'
  },
  {
    icon: Briefcase,
    title: 'Work-Based Learning Hub',
    description: 'Match students with internships, co-ops, and apprenticeships. Build employer partnerships for hands-on learning.',
    highlight: 'Industry Partnerships'
  },
  {
    icon: Globe,
    title: 'Host Recruitment Events',
    description: 'Organize virtual career fairs and on-campus recruiting events through our platform. Bring employers to your students.',
    highlight: 'Career Events'
  },
  {
    icon: BarChart3,
    title: 'Outcomes & Accreditation',
    description: 'Real-time placement tracking, salary verification, and automated reports for ABET, HLC, and regional accreditors.',
    highlight: 'Verifiable Data'
  },
  {
    icon: Handshake,
    title: 'Curriculum Advisory Matching',
    description: 'Connect with industry experts for curriculum input, guest lectures, sponsored research, and equipment donations.',
    highlight: 'Industry Input'
  }
];

// ===========================================
// TESTIMONIALS - By Partner Type
// ===========================================
const TESTIMONIALS = [
  {
    quote: "STEMWorkforce transformed how we connect graduates with industry. Our placement rate in semiconductor increased 34% in the first year, and we now have direct relationships with Intel, TSMC, and Samsung.",
    author: "Dr. Sarah Chen",
    role: "Dean of Engineering",
    institution: "Arizona State University",
    type: "University",
    avatar: "SC",
    metric: "+34% placement"
  },
  {
    quote: "As a community college, we struggled to compete with 4-year schools for employer attention. This platform leveled the playing field - our graduates now get hired at the same companies.",
    author: "Maria Rodriguez",
    role: "VP of Workforce Development",
    institution: "Maricopa Community Colleges",
    type: "Community College",
    avatar: "MR",
    metric: "3x employer connections"
  },
  {
    quote: "The verified outcome tracking alone is worth the partnership. We've redesigned three programs based on the skills gap data, and our employer satisfaction scores increased significantly.",
    author: "Michael Torres",
    role: "CEO",
    institution: "General Assembly",
    type: "Bootcamp",
    avatar: "MT",
    metric: "+28% satisfaction"
  },
  {
    quote: "Finding Q-clearance eligible interns was our biggest challenge. STEMWorkforce's security pipeline has transformed our intern-to-hire conversion rate.",
    author: "Dr. James Wright",
    role: "Director of Workforce Programs",
    institution: "Sandia National Laboratories",
    type: "National Lab",
    avatar: "JW",
    metric: "2x conversion rate"
  }
];

// ===========================================
// PARTNERSHIP TIERS - Institution-Focused
// ===========================================
const PARTNERSHIP_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Get your programs listed',
    features: [
      'List up to 5 programs',
      'Basic program analytics',
      'Employer network directory access',
      'Request work-based learning partnerships',
      'Email support'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Growth',
    price: '$499/mo',
    description: 'Build industry partnerships',
    features: [
      'Unlimited program listings',
      'Outcome tracking dashboard',
      'Employer matching & introductions',
      'Host virtual career fairs (2/year)',
      'Skills gap analysis reports',
      'Work-based learning matching',
      'Quarterly industry briefings'
    ],
    cta: 'Start Growth Plan',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full institutional partnership',
    features: [
      'Everything in Growth',
      'Dedicated partnership manager',
      'Unlimited career event hosting',
      'Accreditation report automation',
      'API integrations (SIS, LMS)',
      'Curriculum advisory board matching',
      'Sponsored research connections'
    ],
    cta: 'Schedule Demo',
    highlighted: false
  }
];

// ===========================================
// TRUST SIGNALS
// ===========================================
const TRUST_SIGNALS = [
  { label: 'FERPA Compliant', icon: Shield },
  { label: 'SOC 2 Certified', icon: Lock },
  { label: 'No Data Selling', icon: FileCheck },
  { label: '24-Hour Onboarding', icon: Clock }
];

// ===========================================
// SUCCESS METRICS
// ===========================================
const SUCCESS_METRICS = [
  { value: '450+', label: 'Education Partners', icon: Building2 },
  { value: '2.5M+', label: 'Students & Parents Reached', icon: Users },
  { value: '94%', label: 'Avg Placement Rate', icon: Target },
  { value: '500+', label: 'Employer Partners', icon: Briefcase }
];

// ===========================================
// MAIN COMPONENT
// ===========================================
const EducationPartnersLandingPage: React.FC = () => {
  const [activePartnerType, setActivePartnerType] = useState('university');
  const selectedPartner = PARTNER_TYPES.find(p => p.id === activePartnerType);

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'ring') => {
    const colors: Record<string, Record<string, string>> = {
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500', ring: 'ring-indigo-500/30' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', ring: 'ring-emerald-500/30' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', ring: 'ring-purple-500/30' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500', ring: 'ring-blue-500/30' },
      amber: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', ring: 'ring-amber-500/30' },
      pink: { bg: 'bg-pink-600', text: 'text-pink-400', border: 'border-pink-500', ring: 'ring-pink-500/30' }
    };
    return colors[color]?.[type] || colors.indigo[type];
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              For Education Partners
            </motion.div>

            {/* Main Headline - Institution focused */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Bridge Your Programs to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Industry Demand
              </span>
            </motion.h1>

            {/* Subheadline - Institution value proposition */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              List your programs to reach prospective students, build industry partnerships for work-based learning,
              and host recruitment events that bring employers to your campus.{' '}
              <span className="text-white font-medium">450+ institutions trust us to connect their programs with industry.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link
                to="/education-partner-apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Apply to Partner - It's Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact?type=education-demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                Schedule a Demo
              </Link>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              {TRUST_SIGNALS.map((signal, idx) => {
                const Icon = signal.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-green-500" />
                    <span>{signal.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 border-y border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {SUCCESS_METRICS.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Types Section - Interactive */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Tailored for Your Institution Type
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Whether you're a research university, community college, bootcamp, or national lab,
              we have solutions designed for your specific needs.
            </p>
          </div>

          {/* Partner Type Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {PARTNER_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = activePartnerType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setActivePartnerType(type.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? `${getColorClasses(type.color, 'bg')} text-white shadow-lg`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{type.title.split(' ')[0]}</span>
                  <span className="sm:hidden">{type.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Partner Details */}
          {selectedPartner && (
            <motion.div
              key={selectedPartner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-gray-900 border rounded-2xl overflow-hidden ${getColorClasses(selectedPartner.color, 'border')}/30`}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left - Content */}
                <div className="p-8 lg:p-12">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getColorClasses(selectedPartner.color, 'bg')}/20 ${getColorClasses(selectedPartner.color, 'text')}`}>
                    {React.createElement(selectedPartner.icon, { className: 'w-4 h-4' })}
                    {selectedPartner.title}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{selectedPartner.keyBenefit}</h3>
                  <p className="text-gray-400 mb-8">{selectedPartner.description}</p>

                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${getColorClasses(selectedPartner.color, 'text')}`}>
                    Key Benefits
                  </h4>
                  <ul className="space-y-4">
                    {selectedPartner.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      to="/education-partner-apply"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${getColorClasses(selectedPartner.color, 'bg')} text-white hover:opacity-90`}
                    >
                      Apply as {selectedPartner.title.split(' ')[0]}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right - Stats */}
                <div className={`bg-gradient-to-br ${getColorClasses(selectedPartner.color, 'bg')}/10 p-8 lg:p-12 border-l border-gray-800`}>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-6 ${getColorClasses(selectedPartner.color, 'text')}`}>
                    Partner Success Metrics
                  </h4>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {selectedPartner.id === 'informal' ? (
                      <>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.participants}</div>
                          <div className="text-sm text-gray-400">Participants</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.pathways}</div>
                          <div className="text-sm text-gray-400">Career Pathways</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.grants}</div>
                          <div className="text-sm text-gray-400">Grant Funding</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.placements}</div>
                          <div className="text-sm text-gray-400">Placement Rate</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.employers}</div>
                          <div className="text-sm text-gray-400">Employer Partners</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">{selectedPartner.stats.avgSalary}</div>
                          <div className="text-sm text-gray-400">Avg Starting Salary</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Special callouts by type */}
                  {selectedPartner.id === 'national-lab' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-white mb-1">Security Clearance Pipeline</div>
                          <div className="text-sm text-gray-400">Pre-screened candidates for Q-clearance, TS/SCI, and other security requirements</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPartner.id === 'informal' && (
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-white mb-1">NSF STEM Ecosystem Partner</div>
                          <div className="text-sm text-gray-400">Demonstrate impact on STEM pipeline for grant reporting and funding applications</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* What Partners Get - Features Grid */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Tools to Grow Your Institution
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Promote your programs, build industry partnerships, and track outcomes for accreditation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Opportunities */}
      <section id="employers" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Industries Seeking Your Graduates
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              500+ employers actively recruiting across high-growth emerging tech sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRY_OPPORTUNITIES.map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${industry.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {industry.icon}
                  </div>
                  {industry.badge && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full">
                      {industry.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{industry.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-green-400 font-medium">{industry.growth}</span>
                    <span className="text-gray-500 ml-1">job growth</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">{industry.jobs}</span>
                    <span className="text-gray-500 ml-1">open roles</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-400">
              From application to launch in as little as 48 hours
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Apply Online', description: 'Complete a 10-minute application with your institution details', icon: FileCheck },
              { step: '02', title: 'Verification', description: 'We verify your accreditation and programs within 24-48 hours', icon: UserCheck },
              { step: '03', title: 'List Programs', description: 'Add your programs to reach students researching STEM careers', icon: BookOpen },
              { step: '04', title: 'Build Partnerships', description: 'Connect with employers for recruiting events and work-based learning', icon: Handshake }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 border-2 border-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-400">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Trusted by Leading Institutions
            </h2>
            <p className="text-xl text-gray-400">
              See how education partners are transforming student outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full">
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-indigo-400">{testimonial.institution}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Flexible Partnership Options
            </h2>
            <p className="text-xl text-gray-400">
              Start free and scale as your needs grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PARTNERSHIP_TIERS.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-gray-900 border rounded-2xl p-8 ${
                  tier.highlighted
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/20'
                    : 'border-gray-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
                <p className="text-gray-400 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.name === 'Enterprise' ? '/contact?type=education-enterprise' : '/education-partner-apply'}
                  className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${
                    tier.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-12 text-center">
            <Globe className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Student Outcomes?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 450+ institutions connecting students with careers in AI, quantum computing,
              semiconductor, and other high-growth sectors. Apply today - it's free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/education-partner-apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
              >
                Apply Now - It's Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact?type=education-demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationPartnersLandingPage;
