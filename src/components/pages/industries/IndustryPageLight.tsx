// ===========================================
// Industry Page Component - LIGHT MODE TEST
// Testing expert-recommended color palette for STEM Workforce
// ===========================================
//
// COLOR PALETTE BASED ON DESIGN EXPERT RESEARCH:
// ------------------------------------------------
// Primary: Deep Blue (#1e40af) - Trust, professionalism, technology
// Secondary: Teal (#0d9488) - Growth, STEM, innovation
// Accent: Orange (#ea580c) - Energy, creativity, CTAs
// Success: Green (#16a34a) - Growth, positive outcomes
//
// Neutrals (Light Mode):
// - Background: White (#ffffff) / Light Gray (#f8fafc)
// - Surface: Off-White (#f1f5f9)
// - Text Primary: Slate (#1e293b)
// - Text Secondary: Gray (#64748b)
// - Borders: Light Gray (#e2e8f0)
//
// Sources:
// - Verpex: Blue and green are favorable for education
// - LearnWorlds: Blue creates trust, green represents growth
// - Bungalow Design: Orange adds warmth and creativity sparingly
// - STEM Ecosystems 2025: Uses orange, yellow, blue, green
// ===========================================

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { INDUSTRIES_DATA, getIndustryById } from '@/data/industries';

// Light mode color palette
const PALETTE = {
  // Primary colors
  primary: '#1e40af',      // Deep blue - trust & professionalism
  primaryLight: '#3b82f6', // Lighter blue for hovers
  primaryBg: '#eff6ff',    // Very light blue background

  // Secondary colors
  secondary: '#0d9488',    // Teal - growth & innovation
  secondaryLight: '#14b8a6',
  secondaryBg: '#f0fdfa',

  // Accent colors
  accent: '#ea580c',       // Orange - energy & CTAs
  accentLight: '#f97316',
  accentBg: '#fff7ed',

  // Success/positive
  success: '#16a34a',
  successBg: '#f0fdf4',

  // Warning/challenge
  warning: '#dc2626',
  warningBg: '#fef2f2',

  // Neutrals
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceAlt: '#f1f5f9',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
};

const IndustryPageLight: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const industry = industryId ? getIndustryById(industryId) : null;

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.background }}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: PALETTE.surface }}>
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.primaryBg} 0%, ${PALETTE.secondaryBg} 50%, ${PALETTE.accentBg} 100%)`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: PALETTE.textSecondary }}>
            <Link to="/" className="hover:underline" style={{ color: PALETTE.primary }}>Home</Link>
            <span>/</span>
            <Link to="/industries" className="hover:underline" style={{ color: PALETTE.primary }}>Industries</Link>
            <span>/</span>
            <span style={{ color: PALETTE.textPrimary }}>{industry.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Industry badge */}
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: PALETTE.primaryBg, border: `1px solid ${PALETTE.border}` }}
              >
                <span className="text-2xl">{industry.icon}</span>
                <span className="text-sm font-medium" style={{ color: PALETTE.primary }}>
                  {industry.name}
                </span>
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: PALETTE.textPrimary }}
              >
                {industry.tagline}
              </h1>

              <p
                className="text-xl mb-8 leading-relaxed"
                style={{ color: PALETTE.textSecondary }}
              >
                {industry.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: PALETTE.accent }}
                >
                  Schedule a Consultation
                </Link>
                <Link
                  to={`/jobs?industry=${industry.id}`}
                  className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-md"
                  style={{
                    backgroundColor: PALETTE.background,
                    border: `2px solid ${PALETTE.primary}`,
                    color: PALETTE.primary
                  }}
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
                  className="p-6 rounded-2xl shadow-sm"
                  style={{
                    backgroundColor: PALETTE.background,
                    border: `1px solid ${PALETTE.border}`
                  }}
                >
                  <span className="text-2xl mb-3 block">{stat.icon}</span>
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: PALETTE.primary }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: PALETTE.textSecondary }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20" style={{ backgroundColor: PALETTE.warningBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: '#fecaca', color: PALETTE.warning }}
            >
              The Challenge
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: PALETTE.textPrimary }}
            >
              {industry.problemTitle}
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: PALETTE.textSecondary }}
            >
              {industry.problemDescription}
            </p>
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {industry.challenges.map((challenge, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-5 rounded-xl shadow-sm"
                style={{
                  backgroundColor: PALETTE.background,
                  border: `1px solid ${PALETTE.border}`
                }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#fecaca', color: PALETTE.warning }}
                >
                  !
                </span>
                <span style={{ color: PALETTE.textPrimary }}>{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20" style={{ backgroundColor: PALETTE.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: PALETTE.secondaryBg, color: PALETTE.secondary }}
            >
              Our Approach
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: PALETTE.textPrimary }}
            >
              {industry.solutionTitle}
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: PALETTE.textSecondary }}
            >
              {industry.solutionDescription}
            </p>
          </div>

          {/* Approach Points */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {industry.approachPoints.map((point, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl shadow-sm transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: PALETTE.background,
                  border: `1px solid ${PALETTE.border}`
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
                  style={{ backgroundColor: PALETTE.primaryBg }}
                >
                  {point.icon}
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: PALETTE.textPrimary }}
                >
                  {point.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: PALETTE.textSecondary }}
                >
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-12 text-center">
            <p className="italic" style={{ color: PALETTE.textMuted }}>
              {industry.trustedByDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" style={{ backgroundColor: PALETTE.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: PALETTE.textPrimary }}
            >
              Explore Our Services
            </h2>
            <p className="text-lg" style={{ color: PALETTE.textSecondary }}>
              Tailored workforce solutions for every stage of your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {industry.services.map((service) => (
              <div
                key={service.tier}
                className={`relative p-8 rounded-2xl transition-all ${
                  service.highlighted ? 'scale-105 shadow-xl' : 'shadow-sm hover:shadow-md'
                }`}
                style={{
                  backgroundColor: PALETTE.background,
                  border: service.highlighted
                    ? `2px solid ${PALETTE.primary}`
                    : `1px solid ${PALETTE.border}`
                }}
              >
                {service.highlighted && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: PALETTE.accent }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className="text-sm font-medium mb-2"
                    style={{ color: PALETTE.textMuted }}
                  >
                    Tier {service.tier}
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: PALETTE.textPrimary }}
                  >
                    {service.name}
                  </h3>
                  <p className="text-sm" style={{ color: PALETTE.secondary }}>
                    Best for: {service.bestFor}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: PALETTE.successBg, color: PALETTE.success }}
                      >
                        ✓
                      </span>
                      <span className="text-sm" style={{ color: PALETTE.textSecondary }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    service.highlighted ? 'text-white hover:opacity-90' : 'hover:opacity-80'
                  }`}
                  style={
                    service.highlighted
                      ? { backgroundColor: PALETTE.accent }
                      : { backgroundColor: PALETTE.surfaceAlt, color: PALETTE.primary }
                  }
                >
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Employers Section */}
      <section className="py-20" style={{ backgroundColor: PALETTE.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Key Skills */}
            <div
              className="p-8 rounded-2xl shadow-sm"
              style={{
                backgroundColor: PALETTE.surface,
                border: `1px solid ${PALETTE.border}`
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: PALETTE.textPrimary }}
              >
                In-Demand Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {industry.keySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: PALETTE.primaryBg, color: PALETTE.primary }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                to={`/training?industry=${industry.id}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium hover:underline"
                style={{ color: PALETTE.accent }}
              >
                Find Training Programs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Top Employers */}
            <div
              className="p-8 rounded-2xl shadow-sm"
              style={{
                backgroundColor: PALETTE.surface,
                border: `1px solid ${PALETTE.border}`
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: PALETTE.textPrimary }}
              >
                Top Employers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {industry.topEmployers.map((employer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: PALETTE.background }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: PALETTE.secondaryBg, color: PALETTE.secondary }}
                    >
                      {employer.charAt(0)}
                    </div>
                    <span
                      className="font-medium"
                      style={{ color: PALETTE.textPrimary }}
                    >
                      {employer}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to={`/jobs?industry=${industry.id}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium hover:underline"
                style={{ color: PALETTE.accent }}
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

      {/* Related Industries */}
      <section className="py-20" style={{ backgroundColor: PALETTE.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: PALETTE.textPrimary }}
          >
            Related Industries
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {industry.relatedIndustries.map((relatedId) => {
              const related = INDUSTRIES_DATA[relatedId];
              if (!related) return null;
              return (
                <Link
                  key={relatedId}
                  to={`/industries/${relatedId}`}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl transition-all group shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: PALETTE.background,
                    border: `1px solid ${PALETTE.border}`
                  }}
                >
                  <span className="text-xl">{related.icon}</span>
                  <span
                    className="font-medium transition-colors"
                    style={{ color: PALETTE.textPrimary }}
                  >
                    {related.name}
                  </span>
                  <svg
                    className="w-4 h-4 transition-colors"
                    style={{ color: PALETTE.textMuted }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: PALETTE.background }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="p-12 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.primaryBg} 0%, ${PALETTE.secondaryBg} 50%, ${PALETTE.accentBg} 100%)`,
              border: `1px solid ${PALETTE.border}`
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: PALETTE.textPrimary }}
            >
              Ready to Transform Your {industry.shortName} Workforce?
            </h2>
            <p
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: PALETTE.textSecondary }}
            >
              Let's discuss how we can help you build the talent capabilities you need to succeed in the {industry.name} sector.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: PALETTE.accent }}
              >
                Schedule a Consultation
              </Link>
              <Link
                to="/partners"
                className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-md"
                style={{
                  backgroundColor: PALETTE.background,
                  border: `2px solid ${PALETTE.primary}`,
                  color: PALETTE.primary
                }}
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Design Credits */}
      <section className="py-8" style={{ backgroundColor: PALETTE.surfaceAlt, borderTop: `1px solid ${PALETTE.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm" style={{ color: PALETTE.textMuted }}>
            <strong>Test Page:</strong> Light Mode Color Palette based on design expert research
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.primary }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Primary Blue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.secondary }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Secondary Teal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.accent }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Accent Orange</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.success }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Success Green</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryPageLight;
