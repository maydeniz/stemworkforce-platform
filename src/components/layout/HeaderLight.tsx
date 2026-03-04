// ===========================================
// Header Component - LIGHT MODE VERSION
// Matching color palette for light mode test
// ===========================================

import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { useOnClickOutside } from '@/hooks';
import { cn } from '@/utils/helpers';

// Light mode color palette
const PALETTE = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryBg: '#eff6ff',
  secondary: '#0d9488',
  accent: '#ea580c',
  background: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
};

// Industries data for the dropdown
const INDUSTRIES_MENU = [
  { id: 'artificial-intelligence', name: 'AI & Machine Learning', icon: '🤖', color: '#8b5cf6', path: '/industries-light/artificial-intelligence' },
  { id: 'quantum-technologies', name: 'Quantum Technologies', icon: '🔬', color: '#ec4899', path: '/industries-light/quantum-technologies' },
  { id: 'nuclear-energy', name: 'Nuclear Technologies', icon: '⚛️', color: '#22c55e', path: '/industries-light/nuclear-energy' },
  { id: 'biotechnology', name: 'Biotechnology', icon: '🧬', color: '#10b981', path: '/industries-light/biotechnology' },
  { id: 'healthcare', name: 'Healthcare & Medical Technology', icon: '🏥', color: '#14b8a6', path: '/industries-light/healthcare' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️', color: '#ef4444', path: '/industries-light/cybersecurity' },
  { id: 'aerospace', name: 'Aerospace & Defense', icon: '🚀', color: '#06b6d4', path: '/industries-light/aerospace' },
  { id: 'advanced-manufacturing', name: 'Advanced Manufacturing', icon: '🏭', color: '#64748b', path: '/industries-light/advanced-manufacturing' },
  { id: 'semiconductor', name: 'Semiconductor', icon: '💻', color: '#3b82f6', path: '/industries-light/semiconductor' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾', color: '#f59e0b', path: '/industries-light/robotics' },
  { id: 'clean-energy', name: 'Clean Energy', icon: '🌱', color: '#84cc16', path: '/industries-light/clean-energy' },
];

// Navigation items
const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'intern-hub', label: 'Jobs & Internships', path: '/jobs' },
  { id: 'industries', label: 'Industries', path: '/industries-light', hasSubmenu: true },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'workforce-map', label: 'Workforce Map', path: '/map' },
  { id: 'events', label: 'Events', path: '/events' },
  { id: 'training-portal', label: 'Training', path: '/training' },
  { id: 'partners', label: 'For Partners', path: '/partners' },
];

export const HeaderLight: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [industriesMenuOpen, setIndustriesMenuOpen] = useState(false);
  const [mobileIndustriesExpanded, setMobileIndustriesExpanded] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const industriesMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false));
  useOnClickOutside(industriesMenuRef, () => setIndustriesMenuOpen(false));

  const isActive = (path: string) => location.pathname === path;
  const isIndustriesActive = () => location.pathname.startsWith('/industries');

  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.first_name || userMetadata.name?.split(' ')[0] || 'User';
  const lastName = userMetadata.last_name || userMetadata.name?.split(' ').slice(1).join(' ') || '';
  const userEmail = user?.email || '';
  const userRole = userMetadata.role || 'member';
  const organizationName = userMetadata.organization_name;
  const isPartner = userRole.startsWith('partner_') || userRole === 'educator';
  const displayName = isPartner && organizationName ? organizationName : firstName;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl shadow-sm"
      style={{ backgroundColor: `${PALETTE.background}f0`, borderBottom: `1px solid ${PALETTE.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${PALETTE.primary}, ${PALETTE.secondary})` }}
            >
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-xl font-bold hidden sm:block" style={{ color: PALETTE.textPrimary }}>
              STEM<span style={{ color: PALETTE.primary }}>Workforce</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              item.hasSubmenu ? (
                <div key={item.id} className="relative" ref={industriesMenuRef}>
                  <button
                    onClick={() => setIndustriesMenuOpen(!industriesMenuOpen)}
                    onMouseEnter={() => setIndustriesMenuOpen(true)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                      isIndustriesActive()
                        ? 'text-white'
                        : ''
                    )}
                    style={
                      isIndustriesActive()
                        ? { backgroundColor: PALETTE.primary, color: 'white' }
                        : { color: PALETTE.textSecondary }
                    }
                  >
                    {item.label}
                    <svg
                      className={cn('w-4 h-4 transition-transform', industriesMenuOpen && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {industriesMenuOpen && (
                    <div
                      className="absolute left-0 mt-2 w-80 rounded-xl shadow-xl py-2 animate-scale-in z-50"
                      style={{ backgroundColor: PALETTE.background, border: `1px solid ${PALETTE.border}` }}
                      onMouseLeave={() => setIndustriesMenuOpen(false)}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
                        <h3 className="text-sm font-semibold" style={{ color: PALETTE.textPrimary }}>Industries We Serve</h3>
                        <p className="text-xs mt-1" style={{ color: PALETTE.textMuted }}>Specialized workforce solutions for emerging sectors</p>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto py-2">
                        {INDUSTRIES_MENU.map((industry) => (
                          <Link
                            key={industry.id}
                            to={industry.path}
                            onClick={() => setIndustriesMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors group"
                            style={{ backgroundColor: 'transparent' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = PALETTE.surface}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: `${industry.color}15` }}
                            >
                              {industry.icon}
                            </span>
                            <span className="text-sm font-medium" style={{ color: PALETTE.textPrimary }}>
                              {industry.name}
                            </span>
                            <svg className="w-4 h-4 ml-auto" style={{ color: PALETTE.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>

                      <div className="px-4 py-3" style={{ borderTop: `1px solid ${PALETTE.border}` }}>
                        <Link
                          to="/industries"
                          onClick={() => setIndustriesMenuOpen(false)}
                          className="flex items-center justify-between text-sm font-medium"
                          style={{ color: PALETTE.accent }}
                        >
                          <span>View All Industries</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={
                    isActive(item.path)
                      ? { backgroundColor: PALETTE.primary, color: 'white' }
                      : { color: PALETTE.textSecondary }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = PALETTE.surface;
                      e.currentTarget.style.color = PALETTE.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = PALETTE.textSecondary;
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: userMenuOpen ? PALETTE.surface : 'transparent' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${PALETTE.primary}, ${PALETTE.secondary})` }}
                  >
                    <span className="text-white text-sm font-medium">{firstName.charAt(0)}</span>
                  </div>
                  <span className="text-sm hidden sm:block" style={{ color: PALETTE.textPrimary }}>{displayName}</span>
                  <svg
                    className={cn('w-4 h-4 transition-transform', userMenuOpen && 'rotate-180')}
                    style={{ color: PALETTE.textMuted }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 animate-scale-in"
                    style={{ backgroundColor: PALETTE.background, border: `1px solid ${PALETTE.border}` }}
                  >
                    <div className="px-4 py-2" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
                      <p className="text-sm font-medium" style={{ color: PALETTE.textPrimary }}>{firstName} {lastName}</p>
                      {organizationName && (
                        <p className="text-xs" style={{ color: PALETTE.accent }}>{organizationName}</p>
                      )}
                      <p className="text-xs" style={{ color: PALETTE.textMuted }}>{userEmail}</p>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize"
                        style={{ backgroundColor: PALETTE.primaryBg, color: PALETTE.primary }}
                      >
                        {userRole.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: PALETTE.textSecondary }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm"
                      style={{ color: '#dc2626' }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: PALETTE.textSecondary }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: PALETTE.accent }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: PALETTE.textSecondary }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 animate-slide-down" style={{ borderTop: `1px solid ${PALETTE.border}` }}>
            {NAV_ITEMS.map((item) => (
              item.hasSubmenu ? (
                <div key={item.id}>
                  <button
                    onClick={() => setMobileIndustriesExpanded(!mobileIndustriesExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium"
                    style={{ color: isIndustriesActive() ? PALETTE.primary : PALETTE.textSecondary }}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={cn('w-4 h-4 transition-transform', mobileIndustriesExpanded && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileIndustriesExpanded && (
                    <div className="pl-4 py-2 space-y-1">
                      {INDUSTRIES_MENU.map((industry) => (
                        <Link
                          key={industry.id}
                          to={industry.path}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileIndustriesExpanded(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          <span>{industry.icon}</span>
                          <span>{industry.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium"
                  style={{
                    color: isActive(item.path) ? PALETTE.primary : PALETTE.textSecondary,
                    backgroundColor: isActive(item.path) ? PALETTE.primaryBg : 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderLight;
