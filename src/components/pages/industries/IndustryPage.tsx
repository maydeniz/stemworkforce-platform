// ===========================================
// Industry Page Component
// Dynamic page for each industry with value propositions and services
// Using Partners-style yellow/gold accent palette
// ===========================================

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { INDUSTRIES_DATA, getIndustryById } from '@/data/industries';
import { AIMetricsTooltip } from '@/components/common/AIMetricsTooltip';
import {
  industryAIMetrics,
  getExposureLabel,
  getOpportunityLabel,
  getExposureColor,
  getOpportunityColor,
  getExposureBgColor,
  getOpportunityBgColor,
} from '@/data/aiMetrics';

// Yellow/Gold accent color (matching Partners page)
const ACCENT = {
  primary: '#F5C518',      // Yellow-500
  light: '#fbbf24',        // Yellow-400 for hover
  bg: 'rgba(245, 197, 24, 0.1)',
  bgHover: 'rgba(245, 197, 24, 0.15)',
  text: '#fbbf24',
};

const IndustryPage: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const industry = industryId ? getIndustryById(industryId) : null;

  // If industry not found, redirect to industries list
  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background gradient - yellow accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,197,24,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/industries" className="hover:text-white transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-yellow-400">{industry.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Industry badge */}
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 border border-yellow-500/20"
                style={{ backgroundColor: ACCENT.bg }}
              >
                <span className="text-2xl">{industry.icon}</span>
                <span className="text-sm font-medium text-yellow-400">{industry.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {industry.tagline}
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {industry.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
                >
                  Schedule a Consultation
                </Link>
                <Link
                  to={`/jobs?industry=${industry.id}`}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
                >
                  Explore {industry.shortName} Jobs
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {industry.stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all"
                >
                  <span className="text-2xl mb-3 block">{stat.icon}</span>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { label: 'Active Job Seekers', value: '125K+' },
              { label: 'Partner Organizations', value: '1,400+' },
              { label: 'Training Programs', value: '850+' },
              { label: 'Successful Placements', value: '45K+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-red-500/10 text-red-400 border border-red-500/20">
              The Challenge
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {industry.problemTitle}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {industry.problemDescription}
            </p>
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {industry.challenges.map((challenge, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm font-bold">
                  !
                </span>
                <span className="text-gray-300">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {industry.solutionTitle}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {industry.solutionDescription}
            </p>
          </div>

          {/* Approach Points */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {industry.approachPoints.map((point, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
                  style={{ backgroundColor: `${industry.color}20` }}
                >
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
                <p className="text-gray-400 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 italic">{industry.trustedByDescription}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our <span className="text-yellow-400">Services</span>
            </h2>
            <p className="text-lg text-gray-400">
              Tailored workforce solutions for every stage of your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {industry.services.map((service) => (
              <div
                key={service.tier}
                className={`relative p-8 rounded-2xl border transition-all ${
                  service.highlighted
                    ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {service.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-gray-900 text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tier {service.tier}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-yellow-400">
                    Best for: {service.bestFor}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    service.highlighted
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Employers Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Key Skills */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">In-Demand Skills</h3>
              <div className="flex flex-wrap gap-3">
                {industry.keySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                to={`/training?industry=${industry.id}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Find Training Programs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Top Employers */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Top Employers</h3>
              <div className="grid grid-cols-2 gap-4">
                {industry.topEmployers.map((employer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: `${industry.color}20`, color: industry.color }}
                    >
                      {employer.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{employer}</span>
                  </div>
                ))}
              </div>
              <Link
                to={`/jobs?industry=${industry.id}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                View Open Positions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Economy Outlook Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AI Economy Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI Impact on <span className="text-yellow-400">{industry.name}</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Understanding how AI will transform this industry helps you make informed career and workforce decisions.
            </p>
          </div>

          {(() => {
            const aiMetrics = industryAIMetrics[industry.id] || industryAIMetrics['manufacturing'];
            return (
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* AI Exposure Card */}
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        AI Exposure Index
                        <AIMetricsTooltip type="exposure" value={aiMetrics.exposureIndex} />
                      </h3>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${getExposureBgColor(aiMetrics.exposureIndex)} ${getExposureColor(aiMetrics.exposureIndex)}`}>
                        {getExposureLabel(aiMetrics.exposureIndex)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Transformation Level</span>
                        <span className="text-white font-semibold">{aiMetrics.exposureIndex}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            aiMetrics.exposureIndex >= 70 ? 'bg-red-500' :
                            aiMetrics.exposureIndex >= 50 ? 'bg-orange-500' :
                            aiMetrics.exposureIndex >= 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${aiMetrics.exposureIndex}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">
                      {aiMetrics.exposureIndex >= 70
                        ? 'High AI integration expected. Focus on AI collaboration skills to stay competitive.'
                        : aiMetrics.exposureIndex >= 50
                        ? 'Significant AI tools will be adopted. Learning AI-assisted workflows is beneficial.'
                        : aiMetrics.exposureIndex >= 30
                        ? 'Moderate AI impact. Core skills remain valuable with some AI enhancement.'
                        : 'Lower AI disruption. Traditional expertise remains highly valued.'}
                    </p>
                  </div>

                  {/* AI Opportunity Card */}
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        AI Opportunity Index
                        <AIMetricsTooltip type="opportunity" value={aiMetrics.opportunityIndex} />
                      </h3>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${getOpportunityBgColor(aiMetrics.opportunityIndex)} ${getOpportunityColor(aiMetrics.opportunityIndex)}`}>
                        {getOpportunityLabel(aiMetrics.opportunityIndex)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Career Growth Potential</span>
                        <span className="text-white font-semibold">{aiMetrics.opportunityIndex}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            aiMetrics.opportunityIndex >= 75 ? 'bg-emerald-500' :
                            aiMetrics.opportunityIndex >= 55 ? 'bg-blue-500' :
                            aiMetrics.opportunityIndex >= 35 ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${aiMetrics.opportunityIndex}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">
                      {aiMetrics.opportunityIndex >= 75
                        ? 'Exceptional career prospects. AI skills significantly boost earning potential.'
                        : aiMetrics.opportunityIndex >= 55
                        ? 'Strong growth trajectory. Many AI-enhanced career paths available.'
                        : aiMetrics.opportunityIndex >= 35
                        ? 'Moderate opportunities. Consider supplementing with AI-adjacent skills.'
                        : 'Traditional career paths. AI skills can add incremental value.'}
                    </p>
                  </div>
                </div>

                {/* Recommended AI Skills */}
                <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Recommended AI Skills for {industry.name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {aiMetrics.recommendedAISkills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/training?industry=${industry.id}`}
                    className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Find Training Programs for These Skills
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Related Industries */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Related <span className="text-yellow-400">Industries</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {industry.relatedIndustries.map((relatedId) => {
              const related = INDUSTRIES_DATA[relatedId];
              if (!related) return null;
              return (
                <Link
                  key={relatedId}
                  to={`/industries/${relatedId}`}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all group"
                >
                  <span className="text-xl">{related.icon}</span>
                  <span className="text-white font-medium group-hover:text-yellow-400 transition-colors">{related.name}</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your STEM Workforce?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you build the talent capabilities you need to succeed in the {industry.name} sector.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Schedule a Consultation
              </Link>
              <Link
                to="/partners"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryPage;
