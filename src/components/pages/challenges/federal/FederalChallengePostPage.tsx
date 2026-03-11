import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  Shield, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle,
  Building2, Clock, Globe,
  Lock, Award, BookOpen, Flag, Zap, Info, ArrowRight, Star
} from 'lucide-react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AgencyFormData {
  // Step 1: Agency & Authority
  agencyName: string;
  subAgency: string;
  prizeAuthority: string;
  authorityNumber: string;
  contactName: string;
  contactEmail: string;

  // Step 2: Challenge Configuration
  title: string;
  shortDescription: string;
  problemStatement: string;
  classification: string;
  awardMechanism: string;
  awardMin: string;
  awardMax: string;
  techDomains: string[];
  phases: string;

  // Step 3: Eligibility Gates
  requireSamGov: boolean;
  requireFociDisclosure: boolean;
  requireClearance: string;
  excludedCountries: boolean;
  allowIndividuals: boolean;
  allowSmallBusiness: boolean;
  allowUniversities: boolean;
  allowLargeCompanies: boolean;

  // Step 4: IP & Legal
  ipAssignment: string;
  ndaRequired: boolean;
  otaTrack: boolean;
  sbir: boolean;
  congressionalNoticeRequired: boolean;
  fundingConfirmed: boolean;

  // Step 5: Timeline & Submission
  registrationOpen: string;
  submissionDeadline: string;
  judgingPeriodEnd: string;
  announcementDate: string;
  submissionFormat: string[];
  cuiContent: boolean;
}

const INITIAL_FORM: AgencyFormData = {
  agencyName: '', subAgency: '', prizeAuthority: '',
  authorityNumber: '', contactName: '', contactEmail: '',
  title: '', shortDescription: '', problemStatement: '', classification: 'unclassified',
  awardMechanism: 'prize', awardMin: '', awardMax: '', techDomains: [], phases: '1',
  requireSamGov: true,
  requireFociDisclosure: true, requireClearance: 'none', excludedCountries: true,
  allowIndividuals: false, allowSmallBusiness: true, allowUniversities: true, allowLargeCompanies: true,
  ipAssignment: 'solver-retains', ndaRequired: false, otaTrack: false, sbir: false,
  congressionalNoticeRequired: false, fundingConfirmed: false,
  registrationOpen: '', submissionDeadline: '', judgingPeriodEnd: '', announcementDate: '',
  submissionFormat: [], cuiContent: false,
};

const TECH_DOMAIN_OPTIONS = [
  'Advanced Manufacturing', 'AI/ML', 'Robotics', 'Semiconductors', 'Cybersecurity',
  'Aerospace', 'Biotechnology', 'Quantum Computing', 'Clean Energy', 'Nuclear Technologies',
  'Digital Operations', 'Supply Chain', 'Autonomous Systems', 'Sensors/Sensing',
  'Communications', 'Space Technologies', 'Naval Systems', 'Ground Combat Systems',
];

const SUBMISSION_FORMAT_OPTIONS = [
  'Concept Paper (white paper)', 'Technical Proposal (full)', 'Quad Chart',
  'Working Prototype', 'Software Demo', 'Video Pitch', 'Presentation Deck',
  'Code Repository', 'Research Paper', 'Business Plan',
];

// ─────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────

function StepAgencyAuthority({ form, setForm }: { form: AgencyFormData; setForm: React.Dispatch<React.SetStateAction<AgencyFormData>> }) {
  const authorities = [
    { value: '15 USC 3719', label: '15 USC 3719 — America COMPETES Act (civilian agency prize authority)' },
    { value: '10 USC 4025', label: '10 USC 4025 — DOD Prize Competitions (defense agency prize authority)' },
    { value: '10 USC 4022', label: '10 USC 4022 — Other Transaction Authority (OTA prototype)' },
    { value: '15 USC 638', label: '15 USC 638 — SBIR/STTR Act (small business innovation)' },
    { value: 'cooperative-agreement', label: 'Cooperative Agreement / MII Directed Project Call' },
    { value: 'other', label: 'Other (specify in authority number field)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Agency & Legal Authority</h3>
        <p className="text-slate-400 text-sm">
          Establish the legal basis for your challenge. All federal prize competitions must cite a specific statutory authority.
          Prizes exceeding $1M (10 USC 4025) or $50M (15 USC 3719) require additional approval before announcement.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Agency Name *</label>
          <input
            type="text"
            placeholder="e.g., Department of Defense"
            value={form.agencyName}
            onChange={e => setForm(f => ({ ...f, agencyName: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Sub-Agency *</label>
          <input
            type="text"
            placeholder="e.g., DARPA / Microsystems Technology Office"
            value={form.subAgency}
            onChange={e => setForm(f => ({ ...f, subAgency: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Program Manager / POC Name *</label>
          <input
            type="text"
            placeholder="Full name"
            value={form.contactName}
            onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Official Contact Email *</label>
          <input
            type="email"
            placeholder="pm@agency.mil or pm@agency.gov"
            value={form.contactEmail}
            onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
            className={`w-full bg-slate-700 border text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 ${
              form.contactEmail && !/\.(gov|mil)$/i.test(form.contactEmail.split('@')[1] ?? '')
                ? 'border-amber-500/60'
                : 'border-slate-600'
            }`}
          />
          {form.contactEmail && !/\.(gov|mil)$/i.test(form.contactEmail.split('@')[1] ?? '') && (
            <p className="text-amber-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Federal challenges require a .gov or .mil email address.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-1.5 block">Prize / Competition Authority *</label>
        <div className="space-y-2">
          {authorities.map(a => (
            <label key={a.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.prizeAuthority === a.value ? 'bg-blue-500/10 border-blue-500/40' : 'border-slate-700 hover:border-slate-600'}`}>
              <input
                type="radio"
                name="authority"
                value={a.value}
                checked={form.prizeAuthority === a.value}
                onChange={e => setForm(f => ({ ...f, prizeAuthority: e.target.value }))}
                className="mt-0.5 accent-blue-500"
              />
              <span className="text-slate-300 text-sm">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-1.5 block">Authority/Agreement Number</label>
        <input
          type="text"
          placeholder="e.g., FA8650-20-2-5700 or HR001124C0001"
          value={form.authorityNumber}
          onChange={e => setForm(f => ({ ...f, authorityNumber: e.target.value }))}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-amber-300 font-semibold mb-1">Funding Must Be Confirmed Before Announcement</p>
            <p className="text-amber-400/80">Under 15 USC 3719, prizes must be fully funded before a competition is announced. You will be required to confirm funding availability in Step 4.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepChallengeConfig({ form, setForm }: { form: AgencyFormData; setForm: React.Dispatch<React.SetStateAction<AgencyFormData>> }) {
  const classificationOptions = [
    { value: 'unclassified', label: 'UNCLASSIFIED', desc: 'Open participation, public problem statement', color: 'text-emerald-400' },
    { value: 'cui', label: 'CUI', desc: 'Controlled Unclassified Information — access-gated problem statement', color: 'text-amber-400' },
    { value: 'secret', label: 'SECRET', desc: 'Requires SECRET facility clearance for finalist access', color: 'text-red-400' },
  ];

  const mechanismOptions = [
    { value: 'prize', label: 'Prize Competition', desc: 'Cash award under 15 USC 3719 or 10 USC 4025. No government IP claim.' },
    { value: 'subaward', label: 'Subaward Agreement', desc: 'Pass-through funding under a cooperative agreement (e.g., MII project call).' },
    { value: 'ota', label: 'OTA Prototype Path', desc: 'Other Transaction Authority — noncompetitive follow-on potential under 10 USC 4022.' },
    { value: 'sbir-phase2', label: 'SBIR Direct to Phase II', desc: 'Competition serves as Phase I substitute. Winner receives Phase II award.' },
    { value: 'contract', label: 'Follow-On Contract Track', desc: 'Competition establishes competitive basis for sole-source follow-on FAR contract.' },
  ];

  function toggleDomain(domain: string) {
    setForm(f => ({
      ...f,
      techDomains: f.techDomains.includes(domain)
        ? f.techDomains.filter(d => d !== domain)
        : [...f.techDomains, domain],
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Challenge Configuration</h3>
        <p className="text-slate-400 text-sm">Define the challenge scope, classification level, award mechanism, and technology domain focus areas.</p>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-1.5 block">Challenge Title *</label>
        <input
          type="text"
          placeholder="e.g., 2026 DoD OIB Additive Manufacturing Modernization Challenge"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-1.5 block">Short Description (for challenge card) *</label>
        <textarea
          rows={2}
          placeholder="2–3 sentence summary visible in the challenge browse view..."
          value={form.shortDescription}
          onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-1.5 block">Problem Statement *</label>
        <textarea
          rows={5}
          placeholder="Full technical problem statement. Must be UNCLASSIFIED (or mark CUI/SECRET above if controlled)..."
          value={form.problemStatement}
          onChange={e => setForm(f => ({ ...f, problemStatement: e.target.value }))}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">Classification Level *</label>
        <div className="space-y-2">
          {classificationOptions.map(opt => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.classification === opt.value ? 'bg-slate-700/60 border-slate-500' : 'border-slate-700 hover:border-slate-600'}`}>
              <input type="radio" name="classification" value={opt.value} checked={form.classification === opt.value} onChange={e => setForm(f => ({ ...f, classification: e.target.value }))} className="mt-0.5 accent-blue-500" />
              <div>
                <span className={`font-mono font-bold text-sm ${opt.color}`}>{opt.label}</span>
                <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {form.classification === 'cui' && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs">
            CUI challenges require a separate access-controlled submission pathway. Participants must complete eligibility verification before accessing the full problem statement. Platform will route CUI content through gated access only.
          </div>
        )}
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">Award Mechanism *</label>
        <div className="space-y-2">
          {mechanismOptions.map(opt => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.awardMechanism === opt.value ? 'bg-blue-500/10 border-blue-500/40' : 'border-slate-700 hover:border-slate-600'}`}>
              <input type="radio" name="mechanism" value={opt.value} checked={form.awardMechanism === opt.value} onChange={e => setForm(f => ({ ...f, awardMechanism: e.target.value }))} className="mt-0.5 accent-blue-500" />
              <div>
                <span className="text-white font-medium text-sm">{opt.label}</span>
                <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Minimum Award ($)</label>
          <input type="number" placeholder="e.g., 10000000" value={form.awardMin} onChange={e => setForm(f => ({ ...f, awardMin: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Maximum Award ($) *</label>
          <input type="number" placeholder="e.g., 25000000" value={form.awardMax} onChange={e => setForm(f => ({ ...f, awardMax: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-1.5 block">Number of Phases</label>
          <select value={form.phases} onChange={e => setForm(f => ({ ...f, phases: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none">
            {['1', '2', '3', '4', '5'].map(n => <option key={n} value={n}>{n} Phase{n !== '1' ? 's' : ''}</option>)}
          </select>
        </div>
      </div>

      {Number(form.awardMax) >= 10_000_000 && form.prizeAuthority === '10 USC 4025' && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 inline mr-1.5" />
          Awards ≥$10M under 10 USC 4025 require written approval from the Under Secretary of Defense for Research and Engineering (USD R&E) before announcement. Congressional notification required for procurement contract/agreement awards &gt;$10M.
        </div>
      )}

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">Technology Domains (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {TECH_DOMAIN_OPTIONS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.techDomains.includes(d) ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepEligibility({ form, setForm }: { form: AgencyFormData; setForm: React.Dispatch<React.SetStateAction<AgencyFormData>> }) {
  const clearanceLevels = ['none', 'public-trust', 'secret', 'top-secret', 'ts-sci'];

  const Toggle = ({ field, label, desc }: { field: keyof AgencyFormData; label: string; desc?: string }) => (
    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form[field] ? 'bg-blue-500/10 border-blue-500/30' : 'border-slate-700 hover:border-slate-600'}`}>
      <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form[field] ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
        {form[field] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
      </div>
      <input type="checkbox" className="sr-only" checked={!!form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.checked }))} />
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-slate-400 text-xs mt-0.5">{desc}</p>}
      </div>
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Eligibility Gate Configuration</h3>
        <p className="text-slate-400 text-sm">
          Configure the eligibility gates that participants must pass before registering or submitting. Gates are enforced at registration.
          Grayed-out mandatory gates cannot be disabled as they reflect federal statutory requirements.
        </p>
      </div>

      <div>
        <p className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-400" /> Mandatory Gates (federal statute — cannot be disabled)
        </p>
        <div className="space-y-2 opacity-70 pointer-events-none">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">U.S. Citizenship / Permanent Residency (Individual)</p>
              <p className="text-slate-400 text-xs">Required: 15 USC 3719(g)(2) — individuals must be U.S. citizens or permanent residents to win prizes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">U.S. Incorporation + Primary Place of Business (Entity)</p>
              <p className="text-slate-400 text-xs">Required: 15 USC 3719(g)(3) — entities must be U.S.-incorporated with primary U.S. operations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Federal Employee Exclusion</p>
              <p className="text-slate-400 text-xs">Required: 15 USC 3719(g)(4) — federal employees participating within scope of employment are ineligible to win.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Export Control Attestation (ITAR / EAR)</p>
              <p className="text-slate-400 text-xs">All submissions: 22 CFR §120-130 / 15 CFR §730-774 — participants must certify no export-controlled data in submissions.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
          <Flag className="w-4 h-4 text-amber-400" /> Configurable Eligibility Gates
        </p>
        <div className="space-y-2">
          <Toggle field="requireSamGov" label="SAM.gov Registration Required for Award" desc="Participants must have (or obtain) active SAM.gov registration + CAGE code before prize disbursement. Required: FAR Subpart 4.11." />
          <Toggle field="requireFociDisclosure" label="FOCI Disclosure Required" desc="Participants must disclose foreign ownership, control, or influence. Recommended for any challenge involving dual-use technology or classified-adjacent work." />
          <Toggle field="excludedCountries" label="ITAR Country Exclusion List" desc="Apply standard ITAR §126.1 country restrictions. Citizens of embargoed/sanctioned countries are ineligible. Strongly recommended for all defense challenges." />
          <Toggle field="allowIndividuals" label="Allow Individual Participants (no entity required)" desc="If disabled, lead participant must be an organizational entity. Note: most DOD challenges require an industry or institutional lead." />
          <Toggle field="allowSmallBusiness" label="Small Business Eligible" desc="≤500 employees (including affiliates). Enable for SBIR-track challenges." />
          <Toggle field="allowUniversities" label="Universities / Research Institutions Eligible" desc="Academic institutions may participate as lead or team member." />
          <Toggle field="allowLargeCompanies" label="Large Companies Eligible" desc="No employee size restriction. If disabled, restrict to small businesses only." />
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">
          Security Clearance Requirement
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {clearanceLevels.map(level => (
            <label key={level} className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${form.requireClearance === level ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
              <input type="radio" name="clearance" value={level} checked={form.requireClearance === level} onChange={e => setForm(f => ({ ...f, requireClearance: e.target.value }))} className="sr-only" />
              <span className="text-xs font-medium capitalize">{level === 'none' ? 'None' : level === 'ts-sci' ? 'TS/SCI' : level.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            </label>
          ))}
        </div>
        {form.requireClearance !== 'none' && (
          <p className="text-amber-400 text-xs mt-2">
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
            Clearance requirements dramatically reduce the eligible participant pool. Platform will route these challenges to the cleared-access pathway and require DCSA/DISS verification.
          </p>
        )}
      </div>
    </div>
  );
}

function StepIPLegal({ form, setForm }: { form: AgencyFormData; setForm: React.Dispatch<React.SetStateAction<AgencyFormData>> }) {
  const ipOptions = [
    { value: 'solver-retains', label: 'Solver Retains All IP', desc: 'Default under 15 USC 3719(j). Recommended. Government cannot claim IP without written consent.' },
    { value: 'negotiated-license', label: 'Government License Negotiated Post-Competition', desc: 'Government will negotiate a non-exclusive license with the winner after award. Cannot be compelled as a condition of participation.' },
    { value: 'shared', label: 'Jointly Developed IP (shared)', desc: 'IP developed jointly under a subaward or cooperative agreement. Requires separate CDIP agreement.' },
    { value: 'government-unlimited', label: 'Government Unlimited Rights (GUR)', desc: 'Applicable when government funded 100% of development cost. Requires DFARS 252.227-7013 compliance on follow-on contracts.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">IP Rights & Legal Configuration</h3>
        <p className="text-slate-400 text-sm">
          Configure intellectual property terms, NDA requirements, and transition pathway options.
          IP terms are governed by 15 USC 3719(j) — you may not compel IP assignment as a condition of participation.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-300 font-semibold mb-1">Statutory IP Protection — 15 USC 3719(j)</p>
            <p className="text-blue-300/80">
              The Federal Government may not gain an interest in intellectual property developed by a participant without the participant's written consent.
              The agency may not require participants to waive IP claims as a condition of competing or winning.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">IP Assignment Framework *</label>
        <div className="space-y-2">
          {ipOptions.map(opt => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.ipAssignment === opt.value ? 'bg-blue-500/10 border-blue-500/40' : 'border-slate-700 hover:border-slate-600'}`}>
              <input type="radio" name="ipAssignment" value={opt.value} checked={form.ipAssignment === opt.value} onChange={e => setForm(f => ({ ...f, ipAssignment: e.target.value }))} className="mt-0.5 accent-blue-500" />
              <div>
                <p className="text-white text-sm font-medium">{opt.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-slate-300 text-sm font-semibold">Transition & Compliance Flags</p>
        {[
          { field: 'ndaRequired' as keyof AgencyFormData, label: 'NDA Required for Problem Statement Access', desc: 'Participants must sign a non-disclosure agreement before receiving the full problem statement. Recommended for CUI content.' },
          { field: 'otaTrack' as keyof AgencyFormData, label: 'OTA Prototype Track (10 USC 4022)', desc: 'This competition establishes competitive basis for a noncompetitive follow-on OTA Prototype award. Must be declared in the original announcement.' },
          { field: 'sbir' as keyof AgencyFormData, label: 'SBIR/STTR Track', desc: 'Competition constitutes an SBIR Phase I substitute. Winner receives direct Phase II award. Requires SBIR eligibility (≤500 employees, majority U.S. ownership).' },
          { field: 'congressionalNoticeRequired' as keyof AgencyFormData, label: 'Congressional Notification Required (>$10M DOD award)', desc: 'Under 10 USC 4025(c), procurement contract/agreement awards >$10M require 15-day advance congressional notice before signing.' },
          { field: 'fundingConfirmed' as keyof AgencyFormData, label: '✓ I confirm that prize funding is fully committed before announcement', desc: 'Required: 15 USC 3719. Prizes must be fully funded before public announcement. Uncertified challenges will not be published.' },
        ].map(item => (
          <label key={item.field} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form[item.field] ? 'bg-blue-500/10 border-blue-500/30' : 'border-slate-700 hover:border-slate-600'}`}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form[item.field] ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
              {form[item.field] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <input type="checkbox" className="sr-only" checked={!!form[item.field]} onChange={e => setForm(f => ({ ...f, [item.field]: e.target.checked }))} />
            <div>
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepTimeline({ form, setForm }: { form: AgencyFormData; setForm: React.Dispatch<React.SetStateAction<AgencyFormData>> }) {
  function toggleFormat(f: string) {
    setForm(prev => ({
      ...prev,
      submissionFormat: prev.submissionFormat.includes(f)
        ? prev.submissionFormat.filter(x => x !== f)
        : [...prev.submissionFormat, f],
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Timeline & Submission Format</h3>
        <p className="text-slate-400 text-sm">Set all key dates and configure what participants must submit. Ensure sufficient time for SAM.gov registration processing (2–6 weeks) before award.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { field: 'registrationOpen' as keyof AgencyFormData, label: 'Registration Opens' },
          { field: 'submissionDeadline' as keyof AgencyFormData, label: 'Submission Deadline *' },
          { field: 'judgingPeriodEnd' as keyof AgencyFormData, label: 'Judging Period Ends' },
          { field: 'announcementDate' as keyof AgencyFormData, label: 'Winners Announced' },
        ].map(item => (
          <div key={item.field}>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block">{item.label}</label>
            <input
              type="date"
              value={form[item.field] as string}
              onChange={e => setForm(f => ({ ...f, [item.field]: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="text-slate-300 text-sm font-medium mb-2 block">Required Submission Formats (select all)</label>
        <div className="flex flex-wrap gap-2">
          {SUBMISSION_FORMAT_OPTIONS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFormat(f)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.submissionFormat.includes(f) ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.cuiContent ? 'bg-amber-500/10 border-amber-500/30' : 'border-slate-700 hover:border-slate-600'}`}>
          <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.cuiContent ? 'bg-amber-500 border-amber-500' : 'border-slate-500'}`}>
            {form.cuiContent && <CheckCircle className="w-3.5 h-3.5 text-white" />}
          </div>
          <input type="checkbox" className="sr-only" checked={form.cuiContent} onChange={e => setForm(f => ({ ...f, cuiContent: e.target.checked }))} />
          <div>
            <p className="text-white text-sm font-medium">Problem statement contains CUI (Controlled Unclassified Information)</p>
            <p className="text-slate-400 text-xs mt-0.5">Platform will enable gated CUI access pathway. Participants must complete eligibility verification and sign a Data Handling Agreement (DHA) before accessing the full problem statement. Submissions stored in access-controlled environment per NIST SP 800-171.</p>
          </div>
        </label>
      </div>

      <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-4">
        <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><Info className="w-4 h-4 text-blue-400" /> SAM.gov Timing Guidance</h4>
        <ul className="space-y-1.5 text-slate-400 text-sm">
          <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />Winners need active SAM.gov registration to receive payment. First-time registrations take 2–6 weeks.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />Build a 6-week buffer between winner announcement and payment date.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />Platform supports "SAM pending" conditional award status while registration processes.</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

const STEPS = [
  { id: 'authority', label: 'Agency & Authority', icon: Building2 },
  { id: 'config', label: 'Challenge Config', icon: Zap },
  { id: 'eligibility', label: 'Eligibility Gates', icon: CheckCircle },
  { id: 'legal', label: 'IP & Legal', icon: Shield },
  { id: 'timeline', label: 'Timeline & Submission', icon: Clock },
];

const DRAFT_KEY = 'federal-challenge-post-draft';

function validateForm(form: AgencyFormData): string[] {
  const errors: string[] = [];

  // Step 1: Agency & Authority
  if (!form.agencyName.trim()) errors.push('Agency name is required.');
  if (!form.prizeAuthority.trim()) errors.push('Prize authority is required (e.g., 15 USC 3719).');
  if (!form.contactName.trim()) errors.push('Contact name is required.');
  if (!form.contactEmail.trim()) errors.push('Contact email is required.');
  else if (!/\.(gov|mil)$/i.test(form.contactEmail.split('@')[1] ?? ''))
    errors.push('Contact email must be a .gov or .mil address.');

  // Step 2: Award amounts
  if (!form.awardMax.trim()) errors.push('Maximum award amount is required.');
  else {
    const max = parseInt(form.awardMax, 10);
    if (isNaN(max) || max <= 0) errors.push('Maximum award must be a positive number.');
    else if (form.awardMin.trim()) {
      const min = parseInt(form.awardMin, 10);
      if (!isNaN(min) && min > max) errors.push('Minimum award cannot exceed maximum award.');
    }
  }
  if (!form.title.trim()) errors.push('Challenge title is required.');

  // Step 5: Timeline ordering
  if (!form.submissionDeadline) {
    errors.push('Submission deadline is required.');
  } else {
    if (form.registrationOpen && form.registrationOpen > form.submissionDeadline)
      errors.push('Registration open date must be before the submission deadline.');
    if (form.judgingPeriodEnd && form.judgingPeriodEnd < form.submissionDeadline)
      errors.push('Judging period end must be on or after the submission deadline.');
    if (form.announcementDate && form.judgingPeriodEnd && form.announcementDate < form.judgingPeriodEnd)
      errors.push('Announcement date must be on or after the judging period end.');
  }

  // Step 4: Legal
  if (!form.fundingConfirmed) errors.push('Funding must be confirmed before submission (15 USC 3719).');

  return errors;
}

const FederalChallengePostPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<AgencyFormData>(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      return stored ? { ...INITIAL_FORM, ...JSON.parse(stored) } : INITIAL_FORM;
    } catch { return INITIAL_FORM; }
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced draft autosave
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* noop */ }
    }, 800);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [form]);

  function next() { setValidationErrors([]); setCurrentStep(s => Math.min(STEPS.length - 1, s + 1)); }
  function back() { setValidationErrors([]); setCurrentStep(s => Math.max(0, s - 1)); }

  async function handleSubmit() {
    const errors = validateForm(form);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    setValidationErrors([]);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('federal_challenges').insert({
        slug: '',  // trigger auto-generates from title
        agency_name:            form.agencyName,
        sub_agency:             form.subAgency,
        contact_name:           form.contactName,
        contact_email:          form.contactEmail,
        prize_authority:        form.prizeAuthority,
        authority_number:       form.authorityNumber,
        title:                  form.title,
        short_description:      form.shortDescription,
        problem_statement:      form.problemStatement,
        classification:         form.classification,
        award_mechanism:        form.awardMechanism,
        award_min:              form.awardMin ? parseInt(form.awardMin, 10) : 0,
        award_max:              parseInt(form.awardMax, 10),
        tech_domains:           form.techDomains,
        phases:                 parseInt(form.phases, 10),
        require_sam_gov:        form.requireSamGov,
        require_foci_disclosure: form.requireFociDisclosure,
        require_clearance:      form.requireClearance,
        excluded_countries:     form.excludedCountries,
        allow_individuals:      form.allowIndividuals,
        allow_small_business:   form.allowSmallBusiness,
        allow_universities:     form.allowUniversities,
        allow_large_companies:  form.allowLargeCompanies,
        ip_assignment:          form.ipAssignment,
        nda_required:           form.ndaRequired,
        ota_track:              form.otaTrack,
        sbir:                   form.sbir,
        congressional_notice_req: form.congressionalNoticeRequired,
        funding_confirmed:      form.fundingConfirmed,
        registration_open:      form.registrationOpen || null,
        submission_deadline:    form.submissionDeadline,
        judging_period_end:     form.judgingPeriodEnd || null,
        announcement_date:      form.announcementDate || null,
        submission_format:      form.submissionFormat,
        cui_content:            form.cuiContent,
        status:                 'pending_review',
        submitted_by:           user?.id ?? null,
      });

      if (error) {
        // Map common Supabase error codes to human-readable messages
        const msg =
          error.code === '42501' ? 'Permission denied. You must be signed in to submit a federal challenge.' :
          error.code === '23505' ? 'A challenge with this title already exists. Please use a different title.' :
          error.code === '23514' ? `A field value is invalid: ${error.message}` :
          `Submission failed: ${error.message}`;
        setValidationErrors([msg]);
        console.error('Supabase insert error:', error.code, error.message, error.details);
        return;
      }

      try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error. Please check your connection and try again.';
      setValidationErrors([`Submission failed: ${msg}`]);
      console.error('handleSubmit error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Challenge Submitted for Review</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Your federal challenge has been submitted and is under platform review for compliance with applicable statutory requirements.
            You will receive confirmation within 2 business days at <span className="text-blue-400">{form.contactEmail || 'your contact email'}</span>.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 text-left">
            <p className="text-slate-300 font-semibold text-sm mb-3">What happens next:</p>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Platform compliance review (2 business days)', 'Funding confirmation verification', 'Classification and CUI pathway setup (if applicable)', 'Challenge.gov cross-posting coordination', 'Challenge goes live and eligibility gates activate'].map(s => (
                <li key={s} className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />{s}</li>
              ))}
            </ul>
          </div>
          <Link to="/challenges/federal" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
            <ArrowRight className="w-4 h-4" /> Back to Federal Challenges
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/challenges/federal" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Federal Challenges
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/15 border border-blue-500/30 rounded-xl">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Post a Federal Challenge</h1>
                <p className="text-slate-400 text-sm">For DOD, federal agencies, and authorized MII program offices</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs hidden sm:flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-500" /> Draft auto-saved
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step nav */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 sticky top-6">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(idx)}
                  disabled={submitting}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left mb-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                    currentStep === idx
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : idx < currentStep
                      ? 'text-emerald-400 hover:bg-slate-700/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  {idx < currentStep
                    ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    : <s.icon className="w-4 h-4 flex-shrink-0" />
                  }
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-1.5 text-slate-300 font-medium"><Star className="w-3.5 h-3.5 text-amber-400" /> Platform features</p>
              {['FedRAMP-ready infrastructure', 'CUI-capable submission pathway', 'ITAR/EAR screening built-in', 'SAM.gov / CAGE API verification', 'Challenge.gov cross-posting', 'Evaluator NDA + audit logs'].map(f => (
                <p key={f} className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />{f}</p>
              ))}
            </div>
          </div>

          {/* Form area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6"
              >
                {currentStep === 0 && <StepAgencyAuthority form={form} setForm={setForm} />}
                {currentStep === 1 && <StepChallengeConfig form={form} setForm={setForm} />}
                {currentStep === 2 && <StepEligibility form={form} setForm={setForm} />}
                {currentStep === 3 && <StepIPLegal form={form} setForm={setForm} />}
                {currentStep === 4 && <StepTimeline form={form} setForm={setForm} />}
              </motion.div>
            </AnimatePresence>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-semibold text-sm mb-2">Please fix the following before submitting:</p>
                    <ul className="space-y-1">
                      {validationErrors.map(e => (
                        <li key={e} className="text-red-300/80 text-xs flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={back}
                disabled={currentStep === 0 || submitting}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2">
                {STEPS.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'bg-blue-500 w-4' : idx < currentStep ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                ))}
              </div>
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm font-medium"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Globe className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  {submitting ? 'Submitting…' : 'Submit for Review'}
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 justify-center">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted at rest and in transit</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Reviewed by platform compliance team</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Published upon approval within 2 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederalChallengePostPage;
