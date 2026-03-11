import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ChevronLeft, AlertTriangle, CheckCircle, XCircle,
  Clock, Award, FileText, Users, Building2, Lock, Globe,
  ChevronDown, ChevronRight, ExternalLink, Download,
  Info, Star, Target, Zap, DollarSign,
  BookOpen, Flag, Eye, X
} from 'lucide-react';
import { useEscapeKey } from '../../../../hooks/useEscapeKey';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type GateResult = 'unanswered' | 'pass' | 'warn' | 'fail';

interface EligibilityGate {
  id: string;
  step: number;
  title: string;
  question: string;
  explanation: string;
  passLabel: string;
  failLabel: string;
  passResult: GateResult;
  failResult: GateResult;
  passNote: string;
  failNote: string;
  remediation?: string;
  legalBasis?: string;
}

interface BasicChallengeInfo {
  title: string;
  agency: string;
  subAgency: string;
  agencyIcon: string;
  classLabel: string;
  classBg: string;
  classText: string;
  classBorder: string;
  awardMechanism: string;
  awardMin: number;
  awardMax: number;
  authorityBasis: string;
  deadline: string;
  description: string;
  techDomains: string[];
  externalUrl: string;
  hasFullDetail: boolean;
}

// ─────────────────────────────────────────────
// ALL CHALLENGE BASIC DATA (supports all 6 slugs)
// ─────────────────────────────────────────────

const CHALLENGES_MAP: Record<string, BasicChallengeInfo> = {
  'america-makes-2026-dod-oib': {
    title: '2026 DoD OIB Modernization Challenge',
    agency: 'Department of Defense',
    subAgency: 'OSD ManTech / America Makes (NCDMM)',
    agencyIcon: '🏛️',
    classLabel: 'UNCLASSIFIED',
    classBg: 'bg-emerald-500/15',
    classText: 'text-emerald-400',
    classBorder: 'border-emerald-500/30',
    awardMechanism: 'Subaward Agreement',
    awardMin: 10_000_000,
    awardMax: 25_000_000,
    authorityBasis: '10 USC 4025 / AFRL Agreement FA8650-20-2-5700',
    deadline: '2026-04-02',
    description:
      'Multi-topic project call for additive manufacturing technologies to modernize DoD Organic Industrial Base facilities. All proposals must leverage AM. TRL 4→7 maturation required.',
    techDomains: ['Advanced Manufacturing', 'AI/ML', 'Robotics', 'Digital Operations'],
    externalUrl: 'https://www.americamakes.us/project_calls/2026-dod-oib-challenge/',
    hasFullDetail: true,
  },
  'darpa-assured-microelectronics-2026': {
    title: 'DARPA Assured Microelectronics Challenge',
    agency: 'DARPA',
    subAgency: 'Microsystems Technology Office (MTO)',
    agencyIcon: '⚛️',
    classLabel: 'SECRET',
    classBg: 'bg-red-500/15',
    classText: 'text-red-400',
    classBorder: 'border-red-500/30',
    awardMechanism: 'OTA Prototype (10 USC 4022)',
    awardMin: 3_000_000,
    awardMax: 15_000_000,
    authorityBasis: '10 USC 4025 / 10 USC 4022 (OTA)',
    deadline: '2026-05-15',
    description:
      'Develop hardware security primitives and trusted microelectronics supply chain solutions for defense-critical systems. SECRET facility clearance required for finalist evaluation phase.',
    techDomains: ['Semiconductors', 'Hardware Security', 'VLSI Design', 'Trusted Supply Chain'],
    externalUrl: 'https://www.darpa.mil/research/challenges',
    hasFullDetail: false,
  },
  'afwerx-agility-prime-evtol-2026': {
    title: 'AFWERX Agility Prime eVTOL Commercialization',
    agency: 'Department of the Air Force',
    subAgency: 'AFWERX / Air Force Research Laboratory',
    agencyIcon: '✈️',
    classLabel: 'UNCLASSIFIED',
    classBg: 'bg-emerald-500/15',
    classText: 'text-emerald-400',
    classBorder: 'border-emerald-500/30',
    awardMechanism: 'OTA Prototype (10 USC 4022)',
    awardMin: 1_500_000,
    awardMax: 5_000_000,
    authorityBasis: '10 USC 4022 (OTA) / 15 USC 638 (SBIR)',
    deadline: '2026-06-01',
    description:
      'Accelerate dual-use commercialization of electric vertical take-off and landing vehicles. OTA Prototype Path with follow-on production potential. Nontraditional contractors preferred.',
    techDomains: ['eVTOL', 'Electric Aviation', 'Autonomy', 'Advanced Propulsion'],
    externalUrl: 'https://afwerx.com/agility-prime/',
    hasFullDetail: false,
  },
  'army-xtech-2026-search-four': {
    title: 'xTech Search 4.0 — Army Modernization Priorities',
    agency: 'Department of the Army',
    subAgency: 'Army Futures Command / DEVCOM',
    agencyIcon: '⭐',
    classLabel: 'UNCLASSIFIED',
    classBg: 'bg-emerald-500/15',
    classText: 'text-emerald-400',
    classBorder: 'border-emerald-500/30',
    awardMechanism: 'Prize Competition (15 USC 3719)',
    awardMin: 50_000,
    awardMax: 250_000,
    authorityBasis: '15 USC 3719 (America COMPETES) / 10 USC 4025',
    deadline: '2026-03-30',
    description:
      'Open innovation prize competition for Army top modernization priorities. White paper → pitch at AUSA. Winner eligible for SBIR Direct to Phase II award ($1.7M).',
    techDomains: ['AI/ML', 'Counter-UAS', 'Soldier Systems', 'Logistics Automation'],
    externalUrl: 'https://xtech.army.mil',
    hasFullDetail: false,
  },
  'navy-sbir-advanced-propulsion-2026': {
    title: 'Navy Advanced Propulsion SBIR Direct to Phase II',
    agency: 'Department of the Navy',
    subAgency: 'NAVSEA / Office of Naval Research',
    agencyIcon: '⚓',
    classLabel: 'CUI',
    classBg: 'bg-amber-500/15',
    classText: 'text-amber-400',
    classBorder: 'border-amber-500/30',
    awardMechanism: 'SBIR Direct to Phase II (15 USC 638)',
    awardMin: 1_700_000,
    awardMax: 1_700_000,
    authorityBasis: '15 USC 638 (SBIR/STTR Act)',
    deadline: '2026-04-15',
    description:
      'SBIR Direct to Phase II for advanced propulsion in unmanned undersea vehicles. CUI problem statement released after eligibility verification. ≤500 employees required.',
    techDomains: ['Naval Propulsion', 'Energy Storage', 'Thermal Management', 'Power Electronics'],
    externalUrl: 'https://www.navysbirsearch.onr.navy.mil',
    hasFullDetail: false,
  },
  'socom-advanced-materials-2026': {
    title: 'SOCOM Advanced Materials & Manufacturing Challenge',
    agency: 'U.S. Special Operations Command',
    subAgency: 'SOFWERX / SOCOM Science & Technology',
    agencyIcon: '🎯',
    classLabel: 'CUI',
    classBg: 'bg-amber-500/15',
    classText: 'text-amber-400',
    classBorder: 'border-amber-500/30',
    awardMechanism: 'Subaward Agreement',
    awardMin: 2_000_000,
    awardMax: 8_000_000,
    authorityBasis: '10 USC 4025 / 10 USC 4022 (OTA)',
    deadline: '2026-05-01',
    description:
      'Multi-phase challenge for advanced materials supporting special operations forces. CUI problem statement. Finalists must hold or obtain Secret facility clearance through DCSA.',
    techDomains: ['Advanced Materials', 'Additive Manufacturing', 'Ballistic Protection', 'Thermal Camouflage'],
    externalUrl: 'https://sofwerx.org',
    hasFullDetail: false,
  },
};

// ─────────────────────────────────────────────
// ELIGIBILITY GATES
// ─────────────────────────────────────────────

const ELIGIBILITY_GATES: EligibilityGate[] = [
  {
    id: 'entity-type',
    step: 1,
    title: 'Entity Type',
    question: 'Is your organization an institutional entity — company, university, or research institution?',
    explanation:
      'This challenge requires an institutional lead. Individual participants without an organizational affiliation are not eligible to be the lead proposer. The lead must include an industry partner capable of DoD system delivery.',
    passLabel: 'Yes — we are an organization',
    failLabel: 'No — I am an individual without entity affiliation',
    passResult: 'pass',
    failResult: 'fail',
    passNote: 'Entity type confirmed. Proceed to next gate.',
    failNote: 'Individual participants cannot serve as lead proposers on this challenge.',
    remediation: 'Join or form a team with an institutional lead. Contact us for team formation support.',
    legalBasis: 'America Makes RFP §5.1 — Lead Proposer Requirements',
  },
  {
    id: 'us-incorporation',
    step: 2,
    title: 'U.S. Incorporation',
    question: 'Is your entity incorporated in the United States with its primary place of business in the U.S.?',
    explanation:
      'Federal prize competitions under 15 USC 3719(g)(3) require that private entities be incorporated in and maintain a primary place of business in the United States to be eligible to win awards.',
    passLabel: 'Yes — U.S.-incorporated, U.S. primary place of business',
    failLabel: 'No — foreign-incorporated or primary operations outside U.S.',
    passResult: 'pass',
    failResult: 'fail',
    passNote: 'U.S. incorporation confirmed. Proceed to ownership verification.',
    failNote: 'Foreign-incorporated entities are not eligible as lead proposers.',
    remediation: 'Consult legal counsel about establishing a U.S. legal entity. Foreign entities may participate as subrecipients.',
    legalBasis: '15 USC 3719(g)(3) — America COMPETES Act',
  },
  {
    id: 'us-ownership',
    step: 3,
    title: 'U.S. Ownership',
    question: 'Is your organization more than 50% owned and controlled by U.S. citizens or permanent residents?',
    explanation:
      'Ownership by qualifying U.S. persons is required for SBIR eligibility and standard DOD challenge practice to ensure compliance with FOCI provisions.',
    passLabel: 'Yes — majority U.S. citizen / permanent resident ownership',
    failLabel: 'No — significant foreign ownership or control present',
    passResult: 'pass',
    failResult: 'warn',
    passNote: 'Ownership structure confirmed. No FOCI concerns identified at this stage.',
    failNote: 'Significant foreign ownership triggers FOCI review. Additional disclosure required.',
    remediation: 'Prepare SF-328 documentation and a FOCI mitigation plan. Contact the program office.',
    legalBasis: '32 CFR §117.11 — FOCI Definition; 15 USC 638 — SBIR Ownership Requirements',
  },
  {
    id: 'itar-country',
    step: 4,
    title: 'ITAR Country Restriction',
    question:
      'Do any proposed team members hold citizenship in any of the following countries? Afghanistan, Belarus, Burma, Central African Republic, China, Cuba, Cyprus, DR Congo, Eritrea, Ethiopia, Haiti, Iran, Iraq, Lebanon, Libya, Nicaragua, North Korea, Russia, Somalia, South Sudan, Sudan, Syria, Venezuela, Zimbabwe.',
    explanation:
      'The DoD OIB program explicitly prohibits team members who are nationals of these 24 countries. This mirrors ITAR country restrictions under 22 CFR §126.1. Inclusion results in automatic disqualification.',
    passLabel: 'No — no team members from any listed country',
    failLabel: 'Yes — one or more team members hold citizenship in a listed country',
    passResult: 'pass',
    failResult: 'fail',
    passNote: 'Team nationality confirmed compliant with ITAR country restrictions.',
    failNote: 'Automatic disqualification per America Makes RFP §5.9 and ITAR 22 CFR §126.1.',
    legalBasis: 'America Makes RFP §5.9; 22 CFR §126.1 — ITAR Embargoed Countries',
  },
  {
    id: 'foci',
    step: 5,
    title: 'FOCI Disclosure',
    question:
      'Is your organization subject to Foreign Ownership, Control, or Influence (FOCI)?',
    explanation:
      'Under 32 CFR §117.11, an entity is under FOCI if a foreign interest has the power to direct or decide issues affecting management in ways that could adversely affect federal contracts.',
    passLabel: 'No — no material FOCI present',
    failLabel: 'Yes — our organization has foreign ownership or control elements',
    passResult: 'pass',
    failResult: 'warn',
    passNote: 'No FOCI reported. Self-certification will be required in your submission.',
    failNote: 'FOCI present — additional disclosure required. Outline information-sharing controls in proposal.',
    remediation: 'Document FOCI mitigation: Board Resolution, SCA, SSA, or Voting Trust. Consult your FSO.',
    legalBasis: '32 CFR §117.11; DoDI 5220.22-M — National Industrial Security Program',
  },
  {
    id: 'federal-employee',
    step: 6,
    title: 'Federal Employee Exclusion',
    question:
      'Are you a federal government employee participating within the scope of your official employment?',
    explanation:
      'Federal employees acting within their employment scope are excluded from winning prize competitions under 15 USC 3719(g)(4). Advisory participation (if equitably available to all) does not disqualify your team.',
    passLabel: 'No — not a federal employee (or not within scope)',
    failLabel: 'Yes — I am a federal employee participating within employment scope',
    passResult: 'pass',
    failResult: 'fail',
    passNote: 'Federal employee exclusion does not apply. You may participate.',
    failNote: 'Federal employees acting within employment scope are ineligible to receive awards.',
    legalBasis: '15 USC 3719(g)(4) — America COMPETES Act',
  },
  {
    id: 'sam-gov',
    step: 7,
    title: 'SAM.gov Registration',
    question:
      'Does your organization have, or can you obtain, an active SAM.gov registration with a valid CAGE code before award?',
    explanation:
      'SAM.gov registration is mandatory to receive any federal award payment. Registration takes 2–6 weeks. You do not need SAM.gov to submit — only to receive payment.',
    passLabel: 'Yes — active registration or we will obtain one',
    failLabel: 'No — we cannot obtain SAM.gov registration',
    passResult: 'pass',
    failResult: 'fail',
    passNote: 'SAM.gov requirement acknowledged. Registration must be active before October 1, 2026.',
    failNote: 'SAM.gov registration is a non-negotiable requirement for award disbursement.',
    remediation: 'Begin SAM.gov registration at sam.gov. Allow 2–6 weeks. Contact your local PTAC for free assistance.',
    legalBasis: 'FAR Subpart 4.11; 15 USC 3719 — SAM Registration for Award',
  },
  {
    id: 'membership',
    step: 8,
    title: 'America Makes Membership',
    question:
      'Can your organization become an America Makes member in good standing by March 26, 2026?',
    explanation:
      'The lead proposer must be an America Makes member in good standing by the membership deadline. Non-members may participate as subrecipients.',
    passLabel: 'Yes — we are a member or can become one',
    failLabel: 'No — we cannot or do not wish to join',
    passResult: 'pass',
    failResult: 'warn',
    passNote: 'Membership requirement can be satisfied. Visit americamakes.us/membership to apply.',
    failNote: 'Your organization cannot lead without membership. You may participate as a subrecipient.',
    remediation: 'Apply at americamakes.us/membership. Contact projectcall@americamakes.us for expedited processing.',
    legalBasis: 'America Makes RFP §5.1 — Membership Requirement',
  },
  {
    id: 'export-control',
    step: 9,
    title: 'Export Control Attestation',
    question:
      'Can you certify your proposal and all deliverables will be UNCLASSIFIED and free of ITAR/EAR export-controlled technical data?',
    explanation:
      'All submissions must be unclassified and free of export-controlled data (ITAR 22 CFR 120-130; EAR 15 CFR 730-774). Violations constitute criminal offenses under federal law, including fines and imprisonment.',
    passLabel: 'Yes — our submission will be unclassified and export-control-free',
    failLabel: 'No — our concept inherently involves controlled technical data',
    passResult: 'pass',
    failResult: 'warn',
    passNote: 'Export control attestation noted. This certification will be required on your submission cover page.',
    failNote: 'You must restructure your proposal to exclude controlled data before submission.',
    remediation: 'Consult your Export Control Officer. The "fundamental research" exception under ITAR §120.11 may apply.',
    legalBasis: 'America Makes RFP §5.9; 22 CFR §120-130 (ITAR); 15 CFR §730-774 (EAR)',
  },
];

// ─────────────────────────────────────────────
// FULL CHALLENGE DATA (America Makes RFP — from document)
// ─────────────────────────────────────────────

const FULL_CHALLENGE_DATA = {
  deadlines: [
    { label: 'America Makes Membership Deadline', date: 'March 26, 2026' },
    { label: 'Concept Paper + Quad Chart Submission', date: 'April 2, 2026 — 5:00 PM ET' },
    { label: 'Notification of Selection', date: 'April 28, 2026' },
    { label: 'Selected Packets to DoD', date: 'May 20, 2026' },
    { label: 'DoD Final Selections', date: 'August 1, 2026' },
    { label: 'Target Project Start', date: 'October 1, 2026' },
    { label: 'Maximum Period of Performance', date: '24 months from award' },
  ],
  submissionPortal: 'americamakes.us/project_calls/2026-dod-oib-challenge',
  submissionPdfUrl: 'https://www.americamakes.us/wp-content/uploads/2026/03/DODOIB-RFP-2026-FINAL.pdf',
  requiredDocuments: [
    { name: 'Concept Paper', format: 'MS Word', maxPages: 5, description: 'Title page + 4 content pages: problem statement, technical approach, methodology, benefits, and technology transition plan.' },
    { name: 'Quad Chart', format: 'MS PowerPoint', maxPages: 1, description: 'OSD ManTech template. Description, delivering objectives, technical approach, and benefits.' },
  ],
  evaluationCriteria: [
    { label: 'Relevance to Special Topic Area', weight: 'Factor A', description: 'Proposal explicitly linked to an STA with demonstrated advancement of advanced manufacturing capability for OIB modernization.' },
    { label: 'Quality of Technical Approach', weight: 'Factor B', description: 'Articulated approach/strategy, feasibility, team skills/facilities, resource adequacy.' },
    { label: 'Quality of KPPs and Metrics', weight: 'Factor C', description: 'Clearly defined KPPs across 5 categories: Performance, Productivity, Efficiency, Acquisition Cost, Sustaining Cost — with explicit units and baseline improvement %.' },
    { label: 'Impact and Technology Transition', weight: 'Factor D', description: 'Near/long-term significance, OIB sponsor endorsement at GO/FO or SES level, business rationale, and economic justification.' },
  ],
  specialTopicAreas: [
    { id: 'sta1', title: 'Digital Operations Technology', items: ['AI-driven NDI/NDT robotics using Technical Data Packages', 'AR human-machine interface for technicians', 'Turn-key OT network management for Industry 4.0'] },
    { id: 'sta2', title: 'Real-Time Manufacturing Sensors for Robotics', items: ['Collaborative field robots for autonomous inspection', 'Multi-robot supervisor frameworks for large-scale tasks', 'Bipedal humanoid robotic platforms with RL for MRO'] },
    { id: 'sta3', title: 'AI Robotic Process Planning', items: ['AI frameworks automating process planning for advanced manufacturing machinery'] },
    { id: 'sta4', title: 'In-Situ Quality Checks', items: ['Real-time NDT sensors on existing manufacturing lines', 'Autonomous aerial platforms for inspection', 'Data acquisition and management systems'] },
    { id: 'sta5', title: 'Reduced Operator Exposure', items: ['Remote operation of hazardous manufacturing processes', 'Autonomous systems for MRO inside confined/hazardous spaces'] },
    { id: 'sta6', title: 'Reduce Cost of Operations', items: ['Yield and productivity improvements for OIB lines', 'Infrastructure footprint reduction', 'Automation of repetitive operations'] },
    { id: 'sta7', title: 'Pilot Line of Non-Traditional OIB Products', items: ['Mass-produced unmanned vehicles', 'Fuel cells and bio-synthesized materials', 'Emerging munitions and specialized wearables'] },
    { id: 'sta8', title: 'Mobile and Large Surface Automation', items: ['Robotic drilling, riveting, and mobile additive repairs on weapon systems', 'Precision coating systems for aerodynamic surfaces', 'Autonomous surface-climbing robot systems'] },
  ],
  ipRights: [
    { title: 'Background IP', content: 'Each performer retains all rights to their own pre-existing intellectual property. No licenses are granted to background IP under the subaward agreement.' },
    { title: 'Consortium Developed IP (CDIP)', content: 'Owned by the creating organization(s), subject to U.S. Government rights. Must be disclosed to NCDMM via non-confidential summary.' },
    { title: 'Government License', content: 'U.S. Government retains rights in all CDIP created using government funds, facilities, or equipment. Members receive limited, non-exclusive, royalty-free research licenses.' },
    { title: 'Publication Rights (Article 9 — Non-Negotiable)', content: '65-day advance notice required before public disclosure. Two-week window to identify proprietary/patentable CDIP.' },
    { title: 'NDA Protection', content: 'NCDMM and proposer will sign a non-disclosure agreement to protect corporate IP disclosed in proposals.' },
  ],
  teamRoles: [
    { required: true, role: 'Lead Proposer (1 required)', desc: 'America Makes member in good standing. SAM.gov registered. Signs subaward within 60 days of selection.' },
    { required: true, role: 'Industry Partner (1 required)', desc: 'Capable of delivering a system to DoD. Provides use case, conducts final demo, provides business rationale.' },
    { required: true, role: 'America Makes / NCDMM (mandatory)', desc: 'Must be included. At minimum performs project management.' },
    { required: false, role: 'Military Sponsor (strongly encouraged)', desc: 'Commitment from Military Service or OIB site sponsor. GO/FO or SES level endorsement.' },
    { required: false, role: 'Additional Subrecipients', desc: 'Non-members may participate as subrecipients. Foreign assets must be disclosed.' },
  ],
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatAward(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };
  return min === max ? fmt(max) : `${fmt(min)}–${fmt(max)}`;
}

// ─────────────────────────────────────────────
// FRAUD WARNING MODAL — 18 USC 1001
// ─────────────────────────────────────────────

function FraudWarningModal({ onAcknowledge, onClose }: { onAcknowledge: () => void; onClose: () => void }) {
  useEscapeKey(onClose);
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-xl w-full"
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-red-500/15 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Federal Fraud Warning</h3>
            <p className="text-red-400 text-xs font-mono">18 USC 1001 — False Statements</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-200 leading-relaxed">
            <p className="font-semibold mb-2">NOTICE TO ALL PARTICIPANTS</p>
            <p>
              This eligibility assessment requires truthful answers. False statements, fraudulent representations, or material omissions on a federal challenge application
              constitute violations of <strong>18 USC 1001 (False Statements)</strong>, punishable by:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Up to <strong>5 years imprisonment</strong></li>
              <li>• Fines up to <strong>$250,000</strong> (individual) or <strong>$500,000</strong> (organization)</li>
              <li>• Debarment from all future federal contracting and award programs</li>
            </ul>
          </div>
          <div className="text-slate-300 text-sm space-y-2">
            <p>Prohibited false statements include, but are not limited to:</p>
            <ul className="space-y-1 text-slate-400">
              {[
                'Misrepresenting U.S. citizenship or permanent residency status',
                'Concealing foreign ownership, control, or influence (FOCI)',
                'Falsely certifying ITAR/EAR export control compliance',
                'Failing to disclose disqualifying country affiliations (22 CFR §126.1)',
                'Misrepresenting organizational eligibility or SAM.gov status',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-slate-400 text-xs border-t border-slate-700 pt-4">
            Winners will additionally be screened against the OFAC Specially Designated Nationals (SDN) list and applicable federal watch lists before any award disbursement.
          </p>
          <button
            onClick={onAcknowledge}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            I understand and acknowledge — I will answer truthfully
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// IP RIGHTS MODAL
// ─────────────────────────────────────────────

function IPRightsModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-bold">IP Rights — Non-Negotiable Terms</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
            <p className="font-semibold mb-1">Statutory Protection — 15 USC 3719(j)</p>
            <p>The Federal Government may NOT gain an interest in intellectual property developed by a participant without written consent. No IP waiver can be required as a condition of participation.</p>
          </div>
          {FULL_CHALLENGE_DATA.ipRights.map(item => (
            <div key={item.title} className="border border-slate-700 rounded-xl p-4">
              <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ELIGIBILITY GATEWAY (with localStorage + proper fail handling)
// ─────────────────────────────────────────────

function EligibilityGateway({ slug, onComplete }: { slug: string; onComplete: () => void }) {
  const storageKey = `eligibility-gates-${slug}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, GateResult>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as Record<string, GateResult>) : {};
    } catch {
      return {};
    }
  });
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [showFraudWarning, setShowFraudWarning] = useState(() => {
    return localStorage.getItem('federal-fraud-warning-ack') !== 'true';
  });

  // Persist answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // localStorage unavailable
    }
  }, [answers, storageKey]);

  const gate = ELIGIBILITY_GATES[currentStep];
  const allAnswered = ELIGIBILITY_GATES.every(g => answers[g.id] !== undefined);
  const hasFail = Object.values(answers).includes('fail');
  const hasWarn = Object.values(answers).includes('warn');
  const currentAnswer = answers[gate?.id];

  function handleAnswer(result: GateResult) {
    setAnswers(prev => ({ ...prev, [gate.id]: result }));
    // Only auto-advance on pass or warn — on fail, user must manually click Next to acknowledge
    if (result !== 'fail' && currentStep < ELIGIBILITY_GATES.length - 1) {
      setTimeout(() => setCurrentStep(s => s + 1), 600);
    }
  }

  function handleAcknowledgeFraud() {
    localStorage.setItem('federal-fraud-warning-ack', 'true');
    setShowFraudWarning(false);
  }

  const resultIcon = (r: GateResult) => {
    if (r === 'pass') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (r === 'warn') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (r === 'fail') return <XCircle className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 rounded-full border border-slate-600" />;
  };

  if (showFraudWarning) {
    return (
      <AnimatePresence>
        <FraudWarningModal
          onAcknowledge={handleAcknowledgeFraud}
          onClose={handleAcknowledgeFraud}
        />
      </AnimatePresence>
    );
  }

  if (allAnswered) {
    // Clear localStorage on successful completion (no fail)
    if (!hasFail) {
      try { localStorage.removeItem(storageKey); } catch { /* noop */ }
    }

    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
        <h3 className="text-white font-bold text-xl mb-2">Eligibility Assessment Complete</h3>
        <p className="text-slate-400 text-sm mb-6">
          {hasFail
            ? 'One or more eligibility gates could not be passed. See remediation guidance below.'
            : hasWarn
            ? 'All required gates passed with some conditions. Review warnings before proceeding.'
            : 'All eligibility gates passed. You appear to meet the requirements for this challenge.'}
        </p>

        <div className="space-y-2 mb-6">
          {ELIGIBILITY_GATES.map(g => {
            const r = answers[g.id] || 'unanswered';
            const rowBg =
              r === 'pass' ? 'bg-emerald-500/10 border-emerald-500/20' :
              r === 'warn' ? 'bg-amber-500/10 border-amber-500/20' :
              'bg-red-500/10 border-red-500/20';
            return (
              <div key={g.id} className={`flex items-start gap-3 p-3 rounded-xl border ${rowBg}`}>
                <div className="mt-0.5">{resultIcon(r)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{g.title}</p>
                  {(r === 'warn' || r === 'fail') && (
                    <p className="text-xs text-slate-400 mt-1">{r === 'fail' ? g.failNote : g.passNote}{g.remediation ? ` ${g.remediation}` : ''}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* OFAC notice */}
        <div className="bg-slate-700/40 border border-slate-600 rounded-xl p-3 mb-6 text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
          <span>
            <strong className="text-slate-300">Award Disbursement Notice:</strong> All winners are subject to OFAC Specially Designated Nationals (SDN) list screening,
            ITAR/EAR compliance verification, and active SAM.gov registration confirmation before any prize or subaward funds are disbursed.
            False attestation on this form is a federal crime under 18 USC 1001.
          </span>
        </div>

        {!hasFail ? (
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Proceed to Full Challenge Details
          </button>
        ) : (
          <div className="text-center">
            <p className="text-red-400 text-sm font-medium mb-3">You do not currently meet all eligibility requirements.</p>
            <Link to="/challenges/federal" className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Browse other federal challenges
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
      {/* Gate header */}
      <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Gate {gate.step} of {ELIGIBILITY_GATES.length}</p>
          <h3 className="text-white font-semibold">{gate.title}</h3>
        </div>
        <div className="flex gap-1">
          {ELIGIBILITY_GATES.map((g, i) => {
            const r = answers[g.id];
            const dotCls =
              r === 'pass' ? 'bg-emerald-500' :
              r === 'warn' ? 'bg-amber-400' :
              r === 'fail' ? 'bg-red-500' :
              i === currentStep ? 'bg-blue-500' :
              'bg-slate-600';
            return <div key={g.id} className={`w-2 h-2 rounded-full transition-all ${dotCls}`} />;
          })}
        </div>
      </div>

      <div className="p-6">
        <p className="text-white font-medium text-lg mb-3 leading-snug">{gate.question}</p>

        <button
          onClick={() => setExpandedInfo(expandedInfo === gate.id ? null : gate.id)}
          className="flex items-center gap-1.5 text-blue-400 text-sm mb-5 hover:text-blue-300"
        >
          <Info className="w-3.5 h-3.5" />
          {expandedInfo === gate.id ? 'Hide explanation' : 'Why is this required?'}
        </button>
        <AnimatePresence>
          {expandedInfo === gate.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                <p className="mb-2">{gate.explanation}</p>
                {gate.legalBasis && <p className="text-xs text-blue-400 font-mono">{gate.legalBasis}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!currentAnswer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(gate.passResult)}
              className="flex items-center gap-3 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-left transition-all"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium">{gate.passLabel}</span>
            </button>
            <button
              onClick={() => handleAnswer(gate.failResult)}
              className="flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl text-left transition-all"
            >
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium">{gate.failLabel}</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              currentAnswer === 'pass' ? 'bg-emerald-500/10 border-emerald-500/30' :
              currentAnswer === 'warn' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {resultIcon(currentAnswer)}
              <div>
                <p className={`font-medium text-sm ${
                  currentAnswer === 'pass' ? 'text-emerald-400' :
                  currentAnswer === 'warn' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {currentAnswer === 'pass' ? 'Gate Passed' : currentAnswer === 'warn' ? 'Conditional Pass' : 'Gate Failed — Review Required'}
                </p>
                <p className="text-slate-300 text-sm mt-0.5">
                  {currentAnswer === 'pass' ? gate.passNote : currentAnswer === 'warn' ? gate.passNote : gate.failNote}
                </p>
                {(currentAnswer === 'warn' || currentAnswer === 'fail') && gate.remediation && (
                  <p className="text-slate-400 text-xs mt-2 italic">{gate.remediation}</p>
                )}
                {currentAnswer === 'fail' && (
                  <p className="text-red-400 text-xs mt-3 font-medium">
                    Acknowledge this result and click Next to continue the assessment.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <p className="text-slate-500 text-xs">{Object.keys(answers).length} / {ELIGIBILITY_GATES.length} answered</p>
        <button
          onClick={() => setCurrentStep(s => Math.min(ELIGIBILITY_GATES.length - 1, s + 1))}
          disabled={currentStep === ELIGIBILITY_GATES.length - 1 || !currentAnswer}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GENERIC CHALLENGE DETAIL (for non-America-Makes slugs)
// ─────────────────────────────────────────────

function GenericChallengeDetail({ info, slug, eligibilityPassed, onEligibilityComplete }: {
  info: BasicChallengeInfo;
  slug: string;
  eligibilityPassed: boolean;
  onEligibilityComplete: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      {/* Eligibility gate */}
      {!eligibilityPassed && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-semibold text-sm">Eligibility Verification Required</p>
              <p className="text-amber-400/80 text-xs mt-0.5">
                Complete the 9-gate federal eligibility check. All answers are self-certified — false attestation is a federal crime under 18 USC 1001.
              </p>
            </div>
          </div>
          <EligibilityGateway slug={slug} onComplete={onEligibilityComplete} />
        </div>
      )}

      {eligibilityPassed && (
        <>
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-8">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-300 font-medium text-sm">Eligibility check passed. Access the official submission portal below.</p>
          </div>

          {/* Basic details */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-xl mb-4">Challenge Overview</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{info.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {info.techDomains.map(d => (
                <span key={d} className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-lg">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Award Range</p>
                <p className="text-white font-semibold">{formatAward(info.awardMin, info.awardMax)}</p>
              </div>
              <div>
                <p className="text-slate-400">Legal Authority</p>
                <p className="text-white font-mono text-xs">{info.authorityBasis}</p>
              </div>
            </div>
          </div>

          {/* External CTA */}
          <div className="bg-blue-900/30 border border-blue-500/20 rounded-2xl p-6 text-center">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Submit via Official Agency Portal</h3>
            <p className="text-slate-400 text-sm mb-5">
              Full challenge details, submission requirements, and evaluation criteria are available on the official agency portal.
              This platform provides eligibility screening — submission is handled through the agency's designated system.
            </p>
            <a
              href={info.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
            >
              Go to Official Submission Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DETAIL PAGE
// ─────────────────────────────────────────────

const FederalChallengeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [eligibilityPassed, setEligibilityPassed] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSTA, setExpandedSTA] = useState<string | null>(null);

  const info = slug ? CHALLENGES_MAP[slug] : null;

  if (!info) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-8">
        <div>
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-white font-bold text-2xl mb-2">Challenge Not Found</h2>
          <p className="text-slate-400 mb-6">This challenge may have closed, been removed, or the URL is incorrect.</p>
          <Link to="/challenges/federal" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-center">
            <ChevronLeft className="w-4 h-4" /> Back to Federal Challenges
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'topics', label: 'Topic Areas', icon: Zap },
    { id: 'submission', label: 'Submission', icon: FileText },
    { id: 'evaluation', label: 'Evaluation', icon: Star },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'ip', label: 'IP Rights', icon: Shield },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatePresence>
        {showIPModal && <IPRightsModal onClose={() => setShowIPModal(false)} />}
      </AnimatePresence>

      {/* Classification banner */}
      <div className={`px-4 py-2 flex items-center justify-center gap-3 ${info.classBg} border-b ${info.classBorder}`}>
        <Lock className={`w-3.5 h-3.5 ${info.classText}`} />
        <span className={`text-xs font-mono font-bold tracking-widest ${info.classText}`}>{info.classLabel}</span>
        <span className="text-slate-500 text-xs">|</span>
        <span className="text-slate-400 text-xs font-mono">{info.authorityBasis}</span>
      </div>

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link to="/challenges/federal" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> All Federal Challenges
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{info.agencyIcon}</span>
              <div>
                <p className="text-blue-400 font-medium text-sm">{info.agency}</p>
                <p className="text-slate-500 text-xs">{info.subAgency}</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{info.title}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-400 text-sm rounded-lg">
                <Award className="w-3.5 h-3.5" /> {info.awardMechanism}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg">
                <DollarSign className="w-3.5 h-3.5" /> {formatAward(info.awardMin, info.awardMax)}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{info.description}</p>
          </div>

          {/* Sidebar */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 h-fit space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Quick Facts</h3>
            {[
              { label: 'Award Mechanism', value: info.awardMechanism, icon: Award },
              { label: 'Award Range', value: formatAward(info.awardMin, info.awardMax), icon: DollarSign },
              { label: 'Legal Authority', value: info.authorityBasis, icon: BookOpen },
              { label: 'Agency', value: info.subAgency, icon: Building2 },
            ].map(fact => (
              <div key={fact.label} className="flex items-start gap-2.5">
                <fact.icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">{fact.label}</p>
                  <p className="text-white text-sm font-medium">{fact.value}</p>
                </div>
              </div>
            ))}
            {info.hasFullDetail && (
              <div className="pt-2 border-t border-slate-700">
                <button
                  onClick={() => setShowIPModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 rounded-lg transition-all"
                >
                  <Eye className="w-4 h-4" /> View IP Rights Terms
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* For non-full-detail challenges: show simplified gate + external CTA */}
      {!info.hasFullDetail && (
        <GenericChallengeDetail
          info={info}
          slug={slug!}
          eligibilityPassed={eligibilityPassed}
          onEligibilityComplete={() => setEligibilityPassed(true)}
        />
      )}

      {/* For America Makes (full detail challenge) */}
      {info.hasFullDetail && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Section nav */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 sticky top-6">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide px-2 mb-2">Sections</p>
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left mb-1 ${
                      activeSection === s.id
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Eligibility gate */}
              {!eligibilityPassed && (
                <div>
                  <div className="flex items-center gap-3 mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-amber-300 font-semibold text-sm">Eligibility Verification Required</p>
                      <p className="text-amber-400/80 text-xs mt-0.5">
                        Complete the 9-gate compliance check to access full submission details. False attestation is a federal crime under 18 USC 1001.
                      </p>
                    </div>
                  </div>
                  <EligibilityGateway slug={slug!} onComplete={() => setEligibilityPassed(true)} />
                </div>
              )}

              {eligibilityPassed && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-300 font-medium text-sm">Eligibility check passed. Full challenge details are accessible below.</p>
                </div>
              )}

              {/* Overview */}
              {activeSection === 'overview' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-blue-400" /> Overview</h2>
                  <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                    <p>The 2026 DoD OIB Modernization Challenge is administered by America Makes (NCDMM) under a cooperative agreement with the Air Force Research Laboratory. It targets technologies that will modernize the DoD's Organic Industrial Base — government-owned, government-operated manufacturing and maintenance facilities critical to national security.</p>
                    <p>All submissions must leverage <strong className="text-white">additive manufacturing</strong> and must target one or more of the eight Special Topic Areas (STAs). Projects must target existing OIB manufacturing lines and include a clear integration action plan.</p>
                    <div className="bg-slate-700/40 rounded-xl p-4">
                      <p className="text-white font-semibold mb-2">Award Mechanism Note</p>
                      <p>Awards are <strong className="text-white">subaward agreements</strong> — not prizes, grants, SBIRs, or contracts. NCDMM acts as the pass-through entity under AFRL Cooperative Agreement FA8650-20-2-5700.</p>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeSection === 'eligibility' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-400" /> Eligibility Requirements</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'America Makes Membership (Lead Only)', content: 'Lead proposer must be a member in good standing by March 26, 2026.' },
                      { title: 'SAM.gov Registration', content: 'Active SAM.gov registration with valid CAGE code and UEI required for lead proposer.' },
                      { title: 'Required Industry Partner', content: 'Must include an industry organization capable of DoD system delivery and final demonstration.' },
                      { title: 'America Makes / NCDMM Required', content: 'NCDMM must be a team performer. At minimum, NCDMM performs project management.' },
                      { title: 'Foreign National Prohibition (24 countries)', content: 'Citizens of Afghanistan, Belarus, Burma, Central African Republic, China, Cuba, Cyprus, DR Congo, Eritrea, Ethiopia, Haiti, Iran, Iraq, Lebanon, Libya, Nicaragua, North Korea, Russia, Somalia, South Sudan, Sudan, Syria, Venezuela, Zimbabwe are strictly prohibited.' },
                      { title: 'Unclassified Submissions Only', content: 'All submissions must be unclassified and free of export-controlled data. Controlled info must be identified on the cover page.' },
                    ].map(req => (
                      <div key={req.title} className="border border-slate-700 rounded-xl p-4">
                        <h4 className="text-white font-semibold text-sm mb-1.5">{req.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{req.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeSection === 'topics' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-blue-400" /> Special Topic Areas</h2>
                  <p className="text-slate-400 text-sm mb-5">Submissions must align with one or more STAs. All must leverage additive manufacturing.</p>
                  <div className="space-y-3">
                    {FULL_CHALLENGE_DATA.specialTopicAreas.map((sta, idx) => (
                      <div key={sta.id} className="border border-slate-700 rounded-xl overflow-hidden">
                        <button onClick={() => setExpandedSTA(expandedSTA === sta.id ? null : sta.id)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-blue-400 font-mono text-xs font-bold">STA {idx + 1}</span>
                            <span className="text-white font-medium text-sm">{sta.title}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSTA === sta.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedSTA === sta.id && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <ul className="px-5 pb-4 space-y-1.5">
                                {sta.items.map(item => (
                                  <li key={item} className="flex items-start gap-2 text-slate-300 text-sm">
                                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" /> {item}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeSection === 'submission' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Submission Requirements</h2>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-5">
                    <p className="text-amber-300 text-sm font-semibold mb-1">Portal: {FULL_CHALLENGE_DATA.submissionPortal}</p>
                    <p className="text-amber-400/80 text-sm">Electronic only. Paper, email, fax not accepted. Deadline: April 2, 2026 at 5:00 PM ET. 90-day validity.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {FULL_CHALLENGE_DATA.requiredDocuments.map(doc => (
                      <div key={doc.name} className="border border-slate-700 rounded-xl p-4">
                        <h4 className="text-white font-semibold text-sm mb-1">{doc.name}</h4>
                        <p className="text-slate-400 text-xs mb-1">Format: {doc.format} · Max: {doc.maxPages} page{doc.maxPages > 1 ? 's' : ''}</p>
                        <p className="text-slate-400 text-xs">{doc.description}</p>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-1.5 text-slate-400 text-sm">
                    {['Times New Roman 11pt or Arial 10pt', 'Portrait, 8.5×11in, ≥0.75in margins', 'Sequential page numbering', 'English only'].map(req => (
                      <li key={req} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{req}</li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {activeSection === 'evaluation' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-blue-400" /> Evaluation Criteria</h2>
                  <p className="text-slate-400 text-sm mb-5">Evaluated by DoD employees or DoD support contractors independent of all submitting teams.</p>
                  <div className="space-y-4">
                    {FULL_CHALLENGE_DATA.evaluationCriteria.map(c => (
                      <div key={c.label} className="border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono rounded">{c.weight}</span>
                          <h4 className="text-white font-semibold text-sm">{c.label}</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeSection === 'timeline' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /> Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-700" />
                    <div className="space-y-6">
                      {FULL_CHALLENGE_DATA.deadlines.map((d, idx) => (
                        <div key={d.label} className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${idx === 1 ? 'bg-amber-500/20 border-amber-500/50' : 'bg-slate-800 border-slate-600'}`}>
                            <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-white font-medium text-sm">{d.label}</p>
                            <p className={`text-sm font-mono ${idx === 1 ? 'text-amber-400' : 'text-slate-400'}`}>{d.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}

              {activeSection === 'ip' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" /> IP Rights</h2>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5">
                    <p className="text-blue-300 text-sm font-semibold mb-1">15 USC 3719(j) — Your IP is Protected</p>
                    <p className="text-blue-300/80 text-sm">The Federal Government may NOT require you to waive IP claims as a condition of participation. Article 7 and Article 9 of the subaward agreement are non-negotiable.</p>
                  </div>
                  <div className="space-y-3">
                    {FULL_CHALLENGE_DATA.ipRights.map(item => (
                      <div key={item.title} className="border border-slate-700 rounded-xl p-4">
                        <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {activeSection === 'team' && (
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Team Requirements</h2>
                  <div className="space-y-4">
                    {FULL_CHALLENGE_DATA.teamRoles.map(item => (
                      <div key={item.role} className={`border rounded-xl p-4 ${item.required ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-700'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.required
                            ? <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs rounded font-medium">Required</span>
                            : <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded font-medium">Encouraged</span>
                          }
                          <h4 className="text-white font-semibold text-sm">{item.role}</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* CTA */}
              {eligibilityPassed && (
                <div className="bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-500/20 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-xl mb-2">Ready to Submit?</h3>
                  <p className="text-slate-300 text-sm mb-5">Submit via the America Makes project call portal. Ensure your team includes NCDMM and a qualifying industry partner.</p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://www.americamakes.us/project_calls/2026-dod-oib-challenge/" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                      Submit on America Makes Portal <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => setShowIPModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600 transition-all">
                      <Shield className="w-4 h-4" /> Review IP Terms
                    </button>
                    <a href={FULL_CHALLENGE_DATA.submissionPdfUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600 transition-all">
                      <Download className="w-4 h-4" /> Download Full RFP
                    </a>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> projectcall@americamakes.us</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 90-day proposal validity</span>
                    <span className="flex items-center gap-1"><Flag className="w-3 h-3" /> Subaward signing within 60 days of selection</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FederalChallengeDetailPage;
