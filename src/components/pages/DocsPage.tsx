import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  Search,
  ChevronRight,
  Code,
  Zap,
  Shield,
  Users,
  Settings,
  Database,
  Globe,
  FileText,
  ExternalLink,
  Terminal,
  Layers,
  Key,
  Webhook,
} from 'lucide-react';

const DOC_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    color: 'emerald',
    description: 'Quick start guides and platform overview',
    articles: [
      { title: 'Platform Overview', path: '/docs/overview', time: '5 min' },
      { title: 'Creating Your Account', path: '/docs/account-setup', time: '3 min' },
      { title: 'Organization Setup', path: '/docs/org-setup', time: '8 min' },
      { title: 'Understanding User Roles', path: '/docs/user-roles', time: '6 min' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code,
    color: 'blue',
    description: 'REST API endpoints and authentication',
    articles: [
      { title: 'API Authentication', path: '/docs/api/auth', time: '10 min' },
      { title: 'Jobs API', path: '/docs/api/jobs', time: '15 min' },
      { title: 'Events API', path: '/docs/api/events', time: '12 min' },
      { title: 'Candidates API', path: '/docs/api/candidates', time: '15 min' },
      { title: 'Webhooks', path: '/docs/api/webhooks', time: '8 min' },
      { title: 'Rate Limits', path: '/docs/api/rate-limits', time: '5 min' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Layers,
    color: 'purple',
    description: 'Connect with external systems and tools',
    articles: [
      { title: 'ATS Integration Guide', path: '/docs/integrations/ats', time: '20 min' },
      { title: 'SSO Configuration (SAML)', path: '/docs/integrations/sso', time: '15 min' },
      { title: 'HRIS Connections', path: '/docs/integrations/hris', time: '12 min' },
      { title: 'Learning Management Systems', path: '/docs/integrations/lms', time: '10 min' },
    ],
  },
  {
    id: 'for-employers',
    title: 'For Employers',
    icon: Users,
    color: 'orange',
    description: 'Posting jobs, managing candidates, and analytics',
    articles: [
      { title: 'Posting Your First Job', path: '/docs/employers/post-job', time: '5 min' },
      { title: 'Candidate Management', path: '/docs/employers/candidates', time: '10 min' },
      { title: 'Analytics Dashboard', path: '/docs/employers/analytics', time: '8 min' },
      { title: 'Team Collaboration', path: '/docs/employers/teams', time: '6 min' },
    ],
  },
  {
    id: 'for-partners',
    title: 'For Partners',
    icon: Globe,
    color: 'teal',
    description: 'Partner portal, program management, and reporting',
    articles: [
      { title: 'Partner Onboarding', path: '/docs/partners/onboarding', time: '10 min' },
      { title: 'Program Configuration', path: '/docs/partners/programs', time: '15 min' },
      { title: 'Participant Tracking', path: '/docs/partners/tracking', time: '12 min' },
      { title: 'Outcome Reporting', path: '/docs/partners/reporting', time: '8 min' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: Shield,
    color: 'red',
    description: 'Security practices, compliance, and data protection',
    articles: [
      { title: 'Security Overview', path: '/docs/security/overview', time: '8 min' },
      { title: 'SOC 2 Compliance', path: '/docs/security/soc2', time: '10 min' },
      { title: 'FedRAMP Authorization', path: '/docs/security/fedramp', time: '12 min' },
      { title: 'Data Privacy (GDPR/CCPA)', path: '/docs/security/privacy', time: '10 min' },
      { title: 'Incident Response', path: '/docs/security/incident-response', time: '6 min' },
    ],
  },
  {
    id: 'admin',
    title: 'Administration',
    icon: Settings,
    color: 'slate',
    description: 'Platform administration and configuration',
    articles: [
      { title: 'Admin Dashboard Guide', path: '/docs/admin/dashboard', time: '10 min' },
      { title: 'User Management', path: '/docs/admin/users', time: '8 min' },
      { title: 'Billing & Subscriptions', path: '/docs/admin/billing', time: '6 min' },
      { title: 'Audit Logs', path: '/docs/admin/audit-logs', time: '5 min' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Analytics',
    icon: Database,
    color: 'cyan',
    description: 'Data exports, analytics, and reporting',
    articles: [
      { title: 'Analytics Overview', path: '/docs/data/analytics', time: '8 min' },
      { title: 'Custom Reports', path: '/docs/data/reports', time: '10 min' },
      { title: 'Data Export', path: '/docs/data/export', time: '6 min' },
      { title: 'Workforce Insights API', path: '/docs/data/insights-api', time: '12 min' },
    ],
  },
];

const QUICK_LINKS = [
  { label: 'API Keys', icon: Key, path: '/docs/api/auth#keys' },
  { label: 'Webhooks', icon: Webhook, path: '/docs/api/webhooks' },
  { label: 'SDKs', icon: Terminal, path: '/docs/sdks' },
  { label: 'Changelog', icon: FileText, path: '/docs/changelog' },
];

function getColorClasses(color: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  };
  return colors[color] || colors.slate;
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = DOC_CATEGORIES.filter((category) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.articles.some((article) => article.title.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Book size={24} className="text-purple-400" />
            </div>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-full">
              Documentation
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Learn how to integrate with the STEM Workforce platform, manage your organization, and leverage our APIs to build powerful workforce solutions.
          </p>

          {/* Search */}
          <div className="max-w-xl">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Documentation Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const colors = getColorClasses(category.color);
            return (
              <div
                key={category.id}
                className={`bg-slate-900 border ${colors.border} rounded-xl p-6 hover:border-slate-600 transition-colors`}
              >
                <div className={`inline-flex p-2 ${colors.bg} rounded-lg mb-4`}>
                  <category.icon size={24} className={colors.text} />
                </div>
                <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{category.description}</p>

                <div className="space-y-2">
                  {category.articles.slice(0, 4).map((article) => (
                    <Link
                      key={article.path}
                      to={article.path}
                      className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-slate-800/50 group transition-colors"
                    >
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {article.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{article.time}</span>
                        <ChevronRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>

                {category.articles.length > 4 && (
                  <Link
                    to={`/docs/${category.id}`}
                    className={`mt-4 inline-flex items-center gap-1 text-sm ${colors.text} hover:underline`}
                  >
                    View all {category.articles.length} articles
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* API Quick Start */}
      <div className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Start: API Integration</h2>
              <p className="text-slate-400 mb-6">
                Get started with the STEM Workforce API in minutes. Use your API key to authenticate and start making requests.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/docs/api/auth"
                  className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                >
                  Get API Keys
                </Link>
                <Link
                  to="/docs/api/jobs"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                >
                  Explore Endpoints
                </Link>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-slate-500 mb-3">
                <Terminal size={16} />
                <span>cURL Example</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto">
{`curl -X GET "https://api.stemworkforce.gov/v1/jobs" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* SDKs & Resources */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">SDKs & Libraries</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'JavaScript/TypeScript', version: 'v2.1.0', icon: '🟨' },
            { name: 'Python', version: 'v1.8.0', icon: '🐍' },
            { name: 'Ruby', version: 'v1.4.0', icon: '💎' },
            { name: 'Go', version: 'v1.2.0', icon: '🔵' },
          ].map((sdk) => (
            <div
              key={sdk.name}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{sdk.icon}</span>
                <div>
                  <div className="font-medium">{sdk.name}</div>
                  <div className="text-xs text-slate-500">{sdk.version}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-purple-400 mt-3">
                View on GitHub <ExternalLink size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/help"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              Help Center
            </Link>
            <a
              href="mailto:support@stemworkforce.gov"
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
