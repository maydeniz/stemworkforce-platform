// ===========================================
// Home Page Component
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_LIST, PLATFORM_STATS } from '@/config';
import { formatNumber } from '@/utils/helpers';
import { Button, Card } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-400">DOE CTO Challenge Initiative</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Building America's
            <span className="block gradient-text">Technology Future</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Connect with opportunities across semiconductor, nuclear, AI, quantum computing, 
            and other emerging technology sectors driving national security and economic growth.
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

      {/* Industries Section */}
      <section className="py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              10 Emerging Technology Sectors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore opportunities across industries critical to national security, 
              economic competitiveness, and technological leadership.
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
                description: 'Access 1.2M+ opportunities across federal, private, and national lab employers.',
                link: '/jobs',
              },
              {
                icon: '🗺️',
                title: 'Workforce Map',
                description: 'Interactive intelligence on 18+ states with industry clusters and top employers.',
                link: '/map',
              },
              {
                icon: '📚',
                title: 'Training Portal',
                description: '850+ programs with credentials, certifications, and skill-building pathways.',
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
                description: 'Connect with industry leaders, government agencies, and educational institutions.',
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
