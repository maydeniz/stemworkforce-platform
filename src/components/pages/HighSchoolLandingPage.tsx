// ===========================================
// High School Students Landing Page
// AI-powered college prep, scholarships, and STEM career discovery
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  FileText,
  Search,
  Rocket,
  DollarSign,
  Award,
  Building2,
  CheckCircle2,
  ArrowRight,
  Star,
  Target,
  BookOpen,
  Briefcase,
  Calculator,
  MessageSquare,
  MapPin,
  Users,
  Lightbulb,
  PenTool,
  Globe,
  Microscope,
  Atom,
  FlaskConical,
} from 'lucide-react';

// ===========================================
// RESOURCE CATEGORIES
// ===========================================
const RESOURCE_CATEGORIES = [
  {
    id: 'application',
    title: 'Application Support',
    icon: FileText,
    description: 'AI-powered essays, application tracking, and interview prep',
    color: 'purple',
    links: [
      { label: 'AI Essay Coach', path: '/students/essay-coach', primary: true },
      { label: 'Application Tracker', path: '/students/app-tracker' },
      { label: '"Why This School" Generator', path: '/students/why-school' },
      { label: 'Interview Prep Simulator', path: '/students/interview-prep' },
      { label: 'Mock Admissions Review', path: '/students/mock-review' },
    ],
  },
  {
    id: 'college-discovery',
    title: 'College Discovery',
    icon: Search,
    description: 'Find best-fit schools by career outcomes, not just rankings',
    color: 'blue',
    links: [
      { label: 'AI College Matcher', path: '/students/college-matcher', primary: true },
      { label: 'Major Explorer', path: '/students/major-explorer' },
      { label: 'Campus Culture Finder', path: '/students/campus-culture' },
      { label: 'Virtual Campus Tours', path: '/students/virtual-tours' },
      { label: 'Compare Schools', path: '/students/compare-schools' },
    ],
  },
  {
    id: 'career-pathways',
    title: 'Career Pathways',
    icon: Rocket,
    description: 'High school internships, apprenticeships, and early career discovery',
    color: 'emerald',
    links: [
      { label: 'HS Internship Finder', path: '/students/internship-finder', primary: true },
      { label: 'Youth Apprenticeships', path: '/students/apprenticeship-pathways' },
      { label: 'Work-Based Learning', path: '/students/work-based-learning' },
      { label: 'Career ROI Calculator', path: '/students/career-roi' },
      { label: 'STEM Career Explorer', path: '/industries' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Planning',
    icon: DollarSign,
    description: 'Scholarships, FAFSA, and understanding the true cost of college',
    color: 'amber',
    links: [
      { label: 'AI Scholarship Matcher', path: '/students/scholarship-matcher', primary: true },
      { label: 'Net Price Calculator', path: '/students/net-price-calculator' },
      { label: 'Award Letter Analyzer', path: '/students/award-letter-analyzer' },
      { label: 'Appeal Letter Generator', path: '/students/appeal-letter' },
      { label: 'FAFSA Assistant', path: '/workforce/fafsa-assistant' },
    ],
  },
];

// ===========================================
// CAREER TOOLS
// ===========================================
const CAREER_TOOLS = [
  {
    icon: PenTool,
    title: 'AI Essay Coach',
    description: 'Real-time feedback on narrative, authenticity, and impact',
  },
  {
    icon: Award,
    title: 'Scholarship Matcher',
    description: '5,000+ STEM scholarships matched to your unique profile',
  },
  {
    icon: Search,
    title: 'College Matcher',
    description: 'Find best-fit schools based on career outcomes, not rankings',
  },
  {
    icon: Calculator,
    title: 'Net Price Calculator',
    description: 'See actual costs with real award data, not estimates',
  },
  {
    icon: Briefcase,
    title: 'HS Internship Finder',
    description: 'NASA, national labs, and 1,000+ high school programs',
  },
  {
    icon: Target,
    title: 'Career ROI Calculator',
    description: '15-year earning projections by major and school',
  },
];

// ===========================================
// SUCCESS METRICS
// ===========================================
const SUCCESS_METRICS = [
  { value: '5,000+', label: 'STEM Scholarships', icon: Award },
  { value: '1,000+', label: 'HS Internships', icon: Briefcase },
  { value: '450+', label: 'Partner Schools', icon: GraduationCap },
  { value: '$2.5B+', label: 'Scholarship $$', icon: DollarSign },
];

// ===========================================
// STEM PROGRAMS
// ===========================================
const STEM_PROGRAMS = [
  { name: 'NASA High School Internships', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
  { name: 'DOE National Lab Programs', icon: Atom, color: 'from-emerald-500 to-teal-500' },
  { name: 'CHIPS Act Semiconductor Camps', icon: Lightbulb, color: 'from-purple-500 to-pink-500' },
  { name: 'Youth Apprenticeship Programs', icon: Briefcase, color: 'from-amber-500 to-orange-500' },
  { name: 'Research Experience Programs', icon: FlaskConical, color: 'from-pink-500 to-rose-500' },
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "The essay coach helped me tell my story without sounding generic. I got into my top 3 schools including MIT. My counselor said my essays were the best she'd seen in years.",
    author: "Emily C.",
    role: "Senior @ Thomas Jefferson HS → MIT '28",
    metric: "Admitted MIT, Stanford, Caltech",
    avatar: "EC",
  },
  {
    quote: "The scholarship matcher found opportunities we never would have discovered. My daughter won $45K in merit scholarships. The net price calculator showed us which schools were actually affordable.",
    author: "David M.",
    role: "Parent",
    metric: "$45K scholarships won",
    avatar: "DM",
  },
  {
    quote: "I interned at Sandia National Lab the summer before senior year through this platform. It completely changed my college applications - I had real research experience to write about.",
    author: "Jordan T.",
    role: "Junior @ Albuquerque Academy → National Lab Intern",
    metric: "Published research in HS",
    avatar: "JT",
  },
];

// ===========================================
// VALUE PROPS
// ===========================================
const VALUE_PROPS = [
  {
    metric: '5,000+',
    title: 'Scholarships',
    description: 'AI matches you to scholarships based on your profile, not just GPA',
  },
  {
    metric: 'Real',
    title: 'Career Outcomes',
    description: 'Choose schools based on job placement, not magazine rankings',
  },
  {
    metric: 'Your',
    title: 'Authentic Voice',
    description: 'Essay coach improves your voice, it doesn\'t replace it',
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
  return colors[color]?.[type] || colors.purple[type];
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const HighSchoolLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered College Prep & STEM Discovery
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Your Future in STEM Starts{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Here
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered college applications, scholarship matching, and early career experiences.
              Discover 5,000+ STEM scholarships, explore high school internships at NASA and national
              labs, and{' '}
              <span className="text-white font-medium">get into your dream school</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link
                to="/register?role=student&type=highschool"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Rocket className="w-5 h-5" />
                Start Free Trial
              </Link>
              <Link
                to="/students/scholarship-matcher"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                <DollarSign className="w-5 h-5" />
                Find Scholarships
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
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">5,000+ Scholarships</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">1,000+ HS Internships</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">450+ Partner Schools</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400">$2.5B+ Available</span>
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
                  <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Journey to College & Career
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to get into your dream school and start your STEM career
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

      {/* STEM Programs Highlight */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Get Early STEM Experience
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              High school programs at NASA, national labs, and top research institutions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEM_PROGRAMS.map((program, idx) => {
              const Icon = program.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-white">{program.name}</h3>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/students/internship-finder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all"
            >
              Explore All Programs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Families Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Better information, better decisions, better outcomes
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
                <div className="text-4xl font-bold text-purple-400 mb-2">{prop.metric}</div>
                <div className="text-xl font-semibold text-white mb-2">{prop.title}</div>
                <p className="text-gray-400">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Tools Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Application Toolkit
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to stand out and succeed
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
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400">
              Students and families who achieved their dreams
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
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-full">
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
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
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-3xl p-12 text-center">
            <GraduationCap className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your STEM Future Starts Today
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create your free profile to access AI-powered essay coaching, scholarship matching,
              and early career opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=student&type=highschool"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/students/scholarship-matcher"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <DollarSign className="w-5 h-5" />
                Find Scholarships
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              For Parents: Learn how we protect student data and support families.
            </p>
            <Link
              to="/counselor"
              className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              School Counselors: Access your portal →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HighSchoolLandingPage;
