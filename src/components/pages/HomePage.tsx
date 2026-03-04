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
  useDocumentTitle('Building America\'s Technology Future');

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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Building America's
            <span className="block gradient-text">Technology Future</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Connect with opportunities across semiconductor, nuclear, AI, quantum computing, 
            healthcare technology, and other emerging technology sectors driving national security and economic growth.
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
            <Link to="/partners">
              <Button variant="outline" size="lg">
                Partner With Us
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{formatNumber(PLATFORM_STATS.totalJobs)}+</div>
              <div className="text-sm text-gray-400 mt-1">Jobs Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{PLATFORM_STATS.statesCovered}</div>
              <div className="text-sm text-gray-400 mt-1">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{PLATFORM_STATS.placementRate}%</div>
              <div className="text-sm text-gray-400 mt-1">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{PLATFORM_STATS.industryPartners}+</div>
              <div className="text-sm text-gray-400 mt-1">Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Value Proposition Section */}
      <section className="py-24 bg-dark-surface border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Complete Ecosystem for America's
              <span className="block gradient-text">Emerging Technology Workforce</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              More than a job board. STEMWorkforce.net unites talent, employers, educators,
              and service providers across 11 critical technology sectors powering national
              security and economic competitiveness.
            </p>
          </div>

          {/* Visual Ecosystem Model */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-8 flex flex-col items-end">
                <div className="group">
                  <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-dark-bg/50 border border-dark-border rounded-xl hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="text-right">
                      <p className="text-white font-semibold text-xs md:text-base">Employers</p>
                      <p className="text-[10px] md:text-sm text-gray-500 hidden sm:block">Companies, Labs, Agencies</p>
                    </div>
                    <span className="text-xl md:text-3xl">🏢</span>
                  </div>
                </div>
                <div className="group">
                  <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-dark-bg/50 border border-dark-border rounded-xl hover:border-green-500/50 transition-all cursor-pointer">
                    <div className="text-right">
                      <p className="text-white font-semibold text-xs md:text-base">Education</p>
                      <p className="text-[10px] md:text-sm text-gray-500 hidden sm:block">Universities & Training</p>
                    </div>
                    <span className="text-xl md:text-3xl">🎓</span>
                  </div>
                </div>
              </div>

              {/* Center - Platform Hub */}
              <div className="relative min-w-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 md:p-8 text-center shadow-2xl overflow-hidden">
                  <div className="w-10 h-10 md:w-16 md:h-16 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-2 md:mb-4">
                    <span className="text-2xl md:text-4xl">🔗</span>
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">
                    <span className="md:hidden">STEM<br />Workforce</span>
                    <span className="hidden md:inline">STEMWorkforce</span>
                  </h3>
                  <p className="text-[10px] md:text-sm text-blue-200">Connecting the Ecosystem</p>
                </div>
                {/* Connection lines */}
                <div className="absolute top-1/2 -left-2 md:-left-4 w-2 md:w-4 h-0.5 bg-gradient-to-r from-transparent to-blue-500/50" />
                <div className="absolute top-1/2 -right-2 md:-right-4 w-2 md:w-4 h-0.5 bg-gradient-to-l from-transparent to-purple-500/50" />
              </div>

              {/* Right Column */}
              <div className="space-y-4 md:space-y-8 flex flex-col items-start">
                <div className="group">
                  <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-dark-bg/50 border border-dark-border rounded-xl hover:border-yellow-500/50 transition-all cursor-pointer">
                    <span className="text-xl md:text-3xl">👤</span>
                    <div>
                      <p className="text-white font-semibold text-xs md:text-base">Talent</p>
                      <p className="text-[10px] md:text-sm text-gray-500 hidden sm:block">Job Seekers & Professionals</p>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-dark-bg/50 border border-dark-border rounded-xl hover:border-pink-500/50 transition-all cursor-pointer">
                    <span className="text-xl md:text-3xl">⭐</span>
                    <div>
                      <p className="text-white font-semibold text-xs md:text-base">Providers</p>
                      <p className="text-[10px] md:text-sm text-gray-500 hidden sm:block">Consultants & Coaches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students at bottom */}
            <div className="flex justify-center mt-6 md:mt-8">
              <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 bg-dark-bg/50 border border-dark-border rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer">
                <span className="text-xl md:text-3xl">🎒</span>
                <div>
                  <p className="text-white font-semibold text-xs md:text-base">Students</p>
                  <p className="text-[10px] md:text-sm text-gray-500 hidden sm:block">Future STEM Workforce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-dark-bg/30 border border-dark-border rounded-2xl hover:border-blue-500/30 transition-all">
              <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unified Platform</h3>
              <p className="text-gray-400">
                All 5 stakeholder types connected in one place. Find opportunities, talent,
                programs, and expertise without switching platforms.
              </p>
            </div>
            <div className="text-center p-8 bg-dark-bg/30 border border-dark-border rounded-2xl hover:border-purple-500/30 transition-all">
              <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Workforce Intelligence</h3>
              <p className="text-gray-400">
                Data-driven insights and matching across 24+ states. Real-time job market
                data, skills gap analysis, and trend forecasting.
              </p>
            </div>
            <div className="text-center p-8 bg-dark-bg/30 border border-dark-border rounded-2xl hover:border-green-500/30 transition-all">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">National Mission</h3>
              <p className="text-gray-400">
                A DOE-backed initiative focused on critical technology sectors. Supporting
                national security, economic competitiveness, and workforce development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Pathways Section */}
      <section className="py-24 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
                subtitle: 'Job Seeker or Professional',
                description: 'Find jobs, grow your career, connect with mentors',
                cta: 'Explore Jobs',
                link: '/jobs',
                color: 'yellow',
              },
              {
                icon: '🏢',
                title: 'Employer',
                subtitle: 'Company, Lab, or Agency',
                description: 'Post jobs, find talent, build your pipeline',
                cta: 'Post Jobs',
                link: '/register?role=partner',
                color: 'blue',
              },
              {
                icon: '🎓',
                title: 'Educator',
                subtitle: 'University or Training Provider',
                description: 'List programs, connect with industry',
                cta: 'Partner With Us',
                link: '/register?role=educator',
                color: 'green',
              },
              {
                icon: '⭐',
                title: 'Provider',
                subtitle: 'Consultant or Coach',
                description: 'Offer services, find clients, grow practice',
                cta: 'Join Network',
                link: '/register?role=service-provider',
                color: 'pink',
              },
              {
                icon: '🎒',
                title: 'Student',
                subtitle: 'Future STEM Professional',
                description: 'Explore careers, prep for college, find mentors',
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
              Your Complete Workforce Platform
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to launch or advance your career in emerging technologies.
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
                description: 'Interactive intelligence on 24+ states with industry clusters and top employers.',
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

      {/* Social Proof / Trust Section */}
      <section className="py-16 bg-dark-bg border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Trusted By Leading Organizations</p>
          </div>

          {/* Partner Logos (placeholder grid) */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12 opacity-60">
            {[
              { name: 'Department of Energy', abbr: 'DOE' },
              { name: 'National Laboratories', abbr: 'NAT LABS' },
              { name: 'Federal Agencies', abbr: 'FED GOVT' },
              { name: 'Fortune 500', abbr: 'F500' },
              { name: 'Top Universities', abbr: 'ACADEMIA' },
              { name: 'Healthcare Systems', abbr: 'HEALTH' },
            ].map((partner) => (
              <div key={partner.abbr} className="flex items-center justify-center w-24 h-12 bg-dark-surface rounded-lg border border-dark-border">
                <span className="text-xs font-bold text-gray-500">{partner.abbr}</span>
              </div>
            ))}
          </div>

          {/* Trust Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">650+</div>
              <div className="text-sm text-gray-500">Industry Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">11</div>
              <div className="text-sm text-gray-500">Critical Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24+</div>
              <div className="text-sm text-gray-500">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">DOE</div>
              <div className="text-sm text-gray-500">Backed Initiative</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals building careers in America's most critical technology sectors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link to="/partners">
              <Button variant="secondary" size="lg">Become a Partner</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
