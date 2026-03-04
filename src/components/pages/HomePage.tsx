// ===========================================
// Home Page Component
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_LIST, PLATFORM_STATS } from '@/config';
import { formatNumber } from '@/utils/helpers';
import { Button, Card } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// Static color class maps for Tailwind JIT compatibility — "Radiant Accent" design
const audienceColors: Record<string, {
  iconBg: string;
  iconBgHover: string;
  hoverBorder: string;
  hoverGlow: string;
  arrowColor: string;
}> = {
  yellow: {
    iconBg: 'bg-yellow-500/10',
    iconBgHover: 'group-hover:bg-yellow-500/20',
    hoverBorder: 'hover:border-yellow-500/30',
    hoverGlow: 'hover:shadow-[inset_0_0_40px_-12px_rgba(234,179,8,0.08)]',
    arrowColor: 'text-yellow-500/0 group-hover:text-yellow-500/60',
  },
  blue: {
    iconBg: 'bg-blue-500/10',
    iconBgHover: 'group-hover:bg-blue-500/20',
    hoverBorder: 'hover:border-blue-500/30',
    hoverGlow: 'hover:shadow-[inset_0_0_40px_-12px_rgba(59,130,246,0.08)]',
    arrowColor: 'text-blue-500/0 group-hover:text-blue-500/60',
  },
  green: {
    iconBg: 'bg-green-500/10',
    iconBgHover: 'group-hover:bg-green-500/20',
    hoverBorder: 'hover:border-green-500/30',
    hoverGlow: 'hover:shadow-[inset_0_0_40px_-12px_rgba(34,197,94,0.08)]',
    arrowColor: 'text-green-500/0 group-hover:text-green-500/60',
  },
  pink: {
    iconBg: 'bg-pink-500/10',
    iconBgHover: 'group-hover:bg-pink-500/20',
    hoverBorder: 'hover:border-pink-500/30',
    hoverGlow: 'hover:shadow-[inset_0_0_40px_-12px_rgba(236,72,153,0.08)]',
    arrowColor: 'text-pink-500/0 group-hover:text-pink-500/60',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconBgHover: 'group-hover:bg-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/30',
    hoverGlow: 'hover:shadow-[inset_0_0_40px_-12px_rgba(6,182,212,0.08)]',
    arrowColor: 'text-cyan-500/0 group-hover:text-cyan-500/60',
  },
};

const HomePage: React.FC = () => {
  useDocumentTitle('Powering America\'s Innovation Workforce | STEMWorkforce');

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg to-dark-surface" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-2xl font-semibold text-white mb-4">The Platform</p>
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Powering America's Innovation Ecosystem</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            One platform for the people and organizations building what matters.
          </p>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-gray-700" />
            <div className="w-1.5 h-1.5 bg-gray-600 rotate-45" />
            <div className="w-8 h-px bg-gray-700" />
          </div>

          {/* People and Organizations We Serve */}
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">People and Organizations We Serve</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto mb-10">
            {[
              { icon: '🎒', title: 'Students', subtitle: 'High School & College', link: '/register?role=student', color: 'cyan' },
              { icon: '👤', title: 'Talent', subtitle: 'STEM Professionals', link: '/jobs', color: 'yellow' },
              { icon: '🏭', title: 'Industry', subtitle: 'Fortune 500 & Startups', link: '/register?role=partner', color: 'blue' },
              { icon: '🔬', title: 'National Labs', subtitle: 'DOE & Research Labs', link: '/national-labs', color: 'green' },
              { icon: '🎓', title: 'Universities', subtitle: 'Higher Education', link: '/register?role=educator', color: 'pink' },
              { icon: '🏛️', title: 'Federal Agencies', subtitle: 'Government & Defense', link: '/government-partners', color: 'blue' },
              { icon: '🏢', title: 'State Workforce', subtitle: 'Workforce Boards', link: '/state-workforce', color: 'green' },
              { icon: '🏥', title: 'Healthcare', subtitle: 'Health Systems & Biotech', link: '/healthcare-providers', color: 'cyan' },
              { icon: '⭐', title: 'Service Providers', subtitle: 'Consultants & Coaches', link: '/register?role=service-provider', color: 'yellow' },
              { icon: '🤝', title: 'Nonprofits', subtitle: 'Workforce Nonprofits', link: '/nonprofit-partners', color: 'pink' },
            ].map((audience) => (
              <Link
                key={audience.title}
                to={audience.link}
                className={`group relative p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] ${audienceColors[audience.color]?.hoverBorder || 'hover:border-slate-500/30'} ${audienceColors[audience.color]?.hoverGlow || ''} hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300 ease-out`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-8 h-8 rounded-lg ${audienceColors[audience.color]?.iconBg || 'bg-slate-500/10'} ${audienceColors[audience.color]?.iconBgHover || ''} flex items-center justify-center transition-colors duration-300`}>
                    <span className="text-base">{audience.icon}</span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 ${audienceColors[audience.color]?.arrowColor || 'text-slate-500/0'} transition-all duration-300 group-hover:translate-x-0.5`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-200 block mt-2.5 leading-snug group-hover:text-white transition-colors duration-300">
                  {audience.title}
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5 leading-snug">
                  {audience.subtitle}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg">
                Explore Opportunities
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link to="/register?role=partner">
              <Button variant="outline" size="lg">
                Find Talent
              </Button>
            </Link>
          </div>

          {/* Stats — reframed as aspirational */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{formatNumber(PLATFORM_STATS.totalJobs)}+</div>
              <div className="text-xs text-gray-500 mt-1">Public Job Listings Aggregated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">All {PLATFORM_STATS.statesCovered}</div>
              <div className="text-xs text-gray-500 mt-1">States</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">11</div>
              <div className="text-xs text-gray-500 mt-1">Critical Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">Growing</div>
              <div className="text-xs text-gray-500 mt-1">Partner Network</div>
            </div>
          </div>

          {/* Mission alignment — NOT DOE endorsement */}
          <p className="text-xs text-gray-600 mt-6">
            Aligned with federal STEM workforce development priorities
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You Can Do Here
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tools for every stakeholder — whether you're hiring, job searching, placing graduates, or consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '💼',
                title: 'Jobs & Internships',
                description: 'Access 2.1M+ opportunities across federal, private, healthcare, and national lab employers.',
                link: '/jobs',
              },
              {
                icon: '🗺️',
                title: 'Workforce Map',
                description: 'Interactive intelligence across all 50 states with industry clusters and top employers.',
                link: '/map',
              },
              {
                icon: '📚',
                title: 'Training Portal',
                description: '1,200+ programs with credentials, certifications, and skill-building pathways.',
                link: '/training',
              },
              {
                icon: '📅',
                title: 'Events',
                description: 'Job fairs, conferences, hackathons, and networking opportunities nationwide.',
                link: '/events',
              },
              {
                icon: '🤝',
                title: 'Partner Network',
                description: 'Connect with industry leaders, healthcare systems, government agencies, and educational institutions.',
                link: '/partners',
              },
              {
                icon: '🚀',
                title: 'Innovation Hub',
                description: 'Challenges, competitions, and pathways to cutting-edge research opportunities.',
                link: '/innovate',
              },
            ].map((feature) => (
              <Link key={feature.title} to={feature.link}>
                <Card hover className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section — proof of depth */}
      <section className="py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Where the Jobs Are
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time openings and growth data across 11 emerging technology sectors critical to national security, economic competitiveness, and technological leadership.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRY_LIST.map((industry) => (
              <Card
                key={industry.id}
                hover
                className="text-center cursor-pointer"
                onClick={() => {}}
              >
                <div
                  className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: `${industry.color}20` }}
                >
                  {industry.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{industry.name}</h3>
                <p className="text-sm text-gray-400">{formatNumber(industry.jobsCount)} jobs</p>
                <div className="mt-2 inline-flex items-center text-xs text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {industry.growth}% growth
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why STEMWorkforce — Differentiation Section */}
      <section className="py-20 bg-dark-bg border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Why STEMWorkforce?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Not another job board. Purpose-built for the sectors that matter most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-dark-surface border border-dark-border rounded-2xl hover:border-blue-500/30 transition-all">
              <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">11 Critical Sectors, One Platform</h3>
              <p className="text-sm text-gray-400">
                Unlike general job boards, every feature is built for semiconductor, nuclear, quantum, aerospace, biotech, cybersecurity, and more.
              </p>
            </div>
            <div className="text-center p-8 bg-dark-surface border border-dark-border rounded-2xl hover:border-emerald-500/30 transition-all">
              <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Clearance-Ready Talent Pipeline</h3>
              <p className="text-sm text-gray-400">
                Source by clearance level, build pipelines from university programs, and manage workforce data with security-grade standards.
              </p>
            </div>
            <div className="text-center p-8 bg-dark-surface border border-dark-border rounded-2xl hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Full Career Lifecycle</h3>
              <p className="text-sm text-gray-400">
                From students exploring STEM to senior engineers changing sectors — workforce development across the entire pipeline, not just job posts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Social Proof Section — rewritten for legal compliance */}
      <section className="py-16 bg-dark-surface border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Designed for Leading STEM Organizations</p>
            <p className="text-xs text-gray-600">Target Sectors</p>
          </div>

          {/* Target Sectors — plain text, NOT logo-styled */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10">
            {[
              'Government & Defense',
              'National Laboratories',
              'Fortune 500',
              'Universities',
              'Healthcare Systems',
              'Startups & Scale-ups',
            ].map((sector) => (
              <span key={sector} className="px-4 py-2 text-sm text-gray-400 border border-dark-border rounded-lg">
                {sector}
              </span>
            ))}
          </div>

          {/* Reframed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Growing</div>
              <div className="text-sm text-gray-500">Partner Network</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">11</div>
              <div className="text-sm text-gray-500">Critical Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">All 50</div>
              <div className="text-sm text-gray-500">States</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Federal</div>
              <div className="text-sm text-gray-500">Workforce Aligned</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start building from here.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're hiring, job searching, placing graduates, or growing your practice — create your free account in under two minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link to="/register?role=partner">
              <Button variant="secondary" size="lg">Become a Partner</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            DISCLAIMER: STEMWorkforce.net is an early-stage platform in active development.
            Statistics, partner counts, and metrics displayed on this site represent forward-looking
            goals and design targets, not verified current data, unless explicitly stated otherwise.
            Sector categories shown represent target markets, not confirmed partnerships or endorsements.
            STEMWorkforce.net is not endorsed by or affiliated with any federal agency. Job listing
            counts reflect aggregated public data sources. We are committed to transparency and will
            update metrics as verified data becomes available.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
