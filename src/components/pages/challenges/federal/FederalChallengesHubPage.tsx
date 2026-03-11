import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import {
  Shield, Search, ChevronRight, Clock, Building2, Lock,
  AlertTriangle, CheckCircle, ArrowRight, DollarSign,
  Filter, X, Star, Users, FileText, Globe, Zap,
  Award, Target, Flag, BookOpen, ExternalLink
} from 'lucide-react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ClassificationLevel = 'unclassified' | 'cui' | 'secret' | 'top-secret' | 'ts-sci';
type AwardMechanism = 'prize' | 'subaward' | 'ota' | 'sbir-phase2' | 'contract';
type ChallengeStatus = 'open' | 'upcoming' | 'evaluating' | 'closed';
type EligibilityFlag =
  | 'us-entity'
  | 'clearance'
  | 'itar'
  | 'sam'
  | 'membership'
  | 'cui-access'
  | 'foci'
  | 'small-biz';

interface FederalChallenge {
  id: string;
  slug: string;
  title: string;
  agency: string;
  subAgency: string;
  agencyIcon: string;
  classification: ClassificationLevel;
  awardMechanism: AwardMechanism;
  awardMin: number;
  awardMax: number;
  deadline: string;
  status: ChallengeStatus;
  techDomains: string[];
  eligibilityFlags: EligibilityFlag[];
  entityTypes: string[];
  description: string;
  phases: number;
  featured?: boolean;
  authorityBasis: string;
}

// ─────────────────────────────────────────────
// STYLE CONFIGS (static — never dynamic)
// ─────────────────────────────────────────────

const CLASSIFICATION_STYLES: Record<ClassificationLevel, { label: string; bg: string; text: string; border: string }> = {
  'unclassified': { label: 'UNCLASSIFIED', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'cui':          { label: 'CUI',          bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30'   },
  'secret':       { label: 'SECRET',       bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30'     },
  'top-secret':   { label: 'TOP SECRET',   bg: 'bg-red-700/25',     text: 'text-red-300',     border: 'border-red-600/30'     },
  'ts-sci':       { label: 'TS/SCI',       bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/30'  },
};

const AWARD_STYLES: Record<AwardMechanism, { label: string; bg: string; text: string }> = {
  'prize':      { label: 'Prize Competition',  bg: 'bg-blue-500/15',    text: 'text-blue-400'    },
  'subaward':   { label: 'Subaward Agreement', bg: 'bg-violet-500/15',  text: 'text-violet-400'  },
  'ota':        { label: 'OTA Prototype',      bg: 'bg-teal-500/15',    text: 'text-teal-400'    },
  'sbir-phase2':{ label: 'SBIR Phase II',      bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  'contract':   { label: 'Follow-On Contract', bg: 'bg-orange-500/15',  text: 'text-orange-400'  },
};

const STATUS_STYLES: Record<ChallengeStatus, { label: string; dot: string; text: string }> = {
  'open':       { label: 'Open',       dot: 'bg-emerald-400', text: 'text-emerald-400' },
  'upcoming':   { label: 'Upcoming',   dot: 'bg-blue-400',    text: 'text-blue-400'    },
  'evaluating': { label: 'Evaluating', dot: 'bg-amber-400',   text: 'text-amber-400'   },
  'closed':     { label: 'Closed',     dot: 'bg-slate-500',   text: 'text-slate-400'   },
};

const FLAG_CONFIG: Record<EligibilityFlag, { label: string; icon: string }> = {
  'us-entity':  { label: 'U.S. Entity Only',        icon: '🇺🇸' },
  'clearance':  { label: 'Clearance Required',       icon: '🔐' },
  'itar':       { label: 'ITAR Screened',            icon: '⚠️' },
  'sam':        { label: 'SAM.gov Required',         icon: '📋' },
  'membership': { label: 'Membership Required',      icon: '🏛️' },
  'cui-access': { label: 'CUI Problem Statement',    icon: '🔒' },
  'foci':       { label: 'FOCI Disclosure Required', icon: '📝' },
  'small-biz':  { label: 'Small Business Focus',     icon: '🏢' },
};

// ─────────────────────────────────────────────
// CHALLENGE DATA (based on real federal programs)
// ─────────────────────────────────────────────

const FEDERAL_CHALLENGES: FederalChallenge[] = [
  {
    id: 'americamakes-2026-dod-oib',
    slug: 'america-makes-2026-dod-oib',
    title: '2026 DoD OIB Modernization Challenge',
    agency: 'Department of Defense',
    subAgency: 'OSD ManTech / America Makes (NCDMM)',
    agencyIcon: '🏛️',
    classification: 'unclassified',
    awardMechanism: 'subaward',
    awardMin: 10_000_000,
    awardMax: 25_000_000,
    deadline: '2026-04-02',
    status: 'open',
    techDomains: ['Advanced Manufacturing', 'AI/ML', 'Robotics', 'Digital Operations'],
    eligibilityFlags: ['us-entity', 'membership', 'sam', 'itar', 'foci'],
    entityTypes: ['Company', 'University', 'Research Institution'],
    description:
      'Multi-topic project call for additive manufacturing technologies to modernize DoD Organic Industrial Base facilities. All proposals must leverage AM. TRL 4→7 maturation required.',
    phases: 1,
    featured: true,
    authorityBasis: '10 USC 4025 / AFRL Agreement FA8650-20-2-5700',
  },
  {
    id: 'darpa-assured-micro',
    slug: 'darpa-assured-microelectronics-2026',
    title: 'DARPA Assured Microelectronics Challenge',
    agency: 'DARPA',
    subAgency: 'Microsystems Technology Office (MTO)',
    agencyIcon: '⚛️',
    classification: 'secret',
    awardMechanism: 'ota',
    awardMin: 3_000_000,
    awardMax: 15_000_000,
    deadline: '2026-05-15',
    status: 'open',
    techDomains: ['Semiconductors', 'Hardware Security', 'VLSI Design', 'Trusted Supply Chain'],
    eligibilityFlags: ['us-entity', 'clearance', 'itar', 'sam', 'foci'],
    entityTypes: ['Company', 'Research Institution'],
    description:
      'Develop hardware security primitives and trusted microelectronics supply chain solutions for defense-critical systems. SECRET facility clearance required for finalist evaluation.',
    phases: 3,
    featured: true,
    authorityBasis: '10 USC 4025 / 10 USC 4022 (OTA)',
  },
  {
    id: 'afwerx-agility-prime',
    slug: 'afwerx-agility-prime-evtol-2026',
    title: 'AFWERX Agility Prime eVTOL Commercialization',
    agency: 'Department of the Air Force',
    subAgency: 'AFWERX / Air Force Research Laboratory',
    agencyIcon: '✈️',
    classification: 'unclassified',
    awardMechanism: 'ota',
    awardMin: 1_500_000,
    awardMax: 5_000_000,
    deadline: '2026-06-01',
    status: 'upcoming',
    techDomains: ['eVTOL', 'Electric Aviation', 'Autonomy', 'Advanced Propulsion'],
    eligibilityFlags: ['us-entity', 'sam', 'itar', 'small-biz'],
    entityTypes: ['Startup', 'Small Business', 'Company'],
    description:
      'Accelerate dual-use commercialization of electric vertical take-off and landing vehicles. OTA Prototype Path with follow-on production potential. Nontraditional contractors preferred.',
    phases: 2,
    featured: false,
    authorityBasis: '10 USC 4022 (OTA) / 15 USC 638 (SBIR)',
  },
  {
    id: 'army-xtech-s4',
    slug: 'army-xtech-2026-search-four',
    title: 'xTech Search 4.0 — Army Modernization Priorities',
    agency: 'Department of the Army',
    subAgency: 'Army Futures Command / DEVCOM',
    agencyIcon: '⭐',
    classification: 'unclassified',
    awardMechanism: 'prize',
    awardMin: 50_000,
    awardMax: 250_000,
    deadline: '2026-03-30',
    status: 'open',
    techDomains: ['AI/ML', 'Counter-UAS', 'Soldier Systems', 'Logistics Automation'],
    eligibilityFlags: ['us-entity', 'sam', 'itar', 'small-biz'],
    entityTypes: ['Startup', 'Small Business', 'Company', 'University'],
    description:
      'Open innovation prize competition for Army top modernization priorities. White paper → pitch at AUSA. Winner eligible for SBIR Direct to Phase II award ($1.7M).',
    phases: 2,
    featured: false,
    authorityBasis: '15 USC 3719 (America COMPETES) / 10 USC 4025',
  },
  {
    id: 'navy-sbir-propulsion',
    slug: 'navy-sbir-advanced-propulsion-2026',
    title: 'Navy Advanced Propulsion SBIR Direct to Phase II',
    agency: 'Department of the Navy',
    subAgency: 'NAVSEA / Office of Naval Research',
    agencyIcon: '⚓',
    classification: 'cui',
    awardMechanism: 'sbir-phase2',
    awardMin: 1_700_000,
    awardMax: 1_700_000,
    deadline: '2026-04-15',
    status: 'open',
    techDomains: ['Naval Propulsion', 'Energy Storage', 'Thermal Management', 'Power Electronics'],
    eligibilityFlags: ['us-entity', 'sam', 'itar', 'foci', 'cui-access', 'small-biz'],
    entityTypes: ['Small Business'],
    description:
      'SBIR Direct to Phase II for advanced propulsion in unmanned undersea vehicles. CUI problem statement — full details released after eligibility verification. ≤500 employees required.',
    phases: 1,
    featured: false,
    authorityBasis: '15 USC 638 (SBIR/STTR Act)',
  },
  {
    id: 'socom-advanced-materials',
    slug: 'socom-advanced-materials-2026',
    title: 'SOCOM Advanced Materials & Manufacturing Challenge',
    agency: 'U.S. Special Operations Command',
    subAgency: 'SOFWERX / SOCOM Science & Technology',
    agencyIcon: '🎯',
    classification: 'cui',
    awardMechanism: 'subaward',
    awardMin: 2_000_000,
    awardMax: 8_000_000,
    deadline: '2026-05-01',
    status: 'upcoming',
    techDomains: ['Advanced Materials', 'Additive Manufacturing', 'Ballistic Protection', 'Thermal Camouflage'],
    eligibilityFlags: ['us-entity', 'sam', 'itar', 'foci', 'cui-access', 'clearance'],
    entityTypes: ['Company', 'Research Institution'],
    description:
      'Multi-phase challenge for advanced materials supporting special operations forces. CUI problem statement. Finalists must hold or obtain Secret facility clearance through DCSA.',
    phases: 3,
    featured: false,
    authorityBasis: '10 USC 4025 / 10 USC 4022 (OTA)',
  },
];

const ALL_AGENCIES = ['All Agencies', 'Department of Defense', 'DARPA', 'Department of the Air Force', 'Department of the Army', 'Department of the Navy', 'U.S. Special Operations Command'];
const ALL_CLASSIFICATIONS: Array<{ value: ClassificationLevel | 'all'; label: string }> = [
  { value: 'all', label: 'All Levels' },
  { value: 'unclassified', label: 'Unclassified' },
  { value: 'cui', label: 'CUI' },
  { value: 'secret', label: 'Secret' },
  { value: 'top-secret', label: 'Top Secret' },
  { value: 'ts-sci', label: 'TS/SCI' },
];
const ALL_MECHANISMS: Array<{ value: AwardMechanism | 'all'; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'prize', label: 'Prize Competition' },
  { value: 'subaward', label: 'Subaward Agreement' },
  { value: 'ota', label: 'OTA Prototype' },
  { value: 'sbir-phase2', label: 'SBIR Phase II' },
];
const ALL_STATUSES: Array<{ value: ChallengeStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'evaluating', label: 'Evaluating' },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getDaysRemaining(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatAward(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    return `$${(n / 1_000).toFixed(0)}K`;
  };
  return min === max ? fmt(max) : `${fmt(min)}–${fmt(max)}`;
}

// ─────────────────────────────────────────────
// QUICK ELIGIBILITY MODAL
// ─────────────────────────────────────────────

interface QuickGate {
  id: string;
  question: string;
  subtext: string;
  passAnswer: boolean; // true = "Yes" passes, false = "No" passes
}

const QUICK_GATES: QuickGate[] = [
  {
    id: 'citizenship',
    question: 'Are you a U.S. citizen or permanent resident?',
    subtext: 'Required for individual participants under 15 USC 3719(g)(2). Entities must have primary U.S. operations.',
    passAnswer: true,
  },
  {
    id: 'us-entity',
    question: 'Is your organization incorporated in the United States with its primary place of business in the U.S.?',
    subtext: 'Required for entity participants under 15 USC 3719(g)(3). Applies to companies, universities, and research institutions.',
    passAnswer: true,
  },
  {
    id: 'itar-country',
    question: 'Are you NOT a citizen or national of an ITAR §126.1-restricted country?',
    subtext: 'Restricted countries include Iran, China, Russia, North Korea, Syria, Cuba, Belarus, Venezuela (Maduro government), and others. See 22 CFR §126.1 for full list.',
    passAnswer: true,
  },
];

type QuickAnswer = 'yes' | 'no' | null;

function QuickEligibilityModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [answers, setAnswers] = useState<Record<string, QuickAnswer>>({});

  const allAnswered = QUICK_GATES.every(g => answers[g.id] !== undefined && answers[g.id] !== null);
  const anyFailed = QUICK_GATES.some(g => {
    const a = answers[g.id];
    if (a === null || a === undefined) return false;
    return g.passAnswer ? a === 'no' : a === 'yes';
  });

  const handleAnswer = useCallback((gateId: string, answer: QuickAnswer) => {
    setAnswers(prev => ({ ...prev, [gateId]: answer }));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-bold">Quick Eligibility Check</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-slate-400 text-sm">
            Answer 3 baseline questions to see if you meet the minimum federal eligibility requirements.
            This does not replace the full per-challenge eligibility gate.
          </p>

          {QUICK_GATES.map((gate, idx) => (
            <div key={gate.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-white text-sm font-medium mb-1">
                <span className="text-slate-500 font-mono mr-2">{String(idx + 1).padStart(2, '0')}</span>
                {gate.question}
              </p>
              <p className="text-slate-500 text-xs mb-3">{gate.subtext}</p>
              <div className="flex gap-2">
                {(['yes', 'no'] as const).map(ans => {
                  const isPass = gate.passAnswer ? ans === 'yes' : ans === 'no';
                  const selected = answers[gate.id] === ans;
                  return (
                    <button
                      key={ans}
                      onClick={() => handleAnswer(gate.id, ans)}
                      className={`flex-1 py-3 rounded-lg text-sm font-semibold border transition-all capitalize ${
                        selected
                          ? isPass
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-red-500/20 border-red-500/50 text-red-300'
                          : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {ans}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border ${anyFailed ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}
            >
              {anyFailed ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-semibold text-sm mb-1">Baseline Requirements Not Met</p>
                    <p className="text-red-300/80 text-xs">Based on your answers, you may not meet the minimum federal participation requirements. Review the specific statutory requirements or consult a compliance attorney before applying.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-300 font-semibold text-sm mb-1">Baseline Eligible</p>
                    <p className="text-emerald-300/80 text-xs">You meet the baseline requirements. Each challenge has additional eligibility gates — review the specific challenge's requirements before submitting.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">
            Close
          </button>
          {allAnswered && !anyFailed && (
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('challenges-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Browse Challenges <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHALLENGE CARD
// ─────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: FederalChallenge }) {
  const cls = CLASSIFICATION_STYLES[challenge.classification];
  const aws = AWARD_STYLES[challenge.awardMechanism];
  const sts = STATUS_STYLES[challenge.status];
  const days = getDaysRemaining(challenge.deadline);
  const isUrgent = days <= 14 && days > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition-all group flex flex-col"
    >
      {/* Classification bar */}
      <div className={`px-4 py-1.5 flex items-center justify-between ${cls.bg} border-b ${cls.border}`}>
        <span className={`text-xs font-mono font-bold tracking-widest ${cls.text}`}>{cls.label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${sts.dot}`} />
          <span className={`text-xs font-medium ${sts.text}`}>{sts.label}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Agency */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{challenge.agencyIcon}</span>
          <div>
            <p className="text-xs text-slate-400 font-medium">{challenge.agency}</p>
            <p className="text-xs text-slate-500">{challenge.subAgency}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-blue-300 transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {challenge.description}
        </p>

        {/* Tech domains */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.techDomains.slice(0, 3).map(d => (
            <span key={d} className="px-2 py-0.5 bg-slate-700/60 text-slate-300 text-xs rounded-md">{d}</span>
          ))}
          {challenge.techDomains.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-700/60 text-slate-400 text-xs rounded-md">+{challenge.techDomains.length - 3}</span>
          )}
        </div>

        {/* Award mechanism */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mb-4 w-fit ${aws.bg} ${aws.text}`}>
          <Award className="w-3 h-3" />
          {aws.label}
        </span>

        {/* Eligibility flags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.eligibilityFlags.slice(0, 4).map(flag => (
            <span key={flag} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded">
              <span>{FLAG_CONFIG[flag].icon}</span>
              <span className="hidden sm:inline">{FLAG_CONFIG[flag].label}</span>
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-bold text-sm">{formatAward(challenge.awardMin, challenge.awardMax)}</span>
            <span className={`text-xs flex items-center gap-1 ${isUrgent ? 'text-amber-400' : 'text-slate-400'}`}>
              {isUrgent && <AlertTriangle className="w-3 h-3" />}
              <Clock className="w-3 h-3" />
              {days > 0 ? `${days}d remaining` : 'Deadline passed'}
            </span>
          </div>
          <Link
            to={`/challenges/federal/${challenge.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg transition-all"
          >
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const FederalChallengesHubPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('All Agencies');
  const [classFilter, setClassFilter] = useState<ClassificationLevel | 'all'>('all');
  const [mechanismFilter, setMechanismFilter] = useState<AwardMechanism | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [noticeRead, setNoticeRead] = useState(() => {
    try { return localStorage.getItem('federal-hub-notice-read') === 'true'; } catch { return false; }
  });
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(() => {
    if (noticeRead) {
      try { localStorage.setItem('federal-hub-notice-read', 'true'); } catch { /* noop */ }
    }
  }, [noticeRead]);

  const featured = FEDERAL_CHALLENGES.filter(c => c.featured);

  const filtered = useMemo(() => {
    return FEDERAL_CHALLENGES.filter(c => {
      if (agencyFilter !== 'All Agencies' && c.agency !== agencyFilter) return false;
      if (classFilter !== 'all' && c.classification !== classFilter) return false;
      if (mechanismFilter !== 'all' && c.awardMechanism !== mechanismFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.agency.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.techDomains.some(d => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, agencyFilter, classFilter, mechanismFilter, statusFilter]);

  const activeFilterCount = [
    agencyFilter !== 'All Agencies',
    classFilter !== 'all',
    mechanismFilter !== 'all',
    statusFilter !== 'all',
  ].filter(Boolean).length;

  const totalFunding = FEDERAL_CHALLENGES.reduce((sum, c) => sum + c.awardMax, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Quick eligibility modal */}
      <AnimatePresence>
        {showEligibilityModal && (
          <QuickEligibilityModal onClose={() => setShowEligibilityModal(false)} />
        )}
      </AnimatePresence>

      {/* Regulatory notice banner */}
      <AnimatePresence>
        {!noticeRead && (
          <motion.div
            initial={{ height: 'auto' }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-900/40 border-b border-amber-700/50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-200 text-sm flex-1">
                <span className="font-semibold">Federal Compliance Notice:</span> Challenges on this portal are subject to federal regulations including ITAR (22 CFR 120-130), EAR (15 CFR 730-774), and applicable personnel security requirements. Participation requires U.S. citizenship or permanent residency. Authorized under{' '}
                <span className="font-mono text-amber-300">15 USC 3719</span> and{' '}
                <span className="font-mono text-amber-300">10 USC 4025</span>.
              </p>
              <button onClick={() => setNoticeRead(true)} className="text-amber-400 hover:text-amber-200 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/15 border border-blue-500/30 rounded-xl">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase">Federal Innovation Portal</p>
              <p className="text-slate-500 text-xs">Authorized Challenge Platform</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Government & Defense<br />
            <span className="text-blue-400">Innovation Challenges</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mb-8">
            High-stakes federal challenges from DOD, DARPA, AFWERX, and the military services.
            Prize competitions, OTA prototype paths, subaward agreements, and SBIR opportunities —
            all subject to federal eligibility requirements.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Challenges', value: FEDERAL_CHALLENGES.filter(c => c.status === 'open').length.toString(), icon: Target, color: 'text-blue-400' },
              { label: 'Total Funding Available', value: `$${(totalFunding / 1_000_000).toFixed(0)}M+`, icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Federal Agencies', value: '6', icon: Building2, color: 'text-violet-400' },
              { label: 'Award Mechanisms', value: '5', icon: Award, color: 'text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Eligibility quick check */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowEligibilityModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Check My Eligibility
            </button>
            <Link
              to="/challenges/federal/post"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all border border-slate-600"
            >
              <Flag className="w-4 h-4" />
              Post a Federal Challenge
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Featured challenges */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-semibold text-lg">Featured Open Challenges</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {featured.map(c => {
                const cls = CLASSIFICATION_STYLES[c.classification];
                const days = getDaysRemaining(c.deadline);
                return (
                  <div key={c.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-blue-500/20 rounded-2xl overflow-hidden">
                    <div className={`px-5 py-2 flex items-center justify-between ${cls.bg} border-b ${cls.border}`}>
                      <span className={`text-xs font-mono font-bold tracking-widest ${cls.text}`}>{cls.label}</span>
                      <span className="text-xs text-slate-400 font-mono">{c.authorityBasis}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{c.agencyIcon}</span>
                        <div>
                          <p className="text-xs text-blue-400 font-medium">{c.agency}</p>
                          <p className="text-xs text-slate-500">{c.subAgency}</p>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2">{c.title}</h3>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{c.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.techDomains.map(d => (
                          <span key={d} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">{d}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">{formatAward(c.awardMin, c.awardMax)}</p>
                          <p className="text-amber-400 text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {days > 0 ? `${days} days remaining` : 'Deadline passed'}
                          </p>
                        </div>
                        <Link
                          to={`/challenges/federal/${c.slug}`}
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                        >
                          View Challenge <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by agency, technology, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{activeFilterCount}</span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Agency filter */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Agency</label>
                  <select
                    value={agencyFilter}
                    onChange={e => setAgencyFilter(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {ALL_AGENCIES.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                {/* Classification filter */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Classification</label>
                  <select
                    value={classFilter}
                    onChange={e => setClassFilter(e.target.value as ClassificationLevel | 'all')}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {ALL_CLASSIFICATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {/* Award mechanism filter */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Award Type</label>
                  <select
                    value={mechanismFilter}
                    onChange={e => setMechanismFilter(e.target.value as AwardMechanism | 'all')}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {ALL_MECHANISMS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {/* Status filter */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as ChallengeStatus | 'all')}
                    className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {ALL_STATUSES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {FEDERAL_CHALLENGES.length} challenges
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setAgencyFilter('All Agencies'); setClassFilter('all'); setMechanismFilter('all'); setStatusFilter('all'); }}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Challenge grid */}
        <div id="challenges-grid">
        <AnimatePresence mode="sync">
          {filtered.length > 0 ? (
            <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
              {filtered.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium mb-1">No challenges match your filters</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Solver journey */}
        <section className="mb-16">
          <h2 className="text-white font-bold text-2xl mb-2">The Federal Challenge Journey</h2>
          <p className="text-slate-400 mb-8">From eligibility check to award — the full lifecycle for solvers, teams, and companies.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Verify Eligibility', desc: 'Complete our 9-gate compliance check: citizenship, entity structure, ITAR country screening, FOCI disclosure, SAM.gov status, and export control attestation.', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { step: '02', title: 'Form Your Team', desc: 'Assemble a compliant team. Each member must pass eligibility gates. For clearance challenges, facility clearance (FCL) through DCSA is required for finalist access.', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { step: '03', title: 'Submit & Compete', desc: 'Submit concept papers, quad charts, white papers, or prototype demos depending on challenge format. All submissions must be UNCLASSIFIED and free of export-controlled data unless otherwise specified.', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { step: '04', title: 'Win & Transition', desc: 'Winners receive prize payments, subaward agreements, or enter OTA prototype negotiations. SAM.gov registration and active CAGE code required before award disbursement.', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(item => (
              <div key={item.step} className={`${item.bg} border border-slate-700/50 rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-slate-500 font-mono text-sm font-bold">{item.step}</span>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Agency journey */}
        <section className="mb-16">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-xl mb-2">Posting Agency? Start Here.</h2>
                <p className="text-slate-300 mb-4">
                  Federal agencies, MIIs, and DoD-authorized organizations can post challenges on this platform. Our wizard guides you through prize authority selection
                  (15 USC 3719 / 10 USC 4025), eligibility gate configuration, IP rights terms, classification level assignment, and congressional notification requirements.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-5">
                  {[
                    { icon: Shield, text: 'FedRAMP-ready infrastructure' },
                    { icon: Lock, text: 'CUI-capable submission pathways' },
                    { icon: Globe, text: 'ITAR/EAR screening built-in' },
                    { icon: BookOpen, text: 'SAM.gov / CAGE verification API' },
                    { icon: ExternalLink, text: 'Challenge.gov cross-posting' },
                  ].map(item => (
                    <span key={item.text} className="flex items-center gap-1.5">
                      <item.icon className="w-3.5 h-3.5 text-blue-400" />
                      {item.text}
                    </span>
                  ))}
                </div>
                <Link
                  to="/challenges/federal/post"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  Post a Federal Challenge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance footer */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-xs leading-relaxed max-w-3xl mx-auto">
            This portal lists challenges authorized under 15 USC 3719 (America COMPETES Act), 10 USC 4025 (DOD Prize Competitions),
            10 USC 4022 (Other Transaction Authority), and 15 USC 638 (SBIR/STTR Act). Participation subject to ITAR (22 CFR 120-130),
            EAR (15 CFR 730-774), FAR 3.104, and applicable security regulations. SAM.gov registration required for prize disbursement.
            IP protected per 15 USC 3719(j) — government may not compel IP assignment as condition of participation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FederalChallengesHubPage;
