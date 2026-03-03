// @ts-nocheck
// ===========================================
// Workforce Services Hub - For Job Seekers & Career Changers
// ===========================================
// This is the B2C landing page for individuals seeking
// workforce development services, training, and support
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  DollarSign,
  GraduationCap,
  Heart,
  Briefcase,
  FileText,
  Users,
  Building2,
  ArrowRight,
  Phone,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Award,
  BookOpen,
  Target,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

// ===========================================
// SERVICE CATEGORIES - For Job Seekers
// ===========================================
const SERVICE_CATEGORIES = [
  {
    id: 'find-jobs',
    title: 'Find a Job',
    description: 'Search for jobs, get resume help, and prepare for interviews',
    icon: Briefcase,
    color: 'blue',
    links: [
      { label: 'Find Career Centers Near You', href: '/workforce/career-centers', primary: true },
      { label: 'Browse Job Listings', href: '/jobs' },
      { label: 'AI Career Guide', href: '/ai-career-guide' },
      { label: 'Salary Insights', href: '/salary-insights' }
    ]
  },
  {
    id: 'training',
    title: 'Get Training',
    description: 'Learn new skills through funded training programs',
    icon: GraduationCap,
    color: 'emerald',
    links: [
      { label: 'Find Training Programs', href: '/workforce/training-providers', primary: true },
      { label: 'Training Funding (ITAs)', href: '/workforce/training-funding' },
      { label: 'FAFSA Help', href: '/workforce/fafsa-assistant' },
      { label: 'Apprenticeship Pathways', href: '/students/apprenticeship-pathways' }
    ]
  },
  {
    id: 'support',
    title: 'Get Support',
    description: 'Access help with transportation, childcare, and more',
    icon: Heart,
    color: 'pink',
    links: [
      { label: 'Supportive Services', href: '/workforce/supportive-services', primary: true },
      { label: 'Career Coaching', href: '/services/career-coaching' },
      { label: 'Mentorship Matching', href: '/college/mentorship' }
    ]
  },
  {
    id: 'benefits',
    title: 'Unemployment Benefits',
    description: 'Learn about UI benefits and how to apply',
    icon: Shield,
    color: 'amber',
    links: [
      { label: 'Unemployment Guide', href: '/workforce/unemployment-benefits', primary: true },
      { label: 'Dislocated Worker Services', href: '/workforce/dislocated-workers' }
    ]
  }
];

// ===========================================
// WHO THIS IS FOR - User Personas
// ===========================================
const USER_PERSONAS = [
  {
    persona: 'Job Seekers',
    description: 'Looking for your next opportunity',
    features: ['Job search assistance', 'Resume & interview help', 'Career counseling'],
    icon: Search,
    cta: '/workforce/career-centers',
    ctaLabel: 'Find a Career Center'
  },
  {
    persona: 'Dislocated Workers',
    description: 'Recently laid off or facing job loss',
    features: ['Unemployment benefits', 'Free training programs', 'Rapid Response services'],
    icon: TrendingUp,
    cta: '/workforce/dislocated-workers',
    ctaLabel: 'Get Started'
  },
  {
    persona: 'Career Changers',
    description: 'Looking to switch industries or advance',
    features: ['Skills assessment', 'Training funding', 'Career pathway planning'],
    icon: Target,
    cta: '/workforce/training-providers',
    ctaLabel: 'Explore Training'
  },
  {
    persona: 'Students & Graduates',
    description: 'Entering the workforce or exploring careers',
    features: ['Internship finder', 'FAFSA assistance', 'STEM scholarships'],
    icon: GraduationCap,
    cta: '/students/internship-finder',
    ctaLabel: 'Find Opportunities'
  },
  {
    persona: 'Veterans',
    description: 'Transitioning from military to civilian careers',
    features: ['Priority services', 'Credential translation', 'Clearance assistance'],
    icon: Star,
    cta: '/workforce/career-centers',
    ctaLabel: 'Get Priority Access'
  },
  {
    persona: 'Youth (16-24)',
    description: 'Starting your career journey',
    features: ['Work-based learning', 'Apprenticeships', 'Youth programs'],
    icon: Zap,
    cta: '/students/work-based-learning',
    ctaLabel: 'Explore Programs'
  }
];

// ===========================================
// QUICK STATS
// ===========================================
const QUICK_STATS = [
  { value: '2,500+', label: 'Career Centers Nationwide' },
  { value: 'Free', label: 'All Core Services' },
  { value: '$10K+', label: 'Training Funding Available' },
  { value: '24/7', label: 'Online Resources' }
];

// ===========================================
// QUICK LINKS
// ===========================================
const QUICK_LINKS = [
  { label: 'Find Career Centers', href: '/workforce/career-centers', icon: MapPin },
  { label: 'Search Training Programs', href: '/workforce/training-providers', icon: GraduationCap },
  { label: 'Get Training Funding', href: '/workforce/training-funding', icon: DollarSign },
  { label: 'Supportive Services', href: '/workforce/supportive-services', icon: Heart },
  { label: 'Unemployment Benefits', href: '/workforce/unemployment-benefits', icon: Shield },
  { label: 'Dislocated Worker Help', href: '/workforce/dislocated-workers', icon: TrendingUp },
  { label: 'FAFSA Assistant', href: '/workforce/fafsa-assistant', icon: FileText },
  { label: 'Browse All Jobs', href: '/jobs', icon: Briefcase }
];

export default function WorkforceServicesHubPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Free Career Services for Everyone
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Career Starts Here
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Free job search help, skills training, career counseling, and support services
              at American Job Centers nationwide. Funded by the Workforce Innovation and Opportunity Act (WIOA).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/workforce/career-centers"
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2 text-lg"
              >
                <MapPin className="h-5 w-5" />
                Find a Career Center
              </Link>
              <a
                href="tel:1-877-872-5627"
                className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition flex items-center gap-2 text-lg"
              >
                <Phone className="h-5 w-5" />
                Call 1-877-US2-JOBS
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-900/50 border-y border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {QUICK_STATS.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How Can We Help You?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Select what you're looking for to find the right services and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SERVICE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const colorClasses = {
                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
                amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              };

              return (
                <div
                  key={category.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl border ${colorClasses[category.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-slate-400 text-sm">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {category.links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.href}
                        className={`flex items-center justify-between p-3 rounded-lg transition ${
                          link.primary
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-medium">{link.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Who This is For */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Services Tailored to You</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Whether you're entering the workforce for the first time or making a career transition,
              we have services designed for your situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USER_PERSONAS.map((persona) => {
              const Icon = persona.icon;
              return (
                <div
                  key={persona.persona}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{persona.persona}</h3>
                      <p className="text-slate-500 text-sm">{persona.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {persona.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={persona.cta}
                    className="flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 group-hover:gap-3 transition-all"
                  >
                    {persona.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Links</h2>
            <p className="text-slate-400">
              Jump directly to the service you need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition group"
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                  <span className="text-slate-300 group-hover:text-white font-medium text-sm">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* What is WIOA Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <HelpCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What is WIOA?</h2>
                <p className="text-slate-300">
                  The <strong className="text-white">Workforce Innovation and Opportunity Act (WIOA)</strong> is
                  federal legislation that provides funding for workforce development programs across the United States.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">What WIOA Provides:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Free career counseling and job search assistance
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Funded occupational skills training (ITAs)
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Supportive services (childcare, transportation)
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Youth employment and education programs
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Who is Eligible:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Adults 18+ seeking employment
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Dislocated workers (laid off employees)
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Youth ages 14-24
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    Veterans (priority of service)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Visit your local American Job Center today. All services are free and available to
            everyone looking for work, regardless of whether you're currently employed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/workforce/career-centers"
              className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition flex items-center gap-2"
            >
              <MapPin className="h-5 w-5" />
              Find Your Career Center
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition flex items-center gap-2"
            >
              <Briefcase className="h-5 w-5" />
              Browse Jobs Now
            </Link>
          </div>
        </div>
      </div>

      {/* For Workforce Agencies Banner */}
      <div className="border-t border-slate-800 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-slate-400" />
              <div>
                <span className="text-white font-medium">Are you a State Workforce Agency or Career Center?</span>
                <span className="text-slate-400 ml-2">Learn how our platform can help you serve job seekers.</span>
              </div>
            </div>
            <Link
              to="/partners/state-workforce"
              className="px-6 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
            >
              Partner With Us
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
