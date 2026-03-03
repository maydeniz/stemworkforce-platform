// ===========================================
// For Talent Landing Page
// Hub for job seekers, career changers, dislocated workers, and veterans
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  GraduationCap,
  Heart,
  Shield,
  MapPin,
  DollarSign,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Globe,
  Award,
  Building2,
  FileText,
  MessageSquare,
  UserCheck,
  Handshake,
  Sparkles,
} from 'lucide-react';

// ===========================================
// SERVICE CATEGORIES - What We Offer
// ===========================================
const SERVICE_CATEGORIES = [
  {
    id: 'find-job',
    title: 'Find a Job',
    icon: Briefcase,
    description: 'Search jobs, get resume help, and prepare for interviews',
    color: 'blue',
    links: [
      { label: 'Browse All Jobs', path: '/jobs', primary: true },
      { label: 'AI Career Guide', path: '/ai-career-guide' },
      { label: 'Workforce Map', path: '/map' },
      { label: 'Salary Insights', path: '/salary-insights' },
    ],
  },
  {
    id: 'training',
    title: 'Get Training',
    icon: GraduationCap,
    description: 'Learn new skills through funded training programs',
    color: 'emerald',
    links: [
      { label: 'Find Training Programs', path: '/training', primary: true },
      { label: 'Training Services', path: '/services/training-services' },
      { label: 'Scholarship Matcher', path: '/students/scholarship-matcher' },
      { label: 'Apprenticeship Pathways', path: '/students/apprenticeship-pathways' },
    ],
  },
  {
    id: 'support',
    title: 'Get Support',
    icon: Heart,
    description: 'Access help with transportation, childcare, and more',
    color: 'pink',
    links: [
      { label: 'Career Coaching', path: '/services/career-coaching', primary: true },
      { label: 'Find a Career Coach', path: '/service-providers?type=career-coach' },
      { label: 'Mentorship Programs', path: '/college/mentorship' },
    ],
  },
  {
    id: 'unemployment',
    title: 'Unemployment Help',
    icon: Shield,
    description: 'Learn about UI benefits and dislocated worker services',
    color: 'amber',
    links: [
      { label: 'Career Resources', path: '/resources', primary: true },
      { label: 'Outplacement Services', path: '/services/outplacement' },
      { label: 'Career Coaching', path: '/services/career-coaching' },
    ],
  },
];

// ===========================================
// USER PERSONAS - Who We Serve
// ===========================================
const USER_PERSONAS = [
  {
    id: 'job-seekers',
    title: 'Job Seekers',
    icon: Search,
    description: 'Looking for your next opportunity',
    features: ['Job search', 'Resume help', 'Career counseling'],
    cta: 'Find Jobs',
    path: '/jobs',
    color: 'blue',
  },
  {
    id: 'dislocated',
    title: 'Dislocated Workers',
    icon: TrendingUp,
    description: 'Recently laid off or facing job loss',
    features: ['UI benefits', 'Free training', 'Rapid Response'],
    cta: 'Get Started',
    path: '/services/outplacement',
    color: 'emerald',
  },
  {
    id: 'career-changers',
    title: 'Career Changers',
    icon: Target,
    description: 'Switching industries or advancing',
    features: ['Skills assessment', 'Training funding', 'Pathway planning'],
    cta: 'Explore Training',
    path: '/training',
    color: 'purple',
  },
  {
    id: 'veterans',
    title: 'Veterans',
    icon: Star,
    description: 'Transitioning from military service',
    features: ['Priority services', 'Credential translation', 'Clearance help'],
    cta: 'Get Priority Access',
    path: '/jobs?veteran=true',
    color: 'amber',
  },
  {
    id: 'youth',
    title: 'Youth (16-24)',
    icon: Zap,
    description: 'Starting your career journey',
    features: ['Work-based learning', 'Apprenticeships', 'Youth programs'],
    cta: 'Explore Programs',
    path: '/students/work-based-learning',
    color: 'pink',
  },
  {
    id: 'international',
    title: 'International',
    icon: Globe,
    description: 'Work authorization & visa support',
    features: ['Immigration services', 'Employer sponsorship', 'H-1B guidance'],
    cta: 'Learn More',
    path: '/services/immigration',
    color: 'cyan',
  },
];

// ===========================================
// CAREER TOOLS - Features
// ===========================================
const CAREER_TOOLS = [
  {
    icon: Sparkles,
    title: 'AI Career Guide',
    description: 'Get personalized job recommendations based on your skills and goals',
  },
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'ATS-optimized templates and AI feedback for STEM roles',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    description: 'Practice with AI mock interviews and industry-specific questions',
  },
  {
    icon: DollarSign,
    title: 'Salary Calculator',
    description: 'Know your worth with real compensation data by role and location',
  },
  {
    icon: MapPin,
    title: 'Workforce Map',
    description: 'Explore opportunities by state, industry, and employer',
  },
  {
    icon: GraduationCap,
    title: 'Training Finder',
    description: 'Discover funded programs in AI, cybersecurity, semiconductor & more',
  },
];

// ===========================================
// SUCCESS METRICS
// ===========================================
const SUCCESS_METRICS = [
  { value: '125,000+', label: 'Active STEM Jobs', icon: Briefcase },
  { value: '2,500+', label: 'Career Centers', icon: Building2 },
  { value: '$10K+', label: 'Training Funding', icon: DollarSign },
  { value: '500+', label: 'Partner Employers', icon: Handshake },
];

// ===========================================
// TESTIMONIALS
// ===========================================
const TESTIMONIALS = [
  {
    quote: "After being laid off from manufacturing, I was lost. The career center connected me with a free cybersecurity bootcamp. Six months later, I landed a $95K job at a defense contractor.",
    author: "Marcus T.",
    role: "Former Line Supervisor → Cybersecurity Analyst",
    metric: "+$42K salary",
    avatar: "MT",
  },
  {
    quote: "As a veteran, I didn't know how to translate my skills. The priority services and clearance assistance helped me get hired at a national lab within 60 days.",
    author: "Sarah K.",
    role: "US Army → Nuclear Engineer",
    metric: "60 days to hire",
    avatar: "SK",
  },
  {
    quote: "I was a teacher who wanted to switch to tech. The ITAs covered my data science training 100%. Now I work at a biotech company making twice my old salary.",
    author: "James R.",
    role: "High School Teacher → Data Scientist",
    metric: "2x salary",
    avatar: "JR",
  },
];

// ===========================================
// TRUST SIGNALS
// ===========================================
const TRUST_SIGNALS = [
  { label: 'All Services Free', icon: Shield },
  { label: '24/7 Online Access', icon: Clock },
  { label: '125,000+ Active Jobs', icon: Briefcase },
  { label: '94% Placement Rate', icon: Award },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
const hoverBorderColors: Record<string, string> = {
  blue: 'hover:border-blue-500/50', emerald: 'hover:border-emerald-500/50',
  purple: 'hover:border-purple-500/50', amber: 'hover:border-amber-500/50',
  pink: 'hover:border-pink-500/50', cyan: 'hover:border-cyan-500/50',
};

const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'ring') => {
  const colors: Record<string, Record<string, string>> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500', ring: 'ring-blue-500/30' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', ring: 'ring-emerald-500/30' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', ring: 'ring-purple-500/30' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', ring: 'ring-amber-500/30' },
    pink: { bg: 'bg-pink-600', text: 'text-pink-400', border: 'border-pink-500', ring: 'ring-pink-500/30' },
    cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-500', ring: 'ring-cyan-500/30' },
  };
  return colors[color]?.[type] || colors.blue[type];
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const ForTalentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/10 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6"
            >
              <Briefcase className="w-4 h-4" />
              Free Career Services for Everyone
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6"
            >
              Find Your Next Opportunity in{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Emerging Tech
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Free job search help, skills training, and career support through 2,500+ American
              Job Centers nationwide. Browse 125,000+ STEM jobs or get personalized assistance
              funded by the{' '}
              <span className="text-white font-medium">Workforce Innovation and Opportunity Act</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <Search className="w-5 h-5" />
                Browse Jobs
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Find a Career Center
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
                    <Icon className="w-4 h-4 text-emerald-500" />
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
                  <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Categories - How Can We Help */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How Can We Help?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Whether you're looking for a job, need training, or want support services -
              we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SERVICE_CATEGORIES.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${hoverBorderColors[category.color] || 'hover:border-slate-500/50'} transition-all`}
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

      {/* User Personas - Services Tailored to You */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Services Tailored to You
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No matter where you are in your career journey, we have resources designed for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USER_PERSONAS.map((persona, idx) => {
              const Icon = persona.icon;
              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
                >
                  <div className={`w-12 h-12 ${getColorClasses(persona.color, 'bg')}/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${getColorClasses(persona.color, 'text')}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{persona.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{persona.description}</p>
                  <ul className="space-y-2 mb-4">
                    {persona.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={persona.path}
                    className={`inline-flex items-center gap-2 text-sm font-medium ${getColorClasses(persona.color, 'text')} hover:underline`}
                  >
                    {persona.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Job Seekers Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real results for real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold text-emerald-400 mb-2">94%</div>
              <div className="text-xl font-semibold text-white mb-2">Placement Rate</div>
              <p className="text-gray-400">Our training program graduates are employed within 90 days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold text-blue-400 mb-2">$92K</div>
              <div className="text-xl font-semibold text-white mb-2">Average Starting Salary</div>
              <p className="text-gray-400">STEM roles pay 50% above national median</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold text-purple-400 mb-2">$10K+</div>
              <div className="text-xl font-semibold text-white mb-2">Training Funding Available</div>
              <p className="text-gray-400">Qualify for WIOA-funded certifications and degrees</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Tools Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Career Toolkit
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Free tools to help you land your next opportunity
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
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600/30 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
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
              Real people who transformed their careers
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
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full">
                    {testimonial.metric}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
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
          <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-emerald-500/30 rounded-3xl p-12 text-center">
            <UserCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create your free profile to get personalized job matches, or find your local
              career center for in-person support. All services are 100% free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=jobseeker"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
              >
                Create Free Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Find Career Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForTalentPage;
