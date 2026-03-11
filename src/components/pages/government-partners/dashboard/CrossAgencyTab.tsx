// ===========================================
// Cross-Agency Data Sharing Tab
// Federated inter-agency STEM workforce collaboration
// Full data sovereignty · PII-safe · FISMA-compliant
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Shield,
  Link,
  Users,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileText,
  Filter,
  Search,
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

// ===========================================
// TYPES
// ===========================================

export interface CrossAgencyTabProps {
  partnerId: string;
  tier: string;
}

type DataShareStatus = 'active' | 'pending' | 'paused' | 'terminated';
type DataClassification = 'CUI' | 'SBU' | 'Public' | 'Controlled';
type SharingMode = 'aggregate_only' | 'anonymized' | 'full_deidentified';

interface AgencyPartnership {
  id: string;
  agencyName: string;
  agencyCode: string;
  agencyType: 'federal' | 'state' | 'local' | 'national_lab';
  moaSignedDate: string;
  moaExpiryDate: string;
  status: DataShareStatus;
  dataClassification: DataClassification;
  sharingMode: SharingMode;
  datasetsShared: number;
  lastSyncDate: string;
  participantsInPipeline: number;
  programsCoordinated: number;
  piiExposed: boolean;
  poc: string;
  pocEmail: string;
}

interface SharedDataset {
  id: string;
  name: string;
  description: string;
  agencySource: string;
  recordCount: number;
  lastUpdated: string;
  classification: DataClassification;
  sharingMode: SharingMode;
  fieldsIncluded: string[];
  fieldsExcluded: string[];
  accessingAgencies: string[];
}

// ===========================================
// SAMPLE DATA
// ===========================================

const AGENCY_PARTNERSHIPS: AgencyPartnership[] = [
  {
    id: 'ap-1',
    agencyName: 'Department of Energy — Office of Science',
    agencyCode: 'DOE-SC',
    agencyType: 'federal',
    moaSignedDate: '2024-02-15',
    moaExpiryDate: '2026-02-14',
    status: 'active',
    dataClassification: 'CUI',
    sharingMode: 'aggregate_only',
    datasetsShared: 4,
    lastSyncDate: '2025-03-09',
    participantsInPipeline: 1240,
    programsCoordinated: 6,
    piiExposed: false,
    poc: 'Dr. Angela Reyes',
    pocEmail: 'areyes@doe.gov',
  },
  {
    id: 'ap-2',
    agencyName: 'National Science Foundation',
    agencyCode: 'NSF',
    agencyType: 'federal',
    moaSignedDate: '2023-09-01',
    moaExpiryDate: '2025-08-31',
    status: 'active',
    dataClassification: 'Public',
    sharingMode: 'full_deidentified',
    datasetsShared: 7,
    lastSyncDate: '2025-03-08',
    participantsInPipeline: 3580,
    programsCoordinated: 12,
    piiExposed: false,
    poc: 'Marcus Okonkwo',
    pocEmail: 'mokonkwo@nsf.gov',
  },
  {
    id: 'ap-3',
    agencyName: 'DOL Employment & Training Administration',
    agencyCode: 'DOL-ETA',
    agencyType: 'federal',
    moaSignedDate: '2024-05-10',
    moaExpiryDate: '2026-05-09',
    status: 'active',
    dataClassification: 'SBU',
    sharingMode: 'anonymized',
    datasetsShared: 9,
    lastSyncDate: '2025-03-09',
    participantsInPipeline: 8920,
    programsCoordinated: 18,
    piiExposed: false,
    poc: 'Sarah Chen',
    pocEmail: 'schen@dol.gov',
  },
  {
    id: 'ap-4',
    agencyName: 'Texas Workforce Commission',
    agencyCode: 'TWC',
    agencyType: 'state',
    moaSignedDate: '2024-08-20',
    moaExpiryDate: '2026-08-19',
    status: 'active',
    dataClassification: 'SBU',
    sharingMode: 'anonymized',
    datasetsShared: 5,
    lastSyncDate: '2025-03-07',
    participantsInPipeline: 4120,
    programsCoordinated: 8,
    piiExposed: false,
    poc: 'James Whitfield',
    pocEmail: 'jwhitfield@twc.texas.gov',
  },
  {
    id: 'ap-5',
    agencyName: 'Oak Ridge National Laboratory',
    agencyCode: 'ORNL',
    agencyType: 'national_lab',
    moaSignedDate: '2023-12-01',
    moaExpiryDate: '2025-11-30',
    status: 'pending',
    dataClassification: 'CUI',
    sharingMode: 'aggregate_only',
    datasetsShared: 0,
    lastSyncDate: '—',
    participantsInPipeline: 0,
    programsCoordinated: 0,
    piiExposed: false,
    poc: 'Dr. Lin Wei',
    pocEmail: 'lwei@ornl.gov',
  },
  {
    id: 'ap-6',
    agencyName: 'DHS Cybersecurity and Infrastructure Security Agency',
    agencyCode: 'DHS-CISA',
    agencyType: 'federal',
    moaSignedDate: '2024-01-10',
    moaExpiryDate: '2026-01-09',
    status: 'paused',
    dataClassification: 'Controlled',
    sharingMode: 'aggregate_only',
    datasetsShared: 2,
    lastSyncDate: '2025-01-15',
    participantsInPipeline: 320,
    programsCoordinated: 2,
    piiExposed: false,
    poc: 'Robert Marsh',
    pocEmail: 'rmarsh@cisa.dhs.gov',
  },
];

const SHARED_DATASETS: SharedDataset[] = [
  {
    id: 'ds-1',
    name: 'STEM Talent Pipeline — Aggregate Counts',
    description: 'Aggregated enrollment, completion, and placement counts across all coordinated programs. No individual records.',
    agencySource: 'Multi-agency composite',
    recordCount: 18760,
    lastUpdated: '2025-03-09',
    classification: 'Public',
    sharingMode: 'aggregate_only',
    fieldsIncluded: ['program_id', 'cohort_month', 'enrolled_count', 'completed_count', 'placed_count', 'occupation_group', 'region'],
    fieldsExcluded: ['name', 'ssn', 'dob', 'address', 'email'],
    accessingAgencies: ['NSF', 'DOL-ETA', 'TWC'],
  },
  {
    id: 'ds-2',
    name: 'Clearance-Eligible Candidate Pool',
    description: 'De-identified pool of candidates who have passed initial screening and are clearance-eligible. Shared with sponsoring agencies only.',
    agencySource: 'DOE-SC / ORNL',
    recordCount: 1240,
    lastUpdated: '2025-03-08',
    classification: 'CUI',
    sharingMode: 'anonymized',
    fieldsIncluded: ['candidate_token', 'clearance_tier_eligible', 'stem_discipline', 'education_level', 'us_citizen', 'region'],
    fieldsExcluded: ['name', 'ssn', 'dob', 'address', 'prior_employment'],
    accessingAgencies: ['DOE-SC'],
  },
  {
    id: 'ds-3',
    name: 'WIOA Performance Outcomes — State Crosswalk',
    description: 'State-level WIOA performance indicator data crosswalked with federal program outcomes for inter-program participants.',
    agencySource: 'DOL-ETA + TWC',
    recordCount: 4120,
    lastUpdated: '2025-03-07',
    classification: 'SBU',
    sharingMode: 'anonymized',
    fieldsIncluded: ['participant_token', 'program_type', 'q2_employed', 'q4_employed', 'median_earnings_bin', 'credential_earned', 'occupation_soc'],
    fieldsExcluded: ['name', 'ssn', 'dob', 'address', 'phone'],
    accessingAgencies: ['DOL-ETA', 'TWC'],
  },
];

// ===========================================
// HELPER COMPONENTS
// ===========================================

const StatusBadge: React.FC<{ status: DataShareStatus }> = ({ status }) => {
  const map: Record<DataShareStatus, { label: string; cls: string }> = {
    active: { label: 'Active', cls: 'bg-emerald-500/20 text-emerald-400' },
    pending: { label: 'Pending MOA', cls: 'bg-amber-500/20 text-amber-400' },
    paused: { label: 'Paused', cls: 'bg-blue-500/20 text-blue-400' },
    terminated: { label: 'Terminated', cls: 'bg-red-500/20 text-red-400' },
  };
  const { label, cls } = map[status];
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
};

const ClassificationBadge: React.FC<{ level: DataClassification }> = ({ level }) => {
  const map: Record<DataClassification, { cls: string }> = {
    CUI: { cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    SBU: { cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    Public: { cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    Controlled: { cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${map[level].cls}`}>{level}</span>;
};

const SharingModeBadge: React.FC<{ mode: SharingMode }> = ({ mode }) => {
  const map: Record<SharingMode, { label: string; icon: React.ElementType }> = {
    aggregate_only: { label: 'Aggregate Only', icon: BarChart3 },
    anonymized: { label: 'Anonymized', icon: EyeOff },
    full_deidentified: { label: 'De-identified', icon: Eye },
  };
  const { label, icon: Icon } = map[mode];
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// ===========================================
// DETAIL MODAL
// ===========================================

const PartnerDetailModal: React.FC<{
  partner: AgencyPartnership;
  onClose: () => void;
}> = ({ partner, onClose }) => {
  useEscapeKey(onClose);

  const relatedDatasets = SHARED_DATASETS.filter(ds =>
    ds.accessingAgencies.includes(partner.agencyCode) || ds.agencySource.includes(partner.agencyCode)
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-white">{partner.agencyName}</h3>
            <p className="text-gray-400 text-sm">{partner.agencyCode} · MOA expires {partner.moaExpiryDate}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Partnership Status</p>
              <StatusBadge status={partner.status} />
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Data Classification</p>
              <ClassificationBadge level={partner.dataClassification} />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Participants in Pipeline', value: partner.participantsInPipeline.toLocaleString() },
              { label: 'Programs Coordinated', value: partner.programsCoordinated },
              { label: 'Datasets Shared', value: partner.datasetsShared },
            ].map(kpi => (
              <div key={kpi.label} className="text-center p-3 bg-gray-800/50 rounded-xl">
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Sharing mode */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-300">Sharing Mode</p>
              <SharingModeBadge mode={partner.sharingMode} />
            </div>
            <p className="text-xs text-gray-500">
              {partner.sharingMode === 'aggregate_only' && 'Only aggregated statistics shared. No individual records transmitted.'}
              {partner.sharingMode === 'anonymized' && 'Tokenized records shared. All direct identifiers removed per NIST SP 800-188.'}
              {partner.sharingMode === 'full_deidentified' && 'Full de-identification per HIPAA Safe Harbor plus federal CUI requirements.'}
            </p>
          </div>

          {/* PII guardrail */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${
            partner.piiExposed ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'
          }`}>
            {partner.piiExposed
              ? <><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-red-300 text-sm">PII exposure risk — review required</span></>
              : <><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-emerald-300 text-sm">No PII transmitted · All fields verified</span></>
            }
          </div>

          {/* Related datasets */}
          {relatedDatasets.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Shared Datasets</p>
              <div className="space-y-2">
                {relatedDatasets.map(ds => (
                  <div key={ds.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl text-sm">
                    <div>
                      <p className="text-gray-200 font-medium">{ds.name}</p>
                      <p className="text-gray-500 text-xs">{ds.recordCount.toLocaleString()} records · Updated {ds.lastUpdated}</p>
                    </div>
                    <ClassificationBadge level={ds.classification} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POC */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Agency Point of Contact</p>
            <p className="text-white font-medium">{partner.poc}</p>
            <a href={`mailto:${partner.pocEmail}`} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              {partner.pocEmail}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const CrossAgencyTab: React.FC<CrossAgencyTabProps> = ({ tier }) => {
  const [view, setView] = useState<'partnerships' | 'datasets'>('partnerships');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DataShareStatus | 'all'>('all');
  const [selectedPartner, setSelectedPartner] = useState<AgencyPartnership | null>(null);
  const [showDatasetsFor, setShowDatasetsFor] = useState<string | null>(null);

  const isNational = tier === 'national';

  const filteredPartners = AGENCY_PARTNERSHIPS.filter(p => {
    const matchSearch = p.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.agencyCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalParticipants = AGENCY_PARTNERSHIPS.filter(p => p.status === 'active')
    .reduce((sum, p) => sum + p.participantsInPipeline, 0);
  const totalDatasets = AGENCY_PARTNERSHIPS.reduce((sum, p) => sum + p.datasetsShared, 0);
  const activeCount = AGENCY_PARTNERSHIPS.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Cross-Agency Data Sharing</h2>
          <p className="text-sm text-gray-400 mt-1">
            Federated STEM workforce collaboration with full data sovereignty and PII protection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* National plan gate */}
      {!isNational && (
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium text-sm">National Plan — Cross-Agency Collaboration</p>
            <p className="text-blue-400/70 text-xs mt-1">
              Upgrade to National plan to initiate new interagency partnerships, request API access,
              and configure custom data-sharing agreements. Read-only view shown below.
            </p>
          </div>
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Link, label: 'Active Partnerships', value: activeCount, color: '#3b82f6' },
          { icon: Users, label: 'Participants in Joint Pipeline', value: totalParticipants.toLocaleString(), color: '#22c55e' },
          { icon: FileText, label: 'Datasets Shared', value: totalDatasets, color: '#a855f7' },
          { icon: Shield, label: 'PII Incidents (YTD)', value: '0', color: '#22c55e' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              <span className="text-xs text-gray-400">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['partnerships', 'datasets'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {v === 'partnerships' ? 'Agency Partnerships' : 'Shared Datasets'}
          </button>
        ))}
      </div>

      {/* Partnerships view */}
      {view === 'partnerships' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as DataShareStatus | 'all')}
                className="bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Partnership list */}
          <div className="space-y-3">
            {filteredPartners.map(partner => (
              <motion.div
                key={partner.id}
                layout
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      partner.agencyType === 'federal' ? 'bg-blue-500/20' :
                      partner.agencyType === 'state' ? 'bg-emerald-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {partner.piiExposed
                        ? <Unlock className={`w-5 h-5 text-red-400`} />
                        : <Lock className={`w-5 h-5 ${
                            partner.agencyType === 'federal' ? 'text-blue-400' :
                            partner.agencyType === 'state' ? 'text-emerald-400' :
                            'text-purple-400'
                          }`} />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{partner.agencyName}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">{partner.agencyCode}</span>
                        <span className="text-gray-700">·</span>
                        <ClassificationBadge level={partner.dataClassification} />
                        <span className="text-gray-700">·</span>
                        <SharingModeBadge mode={partner.sharingMode} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={partner.status} />
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-800">
                  {[
                    { label: 'Participants', value: partner.participantsInPipeline.toLocaleString() },
                    { label: 'Programs', value: partner.programsCoordinated },
                    { label: 'Datasets', value: partner.datasetsShared },
                    { label: 'Last Sync', value: partner.lastSyncDate },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-white font-medium text-sm mt-0.5">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add new partnership CTA */}
          <button
            disabled={!isNational}
            className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl text-sm font-medium transition-colors ${
              isNational
                ? 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                : 'border-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            {isNational ? 'Initiate New Interagency Partnership' : 'National Plan required to add partnerships'}
          </button>
        </div>
      )}

      {/* Datasets view */}
      {view === 'datasets' && (
        <div className="space-y-4">
          {SHARED_DATASETS.map(ds => (
            <div key={ds.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-semibold">{ds.name}</p>
                    <ClassificationBadge level={ds.classification} />
                  </div>
                  <p className="text-gray-400 text-sm">{ds.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SharingModeBadge mode={ds.sharingMode} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Source', value: ds.agencySource },
                  { label: 'Records', value: ds.recordCount.toLocaleString() },
                  { label: 'Updated', value: ds.lastUpdated },
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Fields included / excluded */}
              <button
                onClick={() => setShowDatasetsFor(showDatasetsFor === ds.id ? null : ds.id)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showDatasetsFor === ds.id ? 'Hide field details' : 'Show field details'}
              </button>

              <AnimatePresence>
                {showDatasetsFor === ds.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 grid grid-cols-2 gap-3"
                  >
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-emerald-400 text-xs font-semibold mb-2">Fields Included</p>
                      {ds.fieldsIncluded.map(f => (
                        <p key={f} className="text-emerald-300 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {f}
                        </p>
                      ))}
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-xs font-semibold mb-2">Fields Excluded (PII)</p>
                      {ds.fieldsExcluded.map(f => (
                        <p key={f} className="text-red-300 text-xs flex items-center gap-1">
                          <X className="w-3 h-3" /> {f}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Accessed by:</span>
                {ds.accessingAgencies.map(a => (
                  <span key={a} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <PartnerDetailModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrossAgencyTab;
