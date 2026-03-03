// ===========================================
// College Students Landing Page
// Hub for undergraduate, graduate students, and recent grads
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Rocket,
  TrendingUp,
  FlaskConical,
  Building2,
  Users,
  DollarSign,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
  FileText,
  MessageSquare,
  Code,
  Award,
  Search,
  BookOpen,
  Shield,
  Sparkles,
  Network,
  Calendar,
  Lightbulb,
} from 'lucide-react';

// ===========================================
// RESOURCE CATEGORIES - Main Navigation Sections
// ===========================================
const RESOURCE_CATEGORIES = [
  {
    id: 'career-launch',
    title: 'Career Launch',
    icon: Rocket,
    description: 'Job search, resumes, interviews, and offer negotiation',
    color: 'blue',
    links: [
      { label: 'Job Search Hub', path: '/college/career-launch', primary: true },
      { label: 'Resume Builder', path: '/college/resume-builder' },
      { label: 'Interview Prep', path: '/college/interview-prep' },
      { label: 'Offer Comparison', path: '/college/offer-compare' },
      { label: 'Salary Negotiation', path: '/college/salary-negotiation' },
    ],
  },
  {
    id: 'professional-dev',
    title: 'Professional Development',
    icon: TrendingUp,
    description: 'Build skills, certifications, and your professional network',
    color: 'purple',
    links: [
      { label: 'Skills Assessment', path: '/college/skills-assessment', primary: true },
      { label: 'Certifications', path: '/college/professional-development' },
      { label: 'Technical Portfolio', path: '/college/portfolio-builder' },
      { label: 'Networking', path: '/college/networking' },
      { label: 'Mentorship', path: '/college/mentorship' },
    ],
  },
  {
    id: 'grad-research',
    title: 'Graduate & Research',
    icon: FlaskConical,
    description: 'Graduate school prep, fellowships, and research opportunities',
    color: 'emerald',
    links: [
      { label: 'Grad School Navigator', path: '/college/grad-school-prep', primary: true },
      { label: 'Research Opportunities', path: '/college/research-opportunities' },
      { label: 'Fellowship Finder', path: '/college/fellowships' },
      { label: 'SOP Coach', path: '/college/sop-coach' },
      { label: 'PhD vs Industry', path: '/college/phd-decision' },
    ],
  },
  {
    id: 'govt-finance',
    title: 'Government & Finance',
    icon: Building2,
    description: 'Federal careers, clearances, loans, and financial planning',
    color: 'amber',
    links: [
      { label: 'Federal STEM Careers', path: '/college/government-careers', primary: true },
      { label: 'Clearance Guide', path: '/college/clearance-guide' },
      { label: 'Loan Strategy', path: '/college/loan-strategy' },
      { label: 'Graduate Funding', path: '/college/grad-funding' },
      { label: 'FAFSA Help', path: '/workforce/fafsa-assistant' },
    ],
  },
];

// ===========================================
// YEAR STAGES
// ===========================================
const YEAR_STAGES = [
  { id: 'freshman', label: 'Freshman', focus: 'Explore', actions: 'Discover fields, join clubs, build foundation' },
  { id: 'sophomore', label: 'Sophomore', focus: 'Experience', actions: 'First internship, research, skill building' },
  { id: 'junior', label: 'Junior', focus: 'Focus', actions: 'Target companies, leadership roles, grad school decisions' },
  { id: 'senior', label: 'Senior', focus: 'Launch', actions: 'Full-time search, negotiate offers, plan transition' },
];

// ===========================================
// CAREER TOOLS
// ===========================================
const CAREER_TOOLS = [
  {
    icon: FileText,
    title: 'AI Resume Builder',
    description: 'Create ATS-optimized resumes with real-time AI feedback',
  },
  {
    icon: Code,
    title: 'Technical Portfolio',
    description: 'Showcase projects with our GitHub-integrated portfolio builder',
  },
  {
    icon: MessageSquare,
    title: 'Mock Interviews',
    description: 'AI-powered practice for coding, system design, and behavioral rounds',
  },
  {
    icon: DollarSign,
    title: 'Salary Calculator',
    description: 'Compare offers with total comp data from verified sources',
  },
  {
    icon: Award,
    title: 'Fellowship Finder',
    description: 'Search 500+ STEM fellowships including NSF GRFP, Hertz, Ford',
  },
  {
    icon: Shield,
    title: 'Clearance Guide',
    description: 'Navigate security clearances for government and defense careers',
  },
];

// ===========================================
// SUCCESS METRICS
// ===========================================
const SUCCESS_METRICS = [
  { value: '25,000+', label: 'STEM Internships', icon: Briefcase },
  { value: '$85K', label: 'Avg Starting Salary', icon: TrendingUp },
  { value: '2,500+', label: 'Partner Companies', icon: Building2 },
  { value: '94%', label: 'Placement Rate', icon: Award },
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "The salary negotiation guide helped me counter my first offer. I ended up with $15K more than the initial number plus a signing bonus. Worth way more than my career center ever provided.",
    author: "Alex P.",
    role: "CS @ Georgia Tech → Google SWE",
    metric: "+$15K negotiated",
    avatar: "AP",
  },
  {
    quote: "The fellowship finder saved me weeks of research. I applied to 12 fellowships and won the NSF GRFP. The SOP feedback was incredibly detailed.",
    author: "Dr. Maya L.",
    role: "Physics PhD @ MIT",
    metric: "NSF GRFP Winner",
    avatar: "ML",
  },
  {
    quote: "As a biology major, I didn't think I could break into tech. The skills assessment showed me a path to computational biology, and the portfolio builder helped me showcase my coding projects.",
    author: "Chris W.",
    role: "Biology @ UCLA → Biotech Data Analyst",
    metric: "Career pivot success",
    avatar: "CW",
  },
];

// ===========================================
// VALUE PROPS
// ===========================================
const VALUE_PROPS = [
  {
    metric: '5x',
    title: 'More Relevant Matches',
    description: 'Our algorithm matches you with jobs based on skills, not just keywords',
  },
  {
    metric: 'Real',
    title: 'Salary Data',
    description: 'See what peers with your major actually earn at specific companies',
  },
  {
    metric: '10K+',
    title: 'Interview Questions',
    description: 'Practice technical and behavioral questions for your target companies',
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
  const colors: Record<string, Record<string, string>> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500' },
    pink: { bg: 'bg-pink-600', text: 'text-pink-400', border: 'border-pink-500' },
  };
  return colors[color]?.[type] || colors.blue[type];
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const CollegeLandingPage: React.FC = () => {
  const [activeYear, setActiveYear] = useState('senior');

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              For College Students & Recent Grads
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Launch Your STEM Career with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Confidence
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              From your first internship to your first full-time offer. AI-powered job matching,
              interview prep, salary negotiation, and graduate school resources -{' '}
              <span className="text-white font-medium">all free for students</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link
                to="/register?role=student&type=college"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Users className="w-5 h-5" />
                Create Free Profile
              </Link>
              <Link
                to="/jobs?type=internship"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                <Briefcase className="w-5 h-5" />
                Explore Internships
              </Link>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">25,000+ Internships</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">$85K Avg Salary</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">2,500+ Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400">94% Placement</span>
              </div>
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
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career Path Timeline */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Your Path to Launch</h2>
            <p className="text-gray-400">Resources tailored to your stage</p>
          </div>

          {/* Year Tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {YEAR_STAGES.map((year) => (
              <button
                key={year.id}
                onClick={() => setActiveYear(year.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeYear === year.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {year.label}
              </button>
            ))}
          </div>

          {/* Selected Year Info */}
          {YEAR_STAGES.filter((y) => y.id === activeYear).map((year) => (
            <motion.div
              key={year.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-3">
                <Target className="w-4 h-4" />
                Focus: {year.focus}
              </div>
              <p className="text-gray-300">{year.actions}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Resources by Category
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to land your dream job or get into grad school
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {RESOURCE_CATEGORIES.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${getColorClasses(category.color, 'bg')}/20 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${getColorClasses(category.color, 'text')}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                      <p className="text-gray-400 text-sm">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        to={link.path}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          link.primary
                            ? `${getColorClasses(category.color, 'bg')} text-white hover:opacity-90`
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {link.label}
                        {link.primary && <ArrowRight className="w-4 h-4" />}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Students Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Better tools, better outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUE_PROPS.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">{prop.metric}</div>
                <div className="text-xl font-semibold text-white mb-2">{prop.title}</div>
                <p className="text-gray-400">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Tools Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Career Toolkit
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Free tools to help you stand out and succeed
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_TOOLS.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-400">{tool.description}</p>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-400">
              Real students who landed their dream opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full">
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-3xl p-12 text-center">
            <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create your free profile to access AI-powered job matching, interview prep,
              and everything you need to land your dream STEM role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=student&type=college"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
              >
                Create Free Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/college/skills-assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Take Skills Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegeLandingPage;
