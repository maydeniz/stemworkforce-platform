// ===========================================
// Demo Landing Page
// Investor demo entry point with role selection
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Atom,
  Building2,
  HandHeart,
  BookOpen,
  Rocket,
  Star,
  Calendar,
  Loader2,
  Zap,
  Users,
  MapPin,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useDemo, DEMO_ROLES } from '@/contexts/DemoContext';

// ===========================================
// Role Card Configuration
// ===========================================

interface RoleCardConfig {
  key: string;
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
  bgAccent: string;
  borderAccent: string;
  features: string[];
}

const ROLE_CARDS: RoleCardConfig[] = [
  {
    key: 'employer',
    icon: Briefcase,
    title: 'Employers',
    description: 'Recruit top STEM talent with AI-powered matching',
    accent: 'text-emerald-400',
    bgAccent: 'bg-emerald-500/10',
    borderAccent: 'border-emerald-500/30 hover:border-emerald-400/60',
    features: ['Job Postings', 'Talent Pipeline', 'Campus Recruiting', 'Analytics'],
  },
  {
    key: 'education_partner',
    icon: GraduationCap,
    title: 'Education Partners',
    description: 'Connect students to STEM career pathways',
    accent: 'text-amber-400',
    bgAccent: 'bg-amber-500/10',
    borderAccent: 'border-amber-500/30 hover:border-amber-400/60',
    features: ['Programs', 'Employer Network', 'Outcomes', 'Events'],
  },
  {
    key: 'national_labs',
    icon: Atom,
    title: 'National Labs & Research',
    description: 'Manage fellowships, clearances, and research talent',
    accent: 'text-purple-400',
    bgAccent: 'bg-purple-500/10',
    borderAccent: 'border-purple-500/30 hover:border-purple-400/60',
    features: ['Clearance Pipeline', 'Fellowships', 'Research', 'Compliance'],
  },
  {
    key: 'federal_agency',
    icon: Building2,
    title: 'Federal & State Agencies',
    description: 'Workforce development programs and compliance',
    accent: 'text-blue-400',
    bgAccent: 'bg-blue-500/10',
    borderAccent: 'border-blue-500/30 hover:border-blue-400/60',
    features: ['WIOA Programs', 'Participants', 'Compliance', 'Analytics'],
  },
  {
    key: 'industry_nonprofit',
    icon: HandHeart,
    title: 'Industry & Nonprofits',
    description: 'Pipeline partnerships and workforce programs',
    accent: 'text-teal-400',
    bgAccent: 'bg-teal-500/10',
    borderAccent: 'border-teal-500/30 hover:border-teal-400/60',
    features: ['Talent Map', 'Programs', 'University Relations', 'Reports'],
  },
  {
    key: 'high_school',
    icon: BookOpen,
    title: 'High School Students',
    description: 'College prep, scholarships, and career discovery',
    accent: 'text-violet-400',
    bgAccent: 'bg-violet-500/10',
    borderAccent: 'border-violet-500/30 hover:border-violet-400/60',
    features: ['College Matcher', 'Scholarships', 'Essay Coach', 'Career Explorer'],
  },
  {
    key: 'college_student',
    icon: Rocket,
    title: 'College Students',
    description: 'Launch your STEM career with AI-powered tools',
    accent: 'text-indigo-400',
    bgAccent: 'bg-indigo-500/10',
    borderAccent: 'border-indigo-500/30 hover:border-indigo-400/60',
    features: ['Resume Builder', 'Internships', 'Skills Portfolio', 'Networking'],
  },
  {
    key: 'service_provider',
    icon: Star,
    title: 'Service Providers',
    description: 'Career coaching, training, and consulting services',
    accent: 'text-amber-400',
    bgAccent: 'bg-amber-500/10',
    borderAccent: 'border-amber-500/30 hover:border-amber-400/60',
    features: ['Services', 'Scheduling', 'Earnings', 'Reviews'],
  },
  {
    key: 'event_organizer',
    icon: Calendar,
    title: 'Event Organizers',
    description: 'Manage STEM career fairs, workshops, and hackathons',
    accent: 'text-rose-400',
    bgAccent: 'bg-rose-500/10',
    borderAccent: 'border-rose-500/30 hover:border-rose-400/60',
    features: ['Events', 'Attendees', 'Sponsors', 'Analytics'],
  },
];

// ===========================================
// Platform Stats
// ===========================================

const PLATFORM_STATS = [
  { icon: Briefcase, label: 'STEM Jobs', value: '12,450+' },
  { icon: Users, label: 'Registered Users', value: '45,000+' },
  { icon: Building2, label: 'Partner Organizations', value: '450+' },
  { icon: MapPin, label: 'States Covered', value: '50' },
  { icon: Award, label: 'Challenge Prize Pool', value: '$2.4M' },
  { icon: Zap, label: 'Industries', value: '11' },
];

// ===========================================
// Demo Landing Page Component
// ===========================================

const DemoLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterDemo, isLoading } = useDemo();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (roleKey: string) => {
    if (isLoading) return;
    setLoadingRole(roleKey);
    setError(null);

    try {
      const route = await (enterDemo as any)(roleKey);
      if (route) {
        navigate(route);
      } else {
        // Fallback to DEMO_ROLES route
        const demoRoute = DEMO_ROLES[roleKey]?.route;
        if (demoRoute) navigate(demoRoute);
      }
    } catch (err: any) {
      console.error('Demo login failed:', err);
      setError(`Login failed: ${err.message || 'Please ensure demo accounts are configured in Supabase'}`);
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-gray-950" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                STEM<span className="text-amber-400">Workforce</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Experience the Platform
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Click any role below to instantly explore the dashboard. Each demo is pre-loaded with
              realistic data showcasing the full platform capabilities.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Role Cards Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_CARDS.map((card, index) => {
            const Icon = card.icon;
            const isCardLoading = loadingRole === card.key;

            return (
              <motion.button
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleRoleSelect(card.key)}
                disabled={isLoading}
                className={`group relative text-left bg-gray-900/50 border ${card.borderAccent} rounded-2xl p-6 transition-all duration-300 hover:bg-gray-900 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 ${
                  isLoading && !isCardLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {/* Loading overlay */}
                {isCardLoading && (
                  <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-3">
                      <Loader2 className={`w-5 h-5 ${card.accent} animate-spin`} />
                      <span className="text-white text-sm font-medium">Loading Dashboard...</span>
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${card.bgAccent} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${card.accent}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-white/90">
                        {card.title}
                      </h3>
                      <ArrowRight className={`w-4 h-4 ${card.accent} opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all`} />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {card.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-[10px] font-medium text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Platform Stats Bar */}
      <div className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {PLATFORM_STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="text-center"
                >
                  <Icon className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-950 border-t border-gray-900 py-3">
        <p className="text-center text-[11px] text-gray-600">
          This is a demo environment with sample data. No real user data is displayed. &copy; {new Date().getFullYear()} STEMWorkforce
        </p>
      </div>
    </div>
  );
};

export default DemoLandingPage;
