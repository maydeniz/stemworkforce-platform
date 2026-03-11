// ===========================================
// Policy Impact Modeling Tab
// Workforce impact analysis for federal legislation
// CHIPS Act · IIJA · IRA · NSF CHIPS R&D
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Cpu,
  Zap,
  FlaskConical,
  HardHat,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

export interface PolicyImpactTabProps {
  partnerId: string;
  tier: string;
}

interface LegislationScenario {
  id: string;
  name: string;
  shortName: string;
  status: 'enacted' | 'proposed' | 'modeling';
  icon: React.ElementType;
  color: string;
  totalFunding: string;
  workforceFundingPct: number;
  jobsCreated: number;
  jobsRetrained: number;
  timeHorizon: string;
  primarySectors: string[];
  talentGap: number;
  readinessScore: number;
  keyOccupations: { title: string; onetCode: string; demand: number; supply: number }[];
  regionImpact: { region: string; jobs: number; readiness: 'high' | 'medium' | 'low' }[];
}

type ModelingVariable = 'jobs' | 'wages' | 'timeline' | 'readiness';

// ===========================================
// SAMPLE LEGISLATION DATA
// Based on enacted and proposed federal law
// ===========================================

const LEGISLATION_SCENARIOS: LegislationScenario[] = [
  {
    id: 'chips',
    name: 'CHIPS and Science Act',
    shortName: 'CHIPS Act',
    status: 'enacted',
    icon: Cpu,
    color: '#6366f1',
    totalFunding: '$52.7B',
    workforceFundingPct: 8,
    jobsCreated: 115000,
    jobsRetrained: 42000,
    timeHorizon: '2023–2030',
    primarySectors: ['Semiconductor Manufacturing', 'Advanced Electronics', 'R&D'],
    talentGap: 67000,
    readinessScore: 58,
    keyOccupations: [
      { title: 'Semiconductor Process Technician', onetCode: '51-9141', demand: 45000, supply: 18000 },
      { title: 'Electrical Engineer', onetCode: '17-2071', demand: 22000, supply: 14000 },
      { title: 'Materials Scientist', onetCode: '19-2032', demand: 12000, supply: 8500 },
      { title: 'Cleanroom Technician', onetCode: '51-9199', demand: 18000, supply: 6000 },
    ],
    regionImpact: [
      { region: 'Southwest (AZ, NM)', jobs: 28000, readiness: 'medium' },
      { region: 'Great Lakes (OH, MI, NY)', jobs: 32000, readiness: 'high' },
      { region: 'Southeast (TX, NC)', jobs: 25000, readiness: 'medium' },
      { region: 'Pacific Northwest (OR, WA)', jobs: 18000, readiness: 'high' },
      { region: 'Mid-Atlantic (VA, MD)', jobs: 12000, readiness: 'low' },
    ],
  },
  {
    id: 'iija',
    name: 'Infrastructure Investment and Jobs Act',
    shortName: 'IIJA / BIL',
    status: 'enacted',
    icon: HardHat,
    color: '#f59e0b',
    totalFunding: '$1.2T',
    workforceFundingPct: 3,
    jobsCreated: 800000,
    jobsRetrained: 120000,
    timeHorizon: '2022–2031',
    primarySectors: ['Construction', 'Civil Engineering', 'Transportation', 'Grid Modernization'],
    talentGap: 430000,
    readinessScore: 44,
    keyOccupations: [
      { title: 'Civil Engineer', onetCode: '17-2051', demand: 95000, supply: 62000 },
      { title: 'Electrician', onetCode: '47-2111', demand: 180000, supply: 98000 },
      { title: 'Construction Project Manager', onetCode: '11-9021', demand: 72000, supply: 48000 },
      { title: 'Environmental Engineer', onetCode: '17-2081', demand: 38000, supply: 29000 },
    ],
    regionImpact: [
      { region: 'Midwest (IL, IN, MO)', jobs: 145000, readiness: 'medium' },
      { region: 'South (TX, FL, GA)', jobs: 198000, readiness: 'low' },
      { region: 'Northeast (NY, PA, MA)', jobs: 112000, readiness: 'high' },
      { region: 'Mountain West (CO, UT, NV)', jobs: 87000, readiness: 'medium' },
      { region: 'Pacific Coast (CA, OR, WA)', jobs: 156000, readiness: 'medium' },
    ],
  },
  {
    id: 'ira',
    name: 'Inflation Reduction Act — Clean Energy',
    shortName: 'IRA Clean Energy',
    status: 'enacted',
    icon: Zap,
    color: '#22c55e',
    totalFunding: '$369B',
    workforceFundingPct: 5,
    jobsCreated: 550000,
    jobsRetrained: 95000,
    timeHorizon: '2023–2032',
    primarySectors: ['Solar', 'Wind', 'Battery Storage', 'EV Manufacturing', 'Grid'],
    talentGap: 290000,
    readinessScore: 51,
    keyOccupations: [
      { title: 'Solar Photovoltaic Installer', onetCode: '47-2231', demand: 120000, supply: 48000 },
      { title: 'Wind Turbine Technician', onetCode: '49-9081', demand: 65000, supply: 22000 },
      { title: 'Battery Engineer', onetCode: '17-2199', demand: 42000, supply: 18000 },
      { title: 'EV Charging Infrastructure Tech', onetCode: '49-2097', demand: 55000, supply: 12000 },
    ],
    regionImpact: [
      { region: 'Southwest Solar Belt (CA, AZ, NV)', jobs: 142000, readiness: 'high' },
      { region: 'Wind Corridor (TX, OK, KS)', jobs: 98000, readiness: 'medium' },
      { region: 'Rust Belt Transition (PA, OH, MI)', jobs: 87000, readiness: 'low' },
      { region: 'Southeast (TN, GA, AL)', jobs: 72000, readiness: 'low' },
      { region: 'Mountain West (CO, WY, MT)', jobs: 45000, readiness: 'medium' },
    ],
  },
  {
    id: 'nsf_chips',
    name: 'NSF CHIPS R&D Programs',
    shortName: 'NSF CHIPS R&D',
    status: 'modeling',
    icon: FlaskConical,
    color: '#a855f7',
    totalFunding: '$11B',
    workforceFundingPct: 25,
    jobsCreated: 28000,
    jobsRetrained: 8000,
    timeHorizon: '2024–2029',
    primarySectors: ['Semiconductor R&D', 'Microelectronics', 'STEM Education', 'National Labs'],
    talentGap: 18000,
    readinessScore: 72,
    keyOccupations: [
      { title: 'Research Scientist, Semiconductors', onetCode: '17-2199', demand: 8500, supply: 6200 },
      { title: 'Postdoctoral Researcher', onetCode: '25-1199', demand: 4200, supply: 3100 },
      { title: 'Materials Engineer', onetCode: '17-2131', demand: 6800, supply: 4900 },
      { title: 'Fab Process Engineer', onetCode: '17-3026', demand: 9500, supply: 3800 },
    ],
    regionImpact: [
      { region: 'University Hubs (MA, CA, TX)', jobs: 9500, readiness: 'high' },
      { region: 'National Lab Corridors (NM, TN, IL)', jobs: 6200, readiness: 'high' },
      { region: 'Emerging Tech Hubs (AZ, OH, NY)', jobs: 7400, readiness: 'medium' },
      { region: 'Rural Expansion Sites', jobs: 4900, readiness: 'low' },
    ],
  },
];

// ===========================================
// HELPER COMPONENTS
// ===========================================

const GapBar: React.FC<{ demand: number; supply: number; color: string }> = ({ demand, supply, color }) => {
  const supplyPct = Math.min(100, Math.round((supply / demand) * 100));
  const gap = demand - supply;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Supply: {supply.toLocaleString()}</span>
        <span className="text-red-400">Gap: {gap.toLocaleString()}</span>
        <span>Demand: {demand.toLocaleString()}</span>
      </div>
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${supplyPct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-right text-xs mt-0.5" style={{ color }}>
        {supplyPct}% filled
      </div>
    </div>
  );
};

const ReadinessBadge: React.FC<{ score: 'high' | 'medium' | 'low' }> = ({ score }) => {
  const map = {
    high: { label: 'High Readiness', cls: 'bg-emerald-500/20 text-emerald-400' },
    medium: { label: 'Medium Readiness', cls: 'bg-amber-500/20 text-amber-400' },
    low: { label: 'Low Readiness', cls: 'bg-red-500/20 text-red-400' },
  };
  const { label, cls } = map[score];
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const PolicyImpactTab: React.FC<PolicyImpactTabProps> = ({ tier }) => {
  const [selected, setSelected] = useState<LegislationScenario>(LEGISLATION_SCENARIOS[0]);
  const [modelVar, setModelVar] = useState<ModelingVariable>('jobs');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isAdvanced = tier === 'national' || tier === 'pilot';

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const ScenarioCard = ({ scenario }: { scenario: LegislationScenario }) => {
    const Icon = scenario.icon;
    const isActive = selected.id === scenario.id;
    return (
      <button
        onClick={() => setSelected(scenario)}
        className={`text-left p-4 rounded-xl border transition-all ${
          isActive
            ? 'border-blue-500/50 bg-blue-500/[0.08]'
            : 'border-gray-800 bg-gray-900 hover:border-gray-700'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${scenario.color}20` }}>
            <Icon className="w-4 h-4" style={{ color: scenario.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{scenario.shortName}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              scenario.status === 'enacted' ? 'bg-emerald-500/20 text-emerald-400' :
              scenario.status === 'proposed' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {scenario.status.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500">{scenario.totalFunding} total · {scenario.timeHorizon}</p>
      </button>
    );
  };

  const modelVarTabs: { id: ModelingVariable; label: string }[] = [
    { id: 'jobs', label: 'Jobs Created' },
    { id: 'wages', label: 'Wage Impact' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'readiness', label: 'Readiness' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Policy Impact Modeling</h2>
          <p className="text-sm text-gray-400 mt-1">
            Model workforce requirements for enacted and proposed federal legislation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Advanced tier gate */}
      {!isAdvanced && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-medium text-sm">National Plan feature</p>
            <p className="text-amber-400/70 text-xs mt-1">
              Upgrade to the National plan to unlock live BLS/EMSI data feeds, custom scenario modeling,
              and OMB-formatted impact reports.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: legislation selector */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legislation</h3>
          {LEGISLATION_SCENARIOS.map(s => <ScenarioCard key={s.id} scenario={s} />)}
        </div>

        {/* Right: detail panels */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top KPIs */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selected.color}20` }}>
                <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-sm text-gray-400">
                  {selected.totalFunding} · {selected.workforceFundingPct}% workforce investment · {selected.timeHorizon}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { icon: Users, label: 'Jobs Created', value: selected.jobsCreated.toLocaleString(), color: selected.color },
                { icon: Target, label: 'Talent Gap', value: selected.talentGap.toLocaleString(), color: '#ef4444' },
                { icon: Users, label: 'Workers Retrained', value: selected.jobsRetrained.toLocaleString(), color: '#22c55e' },
                { icon: BarChart3, label: 'Workforce Readiness', value: `${selected.readinessScore}%`, color: selected.readinessScore > 65 ? '#22c55e' : selected.readinessScore > 45 ? '#f59e0b' : '#ef4444' },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                    <span className="text-xs text-gray-400">{kpi.label}</span>
                  </div>
                  <p className="text-xl font-bold text-white">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Modeling variable tabs */}
            <div className="flex gap-2 mb-4">
              {modelVarTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setModelVar(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    modelVar === t.id
                      ? 'text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                  style={modelVar === t.id ? { backgroundColor: selected.color } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Panel: Jobs Created */}
            {modelVar === 'jobs' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Occupation-Level Demand vs. Supply
                </h4>
                {selected.keyOccupations.map((occ) => (
                  <div key={occ.onetCode} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">{occ.title}</span>
                      <span className="text-xs text-gray-500">O*NET {occ.onetCode}</span>
                    </div>
                    <GapBar demand={occ.demand} supply={occ.supply} color={selected.color} />
                  </div>
                ))}
              </div>
            )}

            {/* Panel: Wage Impact */}
            {modelVar === 'wages' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Projected Wage Impact by Occupation
                </h4>
                <div className="space-y-3">
                  {selected.keyOccupations.map((occ, i) => {
                    const baseWage = 52000 + i * 8000;
                    const projectedWage = Math.round(baseWage * 1.18);
                    const increase = projectedWage - baseWage;
                    return (
                      <div key={occ.onetCode} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                        <div>
                          <p className="text-white text-sm font-medium">{occ.title}</p>
                          <p className="text-gray-400 text-xs">Current median: ${baseWage.toLocaleString()}/yr</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${projectedWage.toLocaleString()}/yr</p>
                          <p className="text-emerald-400 text-xs">+${increase.toLocaleString()} projected</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Panel: Timeline */}
            {modelVar === 'timeline' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Workforce Ramp-Up Timeline
                </h4>
                <div className="relative pl-6">
                  {[
                    { year: 'Year 1–2', milestone: 'Program design, curriculum development, instructor training', pct: 15 },
                    { year: 'Year 2–3', milestone: 'First cohorts enrolled, apprenticeship agreements signed', pct: 35 },
                    { year: 'Year 3–5', milestone: 'Peak enrollment, industry hiring accelerates', pct: 70 },
                    { year: 'Year 5–7', milestone: 'Credential ecosystem mature, pipeline self-sustaining', pct: 90 },
                    { year: selected.timeHorizon.split('–')[1], milestone: 'Full workforce target achieved', pct: 100 },
                  ].map((phase, i) => (
                    <div key={i} className="flex gap-4 mb-6 last:mb-0">
                      <div className="absolute left-0 top-0 flex flex-col items-center" style={{ marginTop: `${i * 72}px` }}>
                        <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: selected.color, backgroundColor: `${selected.color}40` }} />
                        {i < 4 && <div className="w-px h-14 bg-gray-700 mt-1" />}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-semibold" style={{ color: selected.color }}>{phase.year}</p>
                        <p className="text-gray-300 text-sm">{phase.milestone}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-32 h-1.5 bg-gray-800 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${phase.pct}%`, backgroundColor: selected.color }} />
                          </div>
                          <span className="text-xs text-gray-500">{phase.pct}% of target</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Panel: Readiness */}
            {modelVar === 'readiness' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Regional Workforce Readiness
                </h4>
                <div className="space-y-3">
                  {selected.regionImpact.map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{region.region}</p>
                        <p className="text-gray-400 text-xs">{region.jobs.toLocaleString()} projected jobs</p>
                      </div>
                      <ReadinessBadge score={region.readiness} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-300 text-sm font-medium">Overall Readiness Score</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${selected.readinessScore}%`, backgroundColor: selected.color }}
                      />
                    </div>
                    <span className="text-white font-bold">{selected.readinessScore}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sectors covered */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Primary Sectors</h4>
              <div className="flex flex-wrap gap-2">
                {selected.primarySectors.map(s => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium border border-gray-700 text-gray-300 bg-gray-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modeling Notes collapsible */}
            <button
              onClick={() => setExpanded(expanded === 'notes' ? null : 'notes')}
              className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Modeling Methodology &amp; Data Sources
              </span>
              {expanded === 'notes' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expanded === 'notes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-900 border border-gray-800 border-t-0 rounded-b-xl px-5 pb-5"
              >
                <ul className="space-y-2 text-sm text-gray-400 pt-4">
                  <li>• <strong className="text-gray-300">Demand data:</strong> BLS Occupational Outlook Handbook, EMSI/Lightcast industry projections, agency program targets</li>
                  <li>• <strong className="text-gray-300">Supply data:</strong> NSC graduation rates by CIP code, state credential data, RAPIDS apprenticeship completions</li>
                  <li>• <strong className="text-gray-300">Regional readiness:</strong> Composite of training capacity, employer density, and prior program performance</li>
                  <li>• <strong className="text-gray-300">Timeline assumptions:</strong> Based on historical ramp-up rates for comparable federal workforce programs (DOL ETA, NSF)</li>
                  <li>• <strong className="text-gray-300">Update cadence:</strong> Data refreshed quarterly from BLS, monthly from EMSI; legislation targets from DOL/DOE published guidance</li>
                </ul>
              </motion.div>
            )}

            {/* Export row */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Export OMB-Format Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                <TrendingUp className="w-4 h-4" />
                Compare Scenarios
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PolicyImpactTab;
