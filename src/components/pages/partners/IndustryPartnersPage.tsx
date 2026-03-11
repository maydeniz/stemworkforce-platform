// ===========================================
// Industry Partners Landing Page
// Talent Pipeline Partners, Corporate Sponsors
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  GraduationCap,
  DollarSign,
  Network,
  Sparkles,
  Trophy,
  Heart,
  Megaphone
} from 'lucide-react';
import EventSponsorshipSection from './EventSponsorshipSection';

// ===========================================
// VALUE PROPOSITIONS
// ===========================================
const VALUE_PROPOSITIONS = [
  {
    icon: Target,
    title: 'Early Talent Pipeline Building',
    description: 'Access 125,000+ STEM students and career changers before they hit the open market, reducing cost-per-hire by 60% compared to traditional recruiting.',
    highlight: '60% Lower Cost',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: GraduationCap,
    title: 'Apprenticeship & Internship Hosting',
    description: 'Turnkey program administration for registered apprenticeships and internships, including DOL compliance, mentorship matching, and outcome tracking.',
    highlight: 'Turnkey Programs',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Megaphone,
    title: 'Brand Visibility to Emerging Talent',
    description: 'Employer branding presence across platform touchpoints reaching students at key career decision moments.',
    highlight: 'Brand Exposure',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Network,
    title: 'Curriculum Advisory Participation',
    description: 'Connect with education partners to influence curriculum development, ensuring graduates have the specific skills your roles require.',
    highlight: 'Shape Curriculum',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Heart,
    title: 'Diversity Pipeline Development',
    description: 'Access to diverse talent pools including HBCUs, HSIs, tribal colleges, and community colleges with DEI tracking.',
    highlight: 'DEI Focus',
    color: 'from-rose-500 to-red-500'
  },
  {
    icon: Sparkles,
    title: 'Skills-Based Hiring Intelligence',
    description: 'AI-powered matching based on verified skills and competencies rather than pedigree, expanding your qualified candidate pool by 3x.',
    highlight: '3x More Candidates',
    color: 'from-indigo-500 to-violet-500'
  }
];

// ===========================================
// PARTNERSHIP TYPES
// ===========================================
const PARTNERSHIP_TYPES = [
  {
    name: 'Talent Pipeline Partner',
    description: 'Build direct-to-hire pathways from education to employment',
    icon: Users,
    benefits: ['Priority candidate access', 'Internship hosting', 'Career fair presence']
  },
  {
    name: 'Corporate Sponsor',
    description: 'Brand visibility and thought leadership with STEM talent',
    icon: Trophy,
    benefits: ['Event sponsorship', 'Content co-creation', 'Award naming rights']
  },
  {
    name: 'Apprenticeship Host',
    description: 'Develop workforce through registered earn-and-learn programs',
    icon: GraduationCap,
    benefits: ['DOL compliance support', 'Mentorship matching', 'Outcome tracking']
  },
  {
    name: 'Curriculum Advisor',
    description: 'Shape education programs to meet your skill requirements',
    icon: Network,
    benefits: ['Advisory board seats', 'Guest lecture opportunities', 'Capstone projects']
  }
];

// ===========================================
// DASHBOARD FEATURES
// ===========================================
const DASHBOARD_FEATURES = [
  {
    title: 'Talent Pipeline Manager',
    description: 'Candidate sourcing, nurturing, talent pool segmentation, automated outreach',
    icon: Users
  },
  {
    title: 'Internship/Apprenticeship Console',
    description: 'Program setup, mentor matching, progress tracking, conversion management',
    icon: GraduationCap
  },
  {
    title: 'Employer Branding Suite',
    description: 'Company profile, content publishing, testimonials, engagement analytics',
    icon: Megaphone
  },
  {
    title: 'University Relations Manager',
    description: 'Campus recruiting calendar, partnership tracking, event ROI',
    icon: Building2
  }
];

// ===========================================
// STATS
// ===========================================
const STATS = [
  { value: '1,400+', label: 'Employer Partners', icon: Building2 },
  { value: '125K+', label: 'Talent Pool', icon: Users },
  { value: '60%', label: 'Lower Cost-per-Hire', icon: DollarSign },
  { value: '78%', label: 'Intern Conversion', icon: TrendingUp }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "We filled 40 semiconductor engineer roles in 3 months through STEMWorkforce. The pre-qualified pipeline saved us over $200K in recruiting costs.",
    author: "Michelle Park",
    role: "VP of Talent Acquisition",
    org: "Applied Materials",
    avatar: "MP"
  },
  {
    quote: "The apprenticeship program management is incredible. From DOL compliance to mentor matching, everything is handled. We just focus on developing talent.",
    author: "David Thompson",
    role: "Workforce Development Director",
    org: "Northrop Grumman",
    avatar: "DT"
  }
];

// ===========================================
// PARTNERSHIP TIERS
// ===========================================
const PARTNERSHIP_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Basic talent access',
    features: [
      'Post up to 5 jobs',
      'Basic candidate search',
      'Company profile page',
      'Email support'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Growth',
    price: '$1,499/mo',
    description: 'Build your talent pipeline',
    features: [
      'Unlimited job postings',
      'Advanced candidate matching',
      'Internship program hosting',
      'Career fair participation',
      'Employer branding tools',
      'Dedicated recruiter support'
    ],
    cta: 'Start Growth Plan',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Strategic workforce partner',
    features: [
      'Everything in Growth',
      'Apprenticeship program management',
      'Curriculum advisory access',
      'Event sponsorship priority',
      'API integrations (ATS, HRIS)',
      'Executive partnership reviews'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

// ===========================================
// EVENT SPONSORSHIP
// ===========================================
const EVENT_TYPES = [
  { name: 'Virtual Career Fairs', icon: Users, reach: '5,000+ attendees' },
  { name: 'Tech Hackathons', icon: Sparkles, reach: '1,000+ participants' },
  { name: 'Industry Workshops', icon: GraduationCap, reach: '500+ per session' },
  { name: 'Campus Recruiting', icon: Building2, reach: '50+ universities' }
];

// ===========================================
// COMPONENT
// ===========================================
const IndustryPartnersPage: React.FC = () => {
  const [activeType, setActiveType] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6"
            >
              <Building2 className="w-4 h-4" />
              For Industry Partners
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Build Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Talent Pipeline
              </span>
              <br />Before Anyone Else
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Access 125,000+ STEM students and career changers before they hit the open market.
              Host internships, sponsor events, and shape curriculum.{' '}
              <span className="text-white font-medium">1,400+ employers trust us.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/partner-apply?type=industry">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2">
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                Explore Benefits
              </button>
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
                    <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Types Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Partnership Path</h2>
            <p className="text-gray-400">Multiple ways to engage with emerging STEM talent</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {PARTNERSHIP_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveType(idx)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeType === idx
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 text-emerald-400 mb-3" />
                  <div className="text-white font-semibold mb-1">{type.name}</div>
                  <div className="text-sm text-gray-400 mb-3">{type.description}</div>
                  <div className="space-y-1">
                    {type.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {benefit}
                      </div>
                    ))}
                  </div>
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
              Why Leading Companies Partner With Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From early talent access to employer branding, everything to build your workforce
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
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    {prop.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
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

      {/* Event Sponsorship */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Event Sponsorship Opportunities</h2>
            <p className="text-gray-400">Reach STEM talent at key career decision moments</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {EVENT_TYPES.map((event, idx) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">{event.name}</h4>
                  <div className="text-emerald-400 text-sm">{event.reach}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/partner-apply?type=industry">
              <button className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold rounded-xl border border-emerald-500/30 transition-all">
                View Sponsorship Packages
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Industry Partner Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Manage your talent pipeline, track program performance, and measure ROI
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
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Industry Partner Dashboard</span>
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
                  { label: 'Active Postings', value: '34', change: 'Featured: 8' },
                  { label: 'Total Pipeline', value: '2,456', change: '+234 this mo' },
                  { label: 'Qualified Matches', value: '892', change: '78% fit score' },
                  { label: 'Hired YTD', value: '156', change: '+23% vs goal' }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-sm text-gray-400">{kpi.label}</div>
                    <div className="text-xs text-emerald-400 mt-1">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Application Funnel */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Application Funnel</h4>
                  <div className="space-y-3">
                    {[
                      { stage: 'Views', count: 8923, width: '100%' },
                      { stage: 'Applied', count: 2456, width: '28%' },
                      { stage: 'Screened', count: 1234, width: '14%' },
                      { stage: 'Interviewed', count: 456, width: '5%' },
                      { stage: 'Hired', count: 156, width: '2%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20">{item.stage}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                            style={{ width: item.width }}
                          />
                        </div>
                        <span className="text-xs text-white w-12 text-right">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Performance */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Source Performance</h4>
                  <div className="space-y-3">
                    {[
                      { source: 'Platform Direct', apps: 1234, hires: 89, cost: '$1.2K' },
                      { source: 'Career Fair', apps: 456, hires: 34, cost: '$2.8K' },
                      { source: 'University', apps: 345, hires: 28, cost: '$1.9K' },
                      { source: 'Referral', apps: 234, hires: 45, cost: '$0.8K' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 w-28">{item.source}</span>
                        <span className="text-white">{item.apps} apps</span>
                        <span className="text-emerald-400">{item.hires} hires</span>
                        <span className="text-gray-500">{item.cost}/hire</span>
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
                  <Icon className="w-8 h-8 text-emerald-400 mb-3" />
                  <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-emerald-400">{testimonial.org}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Partnership Tiers</h2>
            <p className="text-xl text-gray-400">Choose the level that fits your recruiting goals</p>
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
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
                    : 'bg-white/5 border border-white/10 text-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-2">{tier.price}</div>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-emerald-400'}`} />
                      <span className={`text-sm ${tier.highlighted ? 'text-white' : 'text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/partner-apply?type=industry">
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                      : 'bg-emerald-500 text-white hover:bg-emerald-400'
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
      <EventSponsorshipSection partnerType="industry" primaryColor="emerald" />

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-3xl"
          >
            <Building2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Build Your Talent Pipeline?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 1,400+ employers using STEMWorkforce to access early talent and reduce hiring costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-apply?type=industry">
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact?type=industry">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Talk to Our Team
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IndustryPartnersPage;
