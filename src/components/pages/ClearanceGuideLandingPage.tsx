import { Link } from 'react-router-dom';
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  DollarSign,
  Briefcase,
  FileText,
  Lock,
  Eye,
  Zap,
} from 'lucide-react';

// ===========================================
// Security Clearance Guide - Landing Page
// Data from DCSA, ODNI, ClearanceJobs, industry reports (2025-2026)
// ===========================================

const CLEARANCE_LEVELS = [
  {
    level: 'Public Trust',
    description: 'Required for federal positions with access to sensitive but unclassified information. Common for IT, healthcare, and financial roles.',
    timeline: '2-6 months',
    investigation: 'Tier 2 (BI)',
    reinvestigation: '5 years',
    salaryPremium: '+$5-10K',
    commonRoles: ['Federal IT Specialist', 'Healthcare Admin', 'Financial Analyst'],
    color: 'slate',
  },
  {
    level: 'Secret',
    description: 'Access to classified national security information at the Secret level. Required for most defense contractor and federal agency positions.',
    timeline: '2-5 months',
    investigation: 'Tier 3 (NACLC/T3)',
    reinvestigation: '5 years (CE)',
    salaryPremium: '+$8-15K',
    commonRoles: ['Systems Engineer', 'Program Analyst', 'Intelligence Analyst'],
    color: 'blue',
  },
  {
    level: 'Top Secret',
    description: 'Access to national security information classified at the Top Secret level. Requires more extensive background investigation.',
    timeline: '4-8 months',
    investigation: 'Tier 5 (SSBI/T5)',
    reinvestigation: '6 years (CE)',
    salaryPremium: '+$15-30K',
    commonRoles: ['Senior Systems Engineer', 'Cyber Analyst', 'Program Manager'],
    color: 'purple',
  },
  {
    level: 'TS/SCI',
    description: 'Top Secret with Sensitive Compartmented Information access. Required for intelligence community and most classified defense programs.',
    timeline: '6-12 months',
    investigation: 'Tier 5 + SCI adjudication',
    reinvestigation: '5 years (CE)',
    salaryPremium: '+$25-45K',
    commonRoles: ['Intelligence Officer', 'SIGINT Analyst', 'Cyber Operations Specialist'],
    color: 'red',
  },
  {
    level: 'DOE L Clearance',
    description: 'Department of Energy equivalent of Secret. Required for access to classified Restricted Data or Special Nuclear Material at DOE facilities.',
    timeline: '3-6 months',
    investigation: 'Tier 3 equivalent',
    reinvestigation: '5 years (CE)',
    salaryPremium: '+$8-15K',
    commonRoles: ['Nuclear Engineer', 'Lab Technician', 'Safety Analyst'],
    color: 'emerald',
  },
  {
    level: 'DOE Q Clearance',
    description: 'Department of Energy equivalent of Top Secret. Required for access to Top Secret Restricted Data at national laboratories and nuclear facilities.',
    timeline: '6-12 months',
    investigation: 'Tier 5 equivalent',
    reinvestigation: '6 years (CE)',
    salaryPremium: '+$10-20K',
    commonRoles: ['Senior Researcher', 'Weapons Physicist', 'Lab Director'],
    color: 'amber',
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Sponsorship',
    description: 'A government agency or cleared contractor sponsors your clearance through their Facility Security Officer (FSO).',
    icon: Briefcase,
    detail: 'You cannot self-sponsor. Clearance is initiated by an employer for a specific position.',
  },
  {
    step: 2,
    title: 'SF-86 / eApp',
    description: 'Complete the Standard Form 86 (SF-86) electronically through the eApp system. Covers 10 years of history.',
    icon: FileText,
    detail: 'Typically takes 2-4 weeks. Covers residences, employment, education, foreign contacts, finances, and more.',
  },
  {
    step: 3,
    title: 'Investigation',
    description: 'DCSA conducts background investigation including records checks, interviews with references, and field work.',
    icon: Eye,
    detail: 'Timeline varies by clearance level. Continuous evaluation (CE) is replacing periodic reinvestigations under TW 2.0.',
  },
  {
    step: 4,
    title: 'Adjudication',
    description: 'Adjudicator reviews investigation results against the 13 adjudicative guidelines to make a clearance determination.',
    icon: Shield,
    detail: 'The 13 guidelines include: Allegiance, Foreign Influence, Financial, Criminal Conduct, and more.',
  },
  {
    step: 5,
    title: 'Continuous Vetting',
    description: 'Under Trusted Workforce 2.0, all clearance holders undergo continuous automated record checks instead of periodic reinvestigation.',
    icon: Lock,
    detail: 'TW 2.0 phases in 2024-2026. Replaces legacy 5/10-year periodic reinvestigations.',
  },
];

const TW2_UPDATES = [
  'Continuous vetting replaces periodic reinvestigations (phased rollout 2024-2026)',
  'Automated records checks across financial, criminal, and travel databases',
  'Reciprocity between agencies is now mandatory (with exceptions)',
  'e-Application (eApp) replacing the legacy e-QIP system',
  'Tiered investigation model standardizes requirements across agencies',
  'Enrollment in continuous evaluation (CE) required for all clearance holders',
];

const STATS = [
  { label: 'Active Clearance Holders', value: '~4.2M', source: 'ODNI 2025' },
  { label: 'Top Secret Holders', value: '~1.3M', source: 'ODNI' },
  { label: 'Avg Secret Timeline', value: '2-5 months', source: 'DCSA' },
  { label: 'Salary Premium (TS/SCI)', value: '+$25-45K', source: 'ClearanceJobs' },
];

const COLOR_MAP: Record<string, string> = {
  slate: 'border-slate-600 bg-slate-500/10',
  blue: 'border-blue-500/30 bg-blue-500/10',
  purple: 'border-purple-500/30 bg-purple-500/10',
  red: 'border-red-500/30 bg-red-500/10',
  emerald: 'border-emerald-500/30 bg-emerald-500/10',
  amber: 'border-amber-500/30 bg-amber-500/10',
};

const TEXT_COLOR: Record<string, string> = {
  slate: 'text-slate-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  red: 'text-red-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

export default function ClearanceGuideLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield size={24} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold">Security Clearance Guide</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Everything you need to know about obtaining and maintaining U.S. security clearances. Updated for Trusted Workforce 2.0 with current timelines, salary premiums, and process details.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Data from DCSA, ODNI, ClearanceJobs, and industry partners. Updated 2025-2026.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/college/clearance-guide"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Shield size={18} /> Full Clearance Guide
            </Link>
            <Link
              to="/jobs?clearance=true"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
            >
              <Briefcase size={18} /> Cleared Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-600 mt-1">{stat.source}</div>
            </div>
          ))}
        </div>

        {/* Clearance Levels */}
        <h2 className="text-xl font-bold mb-6">Clearance Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CLEARANCE_LEVELS.map((cl) => (
            <div
              key={cl.level}
              className={`bg-slate-900 border rounded-xl p-6 ${COLOR_MAP[cl.color]}`}
            >
              <h3 className={`font-bold text-lg ${TEXT_COLOR[cl.color]}`}>{cl.level}</h3>
              <p className="text-sm text-slate-400 mt-2">{cl.description}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><Clock size={10} /> Timeline</span>
                  <span className="text-white font-medium">{cl.timeline}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><FileText size={10} /> Investigation</span>
                  <span className="text-white font-medium">{cl.investigation}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><DollarSign size={10} /> Salary Premium</span>
                  <span className="text-emerald-400 font-medium">{cl.salaryPremium}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-500 mb-1.5">Common Roles</div>
                <div className="flex flex-wrap gap-1.5">
                  {cl.commonRoles.map((role) => (
                    <span key={role} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-6">The Clearance Process</h2>
          <div className="space-y-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <step.icon size={18} className="text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400 font-medium">Step {step.step}</span>
                    <h4 className="font-semibold">{step.title}</h4>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Workforce 2.0 */}
        <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            Trusted Workforce 2.0 Updates
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            The federal government is overhauling the personnel vetting system. Here's what's changing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TW2_UPDATES.map((update) => (
              <div key={update} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-300">{update}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">Need Clearance Guidance?</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">
            Access our full clearance guide, connect with cleared mentors, or browse positions that sponsor security clearances.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/college/clearance-guide"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Full Clearance Guide
            </Link>
            <Link
              to="/mentorship"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              Clearance Mentors
            </Link>
            <Link
              to="/jobs?clearance=true"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
            >
              Cleared Jobs
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-600 text-center">
          Data sourced from DCSA, ODNI, ClearanceJobs, and federal workforce reports.
        </div>
      </div>
    </div>
  );
}
