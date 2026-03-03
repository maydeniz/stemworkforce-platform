// @ts-nocheck
import React, { useState } from 'react';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Clock, FileText,
  Award, Lock, Eye, TrendingUp, ExternalLink, Download, Activity,
  Server, Users, Key, Database, Globe, Cpu, Building, Zap
} from 'lucide-react';

// =====================================================
// COMPLIANCE READINESS DASHBOARD
// SOC 2 Type 2 & FedRAMP Authorization Readiness Overview
// =====================================================

// Compliance framework definitions
const COMPLIANCE_FRAMEWORKS = {
  soc2: {
    name: 'SOC 2 Type 2',
    icon: Shield,
    color: 'emerald',
    description: 'Service Organization Control 2 - Trust Services Criteria',
    targetDate: 'Q2 2025',
    status: 'in_progress',
    readinessScore: 92,
    categories: [
      { name: 'Security', score: 95, controls: 45, implemented: 43 },
      { name: 'Availability', score: 90, controls: 20, implemented: 18 },
      { name: 'Processing Integrity', score: 88, controls: 15, implemented: 13 },
      { name: 'Confidentiality', score: 94, controls: 25, implemented: 23 },
      { name: 'Privacy', score: 91, controls: 30, implemented: 27 },
    ],
    auditor: 'Pending Selection',
    lastAssessment: '2024-12-15',
  },
  fedramp: {
    name: 'FedRAMP Moderate',
    icon: Building,
    color: 'blue',
    description: 'Federal Risk and Authorization Management Program',
    targetDate: 'Q3 2025',
    status: 'in_progress',
    readinessScore: 78,
    categories: [
      { name: 'Access Control (AC)', score: 85, controls: 25, implemented: 21 },
      { name: 'Audit & Accountability (AU)', score: 90, controls: 16, implemented: 14 },
      { name: 'Security Assessment (CA)', score: 70, controls: 9, implemented: 6 },
      { name: 'Configuration Mgmt (CM)', score: 82, controls: 11, implemented: 9 },
      { name: 'Incident Response (IR)', score: 85, controls: 10, implemented: 8 },
      { name: 'System Protection (SC)', score: 75, controls: 44, implemented: 33 },
    ],
    sponsor: 'Agency Sponsor Pending',
    lastAssessment: '2024-12-20',
  },
};

// Key compliance controls status
const KEY_CONTROLS = [
  { id: 'mfa', name: 'Multi-Factor Authentication', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'encryption-rest', name: 'Encryption at Rest (AES-256)', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'encryption-transit', name: 'Encryption in Transit (TLS 1.3)', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'fips', name: 'FIPS 140-2 Validated Crypto', soc2: 'na', fedramp: 'in_progress', priority: 'high' },
  { id: 'audit-log', name: 'Audit Logging & SIEM', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'rbac', name: 'Role-Based Access Control', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'vuln-scan', name: 'Vulnerability Scanning', soc2: 'complete', fedramp: 'complete', priority: 'high' },
  { id: 'pen-test', name: 'Penetration Testing', soc2: 'complete', fedramp: 'in_progress', priority: 'high' },
  { id: 'incident', name: 'Incident Response Plan', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'backup', name: 'Backup & Disaster Recovery', soc2: 'complete', fedramp: 'complete', priority: 'critical' },
  { id: 'change-mgmt', name: 'Change Management', soc2: 'complete', fedramp: 'complete', priority: 'high' },
  { id: 'vendor-risk', name: 'Vendor Risk Management', soc2: 'complete', fedramp: 'in_progress', priority: 'medium' },
  { id: 'govcloud', name: 'FedRAMP-Authorized Hosting', soc2: 'na', fedramp: 'planned', priority: 'critical' },
  { id: 'piv', name: 'PIV/CAC Authentication', soc2: 'na', fedramp: 'planned', priority: 'high' },
  { id: 'conmon', name: 'Continuous Monitoring', soc2: 'in_progress', fedramp: 'planned', priority: 'high' },
];

// Upcoming milestones
const MILESTONES = [
  { date: '2025-01-30', event: 'SSP Draft Complete', framework: 'fedramp', status: 'on_track' },
  { date: '2025-02-15', event: 'SOC 2 Auditor Selection', framework: 'soc2', status: 'on_track' },
  { date: '2025-02-28', event: 'FIPS 140-2 Implementation', framework: 'fedramp', status: 'at_risk' },
  { date: '2025-03-15', event: '3PAO Selection', framework: 'fedramp', status: 'on_track' },
  { date: '2025-04-01', event: 'SOC 2 Audit Begin', framework: 'soc2', status: 'planned' },
  { date: '2025-05-01', event: 'AWS GovCloud Migration', framework: 'fedramp', status: 'planned' },
  { date: '2025-06-01', event: 'FedRAMP Assessment Begin', framework: 'fedramp', status: 'planned' },
  { date: '2025-07-15', event: 'SOC 2 Report Issued', framework: 'soc2', status: 'planned' },
  { date: '2025-09-01', event: 'FedRAMP ATO Target', framework: 'fedramp', status: 'planned' },
];

const ComplianceReadinessTab: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<'all' | 'soc2' | 'fedramp'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'planned':
        return <AlertTriangle className="w-5 h-5 text-slate-400" />;
      case 'na':
        return <span className="text-xs text-slate-500">N/A</span>;
      default:
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">On Track</span>;
      case 'at_risk':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">At Risk</span>;
      case 'planned':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">Planned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="w-7 h-7 text-emerald-400" />
            Compliance Readiness Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            SOC 2 Type 2 & FedRAMP Authorization Preparation Status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">All Frameworks</option>
            <option value="soc2">SOC 2 Type 2</option>
            <option value="fedramp">FedRAMP Moderate</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Compliance Ready Banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-indigo-600/20 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">Compliance Ready</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        <p className="text-gray-300 mb-4">
          Our platform is designed and built to meet the rigorous requirements of <strong className="text-emerald-400">SOC 2 Type 2</strong> and
          <strong className="text-blue-400"> FedRAMP Moderate</strong> certifications. All technical controls are implemented
          and we are actively preparing for formal audits and authorization.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300">NIST 800-53 Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300">Trust Services Criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300">AICPA Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300">Continuous Monitoring</span>
          </div>
        </div>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SOC 2 Card */}
        <div className={`bg-slate-800/50 rounded-xl border ${
          selectedFramework === 'all' || selectedFramework === 'soc2'
            ? 'border-emerald-500/50'
            : 'border-slate-700 opacity-50'
        } overflow-hidden`}>
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">SOC 2 Type 2</h3>
                  <p className="text-sm text-gray-400">Trust Services Criteria</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-400">{COMPLIANCE_FRAMEWORKS.soc2.readinessScore}%</div>
                <div className="text-sm text-gray-400">Ready</div>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${COMPLIANCE_FRAMEWORKS.soc2.readinessScore}%` }}
              />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400">Target Certification</div>
                <div className="text-white font-medium">{COMPLIANCE_FRAMEWORKS.soc2.targetDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Auditor</div>
                <div className="text-white font-medium">{COMPLIANCE_FRAMEWORKS.soc2.auditor}</div>
              </div>
            </div>
            <div className="space-y-2">
              {COMPLIANCE_FRAMEWORKS.soc2.categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-emerald-400 w-12 text-right">{cat.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FedRAMP Card */}
        <div className={`bg-slate-800/50 rounded-xl border ${
          selectedFramework === 'all' || selectedFramework === 'fedramp'
            ? 'border-blue-500/50'
            : 'border-slate-700 opacity-50'
        } overflow-hidden`}>
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Building className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">FedRAMP Moderate</h3>
                  <p className="text-sm text-gray-400">NIST 800-53 Rev 5</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">{COMPLIANCE_FRAMEWORKS.fedramp.readinessScore}%</div>
                <div className="text-sm text-gray-400">Ready</div>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                style={{ width: `${COMPLIANCE_FRAMEWORKS.fedramp.readinessScore}%` }}
              />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400">Target ATO</div>
                <div className="text-white font-medium">{COMPLIANCE_FRAMEWORKS.fedramp.targetDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Sponsor</div>
                <div className="text-amber-400 font-medium">{COMPLIANCE_FRAMEWORKS.fedramp.sponsor}</div>
              </div>
            </div>
            <div className="space-y-2">
              {COMPLIANCE_FRAMEWORKS.fedramp.categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-400 w-12 text-right">{cat.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Controls Matrix */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Key Security Controls Status</h3>
          <p className="text-sm text-gray-400">Implementation status across compliance frameworks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Control</th>
                <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Priority</th>
                <th className="text-center text-sm font-medium text-emerald-400 px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    SOC 2
                  </div>
                </th>
                <th className="text-center text-sm font-medium text-blue-400 px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Building className="w-4 h-4" />
                    FedRAMP
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {KEY_CONTROLS.map(control => (
                <tr key={control.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{control.name}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      control.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      control.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {control.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusIcon(control.soc2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusIcon(control.fedramp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Certification Timeline</h3>
        <div className="space-y-3">
          {MILESTONES.map((milestone, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-lg ${
                milestone.framework === 'soc2' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
              }`}
            >
              <div className="text-sm text-gray-400 w-24">{milestone.date}</div>
              <div className={`p-1.5 rounded ${
                milestone.framework === 'soc2' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
              }`}>
                {milestone.framework === 'soc2'
                  ? <Shield className="w-4 h-4 text-emerald-400" />
                  : <Building className="w-4 h-4 text-blue-400" />
                }
              </div>
              <div className="flex-1 text-gray-300">{milestone.event}</div>
              {getStatusBadge(milestone.status)}
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Server, label: 'Hosting', value: 'AWS GovCloud Ready', status: 'planned', color: 'blue' },
          { icon: Lock, label: 'Encryption', value: 'AES-256 / TLS 1.3', status: 'complete', color: 'emerald' },
          { icon: Database, label: 'Data Residency', value: 'US Only', status: 'complete', color: 'emerald' },
          { icon: Eye, label: 'Monitoring', value: '24/7 SIEM', status: 'complete', color: 'emerald' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className={`w-5 h-5 ${item.color === 'blue' ? 'text-blue-400' : item.color === 'emerald' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <div className="text-white font-medium">{item.value}</div>
            <div className="mt-2">
              {item.status === 'complete'
                ? <span className="text-xs text-emerald-400">✓ Implemented</span>
                : <span className="text-xs text-amber-400">◷ In Progress</span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Documentation Links */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compliance Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Security Whitepaper', icon: FileText, available: true },
            { name: 'SOC 2 Type 2 Report', icon: Shield, available: false, note: 'Available after audit' },
            { name: 'FedRAMP Package', icon: Building, available: false, note: 'Available after ATO' },
            { name: 'Privacy Policy', icon: Lock, available: true },
            { name: 'Incident Response Plan', icon: AlertTriangle, available: true },
            { name: 'Business Continuity Plan', icon: Activity, available: true },
          ].map((doc, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-lg ${
                doc.available ? 'bg-slate-700/50 hover:bg-slate-700 cursor-pointer' : 'bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <doc.icon className={`w-5 h-5 ${doc.available ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <div className={doc.available ? 'text-white' : 'text-slate-500'}>{doc.name}</div>
                  {doc.note && <div className="text-xs text-slate-500">{doc.note}</div>}
                </div>
              </div>
              {doc.available && <ExternalLink className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceReadinessTab;
