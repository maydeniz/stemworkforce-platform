// ===========================================
// Footer Component - LIGHT MODE VERSION
// Matching color palette for light mode test
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_LINKS, PLATFORM_STATS, INDUSTRY_LIST } from '@/config';
import { formatNumber } from '@/utils/helpers';

// Light mode color palette
const PALETTE = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryBg: '#eff6ff',
  secondary: '#0d9488',
  secondaryBg: '#f0fdfa',
  accent: '#ea580c',
  accentBg: '#fff7ed',
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceAlt: '#f1f5f9',
  border: '#e2e8f0',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
};

export const FooterLight: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: PALETTE.surface, borderTop: `1px solid ${PALETTE.border}` }}>
      {/* Stats banner */}
      <div style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {formatNumber(PLATFORM_STATS.totalJobs)}+
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>Jobs Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {formatNumber(PLATFORM_STATS.activeEmployers)}+
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>Employers</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {PLATFORM_STATS.statesCovered}
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>States Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {PLATFORM_STATS.placementRate}%
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>Placement Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {formatNumber(PLATFORM_STATS.trainedProfessionals)}+
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>Trained</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: PALETTE.primary }}>
                {PLATFORM_STATS.industryPartners}
              </div>
              <div className="text-sm" style={{ color: PALETTE.textSecondary }}>Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${PALETTE.primary}, ${PALETTE.secondary})` }}
              >
                <span className="text-white font-bold">SW</span>
              </div>
              <span className="text-xl font-bold" style={{ color: PALETTE.textPrimary }}>
                STEM<span style={{ color: PALETTE.primary }}>Workforce</span>
              </span>
            </Link>
            <p className="text-sm mb-4 max-w-xs" style={{ color: PALETTE.textSecondary }}>
              Building America's technology future by connecting talent with opportunities across emerging technology sectors.
            </p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_LIST.slice(0, 5).map((industry) => (
                <span
                  key={industry.id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ backgroundColor: PALETTE.surfaceAlt, color: PALETTE.textSecondary }}
                >
                  {industry.icon} {industry.name}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: PALETTE.textPrimary }}>Platform</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: PALETTE.textSecondary }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: PALETTE.textPrimary }}>Resources</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: PALETTE.textSecondary }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: PALETTE.textPrimary }}>Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: PALETTE.textSecondary }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${PALETTE.border}` }}
        >
          <p className="text-sm" style={{ color: PALETTE.textMuted }}>
            © {currentYear} STEMWorkforce. A DOE CTO Challenge Initiative. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/stemworkforce"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: PALETTE.textMuted }}
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/stemworkforce"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: PALETTE.textMuted }}
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/stemworkforce"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: PALETTE.textMuted }}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Color palette indicator for test page */}
        <div
          className="mt-8 pt-6 text-center"
          style={{ borderTop: `1px solid ${PALETTE.border}` }}
        >
          <p className="text-xs mb-3" style={{ color: PALETTE.textMuted }}>
            <strong>Test Page:</strong> Light Mode Color Palette
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: PALETTE.primary }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Primary Blue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: PALETTE.secondary }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Secondary Teal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: PALETTE.accent }}></div>
              <span className="text-xs" style={{ color: PALETTE.textSecondary }}>Accent Orange</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLight;
