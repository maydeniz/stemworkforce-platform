// ===========================================
// Government Partners Landing Page
// Federal Agencies, State Workforce Boards, CHIPS Act
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Map,
  DollarSign,
  Shield,
  Briefcase,
  BookOpen,
  Landmark,
  Flag
} from 'lucide-react';
import EventSponsorshipSection from './EventSponsorshipSection';

// ===========================================
// VALUE PROPOSITIONS
// ===========================================
const VALUE_PROPOSITIONS = [
  {
    icon: FileCheck,
    title: 'CHIPS Act Workforce Tracking',
    description: 'End-to-end tracking of CHIPS Act funded training programs, from enrollment through job placement, with automated reporting for federal grant compliance.',
    highlight: 'Grant Compliance',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Map,
    title: 'Regional Workforce Analytics',
    description: 'Real-time labor market intelligence showing STEM talent supply/demand by region, enabling data-driven workforce investment decisions.',
    highlight: 'Data-Driven Insights',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: 'Grant Outcome Documentation',
    description: 'Automated collection of placement rates, wage outcomes, and employment retention data formatted for NSF, DOE, and state workforce reporting.',
    highlight: 'Automated Reporting',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Veterans Preference Automation',
    description: 'Integrated veterans status verification and preference point calculation, ensuring OFCCP compliance and streamlined federal hiring.',
    highlight: 'OFCCP Compliant',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Multi-Program Cohort Tracking',
    description: 'Track participants across multiple workforce programs with unified outcome reporting and cross-program analytics.',
    highlight: 'Unified Tracking',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: DollarSign,
    title: 'Economic Impact Modeling',
    description: 'Quantify program ROI through wage gains, tax revenue increases, and regional economic multiplier effects to justify continued funding.',
    highlight: 'ROI Analysis',
    color: 'from-rose-500 to-red-500'
  }
];

// ===========================================
// AGENCY TYPES
// ===========================================
const AGENCY_TYPES = [
  {
    name: 'Federal Agencies',
    examples: 'DOE, DOD, NASA, NSF, DOL',
    icon: Flag,
    programs: 'CHIPS Act, Workforce Innovation, STEM Education'
  },
  {
    name: 'State Workforce Boards',
    examples: 'All 50 states + territories',
    icon: Map,
    programs: 'WIOA, State Grants, Regional Development'
  },
  {
    name: 'Economic Development',
    examples: 'EDA, State EDCs, Regional Councils',
    icon: TrendingUp,
    programs: 'Talent Attraction, Site Selection Support'
  },
  {
    name: 'Education Agencies',
    examples: 'State Ed Departments, School Districts',
    icon: BookOpen,
    programs: 'CTE, Career Pathways, STEM Integration'
  }
];

// ===========================================
// DASHBOARD FEATURES
// ===========================================
const DASHBOARD_FEATURES = [
  {
    title: 'Program Management Console',
    description: 'Multi-program portfolio view, participant enrollment, milestone tracking, budget monitoring',
    icon: Briefcase
  },
  {
    title: 'Compliance Reporting Engine',
    description: 'Pre-built templates for DOE, NSF, DOL, CHIPS Act with automated data aggregation',
    icon: FileCheck
  },
  {
    title: 'Regional Labor Market Dashboard',
    description: 'Real-time job analytics, talent supply/demand gaps, wage trends, competitor benchmarking',
    icon: Map
  },
  {
    title: 'Employer Partnership Manager',
    description: 'Employer commitment tracking, hiring pledges, OJT agreements, advisory councils',
    icon: Users
  }
];

// ===========================================
// STATS
// ===========================================
const STATS = [
  { value: '23', label: 'Active Programs', icon: Target },
  { value: '8,456', label: 'Total Enrolled', icon: Users },
  { value: '87%', label: 'Placement Rate', icon: TrendingUp },
  { value: '$24.5K', label: 'Avg Wage Gain', icon: DollarSign }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "STEMWorkforce transformed how we track CHIPS Act program outcomes. What used to take weeks of manual data collection now happens automatically.",
    author: "Jennifer Martinez",
    role: "Program Director",
    org: "Department of Commerce",
    avatar: "JM"
  },
  {
    quote: "The regional analytics dashboard gave us the data we needed to justify a $12M workforce investment to state legislators.",
    author: "Robert Chen",
    role: "Executive Director",
    org: "Ohio Workforce Development Board",
    avatar: "RC"
  }
];

// ===========================================
// PARTNERSHIP TIERS
// ===========================================
const PARTNERSHIP_TIERS = [
  {
    name: 'Agency Starter',
    price: 'Free',
    description: 'Basic workforce analytics',
    features: [
      'Regional labor market data',
      'Basic program tracking (up to 3)',
      'Standard compliance templates',
      'Email support'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Government Partner',
    price: '$4,999/mo',
    description: 'Full compliance & analytics suite',
    features: [
      'Unlimited program tracking',
      'CHIPS Act compliance automation',
      'Advanced regional analytics',
      'Multi-agency collaboration',
      'Custom report builder',
      'Dedicated success manager'
    ],
    cta: 'Start Government Partner',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'State-wide deployment',
    features: [
      'Everything in Government Partner',
      'State-wide data aggregation',
      'API integrations (LMI, WIOA)',
      'Legislative reporting dashboards',
      'On-site training & support',
      'Executive briefings'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

// ===========================================
// COMPLIANCE BADGES
// ===========================================
const COMPLIANCE_BADGES = [
  { name: 'CHIPS Act', desc: 'Semiconductor workforce tracking' },
  { name: 'WIOA', desc: 'Workforce Innovation compliance' },
  { name: 'NSF ATE', desc: 'Advanced Tech Education reporting' },
  { name: 'DOL ETA', desc: 'Employment & Training Administration' }
];

// ===========================================
// COMPONENT
// ===========================================
const GovernmentPartnersPage: React.FC = () => {
  const [activeAgency, setActiveAgency] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6"
            >
              <Landmark className="w-4 h-4" />
              For Government Partners
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Data-Driven{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Workforce Development
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Track CHIPS Act programs, automate grant compliance reporting, and access real-time
              regional workforce analytics.{' '}
              <span className="text-white font-medium">23 federal and state agencies trust us.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/partner-apply?type=government">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2">
                  Request Agency Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="#features">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Explore Features
                </button>
              </Link>
            </motion.div>

            {/* Compliance Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {COMPLIANCE_BADGES.map((badge, idx) => (
                <div key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-blue-400 font-semibold">{badge.name}</span>
                  <span className="text-gray-500 mx-2">|</span>
                  <span className="text-gray-400 text-sm">{badge.desc}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agency Types Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">We Serve All Government Levels</h2>
            <p className="text-gray-400">From federal agencies to local workforce boards</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {AGENCY_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveAgency(idx)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeAgency === idx
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-3" />
                  <div className="text-white font-semibold mb-1">{type.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{type.examples}</div>
                  <div className="text-xs text-blue-400">{type.programs}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Built for Government Workforce Programs
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compliance automation, regional analytics, and outcome tracking designed for public sector needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUE_PROPOSITIONS.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${prop.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                    {prop.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {prop.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Government Partner Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time program tracking, compliance status, and regional workforce intelligence
            </p>
          </div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Dashboard Header */}
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Government Partner Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">Live Data</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Alert Bar */}
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400">Q4 Report due in 5 days</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-red-400">3 programs need attention</span>
                </div>
                <button className="px-4 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg">
                  View All
                </button>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Active Programs', value: '23', change: 'CHIPS: 8' },
                  { label: 'Total Enrolled', value: '8,456', change: '+1,234 Q4' },
                  { label: 'Placement Rate', value: '87%', change: '+3% vs target' },
                  { label: 'Avg Wage Gain', value: '+$24.5K', change: '+12% vs entry' }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-sm text-gray-400">{kpi.label}</div>
                    <div className="text-xs text-blue-400 mt-1">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Program Status */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">CHIPS Act Program Status</h4>
                  <div className="space-y-3">
                    {[
                      { program: 'Semiconductor Fab', status: 'On Track', pct: 94, color: 'bg-green-500' },
                      { program: 'Advanced Packaging', status: 'At Risk', pct: 78, color: 'bg-amber-500' },
                      { program: 'Design Workforce', status: 'On Track', pct: 89, color: 'bg-green-500' },
                      { program: 'Equipment Tech', status: 'On Track', pct: 92, color: 'bg-green-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-32 truncate">{item.program}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                        <span className={`text-xs w-16 ${item.status === 'At Risk' ? 'text-amber-400' : 'text-green-400'}`}>
                          {item.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Economic Impact */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Economic Impact Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Wages Generated', value: '$45.2M' },
                      { label: 'Tax Revenue Impact', value: '$8.4M' },
                      { label: 'Economic Multiplier', value: '2.3x' },
                      { label: 'ROI Ratio', value: '3.8:1' }
                    ].map((item, idx) => (
                      <div key={idx} className="text-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{item.value}</div>
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Features Grid */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {DASHBOARD_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Government Agencies</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-blue-400">{testimonial.org}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Partnership Tiers</h2>
            <p className="text-xl text-gray-400">Choose the level that fits your agency's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PARTNERSHIP_TIERS.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                    : 'bg-white/5 border border-white/10 text-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-2">{tier.price}</div>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-blue-100' : 'text-gray-400'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-blue-400'}`} />
                      <span className={`text-sm ${tier.highlighted ? 'text-white' : 'text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/partner-apply?type=government">
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}>
                    {tier.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Sponsorship Section */}
      <EventSponsorshipSection partnerType="government" primaryColor="blue" />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-3xl"
          >
            <Landmark className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Workforce Development?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 23 federal and state agencies using STEMWorkforce for data-driven workforce programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-apply?type=government">
                <button className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                  Request Agency Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact?type=government">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Talk to Our Government Team
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GovernmentPartnersPage;
