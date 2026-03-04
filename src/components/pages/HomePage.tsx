// ===========================================
// Home Page Component
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_LIST, PLATFORM_STATS } from '@/config';
import { formatNumber } from '@/utils/helpers';
import { Button, Card } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// Static color class maps for Tailwind JIT compatibility
const audienceColors: Record<string, {
  hoverBorder: string; bgLight: string; text: string; textHover: string;
}> = {
  yellow: { hoverBorder: 'hover:border-yellow-500/50', bgLight: 'bg-yellow-500/10', text: 'text-yellow-400', textHover: 'group-hover:text-yellow-300' },
  blue: { hoverBorder: 'hover:border-blue-500/50', bgLight: 'bg-blue-500/10', text: 'text-blue-400', textHover: 'group-hover:text-blue-300' },
  green: { hoverBorder: 'hover:border-green-500/50', bgLight: 'bg-green-500/10', text: 'text-green-400', textHover: 'group-hover:text-green-300' },
  pink: { hoverBorder: 'hover:border-pink-500/50', bgLight: 'bg-pink-500/10', text: 'text-pink-400', textHover: 'group-hover:text-pink-300' },
  cyan: { hoverBorder: 'hover:border-cyan-500/50', bgLight: 'bg-cyan-500/10', text: 'text-cyan-400', textHover: 'group-hover:text-cyan-300' },
};

const HomePage: React.FC = () => {
  useDocumentTitle('Powering America\'s Innovation Workforce | STEMWorkforce');

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg to-dark-surface" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Early Access Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-8">
            <span className="text-sm">🚀</span>
            <span className="text-sm text-emerald-400 font-medium">Early Access — Building America's STEM Talent Platform</span>
          </div>

          <p className="text-lg md:text-2xl font-semibold text-white mb-4">The Platform</p>
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Powering America's Innovation Ecosystem</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            One platform for the people and organizations building what matters.
          </p>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-gray-700" />
            <div className="w-1.5 h-1.5 bg-gray-600 rotate-45" />
            <div className="w-8 h-px bg-gray-700" />
          </div>

          {/* Sector list — all 11 critical sectors */}
          <p className="text-sm text-gray-500 tracking-wide max-w-2xl mx-auto mb-10">
            {INDUSTRY_LIST.map((industry, i) => (
              <React.Fragment key={industry.id}>
                {i > 0 && <span className="mx-1.5 text-gray-700">&middot;</span>}
                {industry.name}
              </React.Fragment>
            ))}
          </p>

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

      {/* Audience Pathways Section — moved up from position 4 to position 2 */}
      <section className="py-20 bg-dark-surface border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              I am a...
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose your path to explore tailored opportunities and resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: '👤',
                title: 'Talent',
                subtitle: 'STEM Professional or Job Seeker',
                description: 'Get AI-matched to roles across thousands of listings. See salary data. Access coaching to land the offer.',
                cta: 'Explore Jobs',
                link: '/jobs',
                color: 'yellow',
              },
              {
                icon: '🏢',
                title: 'Employer',
                subtitle: 'Company, Lab, or Agency',
                description: 'Post once, reach our growing partner network. Source credentialed STEM talent. Run challenges to find your next hire.',
                cta: 'Find Talent',
                link: '/register?role=partner',
                color: 'blue',
              },
              {
                icon: '🎓',
                title: 'Educator',
                subtitle: 'University or Training Provider',
                description: 'Connect your graduates directly to hiring employers. See which skills are in demand. Track placement outcomes.',
                cta: 'Partner With Us',
                link: '/register?role=educator',
                color: 'green',
              },
              {
                icon: '⭐',
                title: 'Provider',
                subtitle: 'Consultant or Coach',
                description: 'Showcase your firm to employers and agencies investing in STEM. Win work across 11 high-growth sectors.',
                cta: 'Join Network',
                link: '/register?role=service-provider',
                color: 'pink',
              },
              {
                icon: '🎒',
                title: 'Student',
                subtitle: 'High School or College',
                description: 'Find the right college, win scholarships, land internships, and see what your degree is actually worth.',
                cta: 'Start Free',
                link: '/register?role=student',
                color: 'cyan',
              },
            ].map((audience) => (
              <Link
                key={audience.title}
                to={audience.link}
                className={`group relative p-6 bg-dark-surface border border-dark-border rounded-2xl ${audienceColors[audience.color]?.hoverBorder || 'hover:border-slate-500/50'} transition-all hover:transform hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 ${audienceColors[audience.color]?.bgLight || 'bg-slate-500/10'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{audience.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{audience.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{audience.subtitle}</p>
                <p className="text-sm text-gray-400 mb-4">{audience.description}</p>
                <span className={`inline-flex items-center text-sm font-medium ${audienceColors[audience.color]?.text || 'text-slate-400'} ${audienceColors[audience.color]?.textHover || 'group-hover:text-slate-300'}`}>
                  {audience.cta}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              11 Emerging Technology Sectors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore opportunities across industries critical to national security, 
              economic competitiveness, healthcare innovation, and technological leadership.
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
