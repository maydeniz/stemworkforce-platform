// ===========================================
// Header Component with Expandable Menu Support
// ===========================================

import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { useOnClickOutside } from '@/hooks';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/common';

// Industries data for the dropdown
const INDUSTRIES_MENU = [
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', icon: '🤖', color: '#8b5cf6', path: '/industries/artificial-intelligence' },
  { id: 'quantum-computing', name: 'Quantum Computing', icon: '🔬', color: '#ec4899', path: '/industries/quantum-computing' },
  { id: 'nuclear-energy', name: 'Nuclear Energy', icon: '⚛️', color: '#22c55e', path: '/industries/nuclear-energy' },
  { id: 'biotechnology', name: 'Biotechnology', icon: '🧬', color: '#10b981', path: '/industries/biotechnology' },
  { id: 'healthcare', name: 'Healthcare & Medical Technology', icon: '🏥', color: '#14b8a6', path: '/industries/healthcare' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️', color: '#ef4444', path: '/industries/cybersecurity' },
  { id: 'aerospace', name: 'Aerospace & Space', icon: '🚀', color: '#06b6d4', path: '/industries/aerospace' },
  { id: 'advanced-manufacturing', name: 'Advanced Manufacturing', icon: '🏭', color: '#64748b', path: '/industries/advanced-manufacturing' },
  { id: 'semiconductor', name: 'Semiconductor', icon: '💻', color: '#3b82f6', path: '/industries/semiconductor' },
  { id: 'robotics', name: 'Robotics & Automation', icon: '🦾', color: '#f59e0b', path: '/industries/robotics' },
  { id: 'clean-energy', name: 'Clean Energy', icon: '🌱', color: '#84cc16', path: '/industries/clean-energy' },
];

// Navigation items with support for submenus
const NAV_ITEMS_WITH_MENUS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'intern-hub', label: 'Jobs & Internships', path: '/jobs' },
  {
    id: 'industries',
    label: 'Industries',
    path: '/industries',
    hasSubmenu: true,
    submenu: INDUSTRIES_MENU
  },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'service-providers', label: 'Find Experts', path: '/service-providers' },
  { id: 'workforce-map', label: 'Workforce Map', path: '/map' },
  { id: 'events', label: 'Events', path: '/events' },
  { id: 'training-portal', label: 'Training', path: '/training' },
  { id: 'partners', label: 'For Partners', path: '/partners' },
];

export const Header: React.FC = () => {
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

  // Get user display info from Supabase user metadata
  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.first_name || userMetadata.name?.split(' ')[0] || 'User';
  const lastName = userMetadata.last_name || userMetadata.name?.split(' ').slice(1).join(' ') || '';
  const userEmail = user?.email || '';
  const userRole = userMetadata.role || 'member';
  const organizationName = userMetadata.organization_name;

  // Display name logic - show org name for partners
  const isPartner = userRole.startsWith('partner_') || userRole === 'educator';
  const displayName = isPartner && organizationName ? organizationName : firstName;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              STEM<span className="text-blue-500">Workforce</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_ITEMS_WITH_MENUS.map((item) => (
              item.hasSubmenu ? (
                // Industries dropdown menu
                <div key={item.id} className="relative" ref={industriesMenuRef}>
                  <button
                    onClick={() => setIndustriesMenuOpen(!industriesMenuOpen)}
                    onMouseEnter={() => setIndustriesMenuOpen(true)}
                    aria-expanded={industriesMenuOpen}
                    aria-haspopup="true"
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                      isIndustriesActive()
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
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

                  {/* Industries dropdown */}
                  {industriesMenuOpen && (
                    <div
                      className="absolute left-0 mt-2 w-80 bg-dark-surface border border-dark-border rounded-xl shadow-2xl py-2 animate-scale-in z-50"
                      onMouseLeave={() => setIndustriesMenuOpen(false)}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-dark-border">
                        <h3 className="text-sm font-semibold text-white">Industries We Serve</h3>
                        <p className="text-xs text-gray-400 mt-1">Specialized workforce solutions for emerging sectors</p>
                      </div>

                      {/* Industries Grid */}
                      <div className="max-h-[400px] overflow-y-auto py-2">
                        {INDUSTRIES_MENU.map((industry) => (
                          <Link
                            key={industry.id}
                            to={industry.path}
                            onClick={() => setIndustriesMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
                          >
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: `${industry.color}20` }}
                            >
                              {industry.icon}
                            </span>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                {industry.name}
                              </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-dark-border">
                        <Link
                          to="/industries"
                          onClick={() => setIndustriesMenuOpen(false)}
                          className="flex items-center justify-between text-sm text-blue-400 hover:text-blue-300 transition-colors"
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
                  role="menuitem"
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
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
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {firstName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-white hidden sm:block">{displayName}</span>
                  <svg
                    className={cn('w-4 h-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-xl py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-dark-border">
                      <p className="text-sm font-medium text-white">{firstName} {lastName}</p>
                      {organizationName && (
                        <p className="text-xs text-yellow-400">{organizationName}</p>
                      )}
                      <p className="text-xs text-gray-400">{userEmail}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">
                        {userRole.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {/* Admin link - only show for admin users */}
                    {['admin', 'super_admin', 'SUPER_ADMIN', 'PLATFORM_ADMIN', 'BILLING_ADMIN', 'CONTENT_ADMIN', 'SECURITY_ADMIN', 'COMPLIANCE_ADMIN', 'SUPPORT_ADMIN'].includes(userRole) && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-dark-border" />
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
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
          <nav className="lg:hidden py-4 border-t border-dark-border animate-slide-down">
            {NAV_ITEMS_WITH_MENUS.map((item) => (
              item.hasSubmenu ? (
                <div key={item.id}>
                  {/* Industries expandable section */}
                  <button
                    onClick={() => setMobileIndustriesExpanded(!mobileIndustriesExpanded)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium',
                      isIndustriesActive()
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
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

                  {/* Mobile Industries List */}
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
                          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <span>{industry.icon}</span>
                          <span>{industry.name}</span>
                        </Link>
                      ))}
                      <Link
                        to="/industries"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileIndustriesExpanded(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5"
                      >
                        <span>→</span>
                        <span>View All Industries</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium',
                    isActive(item.path)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
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

export default Header;
