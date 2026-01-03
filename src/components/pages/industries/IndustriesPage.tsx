// ===========================================
// Industries List Page
// Overview of all industries we serve
// Using Partners-style yellow/gold accent palette
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { getIndustriesList, type IndustryData } from '@/data/industries';

const industries = getIndustriesList();

const IndustriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,197,24,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-8">
            <span>🏭</span>
            <span>Specialized Workforce Solutions</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Industries <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">We Serve</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            From artificial intelligence to quantum computing, we provide specialized workforce
            development solutions for the most critical and emerging technology sectors.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/partners"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '11', label: 'Industry Sectors', icon: '🏭' },
              { value: '2.1M+', label: 'Jobs Available', icon: '💼' },
              { value: '1,400+', label: 'Partner Organizations', icon: '🤝' },
              { value: '185K+', label: 'Trained Professionals', icon: '🎓' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore Our <span className="text-yellow-400">Industries</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select an industry to learn about our tailored workforce solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Organizations <span className="text-yellow-400">Choose Us</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Research-based approaches that deliver measurable workforce outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '🔬',
                title: 'Research-Driven',
                description: 'Our approaches are grounded in empirical research, not generic consulting frameworks.',
              },
              {
                icon: '🎯',
                title: 'Industry-Specific',
                description: 'Deep expertise in each sector ensures solutions tailored to your unique challenges.',
              },
              {
                icon: '🤝',
                title: 'Partnership Model',
                description: 'We work alongside your team, building internal capabilities for long-term success.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-3xl mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't See Your Industry?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              We're constantly expanding our expertise. Contact us to discuss how we can help
              with your specific workforce challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Contact Us
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Industry Card Component
const IndustryCard: React.FC<{ industry: IndustryData }> = ({ industry }) => {
  return (
    <Link
      to={`/industries/${industry.id}`}
      className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${industry.color}20` }}
          >
            {industry.icon}
          </div>
          <svg
            className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {industry.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {industry.heroDescription}
        </p>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          {industry.stats.slice(0, 2).map((stat, index) => (
            <div key={index}>
              <div className="text-lg font-bold text-yellow-400">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills preview */}
        <div className="flex flex-wrap gap-2">
          {industry.keySkills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            >
              {skill}
            </span>
          ))}
          {industry.keySkills.length > 3 && (
            <span className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400">
              +{industry.keySkills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IndustriesPage;
