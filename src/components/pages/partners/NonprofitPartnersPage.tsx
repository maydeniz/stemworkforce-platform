// ===========================================
// Nonprofit Partners Landing Page
// Workforce Development Orgs, STEM Education Nonprofits
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Briefcase,
  FileText,
  Award,
  DollarSign,
  Network,
  Sparkles,
  Globe,
  Handshake,
  BookOpen
} from 'lucide-react';
import EventSponsorshipSection from './EventSponsorshipSection';

// ===========================================
// VALUE PROPOSITIONS
// ===========================================
const VALUE_PROPOSITIONS = [
  {
    icon: Globe,
    title: 'Program Reach Amplification',
    description: 'Expose your training programs and services to 125,000+ job seekers actively looking for career advancement, multiplying your outreach without additional marketing spend.',
    highlight: '125K+ Reach',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: FileText,
    title: 'Grant-Ready Outcome Metrics',
    description: 'Automated collection of placement rates, wage outcomes, and retention data formatted for foundation and government funder reporting requirements.',
    highlight: 'Funder-Ready Reports',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Handshake,
    title: 'Employer Connection Facilitation',
    description: 'Direct introduction to 1,400+ employer partners actively seeking diverse talent pipelines, creating placement opportunities for your participants.',
    highlight: '1,400+ Employers',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Network,
    title: 'Coalition Building Tools',
    description: 'Connect with other nonprofits, education partners, and employers in your region to form workforce development coalitions and pursue collaborative grants.',
    highlight: 'Regional Coalitions',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Users,
    title: 'Participant Journey Tracking',
    description: 'Follow participants from initial intake through training, placement, and 180-day retention with unified longitudinal outcome data.',
    highlight: 'Full Lifecycle',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Sparkles,
    title: 'Impact Storytelling Data',
    description: 'Generate compelling impact narratives with participant success stories, demographic breakdowns, and economic mobility metrics for donor communications.',
    highlight: 'Donor-Ready Stories',
    color: 'from-indigo-500 to-blue-500'
  }
];

// ===========================================
// NONPROFIT TYPES
// ===========================================
const NONPROFIT_TYPES = [
  {
    name: 'Workforce Development',
    description: 'Job training, career services, employment programs',
    icon: Briefcase,
    examples: 'Goodwill, Year Up, Per Scholas'
  },
  {
    name: 'STEM Education',
    description: 'Youth STEM programs, coding bootcamps, makerspaces',
    icon: BookOpen,
    examples: 'Girls Who Code, Black Girls CODE, FIRST'
  },
  {
    name: 'Professional Associations',
    description: 'Industry groups, membership organizations',
    icon: Users,
    examples: 'SWE, NSBE, SHPE, AISES'
  },
  {
    name: 'DEI Organizations',
    description: 'Diversity-focused talent development',
    icon: Heart,
    examples: 'Lesbians Who Tech, Out in Tech, /dev/color'
  }
];

// ===========================================
// DASHBOARD FEATURES
// ===========================================
const DASHBOARD_FEATURES = [
  {
    title: 'Participant Intake & Tracking',
    description: 'Online intake forms, barrier assessment, case management, milestone recording',
    icon: Users
  },
  {
    title: 'Grant Reporting Console',
    description: 'Funder-specific templates, automated data aggregation, narrative generator',
    icon: FileText
  },
  {
    title: 'Employer Partnership Manager',
    description: 'Employer outreach tracking, placement facilitation, recognition automation',
    icon: Handshake
  },
  {
    title: 'Coalition Collaboration Hub',
    description: 'Partner directory, shared consent management, regional planning tools',
    icon: Network
  }
];

// ===========================================
// STATS
// ===========================================
const STATS = [
  { value: '250+', label: 'Nonprofit Partners', icon: Heart },
  { value: '84%', label: 'Placement Rate', icon: Target },
  { value: '+$18.2K', label: 'Avg Wage Increase', icon: TrendingUp },
  { value: '92%', label: 'Funder Renewal Rate', icon: Award }
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "The grant reporting automation alone saved us 20 hours per month. Now we spend that time serving more participants instead of chasing data.",
    author: "Angela Williams",
    role: "Executive Director",
    org: "TechBridge",
    avatar: "AW"
  },
  {
    quote: "STEMWorkforce helped us demonstrate 3.8:1 ROI to our funders. That data secured a $2M grant renewal that was at risk.",
    author: "Marcus Johnson",
    role: "Program Director",
    org: "Year Up",
    avatar: "MJ"
  }
];

// ===========================================
// PARTNERSHIP TIERS
// ===========================================
const PARTNERSHIP_TIERS = [
  {
    name: 'Community',
    price: 'Free',
    description: 'Basic program visibility',
    features: [
      'List up to 3 programs',
      'Basic participant tracking',
      'Employer directory access',
      'Community support'
    ],
    cta: 'Get Started Free',
    highlighted: false
  },
  {
    name: 'Impact',
    price: '$249/mo',
    description: 'Full outcome tracking & reporting',
    features: [
      'Unlimited program listings',
      'Grant reporting automation',
      'Employer partnership facilitation',
      'Participant journey tracking',
      'Impact dashboard',
      'Priority support'
    ],
    cta: 'Start Impact Plan',
    highlighted: true
  },
  {
    name: 'Coalition',
    price: 'Custom',
    description: 'Regional workforce collaboration',
    features: [
      'Everything in Impact',
      'Multi-org data sharing',
      'Coalition grant support',
      'Regional analytics',
      'Funder presentation tools',
      'Dedicated success manager'
    ],
    cta: 'Contact Us',
    highlighted: false
  }
];

// ===========================================
// IMPACT METRICS
// ===========================================
const IMPACT_METRICS = [
  { metric: 'Participants Served', value: '45,000+', icon: Users },
  { metric: 'Total Wages Generated', value: '$156M+', icon: DollarSign },
  { metric: 'Grant Funds Tracked', value: '$89M+', icon: FileText },
  { metric: 'Employer Connections', value: '12,000+', icon: Handshake }
];

// ===========================================
// COMPONENT
// ===========================================
const NonprofitPartnersPage: React.FC = () => {
  const [activeType, setActiveType] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              For Nonprofit Partners
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Amplify Your{' '}
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                Mission Impact
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Reach 125,000+ job seekers, automate grant reporting, and connect participants
              with 1,400+ employers.{' '}
              <span className="text-white font-medium">250+ nonprofits trust us to amplify their impact.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/partner-apply?type=nonprofit">
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2">
                  Join as Nonprofit Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="#features">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  See How It Works
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
                    <Icon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nonprofit Types Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">We Serve All Mission-Driven Organizations</h2>
            <p className="text-gray-400">From workforce development to STEM education nonprofits</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {NONPROFIT_TYPES.map((type, idx) => {
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
                      ? 'bg-pink-500/20 border-2 border-pink-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 text-pink-400 mb-3" />
                  <div className="text-white font-semibold mb-1">{type.name}</div>
                  <div className="text-sm text-gray-400 mb-2">{type.description}</div>
                  <div className="text-xs text-pink-400">{type.examples}</div>
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
              Tools to Maximize Your Impact
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From participant tracking to grant reporting, everything you need to serve your mission
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
                  <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2">
                    {prop.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
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

      {/* Impact Showcase */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Collective Impact of Our Nonprofit Network</h2>
            <p className="text-gray-400">Together, we're transforming lives and communities</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {IMPACT_METRICS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl text-center"
                >
                  <Icon className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                  <div className="text-gray-400">{item.metric}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Nonprofit Partner Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track participant outcomes, automate grant reporting, and demonstrate your impact
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
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Nonprofit Partner Dashboard</span>
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
                  { label: 'Active Programs', value: '12', change: 'Training: 8' },
                  { label: 'Total Served', value: '3,456', change: '+567 Q4' },
                  { label: 'Placement Rate', value: '84%', change: '+6% vs Q3' },
                  { label: 'Avg Wage Increase', value: '+$18.2K', change: 'vs entry' }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                    <div className="text-sm text-gray-400">{kpi.label}</div>
                    <div className="text-xs text-pink-400 mt-1">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Participant Journey */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Participant Journey Funnel</h4>
                  <div className="space-y-3">
                    {[
                      { stage: 'Intake', count: 3456, width: '100%' },
                      { stage: 'Enrolled', count: 2890, width: '84%' },
                      { stage: 'Completed', count: 2234, width: '65%' },
                      { stage: 'Job Ready', count: 1892, width: '55%' },
                      { stage: 'Placed', count: 1456, width: '42%' },
                      { stage: 'Retained 6mo', count: 1234, width: '36%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-24">{item.stage}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                            style={{ width: item.width }}
                          />
                        </div>
                        <span className="text-xs text-white w-12 text-right">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grant Reporting */}
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-4">Grant Reporting Status</h4>
                  <div className="space-y-3">
                    {[
                      { funder: 'Ford Foundation', due: 'Jan 15', status: 'Draft', statusColor: 'text-amber-400' },
                      { funder: 'DOL WIOA', due: 'Jan 30', status: 'Ready', statusColor: 'text-green-400' },
                      { funder: 'NSF ATE', due: 'Feb 15', status: 'Not Due', statusColor: 'text-gray-400' },
                      { funder: 'State WDB', due: 'Mar 1', status: 'Not Due', statusColor: 'text-gray-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-white text-sm">{item.funder}</span>
                        <span className="text-gray-400 text-sm">Due: {item.due}</span>
                        <span className={`text-sm font-medium ${item.statusColor}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-white">Recent Success Stories (For Donor Communications)</h4>
                  <button className="text-pink-400 text-sm hover:underline">Export for Report →</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Maria S.', journey: 'Single mom → AWS Cloud Engineer', salary: '$78K', time: '4 months' },
                    { name: 'James T.', journey: 'Formerly incarcerated → IT Support', salary: '$52K', time: '6 months' },
                    { name: 'Aisha K.', journey: 'Career changer → Data Analyst', salary: '$65K', time: '3 months' }
                  ].map((story, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-medium">{story.name}</span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-gray-300">{story.journey}</span>
                        <span className="text-pink-400 ml-2">({story.salary})</span>
                      </div>
                      <span className="text-gray-500 text-sm">{story.time}</span>
                    </div>
                  ))}
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
                  <Icon className="w-8 h-8 text-pink-400 mb-3" />
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
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Mission-Driven Leaders</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-pink-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-pink-400">{testimonial.org}</div>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Nonprofit-Friendly Pricing</h2>
            <p className="text-xl text-gray-400">Affordable plans designed for mission-driven organizations</p>
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
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                    : 'bg-white/5 border border-white/10 text-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-2">{tier.price}</div>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-pink-100' : 'text-gray-400'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-pink-400'}`} />
                      <span className={`text-sm ${tier.highlighted ? 'text-white' : 'text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/partner-apply?type=nonprofit">
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-white text-pink-600 hover:bg-pink-50'
                      : 'bg-pink-500 text-white hover:bg-pink-400'
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
      <EventSponsorshipSection partnerType="nonprofit" primaryColor="pink" />

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-3xl"
          >
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Amplify Your Impact?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 250+ nonprofits using STEMWorkforce to serve their mission and demonstrate impact to funders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-apply?type=nonprofit">
                <button className="px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
                  Join as Nonprofit Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact?type=nonprofit">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                  Schedule a Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NonprofitPartnersPage;
