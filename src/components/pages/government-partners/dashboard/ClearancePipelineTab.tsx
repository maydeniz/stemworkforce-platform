// ===========================================
// Clearance Pipeline Tab
// Federal agency clearance-eligible candidate tracking
// OPM / DCSA investigation status · NISPOM-aligned
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Clock,
  CheckCircle,
  Search,
  Download,
  Eye,
  X,
  TrendingUp,
  FileText,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

// ===========================================
// TYPES
// ===========================================

export interface ClearancePipelineTabProps {
  partnerId: string;
  tier: string;
}

type ClearanceLevel = 'Confidential' | 'Secret' | 'Top Secret' | 'TS/SCI';
type InvestigationStatus =
  | 'not_initiated'
  | 'initiated'
  | 'pending_eqip'
  | 'under_investigation'
  | 'adjudication'
  | 'granted'
  | 'denied'
  | 'interim';
type CandidateStatus = 'pipeline' | 'active_hiring' | 'onboarded' | 'withdrawn';

interface ClearedCandidate {
  id: string;
  displayToken: string;
  stemDiscipline: string;
  educationLevel: 'Associates' | 'Bachelors' | 'Masters' | 'PhD' | 'Bootcamp/Cert';
  yearsExperience: number;
  region: string;
  clearanceLevel: ClearanceLevel;
  clearanceStatus: InvestigationStatus;
  clearanceSponsor: string;
  programId: string;
  programName: string;
  keySkills: string[];
  usCitizen: boolean;
  targetOccupation: string;
  candidateStatus: CandidateStatus;
  daysPending: number;
  estimatedGrantDate?: string;
  polygraphRequired: boolean;
  notes?: string;
}

interface PipelineMetrics {
  totalInPipeline: number;
  grantedThisQuarter: number;
  averageDaysToGrant: number;
  adjudicationRate: number;
  byLevel: { level: ClearanceLevel; count: number; avgDays: number }[];
  byStatus: { status: InvestigationStatus; count: number }[];
  recentGrants: number;
}

// ===========================================
// SAMPLE DATA
// Based on realistic DOD/IC hiring patterns
// ===========================================

const PIPELINE_METRICS: PipelineMetrics = {
  totalInPipeline: 342,
  grantedThisQuarter: 48,
  averageDaysToGrant: 312,
  adjudicationRate: 91,
  byLevel: [
    { level: 'Confidential', count: 78, avgDays: 145 },
    { level: 'Secret', count: 189, avgDays: 285 },
    { level: 'Top Secret', count: 64, avgDays: 420 },
    { level: 'TS/SCI', count: 11, avgDays: 540 },
  ],
  byStatus: [
    { status: 'initiated', count: 42 },
    { status: 'pending_eqip', count: 28 },
    { status: 'under_investigation', count: 134 },
    { status: 'adjudication', count: 67 },
    { status: 'interim', count: 23 },
    { status: 'granted', count: 48 },
  ],
  recentGrants: 48,
};

const SAMPLE_CANDIDATES: ClearedCandidate[] = [
  {
    id: 'cc-1', displayToken: 'CAND-7842-A',
    stemDiscipline: 'Electrical Engineering', educationLevel: 'Masters',
    yearsExperience: 4, region: 'Northern Virginia',
    clearanceLevel: 'Top Secret', clearanceStatus: 'adjudication',
    clearanceSponsor: 'DIA', programId: 'chips-1', programName: 'CHIPS Semiconductor Initiative',
    keySkills: ['FPGA Design', 'VHDL', 'RF Systems', 'ITAR-regulated hardware'],
    usCitizen: true, targetOccupation: 'Electronics Engineer',
    candidateStatus: 'active_hiring', daysPending: 387,
    estimatedGrantDate: '2025-05-15', polygraphRequired: false,
  },
  {
    id: 'cc-2', displayToken: 'CAND-3391-B',
    stemDiscipline: 'Computer Science', educationLevel: 'Bachelors',
    yearsExperience: 2, region: 'San Antonio, TX',
    clearanceLevel: 'Secret', clearanceStatus: 'under_investigation',
    clearanceSponsor: 'NSA', programId: 'cyber-2', programName: 'NSA Cyber Workforce Pipeline',
    keySkills: ['Python', 'Reverse Engineering', 'Malware Analysis', 'IDA Pro'],
    usCitizen: true, targetOccupation: 'Cybersecurity Analyst',
    candidateStatus: 'pipeline', daysPending: 198,
    polygraphRequired: true,
  },
  {
    id: 'cc-3', displayToken: 'CAND-5519-C',
    stemDiscipline: 'Nuclear Engineering', educationLevel: 'PhD',
    yearsExperience: 6, region: 'Oak Ridge, TN',
    clearanceLevel: 'Top Secret', clearanceStatus: 'granted',
    clearanceSponsor: 'DOE-SC', programId: 'oe-labs-1', programName: 'DOE National Labs Researcher Track',
    keySkills: ['Reactor Physics', 'Monte Carlo Simulation', 'MCNP', 'Radiation Safety'],
    usCitizen: true, targetOccupation: 'Nuclear Scientist',
    candidateStatus: 'onboarded', daysPending: 0,
    polygraphRequired: false,
  },
  {
    id: 'cc-4', displayToken: 'CAND-1128-D',
    stemDiscipline: 'Data Science / AI', educationLevel: 'Masters',
    yearsExperience: 3, region: 'Maryland / DC Area',
    clearanceLevel: 'TS/SCI', clearanceStatus: 'under_investigation',
    clearanceSponsor: 'NRO', programId: 'nro-ai-1', programName: 'NRO AI Analyst Pipeline',
    keySkills: ['Machine Learning', 'PyTorch', 'Satellite Imagery Analysis', 'Python'],
    usCitizen: true, targetOccupation: 'Intelligence Analyst (AI)',
    candidateStatus: 'pipeline', daysPending: 291,
    polygraphRequired: true,
  },
  {
    id: 'cc-5', displayToken: 'CAND-8847-E',
    stemDiscipline: 'Cybersecurity', educationLevel: 'Bachelors',
    yearsExperience: 5, region: 'Colorado Springs, CO',
    clearanceLevel: 'Secret', clearanceStatus: 'interim',
    clearanceSponsor: 'NORAD', programId: 'space-cyber-1', programName: 'Space Force Cyber Workforce',
    keySkills: ['Network Security', 'SIEM', 'Splunk', 'ICS/SCADA Security'],
    usCitizen: true, targetOccupation: 'Cyberspace Operations Specialist',
    candidateStatus: 'active_hiring', daysPending: 142,
    polygraphRequired: false,
  },
  {
    id: 'cc-6', displayToken: 'CAND-2273-F',
    stemDiscipline: 'Materials Science', educationLevel: 'PhD',
    yearsExperience: 8, region: 'Livermore, CA',
    clearanceLevel: 'Top Secret', clearanceStatus: 'granted',
    clearanceSponsor: 'LLNL', programId: 'weapons-science-1', programName: 'NNSA Weapons Science Pipeline',
    keySkills: ['High-Performance Computing', 'Computational Physics', 'C++', 'FORTRAN'],
    usCitizen: true, targetOccupation: 'Research Scientist',
    candidateStatus: 'onboarded', daysPending: 0,
    polygraphRequired: false,
  },
  {
    id: 'cc-7', displayToken: 'CAND-9930-G',
    stemDiscipline: 'Aerospace Engineering', educationLevel: 'Masters',
    yearsExperience: 3, region: 'Huntsville, AL',
    clearanceLevel: 'Secret', clearanceStatus: 'pending_eqip',
    clearanceSponsor: 'NASA / MSFC', programId: 'nasa-artemis-1', programName: 'NASA Artemis Workforce Initiative',
    keySkills: ['Propulsion Systems', 'MATLAB', 'Ansys', 'Structural Analysis'],
    usCitizen: true, targetOccupation: 'Aerospace Engineer',
    candidateStatus: 'pipeline', daysPending: 45,
    polygraphRequired: false,
  },
];

// ===========================================
// HELPER FUNCTIONS / COMPONENTS
// ===========================================

const investigationLabel: Record<InvestigationStatus, string> = {
  not_initiated: 'Not Initiated',
  initiated: 'Initiated',
  pending_eqip: 'Pending e-QIP',
  under_investigation: 'Under Investigation',
  adjudication: 'In Adjudication',
  granted: 'Granted',
  denied: 'Denied',
  interim: 'Interim Granted',
};

const investigationColor: Record<InvestigationStatus, string> = {
  not_initiated: 'bg-gray-500/20 text-gray-400',
  initiated: 'bg-blue-500/20 text-blue-400',
  pending_eqip: 'bg-cyan-500/20 text-cyan-400',
  under_investigation: 'bg-amber-500/20 text-amber-400',
  adjudication: 'bg-purple-500/20 text-purple-400',
  granted: 'bg-emerald-500/20 text-emerald-400',
  denied: 'bg-red-500/20 text-red-400',
  interim: 'bg-teal-500/20 text-teal-400',
};

const clearanceLevelColor: Record<ClearanceLevel, string> = {
  Confidential: '#3b82f6',
  Secret: '#f59e0b',
  'Top Secret': '#ef4444',
  'TS/SCI': '#a855f7',
};

const ClearanceBadge: React.FC<{ level: ClearanceLevel }> = ({ level }) => (
  <span
    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
    style={{
      color: clearanceLevelColor[level],
      borderColor: `${clearanceLevelColor[level]}40`,
      backgroundColor: `${clearanceLevelColor[level]}15`,
    }}
  >
    {level}
  </span>
);

const StatusBadge: React.FC<{ status: InvestigationStatus }> = ({ status }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium ${investigationColor[status]}`}>
    {investigationLabel[status]}
  </span>
);

// ===========================================
// CANDIDATE DETAIL MODAL
// ===========================================

const CandidateDetailModal: React.FC<{
  candidate: ClearedCandidate;
  onClose: () => void;
}> = ({ candidate, onClose }) => {
  useEscapeKey(onClose);

  const progressSteps: InvestigationStatus[] = [
    'initiated', 'pending_eqip', 'under_investigation', 'adjudication', 'granted',
  ];
  const currentIdx = progressSteps.indexOf(candidate.clearanceStatus);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl overflow-y-auto max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-white">{candidate.displayToken}</h3>
            <p className="text-gray-400 text-sm">{candidate.stemDiscipline} · {candidate.region}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Investigation Progress */}
          <div>
            <p className="text-sm font-semibold text-gray-300 mb-3">Investigation Progress</p>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-800" />
              {progressSteps.map((step, i) => {
                const isDone = i < currentIdx || (candidate.clearanceStatus === 'interim' && step === 'under_investigation');
                const isCurrent = i === currentIdx;
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isDone ? 'bg-emerald-500 border-emerald-500' :
                      isCurrent ? 'bg-blue-500 border-blue-500' :
                      'bg-gray-900 border-gray-700'
                    }`}>
                      {isDone ? <CheckCircle className="w-4 h-4 text-white" /> :
                        isCurrent ? <Clock className="w-4 h-4 text-white" /> :
                        <div className="w-2 h-2 rounded-full bg-gray-700" />}
                    </div>
                    <p className="text-[9px] text-gray-500 mt-1 text-center max-w-[52px]">
                      {investigationLabel[step].replace('Pending e-QIP', 'e-QIP').replace('Under Investigation', 'Investigating').replace('In Adjudication', 'Adjudication')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Clearance Level', value: <ClearanceBadge level={candidate.clearanceLevel} /> },
              { label: 'Current Status', value: <StatusBadge status={candidate.clearanceStatus} /> },
              { label: 'Sponsor Agency', value: candidate.clearanceSponsor },
              { label: 'Days Pending', value: candidate.clearanceStatus === 'granted' ? 'Granted' : `${candidate.daysPending}d` },
              { label: 'Education', value: candidate.educationLevel },
              { label: 'Experience', value: `${candidate.yearsExperience} yrs` },
              { label: 'Polygraph', value: candidate.polygraphRequired ? 'Required' : 'Not required' },
              { label: 'US Citizen', value: candidate.usCitizen ? 'Yes' : 'No' },
            ].map(f => (
              <div key={f.label} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{f.label}</p>
                <div className="text-white text-sm font-medium">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-semibold text-gray-300 mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.keySkills.map(s => (
                <span key={s} className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs">{s}</span>
              ))}
            </div>
          </div>

          {/* Program */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Associated Program</p>
            <p className="text-white font-medium text-sm">{candidate.programName}</p>
          </div>

          {/* Estimated grant date */}
          {candidate.estimatedGrantDate && (
            <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <Clock className="w-4 h-4 text-amber-400" />
              Estimated grant date: <strong>{candidate.estimatedGrantDate}</strong>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const ClearancePipelineTab: React.FC<ClearancePipelineTabProps> = ({ tier }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<ClearanceLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | 'all'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<ClearedCandidate | null>(null);
  const [view, setView] = useState<'pipeline' | 'metrics'>('pipeline');

  const isAuthorized = tier !== 'basic';

  const filtered = SAMPLE_CANDIDATES.filter(c => {
    const matchSearch = c.displayToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.stemDiscipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetOccupation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = levelFilter === 'all' || c.clearanceLevel === levelFilter;
    const matchStatus = statusFilter === 'all' || c.clearanceStatus === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Clearance Pipeline Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Track clearance-eligible candidates across agency hiring pipelines · OPM/DCSA coordination
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sync DCSA
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tier gate */}
      {!isAuthorized && (
        <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-300 font-medium text-sm">Regional or National Plan required</p>
            <p className="text-purple-400/70 text-xs mt-1">
              Clearance pipeline management requires agency MOA execution and Regional or National tier access.
              Contact your federal account manager to enable.
            </p>
          </div>
        </div>
      )}

      {/* Metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total in Pipeline', value: PIPELINE_METRICS.totalInPipeline, color: '#3b82f6' },
          { icon: CheckCircle, label: 'Granted This Quarter', value: PIPELINE_METRICS.grantedThisQuarter, color: '#22c55e' },
          { icon: Clock, label: 'Avg Days to Grant', value: `${PIPELINE_METRICS.averageDaysToGrant}d`, color: '#f59e0b' },
          { icon: TrendingUp, label: 'Adjudication Rate', value: `${PIPELINE_METRICS.adjudicationRate}%`, color: '#a855f7' },
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

      {/* Clearance level breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Pipeline by Clearance Level</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PIPELINE_METRICS.byLevel.map(item => (
            <div key={item.level} className="text-center p-3 rounded-xl" style={{ backgroundColor: `${clearanceLevelColor[item.level]}12`, border: `1px solid ${clearanceLevelColor[item.level]}25` }}>
              <p className="text-2xl font-bold" style={{ color: clearanceLevelColor[item.level] }}>{item.count}</p>
              <p className="text-xs text-gray-400 mt-1">{item.level}</p>
              <p className="text-xs text-gray-600 mt-0.5">~{item.avgDays}d avg</p>
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['pipeline', 'metrics'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {v === 'pipeline' ? 'Candidate Pipeline' : 'Status Breakdown'}
          </button>
        ))}
      </div>

      {/* Pipeline view */}
      {view === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by token, discipline, region..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value as ClearanceLevel | 'all')}
              className="bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Confidential">Confidential</option>
              <option value="Secret">Secret</option>
              <option value="Top Secret">Top Secret</option>
              <option value="TS/SCI">TS/SCI</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as InvestigationStatus | 'all')}
              className="bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="initiated">Initiated</option>
              <option value="pending_eqip">Pending e-QIP</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="adjudication">In Adjudication</option>
              <option value="interim">Interim</option>
              <option value="granted">Granted</option>
            </select>
          </div>

          {/* Candidate list */}
          <div className="space-y-3">
            {filtered.map(candidate => (
              <motion.div
                key={candidate.id}
                layout
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold">{candidate.displayToken}</p>
                        <ClearanceBadge level={candidate.clearanceLevel} />
                        {candidate.polygraphRequired && (
                          <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded font-medium">POLY REQ</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{candidate.stemDiscipline} · {candidate.educationLevel} · {candidate.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={candidate.clearanceStatus} />
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-800 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Target Role</p>
                    <p className="text-gray-200 font-medium mt-0.5 truncate">{candidate.targetOccupation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sponsor</p>
                    <p className="text-gray-200 font-medium mt-0.5">{candidate.clearanceSponsor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {candidate.clearanceStatus === 'granted' ? 'Days to Grant' : 'Days Pending'}
                    </p>
                    <p className={`font-medium mt-0.5 ${
                      candidate.clearanceStatus === 'granted' ? 'text-emerald-400' :
                      candidate.daysPending > 400 ? 'text-red-400' :
                      candidate.daysPending > 250 ? 'text-amber-400' :
                      'text-gray-200'
                    }`}>
                      {candidate.clearanceStatus === 'granted' ? 'Granted ✓' : `${candidate.daysPending}d`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Est. Grant</p>
                    <p className="text-gray-200 font-medium mt-0.5">
                      {candidate.estimatedGrantDate || (candidate.clearanceStatus === 'granted' ? 'Completed' : '—')}
                    </p>
                  </div>
                </div>

                {/* Skills row */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {candidate.keySkills.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">{s}</span>
                  ))}
                  {candidate.keySkills.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-500 rounded text-xs">+{candidate.keySkills.length - 4} more</span>
                  )}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No candidates match your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metrics / Status Breakdown view */}
      {view === 'metrics' && (
        <div className="space-y-5">
          {/* Investigation status breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Investigation Status Breakdown</h3>
            <div className="space-y-3">
              {PIPELINE_METRICS.byStatus.map(item => {
                const pct = Math.round((item.count / PIPELINE_METRICS.totalInPipeline) * 100);
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-36">{investigationLabel[item.status]}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{item.count}</span>
                    <span className="text-gray-500 text-xs w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DCSA / OPM coordination notice */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              OPM/DCSA Coordination
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'SF-86 Submissions Pending Review', value: '42', status: 'warn' },
                { label: 'e-QIP Packages Awaiting Completion', value: '28', status: 'warn' },
                { label: 'DCSA Investigation Requests Open', value: '134', status: 'info' },
                { label: 'Adjudication Decisions Expected (30d)', value: '23', status: 'info' },
                { label: 'Interim Clearances Active', value: '23', status: 'ok' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300">{row.label}</span>
                  <span className={`font-bold ${
                    row.status === 'warn' ? 'text-amber-400' :
                    row.status === 'ok' ? 'text-emerald-400' :
                    'text-blue-400'
                  }`}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
              Data synchronized with DCSA Secure Web Fingerprint Transmission (SWFT) portal daily at 06:00 ET.
              Contact your FSO for real-time investigation status updates.
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClearancePipelineTab;
