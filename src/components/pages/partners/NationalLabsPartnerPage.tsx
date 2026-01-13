// ===========================================
// National Labs & Research Partners Landing Page
// DOE Labs, FFRDCs, University Research Centers
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Atom,
  Shield,
  GraduationCap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  TrendingUp,
  FileCheck,
  Microscope,
  Network
} from 'lucide-react';
import EventSponsorshipSection from './EventSponsorshipSection';

// ===========================================
// VALUE PROPOSITIONS
// ===========================================
const VALUE_PROPOSITIONS = [
  {
    icon: Shield,
    title: 'Q-Clearance Talent Pipeline',
    description: 'Pre-screen candidates for Q and L clearance eligibility, reducing time-to-hire by 40% and eliminating unqualified applicants before they enter your recruitment funnel.',
    highlight: '40% Faster Hiring',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: FileCheck,
    title: 'ITAR/EAR Compliance Automation',
    description: 'Built-in export control verification ensures every candidate meets citizenship and export control requirements before matching.',
    highlight: 'Compliance Built-In',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: GraduationCap,
    title: 'Fellowship Program Management',
    description: 'Promote SULI, SCGSR, CCI, and lab-specific programs to 125,000+ STEM students. Track conversions from intern to full-time.',
    highlight: '125K+ Students',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Network,
    title: 'Research Collaboration Matching',
    description: 'AI-powered matching connects your PIs with university researchers, students, and industry collaborators based on research interests.',
    highlight: 'AI-Powered Matching',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Microscope,
    title: 'PhD & Postdoc Recruiting',
    description: 'Direct access to doctoral candidates in physics, nuclear engineering, materials science, and computational fields from 320+ universities.',
    highlight: '320+ Universities',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    icon: Clock,
    title: 'Clearance Pipeline Tracking',
    description: 'Track candidate progression through SF-86 submission, investigation, and adjudication with timeline predictions.',
    highlight: 'Full Visibility',
    color: 'from-rose-500 to-red-500'
  }
];

// ===========================================
// DASHBOARD FEATURES
// ===========================================
const DASHBOARD_FEATURES = [
  {
    title: 'Clearance Pre-Screening',
    description: 'SF-86 readiness assessment, citizenship verification, automated disqualification flagging',
    icon: Shield
  },
  {
    title: 'Fellowship Portal',
    description: 'Program listings, cohort management, mentor assignment, conversion tracking',
    icon: GraduationCap
  },
  {
    title: 'Research Collaboration Finder',
    description: 'PI profiles, publication matching, industry partner introductions',
    icon: Network
  },
  {
    title: 'Compliance Dashboard',
    description: 'ITAR/EAR tracking, export control documentation, audit trails',
    icon: FileCheck
  }
];

// ===========================================
// LAB TYPES
// ===========================================
const LAB_TYPES = [
  { name: 'DOE National Labs', count: '17', examples: 'ORNL, LANL, Sandia, LLNL, Argonne' },
  { name: 'FFRDCs', count: '42', examples: 'MITRE, Aerospace Corp, Lincoln Lab' },
  { name: 'University Research', count: '320+', examples: 'MIT, Stanford, Berkeley, Caltech' },
  { name: 'Industry R&D', count: '500+', examples: 'IBM Research, Google DeepMind, Bell Labs' }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "STEMWorkforce reduced our time-to-fill for Q-cleared positions from 9 months to under 6. The pre-screening alone saves us hundreds of hours.",
    author: "Dr. Sarah Chen",
    role: "HR Director",
    org: "Oak Ridge National Laboratory",
    avatar: "SC"
  },
  {
    quote: "Our SULI program conversions increased 34% after we started using the fellowship management portal. The visibility is incredible.",
    author: "Michael Torres",
    role: "Workforce Development Manager",
    org: "Sandia National Laboratories",
    avatar: "MT"
  }
];

// ===========================================
// STATS
// ===========================================
const STATS = [
  { value: '17', label: 'DOE Labs Active', icon: Atom },
  { value: '2,400+', label: 'Cleared Candidates', icon: Shield },
  { value: '40%', label: 'Faster Time-to-Fill', icon: Clock },
  { value: '89%', label: 'Intern Conversion Rate', icon: TrendingUp }
];

// ===========================================
// PARTNERSHIP TIERS
// ===========================================
const PARTNERSHIP_TIERS = [
  {
    name: 'Research Partner',
    price: 'Free',
    description: 'Basic talent pipeline access',
    features: [
      'Post up to 10 positions',
      'Basic candidate matching',
      'Fellowship program listing',
      'Standard support'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Lab Partner',
    price: '$2,499/mo',
    description: 'Full clearance pipeline tools',
    features: [
      'Unlimited job postings',
      'Q/L clearance pre-screening',
      'Fellowship cohort management',
      'Research collaboration matching',
      'Compliance dashboard',
      'Dedicated account manager'
    ],
    cta: 'Start Lab Partner',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Multi-facility deployment',
    features: [
      'Everything in Lab Partner',
      'Multi-site administration',
      'API integrations (HRIS, ATS)',
      'Custom compliance workflows',
      'On-site training',
      'Executive business reviews'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

// ===========================================
// COMPONENT
// ===========================================
const NationalLabsPartnerPage: React.FC = () => {
  const [activeLabType, setActiveLabType] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6"
            >
              <Atom className="w-4 h-4" />
              For National Labs & Research Partners
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Build Your{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Clearance-Ready
              </span>
              <br />Talent Pipeline
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Pre-screen candidates for Q and L clearance eligibility, manage fellowship programs,
              and connect with research collaborators.{' '}
              <span className="text-white font-medium">17 DOE labs trust us for their talent pipeline.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/partner-apply?type=national-lab">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2">
                  Schedule Partnership Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="#features">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Explore Features
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <Icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lab Types Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">We Serve All Research Organizations</h2>
            <p className="text-gray-400">From DOE national labs to university research centers</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {LAB_TYPES.map((type, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveLabType(idx)}
                className={`p-6 rounded-xl cursor-pointer transition-all ${
                  activeLabType === idx
                    ? 'bg-amber-500/20 border-2 border-amber-500'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl font-bold text-amber-400 mb-1">{type.count}</div>
                <div className="text-white font-semibold mb-2">{type.name}</div>
                <div className="text-sm text-gray-400">{type.examples}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Purpose-Built for Research Recruiting
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From clearance pre-screening to fellowship management, every feature designed for labs
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
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    {prop.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
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
              Your Lab Partner Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time visibility into your talent pipeline, clearance status, and program performance
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
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Atom className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Lab Partner Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">Live Data</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Active Openings', value: '47', change: '+12 from Q3' },
                  { label: 'Pipeline Size', value: '1,234', change: '+89 this week' },
                  { label: 'Clearance Ready', value: '312', change: 'Q: 245 / L: 67' },
                  { label: 'Intern-to-Hire', value: '78%', change: '+8% vs last yr' }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-sm text-gray-400">{kpi.label}</div>
                    <div className="text-xs text-amber-400 mt-1">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Clearance Pipeline */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Clearance Pipeline Funnel</h4>
                  <div className="space-y-3">
                    {[
                      { stage: 'Applied', count: 2450, width: '100%' },
                      { stage: 'Screened', count: 1823, width: '74%' },
                      { stage: 'Interviewed', count: 892, width: '36%' },
                      { stage: 'Offered', count: 234, width: '10%' },
                      { stage: 'Hired', count: 156, width: '6%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20">{item.stage}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                            style={{ width: item.width }}
                          />
                        </div>
                        <span className="text-xs text-white w-12 text-right">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time to Fill */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Time-to-Fill by Clearance Level</h4>
                  <div className="space-y-3">
                    {[
                      { level: 'Public Trust', days: 45, width: '30%' },
                      { level: 'L Clearance', days: 72, width: '50%' },
                      { level: 'Q Clearance', days: 98, width: '68%' },
                      { level: 'TS/SCI', days: 145, width: '100%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20">{item.level}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: item.width }}
                          />
                        </div>
                        <span className="text-xs text-white w-16 text-right">{item.days} days</span>
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
                  <Icon className="w-8 h-8 text-amber-400 mb-3" />
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
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Leading Labs</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-amber-400">{testimonial.org}</div>
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
            <p className="text-xl text-gray-400">Choose the level that fits your lab's needs</p>
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
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                    : 'bg-white/5 border border-white/10 text-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-2">{tier.price}</div>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-amber-100' : 'text-gray-400'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-amber-400'}`} />
                      <span className={`text-sm ${tier.highlighted ? 'text-white' : 'text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/partner-apply?type=national-lab">
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-white text-amber-600 hover:bg-amber-50'
                      : 'bg-amber-500 text-white hover:bg-amber-400'
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
      <EventSponsorshipSection partnerType="national-labs" primaryColor="amber" />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-3xl"
          >
            <Atom className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Lab's Recruiting?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 17 DOE labs already using STEMWorkforce to build their clearance-ready talent pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-apply?type=national-lab">
                <button className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                  Schedule Partnership Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact?type=lab">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Talk to Our Lab Team
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NationalLabsPartnerPage;
