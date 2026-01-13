import { useState } from 'react';
import {
  Globe, Lock, Link2, Palette, Code, Database,
  Shield, Zap, Wrench, ChevronRight, Save,
  Eye, EyeOff, Copy, RefreshCw, Plus, Trash2, ExternalLink,
  Bell, Mail, Clock, Key, Building2, AlertTriangle,
  CheckCircle2, Server, Image, Cookie, FileText,
  Sun, Moon, Check
} from 'lucide-react';
import { useTheme } from '@/contexts';
import { PALETTE_LIST, PaletteId } from '@/config/colorPalettes';

// ===========================================
// SETTINGS TAB - COMPREHENSIVE VERSION
// ===========================================

interface SettingsSection {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'general', label: 'General', icon: Globe, description: 'Platform name, timezone, and basic settings' },
  { id: 'security', label: 'Security & Access', icon: Lock, description: 'Password policies, MFA, and access controls' },
  { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Third-party services and connections' },
  { id: 'branding', label: 'Branding', icon: Palette, description: 'Theme, logos, and customization' },
  { id: 'developer', label: 'Developer', icon: Code, description: 'API keys, webhooks, and developer tools' },
  { id: 'privacy', label: 'Data & Privacy', icon: Database, description: 'Data retention and privacy settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email templates and alerts' },
  { id: 'performance', label: 'Performance', icon: Zap, description: 'Caching and optimization' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'System status and maintenance mode' },
];

const SettingsTab = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'branding':
        return <BrandingSettings />;
      case 'developer':
        return <DeveloperSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'performance':
        return <PerformanceSettings />;
      case 'maintenance':
        return <MaintenanceSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-200px)]">
      {/* Settings Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 sticky top-6">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <section.icon size={18} />
                <span className="text-sm font-medium">{section.label}</span>
                {activeSection === section.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold capitalize">
              {settingsSections.find(s => s.id === activeSection)?.label}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {settingsSections.find(s => s.id === activeSection)?.description}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400">
            <CheckCircle2 size={18} />
            <span className="text-sm">Settings saved successfully!</span>
          </div>
        )}

        {/* Section Content */}
        {renderSection()}
      </div>
    </div>
  );
};

// ===========================================
// GENERAL SETTINGS
// ===========================================

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      {/* Platform Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-emerald-400" />
          Platform Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Platform Name</label>
            <input
              type="text"
              defaultValue="STEMWorkforce"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Support Email</label>
            <input
              type="email"
              defaultValue="support@stemworkforce.com"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Default Timezone</label>
            <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Default Language</label>
            <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feature Availability */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-400" />
          Feature Availability
        </h4>
        <div className="space-y-4">
          {[
            { name: 'Job Seeker Registration', description: 'Allow new job seekers to register', enabled: true },
            { name: 'Employer Registration', description: 'Allow new employers to register', enabled: true },
            { name: 'Service Provider Applications', description: 'Accept new marketplace provider applications', enabled: true },
            { name: 'Public Job Listings', description: 'Show job listings without login', enabled: false },
          ].map((feature, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{feature.name}</p>
                <p className="text-xs text-slate-400">{feature.description}</p>
              </div>
              <ToggleSwitch defaultChecked={feature.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Session Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-blue-400" />
          Session Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Remember Me Duration (days)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// SECURITY SETTINGS
// ===========================================

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Key size={18} className="text-emerald-400" />
          Password Policy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Minimum Length</label>
            <input
              type="number"
              defaultValue="12"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Password Expiry (days)</label>
            <input
              type="number"
              defaultValue="90"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { name: 'Require Uppercase', enabled: true },
            { name: 'Require Lowercase', enabled: true },
            { name: 'Require Numbers', enabled: true },
            { name: 'Require Special Characters', enabled: true },
            { name: 'Prevent Password Reuse (last 5)', enabled: true },
          ].map((rule, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm">{rule.name}</span>
              <ToggleSwitch defaultChecked={rule.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Factor Authentication */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-violet-400" />
          Multi-Factor Authentication
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Require MFA for Admins</p>
              <p className="text-xs text-slate-400">All admin accounts must use MFA</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Require MFA for Employers</p>
              <p className="text-xs text-slate-400">Employer accounts must use MFA</p>
            </div>
            <ToggleSwitch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Allow SMS Verification</p>
              <p className="text-xs text-slate-400">Enable SMS-based 2FA codes</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Allow Authenticator Apps</p>
              <p className="text-xs text-slate-400">Enable TOTP authenticator apps</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
        </div>
      </div>

      {/* IP Restrictions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Server size={18} className="text-amber-400" />
          IP Restrictions
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Enable IP Allowlist for Admin Access</p>
              <p className="text-xs text-slate-400">Only allow admin access from specific IPs</p>
            </div>
            <ToggleSwitch defaultChecked={false} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Allowed IP Addresses (one per line)</label>
            <textarea
              rows={4}
              placeholder="192.168.1.0/24&#10;10.0.0.1"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Account Lockout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Lock size={18} className="text-red-400" />
          Account Lockout
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Max Failed Login Attempts</label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Lockout Duration (minutes)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// INTEGRATIONS SETTINGS
// ===========================================

const IntegrationsSettings = () => {
  const integrations = [
    { name: 'Stripe', description: 'Payment processing', status: 'connected', icon: '💳' },
    { name: 'SendGrid', description: 'Email delivery', status: 'connected', icon: '📧' },
    { name: 'AWS S3', description: 'File storage', status: 'connected', icon: '☁️' },
    { name: 'Slack', description: 'Team notifications', status: 'disconnected', icon: '💬' },
    { name: 'LinkedIn', description: 'OAuth & profile import', status: 'connected', icon: '💼' },
    { name: 'Google Workspace', description: 'SSO & calendar', status: 'disconnected', icon: '🔐' },
  ];

  return (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Link2 size={18} className="text-emerald-400" />
          Connected Services
        </h4>
        <div className="space-y-3">
          {integrations.map((integration, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-sm">{integration.name}</p>
                  <p className="text-xs text-slate-400">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  integration.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-600/20 text-slate-400'
                }`}>
                  {integration.status}
                </span>
                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors">
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4">Stripe Configuration</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Publishable Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="pk_live_••••••••••••••••"
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-mono"
                readOnly
              />
              <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Eye size={16} />
              </button>
              <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Secret Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                defaultValue="sk_live_xxxxxxxxxxxx"
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-mono"
                readOnly
              />
              <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Eye size={16} />
              </button>
              <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Test Mode</p>
              <p className="text-xs text-slate-400">Use Stripe test environment</p>
            </div>
            <ToggleSwitch defaultChecked={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// BRANDING SETTINGS
// ===========================================

const BrandingSettings = () => {
  const { paletteId, setPalette, palette, resetToDefault } = useTheme();

  return (
    <div className="space-y-6">
      {/* Color Palette Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Palette size={18} className="text-violet-400" />
            Color Palette
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Current:</span>
            <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded text-xs font-medium">
              {palette.name}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              palette.wcagLevel === 'AAA'
                ? 'bg-emerald-500/20 text-emerald-400'
                : palette.wcagLevel === 'AA+'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-slate-600/20 text-slate-400'
            }`}>
              WCAG {palette.wcagLevel}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-2">
          Choose a color palette that matches your brand. Each palette is designed by industry experts for specific use cases.
        </p>
        <p className="text-xs text-slate-500 mb-4">
          <strong>Recommended by:</strong> {palette.expertRecommendedBy.join(', ')}
        </p>

        {/* Dark Palettes */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Moon size={14} /> Dark Themes
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PALETTE_LIST.filter(p => p.mode === 'dark').map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id as PaletteId)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  paletteId === p.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {paletteId === p.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
                <div className="flex gap-1 mb-3">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.colors.primary }} title="Primary" />
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.colors.secondary }} title="Secondary" />
                  <div className="w-8 h-8 rounded-lg border border-slate-600" style={{ backgroundColor: p.colors.bgPrimary }} title="Background" />
                  <div className="w-8 h-8 rounded-lg border border-slate-600" style={{ backgroundColor: p.colors.bgSecondary }} title="Surface" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm">{p.name}</h5>
                  <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">{p.wcagLevel}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.bestFor.slice(0, 2).map((use, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">{use}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Light Palettes */}
        <div>
          <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Sun size={14} /> Light Themes
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PALETTE_LIST.filter(p => p.mode === 'light').map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id as PaletteId)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  paletteId === p.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {paletteId === p.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
                <div className="flex gap-1 mb-3">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.colors.primary }} title="Primary" />
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.colors.secondary }} title="Secondary" />
                  <div className="w-8 h-8 rounded-lg border border-slate-600" style={{ backgroundColor: p.colors.bgPrimary }} title="Background" />
                  <div className="w-8 h-8 rounded-lg border border-slate-600" style={{ backgroundColor: p.colors.bgSecondary }} title="Surface" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm">{p.name}</h5>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    p.wcagLevel === 'AAA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{p.wcagLevel}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.bestFor.slice(0, 2).map((use, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">{use}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
          >
            Reset to Default Theme
          </button>
        </div>
      </div>

      {/* Current Palette Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Eye size={18} className="text-emerald-400" />
          Current Palette Preview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { name: 'Primary', color: palette.colors.primary },
            { name: 'Secondary', color: palette.colors.secondary },
            { name: 'Success', color: palette.colors.success },
            { name: 'Warning', color: palette.colors.warning },
            { name: 'Error', color: palette.colors.error },
            { name: 'Info', color: palette.colors.info },
            { name: 'Background', color: palette.colors.bgPrimary },
            { name: 'Text', color: palette.colors.textPrimary },
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="w-full h-12 rounded-lg mb-2 border border-slate-700"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs text-slate-400">{item.name}</p>
              <p className="text-xs font-mono text-slate-500">{item.color}</p>
            </div>
          ))}
        </div>

        {/* Live UI Preview */}
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: palette.colors.bgPrimary,
            border: `1px solid ${palette.colors.borderPrimary}`,
          }}
        >
          <h5 className="text-sm font-medium mb-3" style={{ color: palette.colors.textSecondary }}>
            Live UI Preview
          </h5>
          <div
            className="p-4 rounded-lg mb-3"
            style={{
              backgroundColor: palette.colors.bgSecondary,
              border: `1px solid ${palette.colors.borderPrimary}`,
            }}
          >
            <h6 className="font-semibold mb-1" style={{ color: palette.colors.textPrimary }}>
              Sample Card
            </h6>
            <p className="text-sm mb-3" style={{ color: palette.colors.textSecondary }}>
              This is how text and cards appear with the {palette.name} theme.
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: palette.colors.primary, color: palette.colors.textInverse }}
              >
                Primary
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: palette.colors.bgTertiary,
                  color: palette.colors.textPrimary,
                  border: `1px solid ${palette.colors.borderPrimary}`,
                }}
              >
                Secondary
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${palette.colors.success}20`, color: palette.colors.success }}>Success</span>
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${palette.colors.warning}20`, color: palette.colors.warning }}>Warning</span>
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${palette.colors.error}20`, color: palette.colors.error }}>Error</span>
            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${palette.colors.info}20`, color: palette.colors.info }}>Info</span>
          </div>
        </div>
      </div>

      {/* Logo & Images */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Image size={18} className="text-emerald-400" />
          Logo & Images
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Primary Logo</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                SW
              </div>
              <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, or JPG (max. 2MB)</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Favicon</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold mx-auto mb-3">
                S
              </div>
              <p className="text-sm text-slate-400">Click to upload favicon</p>
              <p className="text-xs text-slate-500 mt-1">ICO or PNG (32x32 or 64x64)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Globe size={18} className="text-blue-400" />
          Custom Domain
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Custom Domain</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="careers.yourcompany.com"
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
              <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors">
                Verify
              </button>
            </div>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-400 flex items-center gap-2">
              <AlertTriangle size={16} />
              Add a CNAME record pointing to: stemworkforce.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// DEVELOPER SETTINGS
// ===========================================

const DeveloperSettings = () => {
  const [showKey, setShowKey] = useState(false);

  const apiKeys = [
    { name: 'Production API Key', key: 'sk_prod_xxxx...xxxx', created: '2024-12-01', lastUsed: '2 hours ago' },
    { name: 'Development API Key', key: 'sk_dev_xxxx...xxxx', created: '2024-11-15', lastUsed: '1 day ago' },
  ];

  const webhooks = [
    { url: 'https://api.example.com/webhooks/stemworkforce', events: ['user.created', 'job.posted'], status: 'active' },
    { url: 'https://slack.example.com/hooks/jobs', events: ['application.submitted'], status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Key size={18} className="text-emerald-400" />
            API Keys
          </h4>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-medium transition-colors">
            <Plus size={14} />
            Create Key
          </button>
        </div>
        <div className="space-y-3">
          {apiKeys.map((apiKey, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{apiKey.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <code className="text-xs font-mono text-slate-400">
                    {showKey ? 'sk_prod_AbCdEf123456789' : apiKey.key}
                  </code>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Last used: {apiKey.lastUsed}</p>
                  <p className="text-xs text-slate-500">Created: {apiKey.created}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
                <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Link2 size={18} className="text-violet-400" />
            Webhooks
          </h4>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-medium transition-colors">
            <Plus size={14} />
            Add Webhook
          </button>
        </div>
        <div className="space-y-3">
          {webhooks.map((webhook, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-mono text-slate-300">{webhook.url}</code>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                  {webhook.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {webhook.events.map((event, j) => (
                  <span key={j} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                    {event}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-400" />
          Rate Limiting
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Requests per Minute</label>
            <input
              type="number"
              defaultValue="60"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Requests per Hour</label>
            <input
              type="number"
              defaultValue="1000"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <FileText size={18} className="text-blue-400" />
          Documentation
        </h4>
        <div className="flex gap-3">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <ExternalLink size={16} />
            API Reference
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <ExternalLink size={16} />
            SDK Downloads
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <ExternalLink size={16} />
            Postman Collection
          </a>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// PRIVACY SETTINGS
// ===========================================

const PrivacySettings = () => {
  return (
    <div className="space-y-6">
      {/* Data Retention */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Database size={18} className="text-emerald-400" />
          Data Retention
        </h4>
        <div className="space-y-4">
          {[
            { type: 'Audit Logs', period: '2 years', action: 'Archive' },
            { type: 'User Sessions', period: '30 days', action: 'Delete' },
            { type: 'Failed Login Attempts', period: '90 days', action: 'Delete' },
            { type: 'Deleted User Data', period: '30 days', action: 'Purge' },
            { type: 'Application Records', period: '5 years', action: 'Archive' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{item.type}</p>
                <p className="text-xs text-slate-400">Retention: {item.period} • Action: {item.action}</p>
              </div>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cookie Consent */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Cookie size={18} className="text-amber-400" />
          Cookie Consent
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Enable Cookie Banner</p>
              <p className="text-xs text-slate-400">Show cookie consent banner to visitors</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Analytics Cookies</p>
              <p className="text-xs text-slate-400">Allow analytics tracking cookies</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Marketing Cookies</p>
              <p className="text-xs text-slate-400">Allow marketing and advertising cookies</p>
            </div>
            <ToggleSwitch defaultChecked={false} />
          </div>
        </div>
      </div>

      {/* GDPR / CCPA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-blue-400" />
          Privacy Compliance
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Enable GDPR Mode</p>
              <p className="text-xs text-slate-400">Apply GDPR requirements for EU users</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Enable CCPA Mode</p>
              <p className="text-xs text-slate-400">Apply CCPA requirements for California users</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Data Export Requests</p>
              <p className="text-xs text-slate-400">Allow users to request data export</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Right to Deletion</p>
              <p className="text-xs text-slate-400">Allow users to request account deletion</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// NOTIFICATION SETTINGS
// ===========================================

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      {/* Email Templates */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Mail size={18} className="text-emerald-400" />
            Email Templates
          </h4>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-medium transition-colors">
            <Plus size={14} />
            New Template
          </button>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Welcome Email', status: 'active', lastModified: '2 days ago' },
            { name: 'Password Reset', status: 'active', lastModified: '1 week ago' },
            { name: 'Application Received', status: 'active', lastModified: '3 days ago' },
            { name: 'Interview Scheduled', status: 'active', lastModified: '1 day ago' },
            { name: 'Offer Letter', status: 'draft', lastModified: '5 days ago' },
          ].map((template, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <div>
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-slate-400">Modified {template.lastModified}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${
                template.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {template.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Bell size={18} className="text-violet-400" />
          Admin Notifications
        </h4>
        <div className="space-y-4">
          {[
            { name: 'New User Registration', email: true, slack: true },
            { name: 'New Job Posted', email: true, slack: true },
            { name: 'Application Submitted', email: false, slack: true },
            { name: 'Payment Received', email: true, slack: false },
            { name: 'Security Alert', email: true, slack: true },
          ].map((notification, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm">{notification.name}</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input type="checkbox" defaultChecked={notification.email} className="rounded border-slate-600 bg-slate-800" />
                  Email
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input type="checkbox" defaultChecked={notification.slack} className="rounded border-slate-600 bg-slate-800" />
                  Slack
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digest Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-blue-400" />
          Email Digests
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Admin Digest Frequency</label>
            <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Digest Send Time</label>
            <input
              type="time"
              defaultValue="09:00"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// PERFORMANCE SETTINGS
// ===========================================

const PerformanceSettings = () => {
  return (
    <div className="space-y-6">
      {/* Caching */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-emerald-400" />
          Caching
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Enable Redis Cache</p>
              <p className="text-xs text-slate-400">Use Redis for session and data caching</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">CDN Caching</p>
              <p className="text-xs text-slate-400">Cache static assets on CDN</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Cache TTL (seconds)</label>
              <input
                type="number"
                defaultValue="3600"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Static Asset TTL (hours)</label>
              <input
                type="number"
                defaultValue="24"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw size={16} />
            Clear All Caches
          </button>
        </div>
      </div>

      {/* Image Optimization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Image size={18} className="text-blue-400" />
          Image Optimization
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Auto-compress Uploads</p>
              <p className="text-xs text-slate-400">Automatically compress uploaded images</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">WebP Conversion</p>
              <p className="text-xs text-slate-400">Convert images to WebP format</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Lazy Loading</p>
              <p className="text-xs text-slate-400">Load images as they enter viewport</p>
            </div>
            <ToggleSwitch defaultChecked={true} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Max Image Size (MB)</label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAINTENANCE SETTINGS
// ===========================================

const MaintenanceSettings = () => {
  return (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Wrench size={18} className="text-amber-400" />
          Maintenance Mode
        </h4>
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-400" />
                <div>
                  <p className="font-medium text-amber-400">Maintenance Mode</p>
                  <p className="text-xs text-amber-400/70">When enabled, only admins can access the platform</p>
                </div>
              </div>
              <ToggleSwitch defaultChecked={false} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Maintenance Message</label>
            <textarea
              rows={3}
              defaultValue="We're performing scheduled maintenance. Please check back soon!"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Scheduled Start</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Scheduled End</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Server size={18} className="text-emerald-400" />
          System Status
        </h4>
        <div className="space-y-3">
          {[
            { name: 'Web Server', status: 'operational', uptime: '99.99%' },
            { name: 'Database', status: 'operational', uptime: '99.98%' },
            { name: 'Redis Cache', status: 'operational', uptime: '100%' },
            { name: 'Email Service', status: 'operational', uptime: '99.95%' },
            { name: 'File Storage', status: 'operational', uptime: '100%' },
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">Uptime: {service.uptime}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Maintenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Database size={18} className="text-violet-400" />
          Database Maintenance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors">
            <p className="font-medium text-sm">Run Vacuum</p>
            <p className="text-xs text-slate-400 mt-1">Optimize database storage</p>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors">
            <p className="font-medium text-sm">Rebuild Indexes</p>
            <p className="text-xs text-slate-400 mt-1">Improve query performance</p>
          </button>
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors">
            <p className="font-medium text-sm">Create Backup</p>
            <p className="text-xs text-slate-400 mt-1">Manual database backup</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// TOGGLE SWITCH COMPONENT
// ===========================================

const ToggleSwitch = ({ defaultChecked = false }: { defaultChecked?: boolean }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
    </label>
  );
};

export default SettingsTab;
