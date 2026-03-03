// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Clock, FileText,
  Server, Lock, Eye, RefreshCw, Download, ExternalLink, ChevronRight,
  Activity, Database, Globe, Key, Users, Cpu, HardDrive, Network,
  Building, Award, TrendingUp, AlertCircle, Info
} from 'lucide-react';

// =====================================================
// FedRAMP READINESS TAB
// Comprehensive FedRAMP authorization preparation dashboard
// =====================================================

// FedRAMP Control Families (NIST 800-53)
const CONTROL_FAMILIES = [
  { id: 'AC', name: 'Access Control', controls: 25, description: 'User access management, least privilege, separation of duties' },
  { id: 'AT', name: 'Awareness & Training', controls: 6, description: 'Security awareness, role-based training, phishing prevention' },
  { id: 'AU', name: 'Audit & Accountability', controls: 16, description: 'Audit logging, log retention, event correlation' },
  { id: 'CA', name: 'Assessment & Authorization', controls: 9, description: 'Security assessments, penetration testing, POA&M' },
  { id: 'CM', name: 'Configuration Management', controls: 11, description: 'Baseline configs, change control, software inventory' },
  { id: 'CP', name: 'Contingency Planning', controls: 13, description: 'Backup, disaster recovery, business continuity' },
  { id: 'IA', name: 'Identification & Authentication', controls: 12, description: 'MFA, password policies, credential management' },
  { id: 'IR', name: 'Incident Response', controls: 10, description: 'Incident handling, reporting, forensics' },
  { id: 'MA', name: 'Maintenance', controls: 6, description: 'System maintenance, remote maintenance, tools' },
  { id: 'MP', name: 'Media Protection', controls: 8, description: 'Media access, marking, storage, sanitization' },
  { id: 'PE', name: 'Physical & Environmental', controls: 20, description: 'Physical access, environmental controls, power' },
  { id: 'PL', name: 'Planning', controls: 9, description: 'Security planning, architecture, rules of behavior' },
  { id: 'PS', name: 'Personnel Security', controls: 8, description: 'Personnel screening, termination, transfers' },
  { id: 'RA', name: 'Risk Assessment', controls: 6, description: 'Risk assessments, vulnerability scanning, threat intel' },
  { id: 'SA', name: 'System & Services Acquisition', controls: 22, description: 'Secure SDLC, supply chain, developer security' },
  { id: 'SC', name: 'System & Communications Protection', controls: 44, description: 'Encryption, boundary protection, network security' },
  { id: 'SI', name: 'System & Information Integrity', controls: 17, description: 'Malware protection, monitoring, patching' },
  { id: 'SR', name: 'Supply Chain Risk Management', controls: 12, description: 'Supply chain risk, component authenticity' },
];

// Platform implementation status for each control family
const IMPLEMENTATION_STATUS: Record<string, { implemented: number; partial: number; planned: number; notApplicable: number }> = {
  'AC': { implemented: 20, partial: 3, planned: 2, notApplicable: 0 },
  'AT': { implemented: 4, partial: 2, planned: 0, notApplicable: 0 },
  'AU': { implemented: 14, partial: 2, planned: 0, notApplicable: 0 },
  'CA': { implemented: 6, partial: 2, planned: 1, notApplicable: 0 },
  'CM': { implemented: 9, partial: 2, planned: 0, notApplicable: 0 },
  'CP': { implemented: 10, partial: 2, planned: 1, notApplicable: 0 },
  'IA': { implemented: 10, partial: 2, planned: 0, notApplicable: 0 },
  'IR': { implemented: 8, partial: 2, planned: 0, notApplicable: 0 },
  'MA': { implemented: 4, partial: 1, planned: 1, notApplicable: 0 },
  'MP': { implemented: 6, partial: 1, planned: 1, notApplicable: 0 },
  'PE': { implemented: 18, partial: 2, planned: 0, notApplicable: 0 }, // Inherited from cloud provider
  'PL': { implemented: 7, partial: 2, planned: 0, notApplicable: 0 },
  'PS': { implemented: 6, partial: 2, planned: 0, notApplicable: 0 },
  'RA': { implemented: 5, partial: 1, planned: 0, notApplicable: 0 },
  'SA': { implemented: 18, partial: 3, planned: 1, notApplicable: 0 },
  'SC': { implemented: 38, partial: 4, planned: 2, notApplicable: 0 },
  'SI': { implemented: 14, partial: 2, planned: 1, notApplicable: 0 },
  'SR': { implemented: 8, partial: 3, planned: 1, notApplicable: 0 },
};

// FedRAMP Authorization Milestones
const AUTHORIZATION_MILESTONES = [
  { id: 1, phase: 'Preparation', name: 'Gap Assessment', status: 'completed', date: '2024-09-15', description: 'Initial assessment of current security posture against FedRAMP requirements' },
  { id: 2, phase: 'Preparation', name: 'Remediation Planning', status: 'completed', date: '2024-10-01', description: 'Develop plan to address identified gaps' },
  { id: 3, phase: 'Preparation', name: 'SSP Development', status: 'in_progress', date: '2025-01-30', description: 'System Security Plan documentation' },
  { id: 4, phase: 'Preparation', name: 'Control Implementation', status: 'in_progress', date: '2025-02-28', description: 'Implement remaining security controls' },
  { id: 5, phase: 'Assessment', name: '3PAO Selection', status: 'planned', date: '2025-03-15', description: 'Select FedRAMP-accredited Third Party Assessment Organization' },
  { id: 6, phase: 'Assessment', name: 'Readiness Assessment', status: 'planned', date: '2025-04-15', description: '3PAO readiness assessment' },
  { id: 7, phase: 'Assessment', name: 'Full Assessment', status: 'planned', date: '2025-06-01', description: 'Complete security assessment by 3PAO' },
  { id: 8, phase: 'Authorization', name: 'SAR Review', status: 'planned', date: '2025-07-15', description: 'Security Assessment Report review' },
  { id: 9, phase: 'Authorization', name: 'POA&M Finalization', status: 'planned', date: '2025-08-01', description: 'Finalize Plan of Action & Milestones' },
  { id: 10, phase: 'Authorization', name: 'ATO Issuance', status: 'planned', date: '2025-09-01', description: 'Authority to Operate issued' },
  { id: 11, phase: 'Continuous Monitoring', name: 'ConMon Program', status: 'planned', date: '2025-09-15', description: 'Begin continuous monitoring program' },
];

// POA&M Items (Plan of Action & Milestones)
const POAM_ITEMS = [
  { id: 'POAM-001', control: 'SC-28', weakness: 'FIPS 140-2 validated encryption modules not yet deployed', risk: 'high', status: 'in_progress', due: '2025-02-15', owner: 'Security Team' },
  { id: 'POAM-002', control: 'AU-6', weakness: 'Automated log correlation tool integration pending', risk: 'medium', status: 'in_progress', due: '2025-02-28', owner: 'DevOps Team' },
  { id: 'POAM-003', control: 'IA-5', weakness: 'PIV/CAC authentication for privileged users', risk: 'medium', status: 'planned', due: '2025-03-15', owner: 'Identity Team' },
  { id: 'POAM-004', control: 'CP-9', weakness: 'Offsite backup to FedRAMP-authorized facility', risk: 'high', status: 'in_progress', due: '2025-02-01', owner: 'Infrastructure Team' },
  { id: 'POAM-005', control: 'SR-3', weakness: 'Supply chain risk assessment for all vendors', risk: 'medium', status: 'in_progress', due: '2025-03-01', owner: 'Procurement Team' },
];

// Infrastructure readiness
const INFRASTRUCTURE_READINESS = {
  cloudProvider: { name: 'AWS GovCloud', status: 'planned', notes: 'Migration from commercial AWS planned Q1 2025' },
  database: { name: 'Supabase (Postgres)', status: 'partial', notes: 'Data encryption at rest enabled, FedRAMP hosting pending' },
  cdn: { name: 'CloudFront', status: 'partial', notes: 'Currently using commercial, GovCloud CDN planned' },
  dns: { name: 'Route 53', status: 'ready', notes: 'DNSSEC enabled' },
  waf: { name: 'AWS WAF', status: 'ready', notes: 'OWASP rules deployed' },
  logging: { name: 'CloudWatch + S3', status: 'ready', notes: 'Centralized logging with 1-year retention' },
  encryption: { name: 'AES-256', status: 'partial', notes: 'FIPS 140-2 validated modules pending' },
  backup: { name: 'Cross-region backup', status: 'ready', notes: 'Daily backups to separate region' },
};

type FedRAMPSubTab = 'overview' | 'controls' | 'milestones' | 'poam' | 'infrastructure' | 'documentation';

const FedRAMPReadinessTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<FedRAMPSubTab>('overview');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Calculate overall readiness
  const calculateReadiness = () => {
    let totalControls = 0;
    let implementedControls = 0;
    let partialControls = 0;

    Object.values(IMPLEMENTATION_STATUS).forEach(status => {
      totalControls += status.implemented + status.partial + status.planned;
      implementedControls += status.implemented;
      partialControls += status.partial;
    });

    const fullScore = (implementedControls / totalControls) * 100;
    const partialScore = ((implementedControls + partialControls * 0.5) / totalControls) * 100;

    return {
      total: totalControls,
      implemented: implementedControls,
      partial: partialControls,
      planned: totalControls - implementedControls - partialControls,
      fullScore: Math.round(fullScore),
      partialScore: Math.round(partialScore),
    };
  };

  const readiness = calculateReadiness();

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'controls', label: 'Control Families', icon: CheckCircle },
    { id: 'milestones', label: 'Authorization Timeline', icon: Clock },
    { id: 'poam', label: 'POA&M', icon: AlertTriangle },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'documentation', label: 'Documentation', icon: FileText },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in_progress': return 'bg-amber-500';
      case 'planned': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-blue-400" />
            FedRAMP Authorization Readiness
          </h2>
          <p className="text-gray-400 mt-1">
            Track progress toward FedRAMP Moderate authorization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export SSP
          </button>
          <a
            href="https://www.fedramp.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            FedRAMP.gov
          </a>
        </div>
      </div>

      {/* Readiness Score Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-medium">FedRAMP Moderate Readiness Score</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-white">{readiness.partialScore}%</span>
              <span className="text-gray-400">
                ({readiness.implemented} implemented, {readiness.partial} partial of {readiness.total} controls)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Target Authorization</div>
            <div className="text-2xl font-bold text-white">Q3 2025</div>
            <div className="text-sm text-amber-400 mt-1">Agency Sponsor: Pending</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{readiness.partialScore}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
              style={{ width: `${readiness.partialScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 overflow-x-auto">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as FedRAMPSubTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{readiness.implemented}</div>
                  <div className="text-sm text-gray-400">Controls Implemented</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{readiness.partial}</div>
                  <div className="text-sm text-gray-400">Partially Implemented</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{POAM_ITEMS.filter(p => p.risk === 'high').length}</div>
                  <div className="text-sm text-gray-400">High Risk POA&M Items</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">18</div>
                  <div className="text-sm text-gray-400">Control Families</div>
                </div>
              </div>
            </div>
          </div>

          {/* Authorization Path */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">FedRAMP Authorization Path</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">1</div>
                  <span className="font-medium text-white">Preparation Phase</span>
                </div>
                <div className="ml-10 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Gap Assessment Complete
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Remediation Plan Created
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    SSP Development In Progress
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">2</div>
                  <span className="font-medium text-white">Assessment Phase</span>
                </div>
                <div className="ml-10 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    3PAO Selection (Q1 2025)
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Readiness Assessment
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Full Security Assessment
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">3</div>
                  <span className="font-medium text-white">Authorization Phase</span>
                </div>
                <div className="ml-10 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    SAR Review & POA&M
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    ATO Issuance (Target: Q3 2025)
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Continuous Monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Security Requirements Met
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Multi-Factor Authentication (MFA)', status: 'complete' },
                  { name: 'Encryption at Rest (AES-256)', status: 'complete' },
                  { name: 'Encryption in Transit (TLS 1.3)', status: 'complete' },
                  { name: 'Audit Logging & Retention', status: 'complete' },
                  { name: 'Role-Based Access Control', status: 'complete' },
                  { name: 'Vulnerability Scanning', status: 'complete' },
                  { name: 'Incident Response Plan', status: 'complete' },
                ].map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">{req.name}</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Pending Requirements
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'FIPS 140-2 Validated Crypto', status: 'in_progress', due: 'Feb 2025' },
                  { name: 'FedRAMP-Authorized Hosting', status: 'planned', due: 'Mar 2025' },
                  { name: 'PIV/CAC Authentication', status: 'planned', due: 'Mar 2025' },
                  { name: '3PAO Assessment', status: 'planned', due: 'Q2 2025' },
                  { name: 'Agency Sponsor Identified', status: 'pending', due: 'Q1 2025' },
                ].map((req, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <span className="text-gray-300">{req.name}</span>
                      <span className="text-xs text-gray-500 ml-2">Due: {req.due}</span>
                    </div>
                    {req.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Tab */}
      {activeSubTab === 'controls' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Info className="w-4 h-4" />
              NIST 800-53 Rev 5 controls mapped to FedRAMP Moderate baseline
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONTROL_FAMILIES.map(family => {
                const status = IMPLEMENTATION_STATUS[family.id];
                const total = status.implemented + status.partial + status.planned;
                const percentage = Math.round(((status.implemented + status.partial * 0.5) / total) * 100);

                return (
                  <div
                    key={family.id}
                    onClick={() => setSelectedFamily(selectedFamily === family.id ? null : family.id)}
                    className={`bg-slate-700/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 ${
                      selectedFamily === family.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          {family.id}
                        </span>
                        <span className="font-medium text-white">{family.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{family.controls} controls</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{family.description}</p>
                    <div className="h-2 bg-slate-600 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400">{status.implemented} implemented</span>
                      <span className="text-amber-400">{status.partial} partial</span>
                      <span className="text-gray-500">{status.planned} planned</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-6">Authorization Timeline</h3>
            <div className="space-y-4">
              {AUTHORIZATION_MILESTONES.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(milestone.status)}`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{milestone.id}</span>
                      )}
                    </div>
                    {index < AUTHORIZATION_MILESTONES.length - 1 && (
                      <div className={`w-0.5 h-16 ${
                        milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                        {milestone.phase}
                      </span>
                      <span className="font-medium text-white">{milestone.name}</span>
                      <span className="text-xs text-gray-500">{milestone.date}</span>
                    </div>
                    <p className="text-sm text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POA&M Tab */}
      {activeSubTab === 'poam' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Plan of Action & Milestones</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg">
                <Download className="w-4 h-4" />
                Export POA&M
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">ID</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Control</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Weakness</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Risk</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Due Date</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {POAM_ITEMS.map(item => (
                  <tr key={item.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm font-mono text-blue-400">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-300">{item.control}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{item.weakness}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(item.risk)}`}>
                        {item.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'in_progress' ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 bg-slate-500/20'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.due}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Infrastructure Tab */}
      {activeSubTab === 'infrastructure' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              FedRAMP Infrastructure Readiness
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(INFRASTRUCTURE_READINESS).map(([key, value]) => (
                <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{value.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      value.status === 'ready' ? 'text-emerald-400 bg-emerald-500/20' :
                      value.status === 'partial' ? 'text-amber-400 bg-amber-500/20' :
                      'text-slate-400 bg-slate-500/20'
                    }`}>
                      {value.status === 'ready' ? 'Ready' : value.status === 'partial' ? 'Partial' : 'Planned'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{value.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Encryption Details */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              Encryption & Key Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Data at Rest</div>
                <div className="text-white font-medium">AES-256-GCM</div>
                <div className="text-xs text-amber-400 mt-1">FIPS 140-2 validation pending</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Data in Transit</div>
                <div className="text-white font-medium">TLS 1.3</div>
                <div className="text-xs text-emerald-400 mt-1">✓ FIPS compliant</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Key Management</div>
                <div className="text-white font-medium">AWS KMS</div>
                <div className="text-xs text-emerald-400 mt-1">✓ FIPS 140-2 Level 3</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeSubTab === 'documentation' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">FedRAMP Documentation Status</h3>
            <div className="space-y-3">
              {[
                { name: 'System Security Plan (SSP)', status: 'in_progress', progress: 75, required: true },
                { name: 'Security Assessment Plan (SAP)', status: 'planned', progress: 0, required: true },
                { name: 'Security Assessment Report (SAR)', status: 'planned', progress: 0, required: true },
                { name: 'Plan of Action & Milestones (POA&M)', status: 'in_progress', progress: 90, required: true },
                { name: 'Continuous Monitoring Plan', status: 'in_progress', progress: 60, required: true },
                { name: 'Incident Response Plan', status: 'complete', progress: 100, required: true },
                { name: 'Configuration Management Plan', status: 'complete', progress: 100, required: true },
                { name: 'Contingency Plan', status: 'in_progress', progress: 85, required: true },
                { name: 'Privacy Impact Assessment', status: 'complete', progress: 100, required: true },
                { name: 'Rules of Behavior', status: 'complete', progress: 100, required: true },
              ].map((doc, i) => (
                <div key={i} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{doc.name}</span>
                      {doc.required && (
                        <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === 'complete' ? 'text-emerald-400 bg-emerald-500/20' :
                      doc.status === 'in_progress' ? 'text-amber-400 bg-amber-500/20' :
                      'text-slate-400 bg-slate-500/20'
                    }`}>
                      {doc.status === 'complete' ? 'Complete' : doc.status === 'in_progress' ? 'In Progress' : 'Planned'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        doc.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${doc.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Export SSP Documentation</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                <input type="radio" name="format" defaultChecked className="text-blue-500" />
                <div>
                  <div className="text-white">FedRAMP SSP Template (Word)</div>
                  <div className="text-xs text-gray-400">Official FedRAMP template format</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                <input type="radio" name="format" className="text-blue-500" />
                <div>
                  <div className="text-white">OSCAL JSON</div>
                  <div className="text-xs text-gray-400">Machine-readable format</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                <input type="radio" name="format" className="text-blue-500" />
                <div>
                  <div className="text-white">Control Matrix (Excel)</div>
                  <div className="text-xs text-gray-400">Implementation status spreadsheet</div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FedRAMPReadinessTab;
