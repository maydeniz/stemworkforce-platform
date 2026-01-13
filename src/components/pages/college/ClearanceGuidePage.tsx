// ===========================================
// Security Clearance Guide Page - College Students
// Navigate the clearance process
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Building2,
  Lightbulb,
  XCircle,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface ClearanceLevel {
  id: string;
  name: string;
  shortName: string;
  accessLevel: string;
  timeline: string;
  description: string;
  requiredFor: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

// ===========================================
// SAMPLE DATA
// ===========================================
const CLEARANCE_LEVELS: ClearanceLevel[] = [
  {
    id: 'public-trust',
    name: 'Public Trust',
    shortName: 'PT',
    accessLevel: 'Non-classified sensitive',
    timeline: '2-6 months',
    description: 'Required for access to sensitive but unclassified government systems and data.',
    requiredFor: ['Many federal contractor positions', 'Healthcare IT', 'Financial systems'],
  },
  {
    id: 'confidential',
    name: 'Confidential',
    shortName: 'C',
    accessLevel: 'Lowest classified level',
    timeline: '1-3 months',
    description: 'Access to information that could cause damage to national security if disclosed.',
    requiredFor: ['Entry-level defense positions', 'Some contractor roles'],
  },
  {
    id: 'secret',
    name: 'Secret',
    shortName: 'S',
    accessLevel: 'Mid-level classified',
    timeline: '3-6 months',
    description: 'Access to information that could cause serious damage to national security.',
    requiredFor: ['Most defense contractors', 'NASA', 'DOE positions'],
  },
  {
    id: 'top-secret',
    name: 'Top Secret',
    shortName: 'TS',
    accessLevel: 'Highest standard clearance',
    timeline: '6-12 months',
    description: 'Access to information that could cause exceptionally grave damage to national security.',
    requiredFor: ['Intelligence agencies', 'Senior defense roles', 'Critical infrastructure'],
  },
  {
    id: 'ts-sci',
    name: 'TS/SCI',
    shortName: 'TS/SCI',
    accessLevel: 'Top Secret with compartments',
    timeline: '12-18 months',
    description: 'Top Secret with access to Sensitive Compartmented Information. Additional vetting required.',
    requiredFor: ['NSA', 'CIA', 'NRO', 'Intelligence community'],
  },
  {
    id: 'doe-q',
    name: 'DOE Q Clearance',
    shortName: 'Q',
    accessLevel: 'DOE equivalent of TS',
    timeline: '6-12 months',
    description: 'Department of Energy clearance for access to nuclear weapons design information.',
    requiredFor: ['National labs', 'Nuclear facilities', 'DOE contractors'],
  },
];

const DISQUALIFYING_FACTORS = [
  'Non-US citizenship (for most clearances)',
  'Recent illegal drug use',
  'Criminal record (depends on severity and recency)',
  'Significant foreign contacts or financial interests',
  'Poor credit/significant debt (can be mitigating)',
  'Dishonesty during the investigation',
  'Failure to pay taxes',
  'Mental health issues that affect judgment (rare)',
];

const CLEARANCE_TIMELINE = [
  { step: 1, title: 'Sponsorship', description: 'Employer sponsors you for a clearance', duration: '1-2 weeks' },
  { step: 2, title: 'SF-86 Submission', description: 'Complete the extensive background questionnaire', duration: '2-4 weeks' },
  { step: 3, title: 'Investigation', description: 'DCSA investigates your background', duration: '2-12 months' },
  { step: 4, title: 'Adjudication', description: 'Agency reviews investigation results', duration: '2-8 weeks' },
  { step: 5, title: 'Clearance Granted', description: 'You can begin classified work', duration: 'Immediate' },
];

const FAQS: FAQ[] = [
  {
    question: 'Can I apply for a clearance on my own?',
    answer: 'No. You need a government agency or contractor to sponsor your clearance. They must have a legitimate need for you to access classified information.',
  },
  {
    question: 'Does a clearance expire?',
    answer: 'Yes. Confidential and Secret clearances are reinvestigated every 10 years, and Top Secret every 5 years. However, clearances can be administratively withdrawn when you leave a position.',
  },
  {
    question: 'Will past marijuana use disqualify me?',
    answer: "Not necessarily. Experimental use in college that ended 1+ years ago is often not disqualifying. Recent or ongoing use, or use of harder drugs, is more problematic. Honesty is crucial.",
  },
  {
    question: 'Can international students get clearances?',
    answer: 'Generally no. Most clearances require US citizenship. Some positions requiring only Public Trust may accept permanent residents, but this is rare for classified work.',
  },
  {
    question: 'How far back does the investigation go?',
    answer: 'Typically 7-10 years for most areas. For Secret and above, they may look at your entire adult life for certain issues like foreign contacts or criminal history.',
  },
];

// ===========================================
// COMPONENT
// ===========================================
const ClearanceGuidePage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-slate-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Link to="/college/government-careers" className="hover:underline">Government & Finance</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Security Clearance Guide</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Security Clearance
              <span className="text-blue-400"> Guide</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Understand security clearance levels, requirements, and the application process.
              Essential knowledge for careers in defense, intelligence, and government.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Clearance Levels */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Clearance Levels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLEARANCE_LEVELS.map((level) => (
              <div
                key={level.id}
                onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                className={`bg-gray-900/50 rounded-xl border p-6 cursor-pointer transition-all ${
                  selectedLevel === level.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="px-3 py-1 text-sm font-bold bg-gray-800 text-gray-300 rounded">
                    {level.shortName}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{level.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{level.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    Timeline: {level.timeline}
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock className="w-4 h-4" />
                    {level.accessLevel}
                  </div>
                </div>

                {selectedLevel === level.id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Required For</span>
                    <ul className="mt-2 space-y-1">
                      {level.requiredFor.map((req, j) => (
                        <li key={j} className="text-sm text-gray-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">The Clearance Process</h2>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8">
            <div className="relative">
              {CLEARANCE_TIMELINE.map((step, i) => (
                <div key={i} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    {i < CLEARANCE_TIMELINE.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-700 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <span className="text-sm text-blue-400">{step.duration}</span>
                    </div>
                    <p className="text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Disqualifying Factors */}
          <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              Potential Disqualifying Factors
            </h3>
            <ul className="space-y-3">
              {DISQUALIFYING_FACTORS.map((factor, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Important:</strong> Many factors are mitigating, not automatically disqualifying.
                Honesty is always the best policy. Lying on the SF-86 is a federal crime.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-green-400" />
              Tips for Success
            </h3>
            <ul className="space-y-3">
              {[
                'Be completely honest - lies are discovered and disqualifying',
                'Start gathering reference contact info now',
                'Keep records of addresses and employment history',
                'Minimize new foreign contacts while applying',
                'Pay down debt and stay current on payments',
                'Avoid any drug use starting now',
                'Document everything - dates, addresses, contacts',
                'Respond quickly to investigator requests',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedFaq === i ? 'rotate-90' : ''
                  }`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 to-slate-900/30 rounded-2xl border border-blue-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Cleared Positions?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Browse government and defense contractor positions that may sponsor your clearance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/government-careers"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Government Careers
            </Link>
            <Link
              to="/jobs?clearance=true"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              Cleared Jobs
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceGuidePage;
