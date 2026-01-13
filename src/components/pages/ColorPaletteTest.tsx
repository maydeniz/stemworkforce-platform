// ===========================================
// Color Palette Test Page
// Testing the Light Mode Color Palette for STEM Workforce
// ===========================================
//
// COLOR PALETTE BASED ON DESIGN EXPERT RESEARCH:
// ------------------------------------------------
// Primary: Deep Blue (#1e40af) - Trust, professionalism, technology
// Secondary: Teal (#0d9488) - Growth, STEM, innovation
// Accent: Orange (#ea580c) - Energy, creativity, CTAs
// Success: Green (#16a34a) - Growth, positive outcomes
//
// Sources:
// - Verpex: Blue and green are favorable for education
// - LearnWorlds: Blue creates trust, green represents growth
// - Bungalow Design: Orange adds warmth and creativity sparingly
// - STEM Ecosystems 2025: Uses orange, yellow, blue, green
// ===========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, GraduationCap, Cpu, Factory,
  Shield, Zap, Award, Star, MapPin, Clock,
  CheckCircle, Bell, Search
} from 'lucide-react';

// ===========================================
// COLOR PALETTE DEFINITION
// ===========================================

const PALETTE = {
  // Primary colors - Deep Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',  // Main primary
    900: '#1e3a8a',
  },

  // Secondary colors - Teal
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',  // Main secondary
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Accent colors - Orange
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',  // Main accent
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Success colors - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',  // Main success
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },

  // Error/Danger - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
  },

  // Neutrals - Light Mode
  neutral: {
    white: '#ffffff',
    50: '#f8fafc',   // Background light
    100: '#f1f5f9',  // Surface alt
    200: '#e2e8f0',  // Border
    300: '#cbd5e1',  // Border dark
    400: '#94a3b8',  // Text muted
    500: '#64748b',  // Text secondary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',  // Text primary
    900: '#0f172a',
  },
};

// Industry-specific colors
const INDUSTRY_COLORS = {
  ai: { bg: PALETTE.primary[50], text: PALETTE.primary[800], border: PALETTE.primary[200] },
  healthcare: { bg: PALETTE.secondary[50], text: PALETTE.secondary[600], border: PALETTE.secondary[200] },
  manufacturing: { bg: PALETTE.accent[50], text: PALETTE.accent[600], border: PALETTE.accent[200] },
  energy: { bg: PALETTE.success[50], text: PALETTE.success[600], border: PALETTE.success[200] },
  defense: { bg: PALETTE.neutral[100], text: PALETTE.neutral[700], border: PALETTE.neutral[300] },
  quantum: { bg: PALETTE.primary[50], text: PALETTE.primary[700], border: PALETTE.primary[200] },
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const ColorPaletteTest: React.FC = () => {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.neutral.white }}>
      {/* Header Preview */}
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{
          backgroundColor: PALETTE.neutral.white,
          borderBottom: `1px solid ${PALETTE.neutral[200]}`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: PALETTE.primary[800] }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ color: PALETTE.neutral[800] }}
              >
                STEM Workforce
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {['Home', 'Jobs', 'Training', 'Experts', 'Industries'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveNav(item.toLowerCase())}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeNav === item.toLowerCase() ? PALETTE.primary[50] : 'transparent',
                    color: activeNav === item.toLowerCase() ? PALETTE.primary[800] : PALETTE.neutral[600],
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: PALETTE.neutral[500] }}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: PALETTE.neutral[500] }}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: PALETTE.accent[600] }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: PALETTE.neutral[800] }}
          >
            Light Mode Color Palette
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: PALETTE.neutral[500] }}
          >
            Professional, trustworthy, and innovative - designed for institutional credibility
          </p>
        </div>

        {/* Color Swatches */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Core Colors
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Primary Blue */}
            <div
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: `1px solid ${PALETTE.neutral[200]}` }}
            >
              <div
                className="h-24"
                style={{ backgroundColor: PALETTE.primary[800] }}
              />
              <div className="p-4" style={{ backgroundColor: PALETTE.neutral.white }}>
                <h3 className="font-semibold" style={{ color: PALETTE.neutral[800] }}>Primary Blue</h3>
                <p className="text-sm" style={{ color: PALETTE.neutral[500] }}>Trust & Professionalism</p>
                <code className="text-xs mt-2 block" style={{ color: PALETTE.neutral[400] }}>#1e40af</code>
              </div>
            </div>

            {/* Secondary Teal */}
            <div
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: `1px solid ${PALETTE.neutral[200]}` }}
            >
              <div
                className="h-24"
                style={{ backgroundColor: PALETTE.secondary[600] }}
              />
              <div className="p-4" style={{ backgroundColor: PALETTE.neutral.white }}>
                <h3 className="font-semibold" style={{ color: PALETTE.neutral[800] }}>Secondary Teal</h3>
                <p className="text-sm" style={{ color: PALETTE.neutral[500] }}>Growth & Innovation</p>
                <code className="text-xs mt-2 block" style={{ color: PALETTE.neutral[400] }}>#0d9488</code>
              </div>
            </div>

            {/* Accent Orange */}
            <div
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: `1px solid ${PALETTE.neutral[200]}` }}
            >
              <div
                className="h-24"
                style={{ backgroundColor: PALETTE.accent[600] }}
              />
              <div className="p-4" style={{ backgroundColor: PALETTE.neutral.white }}>
                <h3 className="font-semibold" style={{ color: PALETTE.neutral[800] }}>Accent Orange</h3>
                <p className="text-sm" style={{ color: PALETTE.neutral[500] }}>Energy & CTAs</p>
                <code className="text-xs mt-2 block" style={{ color: PALETTE.neutral[400] }}>#ea580c</code>
              </div>
            </div>

            {/* Success Green */}
            <div
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: `1px solid ${PALETTE.neutral[200]}` }}
            >
              <div
                className="h-24"
                style={{ backgroundColor: PALETTE.success[600] }}
              />
              <div className="p-4" style={{ backgroundColor: PALETTE.neutral.white }}>
                <h3 className="font-semibold" style={{ color: PALETTE.neutral[800] }}>Success Green</h3>
                <p className="text-sm" style={{ color: PALETTE.neutral[500] }}>Growth & Positive</p>
                <code className="text-xs mt-2 block" style={{ color: PALETTE.neutral[400] }}>#16a34a</code>
              </div>
            </div>
          </div>
        </section>

        {/* Color Scales */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Color Scales
          </h2>

          <div className="space-y-4">
            {/* Primary Scale */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: PALETTE.neutral[600] }}>Primary Blue</h3>
              <div className="flex rounded-lg overflow-hidden">
                {Object.entries(PALETTE.primary).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex-1 h-12 flex items-end justify-center pb-1"
                    style={{ backgroundColor: color }}
                  >
                    <span className={`text-xs font-medium ${parseInt(shade) >= 500 ? 'text-white' : 'text-gray-800'}`}>
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Scale */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: PALETTE.neutral[600] }}>Secondary Teal</h3>
              <div className="flex rounded-lg overflow-hidden">
                {Object.entries(PALETTE.secondary).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex-1 h-12 flex items-end justify-center pb-1"
                    style={{ backgroundColor: color }}
                  >
                    <span className={`text-xs font-medium ${parseInt(shade) >= 500 ? 'text-white' : 'text-gray-800'}`}>
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Scale */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: PALETTE.neutral[600] }}>Accent Orange</h3>
              <div className="flex rounded-lg overflow-hidden">
                {Object.entries(PALETTE.accent).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex-1 h-12 flex items-end justify-center pb-1"
                    style={{ backgroundColor: color }}
                  >
                    <span className={`text-xs font-medium ${parseInt(shade) >= 500 ? 'text-white' : 'text-gray-800'}`}>
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Scale */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: PALETTE.neutral[600] }}>Success Green</h3>
              <div className="flex rounded-lg overflow-hidden">
                {Object.entries(PALETTE.success).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex-1 h-12 flex items-end justify-center pb-1"
                    style={{ backgroundColor: color }}
                  >
                    <span className={`text-xs font-medium ${parseInt(shade) >= 500 ? 'text-white' : 'text-gray-800'}`}>
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Buttons
          </h2>

          <div
            className="p-8 rounded-xl space-y-6"
            style={{ backgroundColor: PALETTE.neutral[50], border: `1px solid ${PALETTE.neutral[200]}` }}
          >
            {/* Primary Buttons */}
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: PALETTE.neutral[600] }}>Primary Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: PALETTE.primary[800] }}
                >
                  Primary Blue
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: PALETTE.secondary[600] }}
                >
                  Secondary Teal
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: PALETTE.accent[600] }}
                >
                  Accent Orange (CTA)
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: PALETTE.success[600] }}
                >
                  Success Green
                </button>
              </div>
            </div>

            {/* Outline Buttons */}
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: PALETTE.neutral[600] }}>Outline Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:bg-opacity-10"
                  style={{
                    border: `2px solid ${PALETTE.primary[800]}`,
                    color: PALETTE.primary[800],
                    backgroundColor: 'transparent'
                  }}
                >
                  Primary Outline
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    border: `2px solid ${PALETTE.secondary[600]}`,
                    color: PALETTE.secondary[600],
                    backgroundColor: 'transparent'
                  }}
                >
                  Secondary Outline
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    border: `2px solid ${PALETTE.accent[600]}`,
                    color: PALETTE.accent[600],
                    backgroundColor: 'transparent'
                  }}
                >
                  Accent Outline
                </button>
              </div>
            </div>

            {/* Soft Buttons */}
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: PALETTE.neutral[600] }}>Soft Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: PALETTE.primary[50],
                    color: PALETTE.primary[800]
                  }}
                >
                  Soft Primary
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: PALETTE.secondary[50],
                    color: PALETTE.secondary[700]
                  }}
                >
                  Soft Secondary
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: PALETTE.accent[50],
                    color: PALETTE.accent[700]
                  }}
                >
                  Soft Accent
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Cards
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Job Card */}
            <div
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: PALETTE.neutral.white,
                border: `1px solid ${PALETTE.neutral[200]}`
              }}
            >
              <div
                className="h-2"
                style={{ backgroundColor: PALETTE.primary[800] }}
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: PALETTE.primary[50] }}
                  >
                    <Briefcase className="w-6 h-6" style={{ color: PALETTE.primary[800] }} />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: PALETTE.success[50], color: PALETTE.success[700] }}
                  >
                    New
                  </span>
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: PALETTE.neutral[800] }}
                >
                  Senior AI Engineer
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: PALETTE.neutral[500] }}
                >
                  Build next-generation AI systems for enterprise applications.
                </p>
                <div className="flex items-center gap-4 text-sm" style={{ color: PALETTE.neutral[400] }}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Remote
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Full-time
                  </span>
                </div>
              </div>
            </div>

            {/* Expert Card */}
            <div
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: PALETTE.neutral.white,
                border: `1px solid ${PALETTE.neutral[200]}`
              }}
            >
              <div
                className="h-2"
                style={{ backgroundColor: PALETTE.secondary[600] }}
              />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: PALETTE.secondary[600] }}
                  >
                    JD
                  </div>
                  <div>
                    <h3
                      className="font-semibold"
                      style={{ color: PALETTE.neutral[800] }}
                    >
                      Dr. Jane Doe
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: PALETTE.secondary[600] }}
                    >
                      Executive Coach
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: PALETTE.accent[500] }} />
                  ))}
                  <span className="text-sm ml-2" style={{ color: PALETTE.neutral[500] }}>4.9 (128)</span>
                </div>
                <p
                  className="text-sm mb-4"
                  style={{ color: PALETTE.neutral[500] }}
                >
                  20+ years helping executives transition to AI-first organizations.
                </p>
                <button
                  className="w-full py-2.5 rounded-lg font-medium text-white"
                  style={{ backgroundColor: PALETTE.secondary[600] }}
                >
                  Book Session
                </button>
              </div>
            </div>

            {/* Training Card */}
            <div
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: PALETTE.neutral.white,
                border: `1px solid ${PALETTE.neutral[200]}`
              }}
            >
              <div
                className="h-2"
                style={{ backgroundColor: PALETTE.accent[600] }}
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: PALETTE.accent[50] }}
                  >
                    <GraduationCap className="w-6 h-6" style={{ color: PALETTE.accent[600] }} />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: PALETTE.accent[50], color: PALETTE.accent[700] }}
                  >
                    Popular
                  </span>
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: PALETTE.neutral[800] }}
                >
                  Machine Learning Fundamentals
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: PALETTE.neutral[500] }}
                >
                  Master the foundations of ML with hands-on projects.
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: PALETTE.accent[600] }}>$299</span>
                  <button
                    className="px-4 py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: PALETTE.accent[600] }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Tags */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Industry Tags
          </h2>

          <div
            className="p-8 rounded-xl"
            style={{ backgroundColor: PALETTE.neutral[50], border: `1px solid ${PALETTE.neutral[200]}` }}
          >
            <div className="flex flex-wrap gap-3">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.ai.bg,
                  color: INDUSTRY_COLORS.ai.text,
                  border: `1px solid ${INDUSTRY_COLORS.ai.border}`
                }}
              >
                <Cpu className="w-4 h-4" /> AI & Machine Learning
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.healthcare.bg,
                  color: INDUSTRY_COLORS.healthcare.text,
                  border: `1px solid ${INDUSTRY_COLORS.healthcare.border}`
                }}
              >
                <Users className="w-4 h-4" /> Healthcare
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.manufacturing.bg,
                  color: INDUSTRY_COLORS.manufacturing.text,
                  border: `1px solid ${INDUSTRY_COLORS.manufacturing.border}`
                }}
              >
                <Factory className="w-4 h-4" /> Manufacturing
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.energy.bg,
                  color: INDUSTRY_COLORS.energy.text,
                  border: `1px solid ${INDUSTRY_COLORS.energy.border}`
                }}
              >
                <Zap className="w-4 h-4" /> Clean Energy
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.defense.bg,
                  color: INDUSTRY_COLORS.defense.text,
                  border: `1px solid ${INDUSTRY_COLORS.defense.border}`
                }}
              >
                <Shield className="w-4 h-4" /> Defense
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: INDUSTRY_COLORS.quantum.bg,
                  color: INDUSTRY_COLORS.quantum.text,
                  border: `1px solid ${INDUSTRY_COLORS.quantum.border}`
                }}
              >
                <Award className="w-4 h-4" /> Quantum Technologies
              </span>
            </div>
          </div>
        </section>

        {/* Status Badges */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Status Badges
          </h2>

          <div
            className="p-8 rounded-xl"
            style={{ backgroundColor: PALETTE.neutral[50], border: `1px solid ${PALETTE.neutral[200]}` }}
          >
            <div className="flex flex-wrap gap-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: PALETTE.success[50], color: PALETTE.success[700] }}
              >
                <CheckCircle className="w-4 h-4" /> Active
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: PALETTE.warning[50], color: PALETTE.warning[600] }}
              >
                Pending
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: PALETTE.error[50], color: PALETTE.error[600] }}
              >
                Cancelled
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: PALETTE.primary[50], color: PALETTE.primary[700] }}
              >
                In Review
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: PALETTE.secondary[50], color: PALETTE.secondary[700] }}
              >
                Verified
              </span>
            </div>
          </div>
        </section>

        {/* Hero Section Example */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Hero Section Example
          </h2>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.primary[50]} 0%, ${PALETTE.secondary[50]} 50%, ${PALETTE.accent[50]} 100%)`,
              border: `1px solid ${PALETTE.neutral[200]}`
            }}
          >
            <div className="p-12 md:p-16">
              <div className="max-w-2xl">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{ backgroundColor: PALETTE.primary[100], color: PALETTE.primary[800] }}
                >
                  <Zap className="w-4 h-4" /> AI-Powered Workforce Solutions
                </span>
                <h1
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                  style={{ color: PALETTE.neutral[800] }}
                >
                  Build the Future of
                  <span style={{ color: PALETTE.primary[800] }}> STEM Workforce</span>
                </h1>
                <p
                  className="text-xl mb-8 leading-relaxed"
                  style={{ color: PALETTE.neutral[600] }}
                >
                  Connect with top talent, upskill your teams, and transform your organization with our comprehensive workforce development platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: PALETTE.accent[600] }}
                  >
                    Get Started Free
                  </button>
                  <button
                    className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-md"
                    style={{
                      backgroundColor: PALETTE.neutral.white,
                      border: `2px solid ${PALETTE.primary[800]}`,
                      color: PALETTE.primary[800]
                    }}
                  >
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison with Dark Mode */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: PALETTE.neutral[800] }}
          >
            Light vs Dark Mode Comparison
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Light Mode Card */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: PALETTE.neutral.white,
                border: `1px solid ${PALETTE.neutral[200]}`
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PALETTE.neutral[200] }}></div>
                <span className="font-medium" style={{ color: PALETTE.neutral[800] }}>Light Mode</span>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: PALETTE.neutral[50] }}
              >
                <p style={{ color: PALETTE.neutral[600] }}>
                  Clean, professional appearance. High readability. Familiar interface pattern.
                </p>
              </div>
            </div>

            {/* Dark Mode Reference */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: '#0a0a0f',
                border: '1px solid #1e1e2d'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b3b4f' }}></div>
                <span className="font-medium text-white">Current Dark Mode</span>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#12121a' }}
              >
                <p className="text-gray-400">
                  Dramatic, tech-forward. Popular with developer audiences. Higher eye strain in bright environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Credits */}
        <section
          className="py-8 px-6 rounded-xl text-center"
          style={{ backgroundColor: PALETTE.neutral[100], border: `1px solid ${PALETTE.neutral[200]}` }}
        >
          <p className="font-medium mb-2" style={{ color: PALETTE.neutral[700] }}>
            Light Mode Color Palette - Expert Recommended
          </p>
          <p className="text-sm mb-4" style={{ color: PALETTE.neutral[500] }}>
            Based on research from education design experts and STEM industry standards
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.primary[800] }}></div>
              <span className="text-sm" style={{ color: PALETTE.neutral[600] }}>Primary Blue #1e40af</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.secondary[600] }}></div>
              <span className="text-sm" style={{ color: PALETTE.neutral[600] }}>Secondary Teal #0d9488</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.accent[600] }}></div>
              <span className="text-sm" style={{ color: PALETTE.neutral[600] }}>Accent Orange #ea580c</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: PALETTE.success[600] }}></div>
              <span className="text-sm" style={{ color: PALETTE.neutral[600] }}>Success Green #16a34a</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="py-8 mt-12"
        style={{ backgroundColor: PALETTE.neutral[100], borderTop: `1px solid ${PALETTE.neutral[200]}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm" style={{ color: PALETTE.neutral[500] }}>
            Color Palette Test Page - Navigate to <Link to="/color-test" className="underline" style={{ color: PALETTE.primary[800] }}>/color-test</Link> to view
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ColorPaletteTest;
