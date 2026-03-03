// ===========================================
// Settings Tab - Municipality Partner Dashboard
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Key,
  UserPlus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Zap,
  FileText
} from 'lucide-react';
import type { MunicipalityPartnerTier, MunicipalityPartner } from '@/types/municipalityPartner';

interface SettingsTabProps {
  partnerId: string;
  tier: MunicipalityPartnerTier;
  partner?: MunicipalityPartner | null;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'coordinator' | 'viewer';
  department?: string;
  lastActive: string;
  status: 'active' | 'pending' | 'disabled';
}

const sampleTeamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'Maria Santos', email: 'msantos@austintexas.gov', role: 'admin', department: 'HR', lastActive: '2025-02-05T10:30:00Z', status: 'active' },
  { id: 'tm-002', name: 'Carlos Martinez', email: 'cmartinez@austintexas.gov', role: 'manager', department: 'Public Works', lastActive: '2025-02-05T09:15:00Z', status: 'active' },
  { id: 'tm-003', name: 'Jennifer Chen', email: 'jchen@austintexas.gov', role: 'coordinator', department: 'Parks & Recreation', lastActive: '2025-02-04T16:45:00Z', status: 'active' },
  { id: 'tm-004', name: 'David Thompson', email: 'dthompson@austintexas.gov', role: 'viewer', department: 'IT', lastActive: '2025-02-03T11:00:00Z', status: 'active' },
  { id: 'tm-005', name: 'Amanda Rodriguez', email: 'arodriguez@austintexas.gov', role: 'coordinator', lastActive: '', status: 'pending' }
];

const roleLabels = {
  admin: { label: 'Admin', color: 'purple', description: 'Full access to all settings and data' },
  manager: { label: 'Manager', color: 'blue', description: 'Manage programs and view reports' },
  coordinator: { label: 'Coordinator', color: 'teal', description: 'Manage participants and daily operations' },
  viewer: { label: 'Viewer', color: 'slate', description: 'View-only access to dashboards' }
};

// Static Tailwind color map for role cards
const roleColorMap: Record<string, { bgLight: string; border: string; text: string }> = {
  purple: { bgLight: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  blue: { bgLight: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  teal: { bgLight: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400' },
  slate: { bgLight: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' },
};

const tierFeatures = {
  starter: {
    name: 'Starter',
    price: '$499/mo',
    participants: 100,
    programs: 5,
    users: 5,
    support: 'Email support',
    features: ['Basic reporting', 'Program management', 'Participant tracking']
  },
  professional: {
    name: 'Professional',
    price: '$999/mo',
    participants: 500,
    programs: 20,
    users: 25,
    support: 'Priority support',
    features: ['Advanced analytics', 'Civil service integration', 'API access', 'Custom reports']
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    participants: 'Unlimited',
    programs: 'Unlimited',
    users: 'Unlimited',
    support: 'Dedicated success manager',
    features: ['White-label options', 'Union partnership tools', 'Federal compliance suite', 'SSO/SAML']
  }
};

export const SettingsTab: React.FC<SettingsTabProps> = ({ partnerId: _partnerId, tier }) => {
  const [activeSection, setActiveSection] = useState<'organization' | 'team' | 'integrations' | 'notifications' | 'billing'>('organization');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currentPlan = tierFeatures[tier];

  const sections = [
    { key: 'organization', label: 'Organization', icon: Building2 },
    { key: 'team', label: 'Team & Access', icon: Users },
    { key: 'integrations', label: 'Integrations', icon: Globe },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'billing', label: 'Billing & Plan', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="text-gray-400 text-sm">Manage your organization, team, and integrations</p>
        </div>
        {hasChanges && (
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as typeof activeSection)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === section.key
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Organization Section */}
      {activeSection === 'organization' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Organization Profile</h3>

            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center">
                <Building2 className="w-10 h-10 text-gray-500" />
              </div>
              <div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 mb-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
                <p className="text-xs text-gray-500">Recommended: 200x200px, PNG or SVG</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="City of Austin"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Municipality Type</label>
                <select
                  defaultValue="city"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="city">City</option>
                  <option value="county">County</option>
                  <option value="township">Township</option>
                  <option value="special_district">Special District</option>
                  <option value="regional_authority">Regional Authority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">State</label>
                <select
                  defaultValue="TX"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="TX">Texas</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  {/* Add more states */}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Population Served</label>
                <input
                  type="text"
                  defaultValue="1,000,000+"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Total Employees</label>
                <input
                  type="number"
                  defaultValue="14500"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fiscal Year End</label>
                <select
                  defaultValue="september"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="december">December</option>
                  <option value="june">June</option>
                  <option value="september">September</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Primary Email
                </label>
                <input
                  type="email"
                  defaultValue="workforce@austintexas.gov"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="(512) 555-0100"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="301 W 2nd Street, Austin, TX 78701"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  defaultValue="https://www.austintexas.gov"
                  onChange={() => setHasChanges(true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Team Members</h3>
                <p className="text-sm text-gray-400">
                  {sampleTeamMembers.length} of {currentPlan.users} seats used
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {sampleTeamMembers.map(member => {
                return (
                  <div key={member.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{member.name}</h4>
                            {member.status === 'pending' && (
                              <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">Pending</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{member.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          {member.department && (
                            <p className="text-sm text-gray-400">{member.department}</p>
                          )}
                          {member.lastActive && (
                            <p className="text-xs text-gray-500">
                              Last active: {new Date(member.lastActive).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <select
                          defaultValue={member.role}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                        >
                          {Object.entries(roleLabels).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                        <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Role Permissions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(roleLabels).map(([key, config]) => (
                <div key={key} className={`p-4 ${roleColorMap[config.color]?.bgLight || 'bg-slate-500/10'} border ${roleColorMap[config.color]?.border || 'border-slate-500/30'} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`w-4 h-4 ${roleColorMap[config.color]?.text || 'text-slate-400'}`} />
                    <h4 className="text-white font-medium">{config.label}</h4>
                  </div>
                  <p className="text-gray-400 text-sm">{config.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Integrations Section */}
      {activeSection === 'integrations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Connected Systems</h3>
            <div className="space-y-4">
              {[
                { name: 'Civil Service System', status: 'connected', description: 'Sync exam data and eligible lists', icon: '🏛️' },
                { name: 'HRIS (PeopleSoft)', status: 'connected', description: 'Employee and position data sync', icon: '👥' },
                { name: 'DOL RAPIDS', status: 'pending', description: 'Registered Apprenticeship reporting', icon: '📋' },
                { name: 'Payroll System', status: 'disconnected', description: 'Stipend and wage verification', icon: '💰' }
              ].map((integration, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{integration.name}</h4>
                      <p className="text-gray-400 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.status === 'connected' ? (
                      <>
                        <span className="flex items-center gap-1 text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Connected
                        </span>
                        <button className="px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600">
                          Configure
                        </button>
                      </>
                    ) : integration.status === 'pending' ? (
                      <>
                        <span className="flex items-center gap-1 text-amber-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Setup Required
                        </span>
                        <button className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600">
                          Complete Setup
                        </button>
                      </>
                    ) : (
                      <button className="px-3 py-1.5 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">API Access</h3>
              {tier !== 'starter' ? (
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Enabled
                </span>
              ) : (
                <span className="text-gray-400 text-sm">Professional tier required</span>
              )}
            </div>
            {tier !== 'starter' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    />
                    <button className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600">
                      <Key className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <a href="#" className="flex items-center gap-1 text-teal-400 text-sm hover:underline">
                  View API Documentation
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Upgrade to Professional tier to access API features.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-medium text-white mb-6">Notification Preferences</h3>
          <div className="space-y-6">
            {[
              { category: 'Program Updates', items: [
                { label: 'New participant applications', email: true, push: true },
                { label: 'Program milestone completions', email: true, push: false },
                { label: 'Supervisor evaluations due', email: true, push: true }
              ]},
              { category: 'Civil Service', items: [
                { label: 'Exam schedule changes', email: true, push: true },
                { label: 'Results posted', email: true, push: true },
                { label: 'List expiration warnings', email: true, push: false }
              ]},
              { category: 'Reports & Compliance', items: [
                { label: 'Scheduled reports ready', email: true, push: false },
                { label: 'Compliance deadline reminders', email: true, push: true },
                { label: 'Data export completions', email: false, push: false }
              ]},
              { category: 'System', items: [
                { label: 'New team member joins', email: true, push: false },
                { label: 'Security alerts', email: true, push: true },
                { label: 'Billing and subscription', email: true, push: false }
              ]}
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-medium mb-3">{section.category}</h4>
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between py-2">
                      <span className="text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.email}
                            onChange={() => setHasChanges(true)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-400">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.push}
                            onChange={() => setHasChanges(true)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-400">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Billing Section */}
      {activeSection === 'billing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-teal-400" />
                  <span className="px-2 py-0.5 rounded text-xs bg-teal-500/30 text-teal-300 uppercase font-medium">
                    {currentPlan.name} Plan
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{currentPlan.price}</h3>
                <p className="text-gray-400">Billed annually</p>
              </div>
              {tier !== 'enterprise' && (
                <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                  Upgrade Plan
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-teal-500/30">
              <div>
                <p className="text-gray-400 text-sm">Participants</p>
                <p className="text-white font-semibold">{currentPlan.participants}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Programs</p>
                <p className="text-white font-semibold">{currentPlan.programs}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Team Members</p>
                <p className="text-white font-semibold">{currentPlan.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Plan Comparison</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(tierFeatures).map(([tierKey, plan]) => (
                <div
                  key={tierKey}
                  className={`p-4 rounded-xl border ${
                    tierKey === tier
                      ? 'bg-teal-500/10 border-teal-500/50'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <h4 className="text-white font-semibold mb-1">{plan.name}</h4>
                  <p className="text-2xl font-bold text-white mb-4">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-teal-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {tierKey === tier ? (
                    <div className="mt-4 text-center text-teal-400 text-sm font-medium">Current Plan</div>
                  ) : tierKey === 'enterprise' && tier !== 'enterprise' ? (
                    <button className="mt-4 w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                      Contact Sales
                    </button>
                  ) : Object.keys(tierFeatures).indexOf(tierKey) > Object.keys(tierFeatures).indexOf(tier) ? (
                    <button className="mt-4 w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm">
                      Upgrade
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Billing History</h3>
            <div className="space-y-3">
              {[
                { date: '2025-02-01', description: 'Professional Plan - February 2025', amount: '$999.00', status: 'paid' },
                { date: '2025-01-01', description: 'Professional Plan - January 2025', amount: '$999.00', status: 'paid' },
                { date: '2024-12-01', description: 'Professional Plan - December 2024', amount: '$999.00', status: 'paid' }
              ].map((invoice, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white">{invoice.description}</p>
                      <p className="text-sm text-gray-400">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">{invoice.amount}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Paid</span>
                    <button className="text-teal-400 hover:text-teal-300 text-sm">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
              <p className="text-gray-400 text-sm">Send an invitation to join your organization</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@city.gov"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none">
                  {Object.entries(roleLabels).map(([key, config]) => (
                    <option key={key} value={key}>{config.label} - {config.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Department (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Public Works"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Invitation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
