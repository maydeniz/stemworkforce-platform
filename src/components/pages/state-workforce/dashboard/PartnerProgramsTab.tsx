// ===========================================
// Partner Program Integration Tab
// TANF · SNAP E&T · Vocational Rehabilitation · RESEA · TAA
// WIOA Partner Program Coordination (Title I-IV)
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  Heart,
  Briefcase,
  GraduationCap,
  Building2,
  Target,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

interface PartnerProgram {
  id: string;
  name: string;
  acronym: string;
  adminAgency: string;
  authoritySection: string;
  color: string;
  icon: React.ElementType;
  participantsActive: number;
  participantsCoEnrolled: number;
  referralsReceived: number;
  referralsSent: number;
  moaStatus: 'signed' | 'expired' | 'pending' | 'not_required';
  moaExpiryDate?: string;
  dataExchangeActive: boolean;
  fundingType: 'formula' | 'discretionary' | 'entitlement';
  annualBudget?: string;
  keyServices: string[];
  coordinationNotes: string;
}

interface CoEnrollmentFlow {
  from: string;
  to: string;
  count: number;
  topService: string;
}

// ===========================================
// SAMPLE DATA
// Based on WIOA Section 121 mandatory/optional partners
// ===========================================

const PARTNER_PROGRAMS: PartnerProgram[] = [
  {
    id: 'tanf',
    name: 'Temporary Assistance for Needy Families',
    acronym: 'TANF',
    adminAgency: 'TX Health & Human Services',
    authoritySection: 'Social Security Act Title IV-A',
    color: '#3b82f6',
    icon: Heart,
    participantsActive: 1240,
    participantsCoEnrolled: 487,
    referralsReceived: 312,
    referralsSent: 189,
    moaStatus: 'signed',
    moaExpiryDate: '2026-09-30',
    dataExchangeActive: true,
    fundingType: 'formula',
    annualBudget: '$8.2M state share',
    keyServices: ['Cash assistance', 'Work activities', 'Childcare subsidies', 'Transportation assistance'],
    coordinationNotes: 'Co-location at 3 comprehensive AJCs. Joint work activity tracking via TWC data system.',
  },
  {
    id: 'snap_et',
    name: 'SNAP Employment & Training',
    acronym: 'SNAP E&T',
    adminAgency: 'TX Health & Human Services',
    authoritySection: 'Food and Nutrition Act, Sec. 6(d)',
    color: '#22c55e',
    icon: Target,
    participantsActive: 876,
    participantsCoEnrolled: 342,
    referralsReceived: 425,
    referralsSent: 218,
    moaStatus: 'signed',
    moaExpiryDate: '2025-09-30',
    dataExchangeActive: true,
    fundingType: 'entitlement',
    annualBudget: '$3.4M',
    keyServices: ['Job search assistance', 'Skills training', 'Work experience', 'Supportive services'],
    coordinationNotes: '50/50 reimbursement model active. ABAWD tracking integrated. 3rd-party provider contracts shared.',
  },
  {
    id: 'vr',
    name: 'Vocational Rehabilitation',
    acronym: 'TX VR',
    adminAgency: 'TX Workforce Commission — VR Division',
    authoritySection: 'Rehabilitation Act Title I',
    color: '#a855f7',
    icon: Users,
    participantsActive: 634,
    participantsCoEnrolled: 298,
    referralsReceived: 187,
    referralsSent: 312,
    moaStatus: 'signed',
    moaExpiryDate: '2026-03-31',
    dataExchangeActive: true,
    fundingType: 'formula',
    annualBudget: '$12.1M (78.7% federal)',
    keyServices: ['Vocational evaluation', 'Counseling & guidance', 'Training', 'Job placement', 'AT & accommodations'],
    coordinationNotes: 'Integrated case management pilot at 2 locations. Cross-training completed for 38 AJC staff.',
  },
  {
    id: 'adult_ed',
    name: 'Adult Education & Literacy',
    acronym: 'AEL / Title II',
    adminAgency: 'TX Education Agency',
    authoritySection: 'WIOA Title II',
    color: '#f59e0b',
    icon: GraduationCap,
    participantsActive: 2180,
    participantsCoEnrolled: 678,
    referralsReceived: 521,
    referralsSent: 389,
    moaStatus: 'signed',
    moaExpiryDate: '2025-08-31',
    dataExchangeActive: true,
    fundingType: 'formula',
    annualBudget: '$6.8M',
    keyServices: ['ABE/HSE preparation', 'English language acquisition', 'Digital literacy', 'Integrated education & training'],
    coordinationNotes: 'IET programs operational at 4 AJC locations. Credential attainment data shared quarterly.',
  },
  {
    id: 'wagner_peyser',
    name: 'Wagner-Peyser Act Employment Services',
    acronym: 'Wagner-Peyser / Title III',
    adminAgency: 'Texas Workforce Commission',
    authoritySection: 'Wagner-Peyser Act / WIOA Title III',
    color: '#06b6d4',
    icon: Briefcase,
    participantsActive: 18400,
    participantsCoEnrolled: 3240,
    referralsReceived: 2890,
    referralsSent: 1240,
    moaStatus: 'not_required',
    dataExchangeActive: true,
    fundingType: 'formula',
    annualBudget: '$4.5M',
    keyServices: ['Labor exchange', 'Job matching', 'LMI services', 'Migrant & seasonal farmworker services'],
    coordinationNotes: 'Fully co-located per WIOA Section 121. Unified registration via common intake. ES staff cross-trained on WIOA.',
  },
  {
    id: 'taa',
    name: 'Trade Adjustment Assistance',
    acronym: 'TAA',
    adminAgency: 'DOL — Employment & Training Administration',
    authoritySection: 'Trade Act of 1974',
    color: '#ef4444',
    icon: Building2,
    participantsActive: 287,
    participantsCoEnrolled: 215,
    referralsReceived: 312,
    referralsSent: 45,
    moaStatus: 'signed',
    moaExpiryDate: '2025-12-31',
    dataExchangeActive: false,
    fundingType: 'formula',
    annualBudget: '$2.1M',
    keyServices: ['TAA training (OJT/classroom)', 'Trade Readjustment Allowances (TRA)', 'ATAA wage subsidy', 'Job search allowances'],
    coordinationNotes: 'Data exchange not yet automated — manual reporting. DOL Phase 2 integration planned Q3 2025.',
  },
  {
    id: 'resea',
    name: 'Reemployment Services & Eligibility Assessment',
    acronym: 'RESEA',
    adminAgency: 'Texas Workforce Commission',
    authoritySection: 'SSA Sec. 306 / WIOA Sec. 306',
    color: '#8b5cf6',
    icon: BarChart3,
    participantsActive: 892,
    participantsCoEnrolled: 634,
    referralsReceived: 1240,
    referralsSent: 89,
    moaStatus: 'not_required',
    dataExchangeActive: true,
    fundingType: 'formula',
    annualBudget: '$1.8M',
    keyServices: ['Eligibility review', 'Labor market assessment', 'Referral to WIOA services', 'Job search workshops'],
    coordinationNotes: 'Mandatory referral from UI to RESEA at week 3. Automated referral queue active. 94% show rate.',
  },
];

const CO_ENROLLMENT_FLOWS: CoEnrollmentFlow[] = [
  { from: 'TANF', to: 'WIOA Title I', count: 487, topService: 'Occupational training' },
  { from: 'SNAP E&T', to: 'WIOA Title I', count: 342, topService: 'Work experience' },
  { from: 'VR', to: 'WIOA Title I', count: 298, topService: 'Job placement' },
  { from: 'RESEA', to: 'WIOA Title I', count: 634, topService: 'Career counseling' },
  { from: 'Adult Ed', to: 'WIOA Title I', count: 245, topService: 'IET programs' },
  { from: 'Wagner-Peyser', to: 'WIOA Title I', count: 1890, topService: 'Job matching' },
];

// ===========================================
// HELPER COMPONENTS
// ===========================================

const MOABadge: React.FC<{ status: PartnerProgram['moaStatus']; expiry?: string }> = ({ status, expiry }) => {
  const map: Record<PartnerProgram['moaStatus'], { label: string; cls: string }> = {
    signed: { label: 'MOA Signed', cls: 'bg-emerald-500/20 text-emerald-400' },
    expired: { label: 'MOA Expired', cls: 'bg-red-500/20 text-red-400' },
    pending: { label: 'MOA Pending', cls: 'bg-amber-500/20 text-amber-400' },
    not_required: { label: 'Co-Located / Not Required', cls: 'bg-blue-500/20 text-blue-400' },
  };
  const { label, cls } = map[status];
  const isExpiringSoon = expiry && new Date(expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
      {isExpiringSoon && (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
          Expires {expiry}
        </span>
      )}
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================

const PartnerProgramsTab: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'programs' | 'co_enrollment'>('programs');

  const totalCoEnrolled = PARTNER_PROGRAMS.reduce((s, p) => s + p.participantsCoEnrolled, 0);
  const totalActive = PARTNER_PROGRAMS.reduce((s, p) => s + p.participantsActive, 0);
  const moaAlerts = PARTNER_PROGRAMS.filter(p =>
    p.moaStatus === 'expired' || p.moaStatus === 'pending' ||
    (p.moaExpiryDate && new Date(p.moaExpiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Partner Program Integration</h2>
          <p className="text-sm text-gray-400 mt-1">
            WIOA Section 121 mandatory and optional partner coordination · MOA management · Co-enrollment tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* MOA Alert */}
      {moaAlerts > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-medium text-sm">{moaAlerts} MOA(s) require attention</p>
            <p className="text-amber-400/70 text-xs mt-1">
              One or more partner MOAs are expired, pending, or expiring within 90 days.
              Review and renew to maintain WIOA Section 121 compliance.
            </p>
          </div>
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Partner Participants', value: totalActive.toLocaleString(), color: '#3b82f6' },
          { icon: ArrowRight, label: 'Co-Enrolled (WIOA + Partner)', value: totalCoEnrolled.toLocaleString(), color: '#22c55e' },
          { icon: FileText, label: 'Active MOAs', value: PARTNER_PROGRAMS.filter(p => p.moaStatus === 'signed' || p.moaStatus === 'not_required').length, color: '#a855f7' },
          { icon: AlertTriangle, label: 'MOA Alerts', value: moaAlerts, color: moaAlerts > 0 ? '#f59e0b' : '#22c55e' },
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
        {(['programs', 'co_enrollment'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {v === 'programs' ? 'Partner Programs' : 'Co-Enrollment Flows'}
          </button>
        ))}
      </div>

      {/* Programs view */}
      {view === 'programs' && (
        <div className="space-y-3">
          {PARTNER_PROGRAMS.map(program => {
            const Icon = program.icon;
            const isExpanded = expandedId === program.id;
            return (
              <motion.div
                key={program.id}
                layout
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
              >
                {/* Collapsed header */}
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpandedId(isExpanded ? null : program.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${program.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: program.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-white font-semibold">{program.acronym}</p>
                          <span className="text-gray-500 text-xs">—</span>
                          <p className="text-gray-300 text-sm truncate">{program.name}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <MOABadge status={program.moaStatus} expiry={program.moaExpiryDate} />
                          {program.dataExchangeActive
                            ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3 h-3" /> Data Exchange Active</span>
                            : <span className="flex items-center gap-1 text-xs text-amber-400"><AlertTriangle className="w-3 h-3" /> Manual Data Entry</span>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-white font-semibold">{program.participantsActive.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Active participants</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-emerald-400 font-semibold">{program.participantsCoEnrolled.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Co-enrolled</p>
                      </div>
                      <div className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</div>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 pb-5 border-t border-gray-800"
                  >
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left column */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Administering Agency</p>
                          <p className="text-gray-200 text-sm">{program.adminAgency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Legal Authority</p>
                          <p className="text-gray-200 text-sm">{program.authoritySection}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Key Services</p>
                          <div className="flex flex-wrap gap-1.5">
                            {program.keyServices.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{s}</span>
                            ))}
                          </div>
                        </div>
                        {program.annualBudget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Annual Budget</p>
                              <p className="text-gray-200 text-sm">{program.annualBudget}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right column */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Referrals Received', value: program.referralsReceived, color: '#3b82f6' },
                            { label: 'Referrals Sent', value: program.referralsSent, color: '#22c55e' },
                            { label: 'Co-Enrolled', value: program.participantsCoEnrolled, color: '#a855f7' },
                            { label: 'Co-enroll Rate', value: `${Math.round((program.participantsCoEnrolled / program.participantsActive) * 100)}%`, color: '#f59e0b' },
                          ].map(kpi => (
                            <div key={kpi.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
                              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value.toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">Coordination Notes</p>
                          <p className="text-gray-300 text-xs leading-relaxed">{program.coordinationNotes}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Co-enrollment flows view */}
      {view === 'co_enrollment' && (
        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Co-Enrollment Flow into WIOA Title I</h3>
            <div className="space-y-3">
              {CO_ENROLLMENT_FLOWS.sort((a, b) => b.count - a.count).map((flow, i) => {
                const maxCount = Math.max(...CO_ENROLLMENT_FLOWS.map(f => f.count));
                const pct = Math.round((flow.count / maxCount) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-28 text-right">{flow.from}</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <div className="flex-1 bg-gray-800 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{flow.count.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs w-24 truncate">{flow.topService}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total co-enrolled in WIOA Title I:</span>
              <span className="text-white font-bold text-lg">{CO_ENROLLMENT_FLOWS.reduce((s, f) => s + f.count, 0).toLocaleString()}</span>
            </div>
          </div>

          {/* WIOA 121 Compliance status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              WIOA Section 121 One-Stop Partner Compliance
            </h3>
            <div className="space-y-2">
              {[
                { item: 'Memoranda of Understanding (MOU) executed with all mandatory partners', status: true },
                { item: 'Resource sharing cost allocation agreed and documented', status: true },
                { item: 'Infrastructure Funding Agreement (IFA) or Local Funding Mechanism (LFM) in place', status: true },
                { item: 'Data sharing agreements with all partners for co-enrolled participants', status: false },
                { item: 'Unified service delivery model documented in local plan', status: true },
                { item: 'Partner participation in AJC governance and oversight', status: true },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-800 last:border-0">
                  {row.status
                    ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  }
                  <span className={`text-sm ${row.status ? 'text-gray-300' : 'text-amber-200'}`}>{row.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerProgramsTab;
