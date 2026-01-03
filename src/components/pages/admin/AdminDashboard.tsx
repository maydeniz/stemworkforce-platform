import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Users, Building2, Briefcase, FileText, Shield, DollarSign,
  TrendingUp, AlertTriangle, Settings, Activity, BarChart3,
  UserCheck, Clock, Eye, Download, Filter, Search, RefreshCw,
  ChevronRight, ArrowUpRight, ArrowDownRight, CheckCircle2,
  XCircle, AlertCircle, Bell, Menu, LogOut, Home,
  Lock, Heart, ClipboardCheck, Megaphone, FileEdit, UserCog,
  ChevronDown, ShoppingBag, Package, Star, CreditCard, Zap,
  Store, UserCheck as UserVerified, Receipt, Wallet,
  Sun, Moon, Palette
} from 'lucide-react';

// Import new admin tabs
import SecurityCenterTab from './tabs/SecurityCenterTab';
import PrivacyComplianceTab from './tabs/PrivacyComplianceTab';
import HIPAAComplianceTab from './tabs/HIPAAComplianceTab';
import SOC2AuditTab from './tabs/SOC2AuditTab';
import CommunicationsTab from './tabs/CommunicationsTab';
import ContentTab from './tabs/ContentTab';
import OrganizationsTab from './tabs/OrganizationsTab';
import BillingTab from './tabs/BillingTab';
import StaffManagementTab from './tabs/StaffManagementTab';
import MarketplaceProvidersTab from './tabs/MarketplaceProvidersTab';
import SettingsTab from './tabs/SettingsTab';

// ===========================================
// ADMIN DASHBOARD - COMPREHENSIVE VERSION
// ===========================================

// Menu section interface
interface MenuSection {
  id: string;
  label: string;
  icon: any;
  defaultExpanded: boolean;
  items: { id: string; label: string; icon: any; badge?: number | string }[];
}

// Stakeholder role types for menu filtering
type StakeholderRole =
  | 'SUPER_ADMIN'           // Full access to everything
  | 'PLATFORM_ADMIN'        // Full system access without role management
  | 'SECURITY_ADMIN'        // Security & compliance focused
  | 'PRIVACY_OFFICER'       // GDPR/CCPA/HIPAA compliance
  | 'BILLING_ADMIN'         // Subscriptions, revenue, payouts
  | 'MARKETPLACE_ADMIN'     // Marketplace operations
  | 'CONTENT_ADMIN'         // Content, communications
  | 'PARTNER_ADMIN'         // Organization management
  | 'SUPPORT_ADMIN'         // User support, basic ops
  | 'ANALYST'               // Read-only analytics
  | 'AUDITOR';              // Audit logs only

// Menu visibility per role
const ROLE_MENU_ACCESS: Record<StakeholderRole, string[]> = {
  SUPER_ADMIN: ['*'], // All sections
  PLATFORM_ADMIN: ['core', 'marketplace', 'compliance', 'platform', 'billing', 'system'],
  SECURITY_ADMIN: ['core', 'compliance', 'platform'],
  PRIVACY_OFFICER: ['compliance'],
  BILLING_ADMIN: ['billing', 'marketplace'],
  MARKETPLACE_ADMIN: ['marketplace', 'core'],
  CONTENT_ADMIN: ['platform'],
  PARTNER_ADMIN: ['core'],
  SUPPORT_ADMIN: ['core'],
  ANALYST: ['platform'],
  AUDITOR: ['platform'],
};

// Menu items per role (more granular control)
const ROLE_MENU_ITEMS: Record<StakeholderRole, string[]> = {
  SUPER_ADMIN: ['*'],
  PLATFORM_ADMIN: ['*'],
  SECURITY_ADMIN: ['overview', 'staff', 'users', 'security', 'privacy', 'hipaa', 'soc2', 'compliance', 'audit'],
  PRIVACY_OFFICER: ['privacy', 'hipaa', 'security'],
  BILLING_ADMIN: ['overview', 'billing', 'revenue', 'marketplace-payouts', 'marketplace-orders'],
  MARKETPLACE_ADMIN: ['overview', 'service-providers', 'services-catalog', 'marketplace-orders', 'marketplace-reviews', 'marketplace-payouts', 'marketplace-overview'],
  CONTENT_ADMIN: ['communications', 'content'],
  PARTNER_ADMIN: ['overview', 'organizations', 'users'],
  SUPPORT_ADMIN: ['overview', 'users', 'organizations', 'applications'],
  ANALYST: ['overview', 'analytics', 'audit'],
  AUDITOR: ['audit', 'security', 'compliance'],
};

// Theme-aware color classes
const getThemeClasses = (isDark: boolean) => ({
  // Backgrounds
  bgPrimary: isDark ? 'bg-slate-950' : 'bg-slate-50',
  bgSecondary: isDark ? 'bg-slate-900' : 'bg-white',
  bgTertiary: isDark ? 'bg-slate-800' : 'bg-slate-100',
  bgHover: isDark ? 'bg-slate-800' : 'bg-slate-200',
  bgAccent: isDark ? 'bg-slate-800/50' : 'bg-slate-100/80',

  // Borders
  borderPrimary: isDark ? 'border-slate-800' : 'border-slate-200',
  borderSecondary: isDark ? 'border-slate-700' : 'border-slate-300',

  // Text
  textPrimary: isDark ? 'text-white' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-500',

  // Inputs
  inputBg: isDark ? 'bg-slate-900' : 'bg-white',
  inputBorder: isDark ? 'border-slate-700' : 'border-slate-300',

  // Cards
  cardBg: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm',
  cardHover: isDark ? 'hover:border-slate-700' : 'hover:border-slate-300 hover:shadow-md',

  // Header
  headerBg: isDark ? 'bg-slate-950/80' : 'bg-white/80',

  // Sidebar
  sidebarBg: isDark ? 'bg-slate-900' : 'bg-white',
  sidebarItemActive: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
  sidebarItemHover: isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900',
  sidebarText: isDark ? 'text-slate-400' : 'text-slate-600',
  sidebarTextActive: isDark ? 'text-white' : 'text-slate-900',
  sidebarSectionActive: isDark ? 'bg-slate-800/50 text-white' : 'bg-slate-100 text-slate-900',
  sidebarSectionHover: isDark ? 'hover:bg-slate-800/30 hover:text-slate-300' : 'hover:bg-slate-50 hover:text-slate-700',

  // Button variants
  buttonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  buttonSecondary: isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900',
  buttonGhost: isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',

  // Status colors (unchanged for consistency)
  statusSuccess: 'bg-emerald-500/20 text-emerald-400',
  statusWarning: 'bg-amber-500/20 text-amber-400',
  statusError: 'bg-red-500/20 text-red-400',
  statusInfo: 'bg-blue-500/20 text-blue-400',
});

const AdminDashboard = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const tc = getThemeClasses(isDark); // Theme classes

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<StakeholderRole>('SUPER_ADMIN'); // Default for demo

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    core: true,
    marketplace: false,
    compliance: false,
    platform: false,
    billing: false,
    system: false,
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAdminUser();
  }, []);

  const fetchAdminUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*, user_role_assignments(*, admin_roles(*))')
        .eq('id', user.id)
        .single();
      setAdminUser(profile);

      // Map admin role to stakeholder role
      const roleName = profile?.user_role_assignments?.[0]?.admin_roles?.name;
      if (roleName && Object.keys(ROLE_MENU_ACCESS).includes(roleName)) {
        setUserRole(roleName as StakeholderRole);
      }
    }
  };

  // Helper to check if user has access to a section
  const hasAccessToSection = (sectionId: string): boolean => {
    const access = ROLE_MENU_ACCESS[userRole];
    return access.includes('*') || access.includes(sectionId);
  };

  // Helper to check if user has access to a menu item
  const hasAccessToItem = (itemId: string): boolean => {
    const items = ROLE_MENU_ITEMS[userRole];
    return items.includes('*') || items.includes(itemId);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts from various tables
      const [users, orgs, jobs, applications, subscriptions] = await Promise.all([
        supabase.from('users').select('id, created_at, role', { count: 'exact' }),
        supabase.from('organizations').select('id, created_at, verified', { count: 'exact' }),
        supabase.from('jobs').select('id, created_at, status', { count: 'exact' }),
        supabase.from('applications').select('id, created_at, status', { count: 'exact' }),
        supabase.from('subscriptions').select('id, status, current_period_end', { count: 'exact' })
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalOrganizations: orgs.count || 0,
        totalJobs: jobs.count || 0,
        totalApplications: applications.count || 0,
        activeSubscriptions: subscriptions.data?.filter(s => s.status === 'active').length || 0,
        recentUsers: users.data?.slice(0, 10) || [],
        recentJobs: jobs.data?.slice(0, 10) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  // All menu sections (unfiltered)
  const allMenuSections: MenuSection[] = [
    {
      id: 'core',
      label: 'Core Operations',
      icon: Zap,
      defaultExpanded: true,
      items: [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'staff', label: 'Staff & Roles', icon: UserCog },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'organizations', label: 'Organizations', icon: Building2 },
        { id: 'jobs', label: 'Job Management', icon: Briefcase },
        { id: 'applications', label: 'Applications', icon: FileText },
      ],
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      defaultExpanded: false,
      items: [
        { id: 'marketplace-overview', label: 'Overview', icon: ShoppingBag },
        { id: 'service-providers', label: 'Service Providers', icon: UserVerified, badge: 'New' },
        { id: 'services-catalog', label: 'Services Catalog', icon: Package },
        { id: 'marketplace-orders', label: 'Orders', icon: Receipt },
        { id: 'marketplace-reviews', label: 'Reviews & Ratings', icon: Star },
        { id: 'marketplace-payouts', label: 'Provider Payouts', icon: Wallet },
      ],
    },
    {
      id: 'compliance',
      label: 'Compliance & Security',
      icon: Shield,
      defaultExpanded: false,
      items: [
        { id: 'security', label: 'Security Center', icon: Lock },
        { id: 'privacy', label: 'Privacy & Compliance', icon: Eye },
        { id: 'hipaa', label: 'HIPAA Compliance', icon: Heart },
        { id: 'soc2', label: 'SOC 2 & Audit', icon: ClipboardCheck },
        { id: 'compliance', label: 'OFCCP Compliance', icon: Shield },
      ],
    },
    {
      id: 'platform',
      label: 'Platform Management',
      icon: FileEdit,
      defaultExpanded: false,
      items: [
        { id: 'communications', label: 'Communications', icon: Megaphone },
        { id: 'content', label: 'Content', icon: FileEdit },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'audit', label: 'Audit Logs', icon: Activity },
      ],
    },
    {
      id: 'billing',
      label: 'Billing & Revenue',
      icon: DollarSign,
      defaultExpanded: false,
      items: [
        { id: 'billing', label: 'Subscriptions', icon: CreditCard },
        { id: 'revenue', label: 'Revenue Metrics', icon: TrendingUp },
      ],
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: Settings,
      defaultExpanded: false,
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  // Filter menu sections based on user role
  const menuSections = useMemo(() => {
    return allMenuSections
      .filter(section => hasAccessToSection(section.id))
      .map(section => ({
        ...section,
        items: section.items.filter(item => hasAccessToItem(item.id)),
      }))
      .filter(section => section.items.length > 0);
  }, [userRole]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Auto-expand section when its item is selected
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Find which section contains this tab and expand it
    const section = menuSections.find(s => s.items.some(item => item.id === tabId));
    if (section && !expandedSections[section.id]) {
      setExpandedSections(prev => ({ ...prev, [section.id]: true }));
    }
  };

  // Available roles for demo switcher
  const DEMO_ROLES: { role: StakeholderRole; label: string; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', color: 'emerald' },
    { role: 'PLATFORM_ADMIN', label: 'Platform Admin', color: 'blue' },
    { role: 'SECURITY_ADMIN', label: 'Security Admin', color: 'red' },
    { role: 'PRIVACY_OFFICER', label: 'Privacy Officer', color: 'violet' },
    { role: 'BILLING_ADMIN', label: 'Billing Admin', color: 'amber' },
    { role: 'MARKETPLACE_ADMIN', label: 'Marketplace Admin', color: 'cyan' },
    { role: 'CONTENT_ADMIN', label: 'Content Admin', color: 'pink' },
    { role: 'PARTNER_ADMIN', label: 'Partner Admin', color: 'orange' },
    { role: 'SUPPORT_ADMIN', label: 'Support Admin', color: 'lime' },
    { role: 'ANALYST', label: 'Analyst', color: 'sky' },
    { role: 'AUDITOR', label: 'Auditor', color: 'slate' },
  ];

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  return (
    <div className={`min-h-screen ${tc.bgPrimary} ${tc.textPrimary} flex transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${tc.sidebarBg} border-r ${tc.borderPrimary} transition-all duration-300 flex flex-col`}>
        <div className={`p-4 border-b ${tc.borderPrimary}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">
              SW
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`font-bold text-lg ${tc.textPrimary}`}>STEMWorkforce</h1>
                <p className={`text-xs ${tc.textSecondary}`}>Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  expandedSections[section.id]
                    ? tc.sidebarSectionActive
                    : `${tc.sidebarText} ${tc.sidebarSectionHover}`
                }`}
              >
                <section.icon size={18} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{section.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
              </button>

              {/* Section Items */}
              {sidebarOpen && expandedSections[section.id] && (
                <div className={`mt-1 ml-2 pl-3 border-l ${tc.borderPrimary} space-y-0.5`}>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                        activeTab === item.id
                          ? tc.sidebarItemActive
                          : `${tc.sidebarText} ${tc.sidebarItemHover}`
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                          item.badge === 'New'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Collapsed mode - show only icons */}
              {!sidebarOpen && expandedSections[section.id] && (
                <div className="mt-1 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-center p-2 rounded-lg transition-all ${
                        activeTab === item.id
                          ? tc.sidebarItemActive
                          : `${tc.sidebarText} ${tc.sidebarItemHover}`
                      }`}
                      title={item.label}
                    >
                      <item.icon size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={`p-4 border-t ${tc.borderPrimary}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${tc.sidebarText} ${tc.sidebarItemHover} transition-all`}
          >
            <Menu size={20} />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className={`sticky top-0 z-10 ${tc.headerBg} backdrop-blur-xl border-b ${tc.borderPrimary} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold capitalize ${tc.textPrimary}`}>{activeTab.replace('-', ' ')}</h2>
              <p className={`text-sm ${tc.textSecondary}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Role Switcher (Demo) */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${tc.buttonSecondary} transition-colors text-sm`}
                >
                  <Palette size={16} />
                  <span className="hidden md:inline">{DEMO_ROLES.find(r => r.role === userRole)?.label}</span>
                  <ChevronDown size={14} className={`transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
                </button>
                {showRoleSwitcher && (
                  <div className={`absolute right-0 mt-2 w-56 ${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl shadow-lg py-2 z-50`}>
                    <p className={`px-3 py-1 text-xs font-medium ${tc.textSecondary} uppercase`}>Switch Role (Demo)</p>
                    {DEMO_ROLES.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => { setUserRole(r.role); setShowRoleSwitcher(false); }}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                          userRole === r.role ? tc.sidebarItemActive : `${tc.textPrimary} ${tc.sidebarItemHover}`
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full bg-${r.color}-500`} />
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className={`relative p-2 rounded-lg ${tc.buttonSecondary} transition-colors`}>
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
              </button>

              {/* User Profile */}
              <div className={`flex items-center gap-3 pl-3 border-l ${tc.borderSecondary}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm text-white">
                  {adminUser?.first_name?.[0]}{adminUser?.last_name?.[0]}
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${tc.textPrimary}`}>{adminUser?.first_name} {adminUser?.last_name}</p>
                  <p className={`text-xs ${tc.textSecondary}`}>{adminUser?.user_role_assignments?.[0]?.admin_roles?.display_name || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Core Operations */}
          {activeTab === 'overview' && <OverviewTab stats={stats} loading={loading} onRefresh={fetchDashboardData} />}
          {activeTab === 'staff' && <StaffManagementTab />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'organizations' && <OrganizationsTab />}
          {activeTab === 'jobs' && <JobManagementTab />}
          {activeTab === 'applications' && <ApplicationManagementTab />}

          {/* Marketplace */}
          {activeTab === 'marketplace-overview' && <MarketplaceOverviewTab />}
          {activeTab === 'service-providers' && <MarketplaceProvidersTab />}
          {activeTab === 'services-catalog' && <ServicesCatalogTab />}
          {activeTab === 'marketplace-orders' && <MarketplaceOrdersTab />}
          {activeTab === 'marketplace-reviews' && <MarketplaceReviewsTab />}
          {activeTab === 'marketplace-payouts' && <MarketplacePayoutsTab />}

          {/* Compliance & Security */}
          {activeTab === 'security' && <SecurityCenterTab />}
          {activeTab === 'privacy' && <PrivacyComplianceTab />}
          {activeTab === 'hipaa' && <HIPAAComplianceTab />}
          {activeTab === 'soc2' && <SOC2AuditTab />}
          {activeTab === 'compliance' && <ComplianceTab />}

          {/* Platform Management */}
          {activeTab === 'communications' && <CommunicationsTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'audit' && <AuditLogsTab />}

          {/* Billing & Revenue */}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'revenue' && <RevenueMetricsTab />}

          {/* System Settings */}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

// ===========================================
// OVERVIEW TAB
// ===========================================

const OverviewTab = ({ stats, loading, onRefresh }: { stats: any; loading: boolean; onRefresh: () => void }) => {
  const { isDark } = useTheme();
  const tc = getThemeClasses(isDark);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, change: '+12%', positive: true, color: 'emerald' },
    { label: 'Organizations', value: stats?.totalOrganizations || 0, icon: Building2, change: '+8%', positive: true, color: 'blue' },
    { label: 'Active Jobs', value: stats?.totalJobs || 0, icon: Briefcase, change: '+23%', positive: true, color: 'violet' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: FileText, change: '+45%', positive: true, color: 'amber' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: DollarSign, change: '+5%', positive: true, color: 'cyan' },
    { label: 'MRR', value: '$12,450', icon: TrendingUp, change: '+18%', positive: true, color: 'rose' },
  ];

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className={`flex items-center gap-2 px-4 py-2 ${tc.buttonSecondary} rounded-lg transition-colors text-sm`}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5 ${tc.cardHover} transition-colors`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon size={22} className={`text-${stat.color}-400`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-2xl font-bold ${tc.textPrimary}`}>{loading ? '...' : stat.value.toLocaleString()}</p>
              <p className={`text-sm ${tc.textSecondary} mt-1`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
          <h3 className={`font-semibold mb-4 ${tc.textPrimary}`}>Platform Activity</h3>
          <div className="h-64 flex items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className={`text-xs ${tc.textMuted}`}>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
          <h3 className={`font-semibold mb-4 ${tc.textPrimary}`}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registered', user: 'john@example.com', time: '2 min ago', icon: UserCheck, color: 'emerald' },
              { action: 'Job posting approved', user: 'TechCorp Inc.', time: '15 min ago', icon: CheckCircle2, color: 'blue' },
              { action: 'Application submitted', user: 'Software Engineer', time: '32 min ago', icon: FileText, color: 'violet' },
              { action: 'Organization verified', user: 'QuantumLabs', time: '1 hour ago', icon: Shield, color: 'amber' },
              { action: 'Subscription upgraded', user: 'BioTech Solutions', time: '2 hours ago', icon: TrendingUp, color: 'cyan' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${tc.bgAccent} ${tc.sidebarItemHover} transition-colors`}>
                <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                  <item.icon size={16} className={`text-${item.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${tc.textPrimary}`}>{item.action}</p>
                  <p className={`text-xs ${tc.textSecondary}`}>{item.user}</p>
                </div>
                <span className={`text-xs ${tc.textMuted}`}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${tc.bgSecondary} border ${tc.borderPrimary} rounded-xl p-5`}>
        <h3 className={`font-semibold mb-4 ${tc.textPrimary}`}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add User', icon: Users, color: 'emerald' },
            { label: 'Create Job', icon: Briefcase, color: 'blue' },
            { label: 'Generate Report', icon: BarChart3, color: 'violet' },
            { label: 'System Settings', icon: Settings, color: 'amber' },
          ].map((action, i) => (
            <button
              key={i}
              className={`flex items-center gap-3 p-4 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20 hover:bg-${action.color}-500/20 transition-colors`}
            >
              <action.icon size={20} className={`text-${action.color}-400`} />
              <span className={`font-medium text-sm ${tc.textPrimary}`}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// USER MANAGEMENT TAB
// ===========================================

const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('users')
      .select(`
        *,
        organizations(name),
        user_role_assignments(*, admin_roles(*))
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    const { data, error } = await query;
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSuspendUser = async (userId) => {
    // Add audit log
    await supabase.from('audit_logs').insert({
      event_type: 'USER_SUSPENDED',
      event_category: 'admin',
      resource_type: 'user',
      resource_id: userId,
      action: 'suspend'
    });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Roles</option>
            <option value="job_seeker">Job Seekers</option>
            <option value="partner">Employers</option>
            <option value="educator">Educators</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium">
          <Users size={18} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'partner' ? 'bg-blue-500/20 text-blue-400' :
                        user.role === 'educator' ? 'bg-violet-500/20 text-violet-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {user.organizations?.name || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedUser(user); setShowModal(true); }}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-amber-400">
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-2xl">
                  {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedUser.first_name} {selectedUser.last_name}</h4>
                  <p className="text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="font-medium capitalize mt-1">{selectedUser.role}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Clearance Level</p>
                  <p className="font-medium capitalize mt-1">{selectedUser.clearance_level || 'None'}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Citizenship</p>
                  <p className="font-medium capitalize mt-1">{selectedUser.citizenship || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-xl">
                  <p className="text-sm text-slate-400">Veteran Status</p>
                  <p className="font-medium capitalize mt-1">{selectedUser.veteran_status || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                  Edit User
                </button>
                <button className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                  View Activity
                </button>
                <button className="py-2.5 px-4 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg font-medium transition-colors">
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// JOB MANAGEMENT TAB
// ===========================================

const JobManagementTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    let query = supabase
      .from('jobs')
      .select(`*, organizations(name)`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error) setJobs(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium">
          <Download size={18} />
          Export Jobs
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Job Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Applications</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Posted</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading jobs...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No jobs found</td></tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-slate-400">{job.location || 'Remote'}</p>
                  </td>
                  <td className="px-4 py-4 text-sm">{job.organizations?.name || 'Unknown'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      job.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      job.status === 'closed' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">{job.application_count || 0}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-emerald-400">
                        <CheckCircle2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// APPLICATION MANAGEMENT TAB
// ===========================================

const ApplicationManagementTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(`*, jobs(title, organizations(name)), users(first_name, last_name, email)`)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error) setApplications(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Recent Applications</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Applicant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Job</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Applied</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading applications...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No applications found</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{app.users?.first_name} {app.users?.last_name}</p>
                    <p className="text-sm text-slate-400">{app.users?.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm">{app.jobs?.title}</td>
                  <td className="px-4 py-4 text-sm">{app.jobs?.organizations?.name}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                      app.status === 'interviewing' ? 'bg-blue-500/20 text-blue-400' :
                      app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// COMPLIANCE TAB
// ===========================================

const ComplianceTab = () => {
  return (
    <div className="space-y-6">
      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/20">
              <Shield size={22} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold">OFCCP Compliance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">EEO-1 Report Status</span>
              <span className="text-emerald-400">Current</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">AAP Data Complete</span>
              <span className="text-emerald-400">98%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Self-ID Collection</span>
              <span className="text-emerald-400">Active</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors">
            Generate EEO-1 Report
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/20">
              <Shield size={22} className="text-blue-400" />
            </div>
            <h3 className="font-semibold">Security Clearances</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending Verifications</span>
              <span className="text-amber-400">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Clearances</span>
              <span className="text-emerald-400">156</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Expiring (30 days)</span>
              <span className="text-red-400">8</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
            Verification Queue
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-violet-500/20">
              <Shield size={22} className="text-violet-400" />
            </div>
            <h3 className="font-semibold">HIPAA Compliance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">BAA Agreements</span>
              <span className="text-emerald-400">24 Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">PHI Access Logs</span>
              <span className="text-emerald-400">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Last Audit</span>
              <span className="text-slate-300">Dec 15, 2024</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors">
            View Audit Logs
          </button>
        </div>
      </div>

      {/* Self-Identification Data */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Self-Identification Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-2xl font-bold">67%</p>
            <p className="text-sm text-slate-400">Gender Disclosed</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-2xl font-bold">62%</p>
            <p className="text-sm text-slate-400">Race/Ethnicity Disclosed</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-2xl font-bold">45%</p>
            <p className="text-sm text-slate-400">Veteran Status Disclosed</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-2xl font-bold">38%</p>
            <p className="text-sm text-slate-400">Disability Status Disclosed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// ANALYTICS TAB
// ===========================================

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-end gap-2">
            {[30, 45, 55, 70, 65, 85, 90, 95, 110, 125, 140, 155].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-sm"
                  style={{ height: `${(value / 155) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Application Funnel</h3>
          <div className="space-y-4">
            {[
              { stage: 'Applications Submitted', count: 1250, percent: 100 },
              { stage: 'Screened', count: 875, percent: 70 },
              { stage: 'Interviewed', count: 312, percent: 25 },
              { stage: 'Offers Extended', count: 89, percent: 7 },
              { stage: 'Hired', count: 67, percent: 5.4 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{item.stage}</span>
                  <span className="text-sm text-slate-400">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top Industries</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Semiconductor', jobs: 145, color: 'emerald' },
            { name: 'AI/ML', jobs: 132, color: 'blue' },
            { name: 'Healthcare', jobs: 98, color: 'violet' },
            { name: 'Aerospace', jobs: 87, color: 'amber' },
            { name: 'Quantum', jobs: 65, color: 'cyan' },
          ].map((industry, i) => (
            <div key={i} className={`p-4 bg-${industry.color}-500/10 border border-${industry.color}-500/20 rounded-xl`}>
              <p className="text-sm text-slate-400">{industry.name}</p>
              <p className="text-xl font-bold mt-1">{industry.jobs}</p>
              <p className="text-xs text-slate-500">active jobs</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// AUDIT LOGS TAB
// ===========================================

const AuditLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (!error) setLogs(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm">
            <option>All Events</option>
            <option>User Events</option>
            <option>Admin Events</option>
            <option>Security Events</option>
            <option>System Events</option>
          </select>
          <select className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export Logs
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No audit logs found</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{log.event_type}</p>
                    <p className="text-xs text-slate-500">{log.action}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.actor_email || 'System'}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{log.resource_type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      log.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===========================================
// MARKETPLACE OVERVIEW TAB
// ===========================================

const MarketplaceOverviewTab = () => {
  const stats = [
    { label: 'Active Providers', value: 156, icon: UserCheck, change: '+12%', color: 'emerald' },
    { label: 'Services Listed', value: 423, icon: Package, change: '+8%', color: 'blue' },
    { label: 'Total Orders', value: 1247, icon: Receipt, change: '+23%', color: 'violet' },
    { label: 'Revenue (MTD)', value: '$48,320', icon: DollarSign, change: '+18%', color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-500/20`}>
                <stat.icon size={22} className={`text-${stat.color}-400`} />
              </div>
              <span className="text-sm text-emerald-400">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
            <UserCheck size={20} className="text-emerald-400" />
            <span className="font-medium text-sm">Approve Providers</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
            <Package size={20} className="text-blue-400" />
            <span className="font-medium text-sm">Review Services</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-colors">
            <Star size={20} className="text-violet-400" />
            <span className="font-medium text-sm">Moderate Reviews</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
            <Wallet size={20} className="text-amber-400" />
            <span className="font-medium text-sm">Process Payouts</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recent Marketplace Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New provider application', user: 'Dr. Sarah Chen', time: '5 min ago', icon: UserCheck, color: 'emerald' },
            { action: 'Service booking completed', user: 'Career Coaching - 1hr', time: '15 min ago', icon: Receipt, color: 'blue' },
            { action: 'New review submitted', user: '5 stars - Leadership Training', time: '32 min ago', icon: Star, color: 'amber' },
            { action: 'Payout processed', user: 'Marcus Johnson - $450', time: '1 hour ago', icon: Wallet, color: 'violet' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                <item.icon size={16} className={`text-${item.color}-400`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.action}</p>
                <p className="text-xs text-slate-400">{item.user}</p>
              </div>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// SERVICES CATALOG TAB (Placeholder)
// ===========================================

const ServicesCatalogTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Services Catalog</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium">
          <Package size={16} />
          Add Service Category
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-slate-600 mb-4" />
        <h4 className="text-lg font-medium mb-2">Services Catalog Management</h4>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Manage service categories, pricing tiers, and featured services available on the marketplace.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// MARKETPLACE ORDERS TAB (Placeholder)
// ===========================================

const MarketplaceOrdersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Marketplace Orders</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
          <Download size={16} />
          Export Orders
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <Receipt size={48} className="mx-auto text-slate-600 mb-4" />
        <h4 className="text-lg font-medium mb-2">Order Management</h4>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Track and manage all service bookings, transactions, and order fulfillment across the marketplace.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// MARKETPLACE REVIEWS TAB (Placeholder)
// ===========================================

const MarketplaceReviewsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
            <option>All Reviews</option>
            <option>Pending Moderation</option>
            <option>Flagged</option>
          </select>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <Star size={48} className="mx-auto text-slate-600 mb-4" />
        <h4 className="text-lg font-medium mb-2">Review Moderation</h4>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Moderate user reviews, respond to flagged content, and manage provider ratings across the platform.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// MARKETPLACE PAYOUTS TAB (Placeholder)
// ===========================================

const MarketplacePayoutsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Provider Payouts</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium">
          <Wallet size={16} />
          Process Payouts
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <Wallet size={48} className="mx-auto text-slate-600 mb-4" />
        <h4 className="text-lg font-medium mb-2">Payout Management</h4>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Manage provider earnings, process payouts, and track payment history for marketplace transactions.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// REVENUE METRICS TAB (Placeholder)
// ===========================================

const RevenueMetricsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Revenue Metrics</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold mt-1">$124,500</p>
          <p className="text-sm text-emerald-400 mt-1">+15% from last month</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Annual Recurring Revenue</p>
          <p className="text-2xl font-bold mt-1">$1.49M</p>
          <p className="text-sm text-emerald-400 mt-1">+28% YoY</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Average Revenue Per User</p>
          <p className="text-2xl font-bold mt-1">$89.50</p>
          <p className="text-sm text-emerald-400 mt-1">+5% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
